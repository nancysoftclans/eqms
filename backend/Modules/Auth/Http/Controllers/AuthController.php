<?php

namespace Modules\Auth\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    public function login(Request $req)
    {
        //authenticate
         $credentials = $req->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
         //get user details
         $email = $req->email;
         $password = $req->password;
         $user = User::where('email',$req->email)->first();

         //log unknown user attemps
         if (is_null($user) || $user == null || empty($user) || (!$user->exists())) {
            $attemptLoginParams = array(
                'email' => $email,
                'password' => $password,
                'ip_address' => request()->ip(),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'time' => Carbon::now(),//date('Y-m-d H:i:s'),
                'attempt_status' => 1//date('Y-m-d H:i:s')
            );
            // dd($attemptLoginParams);
            insertRecord('tra_login_attempts', $attemptLoginParams, 1);
            $res = array(
                'success' => false,
                'message' => 'Authentication Failed...User or Password Mismatch!!'
            );
             return response()->json($res);
         }
         //check if account is blocked
        $check = DB::table('tra_blocked_accounts')->where('account_id', $user->id)->count();
        if($check > 0){
            $res = array(
                'success' => false,
                'message' => 'Your account has been blocked...Please contact system Admin/ICT!!'
            );
             return response()->json($res);
        }
         //register for web
         $credentials = array(
            'email' => $email,
            'password' => hashPwd($req->email, $user->uuid, $req->password)
         );
        //  dd($credentials);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $http = new \GuzzleHttp\Client();
            //clear or rather update the attempt count to 0
            $update = array(
                'attempt_status' => 2
            );
            $where = array('account_id'=>$user->id);
           updateRecord('tra_failed_login_attempts', $where, $update, 1);
           
            //register with passport authenticator for access token
            $response = $http->post(url('/').'/oauth/token', [
                'form_params' => [
                    'grant_type' => 'password',
                    'client_id' =>config('constants.client_id'),
                    'client_secret' => config('constants.client_secret'),
                    'username' =>$req->email,
                    'password' => hashPwd($req->email, $user->uuid, $req->password),
                    'scope' => '*'
                ]
            ]);
             //dd($response);

            if($response->getStatusCode() == 200){
                $res = json_decode((string) $response->getBody(), true);
                //log successfull login
                $login_log = array(
                    'user_id' => $user->id,
                    'login_ip' => request()->ip(),
                    'login_device' => $_SERVER['HTTP_USER_AGENT'],
                    'login_time' => Carbon::now()
                );
                //login to dms
                // $alf_res = loginDMS($credentials['email'], $credentials['password']);
                // // dd($alf_res);
                // if(isset($alf_res['success']) && $alf_res['success']){
                //     $dms_ticket = $alf_res['ticket'];
                // }else{
                //     $dms_ticket = '';
                // }
                insertRecord('tra_login_logs', $login_log);
                if(isset($res['access_token'])){

                    $req->session()->put('token', funcEncrypt($res['access_token']));
                    // $req->session()->put('dms_ticket', funcEncrypt($res['dms_ticket']));
                    $response = ['success' => true, 'user' => $user, 'token' => $res['access_token']];
                }else{
                    $response = ['success' => false, 'user' => $user, 'token_issue' => $res];
                }

            }else{
                $response = ['message' => 'Client authorization failed', 'success' => false];
            }
            return response()->json($response);
        }else{
            //log login failed attempts for correct usernames
             $attemptsCount = DB::table('tra_failed_login_attempts')->where(array('account_id' => $user->id,'attempt_status' => 1))->orderBy('id', 'DESC')->first();

            if (!empty($attemptsCount) || (!is_null($attemptsCount))) {
                $no_of_attempts = $attemptsCount->attempts;
                $time1 =  Carbon::now()->format('Y-m-d H:i:s');//Carbon::now();//date('Y-m-d H:i:s');
                $time2 = $attemptsCount->time;
                //now check for time span
                $timeSpan = getTimeDiffHrs($time1, $time2);

                if ($timeSpan > 24) {
                    //clear or rather update the attempt count to 1
                    $update = array(
                        'attempt_status' => 2
                    );
                    $where = array('account_id'=>$user->id);
                    updateRecord('tra_failed_login_attempts', $where, $update, 1);
                    $no_of_attempts = 0;
                }
                //increment the counter
                //if counter is 4 then this was the last attempt so block the account
                if ($no_of_attempts == 3 || $no_of_attempts == '3' || $no_of_attempts > 3 || $no_of_attempts == 3 || $no_of_attempts == '3') {
                    $blockedAccountParams = array(
                        'account_id' => $user->id,
                        'email' => $email,
                        'date' => date('Y-m-d H:i:s'),
                        'reason' => 'Failed login attempts 3 times within 24hrs'
                    );
                    insertRecord('tra_blocked_accounts', $blockedAccountParams, 1);
                    $res = array(
                        'success' => false,
                        'message' => 'Authentication Failed...Your account has been blocked!!'
                    );
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'Authentication Failed...You have ' . (3 - ($no_of_attempts + 1)) . ' attempts remaining!!'
                    );
                }
                //update
                $where = array('account_id' => $user->id,'attempt_status'=>1);
                $ee = updateRecord('tra_failed_login_attempts', $where, array('attempts' => $no_of_attempts + 1), 1);

                $response = $res;
            }
            //if its the first attemp
            else{
            //no attempts so fresh logging
                $attempts = 1;
                $loginAttemptsParams = array(
                    'account_id' => $user->id,
                    'email' => $email,
                    'ip_address' => request()->ip(),
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                    'attempts' => $attempts,
                    'time' => date('Y-m-d H:i:s'),
                    'attempt_status' => 1
                );
                insertRecord('tra_failed_login_attempts', $loginAttemptsParams, 1);
                $response = array(
                    'success' => false,
                    'message' => 'Authentication Failed...You have ' . (3 - $attempts) . ' attempts remaining!!!!'
                );
            }

            return response()->json($response);
        }
    }

    //revoke token authorization
    public function logout(Request $req){
        // revoke access token
         Auth::guard('api')->user()->token()->revoke();
        //revoke access authorization
         Auth::guard('web')->logout();
        //clear session data
         $req->session()->flush();
        //prepare response
         $response = ['message' => 'Signed Out Succesfully', 'success' => true];
        return response()->json($response);
    }
    public function recoverForgotPassword(Request $req)
    {
        $res = array();
        try {
            DB::transaction(function () use (&$res, $req) {
                $email = $req->input('email');
                $encryptedEmail = $email;
                //check if this mail is registered in the system
                $user = User::where('email', $encryptedEmail)->first();
                if (is_null($user)) {
                    $res = array(
                        'success' => false,
                        'message' => 'Request Failed...This email address is not registered in the system!!'
                    );
                } else {
                    $user_id = $user->id;
                    $guid = md5(uniqid());
                    $pwdResetParams = array(
                        'user_id' => $user_id,
                        'guid' => $guid,
                        'date_generated' => Carbon::now()
                    );
                    $user_passwordData = str_random(8);
                    insertRecord('tra_password_reset', $pwdResetParams, 1);
                    if (is_connected()) {
                        //send the mail here
                        // $subject = 'Botswana Management Information System :Password Recovery';
                        // $email_content = "Below is the reset Account Password</br>.";

                        // $email_content .= " <p>- Account Email Address: ".$email .".<p/>";
                        // $email_content .= " - <h2>One Time Password(OTP): ".$user_passwordData ."<br/></h2>";

                        // $email_content.="<p>For more information visit BOMRA IMIS for a full account access guide</p>";

                       // $link = url('/') . '/resetPassword?guid=' . $guid;
                        $vars = array(
                            '{username}' => $email,
                            '{password}' => $user_passwordData
                        );
                        // $res = forgotPasswordEmail(1, $email, $email_content, $vars);
                        $res = accountRegistrationEmail(4, $email, $user_passwordData, '', $vars);
                        if($res['success']){
                            $user_exists = User::find($user_id);
                            if ($user_exists->count() > 0) {
                                $username = $user_exists->email;
                                $uuid = $user_exists->uuid;
                                $hashedPassword = bcrypt(hashPwd($username, $uuid, $user_passwordData));
                                $user_exists->password = $hashedPassword;
                                $user_exists->force_password_change = 1;
                                if ($user_exists->save()) {

                                }
                            }
                        }
                    } else {
                        $res = array(
                            'success' => false,
                            'message' => 'Whoops!! There is no internet connection. Check your connection then try again!!'
                        );
                    }
                }
            }, 5);
        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return response()->json($res);
    }

    function passwordResetHandler(Request $req)
    {
        $res = array();
        try {
            DB::beginTransaction();
                $guid = $req->input('guid');
                $newPassword = $req->input('new_password');
                //check if the fetched user id really exists in users table
                $user = User::where('email',$req->guid)->first();
                $user_id=$user->id;
                $user_exists = User::find($user_id);
                if ($user_exists->count() > 0) {
                    $username = $user_exists->email;
                    $uuid = $user_exists->uuid;
                    $dms_id = $user_exists->dms_id;
                    $dms_pwd = md5($newPassword);
                    $hashedPassword = bcrypt(hashPwd($username, $uuid, $newPassword));
                    $user_exists->password = $hashedPassword;
                    $user_exists->force_password_change = 0;
                    if ($user_exists->save()) {
                        //save new dms password
                        /* $dms_db = DB::connection('dms_db');
                         $dms_db->table('tblusers')
                             ->where('id', $dms_id)
                             ->update(array('pwd' => $dms_pwd));*/
                        //delete the reset password token
                       // DB::table('tra_password_reset')->where('guid', $guid)->delete();
                        //also delete any tokens associated with this user
                        DB::table('tra_password_reset')->where('user_id', $user_id)->delete();

                        //update update on first time login
                       updateRecord('users', ['id'=>$user_id], ['force_password_change' => 0]);

                        $res = array(
                            'success' => true,
                            'message' => 'Congratulations...Your password was reset successfully!!'
                        );
                    } else {
                        $res = array(
                            'success' => false,
                            'message' => 'Sorry problem was encountered while saving your new password. Please try again!!'
                        );
                    }
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'Your request couldn\'t be authenticated...User not found!!'
                    );
                }
          DB::commit();

        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return response()->json($res);
    }


}

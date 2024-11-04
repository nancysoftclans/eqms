<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class init extends Controller
{

    public function launch(Request $req)
    {
        //date_default_timezone_set('Africa/Gaborone');
        //dd(date("Y-m-d H:i:s"));
        // Auth::logout();

      $host = $_SERVER['HTTP_HOST'];
        if ($host == '127.0.0.1') {
            die("<h4 style='text-align: center; color: red'>MIS IS UNDER DEVELOPMENT AND IS NOT ACCESSIBLE AT THE MOMENT. KINDLY CONTACT SYSTEM ADMIN!!</h4>
                 <p style='text-align: center; color: pink'></p>");
        }
        try {
            DB::connection()->getPdo();
            if (DB::connection()->getDatabaseName()) {
                // echo "Yes! Successfully connected to the DB: " . DB::connection()->getDatabaseName();
            }
        } catch (\Exception $e) {
            die("<h4 style='text-align: center; color: red'>Could not connect to the database.  Please check your configuration!!</h4>
                 <p style='text-align: center; color: pink'>" . $e->getMessage() . "</p>");
        } catch (\Throwable $throwable) {
            die("<h4 style='text-align: center; color: red'>Could not connect to the database.  Please check your configuration!!</h4>
                 <p style='text-align: center; color: pink'>" . $throwable->getMessage() . "</p>");
        }
        $base_url = url('/');
        //check if access token is valid as well as the session
        $has_valid_token = false;
        if(Auth::check()){
            $access_token = funcDecrypt($req->session()->get('token'));
            // dd(funcDecrypt($req->session()->get('dms_ticket')));
            if($this->validateuserToken($access_token)){
                $has_valid_token = true;
            }
        }
        if ($has_valid_token) {
            $loggedInUser = Auth::user();
            $access_token = funcDecrypt($req->session()->get('token'));
            if($this->validateuserToken($access_token));
            //$apiTokenResult = $loggedInUser->createToken('identifier_tkn');
            $is_logged_in = true;
            $title_id = $loggedInUser->title_id;
            $title = '';
            if(validateIsNumeric($title_id)){
                $title_qry = DB::table('par_titles')->where('id', $title_id)->first();
                if(isset($title_qry->name)){
                    $title = $title_qry->name;
                }
            }
            $user_id = \Auth::user()->id;
            $title_id = $title_id;
            $gender_id = \Auth::user()->gender_id;
            $first_name = funcDecrypt(\Auth::user()->first_name);
            $last_name = funcDecrypt(\Auth::user()->last_name);
            $email = \Auth::user()->email;
            $phone = funcDecrypt(\Auth::user()->phone);
            $force_password_change = \Auth::user()->force_password_change;
            $mobile = funcDecrypt(\Auth::user()->mobile);
            $profile_pic_url = 'resources/images/placeholder.png';
            $saved_name = DB::table('par_user_images')->where('user_id', \Auth::user()->id)->value('saved_name');
            if ($saved_name != '') {
                $profile_pic_url = $base_url . '/resources/images/user-profile/' . $saved_name;
            }else{
                $profile_pic_url = $base_url . '/resources/images/placeholder.png';
            }
            $access_point = DB::table('par_access_points')->where('id', \Auth::user()->access_point_id)->value('name');
            $role = DB::table('par_user_roles')->where('id', \Auth::user()->user_role_id)->value('name');
             $scheduledtcmeeting_counter = getUserScheduledtcmeetingCounter($user_id);
             $notifications_counter = getUserNotificationsCounter($user_id);
             $user_dashboard = getUserSystemDashaboard($user_id);
              //fetching last login
              $last_login='';
                  $qry = DB::table('tra_login_logs')
                             ->select('login_time')
                             ->where('user_id',$user_id)
                             ->orderBy('id','DESC');
                             $res = $qry->skip(1)->take(1)->first();

                  if(!$res){
                    $last_login = Carbon::now()->format('Y-m-d H:i:s');

                  }
                  else{
                    $last_login = $res->login_time;

                  }
            //tracks the time the system takes to refresh update stores
              $refreshTimer = getSingleRecordColValue('par_durations',['type_id'=>3], 'value');
        }
        else {
            $is_logged_in = false;
            $user_id = '';
            $force_password_change=0;
            $title_id = '';
            $gender_id = '';
            $title = '';
            $first_name = '';
            $last_name = '';
            $email = '';
            $phone = '';
            $mobile = '';
            $profile_pic_url = 'resources/images/placeholder.png';
            $access_point = '';
            $role = '';
            $access_token = '';
            $user_dashboard = 'systemprocessdashboard';
            $scheduledtcmeeting_counter = 0;
            $last_login='';
            $notifications_counter= 0;
            $refreshTimer = 60000;


        }
        $system_information = DB::table('par_system_information')->first();

        $year = date('Y');
        $data['is_reset_pwd'] = false;
        $data['guid'] = $email;
        $data['user_id'] = $user_id;
        $data['title_id'] = $title_id;
        $data['gender_id'] = $gender_id;
        $data['is_logged_in'] = $is_logged_in;
        $data['force_password_change'] = $force_password_change;
        $data['report_server_url'] = env('report_server_url');
        $data['title'] = $title;
        $data['first_name'] = $first_name;
        $data['last_name'] = $last_name;
        $data['base_url'] = $base_url;
        $data['email'] = $email;
        $data['phone'] = $phone;
        $data['mobile'] = $mobile;
        $data['access_point'] = $access_point;
        $data['role'] = $role;
        $data['profile_pic_url'] = $profile_pic_url;
        $data['access_token'] = $access_token;
        $data['upload_directory'] = Config('constants.dms.upload_url');
        $data['year'] = $year;
        $data['system_name'] = $system_information->system_name;
        $data['organisation_full_name'] = $system_information->organisation_full_name;
        $data['org_abr_name'] = $system_information->org_abr_name;
        $data['ministry_name'] = $system_information->ministry_name;
        $data['system_version'] = $system_information->system_version;
        $data['last_login'] = $last_login.' <span style="color: red;">LIVE ENVIROMENT!!!!</span>';;

        $data['scheduledtcmeeting_counter'] = $scheduledtcmeeting_counter;
        $data['notifications_counter'] = $notifications_counter;
        $data['system_dashboard'] = $user_dashboard;
        $data['refreshTimer'] = $refreshTimer;
        $data['esign_url'] = Config('constants.esign.web_url');

        $is_notification_enabled = checkNotificationEnabled($user_id);
        $data['is_notification_enabled'] = $is_notification_enabled;        

        return view('init', $data);
    }
    public function validateuserToken($token)
    {
        // $http = new \GuzzleHttp\Client();
        $response = Http::withHeaders([
                    'Authorization'=> 'Bearer ' . $token,
                    'Accept'=> 'application/json'
                ])->get(url('/').'/api/auth');
        $res = json_decode((string) $response->getBody(), true);

        if(isset($res['id'])){
            return true;
        }else{
            return false;
        }
    }
    public function testEmail()
    {
        //send mail
         $data = array(
            'subject' => 'test',
            'email_content' => 'test email',
            'trader_name' => 'Gakungu',
            'from_email'=>'brimsalert@bomra.co.bw',
            'to'=>'kunguonesmas@gmail.com',
            'title'=>'nu uyu'
        );
        $res =  Mail::send('emailnotification', $data, function($message) {
                $message->to('kunguonesmas@gmail.com', 'kungu')
                        ->subject('test mail');
        });
        dd($res);
    }

}

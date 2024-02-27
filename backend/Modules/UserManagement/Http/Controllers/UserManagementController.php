<?php

namespace Modules\UserManagement\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

use Illuminate\Http\Response;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserManagementController extends Controller
{
    protected $user_id;
    protected $enc_key;
    protected $iv;
    public function __construct(Request $req)
    {
        $is_mobile = $req->input('is_mobile');
        if (is_numeric($is_mobile) && $is_mobile > 0) {
            $this->user_id = $req->input('user_id');
        } else {
            $this->middleware(function ($request, $next) {
                if (!\Auth::check()) {
                    $res = array(
                        'success' => false,
                        'message' => '<p>NO SESSION, SERVICE NOT ALLOWED!!<br>PLEASE RELOAD THE SYSTEM!!</p>'
                    );
                    echo json_encode($res);
                    exit();
                }
                $this->user_id = \Auth::user()->id;
                $this->enc_key = env('encryption_key');
                $this->iv = env('encryption_iv');
                return $next($request);
            });
        }
    }

    public function index()
    {
        return view('usermanagement::index');
    }

//     public function getUserParamFromModel(Request $request)
//     {
//         $model_name = $request->input('model_name');
//         $strict_mode = $request->input('strict_mode');
//         try {
//             $model = 'App\\Modules\\UserManagement\\Entities\\' . $model_name;
//             if (isset($strict_mode) && $strict_mode == 1) {
//                 $results = $model::where('is_enabled', 1)
//                     ->get()
//                     ->toArray();
//             } else {
//                 $results = $model::all()
//                     ->toArray();
//             }
//             $res = array(
//                 'success' => true,
//                 'results' => $results,
//                 'message' => 'All is well'
//             );
//         } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

//         } catch (\Throwable $throwable) {
//             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         }
//         return response()->json($res);
//     }

//     public function saveUserCommonData(Request $req)
//     {
//         try {
//             $user_id = \Auth::user()->id;
//             $post_data = $req->all();
//             $table_name = $post_data['table_name'];
//             $id = $post_data['id'];
//             //unset unnecessary values
//             unset($post_data['_token']);
//             unset($post_data['table_name']);
//             unset($post_data['model']);
//             unset($post_data['id']);
//             $table_data = $post_data;
//             //add extra params
//             $table_data['created_at'] = Carbon::now();
//             $table_data['created_by'] = $user_id;
//             $where = array(
//                 'id' => $id
//             );
//             if (isset($id) && $id != "") {
//                 if (recordExists($table_name, $where)) {
//                     unset($table_data['created_at']);
//                     unset($table_data['created_by']);
//                     $table_data['updated_at'] = Carbon::now();
//                     $table_data['updated_by'] = $user_id;
//                     $previous_data = getPreviousRecords($table_name, $where);
//                     if ($previous_data['success'] == false) {
//                         return $previous_data;
//                     }
//                     $previous_data = $previous_data['results'];
//                     $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);
//                 }else{
//                     $res = array(
//                         'success' => false,
//                         'message' => "Application with that id is missing"
//                     );
//                 }
//             } else {
//                 $res = insertRecord($table_name, $table_data, $user_id);
//             }
//         } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

//         } catch (\Throwable $throwable) {
//             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         }
//         return response()->json($res);
//     }

     public function deleteUserRecord(Request $req)
     {
        try {
             $record_id = $req->input('id');
            $table_name = $req->input('table_name');
            $user_id = \Auth::user()->id;
             $where = array(
                'id' => $record_id
             );

             $res = deleteRecord($table_name, $where, $user_id);
         } catch (\Exception $exception) {
             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

         } catch (\Throwable $throwable) {
             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
         return response()->json($res);
     }

     public function softDeleteUserRecord(Request $req)
     {
         try {
             $record_id = $req->input('id');
             $table_name = $req->input('table_name');
             $user_id = \Auth::user()->id;
             $where = array(
                 'id' => $record_id
             );
             $previous_data = getPreviousRecords($table_name, $where);
             if ($previous_data['success'] == false) {
                 return $previous_data;
             }
             $previous_data = $previous_data['results'];
             $res = softDeleteRecord($table_name, $previous_data, $where, $user_id);
         } catch (\Exception $exception) {
             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

         } catch (\Throwable $throwable) {
             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
     }

     public function undoUserSoftDeletes(Request $req)
     {
         try {
             $record_id = $req->input('id');
             $table_name = $req->input('table_name');
             $user_id = \Auth::user()->id;
             $where = array(
                 'id' => $record_id
             );
             $previous_data = getPreviousRecords($table_name, $where);
             if ($previous_data['success'] == false) {
                 return $previous_data;
             }
             $previous_data = $previous_data['results'];
             $res = undoSoftDeletes($table_name, $previous_data, $where, $user_id);
         } catch (\Exception $exception) {
             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

         } catch (\Throwable $throwable) {
             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
         }
         return response()->json($res);
     }

    public function getActiveSystemUsers(Request $request)
    {
        $group_id = $request->input('group_id');
        $department_id = $request->input('department_id');
        $directorate_id = $request->input('directorate_id');
        $filters = $request->input('filters');
        $filters = (array)json_decode($filters);
        $filters=array_filter($filters);

        try {
            // DB::enableQueryLog();
            $qry = DB::table('users as t1')
                ->leftJoin('par_titles as t2', 't1.title_id', '=', 't2.id')
                ->leftJoin('par_user_images as t3', 't1.id', '=', 't3.user_id')
                ->leftJoin('par_departments as t4', 't1.department_id', '=', 't4.id')
                ->leftJoin('par_branches as t5', 't1.branch_id', '=', 't5.id')
                ->leftJoin('tra_blocked_accounts as t6', 't1.id', '=', 't6.account_id')
                ->leftJoin('tra_user_group as t7','t1.id','t7.user_id')
                ->leftJoin('tra_login_logs as t8', function($query) {
                   $query->on('t1.id','=','t8.user_id')
                   ->whereRaw('t8.id IN (select MAX(l1.id) from tra_login_logs as l1 inner join users as u2 on u2.id = l1.user_id group by u2.id)');
                })
                ->leftJoin('par_gender as t9', 't1.gender_id', '=', 't9.id')
                ->select(DB::raw("t1.*, t1.email as email,t8.login_time,t3.saved_name,t4.name as department_name,
                t5.name as zone_name, t7.id as group_id, t2.name as title, t9.name as gender,
                CONCAT(decryptval(t1.first_name,".getDecryptFunParams()."),' ', decryptval(t1.last_name,".getDecryptFunParams().")) as fullnames,
                decryptval(t1.phone,".getDecryptFunParams().") as phone, decryptval(t1.mobile,".getDecryptFunParams().") as mobile, decryptval(t1.first_name,".getDecryptFunParams().") as first_name,
                decryptval(t1.last_name,".getDecryptFunParams().") as last_name"))
                ->whereNull('t6.id');

            if (isset($filter)) {
                if ($filters != NULL) {
                    foreach ($filters as $filter) {
                        switch ($filter->property) {
                            case 'email' :
                                $whereClauses[] = "(t1.email ILIKE '%" . ($filter->value) . "%' OR t1.reference_no ILIKE '%" . ($filter->value) . "%' )";
                                break;
                            case 'fullnames' :
                                $whereClauses[] = "(t1.email ILIKE '%" . ($filter->value) . "%' OR t1.reference_no ILIKE '%" . ($filter->value) . "%' )";
                                break;

                        }
                    }
                    $whereClauses = array_filter($whereClauses);
                }
                if (!empty($whereClauses)) {
                    $filter_string = implode(' AND ', $whereClauses);

                }
            }
        //group filtering
            if (isset($group_id) && $group_id != '') {
                $users = DB::table('tra_user_group')
                    ->select('user_id')
                    ->where('group_id', $group_id)
                    ->get();
                $users = convertStdClassObjToArray($users);
                $users = convertAssArrayToSimpleArray($users, 'user_id');
                $qry->whereIn('t1.id', $users);
            }
        //other filters
            if(validateIsNumeric($department_id)){
                $qry->where('t1.department_id',$department_id);
            }
            if(validateIsNumeric($directorate_id)){
                $qry->where('t1.directorate_id',$directorate_id);
            }
            $results = $qry->get();
            //$results = decryptUserCollection($results);
            $results = convertStdClassObjToArray($results);
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public
    function getBlockedSystemUsers()
    {
        try {
            $qry = DB::table('users as t1')
                ->join('tra_blocked_accounts as t2', 't1.id', '=', 't2.account_id')
                ->leftJoin('users as t3', 't3.id', '=', 't2.action_by')
                ->leftJoin('par_user_images as t4', 't1.id', '=', 't4.user_id')
                ->leftJoin('par_titles as t6', 't1.title_id', '=', 't6.id')
                ->leftJoin('par_departments as t7', 't1.department_id', '=', 't7.id')
                ->leftJoin('par_branches as t8', 't1.branch_id', '=', 't8.id')
                ->select(DB::raw("t1.*, t4.saved_name,t7.name as department_name,t8.name as zone_name,t2.date as blocked_on,
                                   t2.reason,t3.first_name as first_name2,t3.last_name as last_name2,t2.account_id"));
            $data = $qry->get();
            $results = decryptUserCollection($data);
            $data = convertStdClassObjToArray($data);
            $data = decryptArray($data);
            $res = array(
                'success' => true,
                'results' => $data,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        }
        return response()->json($res);
    }

    public function getUnblockedSystemUsers()
    {
        try {
            $qry = DB::table('users as t1')
                ->join('tra_unblocked_accounts as t2', 't1.id', '=', 't2.account_id')
                ->leftJoin('users as t3', 't2.action_by', '=', 't3.id')
                ->leftJoin('par_user_images as t4', 't1.id', '=', 't4.user_id')
                ->leftJoin('par_titles as t6', 't1.title_id', '=', 't6.id')
                ->leftJoin('par_departments as t7', 't1.department_id', '=', 't7.id')
                ->leftJoin('par_branches as t8', 't1.branch_id', '=', 't8.id')
                ->leftJoin('users as t9', 't2.unblock_by', '=', 't9.id')
                ->select(DB::raw("t1.*, t4.saved_name, t7.name as department_name,t8.name as zone_name,t2.date as blocked_on, t2.unblock_date,t2.reason,t3.first_name as first_name2,t3.last_name as last_name2,t2.account_id,t2.unblock_reason,t9.first_name as first_name3,t9.last_name as last_name3"));

            $data = $qry->get();
            $data = convertStdClassObjToArray($data);
            $data = decryptArray($data);
            $res = array(
                'success' => true,
                'results' => $data,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__));

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__));
        }
        return response()->json($res);
    }

//     public function uploadUserSignature(Request $request)
//     {
//         $usr_id = $request->input('user_id');
//         $params = array(
//             'user_id' => $usr_id
//         );
//         $table_name = 'tra_users_signature_uploads';
//         $folder = Config('constants.signs_path');
//         DB::table($table_name)->where('user_id', $usr_id)->delete();
//         $user_id = $this->user_id;
//         $res = uploadFile($request, $params, $table_name, $folder, $user_id);
//         return \response()->json($res);
//     }

//     public function getUserSignatures()
//     {
//         try {
//             $qry = DB::table('users as t1')
//                 ->leftJoin('tra_users_signature_uploads as t2', 't1.id', '=', 't2.user_id')
//                 ->select(DB::raw("t1.*,CONCAT_WS(' ',decryptVal(t1.first_name, e),decrypt(t1.last_name)) as fullnames,decrypt(t1.email) as email,
//                          t2.savedname"));
//             $results = $qry->get();
//             $res = array(
//                 'success' => true,
//                 'results' => $results,
//                 'message' => returnMessage($results)
//             );
//         } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

//         } catch (\Throwable $throwable) {
//             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         }
//         return response()->json($res);
//     }

    public function saveUserInformation(Request $req)
    {
        $res = array();

        DB::transaction(function () use ($req, &$res) {
            $user_id = \Auth::user()->id;

            $id = $req->input('id');
            $email = $req->input('email');
            $profile_url = $req->input('saved_name');
            $first_name = $req->input('first_name');
            $othernames = $req->input('last_name');

            $groups = $req->input('groups');
            $groups = json_decode($groups);
            $assigned_groups = array();
            $table_data = array(
                'first_name' => $first_name,
                'last_name' => $othernames,
                'gender_id' => $req->input('gender_id'),
                'mobile' => $req->input('mobile'),
                'phone' => $req->input('phone'),
                'title_id' => $req->input('title_id'),
                'department_id' => $req->input('department_id'),
                'user_category_id' => $req->input('user_category_id'),
                'externaluser_category_id' => $req->input('externaluser_category_id'),
                'branch_id' => $req->input('branch_id'),
                'active_from' => $req->input('active_from'),
                'active_to' => $req->input('active_to'),
                'has_expiry_exemption' => $req->input('has_expiry_exemption'),
                'force_password_change' => $req->input('force_password_change'),
                'expiry_exemption_remark' => $req->input('expiry_exemption_remark'),
                'has_dormant_exemption' => $req->input('has_dormant_exemption'),
                'dormant_exemption_remark' => $req->input('dormant_exemption_remark'),
                'has_password_change_exemption' => $req->input('has_password_change_exemption'),
                'password_change_exemption_remark' => $req->input('password_change_exemption_remark'),
                'has_account_timestamp' => $req->input('has_account_timestamp')
            );

            $skip = $req->input('skip');
            $skipArray = explode(",", $skip);
            $skipArray[] = 'title_id';
            $skipArray[] = 'department_id';
            $skipArray[] = 'user_category_id';
            $skipArray[] = 'externaluser_category_id';
            $skipArray[] = 'branch_id';
            $skipArray[] = 'active_from';
            $skipArray[] = 'active_to';
            $skipArray[] = 'has_expiry_exemption';
            $skipArray[] = 'expiry_exemption_remark';
            $skipArray[] = 'has_dormant_exemption';
            $skipArray[] = 'dormant_exemption_remark';
            $skipArray[] = 'has_password_change_exemption';
            $skipArray[] = 'force_password_change';
            $skipArray[] = 'password_change_exemption_remark';
            $skipArray[] = 'has_account_timestamp';
            //user data
            $user_data = $table_data;
            //encrypt data
            $table_data = encryptArray($table_data, $skipArray);

            $where = array(
                'id' => $id
            );
            $table_name = 'users';
            try {
                if (isset($id) && $id != "") {
                    if (recordExists($table_name, $where)) {
                        $table_data['updated_at'] = Carbon::now();
                        $table_data['updated_by'] = $user_id;
                        $previous_data = getPreviousRecords($table_name, $where);
                        if ($previous_data['success'] == false) {
                            return $previous_data;
                        }
                        $previous_data = $previous_data['results'];
                        $encryptedEmail = funcEncrypt($email);

                        //add extra params
                        $user_email = $previous_data[0]['email'];
                        //when user email have changed send email
                        if($user_email != $email){

                            $password = str_random(8);

                            $uuid = generateUniqID();//unique user ID
                            $pwd = bcrypt(hashPwd($email, $uuid, $password));
                            $table_data['email'] = $email;
                            $table_data['password'] = $pwd;
                            $table_data['uuid'] = $uuid;
                            $vars = array(
                                '{username}' => $email,
                                '{password}' => $password
                            );
                            $email_res = accountRegistrationEmail(3, $email, $password, '', $vars);
                            //update alfresco user
                            $alf_user = array(
                                'firstName'=> $user_data['first_name'],
                                'lastName'=> $user_data['last_name'],
                                'email'=> $email,
                                'password' => $password
                            );
                            // $alf_res = dmsUpdateAccount( $email, $userDetails);
                            // if(!isset($alf_res['success']) || !$alf_res['success']){
                            //     return $alf_res;
                            // }
                        }
                        else{
                            //update alfresco user
                            $alf_user = array(
                                'firstName'=> $user_data['first_name'],
                                'lastName'=> $user_data['last_name'],
                                'email'=> $user_email
                            );
                            // $alf_res = dmsUpdateAccount( $user_email, $alf_user);
                            // if(!isset($alf_res['success']) || !$alf_res['success']){
                            //     return $alf_res;
                            // }
                        }

                        $success = updateRecord($table_name, $where, $table_data);
                        //update profile pic
                        $this->saveUserImage($req, $id);
                        // dd($success);

                        if ($success['success'] === true) {
                            if (count($groups) > 0) {
                                foreach ($groups as $group_id) {
                                    $assigned_groups[] = array(
                                        'user_id' => $id,
                                        'group_id' => $group_id
                                    );
                                }
                                $res = deleteRecord('tra_user_group', array('user_id'=>$id));
                                $res = insertMultipleRecords('tra_user_group', $assigned_groups);

                            }
                            //log change
                            $table_data['user_id'] = $id;
                            unset($table_data['id']);
                            insertRecord('users_logs', $table_data);

                            $res = array(
                                'success' => true,
                                'message' => 'Data updated Successfully!!'
                            );
                        } else {
                            $res = $success;
                        }
                    }
                } else {
                    //check if this email has been used before
                    $encryptedEmail = funcEncrypt($email);
                    $email_exists = DB::table('users')
                        ->where('email', $email)
                        ->first();
                    if (!is_null($email_exists)) {
                        $res = array(
                            'success' => false,
                            'message' => 'This Email Address (' . $email . ') is already registered. Please use a different Email Address!!'
                        );
                        return response()->json($res);
                    }

                    $password = str_random(8);
                    $uuid = generateUniqID();//unique user ID
                    $pwd = bcrypt(hashPwd($email, $uuid, $password));
                    //add extra params
                    $table_data['email'] = $email;
                    $table_data['password'] = $pwd;
                    $table_data['uuid'] = $uuid;

                    //first lets send this user an email with random password to avoid having a user in the db who hasn't receive pwd
                    if (is_connected()) {
                        //send the mail here
                        $link = url('/');
                        $vars = array(
                            '{username}' => $email,
                            '{password}' => $password
                        );
                        accountRegistrationEmail(1, $email, $password, $link, $vars);
                        // $email_res =array(); // accountRegistrationEmail(1, $email, $password, $link, $vars);
                        // if ($email_res['success'] == false) {
                        //     $res = $email_res;
                        // }
                        // Mail::to($email)->send(new AccountActivation($email, $password, $link));
                        // if (count(Mail::failures()) > 0) {
                        //     $res = array(
                        //         'success' => false,
                        //         'message' => 'Problem was encountered while sending email with account instructions. Please try again later!!'
                        //     );
                        // }  else {

                            $results = insertRecord($table_name, $table_data);
                            if ($results['success'] == true) {
                                $insertId = $results['record_id'];
                                if (count($groups) > 0) {
                                    foreach ($groups as $group_id) {
                                        $assigned_groups[] = array(
                                            'user_id' => $insertId,
                                            'group_id' => $group_id
                                        );
                                    }
                                    insertMultipleRecords('tra_user_group', $assigned_groups);
                                }

                                //profile pic add
                                $this->saveUserImage($req, $insertId);
                                //create alfresco user
                                $alf_user = array(
                                    'userName'=> $email,
                                    'firstName'=> $user_data['first_name'],
                                    'lastName'=> $user_data['last_name'],
                                    'email' => $email,
                                    'password' => $pwd
                                );

                                // $alf_res = dmsCreateAccount($alf_user);
                                // if(!isset($alf_res['success']) || !$alf_res['success']){
                                //     return $alf_res;
                                // }
                                $res = array(
                                    'success' => true,
                                    'message' => 'User added successfully. Further account login credentials have been send to ' . $email . '. The user should check his/her email for login details!(pass sent to email)'
                                );
                            } else {
                                $res = array(
                                    'success' => false,
                                    'message' => $results['message']
                                );
                            }
                        // }
                    } else {
                        $res = array(
                            'success' => false,
                            'message' => 'Whoops!! There is no internet connection. Check your connection then try again!!'
                        );
                    }
                }
            } catch (\Exception $e) {
                $res = array(
                    'success' => false,
                    'message' => $e->getMessage()
                );
            }
        }, 5);
        return response()->json($res);
    }
    public function saveUpdateUserInformation(Request $req)
    {
        $res = array();
        DB::transaction(function () use ($req, &$res) {
            $user_id = \Auth::user()->id;

            $id = $req->input('id');
            $email = $req->input('email');
            $profile_url = $req->input('saved_name');
            $first_name = $req->input('first_name');
            $othernames = $req->input('last_name');

            $groups = $req->input('groups');
            $groups = json_decode($groups);
            $assigned_groups = array();
            $table_data = array(
                'first_name' => $first_name,
                'last_name' => $othernames,
                'gender_id' => $req->input('gender_id'),
                'mobile' => $req->input('mobile'),
                'phone' => $req->input('phone'),
                'title_id' => $req->input('title_id'),
            );

            $skip = $req->input('skip');
            $skipArray = explode(",", $skip);
            $skipArray[] = 'title_id';

            //user data
            $user_data = $table_data;
            //encrypt data
            $table_data = encryptArray($table_data, $skipArray);

            $where = array(
                'id' => $id
            );
            $table_name = 'users';
            try {
                if (isset($id) && $id != "") {
                    if (recordExists($table_name, $where)) {
                        $table_data['updated_at'] = Carbon::now();
                        $table_data['updated_by'] = $user_id;
                        $previous_data = getPreviousRecords($table_name, $where);
                        if ($previous_data['success'] == false) {
                            return $previous_data;
                        }
                        $previous_data = $previous_data['results'];
                        $encryptedEmail = funcEncrypt($email);

                        //add extra params
                        $user_email = $previous_data[0]['email'];
                        //when user email have changed send email
                        if($user_email != $email){

                            $password = str_random(8);

                            $uuid = generateUniqID();//unique user ID
                            $pwd = bcrypt(hashPwd($email, $uuid, $password));
                            $table_data['email'] = $email;
                            $table_data['password'] = $pwd;
                            $table_data['uuid'] = $uuid;
                            $vars = array(
                                '{username}' => $email,
                                '{password}' => $password
                            );
                            $email_res = accountRegistrationEmail(3, $email, $password, '', $vars);
                            //update alfresco user
                            $alf_user = array(
                                'firstName'=> $user_data['first_name'],
                                'lastName'=> $user_data['last_name'],
                                'email'=> $email,
                                'password' => $password
                            );
                            // $alf_res = dmsUpdateAccount( $email, $userDetails);
                            // if(!isset($alf_res['success']) || !$alf_res['success']){
                            //     return $alf_res;
                            // }
                        }
                        else{
                            //update alfresco user
                            $alf_user = array(
                                'firstName'=> $user_data['first_name'],
                                'lastName'=> $user_data['last_name'],
                                'email'=> $user_email
                            );
                            // $alf_res = dmsUpdateAccount( $user_email, $alf_user);
                            // if(!isset($alf_res['success']) || !$alf_res['success']){
                            //     return $alf_res;
                            // }
                        }

                        $success = updateRecord($table_name, $where, $table_data);
                        //update profile pic
                        $this->saveUserImage($req, $id);


                        if ($success['success'] === true) {
                            $table_data['user_id'] = $id;
                            unset($table_data['id']);
                            insertRecord('users_logs', $table_data);

                            $res = array(
                                'success' => true,
                                'message' => 'Data updated Successfully!!'
                            );
                        } else {
                            $res = $success;
                        }
                    }
                }

            } catch (\Exception $e) {
                $res = array(
                    'success' => false,
                    'message' => $e->getMessage()
                );
            }
        }, 5);
        return response()->json($res);
    }




    public function getOpenUserGroups(Request $request)
    {
        $user_id = $request->input('user_id');
        $department_id = $request->input('department_id');
        $branch_id = $request->input('branch_id');
        // $where = array(
        //    // 'department_id' => $department_id,
        //     'branch_id' => $branch_id
        // );
        try {
            $qry = DB::table('par_groups as t1');
               // ->where($where);
            if (isset($user_id) && $user_id != '') {
                $qry->whereNotIn('t1.id', function ($query) use ($user_id) {
                    $query->select(DB::raw('t2.group_id'))
                        ->from('tra_user_group as t2')
                        ->whereRaw('t2.user_id=' . $user_id);
                });
            }
            $data = $qry->get();
            $res = array(
                'success' => true,
                'results' => $data,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getAssignedUserGroups(Request $request)
    {
        $user_id = $request->input('user_id');
        try {
            $qry = DB::table('tra_user_group as t1')
                ->join('par_groups as t2', 't1.group_id', '=', 't2.id')
                ->select('t2.*')
                ->where('t1.user_id', $user_id);
            $data = $qry->get();
            $res = array(
                'success' => true,
                'results' => $data,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getOpenUserRoles(Request $request)
    {
        $user_id = $request->input('user_id');
        $access_point_id = $request->input('accessPointId');
        try {
            $qry = DB::table('par_user_roles as t1')
            ->where('group_owner_level', $access_point_id);
            if (isset($user_id) && $user_id != '') {
                $qry->whereNotIn('t1.id', function ($query) use ($user_id) {
                    $query->select(DB::raw('t2.role_id'))
                        ->from('tra_user_roles_assignment as t2')
                        ->whereRaw('t2.user_id=' . $user_id);
                });
            }
            $data = $qry->get();
            $res = array(
                'success' => true,
                'results' => $data,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getAssignedUserRoles(Request $request)
    {
        $user_id = $request->input('user_id');
        try {
            $qry = DB::table('tra_user_roles_assignment as t1')
                ->join('par_user_roles as t2', 't1.role_id', '=', 't2.id')
                ->select('t2.*')
                ->where('t1.user_id', $user_id);
            $data = $qry->get();
            $res = array(
                'success' => true,
                'results' => $data,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function saveUserImage(Request $req, $user_id)
    {
        // $user_id = $req->input('id');
        $res = array();
        try {
            if ($req->hasFile('profile_photo')) {
                $ben_image = $req->file('profile_photo');
                $origImageName = $ben_image->getClientOriginalName();
                $extension = $ben_image->getClientOriginalExtension();
                $destination = getcwd() . '\resources\images\user-profile';
                $savedName = str_random(5) . time() . '.' . $extension;
                $ben_image->move($destination, $savedName);
                $where = array(
                    'user_id' => $user_id
                );
                if ($user_id != '') {
                    $recordExists = recordExists('par_user_images', $where);
                    if ($recordExists) {
                        $update_params = array(
                            'initial_name' => $origImageName,
                            'saved_name' => $savedName,
                            'updated_by' => \Auth::user()->id
                        );
                        $res = updateRecord('par_user_images', $where, $update_params);
                    } else {
                        $insert_params = array(
                            'user_id' => $user_id,
                            'initial_name' => $origImageName,
                            'saved_name' => $savedName,
                            'created_by' => \Auth::user()->id
                        );
                        $res = insertRecord('par_user_images', $insert_params);
                    }
                } else {
                    $res = array('success'=>false, 'message'=>'user not found');
                }

            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

//     public
    function resetUserPassword(Request $req)//updateUserPassword
    {
        //i need his/her encrypted username and UUID
        $user_id = $req->input('id');
        $res = array();
        try {
            DB::transaction(function () use ($user_id, &$res) {

                $userData = User::find($user_id);
                if ($userData) {
                    $encryptedEmail = $userData->email;
                    //$dms_id = $userData->dms_id;
                   // $decryptedEmail = funcDecrypt($encryptedEmail);
                    $uuid = $userData->uuid;
                    $password = str_random(8);
                    $prevPwd = $userData->password;
                    $newPassword = bcrypt(hashPwd($encryptedEmail, $uuid, $password));
                   // $new_dms_pwd = md5($decryptedEmail);
                    $data = array(
                        'password' => $newPassword
                    );
                    $logData = array(
                        'account_id' => $user_id,
                        'prev_password' => $prevPwd,
                        'new_password' => $newPassword,
                        'action_by' => \Auth::user()->id,
                        'time' => Carbon::now()
                    );
                    $pwd_updated = User::find($user_id)->update($data);
                    if ($pwd_updated) {
                        insertRecord('tra_password_reset_logs', $logData);
                        deleteRecord('tra_failed_login_attempts', ['account_id'=> $user_id]);
                        //send email
                        $vars = array(
                                '{password}' => $password,
                                '{username}' => $encryptedEmail
                            );
                        $email_res = accountRegistrationEmail(3, $encryptedEmail, $password, '', $vars);
                        //update dms password too
                        // $alf_res = dmsUpdateAccountPassword($encryptedEmail, $prevPwd, $newPassword);
                        // if(!isset($alf_res['success']) || !$alf_res['success']){
                        //     return $alf_res;
                        // }
                        $res = array(
                            'success' => true,
                            'message' => 'Password was reset successfully!!'
                        );
                    } else {
                        $res = array(
                            'success' => false,
                            'message' => 'Problem encountered while resetting the password. Please try again!!'
                        );
                    }
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'Problem encountered while resetting the password-->User not found!!'
                    );
                }
            }, 5);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    function updateUserPassword(Request $req)
    {
        $res = array();
        try {
            DB::transaction(function () use ($req, &$res) {
                $user_id = $req->input('id');
                $newPassword = $req->input('new_pwd');
                $user_pass = $newPassword;
                $userData = User::find($user_id);
                if ($userData) {
                    $encryptedEmail = $userData->email;
                    //$dms_id = $userData->dms_id;
                    $uuid = $userData->uuid;
                    $prevPwd = $userData->password;
                    $newPassword = bcrypt(hashPwd($encryptedEmail, $uuid, $newPassword));
                    //$new_dms_pwd = md5($newPassword);
                    $data = array(
                        'password' => $newPassword
                    );
                    $logData = array(
                        'account_id' => $user_id,
                        'prev_password' => $prevPwd,
                        'new_password' => $newPassword,
                        'action_by' => \Auth::user()->id,
                        'time' => Carbon::now()
                    );
                    $pwd_updated = updateRecord('users', ['id'=>$user_id], $data);// User::find($user_id)->update($data);
                    if (isset($pwd_updated['success']) && $pwd_updated['success']) {
                        insertRecord('tra_password_reset_logs', $logData);
                        deleteRecord('tra_failed_login_attempts', ['account_id'=> $user_id]);
                        //update dms password too
                        // $alf_res = dmsUpdateAccountPassword($encryptedEmail, $prevPwd, $newPassword);
                        // if(!isset($alf_res['success']) || !$alf_res['success']){
                        //     return $alf_res;
                        // }
                        //send email
                        $vars = array(
                                '{password}' => $user_pass,
                                '{username}' => $encryptedEmail
                            );
                        $email_res = accountRegistrationEmail(3, $encryptedEmail, $user_pass, '', $vars);
                        $res = array(
                            'success' => true,
                            'message' => 'Password was reset successfully!!'
                        );
                    } else {
                        $res = array(
                            'success' => false,
                            'message' => 'Problem encountered while resetting the password. Please try again!!'
                        );
                    }
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'Problem encountered while resetting the password-->User not found!!'
                    );
                }
            }, 5);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    function changeUserPassword(Request $req)
    {
        $res = array();
        try {
            DB::beginTransaction();
                $user_id = $this->user_id;
                $newPassword = $req->input('new_password');
                $old_password = $req->input('old_password');
                $user_pass = $newPassword;
                $userData = User::find($user_id);
                if ($userData) {
                    $encryptedEmail = $userData->email;
                    //$dms_id = $userData->dms_id;
                    $uuid = $userData->uuid;
                    $prevPwd = $userData->password;
                    //verify password match
                    if($newPassword == $old_password){
                        return array(
                            'success' => false,
                            'message' => 'New Password Cant be same as old password'
                        );
                    }
                    //verify correct password
                    $old_password = hashPwd($encryptedEmail, $uuid, $old_password);
                    if (!Hash::check($old_password, $userData->password)) {
                        return array(
                            'success' => false,
                            'message' => 'Provided Old Password is incorrect'
                        );
                    }
                    //check prev pass and new pass
                    $used_pwds = DB::table('tra_password_reset_logs')->where('account_id', $user_id)->get();
                    $check_pass = false;
                    $nPassword = hashPwd($encryptedEmail, $uuid, $newPassword);
                    foreach ($used_pwds as $used_pwd) {
                        if (Hash::check($nPassword, $used_pwd->new_password)) {
                            $check_pass = true;
                        }
                    }
                    if($check_pass){
                        return array(
                            'success' => false,
                            'message' => 'Password cant be same with a previously used password'
                        );
                    }

                    //proceed to update
                    $newPassword = bcrypt(hashPwd($encryptedEmail, $uuid, $newPassword));

                    //$new_dms_pwd = md5($newPassword);
                    $data = array(
                        'password' => $newPassword
                    );
                    $logData = array(
                        'account_id' => $user_id,
                        'prev_password' => $prevPwd,
                        'new_password' => $newPassword,
                        'action_by' => \Auth::user()->id,
                        'time' => Carbon::now()
                    );
                    $pwd_updated = updateRecord('users', ['id'=>$user_id], $data);// User::find($user_id)->update($data);
                    if (isset($pwd_updated['success']) && $pwd_updated['success']) {
                        insertRecord('tra_password_reset_logs', $logData);
                        deleteRecord('tra_failed_login_attempts', ['account_id'=> $user_id]);
                        //update dms password too
                        // $alf_res = dmsUpdateAccountPassword($encryptedEmail, $prevPwd, $newPassword);
                        // if(!isset($alf_res['success']) || !$alf_res['success']){
                        //     return $alf_res;
                        // }
                        //send email
                        $vars = array(
                                '{password}' => $user_pass,
                                '{username}' => $encryptedEmail
                            );
                        $email_res = accountRegistrationEmail(5, $encryptedEmail, $user_pass, '', $vars);
                        $res = array(
                            'success' => true,
                            'message' => 'Password was changed successfully!! and Notification Email sent to your Email account'
                        );
                    } else {
                        $res = array(
                            'success' => false,
                            'message' => 'Problem encountered while resetting the password. Please try again!!'
                        );
                    }
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'Problem encountered while resetting the password-->User not found!!'
                    );
                }
            DB::commit();
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
     public function blockSystemUser(Request $req)
     {
         $user_id = $req->input('id');
         $email = $req->input('email');
         $reason = $req->input('reason');
         try {
             $params = array(
                 'account_id' => $user_id,
                 'email' => $email,
                 'reason' => $reason,
                 'action_by' => \Auth::user()->id,
                 'date' => Carbon::now()
             );
		 $check=insertRecord("tra_blocked_accounts",$params);

             $res = array(
                 'success' => true,
                 'message' => 'User blocked/deactivated successfully!!',
				 'ms'=> $check
             );
         } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

         }
         return response()->json($res);
     }

    public function unblockSystemUser(Request $req)
    {
        $user_id = $req->input('user_id');
        $reason = $req->input('reason');
        $res = array();
        try {
            DB::transaction(function () use ($user_id, $reason, &$res) {
                $blocking_details = DB::table('tra_blocked_accounts')
                    ->where('account_id', $user_id)
                    ->first();
                if (!is_null($blocking_details)) {
                    $unblock_details = array(
                        'account_id' => $blocking_details->account_id,
                        'email' => $blocking_details->email,
                        'date' => $blocking_details->date,
                        'action_by' => $blocking_details->action_by,
                        'reason' => $blocking_details->reason,
                        'unblock_reason' => $reason,
                        'unblock_by' => \Auth::user()->id,
                        'unblock_date' => Carbon::now()
                    );
                    //log unblock action
                    insertRecord('tra_unblocked_accounts', $unblock_details);
                    //remove blocked account entry
                    deleteRecord('tra_blocked_accounts', ['account_id' => $user_id]);
                    //reset login attempts
                    $where = array('account_id' => $user_id);
                    $update = array('attempt_status' => 2);
                    updateRecord('tra_failed_login_attempts', $where, $update);
                    $res = array(
                        'success' => true,
                        'message' => 'User activated successfully!!'
                    );
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'Anomaly encountered. Blocked user details not found!!'
                    );
                }
            }, 5);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
//api users

    public function getApiSystemUsers(Request $request)
    {
        $group_id = $request->input('group_id');
        try {
            $qry = DB::table('tra_api_users as t1')
                ->leftJoin('par_apiuser_categories as t5', 't1.apiuser_category_id', '=', 't5.id')

                ->select(DB::raw("t1.*,t5.name as category_name"));
            if (isset($group_id) && $group_id != '') {
                $users = DB::table('tra_user_group')
                    ->select('user_id')
                    ->where('group_id', $group_id)
                    ->get();
                $users = convertStdClassObjToArray($users);
                $users = convertAssArrayToSimpleArray($users, 'user_id');
                $qry->whereIn('t1.id', $users);
            }
            $results = $qry->get();
            $results = convertStdClassObjToArray($results);
            $results = decryptArray($results);
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function saveApiUserInformation(Request $req)
    {
        $res = array();
        DB::transaction(function () use ($req, &$res) {
            $user_id = \Auth::user()->id;

            $id = $req->input('id');
            $email = $req->input('email');

            $table_data = array(
                'mobile' => $req->input('mobile'),
                'phone' => $req->input('phone'),
                'apiuser_category_id' => $req->input('apiuser_category_id'),
            );

            $skip = $req->input('skip');
            $skipArray = explode(",", $skip);

            $table_data = encryptArray($table_data, $skipArray);

            $where = array(
                'id' => $id
            );
            $table_name = 'tra_api_users';
            try {
                if (isset($id) && $id != "") {
                    if (recordExists($table_name, $where)) {
                        $table_data['updated_at'] = Carbon::now();
                        $table_data['updated_by'] = $user_id;

                        $success = updateRecord($table_name, $where, $table_data);


                        if ($success === true) {
                            $res = array(
                                'success' => true,
                                'message' => 'Data updated Successfully!!'
                            );
                        } else {
                            $res = $success;
                        }
                    }
                } else {
                    //check if this email has been used before
                    $encryptedEmail = funcEncrypt($email);
                    $email_exists = DB::table('tra_api_users')
                        ->where('email', $encryptedEmail)
                        ->first();
                    if (!is_null($email_exists)) {
                        $res = array(
                            'success' => false,
                            'message' => 'This Email Address (' . $email . ') is already registered. Please use a different Email Address!!'
                        );
                        return response()->json($res);
                    }

                    $password = bin2hex(random_bytes(4));
                    $uuid = generateUniqID();//unique user ID
                    $pwd = bcrypt(hashPwd($encryptedEmail, $uuid, $password));
                    //add extra params
                    $table_data['email'] = $encryptedEmail;
                    $table_data['password'] = $pwd;
                    $table_data['uuid'] = $uuid;

                    //first lets send this user an email with random password to avoid having a user in the db who hasn't receive pwd
                    if (is_connected()) {
                        //send the mail here
                        $link = url('/');
                        $vars = array(
                            '{username}' => $email,
                            '{password}' => $password
                        );
                        $email_res = accountRegistrationEmail(6, $email, $password, $link, $vars);
                        if ($email_res['success'] == false) {
                            $res = $email_res;
                        }
                        else {
                            $table_data['created_at'] = Carbon::now();
                            $table_data['created_by'] = $user_id;
                            $results = insertRecord($table_name, $table_data);
                            if ($results['success'] == true) {
                                $insertId = $results['record_id'];
                                $res = array(
                                    'success' => true,
                                    'message' => 'User added successfully. Further account login credentials have been send to ' . $email . '. The user should check his/her email for login details!'
                                );
                            } else {
                                $res = $results;
                            }
                       }
                    } else {
                        $res = array(
                            'success' => false,
                            'message' => 'Whoops!! There is no internet connection. Check your connection then try again!!'
                        );
                    }
                }
            } catch (\Exception $e) {
                $res = array(
                    'success' => false,
                    'message' => $e->getMessage()
                );
            }
        }, 5);
        return response()->json($res);
    }
//     function activateSystemApiUser(request $req){
//         $user_id=$req->id;
//         $where = array(
//             'id' => $user_id
//         );
//         $previous_data = getPreviousRecords('tra_api_users', $where);
//         $table_data=$previous_data;

//         $previous_data=$previous_data['results'];
//         $previous_data=$previous_data;

//         unset($table_data['results'][0]['is_active']);
//         $table_data['results'][0]['is_active']=1;
//         $table_data=$table_data['results'];
//         $table_data=$table_data[0];
//         $success = updateRecord('tra_api_users', $previous_data, $where, $table_data, $user_id);

//          if ($success === true) {
//             $qry=DB::table('tra_blocked_accounts')
//                         ->where('account_id', $user_id)
//                         ->delete();
//             $res = array(
//                         'success' => true,
//                         'message' => 'User activated successfully!!'
//                     );
//          }else{
//              $res = array(
//                         'success' => false,
//                         'message' => $success
//                     );
//          }
//         return response()->json($res);
//     }
//     public function blockSystemApiUser(Request $req)
//     {
//         $user_id = $req->input('id');
//         $email = $req->input('email');
//         $reason = $req->input('reason');
//         try {
//             $params = array(
//                 'account_id' => $user_id,
//                 'email' => $email,
//                 'reason' => $reason,
//                 'action_by' => \Auth::user()->id,
//                 'date' => Carbon::now()
//             );
//             DB::table('tra_blocked_accounts')
//                 ->insert($params);
//             $res = array(
//                 'success' => true,
//                 'message' => 'User blocked/deactivated successfully!!'
//             );

//             DB::table('tra_api_users')
//             ->where('id', $user_id)
//             ->update(array('is_active' => 0));

//         } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

//         }
//         return response()->json($res);
//     }

// //exteral users

public function getExternalSystemUsers(request $req){
    try {
        $qry = DB::table('users as t1')
            ->leftJoin('par_titles as t2', 't1.title_id', '=', 't2.id')
            ->leftJoin('par_user_images as t3', 't1.id', '=', 't3.user_id')
            ->leftJoin('par_departments as t4', 't1.department_id', '=', 't4.id')
            ->leftJoin('par_branches as t5', 't1.branch_id', '=', 't5.id')
            ->leftJoin('tra_blocked_accounts as t6', 't1.id', '=', 't6.account_id')
            ->select(DB::raw("t1.*,t3.saved_name,t4.name as department_name,t5.name as zone_name"))
            ->where('t1.user_category_id',2);


            $results = $qry->get();
            $results = convertStdClassObjToArray($results);
            $results = decryptArray($results);

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }
 public function saveExternalUserInformation(Request $req)
    {
        $res = array();
        DB::transaction(function () use ($req, &$res) {
            $user_id = \Auth::user()->id;

            $id = $req->input('id');
            $email = $req->input('email');

            $table_data = array(
                'mobile' => $req->input('mobile'),
                'phone' => $req->input('phone'),
                'externaluser_category_id' => $req->input('externaluser_category_id'),
            );

            $skip = $req->input('skip');
            $skipArray = explode(",", $skip);

            $table_data = encryptArray($table_data, $skipArray);

            $where = array(
                'id' => $id
            );
            $table_name = 'tra_external_users';
            try {
                if (isset($id) && $id != "") {
                    if (recordExists($table_name, $where)) {
                        $table_data['updated_at'] = Carbon::now();
                        $table_data['updated_by'] = $user_id;

                        $success = updateRecord($table_name, $where, $table_data);


                        if ($success === true) {
                            $res = array(
                                'success' => true,
                                'message' => 'Data updated Successfully!!'
                            );
                        } else {
                            $res = $success;
                        }
                    }
                } else {
                    //check if this email has been used before
                    $encryptedEmail = funcEncrypt($email);
                    $email_exists = DB::table('tra_external_users')
                        ->where('email', $encryptedEmail)
                        ->first();
                    if (!is_null($email_exists)) {
                        $res = array(
                            'success' => false,
                            'message' => 'This Email Address (' . $email . ') is already registered. Please use a different Email Address!!'
                        );
                        return response()->json($res);
                    }

                    $password = bin2hex(random_bytes(4));
                    $uuid = generateUniqID();//unique user ID
                    $pwd = bcrypt(hashPwd($encryptedEmail, $uuid, $password));
                    //add extra params
                    $table_data['email'] = $encryptedEmail;
                    $table_data['password'] = $pwd;
                    $table_data['uuid'] = $uuid;

                    //first lets send this user an email with random password to avoid having a user in the db who hasn't receive pwd
                    if (is_connected()) {
                        //send the mail here
                        $link = url('/');
                        $vars = array(
                            '{username}' => $email,
                            '{password}' => $password
                        );
                        $email_res = accountRegistrationEmail(6, $email, $password, $link, $vars);
                        if ($email_res['success'] == false) {
                            $res = $email_res;
                        }  else {
                            $table_data['created_at'] = Carbon::now();
                            $table_data['created_by'] = $user_id;
                            $results = insertRecord($table_name, $table_data);
                            if ($results['success'] == true) {
                                $insertId = $results['record_id'];
                                $res = array(
                                    'success' => true,
                                    'message' => 'User added successfully. Further account login credentials have been send to ' . $email . '. The user should check his/her email for login details!'
                                );
                            } else {
                                $res = $results;
                            }
                        }
                    } else {
                        $res = array(
                            'success' => false,
                            'message' => 'Whoops!! There is no internet connection. Check your connection then try again!!'
                        );
                    }
                }
            } catch (\Exception $e) {
                $res = array(
                    'success' => false,
                    'message' => $e->getMessage()
                );
            }
        }, 5);
        return response()->json($res);
    }
//     public function saveExternalUsersDetails(Request $req){

//             $res = array();
//             DB::transaction(function () use ($req, &$res) {
//                 $user_id = \Auth::user()->id;

//                 $id = $req->input('id');
//                 $email = $req->input('email');

//                 $table_data = array(
//                     'mobile' => $req->input('mobile'),
//                     'phone' => $req->input('mobile'),
//                     'email' => $req->input('email'),
//                     'externaluser_category_id' => $req->input('externaluser_category_id'),
//                     'fullnames' => $req->input('fullnames'),
//                     'department' => $req->input('department'),
//                     'institution' => $req->input('institution'),
//                     'postal_address' => $req->input('postal_address'),
//                     'country_id' => $req->input('country_id')
//                 );

//                 $auth_tabledata = array('email' => $req->input('email'),
//                                 'fullnames' => $req->input('fullnames'),
//                                 'is_account_accessed'=>0,
//                                 'country_id' => $req->input('country_id'),
//                                 'telephone_no' => $req->input('mobile')
//                   );

//                 $skip = $req->input('skip');
//                 $skipArray = explode(",", $skip);

//                 $where = array(
//                     'id' => $id
//                 );
//                 $table_name = 'tra_tra_external_users';
//                 $portal_authorisationtable = 'wb_traderauthorised_users';

//                 try {
//                     if (isset($id) && $id != "") {
//                         if (recordExists($table_name, $where)) {
//                             $table_data['dola'] = Carbon::now();
//                             $table_data['updated_by'] = $user_id;

//                             $previous_data = getPreviousRecords($table_name, $where);
//                             if ($previous_data['success'] == false) {
//                                 return $previous_data;
//                             }
//                             $previous_data = $previous_data['results'];
//                             $success = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);

//                             //update the authentication details too
//                             $auth_tabledata['dola'] = Carbon::now();
//                             $auth_tabledata['updated_by'] = $user_id;
//                             //
//                             $where = array(
//                                 'email' => $email
//                             );
//                             $previous_data = getPreviousRecords($portal_authorisationtable, $where,'portal_db');
//                             updateRecord($portal_authorisationtable, $previous_data, $where, $auth_tabledata, $user_id,'portal_db');

//                             if ($success === true) {
//                                 $res = array(
//                                     'success' => true,
//                                     'message' => 'Data updated Successfully!!'
//                                 );
//                             } else {
//                                 $res = $success;
//                             }
//                         }
//                     } else {
//                         $email_exists = DB::table($table_name)
//                             ->where('email', $email)
//                             ->first();
//                             if (!is_null($email_exists)) {
//                                 $res = array(
//                                     'success' => false,
//                                     'message' => 'This Email Address (' . $email . ') is already registered. Please use a different Email Address!!'
//                                 );
//                                 return response()->json($res);
//                             }

//                                 $table_data['created_on'] = Carbon::now();
//                                 $table_data['created_by'] = $user_id;
//                                 $results = insertRecord($table_name, $table_data, $user_id);
//                                 if ($results['success'] == true) {

//                                     $insertId = $results['record_id'];
//                                     $auth_tabledata['mis_external_user_id'] = $insertId;
//                                     $auth_tabledata['created_on'] = Carbon::now();
//                                     $auth_tabledata['created_by'] = $user_id;
//                                     $results = insertRecord($portal_authorisationtable, $auth_tabledata, $user_id,'portal_db');

//                                     $res = array(
//                                         'success' => true,
//                                         'data'=>$results,
//                                         'message' => 'User added successfully. User will receive Email Notification Upon assignement of applications.'
//                                     );
//                                 } else {
//                                     $res = array(
//                                         'success' => false,
//                                         'message' => $results['message']
//                                     );
//                                 }
//                     }
//                 } catch (\Exception $e) {
//                     $res = array(
//                         'success' => false,
//                         'message' => $e->getMessage()
//                     );
//                 }
//             }, 5);
//             return response()->json($res);


//     }
//     function activateSystemExternalUser(request $req){
//         $user_id=$req->id;
//         $where = array(
//             'id' => $user_id
//         );
//         $previous_data = getPreviousRecords('tra_external_users', $where);
//         $table_data=$previous_data;

//         $previous_data=$previous_data['results'];
//         $previous_data=$previous_data;

//         unset($table_data['results'][0]['is_active']);
//         $table_data['results'][0]['is_active']=1;
//         $table_data=$table_data['results'];
//         $table_data=$table_data[0];
//         $success = updateRecord('tra_external_users', $previous_data, $where, $table_data, $user_id);

//          if ($success === true) {
//             $qry=DB::table('tra_blocked_accounts')
//                         ->where('account_id', $user_id)
//                         ->delete();
//             $res = array(
//                         'success' => true,
//                         'message' => 'User activated successfully!!'
//                     );
//          }else{
//              $res = array(
//                         'success' => false,
//                         'message' => $success
//                     );
//          }
//         return response()->json($res);
//     }
//     public function blockSystemExternalUser(Request $req)
//     {
//         $user_id = $req->input('id');
//         $email = $req->input('email');
//         $reason = $req->input('reason');
//         try {
//             $params = array(
//                 'account_id' => $user_id,
//                 'email' => $email,
//                 'reason' => $reason,
//                 'action_by' => \Auth::user()->id,
//                 'date' => Carbon::now()
//             );
//             DB::table('tra_blocked_accounts')
//                 ->insert($params);
//             $res = array(
//                 'success' => true,
//                 'message' => 'User blocked/deactivated successfully!!'
//             );

//             DB::table('tra_external_users')
//             ->where('id', $user_id)
//             ->update(array('is_active' => 0));

//         } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

//         }
//         return response()->json($res);
//     }


public function getResubmissionApplications(Request $request)
    {
        $user_id = \Auth::user()->id;

        $whereClauses ='';
        $filter = $request->input('reference');
        if (isset($filter)) {
                $whereClauses = "t1.reference_no LIKE '%".$filter."%' OR t1.tracking_no LIKE '%".$filter."%'";
            }
        try {
            $qry = DB::table('tra_submissions as t1')
                ->join('wf_processes as t2', 't1.process_id', '=', 't2.id')
                ->join('wf_workflow_stages as t3', 't1.previous_stage', '=', 't3.id')
                ->join('wf_workflow_stages as t4', 't1.current_stage', '=', 't4.id')
                ->leftJoin('par_system_statuses as t5', 't1.application_status_id', '=', 't5.id')
                ->leftJoin('par_sub_modules as t6','t1.sub_module_id','t6.id')
                ->leftJoin('users as t7', 't1.usr_from', '=', 't7.id')
                ->leftJoin('users as t8', 't1.usr_to', '=', 't8.id')
                ->leftJoin('users as t88', 't1.released_by', '=', 't88.id')
                ->leftJoin('wb_trader_account as t9', 't1.applicant_id', '=', 't9.id')
                ->leftJoin('par_modules as t10', 't1.module_id', '=', 't10.id')
                ->select(DB::raw("t1.*, t1.current_stage as workflow_stage_id,t3.workflow_id, t2.name as process_name, t3.name as previous_process, t4.name as current_process,t5.name as application_status,t6.name as sub_module_name,
                    CONCAT(decryptval(t7.first_name,".getDecryptFunParams()."),' ',decryptval(t7.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),' ',decryptval(t8.last_name,".getDecryptFunParams().")) as to_user,CONCAT(decryptval(t88.first_name,".getDecryptFunParams()."),' ',decryptval(t88.last_name,".getDecryptFunParams().")) as submitted_by,
                    t9.name as applicant,t10.name as module_name,t1.module_id as module_id, t1.id as submission_id"))
                ->where('t4.stage_status','<>',3);
            if($whereClauses != ''){
                $qry->whereRaw($whereClauses);
            }
            $qry->orderBy('t1.id', 'desc');
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
public function getTaskReassignmentApplications(Request $request)
    {
        $user_id = \Auth::user()->id;

        $whereClauses ='';
        $filter = $request->input('user_id');
        if (validateIsNumeric($filter)) {
                $whereClauses = "t1.usr_to = ".$filter;
            }
        try {
            $qry = DB::table('tra_submissions as t1')
                ->join('wf_processes as t2', 't1.process_id', '=', 't2.id')
                ->leftJoin('wf_workflow_stages as t3', 't1.previous_stage', '=', 't3.id')
                ->leftJoin('wf_workflow_stages as t4', 't1.current_stage', '=', 't4.id')
                ->leftJoin('par_system_statuses as t5', 't1.application_status_id', '=', 't5.id')
                ->leftJoin('par_sub_modules as t6','t1.sub_module_id','t6.id')
                ->leftJoin('users as t8', 't1.usr_to', '=', 't8.id')
                ->leftJoin('wb_trader_account as t9', 't1.applicant_id', '=', 't9.id')
                ->leftJoin('par_modules as t10', 't1.module_id', '=', 't10.id')
                ->select(DB::raw("t1.*, t1.current_stage as workflow_stage_id,t2.name as process_name,t3.name as prev_stage, t4.name as current_stage,t6.name as sub_module_name,
                   CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."), ' ', decryptval(t8.last_name,".getDecryptFunParams().")) as full_name,
                    t9.name as applicant,t10.name as module_name"))
                    // CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."), ' ', decryptval(t8.last_name,".getDecryptFunParams().")) as full_name
                //->where('usr_to', $user_id)
                ->where('is_done', 0);
            if($whereClauses != ''){
                $qry->whereRaw($whereClauses);
            }
            $qry->orderBy('t1.id', 'desc');
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    function getUserList(Request $req){
        $qry=DB::table('users')
            ->select(DB::raw("id,CONCAT(decryptval(first_name,".getDecryptFunParams()."),' ',decryptval(last_name,".getDecryptFunParams().")) as name"))
            ->get();
            $res= array(
                'success'=> true,
                'results'=> $qry,
                'message'=> 'All is well'
            );
            return \response()->json($res);
    }
    function getUpdateInfo(Request $req){
        $user_id = \Auth::user()->id;
        $qry=DB::table('users')
              ->leftjoin('par_user_images as t2','users.id','t2.user_id')
               ->select(DB::raw("users.*,decryptval(last_name,".getDecryptFunParams().") as last_name,decryptval(first_name,".getDecryptFunParams().") as first_name,decryptval(mobile,".getDecryptFunParams().") as mobile,decryptval(phone,".getDecryptFunParams().") as phone,t2.saved_name as profile_photo"));

        $qry->where('users.id',$user_id);
            // if(validateIsNumeric($user_id)){
            //     $qry->where('users.id',$user_id);
            // }
            $results = $qry->first();
        $res= array(
                'success'=> true,
                'results'=> $results,
                'message'=> 'All is well'
            );
            return \response()->json($res);
    }

    function getActingUsersPositionDetails(Request $req){
        $filter = $req->input('filter');

        $date_from = $req->input('date_from');
        $date_to = $req->input('date_to');

        $start = $req->input('start');
        $limit = $req->input('limit');
        try {
            $whereClauses = array();
            $filter_string = '';
            if (isset($filter)) {
                $filters = json_decode($filter);
                if ($filters != NULL) {
                    foreach ($filters as $filter) {
                        switch ($filter->property) {
                            case 'acting_reason' :
                                $whereClauses[] = "t6.name like '%" . ($filter->value) . "%'";
                                break;
                            case 'group_name' :
                                $whereClauses[] = "t5.name like '%" . ($filter->value) . "%'";
                                break;
                            case 'email_address' :
                                $whereClauses[] = "decryptval(t3.email,'".env('encryption_key')."','".env('encrytion_iv')."') like '%" . ($filter->value) . "%'";

                                break;
                                case 'full_names' :
                                $whereClauses[] = "decryptval(t3.first_name,'".env('encryption_key')."','".env('encrytion_iv')."') like '%" . ($filter->value) . "%'";
                                break;

                        }
                    }
                    $whereClauses = array_filter($whereClauses);
                }
                if (!empty($whereClauses)) {
                    $filter_string = implode(' AND ', $whereClauses);
                }

            }

        $qry=DB::table('tra_actingposition_management as t1')
                ->join('users as t2', 't1.actingfor_user_id','t2.id')
                ->join('users as t3', 't1.user_id','t3.id')
                ->join('users as t4', 't1.requested_by_id','t4.id')

                ->join('users as t7', 't1.created_by','t7.id')
                ->join('par_groups as t5', 't1.group_id','t5.id')
                ->join('par_acting_reasons as t6', 't1.acting_reason_id','t6.id')
                ->select(DB::raw("t1.*,t5.name as group_name, t6.name as acting_reason,decryptval(t3.email,'".env('encryption_key')."','".env('encrytion_iv')."') as email_address, CONCAT(' ',decryptval(t4.first_name,".getDecryptFunParams()."),decryptval(t4.last_name ,".getDecryptFunParams().")) as requested_by,
                CONCAT(' ',decryptval(t3.first_name,".getDecryptFunParams()."),decryptval(t3.last_name,".getDecryptFunParams().")) as full_names, CONCAT(' ',decryptval(t2.first_name,".getDecryptFunParams().")
                ,decryptval(t2.last_name,".getDecryptFunParams().")) as acting_fromuser,  CONCAT(' ',decryptval(t7.first_name,".getDecryptFunParams()."),decryptval(t7.last_name,".getDecryptFunParams().")) as effected_by"))
                ->orderBy('t1.id','desc');
                if ($filter_string != '') {
                    $qry->whereRAW($filter_string);
                }
                if($date_from != '' && $date_to != ''){
                    $qry->whereRAW(" (acting_date_from between '".$date_from."' and '".$date_to."') or (acting_date_to between '".$date_from."' and '".$date_to."')");
                }
                $count = $qry->get()->count();
                $records = $qry->skip($start)->take($limit)->get();
                  $res = array(
                        'success' => true,
                        'results' => $records,
                        'totals' => $count,
                        'message' => 'All is well'
                );


        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    function applicationResubmissionVisibleRequest(request $req){
        $submission_id = $req->submission_id;
        $reason = $req->reason;
        $application_code = $req->application_code;
       $module_id = $req->module_id;
        $workflow_stage_id = $req->workflow_stage_id;
        $user_id = \Auth::user()->id;

        DB::beginTransaction();
        try {
            $submission_data = DB::table('tra_submissions')->where('id',$submission_id)->first();
            $submission_dataArray=(array)$submission_data;
            //create new record and update submission
            $submission_dataArray['is_read']=0;
            $submission_dataArray['is_done']=0;

            $submission_dataArray['date_received']=Carbon::now();
            //unset primary key
            unset($submission_dataArray['id']);
            unset($submission_dataArray['altered_by']);
            unset($submission_dataArray['dola']);
            //insert
            $success=insertRecord('tra_submissions',$submission_dataArray);
            $newSubmission_id=$success['record_id'];

            //get app table
            $application_table= getTableName($submission_dataArray['module_id']);
            $where = array('application_code'=>$submission_dataArray['application_code']);
            if($success['success']){
                //get the existing table data and prepare for update
                $previous_data = getPreviousRecords($application_table, $where);
                $table_data=$previous_data;
                $previous_data=$previous_data['results'];
                $previous_data=$previous_data;

                //unset($table_data['results'][0]['workflow_stage_id']);
                $table_data['results'][0]['workflow_stage_id']=$submission_dataArray['current_stage'];
                $table_data=$table_data['results'];

                $table_data=$table_data[0];

                $success = updateRecord($application_table, $where, $table_data);
                if($success){

                    //update the current submission record
                    $test=DB::table('tra_submissions')
                            ->where("application_code", $submission_dataArray['application_code'])
                            ->where('id','!=',$newSubmission_id)
                            ->update(array("is_done"=>1));

                    //log
                    DB::table('tra_applicationprocess_alterations')->insert(Array(
                        'submission_id'=>$newSubmission_id,
                        'effected_by'=>$user_id,
                        'task_type_id'=>1,
                        'effected_on'=>Carbon::now(),
                        'reason'=>$reason
                    ));
                    $res = array(
                        'success'=> true,
                        'message'=> 'Resubmitted Successfully!!!'
                     );
                }else{
                   DB::rollBack();
                }

            }else{
                DB::rollBack();
                $res = array(
                        'success'=> false,
                        'results' => $success,
                        'message'=> 'Failed please try again'
                     );
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        DB::commit();
       return \response()->json($res);

    }

     function applicationResubmissionHideRequest(request $req){
        $submission_id = $req->submission_id;
       $reason = $req->reason;
        $application_code = $req->application_code;
        $module_id = $req->module_id;
        $workflow_stage_id = $req->workflow_stage_id;
        $current_stage = $req->current_stage;
        $user_id = \Auth::user()->id;

        try {
            $submission_data = DB::table('tra_submissions')->where('id',$submission_id)->first();
            $submission_dataArray=(array)$submission_data;
            //create new record and update submission
            $submission_dataArray['is_read']=1;
            $submission_dataArray['is_done']=1;

            $submission_dataArray['date_received']=Carbon::now();
            //unset primary key
            unset($submission_dataArray['id']);
            //insert
            $success=insertRecord('tra_submissions',$submission_dataArray, $user_id);
            $newSubmission_id=$success['record_id'];

            //get app table
            $application_table= $this->getTableName($module_id);
            $where = array('application_code'=>$application_code);
            if($success['success']){
                //get the existing table data and prepare for update
                $previous_data = getPreviousRecords($application_table, $where);
                $table_data=$previous_data;
                $previous_data=$previous_data['results'];
                $previous_data=$previous_data;

                unset($table_data['results']['workflow_stage_id']);
                $table_data['results']['workflow_stage_id']=$workflow_stage_id;
                $table_data=$table_data['results'];
                $table_data=$table_data;
                $success = updateRecord($application_table, $where, $table_data, $user_id);
                if($success){
                    // update the current submission record
                    DB::table('tra_submissions')->where(array('application_code'=>$application_code,'current_stage'=>$current_stage))->update(array('is_done'=>1));
                    // log
                    DB::table('tra_applicationprocess_alterations')->insert(Array(
                        'submission_id'=>$newSubmission_id,
                        'effected_by'=>$user_id,
                        'task_type_id'=>1,
                        'effected_on'=>Carbon::now(),
                        'reason'=>$reason
                    ));

            $qry=DB::table('tra_submissions')->where('id',$submission_id)->update(['is_done'=>1]);

            if($qry){
                    $res = array(
                        'success'=> true,
                        'message'=> 'Resubmitted Successfully!!!'
                     );
                }else{
                   $res = array(
                        'success'=> false,
                        'results' => $qry,
                        'message'=> 'Resubmitted Successfully!!!'
                     );
                }

            }else{
                $res = array(
                        'success'=> false,
                        'results' => $success,
                        'message'=> 'Failed please try again'
                     );
            }

        }
    }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

       return \response()->json($res);

    }

public function getOnlineResubmissionApplications(Request $request)
    {
        $user_id = \Auth::user()->id;

        $whereClauses ='';
        $filter = $request->input('reference');
        if (isset($filter)) {
                $whereClauses = "t1.reference_no LIKE '%".$filter."%' OR t1.tracking_no LIKE '%".$filter."%'";
            }

        try {

            $qry = DB::table('tra_onlinesubmissions as t1')
                ->join('wf_processes as t2', 't1.process_id', '=', 't2.id')
                ->join('wf_workflow_stages as t4', 't1.current_stage', '=', 't4.id')
                ->leftJoin('par_system_statuses as t5', 't1.application_status_id', '=', 't5.id')
                ->leftJoin('par_sub_modules as t6','t1.sub_module_id','t6.id')
                ->leftJoin('wb_trader_account as t9', 't1.applicant_id', '=', 't9.id')
                ->leftJoin('par_modules as t10', 't1.module_id', '=', 't10.id')
                ->select(DB::raw("t1.*, t1.current_stage as workflow_stage_id,t2.name as process_name, t4.name as current_process,t5.name as application_status,t6.name as sub_module_name,
                    t9.name as applicant,t10.name as module_name"));

            if($whereClauses != ''){
                $qry->whereRaw($whereClauses);
            }
            $qry->orderBy('t1.id', 'desc');
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

// public function onlineResubmissionRequest(Request $req){

//         $submission_id = $req->submission_id;
//         $reason = $req->reason;
//         $status = $req->status;
//         $status = 1;
//         $user_id = \Auth::user()->id;
//         DB::beginTransaction();
//         try {

//             $submission_dataArray = (array) DB::table('tra_onlinesubmissions')->where('id',$submission_id)->first();

//             unset($submission_dataArray['id']);
//             unset($submission_dataArray['created_by']);
//             unset($submission_dataArray['date_released']);
//             unset($submission_dataArray['date_submitted']);
//             unset($submission_dataArray['altered_by']);
//             unset($submission_dataArray['dola']);

//             //create new record and update submission
//             $submission_dataArray['is_read']=0;
//            // $submission_dataArray['is_done']=0;

//             $submission_dataArray['date_submitted']=Carbon::now();

//             //insert
//             $success=insertRecord('tra_onlinesubmissions',$submission_dataArray, $user_id, 'mysql');
//             $newSubmission_id=$success['record_id'];

//             //get app table
//             $application_table= $this->getTableName($submission_dataArray['module_id'], 1);
//             $where = array('application_code'=>$submission_dataArray['application_code']);
//             if($success['success']){

//                 //get the existing table data and prepare for update
//                 $previous_data = getPreviousRecords($application_table, $where, 'portal_db');

//                 $table_data=$previous_data;
//                 $previous_data=$previous_data['results'];
//                 $previous_data=$previous_data;

//                 //unset($table_data['results'][0]['workflow_stage_id']);
//                 $table_data['results'][0]['application_status_id']=$submission_dataArray['application_status_id'];
//                 $table_data=$table_data['results'];

//                 $table_data=$table_data[0];

//                 $success = updateRecord($application_table, $previous_data, $where, $table_data, $user_id, 'portal_db');
//                 if($success){

//                     //update the current submission record
//                     $test=DB::table('tra_onlinesubmissions')
//                             ->where("application_code", $submission_dataArray['application_code'])
//                             ->where('id','!=',$newSubmission_id)
//                             ->update(array("is_done"=>1));

//                     //log
//                     DB::table('tra_applicationprocess_alterations')->insert(Array(
//                         'submission_id'=>$newSubmission_id,
//                         'effected_by'=>$user_id,
//                         'task_type_id'=>1,
//                         'effected_on'=>Carbon::now(),
//                         'reason'=>$reason
//                     ));
//                     $res = array(
//                         'success'=> true,
//                         'message'=> 'Resubmitted Successfully!!!'
//                      );
//                 }else{
//                    DB::rollBack();
//                 }

//             }else{
//                 DB::rollBack();
//                 $res = array(
//                         'success'=> false,
//                         'results' => $success,
//                         'message'=> 'Failed please try again'
//                      );
//             }

//         } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         } catch (\Throwable $throwable) {
//             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         }
//         DB::commit();
//        return \response()->json($res);

//     }
public function doReassignApplicationTask(request $req){
        $submission_id = $req->submission_id;
        $application_code = $req->application_code;
        $reason = $req->reassignment_reason;

        $module_id = $req->module_id;

        $workflow_stage_id = $req->workflow_stage_id;
        $submission_id = $req->id;

        $assaigned_user_id = $req->responsible_user_id;
        $user_id = \Auth::user()->id;

        try {
            $submission_data = DB::table('tra_submissions')->where('id',$submission_id)->first();
            $submission_dataArray=(array)$submission_data;
            //create new record and update submission
            $submission_dataArray['usr_to']=$assaigned_user_id;
            //create new record and update submission
            $submission_dataArray['is_read']=0;
            $submission_dataArray['is_done']=0;

            $submission_dataArray['date_received']=Carbon::now();
            //unset primary key
            unset($submission_dataArray['id']);
            //insert
            $success=insertRecord('tra_submissions',$submission_dataArray, $user_id);
            $newSubmission_id=$success['record_id'];
           if($success['success']){
            //update the current submission record
             DB::table('tra_submissions')->where(['id'=>$submission_id])->update(['is_done'=>1,'is_read'=>1]);
            //log
            DB::table('tra_applicationprocess_alterations')->insert(array(
                        'submission_id'=>$newSubmission_id,
                        'effected_by'=>$user_id,
                        'task_type_id'=>2,
                        'effected_on'=>Carbon::now(),
                        'reason'=>$reason
                    ));
                    $res = array(
                        'success'=> true,
                        'message'=> 'Reassigned Successfully!!!'
                     );
                }else{
                    $res = array(
                            'success'=> false,
                            'results' => $success,
                            'message'=> 'Failed, please try again'
                         );
                  }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

       return \response()->json($res);
}

      function getTableName($module, $portal_db = 0){

          $qry=DB::table('par_modules')
                ->where('id',$module)->first();

        if($portal_db){
          $table=$qry->portaltable_name;
        }else{
          $table=$qry->tablename;;
        }

        return $table;
   }
//    public function getRegionalIntegrationUsers(Request $req)
//    {
//        $users = DB::table('tra_regional_integrationusers as t1')
//             ->leftJoin('par_countries as t2','t1.country_id','t2.id')
//             ->leftJoin('par_regional_authorities as t4','t1.country_id','t4.id')
//             ->leftJoin('par_assessment_procedures as t3','t1.assessment_procedure_id','t3.id')
//             ->leftJoin('par_gmp_assessment_types as t5','t1.gmpassessment_procedure_id','t5.id')
//             ->select('t1.*','t2.name as country_name','t4.name as regional_authority','t3.name as assessment_procedure','t5.name as gmpassessment_procedure')
//             ->get();

//         return $users;
//    }

//    public function saveRegionalIntegrationUsers(Request $req){
//      try{
//             $id = $req->id;
//             $user_id = '';
//             $status_id = $req->status_id;
//             $email =$req->email;
//             if(\Auth::user()){
//                 $user_id = \Auth::user()->id;
//             }

//             $table_name = 'tra_regional_integrationusers';
//             $where = array('id'=>$id);
//             $trader_data = $req->all();

//             unset($trader_data['portal_id']);
//             unset($trader_data['_token']);
//             $res = array();
//             unset($trader_data['id']);
//             unset($trader_data['model']);

//             if (validateIsNumeric($id)) {

//                 if (recordExists($table_name, $where)) {

//                     $trader_data['dola'] = Carbon::now();
//                     $trader_data['altered_by'] = $user_id;
//                     $previous_data = getPreviousRecords($table_name, $where);
//                     if ($previous_data['success'] == false) {
//                         return $previous_data;
//                     }

//                     $previous_data = $previous_data['results'];

//                     //dms function call with validation
//                     $account_email = $previous_data[0]['email'];
//                     $res = updateRecord($table_name, $previous_data, $where, $trader_data, $user_id);
//                     $regional_integrationuser_id = $previous_data[0]['id'];

//                     //save account users details
//                     if($account_email != $email){
//                         $where_user = array('regional_integrationuser_id'=>$regional_integrationuser_id, 'email'=>$account_email);
//                         $user_passwordData = str_random(8);
//                         //had code for test
//                         $password = str_random(8);
//                        // $user_password = 'slams123';
//                         $uuid = generateUniqID();//unique user ID
//                         $user_password = hashPwd($email, $uuid, $user_passwordData);

//                         $user_data = array('email'=> $email,
//                                       'password'=>$user_password,
//                                       'uuid'=>$uuid,
//                                       'status_id'=>1,//as actve
//                                       'account_roles_id'=>1,
//                                       'created_by'=>'System',
//                                       'created_on'=>date('Y-m-d H:i:s')
//                                  );
//                                  $previous_data = getPreviousRecords('wb_traderauthorised_users', $where_user, 'portal_db');
//                         if($previous_data['success']){
//                             $previous_data = $previous_data['results'];
//                             updateRecord('wb_traderauthorised_users', $previous_data, $where_user, $user_data, $user_id,'portal_db');
//                             //send a notificaiton

//                         }


//                     }

//                     if($res['success']){
//                         $res['message'] ='User Account details Updated Successfully';
//                     }
//                 }
//             }else{
//                 $trader_data['created_at'] = Carbon::now();
//                 $results = insertRecord($table_name, $trader_data, $user_id);

//                 if ($results['success'] == true) {
//                     $insertId = $results['record_id'];
//                     $table_name = 'wb_traderauthorised_users';
//                     $trader_data['fullnames'] = $trader_data['name'];
//                     $trader_data['created_on'] = $trader_data['created_at'];
//                     unset($trader_data['name']);
//                     unset($trader_data['created_at']);
//                     unset($trader_data['postal_address']);
//                     unset($trader_data['assessment_procedure_id']);
//                     unset($trader_data['gmpassessment_procedure_id']);
//                     unset($trader_data['regional_authority_id']);
//                     //password
//                     $user_passwordData = str_random(8);
//                     //had code for test
//                     $password = str_random(8);
//                    // $user_password = 'slams123';
//                     $uuid = generateUniqID();//unique user ID
//                     $user_password = hashPwd($email, $uuid, $user_passwordData);

//                     $trader_data['password'] = $user_password;
//                     $results = insertRecord($table_name, $trader_data, $user_id,'portal_db');

//                     if ($results['success'] == true) {
//                            $res = array(
//                                'success' => true,
//                                'message'=>'all is well',
//                                'record_id' =>$insertId
//                             );
//                            //notification
//                         if (is_connected()) {
//                             //send the mail here
//                             $link = url('/');
//                             $vars = array(
//                                 '{username}' => $email,
//                                 '{password}' => $user_passwordData
//                             );
//                         //notification
//                         sendTemplatedApplicationNotificationEmail(6, $email, $vars);


//                      }
//                     }else{
//                         $res = array(
//                                'success' => false,
//                                'message1'=>'failed to save, try again',
//                                'record_id' =>$insertId
//                             );
//                     }
//                 }else{
//                     $res = array(
//                                'success' => false,
//                                'message2'=>'failed to save, try again',
//                                'record_id' =>'not set'
//                             );
//                 }
//             }
//         } catch (\Exception $exception) {
//             $res = array(
//                 'success' => false,
//             //  'message1'=>$previous_data,
//                 'message' => $exception->getMessage()
//             );
//         } catch (\Throwable $throwable) {
//             $res = array(
//                 'success' => false,//'message1'=>$previous_data,
//                 'message' => $throwable->getMessage()
//             );
//         }
//     return response()->json($res);
//    }

//    public function showHideonlineResubmissionRequest(Request $req){
//         $submission_id = $req->submission_id;
//         $action_type = $req->action_type;
//         $user_id = \Auth::user()->id;
//         $table_name = 'tra_onlinesubmissions';
//         $where = array('id' => $submission_id);
//         DB::beginTransaction();
//         try{
//             if(validateIsNumeric($action_type)){
//                 if($action_type == 1){
//                     $previous_data = getPreviousRecords($table_name, $where);
//                         if ($previous_data['success'] == false) {
//                             return $previous_data;
//                         }
//                     $previous_data = $previous_data['results'];
//                     $table_data = array('application_status_id' => 1);
//                     $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);
//                 }
//                 if($action_type == 2){
//                     $previous_data = getPreviousRecords($table_name, $where);
//                         if ($previous_data['success'] == false) {
//                             return $previous_data;
//                         }
//                     $previous_data = $previous_data['results'];
//                     $table_data = array('application_status_id' => 2);
//                     $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);
//                 }
//             }
//             else{
//                  $res = array(
//                     'success' => false,
//                     'message' => 'Parameters not passed as expected'
//                 );
//             }
//           } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         } catch (\Throwable $throwable) {
//             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         }
//         return \response()->json($res);
//    }
   public function getUserPasswordResetLogs(Request $req){
        $user_id = $req->user_id;

        $qry = DB::table('tra_password_reset_logs as t1')
                ->join('users as t2', 't1.account_id', 't2.id')
                ->join('users as t3', 't1.action_by', 't3.id')
                ->select('t1.*','t3.email as reset_by','t1.time as reset_date');

        if(validateIsNumeric($user_id)){
            $qry->where('t1.account_id', $user_id);
        }
        $results = $qry->get();
         $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        return \response()->json($res);
   }
//    public function getUserDetailsUpdateLogs(Request $request)
//    {
//       $user_id = $request->input('user_id');
//         try {
//             $qry = DB::table('users_logs as t1')
//                 ->leftJoin('par_titles as t2', 't1.title_id', '=', 't2.id')
//                 ->leftJoin('par_user_images as t3', 't1.id', '=', 't3.user_id')
//                 ->leftJoin('par_departments as t4', 't1.department_id', '=', 't4.id')
//                 ->leftJoin('par_branches as t5', 't1.branch_id', '=', 't5.id')
//                 ->leftJoin('tra_user_group as t7','t1.id','t7.user_id')
//                 ->leftJoin('users as t8','t1.updated_by','t8.updated_by')
//                 ->select(DB::raw("t1.*,CONCAT_WS(' ',t2.name,decrypt(t1.first_name),decrypt(t1.last_name)) as fullnames,decrypt(t1.email) as email,
//                                    t1.last_login_time,t3.saved_name,t4.name as department_name,t5.name as zone_name, t7.id as group_id, CONCAT_WS(' ',t2.name,decrypt(t1.first_name),decrypt(t1.last_name)) as updated_by"));


//             if(validateIsNumeric($user_id)){
//                 $qry->where('t1.user_id',$user_id);
//             }

//             $results = $qry->get();
//             $results = convertStdClassObjToArray($results);
//             $results = decryptArray($results);
//             $res = array(
//                 'success' => true,
//                 'results' => $results,
//                 'message' => 'All is well'
//             );
//         } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

//         } catch (\Throwable $throwable) {
//             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         }
//         return response()->json($res);
//     }
public function getUserGroupsdetails(Request $req){
    try{
        $user_id = $req->user_id;
        $qry = DB::table('tra_user_group as t1')
                    ->join('par_groups as t2','t1.group_id','=','t2.id')
                    ->select('t2.*')
                    ->where('user_id',$user_id);
                    $results = $qry->get();
                    $res = array(
                        'success' => true,
                        'results' => $results,
                        'message' => returnMessage($results)
                    );

    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return response()->json($res);


}
public function assignUsertoEnquiryApplication(Request $req){
    $submission_id = $req->submission_id;
    $to_usr = $req->to_user;
	$process_id = $req->process_id;
	$prodclass_category_id = $req->prodclass_category_id;
    $current_stage = $req->current_stage;
    $user_id = \Auth::user()->id;
    $res = array();
    try{
		$data = array();
		if(validateIsNumeric($process_id)){
			$data['process_id'] = $process_id;
		}
		if(validateIsNumeric($prodclass_category_id)){
			$data['prodclass_category_id'] = $prodclass_category_id;
		}
		if(validateIsNumeric($to_usr)){
			$data['usr_to'] = $to_usr;
		}
		if(validateIsNumeric($current_stage)){
			$data['current_stage'] = $current_stage;
		}
		$table_name = 'tra_submissions';
		$where = array('id'=>$submission_id);
		$record = DB::table($table_name)->where($where)->first();

		if ($record) {
                    $module_id = $record->module_id;
					$application_code = $record->application_code;
					$apptable_name = getSingleRecordColValue('par_modules', array('id' => $module_id), 'tablename');

                    $data['dola'] = Carbon::now();
                    $data['altered_by'] = $user_id;
                    $res = updateRecord($table_name, $where, $data, $user_id);
					if($res['success']){
						if(validateIsNumeric($process_id)){
							$data['process_id'] = $process_id;
							DB::table($apptable_name)
								->where(array('application_code'=>$application_code))
								->update(array('process_id'=>$process_id));
							if($module_id == 1 && validateIsNumeric($prodclass_category_id)){
								$product_id = getSingleRecordColValue($apptable_name, array('application_code' => $application_code), 'product_id');
								DB::table($apptable_name)
								->where(array('id'=>$product_id))
								->update(array('prodclass_category_id'=>$prodclass_category_id));
							}
						}
						$res = array(
							'success' => true,
							'message' => "Submission Details updated successfully"
						);
					}

        }else{
			$res = array(
                'success' => false,
                'message' => "Submission Details not found"
            );
		}


   }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
          return \response()->json($res);
}
public function getPortalAppSubmissions(Request $request){
    $user_id = \Auth::user()->id;

    $whereClauses ='';
    $reference = $request->input('reference');
    if (isset($reference) && $reference != '') {
            $whereClauses = "t1.reference_no LIKE '%".$reference."%' OR t1.tracking_no LIKE '%".$reference."%'";
        }else{
            return array('success' => false,'message' => 'Please provide a reference_no/tracking_no' );
        }

    try {

        $qry = DB::Connection('portal_db')->table('wb_onlinesubmissions as t1')
            ->leftJoin('wb_statuses as t5', 't1.application_status_id', '=', 't5.id')
            ->leftJoin('wb_tfdaprocesses as t6','t1.process_id','t6.id')
            ->leftJoin('wb_trader_account as t9', 't1.trader_id', '=', 't9.id')
            ->leftJoin('wb_statuses_types as t10', 't1.status_type_id', '=', 't10.id')

            ->select(DB::raw("t1.*,t5.name as application_status,t6.name as process_name,
                t9.name as applicant, t10.name as status_type"));

        if($whereClauses != ''){
            $qry->whereRaw($whereClauses);
        }
        $qry->orderBy('t1.id', 'desc');
        $results = $qry->get();
        $res = array(
            'success' => true,
            'results' => $results,
            'message' => 'All is well'
        );
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}
    public function createPortalUserFromMis(Request $req)
    {
      $section_id=3; // for vet
        $count=0;
        //get vet applicant products user details wb_trader_account
        $vet_applicants = DB::table('tra_product_applications as t1')
               //->join('tra_registered_products as t2', 't1.id', '=', 't2.tra_product_id')
               ->where('section_id', $section_id)
               ->select('applicant_id')
               ->get();
     //   dd($vet_applicants );
        foreach ($vet_applicants as $vet_applicant){
$count++;
            // get account details
            $user_details = DB::table('wb_trader_account as t1')
                ->where('t1.id', $vet_applicant->applicant_id)
                ->select('t1.*')
                ->first();
//dd($user_details);
            if($user_details){

                //check if account exist
                $user_exists =  DB::Connection('portal_db')->table('wb_trader_account')
                         ->where('email', $user_details->email)
                         ->orWhere('identification_no', $user_details->identification_no)
                         ->orWhere('name', $user_details->name)
                         ->first();
                //dd($user_exists);
                if($user_exists){

                    //update user details  & reset password
                  $this->updateUserDetails($user_details,$user_exists);

                }
                else{

                    //create user  & notify user
                    $this->createNewUser($user_details);
                }


            }

        }
        echo "script completed successfully ---";
        echo $count;
    }

    public function createNewUser($user){
        $trader_data = $user;
        //dd($trader_data);
        $resp=array();
        DB::connection('portal_db')->beginTransaction();
        try{
            $trader_no = $trader_data->identification_no;//generateTraderNo('wb_trader_account');
            $data = array('name'=>$trader_data->name,
                'contact_person'=>$trader_data->contact_person,
                'traderaccount_type_id'=>$trader_data->traderaccount_type_id,
                'contact_person_email'=>$trader_data->contact_person_email,
                'contact_person_telephone'=>$trader_data->contact_person_telephone,
                'country_id'=>$trader_data->country_id,
                'region_id'=>$trader_data->region_id,
                'district_id'=>$trader_data->district_id,
                'physical_address'=>$trader_data->physical_address,
                'postal_address'=>$trader_data->postal_address,
                'telephone_no'=>$trader_data->telephone_no,
                'mobile_no'=>$trader_data->mobile_no,
                'email'=>$trader_data->email,
                'status_id'=>1,
                'identification_no'=>$trader_no
            );


                $res = insertRecord('wb_trader_account', $data, 1,'portal_db');

                $trader_id=$res['record_id'];
                $email_address=$trader_data->email;
                $user_passwordData = Str::random(8);
                $uuid = generateUniqID();//unique user ID
                $user_password = hashPwd($trader_data->email, $uuid, $user_passwordData);
                $user_data = array(
                    'email'=> $trader_data->email,
                    'trader_id'=>$trader_id,
                    'mis_external_user_id'=>$trader_data->id,
                    'fullnames'=>$trader_data->name,
                    'password'=>$user_password,
                    'country_id'=>$trader_data->country_id,
                    'telephone_no'=>$trader_data->telephone_no,
                    'uuid'=>$uuid,
                    'is_verified'=>1,
                    'status_id'=>1,//as actve
                    'account_roles_id'=>1,
                    'created_by'=>'System',
                    'identification_no'=>$trader_no,
                    'created_on'=>date('Y-m-d H:i:s')
                );
                //the details //tin_no
                $resp = insertRecord('wb_traderauthorised_users', $user_data, 1,'portal_db');
                $resp = array('success'=>true,'trader_no'=> $trader_no,'message'=>'Account created successfully, the account details have also been sent to your email '.$email_address);
            $vars=array(
                'identification_no'=>$trader_no,
                'user_email'=> $email_address,
                'password'=>$user_passwordData
            );
            //sendTemplatedApplicationNotificationEmail(17, $email_address, $vars);
            //Uncomment the below
            if($resp['success']){
                DB::connection('portal_db')->commit();
            }
            else{
                DB::connection('portal_db')->rollBack();
            }
        } catch (\Exception $e) {
            DB::connection('portal_db')->rollBack();
            $res = sys_error_handler($e->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), '');

        } catch (\Throwable $throwable) {
            DB::connection('portal_db')->rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), '');
        }
        return response()->json($resp);
    }

    private function updateUserDetails($user_details,$user_exists)
    {
        $trader_no = $user_details->identification_no;//generateTraderNo('wb_trader_account');
        $data = array('name'=>$user_details->name,
            'contact_person'=>$user_details->contact_person,
            'traderaccount_type_id'=>$user_details->traderaccount_type_id,
            'contact_person_email'=>$user_details->contact_person_email,
            'contact_person_telephone'=>$user_details->contact_person_telephone,
            'country_id'=>$user_details->country_id,
            'region_id'=>$user_details->region_id,
            'district_id'=>$user_details->district_id,
            'physical_address'=>$user_details->physical_address,
            'postal_address'=>$user_details->postal_address,
            'telephone_no'=>$user_details->telephone_no,
            'mobile_no'=>$user_details->mobile_no,
            'email'=>$user_details->email,
            'status_id'=>1,
            'identification_no'=>$trader_no
        );
        $res = updateRecord('wb_trader_account', array('id'=>$user_exists->id), $data, 1,'portal_db');
        //password remains the same no notification sent
        //check if exist in wb_traderauthorised_users

        $authorised_user_exists =  DB::Connection('portal_db')->table('wb_traderauthorised_users')
            ->where('email', $user_details->email)
            ->first();
        $email_address=$user_details->email;
        $trader_id=$user_exists->id;
        $user_passwordData = Str::random(8);
        $uuid = generateUniqID();//unique user ID
        $user_password = hashPwd($user_details->email, $uuid, $user_passwordData);
        if($authorised_user_exists){
            //update record

            $authorised_user_data = array(
                'email'=> $user_details->email,
                'mis_external_user_id'=>$user_details->id,
                'fullnames'=>$user_details->name,
                'password'=>$user_passwordData,
                'country_id'=>$user_details->country_id,
                'telephone_no'=>$user_details->telephone_no,
                'identification_no'=>$user_details->identification_no
            );
            //the details //tin_no
            $resp = updateRecord('wb_traderauthorised_users', array('trader_id'=>$user_exists->id), $authorised_user_data, 1,'portal_db');
            $vars=array(
                'identification_no'=>$user_details->identification_no,
                'user_email'=> $user_details->email,
                'password'=>$user_password
            );
            //sendTemplatedApplicationNotificationEmail(17, $user_details->email, $vars);

        }else{
           //add new entry
            $user_data = array(
                'email'=> $user_details->email,
                'trader_id'=>$trader_id,
                'mis_external_user_id'=>$user_details->id,
                'fullnames'=>$user_details->name,
                'password'=>$user_passwordData,
                'country_id'=>$user_details->country_id,
                'telephone_no'=>$user_details->telephone_no,
                'uuid'=>$uuid,
                'is_verified'=>1,
                'status_id'=>1,//as actve
                'account_roles_id'=>1,
                'created_by'=>'System',
                'identification_no'=>$trader_no,
                'created_on'=>date('Y-m-d H:i:s')
            );
            //the details //tin_no
            $resp = insertRecord('wb_traderauthorised_users', $user_data, 1,'portal_db');
            $vars=array(
                'identification_no'=>$user_details->identification_no,
                'user_email'=> $user_details->email,
                'password'=>$user_password
            );
            //sendTemplatedApplicationNotificationEmail(17, $user_details->email, $vars);
        }

    }
}

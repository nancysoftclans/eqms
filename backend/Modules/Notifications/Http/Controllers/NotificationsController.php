<?php

namespace Modules\Notifications\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class NotificationsController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Renderable
     */
    protected $user_id;
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
                return $next($request);
            });
        }
    }
    public function index()
    {
        return view('notifications::index');
    }
    public function saveGroupNotificationsData(Request $req)
    {

        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->post();
            $db_con = 'pgsql';
            $table_name = $post_data['table_name'];
            $group_ids = $post_data['groups_id'];
            $user_ids = $post_data['user_id'];
            $module_ids = $post_data['module_id'];
            $id = $post_data['id'];
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['groups_id']);
            unset($post_data['user_id']);
            unset($post_data['module_id']);
            $table_data = array(
                'subject' => $req->input('subject'),
                'body' => $req->input('body'),
                'is_group' => $req->input('is_group'),
            );
           // $table_data = $post_data;
            $table_data['sender_id']=\Auth::user()->id;
          
            //saving records
            $res = insertRecord($table_name, $table_data);

            if(!isset($res['success'])||$res['success']==false){
              return $res;
            }
            $Notification_id= $res['record_id'];

            $this->saveNotificationAttachments($req, $Notification_id);

            $Notification_id= $res['record_id'];
            $sender=\Auth::user()->id;
            $Group_Id= json_decode($group_ids);
            $User_Id= json_decode( $user_ids);
            $Module_Id= json_decode($module_ids);
            $groupdata=array();
            $userdata=array();
            $moduledata=array();
            if(isset($Group_Id)>0){
                foreach($Group_Id as $group){
                    $groupdata []= array(
                        'groups_id'=> $group,
                        'notification_id'=> $Notification_id
                      );
                  }
                  
                $res = insertMultipleRecords('par_group_notifications', $groupdata);
                if(!isset($res['success'])||$res['success']==false){
                    return $res;
                  }
                }
                if(isset($User_Id)>0){
                    foreach($User_Id as $user){
                        $userdata []= array(
                            'user_id'=> $user,
                            'notification_id'=> $Notification_id
                          );
                      }
                      
                    $res = insertMultipleRecords('par_user_notifications',   $userdata);
                    if(!isset($res['success'])||$res['success']==false){
                        return $res;
                      }
                    }
                    if(isset($Module_Id)>0){
                        foreach($Module_Id as $module){
                            $moduledata []= array(
                                'module_id'=> $module,
                                'notification_id'=> $Notification_id,
                                'sender_id'=> $sender
                            );
                        }
                        $res = insertMultipleRecords('par_module_notifications',   $moduledata);
                    if(!isset($res['success'])||$res['success']==false){
                        return $res;
                      }
                    }
                $res= array(
                    'success' => true,
                    'message' => 'Notifications submitted  Successfully!!'
                ); 
           
        }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
        
    }
    public function saveNotificationAttachments(Request $req, $notification_id)
    {
        // $user_id = $req->input('id');
        $res = array();
        try {
            if ($req->hasFile('Attachments')) {
                $ben_image = $req->file('Attachments');
                $origImageName = $ben_image->getClientOriginalName();
                $extension = $ben_image->getClientOriginalExtension();
                $destination = getcwd() . '\resources\images\user-profile';
                $savedName = str_random(5) . time() . '.' . $extension;
                $ben_image->move($destination, $savedName);
                $insert_params = array(
                    'notification_id' => $notification_id,
                    'initial_name' => $origImageName,
                    'attachment_name' => $savedName,
                    'created_by' => \Auth::user()->id
                );
                $res = insertRecord('par_notification_attachments', $insert_params);

            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function saveReplyNotificationsData(Request $req)
    {

        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->post();
            $db_con = 'pgsql';
            $table_name = $post_data['table_name'];
            //$id = $post_data['id'];
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['groups_id']);
            unset($post_data['user_id']);
            unset($post_data['module_id']);
           
           // $table_data = $post_data;
            $table_data = array(
                'recipient_id' => $req->input('recipient_id'),
                'notification_id' => $req->input('notification_id'),
                'reply' => $req->input('reply'),
            );
            $table_data['sender_id']=\Auth::user()->id;
          
            //saving records
            $res = insertRecord($table_name, $table_data);
            
            if(!isset($res['success'])||$res['success']==false){
              return $res;
            }
            // send the notification reply attachment file\
            $User_id= $req->input('recipient_id');
            $Notification_id= $req->input('notification_id');
            $this->saveNotificationAttachments($req, $Notification_id);

            //update the notifications as replied 
            $where= array('notification_id'=>$Notification_id,'user_id'=>$User_id);
            $updatedata= array('is_read' =>NULL);
           $res=updateRecord('par_user_notifications',$where,$updatedata);
                $res= array(
                    'success' => true,
                    'message' => 'Notifications reply submitted  Successfully!!'
                ); 
           
        }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
        
    }
    // delete from the db  using the grid
    public function deleteNotificationRecord(Request $req)
    {
        try {
            $record_id = $req->input('id');
            $table_name = $req->input('table_name');
            $user_id = \Auth::user()->id;
            $where = array(
                'id' => $record_id
            );
          
            $res = deleteRecord($table_name, $where, $user_id);
            if($res['success']){
                if($table_name == 'par_formfield_designs'){
                    DB::table('par_formfield_relations')->where('form_fielddesign_id', $record_id)->orWhere('parent_field_id', $record_id)->delete();
                }
            }
            
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
           $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function sendExcelToBD(Request $req)
    {
        //$res = array();
        try {
                $fileName=$req->input('resumableFilename');
                //$fileNa = $_FILES['import_file']['name'];
                //$extension = end(explode(".", $_FILES["excel"]["name"])); 
          
                //$table_name = $req->input('table_name');
                $ben_image = $req->file('resumableFilename');
               // $origImageName = $ben_image->getClientOriginalName();
               // $extension = end(explode(".", $_FILES["resumableFilename"])); // For getting Extension of selected file
               
                $extension = pathinfo($fileName, PATHINFO_EXTENSION);
                //dd($extension);
                //$destination = getcwd() . '\resources\images\user-profile';
                $allowed_extension = array("xls", "xlsx", "csv");
                if(in_array($extension, $allowed_extension)) //check selected file extension is present in allowed extension array
             {
           $file = $fileName; // getting temporary source of excel file
           $spreadsheet = new Spreadsheet($file);
           //$reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
          // $spreadsheet = $reader->load($file);
           $data = $spreadsheet-> getActiveSheet()->toArray();
           dd($spreadsheet);

           $sheetcount = count($sheetdata);
          include("PHPExcel/IOFactory.php"); // Add PHPExcel Library in this code
          $objPHPExcel = PHPExcel_IOFactory::load($file); // create object of PHPExcel library by using load() method and in load method define path of selected file
          foreach ($objPHPExcel->getWorksheetIterator() as $worksheet)
            {
          $highestRow = $worksheet->getHighestRow();
          for($row=2; $row<=$highestRow; $row++)
            {
           $name = pg_escape_string ($connect, $worksheet->getCellByColumnAndRow(0, $row)->getValue());
           $email = pg_escape_string ($connect, $worksheet->getCellByColumnAndRow(1, $row)->getValue());
           dd($name);
           //$qry = "INSERT INTO tbl_excel(excel_name, excel_email) VALUES ('".$name."', '".$email."')";
           //mysqli_query($connect, $query);
    $insert_params = array(
        'name' => $name,
        'email' => $email,
        'created_by' => \Auth::user()->id
    );
    $res = insertRecord('tbl_excel', $insert_params);
      }
       } 
       }     
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getNotificationFromTable(Request $req)
    {
        try {
            $filters = $req->filters;
            $is_config = $req->is_config;
            $is_inbox = $req->is_inbox;
            $table_name = $req->table_name;
            DB::enableQueryLog();
          

            $qry = DB::table($table_name. ' as t1');

            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $filters = array_filter($filters);
                $results = $qry->where($filters);
            }
           
            $qry->leftjoin('par_group_notifications as t2', 't1.id','t2.notification_id')
                    ->leftjoin('par_groups as t3', 't2.groups_id','t3.id')
                    ->leftjoin('par_user_notifications as t4', 't1.id','t4.notification_id')
                    ->leftjoin('users as t5', 't4.user_id','t5.id')
                    ->leftjoin('par_module_notifications as t6','t1.id','t6.notification_id')
                    ->leftjoin('par_notification_reply as t8','t1.id','t8.notification_id')
                    ->leftjoin('par_modules as t7','t6.module_id','t7.id')
                    ->select('t1.*', DB::raw("CASE WHEN t1.is_group = 1 THEN string_agg(distinct t3.name, ',') WHEN t1.is_group = 3 THEN string_agg(distinct t7.name, ',') ELSE string_agg(distinct t5.email, ',') END group_name"))
                    // ->select('t1.*', DB::raw("string_agg(distinct t5.email, ',') AS user_name"))
                    ->groupBy('t1.id')
                    ->get();

            if(!validateIsnumeric($is_config)){
                $qry->where('t1.is_enabled', 1);
            }
            if($is_inbox != 1){
                $qry->where('t1.created_by',$this->user_id);
            }
           
            $results = $qry->get();
            $last_query = DB::getQueryLog();
            //dd($last_query);

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
    public function getUserNotificationFromTable(Request $req)
    {
        try {
            $filters = $req->filters;
            $is_config = $req->is_config;
            $is_outbox = $req->is_outbox;
            $user_id = \Auth::user()->id;
            $table_name = $req->table_name;
            $groups = getUserGroups($user_id);
            DB::enableQueryLog();
            $qry = DB::table($table_name.' as t1')
                   ->leftjoin('par_user_notifications as t2', 't1.id','t2.notification_id')
                    ->leftjoin('users as t3', 't2.user_id','t3.id')
                    ->leftjoin('users as t7', 't1.sender_id','t7.id')
                    ->leftjoin('par_user_images as t8','t7.id','t8.user_id')
                    ->leftjoin('par_group_notifications as t4','t1.id','t4.notification_id')
                    ->leftjoin('par_notification_reply as t9','t1.id','t9.notification_id')
                    ->leftjoin('par_notification_reply as t11', 't2.user_id','t11.recipient_id')
                    //->leftjoin('par_notification_reply as t12', 't1.id','t12.notification_id')
                    ->leftJoin('par_notification_reply as t12', function ($join) {
                        $join->on('t1.id', '=', 't12.notification_id')
                            ->on('t2.user_id', '=', 't12.recipient_id');
                    })
                   // ->leftjoin('users as t12', 't2.user_id','t11.id')
                    ->leftjoin('par_notification_attachments as t10','t1.id','t10.notification_id')
                    ->leftjoin('users as t13','t12.sender_id','t13.id')
                    ->select('t1.*','t12.reply','t3.email as user_name','t8.saved_name','t10.attachment_name','t2.id as user_notification_id','t4.id as group_notification_id', DB::raw("CASE WHEN t4.id is NULL THEN t2.is_read WHEN t2.id is NULL THEN t4.is_read END is_read,CONCAT('',decryptval(t7.first_name,".getDecryptFunParams()."),decryptval(t7.last_name,".getDecryptFunParams().")) as sender"));
            //CASE WHEN t11.recipient_id IS NOT NULL THEN t12.reply END body,
                    
            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $filters = array_filter($filters);
                $results = $qry->where($filters);
            }
           
            if(!validateIsnumeric($is_config)){
                $qry->where('t1.is_enabled', 1);
            }
            if($is_outbox!= 1){

                $qry->whereIn('t4.groups_id',$groups)
                    ->orwhere('t3.id',$this->user_id);
            }
        
            $results = $qry->get();

            $last_query = DB::getQueryLog();
            //dd($last_query);

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
    public function getModuleNotificationFromTable(Request $req)
    {
        try {
            $filters = $req->filters;
            $mod_id = $req->mod_id;
            $user_id = \Auth::user()->id;
            $table_name = $req->table_name;
            DB::enableQueryLog();
          

            $qry = DB::table($table_name. ' as t1')
                   ->leftjoin('par_module_notifications as t2', 't1.id','t2.notification_id')
                    ->leftjoin('par_modules as t3', 't2.module_id','t3.id')
                    ->leftjoin('users as t4', 't2.sender_id','t4.id')
                    ->select('t1.*','t2.is_read','t2.module_id','t3.name as module_name', DB::raw("CONCAT('',decryptval(t4.first_name,".getDecryptFunParams()."),'',decryptval(t4.last_name,".getDecryptFunParams().")) as sender"));
            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $filters = array_filter($filters);
                $results = $qry->where($filters);
            }
           
            
            if($mod_id!= 0){
                $qry->where('t3.id',$mod_id);
                   
            }
           
            $results = $qry->get();
            $last_query = DB::getQueryLog();
            //dd($last_query);
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
   
    public function updateInboxNotification(Request $request)
    {
        $updatesid = $request->id;
        $user_notification_id = $request->user_notification_id;
        $group_notification_id = $request->group_notification_id;
        
        try {
            if(validateIsNumeric($user_notification_id)){
          $table_name='par_user_notifications';
          $where= array('id'=>$user_notification_id);
            }
            else{
                $table_name='par_group_notifications'; 
                $where= array('id'=>$group_notification_id); 
            }
        
            
            $updatedata= array('is_read' => 1);
           $res=updateRecord($table_name,$where,$updatedata);

           if(isset($res['success'])){
              // $res['message']="loading info";
           }
        }  catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }
    public function updateModuleNotification(Request $request)
    {
        $updatesid = $request->id;
        $module_id = $request-> module_id;
       
        try {
           
            $where= array('notification_id'=>$updatesid,'module_id'=>$module_id);
            $updatedata= array('is_read' => 1);
           $res=updateRecord('par_module_notifications',$where,$updatedata);

           if(isset($res['success'])){
               $res['message']="Marked as read";
           }
        }  catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }
    public function markAllNotifications(Request $request)
    {
        $user_id = \Auth::user()->id;
        $groups = getUserGroups($user_id);
       
        try {
           
            $where= array('user_id'=>$user_id);
            $updatedata= array('is_read' => 1);
           $res=updateRecord('par_user_notifications',$where,$updatedata);

           if(isset($res['success'])){
          
           }
           $where= array('groups_id'=>$groups);
           $updatedata= array('is_read' => 1);
           $res=updateRecord('par_group_notifications',$where,$updatedata);
           if(isset($res['success'])){
               $res['message']="Marked as read";
           }

        }  catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }
    public function SendTraderNotificationEmail(request $req){
        $user_id = $this->user_id;
        //get data
        $data = $req->all();
        $to = $data['email_to'];
        $subject = $data['email_subject'];
        $email_content = $data['email_body'];
        $cc = $data['email_cc'];
        $bcc = '';
        $cc_emails= json_decode($cc);
      
        //saving records
        //sender data for the email
        $sender_data = DB::table('wb_trader_account')->where('id',$user_id)->first();
       $table_name='tra_customernotification_emails';
       $table_data = array(
        'trader_id' => $sender_data->id,
        'email_to' => $to,
        'subject' => $subject,
        'message' => $email_content,
        'created_on' => Carbon::now(),
        'created_by' => $user_id
    );
    if(isset($cc_emails)>0){
        foreach($cc_emails as $email_cc){
            $table_data []= array(
                'email_cc'=> $email_cc,
            );
           // dd($cc_emails);
        }
    }
        if(isset($sender_data->email)){

            $res = insertRecord($table_name, $table_data);

            //send main mail
            return sendMailFromNotification("User", $to,$subject,$email_content,$cc,$sender_data->email);

        }
        else{
            $res = array(
                'success'=>false,
                'message'=>'No email is linked to your account details'
             ); 
            return $res;
        }
   }
   public function GetTraderEmailNotifications(request $req){

    $email = $req->email;

    $qry = DB::table('tra_customernotification_emails as t1')
            ->join('wb_trader_account as t2','t1.trader_id','t2.id')
            ->select('t1.*','t2.name');
            
    if(isset($email)){
       $qry->where('t1.email_to',$email);
    }
 

    $res = array(
        'success' => true,
        'results' => $qry->get(),
        'message' => 'all is well'
    );

    return $res;
}
public function DeleteTraderNotificationMail(Request $req){
    $id = $req->id;

    $res = DB::table('tra_customernotification_emails')->where('id',$id)->delete();

    if($res){
        $res = array(
        'success' => true,
        'results' => 'Deleted Successfully',
        'message' => 'Deleted Successfully'
    );
    }else{
        $res = array(
        'success' => false,
        'results' => $qry,
        'message' => 'Something went Wrong'
    );
    }

    return $res;
}

public function submitPlannedActivities(Request $request, $inCall=0)
{
 $activity_date = Carbon::now();
  try {
          $qry = DB::table('par_joint_activities_details as t1')
          ->leftJoin('tra_enforcement_applications as t2', 't1.application_code', 't2.application_code')
          ->leftJoin('tra_jointOperation_information as t3', 't2.joint_operation_id', 't3.id')
          ->leftJoin('par_joint_logistics_details as t4', 't1.application_code', 't4.application_code')
            ->select('t1.*','t1.scope as activity_scope','t1.activity as officer_activity','t1.objective as activity_objective',
            't1.other_details as other_details','t1.start_date as activity_start_date','t2.*','t3.*','t4.*');
           // $qry->where(array('t1.start_date'=>$activity_date,'t1.is_manager_approved'=>1));
       $qry->where(array('t1.start_date'=>$activity_date,'t1.is_manager_approved'=>1,'t1.is_submitted'=>null,'is_autogenerated'=>null));
        $results = $qry->get();
   
     if($results){
  foreach($results as $results){
    $enforcement_data = array(
      'joint_operation_id'=>$results->joint_operation_id,
      'department_name'=>$results->department_name,
      'organizing_officer'=>$results->organizing_officer,
      'organizing_officer_title'=>$results->organizing_officer_title,
      'email'=>$results->email,
      'address'=>$results->address,
      'phone'=>$results->phone,
      'activity'=>$results->activity,
      'objective'=>$results->objective,
      'scope'=>$results->scope,
      'start_date'=>$results->start_date,
      'end_date'=>$results->end_date,
      'internal_operative'=>$results->internal_operative,
      'external_operative'=>$results->external_operative,
      );
 
  $officer=$results->officer;
  $active_application_id=$results->application_id;
  $section_id=$results->section_id;
  $module_id=$results->module_id;
  $sub_module_id=$results->sub_module_id;
  $process_id=$results->process_id;
 $workflow_stage_id=$results->workflow_stage_id;
 $enforcement_id=$results->enforcement_id;
 $application_code=$results->application_code;
  $user_id = $this->user_id;
  $where1 = array(
     'application_code'=>$application_code
 );
 $mark_submitted = array(
     'is_submitted' => 1,
 );
// get logistics infor
   $qry_logistics= DB::table('par_joint_logistics_details as t1')
   ->select('t1.*');
  $qry_logistics->where('t1.application_code',$application_code);
  $results_logistics= $qry_logistics->get();

 //dd($results_logistics);
   // dd($enforcement_id);
      DB::beginTransaction();
      $applications_table = 'tra_enforcement_applications';
      $enforcement_table='tra_jointOperation_information';

          //Insert
          //dd($enforcement_data);
          $enforcement_res = insertRecord($enforcement_table, $enforcement_data, $user_id);
      //dd($enforcement_res);
          if ($enforcement_res['success'] == false) {
              DB::rollBack();
              return $enforcement_res;
          }

          //tracking the application
          $joint_operation_id=$enforcement_res['record_id'];

          //Application_create
          $codes_array =  $this->getJointApplicationReferenceCodes($request);
          $view_id = generateApplicationViewID();
          $tracking_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $process_id,1, $user_id);
          $application_code = generateApplicationCode($sub_module_id, $applications_table);
          $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
   
          if ($tracking_details['success'] == false) {
              DB::rollBack();
              return \response()->json($tracking_details);
          }

          $tracking_no = $tracking_details['tracking_no'];
          $reference_no = $tracking_details['tracking_no'];
          $reference_no = str_replace("TRC", 'BMR', $reference_no);
        
        
          $application_params = array(
              'view_id' => $view_id,
              'module_id' => $module_id,
              'sub_module_id' => $sub_module_id,
              'section_id' => $section_id,
              'application_code' => $application_code,
              'process_id' => $process_id,
              'workflow_stage_id' => $workflow_stage_id,
              'tracking_no' => $tracking_no,
              'reference_no' => $reference_no,
              'joint_operation_id' => $joint_operation_id,
              'application_status_id' => $application_status->status_id,
              "date_added" => Carbon::now(),
              "created_by" => \Auth::user()->id,
              "created_on" => Carbon::now()
          );
         // dd('herr');
         
          $res = insertRecord($applications_table, $application_params, $user_id);
          
         //dd($res);
         // myres
          if(!isset($res['record_id'])){
              DB::rollBack();
              return $res;
          }
          
          $active_application_id = $res['record_id'];

          $submission_params = array(
              'application_id' => $active_application_id,
              'view_id' => $view_id,
              'process_id' => $process_id,
              'application_code' => $application_code,
              'tracking_no' => $tracking_no,
              'reference_no' => $reference_no,
              'usr_from' => $user_id,
              'usr_to' => $officer,
              'previous_stage' => $workflow_stage_id,
              'current_stage' => 1175,
              //1175
              'module_id' => $module_id,
              'sub_module_id' => $sub_module_id,
              'section_id' => $section_id,
              'application_status_id' => $application_status->status_id,
              'urgency' => 1,
              'remarks' => 'Initial save of the application',
              'date_received' => Carbon::now(),
              'created_on' => Carbon::now(),
              'created_by' => $user_id
          );
          DB::table('tra_submissions')
              ->insert($submission_params);            
     // }
      //update logistics
     // foreach($res as $res){
         foreach($results_logistics as $results_logistics){
             $logistics_data = array(
                 'name'=>$results->name,
                 'description'=>$results->description,
                 'quantity'=>$results->quantity,
                 'amount'=>$results->amount,
                 'other_details'=>$results->other_details,
                 'application_code'=>$application_code,
                 );
                 DB::table('par_joint_logistics_details')
              ->insert($logistics_data); 
        // }
      }
         // add activities
         $activities_data = array(
             'activity'=>$results->officer_activity,
             'objective'=>$results->activity_objective,
             'scope'=>$results->activity_scope,
             'start_date'=>$results->activity_start_date,
             'end_date'=>$results->end_date,
             'other_details'=>$results->other_details,
             'officer'=>$officer,
             'application_code'=>$application_code,
             'is_manager_approved'=>1,
             'is_autogenerated'=>1,
             'is_submitted'=>1,
             );
             DB::table('par_joint_activities_details')
             ->insert($activities_data);
// mark as submitted
      $res2 = updateRecord('par_joint_activities_details', $where1, $mark_submitted);
      DB::commit();
      
      $res['active_application_id'] = $active_application_id;
      $res['process_id'] = $process_id;
      $res['application_code'] = $application_code;
      $res['tracking_no'] = $tracking_no;
      $res['reference_no'] = $reference_no;
      $res['joint_operation_id'] = $joint_operation_id;
      $res['msg'] = 'Record Saved Successfully';
      $res['success']=true;
     }
 }
 else{

        }
         } catch (\Exception $exception) {
      DB::rollBack();
      $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
  } catch (\Throwable $throwable) {
      DB::rollBack();
     $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
  }
  if($inCall == 1){
      return $res;
  }
  return \response()->json($res);
}
public function getJointApplicationReferenceCodes($application_details)
{
    //dd($application_details);
   // $section_code = getSingleRecordColValue('par_sections', array('id' => $application_details->section_id), 'code');
    //dd($section_code);
    $section_code='HM';
    $codes_array = array(
        'section_code' => $section_code,
    );

    return $codes_array;
}

}

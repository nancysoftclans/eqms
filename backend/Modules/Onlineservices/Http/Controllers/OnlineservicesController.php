<?php

namespace Modules\Onlineservices\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;
use Modules\GmpApplications\Traits\GmpApplicationsTrait;
use Modules\PremiseRegistration\Traits\PremiseRegistrationTrait;
use Modules\ProductRegistration\Traits\ProductsRegistrationTrait;
use Modules\ClinicalTrial\Traits\ClinicalTrialTrait;
use Modules\PromotionMaterials\Traits\PromotionMaterialsTrait;
use Modules\Surveillance\Traits\SurveillanceTrait;
use Modules\Importexportpermits\Traits\ImportexportpermitsTraits;
use Modules\Enforcement\Traits\EnforcementTrait;
class OnlineservicesController extends Controller
{
      public function index()
    {
        return view('onlineservices::index');
    }
    public function getOnlinePortalServicesDetails(){
        try {
            $data = array();
            $data = DB::table('tra_online_portalservices as t1')
                        ->join('par_modules as t2', 't1.module_id','=','t2.id')
                        ->join('par_sub_modules as t3', 't1.sub_module_id','=','t3.id')
                    ->select('t1.*', 't2.name as module_name','t3.name as sub_module_name')
                    ->get();

        $res = array('results'=>$data,
                     'success' => true,
            );
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
    public function getApplicationprocessguidelines(){
        try {
            $data = array();
            $data = DB::table('par_webappprocess_guidelines as t1')
                        ->join('par_modules as t2', 't1.module_id','=','t2.id')
                        ->join('par_sub_modules as t3', 't1.sub_module_id','=','t3.id')
                    ->select('t1.*', 't2.name as module_name','t3.name as sub_module_name')
                    ->get();

        $res = array('results'=>$data,
                     'success' => true,
            );
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
    public function getApplicationdocumentdefination(Request $req){
        try {
            $data = array();
            $records = DB::connection('portal_db')->table('wb_applicable_appdocuments as t1')
                    ->join('wb_statuses as t2', 't1.status_id', '=', 't2.id')
                    ->leftjoin('wb_bomraprocesses as t3', 't1.process_id', '=', 't3.id')
                    ->select('t1.*', 't2.name as status_name','t3.name as process_name');
            $module_id = $req->module_id;
            $section_id = $req->section_id;
            $sub_module_id = $req->sub_module_id;
            if(validateIsNumeric($module_id)){
                $records->where('t1.def_module_id', $module_id);
            }
            if(validateIsNumeric($sub_module_id)){
                $records->where('t1.def_sub_module_id', $sub_module_id);
            }
            if(validateIsNumeric($section_id)){
                $records->where('t1.def_section_id', $section_id);
            }
            $records = $records->get();
                    foreach($records as $rec){
                            $document_type = getSingleRecordColValue('par_document_types', array('id'=>$rec->document_type_id), 'name');
                            $module_name = getSingleRecordColValue('par_modules', array('id'=>$rec->def_module_id), 'name');
                            $section_name = getSingleRecordColValue('par_sections', array('id'=>$rec->def_section_id), 'name');
                            $sub_module_name = getSingleRecordColValue('par_sub_modules', array('id'=>$rec->def_sub_module_id), 'name');
                            $data[] = array('id'=>$rec->id,
                                            'description'=>$rec->description,
                                            'process_name'=>$rec->process_name,
                                            'process_id'=>$rec->process_id,
                                            'status_id'=>$rec->status_id,
                                            'status_name'=>$rec->status_name,
                                            'document_type_id'=>$rec->document_type_id,
                                            'document_type'=>$document_type,
                                            'def_sub_module_id'=>$rec->def_sub_module_id,
                                            'def_module_id'=>$rec->def_module_id,
                                            'def_section_id'=>$rec->def_section_id,
                                            'module_name'=>$module_name,
                                            'section_name'=>$section_name,
                                            'sub_module_name'=>$sub_module_name
                            );
                    }
        $res = array('results'=>$data,
                     'success' => true,
            );
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

    public function getOnlineProcessTransitionsdetails(Request $req){
        try {
            $data = array();
            $records = DB::connection('portal_db')->table('wb_processstatus_transitions as t1')
                    ->join('wb_statuses as t2', 't1.current_status_id', '=', 't2.id')
                    ->join('wb_statuses as t3', 't1.next_status_id', '=', 't3.id')
                    ->select('t1.*', 't2.name as current_status','t3.name as next_status' );
            $records = $records->get();
            foreach($records as $rec){
                            $module_name = getSingleRecordColValue('par_modules', array('id'=>$rec->module_id), 'name');
                           $data[] = array('id'=>$rec->id,
                                            'description'=>$rec->description,
                                            'next_status_id'=>$rec->next_status_id,
                                            'current_status_id'=>$rec->current_status_id,
                                            'next_status'=>$rec->next_status,
                                            'current_status'=>$rec->current_status,
                                            'module_id'=>$rec->module_id,
                                            'module_name'=>$module_name
                            );
                    }
        $res = array('results'=>$data,
                     'success' => true,
            );
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

    public function getOnlineProcesdetails(Request $req){
        try {
            $data = array();
            $module_id = $req->module_id;
            $sub_module_id = $req->sub_module_id;
            $section_id = $req->section_id;
            $records = DB::connection('portal_db')->table('wb_bomraprocesses as t1')
                    ->join('wb_statuses as t2', 't1.status_id', '=', 't2.id')
                    ->select('t1.*','t2.name as status_name');
            if(validateIsNumeric($module_id)){
                $records->where('t1.module_id',$module_id);   
                    }
            if(validateIsNumeric($sub_module_id)){
                $records->where('t1.sub_module_id',$sub_module_id);   
                    }
            if(validateIsNumeric($section_id)){
                $records->where('t1.section_id',$section_id);   
                    }
            $records = $records->get();
            foreach($records as $rec){
                           $module_name = getSingleRecordColValue('par_modules', array('id'=>$rec->module_id), 'name');
                           $section_name = getSingleRecordColValue('par_sections', array('id'=>$rec->section_id), 'name');
                           $sub_module_name = getSingleRecordColValue('par_sub_modules', array('id'=>$rec->sub_module_id), 'name');
                           $data[] = array('id'=>$rec->id,
                                            'sub_module_id' => $rec->sub_module_id,
                                            'module_id' => $rec->module_id,
                                            'status_id' => $rec->status_id,
                                            'section_id' => $rec->section_id,
                                            'importexport_permittype_id' => $rec->importexport_permittype_id,
                                            'premise_type_id' => $rec->premise_type_id,
                                            'name'=>$rec->name,
                                            'router_link'=>$rec->router_link,
                                            'is_enabled'=>$rec->is_enabled,
                                            'status_name'=>$rec->status_name,
                                            'section_name'=>$section_name,
                                            'sub_module_name'=>$sub_module_name,
                                            'module_name'=>$module_name
                            );
                    }
        $res = array('results'=>$data,
                     'success' => true,
            );
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


    public function getapplicationstatusactions(Request $req){
            //the details
        try {
                $rec = DB::connection('portal_db')->table('wb_processstatus_actions as t1')
                        ->select('t1.*', 't2.name as status_name', 't3.name as action_name')
                        ->join('wb_statuses as t2', 't1.status_id','=','t2.id')
                        ->join('wb_statuses_actions as t3', 't1.action_id','=','t3.id')
                        ->get();
            $res = array('results'=>$rec,
                            'success' => true,
                );
        } catch (\Exception $exception) {

            //defaults
        $function = "failed to fetch";
        //class
        $class_array = explode('\\', __CLASS__);
        if(isset($class_array[5])){
          $class = $class_array[5];
        }else{
          $class = "Failed to fetch";
        }
        //specifics
        $me = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
        if(isset($me[0]['function'])){
          $function = $me[0]['function'];
        }
        if(isset($me[0]['class'])){
          $class = $me[0]['class'];
        }
        $res = sys_error_handler($exception->getMessage(), 2, "function-->".$function." class-->".$class, \Auth::user()->id);

        } catch (\Throwable $throwable) {

            //defaults
        $function = "failed to fetch";
        //class
        $class_array = explode('\\', __CLASS__);
        if(isset($class_array[5])){
          $class = $class_array[5];
        }else{
          $class = "Failed to fetch";
        }
        //specifics
        $me = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
        if(isset($me[0]['function'])){
          $function = $me[0]['function'];
        }
        if(isset($me[0]['class'])){
          $class = $me[0]['class'];
        }
        $res = sys_error_handler($throwable->getMessage(), 2, "function-->".$function." class-->".$class, \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getapplicationstatus(Request $req){
        //the details
    try {
            $rec = DB::connection('portal_db')->table('wb_statuses as t1')
                    ->select('t1.*', 't2.name as status_type')
                    ->join('wb_statuses_types as t2', 't1.status_type_id','=','t2.id')

                    ->get();
        $res = array('results'=>$rec,
                        'success' => true,
            );
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

    public function saveApplicationstatusactions(Request $req){
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = $post_data['table_name'];
            $status_id = $post_data['status_id'];
            $action_id = $post_data['action_id'];
            $id = $post_data['id'];
            $unsetData=$req->input('unset_data');
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);
            if(isset($unsetData)){
                $unsetData= explode(",", $unsetData);
                $post_data=unsetArrayData($post_data,$unsetData);
            }
            $table_data = $post_data;
            //add extra params
            $where = array(
                'id' => $id
            );
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where,'portal_db')) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where,'portal_db');
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];

                    $res = updateRecord($table_name, $where, $table_data, $user_id,'portal_db');

                }
            } else {
                    $table_data['created_on'] = Carbon::now();
                    $table_data['created_by'] = $user_id;
                    //the data
                    // save the repository
                    $where = array(
                        'action_id' => $action_id,
                        'status_id' => $status_id
                    );
                   // dd('here');
                    if (!recordExists($table_name, $where,'portal_db')) {
                        $res= DB::connection('portal_db')
                            -> insertRecord($table_name, $table_data, $user_id);
                        //the details

                    }else{
                        $res = array(
                            'success' => false,
                            'message' => "Data Exists"
                        );
                    }
                }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function saveOnlinePortalData(Request $req){
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = $post_data['model'];
            $id = $post_data['id'];
            $name = $req->name;
            $unsetData=$req->input('unset_data');
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);
            if(isset($unsetData)){
                $unsetData= explode(",", $unsetData);
                $post_data=unsetArrayData($post_data,$unsetData);
            }
            $table_data = $post_data;
            $where = array(
                'id' => $id
            );
            //$db_connect = 'portal_db';
           $db_connect= DB::connection('portal_db');

            $where_insert = array(
                'name' => $name
            );
            if($table_name == 'tra_online_portalservices'){
                $db_connect = 'mysql';
                if(!isset($post_data['is_online'])){
                    $table_data['is_online'] =0;
                }
                $where_insert = $post_data;
            }
            else if($table_name == 'par_webappprocess_guidelines'){
                $db_connect = 'mysql';
            }
            else if($table_name == 'wb_navigation_items'){
                if(!isset($post_data['parent_id'])){
                    $table_data['parent_id'] =0;
                }
            }
            if (isset($id) && $id != "") {
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $res = updateRecord($table_name, $where, $table_data,$user_id,'portal_db');

            } else {
                    $table_data['created_on'] = Carbon::now();
                    $table_data['created_by'] = $user_id;
                    $where_insert = $post_data;
                    unset($where_insert['description']);
                    unset($where_insert['code']);
                    unset($where_insert['is_enabled']);
                   $res =insertRecord($table_name, $table_data, $user_id,'portal_db');
                   $record_id = $res['record_id'];
                   $dms_node_id = '';
                    $res=array(
                            'message'=> 'Added Successfully',
                            'success' => true,
                            'record_id' => $record_id
                        );
                }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function saveUniformOnlinePortalData(Request $req){
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = $post_data['model'];
            $id = $post_data['id'];
            $record_id = $post_data['id'];
            $unsetData=$req->input('unset_data');
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);
            if(isset($unsetData)){
                $unsetData= explode(",", $unsetData);
                $post_data=unsetArrayData($post_data,$unsetData);
            }
            $table_data = $post_data;
            //add extra params

            $where = array(
                'id' => $id
            );
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where,'portal_db')) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where,'portal_db');
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    $res = updateRecord($table_name, $where, $table_data, $user_id,'portal_db');

                }
            } else {
                     $where = $table_data;
                    $table_data['created_on'] = Carbon::now();
                    $table_data['created_by'] = $user_id;
                    if (!recordExists($table_name, $where,'portal_db')) {
                        $res = insertRecord($table_name, $table_data, $user_id,'portal_db');
                        //the details
                        $record_id = $res['record_id'];
                        $dms_node_id = '';
                    }else{
                        $res = array(
                            'success' => false,
                            'message' => "Data Exists"
                        );
                    }
                }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

   public function getOnlineMenuLevel0(Request $req){
            try {
                $navigation_type_id= $req->navigation_type_id;

                    $rec = DB::connection('portal_db')->table('wb_navigation_items as t1')
                            ->select('t1.*')
                            ->where(array('t1.navigation_type_id'=>$navigation_type_id, 'level'=>0) )
                            ->get();
                $res = array('results'=>$rec,
                                'success' => true,
                            );
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
   //navigations details
   public function getSystemNavigationMenuItems(Request $request)
   {
       $row = $this->getSystemMenuItem(0, 0);
       $menus = '[';
       if (count($row)) {
           $menu_count = count($row);
           $menu_counter = 0;
           foreach ($row as $item) {
               $menu_counter++;
               $id = $item['id'];
               $name = $item['name'];
               $text = $name;
               $level = $item['level'];
               $parent_id = $item['parent_id'];
               $child_id = $item['parent_id'];
               $router_link = $item['router_link'];
               $iconCls = $item['iconcls'];
               $order_no = $item['order_no'];
               $is_online = $item['is_online'];
               $navigation_type = $item['navigation_type'];
               $navigation_type_id = $item['navigation_type_id'];


               $menus .= '{';
               $menus .= '"text": "' . $text . '",';
               $menus .= '"name": "' . $name . '",';
              // $menus .= '"iconCls": "' . $iconCls . '",';
               $menus .= '"menu_id": "' . $id . '",';
               $menus .= '"id": "' . $id . '",';
               //$menus .= '"access_level": "' . $access_level . '",';
               $menus .= '"router_link": "' . $router_link . '",';
               $menus .= '"level": "' . $level . '",';
               $menus .= '"navigation_type": "' . $navigation_type . '",';
               $menus .= '"order_no": "' . $order_no . '",';
               $menus .= '"navigation_type_id": "' . $navigation_type_id . '",';

               $menus .= '"is_online": "' . $is_online . '",';
               $children = $this->getSystemMenuItem(1, $id);
               if (count($children) > 0) {
                   $menus .= '"selectable": false,';
                   $children_count = count($children);
                   $children_counter = 0;
                   $menus .= '"children": [';
                   foreach ($children as $child) {
                       $children_counter++;
                       $child_id = $child['id'];
                       $child_name = $child['name'];
                       $child_text = $child_name;
                       $child_level = $child['level'];
                       $child_routerlink = $child['router_link'];
                       $child_iconCls = $child['iconcls'];
                       $child_order_no = $child['order_no'];
                       $child_is_online = $child['is_online'];
                       $child_parent_id = $child['parent_id'];
                       $child_navigation_type = $child['navigation_type'];
                       $child_type_id = $item['navigation_type_id'];

                      // $child_access_level = $this->getMenuAccessLevel($child_id);

                       $menus .= '{';
                       $menus .= '"text": "' . $child_text . '",';
                       $menus .= '"name": "' . $child_name . '",';
                       $menus .= '"iconcls": "' . $child_iconCls . '",';
                       $menus .= '"menu_id": "' . $child_id . '",';
                       $menus .= '"id": "' . $child_id . '",';
                       $menus .= '"router_link": "' . $child_routerlink . '",';
                       $menus .= '"level": "' . $child_level . '",';
                       $menus .= '"order_no": "' . $child_order_no . '",';
                       $menus .= '"is_online": "' . $child_is_online . '",';
                       $menus .= '"parent_id": ' . $child_parent_id . ',';
                       $menus .= '"navigation_type": "' . $child_navigation_type . '",';
                       $menus .= '"child_type_id": "' . $child_type_id . '",';

                       $menus .= '"leaf": true';

                       if ($children_counter == $children_count) {
                           $menus .= '}';
                       } else {
                           $menus .= '},';
                       }
                   }
                   $menus .= ']';
               } else {
                   $menus .= '"leaf": true';
               }
               if ($menu_counter == $menu_count) {
                   $menus .= '}';
               } else {
                   $menus .= '},';
               }
           }
       }
       $menus .= ']';
       echo $menus;
   }

   function getSystemMenuItem($level = 0, $parent_id = 0)
   {
       $where = array(
           'level' => $level,
           'parent_id'=>$parent_id
       );
      // $user_id = \Auth::user()->id;
      // $groups = getUserGroups($user_id);
     //  $belongsToSuperGroup = belongsToSuperGroup($groups);
       $qry = DB::connection('portal_db')
            ->table('wb_navigation_items as t1')
            ->leftjoin('wb_navigation_types  as t2', 't1.navigation_type_id','=','t2.id')
           ->distinct()
           ->select('t1.*', 't2.name as navigation_type')
           ->where($where);

       $menus = $qry->get();

       $menus = convertStdClassObjToArray($menus);

       return $menus;
   }

   function deleteSystemMenuItem(request $req){
       $qry=DB::connection('portal_db')
            ->table($req->table_name)
            ->where('id',$req->id)
            ->first();
        if($qry->level == 0){
           $res=DB::connection('portal_db')
            ->table($req->table_name)
            ->where('parent_id',$req->id)
            ->orWhere('id',$req->id)
            ->delete();
        }else{
         $res=DB::connection('portal_db')
            ->table($req->table_name)
            ->where('id',$req->id)
            ->delete();
        }

        $res=array(
            'message'=> 'Deleted Successfully',
            'success' => true,
            'results' => $res
        );
        return $res;
   }
  function deleteSystemProcess(request $req){
       $qry=DB::connection('portal_db')
            ->table($req->table_name)
            ->where('id',$req->id)
            ->delete();

        $res=array(
            'message'=> 'Deleted Successfully',
            'success' => true,
            'results' => $qry
        );
        return $res;
   }
   public function deleteConfigRecord(Request $req)
   {
       try {
           $record_id = $req->input('id');
           $table_name = $req->input('table_name');
           $user_id = \Auth::user()->id;
           $where = array(
            'id' => $record_id
            );
           $qry=DB::connection('portal_db')
                ->table($table_name)
                ->where('id',$record_id)
                ->delete();
            $res=array(
                'message'=> 'Deleted Successfully',
                'success' => true,
                'results' => $qry
            );

       } catch (\Exception $exception) {
           $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
       } catch (\Throwable $throwable) {
          $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
       }
       return response()->json($res);
   }
   public function getApplicationTermsConditions(){
    try {
        $data = array();
        $records = DB::connection('portal_db')->table('wb_appsubmission_termscondition as t1')
                ->select('t1.*')
                ->get();
                foreach($records as $rec){
                       $module_name = getSingleRecordColValue('par_modules', array('id'=>$rec->module_id), 'name');
                       $sub_module_name = getSingleRecordColValue('par_sub_modules', array('id'=>$rec->sub_module_id), 'name');
                       $data[] = array('id'=>$rec->id,
                                        'sub_module_id' => $rec->sub_module_id,
                                        'module_id' => $rec->module_id,
                                        'status_id' => $rec->status_id,
                                        'term_conditiondetails'=>$rec->term_conditiondetails,
                                        'is_enabled'=>$rec->is_enabled,
                                        'order_no'=>$rec->order_no,
                                        'sub_module_name'=>$sub_module_name,
                                        'module_name'=>$module_name
                        );
                }
       $res = array(
                 'results'=>$data,
                 'success' => true,
        );
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
public function getProductPortalApplicationMoreDetails(Request $request)
{
    $application_code = $request->input('application_code');
    // dd($application_code);

    try {
        // $app_details = DB::table('tra_product_applications')
        //     ->where('application_code', $application_code)
        //     ->select('branch_id', 'product_id')->first();
        // $branch_id = $app_details->branch_id;
        // $product_id = $app_details->product_id;
        $qryProducts = DB::connection('portal_db')->table('wb_product_information as t1')
            ->join('wb_product_applications as t2', 't1.id', 't2.product_id')
            ->join('wb_trader_account as t3', 't2.trader_id', 't3.id')
            ->select('t1.id as product_id', 't2.assessment_procedure_id', 't1.*', 't2.paying_currency_id', 't2.branch_id', 't2.prodclass_category_id',
            't2.local_agent_id', 't3.name as applicant_name', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address', 't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website'
        )
            ->where('t2.application_code', $application_code);
        $product_details = $qryProducts->first();

      // dd($product_details);
        $qry2 = DB::table('wb_trader_account as t3')
            ->select('t3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website')
            ->where('t3.id', $product_details->local_agent_id);

        $ltrDetails = $qry2->first();

        $res = array(
            'success' => true,
            'ltrDetails' => $ltrDetails,
            'product_details' => $product_details,
            'branch_id' => $product_details->branch_id,
            'message' => 'All is well'
        );
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}
public function onLoadportalproductIngredients(Request $req)
{

    try {
        $product_id = $req->product_id;
        $data = array();
        $filters = $req->filters;
        //get the records
        $mis_db = DB::getDatabaseName();
        $qry = DB::connection('portal_db')->table('wb_product_ingredients as t1')
              ->select('t1.*')
              ->where('t1.product_id', $product_id);
		     $data=$qry->get();
             //dd($data);
		    foreach($data as $rec){
			           $ingredient_specification = getSingleRecordColValue('par_specification_types', array('id'=>$rec->specification_type_id), 'name');
                       $si_unit = getSingleRecordColValue('par_si_units', array('id'=>$rec->ingredientssi_unit_id), 'name');
                       $ingredient_name = getSingleRecordColValue('par_ingredients_details', array('id'=>$rec->ingredient_id), 'name');
					   $ingredient_type = getSingleRecordColValue('par_ingredients_types', array('id'=>$rec->ingredient_type_id), 'name');
					   $reason_for_inclusion = getSingleRecordColValue('par_inclusions_reasons', array('id'=>$rec->inclusion_reason_id), 'name');
                       $data = array('id'=>$rec->id,
                                        'strength'=>$rec->strength,
                                        'ingredient_specification'=>$ingredient_specification,
                                        'si_unit'=>$si_unit,
										'ingredient_name'=>$ingredient_name,
										'ingredient_type'=>$ingredient_type,
										'reason_for_inclusion'=>$reason_for_inclusion,

                        );
                }
            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $product_id = $filters['product_id'];
                //dd($product_id);
               $results= $data->where(array('t1.product_id' => $product_id))->get();
              //  dd($results);
            }
            $results=$data;
            //dd($results);
        $res = array(
            'success' => true,
            'results' => $results);
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return response()->json($res);
}
public function onLoadportalproductPackagingDetails(Request $req)
{

    try {
        //
        $product_id = $req->product_id;
        $application_code = $req->application_code;
        // if(validateIsNumeric($application_code)){
            $where = array('t1.product_id'=>$product_id);
        // }else{
            // $where = array('t1.product_id'=>$product_id);
        // }

        $data = array();
        //get the records
        $portal_db = DB::connection('portal_db');
        $qry = $portal_db->table('wb_product_packaging as t1')
              ->select('t1.*')
              ->where('t1.product_id', $product_id);
              $data=$qry->get();
             // dd($data);
              foreach($data as $rec){
                $container_type = getSingleRecordColValue('par_containers_types', array('id'=>$rec->container_type_id), 'name');
                $closure_materials = getSingleRecordColValue('par_closure_materials', array('id'=>$rec->closure_material_id), 'name');
                $seal_type = getSingleRecordColValue('par_seal_types', array('id'=>$rec->seal_type_id), 'name');
                $packaging_units = getSingleRecordColValue('par_packaging_units', array('id'=>$rec->packaging_units_id), 'name');
                $data = array('id'=>$rec->id,

                                 'container_name'=>$rec->container_name,
                                 'container_material'=>$rec->container_material,
                                 'retail_packaging'=>$rec->retail_packaging_size,
                                 'container_type'=>$container_type,
                                 'closure_materials'=>$closure_materials,
                                 'seal_type'=>$seal_type,
                                 'packaging_units'=>$packaging_units,

                 );
         }

        $res = array('success' => true, 'results' => $data);

    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return response()->json($res);
}
public function onLoadportalproductManufacturer(Request $req)
{

    try {
        $product_id = $req->product_id;
        //get the records
        $data = array();
        $portal_db = DB::connection('portal_db');
        $qry = $portal_db->table('wb_product_manufacturers as t1')
              ->select('t1.*')
              ->where(array('t1.product_id' => $product_id, 'manufacturer_type_id' => 1));
        $data = $qry->get();
            foreach($data as $rec){
                $email_address = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'email_address');
                $manufacturer_name = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'name');
                $manufacturing_role = getSingleRecordColValue('par_manufacturing_roles', array('id'=>$rec->manufacturer_role_id), 'name');
                $physical_address = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'physical_address');
                $ingredient_name = getSingleRecordColValue('par_ingredients_details', array('id'=>$rec->active_ingredient_id), 'name');
                $country_id = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'country_id');
                $region_id = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'region_id');
                $district_id = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'district_id');
                $country_name =getSingleRecordColValue('par_countries', array('id'=>$country_id), 'name');
                $region_name = getSingleRecordColValue('par_regions', array('id'=>$region_id), 'name');
                $district_name = getSingleRecordColValue('par_districts', array('id'=>$district_id), 'name');
                $data = array('id'=>$rec->id,
                                'email_address'=>$email_address,
                                'manufacturer_name'=>$manufacturer_name,
                                'manufacturer_id'=>$rec->manufacturer_id,
                                'manufacturing_role'=>$manufacturing_role,
                                'physical_address'=>$physical_address,
                                //'manufacturing_site'=>$manufacturing_site,
                                'country_name'=>$country_name,
                                'region_name'=>$region_name,
                                'district_name'=>$district_name
                            );
              }


        $res = array('success' => true, 'results' => $data);

    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return response()->json($res);

}
public function onLoadportalproductApiManufacturer(Request $req)
{

    try {
        $product_id = $req->product_id;
        $records = array();
        //get the records
        $data = array();
        $portal_db = DB::connection('portal_db');
        $qry = $portal_db->table('wb_product_manufacturers as t1')
              ->select('t1.*')
              ->where(array('t1.product_id' => $product_id, 'manufacturer_type_id' => 2));
        $data=$qry->get();
              foreach($data as $rec){
                $email_address = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'email_address');
                $manufacturer_name = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'name');
                $manufacturing_role = getSingleRecordColValue('par_manufacturing_roles', array('id'=>$rec->manufacturer_role_id), 'name');
                $physical_address = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'physical_address');
                $ingredient_name = getSingleRecordColValue('par_ingredients_details', array('id'=>$rec->active_ingredient_id), 'name');
                $country_id = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'country_id');
                $region_id = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'region_id');
                $district_id = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'district_id');
                $country_name =getSingleRecordColValue('par_countries', array('id'=>$country_id), 'name');
                $region_name = getSingleRecordColValue('par_regions', array('id'=>$region_id), 'name');
                $district_name = getSingleRecordColValue('par_districts', array('id'=>$district_id), 'name');
                $data_inf = array('id'=>$rec->id,
                                'email_address'=>$email_address,
                                'manufacturer_name'=>$manufacturer_name,
                                'manufacturer_id'=>$rec->manufacturer_id,
                                'manufacturing_role'=>$manufacturing_role,
                                'physical_address'=>$physical_address,
                                'country_name'=>$country_name,
                                'region_name'=>$region_name,
                                'district_name'=>$district_name,
                                'ingredient_name'=>$ingredient_name
                            );
         }

        $res = array('success' => true, 'results' => $data_inf);
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return response()->json($res);


}
public function onLoadportalproductGmpInspectionDetailsStr(Request $req)
{
    try {
        $product_id = $req->product_id;
        //get the records
        $data = array();
        $portal_db = DB::connection('portal_db');
        //wb_product_gmpinspectiondetails
        $qry = $portal_db->table('wb_product_gmpinspectiondetails as t0')
               ->leftJoin('wb_manufacturing_sites as t1', 't0.manufacturing_site_id', '=', 't1.id')
               ->leftJoin('wb_gmp_productline_details as t2', 't0.manufacturing_site_id', '=', 't2.id')
              ->select('t1.*','t2.*')
              ->where('t0.product_id', $product_id);
              $data=$qry->get();
              //dd($data);
              foreach($data as $rec){
                $gmp_product_line = getSingleRecordColValue('gmp_product_lines', array('id'=>$rec->product_line_id), 'name');
                $gmp_product_category = getSingleRecordColValue('gmp_product_categories', array('id'=>$rec->category_id), 'name');
                $data = array(
                                'id'=>$rec->id,
                                'manufacturer_name'=>$rec->name,
                                'physical_address'=>$rec->physical_address,
                                //'email_address'=>$rec->email_address,
                                'gmp_product_line'=>$gmp_product_line,
                                'gmp_product_category'=>$gmp_product_category,
                            );
         }

        $res = array('success' => true, 'results' => $data);
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return response()->json($res);

}
public function onLoadportalGmpInspectionInOtherCountries(Request $req){

    try{
        $product_id = $req->product_id;
        $application_code = $req->application_code;
        $data = array();
        $portal_db = DB::connection('portal_db');
        $qry = $portal_db->table('wb_otherstates_productgmpinspections as t1')
              ->select('t1.*')
              ->where('t1.application_code', $application_code);
              $data=$qry->get();

              foreach($data as $rec){
                $continent_region = getSingleRecordColValue('par_continent_regions', array('id'=>$rec->continent_region_id), 'name');
                $country = getSingleRecordColValue('par_countries', array('id'=>$rec->country_id), 'name');
                $data_info = array(
                                'id'=>$rec->id,
                                'approving_authority'=>$rec->approving_authority,
                                'gmpapplication_reference'=>$rec->gmpapplication_reference,
                                'inspection_date'=>$rec->inspection_date,
                                'approval_date'=>$rec->approval_date,
                                'approved_productlines'=>$rec->approved_productlines,
                                'continent_region'=>$continent_region,
                                'country'=>$country,

                 );
         }

         $results = $data_info;
        $res = array('success'=>true, 'results'=>$results, 'message'=>'All is well');
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return response()->json($res);
}
public function onLoadportalOtherstatesproductregistrations(Request $req){

    try{
        $product_id = $req->product_id;
        $application_code = $req->application_code;
        $data = array();
        $portal_db = DB::connection('portal_db');
        $qry = $portal_db->table('wb_otherstates_productregistrations as t1')
              ->select('t1.*')
              ->where('t1.product_id', $product_id);
              $data=$qry->get();
              foreach($data as $rec){
                $continent_region = getSingleRecordColValue('par_continent_regions', array('id'=>$rec->continent_region_id), 'name');
                $country = getSingleRecordColValue('par_countries', array('id'=>$rec->country_id), 'name');
                $data = array(
                                'id'=>$rec->id,
                                'continent_region'=>$continent_region,
                                'country'=>$country,
                                'date_of_registration'=>$rec->date_of_registration,
                                'current_registrationstatus'=>$rec->current_registrationstatus,
                                'approving_authority'=>$rec->approving_authority,
                                'registration_ref'=>$rec->registration_ref,

                 );
         }

         $results = $data;
        $res = array('success'=>true, 'results'=>$results, 'message'=>'All is well');
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return response()->json($res);
}
public function getPortalPremApplicationMoreDetails(Request $request)
{
    $application_id = $request->input('application_id');
    $application_code = $request->input('application_code');
    $portal_db = DB::connection('portal_db');
    $applicant_info = array();
    try {
        $application_details =$portal_db->table('wb_premises_applications')
            ->where('id', $application_id)
            ->first();
        if (is_null($application_details)) {
            $res = array(
                'success' => false,
                'message' => 'Problem encountered fetching application details!!'
            );
            return \response()->json($res);
        }
        //fetch premise details
        $premise_id = $application_details->premise_id;
        $applicant_id = $application_details->trader_id;

        $qryApplicant = $portal_db->table('wb_trader_account as t1')
                     ->select('t1.*')
                     ->where('t1.id', $applicant_id);
           $applicantDetails= $qryApplicant->first();
            $country_name = getSingleRecordColValue('par_countries', array('id'=>$applicantDetails->country_id), 'name');
            $region_name = getSingleRecordColValue('par_regions', array('id'=>$applicantDetails->region_id), 'name');
            $district_name = getSingleRecordColValue('par_districts', array('id'=>$applicantDetails->district_id), 'name');
            $applicant_info = array(
                            'applicant_id'=>$applicantDetails->id,
                            'applicant_name'=>$applicantDetails->name,
                            'contact_person'=>$applicantDetails->contact_person,
                            'tpin_no'=>$applicantDetails->tpin_no,
                            'app_country_id'=>$applicantDetails->country_id,
                            'app_region_id'=>$applicantDetails->region_id,
                            'app_district_id'=>$applicantDetails->district_id,
                            'app_physical_address'=>$applicantDetails->physical_address,
                            'app_postal_address'=>$applicantDetails->postal_address,
                            'app_telephone'=>$applicantDetails->telephone_no,
                            'app_fax'=>$applicantDetails->fax,
                            'app_email'=>$applicantDetails->email,
                            'app_website'=>$applicantDetails->website,
                            'country_name'=>$country_name,
                            'region_name'=>$region_name,
                            'district_name'=>$district_name,

            );

        $qryPremise = $portal_db->table('wb_premises as t1')
                    ->leftJoin('wb_premises_applications as t5', 't1.id', '=', 't5.premise_id')
                    ->select('t1.name as premise_name', 't1.id as premise_id', 't1.*', 't1.previous_application_no', 't1.previousreceipt_number', 't1.previousamount_paid', 't1.previousinvoice_number',//'t5.investment_capital',
                         't5.fasttrack_option_id','t5.premise_type_id')
                    ->where('t1.id', $premise_id);
        $premiseDetails = $qryPremise->first();

        $qryContact = $portal_db->table('wb_premises as t1')
		            ->select('t1.*')
					 ->where('t1.id', $premise_id);
	    $qryContactDetails= $qryContact->first();
        //dd($qryContactDetails);
        $personnel_details = getTableData('tra_personnel_information', array('id' => $qryContactDetails->contact_person_id));
       // dd($personnel_details);
        $Contact_info = array(
                        'name'=>$personnel_details->name,
                        'postal_address'=>$personnel_details->postal_address,
                        'telephone_no'=>$personnel_details->telephone_no,
                        'email_address'=>$personnel_details->email_address,
                        'applicant_contact_person'=>$qryContactDetails->applicant_contact_person,
                        'start_date'=>$qryContactDetails->contact_person_startdate,
                        'end_date'=>$qryContactDetails->contact_person_enddate,

        );

        $res = array(
            'success' => true,
            'applicant_details' => $applicant_info,
            'premise_details' => $premiseDetails,
            'contact_details' => $Contact_info,
            'message' => 'Records fetched successfully'
        );
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}
public function getPortalPermitsApplicationMoreDetails(Request $request)
{
    $application_id = $request->input('application_id');
    $applicant_id = $request->input('applicant_id');
    try {


        $main_qry = DB::connection('portal_db')->table('wb_importexport_applications as t1')
            ->leftJoin('wb_statuses as q', 't1.application_status_id','=','q.id')
           // ->leftJoin('tra_permitsenderreceiver_data as sr', 't1.consignee_id','=','sr.id')   'sr.name as consignee_name'
            ->join('wb_trader_account as t3', 't1.trader_id', '=', 't3.id')
            ->select('t1.*','q.name as application_status', 't1.id as active_application_id','t1.id as application_id',
            't3.name as applicant_name', 't3.contact_person',
            't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
            't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website',
             )
            ->where('t1.id', $application_id);

            $permit_details = $main_qry->first();
           // dd($permit_details);

        // $qry1 = clone $main_qry;
        // $qry1->join('wb_trader_account as t3', 't1.trader_id', '=', 't3.id')
        //     ->select('t1.*','q.name as application_status', 't1.id as active_application_id','t1.id as application_id',
        //         't3.name as applicant_name', 't3.contact_person',
        //         't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
        //         't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website', 'sr.name as consignee_name'
        //     );

        //$permit_details = $qry1->first();

        if(!isset($permit_details->premise_id)){
            $res = array('success'=>false, 'message'=>'Premise details not found');
            return $res;
        }
        $premise_id = $permit_details->premise_id;
        $sender_receiver_id = $permit_details->sender_receiver_id;
         //dd($premise_id);
        $qry2 = DB::table('tra_permitsenderreceiver_data as t3')
            ->select('t3.id as trader_id', 't3.name as applicant_name', 't3.contact_person',
                't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone',  't3.email_address as app_email')
            ->where(array('id'=>$sender_receiver_id));
        $senderReceiverDetails = $qry2->first();
        //dd($senderReceiverDetails);
        $qry3 = DB::table('tra_premises as t3')
            ->select('t3.*')
            ->where(array('id'=>$premise_id));
        $premisesDetails = $qry3->first();

        $res = array(
            'success' => true,
            'permit_details' => $permit_details,
            'senderReceiverDetails'=>$senderReceiverDetails,
            'premisesDetails'=>$premisesDetails,
            'message' => 'All is well'
        );
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
    return \response()->json($res);
}
public function getPortalGmpApplicationMoreDetails(Request $request)
{
    $application_id = $request->input('application_id');
    $applicant_id = $request->input('applicant_id');
    $qryApplicant = array();
    $portal_db = DB::connection('portal_db');
   // $site_id = $request->input('site_id');
    try {
        $qry = DB::connection('portal_db')->table('wb_trader_account as t1')
        ->join('wb_gmp_applications as t11','t1.id','=','t11.applicant_id')
        ->where('t11.id', $application_id)
        ->select('t11.*',  't1.*');
        $qryApplicant = $qry->get();
       // dd($qryApplicant);
        foreach($qryApplicant as $rec){
                   $country_name = getSingleRecordColValue('par_countries', array('id'=>$rec->country_id), 'name');
                   $region_name = getSingleRecordColValue('par_regions', array('id'=>$rec->region_id), 'name');
                   $district_name = getSingleRecordColValue('par_districts', array('id'=>$rec->district_id), 'name');
                   $qryApplicant[] = array(
                                   'app_country_id'=>$rec->country_id,
                                   'app_region_id'=>$rec->region_id,
                                   'app_district_id'=>$rec->district_id,
                                   'tpin_no'=>$rec->tpin_no,
                                   'app_physical_address'=>$rec->physical_address,
                                   'app_postal_address'=>$rec->postal_address,
                                   'app_telephone'=>$rec->telephone_no,
                                   'app_fax'=>$rec->fax,
                                   'app_email'=>$rec->email,
                                   'app_website'=>$rec->website,
                                   'country_name'=>$country_name,
                                   'region_name'=>$region_name,
                                   'district_name'=>$district_name

                    );
            }
          //dd($qryApplicant);

        $sharedQry = DB::connection('portal_db')->table('wb_gmp_applications as t11')
            ->where('t11.id', $application_id);
        $man_site_details_qry= clone $sharedQry;

        //$man_site_details_qry->join('wb_manufacturing_sites as t2', 't11.manufacturing_site_id', '=', 't2.id')
        $man_site_details_qry->join('wb_manufacturing_sites as t2','t11.manufacturing_site_id', '=', 't2.id')
                             ->select('t2.*');
        $data = $man_site_details_qry->get();



        $man_site_details = $man_site_details_qry->first();
       //dd($man_site_details);
        $qryLtr = clone $sharedQry;
        $qryLtr->join('wb_manufacturing_sites as t1', 't11.manufacturing_site_id', '=', 't1.id')
        ->leftJoin('wb_trader_account as t2', 't1.ltr_id', '=', 't2.id')
            ->select('t2.id as ltr_id', 't2.name as ltr_name', 't2.tpin_no',
                't2.physical_address as ltr_physical_address', 't2.postal_address as ltr_postal_address', 't2.telephone_no as ltr_telephone',
                't1.applicant_as_ltr', 't2.fax as ltr_fax', 't2.email as ltr_email');
        $ltrDetails = $qryLtr->first();
       // dd($ltrDetails);
        $qry3 = clone $sharedQry;
        $qry3->join('wb_manufacturing_sites as t1', 't11.manufacturing_site_id', '=', 't1.id')
             ->leftJoin('wb_personnel_information as t3', 't1.contact_person_id', '=', 't3.id')
             ->select('t3.*','t3.name as contact_name', 't3.postal_address as contact_postal_address', 't3.telephone_no as contact_telephone_no', 't3.email_address as contact_email_address',
                't1.applicant_contact_person', 't1.contact_person_startdate as start_date', 't1.contact_person_enddate as end_date');
        $contactPersonDetails = $qry3->first();

        $res = array(
            'success' => true,
           // 'applicant_details' => $qryApplicant,
            'site_details' => $man_site_details,
            'ltr_details' => $ltrDetails,
            'contact_details' => $contactPersonDetails,
            'message' => 'All is well'
        );
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}


public function getPortalAppPremisePersonnelDetails(Request $request){
    try{
    $premise_id = $request->input('premise_id');
    $portal_db = DB::connection('portal_db');
    $qry = $portal_db->table('wb_premises_personnel as t1')
        ->select('t1.*')
        ->where('premise_id', $premise_id);
    $results = $qry->get();

    foreach ($results as $result) {
        $personnel_details = getTableData('tra_personnel_information', array('id' => $result->personnel_id));
        $study_field = getSingleRecordColValue('par_personnel_studyfield', array('id' => $result->study_field_id), 'name');
        $position = getSingleRecordColValue('par_personnel_positions', array('id' => $result->position_id), 'name');
        $qualification = getSingleRecordColValue('par_personnel_qualifications', array('id' => $result->qualification_id), 'name');
       $personnel_info = array(
                         'name'=>$personnel_details->name,
                         'telephone_no'=>$personnel_details->telephone_no,
                         'email_address'=>$personnel_details->email_address,
                         'postal_address'=>$personnel_details->postal_address,
                         'study_field'=>$study_field,
                         'position'=>$position,
                         'qualification'=>$qualification,

         );
       }

        //$results = $qry->get();
        $res = array(
            'success' => true,
            'results' => $personnel_info,
            'message' => 'All is well'
        );
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}

public function getPortalPremiseProprietorsDetails(Request $req){
    try{
        $premise_id = $req->premise_id;
        $is_variation = $req->is_variation;
        $portal_db = DB::connection('portal_db');
        //wb_premises_proprietors

        $qry = $portal_db->table('wb_premises_proprietors as t1')
             ->select('t1.*')
             ->where('premise_id', $premise_id);
        $results = $qry->get();
        foreach($results as $rec){
            $nationality = getSingleRecordColValue('par_countries', array('id'=>$rec->nationality_id), 'name');
            $gender = getSingleRecordColValue('par_gender', array('id'=>$rec->sex_id), 'name');
            $identification_type = getSingleRecordColValue('par_identification_types', array('id'=>$rec->identification_type_id), 'name');
            $result = array(
                            'name'=>$rec->name,
                            'telephone_no'=>$rec->telephone_no,
                            'email_address'=>$rec->email_address,
                            'physical_address'=>$rec->physical_address,
                            'occupation'=>$rec->occupation,
                            'identification_no'=>$rec->identification_no,
                            'nationality'=>$nationality,
                            'gender'=>$gender,
                            'identification_type'=>$identification_type,

             );
             }

    //         ->leftJoin('par_countries as t2', 't1.nationality_id', 't2.id')
    //         ->leftJoin('par_gender as t3', 't1.sex_id', 't3.id')
    //         ->leftJoin('par_identification_types as t4', 't1.identification_type_id', 't4.id')
    //         ->select('t1.*', 't2.name as nationality', 't3.name as gender', 't4.name as identification_type')

        //$results = $qry->get();
        $res = array(
            'success' => true,
            'results' => $result,
            'message' => 'All is well'
        );
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}
public function getPortalClinicalTrialApplicationMoreDetails(Request $request)
{
    $application_id = $request->input('application_id');
    $portal_db = DB::connection('portal_db');
    try {
        $sharedQry = $portal_db->table('wb_clinical_trial_applications as t1')
            ->where('t1.id', $application_id);

        $applicantQry = clone $sharedQry;
        $applicantQry->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
            ->select('t3.name as applicant_name', 't3.contact_person', 't1.applicant_id',
                't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website');
        $applicantDetails = $applicantQry->first();
        //dd($applicantDetails);

        $appQry = clone $sharedQry;
        $appDetails = $appQry->first();

        $sponsorQry = clone $sharedQry;
        $sponsorQry->join('wb_clinical_trial_sponsors as t2', 't1.sponsor_id', '=', 't2.id')
            ->select('t2.*');
        $sponsorDetails = $sponsorQry->first();

        $investigatorQry = clone $sharedQry;
        $investigatorQry->join('wb_personnel_information as t2', 't1.local_agent_id', '=', 't2.id')
            ->select('t2.*');
        $investigatorDetails = $investigatorQry->first();



        $participantsQry = $portal_db->table('wb_clinicalstudy_participants')
            ->where('application_id', $application_id);
        $participants_data = $participantsQry->first();

        $res = array(
            'success' => true,
            'app_details' => $appDetails,
            'applicant_details' => $applicantDetails,
            'sponsor_details' => $sponsorDetails,
            'investigator_details' => $investigatorDetails,
            'participants_data'=>$participants_data,
            'message' => 'All is well'
        );
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}
public function markasPortalMisReceived(Request $req)
{
    try{
        $application_code = $req->application_code;
        $table_name = 'wb_onlinesubmissions';
        $user_id = \Auth::user()->id;
        $where = array(
            'application_code' => $application_code
        );
        $data = array(
            'is_received' => 1,
            'application_code'=> $application_code,
        );
        $res = updateRecord($table_name, $where, $data, $user_id,'portal_db');
       //dd($res);
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}
public function getOnlineConfigParamFromTable(Request $req)
    {
        try {
            $table_name = $req->table_name;
            $portal_db = DB::connection('portal_db');
            $qry = $portal_db->table($table_name. ' as t1');
            if($table_name == 'wb_exemption_animal_holding'){
                if(validateIsNumeric($req->product_id)){
                    $qry->where('t1.product_id', $req->product_id);
                }else{
    
                }
            }
            if($table_name == 'wb_prescriber_details'){
                if(validateIsNumeric($req->product_id)){
                    $qry->where('t1.product_id', $req->product_id);
                }else{
    
                }
            }
            if($table_name == 'wb_patient_details'){
                if(validateIsNumeric($req->product_id)){
                    $qry->where('t1.product_id', $req->product_id);
                }else if(validateIsNumeric($req->application_code)){
                    $qry->where('t1.application_code', $req->application_code);
                }else{
    
                }
            }
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

    public function getPortalExemptionProductsList(Request $req){
        try{
            $application_code = $req->application_code;
            $portal_db = DB::connection('portal_db');
            $qry = $portal_db->table('wb_exemption_products as t1')
            ->select(DB::raw("t1.*,concat(t1.approved_quantity, ' - ', t1.pack_size) as approved_quantity"))
            ->where('application_code', $application_code);
            $results = $qry->get();  
           foreach($results as $rec){
           $strength = getSingleRecordColValue('par_si_units', array('id'=>$rec->strength_si_unit), 'name');
           $dosage_form = getSingleRecordColValue('par_dosage_forms', array('id'=>$rec->dosage_form_id), 'name');
           $section = getSingleRecordColValue('par_sections', array('id'=>$rec->section_id), 'name');
           $prodclass_category = getSingleRecordColValue('par_prodclass_categories', array('id'=>$rec->prodclass_category_id), 'name');
           $product_type = getSingleRecordColValue('par_product_types', array('id'=>$rec->product_type_id), 'name');
           $manufacturer_name = getSingleRecordColValue('tra_manufacturers_information', array('id'=>$rec->manufacturer_id), 'name');
           $result = array(
                           'brand_name'=>$rec->brand_name,
						   'product_name'=>$rec->brand_name,
                           'quantity_requested'=>$rec->quantity_requested,
                           'strength'=>$strength,
                           'dosage_form'=>$dosage_form,
                           'section'=>$section,
                           'prodclass_category'=>$prodclass_category,
                           'product_type'=>$product_type,
                           'manufacturer_name'=>$manufacturer_name,
                            
            );
            }
            $res = array(
                'success' => true,
                'results' => $result,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);
    }
    public function getPortalAnimalMedicinalRequirements(Request $req)
    {
        try {
            $table_name = $req->table_name;
            $product_id = $req->product_id;
            $application_code = $req->application_code;
            $portal_db = DB::connection('portal_db');
            $qry = $portal_db->table($table_name. ' as t1');
            if($table_name == 'wb_exemptionanimal_medical_requirments'){
                if(validateIsNumeric($product_id)){
                    $qry->where('t1.product_id', $product_id);
                }else if(validateIsNumeric($application_code)){
                    $qry->where('t1.application_code', $application_code);
                }{
    
                }
            }
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

    public function getPortalExemptionOtherDetails(Request $req){
        try{
            $table_name = $req->table_name;
            $application_code = $req->application_code;
            $portal_db = DB::connection('portal_db');
            $qry = $portal_db->table($table_name. ' as t1')
            ->select(DB::raw("t1.*"))
            ->where('application_code', $application_code);
            $results = $qry->get();  
          foreach($results as $rec){
           $region = getSingleRecordColValue('par_regions', array('id'=>$rec->region_id), 'name');
           $district = getSingleRecordColValue('par_districts', array('id'=>$rec->district_id), 'name');
           $result = array(
                           'name'=>$rec->name,
                           'postal_address'=>$rec->postal_address,
                           'physical_address'=>$rec->physical_address,
                           'email'=>$rec->email,
                           'telephone_no'=>$rec->telephone_no,
                           'region'=>$region,
                           'district'=>$district,
                            
            );
            }
            $res = array(
                'success' => true,
                'results' => $result,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);
    }

 public function syncOnlineApplicationsGeneric(Request $request)
    {
    $portal_db = DB::connection('portal_db');
    $qry = $portal_db->table( 'wb_onlinesubmissions as t1')
                     ->select('t1.*')
                     ->where(array('t1.application_status_id'=>2,'t1.is_received'=>NULL,'t1.module_id'=>1));
    $results = $qry->get();
    // dd($results);
    foreach ($results as $results) {
        # code...
        $user_id = 3;
        $module_id = $results->module_id;
        $sub_module_id = $results->sub_module_id;
        $section_id = $results->section_id;
        $application_code = $results->application_code;
        $success=false;
        $msg='Failed to Sync';
        $return_response = '';
        if ($module_id == 1) {//PRODUCT REGISTRATION
            if($sub_module_id ==75){
                $return_response = $this->receiveExemptionsProductsPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id);
                
            }
            else{
                $return_response = $this->receiveProductsPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id);
            }
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        } else if ($module_id == 2) {//PREMISE REGISTRATION
            $return_response = $this->receiveFacilityPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id);

        } else if ($module_id == 3) { //GMP APPLICATIONS
            $return_response = $this->receiveGmpPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        }  else if ($module_id == 4 || $module_id == 20) {//IMPORT EXPORT
            $return_response =  $this->receiveImportExportPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        }  else if ($module_id == 12) {//IMPORT EXPORT
            $return_response = $this->receiveImportExportPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        }else if ($module_id == 7) {//CLINICAL TRIAL
            $return_response = $this->receiveClinicalTrialPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        } else if ($module_id == 14) {   //PROMOTION AND ADVERTISEMENT
            $return_response = $this->receivePromotionPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id);
          
        }  else if ($module_id == 25) {//PSUR/PBRER
            $return_response = $this->receivePsurPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        } 
        else {
            $success=false;
            $msg='Module not set!!';
            $return_response = '';
        }

        $res = array(
            'success' => $success,
            'message' => $msg,
            'error' => $return_response
        );
        //return response()->json($res);


    }
   }

 public function receiveExemptionsProductsPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id){
    $portal_db = DB::connection('portal_db');
    $audit_db = DB::connection('audit_db');
    $portal_db->beginTransaction();
    $audit_db->beginTransaction();
    DB::beginTransaction();
    //check duplicate application code
    $duplicate_application_code = getSingleRecordColValue('tra_product_applications', array('application_code'=>$application_code), 'application_code');
    if(validateIsNumeric($duplicate_application_code)){
        $data = array(
            'dola' => Carbon::now(),
            'application_code'=> $application_code,
            'module_id' => $module_id,
            'type'=>5
        );
        $res = insertRecord('par_sync_error_log',$data,3,'audit_db');
        $audit_db->rollback();
        return array(
            'is_duplicate'=>1,
            'success' => false
        );
        //generate new application_code and update respective tables
    }
    //else{
    //Get portal product data other_container
    $qry = $portal_db->table('wb_product_applications as t1')
         ->leftJoin('wb_product_information as t2', 't1.product_id', 't2.id')
         ->select('t1.*','t2.*','t1.id as portal_application_id','t1.prodclass_category_id as prodclass_category_id','t1.product_id as old_product_id');
    $qry->where('t1.application_code',$application_code);
    $results = $qry->first();
    //dd($results);
    if(!isset($results->id)){
        DB::rollBack();
        return ['message'=> 'record not found', 'success'=>false]; 
    }
    $portal_application_id = $results->portal_application_id;
    $old_product_id = $results->old_product_id;
    $module_id = $results->module_id;
    $sub_module_id = $results->sub_module_id;
    $section_id = $results->section_id;
    $prodclass_category_id = $results->prodclass_category_id;
    $view_id = generateApplicationViewID();
    $trader_id = $results->trader_id;
    $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
    $applicant_id = getInternalApplicant_id($identification_no);
    $process_qry = DB::table('wf_processes as t1')
                 ->select('t1.id')
                 ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'prodclass_category_id'=>$prodclass_category_id));
    $process_results = $process_qry->first();
    if(!isset($process_results->id)){
        DB::rollBack();
        return ['message'=> 'Process not found', 'success'=>false]; 
    }
    $process_id = $process_results->id;
    if($results){
        try {
        $prod_data = array(
        'common_name_id'=>$results->common_name_id,
        'product_type_id'=>$results->product_type_id,
        'classification_id'=>$results->classification_id,
        'chemical_entities_type_id'=>$results->chemical_entities_type_id,
        'efficacy_proof_type_id'=>$results->efficacy_proof_type_id,
        'brand_name'=>$results->brand_name,
        'common_name'=>$results->common_name,
        'physical_description'=>$results->physical_description,
        'dosage_form_id'=>$results->dosage_form_id,
        'strength'=>$results->strength,
        'storage_condition'=>$results->storage_condition,
        'product_origin_id'=>$results->product_origin_id,
        'intended_enduser_id'=>$results->intended_enduser_id,
        'intended_use_id'=>$results->intended_use_id,
        'route_of_administration_id'=>$results->route_of_administration_id,
        'contraindication'=>$results->contraindication,
        'gmdn_code'=>$results->gmdn_code,
        'shelf_lifeafter_opening'=>$results->shelf_lifeafter_opening,
        'shelf_life'=>$results->shelf_life,
        'instructions_of_use'=>$results->instructions_of_use,
        'warnings'=>$results->warnings,
        'intended_use'=>$results->intended_use,
        'indications'=>$results->indications,
        'strength_si_unit'=>$results->strength_si_unit,
        'gmdn_category_id'=>$results->gmdn_category_id,
        'gmdn_term'=>$results->gmdn_term,
        'paying_currency_id'=>$results->paying_currency_id,
        'fasttrack_option_id'=>$results->fasttrack_option_id,
        'remarks'=>$results->remarks,
        'has_family'=>$results->has_family,
        'device_family'=>$results->device_family,
        'has_reagents'=>$results->has_reagents,
        'device_reagents'=>$results->device_reagents,
        'has_accessories'=>$results->has_accessories,
        'device_accessories'=>$results->device_accessories,
        'model_name'=>$results->model_name,
        'software_version'=>$results->software_version,
        'device_intended_use'=>$results->device_intended_use,
        'device_brand_name'=>$results->device_brand_name,
        'device_report'=>$results->device_report,
        'productrisk_category_id'=>$results->productrisk_category_id,
        'clinical_condition'=>$results->clinical_condition,
        'device_classification_rules_id'=>$results->device_classification_rules_id,
        'device_classification_rules_id'=>$results->device_classification_rules_id,
        'device_cluster' =>$results->device_cluster,
        'device_compliance_standards' =>$results->device_compliance_standards,
        'gs1_udi' =>$results->gs1_udi,
        'udi_available' => $results->udi_available,
        'gs1_udi_available' => $results->gs1_udi_available,
        'has_cluster' => $results->has_cluster,
        'qms_area' => $results->qms_area,
        'qms_established' => $results->qms_established,
        'technical_doc_summary' => $results->technical_doc_summary,
        // 'listing_no' => $results->listing_no,
        // 'is_listed' => $results->is_listed,
        // 'country_id' => $results->country_id,
        'created_by'=>$results->created_by,
        'created_on'=>$results->created_on,
         );

    $applications_table = 'tra_product_applications';
    $products_table = 'tra_product_information';
    $res = insertRecord('tra_product_information', $prod_data, $user_id);
    if(!isset($res['record_id'])){
        //log to audit db
        DB::rollback();
        return $res;

         }
    $record_id = $res['record_id'];
    $product_id = $res['record_id'];
    $app_data = array(
        "process_id" => $process_id,
        'view_id' => $view_id,
        "applicant_id" => $applicant_id,
        "reg_serial" =>$results->reg_serial,
        "workflow_stage_id" => $results->workflow_stage_id,
        "application_status_id" => $results->application_status_id,
        "application_code" => $results->application_code,
        "reference_no" =>$results->reference_no,
        "tracking_no" => $results->tracking_no,
        "sub_module_id" => $results->sub_module_id,
        "module_id" => $results->module_id,
        "section_id" => $results->section_id,
        "product_id" => $product_id,
        "local_agent_id" => $results->local_agent_id,
        "paying_currency_id" =>$results->paying_currency_id,
        "assessment_procedure_id" =>$results->assessment_procedure_id,
        "assessmentprocedure_type_id" =>$results->assessmentprocedure_type_id,
        'prodclass_category_id' => $results->prodclass_category_id,
        "product_type_id" => $results->product_type_id,
        "date_added" => $results->date_added,
        'appeal_type_id' => $results->appeal_type_id,
        'withdrawal_type_id' => $results->withdrawal_type_id,
        'reg_product_id' => $results->reg_product_id,
        "created_by" => $results->created_by,
        "fasttrack_option_id" => $results->fasttrack_option_id,
        "created_on" => Carbon::now()
    );

    $app_res = insertRecord('tra_product_applications', $app_data, $user_id);
    if(!isset($app_res['record_id'])){
        DB::rollback();
        return $app_res;

         }
    $active_application_id = $app_res['record_id'];
    $Stage_qry = DB::table('wf_processes as t1')
            ->select('t1.workflow_id')
            ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'prodclass_category_id'=>$prodclass_category_id));
    $Stage_qry_results = $Stage_qry->first();
    if($Stage_qry_results){
        $workflow_id = $Stage_qry_results->workflow_id;
        $stage_id_qry = DB::table('wf_workflow_stages as t1')
                    ->select('t1.id')
                    ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
        $stage_id_results = $stage_id_qry->first();
        if(!isset($stage_id_results->id)){
            DB::rollBack();
            return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
        }
        $previous_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'is_portalapp_previousstage'=>1), 'id');
        if (!validateIsNumeric($previous_stage_id)){
           $previous_stage_id = $stage_id_results->id;
        }
        //check on online applications
        $application_code = $results->application_code;
        $is_paid_id = getSingleRecordColValue('tra_payments', array('application_code'=>$application_code), 'id');
        if (!validateIsNumeric($is_paid_id)){
            $workflow_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'stage_category_id'=>22), 'id');
            if(!validateIsNumeric($workflow_stage_id)){
                $workflow_stage_id = $stage_id_results->id;
            }
         }
         
         else{
            $workflow_stage_id = $stage_id_results->id;
         }
        $submission_params = array(
            'application_id' => $active_application_id,
            "process_id" => $process_id,
            "application_code" => $results->application_code,
            'prodclass_category_id' => $results->prodclass_category_id,
            "tracking_no" => $results->tracking_no,
            'usr_from' => $user_id,
          //  'usr_to' => $user_id,
            'previous_stage' => $previous_stage_id,
            'current_stage' => $workflow_stage_id,
            "module_id" => $results->module_id,
            "sub_module_id" => $results->sub_module_id,
            "section_id" => $results->section_id,
            "application_status_id" => 5,
            'urgency' => 1,
            "applicant_id" => $applicant_id,
            'remarks' => 'Online Received Application',
            'date_received' => Carbon::now(),
            'created_on' => Carbon::now(),
            'is_fast_track' => $results->fasttrack_option_id,
            'created_by' => $user_id
        );
        $sub_res = insertRecord('tra_submissions', $submission_params);
       if(!isset($sub_res['record_id'])){
        DB::rollback();
        return $sub_res;
         }
    }
           //Get portal exempted product list
    $exemptionproductsdetailsqry = $portal_db->table('wb_exemption_products as t1')
           ->select('t1.*')
           ->where('t1.application_code',$application_code);
    $exemptionproductsresults = $exemptionproductsdetailsqry->get();
    if($exemptionproductsresults){
        foreach ($exemptionproductsresults as $exemptionproductsresults) {
            # code...
           $exemptionproductsresultsdata = array(
                'application_code' => $exemptionproductsresults->application_code,
                'brand_name' => $exemptionproductsresults->brand_name,
                'common_name' => $exemptionproductsresults->common_name,
                'contraindication' => $exemptionproductsresults->contraindication,
                'storage_condition' => $exemptionproductsresults->storage_condition,
                'Indication' => $exemptionproductsresults->Indication,
                'physical_description'=> $exemptionproductsresults->physical_description,
                'motivation_for_exemption' => $exemptionproductsresults->motivation_for_exemption,
                'dosage_form_id' => $exemptionproductsresults->dosage_form_id,
                'quantity' => $exemptionproductsresults->quantity,
                'strength_si_unit' => $exemptionproductsresults->strength_si_unit,
                'strength' => $exemptionproductsresults->strength,
                'shelf_life' => $exemptionproductsresults->shelf_life,
                'prodclass_category_id' => $exemptionproductsresults->prodclass_category_id,
                'product_type_id' => $exemptionproductsresults->product_type_id,
                'section_id' => $exemptionproductsresults->section_id,
                'manufacturer_id' => $exemptionproductsresults->manufacturer_id,
                'pack_unit_id' => $exemptionproductsresults->pack_unit_id,
                'created_by' => $exemptionproductsresults->created_by,
                'altered_by' => $exemptionproductsresults->altered_by,
                'created_on' => $exemptionproductsresults->created_on,
                'dola' => $exemptionproductsresults->dola,
                'gmdn_code_id' => $exemptionproductsresults->gmdn_code_id,
                'approval_decision_id' => $exemptionproductsresults->approval_decision_id,
                'intended_use' => $exemptionproductsresults->intended_use,
                'devicerisk_classification_id' => $exemptionproductsresults->devicerisk_classification_id,
                'software_version' => $exemptionproductsresults->software_version,
                'common_name_id' => $exemptionproductsresults->common_name_id,
                'product_packaging' => $exemptionproductsresults->product_packaging,
                'product_origin_id' => $exemptionproductsresults->product_origin_id,
                'approved_quantity' => $exemptionproductsresults->approved_quantity,
                'approval_remarks' => $exemptionproductsresults->approval_remarks,
                'device_family' => $exemptionproductsresults->device_family,
                'has_family' => $exemptionproductsresults->has_family,
                'has_reagent' => $exemptionproductsresults->has_reagent,
                'reagents' => $exemptionproductsresults->reagents,
                'has_accessories' => $exemptionproductsresults->has_accessories,
                'device_accessories' => $exemptionproductsresults->device_accessories,
                'gmdn_term' => $exemptionproductsresults->gmdn_term,
                'model' => $exemptionproductsresults->model,
                'gmdn_category_id' => $exemptionproductsresults->gmdn_category_id,
                'classification_rule_id' => $exemptionproductsresults->classification_rule_id,
                'gmdn_descriptor' => $exemptionproductsresults->gmdn_descriptor,
                'quantity_requested' => $exemptionproductsresults->quantity_requested,
                'pack_size' => $exemptionproductsresults->pack_size,
                'classification_id' => $exemptionproductsresults->classification_id,
                'intended_enduser_id' => $exemptionproductsresults->intended_enduser_id,
                'is_enabled' => $exemptionproductsresults->is_enabled,
                'product_schedule_id' => $exemptionproductsresults->product_schedule_id,
           );
           $exemptionproductsresults_res = insertRecord('tra_exemption_products', $exemptionproductsresultsdata);
           if(!isset($exemptionproductsresults_res['record_id'])){
              DB::rollback();
             return $exemptionproductsresults_res;
               }
        }
    }

              //Get portal pharmacy details list
     $pharmacydetailsqry = $portal_db->table('wb_pharmacy_details as t1')
              ->select('t1.*')
              ->where('t1.application_code',$application_code);
     $pharmacydetailsresults = $pharmacydetailsqry->get();
     if($pharmacydetailsresults){
               foreach ($pharmacydetailsresults as $pharmacydetailsresults) {
                   # code...
                  $pharmacydata = array(
                       'product_id' => $product_id,
                       'region_id' => $pharmacydetailsresults->region_id,
                       'district_id' => $pharmacydetailsresults->district_id,
                       'sub_district_id' => $pharmacydetailsresults->sub_district_id,
                       'postal_address' => $pharmacydetailsresults->postal_address,
                       'created_by' => $pharmacydetailsresults->created_by,
                       'created_on'=> $pharmacydetailsresults->created_on,
                       'altered_by' => $pharmacydetailsresults->altered_by,
                       'dola' => $pharmacydetailsresults->dola,
                       'physical_address' => $pharmacydetailsresults->physical_address,
                       'email' => $pharmacydetailsresults->email,
                       'telephone_no' => $pharmacydetailsresults->telephone_no,
                       'application_code' => $pharmacydetailsresults->application_code,
                       'name' => $pharmacydetailsresults->name,
                       'is_enabled' => $pharmacydetailsresults->is_enabled,
                       'personnel_id' => $pharmacydetailsresults->personnel_id,
                       'personnel_type_id' => $pharmacydetailsresults->personnel_type_id,
                       'email_address' => $pharmacydetailsresults->email_address,
                       'premise_id' => $pharmacydetailsresults->premise_id,
                       'risk_premise_type' => $pharmacydetailsresults->risk_premise_type,
                    //    'country_id' => $pharmacydetailsresults->country_id,
                  );
        $pharmacyresults_res = insertRecord('tra_pharmacy_details', $pharmacydata);
        if(!isset($pharmacyresults_res['record_id'])){
                DB::rollback();
                return $pharmacyresults_res;

         }
         }
         }
                        //Get portal patients details list
    $patientdetailsqry = $portal_db->table('wb_patient_details as t1')
    ->select('t1.*')
    ->where('t1.application_code',$application_code);
     $patientdetailsresults = $patientdetailsqry->get();
     if($patientdetailsresults){
     foreach ($patientdetailsresults as $patientdetailsresults) {
         # code...
        $patientdata = array(
             'product_id' => $product_id,
             'region_id' => $patientdetailsresults->region_id,
             'district_id' => $patientdetailsresults->district_id,
             'sub_district_id' => $patientdetailsresults->sub_district_id,
             'postal_address' => $patientdetailsresults->postal_address,
             'created_by' => $patientdetailsresults->created_by,
             'created_on'=> $patientdetailsresults->created_on,
             'altered_by' => $patientdetailsresults->altered_by,
             'dola' => $patientdetailsresults->dola,
             'physical_address' => $patientdetailsresults->physical_address,
             'email' => $patientdetailsresults->email,
             'telephone_no' => $patientdetailsresults->telephone_no,
             'application_code' => $patientdetailsresults->application_code,
             'name' => $patientdetailsresults->name,
             'is_enabled' => $patientdetailsresults->is_enabled,
             'personnel_id' => $patientdetailsresults->personnel_id,
             'personnel_type_id' => $patientdetailsresults->personnel_type_id,
             'email_address' => $patientdetailsresults->email_address,
            //  'gender_id' => $patientdetailsresults->gender_id,
            //  'id_no' => $patientdetailsresults->id_no,
            //  'age' => $patientdetailsresults->age,
        );
   $patientresults_res = insertRecord('tra_patient_details', $patientdata);
    if(!isset($patientresults_res['record_id'])){
      DB::rollback();
      return $patientresults_res;
      
         }
        }
       }
       
              //Get portal prescriber details list
    $prescriberdetailsqry = $portal_db->table('wb_prescriber_details as t1')
           ->select('t1.*')
           ->where('t1.product_id',$old_product_id);
   $prescriberdetailsresults = $prescriberdetailsqry->get();
  if($prescriberdetailsresults){
     foreach ($prescriberdetailsresults as $prescriberdetailsresults) {
         # code...
        $prescriberdata = array(
             'product_id' => $product_id,
             'personnel_id' => $prescriberdetailsresults->personnel_id,
             'qualification_id' => $prescriberdetailsresults->qualification_id,
             'position_id' => $prescriberdetailsresults->position_id,
             'created_by' => $prescriberdetailsresults->created_by,
             'created_on' => $prescriberdetailsresults->created_on,
             'altered_by'=> $prescriberdetailsresults->altered_by,
             'dola' => $prescriberdetailsresults->dola,
             'application_code' => $prescriberdetailsresults->application_code,
             'certification_no' => $prescriberdetailsresults->certification_no,
             'is_enabled' => $prescriberdetailsresults->is_enabled,
             'institution' => $prescriberdetailsresults->institution,
             'start_date' => $prescriberdetailsresults->start_date,
             'end_date' => $prescriberdetailsresults->end_date,
             'company_name' => $prescriberdetailsresults->company_name,
             'bhpc_number' => $prescriberdetailsresults->bhpc_number,
             'place_of_practice' => $prescriberdetailsresults->place_of_practice,
            //  'name' => $prescriberdetailsresults->name,
            //  'postal_address' => $prescriberdetailsresults->postal_address,
            //  'physical_address' => $prescriberdetailsresults->physical_address,
            //  'country_id' => $prescriberdetailsresults->country_id,
            //  'region_id' => $prescriberdetailsresults->region_id,
            //  'district_id' => $prescriberdetailsresults->district_id,
            //  'email_address' => $prescriberdetailsresults->email_address,
            //  'telephone_no' => $prescriberdetailsresults->telephone_no,
        );
    $prescriberresults_res = insertRecord('tra_prescriber_details', $prescriberdata);
   if(!isset($prescriberresults_res['record_id'])){
          DB::rollback();
         return $prescriberresults_res;

         }
    }
     }
              //Get portal imp distributor details list
        $impdistributordetailsqry = $portal_db->table('wb_impdistributor_details as t1')
              ->select('t1.*')
              ->where('t1.application_code',$application_code);
        $impdistributordetailsresults = $impdistributordetailsqry->get();
    if($impdistributordetailsresults){
            foreach ($impdistributordetailsresults as $impdistributordetailsresults) {
                  $impdistributordata = array(
                       'product_id' => $product_id,
                       'region_id' => $impdistributordetailsresults->region_id,
                       'district_id' => $impdistributordetailsresults->district_id,
                       'sub_district_id' => $impdistributordetailsresults->sub_district_id,
                       'postal_address' => $impdistributordetailsresults->postal_address,
                       'created_by' => $impdistributordetailsresults->created_by,
                       'created_on'=> $impdistributordetailsresults->created_on,
                       'altered_by' => $impdistributordetailsresults->altered_by,
                       'dola' => $impdistributordetailsresults->dola,
                       'physical_address' => $impdistributordetailsresults->physical_address,
                       'email_address' => $impdistributordetailsresults->email,
                       'telephone_no' => $impdistributordetailsresults->telephone_no,
                       'application_code' => $impdistributordetailsresults->application_code,
                       'name' => $impdistributordetailsresults->name,
                       'is_enabled' => $impdistributordetailsresults->is_enabled,
                       'importer_id' => $impdistributordetailsresults->importer_id,
                       'country_id' => $impdistributordetailsresults->country_id,
                       'premise_id' => $impdistributordetailsresults->premise_id,
                  );
            $impdistributor_res = insertRecord('tra_impdistributor_details', $impdistributordata);
    		if(!isset($impdistributor_res['record_id'])){
                    DB::rollback();
                    return $impdistributor_res;
                    }
               }
           }

              //Get portal  details list
        $medical_req_detailsqry = $portal_db->table('wb_exemptionanimal_medical_requirments as t1')
              ->select('t1.*')
              ->where('t1.product_id',$old_product_id);
        $medical_req_detailsresults = $medical_req_detailsqry->get();
        if($medical_req_detailsresults){
               foreach ($medical_req_detailsresults as $medical_req_detailsresults) {
                   # code...
                  $medical_req_data = array(
                       'product_id' => $product_id,
                       'prescription' => $medical_req_detailsresults->prescription,
                       'created_by' => $medical_req_detailsresults->created_by,
                       'created_on' => $medical_req_detailsresults->created_on,
                       'altered_by' => $medical_req_detailsresults->altered_by,
                       'dola' => $medical_req_detailsresults->dola,
                       'number_of_animals' => $medical_req_detailsresults->number_of_animals,
                       'clinical_condition' => $medical_req_detailsresults->clinical_condition,
                       'is_enabled' => $medical_req_detailsresults->is_enabled,
                       'medicine_details' => $medical_req_detailsresults->medicine_details,
                       'treatment_duration' => $medical_req_detailsresults->treatment_duration,
                       'exemption_product_id' => $medical_req_detailsresults->exemption_product_id,
                  );
                $medical_req_res = insertRecord('tra_exemptionanimal_medical_requirments', $medical_req_data);
                if(!isset($medical_req_res['record_id'])){
                    DB::rollback();
                  return $medical_req_res;
                   }
                }
            }
           $new_submission_params = array(
                'portal_application_id' => $portal_application_id,
                'new_application_id' => $active_application_id,
                "application_code" => $results->application_code,
                "tracking_no" => $results->tracking_no,
                "module_id" => $results->module_id,
                "sub_module_id" => $results->sub_module_id,
                "section_id" => $results->section_id,
                "prodclass_category_id" => $results->prodclass_category_id,
            );
        $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
         if(!isset($new_submission_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $new_submission_res;
        }
       //Mark as submitted
       $application_code = $results->application_code;
       $table_name = 'wb_onlinesubmissions';
       $where = array(
          'application_code' => $application_code
       );
       $data = array(
         'is_received' => 1,
         'application_code'=> $application_code,
         'application_status_id' => 3
         );
        $update_res = updateRecord($table_name, $where, $data, $user_id,'portal_db');
      if(!isset($update_res['record_id'])){
          DB::rollback();
          $portal_db->rollback();
          return $update_res;

         }
         //update application status
         $data = array(
            'application_status_id' => 3,
         );
         $update_res = updateRecord('wb_product_applications', $where, $data, $user_id,'portal_db');
         if(!isset($update_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $update_res;
  
           }
        DB::commit();
        $portal_db->commit();
        //notify next group users 
        notifyGroupUsers($workflow_stage_id, 12, ['{module_name}'=> 'Exemptions', '{process_name}'=> 'Exemption Process', '{application_no}'=>$results->tracking_no]);
        
   } catch (\Exception $exception) {
        DB::rollBack();
        $portal_db->rollBack();
        $res['success']=false;
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        $portal_db->rollBack();
        DB::rollBack();
        $res['success']=false;
       $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return $res;
   }
 // }
 }

public function receiveProductsPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id){
    $portal_db = DB::connection('portal_db');
    $portal_db->beginTransaction();
    DB::beginTransaction();
    //check duplicate application_code
    $duplicate_application_code = getSingleRecordColValue('tra_product_applications', array('application_code'=>$application_code), 'application_code');
    if(validateIsNumeric($duplicate_application_code)){
        $data = array(
            'dola' => Carbon::now(),
            'application_code'=> $application_code,
            'module_id' => $module_id,
            'type'=>5
        );
        $res = insertRecord('par_sync_error_log',$data,3,'audit_db');
        return array(
            'is_duplicate'=>1,
            'success' => false
        );
        //generate new application_code and update respective tables
        // $applications_table = 'tra_product_applications';
        // $new_application_code = generateApplicationCode($sub_module_id, $applications_table);
        // $where = array(
        //     'application_code' => $duplicate_application_code
        // );
        // $data = array(
        //     'dola' => Carbon::now(),
        //     'application_code'=> $new_application_code,
        // );
        // $update_res = updateRecord('wb_product_applications', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //    DB::rollback();
        //    return $update_res;
   
        //     }
        //     //wb_onlinesubmissions
        // $update_res = updateRecord('wb_onlinesubmissions', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //     DB::rollback();
        //     return $update_res;
       
        //         }
        // $update_res = updateRecord('wb_otherstates_productgmpinspections', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //             DB::rollback();
        //             return $update_res;
        //          }
        // $update_res = updateRecord('wb_otherstates_productregistrations', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //             DB::rollback();
        //             return $update_res;
        //         }
    }
    else{
    //Get portal product data other_container
    $qry = $portal_db->table('wb_product_applications as t1')
         ->leftJoin('wb_product_information as t2', 't1.product_id', 't2.id')
      ->select('t1.*','t2.*','t1.id as portal_application_id','t1.prodclass_category_id as prodclass_category_id');
    $qry->where('t1.application_code',$application_code);
    $results = $qry->first();
    if(!isset($results->id)){
        DB::rollBack();
        return ['message'=> 'record not found', 'success'=>false]; 
    }
    $portal_application_id =$results->portal_application_id;
    $module_id = $results->module_id;
    $sub_module_id = $results->sub_module_id;
    $section_id = $results->section_id;
    $prodclass_category_id = $results->prodclass_category_id;
    $view_id= generateApplicationViewID();
    $trader_id=$results->trader_id;
    $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
    $applicant_id = getInternalApplicant_id($identification_no);
    
    $process_qry = DB::table('wf_processes as t1')
                 ->select('t1.id')
                 ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'prodclass_category_id'=>$prodclass_category_id));
    $process_results = $process_qry->first();
    if(!isset($process_results->id)){
        DB::rollBack();
        return ['message'=> 'Process not found', 'success'=>false]; 
    }
    $process_id = $process_results->id;
    if($results){
        try {
            $prod_data = array(
            'common_name_id'=>$results->common_name_id,
            'product_type_id'=>$results->product_type_id,
            'classification_id'=>$results->classification_id,
            'chemical_entities_type_id'=>$results->chemical_entities_type_id,
            'efficacy_proof_type_id'=>$results->efficacy_proof_type_id,
            'brand_name'=>$results->brand_name,
            'common_name'=>$results->common_name,
            'physical_description'=>$results->physical_description,
            'dosage_form_id'=>$results->dosage_form_id,
            'strength'=>$results->strength,
            'storage_condition'=>$results->storage_condition,
            'product_origin_id'=>$results->product_origin_id,
            'intended_enduser_id'=>$results->intended_enduser_id,
            'intended_use_id'=>$results->intended_use_id,
            'route_of_administration_id'=>$results->route_of_administration_id,
            'section_id'=>$results->section_id,
            'contraindication'=>$results->contraindication,
            'gmdn_code'=>$results->gmdn_code,
            'shelf_lifeafter_opening'=>$results->shelf_lifeafter_opening,
            'shelf_life'=>$results->shelf_life,
            'instructions_of_use'=>$results->instructions_of_use,
            'warnings'=>$results->warnings,
            'intended_use'=>$results->intended_use,
            'indications'=>$results->indications,
            'strength_si_unit'=>$results->strength_si_unit,
            'gmdn_category_id'=>$results->gmdn_category_id,
            'gmdn_term'=>$results->gmdn_term,
            'paying_currency_id'=>$results->paying_currency_id,
            'fasttrack_option_id'=>$results->fasttrack_option_id,
            'remarks'=>$results->remarks,
                // 'medical_systemmodel_series'=>$results->medical_systemmodel_series,

                // 'shelflifeduration_desc'=>$results->shelflifeduration_desc,
                // 'shelflifeafteropeningduration_desc'=>$results->shelflifeafteropeningduration_desc,
                // 'reason_for_classification_id'=>$results->reason_for_classification_id,
                // 'prodclass_category_id'=>$prodclass_category_id,
                // 'productrisk_category_id'=>$results->productrisk_category_id,
                // 'reagents_accessories'=>$results->reagents_accessories,
            'has_family'=>$results->has_family,
            'device_family'=>$results->device_family,
            'has_reagents'=>$results->has_reagents,
            'device_reagents'=>$results->device_reagents,
            'has_accessories'=>$results->has_accessories,
            'device_accessories'=>$results->device_accessories,
            'model_name'=>$results->model_name,
            'software_version'=>$results->software_version,
            'device_intended_use'=>$results->device_intended_use,
            'device_brand_name'=>$results->device_brand_name,
            'device_report'=>$results->device_report,
            'productrisk_category_id'=>$results->productrisk_category_id,
            'clinical_condition'=>$results->clinical_condition,
            'device_classification_rules_id'=>$results->device_classification_rules_id,
            'device_cluster' =>$results->device_cluster,
            'device_compliance_standards' =>$results->device_compliance_standards,
            'gs1_udi' =>$results->gs1_udi,
            'udi_available' => $results->udi_available,
            'gs1_udi_available' => $results->gs1_udi_available,
            'has_cluster' => $results->has_cluster,
            'qms_area' => $results->qms_area,
            'qms_established' => $results->qms_established,
            'technical_doc_summary' => $results->technical_doc_summary,
            'listing_no' => $results->listing_no,
            'is_listed' => $results->is_listed,
            'country_id' => $results->country_id,
            'created_by'=>$results->created_by,
            'created_on'=>$results->created_on,
        );
  
    $applications_table = 'tra_product_applications';
    $products_table = 'tra_product_information';
    $res = insertRecord('tra_product_information', $prod_data, $user_id);
    
    if(!isset($res['record_id'])){
        DB::rollback();
        return $res;

         }
    $record_id = $res['record_id'];
    $product_id = $res['record_id'];
    $app_data = array(
        "process_id" => $process_id,
        "applicant_id" => $applicant_id,
        'view_id' => $view_id,
        "reg_serial" =>$results->reg_serial,
        "workflow_stage_id" => $results->workflow_stage_id,
        "application_status_id" => $results->application_status_id,
        "application_code" => $results->application_code,
        "reference_no" =>$results->reference_no,
        "tracking_no" => $results->tracking_no,
        "sub_module_id" => $results->sub_module_id,
        "module_id" => $results->module_id,
        "section_id" => $results->section_id,
        "product_id" => $product_id,
        "local_agent_id" => $results->local_agent_id,
        "paying_currency_id" =>$results->paying_currency_id,
        "assessment_procedure_id" =>$results->assessment_procedure_id,
        "assessmentprocedure_type_id" =>$results->assessmentprocedure_type_id,
        'prodclass_category_id' => $results->prodclass_category_id,
        "product_type_id" => $results->product_type_id,
        "date_added" => $results->date_added,
        'appeal_type_id' => $results->appeal_type_id,
        'withdrawal_type_id' => $results->withdrawal_type_id,
        'reg_product_id' => $results->reg_product_id,
        "created_by" => $results->created_by,
        "fasttrack_option_id" => $results->fasttrack_option_id,
        "created_on" => Carbon::now()
    );
    $app_res = insertRecord('tra_product_applications', $app_data, $user_id);
    if(!isset($app_res['record_id'])){
        DB::rollback();
        return $app_res;

         }
    $active_application_id = $app_res['record_id'];
    $Stage_qry = DB::table('wf_processes as t1')
            ->select('t1.workflow_id')
            ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'prodclass_category_id'=>$prodclass_category_id));
    
    $Stage_qry_results = $Stage_qry->first();
    if($Stage_qry_results){
        $workflow_id =$Stage_qry_results->workflow_id;
        $stage_id_qry = DB::table('wf_workflow_stages as t1')
                    ->select('t1.id')
                    ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
        $stage_id_results = $stage_id_qry->first();
        if(!isset($stage_id_results->id)){
            DB::rollBack();
            return ['message'=> 'Initial portal receiving stage not found', 'success'=>false]; 
        }
        $previous_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'is_portalapp_previousstage'=>1), 'id');
        if (!validateIsNumeric($previous_stage_id)){
            $previous_stage_id = $stage_id_results->id;
         }
           //check on online applications
        $application_code = $results->application_code;
        $is_paid_id = getSingleRecordColValue('tra_payments', array('application_code'=>$application_code), 'id');
        if (!validateIsNumeric($is_paid_id)){
            $workflow_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'stage_category_id'=>22), 'id');
            if(!validateIsNumeric($workflow_stage_id)){
                $workflow_stage_id = $stage_id_results->id;
            }
         }
         else{
            $workflow_stage_id = $stage_id_results->id;
         }
        $submission_params = array(
            'application_id' => $active_application_id,
            "process_id" => $process_id,
            "application_code" => $results->application_code,
            'prodclass_category_id' => $results->prodclass_category_id,
            "tracking_no" => $results->tracking_no,
            'usr_from' => $user_id,
            //'usr_to' => ,
            'previous_stage' => $previous_stage_id,
            'current_stage' => $workflow_stage_id,
            "module_id" => $results->module_id,
            "sub_module_id" => $results->sub_module_id,
            "section_id" => $results->section_id,
            "application_status_id" =>5,
            'urgency' => 1,
            "applicant_id" => $applicant_id,
            'remarks' => 'Online Received Application',
            'date_received' => Carbon::now(),
            'created_on' => Carbon::now(),
            'is_fast_track' => $results->fasttrack_option_id,
            'created_by' => $user_id
        );
        $sub_res = insertRecord('tra_submissions', $submission_params);
        if(!isset($sub_res['record_id'])){
            DB::rollback();
            return $sub_res;
             }
            }
        else{
            DB::rollBack();
            return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
        }
           //Get portal product ingredients data
    $ingredientsqry = $portal_db->table('wb_product_applications as t1')
        ->leftjoin('wb_product_ingredients as t3', 't1.product_id', 't3.product_id')
        ->select('t3.*')
        ->where('t1.application_code',$application_code);
        $ingredientsresults = $ingredientsqry->get();
    if($ingredientsresults){
    foreach($ingredientsresults as $ingredientsresults){
         $ingredientsdata =array(
                'product_id' => $product_id,
                'ingredient_type_id' => $ingredientsresults->ingredient_type_id,
                'ingredient_id' => $ingredientsresults->ingredient_id,
                'specification_type_id' => $ingredientsresults->specification_type_id,
                'strength' => $ingredientsresults->strength,
                'proportion' => $ingredientsresults->proportion,
                'ingredientssi_unit_id' => $ingredientsresults->ingredientssi_unit_id,
                'inclusion_reason_id' => $ingredientsresults->inclusion_reason_id,
                'acceptance_id' => $ingredientsresults->acceptance_id,
                'atc_code' => $ingredientsresults->atc_code,
                'atc_code_id' => $ingredientsresults->atc_code_id,
                'atc_code_description' => $ingredientsresults->atc_code_description,
                'altenative_name' =>$ingredientsresults->altenative_name,
                'ing_processing' =>$ingredientsresults->ing_processing,
                'ing_source' => $ingredientsresults->ing_source,
                'cas_number' => $ingredientsresults->cas_number,
                'strengh' => $ingredientsresults->strengh,
                'created_by' => $ingredientsresults->created_by,
                'created_on' => $ingredientsresults->created_on,
                'altered_by' => $ingredientsresults->altered_by,
                'dola' => $ingredientsresults->dola,
         );
         $ingredients_res = insertRecord('tra_product_ingredients', $ingredientsdata);
         if(!isset($ingredients_res['record_id'])){
            DB::rollback();
            return $ingredients_res;

             }

       }

      }
           //Get portal product Packaging data other_container_type
    $packagingqry = $portal_db->table('wb_product_applications as t1')
       ->leftjoin('wb_product_packaging as t3', 't1.product_id', 't3.product_id')
       ->select('t3.*')
       ->where('t1.application_code',$application_code);
    $packagingresults = $packagingqry->get();
    
    if($packagingresults){
        foreach ($packagingresults as $packagingresults) {
            # code...
           $packagingdata = array(
               'product_id' => $product_id,
                'container_type_id' => $packagingresults->container_type_id,
                'container_id' => $packagingresults->container_id,
                'container_material_id' => $packagingresults->container_material_id,
                'closure_material_id' => $packagingresults->closure_material_id,
                'other_container' => $packagingresults->other_container,
                'other_container_type' => $packagingresults->other_container_type,
                'other_container_material'=> $packagingresults->other_container_material,
                'seal_type_id' => $packagingresults->seal_type_id,
                'retail_packaging_size' => $packagingresults->retail_packaging_size,
                'retail_packaging_size1' => $packagingresults->retail_packaging_size1,
                'retail_packaging_size2' => $packagingresults->retail_packaging_size2,
                'retail_packaging_size3' => $packagingresults->retail_packaging_size3,
                'retail_packaging_size4' => $packagingresults->retail_packaging_size4,
                'retail_packaging_size5' => $packagingresults->retail_packaging_size5,
                'packaging_units_id' => $packagingresults->packaging_units_id,
                'unit_pack' => $packagingresults->unit_pack,
                'diluents' => $packagingresults->diluents,
                'product_unit' => $packagingresults->product_unit,
                'created_by' => $packagingresults->created_by,
                'created_on' => $packagingresults->created_on,
                'altered_by' => $packagingresults->altered_by,
                'dola' => $packagingresults->dola,

           );
           $packaging_res = insertRecord('tra_product_packaging', $packagingdata);
           if(!isset($packaging_res['record_id'])){
            DB::rollback();
            return $packaging_res;

             }

        }
      }
           //Get portal product Manufactuers data
    $manufacturerqry = $portal_db->table('wb_product_applications as t1')
       ->leftjoin('wb_product_manufacturers as t3', 't1.product_id', 't3.product_id')
       ->select('t3.*')
       ->where('t1.application_code',$application_code);
    $manufactureresults = $manufacturerqry->get();
    if($manufactureresults){
        foreach ($manufactureresults as $manufactureresults) {
            # code...
           $manufacturerdata = array(
                'product_id' => $product_id,
                'manufacturer_id' => $manufactureresults->manufacturer_id,
                'man_site_id' => $manufactureresults->man_site_id,
                //'container_material_id' => $manufactureresults->container_material_id,
                'manufacturer_role_id' => $manufactureresults->manufacturer_role_id,
                'manufacturer_status_id' => $manufactureresults->manufacturer_status_id,
                'manufacturer_type_id' => $manufactureresults->manufacturer_type_id,
                'other_manufacturer_role'=> $manufactureresults->other_manufacturer_role,
                'manufacturer_block' => $manufactureresults->manufacturer_block,
                'active_ingredient_id' => $manufactureresults->active_ingredient_id,
                'manufacturer_unit' => $manufactureresults->manufacturer_unit,
                'created_by' => $manufactureresults->created_by,
                'created_on' => $manufactureresults->created_on,
                'altered_by' => $manufactureresults->altered_by,
                'dola' => $manufactureresults->dola,

           );
           $manufacturing_res = insertRecord('tra_product_manufacturers', $manufacturerdata);
           if(!isset($manufacturing_res['record_id'])){
            DB::rollback();
            return $manufacturing_res;

             }

        }
      }
           //Get portal product Api Manufacturer data
    $Apimanufacturerqry = $portal_db->table('wb_product_applications as t1')
       ->leftjoin('wb_product_manufacturers as t3', 't1.product_id', 't3.product_id')
       ->select('t3.*')
       ->where('t1.application_code',$application_code);
    $manufactureresults = $manufacturerqry->get();
    if($manufactureresults){
        foreach ($manufactureresults as $manufactureresults) {
            # code...
           $manufacturerdata = array(
                'product_id' => $product_id,
                'manufacturer_id' => $manufactureresults->manufacturer_id,
                'man_site_id' => $manufactureresults->man_site_id,
                //'container_material_id' => $manufactureresults->container_material_id,
                'manufacturer_role_id' => $manufactureresults->manufacturer_role_id,
                'manufacturer_status_id' => $manufactureresults->manufacturer_status_id,
                'manufacturer_type_id' => $manufactureresults->manufacturer_type_id,
                'other_manufacturer_role'=> $manufactureresults->other_manufacturer_role,
                'manufacturer_block' => $manufactureresults->manufacturer_block,
                'active_ingredient_id' => $manufactureresults->active_ingredient_id,
                'manufacturer_unit' => $manufactureresults->manufacturer_unit,
                'created_by' => $manufactureresults->created_by,
                'created_on' => $manufactureresults->created_on,
                'altered_by' => $manufactureresults->altered_by,
                'dola' => $manufactureresults->dola,

           );
           $packaging_res = insertRecord('tra_product_manufacturers', $manufacturerdata);
           if(!isset($packaging_res['record_id'])){
            DB::rollback();
            return $packaging_res;

             }

        }
      }
           //Get portal product gmpinspectiondetails  data
    $gmpinspectiondetailsqry = $portal_db->table('wb_product_applications as t1')
       ->leftjoin('wb_product_gmpinspectiondetails as t3', 't1.product_id', 't3.product_id')
       ->select('t3.*')
       ->where('t1.application_code',$application_code);
    $gmpinspectiondetailsresults = $gmpinspectiondetailsqry->get();
    // dd($gmpinspectiondetailsresults);
    if($gmpinspectiondetailsresults){
        foreach ($gmpinspectiondetailsresults as $gmpinspectiondetailsresults) {
            # code...
           $gmpinspectiondetailsdata = array(
                'product_id' => $product_id,
                'reg_product_id' => $gmpinspectiondetailsresults->reg_product_id,
                'reg_site_id' => $gmpinspectiondetailsresults->reg_site_id,
                'manufacturing_site_id' => $gmpinspectiondetailsresults->manufacturing_site_id,
                'init_site_id' => $gmpinspectiondetailsresults->init_site_id,
                'gmp_productline_id' => $gmpinspectiondetailsresults->gmp_productline_id,
                //'gmpproduct_line_id' => $gmpinspectiondetailsresults->gmpproduct_line_id,
                'status_id'=> $gmpinspectiondetailsresults->status_id,
                'created_by' => $gmpinspectiondetailsresults->created_by,
                'created_on' => $gmpinspectiondetailsresults->created_on,
                'altered_by' => $gmpinspectiondetailsresults->altered_by,
                'dola' => $gmpinspectiondetailsresults->dola,

           );
           $gmpinspectiondetails_res = insertRecord('tra_product_gmpinspectiondetails', $gmpinspectiondetailsdata);
           if(!isset($gmpinspectiondetails_res['record_id'])){
            DB::rollback();
            return $gmpinspectiondetails_res;

             }

        }
      }
           //Get portal product otherstates productgmpinspections  data
    $otherstatesgmpinspectiondetailsqry = $portal_db->table('wb_product_applications as t1')
       ->leftjoin('wb_otherstates_productgmpinspections as t3', 't1.product_id', 't3.product_id')
       ->select('t3.*')
       ->where('t1.application_code',$application_code);
    $otherstatesgmpinspectiondetailsqryresults = $otherstatesgmpinspectiondetailsqry->get();
    
    if($otherstatesgmpinspectiondetailsqryresults){
        foreach ($otherstatesgmpinspectiondetailsqryresults as $otherstatesgmpinspectiondetailsqryresults) {
            # code...
           $otherstatesgmpinspectiondetailsdata = array(
                'product_id' => $product_id,
                'application_code' => $otherstatesgmpinspectiondetailsqryresults->application_code,
                'continent_region_id' => $otherstatesgmpinspectiondetailsqryresults->continent_region_id,
                'country_id' => $otherstatesgmpinspectiondetailsqryresults->country_id,
                'gmpapplication_reference' => $otherstatesgmpinspectiondetailsqryresults->gmpapplication_reference,
                'inspection_date' => $otherstatesgmpinspectiondetailsqryresults->inspection_date,
                'approval_date' => $otherstatesgmpinspectiondetailsqryresults->approval_date,
                'approving_authority'=> $otherstatesgmpinspectiondetailsqryresults->approving_authority,
                'approved_productlines' => $otherstatesgmpinspectiondetailsqryresults->approved_productlines,
                'is_enabled' => $otherstatesgmpinspectiondetailsqryresults->is_enabled,
                'created_by' => $otherstatesgmpinspectiondetailsqryresults->created_by,
                'created_on' => $otherstatesgmpinspectiondetailsqryresults->created_on,
                'altered_by' => $otherstatesgmpinspectiondetailsqryresults->altered_by,
                'dola' => $otherstatesgmpinspectiondetailsqryresults->dola,

           );
           $otherstatesgmpinspectiondetails_res = insertRecord('tra_otherstates_productgmpinspections', $otherstatesgmpinspectiondetailsdata);
           if(!isset($otherstatesgmpinspectiondetails_res['record_id'])){
            DB::rollback();
            return $otherstatesgmpinspectiondetails_res;

             }

        }
      }
           //Get portal product REGISTRATION ON OTHER COUNTRIES data
    $othercontriesregistrationdetailsqry = $portal_db->table('wb_product_applications as t1')
       ->leftjoin('wb_otherstates_productregistrations as t3', 't1.application_code', 't3.application_code')
       ->select('t3.*')
       ->where('t1.application_code',$application_code);
    $othercontriesregistrationdetailsqryresults = $othercontriesregistrationdetailsqry->get();
    if(isset($othercontriesregistrationdetailsqryresults)){
        foreach ($othercontriesregistrationdetailsqryresults as $othercontriesregistrationdetailsqryresults) {
            # code...
           $othercontriesregistrationdetailsqrydata = array(
                //'product_id' => $product_id,
                'application_code' => $othercontriesregistrationdetailsqryresults->application_code,
                'continent_region_id' => $othercontriesregistrationdetailsqryresults->continent_region_id,
                'country_id' => $othercontriesregistrationdetailsqryresults->country_id,
                'registration_ref' => $othercontriesregistrationdetailsqryresults->registration_ref,
                'date_of_registration' => $othercontriesregistrationdetailsqryresults->date_of_registration,
                'current_registrationstatus' => $othercontriesregistrationdetailsqryresults->current_registrationstatus,
                'approving_authority'=> $othercontriesregistrationdetailsqryresults->approving_authority,
                'is_enabled' => $othercontriesregistrationdetailsqryresults->is_enabled,
                'created_by' => $othercontriesregistrationdetailsqryresults->created_by,
                'created_on' => $othercontriesregistrationdetailsqryresults->created_on,
                'altered_by' => $othercontriesregistrationdetailsqryresults->altered_by,
                'dola' => $othercontriesregistrationdetailsqryresults->dola,

           );
           $othercontriesregistrationdetails_res = insertRecord('tra_otherstates_productregistrations', $othercontriesregistrationdetailsqrydata);
           if(!isset($othercontriesregistrationdetails_res['record_id'])){
            DB::rollback();
            return $othercontriesregistrationdetails_res;

             }

        }
      }
      $new_submission_params = array(
        'portal_application_id' => $portal_application_id,
        'new_application_id' => $active_application_id,
        "application_code" => $results->application_code,
        "tracking_no" => $results->tracking_no,
        "module_id" => $results->module_id,
        "sub_module_id" => $results->sub_module_id,
        "section_id" => $results->section_id,
        "prodclass_category_id" => $results->prodclass_category_id,
    );
    $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
    if(!isset($new_submission_res['record_id'])){
        $portal_db->rollback();
        DB::rollback();
        return $new_submission_res;

         }
         //Mark as submitted
         $application_code = $results->application_code;
         $table_name = 'wb_onlinesubmissions';
         $where = array(
             'application_code' => $application_code
         );
         $data = array(
             'is_received' => 1,
             'application_code'=> $application_code,
             'application_status_id'=>5
         );
         $update_res = updateRecord($table_name, $where, $data, $user_id,'portal_db');
         if(!isset($update_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $update_res;
    
             }
    //update application status
    $data = array(
        'application_status_id'=>3
    );
    $update_res = updateRecord('wb_product_applications', $where, $data, $user_id,'portal_db');
    if(!isset($update_res['record_id'])){
       DB::rollback();
       $portal_db->rollback();
       return $update_res;

        }
    DB::commit();
    $portal_db->commit();

  } catch (\Exception $exception) {
        DB::rollBack();
        $portal_db->rollback();
        $res['success']=false;
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        DB::rollBack();
        $portal_db->rollback();
        $res['success']=false;
       $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return $res;
      }
}
}

public function receiveFacilityPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id){
    try {
    $portal_db = DB::connection('portal_db');
    $portal_db->beginTransaction();
    DB::beginTransaction();
    //Get portal premise data
    //check duplicate application_code
    $duplicate_application_code = getSingleRecordColValue('tra_premises_applications', array('application_code'=>$application_code), 'application_code');
    if(validateIsNumeric($duplicate_application_code)){
        $data = array(
            'dola' => Carbon::now(),
            'application_code'=> $application_code,
            'module_id' => $module_id,
            'type'=>5
        );
        $res = insertRecord('par_sync_error_log',$data,3,'audit_db');
        return array(
            'is_duplicate'=>1,
            'success' => false
        );
        //generate new application_code and update respective tables
        // $applications_table = 'tra_premises_applications';
        // $new_application_code = generateApplicationCode($sub_module_id, $applications_table);
        // $where = array(
        //     'application_code' => $duplicate_application_code
        // );
        // $data = array(
        //     'dola' => Carbon::now(),
        //     'application_code'=> $new_application_code,
        // );
        // $update_res = updateRecord('wb_premises_applications', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //    DB::rollback();
        //    return $update_res;
   
        //     }
        //     //wb_onlinesubmissions
        // $update_res = updateRecord('wb_onlinesubmissions', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //     DB::rollback();
        //     return $update_res;
       
        //         }
    }
    else{
    $qry = $portal_db->table('wb_premises_applications as t1')
         ->leftJoin('wb_premises as t2', 't1.premise_id', 't2.id')
         ->select('t1.*','t2.*');
    $qry->where('t1.application_code',$application_code);
    $results = $qry->first();
    if(!isset($results->id)){
        DB::rollBack();
        return ['message'=> 'record not found', 'success'=>false]; 
    }
    $portal_application_id = $results->id;
    $module_id = $results->module_id;
    $sub_module_id = $results->sub_module_id;
    $section_id = $results->section_id;
    $premise_type_id = $results->premise_type_id;
    $view_id = generateApplicationViewID();
    $trader_id = $results->trader_id;
    $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
    $applicant_id = getInternalApplicant_id($identification_no);
      // get process id
    $process_qry = DB::table('wf_processes as t1')
                 ->select('t1.id')
                 ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'premise_type_id'=>$premise_type_id));
    $process_results = $process_qry->first();
    if(!isset($process_results->id)){
        DB::rollBack();
        return ['message'=> 'Process not found', 'success'=>false]; 
    }
    $process_id = $process_results->id;
    if($results){
        $premise_params = array(
            'applicant_id' =>$applicant_id,
            'name' => $results->name,
            'section_id' => $results->section_id,
            'country_id' => $results->country_id,
            'region_id' => $results->region_id,
            'district_id' => $results->district_id,
            'street' => $results->street,
            'telephone' => $results->telephone,
            'fax' => $results->fax,
            'email' => $results->email,
            'website' => $results->website,
            'physical_address' => $results->physical_address,
            'postal_address' => $results->postal_address,
            'business_scale_id' => $results->business_scale_id,
            'business_type_id' => $results->business_type_id,
            'schedule_id' => $results->schedule_type_id,
            'hospital_facilityname' => $results->hospital_facilityname,
            'longitude' => $results->longitude,
            'latitude' => $results->latitude,
            'contact_person_id' => $results->contact_person_id,
            'contact_person_startdate' => $results->contact_person_startdate,
            'contact_person_enddate' => $results->contact_person_enddate,
            'premise_type_id' => $results->premise_type_id,
            // 'vehicle_reg_no' => $vehicle_reg_no,
            'businesstype_class_id' => $results->businesstype_class_id,
            'has_previous_payments' => $results->has_previous_payments,
            'previous_application_no' => $results->previous_application_no,
            'previousreceipt_number' => $results->previousreceipt_number,
            'previousamount_paid' => $results->previousamount_paid,
            'previousinvoice_number'=> $results->previousinvoice_number,
            'tpin_no'   => $results->tpin_no,
            'pacra_reg_no' => $results->pacra_reg_no,
            'hospital_regpremise_id' => $results->hospital_regpremise_id,
            'retail_in_hospital' => $results->retail_in_hospital
        );

    $premise_table = 'tra_premises';
    $applications_table = 'tra_premises_applications';
    $res = insertRecord('tra_premises', $premise_params, $user_id);
    if(!isset($res['record_id'])){
        DB::rollback();
        return $res;

         }
    $premise_id = $res['record_id'];
    $application_params = array(
        'premise_id' => $premise_id,
        'process_id' =>$process_id,
        'applicant_id' => $applicant_id,
        'view_id' =>$view_id,
        'module_id' =>$results->module_id,
        'sub_module_id' =>$results->sub_module_id,
        'section_id' => $results->section_id,
        'application_code' =>$results->application_code,
        'application_region_id' =>$results->application_region_id,
        'branch_id' =>$results->branch_id,
        'tracking_no' =>$results->tracking_no,
        'premise_type_id'=>$results->premise_type_id,
        'application_status_id' =>$results->application_status_id,
        'fasttrack_option_id'=>$results->fasttrack_option_id,
    );

    $app_res = insertRecord('tra_premises_applications', $application_params, $user_id);
    if(!isset($app_res['record_id'])){
        DB::rollback();
        return $app_res;

         }
    $active_application_id = $app_res['record_id'];
     //add to submissions table
    $Stage_qry = DB::table('wf_processes as t1')
        ->select('t1.workflow_id')
        ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'premise_type_id'=>$premise_type_id));
    $Stage_qry_results = $Stage_qry->first();
    if($Stage_qry_results){
        $workflow_id = $Stage_qry_results->workflow_id;
        $stage_id_qry = DB::table('wf_workflow_stages as t1')
                ->select('t1.id')
                ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
        $stage_id_results = $stage_id_qry->first();
        if(!isset($stage_id_results->id)){
            DB::rollBack();
            return ['message'=> 'portal initial stage not set', 'success'=>false]; 
        }
    $previous_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'is_portalapp_previousstage'=>1), 'id');
    if (!validateIsNumeric($previous_stage_id)){
        $previous_stage_id = $stage_id_results->id;
     }
       //check on online applications
    $application_code = $results->application_code;
    $is_paid_id = getSingleRecordColValue('tra_payments', array('application_code'=>$application_code), 'id');
    if (!validateIsNumeric($is_paid_id)){
        $workflow_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'stage_category_id'=>22), 'id');
        if(!validateIsNumeric($workflow_stage_id)){
            $workflow_stage_id = $stage_id_results->id;
        }
     }
        else{
           $workflow_stage_id = $stage_id_results->id;
        }
    $submission_params = array(
        'application_id' => $active_application_id,
        "process_id" => $process_id,
        "application_code" => $results->application_code,
        'premise_type_id' => $results->premise_type_id,
        "tracking_no" => $results->tracking_no,
        'usr_from' => $user_id,
       // 'usr_to' => $user_id,
        'previous_stage' => $previous_stage_id,
        'current_stage' => $workflow_stage_id,
        "module_id" => $results->module_id,
        "sub_module_id" => $results->sub_module_id,
        "section_id" => $results->section_id,
        "application_status_id" => 5,
        'urgency' => 1,
        "applicant_id" => $applicant_id,
        'remarks' => 'Online Received Application',
        'date_received' => Carbon::now(),
        'created_on' => Carbon::now(),
        'is_fast_track' => $results->fasttrack_option_id,
        'created_by' => $user_id
    );

    $sub_res = insertRecord('tra_submissions', $submission_params);
    if(!isset($sub_res['record_id'])){
    DB::rollback();
    return $sub_res;
     }
     
    }
    else{
        DB::rollBack();
        return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
     }

                       //Replicate Facility Other Details
    $premisespersonnelsqry = $portal_db->table('wb_premises_applications as t1')
       ->leftjoin('wb_premises_personnel as t2', 't1.premise_id', 't2.premise_id')
       ->select('t2.*')
       ->where('t1.application_code',$application_code);
    $premisespersonnelsqryresults = $premisespersonnelsqry->get();
    if($premisespersonnelsqryresults){
    foreach ($premisespersonnelsqryresults as $premisespersonnelsqryresults) {
            # code...
           $premisespersonnelsqryresultsdata = array(
                'premise_id' => $premise_id,
                'personnel_id' => $premisespersonnelsqryresults->personnel_id,
                'position_id' => $premisespersonnelsqryresults->position_id,
                'qualification_id' => $premisespersonnelsqryresults->qualification_id,
                'registration_no' => $premisespersonnelsqryresults->registration_no,
                'study_field_id' => $premisespersonnelsqryresults->study_field_id,
                'institution'=> $premisespersonnelsqryresults->institution,
                'start_date' => $premisespersonnelsqryresults->start_date,
                'end_date' => $premisespersonnelsqryresults->end_date,
                'status_id' => $premisespersonnelsqryresults->status_id,
                'created_by' => $premisespersonnelsqryresults->created_by,
                'created_on'=> $premisespersonnelsqryresults->created_on,
                'dola' => $premisespersonnelsqryresults->dola,
           );
           $premisespersonnelsqryresults_res = insertRecord('tra_premises_personnel', $premisespersonnelsqryresultsdata);
           if(!isset($premisespersonnelsqryresults_res['record_id'])){
            DB::rollback();
            return $premisespersonnelsqryresults_res;

             }
        }
      }
       //Get portalpremises proprietors  data
    $premisesproprietorsdetailsqry = $portal_db->table('wb_premises_applications as t1')
     ->leftjoin('wb_premises_proprietors as t2', 't1.premise_id', 't2.premise_id')
     ->select('t2.*')
     ->where('t1.application_code',$application_code);
    $premisesproprietorsdetailsresults = $premisesproprietorsdetailsqry->get();
    if($premisesproprietorsdetailsresults){
    foreach ($premisesproprietorsdetailsresults as $premisesproprietorsdetailsresults) {
        # code...
       $premisesproprietorsdetailsdata = array(
            'premise_id' => $premise_id,
            'name' => $premisesproprietorsdetailsresults->name,
            'sex_id' => $premisesproprietorsdetailsresults->sex_id,
            'nationality_id' => $premisesproprietorsdetailsresults->nationality_id,
            //'had_offence' => $premisesproprietorsdetailsresults->had_offence,
            //'had_license_revoke_denied' => $premisesproprietorsdetailsresults->had_license_revoke_denied,
            //'offence'=> $premisesproprietorsdetailsresults->offence,
           // 'lic_deniedrevoked_reason' => $premisesproprietorsdetailsresults->lic_deniedrevoked_reason,
            'telephone_no' => $premisesproprietorsdetailsresults->telephone_no,
            'email_address' => $premisesproprietorsdetailsresults->email_address,
            'physical_address' => $premisesproprietorsdetailsresults->physical_address,
            'occupation' => $premisesproprietorsdetailsresults->occupation,
            'identification_type_id' => $premisesproprietorsdetailsresults->identification_type_id,
            'identification_no' => $premisesproprietorsdetailsresults->identification_no,
            'altered_by' => $premisesproprietorsdetailsresults->altered_by,
            'dola' => $premisesproprietorsdetailsresults->dola,
            'dob' => $premisesproprietorsdetailsresults->dob,
            'created_by'=> $premisesproprietorsdetailsresults->created_by,

       );
       $premisesproprietorsdetails_res = insertRecord('tra_premises_proprietors', $premisesproprietorsdetailsdata);
       if(!isset($premisesproprietorsdetails_res['record_id'])){
        DB::rollback();
        return $premisesproprietorsdetails_res;

         }
    }
    $new_submission_params = array(
        'portal_application_id' => $portal_application_id,
        'new_application_id' => $active_application_id,
        "application_code" => $results->application_code,
        "tracking_no" => $results->tracking_no,
        "module_id" => $results->module_id,
        "sub_module_id" => $results->sub_module_id,
        "section_id" => $results->section_id,
        "premise_type_id" => $results->premise_type_id,
    );

    $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
    if(!isset($new_submission_res['record_id'])){
        $portal_db->rollback();
        DB::rollback();
        return $new_submission_res;
         }
         //Mark as submitted
         $application_code = $results->application_code;
         $table_name = 'wb_onlinesubmissions';
         $where = array(
             'application_code' => $application_code
         );
         $data = array(
             'is_received' => 1,
             'application_code'=> $application_code,
         );
         $update_res = updateRecord($table_name, $where, $data, $user_id,'portal_db');
         if(!isset($update_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $update_res;
    
             }
         //update application status
     $data = array(
        'application_status_id' => 3
    );
    $update_res = updateRecord('wb_premises_applications', $where, $data, $user_id,'portal_db');
    if(!isset($update_res['record_id'])){
       DB::rollback();
       $portal_db->rollback();
       return $update_res;

        }
        }
         }
        } 
        DB::commit();
        $portal_db -> commit();
        }
        catch (\Exception $exception) {
            $portal_db->rollback();
            DB::rollBack();
           $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $portal_db->rollback();
           $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
        }
       return $res;
}

public function receiveGmpPortalApplication($module_id,$sub_module_id,$section_id,$application_cod,$user_id){
    try {
        $portal_db = DB::connection('portal_db');
        $portal_db->beginTransaction();
        DB::beginTransaction();
                    //Get portal  data
        //check duplicate application_code
        $duplicate_application_code = getSingleRecordColValue('tra_gmp_applications', array('application_code'=>$application_code), 'application_code');
        if(validateIsNumeric($duplicate_application_code)){
                        $data = array(
                            'dola' => Carbon::now(),
                            'application_code'=> $application_code,
                            'module_id' => $module_id,
                            'type'=>5
                        );
                        $res = insertRecord('par_sync_error_log',$data,3,'audit_db');
                        return array(
                            'is_duplicate'=>1,
                            'success' => false
                        );
                        //generate new application_code and update respective tables
                        // $applications_table = 'tra_gmp_applications';
                        // $new_application_code = generateApplicationCode($sub_module_id, $applications_table);
                        // $where = array(
                        //     'application_code' => $duplicate_application_code
                        // );
                        // $data = array(
                        //     'dola' => Carbon::now(),
                        //     'application_code'=> $new_application_code,
                        // );
                        // $update_res = updateRecord('wb_gmp_applications', $where, $data, $user_id,'portal_db');
                        // if(!isset($update_res['record_id'])){
                        //    DB::rollback();
                        //    return $update_res;
                   
                        //     }
                        //     //wb_onlinesubmissions
                        // $update_res = updateRecord('wb_onlinesubmissions', $where, $data, $user_id,'portal_db');
                        // if(!isset($update_res['record_id'])){
                        //     DB::rollback();
                        //     return $update_res;
                       
                        //         }
                    }
        else{
        $qry = $portal_db->table('wb_gmp_applications as t1')
            ->leftJoin('wb_manufacturing_sites as t2', 't1.manufacturing_site_id', 't2.id')
            ->select('t1.*','t2.*');
        $qry->where('t1.application_code',$application_code);
        $results = $qry->first();
        if(!isset($results->id)){
            DB::rollBack();
            return ['message'=> 'record not found', 'success'=>false]; 
        }
        $portal_application_id = $results->id;
        $module_id = $results->module_id;
        $sub_module_id = $results->sub_module_id;
        $section_id = $results->section_id;
        $view_id = generateApplicationViewID();
        $trader_id = $results->trader_id;
        $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
        $applicant_id = getInternalApplicant_id($identification_no);
        // get process id
        $process_qry = DB::table('wf_processes as t1')
                     ->select('t1.id')
                     ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
        $process_results = $process_qry->first();
        if(!isset($process_results->id)){
            DB::rollBack();
            return ['message'=> 'Process not found', 'success'=>false]; 
        }
        $process_id = $process_results->id;
        if($results){
            $manufacturing_site_params = array(
                'name'=>$results->name,
                'applicant_id' =>$applicant_id,
                'country_id' => $results->country_id,
                'region_id' => $results->region_id,
                'district_id' => $results->district_id,
                'telephone_no' => $results->telephone,
                'fax' =>  $results->fax,
                'email_address' => $results->email,
                'website' =>  $results->website,
                'physical_address' => $results->physical_address,
                'postal_address' => $results->postal_address,
                'business_scale_id' => $results->business_scale_id,
                'longitude' => $results->longitude,
                'latitude' => $results->latitude,
                'dola' => $results->dola,
                'altered_by' => $results->altered_by,
                'applicant_as_ltr' => $results->applicant_as_ltr,
                'ltr_id' => $results->ltr_id,
                'applicant_contact_person' => $results->applicant_contact_person,
                'contact_person_id' => $results->contact_person_id,
                'contact_person_startdate' => $results->contact_person_startdate,
                'contact_person_enddate' => $results->contact_person_enddate,
                'man_site_id' => $results->man_site_id,
                        );
        
        $manufacturing_site_table = 'tra_manufacturing_sites';
        $applications_table = 'tra_gmp_applications';
        $res = insertRecord($manufacturing_site_table, $manufacturing_site_params, $user_id);
        if(!isset($res['record_id'])){
            DB::rollback();
            return $res;

             }
        $manufacturing_site_id = $res['record_id'];
                $application_params = array(
                        'manufacturing_site_id' => $manufacturing_site_id,
                        'process_id' => $process_id,
                        'view_id' => $view_id,
                        'applicant_id' => $applicant_id,
                        'module_id' => $results->module_id,
                        'sub_module_id' => $results->sub_module_id,
                        'gmp_type_id' => $results->gmp_type_id,
                        'manufacturing_type_id' => $results->manufacturing_type_id,
                        'zone_id' => $results->zone_id,
                        'section_id' => $results->section_id,
                        'application_code' => $results->application_code,
                        'assessment_type_id' => $results->assessment_type_id,
                        'assessment_procedure_id' => $results->assessment_procedure_id,
                        'inspection_type_id' => $results->inspection_type_id,
                        'facility_location_id' => $results->facility_location_id,
                        'workflow_stage_id' => $results->workflow_stage_id,
                        'tracking_no' => $results->tracking_no,
                        'application_status_id' => $results->application_status_id,
                    );
        
        $res = insertRecord($applications_table, $application_params, $user_id);
        if(!isset($res['record_id'])){
            DB::rollback();
            return $res;
        }
        $application_id = $res['record_id'];
        //add to submissions table
        $Stage_qry = DB::table('wf_processes as t1')
                    ->select('t1.workflow_id')
                    ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>2));
        $Stage_qry_results = $Stage_qry->first();
        if($Stage_qry_results){
        $workflow_id = $Stage_qry_results->workflow_id;
        $stage_id_qry = DB::table('wf_workflow_stages as t1')
                      ->select('t1.id')
                      ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
        $stage_id_results = $stage_id_qry->first();
        if(!isset($stage_id_results->id)){
            DB::rollBack();
            return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
        }
        $previous_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'is_portalapp_previousstage'=>1), 'id');
        if (!validateIsNumeric($previous_stage_id)){
            $previous_stage_id = $stage_id_results->id;
         }
           //check on online applications
        $application_code = $results->application_code;
        $is_paid_id = getSingleRecordColValue('tra_payments', array('application_code'=>$application_code), 'id');
        if (!validateIsNumeric($is_paid_id)){
            $workflow_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'stage_category_id'=>22), 'id');
            if(!validateIsNumeric($workflow_stage_id)){
                $workflow_stage_id = $stage_id_results->id;
            }
         }
         else{
            $workflow_stage_id = $stage_id_results->id;
         }
        $submission_params = array(
                        'application_id' => $application_id,
                        "process_id" => $process_id,
                        "applicant_id" => $applicant_id,
                        "application_code" => $results->application_code,
                        "tracking_no" => $results->tracking_no,
                        'usr_from' => $user_id,
                       // 'usr_to' => $user_id,
                        'previous_stage' => $previous_stage_id,
                        'current_stage' => $workflow_stage_id,
                        "module_id" => $results->module_id,
                        "sub_module_id" => $results->sub_module_id,
                        "section_id" => $results->section_id,
                        "application_status_id" => 5,
                        'urgency' => 1,
                        'remarks' => 'Online Received Application',
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'is_fast_track' => $results->fasttrack_option_id,
                        'created_by' => $user_id
                    );
        
            $sub_res = insertRecord('tra_submissions', $submission_params);
            if(!isset($sub_res['record_id'])){
                DB::rollback();
                return $sub_res;

                 }
         
            }
            else{
                DB::rollBack();
                return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
            }
                           //Get GMP MNUFACTURING PERSONNEL DETAILS
            $sitespersonneldetiailsqry = $portal_db->table('wb_gmp_applications as t1')
                          ->leftjoin('wb_manufacturing_sites_personnel as t2', 't1.manufacturing_site_id', 't2.manufacturing_site_id')
                         ->select('t2.*')
                         ->where('t1.application_code',$application_code);
            $sitespersonneldetiailsresults = $sitespersonneldetiailsqry->get();
            if($sitespersonneldetiailsresults){
                foreach ($sitespersonneldetiailsresults as $sitespersonneldetiailsresults) {
                            # code...
                    $sitespersonneldetiailsresultsdata = array(
                        'manufacturing_site_id' => $manufacturing_site_id,
                        'init_site_id' => $sitespersonneldetiailsresults->init_site_id,
                        'name' => $sitespersonneldetiailsresults->name,
                        'telephone' => $sitespersonneldetiailsresults->telephone,
                        //'had_offence' => $sitespersonneldetiailsresults->had_offence,
                        'email_address' => $sitespersonneldetiailsresults->email_address,
                        'postal_address'=> $sitespersonneldetiailsresults->postal_address,
                        'fax' => $sitespersonneldetiailsresults->fax,
                        'end_date' => $sitespersonneldetiailsresults->end_date,
                        'start_date' => $sitespersonneldetiailsresults->start_date,
                        'institution' => $sitespersonneldetiailsresults->institution,
                        'personnel_id' => $sitespersonneldetiailsresults->personnel_id,
                        'study_field_id' => $sitespersonneldetiailsresults->study_field_id,
                        'qualification_id' => $sitespersonneldetiailsresults->qualification_id,
                        'registration_no' => $sitespersonneldetiailsresults->registration_no,
                        'position_id' => $sitespersonneldetiailsresults->position_id,
                        'status_id' => $sitespersonneldetiailsresults->status_id,
                        'altered_by' => $sitespersonneldetiailsresults->altered_by,
                        'dola' => $sitespersonneldetiailsresults->dola,
                        'created_by'=> $sitespersonneldetiailsresults->created_by,
        
                           );
            $sitespersonneldetails_res = insertRecord('tra_manufacturing_sites_personnel', $sitespersonneldetiailsresultsdata);
            if(!isset($sitespersonneldetails_res['record_id'])){
                DB::rollback();
                return $sitespersonneldetails_res;

                 }
        
            }
            }
                           //Get GMP MNUFACTURING block DETAILS
            $sitesblockdetiailsqry = $portal_db->table('wb_gmp_applications as t1')
                             ->leftjoin('wb_manufacturingsite_blocks as t2', 't1.manufacturing_site_id', 't2.manufacturing_site_id')
                             ->select('t2.*')
                             ->where('t1.application_code',$application_code);
            $sitesblockdetiailsresults = $sitesblockdetiailsqry->get();
            if($sitesblockdetiailsresults){
                foreach ($sitesblockdetiailsresults as $sitesblockdetiailsresults) {
                           # code...
                    $sitesblockdetiailsresultsdata = array(
                        'manufacturing_site_id' => $manufacturing_site_id,
                        'name' => $sitesblockdetiailsresults->name,
                        'activities' => $sitesblockdetiailsresults->activities,
                        'altered_by' => $sitesblockdetiailsresults->altered_by,
                        'dola' => $sitesblockdetiailsresults->dola,
                        'created_by'=> $sitesblockdetiailsresults->created_by,
                          );

            $sitesblockdetails_res = insertRecord('tra_manufacturing_sites_blocks', $sitesblockdetiailsresultsdata);
            if(!isset($sitesblockdetails_res['record_id'])){
                DB::rollback();
                return $sitesblockdetails_res;

                 }
                }
            }
                           //Get productline details DETAILS
            $productlinedetiailsqry = $portal_db->table('wb_gmp_applications as t1')
                 ->leftjoin('wb_gmp_productline_details as t2', 't1.manufacturing_site_id', 't2.manufacturing_site_id')
                 ->select('t2.*')
                 ->where('t1.application_code',$application_code);
           $productlinedetiailsresults = $productlinedetiailsqry->get();
            if($productlinedetiailsresults){
           foreach ($productlinedetiailsresults as $productlinedetiailsresults) {
               # code...
              $productlinedetiailsresultsdata = array(
                   'manufacturing_site_id' => $manufacturing_site_id,
                   'manufacturingsite_block_id' => $productlinedetiailsresults->manufacturingsite_block_id,
                   'init_site_id' => $productlinedetiailsresults->init_site_id,
                   'category_id' => $productlinedetiailsresults->category_id,
                   'prodline_description' => $productlinedetiailsresults->prodline_description,
                   'prodline_description_id' => $productlinedetiailsresults->prodline_description_id,
                   'altered_by' => $productlinedetiailsresults->altered_by,
                   'dola' => $productlinedetiailsresults->dola,
                   'created_by'=> $productlinedetiailsresults->created_by,
        
              );
            $productlinedetiailsresults_res = insertRecord('gmp_productline_details', $productlinedetiailsresultsdata);
            if(!isset($productlinedetiailsresults_res['record_id'])){
                DB::rollback();
                return $productlinedetiailsresults_res;

                 }
                  }
            }
                           //Getproduct gmpinspection details DETAILS
            $gmpinspectionqry = $portal_db->table('wb_gmp_applications as t1')
                           ->leftjoin('wb_product_gmpinspectiondetails as t2', 't1.manufacturing_site_id', 't2.manufacturing_site_id')
                           ->select('t2.*')
                           ->where('t1.application_code',$application_code);
            $gmpinspectiondetiailsresults = $gmpinspectionqry->get();
            if($gmpinspectiondetiailsresults){
                foreach ($gmpinspectiondetiailsresults as $gmpinspectiondetiailsresults) {
                         # code...
                $gmpinspectiondetiailsresultsdata = array(
                             'manufacturing_site_id' => $manufacturing_site_id,
                             'product_id' => $gmpinspectiondetiailsresults->product_id,
                             'reg_product_id' => $gmpinspectiondetiailsresults->reg_product_id,
                             'reg_site_id' => $gmpinspectiondetiailsresults->reg_site_id,
                             'gmp_productline_id' => $gmpinspectiondetiailsresults->gmp_productline_id,
                             'gmpproduct_line_id' => $gmpinspectiondetiailsresults->gmpproduct_line_id,
                             'status_id' => $gmpinspectiondetiailsresults->status_id,
                             'altered_by' => $gmpinspectiondetiailsresults->altered_by,
                             'dola' => $gmpinspectiondetiailsresults->dola,
                             'created_by'=> $gmpinspectiondetiailsresults->created_by,
                             'created_on'=> $gmpinspectiondetiailsresults->created_on,
        
                        );
                $gmpinspectiondetiails_res = insertRecord('tra_product_gmpinspectiondetails', $gmpinspectiondetiailsresultsdata);
                if(!isset($gmpinspectiondetiails_res['record_id'])){
                    DB::rollback();
                    return $gmpinspectiondetiails_res;
    
                     }
                        }
                        }
            $new_submission_params = array(
                            'portal_application_id' => $portal_application_id,
                            'new_application_id' => $application_id,
                            "application_code" => $results->application_code,
                            "tracking_no" => $results->tracking_no,
                            "module_id" => $results->module_id,
                            "sub_module_id" => $results->sub_module_id,
                            "section_id" => $results->section_id,
                        );
            
            $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
            if(!isset($new_submission_res['record_id'])){
                    DB::rollback();
                    $portal_db->rollback();
                    return $new_submission_res;
    
                     }

                     //Mark as submitted
         $application_code = $results->application_code;
         $table_name = 'wb_onlinesubmissions';
         $where = array(
             'application_code' => $application_code
         );
         $data = array(
             'is_received' => 1,
             'application_status_id' => 5,
             'application_code'=> $application_code,
         );
         $update_res = updateRecord($table_name, $where, $data, $user_id,'portal_db');
         if(!isset($update_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $update_res;
    
             }
        $update_res = updateRecord('wb_gmp_applications', $where, $data, $user_id,'portal_db');
        if(!isset($update_res['record_id'])){
                DB::rollback();
                $portal_db->rollback();
                return $update_res;
                 }
            }
            }
        DB::commit();
        $portal_db->commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            $portal_db->rollback();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $portal_db->rollback();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;
    }

public function receiveClinicalTrialPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id){
        try {
               $portal_db = DB::connection('portal_db');
               $portal_db->beginTransaction();
               DB::beginTransaction();
               //Get portal product data
                //check duplicate application_code
        $duplicate_application_code = getSingleRecordColValue('tra_clinical_trial_applications', array('application_code'=>$application_code), 'application_code');
        if(validateIsNumeric($duplicate_application_code)){
                        $data = array(
                            'dola' => Carbon::now(),
                            'application_code'=> $application_code,
                            'module_id' => $module_id,
                            'type'=>5
                        );
                        $res = insertRecord('par_sync_error_log',$data,3,'audit_db');
                        return array(
                            'is_duplicate'=>1,
                            'success' => false
                        );
                       
                    }
             else{
               $qry = $portal_db->table('wb_clinical_trial_applications as t1')
                      ->select('t1.*');
               $qry->where('t1.application_code',$application_code);
               $results = $qry->first();
               if(!isset($results->id)){
                DB::rollBack();
                return ['message'=> 'record not found', 'success'=>false]; 
               }
               $portal_application_id = $results->id;
               $module_id = $results->module_id;
               $sub_module_id = $results->sub_module_id;
               $section_id = $results->section_id;
               $view_id = generateApplicationViewID();
               $trader_id = $results->trader_id;
               $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
               $applicant_id = getInternalApplicant_id($identification_no);
               $process_qry = DB::table('wf_processes as t1')
                             ->select('t1.id')
                             ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
               $process_results = $process_qry->first();
               if(!isset($process_results->id)){
                   DB::rollBack();
                   return ['message'=> 'Process not found', 'success'=>false]; 
               }
               $process_id = $process_results->id;
               if($results){
                   $application_params = array(
                       'process_id' => $process_id,
                       'applicant_id' => $applicant_id,
                       'view_id' => $view_id,
                       'module_id' => $results->module_id,
                       'sub_module_id' => $results->sub_module_id,
                       'section_id' => $results->section_id,
                       'application_code' => $results->application_code,
                       'workflow_stage_id' => $results->workflow_stage_id,
                       'tracking_no' =>  $results->tracking_no,
                       'application_status_id' => $results->application_status_id,
                       'gcp_guideline_statement' => $results->gcp_guideline_statement,
                       'trial_building_capacity_statement' => $results->trial_building_capacity_statement,
                       'insurance_measures_statement' => $results->insurance_measures_statement,
                       'conflict_of_interest_statement' => $results->conflict_of_interest_statement,
                       'compensation_statement' => $results->compensation_statement,
                       'gcp_guideline_comment' => $results->gcp_guideline_comment,
                       'investigators_choice_comment' => $results->investigators_choice_comment,
                       'gcp_training_needs_comment' => $results->gcp_training_needs_comment,
                       'trial_building_capacity_comment' => $results->trial_building_capacity_comment,
                       'resource_comment' => $results->resource_comment,
                       'monitoring_plan_comment' => $results->monitoring_plan_comment,
                       'how_confidentiality_is_maintained_comment' => $results->how_confidentiality_is_maintained_comment,
                       'insurance_measures_comment' => $results->insurance_measures_comment,
                       'patient_concent_comment' => $results->patient_concent_comment,
                       'publication_ethics_policy_comment' => $results->publication_ethics_policy_comment,
                       'participant_post_trial_condition_management_comment' => $results->participant_post_trial_condition_management_comment,
                       'ethics_committee_capacity_comment' => $results->ethics_committee_capacity_comment,
                       'compensation_comment' => $results->compensation_comment,
                       'is_conducted_in_host_country' => $results->is_conducted_in_host_country,
                       'why_not_conducted_in_host' => $results->why_not_conducted_in_host,
                       'study_duration' => $results->study_duration,
                       'duration_desc' => $results->duration_desc,
                       'has_other_authority_submission_pending_approval' => $results->has_other_authority_submission_pending_approval,
                       'other_authority_submission_pending_approval' => $results->other_authority_submission_pending_approval,
                       'has_other_authority_submission_with_approval' => $results->has_other_authority_submission_with_approval,
                       'other_authority_submission_with_approval' => $results->other_authority_submission_with_approval,
                       'has_other_trial_submission_with_rejection' => $results->has_other_trial_submission_with_rejection,
                       'other_authority_submission_with_rejection' => $results->other_authority_submission_with_rejection,
                       'has_other_trial_submission_suspension' => $results->has_other_trial_submission_suspension,
                       'other_authority_submission_suspension' => $results->other_authority_submission_suspension,
                       'is_being_undertaken_in_sadac_others' => $results->is_being_undertaken_in_sadac_others,
                       'being_undertaken_in_sadac_others' => $results->being_undertaken_in_sadac_others,
                       'includes_sub_study' => $results->includes_sub_study,
                       'is_sub_study_conducted_locally' => $results->is_sub_study_conducted_locally,
                       'reason_sub_study_not_conducted_locally' => $results->reason_sub_study_not_conducted_locally,
                       'are_references_current' => $results->are_references_current,
                       'discrepancies_present' => $results->discrepancies_present,
                       'discrepancies' => $results->discrepancies,
                       'other_comments' => $results->other_comments,
                       'sponsor_id' => $results->sponsor_id,
                       'investigator_id' => $results->investigator_id,
                       'study_title' => $results->study_title,
                       'short_study_title' => $results->short_study_title,
                       'protocol_no' => $results->protocol_no,
                       'phase_id' => $results->phase_id,
                       'version_no' => $results->version_no,
                       'date_of_protocol' => $results->date_of_protocol,
                       'clinical_prodsection_ids' =>$results->clinical_prodsection_ids,
                       'sponsor_origin_id' => $results->sponsor_origin_id,
                       'rationale_summary' => $results->rationale_summary,
                       'problem_summary' => $results->problem_summary,
                       'local_relevance_summary' => $results->local_relevance_summary,
                       'trial_medicine_property_summary' => $results->trial_medicine_property_summary,
                       'pre_clinical_findings_summary' => $results->pre_clinical_findings_summary,
                       'clinical_findings_summary' => $results->clinical_findings_summary,
                       'study_objective' => $results->study_objective,
                       'trial_design' => $results->trial_design,
                       'trial_participant_summary' => $results->trial_participant_summary,
                       'selection_criteria_summary' => $results->selection_criteria_summary,
                       'treatment_modalities_summary' => $results->treatment_modalities_summary,
                       'trial_outcome_measurement' => $results->trial_outcome_measurement,
                       'adverse_event_measure' => $results->adverse_event_measure,
                       'sample_determination' => $results->sample_determination,
                       'quantitative_statistical_methods' => $results->quantitative_statistical_methods,
                       'qualitative_statistical_methods' => $results->qualitative_statistical_methods,
                       'data_processing_summary' => $results->data_processing_summary,
                       'interim_summary' => $results->interim_summary,
                       'local_contact_id' => $results->local_agent_id,
                       'clinicalstudy_participanttype_id' => $results->clinicalstudy_participanttype_id,
                   );
               $applications_table = 'tra_clinical_trial_applications';
               $res = insertRecord($applications_table, $application_params, $user_id);
               if(!isset($res['record_id'])){
                   DB::rollback();
                   return $res;
                    }
                $record_id = $res['record_id'];
                $application_id = $res['record_id'];
                $module_id = $results->module_id;
                $sub_module_id = $results->sub_module_id;
                $section_id = $results->section_id;
                $Stage_qry = DB::table('wf_processes as t1')
                   ->select('t1.workflow_id')
                   ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
               $Stage_qry_results = $Stage_qry->first();
               if($Stage_qry_results){
                   $workflow_id = $Stage_qry_results->workflow_id;
                   $stage_id_qry = DB::table('wf_workflow_stages as t1')
                   ->select('t1.id')
                   ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
                   $stage_id_results = $stage_id_qry->first();
                   if(!isset($stage_id_results->id)){
                    DB::rollBack();
                    return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
                    }
                   $previous_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'is_portalapp_previousstage'=>1), 'id');
                   if (!validateIsNumeric($previous_stage_id)){
                    $previous_stage_id = $stage_id_results->id;
                   }
                     //check on online applications
                $application_code = $results->application_code;
                $is_paid_id = getSingleRecordColValue('tra_payments', array('application_code'=>$application_code), 'id');
                if (!validateIsNumeric($is_paid_id)){
                    $workflow_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'stage_category_id'=>22), 'id');
                    if(!validateIsNumeric($workflow_stage_id)){
                        $workflow_stage_id = $stage_id_results->id;
                    }
                 }
                else{
                     $workflow_stage_id = $stage_id_results->id;
                 }
                   $submission_params = array(
                   "process_id" => $process_id,
                   'application_id' => $application_id,
                   "applicant_id" => $applicant_id,
                   "application_code" => $results->application_code,
                   "tracking_no" => $results->tracking_no,
                   'usr_from' => $user_id,
                   //'usr_to' => $user_id,
                   'previous_stage' => $previous_stage_id,
                   'current_stage' => $workflow_stage_id,
                   "module_id" => $results->module_id,
                   "sub_module_id" => $results->sub_module_id,
                   "section_id" => $results->section_id,
                   "application_status_id" => 5,
                   'urgency' => 1,
                   'remarks' => 'Online Received Application',
                   'date_received' => Carbon::now(),
                   'created_on' => Carbon::now(),
                   'is_fast_track' => $results->fasttrack_option_id,
                   'created_by' => $user_id
               );
    
               $sub_res = insertRecord('tra_submissions', $submission_params);
               if(!isset($sub_res['record_id'])){
                   DB::rollback();
                   return $sub_res;
                    }
               }
               else{
                DB::rollBack();
                return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
                }
                  //Get clinicalstudy participants DETAILS
               $participantsdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                ->leftjoin('wb_clinicalstudy_participants as t2', 't1.id', 't2.application_id')
                ->select('t2.*')
                ->where('t1.id',$portal_application_id);
               $participantsdetiailsresults = $participantsdetiailsqry->get();
               if($participantsdetiailsresults){
               foreach ($participantsdetiailsresults as $participantsdetiailsresults) {
                   # code...
                  $participantsdetiailsresultsdata = array(
                       'application_id' => $application_id,
                       'number_oflocal_participants' => $participantsdetiailsresults->number_oflocal_participants,
                       'number_of_participants' => $participantsdetiailsresults->number_of_participants,
                       'min_enrollment' => $participantsdetiailsresults->min_enrollment,
                       'max_enrollment' => $participantsdetiailsresults->max_enrollment,
                       'local_volunteer_base' => $participantsdetiailsresults->local_volunteer_base,
                       'potential_retrospectivedata'=> $participantsdetiailsresults->potential_retrospectivedata,
                       'clinicalstudy_participanttype_id' => $participantsdetiailsresults->clinicalstudy_participanttype_id,
                       'altered_by' => $participantsdetiailsresults->altered_by,
                       'dola' => $participantsdetiailsresults->dola,
                       'created_by'=> $participantsdetiailsresults->created_by,
    
                  );
                  $participantsdetails_res = insertRecord('tra_clinicalstudy_participants', $participantsdetiailsresultsdata);
                  if(!isset($participantsdetails_res['record_id'])){
                   DB::rollback();
                   return $participantsdetails_res;
                    }
                  }
                  }
                  //Get investigators DETAILS
               $investigatorsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                    ->leftjoin('wb_clinical_trial_investigators as t2','t1.id', 't2.application_id')
                    ->select('t2.*')
                    ->where('t1.application_code',$application_code);
               $investigatorsqryresults = $investigatorsqry->get();
               if($investigatorsqryresults){
               foreach ($investigatorsqryresults as $investigatorsqryresults) {
                  # code...
                 $investigatorsqryresultsdata = array(
                      'application_id' => $application_id,
                      'category_id' => $investigatorsqryresults->category_id,
                      'investigator_id' => $investigatorsqryresults->investigator_id,
                      'application_reference_no'=> $investigatorsqryresults->application_reference_no,
                      'total_number_of_studies'=> $investigatorsqryresults->total_number_of_studies,
                      'total_number_of_studies_date'=> $investigatorsqryresults->total_number_of_studies_date,
                      'total_number_of_participants'=> $investigatorsqryresults->total_number_of_participants,
                      'total_number_of_participants_date'=> $investigatorsqryresults->total_number_of_participants_date,
                      'trial_work_hours'=> $investigatorsqryresults->trial_work_hours,
                      'trial_work_percentage'=> $investigatorsqryresults->trial_work_percentage,
                      'trial_administrative_work_hours'=> $investigatorsqryresults->trial_administrative_work_hours,
                      'trial_administrative_work_percentage'=> $investigatorsqryresults->trial_administrative_work_percentage,
                      'organization_work_hours'=> $investigatorsqryresults->organization_work_hours,
                      'organization_work_percentage'=> $investigatorsqryresults->organization_work_percentage,
                      'organization_administrative_work_hours'=> $investigatorsqryresults->organization_administrative_work_hours,
                      'organization_administrative_work_percentage'=> $investigatorsqryresults->organization_administrative_work_percentage,
                      'teaching_preparation_hours'=> $investigatorsqryresults->teaching_preparation_hours,
                      'teaching_preparation_percentage'=> $investigatorsqryresults->teaching_preparation_percentage,
                      'teaching_lectures_hours' => $investigatorsqryresults->teaching_lectures_hours,
                      'teaching_lectures_percentage' => $investigatorsqryresults->teaching_lectures_percentage,
                      'writting_upwork_hours' => $investigatorsqryresults->writting_upwork_hours,
                      'writting_upwork_percentage' => $investigatorsqryresults->writting_upwork_percentage,
                      'information_sourcing_hours' => $investigatorsqryresults->information_sourcing_hours,
                      'information_sourcing_percentage' => $investigatorsqryresults->information_sourcing_percentage,
                      'other_investigator_tasks' => $investigatorsqryresults->other_investigator_tasks,
                      'other_tasks_hours' => $investigatorsqryresults->other_tasks_hours,
                      'other_tasks_percentage' => $investigatorsqryresults->other_tasks_percentage,
                      'study_site_id' => $investigatorsqryresults->study_site_id,
                      'altered_by' => $investigatorsqryresults->altered_by,
                      'dola' => $investigatorsqryresults->dola,
                      'created_by'=> $investigatorsqryresults->created_by,
    
                 );
                 $investigatorsdetails_res = insertRecord('clinical_trial_investigators', $investigatorsqryresultsdata);
                 if(!isset($investigatorsdetails_res['record_id'])){
                   DB::rollback();
                   return $investigatorsdetails_res;
                    }
                 }
                 }
              //Get Clinical trial monitors DETAILS
              $trialmonitorsdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
              ->leftjoin('wb_clinical_trial_monitors as t2','t1.id', 't2.application_id')
              ->select('t2.*')
              ->where('t1.application_code',$application_code);
             $trialmonitorsdetiailsresults = $trialmonitorsdetiailsqry->get();
            if($trialmonitorsdetiailsresults){
            foreach ($trialmonitorsdetiailsresults as $trialmonitorsdetiailsresults) {
            # code...
             $trialmonitorsdetiailsresultsdata = array(
                'application_id' => $application_id,
                'monitor_id' => $trialmonitorsdetiailsresults->monitor_id,
                'altered_by' => $trialmonitorsdetiailsresults->altered_by,
                'dola' => $trialmonitorsdetiailsresults->dola,
                'created_by'=> $trialmonitorsdetiailsresults->created_by,
    
           );
           $trialmonitorsdetiailsresults_res = insertRecord('tra_clinical_trial_monitors', $trialmonitorsdetiailsresultsdata);
           if(!isset($trialmonitorsdetiailsresults_res['record_id'])){
               DB::rollback();
               return $trialmonitorsdetiailsresults_res;
                }
           }
           }
                  //Get clinical_trial_sites DETAILS
           $trialsitesdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                  ->leftjoin('wb_clinical_trial_sites as t2', 't1.id', 't2.application_id')
                  ->select('t2.*')
                  ->where('t1.application_code',$application_code);
           $trialsitesdetiailsresults = $trialsitesdetiailsqry->get();
           if($trialsitesdetiailsresults){
               foreach ($trialsitesdetiailsresults as $trialsitesdetiailsresults) {
                # code...
               $trialsitesdetiailsresultsdata = array(
                   'application_id' => $application_id,
                    'study_site_id' => $trialsitesdetiailsresults->study_site_id,
                    'app_reference_no' => $trialsitesdetiailsresults->app_reference_no,
                    'approving_instution' => $trialsitesdetiailsresults->approving_instution,
                    'responsible_ethics_committee' => $trialsitesdetiailsresults->responsible_ethics_committee,
                    'approval_date' => $trialsitesdetiailsresults->approval_date,
                    'application_reference_no' => $trialsitesdetiailsresults->application_reference_no,
                    'site_capacity_statement' => $trialsitesdetiailsresults->site_capacity_statement,
                    'is_competitive_enrollment' => $trialsitesdetiailsresults->is_competitive_enrollment,
                    'site_min_enrollment' => $trialsitesdetiailsresults->site_min_enrollment,
                    'site_max_enrollment' => $trialsitesdetiailsresults->site_max_enrollment,
                    'site_enrollment_statement' => $trialsitesdetiailsresults->site_enrollment_statement,
                    'local_volunteer_base' => $trialsitesdetiailsresults->local_volunteer_base,
                    'potential_retrospectivedata' => $trialsitesdetiailsresults->potential_retrospectivedata,
                    'altered_by' => $trialsitesdetiailsresults->altered_by,
                    'dola' => $trialsitesdetiailsresults->dola,
                    'created_by'=> $trialsitesdetiailsresults->created_by,
    
               );
               $trialsitesdetiailsresults_res = insertRecord('clinical_trial_sites', $trialsitesdetiailsresultsdata);
               if(!isset($trialsitesdetiailsresults_res['record_id'])){
                   DB::rollback();
                   return $trialsitesdetiailsresults_res;
                    }
               }
               }
                  //Get clinical_trial_sponsors DETAILS
                  $sponsorsdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                  ->leftjoin('wb_clinical_trial_sponsors as t2', 't1.id', 't2.application_id')
                  ->select('t2.*')
                  ->where('t1.application_code',$application_code);
               $sponsorsdetiailsresults = $sponsorsdetiailsqry->get();
               //dd($sponsorsdetiailsresults);
             if($sponsorsdetiailsresults){
               foreach ($sponsorsdetiailsresults as $sponsorsdetiailsresults) {
                # code...
               $sponsorsdetiailsresultsdata = array(
                   'application_id' => $application_id,
                    'sponsor_id' => $sponsorsdetiailsresults->sponsor_id,
                    'altered_by' => $sponsorsdetiailsresults->altered_by,
                    'dola' => $sponsorsdetiailsresults->dola,
                    'created_by'=> $sponsorsdetiailsresults->created_by,
    
               );
               $sponsorsdetiailsresults_res = insertRecord('tra_clinical_trial_sponsors', $sponsorsdetiailsresultsdata);
               if(!isset($sponsorsdetiailsresults_res['record_id'])){
                   DB::rollback();
                   return $sponsorsdetiailsresults_res;
                    }
               }
               }
                  //Get otherstates DETAILS
               $otherstatesdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                  ->leftjoin('wb_otherstates_clinicaltrialsregistrations as t2', 't1.id', 't2.application_id')
                  ->select('t2.*')
                  ->where('t1.application_code',$application_code);
               $otherstatesdetiailsresults = $otherstatesdetiailsqry->get();
              if($otherstatesdetiailsresults){
               foreach ($otherstatesdetiailsresults as $otherstatesdetiailsresults) {
                # code...
               $otherstatesdetiailsresultsdata = array(
                   'application_id' => $application_id,
                    'country_id' => $otherstatesdetiailsresults->country_id,
                    'registration_ref' => $otherstatesdetiailsresults->registration_ref,
                    'date_of_registration' => $otherstatesdetiailsresults->date_of_registration,
                    'approving_authority' => $otherstatesdetiailsresults->approving_authority,
                    'current_registrationstatus' => $otherstatesdetiailsresults->current_registrationstatus,
                    'altered_by' => $otherstatesdetiailsresults->altered_by,
                    'dola' => $otherstatesdetiailsresults->dola,
                    'created_by'=> $otherstatesdetiailsresults->created_by,
                    'created_on'=> $otherstatesdetiailsresults->created_on,
    
               );
               $otherstatesdetiails_res = insertRecord('tra_otherstates_clinicaltrialsregistrations', $otherstatesdetiailsresultsdata);
               if(!isset($otherstatesdetiails_res['record_id'])){
                   DB::rollback();
                   return $otherstatesdetiails_res;
                    }
               }
               }
             //sync the application NEC
               $result_nec= syncClinicalTrialApplicationNEC($request);
               $new_submission_params = array(
                       'portal_application_id' => $portal_application_id,
                       'new_application_id' => $application_id,
                       "application_code" => $results->application_code,
                       "tracking_no" => $results->tracking_no,
                       "module_id" => $results->module_id,
                       "sub_module_id" => $results->sub_module_id,
                       "section_id" => $results->section_id,
                   );
       
               $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
               if(!isset($new_submission_res['record_id'])){
                   DB::rollback();
                   $portal_db->rollback();
                   return $new_submission_res;
                    }
        //Mark as submitted
         $application_code = $results->application_code;
         $table_name = 'wb_onlinesubmissions';
         $where = array(
             'application_code' => $application_code
         );
         $data = array(
             'is_received' => 1,
             'application_status_id'=>5,
             'application_code'=> $application_code,
         );
        $update_res = updateRecord($table_name, $where, $data, $user_id,'portal_db');
        if(!isset($update_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $update_res;
    
             }
               //update application status
        $data = array(
            'application_status_id'=>3
           );
        $update_res = updateRecord('wb_clinical_trial_applications', $where, $data, $user_id,'portal_db');
        if(!isset($update_res['record_id'])){
               DB::rollback();
               $portal_db->rollback();
             return $update_res;
           }     
         }
           }
           DB::commit();
           $portal_db->commit();
           } catch (\Exception $exception) {
                       DB::rollBack();
                       $portal_db->rollback();
                       $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
                   } catch (\Throwable $throwable) {
                       DB::rollBack();
                       $portal_db->rollback();
                      $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
                   }
                   return $res;
     }

  public function receiveImportExportPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id){
        try {
        $portal_db = DB::connection('portal_db');
        $portal_db->beginTransaction();
        DB::beginTransaction();
        //check duplicate application code
        $duplicate_application_code = getSingleRecordColValue('tra_importexport_applications', array('application_code'=>$application_code), 'application_code');
       if(validateIsNumeric($duplicate_application_code)){
        $data = array(
            'dola' => Carbon::now(),
            'application_code'=> $application_code,
            'module_id' => $module_id,
            'type'=>5
        );
        $res = insertRecord('par_sync_error_log',$data,3,'audit_db');
        return array(
            'is_duplicate'=>1,
            'success' => false
        );
        //generate new application_code and update respective tables
        // $applications_table = 'tra_importexport_applications';
        // $new_application_code = generateApplicationCode($sub_module_id, $applications_table);
        // $where = array(
        //     'application_code' => $duplicate_application_code
        // );
        // $data = array(
        //     'dola' => Carbon::now(),
        //     'application_code'=> $new_application_code,
        // );
        // $update_res = updateRecord('wb_importexport_applications', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //    DB::rollback();
        //    return $update_res;
   
        //     }
        //     //wb_onlinesubmissions
        // $update_res = updateRecord('wb_onlinesubmissions', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //     DB::rollback();
        //     return $update_res;
        //         }
        // $update_res = updateRecord('wb_permits_products', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //             DB::rollback();
        //             return $update_res;
        //         }
    }
    else{
         //Get portal data
        $qry = $portal_db->table('wb_importexport_applications as t1')
           ->select('t1.*');
        $qry->where('t1.application_code',$application_code);
        $results = $qry->first();
        if(!isset($results->id)){
            DB::rollBack();
            return ['message'=> 'record not found', 'success'=>false]; 
        }
        $portal_application_id = $results->id;
        $module_id = $results->module_id;
        $sub_module_id = $results->sub_module_id;
        $section_id = 8;
        $view_id = generateApplicationViewID();
        $trader_id = $results->trader_id;
        $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
        $applicant_id = getInternalApplicant_id($identification_no);
        $importexport_permittype_id = $results->importexport_permittype_id;
           // get process id
        $process_qry = DB::table('wf_processes as t1')
                      ->select('t1.id')
                      ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'importexport_permittype_id'=>$importexport_permittype_id));
        $process_results = $process_qry->first();
        if(!isset($process_results->id)){
                    DB::rollBack();
                    return ['message'=> 'Process not found', 'success'=>false]; 
        }
        $process_id = $process_results->id;
        if($results){
           $app_data = array(
                 'process_id' => $process_id,
                 'applicant_id'=>  $applicant_id,
                 'sub_module_id' =>  $results->sub_module_id,
                 'module_id' =>  $results->module_id,
                 'section_id' => $section_id,
                 'sender_receiver_id'=> $results->sender_receiver_id,
                 'mode_oftransport_id'=> $results->mode_oftransport_id,
                 'proforma_currency_id'=> $results->proforma_currency_id,
                 'importexport_permittype_id' => $results->importexport_permittype_id,
                 'has_apppliedctrdrugs_license' => $results->has_apppliedctrdrugs_license,
                 'controlled_drugslicense_no' =>  $results->controlled_drugslicense_no,
                 'license_application_code' => $results->license_application_code,
                 'permit_reason_id' =>  $results->permit_reason_id,
                 'otherpermit_reason' =>  $results->otherpermit_reason,
                 'proforma_invoice_no' => $results->proforma_invoice_no,
                 'proforma_invoice_date' => $results->proforma_invoice_date,
                 'destination_country_id'=> $results->destination_country_id,
                 'export_country_id'=> $results->export_country_id,
                // 'mode_of_transport_id'=> $results->mode_oftransport_id,
                 'vehicle_reg_no'=> $results->vehicle_reg_no,
                 'expected_arrival_date'=> $results->expected_arrival_date,
                 'exit_port_id'=> $results->exit_port_id,
                 'expected_departure_date'=> $results->expected_departure_date,
                 'estimated_value'=> $results->estimated_value,
                 'paying_currency_id' => $results->paying_currency_id,
                 'branch_id' =>  $results->branch_id,
                 'port_id' => $results->port_id,
                 'consignee_options_id' =>  $results->consignee_options_id,
                 'consignee_id' =>  $results->consignee_id,
                 'tracking_no' => $results->tracking_no,
                 'application_code' => $results->application_code,
                 //'controlleddrugs_type_id' =>  $results->controlleddrugs_type_id,
                 //'prodclass_category_id' =>  $results->prodclass_category_id,
             );
            $applications_table = 'tra_importexport_applications';
            $res = insertRecord($applications_table, $app_data, $user_id);
            if(!isset($res['record_id'])){
                DB::rollback();
                return $res;
    
                 }
           $active_application_id = $res['record_id'];
           $module_id=$results->module_id;
           $sub_module_id=$results->sub_module_id;
           $section_id=$results->section_id;
           $importexport_permittype_id=$results->importexport_permittype_id;
           $application_code=$results->application_code;
           $tracking_no=$results->tracking_no;
           $Stage_qry = DB::table('wf_processes as t1')
                      ->select('t1.workflow_id')
                      ->where(array('t1.module_id'=>$module_id,'t1.sub_module_id'=>$sub_module_id,'t1.section_id'=>8,'t1.importexport_permittype_id'=>$importexport_permittype_id));
           $Stage_qry_results = $Stage_qry->first();
           if($Stage_qry_results){
             $workflow_id =$Stage_qry_results->workflow_id;
             $stage_id_qry = DB::table('wf_workflow_stages as t1')
                 ->select('t1.id')
                 ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
            $stage_id_results = $stage_id_qry->first();
            if(!isset($stage_id_results->id)){
                DB::rollBack();
                return ['message'=> 'portal initial stage not set', 'success'=>false]; 
            }
            $previous_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'is_portalapp_previousstage'=>1), 'id');
            if (!validateIsNumeric($previous_stage_id)){
                $previous_stage_id = $stage_id_results->id;
             }
               //check on online applications
        $application_code = $results->application_code;
        $is_paid_id = getSingleRecordColValue('tra_payments', array('application_code'=>$application_code), 'id');
        if (!validateIsNumeric($is_paid_id)){
            $workflow_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'stage_category_id'=>22), 'id');
            if(!validateIsNumeric($workflow_stage_id)){
                $workflow_stage_id = $stage_id_results->id;
            }
         }
         else{
            $workflow_stage_id = $stage_id_results->id;
         }
            $submission_params = array(
               'application_id' => $active_application_id,
               'process_id' => $process_id,
               'applicant_id' =>  $applicant_id,
               'importexport_permittype_id' => $results->importexport_permittype_id,
               'application_code' => $results->application_code,
               'tracking_no' => $results->tracking_no,
               'usr_from' => $user_id,
              // 'usr_to' => $user_id,
               'previous_stage' => $previous_stage_id,
               'current_stage' => $workflow_stage_id,
               'module_id' =>  $results->module_id,
               'sub_module_id' =>  $results->sub_module_id,
               'section_id' =>  $results->section_id,
               'application_status_id' => 5,
               'urgency' => 1,
               'remarks' => 'Online Received Application',
               'date_received' => Carbon::now(),
               'created_on' => Carbon::now(),
               'created_by' => $user_id
                 );
    
           $sub_res = insertRecord('tra_submissions', $submission_params);
           if(!isset($sub_res['record_id'])){
            DB::rollback();
            return $sub_res;
    
             }
        
         }
         else{
            DB::rollBack();
            return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
          }
    
            //Get export permits products Details
        $permitsproductsqry = $portal_db->table('wb_importexport_applications as t1')
          ->leftjoin('wb_permits_products as t2', 't1.application_code', 't2.application_code')
          ->select('t2.*')
          ->where('t1.application_code',$application_code);
        $permitsproductsdetiailsresults = $permitsproductsqry->get();
        if($permitsproductsdetiailsresults){
         foreach ($permitsproductsdetiailsresults as $permitsproductsdetiailsresults) {
             # code...
            $permitsproductsdetiailsresultsdata = array(
                 'section_id' => $permitsproductsdetiailsresults->section_id,
                 'common_name_id' => $permitsproductsdetiailsresults->common_name_id,
                 'prodclass_category_id' => $permitsproductsdetiailsresults->prodclass_category_id,
                 'productphysical_description' => $permitsproductsdetiailsresults->productphysical_description,
                 'product_id' => $permitsproductsdetiailsresults->product_id,
                 'conversion_unit' => $permitsproductsdetiailsresults->conversion_unit,
                 'product_strength'=> $permitsproductsdetiailsresults->product_strength,
                 'quantity' => $permitsproductsdetiailsresults->quantity,
                 'unit_price' => $permitsproductsdetiailsresults->unit_price,
                 'currency_id' => $permitsproductsdetiailsresults->currency_id,
                 'unitpack_size' => $permitsproductsdetiailsresults->unitpack_size,
                 'unitpack_unit_id' => $permitsproductsdetiailsresults->unitpack_unit_id,
                 'application_code' => $permitsproductsdetiailsresults->application_code,
                 'product_packaging' => $permitsproductsdetiailsresults->product_packaging,
                 'packaging_unit_id' => $permitsproductsdetiailsresults->packaging_unit_id,
                 'dosage_form_id' => $permitsproductsdetiailsresults->dosage_form_id,
                 'pack_unit_id' => $permitsproductsdetiailsresults->pack_unit_id,
                 'pack_size' => $permitsproductsdetiailsresults->pack_size,
                 'permitbrand_name' => $permitsproductsdetiailsresults->permitbrand_name,
                 'permitcommon_name' => $permitsproductsdetiailsresults->permitcommon_name,
                 'product_registration_no' => $permitsproductsdetiailsresults->product_registration_no,
                 'country_oforigin_id' => $permitsproductsdetiailsresults->country_oforigin_id,
                 'is_registered_product' => $permitsproductsdetiailsresults->is_registered_product,
                 'purpose_of_drugsuse' => $permitsproductsdetiailsresults->purpose_of_drugsuse,
                 'controlleddrugs_type_id' => $permitsproductsdetiailsresults->controlleddrugs_type_id,
                 'controlled_drugssubstances_id' => $permitsproductsdetiailsresults->controlled_drugssubstances_id,
                 'controlleddrugs_basesalt_id' => $permitsproductsdetiailsresults->controlleddrugs_basesalt_id,
                 'gramsbasesiunit_id' => $permitsproductsdetiailsresults->gramsbasesiunit_id,
                 'drugs_content' => $permitsproductsdetiailsresults->drugs_content,
                 'strength_asgrams' => $permitsproductsdetiailsresults->strength_asgrams,
                 'controlleddrug_base' => $permitsproductsdetiailsresults->controlleddrug_base,
                 'pack_unit' => $permitsproductsdetiailsresults->pack_unit,
                 'drugspackaging_type_id' => $permitsproductsdetiailsresults->drugspackaging_type_id,
                 //'device_type_id' => $permitsproductsdetiailsresults->device_type_id,
                // 'is_regulated_product' => $permitsproductsdetiailsresults->is_regulated_product,
                 //'laboratory_no' => $permitsproductsdetiailsresults->laboratory_no,
                 //'mis_application_id' => $permitsproductsdetiailsresults->mis_application_id,
                 //'mis_product_id' => $permitsproductsdetiailsresults->mis_product_id,
                 //'prodcertificate_no' => $permitsproductsdetiailsresults->prodcertificate_no,
                // 'product_category_id' => $permitsproductsdetiailsresults->product_category_id,
                 //'producths_code' => $permitsproductsdetiailsresults->producths_code,
                // 'regulated_prodpermit_id' => $permitsproductsdetiailsresults->regulated_prodpermit_id,
                 //'total_weight' => $permitsproductsdetiailsresults->total_weight,
                 //'weights_units_id' => $permitsproductsdetiailsresults->weights_units_id,
                 //'imp_product_strength' => $permitsproductsdetiailsresults->imp_product_strength,
                 //'controlleddrug_baseunit_id' => $permitsproductsdetiailsresults->controlleddrug_baseunit_id,
                 //'altered_by' => $permitsproductsdetiailsresults->altered_by,
                 'dola' => $permitsproductsdetiailsresults->dola,
                 'created_by'=> $permitsproductsdetiailsresults->created_by,
                 'created_on'=> $permitsproductsdetiailsresults->created_on,
    
            );
            $permitsproducts_res = insertRecord('tra_permits_products', $permitsproductsdetiailsresultsdata);
            if(!isset($permitsproducts_res['record_id'])){
                DB::rollback();
                return $permitsproducts_res;
    
                 }
    
            }
            }
            else{
                DB::rollBack();
                return ['message'=>'Zero products found on the permit', 'success'=>false];
            }
            $new_submission_params = array(
                'portal_application_id' => $portal_application_id,
                'new_application_id' => $active_application_id,
                "application_code" => $results->application_code,
                "tracking_no" => $results->tracking_no,
                "module_id" => $results->module_id,
                "sub_module_id" => $results->sub_module_id,
                "section_id" => $results->section_id,
                "importexport_permittype_id" => $results->importexport_permittype_id,
                      );
     
           $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
           if(!isset($new_submission_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $new_submission_res;
    
             }
             //Mark as submitted
         $application_code = $results->application_code;
         $table_name = 'wb_onlinesubmissions';
         $where = array(
             'application_code' => $application_code
         );
         $data = array(
             'is_received' => 1,
             'application_status_id'=>5,
             'application_code'=> $application_code,
         );
         $update_res = updateRecord($table_name, $where, $data, $user_id,'portal_db');
         if(!isset($update_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $update_res;
    
             }
          //update application status
        $data = array(
            'application_status_id'=>3
        );
        $update_res = updateRecord('wb_importexport_applications', $where, $data, $user_id,'portal_db');
        if(!isset($update_res['record_id'])){
            DB::rollback();
           $portal_db->rollback();
           return $update_res;
        }
    
        }
         } 
         DB::commit();
         $portal_db->commit();
        }
        catch (\Exception $exception) {
                 DB::rollBack();
                 $portal_db->rollback();
                 $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
             } catch (\Throwable $throwable) {
                 DB::rollBack();
                 $portal_db->rollback();
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
             }
             return $res;
    }

    public function receivePromotionPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id){
        try {
            $portal_db = DB::connection('portal_db');
            $portal_db->beginTransaction();
            DB::beginTransaction();
            //check duplicate application code
            $duplicate_application_code = getSingleRecordColValue('tra_promotion_adverts_applications', array('application_code'=>$application_code), 'application_code');
            if(validateIsNumeric($duplicate_application_code)){
                $data = array(
                    'dola' => Carbon::now(),
                    'application_code'=> $application_code,
                    'module_id' => $module_id,
                    'type'=>5
                );
                $res = insertRecord('par_sync_error_log',$data,3,'audit_db');
                return array(
                    'is_duplicate'=>1,
                    'success' => false
                );
                //generate new application_code and update respective tables
                // $applications_table = 'tra_promotion_adverts_applications';
                // $new_application_code = generateApplicationCode($sub_module_id, $applications_table);
                // $where = array(
                //     'application_code' => $duplicate_application_code
                // );
                // $data = array(
                //     'dola' => Carbon::now(),
                //     'application_code'=> $new_application_code,
                // );
                // $update_res = updateRecord('wb_promotion_adverts_applications', $where, $data, $user_id,'portal_db');
                // if(!isset($update_res['record_id'])){
                //    DB::rollback();
                //    return $update_res;
           
                //     }
                //     //wb_onlinesubmissions
                // $update_res = updateRecord('wb_onlinesubmissions', $where, $data, $user_id,'portal_db');
                // if(!isset($update_res['record_id'])){
                //     DB::rollback();
                //     return $update_res;
               
                //         }
                // $update_res = updateRecord('wb_promotion_prod_particulars', $where, $data, $user_id,'portal_db');
                // if(!isset($update_res['record_id'])){
                //             DB::rollback();
                //             return $update_res;
                //         }
            }
            else{
            //Get portal  data

            $qry = $portal_db->table('wb_promotion_adverts_applications as t1')
                ->select('t1.*');
            $qry->where('t1.application_code',$application_code);
            $results = $qry->first();
            if(!isset($results->id)){
                DB::rollBack();
                return ['message'=> 'record not found', 'success'=>false]; 
            }
            $portal_application_id = $results->id;
            $module_id = $results->module_id;
            $sub_module_id = $results->sub_module_id;
            $section_id = $results->section_id;
            $portal_sponsor_id = $results->sponsor_id;
            $view_id = generateApplicationViewID();
            $trader_id = $results->trader_id;
            $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
            $applicant_id = getInternalApplicant_id($identification_no);
            /**
             * Check if the sponsor is selected
             */
            // if(validateIsNumeric($portal_sponsor_id)){
            //     $promotion_personnel_table = 'wb_promotionaladvert_personnel';
            //     $where_clause = array(
            //         'id'=>$portal_sponsor_id
    
            //     );
    
    
            //     $sponsor_details  = getPreviousRecords($promotion_personnel_table,$where_clause,'portal_db');
            //     //dd($sponsor_details);
            //     $sponsor_email = $sponsor_details['email'];
    
    
    
    
            // }
    
            // get process id
            $process_qry = DB::table('wf_processes as t1')
                ->select('t1.id')
                ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
            $process_results = $process_qry->first();
            if(!isset($process_results->id)){
                DB::rollBack();
                return ['message'=> 'Process not found', 'success'=>false]; 
            }
            $process_id = $process_results->id;
            if($results){
                $promotion_material_data = array(
                    'process_id'=> $process_id,
                    'applicant_id'=> $applicant_id,
                    'view_id'=>  $view_id,
                    'applicant_as_sponsor'=> $results->applicant_as_sponsor,
                    //'classification_id'=> $results->classification_id,
                    //'product_type_id'=> $results->product_type_id,
                    'sponsor_id'=> $results->sponsor_id,
                    'section_id'=> $results->section_id,
                    'module_id'=> $results->module_id,
                    'sub_module_id'=> $results->sub_module_id,
                    'application_code' => $results->application_code,
                    'tracking_no'=> $results->tracking_no,
                    'intended_user_id'=> $results->intended_user_id,
                    // 'advertisement_category_id'=> $results->advertisement_category_id,
                    'advertisement_type_id'=> $results->advertisement_type_id,
                    'exhibition_start_date'=> $results->exhibition_start_date,
                    'exhibition_end_date'=> $results->exhibition_end_date,
                    'venue_of_exhibition'=> $results->venue_of_exhibition,
                    'description_of_advert'=> $results->description_of_advert,
                    //'workflow_stage_id'=> $results->workflow_stage_id,
                    //'permit_no'=>$request-> $results->trader_id,
                    'application_status_id'=> $results->application_status_id,
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now()
                    //'permit_issue_date'=> $results->trader_id,
                    //'expiry_date'=> $results->trader_id,
                );
                $applications_table = 'tra_promotion_adverts_applications';
                $res = insertRecord($applications_table, $promotion_material_data, $user_id);
                if(!isset($res['record_id'])){
                    DB::rollback();
                    return $res;
    
                     }
                $active_application_id = $res['record_id'];
                $module_id = $results->module_id;
                $sub_module_id = $results->sub_module_id;
                $section_id = $results->section_id;
                $Stage_qry = DB::table('wf_processes as t1')
                    ->select('t1.workflow_id')
                    ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
                $Stage_qry_results = $Stage_qry->first();
                if($Stage_qry_results){
                    $workflow_id = $Stage_qry_results->workflow_id;
                    $stage_id_qry = DB::table('wf_workflow_stages as t1')
                        ->select('t1.id')
                        ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
                    $stage_id_results = $stage_id_qry->first();
                if(!isset($stage_id_results->id)){
                     DB::rollBack();
                    return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
                 }
                $previous_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'is_portalapp_previousstage'=>1), 'id');
                if (!validateIsNumeric($previous_stage_id)){
                    $previous_stage_id = $stage_id_results->id;
                 }
                   //check on online applications
                 $application_code = $results->application_code;
                 $is_paid_id = getSingleRecordColValue('tra_payments', array('application_code'=>$application_code), 'id');
                 if (!validateIsNumeric($is_paid_id)){
                    $workflow_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'stage_category_id'=>22), 'id');
                    if(!validateIsNumeric($workflow_stage_id)){
                        $workflow_stage_id = $stage_id_results->id;
                    }
                 }
                else{
                    $workflow_stage_id = $stage_id_results->id;
                  }
                    //add to submissions table
                $submission_params = array(
                        'application_id' => $active_application_id,
                        'process_id' => $process_id,
                        'view_id'=>  $view_id,
                        'applicant_id' =>  $applicant_id,
                        'application_code' => $results->application_code,
                        //'reference_no' =>  $results->reference_no,
                        'tracking_no'=> $results->tracking_no,
                        'usr_from' => $user_id,
                       // 'usr_to' => $user_id,
                        'previous_stage' => $previous_stage_id,
                        'current_stage' => $workflow_stage_id,
                        'module_id' => $results->module_id,
                        'sub_module_id' => $results->sub_module_id,
                        'section_id' => $results->section_id,
                        'application_status_id' => 5,
                        'urgency' => 1,
                        'remarks' => 'Online Received Application',
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'created_by' => $user_id
                    );
                    $sub_res = insertRecord('tra_submissions', $submission_params);
                    if(!isset($sub_res['record_id'])){
                        DB::rollback();
                        return $sub_res;
        
                         }
                }
                else{
                    DB::rollBack();
                    return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
                }
                //Get promotion product particulars
                $promotionproductsqry = $portal_db->table('wb_promotion_adverts_applications as t1')
                    ->leftjoin('wb_promotion_prod_particulars as t2', 't1.id', 't2.application_id')
                    ->select('t2.*')
                    ->where('t1.application_code',$application_code);
                $promotionproductsresults = $promotionproductsqry->get();
               // dd($promotionproductsresults);
                if($promotionproductsresults){
                    foreach ($promotionproductsresults as $promotionproductsresults) {
                        # code...
                        $promotionproductsresultsdata = array(
                            'application_id' => $active_application_id,
                            'product_category_id' => $promotionproductsresults->common_name_id,
                            'product_subcategory_id' => $promotionproductsresults->prodclass_category_id,
                            'brand_name' => $promotionproductsresults->brand_name,
                            'product_id' => $promotionproductsresults->product_id,
                            'common_name_id' => $promotionproductsresults->common_name_id,
                            'is_registered'=> $promotionproductsresults->is_registered,
                            'registration_no' => $promotionproductsresults->registration_no,
                            'registrant_name' => $promotionproductsresults->registrant_name,
                            'type_of_advertisement_id' => $promotionproductsresults->type_of_advertisement_id,
                            'other_details' => $promotionproductsresults->other_details,
                            'dola' => $promotionproductsresults->dola,
                            'created_by'=> $promotionproductsresults->created_by,
                            'created_on'=> Carbon::now(),
    
                        );
                        $promotionproducts_res = insertRecord('tra_promotion_prod_particulars', $promotionproductsresultsdata);
                        if(!isset($promotionproducts_res['record_id'])){
                            DB::rollback();
                            return $promotionproducts_res;
            
                             }
    
                    }
                }
                //Get promotion_materials_details
                $materialsdetiailsqry = $portal_db->table('wb_promotion_adverts_applications as t1')
                    ->leftjoin('wb_promotion_materials_details as t2', 't1.id', 't2.application_id')
                    ->select('t2.*')
                    ->where('t1.application_code',$application_code);
                $materialsdetiailsresults = $materialsdetiailsqry->get();
               // dd($materialsdetiailsresults);
                if($materialsdetiailsresults){
                    foreach ($materialsdetiailsresults as $materialsdetiailsresults) {
                        # code...
                        $materialsdetiailsresultsdata = array(
                            'application_id' => $active_application_id,
                            'material_id' => $materialsdetiailsresults->material_id,
                            'remarks' => $materialsdetiailsresults->remarks,
                            'altered_by' => $materialsdetiailsresults->altered_by,
                            'dola' => $materialsdetiailsresults->dola,
                            'created_by'=> $materialsdetiailsresults->created_by,
                            'created_on'=> $materialsdetiailsresults->created_on,
    
                        );
                        $materialsdetiails_res = insertRecord('tra_promotion_materials_details', $materialsdetiailsresultsdata);
                        if(!isset($materialsdetiails_res['record_id'])){
                            DB::rollback();
                            return $materialsdetiails_res;
            
                             }
                    }
                 
                }
                $new_submission_params = array(
                    'portal_application_id' => $portal_application_id,
                    'new_application_id' => $active_application_id,
                    "application_code" => $results->application_code,
                    "tracking_no" => $results->tracking_no,
                    "module_id" => $results->module_id,
                    "sub_module_id" => $results->sub_module_id,
                    "section_id" => $results->section_id,
                );
    
                $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
                if(!isset($new_submission_res['record_id'])){
                    DB::rollback();
                    $portal_db->rollback();
                    return $new_submission_res;
    
                     }
                //Mark as submitted
         $application_code = $results->application_code;
         $table_name = 'wb_onlinesubmissions';
         $where = array(
             'application_code' => $application_code
         );
         $data = array(
             'is_received' => 1,
             'application_status_id' => 5,
             'application_code'=> $application_code,
         );
         $update_res = updateRecord($table_name, $where, $data, $user_id,'portal_db');
         if(!isset($update_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $update_res;
    
             }
          //update application status
        $data = array(
            'application_status_id'=>3
           );
        $update_res = updateRecord('wb_promotion_adverts_applications', $where, $data, $user_id,'portal_db');
        if(!isset($update_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $update_res;
        }
        }
        } 
        DB::commit();
        $portal_db -> commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            $portal_db->rollback();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $portal_db->rollback();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
        }
    }

    public function receivePsurPortalApplication($module_id,$sub_module_id,$section_id,$application_code,$user_id){
        try {
        $portal_db = DB::connection('portal_db');
        $portal_db->beginTransaction();
        DB::beginTransaction();
        //check duplicate application code
        $duplicate_application_code = getSingleRecordColValue('tra_psur_pbrer_applications', array('application_code'=>$application_code), 'application_code');
        if(validateIsNumeric($duplicate_application_code)){
            $data = array(
                'dola' => Carbon::now(),
                'application_code'=> $application_code,
                'module_id' => $module_id,
                'type'=>5
            );
            $res = insertRecord('par_sync_error_log',$data,3,'audit_db');
            return array(
                'is_duplicate'=>1,
                'success' => false
            );
        //generate new application_code and update respective tables
        // $applications_table = 'tra_psur_pbrer_applications';
        // $new_application_code = generateApplicationCode($sub_module_id, $applications_table);
        // $where = array(
        //     'application_code' => $duplicate_application_code
        // );
        // $data = array(
        //     'dola' => Carbon::now(),
        //     'application_code'=> $new_application_code,
        // );
        // $update_res = updateRecord('wb_psur_pbrer_applications', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //    DB::rollback();
        //    return $update_res;
   
        //     }
        //     //wb_onlinesubmissions
        // $update_res = updateRecord('wb_onlinesubmissions', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //     DB::rollback();
        //     return $update_res;
       
        //         }
        // $update_res = updateRecord('wb_psur_pbrer_prod_particulars', $where, $data, $user_id,'portal_db');
        // if(!isset($update_res['record_id'])){
        //     DB::rollback();
        //     return $update_res;
        //     }
        }
       else{
            //Get portal data
            $qry = $portal_db->table('wb_psur_pbrer_applications as t1')
                 ->select('t1.*');
            $qry->where('t1.application_code',$application_code);
            $results = $qry->first();
            if(!isset($results->id)){
                DB::rollBack();
                return ['message'=> 'record not found', 'success'=>false]; 
            }
            $portal_application_id = $results->id;
            $module_id = $results->module_id;
            $sub_module_id = $results->sub_module_id;
            $section_id = 2;
            $trader_id=$results->trader_id;
              //get applicant id
            $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
            $applicant_id = getInternalApplicant_id($identification_no);
            $view_id= generateApplicationViewID();
               // get process id
            $process_qry = DB::table('wf_processes as t1')
                     ->select('t1.id')
                     ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
            $process_results = $process_qry->first();
            if(!isset($process_results->id)){
                DB::rollBack();
                return ['message'=> 'Process not found', 'success'=>false]; 
            }
            $process_id = $process_results->id;
            if($results){
                $application_params = array(
                    'process_id' => $process_id,
                    'applicant_id'=> $applicant_id,
                    'application_status_id'=> $results->application_status_id,
                    'view_id' => $view_id,
                    'module_id' => $results->module_id,
                    'sub_module_id' => $results->sub_module_id,
                    'section_id' => $results->section_id,
                    'application_code' => $results->application_code,
                    'tracking_no' => $results->tracking_no,
                    'reference_no' => $results->reference_no,
                    'product_id'=>$results->registered_product_id,
                    'psur_type_id' => $results->psur_type_id,
                    'remarks'=> $results->remarks,
                    'from_date'=>$results->from_date,
                    'to_date'=>$results->to_date,
                    'date_added' => Carbon::now(),
                    'created_on' => Carbon::now()
                );
            $applications_table = 'tra_psur_pbrer_applications';
            $res = insertRecord($applications_table, $application_params, $user_id);
            if(!isset($res['record_id'])){
                DB::rollback();
                return $res;
                 }
            $active_application_id = $res['record_id'];
            //Add to submissions table
            $module_id = $results->module_id;
            $sub_module_id = $results->sub_module_id;
            //$section_id=$results->section_id;
            $Stage_qry = DB::table('wf_processes as t1')
                       ->select('t1.workflow_id')
                       ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
            $Stage_qry_results = $Stage_qry->first();
            if($Stage_qry_results){
                $workflow_id = $Stage_qry_results->workflow_id;
                $stage_id_qry = DB::table('wf_workflow_stages as t1')
                    ->select('t1.id')
                    ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
            $stage_id_results = $stage_id_qry->first();
            if(!isset($stage_id_results->id)){
                DB::rollBack();
                return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
            }
            $previous_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'is_portalapp_previousstage'=>1), 'id');
            if (!validateIsNumeric($previous_stage_id)){
                $previous_stage_id = $stage_id_results->id;
             }
               //check on online applications
           $application_code = $results->application_code;
           $is_paid_id = getSingleRecordColValue('tra_payments', array('application_code'=>$application_code), 'id');
           if (!validateIsNumeric($is_paid_id)){
            $workflow_stage_id = getSingleRecordColValue('wf_workflow_stages', array('workflow_id'=>$workflow_id,'stage_category_id'=>22), 'id');
            if(!validateIsNumeric($workflow_stage_id)){
                $workflow_stage_id = $stage_id_results->id;
            }
            }
            else{
              $workflow_stage_id = $stage_id_results->id;
             }
           //add to submissions table
           $submission_params = array(
            'application_id' => $active_application_id,
            'process_id' => $process_id,
            'applicant_id' =>  $applicant_id,
            'view_id'=> $view_id,
            'application_code' => $results->application_code,
            'reference_no' =>  $results->reference_no,
            'tracking_no'=> $results->tracking_no,
            'usr_from' => $user_id,
            //'usr_to' => $user_id,
            'previous_stage' => $previous_stage_id,
            'current_stage' => $workflow_stage_id,
            'module_id' => $results->module_id,
            'sub_module_id' => $results->sub_module_id,
            'section_id' => $results->section_id,
            'application_status_id' => 5,
            'urgency' => 1,
            'remarks' => 'Online Received Application',
            'date_received' => Carbon::now(),
            'created_on' => Carbon::now(),
            'created_by' => $user_id
        );
        $sub_res = insertRecord('tra_submissions', $submission_params);
        if(!isset($sub_res['record_id'])){
            DB::rollback();
            return $sub_res;
             }
       
          }
          else{
            DB::rollBack();
            return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
          }
         //log products details
         $prod_qry = $portal_db->table('wb_psur_pbrer_prod_particulars as t1')
                     ->select('t1.*')
                     ->where('t1.application_id',$portal_application_id);
          $prod_results = $prod_qry->get();
          if($prod_results){
              foreach ($prod_results as $prod_results) {
               # code...
               $prod_resultsdata = array(
                 'application_id' => $active_application_id,
                 'brand_name' => $prod_results->brand_name,
                 'product_id' => $prod_results->product_id,
                 'altered_by' => $prod_results->altered_by,
                 'dola' => $prod_results->dola,
                 'created_by'=> $prod_results->created_by,
                 'created_on'=> $prod_results->created_on,
    
             );
             $prod_res = insertRecord('tra_psur_pbrer_prod_particulars', $prod_resultsdata);
             if(!isset($prod_res['record_id'])){
                 DB::rollback();
                 return $prod_res;
                  }
                }
               }
          $new_submission_params = array(
            'portal_application_id' => $portal_application_id,
            'new_application_id' => $active_application_id,
            "application_code" => $results->application_code,
            "tracking_no" => $results->tracking_no,
            "module_id" => $results->module_id,
            "sub_module_id" => $results->sub_module_id,
            "section_id" => $results->section_id,
               );
    
           $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
            if(!isset($new_submission_res['record_id'])){
                DB::rollback();
                $portal_db->rollback();
                return $new_submission_res;
                 }
        //Mark as submitted
        $application_code = $results->application_code;
        $table_name = 'wb_onlinesubmissions';
        $where = array(
            'application_code' => $application_code
        );
        $data = array(
            'is_received' => 1,
            'application_status_id' => 5,
            'application_code'=> $application_code
        );
        $update_res = updateRecord($table_name, $where, $data, $user_id,'portal_db');
        if(!isset($update_res['record_id'])){
           DB::rollback();
           $portal_db->rollback();
           return $update_res;
            }
            //update application status
        $data = array(
            'application_status_id'=>3
        );
        $update_res = updateRecord('wb_psur_pbrer_applications', $where, $data, $user_id,'portal_db');
        if(!isset($update_res['record_id'])){
            DB::rollback();
            $portal_db->rollback();
            return $update_res;
         }
          }
         } 
         DB::commit();
         $portal_db -> commit();
         } catch (\Exception $exception) {
                    DB::rollBack();
                    $portal_db->rollback();
                    $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
                } catch (\Throwable $throwable) {
                    DB::rollBack();
                    $portal_db->rollback();
                   $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
                }
                return $res;
    }

}

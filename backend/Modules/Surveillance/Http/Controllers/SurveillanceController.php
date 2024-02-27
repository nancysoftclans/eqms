<?php

namespace Modules\Surveillance\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;

class SurveillanceController extends Controller
{

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
        return view('surveillance::index');
    }
    
    
    
    public function saveSurveillanceCommonData(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $premise_ids = $req->premise_ids;
            $table_name = $post_data['table_name'];
            $id = $post_data['id'];
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);
            unset($post_data['premise_ids']);
            $unsetData = $req->input('unset_data');
            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }

            $table_data = $post_data;
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            $res = array();

            //premises for multi select 
            $premises_array = json_decode($premise_ids);

            if($premises_array){
                $datasets = [];
               foreach ($premises_array as $premise_id) {
                   $table_data['premise_id'] = $premise_id;
                   $datasets[] = $table_data;
               }
               if(!empty($datasets)){
                    $res = insertMultipleRecords($table_name, $datasets, $user_id);
               }
            }else{
                if (isset($id) && $id != "") {
                    if (recordExists($table_name, $where)) {
                        unset($table_data['created_on']);
                        unset($table_data['created_by']);
                        $table_data['dola'] = Carbon::now();
                        $table_data['altered_by'] = $user_id;
                        // $previous_data = getPreviousRecords($table_name, $where);
                        // if ($previous_data['success'] == false) {
                        //     return $previous_data;
                        // }
                        // $previous_data = $previous_data['results'];
                        $res = updateRecord($table_name, $where, $table_data, $user_id);
                    }
                } else {
                    $res = insertRecord($table_name, $table_data, $user_id);
                }
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function deleteSurveillanceRecord(Request $req)
    {
        try {
            $record_id = $req->input('id');
            $table_name = $req->input('table_name');
            $user_id = \Auth::user()->id;
            $where = array(
                'id' => $record_id
            );
            // $previous_data = getPreviousRecords($table_name, $where);
            // if ($previous_data['success'] == false) {
            //     return $previous_data;
            // }
            // $previous_data = $previous_data['results'];
            $res = deleteRecord($table_name, $where, $user_id);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function saveSurveillancePlansDetailsCommonData(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = $post_data['table_name'];
            $id = $post_data['id'];
            $district_id = $post_data['district_id'];
            $district_id = json_decode($district_id);
            $params = array();
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['district_id']);
            
            unset($post_data['unset_data']);
            $unsetData = $req->input('unset_data');
            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }

            $table_data = $post_data;
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            if (count($district_id) > 0) {
                foreach ($district_id as $district_id) {
                    
                    $table_data['district_id'] = $district_id;
                    $res = insertRecord($table_name, $table_data, $user_id);

                }
            }
            else{
                $res = array('success'=>false,'message'=>'Data Saved Successfully');
            }
            
           
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    } 
    public function savePmsProgramSamplingSite(Request $request)
    {
        
        $program_id = $request->input('program_id');
        $site_level_id = $request->input('site_level_id');

        $sampling_site_ids = $request->input('sampling_site_ids');
        
        $user_id = $this->user_id;
        $res = array();
        try {
            //DB::transaction(function () use ($program_id, $sampling_site_ids,$site_level_id, &$res) {
                $sampling_site_ids = json_decode($sampling_site_ids);
                $params = array();
              
                if (count($sampling_site_ids) > 0) {
                    foreach ($sampling_site_ids as $sampling_site_id) {
                        $where = array(
                            'program_id' => $program_id,
                            'site_level_id'=>$site_level_id,
                            'sampling_site_id' => $sampling_site_id
                        );
                        $count = DB::table('pms_program_samplingsites')
                            ->where($where)
                            ->count();
                            if($count == 0){
                                $params[] = array(
                                    'program_id' => $program_id,
                                    'site_level_id'=>$site_level_id,
                                    'sampling_site_id' => $sampling_site_id,
                                    'created_on' => Carbon::now(),
                                    'created_by' => \Auth::user()->id
                                );
                            }
                      
                       
                    }
                    DB::table('pms_program_samplingsites')
                        ->insert($params);
                }
           // }, 5);
            $res = array(
                'success' => true,
                'message' => 'Data saved successfully!!'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function savePmsProgramRegions(Request $request)
    {
        
        $program_id = $request->input('program_id');
       
        $region_ids = $request->input('region_ids');
        $user_id = $this->user_id;
        $res = array();
        try {
            DB::transaction(function () use ($program_id, $region_ids, &$res) {
                $region_ids = json_decode($region_ids);
                $params = array();
              
                if (count($region_ids) > 0) {
                    foreach ($region_ids as $region_id) {
                        $where = array(
                            'program_id' => $program_id,
                            'region_id' => $region_id
                        );
                        $count = DB::table('pms_program_regions')
                            ->where($where)
                            ->count();
                            if($count == 0){
                                $params[] = array(
                                    'program_id' => $program_id,
                                    'region_id' => $region_id,
                                    'created_on' => Carbon::now(),
                                    'created_by' => \Auth::user()->id
                                );
                            }
                      
                       
                    }
                    DB::table('pms_program_regions')
                        ->insert($params);
                }
            }, 5);
            $res = array(
                'success' => true,
                'message' => 'Data saved successfully!!'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    
    /*


    */
    public function savePmsProgramProducts(Request $request)
    {
        
        $program_id = $request->input('program_id');
        $active_id = $request->input('active_id');
        $product_ids = $request->input('product_ids');
        $sub_product_ids = $request->input('sub_product_ids');
        $default_sample_size = $request->input('default_sample_size');
        $container_id = $request->input('container_id');
        $user_id = $this->user_id;
        $res = array();
        try {
            DB::beginTransaction();
            
            $product_ids = json_decode($product_ids);
            $sub_product_ids = json_decode($sub_product_ids);
            $params = array();
              
            if (count($product_ids) > 0) {
                foreach ($product_ids as $product_id) {
                    $where = array(
                        'program_id' => $program_id,
                        'product_id' => $product_id,
                        'active_id' => $active_id
                    );
                    $count = DB::table('pms_program_products')
                        ->where($where)
                        ->count();
                        if($count == 0){
                            $params = array(
                                'program_id' => $program_id,
                                'product_id' => $product_id,
                                'active_id' => $active_id,
                                'default_sample_size' => $default_sample_size,
                                'container_id' => $container_id,
                                'created_on' => Carbon::now(),
                                'created_by' => \Auth::user()->id
                            );
                            $res = insertRecord('pms_program_products', $params);
                            if(isset($res['record_id'])){
                                //save altenatives
                                $program_product_id = $res['record_id'];
                                 
                                 if (count($sub_product_ids) > 0) {
                                    foreach ($sub_product_ids as $sub_product_id) {
                                        $where = array(
                                            'program_product_id' => $program_product_id,
                                            'product_id' => $sub_product_id
                                        );
                                        //delete altenatives for remapping
                                        deleteRecord('pms_program_altenative_products', $where);
                                        $params = array(
                                            'program_product_id' => $program_product_id,
                                            'product_id' => $sub_product_id,
                                            'created_on' => Carbon::now(),
                                            'created_by' => \Auth::user()->id
                                        );
                                        $sub_res = insertRecord('pms_program_altenative_products', $params);
                                        if(!isset($sub_res['record_id'])){
                                               dd($sub_res);
                                            }
                                        }
                                            //save altenatives
                                      
                                       
                                    }
                            }
                        }else{
                            $program_product_id = DB::table('pms_program_products')
                                ->where($where)
                                ->value('id');
                            //update altenatives
                            if (count($sub_product_ids) > 0) {
                                foreach ($sub_product_ids as $sub_product_id) {
                                    $where = array(
                                        'program_product_id' => $program_product_id,
                                        'product_id' => $sub_product_id
                                    );
                                    //delete altenatives for remapping
                                    deleteRecord('pms_program_altenative_products', $where);
                                    $params = array(
                                        'program_product_id' => $program_product_id,
                                        'product_id' => $sub_product_id,
                                        'created_on' => Carbon::now(),
                                        'created_by' => \Auth::user()->id
                                    );
                                    $sub_res = insertRecord('pms_program_altenative_products', $params);
                                    if(!isset($sub_res['record_id'])){
                                            dd($sub_res);
                                        }
                                }
                            }
                        }
                  
                   
                }
            }
            DB::commit();
            $res = array(
                'success' => true,
                'message' => 'Data saved successfully!!'
            );
        } catch (\Exception $exception) {
            dd($exception->getMessage());
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            dd($exception->getMessage());
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    
    public function getPmsProgramSamplingSitesLevels(Request $request)
    {
        $program_id = $request->input('program_id');
        $site_level_id = $request->input('site_level_id');
        try {

            $qry = DB::table('pms_program_samplingsites as t1')
                ->join('par_site_levels as t3', 't1.site_level_id', '=', 't3.id')
                ->select('t1.program_id', 't3.name as site_level', 't3.id as site_level_id')
                ->where('t1.program_id', $program_id)
                ->groupBy('t3.id','t1.program_id');

            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getPmsProgramSamplingSites(Request $request)
    {
        $program_id = $request->input('program_id');
        $site_level_id = $request->input('site_level_id');
        $filters = $request->input('filters');
        $has_filter = false;
        try {

            $qry = DB::table('pms_program_samplingsites as t1')
                ->join('par_premises_types as t2', 't1.sampling_site_id', '=', 't2.id')
                ->leftJoin('par_site_levels as t3', 't1.site_level_id', '=', 't3.id')
                ->select('t1.*', 't2.name as sampling_site', 't3.name as site_level');

               
                
            if(validateIsNumeric($site_level_id)){
                $qry->where('site_level_id',$site_level_id);
            }
            
            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $qry->where($filters);
                $has_filter = true;
            }
            if(!$has_filter){
                $qry->where('t1.program_id',$program_id);
            }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getPmsProgramRegions(Request $request)
    {
        $program_id = $request->input('program_id');
        try {
            $qry = DB::table('pms_program_regions as t1')
                ->join('par_regions as t2', 't1.region_id', '=', 't2.id')
                ->select('t1.*', 't2.name as region_name')
                ->where('t1.program_id', $program_id);
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getPmsProgramProducts(Request $request)
    {
        $program_id = $request->input('program_id');
        try {
            $qry = DB::table('pms_program_products as t1')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('par_ingredients_details as t3', 't1.active_id', '=', 't3.id')
                ->leftJoin('tra_product_manufacturers as t4', function ($join) {
                    $join->on('t4.product_id', '=', 't1.product_id')
                        ->on('t4.active_ingredient_id', '=', 't1.active_id');
                })
                ->leftJoin('tra_manufacturers_information as t5', 't4.manufacturer_id', '=', 't5.id')

                ->select('t1.*', 't3.name as active_name', 't2.brand_name', 't5.name as manufacturer_name','t2.strength', 't2.dosage_form_id', DB::raw("(select string_agg(tpi.brand_name, ' , ') from pms_program_altenative_products tp inner join tra_product_information tpi on tp.product_id = tpi.id where tp.program_product_id = t1.id) as substitutes"))
                ->where('t1.program_id', $program_id);
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    
    public function getPmsProgramsImplementationDetails(Request $request)
    {
        $program_id = $request->input('program_id');
        $program_implementation_id = $request->program_implementation_id;
        $zone_id = $request->zone_id;
        
        try {
            $qry = DB::table('pms_program_implementationplan as t12')
                ->join('pms_program_details as t13', 't12.program_id', '=', 't13.id')
                ->join('pms_program_plans as t1', 't1.program_implementation_id', '=', 't12.id')
                ->leftJoin('par_business_types as t2', 't1.sampling_site_id', '=', 't2.id')
                ->leftJoin('par_common_names as t3', 't1.product_id', '=', 't3.id')
                ->leftJoin('par_product_categories as t4', 't1.product_category_id', '=', 't4.id')
                ->leftJoin('par_dosage_forms as t5', 't1.dosage_form_id', '=', 't5.id')
                ->leftJoin('par_product_forms as t51', 't1.product_form_id', '=', 't51.id')
                ->leftJoin('par_device_types as t52', 't1.device_type_id', '=', 't52.id')
                ->leftJoin('par_si_units as t6', 't1.si_unit_id', '=', 't6.id')
                ->leftJoin('par_containers as t7', 't1.container_id', '=', 't7.id')
                ->leftJoin('par_packaging_units as t8', 't1.packaging_unit_id', '=', 't8.id')
                ->leftJoin('par_regions as t10', 't1.region_id', '=', 't10.id')                
                ->leftJoin('par_districts as t11', 't1.district_id', '=', 't11.id')
                ->leftJoin('par_site_levels as t14', 't1.site_level_id', '=', 't14.id')
                ->select(DB::raw("t14.name as site_level, t12.*, t13.name as program_name,t13.description as program_description, t13.start_date, t13.end_date, t12.program_id,t12.id as program_implementation_id,  t12.program_id as pms_program_id,t1.*,t2.name as sampling_site,t3.name as product,t4.name as category_name,t5.name as dosage_form,t13.name as pms_program,
                t13.start_date,t13.end_date,CONCAT_WS(' of ',t7.name,CONCAT(t1.unit_pack,t8.name)) as pack,CONCAT(t1.strength,t6.name) as strength_txt,
                         t51.name as product_form,t52.name as device_type,(t1.number_of_brand*t1.number_of_batch*t1.number_of_unitpack) as total_samples,t1.id as pms_plan_id, t10.name as region_name, t11.name as district_name"));// t2
            if (validateIsNumeric($program_id)) {
                $qry->where('t1.program_id', $program_id);//number_of_unitpack
            }
            if (validateIsNumeric($program_implementation_id)) {
                $qry->where('t12.id', $program_implementation_id);
            }
            if (validateIsNumeric($zone_id)) {
                $qry->where('t10.zone_id', $zone_id);
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
        return response()->json($res);
    }
    public function getPmsProgramsImplementation(Request $request)
    {
        $program_id = $request->input('program_id');
        $section_id = $request->section_id;
        try {
            $qry = DB::table('pms_program_implementationplan as t1')
                ->join('pms_program_details as t2', 't1.program_id', '=', 't2.id')
                ->leftJoin('tra_surveillance_applications as t3', 't1.id', '=', 't3.program_implementation_id')
                ->select('t1.*', 't2.name as program_name','t2.description as program_description', 't2.start_date', 't2.end_date', 't1.program_id','t1.id as program_implementation_id',  't1.program_id as pms_program_id', DB::raw("CASE WHEN t3.id IS NULL THEN 2 else 1 END as status"));//
            if (isset($program_id) && is_numeric($program_id)) {
                $qry->where('t1.program_id', $program_id);
            }
            if (validateIsNumeric($section_id)) {
                $qry->where('t2.section_id', $section_id);
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
        return response()->json($res);
    }
    public function getPmsPrograms(Request $request)
    {
        $section_id = $request->input('section_id');
        try {
            $qry = DB::table('pms_program_details as t1')
                ->join('par_sections as t2', 't1.section_id', '=', 't2.id')
                ->leftJoin('tra_pmsprogram_applications as t4', 't1.id', '=', 't4.program_id')
                ->leftJoin('par_system_statuses as t5', 't4.application_status_id', '=', 't5.id')
                ->select('t1.*', 't2.name as section_name', 't1.name as pms_program','t1.id as program_id',  't1.id as pms_program_id', 't5.name as status','t5.id as status_id');//
            if (isset($section_id) && is_numeric($section_id)) {
                $qry->where('t1.section_id', $section_id);
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
        return response()->json($res);
    }

    public function getPmsProgramPlans(Request $request)
    {
        $program_implementation_id = $request->input('program_implementation_id');
        $section_id = $request->input('section_id');
        $active_application_id = $request->input('active_application_id');
        try {
            $qry = DB::table('pms_program_plans as t1')
                ->join('pms_program_details as t9', 't1.program_id', '=', 't9.id')
                ->leftJoin('pms_program_samplingsites as t22', 't1.sampling_site_id', '=', 't22.id')
                ->leftJoin('par_business_types as t2', 't22.sampling_site_id', '=', 't2.id')
                ->leftJoin('tra_product_information as t33', 't1.product_id', '=', 't33.id')
                ->leftJoin('par_common_names as t3', 't33.common_name_id', '=', 't3.id')
                ->leftJoin('tra_product_applications as t44', 't1.product_id', '=', 't44.product_id')
                ->leftJoin('par_prodclass_categories as t4', 't44.prodclass_category_id', '=', 't4.id')
                ->leftJoin('par_dosage_forms as t5', 't1.dosage_form_id', '=', 't5.id')
                ->leftJoin('par_product_forms as t51', 't1.product_form_id', '=', 't51.id')
                ->leftJoin('par_device_types as t52', 't1.device_type_id', '=', 't52.id')
                ->leftJoin('par_si_units as t6', 't1.si_unit_id', '=', 't6.id')
                ->leftJoin('par_containers as t7', 't1.container_id', '=', 't7.id')
                ->leftJoin('par_packaging_units as t8', 't1.primary_container_id', '=', 't8.id')
                ->leftJoin('par_packaging_units as t88', 't1.secondary_container_id', '=', 't88.id')
                ->leftJoin('par_packaging_units as t888', 't1.tertiary_container_id', '=', 't888.id')
                
                ->leftJoin('par_regions as t10', 't1.region_id', '=', 't10.id')
                
                ->leftJoin('par_districts as t11', 't1.district_id', '=', 't11.id')
                ->leftJoin('tra_surveillance_applications as t12',function ($join) use ($active_application_id ) {
                    $join->on('t1.program_implementation_id', 't12.program_implementation_id')
                        ->where('t12.id', $active_application_id);
                })
                ->leftJoin('tra_pms_application_site_regions as t13', function ($join) {
                    $join->on('t13.application_code', 't12.application_code')
                        ->on('t13.site_region_id', 't1.id');
                })
                ->leftJoin('par_packaging_levels as t14', 't1.packaging_level_id', 't14.id')
                ->select(DB::raw("DISTINCT ON (1) t1.*,t2.name as sampling_site,t33.brand_name as product,t4.name as category_name,t5.name as dosage_form,t9.name as pms_program,
                         t9.start_date,t9.end_date,CONCAT_WS(' of ',t7.name,CONCAT(t1.sample_size,' ', t8.name)) as pack,CONCAT(t1.strength,t6.name) as strength_txt,
                         t51.name as product_form,t52.name as device_type,CASE WHEN t1.packaging_level_id = 1 THEN CONCAT((t1.sample_size), ' ', t8.name) WHEN t1.packaging_level_id = 2 THEN CONCAT((t1.sample_size*t1.secondary_sample_size), ' ', t88.name) ELSE CONCAT((t1.sample_size*t1.secondary_sample_size*t1.tertiary_sample_size), ' ', t888.name) END AS total_samples,t1.id as pms_plan_id, t10.name as region_name, t11.name as district_name, t11.id as district_id, t13.id as is_added, t14.name as packaging_level"));
            
            if (validateIsNumeric($program_implementation_id)) {
                $qry->where('t1.program_implementation_id', $program_implementation_id);
                $results = $qry->get();
            }
            else{
                $results = array();
            }
          
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

    public function getSurveillanceApplications(Request $request)
    {
        $module_id = $request->input('module_id');
        $section_id = $request->input('section_id');
        $sub_module_id = $request->input('sub_module_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $user_id = $this->user_id;
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        try {
            $assigned_stages = getAssignedProcessStages($user_id, $module_id);
            $qry = DB::table('tra_surveillance_applications as t1')
                ->join('tra_samplecollection_sites as t2', 't1.sample_site_id', '=', 't2.id')
                ->join('par_zones as t3', 't1.zone_id', '=', 't3.id')
                ->join('wf_processes as t4', 't1.process_id', '=', 't4.id')
                ->join('wf_workflow_stages as t5', 't1.workflow_stage_id', '=', 't5.id')
                ->join('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
                ->join('par_directorates as t7', 't1.directorate_id', '=', 't7.id')
                ->select(DB::raw("t1.id as active_application_id, t1.application_code, t4.module_id, t4.sub_module_id, t4.section_id, t2.name as premise_name,
                    t6.name as application_status, t3.name as zone, t7.name as directorate, t4.name as process_name, t5.name as workflow_stage, t5.is_general,
                    t2.*, t1.*,t2.name as sample_site"))
                ->where('t1.is_dismissed', '<>', 1);
            $is_super ? $qry->whereRaw('1=1') : $qry->whereIn('t1.workflow_stage_id', $assigned_stages);
            if (isset($section_id) && $section_id != '') {
                $qry->where('t1.section_id', $section_id);
            }
            if (isset($sub_module_id) && $sub_module_id != '') {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if (isset($workflow_stage_id) && $workflow_stage_id != '') {
                $qry->where('t1.workflow_stage_id', $workflow_stage_id);
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

    public function getDismissedSurveillanceApplications(Request $request)
    {
        $section_id = $request->input('section_id');
        $sub_module_id = $request->input('sub_module_id');
        try {
            $qry = DB::table('tra_dismissed_applications as t11')
                ->join('tra_surveillance_applications as t1', 't11.application_code', '=', 't1.application_code')
                ->join('tra_samplecollection_sites as t2', 't1.sample_site_id', '=', 't2.id')
                ->join('par_zones as t3', 't1.zone_id', '=', 't3.id')
                ->join('wf_processes as t4', 't1.process_id', '=', 't4.id')
                ->join('wf_workflow_stages as t5', 't1.workflow_stage_id', '=', 't5.id')
                ->join('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
                ->join('par_directorates as t7', 't1.directorate_id', '=', 't7.id')
                ->join('users as t8', 't11.dismissal_by', '=', 't8.id')
                ->join('par_applicationdismissal_reasons as t9', 't11.dismissal_reason_id', '=', 't9.id')
                ->join('sub_modules as t10', 't1.sub_module_id', '=', 't10.id')
                ->select(DB::raw("t1.*, t2.name as sample_site, t3.name as zone, t6.name as application_status,t10.name as sub_module_name,
                    t7.name as directorate,t1.id as active_application_id,t5.name as workflow_stage,t9.name as dismissal_reason,
                    t11.dismissal_date,CONCAT_WS(' ',decrypt(t8.first_name),decrypt(t8.last_name)) as author"));
            if (validateIsNumeric($section_id)) {
                $qry->where('t11.section_id', $section_id);
            }
            if (validateIsNumeric($sub_module_id)) {
                $qry->where('t11.sub_module_id', $sub_module_id);
            }
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
        return \response()->json($res);
    }

    public function getManagerApplicationsGeneric(Request $request)
    {
        $table_name = $request->input('table_name');
        $workflow_stage = $request->input('workflow_stage_id');
        try {
            $qry = DB::table('tra_surveillance_applications as t1')
                ->join('tra_samplecollection_sites as t2', 't1.sample_site_id', '=', 't2.id')
                ->join('par_zones as t3', 't1.zone_id', '=', 't3.id')
                ->join('wf_processes as t4', 't1.process_id', '=', 't4.id')
                ->join('wf_workflow_stages as t5', 't1.workflow_stage_id', '=', 't5.id')
                ->join('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
                ->join('par_directorates as t7', 't1.directorate_id', '=', 't7.id')
                ->leftJoin('tra_approval_recommendations as t8', function ($join) {
                    $join->on('t1.id', '=', 't8.application_id')
                        ->on('t1.application_code', '=', 't8.application_code');
                })
                ->leftJoin('par_approval_decisions as t9', 't8.decision_id', '=', 't9.id')
                ->select(DB::raw("t1.id as active_application_id, t1.application_code, t4.module_id, t4.sub_module_id, t4.section_id, t2.name as premise_name,
                    t6.name as application_status, t3.name as zone, t7.name as directorate, t4.name as process_name, t5.name as workflow_stage, t5.is_general,
                    t2.*, t1.*,t2.name as sample_site,t9.name as approval_status, t8.decision_id"))
                ->where('t1.workflow_stage_id', $workflow_stage);
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

    public function saveNewReceivingBaseDetails(Request $request)
    {
        $application_id = $request->input('application_id');
        $process_id = $request->input('process_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $section_id = $request->input('section_id');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $selected = $request->input('selected');
        $site_region_ids = json_decode($selected);
        $program_id = $request->input('program_id');
        $program_implementation_id = $request->input('program_implementation_id');
        $user_id = $this->user_id;
        $zone_id = 1;
        $directorate_id = 1;

        DB::beginTransaction();
        try {
            $samplesite_table = 'tra_pms_application_site_regions';
            $applications_table = 'tra_surveillance_applications';

            $where_app = array(
                'id' => $application_id
            );
            if (validateIsNumeric($application_id)) {//Edit
                //Application_edit
                $application_params = array(
                    'program_implementation_id' => $program_implementation_id,
                    'program_id' => $program_id
                );
                $app_details = array();
                if (recordExists($applications_table, $where_app)) {
                    $app_details = getPreviousRecords($applications_table, $where_app);
                    if ($app_details['success'] == false) {
                        return $app_details;
                    }
                    $app_details = $app_details['results'];
                    $res = updateRecord($applications_table, $where_app, $application_params, $user_id);
                    if ($res['success'] == false) {
                        return $res;
                    }
                }
                $application_code = $app_details[0]['application_code'];
                $ref_no = $app_details[0]['reference_no'];
       
                //add the selected sites regions
                deleteRecord('tra_pms_application_site_regions', ['application_code'=>$application_code]);
                //clean existing mapping 
                $site_region_data = [];
                foreach ($site_region_ids as $site_region_id) {
                    $site_region_data[] = array(
                        'application_code'=> $application_code,
                        'site_region_id' => $site_region_id
                    );
                }
                insertMultipleRecords('tra_pms_application_site_regions', $site_region_data);
              //DMS message
               initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $ref_no, $user_id);
            } else {//Create
                //Application_create
                $zone_code = getSingleRecordColValue('par_zones', array('id' => $zone_id), 'zone_code');
                $section_code = getSingleRecordColValue('par_sections', array('id' => $section_id), 'code');
                $sub_module_code = getSingleRecordColValue('par_sub_modules', array('id' => $sub_module_id), 'code');
                $codes_array = array(
                    'section_code' => $section_code,
                    'zone_code' => $zone_code,
                    'sub_module_code' => $sub_module_code
                );
                $view_id = generateApplicationViewID();
                $reference_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $process_id, $zone_id, $user_id, true);
                if ($reference_details['success'] == false) {
                    return \response()->json($reference_details);
                }
                $ref_no = $reference_details['tracking_no'];
                $application_code = generateApplicationCode($sub_module_id, $applications_table);
                $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
                if ($application_status->status_id == '') {
                    $res = array(
                        'success' => false,
                        'message' => 'Please set initial application status of the application!!'
                    );
                    return \response()->json($res);
                }
                $application_params = array(
                    'module_id' => $module_id,
                    'view_id' => $view_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id,
                    'application_code' => $application_code,
                    'zone_id' => $zone_id,
                    'directorate_id' => $directorate_id,
                    'process_id' => $process_id,
                    'workflow_stage_id' => $workflow_stage_id,
                    'reference_no' => $ref_no,
                    'stage_id' => 1,
                    'program_implementation_id' => $program_implementation_id,
                    'program_id' => $program_id,
                    'application_status_id' => $application_status->status_id
                );
                $res = insertRecord($applications_table, $application_params, $user_id);
                if ($res['success'] == false) {
                    return $res;
                }
                $application_id = $res['record_id'];

                //add the selected sites regions
                $site_region_data = [];
                foreach ($site_region_ids as $site_region) {
                    $site_region_data[] = array(
                        'application_code'=> $application_code,
                        'site_region_id' => $site_region
                    );
                }
                insertMultipleRecords('tra_pms_application_site_regions', $site_region_data);
                //insert registration table
                $reg_params = array(
                    'tra_surveillance_id' => $application_id,
                    'created_by' => $user_id
                );

               // createInitialRegistrationRecord('registered_surveillance', $applications_table, $reg_params, $application_id, 'reg_surveillance_id');

                //DMS message
               initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $ref_no, $user_id);

                //add to submissions table
                $submission_params = array(
                    'application_id' => $application_id,
                    'view_id' => $view_id,
                    'process_id' => $process_id,
                    'application_code' => $application_code,
                    'reference_no' => $ref_no,
                    'usr_from' => $user_id,
                    'usr_to' => $user_id,
                    'previous_stage' => $workflow_stage_id,
                    'current_stage' => $workflow_stage_id,
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id,
                    'application_status_id' => $application_status->status_id,
                    'urgency' => 1,
                    'applicant_id' => 0,
                    'remarks' => 'Initial save of the application',
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                    'created_by' => $user_id
                );
                DB::table('tra_submissions')
                    ->insert($submission_params); //directorate_id
            }
            DB::commit();
            $res['record_id'] = $application_id;
            $res['application_code'] = $application_code;
            $res['reference_no'] = $ref_no;

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    //prepare functions
    public function prepareStructuredPmsReceivingStage(Request $request)
    {
        $application_id = $request->input('application_id');
        try {
            $mainQry = DB::table('tra_surveillance_applications as t1')
                ->where('t1.id', $application_id);
            $pmsQry = clone $mainQry;
            $pmsQry->join('pms_program_implementationplan as t2', 't1.program_implementation_id', '=', 't2.id')
                ->join('pms_program_details as t3', 't2.program_id', '=', 't3.id')
                ->select('t2.*','t3.name as program_name','t3.description as program_description', 't3.*','t2.implementationstart_date', 't2.implementationend_date', 't2.program_implementation', 't3.id as pms_program_id', 't2.id as program_implementation_id', 't3.name as pms_program', 't1.sampling_site_id', 't1.district_id', 't1.region_id');
            // $sampleSiteQry = clone $mainQry;
            // $sampleSiteQry->leftJoin('tra_samplecollection_sites as t4', 't1.sample_site_id', '=', 't4.id');

            $mainResults = $mainQry->first();
            $pmsResults = $pmsQry->first();
            // $sampleSiteResults = $sampleSiteQry->first();
            $res = array(
                'success' => true,
                'mainResults' => $mainResults,
                'pmsResults' => $pmsResults,
                'sampleSiteResults' => [],
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function prepareStructuredPmsTCMeetingStage(Request $request)
    {
        $application_id = $request->input('application_id');
        $table_name = $request->input('table_name');
        $stage_data = getTableData('wf_workflow_stages', array('id'=>$request->workflow_stage_id));
        $stage_category_id = $stage_data->stage_category_id;
        try {
            $qry = DB::table($table_name . ' as t1')
                ->join('tc_meeting_applications as t2', function ($join) {
                    $join->on('t1.application_code', '=', 't2.application_code');
                })
                ->join('tc_meeting_details as t3', 't2.meeting_id', '=', 't3.id')
                ->select(DB::raw("t3.*"))
                ->where('t1.id', $application_id);

            if($stage_category_id == 6 || $stage_category_id == 7){
                $qry->whereRaw("(stage_category_id = 6 OR stage_category_id = 7)");
            }
            if($stage_category_id == 8 || $stage_category_id == 9){
                $qry->whereRaw("(stage_category_id = 8 OR stage_category_id = 9)");
            }
            
            $results = $qry->first();
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

    public function saveSurveillanceSampleDetails(Request $request)
    {
        $sampling_site_id = $request->input('sampling_site_id');
        $sample_collection_id = $request->input('sample_collection_id');
        $primary_container_id = $request->primary_container_id;
        $secondary_sample_size = $request->secondary_sample_size;
        $secondary_container_id = $request->secondary_container_id;
        $tertiary_container_id = $request->tertiary_container_id;
        $tertiary_sample_size = $request->tertiary_sample_size;
        $packaging_level_id = $request->packaging_level_id;
        $pms_plan_id = $request->pms_plan_id;
        $is_altenative = $request->is_altenative;
        $product_id = $request->product_id;
        $altenative_reason = $request->altenative_reason;

        if(isset($request->is_altenative)){
            $is_altenative = 1;
        }
        $post_data = $request->input();
        $user_id = $this->user_id;

        //collection_samples
        $sample_data = array(
            'collectionsite_storage_condition' => $request->collectionsite_storage_condition,
            'product_description' => $request->product_description,
            'expiry_date' => $request->expiry_date,
            'storage_condition_id' => $request->storage_condition_id,
            'seal_condition_id' => $request->seal_condition_id,
            'date_collected' => Carbon::now(),
            'container_id' => $request->container_id,
            'unit_pack' => $request->unit_pack,
            'packaging_unit_id' => $request->packaging_unit_id,
            'collection_samples' => $request->collection_samples,
            'planned_sample_size' => $request->sample_size,
            'batch_no' => $request->batch_no,
            'dosage_form_id' => $request->dosage_form_id,
            'is_collected' => 1,
            'sample_collector_id' => $user_id,
            'sampling_site_id' => $sampling_site_id,
            'primary_container_id' => $primary_container_id,
            'secondary_sample_size' => $secondary_sample_size,
            'secondary_container_id' => $secondary_container_id,
            'tertiary_container_id' => $tertiary_container_id,
            'tertiary_sample_size' => $tertiary_sample_size,
            'packaging_level_id' => $packaging_level_id,
            'is_altenative' => $is_altenative,
            'product_id' => $product_id,
            'altenative_reason' => $altenative_reason,
            'sample_collection_id' => $request->sample_collection_id, 
            'sample_id' => $request->sample_id, 
            'pms_plan_id' => $request->pms_plan_id, 
            'product' => $request->product, 
            'common_name' => $request->common_name, 
            'reference_no' => $request->reference_no, 
            'is_registered' => $request->is_registered, 
            'registration_no_shown' => $request->registration_no_shown, 
            'batch_no' => $request->batch_no, 
            'manufacturing_date' => $request->manufacturing_date,
            'device_type_id' => $request->device_type_id,  
            'discrepancies' => $request->discrepancies, 
            'product_name_present_external_check' => $request->product_name_present_external_check, 
            'inn_present_external_check' => $request->inn_present_external_check, 
            'strength_present_external_check' => $request->strength_present_external_check, 
            'batch_no_present_external_check' => $request->batch_no_present_external_check, 
            'manufacturing_date_present_external_check' => $request->manufacturing_date_present_external_check, 
            'expiry_date_present_external_check' => $request->expiry_date_present_external_check, 
            'manufacturer_details_present_external' => $request->manufacturer_details_present_external, 
            'product_name_present_primary_check' => $request->product_name_present_primary_check, 
            'unit_dose_primary_present_check' => $request->unit_dose_primary_present_check, 
            'strength_present_primary_check' => $request->strength_present_primary_check, 
            'batch_no_present_primary_check' => $request->batch_no_present_primary_check, 
            'manufacturing_date_present__primary_check' => $request->manufacturing_date_present__primary_check, 
            'expiry_date_present__primary_check' => $request->expiry_date_present__primary_check, 
            'has_different_manuacturer_details_in_primary' => $request->has_different_manuacturer_details_in_primary, 
            'manufacturer_details_primary_present' => $request->manufacturer_details_primary_present, 
            'has_leaflet_check' => $request->has_leaflet_check, 
            'leaflet_languages_composition_check' => $request->leaflet_languages_composition_check, 
            'has_different_manuacturer_details_in_leaflet' => $request->has_different_manuacturer_details_in_leaflet, 
            'manufacturer_details_leaflet_present' => $request->manufacturer_details_leaflet_present, 
            'has_different_storage_condition_in_leaflet' => $request->has_different_storage_condition_in_leaflet, 
            'storage_condition_in_leaflet' => $request->storage_condition_in_leaflet,
            'product_name_comments' => $request->product_name_comments,
            'inn_present_external_comments' => $request->inn_present_external_comments,
            'strength_present_external_comments' => $request->strength_present_external_comments,
            'batch_no_present_external_comments' => $request->batch_no_present_external_comments,
            'manufacturing_date_present_external_comments' => $request->manufacturing_date_present_external_comments,
            'expiry_date_present_external_comments' => $request->expiry_date_present_external_comments,
            'product_name_present_primary_comments' => $request->product_name_present_primary_comments,
            'unit_dose_primary_present_comments' => $request->unit_dose_primary_present_comments,
            'strength_present_primary_comments' => $request->strength_present_primary_comments,
            'batch_no_present_primary_comments' => $request->batch_no_present_primary_comments,
            'manufacturing_date_present__primary_comments' => $request->manufacturing_date_present__primary_comments,
            'expiry_date_present__primary_comments' => $request->expiry_date_present__primary_comments,
            'has_leaflet_comments' => $request->has_leaflet_comments,
            'leaflet_languages_composition_comments' => $request->leaflet_languages_composition_comments
        );

        $table_name = 'tra_sample_collection_log';
        $where = array('id'=>$sample_collection_id);
        try {
            if(validateIsNumeric($sample_collection_id)){
                $res = updateRecord($table_name, $where, $sample_data, $user_id);
            }else{
                $res = insertRecord($table_name, $sample_data);
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function surveillanceApplicationSamplesQry()
    {
        $qry = DB::table('tra_surveillance_sample_details as t1')
            ->join('tra_surveillance_applications as t2', 't1.application_id', '=', 't2.id')
            ->leftJoin('tra_manufacturers_information as t5', 't1.manufacturer_id', '=', 't5.id')
            ->leftJoin('par_storage_conditions as t6', 't1.storage_condition_id', '=', 't6.id')
            ->leftJoin('par_seal_types as t7', 't1.seal_condition_id', '=', 't7.id')
            // ->leftJoin('par_samplingreasons as t8', 't1.sampling_reason_id', '=', 't8.id')
            ->leftJoin('users as t9', 't1.sample_collector_id', '=', 't9.id')
            ->leftJoin('par_sample_application_types as t10', 't1.sample_application_id', '=', 't10.id')
            
            ->leftJoin('pms_program_plans as t11', 't1.pms_plan_id', '=', 't11.id')
            
            ->leftJoin('par_business_types as t12', 't11.sampling_site_id', '=', 't12.id')
            ->leftJoin('par_common_names as t13', 't11.product_id', '=', 't13.id')
            ->select(DB::raw("t1.*,t1.id as sample_id,  t12.name as sampling_site,t13.name as product,  t1.sample_name as brand_name,t5.name as manufacturer,t6.name as storage, 
                    t7.name as seal_condition,t8.name as sampling_reason,CONCAT_WS(' ',decrypt(t9.first_name),decrypt(t9.last_name)) as collector,t10.name as sample_type,
                    t2.section_id,t1.batch_no as batchno,t1.manufacturing_date as manufacturedate,t1.expiry_date as expirydate,t1.packaging_size as pack_size,t1.packaging_units_id as pack_unit_id, t11.*"));
        return $qry;
    }

    public function getPmsApplicationSamplesReceiving(Request $request)
    {
        $application_id = $request->input('application_id');
        $stage_id = $request->input('stage_id');
        try {
            $qry = $this->surveillanceApplicationSamplesQry()
                ->where('t1.application_id', $application_id);
            if (isset($stage_id) && is_numeric($stage_id)) {
                $qry->where('t1.stage_id', $stage_id);
            }
            $results = $qry->get();
            foreach ($results as $key => $result) {
                $results[$key]->dosage_form = getSingleRecordColValue('dosageform', array('id' => $result->dosage_form_id), 'name', 'lims_db');
                $results[$key]->product_form = getSingleRecordColValue('productform', array('id' => $result->product_form_id), 'name', 'lims_db');
                $results[$key]->device_type = getSingleRecordColValue('medicaldevices_types', array('id' => $result->device_type_id), 'name', 'lims_db');
                $results[$key]->class = getSingleRecordColValue('classification', array('id' => $result->classification_id), 'name', 'lims_db');
                $results[$key]->packaging_unit = getSingleRecordColValue('packaging_units', array('id' => $result->packaging_units_id), 'name', 'lims_db');
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getPmsApplicationSamplesLabStages(Request $request)
    {
        $application_id = $request->input('application_id');
        $analysis_type_id = $request->input('analysis_type_id');
        $recommendation_id = $request->input('recommendation_id');
        $stage_id = $request->input('stage_id');
        try {
            DB::enableQueryLog();
            $qry = $this->surveillanceApplicationSamplesQry()
                ->leftJoin('tra_pmslabresult_recommendations as t21', function ($join) use ($analysis_type_id) {
                    $join->on('t1.id', '=', 't21.sample_id')
                        ->where('t21.analysis_type_id', $analysis_type_id);
                })
                ->leftJoin('tra_sampleanalysis_requests as t24', function ($join) use ($analysis_type_id) {
                    $join->on('t2.application_code', '=', 't24.application_code')
                        ->where('t24.analysis_type_id', $analysis_type_id);
                })
                ->leftJoin('par_sampleanalysis_status as t25', 't24.status_id', '=', 't25.id');

            if ($analysis_type_id == 1) {//PIR
                $qry->leftJoin('par_pmsevaluation_decisions as t22', 't21.decision_id', '=', 't22.id');
            } else if ($analysis_type_id == 2) {//Screening
                $qry->leftJoin('par_pmsscreening_decisions as t22', 't21.decision_id', '=', 't22.id');
            } else if ($analysis_type_id == 3) {//TC Meeting
                $qry->leftJoin('par_pmstcmeeting_decisions as t22', 't21.decision_id', '=', 't22.id');
            } else if ($analysis_type_id == 4) {//Conformatory
                $qry->leftJoin('par_pmsanalysis_decisions as t22', 't21.decision_id', '=', 't22.id');
            }else if ($analysis_type_id == 6) {//Conformatory
                $qry->leftJoin('par_pmsevaluation_decisions as t22', 't21.decision_id', '=', 't22.id');
            }
            $qry->addSelect('t21.id as recomm_id','t22.name as sample_analysis_status', 't21.decision_id', 't21.comments as results_comments', 't22.name as recommendation')
                ->where('t1.application_id', $application_id);
            if (validateIsNumeric($stage_id)) {
                $qry->where('t1.stage_id', $stage_id);
            }
            if (validateIsNumeric($recommendation_id)) {
                $qry->where('t22.id', $recommendation_id);
            }
            $results = $qry->get();
           // print_r(DB::getQueryLog());
            
            foreach ($results as $key => $result) {
                $results[$key]->dosage_form = getSingleRecordColValue('par_product_forms', array('id' => $result->dosage_form_id), 'name');
                $results[$key]->product_form = getSingleRecordColValue('par_product_forms', array('id' => $result->product_form_id), 'name');
                $results[$key]->device_type = getSingleRecordColValue('par_product_types', array('id' => $result->device_type_id), 'name');
                $results[$key]->class = getSingleRecordColValue('par_classifications', array('id' => $result->classification_id), 'name');
                $results[$key]->packaging_unit = getSingleRecordColValue('par_packaging_units', array('id' => $result->packaging_units_id), 'name');
            }
            
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getPmsApplicationSamplesApprovalStages(Request $request)
    {
        $application_id = $request->input('application_id');
        $analysis_type_id = $request->input('analysis_type_id');
        $recommendation_id = $request->input('recommendation_id');
        $stage_id = $request->input('stage_id');
        if($analysis_type_id == 1){
            $recomm_table = 't21';
        }
        else if($analysis_type_id == 2){
            $recomm_table = 't22';
        }
        else if($analysis_type_id == 3){
            $recomm_table = 't23';
        }
        else if($analysis_type_id == 4){
            $recomm_table = 't14';
        }
        else if($analysis_type_id == 5){
            $recomm_table = 't14';
        }
       
        try {
            $qry = $this->surveillanceApplicationSamplesQry()
                ->join('tra_pmslabresult_recommendations as t21', function ($join) use ($analysis_type_id) {
                    $join->on('t1.id', '=', 't21.sample_id')
                        ->where('t21.analysis_type_id', 1);//PIR
                })
                ->leftJoin('tra_pmslabresult_recommendations as t22', function ($join) use ($analysis_type_id) {
                    $join->on('t1.id', '=', 't22.sample_id')
                        ->where('t22.analysis_type_id', 2);//SCREENING
                })//left join to take care of samples that wont go through lab screening
                ->leftJoin('tra_pmslabresult_recommendations as t23', function ($join) use ($analysis_type_id) {
                    $join->on('t1.id', '=', 't23.sample_id')
                        ->where('t23.analysis_type_id', 3);//TC MEETING
                })
                ->leftJoin('tra_pmslabresult_recommendations as t14', function ($join) use ($analysis_type_id) {
                    $join->on('t1.id', '=', 't14.sample_id')
                        ->where('t14.analysis_type_id', 4);//CONFORMATORY
                })
                ->leftJoin('tra_pmslabresult_recommendations as t15', function ($join) use ($analysis_type_id) {
                    $join->on('t1.id', '=', 't15.sample_id')
                        ->where('t15.analysis_type_id', 5);//APPROVAL
                })
                ->join('par_pmsevaluation_decisions as t16', 't21.decision_id', '=', 't16.id')
                ->leftJoin('par_pmsscreening_decisions as t17', 't22.decision_id', '=', 't17.id')
                ->leftJoin('par_pmstcmeeting_decisions as t18', 't23.decision_id', '=', 't18.id')
                ->leftJoin('par_pmsanalysis_decisions as t19', 't14.decision_id', '=', 't19.id')
                ->leftJoin('par_pmsapproval_decisions as t20', 't15.decision_id', '=', 't20.id')
                ->addSelect('t16.name as pir_recomm', 't17.name as screening_recomm', 't18.name as tcm_recomm', 't19.name as analysis_recomm', 't20.name as approval_recomm',
                    't21.decision_id as pir_decision_id', 't21.comments as pir_comments',
                    't22.decision_id as screening_decision_id', 't22.comments as screening_comments',
                    't23.id as tc_recomm_id', 't23.decision_id as tcm_decision_id', 't23.comments as tcm_comments',
                    't14.decision_id as analysis_decision_id', 't14.comments as analysis_comments',
                    't15.id as recomm_id', 't15.decision_id as decision_id', 't15.comments as comments','t2.application_code','t2.id as application_id')
                ->where('t1.application_id', $application_id);
            if (isset($stage_id) && is_numeric($stage_id)) {
                $qry->where('t1.stage_id', $stage_id);
            }
            
            if (isset($recommendation_id) && is_numeric($recommendation_id)) {
                $qry->where($recomm_table . '.decision_id', $recommendation_id);
            }
            $results = $qry->get();
            foreach ($results as $key => $result) {
                $results[$key]->dosage_form = getSingleRecordColValue('dosageform', array('id' => $result->dosage_form_id), 'name', 'lims_db');
                $results[$key]->product_form = getSingleRecordColValue('productform', array('id' => $result->product_form_id), 'name', 'lims_db');
                $results[$key]->device_type = getSingleRecordColValue('medicaldevices_types', array('id' => $result->device_type_id), 'name', 'lims_db');
                $results[$key]->class = getSingleRecordColValue('classification', array('id' => $result->classification_id), 'name', 'lims_db');
                $results[$key]->packaging_unit = getSingleRecordColValue('packaging_units', array('id' => $result->packaging_units_id), 'name', 'lims_db');
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getSurveillanceApplicationSamples(Request $request)
    {
        $application_id = $request->input('application_id');
        try {
            $qry = $this->surveillanceApplicationSamplesQry()
                ->where('t1.application_id', $application_id);
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getSurveillanceSampleDetails(Request $request)
    {
        $sample_id = $request->input('sample_id');
        try {
            $qry = $this->surveillanceApplicationSamplesQry()
                ->where('t1.id', $sample_id);
            $results = $qry->first();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getPmsApplicationMoreDetails(Request $request)
    {
        $application_id = $request->input('application_id');
        try {
            $mainQry = DB::table('tra_surveillance_applications as t1')
                ->where('t1.id', $application_id);
            $pmsQry = clone $mainQry;
            $pmsQry->join('pms_program_implementationplan as t2', 't1.program_implementation_id', '=', 't2.id')
                    ->join('pms_program_details as t3', 't2.program_id', '=', 't3.id')
                    ->select('t2.*','t3.name as program_name','t3.description as program_description', 't3.*','t2.implementationstart_date', 't2.implementationend_date', 't2.program_implementation', 't3.id as pms_program_id', 't2.id as program_implementation_id', 't3.name as pms_program', 't1.sampling_site_id', 't1.district_id', 't1.region_id');
                $sampleSiteQry = clone $mainQry;
                $sampleSiteQry->leftJoin('tra_samplecollection_sites as t4', 't1.sample_site_id', '=', 't4.id');
            /*
             $pmsQry->join('pms_program_implementationplan as t2', 't1.program_implementation_id', '=', 't2.id')
                ->join('pms_program_details as t3', 't2.program_id', '=', 't3.id')
                ->select('t2.*','t3.name as program_name','t3.description as program_description', 't3.*','t2.implementationstart_date', 't2.implementationend_date', 't2.program_implementation', 't3.id as pms_program_id', 't2.id as program_implementation_id', 't3.name as pms_program', 't1.sampling_site_id', 't1.district_id', 't1.region_id');
            $sampleSiteQry = clone $mainQry;
            $sampleSiteQry->leftJoin('tra_samplecollection_sites as t4', 't1.sample_site_id', '=', 't4.id');
            */


            $mainResults = $mainQry->first();
            $pmsResults = $pmsQry->first();
            $sampleSiteResults = $sampleSiteQry->first();
            $res = array(
                'success' => true,
                'mainResults' => $mainResults,
                'pmsResults' => $pmsResults,
                'sampleSiteResults' => $sampleSiteResults,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function savePmsPIRRecommendation(Request $request)
    {
        $sample_id = $request->input('sample_id');
        $decision_id = $request->input('decision_id');
        $analysis_type_id = $request->input('analysis_type_id');
        $comments = $request->input('comments');
        $table_name = 'tra_pmslabresult_recommendations';
        $user_id = $this->user_id;
        $params = array(
            'decision_id' => $decision_id,
            'comments' => $comments
        );
        try {
            $where = array(
                'sample_id' => $sample_id,
                'analysis_type_id' => $analysis_type_id
            );
            if (recordExists($table_name, $where)) {
                $params['altered_by'] = $user_id;
                $params['dola'] = Carbon::now();
                // $previous_data = getPreviousRecords($table_name, $where);
                // if ($previous_data['success'] == false) {
                //     return $previous_data;
                // }
                // $previous_data = $previous_data['results'];
                $res = updateRecord($table_name, $where, $params, $user_id);
            } else {
                $params['sample_id'] = $sample_id;
                $params['created_by'] = $user_id;
                $params['analysis_type_id'] = $analysis_type_id;
                $params['created_on'] = Carbon::now();
                $res = insertRecord($table_name, $params, $user_id);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getPmsSampleIngredients(Request $request)
    {
        $sample_id = $request->input('sample_id');
        try {
            $qry = DB::table('tra_pmssample_ingredients as t1')
                ->join('inclusion_reason as t5', 't1.inclusion_reason_id', '=', 't5.id')
                
                ->leftJoin('par_specification_types as t6', 't1.specification_id', '=', 't6.id')
                
                ->leftJoin('par_si_units as t7', 't1.si_unit_id', '=', 't7.id')
                ->leftJoin('par_ingredients_details as t8', 't1.ingredient_id', '=', 't8.id')
                ->select(DB::raw("t1.*,t5.name as inclusion_reason, t6.name as specification, t7.name as strength_txt, t8.name as ingredient"))
                ->where('t1.sample_id', $sample_id);
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
        return \response()->json($res);
    }

    public function getSampleLabAnalysisResults(Request $request)
    {
        $sample_id = $request->input('sample_id');
        $analysis_type_id = $request->input('analysis_type_id');
        try {
            $qry = DB::table('tra_survsample_analysis_results as t1')
                ->join('cost_elements as t2', 't1.test_parameter_id', '=', 't2.id')
                ->select('t1.*', 't2.name as test_parameter')
                ->where('t1.sample_id', $sample_id);
            if (isset($analysis_type_id) && is_numeric($analysis_type_id)) {
                $qry->where('t1.analysis_type_id', $analysis_type_id);
            }
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
        return \response()->json($res);
    }

    public function saveTCMeetingDetails(Request $request)
    {
        $id = $request->input('id');
        $application_code = $request->input('application_code');
        $meeting_name = $request->input('meeting_name');
        $meeting_desc = $request->input('meeting_desc');
        $date_requested = $request->input('date_requested');
        $meeting_time = $request->input('meeting_time');
        $meeting_venue = $request->input('meeting_venue');
        $user_id = $this->user_id;
        try {
            $params = array(
                'meeting_name' => $meeting_name,
                'meeting_desc' => $meeting_desc,
                'meeting_time' => $meeting_time,
                'meeting_venue' => $meeting_venue,
                'date_requested' => $date_requested
            );
            if (isset($id) && $id != '') {
                $params['altered_by'] = $user_id;
                DB::table('tc_meeting_details')
                    ->where('id', $id)
                    ->update($params);
            } else {
                $params['created_by'] = $user_id;
                $insert_res = insertRecord('tc_meeting_details', $params, $user_id);
                $id = $insert_res['record_id'];
                $app_meeting = array(
                    'application_code' => $application_code,
                    'meeting_id' => $id,
                    'created_by' => $user_id
                );
                insertRecord('tc_meeting_applications', $app_meeting, $user_id);
            }
            $res = array(
                'success' => true,
                'record_id' => $id,
                'message' => 'Details saved successfully!!'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function processReturnBackApplicationSubmission(Request $req){

        try{
            $user_id = $this->user_id;
            $application_id = $req->application_id;
            $sample_id = $req->sample_id;
            $stage_id = $req->sample_stage_id;
            $reason = $req->reason;
            //application details
            $application_details = DB::table('tra_surveillance_applications')->where('id',$application_id)->first();
            //submission details
            $submission_details = DB::table('tra_submissions')->where(array('application_id'=>$application_id,'current_stage'=>$application_details->workflow_stage_id,'isDone'=>0))->first();
            //update submission details
            $current_stage = $submission_details->current_stage;
            $previous_stage = $submission_details->previous_stage;
            unset($submission_details->id);
            unset($submission_details->altered_by);
            unset($submission_details->dola);
            unset($submission_details->released_by);
            unset($submission_details->date_released);
            unset($submission_details->date_submitted);
            unset($submission_details->isRead);
            unset($submission_details->isComplete);

            $submission_details->date_received = Carbon::now();
            $submission_details->created_by = $user_id;
            $submission_details->created_on = Carbon::now();
            $submission_details->remarks = $reason;
                   
              
            $submission_details->current_stage = $previous_stage;
            $submission_details->previous_stage = $current_stage;
            $res = insertRecord('tra_submissions', (array)$submission_details, $user_id);

            if($res['success']){
                DB::table('tra_surveillance_sample_details')
                    ->where('id',$sample_id)
                    ->update(array('stage_id'=>$stage_id));

            DB::commit();
            }else{
                  DB::rollBack();
                  $res = array(
                    'success' => false,
                    'message' => 'Updating submission table failed'
                );
                  exit();
            }

                $res = array(
                    'success' => true,
                    'message' => 'Submitted Back Successfully'
                ); 

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        echo json_encode($res);
        exit();
    }
    public function getPmsPremisesList(Request $request)
        {
        $premise_id = $request->input('premise_id');
        $region_id = $request->input('region_id');
        $section_id = $request->input('section_id');
        $filter = $request->input('filter');
        $whereClauses = array();
        $start = $request->start;
                $limit = $request->limit;

        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'name' :
                            $whereClauses[] = "t1.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'applicant_name' :
                            $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'premise_reg_no' :
                            $whereClauses[] = "t1.premise_reg_no like '%" . ($filter->value) . "%'";
                            break;
                        case 'permit_no' :
                            $whereClauses[] = "t2.permit_no like '%" . ($filter->value) . "%'";
                            break;
                            case 'region_name' :
                            $whereClauses[] = "t4.name like '%" . ($filter->value) . "%'";
                            break;
                            case 'district_name' :
                            $whereClauses[] = "t5.name like '%" . ($filter->value) . "%'";
                            break;
                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }
        try {
            $qry = DB::table('tra_registered_premises as t0')
                ->join('tra_premises_applications as tt1', 't0.tra_premise_id', 'tt1.id')
                ->join('tra_premises as t1', 'tt1.premise_id', 't1.id')
                ->leftJoin('tra_approval_recommendations as t2', 't1.permit_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_regions as t4', 't1.region_id', '=', 't4.id')
                ->leftJoin('par_regions as t5', 't1.district_id', '=', 't5.id')
                ->select( 't1.id as premise_id','t1.name', 't1.id as manufacturing_site_id','t1.*', 't2.permit_no', 't3.name as applicant_name',
                    't3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id',
                    't3.physical_address as app_physical_address', 't3.postal_address as app_postal_address','t4.name as region_name', 't5.name as district_name',
                    't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website');
            if (validateIsNumeric($section_id)) {
                $qry->where('t1.section_id', $section_id);
            }
            if ($filter_string != '') {
                $qry->whereRAW($filter_string);
            }
            if (validateIsNumeric($premise_id)) {
                $qry->where('t1.id', $premise_id);
            }if (validateIsNumeric($region_id)) {
                $qry->where('t1.region_id', $region_id);
            }
           // $results = $qry->get();

            $totalCount  = $qry->count();
                $records = $qry->skip($start*$limit)->take($limit)->get();
                $res = array('success'=>true, 
                                'results'=>$records,
                                'totalCount'=>$totalCount
                            );
           
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getGroupSampleAnalysisDetails(Request $req){


        
    }
    public function submitProgramsForApproval(Request $req)
    {
        try{
            $selected = $req->input('selected');
            $program_ids = json_decode($selected);
            $user_id = $this->user_id;
            $section_id = 8;
            $sub_module_id = 82;
            $module_id = 23;
            $zone_id = 1;
            $applicant_id = $user_id;
            $applications_table = 'tra_pmsprogram_applications';
            $res = array(
                        'success' => false,
                        'message' => 'No Program selected!!'
                    );
            
            //loop all selected programs
            foreach ($program_ids as $program_id) {
                $program_id = $program_id->program_id;
                //check if already initialized
                $check = recordExists($applications_table, ['program_id'=>$program_id]);

                if($check){
                    $res = array(
                        'success' => false,
                        'message' => 'Application already Submitted for approval!!'
                    );
                    return \response()->json($res);
                }
                DB::beginTransaction();
                //generate requested data 
                //get process id 
                $where = array(
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id
                );
                $process_id = DB::table('wf_processes')
                    ->where($where)
                    ->value('id');
                $workflow_stages =  DB::table('wf_processes as t1')
                        ->join('wf_workflows as t2', 't1.workflow_id', '=', 't2.id')
                        ->join('wf_workflow_stages as t3', function ($join) {
                            $join->on('t2.id', '=', 't3.workflow_id')
                                ->on('t3.stage_status', '=', DB::raw(1));
                        })
                        ->join('wf_workflow_interfaces as t4', 't3.interface_id', '=', 't4.id')
                        ->select('t4.viewtype', 't1.id as processId', 't1.name as processName', 't3.name as initialStageName', 't3.id as initialStageId', 't1.prodclass_category_id','t1.importexport_permittype_id','t1.premise_type_id')
                        ->where(['t1.module_id' => $module_id,'t1.sub_module_id' => $sub_module_id,'t1.section_id' => $section_id])
                        ->first();
                $workflow_stage_id = $workflow_stages->initialStageId;
                $section_code = getSingleRecordColValue('par_sections', array('id' => $section_id), 'code');
                $sub_module_code = getSingleRecordColValue('par_sub_modules', array('id' => $sub_module_id), 'code');
                $codes_array = array(
                            'section_code' => $section_code,
                            'sub_module_code' => $sub_module_code
                        );
                $view_id = generateApplicationViewID();
                $reference_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $process_id, $zone_id, $user_id, true);
                if ($reference_details['success'] == false) {
                    return \response()->json($reference_details);
                }
                $ref_no = $reference_details['tracking_no'];
                $application_code = generateApplicationCode($sub_module_id, $applications_table);
                $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
                if ($application_status->status_id == '') {
                    $res = array(
                        'success' => false,
                        'message' => 'Please set initial application status of the application!!'
                    );
                    return \response()->json($res);
                }
                $application_params = array(
                            'module_id' => $module_id,
                            'view_id' => $view_id,
                            'sub_module_id' => $sub_module_id,
                            'section_id' => $section_id,
                            'application_code' => $application_code,
                            'zone_id' => $zone_id,
                            'directorate_id' => 1,
                            'process_id' => $process_id,
                            'workflow_stage_id' => $workflow_stage_id,
                            'reference_no' => $ref_no,
                            'stage_id' => 1,
                            'program_id' => $program_id,
                            'application_status_id' => $application_status->status_id
                        );
                //save application details 
                $res = insertRecord($applications_table, $application_params);
                
                if(!$res['success']){
                    return \response()->json($res);
                }
                $application_id = $res['record_id'];
                //add to processing pipeline
                $submission_params = array(
                            'application_id' => $application_id,
                            'view_id' => $view_id,
                            'process_id' => $process_id,
                            'application_code' => $application_code,
                            'reference_no' => $ref_no,
                            'usr_from' => $user_id,
                            'usr_to' => $user_id,
                            'previous_stage' => $workflow_stage_id,
                            'current_stage' => $workflow_stage_id,
                            'module_id' => $module_id,
                            'sub_module_id' => $sub_module_id,
                            'section_id' => $section_id,
                            'application_status_id' => $application_status->status_id,
                            'urgency' => 1,
                            'applicant_id' => $applicant_id,
                            'remarks' => 'Initial save of the application',
                            'date_received' => Carbon::now(),
                            'created_on' => Carbon::now(),
                            'created_by' => $user_id
                        );
                insertRecord('tra_submissions', $submission_params);
            }
            //commit transaction
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollback();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            DB::rollback();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getWorkflowPmsPrograms(Request $req){
        $section_id = $req->input('section_id');
        $workflow_stage_id = $req->input('workflow_stage_id');
        $user_id = $this->user_id;
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        $assigned_stages = getAssignedProcessStages($user_id, 23);
        try {
            $qry = DB::table('pms_program_details as t1')
                ->join('par_sections as t2', 't1.section_id', '=', 't2.id')
                ->join('tra_pmsprogram_applications as t4', 't1.id', '=', 't4.program_id')
                ->leftJoin('par_system_statuses as t5', 't4.application_status_id', '=', 't5.id')
                ->leftJoin('tra_pmsprogram_approvals as t6', 't4.application_code', '=', 't6.application_code')
                ->join('tra_submissions as t7', function ($join) {
                    $join->on('t4.application_code', '=', 't7.application_code')
                        ->where('is_done', 0);
                })
                ->leftJoin('wf_workflow_stages as t12', 't7.current_stage', 't12.id')
                ->leftJoin('tra_evaluation_recommendations as t13', function ($join) use($workflow_stage_id) {
                    $join->on('t4.application_code', '=', 't13.application_code')
                        ->on('t12.stage_category_id', '=', 't13.stage_category_id')
                        ->where('t7.current_stage', $workflow_stage_id);
                })
                ->select('t4.*','t1.*', 't2.name as section_name', 't1.name as pms_program','t1.id as program_id',  't1.id as pms_program_id', 't5.name as status','t5.id as status_id','t4.id as active_application_id','t12.stage_category_id','t13.id as recommendation_record_id','t13.recommendation_id','t13.remarks','t6.decision_id', 't6.approval_remarks', 't6.id as approval_id','t6.sign_file','t6.approval_date');
            //check access rights
            if(!$is_super){
                $qry->whereIn('t1.workflow_stage_id', $assigned_stages);
            }
            if(validateIsNumeric($workflow_stage_id)){
                $qry->where('t7.current_stage', $workflow_stage_id);
            }
            if (validateIsNumeric($section_id)) {
                $qry->where('t1.section_id', $section_id);
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
        return response()->json($res);
    }
    public function onSavePmsProgramApprovalDecision(Request $req)
    {
        $data = $req->All();
        $user_id = $this->user_id;
        //fetch unset data
        $approval_id = $data['approval_id'];
        $module_id = $data['module_id'];
        //unset data
        unset($data['approval_id']);
        unset($data['_token']);
        //add approver
        $data['approved_by'] = $user_id;
        if($module_id == 11){
            $table_name = 'tra_facilityschedule_approvals';
            $app_table = 'tra_facilityschedule_applications';
            unset($data['program_id']);
        }else{
            $table_name = 'tra_pmsprogram_approvals';
            $app_table = 'tra_pmsprogram_applications';
            unset($data['schedule_id']);
        }
        try {
            //check if its update
            if(validateIsNumeric($approval_id)){
                //update log
                $data['dola'] = Carbon::now();
                $data['altered_by'] = $user_id;
                $res = updateRecord($table_name,['id'=>$approval_id], $data);
                //update status
                //update application status
                if($data['decision_id'] == 1){
                    $status_data = ['application_status_id' => 6];
                }else{
                    $status_data = ['application_status_id' => 3];
                }
                $where = array('application_code'=>$data['application_code']);
                updateRecord($app_table, $where, $status_data);
                
            }else{
               //log approval
                $res = insertRecord($table_name, $data); 
            }
            //update application status
            if($data['decision_id'] == 1){
                $status_data = ['application_status_id' => 6];
            }else{
                $status_data = ['application_status_id' => 3];
            }
            $where = array('application_code'=>$data['application_code']);
            updateRecord($app_table, $where, $status_data);
            //notify any one
            //response
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getPmsSamplingSitesList(Request $request)
    {
        $program_id = $request->input('program_id');
        $program_implementation_id = $request->input('program_implementation_id');
        $region_id = $request->input('region_id');
        $district_id = $request->input('district_id');
        $pms_plan_id = $request->input('pms_plan_id');
        
        try {

            $qry = DB::table('tra_pms_sampling_sites as t1')
                ->join('tra_premises as t2', 't1.premise_id', '=', 't2.id')
                ->leftJoin('par_regions as t3', 't2.region_id', '=', 't3.id')
                ->leftJoin('par_districts as t4', 't2.district_id', '=', 't4.id')
                ->leftJoin('par_packaging_units as t5', 't1.primary_container_id', '=', 't5.id')
                ->leftJoin('par_packaging_units as t6', 't1.secondary_container_id', '=', 't6.id')
                ->leftJoin('par_packaging_units as t7', 't1.tertiary_container_id', '=', 't7.id')
                ->leftJoin('par_packaging_levels as t8', 't1.packaging_level_id', '=', 't8.id')
    
                ->select('t1.*','t2.physical_address', 't2.postal_address','t2.name','t2.telephone as telephone_no', 't2.email', 't3.name as region','t4.name as district', DB::raw("CONCAT(t1.sample_size,' ',t5.name) as primary_units, CONCAT(t1.sample_size*t1.collection_samples,' ',t5.name) as total_samples"), 't1.id as sampling_site_id','t8.name as packaging_level');

            if(validateIsNumeric($pms_plan_id)){
                $qry->where('t1.pms_plan_id',$pms_plan_id);
            }
            // if(validateIsNumeric($program_implementation_id)){
            //     $qry->where('t1.program_implementation_id',$program_implementation_id);
            // }
            // if(validateIsNumeric($region_id)){
            //     $qry->where('t2.region_id',$region_id);
            // }
                
            // if(validateIsNumeric($district_id)){
            //     $qry->where('t2.district_id',$district_id);
            // }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'Records fetched successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getManagerGenericPmsProgramPlans(Request $request)
    {
        $program_implementation_id = $request->input('program_implementation_id');
        $section_id = $request->input('section_id');
        $module_id = $request->input('module_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $user_id = $this->user_id;
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        $assigned_stages = getAssignedProcessStages($user_id, $module_id);
        try {
            $qry = DB::table('tra_submissions as t1')
                    ->leftJoin('tra_surveillance_applications as t2', 't1.application_code', 't2.application_code')
                    ->leftJoin('pms_program_details as t3', 't2.program_id', 't3.id')
                    ->leftJoin('tra_pms_application_site_regions as t11', 't2.application_code', 't11.application_code')
                    ->leftJoin('pms_program_plans as t4', 't11.site_region_id', 't4.id')
                    ->leftJoin('pms_program_samplingsites as t5', 't4.sampling_site_id', 't5.id')
                    ->leftJoin('tra_product_information as p5', 't4.product_id', 'p5.id')
                    ->leftJoin('tra_product_applications as a5', 't4.product_id', 'a5.product_id')
                    ->leftJoin('par_common_names as t6', 'p5.common_name_id', '=', 't6.id')
                    ->leftJoin('par_containers as t7', 't4.container_id', '=', 't7.id')

                    ->leftJoin('par_packaging_units as t8', 't4.primary_container_id', 't8.id')
                    ->leftJoin('par_packaging_units as tt8', 't4.secondary_container_id', 'tt8.id')
                    ->leftJoin('par_packaging_units as ttt8', 't4.tertiary_container_id', 'ttt8.id')

                    ->leftJoin('par_regions as t9', 't4.region_id', '=', 't9.id')
                    ->leftJoin('par_districts as t10', 't4.district_id', '=', 't10.id')
                    ->leftJoin('par_si_units as t12', 't4.si_unit_id', 't12.id')
                    ->leftJoin('par_business_types as t13', 't4.sampling_site_id', 't13.id')
                    ->leftJoin('par_dosage_forms as t14', 't4.dosage_form_id', 't14.id')
                    ->leftJoin('par_prodclass_categories as t15', 'a5.prodclass_category_id', 't15.id')
                    ->leftJoin('tra_surveillance_sample_details as t16', function ($join) {
                        $join->on('t4.id', '=', 't16.pms_plan_id')
                            ->limit(1);
                    })
                    //assignments to collectots tra_pms_sampling_sites
                    ->leftJoin('tra_sample_collectors_assignments as t17', function ($join) {
                        $join->on('t4.id', '=', 't17.pms_plan_id')
                            ->on('t2.id', '=', 't17.application_id')
                            ->limit(1);
                    })

                     ->select(DB::raw("DISTINCT ON (1) t11.id,CONCAT(t4.sample_size, ' ', t8.name) as primary_units,CONCAT((select sum(y.sample_size * y.collection_samples) from tra_pms_sampling_sites y where y.pms_plan_id = t4.id), ' ', t8.name) as total_samples, (select sum(t.collection_samples) from tra_pms_sampling_sites t where t.pms_plan_id = t4.id) as total_collection_samples, t1.*,t2.program_implementation_id, t2.program_id, p5.brand_name as product, t3.name as pms_program, t3.start_date as programstart_date,t3.end_date as programend_date, CONCAT(t4.strength,t12.name) as strength_txt, t7.name as container_name,t4.id as pms_plan_id, t9.name as region_name, t10.name as district_name, t10.id as district_id, t13.name as sampling_site, t14.name as dosage_form, t15.name as category_name, t4.id, CASE WHEN t16.id IS NULL THEN false else true end as plan_is_assigned, CASE WHEN t17.id IS NULL THEN false else true end as collector_assigned"))
                     ->where('t2.is_assigned', 0)
                     ->where('is_done', 0);
//product
            if(validateIsNumeric($workflow_stage_id)){
                $qry->where('t1.current_stage', $workflow_stage_id);
            }
            if(!$is_super){
                $qry->whereIn('t1.workflow_stage_id', $assigned_stages);
                $qry->whereNull('t1.usr_to');
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
        return response()->json($res);
    }
    public function getProgramImplementationDetails(Request $req){
        $program_implementation_id = $req->input('program_implementation_id');
        $program_id = $req->input('program_id');
        try {
            $qry = DB::table('pms_program_details as t1')
                    ->leftJoin('pms_program_implementationplan as t2', 't1.id', 't2.program_id')
                    ->select('t1.name as program_name','t1.description as program_description', 't1.start_date as programstart_date', 't1.end_date as programend_date', 't2.program_implementation as implementation_name', 't2.implementationstart_date', 't2.implementationend_date')
                    ->where('t2.id', $program_implementation_id);

            if(validateIsNumeric($program_id)){
                $qry->where('t1.id', $program_id);
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
        return response()->json($res);
    }
    public function getSamplingRegions(Request $req)
    {
        $user_id = $this->user_id;
        $workflow_stage_id = $req->workflow_stage_id;
        try {
            $qry = DB::table('tra_pms_sampling_sites as tt7')
                    ->join('pms_program_plans as tt3', 'tt7.pms_plan_id', 'tt3.id')
                    ->join('tra_surveillance_sample_details as tt1', 'tt1.sampling_site_id', 'tt7.id')
                    ->leftJoin('tra_sample_collectors_assignments as t2', 'tt1.pms_plan_id', 't2.pms_plan_id')
                    ->leftJoin('par_regions as t3', 'tt3.region_id', 't3.id')
                    ->select(DB::raw("DISTINCT ON (t3.id) t3.*"))
                    ->where('t2.user_id', $user_id);

            if(validateIsNumeric($workflow_stage_id)){
                $qry->where('tt1.workflow_stage_id', $workflow_stage_id);
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
        return response()->json($res);
    }
    public function getSampleCollectionList(Request $req){
        $pms_plan_id = $req->pms_plan_id;
        $user_id = $this->user_id;
        $application_code = $req->application_code;
        $workflow_stage_id = $req->workflow_stage_id;
        $region_id = $req->region_id;

        //district 1
        //all sites in that district is_altenative
        try {
            $qry = DB::table('tra_pms_sampling_sites as tt7')
                    ->join('pms_program_plans as tt3', 'tt7.pms_plan_id', 'tt3.id')
                    ->join('tra_surveillance_sample_details as tt1', 'tt1.sampling_site_id', 'tt7.id')
                    ->leftJoin('tra_sample_collectors_assignments as t2', 'tt1.pms_plan_id', 't2.pms_plan_id')
                    ->leftJoin('tra_product_applications as a4', 'tt3.product_id', 'a4.product_id')
                    ->leftJoin('tra_product_information as p4', 'tt3.product_id', 'p4.id')
                    ->leftJoin('par_dosage_forms as t4', 'tt3.dosage_form_id', 't4.id')
                    ->leftJoin('par_common_names as t5', 'p4.common_name_id', 't5.id')
                    ->leftJoin('par_si_units as t6', 'tt3.si_unit_id', '=', 't6.id')
                    ->leftJoin('tra_sample_collection_log as t7', 'tt7.id', 't7.sampling_site_id')
                    ->leftJoin('tra_premises as t8', 'tt7.premise_id', 't8.id')
                    ->leftJoin('par_regions as t9', 't8.region_id', 't9.id')
                    ->leftJoin('par_districts as t10', 't8.district_id', 't10.id')
                    ->leftJoin('par_containers as t11', 'tt7.container_id', 't11.id')
                    ->leftJoin('par_packaging_units as t12', 'tt7.primary_container_id', 't12.id')
                    ->leftJoin('par_packaging_units as tt12', 'tt7.secondary_container_id', 'tt12.id')
                    ->leftJoin('par_packaging_units as ttt12', 'tt7.tertiary_container_id', 'ttt12.id')

                    //processing tra_pmsminilab_screening_results
                    ->leftJoin('tra_pir_recommendation as t13', function ($join) use($pms_plan_id) {
                        $join->on('tt7.pms_plan_id', '=', 't13.pms_plan_id')
                            ->on('t7.sampling_site_id', '=', 't13.sampling_site_id');
                    })
                    ->leftJoin('wf_workflow_stages as t14', 'tt1.workflow_stage_id', 't14.id')
                    ->leftJoin('tra_registered_products as t15', 'a4.id', 't15.tra_product_id')
                    ->leftJoin('tra_pmsminilab_screening_results as t16', 't7.id', 't16.sample_collection_id')
                    ->select(DB::raw("DISTINCT ON (tt7.id) CONCAT(tt3.strength,t6.name) as strength_txt, CONCAT(tt7.sample_size, ' ', t12.name) as primary_units"), 't4.name as dosage_form','p4.brand_name as product','tt7.collection_samples','tt7.unit_pack','t8.id as premise_id','t8.physical_address', 't8.postal_address','t8.name','t8.telephone as telephone_no','t8.email', 't9.name as region','t10.name as district', 't11.name as container_name', 't12.name as packaging_unit','tt1.application_code','tt7.packaging_unit_id', 'tt1.reference_no', 'tt3.program_id', 'tt3.program_implementation_id', 'tt7.container_id','tt1.pms_plan_id', 'tt1.application_code', 'tt1.id as application_id', 'tt7.id as record_id','tt1.id', 'tt1.module_id', 'tt1.sub_module_id', 't13.id as pir_recommendation_id','t13.decision_id as pir_decision_id','t13.comments as pir_comment', 't14.stage_category_id','tt7.id as sampling_site_id','t7.is_collected', 'tt7.primary_container_id','tt7.secondary_container_id','tt7.tertiary_container_id','tt7.secondary_sample_size', 'tt7.tertiary_sample_size', 'tt7.packaging_level_id','tt7.sample_size','tt7.collection_samples', 't15.registration_no as certificate_no', 't15.registration_date', 'tt7.is_altenative','tt3.region_id', 't2.id as collector_assignment_id', 't16.decision_id as is_screened')

                    // ->select(DB::raw("DISTINCT ON (tt7.id) CONCAT(tt3.strength,t6.name) as strength_txt, CONCAT(tt7.collection_samples, ' ', t12.name) as primary_units, CONCAT(tt7.secondary_sample_size, ' ', tt12.name) as secondary_units, CONCAT(tt7.tertiary_sample_size, ' ', ttt12.name) as tertiary_units, CASE WHEN tt7.packaging_level_id = 1 THEN CONCAT((tt7.collection_samples), ' ', t12.name) WHEN tt7.packaging_level_id = 2 THEN CONCAT((tt7.collection_samples*tt7.secondary_sample_size), ' ', tt12.name) ELSE CONCAT((tt7.collection_samples*tt7.secondary_sample_size*tt7.tertiary_sample_size), ' ', ttt12.name) END as total_samples"), 't4.name as dosage_form','p4.brand_name as product','tt7.collection_samples','tt7.unit_pack','t8.id as premise_id','t8.physical_address', 't8.postal_address','t8.name','t8.telephone as telephone_no','t8.email', 't9.name as region','t10.name as district', 't11.name as container_name', 't12.name as packaging_unit','tt1.application_code','tt7.packaging_unit_id', 'tt1.reference_no', 'tt3.program_id', 'tt3.program_implementation_id', 'tt7.container_id','tt1.pms_plan_id', 'tt1.application_code', 'tt1.id as application_id', 'tt7.id as record_id','tt1.id', 'tt1.module_id', 'tt1.sub_module_id', 't13.id as pir_recommendation_id','t13.decision_id as pir_decision_id','t13.comments as pir_comment', 't14.stage_category_id','tt7.id as sampling_site_id','t7.is_collected', 'tt7.primary_container_id','tt7.secondary_container_id','tt7.tertiary_container_id','tt7.secondary_sample_size', 'tt7.tertiary_sample_size', 'tt7.packaging_level_id','tt7.collection_samples as sample_size','t15.registration_no as certificate_no', 't15.registration_date', 'tt7.is_altenative','tt3.region_id', 't2.id as collector_assignment_id', 't16.decision_id as is_screened')

                    // ->where('tt7.pms_plan_id', $pms_plan_id)
                    // ->where('tt1.application_code', $application_code);
                    ->where('t2.user_id', $user_id);

            if(validateIsNumeric($workflow_stage_id)){
                $qry->where('tt1.workflow_stage_id', $workflow_stage_id);
            }
             if(validateIsNumeric($region_id)){
                $qry->where('tt3.region_id', $region_id);
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
        return response()->json($res);
    }
    public function prepareSampleCollectionPnl(Request $req){
        $application_code = $req->input('application_code');
        $workflow_stage_id = $req->input('workflow_stage_id');
        try {
            $qry = DB::table('tra_surveillance_sample_details as t1')
                    ->where('t1.application_code', $application_code);

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
        return response()->json($res);
    }
     public function getSampleLabResults(Request $req){
        $workflow_stage_id = $req->workflow_stage_id;
        $user_id = $this->user_id;
        $application_code = $req->application_code;
        try {
              $qry = DB::table('tra_pms_sampling_sites as tt7')
                    ->join('pms_program_plans as tt3', 'tt7.pms_plan_id', 'tt3.id')
                    ->join('tra_surveillance_sample_details as tt1', 'tt7.pms_plan_id', 'tt3.id')
                    ->join('tra_sample_collectors_assignments as t2', 'tt7.pms_plan_id', 't2.pms_plan_id')
                    ->join('par_dosage_forms as t4', 'tt3.dosage_form_id', 't4.id')
                    ->join('tra_product_applications as a5', 'tt3.product_id', 'a5.product_id')
                    ->join('tra_product_information as p5', 'tt3.product_id', 'p5.id')
                    ->leftJoin('tra_registered_products as r5', 'a5.id', 'r5.tra_product_id')
                    ->leftJoin('par_common_names as t5', 'p5.common_name_id', 't5.id')
                    ->leftJoin('par_si_units as t6', 'tt3.si_unit_id', '=', 't6.id')
                    ->join('tra_sample_collection_log as t7', 'tt7.id', 't7.sampling_site_id')
                    ->join('tra_premises as t8', 'tt7.premise_id', 't8.id')
                    ->leftJoin('par_regions as t9', 't8.region_id', 't9.id')
                    ->leftJoin('par_districts as t10', 't8.district_id', 't10.id')
                    ->leftJoin('par_packaging_units as t12', 'tt7.primary_container_id', 't12.id')
                    ->leftJoin('par_packaging_units as tt12', 'tt7.secondary_container_id', 'tt12.id')
                    ->leftJoin('par_packaging_units as ttt12', 'tt7.tertiary_container_id', 'ttt12.id')

                    //processing
                    ->leftJoin('tra_pir_recommendation as t13', function ($join) {
                        $join->on('tt7.pms_plan_id', '=', 't13.pms_plan_id')
                            ->on('t7.sampling_site_id', '=', 't13.sampling_site_id');
                    })
                    //lab results
                    ->leftJoin('tra_survsample_analysis_results as t18', function ($join) {
                        $join->on('t18.sample_application_id', 'tt1.id');
                    })
                    ->leftJoin('wf_workflow_stages as t14', 'tt1.workflow_stage_id', 't14.id')
                    ->leftJoin('tra_pms_final_recommendation as t16', function ($join) {
                        $join->on('tt7.pms_plan_id', '=', 't16.pms_plan_id')
                            ->on('t7.sampling_site_id', '=', 't16.sampling_site_id');
                    })
                    ->leftJoin('par_pms_final_recommendations as t17', 't16.decision_id', 't17.id')

                    ->select(DB::raw("DISTINCT ON (tt7.id) CONCAT(tt3.strength,t6.name) as strength_txt, CONCAT(tt7.collection_samples, ' ', t12.name) as primary_units, CONCAT(tt7.secondary_sample_size, ' ', tt12.name) as secondary_units, CONCAT(tt7.tertiary_sample_size, ' ', ttt12.name) as tertiary_units, CASE WHEN tt7.packaging_level_id = 1 THEN CONCAT((tt7.collection_samples), ' ', t12.name) WHEN tt7.packaging_level_id = 2 THEN CONCAT((tt7.collection_samples*tt7.secondary_sample_size), ' ', tt12.name) ELSE CONCAT((tt7.collection_samples*tt7.secondary_sample_size*tt7.tertiary_sample_size), ' ', ttt12.name) END as total_samples"), 't4.name as dosage_form','t5.name as product','tt7.collection_samples','tt7.unit_pack','t8.id as premise_id','t8.physical_address', 't8.postal_address','t8.name','t8.telephone as telephone_no','t8.email', 't9.name as region','t10.name as district', 'r5.registration_no as certificate_no', 'tt1.reference_no', 'tt3.program_id', 'tt3.program_implementation_id','tt1.pms_plan_id', 'tt1.application_code', 'tt1.id as application_id', 'tt7.id as record_id','tt1.id', 'tt1.module_id', 'tt1.sub_module_id', 't13.id as pir_recommendation_id','t13.decision_id as pir_decision_id','t13.comments as pir_comment', 't14.stage_category_id','tt7.id as sampling_site_id','tt7.is_altenative','t7.is_collected','t16.id as pms_recommendation_id','t16.decision_id as pms_decision_id','t16.comments as pms_comment', 't17.name as pms_decision', 't18.id as has_results');

                    // ->where('tt1.workflow_stage_id', $workflow_stage_id);

            // dd($qry->toSql());
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
        return response()->json($res);
    }
    public function getPMSPlanTestParameters(Request $req){
        $pms_plan_id = $req->input('pms_plan_id');
        $sampling_site_id = $req->input('sampling_site_id');
        try {
            $qry = DB::table('tra_sample_test_requests as t1')
                    ->leftJoin('par_test_parameters as t2', 't1.test_parameter_id', 't2.id')
                    ->leftJoin('par_analysis_techniques as t3', 't1.analysis_technique_id', 't3.id')
                    ->select('t1.*', 't2.name as test_parameter','t3.name as analysis_technique')
                    ->where('t1.sample_id', $pms_plan_id)
                    ->where('t1.sampling_site_id', $sampling_site_id);

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
        return response()->json($res);
    }
    public function saveSurveillanceFinalRecommendation(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = $post_data['table_name'];
            $id = $post_data['id'];
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['sample_id']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);
            $unsetData = $req->input('unset_data');
            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }

            $table_data = $post_data;
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            $res = array();
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    // $previous_data = getPreviousRecords($table_name, $where);
                    // if ($previous_data['success'] == false) {
                    //     return $previous_data;
                    // }
                    // $previous_data = $previous_data['results'];
                    $res = updateRecord($table_name, $where, $table_data, $user_id);
                }
            } else {
                $res = insertRecord($table_name, $table_data, $user_id);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getCollectedSamplesDetails(Request $req){
        $sampling_site_id = $req->input('sampling_site_id');
        try {
            $qry = DB::table('tra_sample_collection_log as t1')
                    ->leftJoin('par_dosage_forms as t2', 't1.dosage_form_id', 't2.id')
                    ->leftJoin('par_containers as t3', 't1.container_id', 't3.id')
                    ->leftJoin('tra_pms_sampling_sites as t33', 't1.sampling_site_id', 't33.id')
                    ->leftJoin('pms_program_plans as t4', 't33.pms_plan_id', 't4.id')
                    ->leftJoin('users as t5', 't1.sample_collector_id', 't5.id')
                    ->leftJoin('par_packaging_units as t6', 't1.primary_container_id', 't6.id')
                    ->leftJoin('par_packaging_units as tt6', 't1.secondary_container_id', 'tt6.id')
                    ->leftJoin('par_packaging_units as ttt6', 't1.tertiary_container_id', 'ttt6.id')
                    ->leftJoin('tra_pmsminilab_screening_results as i1', 't1.id', 'i1.sample_collection_id');

            $altenative_products = clone $qry;
            //original sample products  
            $qry->join('tra_product_applications as a7', function ($join) {
                        $join->on('t4.product_id', 'a7.product_id')
                            ->whereNull('t1.is_altenative');
                    })
                    ->leftJoin('tra_product_information as p7', 't4.product_id', 'p7.id')
                    ->leftJoin('par_common_names as t7', 'p7.common_name_id', 't7.id')
                    ->leftJoin('tra_surveillance_sample_details as t8', 't33.pms_plan_id', 't8.pms_plan_id')
                    ->select('t33.id','t4.*','t1.*', 't3.name as container_name','t2.name as dosage_form',DB::raw("CONCAT(decryptval(t5.first_name,".getDecryptFunParams()."),' ',decryptval(t5.last_name,".getDecryptFunParams().")) as collected_by, CONCAT(t33.sample_size, ' ', t6.name) as primary_units, t33.collection_samples as planned_sample_size, CONCAT(t1.collection_samples*t4.sample_size, ' ', t6.name) as total_samples, CASE WHEN i1.decision_id IS NULL THEN 3 WHEN i1.decision_id > 0 THEN i1.decision_id END is_screened"), 't6.name as packaging_unit', 'p7.brand_name as product', 't8.reference_no', 't8.reference_no as certificate_no','t1.id as sample_collection_id')
                    ->where('t1.sampling_site_id', $sampling_site_id);

            //Altenative sample products
            $altenative_products->join('tra_product_applications as a7', function ($join) {
                        $join->on('t1.product_id', 'a7.product_id')
                            ->whereNotNull('t1.is_altenative');
                    })
                    ->leftJoin('tra_product_information as p7', 't1.product_id', 'p7.id')
                    ->leftJoin('par_common_names as t7', 'p7.common_name_id', 't7.id')
                    ->leftJoin('tra_surveillance_sample_details as t8', 't33.pms_plan_id', 't8.pms_plan_id')
                    ->select('t33.id','t4.*','t1.*', 't3.name as container_name','t2.name as dosage_form',DB::raw("CONCAT(decryptval(t5.first_name,".getDecryptFunParams()."),' ',decryptval(t5.last_name,".getDecryptFunParams().")) as collected_by, CONCAT(t33.sample_size, ' ', t6.name) as primary_units,CONCAT(t1.collection_samples*t4.sample_size, ' ', t6.name) as total_samples, t33.collection_samples as planned_sample_size, CASE WHEN i1.decision_id IS NULL THEN 3 WHEN i1.decision_id > 0 THEN i1.decision_id END is_screened"), 't6.name as packaging_unit', 'p7.brand_name as product', 't8.reference_no', 't8.reference_no as certificate_no','t8.application_code','t1.id as sample_collection_id', 'p7.brand_name as product_name', 't1.product_id')
                    ->where('t1.sampling_site_id', $sampling_site_id);

            //merge results
            $original_samples = $qry->get();
            $original_samples = $original_samples->merge($altenative_products->get());

            $results = $qry->get();
            $res = array(
                    'success' => true,
                    'results' => $original_samples,
                    'message' => 'All is well'
                );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function updatePMSProgramDetails(Request $req){
        $program_id = $req->input('program_id');
        $start_date = $req->input('start_date');
        $update_reason = $req->input('update_reason');
        $end_date = $req->input('end_date');
        $where = array('id' => $program_id);
        //get program details
        DB::beginTransaction();
        $record = getSingleRecord('pms_program_details', $where);
        if(!isset($record->id)){
            $res = array(
                    'success' => false,
                    'message' => 'Program not Found'
                );
            DB::rollback();
            return response()->json($res);
        }
        $update_data = array(
            'start_date' => $start_date,
            'end_date' => $end_date
        );
        $log_update = array(
            'from_start_date' => $record->start_date,
            'from_end_date' => $record->end_date,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'update_reason' => $update_reason,
            'program_id' =>$program_id
        );
        try {
           
           //update program
            $res = updateRecord('pms_program_details', $where, $update_data);
            if(!$res['success']){
                 DB::rollback();
                return response()->json($res);
            }
            //log update
            $logged = insertRecord('pms_program_details_update_logs', $log_update);
            if(!$logged['success']){
                DB::rollback();
                return response()->json($logged);
            }
            //commit
            DB::commit();

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
     public function updateImplementationPlanDates(Request $req){
        $plan_id = $req->input('id');
        $program_id = $req->input('program_id');
        $start_date = $req->input('implementationstart_date');
        $update_reason = $req->input('update_reason');
        $end_date = $req->input('implementationend_date');
        $where = array('id' => $plan_id);
        //get program details
        DB::beginTransaction();
        $record = getSingleRecord('pms_program_implementationplan', $where);
        if(!isset($record->id)){
            $res = array(
                    'success' => false,
                    'message' => 'Program not Found'
                );
            DB::rollback();
            return response()->json($res);
        }
        $update_data = array(
            'implementationstart_date' => $start_date,
            'implementationend_date' => $end_date
        );
        $log_update = array(
            'from_start_date' => $record->implementationstart_date,
            'from_end_date' => $record->implementationend_date,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'update_reason' => $update_reason,
            'program_id' =>$program_id,
            'pms_plan_id' => $plan_id
        );
        try {
           
           //update program
            $res = updateRecord('pms_program_implementationplan', $where, $update_data);
            if(!$res['success']){
                return response()->json($res);
                DB::rollback();
            }
            //log update
            $logged = insertRecord('pms_program_implementationplan_update_logs', $log_update);
            if(!$logged['success']){
                DB::rollback();
                return response()->json($logged);
            }
            //commit
            DB::commit();

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getPMSProgramRevisions(Request $req){
        $pms_plan_id = $req->input('pms_plan_id');
        $program_id = $req->input('program_id');
        $log_type = $req->input('log_type');
        try {
            if($log_type == 1){//program revisions
                $table_name = 'pms_program_details_update_logs';
                $where = array('program_id'=> $program_id);
            }else{
                $table_name = 'pms_program_implementationplan_update_logs';
                $where = array('pms_plan_id'=> $pms_plan_id);
            }
            $qry = DB::table($table_name.' as t1')
                    ->join('users as t2', 't1.created_by', 't2.id')
                    ->select('t1.*','t1.created_on as altered_on', DB::raw("CONCAT(decryptval(t2.first_name,".getDecryptFunParams()."),' ',decryptval(t2.last_name,".getDecryptFunParams().")) as altered_by"))
                    ->where($where);

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
        return response()->json($res);
    }
    public function getRemainingSampleSize(Request $req)
    {
        try{
           $pms_plan_id = $req->pms_plan_id;
           $program_id = $req->program_id;

           $qry = DB::table('pms_program_plans as t1')
                    ->leftJoin('tra_pms_sampling_sites as t2', 't1.id', 't2.pms_plan_id')
                    ->select(DB::raw("CASE WHEN t1.packaging_level_id = 1 THEN (t1.sample_size - COALESCE(SUM(t2.collection_samples), 0)) WHEN t1.packaging_level_id = 2 THEN (t1.secondary_sample_size - COALESCE(SUM(t2.collection_samples), 0)) ELSE (t1.tertiary_sample_size - COALESCE(SUM(t2.collection_samples), 0)) END remainder"))
                    ->where('t1.id', $pms_plan_id)
                    ->groupBy('t1.id');
            $results = $qry->first();
            if(isset($results->remainder)){
                $remainder = $results->remainder;
            }else{
                $remainder = 0;
            }
            $res = array(
                'success' => true,
                'remainder' => $remainder,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getRegisteredProducts(Request $req)
    {
        try{
           $qry = DB::table('tra_registered_products as t1')
                    ->join('tra_product_applications as t2', 't2.product_id', 't1.tra_product_id')
                    ->join('tra_product_information as t3', 't1.tra_product_id', 't3.id')
                    // ->leftjoin('par_common_names as t4', 't3.common_name_id', 't4.id')
                    ->select( DB::raw("DISTINCT t1.tra_product_id, CONCAT(t3.brand_name, ' : ', t3.strength) as name"), 't1.registration_no', 't1.registration_date', 't2.product_id', 't3.id','t3.brand_name');
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
        return response()->json($res);
    }
    public function getRegisteredSubstitutesGenerics(Request $req)
    {
        try{
           $qry = DB::table('tra_registered_products as t1')
                    ->join('tra_product_applications as t2', 't2.product_id', 't1.tra_product_id')
                    ->join('tra_product_information as t3', 't1.tra_product_id', 't3.id')
                    ->leftjoin('par_common_names as t4', 't3.common_name_id', 't4.id')
                    ->select('t1.registration_no', 't1.registration_date', 't2.product_id', 't3.id','t3.brand_name', DB::raw("CONCAT(t3.brand_name, ' : ', t3.strength) as name"));
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
        return response()->json($res);
    }
    public function getRegisteredProductsActives(Request $req)
    {
        try{
           $qry = DB::table('tra_registered_products as t1')
                    ->join('tra_product_ingredients as t2', function ($join) {
                            $join->on('t2.product_id', 't1.tra_product_id')
                                ->where('t2.inclusion_reason_id', 1);
                        })
                    ->join('par_ingredients_details as t3', 't2.ingredient_id', 't3.id')
                    ->select('t3.*');
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
        return response()->json($res);
    }
    public function getPmsProgramProductsAlt(Request $req)
    {
        $application_code = $req->application_code;
        try{

             $qry = DB::table('pms_program_altenative_products as t1')
                    ->join('pms_program_products as t7', 't7.id', 't1.program_product_id')
                    ->join('pms_program_plans as tt3', 't7.product_id', 'tt3.product_id')
                    ->join('tra_pms_sampling_sites as tt7', 'tt7.pms_plan_id', 'tt3.id')
                    ->join('tra_surveillance_sample_details as tt1', 'tt1.sampling_site_id', 'tt7.id')
                    ->join('tra_product_information as p4', 't1.product_id', 'p4.id')
                    ->select('p4.brand_name', 'p4.dosage_form_id', 'p4.strength', 't1.product_id')

                    ->where('tt1.application_code', $application_code);

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
        return response()->json($res);
    }
    public function getPlanListDetails(Request $req)
    {
        $workflow_stage_id = $req->input('workflow_stage_id');
        $user_id = $this->user_id;
        // $is_super = belongsToSuperGroup($assigned_groups);
        try {
            $qry = DB::table('tra_surveillance_applications as t1')
                ->join('tra_surveillance_sample_details as t2', 't1.id', 't2.application_id')
                ->leftJoin('pms_program_plans as t3', 't1.program_implementation_id', 't3.program_implementation_id')
                ->leftJoin('tra_product_information as t4', 't3.product_id', 't4.id')
                ->leftJoin('par_common_names as t5', 't4.common_name_id', 't5.id')
                ->join('tra_sample_collectors_assignments as t6', 't3.id', 't6.pms_plan_id')
                ->leftJoin('par_si_units as t7', 't3.si_unit_id', 't7.id')
                ->leftJoin('par_dosage_forms as t8', 't3.dosage_form_id', 't8.id')
                ->leftJoin('par_regions as t9', 't3.region_id', 't9.id')
                ->select(DB::raw("DISTINCT ON (t3.id) t3.program_id") ,'t3.program_implementation_id','t3.region_id','t3.district_id','t3.sample_size','t3.primary_container_id','t3.secondary_sample_size','t3.secondary_container_id','t3.tertiary_sample_size','t3.tertiary_container_id','t3.packaging_level_id','t3.id as pms_plan_id',DB::raw("CONCAT(t5.name, ' (',t3.strength, ' ', t7.name, ' ', t8.name, ') -> IN ', t9.name) as product_name,t2.application_code as sample_application_code"))
                ->where('t6.user_id', $user_id)
                ->where('t2.workflow_stage_id', $workflow_stage_id);


 
           // if(!$is_super){
           //      $qry->whereIn('t1.workflow_stage_id', $assigned_stages);
           //      $qry->whereNull('t1.usr_to');
           //  }   
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
        return response()->json($res);
    }
    //  public function getPMSSitesByStageAssignment(Request $req)
    // {
    //     $workflow_stage_id = $req->input('workflow_stage_id');
    //     $user_id = $this->user_id;
    //     // $is_super = belongsToSuperGroup($assigned_groups);
    //     try {
    //         $qry = DB::table('tra_surveillance_applications as t1')
    //             ->join('tra_surveillance_sample_details as t2', 't1.id', 't2.application_id')
    //             ->leftJoin('pms_program_plans as t3', 't1.program_implementation_id', 't3.program_implementation_id')
    //             ->join('tra_sample_collectors_assignments as t6', 't3.id', 't6.pms_plan_id')
    //             ->join('tra_pms_sampling_sites as t7', 't3.id', 't7.pms_plan_id')
    //             ->leftJoin('tra_premises as t8', 't7.premise_id', 't8.id')
    //             ->select(DB::raw("t8.*"))
    //             ->where('t6.user_id', $user_id)
    //             ->where('t2.workflow_stage_id', $workflow_stage_id);

    //        // if(!$is_super){
    //        //      $qry->whereIn('t1.workflow_stage_id', $assigned_stages);
    //        //      $qry->whereNull('t1.usr_to');
    //        //  }   
    //         $results = $qry->get();
    //         $res = array(
    //             'success' => true,
    //             'results' => $results,
    //             'message' => 'All is well'
    //         );
    //     } catch (\Exception $exception) {
    //         $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    //     } catch (\Throwable $throwable) {
    //         $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    //     }
    //     return response()->json($res);
    // // }
    public function saveAltenativeSampleCollectionSite(Request $req){
        //parameters
        $user_id = $this->user_id;
        $sample_application_code = $req->sample_application_code;
        $plan_id = $req->pms_plan_id;
        //unset uneccesary site details
        unset($req->sample_application_code);
        try{
            DB::beginTransaction();
            //save site 
            $res = $this->saveSurveillanceCommonData($req);
            $res = json_decode($res->getContent());
            if(!isset($res->record_id)){
                DB::rollback();
                return response()->json($res);
            }
            //get Application details
            $sample_application_details = DB::table('tra_surveillance_sample_details')->where('application_code', $sample_application_code)->first();
            if (is_null($sample_application_details)) {
                DB::rollback();
                $res = array(
                    'success' => false,
                    'message' => 'Problem encountered while fetching sample application details!!'
                );
                return json_encode($res);
            }
            $application_details = DB::table('tra_surveillance_applications')->where('id', $sample_application_details->application_id)->first();
            if (is_null($application_details)) {
                DB::rollback();
                $res = array(
                    'success' => false,
                    'message' => 'Problem encountered while fetching sur application details!!'
                );
                return json_encode($res);
            }
            //prepare variables
            $application_id = $application_details->id;
            $sampling_site_id = $res->record_id;
            //get serial
            $other_sample_details = DB::table('tra_surveillance_sample_details')
                    ->where('application_id', $application_id)
                    ->select(DB::raw("pms_plan_id, process_id, module_id,sub_module_id,section_id"))
                    ->groupBy('application_id', 'pms_plan_id', 'process_id','module_id','sub_module_id','section_id')
                    ->first();
            if (is_null($other_sample_details)) {
                DB::rollback();
                $res = array(
                    'success' => false,
                    'message' => 'Problem encountered while fetching sample details!!'
                );
                return json_encode($res);
            }
            $serial_no = DB::table('tra_surveillance_sample_details')->where('application_id', $application_id)->count();
            $process_id = $other_sample_details->process_id;
            $module_id = $other_sample_details->module_id;
            $sub_module_id = $other_sample_details->sub_module_id;
            $section_id = $other_sample_details->section_id;
            $application_status_id = $sample_application_details->application_status_id;
            $to_stage = $sample_application_details->workflow_stage_id;
             //make a sample application
            $serial_no = $serial_no + 1;

            $view_id = generateApplicationViewID();
            $sample_application_code = $application_details->application_code.'0'.$plan_id.'0'.$serial_no;
            $sample_ref = $application_details->reference_no.'/plan-'.$plan_id.'/'.$serial_no;
            $sample_tracking = $application_details->tracking_no.'/plan-'.$plan_id.'/'.$serial_no;

            $sample_app = array(
                'application_id' => $application_details->id,
                'view_id' => $view_id,
                'process_id' => $process_id,
                'application_code' => $sample_application_code,
                'reference_no' => $sample_ref,
                'tracking_no' => $sample_tracking,
                'module_id' => $module_id,
                'sub_module_id' => $sub_module_id,
                'section_id' => $section_id,
                'application_status_id' => $application_status_id,
                'applicant_id' => $application_details->applicant_id,
                'workflow_stage_id' => $to_stage,
                'pms_plan_id'=> $plan_id,
                'sampling_site_id' => $sampling_site_id
            );

            //insert to sample applications
            $res = insertRecord('tra_surveillance_sample_details', $sample_app);
            if(!isset($res['record_id'])){
                DB::rollback();
                return response()->json($res);
            }
            $sample_application_id = $res['record_id'];
            //prepare submission
            $submission_params = array(
                'application_id' => $sample_application_id,
                'view_id' => $view_id,
                'process_id' => $process_id,
                'application_code' => $sample_application_code,
                'reference_no' => $sample_ref,
                'tracking_no' => $sample_tracking,
                'usr_from' => $user_id,
                'usr_to' => $user_id,
                'previous_stage' => $to_stage,
                'current_stage' => $to_stage,
                'module_id' => $module_id,
                'sub_module_id' => $sub_module_id,
                'section_id' => $section_id,
                'application_status_id' => $application_status_id,
                'urgency' => 1,
                'applicant_id' => $application_details->applicant_id,
                'remarks' => 'Altenative Sample Addition',
                'date_received' => Carbon::now(),
                'created_on' => Carbon::now(),
                'created_by' => $user_id
            );
            //insert submission record
            DB::table('tra_submissions')->insert($submission_params);
             //log assignments
            $samples_assignment_details = array(
                'pms_plan_id' => $plan_id,
                'sampling_site_id' => $sampling_site_id,
                'user_id' => $user_id
             );
            // Insert sample
            $insert_rec = insertRecord('tra_sample_collectors_assignments', $samples_assignment_details);
            if(!isset($res['record_id'])){
                DB::rollback();
                return response()->json($res);
            }
            DB::commit();
            $res = array(
                'success' => true,
                'results' => $res,
                'message' => 'Site Added Successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getMeetingPmsApplicationsList(Request $req){
        $pms_plan_id = $req->pms_plan_id;
        $user_id = $this->user_id;
        $application_code = $req->application_code;
        $workflow_stage_id = $req->workflow_stage_id;
        $user_id = $this->user_id;
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        $assigned_stages = getAssignedProcessStages($user_id, 5);
        //district 1
        //all sites in that district is_altenative
        try {
            $qry = DB::table('tra_pms_sampling_sites as tt7')
                    ->join('pms_program_plans as tt3', 'tt7.pms_plan_id', 'tt3.id')
                    ->join('tra_surveillance_sample_details as tt1', 'tt1.sampling_site_id', 'tt7.id')
                    ->join('tra_submissions as t1', 'tt1.application_code', 't1.application_code')
                    ->leftJoin('tra_sample_collectors_assignments as t2', 'tt1.pms_plan_id', 't2.pms_plan_id')
                    ->leftJoin('tra_product_applications as a4', 'tt3.product_id', 'a4.product_id')
                    ->leftJoin('tra_product_information as p4', 'tt3.product_id', 'p4.id')
                    ->leftJoin('par_dosage_forms as t4', 'tt3.dosage_form_id', 't4.id')
                    ->leftJoin('par_common_names as t5', 'p4.common_name_id', 't5.id')
                    ->leftJoin('par_si_units as t6', 'tt3.si_unit_id', '=', 't6.id')
                    ->leftJoin('tra_sample_collection_log as t7', 'tt7.id', 't7.sampling_site_id')
                    ->leftJoin('tra_premises as t8', 'tt7.premise_id', 't8.id')
                    ->leftJoin('par_regions as t9', 't8.region_id', 't9.id')
                    ->leftJoin('par_districts as t10', 't8.district_id', 't10.id')
                    ->leftJoin('par_containers as t11', 'tt7.container_id', 't11.id')
                    ->leftJoin('par_packaging_units as t12', 'tt7.primary_container_id', 't12.id')
                    ->leftJoin('par_packaging_units as tt12', 'tt7.secondary_container_id', 'tt12.id')
                    ->leftJoin('par_packaging_units as ttt12', 'tt7.tertiary_container_id', 'ttt12.id')


                    //processing
                    ->leftJoin('tra_pir_recommendation as t13', function ($join) use($pms_plan_id) {
                        $join->on('tt7.pms_plan_id', '=', 't13.pms_plan_id')
                            ->on('t7.sampling_site_id', '=', 't13.sampling_site_id');
                    })
                    ->leftJoin('wf_workflow_stages as t14', 'tt1.workflow_stage_id', 't14.id')
                    ->leftJoin('tra_registered_products as t15', 'a4.id', 't15.tra_product_id')

                    //site details
                    ->leftJoin('par_regions as t17', 'tt3.region_id','t17.id')
                    ->leftJoin('par_districts as t18', 'tt3.district_id', 't18.id')
                    ->leftJoin('par_business_types as t19', 'tt3.sampling_site_id', 't19.id')
                    ->leftJoin('par_prodclass_categories as t20', 'a4.prodclass_category_id', 't20.id')

                    ->select(DB::raw("DISTINCT ON (tt7.id) CONCAT(tt3.strength,t6.name) as strength_txt, CONCAT(tt7.collection_samples, ' ', t12.name) as primary_units, CONCAT(tt7.secondary_sample_size, ' ', tt12.name) as secondary_units, CONCAT(tt7.tertiary_sample_size, ' ', ttt12.name) as tertiary_units, CASE WHEN tt7.packaging_level_id = 1 THEN CONCAT((tt7.collection_samples), ' ', t12.name) WHEN tt7.packaging_level_id = 2 THEN CONCAT((tt7.collection_samples*tt7.secondary_sample_size), ' ', tt12.name) ELSE CONCAT((tt7.collection_samples*tt7.secondary_sample_size*tt7.tertiary_sample_size), ' ', ttt12.name) END as total_samples"), 't4.name as dosage_form','t5.name as product','tt7.collection_samples','tt7.unit_pack','t8.id as premise_id','t8.physical_address', 't8.postal_address','t8.name','t8.telephone as telephone_no','t8.email', 't9.name as region','t10.name as district', 't11.name as container_name', 't12.name as packaging_unit','tt1.application_code','tt7.packaging_unit_id', 'tt1.reference_no', 'tt3.program_id', 'tt3.program_implementation_id', 'tt7.container_id','tt1.pms_plan_id', 'tt1.application_code', 'tt1.id as application_id', 'tt7.id as record_id','tt1.id', 'tt1.module_id', 'tt1.sub_module_id', 't13.id as pir_recommendation_id','t13.decision_id as pir_decision_id','t13.comments as pir_comment', 't14.stage_category_id','tt7.id as sampling_site_id','t7.is_collected', 'tt7.primary_container_id','tt7.secondary_container_id','tt7.tertiary_container_id','tt7.secondary_sample_size', 'tt7.tertiary_sample_size', 'tt7.packaging_level_id','tt7.collection_samples as sample_size','t15.registration_no as certificate_no', 't15.registration_date', 'tt7.is_altenative', 't17.name as region_name', 't18.name as district_name', 't19.name as sampling_site', 't20.name as category_name')
                    ->where('tt1.workflow_stage_id', $workflow_stage_id)
                    ->where('t1.is_done', 0);

            if(!$is_super){
                $qry->whereIn('tt1.workflow_stage_id', $assigned_stages);
                $qry->whereNull('t1.usr_to');
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
        return response()->json($res);
    }
    public function getSampleCollectorsList(Request $req)
    {
        try{
            $qry = DB::table('users as t1')
                    ->leftJoin('par_titles as t2', 't1.title_id', '=', 't2.id')
                    ->leftJoin('tra_blocked_accounts as t6', 't1.id', '=', 't6.account_id')
                    ->leftJoin('tra_user_group as t7','t1.id','t7.user_id')
                    ->leftJoin('par_gender as t9', 't1.gender_id', '=', 't9.id')
                    ->select(DB::raw("t1.*, t1.email as email, t2.name as title, t9.name as gender, CONCAT(t2.name, ' ', decryptval(t1.first_name,".getDecryptFunParams()."),' ', decryptval(t1.last_name,".getDecryptFunParams().")) as name"))
                    ->whereNull('t6.id');

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
        return response()->json($res);
    }
    public function saveSampleCollectorsAssignment(Request $req)
    {
        try{
            $selected = $req->selected;
            $collectors_ids = $req->collectors_ids;
            $collectors_ids = json_decode($collectors_ids);
            $app_details = json_decode($selected);
            // loop through selected plans
            $collectors = [];
            DB::beginTransaction();
            foreach ($app_details as $application) {
                $application_id = $application->application_id;
                $pms_plan_id = $application->pms_plan_id;
                // $collector_assignment_id = $application->collector_assignment_id;
                //loop through collectors
                foreach ($collectors_ids as $collectors_id) {
                    //delete application
                    deleteRecord('tra_sample_collectors_assignments', ['application_id'=> $application_id, 'pms_plan_id'=>$pms_plan_id]);
                   $collectors[] = array(
                        'application_id' => $application_id,
                        'pms_plan_id' => $pms_plan_id,
                        'user_id' => $collectors_id,
                    );
                }
            }
            //insert entries 
            $res = insertMultipleRecords('tra_sample_collectors_assignments', $collectors);
            if(!isset($res['success']) && !$res['success']){
                DB::rollback();
                return response()->json($res);
            }
            DB::commit();
            $res = array(
                'success' => true,
                'message' => 'Assignments Done Successfully'
            );
        } catch (\Exception $exception) {
            DB::rollback();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            DB::rollback();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getPlanSampleCollectors(Request $req){
        $pms_plan_id = $req->input('pms_plan_id');
        $application_id = $req->input('application_id');

        //surveillance application
        $original_app_id = getSingleRecordColValue('tra_surveillance_sample_details', ['id'=>$application_id], 'application_id');
        $exists = recordExists('tra_sample_collectors_assignments', ['pms_plan_id'=>$pms_plan_id, 'application_id'=>$original_app_id]);
        // dd($original_app_id);
        try {
            //by original
            if($exists){
                $qry = DB::table('tra_sample_collectors_assignments')
                    ->where('pms_plan_id', $pms_plan_id)
                    ->where('application_id', $original_app_id)
                    ->select('user_id');
            }else{
                $qry = DB::table('tra_sample_collectors_assignments')
                    ->where('pms_plan_id', $pms_plan_id)
                    ->where('application_id', $application_id)
                    ->select('user_id');
            }
            $results = $qry->get();
            $results = convertStdClassObjToArray($results);
            $collectors_ids = convertAssArrayToSimpleArray($results, 'user_id');
            
            $res = array(
                'success' => true,
                'collectors_ids' => $collectors_ids,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getPmsProgramPlansProducts(Request $req){
        try{
            $pms_plan_id = $req->pms_plan_id;
            $user_id = $this->user_id;
            $application_code = $req->application_code;
            $workflow_stage_id = $req->workflow_stage_id;
            $qry = DB::table('tra_sample_collection_log as tt7')
                    ->join('tra_pms_sampling_sites as tt3', 'tt3.id', 'tt7.sampling_site_id')
                    ->join('pms_program_plans as q3', 'q3.id', 'tt3.pms_plan_id')
                    ->join('tra_surveillance_sample_details as tt1', 'tt1.sampling_site_id', 'tt3.id')
                    ->join('tra_product_information as t1', 'q3.product_id', 't1.id')
                    ->join('tra_product_applications as t2', 'q3.product_id', 't2.product_id')
                    ->leftJoin('par_product_forms as t3', 't1.product_form_id', 't3.id')
                    ->leftJoin('par_prodclass_categories as t5', 't2.prodclass_category_id', 't5.id')

                    ->select(DB::raw("DISTINCT ON (q3.product_id) t1.brand_name as product_name,tt1.application_code, t1.common_name, t1.strength as strength_txt, SUM(q3.sample_size) as total_samples, t5.name as category_name, q3.product_id, q3.program_id, q3.program_implementation_id , tt3.pms_plan_id,tt1.id,tt1.sampling_site_id"))
                    ->groupBy('q3.product_id','t1.id', 't5.name', 'q3.program_id','q3.program_implementation_id' ,'tt3.pms_plan_id', 'tt1.id')->whereNull('tt7.is_altenative');

            $qry_al = DB::table('tra_sample_collection_log as tt7')
                    ->join('tra_pms_sampling_sites as tt3', 'tt3.id', 'tt7.sampling_site_id')
                    ->join('pms_program_plans as q3', 'q3.id', 'tt3.pms_plan_id')
                    ->join('tra_surveillance_sample_details as tt1', 'tt1.sampling_site_id', 'tt3.id')
                    ->join('tra_product_information as t1', 'tt7.product_id', 't1.id')
                    ->join('tra_product_applications as t2', 'tt7.product_id', 'tt7.product_id')
                    ->leftJoin('par_product_forms as t3', 't1.product_form_id', 't3.id')
                    ->leftJoin('par_prodclass_categories as t5', 't2.prodclass_category_id', 't5.id')

                    ->select(DB::raw("DISTINCT ON (tt7.product_id) t1.brand_name as product_name,tt1.application_code, t1.common_name, t1.strength as strength_txt, SUM(q3.sample_size) as total_samples, t5.name as category_name, tt7.product_id, q3.program_id, q3.program_implementation_id , tt3.pms_plan_id,tt1.id,tt1.sampling_site_id"))
                    ->groupBy('tt7.product_id','t1.id', 't5.name', 'q3.program_id','q3.program_implementation_id' ,'tt3.pms_plan_id', 'tt1.id')->where('tt7.is_altenative', 1);

            $assigned_groups = getUserGroups($user_id);
            $is_super = belongsToSuperGroup($assigned_groups);
            $assigned_stages = getAssignedProcessStages($user_id, 5);
            if(!$is_super){
                $qry->whereIn('tt1.workflow_stage_id', $assigned_stages);
                $qry_al->whereIn('tt1.workflow_stage_id', $assigned_stages);
                $qry->whereNull('t1.usr_to');
                $qry_al->whereNull('t1.usr_to');
            }
            if(validateIsNumeric($workflow_stage_id)){
                $qry->where('tt1.workflow_stage_id', $workflow_stage_id);
                $qry_al->where('tt1.workflow_stage_id', $workflow_stage_id);
            }

            $results =  $qry->get();
            $results_al =  $qry_al->get();
            // dd($results);
            $all = $results->merge($results_al);
            $res = array(
                'success' => true,
                'results' => $all,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
public function getPmsSamplingSitesListByProduct(Request $req){
        try{
            $program_id = $req->program_id;
            $program_implementation_id = $req->program_implementation_id;
            $pms_plan_id = $req->pms_plan_id;
            $product_id = $req->product_id;

            $qry = DB::table('tra_pms_sampling_sites as t1')
                ->join('tra_surveillance_sample_details as tt1', 'tt1.sampling_site_id', 't1.id')
                ->join('tra_sample_collection_log as l2', 'l2.sampling_site_id', 't1.id')
                ->join('tra_premises as t2', 't1.premise_id', '=', 't2.id')
                ->leftJoin('par_regions as t3', 't2.region_id', '=', 't3.id')
                ->leftJoin('par_districts as t4', 't2.district_id', '=', 't4.id')
                ->leftJoin('par_packaging_units as t5', 't1.primary_container_id', '=', 't5.id')
                ->leftJoin('par_packaging_units as t6', 't1.secondary_container_id', '=', 't6.id')
                ->leftJoin('par_packaging_units as t7', 't1.tertiary_container_id', '=', 't7.id')
                ->leftJoin('par_packaging_levels as t8', 't1.packaging_level_id', '=', 't8.id')
                ->leftJoin('pms_program_plans as t9', 't1.pms_plan_id', '=', 't9.id')
                ->leftJoin('tra_pmsminilab_screening_results as t10', 'tt1.id', 't10.sample_application_id')
                ->leftJoin('tra_survsample_analysis_results as t11', 'tt1.id', 't11.sample_application_id')
                
                //processing
                ->leftJoin('tra_pir_recommendation as t13', function ($join) {
                    $join->on('t1.pms_plan_id', '=', 't13.pms_plan_id')
                        ->on('tt1.sampling_site_id', '=', 't13.sampling_site_id');
                })
               
                ->leftJoin('wf_workflow_stages as t14', 'tt1.workflow_stage_id', 't14.id')
                ->leftJoin('tra_pms_final_recommendation as t16', function ($join) {
                    $join->on('t1.pms_plan_id', 't16.pms_plan_id')
                        ->on('tt1.sampling_site_id', 't16.sampling_site_id');
                })
                ->leftJoin('par_pms_final_recommendations as t17', 't16.decision_id', 't17.id')


                ->select(DB::raw("DISTINCT ON (1) t1.id"), 't1.*','t1.id as sample_id','t2.physical_address', 't2.postal_address','t2.name','t2.telephone as telephone_no', 't2.email', 't3.name as region','t4.name as district', DB::raw("CONCAT(t1.sample_size,' ',t5.name) as primary_units, CONCAT(t1.secondary_sample_size,' ',t6.name) as secondary_units, CONCAT(t1.tertiary_sample_size,' ',t7.name) as tertiary_units, CASE WHEN t1.packaging_level_id = 1 THEN CONCAT((t1.collection_samples), ' ', t5.name) WHEN t1.packaging_level_id = 2 THEN CONCAT((t1.collection_samples*t1.secondary_sample_size), ' ', t6.name) ELSE CONCAT((t1.collection_samples*t1.secondary_sample_size*t1.tertiary_sample_size), ' ', t7.name) END as total_samples, CASE WHEN t10.decision_id IS NULL THEN 3 WHEN t10.decision_id > 0 THEN t10.decision_id END is_screened,CASE WHEN t11.pass_status_id IS NULL THEN 3 WHEN t11.pass_status_id > 0 THEN t11.pass_status_id END is_analysed, t10.decision_id, t10.comments, t10.id as screening_recommendation_id,t11.pass_status_id, t11.id as lab_result_id, t11.id as has_results, t11.results, t11.analyst_remarks, l2.batch_no, l2.expiry_date"), 't1.id as sampling_site_id','t8.name as packaging_level', 'tt1.id as sample_application_id', 'tt1.reference_no as sample_code', 't13.id as pir_recommendation_id','t13.decision_id as pir_decision_id','t13.comments as pir_comment','t17.name as pms_decision', 't17.id as pms_decision_id')
                ->where('t1.pms_plan_id', $pms_plan_id)
                ->whereRAW("t9.product_id = ". $product_id. " OR l2.product_id = ". $product_id);

            $res = array(
                'success' => true,
                'results' => $qry->get(),
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getFacilityInspectionSchedulePlan(Request $request)
    {
        $section_id = $request->input('section_id');
        try {
            $qry = DB::table('tra_facility_schedule_details as t1')
                ->leftJoin('tra_facilityschedule_applications as t4', 't1.id', '=', 't4.schedule_id')
                ->leftJoin('par_system_statuses as t5', 't4.application_status_id', '=', 't5.id')
                ->select('t1.*', 't1.name as pms_program','t1.id as schedule_id', 't5.name as status','t5.id as status_id');//
           
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
        return response()->json($res);
    }
     public function getFacilityScheduleImplementation(Request $req)
    {
        $schedule_id = $req->schedule_id;
        try {
            $qry = DB::table('tra_facility_program_implementationplan as t1')
                ->join('tra_facility_schedule_details as t2', 't1.schedule_id', 't2.id')
                ->select('t1.*', 't2.name as schedule_name', 't1.id as implementation_id')
                ->where('t1.schedule_id', $schedule_id);//
           
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
        return response()->json($res);
    }
    public function saveSurveillanceInspectionSchedule(Request $req) {
        try{
            $all_data = $req->All();
            $section_id = 8;
            $table_name = $req->table_name;
            $id = $req->id;
            $name = $req->name;
            $years_taken = $req->years_taken;
            $start_date = $req->start_date;
            $description = $req->description;
            
            DB::beginTransaction();
            if(validateIsNumeric($id)){
                //update
                updateRecord('tra_facility_schedule_details', ['id'=>$id], ['name' => $name, 'start_date' => $start_date, 'description'=>$description]);
                $schedule_id = $id;
                $res = array('success'=>true, 'message'=>'Update successfull');
            }else{
                //insert
                $ins = insertRecord('tra_facility_schedule_details', ['section_id' => $section_id, 'name' => $name, 'years_taken'=>$years_taken, 'start_date' => $start_date, 'description'=>$description]);
                if(!isset($ins['record_id'])){
                    return $ins;
                }
                $schedule_id = $ins['record_id'];

                //get facility and last date of inspection; per year check
                $min_rounds_per_year = 0;
                $maj_rounds_per_year = 0;
                $crt_rounds_per_year = 0;
                $min_first = true;
                $maj_first = true;
                $crt_first = true;
                //get facility and cycles
                // minor facility
                $min_prem_qry = DB::table('tra_premises as t3')
                                ->join('tra_premises_applications as t4', 't3.id', 't4.premise_id')
                                ->select('t4.premise_id')
                                ->whereRaw("(t3.last_compliance_risk*t3.last_intrisic_risk) < 3")
                                ->get();

                $type_role = getSingleRecord('par_risk_based_inspection_cycles', ['risk_type_id' => 1]);
                $times = $type_role->times;
                $per_year = $type_role->per_year;
                $min_mod = $times % $per_year;
                $min_rounds_per_year = ($times-$min_mod)/$per_year;

                
                //medium risk facilities
                $maj_prem_qry = DB::table('tra_premises as t3')
                                ->join('tra_premises_applications as t4', 't3.id', 't4.premise_id')
                                ->select('t4.premise_id')
                                ->whereRaw("(t3.last_compliance_risk*t3.last_intrisic_risk) > 2 AND (t3.last_compliance_risk*t3.last_intrisic_risk) < 6")
                                ->get();
               
                $type_role = getSingleRecord('par_risk_based_inspection_cycles', ['risk_type_id' => 2]);
                $times = $type_role->times;
                $per_year = $type_role->per_year;
                $maj_mod = $times % $per_year;
                $maj_rounds_per_year = ($times-$maj_mod)/$per_year;

                
                //critical risk facilities
                $ctr_prem_qry = DB::table('tra_premises as t3')
                                ->join('tra_premises_applications as t4', 't3.id', 't4.premise_id')
                                ->select('t4.premise_id')
                                ->whereRaw("(t3.last_compliance_risk*t3.last_intrisic_risk) > 5")
                                ->get();

                $type_role = getSingleRecord('par_risk_based_inspection_cycles', ['risk_type_id' => 3]);
                $times = $type_role->times;
                $per_year = $type_role->per_year;
                $crt_mod = $times % $per_year;
                $crt_rounds_per_year = ($times-$crt_mod)/$per_year;

                
                //loop years choosen
                for ($i=0; $i < $years_taken ; $i++) {
                    //start and end
                    if($i > 0){
                        // $sdate = Carbon::createFromFormat('Y-m-d', $start_date)->addYears($i);
                        // $edate = Carbon::createFromFormat('Y-m-d', $sdate)->addYears(1);
                        
                        $sd = strtotime($start_date. '+'.$i.' year'); //gets dates instance
                        $sdate = date("Y-m-d", $sd);
                        $year = date("Y", $sd);
                        $y  = $i+1;
                        $dt = strtotime($start_date. '+'.$y.' year'); //gets dates instance
                        $edate = date("Y-m-d", $dt);
                    }else{
                        
                        $sd = strtotime($start_date. '+'.$i.' year'); //gets dates instance
                        $sdate = date("Y-m-d", $sd);
                        $year = date("Y", $sd);
                      
                        $dt = strtotime($start_date. '+1 year'); //gets dates instance
                        $edate = date("Y-m-d", $dt);
                    }

                    //get rounds count
                    if($min_first){
                        if($min_mod > 0){
                           $min_rounds_this_year = $min_rounds_per_year+1; 
                       }else{
                            $min_rounds_this_year = $min_rounds_per_year;
                       }
                        $min_first=false;
                    }else {
                        $min_rounds_this_year = $min_rounds_per_year;
                    }
                    if($maj_first){
                        if($maj_mod > 0){
                            $maj_rounds_this_year = $maj_rounds_per_year+1;
                        }else{
                            $maj_rounds_this_year = $maj_rounds_per_year;
                        }
                        $maj_first=false;
                    }else {
                        $maj_rounds_this_year = $maj_rounds_per_year;
                    }
                    if($crt_first){
                        if($crt_mod > 0){
                            $crt_rounds_this_year = $crt_rounds_per_year+1;
                        }else{
                            $crt_rounds_this_year = $crt_rounds_per_year;
                        }
                        
                        $crt_first=false;
                    }else {
                        $crt_rounds_this_year = $crt_rounds_per_year;
                    }
                    //get highest rounds for imp years
                    $gretest_rounds = max($crt_rounds_this_year, $maj_rounds_this_year, $min_rounds_this_year);
                    
                    //create implementations applicable
                    for ($k=0; $k < $gretest_rounds; $k++) {
                        //create an implementation
                        $data = array(
                            'schedule_implementation_name' => ($i+1).' Year of Implemantation'. ($k+1). " Round",
                            'schedule_id' => $schedule_id,
                            'implementationstart_date' => $sdate,
                            'implementationend_date' => $edate,
                            'year_of_implementation' => $year
                        );
                        $imp_r = insertRecord('tra_facility_program_implementationplan', $data);
                        if(!isset($imp_r['record_id'])){
                            return $imp_r;
                        }
                        $imp_id = $imp_r['record_id'];
                        
                        // add entries per year
                        $facility_list = [];
                        //minor fac
                        if($min_rounds_this_year > $k){
                            foreach ($min_prem_qry as $facility) {
                               $facility_list[] = array(
                                'premise_id' => $facility->premise_id,
                                'implementation_id' => $imp_id
                               );
                            }
                            
                        }
                        if($maj_rounds_this_year > $k){
                            foreach ($maj_prem_qry as $facility) {
                               $facility_list[] = array(
                                'premise_id' => $facility->premise_id,
                                'implementation_id' => $imp_id
                               );
                            }
                            
                        }
                        if($crt_rounds_this_year > $k){
                            foreach ($ctr_prem_qry as $facility) {
                               $facility_list[] = array(
                                'premise_id' => $facility->premise_id,
                                'implementation_id' => $imp_id
                               );
                            }
                            
                        }
                        //insert to implementation facility list

                        $res = insertMultipleRecords('tra_implementation_plan_facilities_list', $facility_list);
                    }
                }
            }
            DB::commit();
            $res = array('success'=>true, 'message' => 'schedule prepared successfully', 'record_id'=>$schedule_id);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function saveSurveillanceInspectionScheduleOld(Request $req) {
        try{
            $all_data = $req->All();
            $section_id = 8;
            $table_name = $req->table_name;
            $id = $req->id;
            $name = $req->name;
            $years_taken = $req->years_taken;
            $start_date = $req->start_date;
            $description = $req->description;

            DB::beginTransaction();
            if(validateIsNumeric($id)){
                //update
                $res = array('success'=>true, 'message'=>'Update successfull');
            }else{
                //insert
                $ins = insertRecord('tra_facility_schedule_details', ['section_id' => $section_id, 'name' => $name, 'years_taken'=>$years_taken, 'start_date' => $start_date, 'description'=>$description]);
                if(!isset($ins['record_id'])){
                    return $ins;
                }
                $schedule_id = $ins['record_id'];
                //get facility and last date of inspection; per year check
                $min_rounds_per_year = 0;
                $maj_rounds_per_year = 0;
                $crt_rounds_per_year = 0;
                $min_first = true;
                $maj_first = true;
                $crt_first = true;
                
                    // facility based on risk and year
                    //history duration
                    $duration = getSingleRecordColValue('par_durations', ['type_id' => 10], 'value');
                    //low
                    //distance risk
                    $low_distance = getSingleRecord('par_distance_risks', ['risk_type_id' => 1]);
                    //type role risk
                    $type_role = getSingleRecord('par_risk_premise_types_roles', ['risk_type_id' => 1]);

                    //compliance risk
                    $min_compliance = getSingleRecord('par_compliance_risk_scale_mapping', ['risk_type_id' => 1, 'compliance_risk_scale_id' => 1]);
                    $maj_compliance = getSingleRecord('par_compliance_risk_scale_mapping', ['risk_type_id' => 1, 'compliance_risk_scale_id' => 2]);
                    $crt_compliance = getSingleRecord('par_compliance_risk_scale_mapping', ['risk_type_id' => 1, 'compliance_risk_scale_id' => 3]);

                    //intrisic where
                    // $where = "distance_kms <= ". $low_distance->maximum_kms." AND risk_premise_type_role_id = ".$type_role->id. " AND (SELECT count(c.id) FROM tra_facility_inspection_compliances c inner JOIN par_facility_risk_items d ON c.facility_risk_item_id = d.id WHERE d.compliance_risk_scale_id = 1 AND c.premise_id = t1.premise_id AND c.pass_status_id = 2) BETWEEN ".$min_compliance->min_total_count. " AND ".$min_compliance->max_total_count. " AND (SELECT count(c.id) FROM tra_facility_inspection_compliances c inner JOIN par_facility_risk_items d ON c.facility_risk_item_id = d.id WHERE d.compliance_risk_scale_id = 2 AND c.premise_id = t1.premise_id AND c.pass_status_id = 2) BETWEEN ".$maj_compliance->min_total_count. " AND ".$maj_compliance->max_total_count." AND (SELECT count(c.id) FROM tra_facility_inspection_compliances c inner JOIN par_facility_risk_items d ON c.facility_risk_item_id = d.id WHERE d.compliance_risk_scale_id = 3 AND c.premise_id = t1.premise_id AND c.pass_status_id = 2) BETWEEN ".$crt_compliance->min_total_count. " AND ".$crt_compliance->max_total_count;
                  

                    // $min_prem_qry = DB::table('tra_facility_inspection_compliances as t1')
                    //                 ->join('tra_premise_inspection_details as t2', 't1.inspection_id', 't2.id')
                    //                 ->join('tra_premises as t3', 't3.id', 't1.premise_id')
                    //                 ->leftjoin('par_facility_risk_items as t4', 't1.facility_risk_item_id', 't4.id')
                    //                 ->select('t1.premise_id')
                    //                 ->whereRAW($where);
                    $min_prem_qry = DB::table('tra_premises as t3')
                                    ->leftjoin('tra_premises_applications as t4', 't3.id', 't4.premise_id')
                                    ->select('t3.id')
                                    ->whereRAW($where);
                                    // ->get();
                    //dates filter as per duration
                    if($duration > 0){
                        $from = Carbon::now()->subYears($duration);
                        $to = Carbon::now();
                       $min_prem_qry->whereDate('t2.start_date', '>', $from);
                       $min_prem_qry->whereDate('t2.start_date', '<', $to);
                    }
                    $min_prem_qry = $min_prem_qry->get();
                    //rounds per years on low
                    $type_role = getSingleRecord('par_risk_based_inspection_cycles', ['risk_type_id' => 1]);
                    $times = $type_role->times;
                    $per_year = $type_role->per_year;
                    $mod = $times % $per_year;
                    $min_rounds_per_year = ($times-$mod)/$per_year;

                    if($min_first){
                        $min_rounds_this_year = $min_rounds_per_year+$mod;
                        $min_first=false;
                    }else {
                        $min_rounds_this_year = $min_rounds_per_year;
                    }

                    //Major
                    //distance risk
                    $distance = getSingleRecord('par_distance_risks', ['risk_type_id' => 2]);
                    //type role risk
                    $type_role = getSingleRecord('par_risk_premise_types_roles', ['risk_type_id' => 2]);
                    //compliance risk
                    $min_compliance = getSingleRecord('par_compliance_risk_scale_mapping', ['risk_type_id' => 2, 'compliance_risk_scale_id' => 1]);
                    $maj_compliance = getSingleRecord('par_compliance_risk_scale_mapping', ['risk_type_id' => 2, 'compliance_risk_scale_id' => 2]);
                    $crt_compliance = getSingleRecord('par_compliance_risk_scale_mapping', ['risk_type_id' => 2, 'compliance_risk_scale_id' => 3]);
                    //intrisic where
                    $where = "distance_kms <= ". $distance->maximum_kms." AND risk_premise_type_role_id = ".$type_role->id. " AND (SELECT count(c.id) FROM tra_facility_inspection_compliances c inner JOIN par_facility_risk_items d ON c.facility_risk_item_id = d.id WHERE d.compliance_risk_scale_id = 1 AND c.premise_id = t1.premise_id AND c.pass_status_id = 2) BETWEEN ".$min_compliance->min_total_count. " AND ".$min_compliance->max_total_count. " AND (SELECT count(c.id) FROM tra_facility_inspection_compliances c inner JOIN par_facility_risk_items d ON c.facility_risk_item_id = d.id WHERE d.compliance_risk_scale_id = 2 AND c.premise_id = t1.premise_id AND c.pass_status_id = 2) BETWEEN ".$maj_compliance->min_total_count. " AND ".$maj_compliance->max_total_count." AND (SELECT count(c.id) FROM tra_facility_inspection_compliances c inner JOIN par_facility_risk_items d ON c.facility_risk_item_id = d.id WHERE d.compliance_risk_scale_id = 3 AND c.premise_id = t1.premise_id AND c.pass_status_id = 2) BETWEEN ".$crt_compliance->min_total_count. " AND ".$crt_compliance->max_total_count;

                    $maj_prem_qry = DB::table('tra_facility_inspection_compliances as t1')
                                    ->join('tra_premise_inspection_details as t2', 't1.inspection_id', 't2.id')
                                    ->join('tra_premises as t3', 't3.id', 't1.premise_id')
                                    ->leftjoin('par_facility_risk_items as t4', 't1.facility_risk_item_id', 't4.id')
                                    ->select('t1.premise_id')
                                    ->whereRAW($where);
                                    // ->get();
                    //dates filter as per duration
                    if($duration > 0){
                        $from = Carbon::now()->subYears($duration);
                        $to = Carbon::now();
                       $maj_prem_qry->whereDate('t2.start_date', '>', $from);
                       $maj_prem_qry->whereDate('t2.start_date', '<', $to);
                    }
                    $maj_prem_qry = $maj_prem_qry->get();
                    //rounds per years on low
                    $type_role = getSingleRecord('par_risk_based_inspection_cycles', ['risk_type_id' => 2]);
                    $times = $type_role->times;
                    $per_year = $type_role->per_year;
                    $mod = $times % $per_year;
                    $maj_rounds_per_year = ($times-$mod)/$per_year;

                    if($min_first){
                        $maj_rounds_this_year = $maj_rounds_per_year+$mod;
                        $maj_first=false;
                    }else {
                        $maj_rounds_this_year = $maj_rounds_per_year;
                    }

                    //Critical min_total_count
                    //distance risk
                    $distance = getSingleRecord('par_distance_risks', ['risk_type_id' => 3]);
                    //type role risk
                    $type_role = getSingleRecord('par_risk_premise_types_roles', ['risk_type_id' => 3]);
                    //compliance risk
                    $min_compliance = getSingleRecord('par_compliance_risk_scale_mapping', ['risk_type_id' => 3, 'compliance_risk_scale_id' => 1]);
                    $maj_compliance = getSingleRecord('par_compliance_risk_scale_mapping', ['risk_type_id' => 3, 'compliance_risk_scale_id' => 2]);
                    $crt_compliance = getSingleRecord('par_compliance_risk_scale_mapping', ['risk_type_id' => 3, 'compliance_risk_scale_id' => 3]);
                    //intrisic where
                   $where = "distance_kms <= ". $distance->maximum_kms." AND risk_premise_type_role_id = ".$type_role->id. " AND (SELECT count(c.id) FROM tra_facility_inspection_compliances c inner JOIN par_facility_risk_items d ON c.facility_risk_item_id = d.id WHERE d.compliance_risk_scale_id = 1 AND c.premise_id = t1.premise_id AND c.pass_status_id = 2) BETWEEN ".$min_compliance->min_total_count. " AND ".$min_compliance->max_total_count. " AND (SELECT count(c.id) FROM tra_facility_inspection_compliances c inner JOIN par_facility_risk_items d ON c.facility_risk_item_id = d.id WHERE d.compliance_risk_scale_id = 2 AND c.premise_id = t1.premise_id AND c.pass_status_id = 2) BETWEEN ".$maj_compliance->min_total_count. " AND ".$maj_compliance->max_total_count." AND (SELECT count(c.id) FROM tra_facility_inspection_compliances c inner JOIN par_facility_risk_items d ON c.facility_risk_item_id = d.id WHERE d.compliance_risk_scale_id = 3 AND c.premise_id = t1.premise_id AND c.pass_status_id = 2) BETWEEN ".$crt_compliance->min_total_count. " AND ".$crt_compliance->max_total_count;

                    $ctr_prem_qry = DB::table('tra_facility_inspection_compliances as t1')
                                    ->join('tra_premise_inspection_details as t2', 't1.inspection_id', 't2.id')
                                    ->join('tra_premises as t3', 't3.id', 't1.premise_id')
                                    ->leftjoin('par_facility_risk_items as t4', 't1.facility_risk_item_id', 't4.id')
                                    ->select('t1.premise_id')
                                    ->whereRAW($where);
                                    // ->get();
                    //dates filter as per duration
                    if($duration > 0){
                        $from = Carbon::now()->subYears($duration);
                        $to = Carbon::now();
                       $ctr_prem_qry->whereDate('t2.start_date', '>', $from);
                       $ctr_prem_qry->whereDate('t2.start_date', '<', $to);
                    }
                    $ctr_prem_qry = $ctr_prem_qry->get();
                    //rounds per years on Critical 
                    $type_role = getSingleRecord('par_risk_based_inspection_cycles', ['risk_type_id' => 3]);
                    $times = $type_role->times;
                    $per_year = $type_role->per_year;
                    $mod = $times % $per_year;
                    $crt_rounds_per_year = ($times-$mod)/$per_year;

                    if($min_first){
                        $crt_rounds_this_year = $crt_rounds_per_year+$mod;
                        $crt_first=false;
                    }else {
                        $crt_rounds_this_year = $crt_rounds_per_year;
                    }

                    $gretest_rounds = max($crt_rounds_this_year, $maj_rounds_this_year, $min_rounds_this_year);
                    for ($i=0; $i < $years_taken ; $i++) {
                        //create an implementation plan 
                        //create date
                        if($i > 0){
                            $sdate = Carbon::createFromFormat('Y-m-d', $start_date)->addYears($i);
                            $edate = Carbon::createFromFormat('Y-m-d', $start_date)->addYears(1);
                        }else{
                            $sdate = $start_date;
                            $edate = Carbon::createFromFormat('Y-m-d', $start_date)->addYears(1);
                        }
                        for ($k=0; $k < $gretest_rounds; $k++) {
                            //create an implementation
                            $data = array(
                                'schedule_implementation_name' => ($i+1).' Year of Implemantation'. ($k+1). " Round",
                                'schedule_id' => $schedule_id,
                                'implementationstart_date' => $sdate,
                                'implementationend_date' => $edate
                            );
                            $imp_r = insertRecord('tra_facility_program_implementationplan', $data);
                            if(!isset($imp_r['record_id'])){
                                return $imp_r;
                            }
                            $imp_id = $imp_r['record_id'];
                            
                            // add entries per year
                            $facility_list = [];
                            //minor fac
                            if($min_rounds_this_year >= $k){
                                foreach ($min_prem_qry as $facility) {
                                   $facility_list[] = array(
                                    'premise_id' => $facility->premise_id,
                                    'implementation_id' => $imp_id
                                   );
                                }
                                
                            }
                            if($maj_rounds_this_year >= $k){
                                foreach ($maj_prem_qry as $facility) {
                                   $facility_list[] = array(
                                    'premise_id' => $facility->premise_id,
                                    'implementation_id' => $imp_id
                                   );
                                }
                                
                            }
                            if($maj_rounds_this_year >= $k){
                                foreach ($ctr_prem_qry as $facility) {
                                   $facility_list[] = array(
                                    'premise_id' => $facility->premise_id,
                                    'implementation_id' => $imp_id
                                   );
                                }
                                
                            }
                            //insert to implementation facility list
                            $res = insertMultipleRecords('tra_implementation_plan_facilities_list', $facility_list);

                        }
                    }
                }
            DB::commit();

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getScheduledFacilityList(Request $req){
        $schedule_id = $req->schedule_id;
        $implementation_id = $req->implementation_id;
        $is_removed = $req->is_removed;
        try{
            $qry=DB::table('tra_implementation_plan_facilities_list as t1')
                ->join('tra_premises as t2', 't1.premise_id', 't2.id')
                ->leftjoin('tra_premiseinspection_applications as t3', 't1.premise_id', 't3.premise_id')
                // ->leftjoin('par_facility_risk_items as tt3', 't3.facility_risk_item_id', 'tt3.id')
                ->leftjoin('tra_facility_program_implementationplan as t4', 't1.implementation_id', 't4.id')
                ->leftjoin('tra_premise_inspection_details as t5', 't3.inspection_id', 't5.id')
                ->leftjoin('par_premises_types as t6', 't2.premise_type_id', 't6.id')
                ->leftjoin('par_districts as t7', 't2.district_id', 't7.id')
                ->leftjoin('par_regions as t8', 't2.region_id', 't8.id')
                ->select(DB::raw("t1.*, t2.name as facility_name,t2.distance_kms, t6.name as facility_type, t7.name as location,'t8.name as district', t5.start_date as last_inspection_date, SUM(t3.minor_compliances) as total_minor, SUM(t3.major_compliances) as total_major, SUM(t3.critical_compliances) as total_critical, t2.last_compliance_risk*t2.last_intrisic_risk as risk_rating, CASE WHEN t1.next_recommendations = '' THEN t3.manager_recommendation ELSE t1.next_recommendations END next_recommendations"))
                ->where('t1.implementation_id', $implementation_id)
                ->groupBy('t1.id', 't2.id','t3.manager_recommendation','t3.premise_id','t6.id', 't7.name', 't5.id', 't4.id');
            if(isset($is_removed)){
                $qry->where('t1.is_removed', $is_removed);
            }else{
                $qry->where('t1.is_removed', 0);
            }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'message' => 'All is well',
                'results' => $results
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function removeScheduleFacility(Request $req)
    {
        $id = $req->id;
        $table_name = $req->table_name;
        $reason = $req->reason;
        try{
            if(validateIsNumeric($id)){
               $res = updateRecord('tra_implementation_plan_facilities_list', ['id'=>$id], ['is_removed'=>1,'removal_reason'=>$reason]);
            }else{
                $res = array(
                    'success' => true,
                    'message' => 'All is well'
                );
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function restoreRemovedScheduleFacility(Request $req)
    {
        $id = $req->id;
        $table_name = $req->table_name;
        $reason = $req->reason;
        try{
            if(validateIsNumeric($id)){
               $res = updateRecord('tra_implementation_plan_facilities_list', ['id'=>$id], ['is_removed'=>0,'restore_reason'=>$reason]);
            }else{
                $res = array(
                    'success' => true,
                    'message' => 'All is well'
                );
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function saveNextExecutionRecommendation(Request $req)
    {
        $id = $req->id;
        $table_name = $req->table_name;
        $reason = $req->reason;
        try{
            if(validateIsNumeric($id)){
               $res = updateRecord('tra_implementation_plan_facilities_list', ['id'=>$id], ['next_recommendations'=>$reason]);
            }else{
                $res = array(
                    'success' => true,
                    'message' => 'All is well'
                );
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function submitFacilityScheduleForApproval(Request $req)
    {
        try{
            $selected = $req->input('selected');
            $schedules = json_decode($selected);
            $user_id = $this->user_id;
            $section_id = 8;
            $sub_module_id = 59;
            $module_id = 11;
            $zone_id = 1;
            $applicant_id = $user_id;
            $applications_table = 'tra_facilityschedule_applications';
            $res = array(
                        'success' => false,
                        'message' => 'No Schedule selected!!'
                    );
            
            //loop all selected programs
            foreach ($schedules as $schedule_id) {
                $schedule_id = $schedule_id->schedule_id;
                //check if already initialized 
                $check = recordExists($applications_table, ['schedule_id'=>$schedule_id]);

                if($check){
                    $res = array(
                        'success' => false,
                        'message' => 'Application already Submitted for approval!!'
                    );
                    return \response()->json($res);
                }
                DB::beginTransaction();
                //generate requested data 
                //get process id 
                $where = array(
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id
                );
                $process_id = DB::table('wf_processes')
                    ->where($where)
                    ->value('id');
                $workflow_stages =  DB::table('wf_processes as t1')
                        ->join('wf_workflows as t2', 't1.workflow_id', '=', 't2.id')
                        ->join('wf_workflow_stages as t3', function ($join) {
                            $join->on('t2.id', '=', 't3.workflow_id')
                                ->on('t3.stage_status', '=', DB::raw(1));
                        })
                        ->join('wf_workflow_interfaces as t4', 't3.interface_id', '=', 't4.id')
                        ->select('t4.viewtype', 't1.id as processId', 't1.name as processName', 't3.name as initialStageName', 't3.id as initialStageId', 't1.prodclass_category_id','t1.importexport_permittype_id','t1.premise_type_id')
                        ->where(['t1.module_id' => $module_id,'t1.sub_module_id' => $sub_module_id,'t1.section_id' => $section_id])
                        ->first();

                $workflow_stage_id = $workflow_stages->initialStageId;
                $section_code = getSingleRecordColValue('par_sections', array('id' => $section_id), 'code');
                $sub_module_code = getSingleRecordColValue('par_sub_modules', array('id' => $sub_module_id), 'code');
                $codes_array = array(
                            'section_code' => $section_code,
                            'sub_module_code' => $sub_module_code
                        );
                $view_id = generateApplicationViewID();
                $reference_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $process_id, $zone_id, $user_id, true);
                if ($reference_details['success'] == false) {
                    return \response()->json($reference_details);
                }
                $ref_no = $reference_details['tracking_no'];
                $application_code = generateApplicationCode($sub_module_id, $applications_table);
                $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
                if ($application_status->status_id == '') {
                    $res = array(
                        'success' => false,
                        'message' => 'Please set initial application status of the application!!'
                    );
                    return \response()->json($res);
                }
                $application_params = array(
                            'module_id' => $module_id,
                            'view_id' => $view_id,
                            'sub_module_id' => $sub_module_id,
                            'section_id' => $section_id,
                            'application_code' => $application_code,
                            'zone_id' => $zone_id,
                            'directorate_id' => 1,
                            'process_id' => $process_id,
                            'workflow_stage_id' => $workflow_stage_id,
                            'reference_no' => $ref_no,
                            'tracking_no' => $ref_no,
                            'stage_id' => 1,
                            'schedule_id' => $schedule_id,
                            'application_status_id' => 5
                        );
                //save application details 
                $res = insertRecord($applications_table, $application_params);
                
                if(!$res['success']){
                    return \response()->json($res);
                }
                $application_id = $res['record_id'];
                //add to processing pipeline
                $submission_params = array(
                    'application_id' => $application_id,
                    'view_id' => $view_id,
                    'process_id' => $process_id,
                    'application_code' => $application_code,
                    'reference_no' => $ref_no,
                    'usr_from' => $user_id,
                    'usr_to' => $user_id,
                    'previous_stage' => $workflow_stage_id,
                    'current_stage' => $workflow_stage_id,
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id,
                    'application_status_id' => $application_status->status_id,
                    'urgency' => 1,
                    'applicant_id' => $applicant_id,
                    'remarks' => 'Initial save of the application',
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                    'created_by' => $user_id
                );
                insertRecord('tra_submissions', $submission_params);
            }
            //commit transaction
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollback();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            DB::rollback();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getWorkflowFacilitySchedule(Request $req){
        $section_id = $req->input('section_id');
        $workflow_stage_id = $req->input('workflow_stage_id');
        $user_id = $this->user_id;
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        $assigned_stages = getAssignedProcessStages($user_id, 23);
        try {
            $qry = DB::table('tra_facility_schedule_details as t1')
                ->join('par_sections as t2', 't1.section_id', '=', 't2.id')
                ->join('tra_facilityschedule_applications as t4', 't1.id', '=', 't4.schedule_id')
                ->leftJoin('par_system_statuses as t5', 't4.application_status_id', '=', 't5.id')
                ->leftJoin('tra_facilityschedule_approvals as t6', 't4.application_code', '=', 't6.application_code')
                ->join('tra_submissions as t7', function ($join) {
                    $join->on('t4.application_code', '=', 't7.application_code')
                        ->where('is_done', 0);
                })
                ->leftJoin('wf_workflow_stages as t12', 't7.current_stage', 't12.id')
                ->leftJoin('tra_evaluation_recommendations as t13', function ($join) use($workflow_stage_id) {
                    $join->on('t4.application_code', '=', 't13.application_code')
                        ->on('t12.stage_category_id', '=', 't13.stage_category_id')
                        ->where('t7.current_stage', $workflow_stage_id);
                })

                ->leftJoin('tra_esignrequest_log as t21', function ($join) use($workflow_stage_id) {
                    $join->on('t4.application_code', '=', 't21.application_code')
                        ->where('t21.is_sent', 1)
                        ->where('t21.workflow_stage_id', $workflow_stage_id);
                })
                ->leftJoin('tra_esign_status as t22', 't21.status_id', 't22.id')

                ->select('t4.*','t1.*', 't2.name as section_name', 't1.name as pms_program','t1.id as schedule_id', 't5.name as status','t5.id as status_id','t4.id as active_application_id','t12.stage_category_id','t13.id as recommendation_record_id','t13.recommendation_id','t13.remarks','t6.decision_id', 't6.approval_remarks', 't6.id as approval_id','t6.sign_file','t6.approval_date', DB::raw("CASE WHEN t6.decision_id = 1 THEN 'Approved' WHEN t6.decision_id = 2 THEN 'Rejected' ElSE CONCAT('In Review', '(', t22.name, ' - ', t21.response_comment, ' )') End status"));
            //check access rights
            if(!$is_super){
                $qry->whereIn('t1.workflow_stage_id', $assigned_stages);
            }
            if(validateIsNumeric($workflow_stage_id)){
                $qry->where('t7.current_stage', $workflow_stage_id);
            }
            if (validateIsNumeric($section_id)) {
                $qry->where('t1.section_id', $section_id);
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
        return response()->json($res);
    }
    public function getApprovedInspectionSchedules(Request $req){
        $start_date = $req->start_date;
        $date = date("Y", strtotime($start_date));

        try{
            $qry = DB::table('tra_facility_schedule_details as t1');
            if($date != ''){
                $qry->whereYear('t1.start_date', '>=', $date);
            }
            $res = array('success' => true, 'message' => 'All is Well', 'results' => $qry->get());

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
}
<?php

namespace Modules\Migrations\Http\Controllers;

use App\Imports\HumanMedsScreeningImport;
use DateTime;
use Dotenv\Loader\Loader;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;


use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File as FacadesFile;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx as ReaderXlsx;


class MigrationsController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Renderable
     */



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
                $this->user_id =\Auth::user()->id;
                $this->branch_id =\Auth::user()->branch_id;
                return $next($request);
            });
        }

    }

    //HUMAN MEDICINES

    //fetch record
    public function gethmscreeningregister(Request $request){
        $migrations_db = DB::connection('migrations_db');

        $start = $request->start;
        $limit = $request->limit;
        //dd($start, $limit);

        $screeningregister = $migrations_db->table('mg_human_medicines_screening as t1' );

        // dd($screeningregister);

        $whereClauses = array();
        $filter = $request->filter;
        //dd($filter);
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'screening_no' :
                            $whereClauses[] = "screening_no like '%" . ($filter->value) . "%'";
                        break;
                        case 'date_received' :
                            $whereClauses[] = "date_received like '%" . ($filter->value) . "%'";
                        break;
                        case 'date_logged_in_rmu' :
                            $whereClauses[] = "date_logged_in_rmu like '%" . ($filter->value) . "%'";
                        break;
                        case 'fee_paid' :
                            $whereClauses[] = "fee_paid like '%" . ($filter->value) . "%'";
                        break;
                        case 'sales_quote' :
                            $whereClauses[] = "sales_quote like '%" . ($filter->value) . "%'";
                        break;

                        case 'rep_name' :
                            $whereClauses[] = "rep_name like '%" . ($filter->value) . "%'";
                        break;
                        case 'physical address' :
                            $whereClauses[] = "physical address like '%" . ($filter->value) . "%'";
                        break;
                        case 'applicant' :
                            $whereClauses[] = "applicant like '%" . ($filter->value) . "%'";
                        break;
                        case 'manufacturer' :
                            $whereClauses[] = "manufacturer like '%" . ($filter->value) . "%'";
                        break;
                        case 'product_name' :
                            $whereClauses[] = "product_name like '%" . ($filter->value) . "%'";
                        break;
                        case 'submitted_by' :
                            $whereClauses[] = "submitted_by like '%" . ($filter->value) . "%'";
                        break;
                        case 'logged_by' :
                            $whereClauses[] = "logged_by like '%" . ($filter->value) . "%'";
                        break;
                        case 'comments' :
                            $whereClauses[] = "comments like '%" . ($filter->value) . "%'";
                        break;
                        case 'allocation_date' :
                            $whereClauses[] = "allocation_date like '%" . ($filter->value) . "%'";
                        break;
                        case 'assesor' :
                            $whereClauses[] = "assesor like '%" . ($filter->value) . "%'";
                        break;
                        case 'total_screening_days' :
                            $whereClauses[] = "total_screening_days like '%" . ($filter->value) . "%'";
                        break;
                        case 'letter_ref' :
                            $whereClauses[] = "letter_ref like '%" . ($filter->value) . "%'";
                        break;
                        case 'date_dispatched_and_acknowledged' :
                            $whereClauses[] = "date_dispatched_and_acknowledged '%" . ($filter->value) . "%'";
                        break;
                        case 'results' :
                            $whereClauses[] = "results like '%" . ($filter->value) . "%'";
                        break;
                        case 'deadline' :
                            $whereClauses[] = "deadline like '%" . ($filter->value) . "%'";
                        break;
                        case 'assesment_pathway' :
                            $whereClauses[] = "assesment_pathway like '%" . ($filter->value) . "%'";
                        break;
                        case 'correspondence' :
                            $whereClauses[] = "correspondence like '%" . ($filter->value) . "%'";
                        break;
                        case 'time_to_allocation' :
                            $whereClauses[] = "time_to_allocation like '%" . ($filter->value) . "%'";
                        break;
                        case 'deposit_date' :
                            $whereClauses[] = "deposit_date like '%" . ($filter->value) . "%'";
                        break;






                    }
                }
                $whereClauses = array_filter($whereClauses);


            }

        }
        if (!empty($whereClauses))
            {
                $filter_string = implode(' AND ', $whereClauses);
                //dd($filter_string);
            }
        if ($filter_string != '')
            {
                $screeningregister->whereRAW($filter_string);
            }
            $total = $screeningregister->count();
            if(isset($start)&&isset($limit)){
                $results = $screeningregister->skip($start)->take($limit)->get();
            }
            else{
                $results=$screeningregister->get();
            }

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well',
                'total' => $total
            );

            return $res;

    }

    public function getresponsetohmscreeningregister(Request $request){
        // $date = "Friday,July 3,2020";
        // //dd(date("l ,M j,Y"));
        // dd(Carbon::createFromFormat('l , M j, Y', $date)->format('m-d-Y'));
        $migrations_db = DB::connection('migrations_db');
        try {
            $screeningregister = $migrations_db->table('mg_response_to_human_medicines_screening')->get();

            $whereClauses = array();

            $filter = $request->input('filter');

            $filter_string = '';

            if(isset($filter)){

                $filters = json_decode($filter);
                if($filters != NULL){
                    foreach($filters as $filter){
                        switch($filter->property){

                            case 'screening_no':
                                $whereClauses[] = "screening_no like '%" . ($filter->value) . "%'";
                                break;
                            case 'rmu_reference':
                                $whereClauses[] = "rmu_reference like '%" . ($filter->value) . "%'";
                                break;
                            case 'comments':
                                $whereClauses[] = "comments like '%" . ($filter->value) . "%'";
                                break;
                            case 'letter_ref':
                                $whereClauses[] = "letter_ref like '%" . ($filter->value) . "%'";
                            break;
                            case 'time_to_allocation':
                                $whereClauses[] = "time_to_allocation '%" . ($filter->value) . "%'";
                            break;
                            case 'total_screening_days':
                                $whereClauses[] = "total_screening_days like '%" . ($filter->value) . "%'";
                            break;


                        }
                    }
                    $whereClauses = array_filter($whereClauses);
                }

                if (!empty($whereClauses))
                    {
                        $filter_string = implode(' AND ', $whereClauses);
                    }
                if ($filter_string != '')
                    {
                        $screeningregister->whereRAW($filter_string);
                    }

            }



            $res = array(
                'success' => true,
                'results' => $screeningregister,
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    //update records
    public function saveDirtyData(Request $request){

        try {

            //fetching the dummy data
            $dirtyRecords = $request->input('params');
           // dd($request->input('params'));
           //conterting to json
            $params = json_decode($dirtyRecords);
            //$key_for_params = array_keys($params);
            // $records = convertStdClassObjToArray($params);
            $user_id = \Auth::user()->id;
           //dd($records['id']);
             $res = array(
                'success' => false,
                'message' => 'no data shared',
            );
            $migrations_db = DB::connection('migrations_db');
            foreach($params as $data){



                $records = convertStdClassObjToArray($data);
                // dd($records);

                //updateRecord('mg_human_medicines_screening', ['id'=>$records['id']],$records, $user_id, $migrations_db );
                //dd($res);
                $migrations_db->table('mg_human_medicines_screening')->where(['id'=>$records['id']])->update($records);

            }

            $res = array(
                'success' => true,
                'message' => 'data successfully updated',
            );


        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);


    }



    public function saveDirtyDataforResponseToHumanMedsScreening(Request $request){
        try {

            //fetching the dummy data
            $dirtyRecords = $request->input('params');
           // dd($request->input('params'));
           //conterting to json
            $params = json_decode($dirtyRecords);
            //$key_for_params = array_keys($params);
            // $records = convertStdClassObjToArray($params);
            $user_id = \Auth::user()->id;
           //dd($records['id']);
             $res = array(
                'success' => false,
                'message' => 'no data shared',
            );
            $migrations_db = DB::connection('migrations_db');
            foreach($params as $data){



                $records = convertStdClassObjToArray($data);
                // dd($records);

                //updateRecord('mg_response_to_human_medicines_screening', ['id'=>$records['id']],$records, $user_id, $migrations_db );
                //dd($res);
                $migrations_db->table('mg_response_to_human_medicines_screening')->where(['id'=>$records['id']])->update($records);

            }

            $res = array(
                'success' => true,
                'message' => 'date successfully updated',
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    //upload vet excel
    public function uploadExcelSheetForVetMedsScreening(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(2);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];


            $migrations_db->beginTransaction();
            DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {


                $registration_no = ($activesheet->getCell("H{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("H{$row}")->getValue();

                if($registration_no != ''){
                    if(!$migrations_db->table('mg_human_medicines_screening')->where('screening_no','=',$registration_no)->exists()){

                        $common_name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("A{$row}")->getFormattedValue();
                        $brand_name = ($activesheet->getCell("B{$row}")->getValue() == '') ? NULL : $activesheet->getCell("B{$row}")->getFormattedValue();
                        // $date_logged_in_rmu = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getFormattedValue();
                        $pack_size = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getValue();
                        // $schedule = ($activesheet->getCell("F{$row}")->getValue() == '') ? NULL : $activesheet->getCell("F{$row}")->getValue();
                        $proposed_schedule = ($activesheet->getCell("G{$row}")->getValue() == '') ? NULL : $activesheet->getCell("G{$row}")->getValue();
                        // $rep_telephone_no = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getValue();
                        // $rep_email = ($activesheet->getCell("I{$row}")->getValue() == '') ? NULL : $activesheet->getCell("I{$row}")->getValue();
                        // $rep_physical_address = ($activesheet->getCell("J{$row}")->getValue() == '') ? NULL : $activesheet->getCell("J{$row}")->getValue();
                        // $applicant_name = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                        // $applicant_physical_address = ($activesheet->getCell("L{$row}")->getValue() == '') ? NULL : $activesheet->getCell("L{$row}")->getValue();
                        // $applicant_telephone_no = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                        // $applicant_email = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                        // $brand_name = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();
                        // $common_name = ($activesheet->getCell("P{$row}")->getValue() == '') ? NULL : $activesheet->getCell("P{$row}")->getValue();
                        // $ingredient = ($activesheet->getCell("Q{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Q{$row}")->getValue();
                        // $dosage_form = ($activesheet->getCell("R{$row}")->getValue() == '') ? NULL : $activesheet->getCell("R{$row}")->getValue();
                        // $strength = ($activesheet->getCell("S{$row}")->getValue() == '') ? NULL : $activesheet->getCell("S{$row}")->getValue();
                        // $Route_of_admin = ($activesheet->getCell("T{$row}")->getValue() == '') ? NULL : $activesheet->getCell("T{$row}")->getValue();
                        // $storage_condition = ($activesheet->getCell("U{$row}")->getValue() == '') ? NULL : $activesheet->getCell("U{$row}")->getValue();
                        // $physical_desc = ($activesheet->getCell("V{$row}")->getValue() == '') ? NULL : $activesheet->getCell("V{$row}")->getValue();
                        // $indication = ($activesheet->getCell("W{$row}")->getValue() == '') ? NULL : $activesheet->getCell("W{$row}")->getValue();
                        // $shelf_life = ($activesheet->getCell("X{$row}")->getValue() == '') ? NULL : $activesheet->getCell("X{$row}")->getValue();
                        // $manufacturer_name = ($activesheet->getCell("Y{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Y{$row}")->getValue();
                        // $manufacturer_physical_address = ($activesheet->getCell("Z{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Z{$row}")->getValue();
                        // $container_closure = ($activesheet->getCell("AA{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AA{$row}")->getValue();
                        // $pack_size = ($activesheet->getCell("AB{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AB{$row}")->getValue();
                       

                        // $date_received_converted = strtotime($date_received);
                        // $date_received_fmt = date('Y-m-d',$date_received_converted);
                        // $new_date_received_fmt = ($date_received_fmt == '1970-01-01') ? NULL : $date_received_fmt;

                        // $date_logged_in_rmu_converted = strtotime($date_logged_in_rmu);
                        // $date_logged_in_rmu_fmt =   date('Y-m-d',$date_logged_in_rmu_converted);
                        // $new_date_logged_in_rmu_fmt = ($date_logged_in_rmu_fmt == '1970-01-01') ? NULL : $date_logged_in_rmu_fmt;

                       

                        $data_to_be_inserted [] = [

                            //'id' => $id,
                            "screening_no" => $registration_no,
                            "registration_no" => $registration_no,
                            // "date_received" => $new_date_received_fmt,
                            // "date_logged_in_rmu" => $new_date_logged_in_rmu_fmt,
                            // "fee_paid" => $fee_paid,
                            // "sales_quote" => $sales_quote,
                            // "rep_name" => $rep_name,
                            // "rep_email" => $rep_email,
                            // "rep_phone" => $rep_telephone_no,
                            // "rep_physical_address" => $rep_physical_address,
                            // "rep_country" => $rep_country,
                            // "rep_postal_address" => $rep_postal_address,
                            // "applicant_name" => $applicant_name,
                            // "applicant_email" => $applicant_email,
                            // "applicant_postal_address" => $applicant_postal_address,
                            // "applicant_physical_address" => $applicant_physical_address,
                            // "applicant_telephone_no" => $applicant_telephone_no,
                            // "applicant_country" => $applicant_country,
                            // "applicant_region" => $applicant_region,
                            // "manufacturer" => $manufacturer_name,
                            // "manufacturer_email" => $manufacturer_email,
                            // "manufacturer_physical_address" => $manufacturer_physical_address,
                            // "api_manufacturer_name" => $api_manufacturer_name,
                            // "api_manufacturer_physical_address" => $api_manufacturer_physical_address,
                            // "api_manufacturer_telephone" => $api_manufacturer_telephone,
                            // "api_manufacturer_country" => $api_manufacturer_country,
                            // "api_manufacturer_region" => $api_manufacturer_region,
                            "product_name" => $brand_name,
                            "common_name" => $common_name,
                            // "dosage" => $dosage_form,
                            // "strength" => $strength,
                            // "Route_of_admin" => $Route_of_admin,
                            // "storage_condition" => $storage_condition,
                            // "physical_desc" => $physical_desc,
                            // "indication" => $indication,
                            // "use_instruction" => $use_instruction,
                            // "shelf_life" => $shelf_life,
                            "pack_size" => $pack_size,
                            "section_id" => 3,
                            "sub_module_id" => 7
                            // "country_of_origin" => $country_of_origin,
                            // "schedule" => $schedule,
                            // "ingredient" => $ingredient,
                            // "ingredient_quantity" => $ingredient_quantity,
                            // "ingredient_si_unit" => $ingredient_si_unit,
                            // "inclusion_reason" => $inclusion_reason,
                            // "container" => $container,
                            // "container_closure" => $container_closure,
                            // "retail_packaging_size" => $retail_packaging_size,
                            // "retail_packaging_unit" => $retail_packaging_unit,
                            // "letter_ref" => $letter_ref,
                            // "results" => $results,
                            // "deadline"  => $new_deadline_fmt,
                            // "assesment_pathway" => $assesment_pathway,
                            // "correspondence" => $new_correspondence_fmt,
                        ];
                    }

                }

            }

            //screening register operations
            $screening_register_collection = collect($data_to_be_inserted);
            $screening_register_chunks = $screening_register_collection->chunk(50);

            foreach($screening_register_chunks as $chunk){
                $migrations_db->table('mg_human_medicines_screening')->insert($chunk->toArray());
            }

            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $data_to_be_inserted

            );




            $migrations_db->commit();
            DB::commit();

            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }
    //pick excel sheet form and dump its data to data base
    public function uploadExcelSheetForMedsListing(Request $request){
      
        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();
            
                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);
            
        for ($i=0; $i < 1; $i++) { //loop through sheets
            $activesheet = $spreadsheet->getSheet($i); //with gmdn

                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
   
            $migrations_db = DB::connection('migrations_db');
           
            $data_to_be_inserted  = [];
            // $migrations_db->beginTransaction();
            $migrations_db->beginTransaction();
            for($row = 3 ; $row <= $rowswithintheactivesheet; $row++)
                {
                    $screening_number = ($activesheet->getCell("H{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("H{$row}")->getValue();
                    
                    if($screening_number != ''){
                        if(!$migrations_db->table('mg_medical_device_listing')->where('tracking_no','=',$screening_number)->exists()){
                           $device_type = ($activesheet->getCell("F{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("F{$row}")->getFormattedValue();
                           //manufacturer
                            $manufacturer = ($activesheet->getCell("G{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("G{$row}")->getFormattedValue();
                            // $manufacturer_physical_address = ($activesheet->getCell("P{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("P{$row}")->getFormattedValue();
                            // $manufacturer_telephone = ($activesheet->getCell("Q{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("Q{$row}")->getFormattedValue();
                            
                            $common_name = ($activesheet->getCell("A{$row}")->getValue() == '') ? NULL : $activesheet->getCell("A{$row}")->getFormattedValue();
                            
                            $brand_name = ($activesheet->getCell("B{$row}")->getValue() == '') ? NULL : $activesheet->getCell("B{$row}")->getValue();
                            $model = ($activesheet->getCell("C{$row}")->getValue() == '') ? NULL : $activesheet->getCell("C{$row}")->getValue();
                            $gmdn_term = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getValue();
                            // $intended_use = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getValue();
                            $gmdn_code = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getValue();
                            // $risk_class = ($activesheet->getCell("J{$row}")->getValue() == '') ? NULL : $activesheet->getCell("J{$row}")->getValue();
                            // $software_version = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                            // $lifespan = ($activesheet->getCell("L{$row}")->getValue() == '') ? NULL : $activesheet->getCell("L{$row}")->getValue();
                            // $applicant = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();
                            // $intended_use = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                            // $comment = ($activesheet->getCell("S{$row}")->getValue() == '') ? NULL : $activesheet->getCell("S{$row}")->getValue();

                           
                            
                            $data_to_be_inserted [] = [
                                "device_type" => $device_type,
                                'tracking_no' => $screening_number,
                                "manufacturer" => $manufacturer,
                                "common_name" => $common_name,
                                "brand_name" => $brand_name,
                                "model" => $model,
                                // "remarks" => $comment,
                                "gmdn_code" => $gmdn_code,
                                // "risk_class" => $risk_class,
                                // "software_version" => $software_version,
                                // "lifespan" => $lifespan,
                                // "applicant" => $applicant,
                                'gmdn_term' => $gmdn_term,
                                // "intended_use" => $intended_use,
                                // "manufacturer_physical_address" =>$manufacturer_physical_address,
                                // "manufacturer_telephone" =>$manufacturer_telephone,
                                "section_id" => 4,
                                "sub_module_id" => 79
                            ];

                        }
                    
                    }
                
                }
               
                //screening register operations
                $screening_register_collection = collect($data_to_be_inserted);
                $screening_register_chunks = $screening_register_collection->chunk(50);

                foreach($screening_register_chunks as $chunk){
                    $migrations_db->table('mg_medical_device_listing')->insert($chunk->toArray());
                }
                $data_to_be_inserted = [];
                $migrations_db->commit();
            }
            

            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $data_to_be_inserted
                
            );
            



            // $migrations_db->commit();
            // DB::commit();
           
            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
           // $migrations_db->rollBack();
            DB::rollBack();
            
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
           // $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }
     //pick excel sheet form and dump its data to data base
    public function uploadExcelSheetForCompMedsScreening(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(0);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];


            $migrations_db->beginTransaction();
            DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {


                $screening_number = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("B{$row}")->getValue();

                if($screening_number != ''){
                    if(!$migrations_db->table('mg_human_medicines_screening')->where('screening_no','=',$screening_number)->exists()){

                        $date_received = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("C{$row}")->getFormattedValue();
                        $date_logged_in_rmu = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getFormattedValue();
                        $fee_paid = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getValue();
                        $sales_quote = ($activesheet->getCell("F{$row}")->getValue() == '') ? NULL : $activesheet->getCell("F{$row}")->getValue();
                        $rep_name = ($activesheet->getCell("G{$row}")->getValue() == '') ? NULL : $activesheet->getCell("G{$row}")->getValue();
                        $rep_telephone_no = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getValue();
                        $rep_email = ($activesheet->getCell("I{$row}")->getValue() == '') ? NULL : $activesheet->getCell("I{$row}")->getValue();
                        $rep_physical_address = ($activesheet->getCell("J{$row}")->getValue() == '') ? NULL : $activesheet->getCell("J{$row}")->getValue();
                        $applicant_name = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                        $applicant_physical_address = ($activesheet->getCell("L{$row}")->getValue() == '') ? NULL : $activesheet->getCell("L{$row}")->getValue();
                        $applicant_telephone_no = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                        $applicant_email = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                        $brand_name = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();
                        $common_name = ($activesheet->getCell("P{$row}")->getValue() == '') ? NULL : $activesheet->getCell("P{$row}")->getValue();
                        $ingredient = ($activesheet->getCell("Q{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Q{$row}")->getValue();
                        $dosage_form = ($activesheet->getCell("R{$row}")->getValue() == '') ? NULL : $activesheet->getCell("R{$row}")->getValue();
                        $strength = ($activesheet->getCell("S{$row}")->getValue() == '') ? NULL : $activesheet->getCell("S{$row}")->getValue();
                        $Route_of_admin = ($activesheet->getCell("T{$row}")->getValue() == '') ? NULL : $activesheet->getCell("T{$row}")->getValue();
                        $storage_condition = ($activesheet->getCell("U{$row}")->getValue() == '') ? NULL : $activesheet->getCell("U{$row}")->getValue();
                        $physical_desc = ($activesheet->getCell("V{$row}")->getValue() == '') ? NULL : $activesheet->getCell("V{$row}")->getValue();
                        $indication = ($activesheet->getCell("W{$row}")->getValue() == '') ? NULL : $activesheet->getCell("W{$row}")->getValue();
                        $shelf_life = ($activesheet->getCell("X{$row}")->getValue() == '') ? NULL : $activesheet->getCell("X{$row}")->getValue();
                        $manufacturer_name = ($activesheet->getCell("Y{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Y{$row}")->getValue();
                        $manufacturer_physical_address = ($activesheet->getCell("Z{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Z{$row}")->getValue();
                        $container_closure = ($activesheet->getCell("AA{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AA{$row}")->getValue();
                        $pack_size = ($activesheet->getCell("AB{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AB{$row}")->getValue();
                       

                        $date_received_converted = strtotime($date_received);
                        $date_received_fmt = date('Y-m-d',$date_received_converted);
                        $new_date_received_fmt = ($date_received_fmt == '1970-01-01') ? NULL : $date_received_fmt;

                        $date_logged_in_rmu_converted = strtotime($date_logged_in_rmu);
                        $date_logged_in_rmu_fmt =   date('Y-m-d',$date_logged_in_rmu_converted);
                        $new_date_logged_in_rmu_fmt = ($date_logged_in_rmu_fmt == '1970-01-01') ? NULL : $date_logged_in_rmu_fmt;

                       

                        $data_to_be_inserted [] = [

                            //'id' => $id,
                            "screening_no" => $screening_number,
                            "date_received" => $new_date_received_fmt,
                            "date_logged_in_rmu" => $new_date_logged_in_rmu_fmt,
                            "fee_paid" => $fee_paid,
                            "sales_quote" => $sales_quote,
                            "rep_name" => $rep_name,
                            "rep_email" => $rep_email,
                            "rep_phone" => $rep_telephone_no,
                            "rep_physical_address" => $rep_physical_address,
                            // "rep_country" => $rep_country,
                            // "rep_postal_address" => $rep_postal_address,
                            "applicant_name" => $applicant_name,
                            "applicant_email" => $applicant_email,
                            // "applicant_postal_address" => $applicant_postal_address,
                            "applicant_physical_address" => $applicant_physical_address,
                            "applicant_telephone_no" => $applicant_telephone_no,
                            // "applicant_country" => $applicant_country,
                            // "applicant_region" => $applicant_region,
                            "manufacturer" => $manufacturer_name,
                            // "manufacturer_email" => $manufacturer_email,
                            "manufacturer_physical_address" => $manufacturer_physical_address,
                            // "api_manufacturer_name" => $api_manufacturer_name,
                            // "api_manufacturer_physical_address" => $api_manufacturer_physical_address,
                            // "api_manufacturer_telephone" => $api_manufacturer_telephone,
                            // "api_manufacturer_country" => $api_manufacturer_country,
                            // "api_manufacturer_region" => $api_manufacturer_region,
                            "product_name" => $brand_name,
                            "common_name" => $common_name,
                            "dosage" => $dosage_form,
                            "strength" => $strength,
                            "Route_of_admin" => $Route_of_admin,
                            "storage_condition" => $storage_condition,
                            "physical_desc" => $physical_desc,
                            "indication" => $indication,
                            // "use_instruction" => $use_instruction,
                            "shelf_life" => $shelf_life,
                            "pack_size" => $pack_size,
                            // "country_of_origin" => $country_of_origin,
                            // "schedule" => $schedule,
                            "ingredient" => $ingredient,
                            // "ingredient_quantity" => $ingredient_quantity,
                            // "ingredient_si_unit" => $ingredient_si_unit,
                            // "inclusion_reason" => $inclusion_reason,
                            // "container" => $container,
                            // "container_closure" => $container_closure,
                            // "retail_packaging_size" => $retail_packaging_size,
                            // "retail_packaging_unit" => $retail_packaging_unit,
                            // "letter_ref" => $letter_ref,
                            // "results" => $results,
                            // "deadline"  => $new_deadline_fmt,
                            // "assesment_pathway" => $assesment_pathway,
                            // "correspondence" => $new_correspondence_fmt,
                            "section_id" => 10,
                            "sub_module_id" => 7
                        ];
                    }

                }

            }

            //screening register operations
            $screening_register_collection = collect($data_to_be_inserted);
            $screening_register_chunks = $screening_register_collection->chunk(50);

            foreach($screening_register_chunks as $chunk){
                $migrations_db->table('mg_human_medicines_screening')->insert($chunk->toArray());
            }

            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $data_to_be_inserted

            );




            $migrations_db->commit();
            DB::commit();

            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }

    //pick excel sheet form and dump its data to data base
    public function uploadExcelSheetForHumanMedsScreening(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(0);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];


            $migrations_db->beginTransaction();
            DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {


                $screening_number = ($activesheet->getCell("BK{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("BK{$row}")->getValue();

                if($screening_number != ''){
                    if(!$migrations_db->table('mg_human_medicines_screening')->where('screening_no','=',$screening_number)->exists()){

                        $brand_name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("A{$row}")->getFormattedValue();
                        $common_name = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("B{$row}")->getFormattedValue();
                        $dosage_form = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("C{$row}")->getFormattedValue();
                        $strength = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getFormattedValue();
                        $Route_of_admin = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getValue();
                        $storage_condition = ($activesheet->getCell("F{$row}")->getValue() == '') ? NULL : $activesheet->getCell("F{$row}")->getValue();
                        $physical_desc = ($activesheet->getCell("G{$row}")->getValue() == '') ? NULL : $activesheet->getCell("G{$row}")->getValue();
                        $indication = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getValue();
                        $use_instruction = ($activesheet->getCell("I{$row}")->getValue() == '') ? NULL : $activesheet->getCell("I{$row}")->getValue();
                        $shelf_life = ($activesheet->getCell("J{$row}")->getValue() == '') ? NULL : $activesheet->getCell("J{$row}")->getValue();
                        $pack_size = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                        $country_of_origin = ($activesheet->getCell("L{$row}")->getValue() == '') ? NULL : $activesheet->getCell("L{$row}")->getValue();
                        $schedule = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                        $manufacturer_email = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                        $manufacturer_name = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();
                        $manufacturer_physical_address = ($activesheet->getCell("P{$row}")->getValue() == '') ? NULL : $activesheet->getCell("P{$row}")->getValue();
                        $api_manufacturer_name = ($activesheet->getCell("Q{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Q{$row}")->getValue();
                        $api_manufacturer_physical_address = ($activesheet->getCell("R{$row}")->getValue() == '') ? NULL : $activesheet->getCell("R{$row}")->getValue();
                        $api_manufacturer_telephone = ($activesheet->getCell("S{$row}")->getValue() == '') ? NULL : $activesheet->getCell("S{$row}")->getValue();
                        $api_manufacturer_country = ($activesheet->getCell("T{$row}")->getValue() == '') ? NULL : $activesheet->getCell("T{$row}")->getValue();
                        $api_manufacturer_region = ($activesheet->getCell("U{$row}")->getValue() == '') ? NULL : $activesheet->getCell("U{$row}")->getValue();
                        $ingredient = ($activesheet->getCell("V{$row}")->getValue() == '') ? NULL : $activesheet->getCell("V{$row}")->getValue();
                       // $Route_of_admin = ($activesheet->getCell("W{$row}")->getValue() == '') ? NULL : $activesheet->getCell("W{$row}")->getValue();
                        $ingredient_quantity = ($activesheet->getCell("X{$row}")->getValue() == '') ? NULL : $activesheet->getCell("X{$row}")->getValue();
                        $ingredient_si_unit = ($activesheet->getCell("Y{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Y{$row}")->getValue();
                        $inclusion_reason = ($activesheet->getCell("Z{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Z{$row}")->getValue();
                        $container = ($activesheet->getCell("AA{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AA{$row}")->getValue();
                        $container_closure = ($activesheet->getCell("AB{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AB{$row}")->getValue();
                        // $country_of_origin = ($activesheet->getCell("AC{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AC{$row}")->getValue();
                        $retail_packaging_size = ($activesheet->getCell("AD{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AD{$row}")->getValue();
                        $retail_packaging_unit = ($activesheet->getCell("AE{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AE{$row}")->getValue();
                        $applicant_name = ($activesheet->getCell("AF{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AF{$row}")->getValue();
                        $applicant_email = ($activesheet->getCell("AG{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AG{$row}")->getValue();
                        $applicant_postal_address = ($activesheet->getCell("AH{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AH{$row}")->getValue();
                        $applicant_physical_address = ($activesheet->getCell("AI{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AI{$row}")->getValue();
                        $applicant_telephone_no = ($activesheet->getCell("AJ{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AJ{$row}")->getValue();
                        $applicant_country = ($activesheet->getCell("AK{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AK{$row}")->getValue();
                        $applicant_region = ($activesheet->getCell("AL{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AL{$row}")->getValue();
                        $rep_name = ($activesheet->getCell("AN{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AN{$row}")->getValue();
                        $rep_email = ($activesheet->getCell("AO{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AO{$row}")->getValue();
                        $rep_postal_address = ($activesheet->getCell("AP{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AP{$row}")->getValue();
                        $rep_physical_address = ($activesheet->getCell("AQ{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AQ{$row}")->getValue();
                        $rep_telephone_no = ($activesheet->getCell("AR{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AR{$row}")->getValue();
                        $rep_country = ($activesheet->getCell("AS{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AS{$row}")->getValue();
                        // $rep_country = ($activesheet->getCell("AT{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AT{$row}")->getValue();
                        $date_received = ($activesheet->getCell("AU{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AU{$row}")->getValue();
                        $date_logged_in_rmu = ($activesheet->getCell("AV{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AV{$row}")->getValue();
                        

                        $fee_paid = ($activesheet->getCell("BI{$row}")->getValue() == '') ? NULL : $activesheet->getCell("BI{$row}")->getValue();
                        $sales_quote = ($activesheet->getCell("BH{$row}")->getValue() == '') ? NULL : $activesheet->getCell("BH{$row}")->getValue();

                        $letter_ref = ($activesheet->getCell("BG{$row}")->getValue() == '') ? NULL : $activesheet->getCell("BG{$row}")->getValue();
                        // $allocation_date = ($activesheet->getCell("O{$row}")->getFormattedValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getFormattedValue();
                        // // // ($allocation_date);
                        // $assesor = ($activesheet->getCell("P{$row}")->getValue() == '') ? NULL : $activesheet->getCell("P{$row}")->getValue();
                        // $correspondence = ($activesheet->getCell("Q{$row}")->getFormattedValue() == '') ? NULL : $activesheet->getCell("Q{$row}")->getFormattedValue();
                        // $time_to_allocate = ($activesheet->getCell("R{$row}")->getCalculatedValue() == '' ) ? NULL : $activesheet->getCell("R{$row}")->getCalculatedValue();
                        // $total_screening_days = ($activesheet->getCell("S{$row}")->getCalculatedValue() == '') ? NULL :  $activesheet->getCell("S{$row}")->getCalculatedValue();
                        // $deposit_date = ($activesheet->getCell("T{$row}")->getValue() == '' || $activesheet->getCell("T{$row}")->getValue() ==  'N/A') ? NULL : $activesheet->getCell("T{$row}")->getFormattedValue();
                        // //dd($deposit_date);
                        // $letter_ref = ($activesheet->getCell("U{$row}")->getValue() == '') ? NULL : $activesheet->getCell("U{$row}")->getValue();

                        // $date_dispatched_and_acknowledged = ($activesheet->getCell("V{$row}")->getFormattedValue() == '' || $activesheet->getCell("V{$row}")->getFormattedValue() == 'N/A') ? NULL : $activesheet->getCell("V{$row}")->getFormattedValue();
                        // //dd($date_dispatched_and_acknowledged);
                        // $results = ($activesheet->getCell("W{$row}")->getValue() == '') ? NULL : $activesheet->getCell("W{$row}")->getValue();

                        // $deadline = ($activesheet->getCell("X{$row}")->getFormattedValue() == '' || $activesheet->getCell("X{$row}")->getFormattedValue() == 'N/A' ) ? NULL : $activesheet->getCell("X{$row}")->getFormattedValue();
                        // //dd($deadline);
                        // $assesment_pathway = ($activesheet->getCell("Y{$row}")->getValue() == '' || $activesheet->getCell("Y{$row}")->getValue() == 'N/A' ) ? NULL : $activesheet->getCell("Y{$row}")->getValue();

                        $date_received_converted = strtotime($date_received);
                        $date_received_fmt = date('Y-m-d',$date_received_converted);
                        $new_date_received_fmt = ($date_received_fmt == '1970-01-01') ? NULL : $date_received_fmt;

                        $date_logged_in_rmu_converted = strtotime($date_logged_in_rmu);
                        $date_logged_in_rmu_fmt =   date('Y-m-d',$date_logged_in_rmu_converted);
                        $new_date_logged_in_rmu_fmt = ($date_logged_in_rmu_fmt == '1970-01-01') ? NULL : $date_logged_in_rmu_fmt;

                        // $allocation_date_converted = strtotime($allocation_date);
                        // $allocation_date_fmt  = date('Y-m-d', $allocation_date_converted);
                        // $new_allocation_date_fmt = ($allocation_date_fmt == '1970-01-01') ? NULL : $allocation_date_fmt;

                        // $deposit_date_converted = strtotime($deposit_date);
                        // $deposit_date_fmt =  date('Y-m-d',$deposit_date_converted);
                        // $new_deposit_date_fmt = ($deposit_date_fmt == '1970-01-01') ? NULL : $deposit_date_fmt;

                        // $date_dispatched_and_acknowledged_converted = strtotime($date_dispatched_and_acknowledged);
                        // $date_dispatched_and_acknowledged_fmt =  date('Y-m-d',$date_dispatched_and_acknowledged_converted);
                        // $new_date_dispatched_and_acknowledged_fmt = ($date_dispatched_and_acknowledged_fmt == '1970-01-01') ? NULL : $date_dispatched_and_acknowledged_fmt;

                        // $deadline_converted = strtotime($deadline);
                        // $deadline_fmt = date('Y-m-d',$deadline_converted);
                        // $new_deadline_fmt = ($deadline_fmt == '1970-01-01') ? NULL : $deadline_fmt;

                        // $correspondence_converted = strtotime($correspondence);
                        // $correspondence_fmt= date('Y-m-d', $correspondence_converted);
                        // $new_correspondence_fmt = ($correspondence_fmt == '1970-01-01') ? NULL : $correspondence_fmt;

                        $data_to_be_inserted [] = [

                            //'id' => $id,
                            "screening_no" => $screening_number,
                            "date_received" => $new_date_received_fmt,
                            "date_logged_in_rmu" => $new_date_logged_in_rmu_fmt,
                            "fee_paid" => $fee_paid,
                            "sales_quote" => $sales_quote,
                            "rep_name" => $rep_name,
                            "rep_email" => $rep_email,
                            "rep_phone" => $rep_telephone_no,
                            "rep_physical_address" => $rep_physical_address,
                            "rep_country" => $rep_country,
                            "rep_postal_address" => $rep_postal_address,
                            "applicant_name" => $applicant_name,
                            "applicant_email" => $applicant_email,
                            "applicant_postal_address" => $applicant_postal_address,
                            "applicant_physical_address" => $applicant_physical_address,
                            "applicant_telephone_no" => $applicant_telephone_no,
                            "applicant_country" => $applicant_country,
                            "applicant_region" => $applicant_region,
                            "manufacturer" => $manufacturer_name,
                            "manufacturer_email" => $manufacturer_email,
                            "manufacturer_physical_address" => $manufacturer_physical_address,
                            "api_manufacturer_name" => $api_manufacturer_name,
                            "api_manufacturer_physical_address" => $api_manufacturer_physical_address,
                            "api_manufacturer_telephone" => $api_manufacturer_telephone,
                            "api_manufacturer_country" => $api_manufacturer_country,
                            "api_manufacturer_region" => $api_manufacturer_region,
                            "product_name" => $brand_name,
                            "common_name" => $common_name,
                            "dosage" => $dosage_form,
                            "strength" => $strength,
                            "Route_of_admin" => $Route_of_admin,
                            "storage_condition" => $storage_condition,
                            "physical_desc" => $physical_desc,
                            "indication" => $indication,
                            "use_instruction" => $use_instruction,
                            "shelf_life" => $shelf_life,
                            "pack_size" => $pack_size,
                            "country_of_origin" => $country_of_origin,
                            "schedule" => $schedule,
                            "ingredient" => $ingredient,
                            "ingredient_quantity" => $ingredient_quantity,
                            "ingredient_si_unit" => $ingredient_si_unit,
                            "inclusion_reason" => $inclusion_reason,
                            "container" => $container,
                            "container_closure" => $container_closure,
                            "retail_packaging_size" => $retail_packaging_size,
                            "retail_packaging_unit" => $retail_packaging_unit,
                            "letter_ref" => $letter_ref,
                            "section_id" => 2,
                            "sub_module_id" => 7
                            // "results" => $results,
                            // "deadline"  => $new_deadline_fmt,
                            // "assesment_pathway" => $assesment_pathway,
                            // "correspondence" => $new_correspondence_fmt,
                        ];
                    }

                }

            }

            //screening register operations
            $screening_register_collection = collect($data_to_be_inserted);
            $screening_register_chunks = $screening_register_collection->chunk(50);

            foreach($screening_register_chunks as $chunk){
                $migrations_db->table('mg_human_medicines_screening')->insert($chunk->toArray());
            }

            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $data_to_be_inserted

            );




            $migrations_db->commit();
            DB::commit();

            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }
     public function uploadExcelSheetForUncleanHumanMedsScreening(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(0);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];


            $migrations_db->beginTransaction();
            DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {


                $screening_number = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("B{$row}")->getValue();

                if($screening_number != ''){
                    if(!$migrations_db->table('mg_human_medicines_screening')->where('screening_no','=',$screening_number)->exists()){

                        $brand_name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("A{$row}")->getFormattedValue();
                        // $common_name = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("B{$row}")->getFormattedValue();
                        $date_received = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("C{$row}")->getFormattedValue();
                        $date_logged_in_rmu = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getFormattedValue();
                        $fee_paid = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getValue();
                        $sales_quote = ($activesheet->getCell("F{$row}")->getValue() == '') ? NULL : $activesheet->getCell("F{$row}")->getValue();
                        // $physical_desc = ($activesheet->getCell("G{$row}")->getValue() == '') ? NULL : $activesheet->getCell("G{$row}")->getValue();
                        // $indication = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getValue();
                        // $use_instruction = ($activesheet->getCell("I{$row}")->getValue() == '') ? NULL : $activesheet->getCell("I{$row}")->getValue();
                        // $shelf_life = ($activesheet->getCell("J{$row}")->getValue() == '') ? NULL : $activesheet->getCell("J{$row}")->getValue();
                        // $pack_size = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                        $brand_name = ($activesheet->getCell("L{$row}")->getValue() == '') ? NULL : $activesheet->getCell("L{$row}")->getValue();
                       //  $schedule = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                       //  $manufacturer_email = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                       //  $manufacturer_name = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();
                       //  $manufacturer_physical_address = ($activesheet->getCell("P{$row}")->getValue() == '') ? NULL : $activesheet->getCell("P{$row}")->getValue();
                       //  $api_manufacturer_name = ($activesheet->getCell("Q{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Q{$row}")->getValue();
                       //  $api_manufacturer_physical_address = ($activesheet->getCell("R{$row}")->getValue() == '') ? NULL : $activesheet->getCell("R{$row}")->getValue();
                       //  $api_manufacturer_telephone = ($activesheet->getCell("S{$row}")->getValue() == '') ? NULL : $activesheet->getCell("S{$row}")->getValue();
                       //  $api_manufacturer_country = ($activesheet->getCell("T{$row}")->getValue() == '') ? NULL : $activesheet->getCell("T{$row}")->getValue();
                       //  $api_manufacturer_region = ($activesheet->getCell("U{$row}")->getValue() == '') ? NULL : $activesheet->getCell("U{$row}")->getValue();
                       //  $ingredient = ($activesheet->getCell("V{$row}")->getValue() == '') ? NULL : $activesheet->getCell("V{$row}")->getValue();
                       // // $Route_of_admin = ($activesheet->getCell("W{$row}")->getValue() == '') ? NULL : $activesheet->getCell("W{$row}")->getValue();
                       //  $ingredient_quantity = ($activesheet->getCell("X{$row}")->getValue() == '') ? NULL : $activesheet->getCell("X{$row}")->getValue();
                       //  $ingredient_si_unit = ($activesheet->getCell("Y{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Y{$row}")->getValue();
                       //  $inclusion_reason = ($activesheet->getCell("Z{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Z{$row}")->getValue();
                       //  $container = ($activesheet->getCell("AA{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AA{$row}")->getValue();
                       //  $container_closure = ($activesheet->getCell("AB{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AB{$row}")->getValue();
                       //  // $country_of_origin = ($activesheet->getCell("AC{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AC{$row}")->getValue();
                       //  $retail_packaging_size = ($activesheet->getCell("AD{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AD{$row}")->getValue();
                       //  $retail_packaging_unit = ($activesheet->getCell("AE{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AE{$row}")->getValue();
                       //  $applicant_name = ($activesheet->getCell("AF{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AF{$row}")->getValue();
                       //  $applicant_email = ($activesheet->getCell("AG{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AG{$row}")->getValue();
                       //  $applicant_postal_address = ($activesheet->getCell("AH{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AH{$row}")->getValue();
                       //  $applicant_physical_address = ($activesheet->getCell("AI{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AI{$row}")->getValue();
                       //  $applicant_telephone_no = ($activesheet->getCell("AJ{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AJ{$row}")->getValue();
                       //  $applicant_country = ($activesheet->getCell("AK{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AK{$row}")->getValue();
                       //  $applicant_region = ($activesheet->getCell("AL{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AL{$row}")->getValue();
                       //  $rep_name = ($activesheet->getCell("AN{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AN{$row}")->getValue();
                       //  $rep_email = ($activesheet->getCell("AO{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AO{$row}")->getValue();
                       //  $rep_postal_address = ($activesheet->getCell("AP{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AP{$row}")->getValue();
                       //  $rep_physical_address = ($activesheet->getCell("AQ{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AQ{$row}")->getValue();
                       //  $rep_telephone_no = ($activesheet->getCell("AR{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AR{$row}")->getValue();
                       //  $rep_country = ($activesheet->getCell("AS{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AS{$row}")->getValue();
                       //  // $rep_country = ($activesheet->getCell("AT{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AT{$row}")->getValue();
                       //  $date_received = ($activesheet->getCell("AU{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AU{$row}")->getValue();
                       //  $date_logged_in_rmu = ($activesheet->getCell("AV{$row}")->getValue() == '') ? NULL : $activesheet->getCell("AV{$row}")->getValue();
                        

                       //  $fee_paid = ($activesheet->getCell("BI{$row}")->getValue() == '') ? NULL : $activesheet->getCell("BI{$row}")->getValue();
                       //  $sales_quote = ($activesheet->getCell("BH{$row}")->getValue() == '') ? NULL : $activesheet->getCell("BH{$row}")->getValue();

                       //  $letter_ref = ($activesheet->getCell("BG{$row}")->getValue() == '') ? NULL : $activesheet->getCell("BG{$row}")->getValue();
                        // $allocation_date = ($activesheet->getCell("O{$row}")->getFormattedValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getFormattedValue();
                        // // // ($allocation_date);
                        // $assesor = ($activesheet->getCell("P{$row}")->getValue() == '') ? NULL : $activesheet->getCell("P{$row}")->getValue();
                        // $correspondence = ($activesheet->getCell("Q{$row}")->getFormattedValue() == '') ? NULL : $activesheet->getCell("Q{$row}")->getFormattedValue();
                        // $time_to_allocate = ($activesheet->getCell("R{$row}")->getCalculatedValue() == '' ) ? NULL : $activesheet->getCell("R{$row}")->getCalculatedValue();
                        // $total_screening_days = ($activesheet->getCell("S{$row}")->getCalculatedValue() == '') ? NULL :  $activesheet->getCell("S{$row}")->getCalculatedValue();
                        // $deposit_date = ($activesheet->getCell("T{$row}")->getValue() == '' || $activesheet->getCell("T{$row}")->getValue() ==  'N/A') ? NULL : $activesheet->getCell("T{$row}")->getFormattedValue();
                        // //dd($deposit_date);
                        // $letter_ref = ($activesheet->getCell("U{$row}")->getValue() == '') ? NULL : $activesheet->getCell("U{$row}")->getValue();

                        // $date_dispatched_and_acknowledged = ($activesheet->getCell("V{$row}")->getFormattedValue() == '' || $activesheet->getCell("V{$row}")->getFormattedValue() == 'N/A') ? NULL : $activesheet->getCell("V{$row}")->getFormattedValue();
                        // //dd($date_dispatched_and_acknowledged);
                        // $results = ($activesheet->getCell("W{$row}")->getValue() == '') ? NULL : $activesheet->getCell("W{$row}")->getValue();

                        // $deadline = ($activesheet->getCell("X{$row}")->getFormattedValue() == '' || $activesheet->getCell("X{$row}")->getFormattedValue() == 'N/A' ) ? NULL : $activesheet->getCell("X{$row}")->getFormattedValue();
                        // //dd($deadline);
                        // $assesment_pathway = ($activesheet->getCell("Y{$row}")->getValue() == '' || $activesheet->getCell("Y{$row}")->getValue() == 'N/A' ) ? NULL : $activesheet->getCell("Y{$row}")->getValue();

                        $date_received_converted = strtotime($date_received);
                        $date_received_fmt = date('Y-m-d',$date_received_converted);
                        $new_date_received_fmt = ($date_received_fmt == '1970-01-01') ? NULL : $date_received_fmt;

                        $date_logged_in_rmu_converted = strtotime($date_logged_in_rmu);
                        $date_logged_in_rmu_fmt =   date('Y-m-d',$date_logged_in_rmu_converted);
                        $new_date_logged_in_rmu_fmt = ($date_logged_in_rmu_fmt == '1970-01-01') ? NULL : $date_logged_in_rmu_fmt;

                        // $allocation_date_converted = strtotime($allocation_date);
                        // $allocation_date_fmt  = date('Y-m-d', $allocation_date_converted);
                        // $new_allocation_date_fmt = ($allocation_date_fmt == '1970-01-01') ? NULL : $allocation_date_fmt;

                        // $deposit_date_converted = strtotime($deposit_date);
                        // $deposit_date_fmt =  date('Y-m-d',$deposit_date_converted);
                        // $new_deposit_date_fmt = ($deposit_date_fmt == '1970-01-01') ? NULL : $deposit_date_fmt;

                        // $date_dispatched_and_acknowledged_converted = strtotime($date_dispatched_and_acknowledged);
                        // $date_dispatched_and_acknowledged_fmt =  date('Y-m-d',$date_dispatched_and_acknowledged_converted);
                        // $new_date_dispatched_and_acknowledged_fmt = ($date_dispatched_and_acknowledged_fmt == '1970-01-01') ? NULL : $date_dispatched_and_acknowledged_fmt;

                        // $deadline_converted = strtotime($deadline);
                        // $deadline_fmt = date('Y-m-d',$deadline_converted);
                        // $new_deadline_fmt = ($deadline_fmt == '1970-01-01') ? NULL : $deadline_fmt;

                        // $correspondence_converted = strtotime($correspondence);
                        // $correspondence_fmt= date('Y-m-d', $correspondence_converted);
                        // $new_correspondence_fmt = ($correspondence_fmt == '1970-01-01') ? NULL : $correspondence_fmt;

                        $data_to_be_inserted [] = [

                            //'id' => $id,
                            "screening_no" => $screening_number,
                            "date_received" => $new_date_received_fmt,
                            "date_logged_in_rmu" => $new_date_logged_in_rmu_fmt,
                            "fee_paid" => $fee_paid,
                            "sales_quote" => $sales_quote,
                            // "rep_name" => $rep_name,
                            // "rep_email" => $rep_email,
                            // "rep_phone" => $rep_telephone_no,
                            // "rep_physical_address" => $rep_physical_address,
                            // "rep_country" => $rep_country,
                            // "rep_postal_address" => $rep_postal_address,
                            // "applicant_name" => $applicant_name,
                            // "applicant_email" => $applicant_email,
                            // "applicant_postal_address" => $applicant_postal_address,
                            // "applicant_physical_address" => $applicant_physical_address,
                            // "applicant_telephone_no" => $applicant_telephone_no,
                            // "applicant_country" => $applicant_country,
                            // "applicant_region" => $applicant_region,
                            // "manufacturer" => $manufacturer_name,
                            // "manufacturer_email" => $manufacturer_email,
                            // "manufacturer_physical_address" => $manufacturer_physical_address,
                            // "api_manufacturer_name" => $api_manufacturer_name,
                            // "api_manufacturer_physical_address" => $api_manufacturer_physical_address,
                            // "api_manufacturer_telephone" => $api_manufacturer_telephone,
                            // "api_manufacturer_country" => $api_manufacturer_country,
                            // "api_manufacturer_region" => $api_manufacturer_region,
                            // "product_name" => $brand_name,
                            "common_name" => $common_name,
                            // "dosage" => $dosage_form,
                            // "strength" => $strength,
                            // "Route_of_admin" => $Route_of_admin,
                            // "storage_condition" => $storage_condition,
                            // "physical_desc" => $physical_desc,
                            // "indication" => $indication,
                            // "use_instruction" => $use_instruction,
                            // "shelf_life" => $shelf_life,
                            // "pack_size" => $pack_size,
                            // "country_of_origin" => $country_of_origin,
                            // "schedule" => $schedule,
                            // "ingredient" => $ingredient,
                            // "ingredient_quantity" => $ingredient_quantity,
                            // "ingredient_si_unit" => $ingredient_si_unit,
                            // "inclusion_reason" => $inclusion_reason,
                            // "container" => $container,
                            // "container_closure" => $container_closure,
                            // "retail_packaging_size" => $retail_packaging_size,
                            // "retail_packaging_unit" => $retail_packaging_unit,
                            // "letter_ref" => $letter_ref,
                            "section_id" => 2,
                            "sub_module_id" => 7
                            // "results" => $results,
                            // "deadline"  => $new_deadline_fmt,
                            // "assesment_pathway" => $assesment_pathway,
                            // "correspondence" => $new_correspondence_fmt,
                        ];
                    }

                }

            }

            //screening register operations
            $screening_register_collection = collect($data_to_be_inserted);
            $screening_register_chunks = $screening_register_collection->chunk(50);

            foreach($screening_register_chunks as $chunk){
                $migrations_db->table('mg_human_medicines_screening')->insert($chunk->toArray());
            }

            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $data_to_be_inserted

            );




            $migrations_db->commit();
            DB::commit();

            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }
    //transer the data to transactional tables
    public function transferdatatotransactionaltables(Request $request){

        try {
           $migrations_db = DB::connection('migrations_db');

           DB::beginTransaction();

           $transaction_query = $migrations_db->table('mg_human_medicines_screening')->chunkById(50 , function($screening_register){

            foreach($screening_register as $data){

                //insert product info and get the id
                //first check if the data has been inserted use_instruction

                if(!DB::table('tra_product_applications')->where('tracking_no','=',$data->screening_no)->exists()){

                    //country
                    if(DB::table('par_countries')->where(['name'=>$data->country_of_origin])->exists()){
                         $country_of_origin_id = DB::table('par_countries')->where('name','=',$data->country_of_origin)->value('id');
                    }else{
                        $country_of_origin_id = 0;
                    }
                    //dosage form
                    if(!DB::table('par_dosage_forms')->where('name','=',$data->dosage)->exists() && $data->dosage != ''){
                        $product_form_id = DB::table('par_dosage_forms')->insertGetId(['name' => $data->dosage, 'is_enabled'=> 1]);
                    }else{
                        if( $data->dosage != Null){
                            $product_form_id = DB::table('par_dosage_forms')->where('name','=',$data->dosage)->value('id');
                        }else{
                            $product_form_id = 0;
                        }
                    }
                    //par_route_of_administration form
                    if(!DB::table('par_route_of_administration')->where('name','=',$data->Route_of_admin)->exists() && $data->Route_of_admin != ''){
                        $route_of_administration_id = DB::table('par_route_of_administration')->insertGetId(['name' => $data->Route_of_admin, 'is_enabled'=> 1]);

                    }else{
                        if($data->Route_of_admin != Null){
                            $route_of_administration_id = DB::table('par_route_of_administration')->where('name','=',$data->Route_of_admin)->value('id');
                        }else{
                             $route_of_administration_id = 0;
                        }
                        
                    }
                    //shelf life
                    $shelf_life = preg_replace('/[^0-9]/', '', $data->shelf_life);
                    if($shelf_life > 0){
                        if (strpos($data->shelf_life, 'year') !== false) {
                            $shelf_life = $shelf_life*12;
                        }else if (strpos($data->shelf_life, 'day') !== false) {
                            $shelf_life = $shelf_life/12;
                        }
                    }
                    //schedule
                    if($data->schedule != Null && DB::table('par_schedule_types')->where('name', 'ilike','%'.trim($data->schedule).'%')->exists()){
                         $schedule_id = DB::table('par_schedule_types')->where('name','ilike','%'.trim($data->schedule).'%')->value('id');
                    }else{
                        $schedule_id = 0;
                    }


                    $product_id = DB::table('tra_product_information')->insertGetId([
                        "fee_paid" => $data->fee_paid,
                        "sales_quote" => $data->sales_quote,
                        "brand_name" => $data->product_name,
                        "common_name" => $data->common_name,
                        "strength" => $data->strength,
                        "storage_condition" => $data->storage_condition,
                        "physical_description" => $data->physical_desc,
                        "indications" => $data->indication,
                        "use_instruction" => $data->use_instruction,
                        "pack_size" => $data->pack_size,
                        "schedule" => $data->schedule,
                        "schedule_id" => $schedule_id,
                        "letter_ref" => $data->letter_ref,
                        "date_dispatched_and_acknowledged" => $data->date_dispatched_and_acknowledged,
                        "results" => $data->results,
                        // "deadline"  => $data->deadline,
                        // "assesment_pathway" => $data->assesment_pathway,
                        "correspondence" => $data->correspondence,


                        'shelf_life' => $shelf_life,
                        'route_of_administration_id' => $route_of_administration_id,
                        'country_of_origin_id' => $country_of_origin_id,
                        'dosage_form_id' => $product_form_id

                    ]);     
                     //check if applicant_email exists
                    if(!DB::table('wb_trader_account')->where('email','=', $data->applicant_email)->exists()){
                        //get the id of the country of the applicant
                        if($data->applicant_country == NULL){
                            $applicant_country_id = NULL;
                        }
                        else {
                            $country = DB::table('par_countries')->where('name','=',$data->applicant_country)->first();
                            if(isset($country->id)){
                                $applicant_country_id = $country->id;
                            }else{
                                $applicant_country_id = NULL;
                            }
                            
                        }
                        //get the id of the region
                        if($data->applicant_region == NULL){
                            $applicant_region_id = NULL;
                        }
                        else{
                            $region = DB::table('par_regions')->where('name','=',$data->applicant_region)->first();
                            if(isset($region->id)){
                                $applicant_region_id = $region->id;
                            }else{
                                $applicant_region_id = NULL;
                            }
                           
                        }
                        //get the trader account type

                        if($data->applicant_trader_account_type == NULL){
                            //lets fist make the default equate to I
                            $trader_account_type_id = 1;

                        }else {
                            // $trader_account_type = DB::table('par_traderaccount_types')->where('name', '=', $data->applicant_trader_account_type)->first();
                            // $trader_account_type_id = $trader_account_type->id;
                            $trader_account_type_id = 1;
                        }
                        $applicant_id = DB::table('wb_trader_account')->insertGetId([
                            'name' => $data->applicant_name,
                            'email' => $data->applicant_email,
                            'physical_address' => $data->applicant_physical_address,
                            'country_id' => $applicant_country_id,
                            'region_id' => $applicant_region_id,
                            'telephone_no' => $data->applicant_telephone_no,
                            'postal_address' => $data->applicant_postal_address,
                            'fax' => $data->applicant_fax,
                            'website' => $data->applicant_website,
                            'mobile_no' => $data->applicant_mobile_no,
                            'identification_no' => $data->applicant_identification_no,
                            'traderaccount_type_id' => $trader_account_type_id,
                            'trader_category_id' =>  1,//the category get equated to one i.e Product registrant
                        ]);

                    }else {
                        if($data->applicant_email != Null){
                            $applicant = DB::table('wb_trader_account')->where('email','=',$data->applicant_email)->first();
                            $applicant_id = $applicant->id;
                            $applicant_country_id =  $applicant->country_id;
                            $applicant_region_id =  $applicant->region_id;
                            $trader_account_type_id = 1;
                        }else{
                            $applicant_id =0;
                            $applicant_country_id =  0;
                            $applicant_region_id = 0;
                            $trader_account_type_id = 0;
                        }
                        
                    }




                    //Local agent _id
                    if(!DB::table('wb_trader_account')->where('email','=',$data->rep_email)->orWhere('name','=',$data->rep_name)->exists()){
                        $local_agent_id = DB::table('wb_trader_account')->insertGetId([
                            'name' => $data->rep_name,
                            'email' => $data->rep_email,
                            'physical_address' => $data->rep_physical_address,
                            'country_id' => $applicant_country_id,
                            'region_id' => $applicant_region_id,
                            'telephone_no' => $data->rep_phone,
                            'postal_address' => $data->applicant_postal_address,
                            'mobile_no' => $data->rep_phone,
                            'traderaccount_type_id' => $trader_account_type_id,
                            'trader_category_id' =>  1,//the category get equated to one i.e Product registrant


                        ]);
                        //dd($applicant_id);
                    }else {
                        if($data->rep_email != Null){
                            $rep = DB::table('wb_trader_account')->where('email','=',$data->rep_email)->orWhere('name','=',$data->rep_name)->first();
                            $local_agent_id = $rep->id;
                        }else{
                            $local_agent_id = 0;
                        }
                        
                    }
                  
                    //packaging size and closure material
                     if(!DB::table('tra_product_packaging')->where(['retail_packaging_size'=>$data->pack_size, 'product_id' => $product_id, 'container_material' => $data->container_closure])->exists()){
                         DB::table('tra_product_packaging')->insertGetId(['retail_packaging_size' => $data->pack_size, 'product_id'=> $product_id, 'container_material' => $data->container_closure, 'container_name' => $data->container]);

                    }
                    //ingredients
                    $ingredient_id = DB::table('par_ingredients_details')->where('name','=',$data->ingredient)->value('id');
                    if($ingredient_id){
                       if(!DB::table('tra_product_ingredients')->where(['ingredient_id'=>$ingredient_id, 'product_id' => $product_id])->exists()){
                             DB::table('tra_product_ingredients')->insertGetId(['ingredient_id' => $ingredient_id, 'product_id'=> $product_id, 'proportion' => $data->ingredient_quantity, 'strength' => $data->ingredient_si_unit]);
                        }
                    }else{
                        if($data->ingredient != ''){
                            $ingredient_id = DB::table('par_ingredients_details')->insertGetId(['name' => $data->ingredient]);
                            DB::table('tra_product_ingredients')->insertGetId(['ingredient_id' => $ingredient_id, 'product_id'=> $product_id, 'proportion' => $data->ingredient_quantity, 'strength' => $data->ingredient_si_unit]);
                        }else{
                            $ingredient_id=0;
                        }
                        
                    }
                    //manuacturer_id
                    if(!DB::table('tra_manufacturers_information')->where('name','=',$data->manufacturer)->exists()){

                        //country id
                        if($data->manufacturer_country == NULL){
                            $country_id = NULL;
                        }
                        else {
                            $country = DB::table('par_countries')->where('name','=',$data->manufacturer_country)->first();
                            if(isset($country->id)){
                                $country_id = $country->id;
                            }else{
                                $country_id = NULL;
                            }
                        }
                        //region id
                        if($data->manufacturer_region == NULL){
                            $region_id = NULL;
                        }
                        else{
                            $region = DB::table('par_regions')->where('name','=',$data->manufacturer_region)->first();
                            if(isset($region->id)){
                                $region_id = $region->id;
                            }else{
                                $region_id = NULL;
                            }
                        }
                        //district id
                        if($data->manufacturer_district == NULL){
                            $district_id = NULL;
                        }
                        else{
                            $district = DB::table('par_districts')->where('name','=',$data->manufacturer_district)->first();
                            if(isset($district->id)){
                                $district_id = $district->id;
                            }else{
                                $district_id = NULL;
                            }
                        }
                        $manufacturer_id = DB::table('tra_manufacturers_information')->insertGetId([
                            'name' => $data->manufacturer,
                            'email_address' => $data->manufacturer_email,
                            'physical_address' => $data->manufacturer_physical_address,
                            'mobile_no' => $data->manufacturer_mobile,
                            'country_id' => $country_id,
                            //'manufacturer_type_id' => 1,
                            'region_id' => $region_id,
                            'district_id' => $district_id,
                            'telephone_no' => $data->manufacturer_telephone,
                            'website' => $data->manufacturer_website,
                            'tin_no' => $data->manufacturer_tin_no

                        ]);
                        //dd($applicant_id);
                    }else {
                        $manufacturer = DB::table('tra_manufacturers_information')->where('name','=',$data->manufacturer)->first();
                        $manufacturer_id = $manufacturer->id;
                    }
                    //insert product manufacturer
                    if(!DB::table('tra_product_manufacturers')->where(['manufacturer_id'=>$manufacturer_id, 'product_id' => $product_id])->exists()){
                         DB::table('tra_product_manufacturers')->insertGetId(['manufacturer_id' => $manufacturer_id, 'product_id'=> $product_id, 'manufacturer_type_id' => 1]);

                    }
                    //API manuacturer_id
                    if(!DB::table('tra_manufacturers_information')->where('name','=',$data->api_manufacturer_name)->exists()){

                        //country id
                        if($data->api_manufacturer_country == NULL){
                            $country_id = NULL;
                        }
                        else {
                            $country = DB::table('par_countries')->where('name','=',$data->api_manufacturer_country)->first();
                            if(isset($country->id)){
                                $country_id = $country->id;
                            }else{
                                $country_id = NULL;
                            }
                            
                        }
                        //region id
                        if($data->api_manufacturer_region == NULL){
                            $region_id = NULL;
                        }
                        else{
                            $region = DB::table('par_regions')->where('name','=',$data->api_manufacturer_region)->first();
                            if(isset($region->id)){
                                $region_id = $region->id;
                            }else{
                                $region_id = NULL;
                            }
                        }
                        //district id
                        // if($data->manufacturer_district == NULL){
                        //     $district_id = NULL;
                        // }
                        // else{
                        //     $district = DB::table('par_districts')->where('name','=',$data->manufacturer_district)->first();
                        //     $district_id = $district->id;
                        // }
                        $api_manufacturer_id = DB::table('tra_manufacturers_information')->insertGetId([
                            'name' => $data->api_manufacturer_name,
                            'physical_address' => $data->api_manufacturer_physical_address,
                            'country_id' => $country_id,
                            'region_id' => $region_id,
                            'telephone_no' => $data->api_manufacturer_telephone

                        ]);
                        //dd($applicant_id);
                    }else {
                        $manufacturer = DB::table('tra_manufacturers_information')->where('name','=',$data->api_manufacturer_name)->first();
                        $api_manufacturer_id = $manufacturer->id;
                    }
                    //insert product manufacturer
                    if(!DB::table('tra_product_manufacturers')->where(['manufacturer_id'=>$manufacturer_id, 'product_id' => $product_id])->exists()){
                         DB::table('tra_product_manufacturers')->insertGetId(['manufacturer_id' => $manufacturer_id, 'product_id'=> $product_id, 'manufacturer_type_id' => 1]);

                    }
                    //insert product API manufacturer
                    if(!DB::table('tra_product_manufacturers')->where(['manufacturer_id'=>$api_manufacturer_id, 'product_id' => $product_id])->exists()){
                         DB::table('tra_product_manufacturers')->insertGetId(['manufacturer_id' => $api_manufacturer_id, 'product_id'=> $product_id, 'manufacturer_type_id' => 2]);

                    }
                     //generate application code
                   $application_code = generateApplicationCode(7,'tra_product_applications');
                   $view_id = generateApplicationViewID();
                   
                    $active_application_id = DB::table('tra_product_applications')->insertGetId([
                        "date_received" => $data->date_received,
                        "deposit_date" => $data->deposit_date,
                        "deadline"  => $data->deadline,
                        "tracking_no" => $data->screening_no,
                        "product_id" => $product_id,
                        "applicant_id" => $applicant_id,
                        "local_agent_id" => $local_agent_id,
                        "application_code" => $application_code,
                        "view_id" => $view_id,
                        "module_id" => 1,
                        "sub_module_id" => $data->sub_module_id,
                        "section_id" => $data->section_id,
                        "process_id" => 78,
                        'prodclass_category_id' => 15,
                        "workflow_stage_id" => 1338,
                        "is_fast_track" => 2,
                        "created_on" => Carbon::now()
                    ]);

                    $submission_params = array(
                        'application_id' => $active_application_id,
                        'process_id' => 78,
                        'application_code' => $application_code,
                        'prodclass_category_id' => 15,
                        "tracking_no" => $data->screening_no,
                        'previous_stage' => 1338,
                        'current_stage' => 1338,
                        'module_id' => 1,
                        "sub_module_id" => $data->sub_module_id,
                        "section_id" => $data->section_id,
                        'application_status_id' => 12,
                        'urgency' => 1,
                        'applicant_id' => $applicant_id,
                        'branch_id' => 1,
                        'remarks' => $data->comments,
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'created_by' => \Auth::user()->id
                    );
                    $log = insertRecord('tra_submissions', $submission_params);
                    if(!$log['success']){
                        dd($log);
                    }
        //retail_packaging_size
                }
            }

           });

           $res = array(
            "success" => true,
            "message" => "Saved Sucessfully",
            "results" => $transaction_query

        );

        DB::commit();

        } catch (\Exception $exception) {

            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {

            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }
     public function transferListingdatatotransactionaltables(Request $request){

        try {
           $migrations_db = DB::connection('migrations_db');

           DB::beginTransaction();

           $transaction_query = $migrations_db->table('mg_medical_device_listing')->chunkById(50 , function($screening_register){

            foreach($screening_register as $data){

                //insert product info and get the id
                //first check if the data has been inserted use_instruction

                if(!DB::table('tra_product_applications')->where('tracking_no','=',$data->tracking_no)->exists()){

                    //device type
                    if($data->device_type == 'MD'){
                         $device_type = 13;
                    }else{
                        $device_type = 2;
                    }
                    //risk_class
                    if(DB::table('par_devicerisk_classifications')->where('code','ilike',trim($data->risk_class))->exists()){
                        $risk_class = DB::table('par_devicerisk_classifications')->where('code', 'ilike', $data->risk_class)->value('id');
                    }else{
                        $risk_class = '';
                    }
                    //shelf life
                    $lifespan = preg_replace('/[^0-9]/', '', $data->lifespan);
                    if($lifespan > 0){
                        if (strpos($data->lifespan, 'YRS') || strpos($data->lifespan, 'YEARS') || strpos($data->lifespan, 'years')) {
                            $lifespan = $lifespan;
                        }else if (strpos($data->lifespan, 'months') !== false) {
                            $lifespan = $lifespan*12;
                        }else{
                            $lifespan = $data->lifespan;
                        }
                    }else{
                        $lifespan = 0;
                    }
                    $product_id = DB::table('tra_product_information')->insertGetId([
                        "brand_name" => $data->brand_name,
                        "common_name" => $data->common_name,
                        "use_instruction" => $data->intended_use,
                        "product_type_id" => $device_type,
                        "model" => $data->model,
                        "gmdn_term" => $data->gmdn_term,
                        "gmdn_code" => $data->gmdn_code,
                        "classification_id" => $risk_class,
                        'software_version' => $data->software_version,
                        'shelf_life' => $lifespan
                    ]);     
                     //check if applicant_email exists
                    $applicant = explode(',',$data->applicant, 0);
                    if(!DB::table('wb_trader_account')->where('name','ilike', $applicant)->exists()){
                        //get the id of the country of the applicant
                        $applicant_id = DB::table('wb_trader_account')->insertGetId([
                            'name' => $applicant,
                            'physical_address' => $data->applicant,
                            'trader_category_id' =>  1,//the category get equated to one i.e Product registrant
                        ]);

                    }else {
                        if($data->applicant_email != Null){
                            $applicant = DB::table('wb_trader_account')->where('name','ilike',$data->applicant)->first();
                            $applicant_id = $applicant->id;
                            $applicant_country_id =  $applicant->country_id;
                            $applicant_region_id =  $applicant->region_id;
                            $trader_account_type_id = 1;
                        }else{
                            $applicant_id =0;
                            $applicant_country_id =  0;
                            $applicant_region_id = 0;
                            $trader_account_type_id = 0;
                        }
                        
                    }
                    //manuacturer_id
                    if(!DB::table('tra_manufacturers_information')->where('name','ilike',trim($data->manufacturer))->exists()){

                        $manufacturer_id = DB::table('tra_manufacturers_information')->insertGetId([
                            'name' => $data->manufacturer,
                            'physical_address' => $data->manufacturer_physical_address,
                            'mobile_no' => $data->manufacturer_telephone
                        ]);
                        //dd($applicant_id);
                    }else {
                        $manufacturer = DB::table('tra_manufacturers_information')->where('name','ilike',trim($data->manufacturer))->first();
                        $manufacturer_id = $manufacturer->id;
                    }
                    //insert product manufacturer
                    if(!DB::table('tra_product_manufacturers')->where(['manufacturer_id'=>$manufacturer_id, 'product_id' => $product_id])->exists()){
                         DB::table('tra_product_manufacturers')->insertGetId(['manufacturer_id' => $manufacturer_id, 'product_id'=> $product_id, 'manufacturer_type_id' => 1]);

                    }
                     //generate application code
                   $application_code = generateApplicationCode(7,'tra_product_applications');
                   $view_id = generateApplicationViewID();
                   
                    $active_application_id = DB::table('tra_product_applications')->insertGetId([
                        // "date_received" => $data->date_received,
                        // "deposit_date" => $data->deposit_date,
                        // "deadline"  => $data->deadline,
                        "tracking_no" => $data->tracking_no,
                        "product_id" => $product_id,
                        "applicant_id" => $applicant_id,
                        "application_code" => $application_code,
                        "view_id" => $view_id,
                        "module_id" => 1,
                        "sub_module_id" => $data->sub_module_id,
                        "section_id" => $data->section_id,
                        "process_id" => 134,
                        'prodclass_category_id' => 20,
                        "workflow_stage_id" => 1350,
                        "is_fast_track" => 2,
                        "is_migrated" => 1,
                        "created_on" => Carbon::now()
                    ]);

                    $submission_params = array(
                        'application_id' => $active_application_id,
                        'process_id' => 134,
                        'application_code' => $application_code,
                        'prodclass_category_id' => 20,
                        "tracking_no" => $data->tracking_no,
                        'previous_stage' => 1350,
                        'current_stage' => 1350,
                        'module_id' => 1,
                        "sub_module_id" => $data->sub_module_id,
                        "section_id" => $data->section_id,
                        'application_status_id' => 12,
                        'urgency' => 1,
                        'applicant_id' => $applicant_id,
                        'branch_id' => 1,
                        'remarks' => $data->comments,
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'created_by' => \Auth::user()->id
                    );
                    $log = insertRecord('tra_submissions', $submission_params);
                    if(!$log['success']){
                        dd($log);
                    }
                    //update listing approvals
                   $approval_data = array(
                        'module_id' => 1,
                        'application_code' => $application_code,
                        'listing_decision_id' => 1,
                        'confirmation_id' => 1,
                        'decision_id' => 1
                    );
                   $app_res = insertRecord('tra_listing_approvals', $approval_data);
                    if(!$app_res['record_id']){
                        DB::rollBack();
                        dd($app_res);
                    }
                   //approval log
                    $params = array(
                        'application_id' => $active_application_id,
                        'application_code' => $application_code,
                        'workflow_stage_id' => 1350,
                        'decision_id' => 1,
                        'module_id' => 1,
                        'comment' => 'migrated approval',
                        'certificate_no' => $data->tracking_no,
                        'appvalidity_status_id' => 2,
                        'appregistration_status_id' => 2,
                        'certificate_no' =>  $data->tracking_no,
                        'is_migrated' => 1
                    );
                    $app_res = insertRecord('tra_approval_recommendations', $params);
                    if(!$app_res['record_id']){
                        DB::rollBack();
                        dd($app_res);
                    }
            //retail_packaging_size
                }
            }

           });

           $res = array(
            "success" => true,
            "message" => "Saved Sucessfully",
            "results" => $transaction_query

        );

        DB::commit();

        } catch (\Exception $exception) {

            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {

            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }

    public function uploadExcelSheetForDrugs(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();
                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);
                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            $spreadsheet = $reader->load($filecopypath);
            $activesheet = $spreadsheet->getSheet(0);
                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $salt_data = [];
            $migration_backup_db = DB::connection('migrations_backup_db');
            //DB::beginTransaction();
            for($row = 1 ; $row <= $rowswithintheactivesheet ; $row++)
            {
                $NextEntry = $this->getNextEntry($activesheet, $row, $rowswithintheactivesheet);
                $drugname = $activesheet->getCell("A{$row}")->getValue();
                //insert Drug to register

                if(trim($drugname) != ''){
                    $controlled_drug_substance_id = $migration_backup_db->table('par_controlled_drugssubstances')->insertGetId(['name'=>$drugname, 'controlleddrug_type_id' => 1]);

                    for ($i=$row; $i <= $NextEntry-1; $i++) {
                        $saltname = $activesheet->getCell("B{$i}")->getValue();
                        $saltpercentage = $activesheet->getCell("C{$i}")->getValue();
                        if($saltname != ''){
                            $salt_data[] = ['name'=>$saltname, 'controlled_drug_substance_id'=>$controlled_drug_substance_id, 'percentage_within_the_drug' => $saltpercentage];
                        }

                    }
                    if(!empty($salt_data)){
                        $migration_backup_db->table('par_controlleddrugs_basesalts')->insert($salt_data);
                        $salt_data = [];
                    }
                }

            }
            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully"

            );
            DB::commit();

            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
            ///$migrations_db->rollBack();
            DB::rollBack();
            $res = $exception->getMessage();// sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', CLASS), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            //$migrations_db->rollBack();
            DB::rollBack();
            $res = $throwable->getMessage(); //sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', CLASS), \Auth::user()->id);
        }
            return \response()->json($res);
    }

    public function getNextEntry($activesheet, $row, $rowswithintheactivesheet){
        for ($i=$row+1; $i < $rowswithintheactivesheet; $i++) {
            $drugname = $activesheet->getCell("A{$i}")->getValue();

            if(!empty(trim($drugname))){
                return $i;
                break;
            }
        }
    }



    public function uploadExcelSheetForResponseToHumanMedsScreening(Request $request) {

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE

            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

            //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(FALSE);
            $spreadsheet = $reader->load($filecopypath);

            //Step 5 get the active sheet whose data we want to capture
            //$activesheet = $spreadsheet->getSheetByNameOrThrow('RESPONSE TO SCREENING (HUMAN)');

            $activesheet = $spreadsheet->getSheet(1);
           // $responsetoscreeningsheet = $spreadsheet->getSheet(1);


                //Step 6 : Fetch all the rows that contain data
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            ///$rowswithintheresponsetoscreeningsheet = $responsetoscreeningsheet->getHighestDataRow();

            //Remove this step when you push the changes
            //DB::table('mg_resopnse_to_human_medicines_screening')->truncate();
            // $migrations_db = DB::connection('migrations_db');
            // $migrations_db->beginTransaction)(;)
            // DB::beginTransaction();
            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",


            );
            $migrations_db = DB::connection('migrations_db');

            //Step 7 : Dump all the data into the db

            for($row = 2 ; $row < $rowswithintheactivesheet ; $row++)
            {

                $screening_number = $activesheet->getCell("B{$row}")->getValue();
                $rmu_ref = $activesheet->getCell("C{$row}")->getValue();
                $date_received = $activesheet->getCell("D{$row}")->getFormattedValue();
                // $date_logged_in_rmu = $activesheet->getCell("D{$row}")->getValue();
                $comments = $activesheet->getCell("N{$row}")->getValue();
                $correspondence = $activesheet->getCell("Q{$row}")->getFormattedValue();
                //dd(Carbon::createFromFormat('M/D/Y', $correspondence)->format('M/D/Y'));
                //$correspondence = $activesheet->getStyle("Q{$row}")->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_DATE_YYYYMMDDSLASH);
                //$deposit_date = $activesheet->getCell("R{$row}")->getValue();
                $letter_ref = $activesheet->getCell("S{$row}")->getValue();
                //$date_dispatched_and_allocated = $activesheet->getCell("T{$row}")->getValue();
                $time_to_allocation = $activesheet->getCell("U{$row}")->getValue();
                $total_screening_days =  $activesheet->getCell("V{$row}")->getValue();
                $results =  $activesheet->getCell("W{$row}")->getValue();
                $assesment_pathway =  $activesheet->getCell("X{$row}")->getValue();

                $correspondence_date = Carbon::createFromFormat('l , M j, Y', $correspondence)->format('m-d-Y');
                $date_received_fmt = Carbon::createFromFormat('l , M j, Y', $date_received)->format('m-d-Y');
                 // $converted_date_logged_in_rmu = DATE($date_logged_in_rmu);
                if($rmu_ref != ''){
                    $migrations_db->table('mg_response_to_human_medicines_screening')->insertGetId([


                        //'id' => $id,
                        "screening_no" => $screening_number,
                        "rmu_reference" => $rmu_ref,
                        "date_received" => $date_received_fmt,
                        // "date_received" => $converted_date_received,
                        // "date_logged" =>  $converted_date_logged_in_rmu,
                        "comments" => $comments,
                        "correspondence" => $correspondence_date,
                        //"deposit_date" => $deposit_date,
                        "letter_ref" => $letter_ref,
                        //"date_dispatched_and_allocated" => $date_dispatched_and_allocated,
                        "time_to_allocation" => $time_to_allocation,
                        "total_screening_days" => $total_screening_days,
                        "results" => $results,
                        "assesment_pathway" => $assesment_pathway,

                    ]);
                }


                    // if(!validateIsNumeric($result) ){
                    //     DB::rollBack();
                    //     return $result;
                    //     exit();

                    // }
                }
            //Part 2 : Updating details

            FacadesFile::delete($filecopypath);

            //DB::commit();


        } catch (\Exception $exception) {
            //DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            //DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);

    }

    //COMPLEMENTARY MEDICINES

    //screening

    public function getcomplementarymedicinesscreeningregister(){

        try {
            $screeningregister = DB::table('mg_complementary_medicines_screening')->get();
            $res = array(
                'success' => true,
                'results' => $screeningregister,
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    //VETETINARY MEDICINES SCREENING

    //fetching the register

    public function getvetinarymedsscreeningregister(){

        try {
            $screeningregister = DB::table('mg_vetinary_medicines_screening')->get();
            $res = array(
                'success' => true,
                'results' => $screeningregister,
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    //saving the dirty data
    public function saveDirtyDataForVetinaryMedicinesScreening(Request $request){

        try {

            //fetch the dirty data
            $dirtyRecords = $request->input('params');

            //dd($dirtyRecords);

            //convet the json data to an array
            $params = json_decode($dirtyRecords);
            $user_id = \Auth::user()->id;
            //dd($params);

            $res = array(
                'success' => false,
                'message' => 'no data shared',
            );


            foreach($params as $data){

                $records = convertStdClassObjToArray($data);


                $res = updateRecord('mg_vetinary_medicines_screening', ['id'=>$records['id']],$records, $user_id );
            }



        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }


        return \response()->json($res);
    }

    //VETINARY MEDICINES VARIATIONS

    //fetch the screening resgister

    public function getvetinarymedicinesvariationsregister(){
        try {
            $screeningregister = DB::table('mg_vetinary_medicines_variations')->get();
            $res = array(
                'success' => true,
                'results' => $screeningregister,
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function savedirtydataforvetinarymedicinesvariations(Request $request){


        try {

            $dirtyRecords = $request->input('params');


            $params = json_decode($dirtyRecords);

            $user_id = \Auth::user()->id;
            $res = array(
                'success' => false,
                'message' => 'no data shared',
            );

            foreach ($params as $data){

                $records = convertStdClassObjToArray($data);

                $res = updateRecord('mg_vetinary_medicines_variations', ['id'=>$records['id']],$records, $user_id );

            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
     public function CleanTables(Request $req)
    {
        try{
            $data = $req->all();
            $table_list = $data['table_list'];
            $tableNames= json_decode($table_list);
            foreach ($tableNames as $name) {
            $tableNames []= array(
            'table_list'=> $name,
                    );
            $res = DB::table($name)->truncate();
            }
        }
        catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }


        return response()->json($res);






    }

    //VETIANRY MEDICINES APPLICATIONS

    public function getvetinarymedicinesapplicationsregister(){
        try {
            $screeningregister = DB::table('mg_vet_medicines_application')->get();
            $res = array(
                'success' => true,
                'results' => $screeningregister,
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function savedirtydataforvetinarymedicinesapplications(Request $request){
        try {

            //fetch the dirty data
            $dirtyRecords = $request->input('params');

            //dd($dirtyRecords);

            //convet the json data to an array
            $params = json_decode($dirtyRecords);
            $user_id = \Auth::user()->id;
            //dd($params);

            $res = array(
                'success' => false,
                'message' => 'no data shared',
            );


            foreach($params as $data){

                $records = convertStdClassObjToArray($data);


                $res = updateRecord('mg_vet_medicines_application', ['id'=>$records['id']],$records, $user_id );
            }



        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return \response()->json($res);
    }

    //Complementary medicines Applications
    //REMEMBER TO CREATE A TABLE FOR IT
    public function getcomplementarymedicinesapplications(){

        try {
            $screeningregister = DB::table('mg_complementary_medicines_variations')->get();
            $res = array(
                'success' => true,
                'results' => $screeningregister,
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }

    //DRUG MASTER FILE

    public function getDrugMasterFileRecord(){

        try {
            $screeningregister = DB::table('mg_drug_master_file')->get();
            $res = array(
                'success' => true,
                'results' => $screeningregister,
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);



    }

    /* temp migration for medical devices excemptions */

    public function migrateMDexceptions(){
        try {
            $migrations_db = DB::connection('mysql');

            DB::beginTransaction();

            $allData = $migrations_db->table('md_excemptions')->get();

                foreach($allData as $data){

                    //insert product info and get the id
                    //first check if the data has been inserted
                    if(!DB::table('tra_product_applications')->where('tracking_no','=',$data->Application_Reference_Number)->exists()){


                        $product_id = DB::table('tra_product_information')->insertGetId([

                            "brand_name" => $data->Product_Name_,
                            "model_name" => $data->Model_Name_Number_Brand_Name,
                            "remarks" => $data->Remarks
                        ]);

                        //check if applicant_email exists

                        if(!DB::table('wb_trader_account')->where('name','=', $data->Applicant_Name)->exists()){


                            $applicant_id = DB::table('wb_trader_account')->insertGetId([
                                'name' => $data->Applicant_Name,
                                'physical_address' => $data->Applicant_Address,
                                'traderaccount_type_id' => 1,
                                'trader_category_id' =>  1,//the category get equated to one i.e Product registrant


                            ]);
                            //dd($applicant_id);
                        }else {
                            $applicant = DB::table('wb_trader_account')->where('name','=',$data->Applicant_Name)->first();
                            $applicant_id = $applicant->id;
                        }





                        //manuacturer_id
                        if(!DB::table('tra_manufacturers_information')->where('name','=',$data->Manufacturer_Name)->exists()){


                            $manufacturer_id = DB::table('tra_manufacturers_information')->insertGetId([
                                'name' => $data->Manufacturer_Name,
                                'physical_address' => $data->Manufacturer_Details

                            ]);
                            //dd($applicant_id);
                        }else {
                            $manufacturer = DB::table('tra_manufacturers_information')->where('name','=',$data->Manufacturer_Name)->first();
                            $manufacturer_id = $manufacturer->id;
                        }

                        DB::table('tra_product_applications')->insert([
                            "tracking_no" => $data->Application_Reference_Number,
                            "reference_no" => $data->Application_Reference_Number,
                            "product_id" => $product_id,
                            "applicant_id" => $applicant_id,
                            //"manufacturer_id" => $manufacturer_id,
                            "application_code" => generateApplicationCode(7,'tra_product_applications'),
                            "module_id" => 1,
                            "sub_module_id" =>75,
                            "section_id" => 4,
                            "process_id" => 56,
                            "workflow_stage_id" =>524,
                        ]);
                    }






                }


            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $allData

            );

            DB::commit();

        } catch (\Exception $exception) {

            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), '1');

        } catch (\Throwable $throwable) {

            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__),'1');
        }
        return \response()->json($res);
    }

    public function explodeApplicantDetails(){
        $migrations_db = DB::connection('mysql');
        $allData = $migrations_db->table('md_excemptions')->get();

        foreach ($allData as $data){
            $explode_applicant= explode(',', $data->Manufacturer_Details,2);
            if(count($explode_applicant)>0){
                //$migrations_db->table('md_excemptions')
                   // ->where('id', $data->id)
                    //->update(array('Manufacturer_Name' => $explode_applicant[0]));
            }

        }
    }
    public function uploadExcelSheetFromMEDRS(Request $req)
    {
        try{
         //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            $program_id = $req->program_id;
            $program_implementation_id = $req->program_implementation_id;
            //Step 1 : request file the file from the client side
            $excelfile = $req->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();
                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);
                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);
            $activesheet = $spreadsheet->getSheet(0);
                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');
            $data_to_be_inserted  = [];
            $migrations_db->beginTransaction();
            DB::beginTransaction();
            $count = 0;
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {
                $facility_name = ($activesheet->getCell("E{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("E{$row}")->getValue();
                if(DB::table('tra_premises')->where('name', 'ilike', trim($facility_name))->exists()){
                    $count++;
                    $premise = DB::table('tra_premises')->where('name', 'ilike', trim($facility_name))->first();
                    $premise_id = $premise->id;
                    //add plan pms_program_plans
                    // program_id: 7
                    // program_implementation_id: 13
                    $level = ($activesheet->getCell("F{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("F{$row}")->getValue();
                    $regions = ($activesheet->getCell("H{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("H{$row}")->getValue();
                    //get region id
                    if(DB::table('par_regions')->where('name', 'ilike', trim($regions))->exists()){
                        $region_id = DB::table('par_regions')->where('name', 'ilike', trim($regions))->value('id');
                    }else{
                        $region_id = NULL;
                    }

                    $district = ($activesheet->getCell("I{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("I{$row}")->getValue();
                    //get district id
                    if(DB::table('par_districts')->where('name', 'ilike', trim($district))->exists()){
                        $district_id = DB::table('par_districts')->where('name', 'ilike', trim($district))->value('id');
                    }else{
                        $district_id = NULL;
                    }

                    $site_level_id = (int) filter_var($level, FILTER_SANITIZE_NUMBER_INT);
                    $sampling_site_id = 0;
                    //products
                    $products = DB::table('pms_program_products')->where('program_id', $program_id)->get();

                    foreach ($products as $product) {
                        $data = array(
                            'product_id' => $product->product_id,
                            'packaging_level_id' => 1,
                            'sample_size' => $product->default_sample_size,
                            'primary_container_id' => $product->container_id,
                            'region_id' => $region_id,
                            'district_id' => $district_id,
                            'site_level_id' => $site_level_id,
                            'sampling_site_id' => $sampling_site_id,
                            'program_id' => $program_id,
                            'program_implementation_id' => $program_implementation_id,
                            'secondary_sample_size' => 1,
                            'tertiary_sample_size' => 1,
                            'strength' => getSingleRecordColValue('tra_product_information', ['id' => $product->product_id], 'strength')
                        );
                        if(!recordExists('pms_program_plans',  $data)){
                            $res = insertRecord('pms_program_plans', $data);
                        }else{
                            $res = updateRecord('pms_program_plans', $data, $data);
                        }
                        if(!isset($res['record_id'])){
                            DB::rollBack();
                            return $res;
                        }
                        
                        //insert facilities
                        $pms_plan_id = $res['record_id'];
                        $prem_data = array(
                            'program_id' => $program_id,
                            'pms_plan_id' => $pms_plan_id,
                            'program_implementation_id' => $program_implementation_id,
                            'premise_id' => $premise_id,
                            'packaging_level_id' => 1,
                            'sample_size' =>$product->default_sample_size,
                            'primary_container_id' =>$product->container_id,
                            'secondary_sample_size' => 1,
                            'tertiary_sample_size' => 1,
                            'collection_samples' =>$product->default_sample_size
                        );
                        if(!recordExists('tra_pms_sampling_sites',  $prem_data)){
                            $prem_res = insertRecord('tra_pms_sampling_sites', $prem_data);
                        }else{
                            $prem_res = updateRecord('tra_pms_sampling_sites', $prem_data, $prem_data);
                        }
                        if(!isset($prem_res['record_id'])){
                            DB::rollBack();
                            return $res;
                        }
                    }
                }
            }
            DB::commit();
            $res = array(
                'message' => 'Uploaded '.$count.' entries out of '.$rowswithintheactivesheet,
                'success' => true
            );
        } catch (\Exception $exception) {

            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), '1');

        } catch (\Throwable $throwable) {

            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__),'1');
        }
        return \response()->json($res);
    }

   public function migrateProductScreeningForRegistrationManagerAllocation(Request $req){
        //get Applications ready
        $submissions = DB::table('tra_submissions')->where('current_stage', 1342)->where('is_done', 1)->get();
        DB::beginTransaction();
        try{
            //loop each applications
            foreach ($submissions as $application_sub) {
                // get application details
                $application_code = $application_sub->application_code;
                $app_data = DB::table('tra_product_applications')->where('application_code', $application_code)->first();
                $isMigrated = recordExists('tra_product_applications', ['tracking_no'=>$app_data->tracking_no, 'sub_module_id' => 70]);
                if(!$isMigrated){

                    //log screening approval
                    $screening_approval_data = array(
                        'module_id' => 1,
                        'application_code' => $application_code,
                        'decision_id' => 1,
                        'comment' => 'Migrated Approval'
                    );
                    insertRecord('tra_product_screening_approvals', $screening_approval_data, 146);

                    //initiate registration request
                    //duplication application details
                    $sub_module_id = 70;
                    $module_id = 1;
                    $user_id  = 146;
                    $application_code = generateApplicationCode($sub_module_id, 'tra_product_applications');
                    $application_status = getApplicationInitialStatus($module_id, $sub_module_id);

                    //product data
                    $prod_data = getSingleRecord('tra_product_information', ['id' => $app_data->product_id]);
                    unset($prod_data->id);
                    $prod_data = convertStdClassObjToArray($prod_data);
                    $res = insertRecord('tra_product_information', $prod_data, $user_id);
                    if(!isset($res['record_id'])){
                        DB::rollBack();
                        return $res;
                    }
                    $product_id = $res['record_id'];
                    $tracking_no =$app_data->tracking_no;
                    $old_product_id = $app_data->product_id;
                    $registration_data = array('tra_product_id' => $product_id,
                        'status_id' => $application_status->status_id,
                        'validity_status_id' => 1,
                        'registration_status_id' => 1
                    );
                    $where_statement = array('tra_product_id' => $product_id);
                    $res = saveApplicationRegistrationDetails('tra_registered_products', $registration_data, $where_statement, $user_id);
                    if(!isset($res['record_id'])){
                        DB::rollBack();
                        return $res;
                    }
                    $reg_product_id = $res['record_id'];
                    $reg_serial = $app_data->reg_serial;
                    if(!validateIsNumeric($reg_serial)){
                        //generate and update
                        $reg_serial = getRegistrationSerial($module_id);
                        $app_data->reg_serial = $reg_serial;
                        //update existing documents with reg serial
                        updateRecord('tra_application_documents', ['application_code' => $application_sub->application_code], ['reg_serial'=>$reg_serial], $user_id);
                    }
                    //create new view id
                    $view_id = generateApplicationViewID();
                    //change details for registration
                    $app_data->process_id = 45;
                    $app_data->workflow_stage_id = 408;
                    $app_data->application_status_id = $application_status->status_id;
                    $app_data->application_code = $application_code;
                    $app_data->tracking_no = $tracking_no;
                    $app_data->view_id = $view_id;
                    $app_data->reg_serial = $reg_serial;
                    $app_data->sub_module_id = $sub_module_id;
                    $app_data->module_id = $module_id;
                    $app_data->product_id = $product_id;
                    unset($app_data->id);
                    $app_data = convertStdClassObjToArray($app_data);
                    //clone application details
                    $res = insertRecord('tra_product_applications', $app_data, $user_id);
                    if(!isset($res['record_id'])){
                        DB::rollBack();
                        return $res;
                    }
                    $active_application_id = $res['record_id'];
                    //clone additional details
                    $this->updateRenewalProductAdditionalInformation($product_id, $old_product_id, $reg_product_id);
                     //add to submissions table
                    $submission_params = array(
                        'application_id' => $active_application_id,
                        'process_id' => 45,
                        'application_code' => $application_code,
                        'prodclass_category_id' => $app_data['prodclass_category_id'],
                        "tracking_no" => $tracking_no,
                        'usr_from' => $application_sub->usr_from,
                        'usr_to' => 0,
                        'previous_stage' => 408,
                        'current_stage' => 408,
                        'module_id' => $module_id,
                        'sub_module_id' => $sub_module_id,
                        'section_id' => $app_data['section_id'],
                        'application_status_id' => $application_status->status_id,
                        'urgency' => 1,
                        'applicant_id' => $app_data['applicant_id'],
                        'branch_id' =>$app_data['branch_id'],
                        'remarks' => 'Initial submission for migrated records',
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'is_fast_track' => $app_data['fasttrack_option_id'],
                        'created_by' => $user_id
                    );
                    $sub_res = insertRecord('tra_submissions', $submission_params);
                    if(!isset($sub_res['record_id'])){
                        return $sub_res;
                    }
                    //log registration request
                    if(validateIsNumeric($old_product_id)){
                        $data = array(
                            'screening_product_id' => $old_product_id,
                            'reg_product_id' => $product_id,
                            'request_date' => Carbon::now(),
                            'initiated_by' => $user_id
                        );
                       insertRecord('tra_product_registration_requests', $data);

                    }
                }
                 initializeApplicationDMS($app_data['section_id'], $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
            }
            DB::commit();
        } catch (\Exception $exception) {

            DB::rollBack();
            dd($exception->getMessage());
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), '1');

        } catch (\Throwable $throwable) {

            DB::rollBack();
            dd($throwable->getMessage());
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__),'1');
        }
        return \response()->json($res);
    }
     public function updateRenewalProductAdditionalInformation($new_product, $tra_product_id, $reg_product_id){
        try{
            if(!validateIsNumeric($tra_product_id)){
                $tra_product_id = getSingleRecordColValue('tra_registered_products', ['id'=>$reg_product_id], 'tra_product_id');
            }
            //update ingredients
            $ing_data = DB::table('tra_product_ingredients')->where('product_id', $tra_product_id)->get();
            $update_ing = array();

            foreach ($ing_data as $ing) {
                $ing->product_id = $new_product;
                unset($ing->id);
                $update_ing[] = (array)$ing;
            }
            if(isset($update_ing[0])){
                insertMultipleRecords('tra_product_ingredients', $update_ing);
            }

             //update tra_product_packaging
            $ing_data = DB::table('tra_product_packaging')->where('product_id', $tra_product_id)->get();
            $update_ing = array();
            foreach ($ing_data as $ing) {
                unset($ing->id);
                $ing->product_id = $new_product;
                $update_ing[] = (array)$ing;
            }
            if(isset($update_ing[0])){
                insertMultipleRecords('tra_product_packaging', $update_ing);
            }

            //update manufactu
            $ing_data = DB::table('tra_product_manufacturers')->where(['product_id' => $tra_product_id, 'manufacturer_type_id'=>1])->get();
            $update_ing = array();
            foreach ($ing_data as $ing) {
                unset($ing->id);
                $ing->product_id = $new_product;
                $update_ing[] = (array)$ing;
            }
            if(isset($update_ing[0])){
                insertMultipleRecords('tra_product_manufacturers', $update_ing);
            }

            //update API manufactu
            $ing_data = DB::table('tra_product_manufacturers')->where(['product_id' => $tra_product_id, 'manufacturer_type_id'=>2])->get();
            $update_ing = array();
            foreach ($ing_data as $ing) {
                unset($ing->id);
                $ing->product_id = $new_product;
                $update_ing[] = (array)$ing;
            }
            if(isset($update_ing[0])){
                insertMultipleRecords('tra_product_manufacturers', $update_ing);
            }
            //update inspection in other countries
            $ing_data = DB::table('tra_otherstates_productgmpinspections')->where(['product_id' => $tra_product_id])->get();
            $update_ing = array();
            foreach ($ing_data as $ing) {
                unset($ing->id);
                $ing->product_id = $new_product;
                $update_ing[] = (array)$ing;
            }
            if(isset($update_ing[0])){
                insertMultipleRecords('tra_otherstates_productgmpinspections', $update_ing);
            }
         $res = array('success'=>true, 'message'=>'all is well');
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;
    }


    ///facilty 
      //pick excel sheet form and dump its data to data base
    public function uploadExcelSheetForFacilityListBasedOnRisk(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(0);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];
            $user_id = 1;

            // $migrations_db->beginTransaction();
            DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {

                $name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("A{$row}")->getValue();//tra_premises_applications
                $three_year_minor_summary = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                $three_year_major_summary = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                $three_year_critical_summary = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();

                // $prem_details = DB::table('tra_premises')->where('name', 'ilike', $name)->first();
                // $app_details = DB::table('tra_premises_applications')->where('premise_id', $prem_details->id)->first();
              
                if($name != ''){
                    if(!DB::table('tra_premises')->where('name','ilike',$name)->exists()){

                        // $brand_name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("A{$row}")->getFormattedValue();
                        $region_name = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("B{$row}")->getFormattedValue();
                        $physical_address = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("C{$row}")->getFormattedValue();
                        $first_inspection_date = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getFormattedValue();
                        $distance_kms = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getValue();
                        $age = ($activesheet->getCell("F{$row}")->getValue() == '') ? NULL : $activesheet->getCell("F{$row}")->getValue();
                        // $av_min = ($activesheet->getCell("G{$row}")->getValue() == '') ? NULL : $activesheet->getCell("G{$row}")->getValue();
                        // $av_major = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getValue();
                        // $av_critical = ($activesheet->getCell("I{$row}")->getValue() == '') ? NULL : $activesheet->getCell("I{$row}")->getValue();
                        $minor_overall_sum = ($activesheet->getCell("J{$row}")->getValue() == '') ? NULL : $activesheet->getCell("J{$row}")->getValue();
                        $major_overall_sum = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                        $critical_overall_sum = ($activesheet->getCell("L{$row}")->getValue() == '') ? NULL : $activesheet->getCell("L{$row}")->getValue();
                        $three_year_minor_summary = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                        $three_year_major_summary = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                        $three_year_critical_summary = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();
                        $facility_type_name = ($activesheet->getCell("P{$row}")->getValue() == '') ? NULL : $activesheet->getCell("P{$row}")->getValue();
                        $facility_type_rate = ($activesheet->getCell("Q{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Q{$row}")->getValue();
                        // $api_manufacturer_physical_address = ($activesheet->getCell("R{$row}")->getValue() == '') ? NULL : $activesheet->getCell("R{$row}")->getValue();
                        // $api_manufacturer_telephone = ($activesheet->getCell("S{$row}")->getValue() == '') ? NULL : $activesheet->getCell("S{$row}")->getValue();
                        $last_compliance_risk = ($activesheet->getCell("T{$row}")->getValue() == '') ? NULL : $activesheet->getCell("T{$row}")->getValue();
                        $last_intrisic_risk = ($activesheet->getCell("U{$row}")->getValue() == '') ? NULL : $activesheet->getCell("U{$row}")->getValue();
                        if($first_inspection_date!='N/A'){
                            $first_inspection_date_conv = strtotime($first_inspection_date);
                            $first_inspection_date_fmt = date('Y-m-d',$first_inspection_date_conv);
                            $first_inspection_date = ($first_inspection_date_fmt == '1970-01-01') ? NULL : $first_inspection_date_fmt;
                        }else{
                            $first_inspection_date = NULL;
                        }
                        

                        //facility scale

                        //region
                        if(DB::table('par_districts')->where('name', 'ilike', $region_name)->count() > 0){
                            $district_data = DB::table('par_districts')->where('name', 'ilike', $region_name)->first();
                            $district_id = $district_data->id;
                            $region_id = $district_data->region_id;
                        }else{
                            $district_id = 0;
                            $region_id = 0;
                        }

                        //facility type
                        $risk_premise_type_role_id = 4;
                        $risk_premise_type_role_id = 5;
                        $risk_premise_type_role_id = 6;

                        if(str_contains(strtolower($facility_type_name), 'retail')){
                            if($facility_type_rate > 2){
                                $risk_premise_type_role_id = 4;
                            }else if($facility_type_rate > 1){
                                $risk_premise_type_role_id = 5;
                            }else{
                                $risk_premise_type_role_id = 6;
                            }
                        }else if(str_contains(strtolower($facility_type_name), 'distributor')){
                            if($facility_type_rate > 2){
                                $risk_premise_type_role_id = 3;
                            }else if($facility_type_rate > 1){
                                $risk_premise_type_role_id = 2;
                            }else{
                                $risk_premise_type_role_id = 1;
                            }
                        }else if(str_contains(strtolower($facility_type_name), 'wholesale')){
                            if($facility_type_rate > 2){
                                $risk_premise_type_role_id = 9;
                            }else if($facility_type_rate > 1){
                                $risk_premise_type_role_id = 8;
                            }else{
                                $risk_premise_type_role_id = 7;
                            }
                        }
                        //premise type
                        $risk_premise_type_id = getSingleRecordColValue('par_risk_premise_types_roles', ['id'=>$risk_premise_type_role_id], 'risk_premise_type_id');
                        $qry = DB::table('par_risk_premise_types_mapping as t1')
                                ->join('par_premises_types as t2', 't1.premise_type_id', 't2.id')
                                ->where('risk_premise_type_id', $risk_premise_type_id)
                                ->select('t1.premise_type_id','t2.code');

                        if(str_contains(strtolower($facility_type_name), 'vmp')){
                            $qry->where('section_id', 3);
                            $section_id = 3;
                        }else{
                            $qry->where('section_id', 2);
                            $section_id = 2;
                        }
                        $facility_type = $qry->first();
                        
                        $premise_type_id = $facility_type->premise_type_id;
                        // print_r($premise_type_id);
                        $data_to_be_inserted = [
                            'name' => $name,
                            'section_id' => $section_id,
                            'country_id' => 30,
                            'region_id' => $region_id,
                            'district_id' => $district_id,
                            'physical_address' => $physical_address,
                            'risk_premise_type_role_id' => $risk_premise_type_role_id,
                            'risk_premise_type_id' => $risk_premise_type_id,
                            'distance_kms' => $distance_kms,
                            'age' => $age,
                            'minor_overall_sum' => $minor_overall_sum,
                            'major_overall_sum' => $major_overall_sum,
                            'critical_overall_sum' => $critical_overall_sum,
                            'last_compliance_risk' => $last_compliance_risk,
                            'last_intrisic_risk' => $last_intrisic_risk,
                            'first_inspection_date' => $first_inspection_date,
                            'is_migrated' => 1
                        ];
                        $res = insertRecord('tra_premises', $data_to_be_inserted, $user_id);
                        if(!isset($res['record_id'])){
                            DB::rollBack();
                            return \response()->json($res);
                        }
                        $premise_id = $res['record_id'];
                        //create applicaiton
                        $sub_module_id = 1;
                        $process_id = getSingleRecordColValue('wf_processes', array('sub_module_id' => $sub_module_id, 'section_id' => $section_id, 'premise_type_id' => $premise_type_id), 'id');
                        $branch_id = 1;
                        $module_id = 2;
                        $applications_table = 'tra_premises_applications';
                        $workflow_stage_id = 1344;


                        $premise_type_code = $facility_type->code;

                        $section_code = getSingleRecordColValue('par_sections', array('id' => $section_id), 'code');
                        $codes_array = array(
                            'permittype_code' => $premise_type_code,
                            'section_code' => $section_code
                        );
                        $view_id = generateApplicationViewID();
                        $tracking_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $process_id, $branch_id, $user_id);
                        if ($tracking_details['success'] == false) {
                            DB::rollBack();
                            return \response()->json($tracking_details);
                        }
                        $tracking_no = $tracking_details['tracking_no'];
                        $application_code = generateApplicationCode($sub_module_id, $applications_table);
                        $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
                        $application_params = array(
                            'view_id' => $view_id,
                            'module_id' => $module_id,
                            'sub_module_id' => $sub_module_id,
                            'section_id' => $section_id,
                            'application_code' => $application_code,
                            'application_region_id' => $region_id,
                            'branch_id' => $branch_id,
                            'premise_id' => $premise_id,
                            'process_id' => $process_id,
                            'workflow_stage_id' => $workflow_stage_id,
                            'tracking_no' => $tracking_no,
                            // 'investment_capital'=>$investment_capital,
                            'premise_type_id'=>$premise_type_id,
                            'application_status_id' => $application_status->status_id,
                            'fasttrack_option_id'=> 2
                        );

                        $res = insertRecord($applications_table, $application_params, $user_id);
                        if(!isset($res['record_id'])){
                            DB::rollBack();
                            return \response()->json($res);
                        }
                        $application_id = $res['record_id'];
                        //insert registration table
                        $reg_params = array(
                            'tra_premise_id' => $premise_id,
                            'created_by' => $user_id
                        );
                        createInitialRegistrationRecord('tra_registered_premises', $applications_table, $reg_params, $application_id, 'reg_premise_id');
                        //DMS
                      initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no, $user_id);
                        // add to submissions table
                        $submission_params = array(
                            'application_id' => $application_id,
                            'view_id' => $view_id,
                            'process_id' => $process_id,
                            'application_code' => $application_code,
                            'tracking_no' => $tracking_no,
                            'usr_from' => $user_id,
                            'usr_to' => $user_id,
                            'previous_stage' => $workflow_stage_id,
                            'current_stage' => $workflow_stage_id,
                            'module_id' => $module_id,
                            'sub_module_id' => $sub_module_id,
                            'section_id' => $section_id,
                            'application_status_id' => $application_status->status_id,
                            'urgency' => 1,
                            'premise_type_id' => $premise_type_id,
                            // 'branch_id' => $branch_id,
                            'remarks' => 'Initial save of the application',
                            'date_received' => Carbon::now(),
                            'created_on' => Carbon::now(),
                            'created_by' => $user_id
                        );
                        DB::table('tra_submissions')
                            ->insert($submission_params);
                        
                        //inspection details log
                        $data = array(
                            'application_id' => $application_id,
                            'application_code' => $application_code,
                            'start_date' => $first_inspection_date,
                            'inspection_type_id' => 3,
                            'tracking_no' => 'mgr_'.$tracking_no,
                        );
                        $res = insertRecord('tra_premise_inspection_details', $data, $user_id);
                        if(!isset($res['record_id'])){
                            DB::rollBack();
                            return \response()->json($res);
                        }
                        $inspection_id = $res['record_id'];
                        //low
                        $low_comp_data = [];
                        // for ($i=0; $i < $three_year_minor_summary; $i++) {
                        //     $low_comp_data[] = array(
                        //         'premise_id' => $premise_id,
                        //         'inspection_id' => $inspection_id,
                        //         'facility_risk_item_id' => 1,
                        //         'pass_status_id' => 2,
                        //         'findings' => 'Migrated as history'
                        //     );
                        // }
                        // insertMultipleRecords('tra_facility_inspection_compliances', $low_comp_data);
                        // //major
                        // $major_comp_data = [];
                        // for ($i=0; $i < $three_year_major_summary; $i++) {
                        //     $major_comp_data[] = array(
                        //         'premise_id' => $premise_id,
                        //         'inspection_id' => $inspection_id,
                        //         'facility_risk_item_id' => 2,
                        //         'pass_status_id' => 2,
                        //         'findings' => 'Migrated as history'
                        //     );
                        // }
                        // insertMultipleRecords('tra_facility_inspection_compliances', $major_comp_data);
                        // //critical
                        // $critical_comp_data = [];
                        // for ($i=0; $i < $three_year_critical_summary; $i++) {
                        //     $critical_comp_data[] = array(
                        //         'premise_id' => $premise_id,
                        //         'inspection_id' => $inspection_id,
                        //         'facility_risk_item_id' => 2,
                        //         'pass_status_id' => 2,
                        //         'findings' => 'Migrated as history'
                        //     );
                        // }
                        $res = insertRecord('tra_facility_inspection_compliances', ['minor_compliances'=> $three_year_minor_summary, 'major_compliances'=>$three_year_major_summary, 'critical_compliances' => $three_year_critical_summary]);
                        // $migrations_db->table('mg_response_to_human_medicines_screening')->insert(['comments' => $name]);
                    }

                }

            }
            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully"
            );




            // $migrations_db->commit();
            DB::commit();

            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }
      //pick excel sheet form and dump its data to data base
    public function uploadExcelSheetForFacilityListBasedOnRiskV1(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(0);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];
            $user_id = 1;

            // $migrations_db->beginTransaction();
            DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {


                $name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("A{$row}")->getValue();//tra_premises_applications
                // $three_year_minor_summary = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                // $three_year_major_summary = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                // $three_year_critical_summary = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();

                // $prem_details = DB::table('tra_premises')->where('name', 'ilike', $name)->first();
                // $app_details = DB::table('tra_premises_applications')->where('premise_id', $prem_details->id)->first();
              
                if($name != ''){
                    if(!DB::table('tra_premises')->where('name','ilike',$name)->exists()){

                        // $brand_name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("A{$row}")->getFormattedValue();
                        $region_name = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("B{$row}")->getFormattedValue();
                        $district_name = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("C{$row}")->getFormattedValue();
                        // $physical_address = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("C{$row}")->getFormattedValue();
                        // $first_inspection_date = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getFormattedValue();
                        // $distance_kms = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getValue();
                        // $age = ($activesheet->getCell("F{$row}")->getValue() == '') ? NULL : $activesheet->getCell("F{$row}")->getValue();
                        // // $av_min = ($activesheet->getCell("G{$row}")->getValue() == '') ? NULL : $activesheet->getCell("G{$row}")->getValue();
                        // // $av_major = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getValue();
                        // // $av_critical = ($activesheet->getCell("I{$row}")->getValue() == '') ? NULL : $activesheet->getCell("I{$row}")->getValue();
                        // $minor_overall_sum = ($activesheet->getCell("J{$row}")->getValue() == '') ? NULL : $activesheet->getCell("J{$row}")->getValue();
                        // $major_overall_sum = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                        // $critical_overall_sum = ($activesheet->getCell("L{$row}")->getValue() == '') ? NULL : $activesheet->getCell("L{$row}")->getValue();
                        // $three_year_minor_summary = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                        // $three_year_major_summary = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                        // $three_year_critical_summary = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();
                        // $facility_type_name = ($activesheet->getCell("P{$row}")->getValue() == '') ? NULL : $activesheet->getCell("P{$row}")->getValue();
                        // $facility_type_rate = ($activesheet->getCell("Q{$row}")->getValue() == '') ? NULL : $activesheet->getCell("Q{$row}")->getValue();
                        // $api_manufacturer_physical_address = ($activesheet->getCell("R{$row}")->getValue() == '') ? NULL : $activesheet->getCell("R{$row}")->getValue();
                        // $api_manufacturer_telephone = ($activesheet->getCell("S{$row}")->getValue() == '') ? NULL : $activesheet->getCell("S{$row}")->getValue();
                        $last_compliance_risk = ($activesheet->getCell("G{$row}")->getValue() == '') ? NULL : $activesheet->getCell("G{$row}")->getValue();
                        $last_intrisic_risk = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getValue();
                        // if($first_inspection_date!='N/A'){
                        //     $first_inspection_date_conv = strtotime($first_inspection_date);
                        //     $first_inspection_date_fmt = date('Y-m-d',$first_inspection_date_conv);
                        //     $first_inspection_date = ($first_inspection_date_fmt == '1970-01-01') ? NULL : $first_inspection_date_fmt;
                        // }else{
                        //     $first_inspection_date = NULL;
                        // }
                        

                        //facility scale

                        //region
                        if(DB::table('par_regions')->where('name', 'ilike', $district_name)->count() > 0){
                            $data = DB::table('par_regions')->where('name', 'ilike', $district_name)->first();
                            $region_id = $data->id;
                        }else{
                            $region = insertRecord('par_regions', ['name'=>$district_name, 'country_id'=>30]);
                            if(!isset($region['record_id'])){
                                dd($region);
                            }
                            $region_id = $region['record_id'];
                        }
                        if(DB::table('par_districts')->where('name', 'ilike', $region_name)->count() > 0){
                            $district_data = DB::table('par_districts')->where('name', 'ilike', $region_name)->first();
                            $district_id = $district_data->id;
                            if( $district_data->region_id != $region_id){
                                $res = updateRecord('par_districts', ['id'=>$district_id], ['region_id'=>$region_id]);
                                if(!isset($res['record_id'])){
                                    dd($res);
                                }
                            }
                        }else{
                            $district = insertRecord('par_districts', ['name'=>$region_name, 'region_id'=>$region_id]);
                            if(!isset($district['record_id'])){
                                dd($district);
                            }
                            $district_id = $district['record_id'];
                        }

                        // //facility type
                        // $risk_premise_type_role_id = 4;
                        // $risk_premise_type_role_id = 5;
                        // $risk_premise_type_role_id = 6;

                        // if(str_contains(strtolower($facility_type_name), 'retail')){
                        //     if($facility_type_rate > 2){
                        //         $risk_premise_type_role_id = 4;
                        //     }else if($facility_type_rate > 1){
                        //         $risk_premise_type_role_id = 5;
                        //     }else{
                        //         $risk_premise_type_role_id = 6;
                        //     }
                        // }else if(str_contains(strtolower($facility_type_name), 'distributor')){
                        //     if($facility_type_rate > 2){
                        //         $risk_premise_type_role_id = 3;
                        //     }else if($facility_type_rate > 1){
                        //         $risk_premise_type_role_id = 2;
                        //     }else{
                        //         $risk_premise_type_role_id = 1;
                        //     }
                        // }else if(str_contains(strtolower($facility_type_name), 'wholesale')){
                        //     if($facility_type_rate > 2){
                        //         $risk_premise_type_role_id = 9;
                        //     }else if($facility_type_rate > 1){
                        //         $risk_premise_type_role_id = 8;
                        //     }else{
                        //         $risk_premise_type_role_id = 7;
                        //     }
                        // }
                        // //premise type
                        // $risk_premise_type_id = getSingleRecordColValue('par_risk_premise_types_roles', ['id'=>$risk_premise_type_role_id], 'risk_premise_type_id');
                        // $qry = DB::table('par_risk_premise_types_mapping as t1')
                        //         ->join('par_premises_types as t2', 't1.premise_type_id', 't2.id')
                        //         ->where('risk_premise_type_id', $risk_premise_type_id)
                        //         ->select('t1.premise_type_id','t2.code');

                        // if(str_contains(strtolower($facility_type_name), 'vmp')){
                        //     $qry->where('section_id', 3);
                        //     $section_id = 3;
                        // }else{
                        //     $qry->where('section_id', 2);
                        //     $section_id = 2;
                        // }
                        // $facility_type = $qry->first();
                        
                        // $premise_type_id = $facility_type->premise_type_id;
                        // print_r($premise_type_id);
                        $data_to_be_inserted = [
                            'name' => $name,
                            'section_id' => 2,
                            'country_id' => 30,
                            'region_id' => $region_id,
                            'district_id' => $district_id,
                            // 'physical_address' => $physical_address,
                            // 'risk_premise_type_role_id' => $risk_premise_type_role_id,
                            // 'risk_premise_type_id' => $risk_premise_type_id,
                            // 'distance_kms' => $distance_kms,
                            // 'age' => $age,
                            // 'minor_overall_sum' => $minor_overall_sum,
                            // 'major_overall_sum' => $major_overall_sum,
                            // 'critical_overall_sum' => $critical_overall_sum,
                            'last_compliance_risk' => $last_compliance_risk,
                            'last_intrisic_risk' => $last_intrisic_risk,
                            // 'first_inspection_date' => $first_inspection_date,
                            'is_migrated' => 1
                        ];
                        $res = insertRecord('tra_premises', $data_to_be_inserted, $user_id);
                        if(!isset($res['record_id'])){
                            DB::rollBack();
                            return \response()->json($res);
                        }
                        $premise_id = $res['record_id'];
                        //create applicaiton
                        $sub_module_id = 1;
                        $process_id = 102;//getSingleRecordColValue('wf_processes', array('sub_module_id' => $sub_module_id, 'section_id' => $section_id, 'premise_type_id' => $premise_type_id), 'id');
                        $branch_id = 1;
                        $module_id = 2;
                        $section_id = 2;
                        $applications_table = 'tra_premises_applications';
                        $workflow_stage_id = 1344;


                        // $premise_type_code = $facility_type->code;

                        $section_code = getSingleRecordColValue('par_sections', array('id' => $section_id), 'code');
                        $codes_array = array(
                            // 'permittype_code' => $premise_type_code,
                            'section_code' => $section_code
                        );
                        $view_id = generateApplicationViewID();
                        $tracking_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $process_id, $branch_id, $user_id);
                        if ($tracking_details['success'] == false) {
                            DB::rollBack();
                            return \response()->json($tracking_details);
                        }
                        $tracking_no = $tracking_details['tracking_no'];
                        $application_code = generateApplicationCode($sub_module_id, $applications_table);
                        $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
                        $application_params = array(
                            'view_id' => $view_id,
                            'module_id' => $module_id,
                            'sub_module_id' => $sub_module_id,
                            'section_id' => $section_id,
                            'application_code' => $application_code,
                            'application_region_id' => $region_id,
                            'branch_id' => $branch_id,
                            'premise_id' => $premise_id,
                            'process_id' => $process_id,
                            'workflow_stage_id' => $workflow_stage_id,
                            'tracking_no' => $tracking_no,
                            // 'investment_capital'=>$investment_capital,
                            // 'premise_type_id'=>$premise_type_id,
                            'application_status_id' => $application_status->status_id,
                            'fasttrack_option_id'=> 2
                        );

                        $res = insertRecord($applications_table, $application_params, $user_id);
                        if(!isset($res['record_id'])){
                            DB::rollBack();
                            return \response()->json($res);
                        }
                        $application_id = $res['record_id'];
                        //insert registration table
                        $reg_params = array(
                            'tra_premise_id' => $premise_id,
                            'created_by' => $user_id
                        );
                        createInitialRegistrationRecord('tra_registered_premises', $applications_table, $reg_params, $application_id, 'reg_premise_id');
                        //DMS
                      initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no, $user_id);
                        // add to submissions table
                        $submission_params = array(
                            'application_id' => $application_id,
                            'view_id' => $view_id,
                            'process_id' => $process_id,
                            'application_code' => $application_code,
                            'tracking_no' => $tracking_no,
                            'usr_from' => $user_id,
                            'usr_to' => $user_id,
                            'previous_stage' => $workflow_stage_id,
                            'current_stage' => $workflow_stage_id,
                            'module_id' => $module_id,
                            'sub_module_id' => $sub_module_id,
                            'section_id' => $section_id,
                            'application_status_id' => $application_status->status_id,
                            'urgency' => 1,
                            // 'premise_type_id' => $premise_type_id,
                            // 'branch_id' => $branch_id,
                            'remarks' => 'Initial save of the application',
                            'date_received' => Carbon::now(),
                            'created_on' => Carbon::now(),
                            'created_by' => $user_id
                        );
                        DB::table('tra_submissions')
                            ->insert($submission_params);
                        
                        //inspection details log
                        $data = array(
                            'application_id' => $application_id,
                            'application_code' => $application_code,
                            // 'start_date' => $first_inspection_date,
                            'inspection_type_id' => 3,
                            'tracking_no' => 'mgr_'.$tracking_no,
                        );
                        $res = insertRecord('tra_premise_inspection_details', $data, $user_id);
                        if(!isset($res['record_id'])){
                            DB::rollBack();
                            return \response()->json($res);
                        }
                        $inspection_id = $res['record_id'];
                        //low
                        $low_comp_data = [];
                        // for ($i=0; $i < $three_year_minor_summary; $i++) {
                        //     $low_comp_data[] = array(
                        //         'premise_id' => $premise_id,
                        //         'inspection_id' => $inspection_id,
                        //         'facility_risk_item_id' => 1,
                        //         'pass_status_id' => 2,
                        //         'findings' => 'Migrated as history'
                        //     );
                        // }
                        // insertMultipleRecords('tra_facility_inspection_compliances', $low_comp_data);
                        // //major
                        // $major_comp_data = [];
                        // for ($i=0; $i < $three_year_major_summary; $i++) {
                        //     $major_comp_data[] = array(
                        //         'premise_id' => $premise_id,
                        //         'inspection_id' => $inspection_id,
                        //         'facility_risk_item_id' => 2,
                        //         'pass_status_id' => 2,
                        //         'findings' => 'Migrated as history'
                        //     );
                        // }
                        // insertMultipleRecords('tra_facility_inspection_compliances', $major_comp_data);
                        // //critical
                        // $critical_comp_data = [];
                        // for ($i=0; $i < $three_year_critical_summary; $i++) {
                        //     $critical_comp_data[] = array(
                        //         'premise_id' => $premise_id,
                        //         'inspection_id' => $inspection_id,
                        //         'facility_risk_item_id' => 2,
                        //         'pass_status_id' => 2,
                        //         'findings' => 'Migrated as history'
                        //     );
                        // }
                        // $res = insertRecord('tra_facility_inspection_compliances', ['minor_compliances'=> $three_year_minor_summary, 'major_compliances'=>$three_year_major_summary, 'critical_compliances' => $three_year_critical_summary]);
                        // $migrations_db->table('mg_response_to_human_medicines_screening')->insert(['comments' => $name]);
                    }

                }

            }
            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully"
            );




            // $migrations_db->commit(); facility_type
            DB::commit();

            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }
    public function migrateRegionData(Request $request){
        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(0);


                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            // $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];
            $user_id = 1;
            // $migrations_db->beginTransaction();
            DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {
                $region = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("B{$row}")->getValue();//tra_premises_applications
                $district = ($activesheet->getCell("C{$row}")->getValue() == '') ? NULL : $activesheet->getCell("C{$row}")->getValue();
                $sub_district = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getValue();
               //region populate and check if exists
                $region_id = DB::table('par_regions')->whereRaw("regexp_replace(name, '[^a-zA-Z0-9]', '', 'g') ilike '".preg_replace('/[^a-zA-Z0-9]/', '', $region)."'")->value('id');
               
                if(!$region_id){
                    $region_id = DB::table('par_regions')->insertGetId(['name'=> preg_replace('/[^a-zA-Z0-9]/', '', $region)]);
                }
                //district populate and check if exists
                $district_id = DB::table('par_districts')->whereRaw("regexp_replace(name, '[^a-zA-Z0-9]', '', 'g') ilike '".preg_replace('/[^a-zA-Z0-9]/', '', $district)."'")->value('id');

                if(!$district_id){
                    $district_id = DB::table('par_districts')->insertGetId(['name'=> preg_replace('/[^a-zA-Z0-9]/', '', $district), 'region_id' => $region_id]);
                }

                //district populate and check if exists
                $sub_district_id = DB::table('par_subdistricts')->whereRaw("regexp_replace(name, '[^a-zA-Z0-9]', '', 'g') ilike '".preg_replace('/[^a-zA-Z0-9]/', '', $sub_district)."'")->value('id');

                if(!$sub_district_id){
                    $sub_district_id = DB::table('par_subdistricts')->insertGetId(['name'=> preg_replace('/[^a-zA-Z0-9]/', '', $sub_district), 'district_id' => $district_id]);
                }
            }
            //done
            $res = array('success' => true, 'message' => 'Region Data migrated successfully');
            DB::commit();
        } catch (\Exception $exception) {
            // $migrations_db->rollBack();
            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            // $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);
    }

    //bluebook scripts
     //pick excel sheet form and dump its data to data base
    public function uploadExcelSheetForHumanMedsBlueBook(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(0);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];


            $migrations_db->beginTransaction();
            // DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {


                $bot_no = ($activesheet->getCell("L{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("L{$row}")->getValue();

                if($bot_no != ''){
                    if(!$migrations_db->table('mg_human_medicines_bluebook')->where('bot_no', $bot_no)->exists()){

                        $common_name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("A{$row}")->getFormattedValue();
                        $brand_name = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("B{$row}")->getFormattedValue();
                        $strength = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("C{$row}")->getFormattedValue();
                        $dosage_form = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getFormattedValue();
                        $schedule = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getValue();
                        $product_type = ($activesheet->getCell("F{$row}")->getValue() == '') ? NULL : $activesheet->getCell("F{$row}")->getValue();
                        $pack_size = ($activesheet->getCell("G{$row}")->getValue() == '') ? NULL : $activesheet->getCell("G{$row}")->getValue();
                        $applicant_name = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getValue();
                        $applicant_email = ($activesheet->getCell("I{$row}")->getValue() == '') ? NULL : $activesheet->getCell("I{$row}")->getValue();
                        $applicant_physical_address = ($activesheet->getCell("J{$row}")->getValue() == '') ? NULL : $activesheet->getCell("J{$row}")->getValue();
                        $applicant_country = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                        // $country_of_origin = ($activesheet->getCell("L{$row}")->getValue() == '') ? NULL : $activesheet->getCell("L{$row}")->getValue();
                        $registration_date = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                        $expiry_date = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                        $retained = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();
                        $completeness = ($activesheet->getCell("P{$row}")->getValue() == '') ? NULL : $activesheet->getCell("P{$row}")->getValue();
                        
                        if(validateIsNumeric($registration_date)){
                            // $registration_date = strtotime($registration_date);
                            $registration_date = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($registration_date);
                            $registration_date_fmt = $registration_date->format('Y-m-d');
                            $registration_date_fmt = ($registration_date_fmt == '1970-01-01') ? NULL : $registration_date_fmt;
                        }else{
                            $registration_date_fmt = null;
                        }
                        if(validateIsNumeric($expiry_date)){
                            $expiry_date = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($expiry_date);
                            $expiry_date_fmt = $expiry_date->format('Y-m-d');
                            $expiry_date_fmt = ($expiry_date_fmt == '1970-01-01') ? NULL : $expiry_date_fmt;
                        }else{
                            $expiry_date_fmt = null;
                        }
                        if(trim($completeness) == 'YES'){
                            $is_incomplete = 1;
                        }else{
                            $is_incomplete = 0;
                        }
                        $data_to_be_inserted [] = [
                            'bot_no' => $bot_no,
                            'brand_name' => $brand_name,
                            'common_name' => $common_name,
                            'strength' => $strength,
                            'dosage_form' => $dosage_form,
                            'schedule' => $schedule,
                            'product_type' => $product_type,
                            'pack_size' => $pack_size,
                            'applicant_name' => $applicant_name,
                            'applicant_email' => $applicant_email,
                            'applicant_physical_address' => $applicant_physical_address,
                            'applicant_country' => $applicant_country,
                            'registration_date' => $registration_date_fmt,
                            'expiry_date' => $expiry_date_fmt,
                            'retained' => $retained,
                            'is_incomplete' => $is_incomplete
                        ];
                    }

                }

            }

            //screening register operations
            $screening_register_collection = collect($data_to_be_inserted);
            $screening_register_chunks = $screening_register_collection->chunk(50);

            foreach($screening_register_chunks as $chunk){
                $migrations_db->table('mg_human_medicines_bluebook')->insert($chunk->toArray());
            }

            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $data_to_be_inserted

            );




            $migrations_db->commit();
            // DB::commit();

            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            // DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            // DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }

    public function uploadExcelSheetForHumanMedsBlueBookManufacturers(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(1);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];


            $migrations_db->beginTransaction();
            // DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {
                $bot_no = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("A{$row}")->getValue();
                $physical_address = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("C{$row}")->getFormattedValue();
                if($bot_no != ''){
                    if(!$migrations_db->table('mg_human_medicines_bluebook_man')->where(['bot_no' => $bot_no, 'physical_address' => $physical_address])->exists()){

                        $name = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("B{$row}")->getFormattedValue();
                        $country = ($activesheet->getCell("D{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("D{$row}")->getFormattedValue();
                        $role = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getFormattedValue();
                        $product_origin = ($activesheet->getCell("F{$row}")->getValue() == '') ? NULL : $activesheet->getCell("F{$row}")->getFormattedValue();
                        
                        $data_to_be_inserted [] = [
                            'name' => $name,
                            'physical_address' => $physical_address,
                            'country' => $country,
                            'role' => $role,
                            'product_origin' => $product_origin,
                            'bot_no' => $bot_no
                        ];
                    }

                }

            }

            //screening register operations
            $screening_register_collection = collect($data_to_be_inserted);
            $screening_register_chunks = $screening_register_collection->chunk(50);

            foreach($screening_register_chunks as $chunk){
                $migrations_db->table('mg_human_medicines_bluebook_man')->insert($chunk->toArray());
            }

            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $data_to_be_inserted

            );
            $migrations_db->commit();
            FacadesFile::delete($filecopypath);

        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            // DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            // DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }
    public function migrateBluebooktoRegister(Request $req){
        try {
            $migrations_db = DB::connection('migrations_db');
            $bluebook_register = $migrations_db->table('mg_human_medicines_bluebook')->get();
            //application table
            foreach($bluebook_register as $data){
                        //insert product info and get the id shelf_life
                        //first check if the data has been inserted use_instruction

                if(!DB::table('tra_product_applications')->where('tracking_no', $data->bot_no)->exists()){

                    //country
                    $country_of_origin = getSingleRecordColValue('mg_human_medicines_bluebook_man', ['bot_no'=>$data->bot_no], 'product_origin', 'migrations_db');
                    if(DB::table('par_countries')->where(['name'=>trim($country_of_origin)])->exists()){
                         $country_of_origin_id = DB::table('par_countries')->where('name','=',trim($country_of_origin))->value('id');
                    }else{
                        $country_of_origin_id = 0;
                    }
                    //dosage form
                    if(!DB::table('par_dosage_forms')->where('name','=',trim($data->dosage_form))->exists() && $data->dosage_form != ''){
                        $product_form_id = DB::table('par_dosage_forms')->insertGetId(['name' => trim($data->dosage_form), 'is_enabled'=> 1]);
                    }else{
                        if( $data->dosage_form != Null){
                            $product_form_id = DB::table('par_dosage_forms')->where('name','=',trim($data->dosage_form))->value('id');
                        }else{
                            $product_form_id = 0;
                        }
                    }
                    
                   
                    //schedule
                    if($data->schedule != Null && DB::table('par_schedule_types')->where('name', trim($data->schedule))->exists()){
                         $schedule_id = DB::table('par_schedule_types')->where('name',trim($data->schedule))->value('id');
                    }else{
                        $schedule_id = DB::table('par_schedule_types')->insertGetId(['name' => trim($data->schedule), 'is_enabled'=> 1]);
                    }

                    //$retained
                    if($data->retained == 'YES'){
                        $retained = 1;
                    }else{
                        $retained = 2;
                    }
                    $product_id = DB::table('tra_product_information')->insertGetId([
                        "brand_name" => $data->brand_name,
                        "common_name" => $data->common_name,
                        "strength" => $data->strength,
                        "pack_size" => $data->pack_size,
                        "schedule" => $data->schedule,
                        "schedule_id" => $schedule_id,
                        "letter_ref" => $data->bot_no,
                        'retained' => $retained,
                        'country_of_origin_id' => $country_of_origin_id,
                        'dosage_form_id' => $product_form_id

                    ]);     
                     //check if applicant_email exists
                    if(!DB::table('wb_trader_account')->where('name','=', trim($data->applicant_name))->exists()){
                        //get the id of the country of the applicant
                        if($data->applicant_country == NULL){
                            $applicant_country_id = NULL;
                        }
                        else {
                            $country = DB::table('par_countries')->where('name','=',trim($data->applicant_country))->first();
                            if(isset($country->id)){
                                $applicant_country_id = $country->id;
                            }else{
                                $applicant_country_id = NULL;
                            }
                            
                        }

                        $trader_account_type_id = 1;

                        $applicant_id = DB::table('wb_trader_account')->insertGetId([
                            'name' => $data->applicant_name,
                            'email' => $data->applicant_email,
                            'physical_address' => $data->applicant_physical_address,
                            'country_id' => $applicant_country_id,
                            'traderaccount_type_id' => $trader_account_type_id,
                            'trader_category_id' =>  1//the category get equated to one i.e Product registrant
                        ]);

                    }else {
                        if($data->applicant_name != Null){
                            $applicant = DB::table('wb_trader_account')->where('email','=',trim($data->applicant_name))->first();
                            $applicant_id = $applicant->id;
                            $applicant_country_id =  $applicant->country_id;
                            $trader_account_type_id = 1;
                        }else{
                            $applicant_id =0;
                            $applicant_country_id =  0;
                            $trader_account_type_id = 0;
                        }
                        
                    }



                    //product_type
                    if($data->product_type == 'Biotherapeutic'){
                        $product_type_id = 8;

                    }else if ($data->product_type == 'Small molecule'){
                        $product_type_id = 7;
                    }else{
                        $product_type_id = null;
                    }
                    
                    
                    //manuacturer_id
                    $man_data = $migrations_db->table('mg_human_medicines_bluebook_man')->where('bot_no', $data->bot_no)->get();
                    foreach ($man_data as $manufacturer) {
                        //country id
                        if($manufacturer->country == NULL){
                            $country_id = NULL;
                        }
                        else {
                            $country = DB::table('par_countries')->where('name','=',trim($manufacturer->country))->first();
                            if(isset($country->id)){
                                $country_id = $country->id;
                            }else{
                                $country_id = NULL;
                            }
                        }
                        if(!DB::table('tra_manufacturers_information')->where('name',trim($manufacturer->name))->exists()){
                            $manufacturer_id = DB::table('tra_manufacturers_information')->insertGetId([
                                'name' => $manufacturer->name,
                                'physical_address' => $manufacturer->physical_address,
                                'country_id' => $country_id
                            ]);

                        }else {
                            //update country, physical address
                            DB::table('tra_manufacturers_information')->where('name','=',trim($manufacturer->name))->update(
                                [
                                    'physical_address' => $manufacturer->physical_address,
                                    'country_id' => $country_id 
                                ]
                            );
                            $manufacturer_rec = DB::table('tra_manufacturers_information')->where('name','=',trim($manufacturer->name))->first();
                            $manufacturer_id = $manufacturer_rec->id;
                        }
                        //role
                        $manufacturer_role_id = 3;
                        if(str_contains($manufacturer->role, 'All')){
                            $manufacturer_role_id = 3;
                        }else if(str_contains($manufacturer->role, 'Pack')){
                            $manufacturer_role_id = 16;
                        }else if(str_contains($manufacturer->role, 'label')){
                            $manufacturer_role_id = 4;
                        }
                        //insert product manufacturer
                        if(!DB::table('tra_product_manufacturers')->where(['manufacturer_id'=>$manufacturer_id, 'product_id' => $product_id])->exists()){
                             DB::table('tra_product_manufacturers')->insertGetId(['manufacturer_id' => $manufacturer_id, 'product_id'=> $product_id, 'manufacturer_type_id' => 1,'manufacturer_role_id' => $manufacturer_role_id ]);

                        }
                    }
                     //generate application code
                   $application_code = generateApplicationCode(70,'tra_product_applications');
                   $view_id = generateApplicationViewID();
                   $workflow_stage_id = 1372;
                     //
                    $active_application_id = DB::table('tra_product_applications')->insertGetId([
                        "tracking_no" => $data->bot_no,
                        "product_id" => $product_id,
                        "applicant_id" => $applicant_id,
                        "application_code" => $application_code,
                        "view_id" => $view_id,
                        "module_id" => 1,
                        "sub_module_id" => 70,
                        "section_id" => 2,
                        "product_type_id" => $product_type_id,
                        "process_id" => 45,
                        'prodclass_category_id' => 3,
                        "workflow_stage_id" => $workflow_stage_id,
                        "is_fast_track" => 2,
                        'is_incomplete' => $data->is_incomplete,
                        "created_on" => Carbon::now()
                    ]);

                    $submission_params = array(
                        'application_id' => $active_application_id,
                        'process_id' => 45,
                        'application_code' => $application_code,
                        'prodclass_category_id' => 3,
                        "tracking_no" => $data->bot_no,
                        'previous_stage' => $workflow_stage_id,
                        'current_stage' => $workflow_stage_id,
                        'module_id' => 1,
                        "sub_module_id" => 70,
                        "section_id" => 2,
                        'application_status_id' => 12,
                        'urgency' => 1,
                        'applicant_id' => $applicant_id,
                        'branch_id' => 1,
                        'is_done' => 1,
                        'isComplete' => 1,
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'created_by' => \Auth::user()->id
                    );
                    $log = insertRecord('tra_submissions', $submission_params);
                    if(!$log['success']){
                        DB::rollBack();
                        dd($log);
                    }
                    //approval log
                    $params = array(
                        'application_id' => $active_application_id,
                        'application_code' => $application_code,
                        'workflow_stage_id' => $workflow_stage_id,
                        'decision_id' => 1,
                        'module_id' => 1,
                        'comment' => 'migrated approval',
                        'approval_date' => $data->registration_date,
                        'certificate_issue_date' => $data->registration_date,
                        'expiry_date' => $data->expiry_date,
                        'certificate_no' => $data->bot_no,
                        'appvalidity_status_id' => 2,
                        'appregistration_status_id' => 2,
                        'certificate_no' => $data->bot_no,
                        'is_migrated' => 1
                    );
                    $app_res = insertRecord('tra_approval_recommendations', $params);
                    if(!$app_res['record_id']){
                        DB::rollBack();
                        dd($app_res);
                    }

                    //registered product data
                    $registration_data = array(
                        'tra_product_id'=>$product_id, 
                        'status_id'=> 10,
                        'validity_status_id'=> 2,
                        'registration_status_id'=> 2,
                        'registration_date'=>$data->registration_date,
                        'approval_date'=>$data->registration_date,
                        'expiry_date'=>$data->expiry_date,
                        'registration_no'=> $data->bot_no,
                        'active_application_code'=>$application_code,
                        'active_app_referenceno'=> $data->bot_no,
                        'registration_ref_no'=> $data->bot_no,
                        'is_migrated' => 1
                    );
                    $reg_res = insertRecord('tra_registered_products', $registration_data);
                    if(!$reg_res['record_id']){
                        DB::rollBack();
                        dd($reg_res);
                    }

                    //update product_application manufacturer_role_id
                    $app_data =  array(
                        'permit_id' => $app_res['record_id'],
                        'reg_product_id' => $reg_res['record_id'], 
                        'application_status_id'=> 6,
                        'dola' => Carbon::now(),
                        'altered_by' => $this->user_id
                    );
                    $app_where = array('id'=>$active_application_id);

                    $res = updateRecord('tra_product_applications', $app_where,$app_data, $this->user_id);

                }
            }
            $res = array(
                'success' => true,
                'message' => 'Transfer done successfully'
            );
            DB::commit();
            
        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);
    }
    //update
     public function migrateBluebooktoRegisterUpdate(Request $req){
        try {
            $migrations_db = DB::connection('migrations_db');
            $bluebook_register = $migrations_db->table('mg_human_medicines_bluebook')->get();
            //application table
            foreach($bluebook_register as $data){
                        //insert product info and get the id shelf_life
                        //first check if the data has been inserted use_instruction

                if(DB::table('tra_product_applications')->where('tracking_no', $data->bot_no)->exists()){
                    //
                    $app_data = DB::table('tra_product_applications')->where('tracking_no', $data->bot_no)->first();
                    $product_id = $app_data->product_id;
                    //country
                    $country_of_origin = getSingleRecordColValue('mg_human_medicines_bluebook_man', ['bot_no'=>$data->bot_no], 'product_origin', 'migrations_db');
                    if(DB::table('par_countries')->where(['name'=>$country_of_origin])->exists()){
                         $country_of_origin_id = DB::table('par_countries')->where('name','=',$country_of_origin)->value('id');
                    }else{
                        $country_of_origin_id = 0;
                    }
                    //dosage form
                    if(!DB::table('par_dosage_forms')->where('name','=',$data->dosage_form)->exists() && $data->dosage_form != ''){
                        $product_form_id = DB::table('par_dosage_forms')->insertGetId(['name' => $data->dosage_form, 'is_enabled'=> 1]);
                    }else{
                        if( $data->dosage_form != Null){
                            $product_form_id = DB::table('par_dosage_forms')->where('name','=',$data->dosage_form)->value('id');
                        }else{
                            $product_form_id = 0;
                        }
                    }
                    
                   
                    //schedule
                    if($data->schedule != Null && DB::table('par_schedule_types')->where('description', 'ilike','%'.trim($data->schedule).'%')->exists()){
                         $schedule_id = DB::table('par_schedule_types')->where('name',trim($data->schedule))->value('id');
                    }else{
                        $schedule_id = DB::table('par_schedule_types')->insertGetId(['name' => trim($data->schedule), 'is_enabled'=> 1]);
                    }

                    //$retained
                    if($data->retained == 'YES'){
                        $retained = 1;
                    }else{
                        $retained = 2;
                    }
                    DB::table('tra_product_information')->update([
                        "brand_name" => $data->brand_name,
                        "common_name" => $data->common_name,
                        "strength" => $data->strength,
                        "pack_size" => $data->pack_size,
                        "schedule" => $data->schedule,
                        "schedule_id" => $schedule_id,
                        "letter_ref" => $data->bot_no,
                        'retained' => $retained,
                        'country_of_origin_id' => $country_of_origin_id,
                        'dosage_form_id' => $product_form_id

                    ]);     
                     //check if applicant_email exists
                    if(!DB::table('wb_trader_account')->where('name','=', trim($data->applicant_name))->exists()){
                        //get the id of the country of the applicant
                        if($data->applicant_country == NULL){
                            $applicant_country_id = NULL;
                        }
                        else {
                            $country = DB::table('par_countries')->where('name','=',trim($data->applicant_country))->first();
                            if(isset($country->id)){
                                $applicant_country_id = $country->id;
                            }else{
                                $applicant_country_id = NULL;
                            }
                            
                        }

                        $trader_account_type_id = 1;

                        $applicant_id = DB::table('wb_trader_account')->insertGetId([
                            'name' => $data->applicant_name,
                            'email' => $data->applicant_email,
                            'physical_address' => $data->applicant_physical_address,
                            'country_id' => $applicant_country_id,
                            'traderaccount_type_id' => $trader_account_type_id,
                            'trader_category_id' =>  1//the category get equated to one i.e Product registrant
                        ]);

                    }else {
                        if($data->applicant_name != Null){
                            $applicant = DB::table('wb_trader_account')->where('name','=',trim($data->applicant_name))->first();
                            $applicant_id = $applicant->id;
                            $applicant_country_id =  $applicant->country_id;
                            $trader_account_type_id = 1;
                        }else{
                            $applicant_id =0;
                            $applicant_country_id =  0;
                            $trader_account_type_id = 0;
                        }
                        
                    }



                    //product_type
                    if($data->product_type == 'Biotherapeutic'){
                        $product_type_id = 8;

                    }else if ($data->product_type == 'Small molecule'){
                        $product_type_id = 7;
                    }else{
                        $product_type_id = null;
                    }
                    
                    
                    //manuacturer_id
                    $man_data = $migrations_db->table('mg_human_medicines_bluebook_man')->where('bot_no', $data->bot_no)->get();
                    foreach ($man_data as $manufacturer) {
                        //country id
                        if($manufacturer->country == NULL){
                            $country_id = NULL;
                        }
                        else {
                            $country = DB::table('par_countries')->where('name','=',trim($manufacturer->country))->first();
                            if(isset($country->id)){
                                $country_id = $country->id;
                            }else{
                                $country_id = NULL;
                            }
                        }
                        if(!DB::table('tra_manufacturers_information')->where('name',trim($manufacturer->name))->exists()){

                            
                            $manufacturer_id = DB::table('tra_manufacturers_information')->insertGetId([
                                'name' => $manufacturer->name,
                                'physical_address' => $manufacturer->physical_address,
                                'country_id' => $country_id
                            ]);

                        }else {
                            //update country, physical address
                            DB::table('tra_manufacturers_information')->where('name','=',trim($manufacturer->name))->update(
                                [
                                    'physical_address' => $manufacturer->physical_address,
                                    'country_id' => $country_id 
                                ]
                            );
                            $manufacturer_rec = DB::table('tra_manufacturers_information')->where('name','=',trim($manufacturer->name))->first();
                            $manufacturer_id = $manufacturer_rec->id;
                        }
                        //role
                        $manufacturer_role_id = 3;
                        if(str_contains($manufacturer->role, 'All')){
                            $manufacturer_role_id = 3;
                        }else if(str_contains($manufacturer->role, 'Pack')){
                            $manufacturer_role_id = 16;
                        }else if(str_contains($manufacturer->role, 'label')){
                            $manufacturer_role_id = 4;
                        }
                        //insert product manufacturer
                        if(!DB::table('tra_product_manufacturers')->where(['manufacturer_id'=>$manufacturer_id, 'product_id' => $product_id])->exists()){
                             DB::table('tra_product_manufacturers')->insertGetId(['manufacturer_id' => $manufacturer_id, 'product_id'=> $product_id, 'manufacturer_type_id' => 1,'manufacturer_role_id' => $manufacturer_role_id ]);

                        }
                    }
                     $active_application_id = DB::table('tra_product_applications')->update([
                        "applicant_id" => $applicant_id,
                        "product_type_id" => $product_type_id,
                        'is_incomplete' => $data->is_incomplete,
                        "created_on" => Carbon::now()
                    ]);

                }
            }
            $res = array(
                'success' => true,
                'message' => 'Transfer done successfully'
            );
            DB::commit();
            
        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function uploadExcelSheetForVetinaryMedicinesRegister(Request $request){

        $migrations_db_Test = null;
       
        try{

            //getting data from the first sheet and saving them
            //step 1 : request file from the client side
            $excelFile = $request->file('excelfile');
            
            //step 2 : get the file name
            $excelFileName = $excelFile->getClientOriginalName();

            //step 3 : create a temporary storage
            $fileStoragePath = storage_path('app');
            $fileCopyPath = $excelFile->move($fileStoragePath,$excelFileName);

            //step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
          
            $spreadsheet = $reader->load($fileCopyPath);

            $migrations_db_Test = DB::connection('migrations_db');
            $migrations_db_Test->beginTransaction();
        
            for ($i=2; $i < 4; $i++) {

            $activeSheet = $spreadsheet->getSheet($i);
            if($i < 3){
                $sub_module_id = 71;
            }else{
                $sub_module_id = 70;
            }
            //step 6 : fetch all the rows
            $rowsWithinTheActivesheet = $activeSheet->getHighestDataRow();
            

            $data_to_be_inserted = [];
            // $genericName = '';
            
            for($row = 4;  $row <= $rowsWithinTheActivesheet; $row++ ){
                // $ID = 2;
                
                $by_number = ($activeSheet->getCell("I{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("I{$row}")->getValue();
                
                if($by_number != ''){

                    if(!$migrations_db_Test->table('vetinary_medicines_register')->where('by_number', '=' , $by_number)->exists()){

                        $genericName = ($activeSheet->getCell("A{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("A{$row}")->getValue();
                        $brand_name_strength_form = ($activeSheet->getCell("B{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("B{$row}")->getValue();
                        $name_adress_manufacturer = ($activeSheet->getCell("C{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("C{$row}")->getValue();
                        $name_adress_company = ($activeSheet->getCell("D{$row}")->getValue() == '') ? NULL :$activeSheet->getCell("D{$row}")->getValue();
                        $pack_size =($activeSheet->getCell("E{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("E{$row}")-> getvalue();
                        $schedule_current_act = ($activeSheet->getCell("F{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("F{$row}")->getValue();
                        $bomra_proposed_schedule = ($activeSheet->getCell("G{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("G{$row}")->getValue();
                        $animal_species = ($activeSheet->getCell("H{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("H{$row}")->getValue();
                        $by_number = ($activeSheet->getCell("I{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("I{$row}")->getValue();
                        $retained = ($activeSheet->getCell("J{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("J{$row}")->getValue();

                    if($i > 2){
                        $registration_date = ($activeSheet->getCell("J{$row}")->getValue() == '') ? NULL : $activeSheet->getCell("J{$row}")->getValue();
                        $registration_date = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($registration_date);
                            $registration_date_fmt = $registration_date->format('Y-d-m');
                            $registration_date_fmt = ($registration_date_fmt == '1970-01-01') ? NULL : $registration_date_fmt;
                    }else{
                       $registration_date_fmt = NULL; 
                    }
                        
                        
                    $animal_species = explode('[', $animal_species);

                    $data_to_be_inserted [] = [
                                // "ID" => $ID,
                                "genericName" => $genericName,
                                "brand_name_strength_form" => $brand_name_strength_form,
                                "name_adress_manufacturer" => $name_adress_manufacturer,
                                "name_adress_company" => $name_adress_company,
                                "pack_size" => $pack_size,
                                "schedule_current_act" => $schedule_current_act,
                                "bomra_proposed_schedule" => $bomra_proposed_schedule,
                                "animal_species" => $animal_species[0],
                                "by_number" => $by_number,
                                "retained" => $retained,
                                "sub_module_id" => $sub_module_id,
                                'registration_date' => $registration_date_fmt

                    ];

           

                }

            }
           
            $vetinary_register_collection = collect($data_to_be_inserted);
           
            $vetinary_chunks = $vetinary_register_collection->chunk(100);
           
            foreach($vetinary_chunks as $chunk){
                $migrations_db_Test->table('vetinary_medicines_register')->insert($chunk->toArray());
            }
             $data_to_be_inserted = [];
        }
            
     
           

            $migrations_db_Test->commit();
           

            FacadesFile::delete($fileCopyPath);

            //  $ID++;

            $res = array(
            "success" => true,
            "message" => "data successfully uploaded",
            "results" => $data_to_be_inserted
            );

      

        }
    }
    catch (\Exception $exception) {
        if($migrations_db_Test){
            $migrations_db_Test->rollBack();
        }
            DB::rollBack();

            $res = array(
                "success" => false,
                "message" => "An error occurred: " . $exception->getMessage(),
            );
     }
     return response()->json($res);
   }
   public function transferVetRegister(Request $req){
        try {
            // get tw
            $migrations_db = DB::connection('migrations_db');
            DB::beginTransaction();

            //data
            $data = $migrations_db->table('vetinary_medicines_register')->get();
            foreach ($data as $rec) {
                if(!recordExists('tra_product_applications', ['tracking_no'=>$rec->by_number])){

                    $delimiter = "#"; // Specify your delimiter. In this example, it's a comma.
                    //insert product
                    $genericName = str_replace('$', ' ', $rec->genericName);
                    $genericName = str_replace('#', ' ', $genericName);
                    $pack_size = str_replace('#', ' ', $rec->pack_size);
                    $brand_name = explode('#', $rec->brand_name_strength_form);
                    $schedule = preg_replace('/\D/', '', $rec->schedule_current_act);

                    //get proposed schedule
                    $check_sc= DB::table('par_schedule_types')->where('name', 'ilike', trim($rec->bomra_proposed_schedule))->where('section_id', 3)->first();
                    if($check_sc){
                        $schedule_id = $check_sc->id;
                    }else{
                        $res = insertRecord('par_schedule_types', ['name' => trim($rec->bomra_proposed_schedule), 'section_id'=>3]);
                        if(!isset($res['record_id'])){
                            dd($res);
                        }
                        $schedule_id = $res['record_id'];
                    }
                    //dosage form
                    if(isset($brand_name[1])){
                        $form = str_replace(' ', '-', $brand_name[1]);
                        $form = str_replace('-', ' ', preg_replace('/[^A-Za-z0-9\-]/', '', $form));
                        $check_dos = DB::table('par_dosage_forms')->where('name', 'ilike', $form)->first();
                        if($check_dos){
                            $product_form_id = $check_dos->id;
                        }else{
                            $res = insertRecord('par_dosage_forms', ['name' => $form]);
                            if(!isset($res['record_id'])){
                                dd($res);
                            }
                            $product_form_id = $res['record_id'];
                        }
                    }else{
                        $product_form_id = 0;
                    }
                    
                    //insert product
                     $data = array(
                        'brand_name' => $brand_name[0],
                        'common_name' => $genericName,
                        'pack_size' => $pack_size,
                        'schedule_id' => $schedule,
                        'proposed_schedule_id' => $schedule_id,
                        'dosage_form_id' => $product_form_id,
                        // 'species_data' => $species_data,
                        'retained' => 1
                    );
                    //insert product
                    $product = insertRecord('tra_product_information', $data);
                    if(!isset($product['record_id'])){
                        dd($product);
                    }
                    $product_id = $product['record_id'];
                    //species species_data
                    $species = preg_replace('/\(|\)/', '', $rec->animal_species);
                    $species = str_ireplace('&',',', $species);
                    $species = explode(',', $species);
                    $species_array = [];
                    foreach ($species as $specie) {
                        $check_dos = DB::table('par_animal_species')->where('name', 'ilike', trim($specie))->first();
                        if($check_dos){
                            $species_id = $check_dos->id;
                        }else{
                            $res = insertRecord('par_animal_species', ['name' => trim($specie)]);
                            if(!isset($res['record_id'])){
                                dd($res);
                            }
                            $species_id = $res['record_id'];
                        }
                        $species_array[] = ['product_id'=>$product_id, 'species_id' => $species_id];
                    }
                    DB::table('tra_product_species')->insert($species_array);
                    //actives
                    $genericNameArray = explode($delimiter, $rec->genericName);
                    foreach ($genericNameArray as $ing_rec) {
                        $genericNameData = explode('$', $ing_rec);

                        $check = DB::table('par_ingredients_details')->where('name', 'ilike', '%'.$genericNameData[0].'%')->where('section_id', 3)->first();
                        if($check){
                            $ingredient_id = $check->id;
                        }else{
                            $res = insertRecord('par_ingredients_details', ['name' => $genericNameData[0], 'section_id'=>3]);
                            if(!isset($res['record_id'])){
                                    dd($res);
                                }
                            $ingredient_id = $res['record_id'];
                        }
                        if(isset($genericNameData[2])){
                            $check = DB::table('par_si_units')->where('name', 'ilike', '%'.$genericNameData[2].'%')->where('section_id', 3)->first();
                            if($check){
                                $unit_id = $check->id;
                            }else{
                                $res = insertRecord('par_si_units', ['name' => $genericNameData[2], 'section_id'=>3]);
                                if(!isset($res['record_id'])){
                                        dd($res);
                                    }
                                $unit_id = $res['record_id'];
                            }
                        }else{
                            $unit_id = 0;
                        }
                        if(!isset($genericNameData[1])){
                            $genericNameData[1] = 0;
                        }
                        $ing_data = ['ingredient_id'=>$ingredient_id, 'ingredientssi_unit_id'=>$unit_id, 'strength'=>$genericNameData[1], 'product_id' => $product_id, 'inclusion_reason_id' => 1];
                        $res = insertRecord('tra_product_ingredients', $ing_data);
                        if(!isset($res['record_id'])){
                            dd($res);
                        }
                    }

                    //application details
                    $applicant_array=explode('#', $rec->name_adress_company);
                    if(!DB::table('wb_trader_account')->where('name','ilike', $applicant_array[0])->exists()){
                        //get the id of the country of the applicant
                        if(!isset($applicant_array[1])){
                            $applicant_array[1] = '';
                        }
                        if(!isset($applicant_array[2])){
                            $applicant_country_id = NULL;
                        }
                        else {
                            $country = DB::table('par_countries')->where('name','ilike',trim($applicant_array[2]))->first();
                            if(isset($country->id)){
                                $applicant_country_id = $country->id;
                            }else{
                                $applicant_country_id = NULL;
                            }
                            
                        }
                        
                        //get the trader account type
                        $trader_account_type_id = 2;
                       
                        $applicant_id = DB::table('wb_trader_account')->insertGetId([
                            'name' => $applicant_array[0],
                            'physical_address' => $applicant_array[1],
                            'country_id' => $applicant_country_id,
                            'traderaccount_type_id' => $trader_account_type_id,
                            'trader_category_id' =>  1,//the category get equated to one i.e Product registrant
                        ]);

                    }else {
                        if($applicant_array[0] != Null){
                            $applicant = DB::table('wb_trader_account')->where('name','ilike',$applicant_array[0])->first();
                            $applicant_id = $applicant->id;
                            $applicant_country_id =  $applicant->country_id;
                            $applicant_region_id =  $applicant->region_id;
                            $trader_account_type_id = 2;
                        }else{
                            $applicant_id =0;
                            $applicant_country_id =  0;
                            $applicant_region_id = 0;
                            $trader_account_type_id = 0;
                        }
                        
                    }
                     //manuacturer_id
                    $list_man = explode('$', $rec->name_adress_manufacturer);
                    foreach ($list_man as $man) {
                        $man_array = explode('#', $man);
                        if(!DB::table('tra_manufacturers_information')->where('name','ilike',trim($man_array[0]))->exists()){

                            //country id
                            if(!isset($man_array[1])){
                                $man_array[1] = '';
                            }
                            if(!isset($man_array[2])){
                                $country_id = NULL;
                                $man_array[2] = '';
                            }
                            else {
                                $country = DB::table('par_countries')->where('name','ilike','%'.$man_array[2].'%')->first();
                                if(isset($country->id)){
                                    $country_id = $country->id;
                                }else{
                                    $country_id = NULL;
                                }
                            }
                            $manufacturer_id = DB::table('tra_manufacturers_information')->insertGetId([
                                'name' => $man_array[0],
                                'physical_address' => $man_array[1].','.$man_array[2],
                                'country_id' => $country_id
                            ]);
                            //add man site
                            DB::table('tra_manufacturing_sites')->insertGetId([
                                'name' => $man_array[0],
                                'physical_address' => $man_array[1].','.$man_array[2],
                                'country_id' => $country_id,
                                'manufacturer_id' => $manufacturer_id
                            ]);
                        }else {
                            $manufacturer = DB::table('tra_manufacturers_information')->where('name','ilike',trim($man_array[0]))->first();
                            $manufacturer_id = $manufacturer->id;
                        }
                        //insert product manufacturer
                        if(!DB::table('tra_product_manufacturers')->where(['manufacturer_id'=>$manufacturer_id, 'product_id' => $product_id])->exists()){
                             DB::table('tra_product_manufacturers')->insertGetId(['manufacturer_id' => $manufacturer_id, 'product_id'=> $product_id, 'manufacturer_type_id' => 1]);

                        }
                    }
                    $sub_module_id = $rec->sub_module_id;
                    $application_code = generateApplicationCode($sub_module_id,'tra_product_applications');
                    $view_id = generateApplicationViewID();

                    if($sub_module_id == 70){
                       $workflow_stage_id = 1427;
                        $process_id = 79; 
                    }else{
                        $workflow_stage_id = 1427;
                        $process_id = 234;
                    }
                    
                    $active_application_id = DB::table('tra_product_applications')->insertGetId([
                        "tracking_no" => $rec->by_number,
                        "product_id" => $product_id,
                        "applicant_id" => $applicant_id,
                        "application_code" => $application_code,
                        "view_id" => $view_id,
                        "module_id" => 1,
                        "sub_module_id" => $sub_module_id,
                        "section_id" => 3,
                        "process_id" => $process_id,
                        'prodclass_category_id' => 70,
                        "workflow_stage_id" => $workflow_stage_id,
                        "is_fast_track" => 2,
                        "is_migrated" => 1,
                        "created_on" => Carbon::now()
                    ]);

                    $submission_params = array(
                        'application_id' => $active_application_id,
                        'process_id' => $process_id,
                        'application_code' => $application_code,
                        'prodclass_category_id' => 70,
                        "tracking_no" => $rec->by_number,
                        'previous_stage' => $workflow_stage_id,
                        'current_stage' => $workflow_stage_id,
                        'module_id' => 1,
                        "sub_module_id" => $sub_module_id,
                        "section_id" => 3,
                        'application_status_id' => 10,
                        'urgency' => 1,
                        'applicant_id' => $applicant_id,
                        'branch_id' => 1,
                        'remarks' => 'Migrated Record',
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'created_by' => \Auth::user()->id
                    );
                    $log = insertRecord('tra_submissions', $submission_params);
                    if(!isset($log['record_id'])){
                        dd($log);
                    }
                     //approval log
                    if (strtotime($rec->registration_date) != '0000-00-00' && strtotime($rec->registration_date)){
                        //has dates already
                        $reg_date = $rec->registration_date;
                    }else{
                        if (str_contains($rec->by_number, 'BV21')) {
                            //default date
                            $reg_date = new Carbon('2022-04-01'); 
                        }else if(str_contains($rec->by_number, 'BV23')) {
                            $reg_date = new Carbon('2023-02-02'); 
                        }
                    }
                    $params = array(
                        'application_id' => $active_application_id,
                        'application_code' => $application_code,
                        'workflow_stage_id' => $workflow_stage_id,
                        'decision_id' => 1,
                        'module_id' => 1,
                        'comment' => 'migrated approval',
                        'certificate_no' => $rec->by_number,
                        'approval_date' => $reg_date,
                        'certificate_issue_date' => $reg_date,
                        'appvalidity_status_id' => 2,
                        'appregistration_status_id' => 2,
                        'certificate_no' => $rec->by_number,
                        'is_migrated' => 1
                    );
                    $app_res = insertRecord('tra_approval_recommendations', $params);
                    if(!isset($app_res['record_id'])){
                        DB::rollBack();
                        dd($app_res);
                    }

                    //registered product data
                    $registration_data = array(
                        'tra_product_id'=>$product_id, 
                        'status_id'=> 10,
                        'validity_status_id'=> 2,
                        'registration_status_id'=> 2,
                        'registration_no'=> $rec->by_number,
                        'approval_date' => $reg_date,
                        'registration_date' => $reg_date,
                        'active_application_code'=>$application_code,
                        'active_app_referenceno'=> $rec->by_number,
                        'registration_ref_no'=> $rec->by_number,
                        'is_migrated' => 1
                    );
                    $reg_res = insertRecord('tra_registered_products', $registration_data);
                    if(!isset($reg_res['record_id'])){
                        DB::rollBack();
                        dd($reg_res);
                    }

                    //update product_application manufacturer_role_id
                    $app_data =  array(
                        'permit_id' => $app_res['record_id'],
                        'reg_product_id' => $reg_res['record_id'], 
                        'application_status_id'=> 6,
                        'dola' => Carbon::now(),
                        'altered_by' => $this->user_id
                    );
                    $app_where = array('id'=>$active_application_id);

                    $res = updateRecord('tra_product_applications', $app_where,$app_data, $this->user_id);

                     

                }
            }
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();

            $res = array(
                "success" => false,
                "message" => "An error occurred: " . $exception->getMessage(),
            );
     }
     return response()->json($res);
   }

public function uploadExcelSheetForATCVetCodes(Request $request){

    $migration_db = '';
   
    try{

        //getting data from the first sheet and saving them
        //step 1 : request file from the client side
        $excelFile = $request->file('excelfile');
        
        //step 2 : get the file name
        $excelFileName = $excelFile->getClientOriginalName();

        //step 3 : create a temporary storage
        $fileStoragePath = storage_path('app');
        $fileCopyPath = $excelFile->move($fileStoragePath,$excelFileName);

        //step 4 : loading the file using excel file reader
        $reader = new ReaderXlsx();
        
        $spreadsheet = $reader->load($fileCopyPath);

        DB::beginTransaction();
        //databaseInstance
        
        $data_to_be_inserted = [];

        for ($i=0; $i < 5; $i++) {
            //set row value on different sheet loop
         if($i == 0){
                $k = 3;
                $main_column = 'A';
            }else{
                $k = 1;
                $main_column = 'B';
            }
        $activeSheet = $spreadsheet->getSheet($i);

        //step 6 : fetch all the rows
        $rowsWithinTheActivesheet = $activeSheet->getHighestDataRow();
        
       
        
        for($row = $k;  $row <= $rowsWithinTheActivesheet; $row++ ){
            // $ID = 2;
            
            $atcCode = ($activeSheet->getCell($main_column.$row)->getValue() == '') ? null : $activeSheet->getCell($main_column.$row)->getValue();

            $atcCode = utf8_encode(trim(utf8_decode($atcCode)," \t\n\r\0\x0B\xA0"));
            
            if($atcCode != ''){

                if(!DB::table('par_atc_codes')->where('code', $atcCode)->exists()){

                    
                    // $atcCode = ($activeSheet->getCell('A'.$row)->getValue() == '') ? null : $activeSheet->getCell('A'.$row)->getValue();
                    
                    //parent id
                    if($i != 0 ){
                        $atcCodeName = ($activeSheet->getCell('C'.$row)->getValue() == '') ? null : $activeSheet->getCell('C'.$row)->getValue();
                        $parent_code = ($activeSheet->getCell('A'.$row)->getValue() == '') ? null : $activeSheet->getCell('A'.$row)->getValue(); 
                        $parent_code = utf8_encode(trim(utf8_decode($parent_code)," \t\n\r\0\x0B\xA0"));
                        $parent_id = getSingleRecordColValue('par_atc_codes', ['code' => $parent_code], 'id');
                        $data_to_be_inserted[] = [
                            'code' => $atcCode,
                            'name' => $atcCodeName,
                            'parent_id' => $parent_id,
                            'parent_code' => $parent_code,
                            'is_migrated' => 1
                        ];
                    }else{
                        $atcCodeName = ($activeSheet->getCell('B'.$row)->getValue() == '') ? null : $activeSheet->getCell('B'.$row)->getValue();
                        $data_to_be_inserted[] = [
                            'code' => $atcCode,
                            'name' => $atcCodeName,
                            'parent_id' => 0,
                            'is_migrated' => 1
                        ];
                    }
                 
                }

            }

        }
        $atcCodeCollection = collect($data_to_be_inserted);
       
        $chunks = $atcCodeCollection->chunk(100);
        
        foreach($chunks as $chunk){
            $res = insertMultipleRecords('par_atc_codes', $chunk->toArray());
             // DB::table('par_atc_codes')->insert($chunk->toArray());
            if(!isset($res['affected_rows'])){
                DB::rollBack();
                return $res;
            }
        }
        $data_to_be_inserted = [];
    }
        $res = array(
            "success" => false,
            "message" => "No data to Migrate",
            "results" => $data_to_be_inserted
        );

        DB::commit();
       

        FacadesFile::delete($fileCopyPath);
  

    }
    catch (\Exception $exception) {
            DB::rollBack();
            $res = array(
                "success" => false,
                "message" => "An error occurred: " . $exception->getMessage(),
            );
     }
     return response()->json($res);
   }
   public function remapParentsAtcCodes (Request $req){
     $data = DB::table('par_atc_codes')->select('parent_code','id')->whereNull('parent_id')->get();
     foreach ($data as $rec) {
        dd($rec->parent_code);
        $parent_id = DB::table('par_atc_codes')->where('code', $rec->parent_code)->value('id');
        DB::table('par_atc_codes')->where('id', $rec->id)->update(['parent_id' => $parent_id]);
     }
   }
   public function remapSystemTrackingNumbers (Request $req){
     $data = DB::table('par_screening_renumbering')->where('is_done',0)->get();
     foreach ($data as $rec) {
        $orignal_tracking_no = $rec->original;
        $system_val = $rec->system_val;

        //check if exists
        $check = DB::table('tra_product_applications')->where('tracking_no', $orignal_tracking_no)->count();
        $check2 = DB::table('tra_product_applications')->where('tracking_no', $system_val)->count();
        if($check > 0 || $check2 > 1){
            updateRecord('par_screening_renumbering', ['id' => $rec->id], ['is_done' => 3]);
        }else{
            //update app table
            updateRecord('tra_product_applications', ['tracking_no', $system_val], ['tracking_no' => $orignal_tracking_no]);
            //update submission table
            updateRecord('tra_submissions', ['tracking_no', $system_val], ['tracking_no' => $orignal_tracking_no]);
            //log done
            updateRecord('par_screening_renumbering', ['id' => $rec->id], ['is_done' => 1]);
        }
     }
   }
   public function moveApplicationFromScreeningToUniversalRegistration(Request $req){
        $from_stage = 1412;
        $res = [];
        $applications = DB::table('tra_submissions')->where('current_stage', $from_stage)->where('is_done', 0)->get();
        DB::beginTransaction();
        try{
            foreach ($applications as $app) {
                //intiate registration request
                $app_data = getSingleRecord('tra_product_applications', ['application_code' => $app->application_code]);

                $info_data = getSingleRecord('tra_product_information', ['id'=>$app_data->product_id]);
                $app_data = convertStdClassObjToArray($app_data);
                $info_data = convertStdClassObjToArray($info_data);
                $app_data['is_migrated'] = 1;
                unset($app_data['submission_date']);
                unset($app_data['date_added']);
                unset($app_data['date_received']);
                unset($app_data['id']);
                unset($info_data['id']);

                $res = insertRecord('tra_product_information', $info_data);
                if($res['success']== false){
                    DB::rollBack();
                    return $res;
                }
                //dublicate to portal
                // insertRecord('wb_product_information', $prod_data, $user_id, 'portal_db');

                $record_id = $res['record_id'];
                $product_id = $res['record_id'];
                $applications_table = 'tra_product_applications';
                $sub_module_id = 70;
                $module_id = 1;
                $user_id = 1;
                $application_code = generateApplicationCode($sub_module_id, $applications_table);

                $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
               

                $tracking_no = $app_data['mgr_application_no'];
                $registration_data = array('tra_product_id' => $product_id,
                    'status_id' => $application_status->status_id,
                    'validity_status_id' => 1,
                    'registration_status_id' => 1
                );
                $where_statement = array('tra_product_id' => $product_id);

                saveApplicationRegistrationDetails('tra_registered_products', $registration_data, $where_statement, $user_id);
                //remap reg Serials
                $reg_serial = getRegistrationSerial($module_id);
                
                //update doc reg serials
                updateRecord('tra_application_documents', ['application_code' => $app->application_code], ['reg_serial' => $reg_serial]);
                
                $view_id = generateApplicationViewID();
                $tra_product_id = $app_data['product_id'];

                $app_data['process_id'] = 45;
                $app_data['workflow_stage_id'] = 1413;
                $app_data['application_status_id'] = $application_status->status_id;
                $app_data['tracking_no'] = $tracking_no;
                $app_data['view_id'] = $view_id;
                $app_data['reg_serial'] = $reg_serial;
                $app_data['sub_module_id'] = $sub_module_id;
                $app_data['application_code'] = $application_code;
                $app_data['is_migrated'] = 1;
                $app_data['product_id'] = $product_id;

                

                unset($app_data['date_added']);
                unset($app_data['created_by']);
                unset($app_data['created_on']);
                unset($app_data['created_on']);
          

                $res = insertRecord('tra_product_applications', $app_data, $user_id);
                if ($res['success'] == false) {
                        DB::rollBack();
                        return $res;
                }
                $active_application_id = $res['record_id'];
                $this->updateRenewalProductAdditionalInformation($product_id, $tra_product_id, null);
                 //add to submissions table
                $submission_params = array(
                    'application_id' => $active_application_id,
                    'process_id' => 45,
                    'application_code' => $application_code,
                    'prodclass_category_id' => $app_data['prodclass_category_id'],
                    "tracking_no" => $tracking_no,
                    'usr_from' => 0,
                    'usr_to' => 0,
                    'previous_stage' => 1413,
                    'current_stage' => 1413,
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $app_data['section_id'],
                    'application_status_id' => $application_status->status_id,
                    'urgency' => 1,
                    'applicant_id' => $app_data['applicant_id'],
                    'branch_id' => 1,
                    'remarks' => 'Migrated application for Registration allocation',
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                    'is_fast_track' => 2,
                    'created_by' => 1
                );

                $sub_res = insertRecord('tra_submissions', $submission_params);
                if(!$sub_res['success']){
                    return $sub_res;
                }
                //log registration request
                if(validateIsNumeric($tra_product_id)){
                    $data = array(
                        'screening_product_id' => $tra_product_id,
                        'reg_product_id' => $product_id,
                        'request_date' => Carbon::now(),
                        'initiated_by' => 1
                    );
                   insertRecord('tra_product_registration_requests', $data);

                }
                //hide the processing screening requests.
                $update_data = ['is_done'=>1];
                updateRecord('tra_submissions', ['application_code'=>$app->application_code], $update_data);

            }
            DB::commit();
        }catch (\Exception $exception) {
            DB::rollBack();
            $res = array(
                "success" => false,
                "message" => "An error occurred: " . $exception->getMessage(),
            );
     }
     return $res;
   }

    public function uploadExcelSheetForFacilityNewDatabase(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side risk_premise_type_id
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(0);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];
            $user_id = 1;

            // $migrations_db->beginTransaction();
            DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {

                $name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("A{$row}")->getValue();
                if($name != ''){
                    if(!DB::table('tra_premises')->where('name','ilike',trim($name))->exists()){

                        // $brand_name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("A{$row}")->getFormattedValue();
                        $premise_email = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("B{$row}")->getFormattedValue();
                        $rep_email = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("C{$row}")->getFormattedValue();
                        $submission_date = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getFormattedValue();
                        $lic_expiry_date = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getFormattedValue();
                        $physical_address = ($activesheet->getCell("G{$row}")->getValue() == '') ? NULL : $activesheet->getCell("G{$row}")->getValue();
                        $date_of_inspection = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getFormattedValue();
                        $inspection_report_no = ($activesheet->getCell("I{$row}")->getValue() == '') ? NULL : $activesheet->getCell("I{$row}")->getValue();
                        $district = ($activesheet->getCell("J{$row}")->getValue() == '') ? NULL : $activesheet->getCell("J{$row}")->getValue();
                        $region_name = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                        $premisetype = ($activesheet->getCell("L{$row}")->getValue() == '') ? NULL : $activesheet->getCell("L{$row}")->getValue();
                        $product_type = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                        $medicine_schedule = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                        $purpose_of_inspection = ($activesheet->getCell("O{$row}")->getValue() == '') ? NULL : $activesheet->getCell("O{$row}")->getValue();
                        $responsible_person_name = ($activesheet->getCell("R{$row}")->getValue() == '') ? NULL : $activesheet->getCell("R{$row}")->getValue();
                        $responsible_person_reg_no = ($activesheet->getCell("S{$row}")->getValue() == '') ? NULL : $activesheet->getCell("S{$row}")->getValue();
                        $license_no = ($activesheet->getCell("T{$row}")->getValue() == '') ? NULL : $activesheet->getCell("T{$row}")->getValue();
                        $issue_date = ($activesheet->getCell("U{$row}")->getValue() == '') ? NULL : $activesheet->getCell("U{$row}")->getFormattedValue();
                        $expiry_date = ($activesheet->getCell("V{$row}")->getValue() == '') ? NULL : $activesheet->getCell("V{$row}")->getFormattedValue();

                        if($submission_date){
                            $submission_date = strtotime($submission_date);
                            $submission_date = date('Y-m-d',$submission_date);
                            $submission_date = ($submission_date == '1970-01-01') ? NULL : $submission_date;
                        }else{
                            $submission_date = NULL;
                        }
                        if($lic_expiry_date){
                            $lic_expiry_date = strtotime($lic_expiry_date);
                            $lic_expiry_date = date('Y-m-d',$lic_expiry_date);
                            $lic_expiry_date = ($lic_expiry_date == '1970-01-01') ? NULL : $lic_expiry_date;
                        }else{
                            $lic_expiry_date = NULL;
                        }
                        if($date_of_inspection){
                            $date_of_inspection = strtotime($date_of_inspection);
                            $date_of_inspection = date('Y-m-d',$date_of_inspection);
                            $date_of_inspection = ($date_of_inspection == '1970-01-01') ? NULL : $date_of_inspection;
                        }else{
                            $date_of_inspection = NULL;
                        }
                        if($issue_date){
                            $issue_date = strtotime($issue_date);
                            $issue_date = date('Y-m-d',$issue_date);
                            $issue_date = ($issue_date == '1970-01-01') ? NULL : $issue_date;
                        }else{
                            $issue_date = NULL;
                        }
                        if($expiry_date){
                            $expiry_date = strtotime($expiry_date);
                            $expiry_date = date('Y-m-d',$expiry_date);
                            $expiry_date = ($expiry_date == '1970-01-01') ? NULL : $expiry_date;
                        }else{
                            $expiry_date = NULL;
                        }

                        

                        //district
                        if(DB::table('par_districts')->where('name', 'ilike', trim($region_name))->count() > 0){
                            $district_data = DB::table('par_districts')->where('name', 'ilike', trim($region_name))->first();
                            $district_id = $district_data->id;
                            $region_id = $district_data->region_id;
                        }else{
                            $district_id = 0;
                            $region_id = 0;
                        }
                        //district
                        if(DB::table('par_regions')->where('name', 'ilike', trim($district))->count() > 0 && $region_id == 0){
                            $region_data = DB::table('par_regions')->where('name', 'ilike', trim($district))->first();
                            $region_id = $region_data->id;
                        }else{
                            $region_id = 0;
                        }

                         //premise type
                        if(str_contains(strtolower($premisetype), 'retail')){
                            $risk_premise_type_id = 2;
                        }else if(str_contains(strtolower($premisetype), 'institutional')){
                            $risk_premise_type_id = 4;
                        }else if(str_contains(strtolower($premisetype), 'wholesale')){
                            $risk_premise_type_id = 1;
                        }else{
                            $risk_premise_type_id = 2;
                        }
                       
                        $qry = DB::table('par_risk_premise_types_mapping as t1')
                                ->join('par_premises_types as t2', 't1.premise_type_id', 't2.id')
                                ->where('risk_premise_type_id', $risk_premise_type_id)
                                ->select('t1.premise_type_id','t2.code');

                        if(str_contains(strtolower($product_type), 'vmp')){
                            $qry->where('section_id', 3);
                            $section_id = 3;
                        }else if(str_contains(strtolower($product_type), 'hum')){
                            $qry->where('section_id', 2);
                            $section_id = 2;
                        }else{
                            $section_id = 8;
                        }

                        $facility_type = $qry->first();
                        if($facility_type){
                            $premise_type_id = 0;
                        }else{
                            $premise_type_id = $facility_type->premise_type_id;
                        }
                        $data_to_be_inserted = [
                            'name' => $name,
                            'section_id' => $section_id,
                            'country_id' => 30,
                            'region_id' => $region_id,
                            'district_id' => $district_id,
                            'physical_address' => $physical_address,
                            'premise_email' => $premise_email,
                            'medicine_schedule' => $medicine_schedule,
                            'is_migrated' => 1
                        ];
                        $res = insertRecord('tra_premises', $data_to_be_inserted, $user_id);
                        if(!isset($res['record_id'])){
                            DB::rollBack();
                            return \response()->json($res);
                        }
                        $premise_id = $res['record_id'];

                        //create applicaiton

                        $sub_module_id = 1;
                        $process_id = 6;
                        $branch_id = 1;
                        $module_id = 2;
                        $applications_table = 'tra_premises_applications';
                        $workflow_stage_id = 1428;


                        //facility personnel
                         if(!DB::table('tra_personnel_information')->where('email_address','ilike',trim($rep_email))->exists()){
                            $rep_details = array(
                                'name' => $responsible_person_name,
                                'email_address' => $rep_email
                            );
                            $personnel_id = DB::table('tra_personnel_information')->insertGetId($rep_details);
                            
                         }else{
                            $personnel_id = DB::table('tra_personnel_information')->where('email_address','ilike',trim($rep_email))->value('id');
                         }
                         //insert personnel info
                         $data = array(
                            'premise_id' => $premise_id,
                            'personnel_id' => $personnel_id,
                            'registration_no' => $responsible_person_reg_no
                         );
                         $rep_id = DB::table('tra_premises_personnel')->insertGetId($data);

                        // $premise_type_code = $facility_type->code;

                        // $section_code = getSingleRecordColValue('par_sections', array('id' => $section_id), 'code');
                        // $codes_array = array(
                        //     'permittype_code' => $premise_type_code,
                        //     'section_code' => $section_code
                        // );
                        $view_id = generateApplicationViewID();
                        // $tracking_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $process_id, $branch_id, $user_id);
                        // if ($tracking_details['success'] == false) {
                        //     DB::rollBack();
                        //     return \response()->json($tracking_details); first_inspection_date_fmt
                        // }
                        $tracking_no = $license_no;
                        $application_code = generateApplicationCode($sub_module_id, $applications_table);
                        $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
                        $application_params = array(
                            'view_id' => $view_id,
                            'module_id' => $module_id,
                            'sub_module_id' => $sub_module_id,
                            'section_id' => $section_id,
                            'application_code' => $application_code,
                            // 'region_id' => $region_id,
                            'branch_id' => $branch_id,
                            'premise_id' => $premise_id,
                            'process_id' => $process_id,
                            'workflow_stage_id' => $workflow_stage_id,
                            'tracking_no' => $tracking_no,
                            'rep_id'=>$rep_id,
                            'premise_type_id'=>$premise_type_id,
                            'application_status_id' => $application_status->status_id,
                            'fasttrack_option_id'=> 2
                        );

                        $res = insertRecord($applications_table, $application_params, $user_id);
                        if(!isset($res['record_id'])){
                            DB::rollBack();
                            return \response()->json($res);
                        }
                        $application_id = $res['record_id'];
                        //insert registration table
                        $reg_params = array(
                            'tra_premise_id' => $premise_id,
                            'created_by' => $user_id,
                            'registration_date' => $issue_date,
                            'registration_no'=> $tracking_no,
                            'approval_date' => $issue_date,
                            'expiry_date' => $lic_expiry_date,
                            'registration_status_id' => 2,
                            'validity_status_id' => 2,
                            'is_migrated' => 1
                        );
                        createInitialRegistrationRecord('tra_registered_premises', $applications_table, $reg_params, $application_id, 'reg_premise_id');
                        //DMS
                      initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no, $user_id);
                        // add to submissions table
                        $submission_params = array(
                            'application_id' => $application_id,
                            'view_id' => $view_id,
                            'process_id' => $process_id,
                            'application_code' => $application_code,
                            'tracking_no' => $tracking_no,
                            'usr_from' => $user_id,
                            'usr_to' => $user_id,
                            'previous_stage' => $workflow_stage_id,
                            'current_stage' => $workflow_stage_id,
                            'module_id' => $module_id,
                            'sub_module_id' => $sub_module_id,
                            'section_id' => $section_id,
                            'application_status_id' => $application_status->status_id,
                            'urgency' => 1,
                            'premise_type_id' => $premise_type_id,
                            // 'branch_id' => $branch_id,
                            'remarks' => 'Initial save of the application',
                            'date_received' => Carbon::now(),
                            'created_on' => Carbon::now(),
                            'created_by' => $user_id
                        );
                        DB::table('tra_submissions')
                            ->insert($submission_params);
                        
                        //inspection details log

                        if(str_contains($purpose_of_inspection, 'Risk')){
                            $inspection_type_id = 1;
                        }else if(str_contains($purpose_of_inspection, 'Renewal')){
                            $inspection_type_id = 13;
                        }else if(str_contains($purpose_of_inspection, 'Spot')){
                            $inspection_type_id = 2;
                        }else{
                            $inspection_type_id = 3;
                        }
                        $data = array(
                            'application_id' => $application_id,
                            'application_code' => $application_code,
                            'start_date' => $date_of_inspection,
                            'inspection_type_id' => $inspection_type_id,
                            'tracking_no' => 'mgr_'.$tracking_no,
                            'inspection_reference_no' => $inspection_report_no
                        );
                        $res = insertRecord('tra_premise_inspection_details', $data, $user_id);
                        if(!isset($res['record_id'])){
                            DB::rollBack();
                            return \response()->json($res);
                        }
                        $inspection_id = $res['record_id'];
                    }

                }

            }
            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully"
            );




            // $migrations_db->commit();
            DB::commit();

            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
            // $migrations_db->rollBack();
            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            // $migrations_db->rollBack();
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);


    }

    public function remapDatesVetSpeciesFromMigratedExcel(Request $req){
        //get the register 
        DB::beginTransaction();
        try{
            $register = DB::table('tra_product_applications as t1')
                    ->join('tra_product_information as t2', 't1.product_id', 't2.id')
                    ->where('t1.section_id', 3)
                    ->where('t1.sub_module_id', 71)
                    ->where('t1.is_migrated', 1)
                    ->get();

            foreach ($register as $rec) {
                //check no date and insert
                $check = DB::table('tra_registered_products')->where('active_application_code', $rec->application_code)->first();
                if (strtotime($check->registration_date) != '0000-00-00' && strtotime($check->registration_date)){
                   //skip this
                }else{
                   //update dates by checking the reg number
                    if (str_contains($rec->tracking_no, 'BV21')) {
                        //default date
                        $reg_date = new Carbon('2022-04-01'); 
                    }else if(str_contains($rec->tracking_no, 'BV23')) {
                        $reg_date = new Carbon('2023-02-02'); 
                    }
                    $update_date = ['registration_date' => $reg_date];
                    $approval_date = ['approval_date' => $reg_date];
                    DB::table('tra_registered_products')->where('active_application_code', $rec->application_code)->update($update_date);
                    DB::table('tra_approval_recommendations')->where('application_code', $rec->application_code)->update($approval_date);
                }


                //get species and explode to pivot table
                $species_data = json_decode($rec->species_data);
                if(is_array($species_data)){
                    foreach ($species_data as $species) {
                        DB::table('tra_product_species')->insert(['product_id'=>$rec->product_id, 'species_id' => $species]);
                    }
                }
            }
            $res = ['success'=> true, 'message'=>'nkama imework'];
            DB::commit();
        }catch (\Exception $exception) {
            DB::rollBack();
            $res = array(
                "success" => false,
                "message" => "An error occurred: " . $exception->getMessage(),
            );
         }
         return $res;

    }
    public function moveProductApplicationtoportal(Request $req){
       try {
            // var_dump($req->all());
            DB::beginTransaction();

            $product_id = $req->product_id;
            $tra_product_id = $req->tra_product_id;
            $reg_product_id = $req->reg_product_id;
            $trader_initiator_id = $req->trader_id;
            $applicant_id = $req->trader_id;
            $trader_id = $req->trader_id;
            $email_address = $req->email_address;
            $local_agent_id = $req->local_agent_id;
            $section_id = $req->section_id;
            $reference_no = $req->reference_no;
            $sub_module_id = $req->sub_module_id;
            $prodclass_category_id= $req->prodclass_category_id;
            $zone_id = $req->zone_id;
            $gmdn_code = $req->gmdn_code;
            $product_res =  '';
            if(is_array($gmdn_code) && isset($gmdn_code[0])){
                $gmdn_code = $gmdn_code[0];
            }
            $module_id = getSingleRecordColValue('par_sub_modules', array('id' => $req->sub_module_id), 'module_id','mis_db');
           if($req->is_listed == 1){
                $check = DB::connection('mis_db')->table('tra_product_applications')->where('tracking_no', trim($req->listing_no))->count();
                if($check > 0){

                }else{
                    return \response()->json(['success'=>false, 'message' => 'The provided Listing number does not exist in the listing database please validate if the device is already listed with BOMRA']);
                }
            }

            //product information datasets class
            $product_info = DB::connection('mis')->table('tra_product_information')->where('id', $product_id)->first();
            $product_infor = array(
                'prodclass_category_id'=>$req->prodclass_category_id,
                'brand_name'=>$product_info->brand_name,
                'dosage_form_id'=>$product_info->dosage_form_id,
                'efficacy_proof_type_id' => $product_info->efficacy_proof_type_id,
                'is_expidited' => $product_info->is_expidited,
                'product_type_id'=>$product_info->product_type_id,
                'common_name'=>$product_info->common_name,
                'classification_id'=>$product_info->classification_id,
                'route_of_administration_id'=>$product_info->route_of_administration_id,
                'strength'=>$product_info->strength,
                'strength_si_unit' => $product_info->strength_si_unit,
                'product_origin_id'=>$product_info->product_origin_id,
                'contraindication'=>$product_info->contraindication,
                'storage_condition'=>$product_info->storage_condition,
                'intended_enduser_id'=>$product_info->intended_enduser_id,
                'intended_use'=>$product_info->intended_use,
                ///'paying_currency_id'=>$req->paying_currency_id,
                'shelf_life'=>$product_info->shelf_life,
                'shelf_lifeafter_opening'=>$product_info->shelf_lifeafter_opening,
                'instructions_of_use'=>$product_info->instructions_of_use,
                'physical_description'=>$product_info->physical_description,
                // 'common_name_id'=>$product_info->common_name_id,
                'atc_code_id'=>$product_info->atc_code_id,
                'product_form_id'=>$product_info->product_form_id,
                'product_strength'=>$product_info->product_strength,
                'product_subcategory_id'=>$product_info->product_subcategory_id,
                'distribution_category_id'=>$product_info->distribution_category_id,
                'special_category_id'=>$product_info->special_category_id,
                'intended_use_id'=>$product_info->intended_use_id,
                'method_ofuse_id'=>$product_info->method_ofuse_id,
                'section_id'=>$product_info->section_id,
                'gmdn_code'=>$gmdn_code,
                'gmdn_category'=>$product_info->gmdn_category,
                'gmdn_term'=>$product_info->gmdn_term,
                'warnings'=>$product_info->warnings,
                'medical_systemmodel_series'=>$product_info->medical_systemmodel_series,
                'medical_family'=>$product_info->medical_family,
                'stability_studies_data_id'=>$product_info->stability_studies_data_id,
                'shelflifeduration_desc'=>$product_info->shelflifeduration_desc,
                'shelflifeafteropeningduration_desc'=>$product_info->shelflifeafteropeningduration_desc,
                'reason_for_classification_id'=>$product_info->reason_for_classification_id,

                'productrisk_category_id'=>$product_info->productrisk_category_id,
                // 'reagents_accessories'=>$product_info->reagents_accessories,
                'indications'=>$product_info->indications,
                'major_warning'=>$product_info->major_warning,
                'stability_studies_data'=>$product_info->stability_studies_data,
                'method_of_use'=>$product_info->method_of_use,
                'has_medical_family'=>$product_info->has_medical_family,
                'has_medical_systemmodel_series'=>$product_info->has_medical_systemmodel_series,
                'has_reagents_accessories'=>$product_info->has_reagents_accessories,


                'payment_reference_no' => $product_info->payment_reference_no,
                'business_type_id' => $product_info->business_type_id,
                'remarks' => $product_info->remarks,
                'bhcp_number' => $product_info->bhcp_number,
                'qualifications' => $product_info->qualifications,

                /**
                 * exempetions
                 * applicaions
                 */

                /**
                * vet individual
                */
                // 'animal_holding_unit_name' => $req->animal_holding_unit_name,
                // 'animal_holding_unit_physical_address' => $req->animal_holding_unit_physical_address,
                // 'animal_holding_unit_email' => $req->animal_holding_unit_email,
                // 'animal_holding_unit_phone' => $req->animal_holding_unit_phone,

                // 'exemption_reasons_for_importing' => $req->exemption_reasons_for_importing,
                // 'name_of_importer' => $req->name_of_importer,
                // 'importer_email' => $req->importer_email,
                // 'importer_phone' => $req->importer_phone,
                'exemption_reasons_for_importing' => $req->exemption_reasons_for_importing,
                'name_of_importer' => $req->name_of_importer,
                'importer_email' => $req->importer_email,
                'importer_phone' => $req->importer_phone,
                'device_cluster' =>$req->device_cluster,
                'device_compliance_standards' =>$req->device_compliance_standards,
                'gs1_udi' =>$req->gs1_udi,
                'gs1_udi_available' =>$req->gs1_udi_available,
                'udi_available' => $req->udi_available,
                'has_cluster' =>$req->has_cluster,
                'qms_area' =>$req->qms_area,
                'qms_established' =>$req->qms_established,
                'technical_doc_summary' =>$req->technical_doc_summary,
                'has_accessories' => $req->has_accessories,
                'model_name' => $req->model_name,
                'software_version' => $req->software_version,
                'has_family' => $req->has_family,
                'has_reagents' => $req->has_reagents,
                'device_reagents' => $req->device_reagents,
                'device_family' => $req->device_family,
                'device_accessories' => $req->device_accessories,
                'device_classification_rules_id' => $req->device_classification_rules_id,
                'device_intended_use' => $req->device_intended_use,
                'device_type_id' => $req->device_type_id,
                'gmdn_category_id' => $req->gmdn_category_id,
                'is_listed' => $req->is_listed,
                'listing_no' => $req->listing_no,
                'pack_size' => $req->pack_size
            );
           //var_dump($product_infor); description

            if($req->expiry_date != ''){
                $product_infor['expiry_date'] = $req->expiry_date;
                $product_infor['manufacturing_date'] = $req->manufacturing_date;
            }
            $app_data = array(
                'trader_id'=>$trader_id,
                'local_agent_id'=>$local_agent_id,
                'sub_module_id'=>$req->sub_module_id,
                'section_id'=>$req->section_id,
                'product_id'=>$product_id,
                'zone_id'=>$req->zone_id,
                'reference_no'=>$reference_no,
                'module_id'=>$module_id,
                'assessmentprocedure_type_id'=>$req->assessmentprocedure_type_id,
                'assessment_procedure_id'=>$req->assessment_procedure_id,
                'fasttrack_option_id'=>$req->fasttrack_option_id,
                //'paying_currency_id'=>$req->paying_currency_id,
                'application_status_id'=>1,
                'prodclass_category_id'=>$req->prodclass_category_id,
            );
            $table_name = 'wb_product_information';
            /** Already Saved */
            if(validateIsNumeric($product_id)){
                //update the record
                //product information
                //
                $where = array('id'=>$product_id);
                $where_app = array('product_id'=>$product_id);

                if (recordExists('wb_product_information', $where)) {

                    $product_infor['dola'] = Carbon::now();
                    $product_infor['altered_by'] = $email_address;
                    $previous_data = getPreviousRecords($table_name, $where);
                    $res = updateRecord('wb_product_information', $previous_data, $where, $product_infor, $email_address);

                    $previous_data = getPreviousRecords('wb_product_applications', $where_app);
                    $tracking_no = $previous_data['results'][0]['tracking_no'];
                    $application_code = $previous_data['results'][0]['application_code'];
                    $resp=   updateRecord('wb_product_applications', $previous_data, $where_app, $app_data, $email_address);
                    initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(0,100), $trader_id);
                }
                if($resp['success']){
                    $sql = DB::connection('mis_db')->table('tra_application_documentsdefination')->where(array('application_code'=>$application_code))->first();
                    if(!$sql){

                        initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(0,100), $trader_id);

                    }
                    $res = array('tracking_no'=>$tracking_no,
                        'product_id'=>$product_id,
                        'success'=>true,

                        'application_code'=>$application_code,
                        'message'=>'Product Application Saved Successfully, with Tracking No: '.$tracking_no);

                }
                else{
                    $res = array(
                        'success'=>false,
                        'message1'=>$resp['message'],
                        'message'=>'Error Occurred Product Application not saved, it this persists contact the system Administrator');
                }
            }
            else{


                $resp = insertRecord('wb_product_information', $product_infor, $email_address);

                $product_res =  $resp;
                $ref_id = getSingleRecordColValue('tra_submodule_referenceformats', array('sub_module_id' => $sub_module_id, 'module_id' => $module_id, 'reference_type_id' => 1), 'reference_format_id','mis_db');

                $zone_code = getSingleRecordColValue('par_zones', array('id' => $req->zone_id), 'zone_code','mis_db');
                $section_code = getSingleRecordColValue('par_sections', array('id' => $req->section_id), 'code','mis_db');
                $class_code = getSingleRecordColValue('par_classifications', array('id' => $req->classification_id), 'code','mis_db');
                $apptype_code = getSingleRecordColValue('par_product_origins', array('id' => $req->product_origin_id), 'code','mis_db');
                $assessment_code = getSingleRecordColValue('par_assessment_procedures', array('id' => $req->assessment_procedure_id), 'code','mis_db');
                $device_typecode = getSingleRecordColValue('par_product_subcategories', array('id' => $req->product_subcategory_id), 'code','mis_db');
                $prod_class_code = getSingleRecordColValue('par_prodclass_categories', array('id' => $req->prodclass_category_id), 'code','mis_db');
                $prod_type_code = getSingleRecordColValue('par_product_types', array('id' => $req->product_type_id), 'code','mis_db');
                $process_id = getSingleRecordColValue('wf_processes',array('module_id'=>$module_id, 'section_id'=>$section_id,'sub_module_id'=>$sub_module_id), 'id','mis_db');
                $codes_array = array(
                    'section_code' => $section_code,
                    'zone_code' => $zone_code,
                    'class_code' => $class_code,
                    'assessment_code' => $assessment_code,
                    'prod_class_code' => $prod_class_code,
                    'prod_type_code' => $prod_type_code,
                    'device_typecode'=>$device_typecode
                );



                 //  $tracking_no =generateApplicationRefNumber($ref_id, $codes_array, date('Y'), $process_id, $zone_id, $trader_id);
                $tracking_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array,$section_id, $process_id, 1, $trader_id);

                if ($tracking_details['success'] == false) {
                        DB::rollBack();
                        return \response()->json($tracking_details);

                    }

                $tracking_no = $tracking_details['tracking_no'];
                if (!validateIsNumeric($ref_id )) {
                    return \response()->json(array('success'=>false, 'message'=>'Reference No Format has not been set, contact the system administrator'));
                }
                else if( $tracking_no == ''){
                    return \response()->json(array('success'=>false,'tracking_no'=>$tracking_no, 'message'=>$tracking_no));
                }

                $application_code = generateApplicationCode($sub_module_id, 'wb_product_applications');

                if(!isset($resp['record_id'])){
                    return $resp;
                }
                $product_id = $resp['record_id'];
                $app_data['created_by'] = $email_address;
                $app_data['created_on'] = Carbon::now();
                $app_data['tracking_no'] = $tracking_no;
                $app_data['product_id'] = $product_id;
                $app_data['process_id'] = $process_id;
                $app_data['date_added'] = Carbon::now();
                $app_data['application_code'] = $application_code;
                $app_data['application_initiator_id'] = $trader_id;
                $app_data['application_status_id'] = 1;

                $resp = insertRecord('wb_product_applications', $app_data, $email_address);

                if($resp['success']){
                     initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(0,100), $trader_id);

                    saveApplicationSubmissionDetails($application_code,'wb_product_applications');

                    if($sub_module_id == 70){
                        //dublicate additional Information
                        $this->updateRenewalProductAdditionalInformation($product_id, $tra_product_id, $reg_product_id);
                    }
                    $res = array('tracking_no'=>$tracking_no,
                        'product_id'=>$product_id,
                        'application_code'=>$application_code,
                        'success'=>true,
                        'message'=>'Product Application Saved Successfully, with Tracking No: '.$tracking_no);





                }
                else{
                    $res = array(
                        'success'=>false, 'message1'=>$resp['message'],
                        'message'=>'Error Occurred Product Application not saved, it this persists contact the system Administrator');
                }


            }
            if($res['success']){
            onSaveOfflinePrePayments($application_code,$req,$trader_id);
                DB::commit();
            }
            else{
                DB::rollBack();
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), '');

        } catch (Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), '');
        }
        return response()->json($res, 200);

    }
    public function uploadExcelSheetForHumanMedsBlueBookBlisted(Request $request){

        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(0);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];


            $migrations_db->beginTransaction();
            // DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {


                $bot_no = ($activesheet->getCell("L{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("L{$row}")->getValue();

                if($bot_no != ''){
                    if(!$migrations_db->table('mg_human_medicines_bluebook')->where('bot_no', $bot_no)->exists()){

                        $common_name = ($activesheet->getCell("A{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("A{$row}")->getFormattedValue();
                        $brand_name = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("B{$row}")->getFormattedValue();
                        $strength = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL : $activesheet->getCell("C{$row}")->getFormattedValue();
                        $dosage_form = ($activesheet->getCell("D{$row}")->getValue() == '') ? NULL : $activesheet->getCell("D{$row}")->getFormattedValue();
                        $schedule = ($activesheet->getCell("E{$row}")->getValue() == '') ? NULL : $activesheet->getCell("E{$row}")->getValue();
                        $product_type = ($activesheet->getCell("F{$row}")->getValue() == '') ? NULL : $activesheet->getCell("F{$row}")->getValue();
                        $pack_size = ($activesheet->getCell("I{$row}")->getValue() == '') ? NULL : $activesheet->getCell("I{$row}")->getValue();
                        $applicant_name = ($activesheet->getCell("G{$row}")->getValue() == '') ? NULL : $activesheet->getCell("G{$row}")->getValue();
                        $applicant_physical_address = ($activesheet->getCell("H{$row}")->getValue() == '') ? NULL : $activesheet->getCell("H{$row}")->getValue();
                        // $applicant_physical_address = ($activesheet->getCell("J{$row}")->getValue() == '') ? NULL : $activesheet->getCell("J{$row}")->getValue();
                        // $applicant_country = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                        // $country_of_origin = ($activesheet->getCell("L{$row}")->getValue() == '') ? NULL : $activesheet->getCell("L{$row}")->getValue();
                        // $registration_date = ($activesheet->getCell("M{$row}")->getValue() == '') ? NULL : $activesheet->getCell("M{$row}")->getValue();
                        // $expiry_date = ($activesheet->getCell("N{$row}")->getValue() == '') ? NULL : $activesheet->getCell("N{$row}")->getValue();
                        $retained = ($activesheet->getCell("K{$row}")->getValue() == '') ? NULL : $activesheet->getCell("K{$row}")->getValue();
                        // $completeness = ($activesheet->getCell("P{$row}")->getValue() == '') ? NULL : $activesheet->getCell("P{$row}")->getValue();
                        
                       
                        
                        $data_to_be_inserted [] = [
                            'bot_no' => $bot_no,
                            'brand_name' => $brand_name,
                            'common_name' => $common_name,
                            'strength' => $strength,
                            'dosage_form' => $dosage_form,
                            'schedule' => $schedule,
                            'product_type' => $product_type,
                            'pack_size' => $pack_size,
                            'applicant_name' => $applicant_name,
                            'applicant_physical_address' => $applicant_physical_address,
                            'retained' => $retained,
                            'is_incomplete' => 0,
                            'is_b_listed' => 1
                        ];
                    }

                }

            }

            //screening register operations
            $screening_register_collection = collect($data_to_be_inserted);
            $screening_register_chunks = $screening_register_collection->chunk(50);

            foreach($screening_register_chunks as $chunk){
                $migrations_db->table('mg_human_medicines_bluebook')->insert($chunk->toArray());
            }

            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $data_to_be_inserted

            );




            $migrations_db->commit();
            // DB::commit();

            FacadesFile::delete($filecopypath);


        } catch (\Exception $exception) {
            $migrations_db->rollBack();
            // DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $migrations_db->rollBack();
            // DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return $res;


    }
    public function remapBOTloactionData(Request $request){
        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('excelfile');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);


            $activesheet = $spreadsheet->getSheet(4);



                //Step 6 : Fetch all the rows
            $rowswithintheactivesheet = $activesheet->getHighestDataRow();
            $migrations_db = DB::connection('migrations_db');

            $data_to_be_inserted  = [];
            $district_ids = [];
            $region_ids = [];
            $sub_region_ids = [];

            $migrations_db->beginTransaction();
            // DB::beginTransaction();
            for($row = 2 ; $row <= $rowswithintheactivesheet; $row++)
            {


                $district = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("B{$row}")->getValue();
               
                //handle district
                $district_data = DB::table('par_regions')->where('country_id', 30)->where('name', 'ilike', trim($district))->first();
                if(isset($district_data->id)){
                    $district_id = $district_data->id;
                }else{
                    $district_id = DB::table('par_regions')->insertGetId(['country_id'=>30, 'name'=>trim($district), 'description'=>'F List']);
                }
                $district_ids[] = $district_id;

                //region
                $region = ($activesheet->getCell("C{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("C{$row}")->getValue();
                // handle reion 
                $region_data = DB::table('par_districts')->where('region_id', $district_id)->where('name', 'ilike', trim($region))->first();
                if(isset($region_data->id)){
                    $region_id = $region_data->id;
                }else{
                    $region_id = DB::table('par_districts')->insertGetId(['region_id'=>$district_id, 'name'=>trim($region), 'description'=>'F List']);
                }
                $region_ids[] = $region_id;

                //sub region
                $sub_region = ($activesheet->getCell("D{$row}")->getValue() == '' ) ? NULL :$activesheet->getCell("D{$row}")->getValue();
                //handle sub region
                $sub_region_data = DB::table('par_subdistricts')->where('district_id', $region_id)->where('name', 'ilike', trim($sub_region))->first();
                if(isset($sub_region_data->id)){
                    $sub_region_id = $sub_region_data->id;
                }else{
                    $sub_region_id = DB::table('par_subdistricts')->insertGetId(['district_id'=>$region_id, 'name'=>trim($sub_region), 'description'=>'F List']);
                }
                $sub_region_ids[] = $sub_region_id;

            }
            $data_to_be_inserted = array(
                'district_ids' => json_encode($district_ids),
                'region_ids' => json_encode($region_ids),
                'sub_region_ids' => json_encode($sub_region_ids),
                'country_id' => 30
            );
            DB::table('par_regions1')->insert($data_to_be_inserted);
            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $data_to_be_inserted

            );
        } catch (\Exception $exception) {
            // $migrations_db->rollBack();
            // DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            // $migrations_db->rollBack();
            // DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return $res;
    }
}

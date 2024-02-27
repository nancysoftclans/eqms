<?php

namespace Modules\Integration\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controller;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use  Modules\SummaryReport\Http\Controllers\SummaryReportController;
use App\Http\Controllers\commonController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Http\Response;
use Hash;
class IntegrationController extends Controller
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
    public function postSignRequest(Request $req, SummaryReportController $sr)
    {
        $module_id = $req->module_id;
        $application_code = $req->application_code;
        $decision_id = $req->decision_id;
        $table_name = getTableName($module_id);
        $eSignurl = Config('constants.esign.base_url');
        
        $user_id = $this->user_id;
        $payload = $req->payload;
        $data = $req->all();
        //http client
        if($module_id == 1){
            $main_rec = getSingleRecord($table_name, ['application_code'=>$application_code]);
            if($main_rec->sub_module_id == 75){
                $app_details = DB::table($table_name. ' as t1')
                        ->join('tra_exemption_products as t2', 't1.application_code', 't2.application_code')
                        ->join('wf_workflow_stages as t3', 't1.workflow_stage_id', 't3.id')
                        ->join('wb_trader_account as t4', 't1.applicant_id', 't4.id')
                        ->where('t1.application_code', $application_code)
                        ->select('t3.*','t1.*', 't4.name as applicant','t4.physical_address', DB::raw("STRING_AGG(t2.brand_name || ' ' || t2.strength , ',') as products"))
                        ->groupBy('t1.id', 't3.id', 't4.id')
                        ->first();
            }else{
                $app_details = DB::table($table_name. ' as t1')
                    ->join('wf_workflow_stages as t2', 't1.workflow_stage_id', 't2.id')
                    ->join('tra_product_information as t4', 't1.product_id', 't4.id')
                    ->join('par_dosage_forms as t6', 't4.dosage_form_id', 't6.id')
                    ->join('wb_trader_account as t3', 't1.applicant_id', 't3.id')
                    ->where('application_code', $application_code)
                    ->select('t1.*', 't2.*','t3.name as applicant', 't3.physical_address','t4.brand_name AS product_name','t4.common_name AS comm_name','t4.strength AS strength','t6.name AS dosage_name')
                    ->first();
                
            }
        }else if($module_id == 24){
            $app_details = DB::table('tra_rmu_submissions as t1')
                ->join('wf_workflow_stages as t2', 't1.workflow_stage_id', 't2.id')
                ->leftJoin('tra_rmu_administrative_responses as t3', 't1.application_code', 't3.application_code')
                ->where('t1.application_code', $application_code)
                ->first(); 
        }
        else{
           $app_details = DB::table($table_name. ' as t1')
                ->join('wf_workflow_stages as t2', 't1.workflow_stage_id', 't2.id')
                ->where('application_code', $application_code)
                ->first(); 
        }
        //get signatory
        $where = ['module_id' => $module_id, 'sub_module_id' => $app_details->sub_module_id,'section_id' => $app_details->section_id];
        if($app_details->stage_category_id == 4 || $app_details->stage_category_id==15){
            $where['correspondence_type_id'] = 1; //final letters
        }else if($app_details->stage_category_id == 16){
            $where['correspondence_type_id'] = 2; //query
        }else{
            return ['success'=>false, 'message' => 'Stage Category cannot initiate a sign request']; 
        }

        $signatory_id = getSingleRecordColValue('par_signatory_type', $where, 'user_id');

        //for Administrative Invoker is the signatory
        if($module_id == 24){
          $signatory_id = $user_id;  
        }

        //check if acting
        $is_acting = DB::table('tra_actingposition_management as t1')->whereRAW("CURRENT_DATE BETWEEN acting_date_from AND acting_date_to")->where('actingfor_user_id', $signatory_id)->first();
        if(isset($is_acting->id)){
            $signatory_id= $is_acting->id;
        }
        $user = getSingleRecordColValue('users', ['id'=>$signatory_id], 'email');
        $submitted_by = getSingleRecordColValue('users', ['id'=>$this->user_id], 'email');

        //report generator payload
        $req->request->add(['correspondence_name' => 'correspodence', 'params' => json_encode(['sub_module_id' => $app_details->sub_module_id])]); 
        // $check = recordExists('tra_esignrequest_log', ['application_code'=>$application_code, 'workflow_stage_id'=>$app_details->workflow_stage_id, 'is_sent' => 1, 'is_done' => 2]);
        $check = DB::table('tra_esignrequest_log')
            ->where(['application_code'=>$application_code, 'workflow_stage_id'=>$app_details->workflow_stage_id, 'is_sent' => 1, 'is_done' => 2])
            ->whereRAW("(status_id = 1 OR status_id = 2)")
            ->count();
        $tracking_no = $app_details->tracking_no;
        if($app_details->tracking_no == ''){
             $tracking_no = $app_details->reference_no;
        }
        if($check < 1){

            if($module_id == 1){
                if($app_details->sub_module_id == 7){//screening
                    if($app_details->stage_category_id == 4 || $app_details->stage_category_id==15){//approval stage
                        if($decision_id == 1){//approval screening letter
                            $res_url = $sr->getCorrespodenceUrl($req);
                            $res_url = (array)json_decode($res_url->getContent());
                            if(!isset($res_url['url'])){
                                dd($res_url);
                            }
                            if($res_url['url'] == ''){
                                return "No document generated for signing hence approval can be done internally via approve button";
                            }
                            $doc_meta_data = json_encode(['application_code'=> $app_details->application_code, 'tracking_no' => $tracking_no, 'sub_module_id'=>$app_details->sub_module_id, 'section_id' => $app_details->section_id,'applicant' => $app_details->applicant,'physical_address' => $app_details->physical_address,'product_name' => $app_details->product_name,'comm_name' => $app_details->comm_name,'strength' => $app_details->strength,'dosage_name' => $app_details->dosage_name]);

                            $data = [
                                'name' => 'Letter',
                                'doc_name' => 'Screening Approval Letter',
                                'doc_class_id' => 2,
                                'assigned_user' => $user,
                                'submitted_by' => $submitted_by,
                                'source_id' => 1,
                                'module_id' => $module_id,
                                'decision_id' => $decision_id,
                                'doc_url' => $res_url['url'],
                                'report_id' => $res_url['report_id'],
                                'doc_meta_data' => $doc_meta_data,
                                'doc_meta_data_hash' => Hash::make($doc_meta_data)
                            ];

                            //for tracking request
                            $trc = insertRecord('tra_esignrequest_log', convertStdClassObjToArray($data), $user_id);
                            
                            if(!isset($trc['record_id'])){
                                return $trc;
                            }
                            $tracking_id = $trc['record_id'];
                            $data['tracking_id'] = $tracking_id;
                            $res = postRequest($data);
                            $update_data = [
                                'workflow_stage_id' => $app_details->workflow_stage_id,
                                'application_code' => $app_details->application_code,
                                'payload' => $payload
                            ];
                            $where = ['id'=> $tracking_id];
                            if(!isset($res['success']) || !$res['success'] ){

                                $update_data['errormessage'] = $res['message'];
                                $update_data['is_sent'] = 2;
                                $update_data['is_done'] = 1;
                                updateRecord('tra_esignrequest_log', $where, $update_data);
                                return $res;
                            }
                            $update_data['is_sent'] = 1;
                            updateRecord('tra_esignrequest_log', $where, $update_data);
                            
                        }else{//rejection letter
                            $res = $this->postAndLogSignRequest($req, 'Screening Rejection', 2, $user, 'Rejection Letter', $app_details, $signatory_id, $submitted_by, $sr); 
                        }
                    }else{//query letter
                        $res = $this->postAndLogSignRequest($req, 'Query Letter', 2, $user, 'Query Letter', $app_details, $signatory_id, $submitted_by, $sr);
                    }
                }else{
                    $res = $this->postAndLogSignRequest($req, 'Letter/Certificate', 2, $user, 'Letter/Certificate', $app_details, $signatory_id, $submitted_by, $sr); 
                }
            }else if($module_id == 11) {
                // /'surveillance/onSavePmsProgramApprovalDecision',
                 if($app_details->sub_module_id == 59){//schedule Approval
                    if($app_details->stage_category_id == 4 || $app_details->stage_category_id==15){//approval stage
                        if($decision_id == 1){//approval screening letter
                           $res = $this->postAndLogSignRequest($req, 'Schedule Approval Request', 2, $user, 'Request', $app_details, $signatory_id, $submitted_by, $sr); 
                            
                        }else{//rejection letter
                            $res = ['success'=>false, 'message' => 'Schedule Rejection Decision Not set'];
                        }
                    }else{//query letter
                        $res = ['success'=>false, 'message' => 'Stage Category Not set'];
                    }
                }
                else{//other submodules
                    $res = ['success'=>false, 'message' => 'sub module not set'];
                }
            }else if($module_id == 2) {
                // /'surveillance/onSavePmsProgramApprovalDecision',
                 // if($app_details->sub_module_id == 1){//schedule Approval
                    if($app_details->stage_category_id == 4 || $app_details->stage_category_id==15){//approval stage
                        if($decision_id == 1){//approval screening letter
                           $res = $this->postAndLogSignRequest($req, 'Licensing Approval', 1, $user, 'Licensing Letter', $app_details, $signatory_id, $submitted_by, $sr); 
                            
                        }else{//rejection letter
                            $res = $this->postAndLogSignRequest($req, 'Rejection', 2, $user, 'Rejection Letter/Certificate', $app_details, $signatory_id, $submitted_by, $sr); 
                        }
                    }
                    else{//query letter
                        $res = ['success'=>false, 'message' => 'Stage Category Not set'];
                    }
                // }
                // else{//other submodules
                //     $res = ['success'=>false, 'message' => 'sub module not set'];
                // }
            }else if($module_id == 24) {
                    if($app_details->stage_category_id == 4 || $app_details->stage_category_id==15){//approval stage
                        if($decision_id == 1){//approval screening letter
                           $res = $this->postAndLogSignRequest($req, 'Letter', 1, $user, 'Administrative Response', $app_details, $signatory_id, $submitted_by, $sr); 
                            
                        }else{//rejection letter
                            $res = $this->postAndLogSignRequest($req, 'Letter', 2, $user, 'Administrative Response', $app_details, $signatory_id, $submitted_by, $sr); 
                        }
                    }
                    else{//query letter
                        $res = ['success'=>false, 'message' => 'Stage Category Not set'];
                    }
                // }
                // else{//other submodules
                //     $res = ['success'=>false, 'message' => 'sub module not set'];
                // }
            }else {
                // /'surveillance/onSavePmsProgramApprovalDecision',
                    if($app_details->stage_category_id == 4 || $app_details->stage_category_id==15){//approval stage
                        if($decision_id == 1){//approval screening letter
                           $res = $this->postAndLogSignRequest($req, 'Approval', 1, $user, 'Approval Letter/Certificate', $app_details, $signatory_id, $submitted_by, $sr); 
                            
                        }else{//rejection letter
                            $res = $this->postAndLogSignRequest($req, 'Rejection', 2, $user, 'Rejection Letter/Certificate', $app_details, $signatory_id, $submitted_by, $sr); 
                        }
                    }
                    else{//query letter
                        $res = ['success'=>false, 'message' => 'Stage Category Not set'];
                    }
                }
            // }else{
            //     $res = ['success'=>false, 'message' => 'Module Not mapped'];
            // }
        }else{
             $res = ['success'=>false, 'message' => 'Already Submitted for signing'];
        }
        return $res;   
    }
    public function postAndLogSignRequest($req, $name, $doc_class_id, $user, $prefix, $app_details, $signatory_id, $submitted_by, $sr)
    {
        //parameters
        $module_id = $req->module_id;
        $application_code = $req->application_code;
        $decision_id = $req->decision_id;
        $eSignurl = Config('constants.esign.base_url');
        
        $user_id = $this->user_id;
        $payload = $req->payload;
        $tracking_no = $app_details->tracking_no;
        $sub_module_id = $app_details->sub_module_id;
        if($app_details->tracking_no == ''){
             $tracking_no = $app_details->reference_no;
        }
        $res_url = $sr->getCorrespodenceUrl($req);
        $res_url = (array)json_decode($res_url->getContent());

        if(!isset($res_url['url'])){
            dd($res_url);
        }
        if($module_id == 1){
            if($sub_module_id == 75){
                $doc_meta_data = json_encode(['application_code'=> $app_details->application_code, 'tracking_no' => $app_details->tracking_no, 'sub_module_id'=>$app_details->sub_module_id, 'section_id' => $app_details->section_id,'applicant' => $app_details->applicant,'physical_address' => $app_details->physical_address,'products' => $app_details->products]);
            }else{
                $doc_meta_data = json_encode(['application_code'=> $app_details->application_code, 'tracking_no' => $tracking_no, 'sub_module_id'=>$app_details->sub_module_id, 'section_id' => $app_details->section_id,'applicant' => $app_details->applicant,'physical_address' => $app_details->physical_address,'product_name' => $app_details->product_name,'comm_name' => $app_details->comm_name,'strength' => $app_details->strength,'dosage_name' => $app_details->dosage_name]);
            }
        }else if($module_id == 24){
            $doc_meta_data = json_encode(['application_code'=> $app_details->application_code, 'tracking_no' => $tracking_no, 'sub_module_id'=>$app_details->sub_module_id, 'section_id' => $app_details->section_id, 'subject' => $app_details->subject, 'response' => $app_details->response]);
        }
        else{
            $doc_meta_data = json_encode(['application_code'=> $app_details->application_code, 'tracking_no' => $tracking_no, 'sub_module_id'=>$app_details->sub_module_id, 'section_id' => $app_details->section_id]);
        }
        $data = [
            'name' => $prefix,
            'doc_name' => $name,
            'doc_class_id' => $doc_class_id,
            'assigned_user' => $user,
            'submitted_by' => $submitted_by,
            'source_id' => 1,
            'module_id' => $module_id,
            'decision_id' => $decision_id,
            'doc_url' => $res_url['url'],
            'report_id' => $res_url['report_id'],
            'doc_meta_data' => $doc_meta_data,
            'doc_meta_data_hash' => Hash::make($doc_meta_data)
        ];
        //for tracking request
        $trc = insertRecord('tra_esignrequest_log', convertStdClassObjToArray($data), $user_id);
        if(!isset($trc['record_id'])){
            return $trc;
        }
        $tracking_id = $trc['record_id'];
        $data['tracking_id'] = $tracking_id;
        $res = postRequest($data);
        $update_data = [
            'workflow_stage_id' => $app_details->workflow_stage_id,
            'application_code' => $app_details->application_code,
            'payload' => $payload
        ];
        $where = ['id'=> $tracking_id];
        if(!isset($res['success']) || !$res['success'] ){

            $update_data['errormessage'] = $res['message'];
            $update_data['is_sent'] = 2;
            $update_data['is_done'] = 1;
            updateRecord('tra_esignrequest_log', $where, $update_data);
            return $res;
        }
        $update_data['is_sent'] = 1;
        updateRecord('tra_esignrequest_log', $where, $update_data);

        return $res;
    }
    public function signCallback(Request $req, commonController $cc){
        $data=json_decode($req->data);
        // $file = $req->file('signed_document');
        try{
            $doc_meta_data = json_decode($data->doc_meta_data, true); 
            $tracking_id = $data->tracking_id; 
            $signed_by = $data->signed_by; 
            $validator_cipher = $data->validator_cipher; 
            // $document_signed = $data->signed_document; 
            $signing_date = $data->signing_date; 
            $decline_reason = $data->decline_reason;
            $status_id = $data->status_id;
            $signfile = $data->sign_file;
            $doc_url = $data->doc_url;
            // DB::beginTransaction();
            if($status_id == 2){
                //update document metadata to ensure it includes the signature
                $data = [
                        'response_comment' => 'Signed',
                        'signing_date' => $signing_date,
                        'status_id' => $status_id, //2 for approved to sign success
                        'is_done' => 1,
                        'signfile' => $signfile,
                        'signed_by' => $signed_by,
                        'validator_cipher' => $validator_cipher
                    ];
                $where = ['id'=>$tracking_id];
                $res = updateRecord('tra_esignrequest_log', $where, convertStdClassObjToArray($data));

                if(!$res['success']){
                    // DB::rollBack();
                    return \response()->json($res);
                }
                //signed
                $log_data = DB::table('tra_esignrequest_log as t1')
                        ->join('users as t2', 't1.assigned_user', 't2.email')
                        ->select('t1.*', 't2.id as user_id')
                        ->where('t1.id', $tracking_id)
                        ->first();
                $payload = json_decode($log_data->payload, true);
                $application_code = $payload['application_code'];
                //prepare Request 
                $req->request->add($payload);
                $req->request->add(['approved_by' => $log_data->user_id]);
                $req->request->add(['sign_file'=>'data:image/png;base64,'.$log_data->signfile]);
                //DB::beginTransaction();
                $res = $cc->saveApplicationApprovalDetails($req, $log_data->user_id);
                //DB::rollBack();
                DB::Connection('audit_db')->table('par_system_error_logs')->insert(['error'=> json_encode($res)]);
                //return ['done'];
                $res = json_decode($res->getContent(), true);
                if($res['success']){
                    //upload the signed document to DMS
                    $app_rootnode = getApplicationRootNode($application_code);
                    if(!$app_rootnode){
                        initializeApplicationDMS($doc_meta_data['section_id'],$payload['module_id'], $doc_meta_data['sub_module_id'], $application_code, $doc_meta_data['tracking_no'], $log_data->user_id);
                        $app_rootnode = getApplicationRootNode($application_code);
                    }
                    $app_rootnode = getDocumentTypeRootNode($app_rootnode->dms_node_id, $application_code, 19, $log_data->user_id);
                    //get file
                    //get file
                    $info = pathinfo($doc_url);
                    $context = stream_context_create([
                        'ssl' => [
                            'verify_peer' => false,
                            'verify_peer_name' => false,
                        ],
                    ]);
                    $contents = file_get_contents($doc_url, false, $context );
                    $file_tmp = storage_path(). str_random(8);
                    
                    file_put_contents($file_tmp, $contents);
                    $file_name = explode("?", $info['basename'], 2);
                    $file = new UploadedFile($file_tmp, $file_name[0]);
                    
                    if(!isset($file)){
                        $res = array('success' => false, 'message' => 'failed to generated document');
                        DB::rollBack();
                        return \response()->json($res);
                    }
                    $node_details = $this->uploadDocument($file, $app_rootnode, $file_name[0], '');
                    if(!isset($node_details['nodeRef'])){
                        DB::rollBack();
                        $res = array('success' => true, 'message' => 'Signed successfully with a glinch in document log');
                        return \response()->json($res);
                    }
                    $doc_data = array(
                        'application_code' => $application_code,
                        'module_id' => $payload['module_id'],
                        'validator_cipher' => $validator_cipher,
                        'doc_class_id' => $log_data->doc_class_id,
                        'document_type_id' => 19,
                        'dms_ref' => $node_details['nodeRef']
                    );
                    $approved_docs = insertRecord('tra_correspondences_document_uploads', $doc_data, $log_data->user_id);
                    if(!isset($approved_docs['record_id'])){
                        DB::rollBack();
                        $res = array('success' => false, 'message' => 'Document Upload logging Failed', 'error'=>$approved_docs);
                        return \response()->json($res);
                    }
                   
                    $res = array('success' => true, 'message' => 'Signed Successfully');

                }
            }else{
                //declined
                $data = [
                    'response_comment' => $decline_reason,
                    'signing_date' => $data->decline_date,
                    'status_id' => $status_id,
                    'is_done' => 1
                ];
                $where = ['id'=>$tracking_id];
                $res = updateRecord('tra_esignrequest_log', $where, convertStdClassObjToArray($data));

            }
        } catch (\Exception $exception) {
            sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            $res = array('success'=> false, 'message'=>$exception->getMessage(), 'source'=> 'mis');

        } catch (\Throwable $throwable) {
            sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            $res = array('success'=> false, 'message'=>$throwable->getMessage(), 'source'=> 'mis');
        }
        return \response()->json($res);
    }
    public function uploadDocument($file, $app_rootnode, $document_name, $node_ref){
        $origFileName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $fileSize = $file->getSize();
        $file_path = $file->getPathName();
        $document_rootupload =  Config('constants.dms.doc_rootupload');
        $user_id = $this->user_id;
        $destination = getcwd() . $document_rootupload;
        $savedName = str_random(3) . time() . '.' . $extension;
        //$file->move($destination, $savedName);
        $document_path = $destination . $savedName;

        //get the application root folder
        $uploadfile_name = $document_name . str_random(5).'.pdf';
        $destination_node = $app_rootnode->node_ref;
        //upload to dms
        $response = dmsUploadNodeDocument($destination_node, $file_path, $uploadfile_name, $node_ref);
       
        return $response;

    }
    //vigiflow
    public function generateUploadableE2BFile(Request $req){
        try {
            // $application_code = $req->application_code;
            $selected = json_decode($req->selected);
            //log export
            $log = DB::table('tra_pv_vigiflow_export_log')->orderBy('id', 'DESC')->first();
            if($log){
                $reference = 'BOMRA-BRIMS-Export-0'.$log->id;
            }else{
                $reference = 'BOMRA-BRIMS-Export-001';
            }
            $data = array(
                'date_generated' => Carbon::now(),
                'application_codes' => json_encode($selected),
                'reference' => $reference,
                'generated_by' => $this->user_id
            );
            $log_res = insertRecord('tra_pv_vigiflow_export_log', $data);
            if(!isset($log_res['record_id'])){
                return $log_res;
            }
            //messagedate recieved
            $messagedate =strtotime(date("Y/m/d h:i:sa")); //gets dates instance
            $year = date("Y", $messagedate);
            $month = date("m", $messagedate);
            $day = date("d", $messagedate);
            $hr = date("H", $messagedate);
            $min = date("i", $messagedate);
            $sec = date("s", $messagedate);
            $messagedate_fmt = $year."".$month."".$day."".$hr."".$min."".$sec;
            $trans_date_fmt = $year."".$month."".$day;

            //start creating xml
            $xml_string = "<?xml version='1.0' encoding='UTF-8'?>
                <!DOCTYPE ichicsr SYSTEM 'http://eudravigilance.ema.europa.eu/dtd/icsr21xml.dtd'>
                <ichicsr lang='en'>";
             /*
                ichicsrmessageheader
            */
            $xml_string .="
            <ichicsrmessageheader>
                <messagetype>ichicsr</messagetype>
                <messageformatversion>2.1</messageformatversion>
                <messageformatrelease>2.0</messageformatrelease>
                <messagenumb>".$reference."</messagenumb>
                <messagesenderidentifier>BOMRA</messagesenderidentifier>
                <messagereceiveridentifier>BRIMS</messagereceiveridentifier>
                <messagedateformat>204</messagedateformat>
                <messagedate>".$messagedate_fmt."</messagedate>
            </ichicsrmessageheader>";

            foreach ($selected as $application_code) {
                //get record
                $report = DB::table('tra_pv_applications as t1')
                    ->leftJoin('tra_application_documents as t2', 't1.application_code', 't2.application_code')
                    ->leftJoin('par_titles as t3', 't1.title_id', 't3.id')
                    ->select('t1.*', DB::raw("CASE WHEN t2.id IS NUll THEN 2 ELSE 1 End has_documents, t3.name as patient_title,CASE WHEN t1.seriousness_id IS NUll THEN 2 ELSE 3 End termhighlighted"))
                    ->where('t1.application_code', $application_code)
                    ->first();
                //seriousness
                if(validateIsNumeric($report->seriousness_id)){
                    $serious = 1;
                    $seriousness_id = $report->seriousness_id;
                    $is_lifethreatening = 2;
                    $is_hospitalized = 2;
                    $is_disabling = 2;
                    $is_congenital = 2;
                    $is_other_serious = 2;
                    $is_death = 2;

                    switch ($seriousness_id) {
                        case 1:
                            $is_lifethreatening = 1;
                            break;
                        case 2:
                            $is_hospitalized = 1;
                            break;
                        case 3:
                            $is_congenital = 1;
                            break;
                        case 4:
                            $is_disabling = 4;
                            break;
                        case 5:
                           $is_death = 1;
                            break;
                        case 6:
                            $is_other_serious = 1;
                            break;
                    }
                }else{
                    $serious = 2;
                }
                //dates preparation
                //Date recieved
                $date_added =strtotime($report->date_added); //gets dates instance
                $year = date("Y", $date_added);
                $month = date("m", $date_added);
                $day = date("d", $date_added);
                $hr = date("H", $date_added);
                $min = date("i", $date_added);
                $sec = date("s", $date_added);
                $date_added_fmt = $year."".$month."".$day;

                //Date recieved
                $receipt_date =strtotime($report->created_on); //gets dates instance
                $year = date("Y", $receipt_date);
                $month = date("m", $receipt_date);
                $day = date("d", $receipt_date);
                $hr = date("H", $receipt_date);
                $min = date("i", $receipt_date);
                $sec = date("s", $receipt_date);
                $receipt_date_fmt = $year."".$month."".$day;

                //reaction start date
                $reaction_start_date =strtotime($report->reaction_start_date); //gets dates instance
                $year = date("Y", $reaction_start_date);
                $month = date("m", $reaction_start_date);
                $day = date("d", $reaction_start_date);
                $reaction_start_date_fmt = $year."".$month."".$day;

                //reaction start date
                $date_recovered =strtotime($report->date_recovered); //gets dates instance
                $year = date("Y", $date_recovered);
                $month = date("m", $date_recovered);
                $day = date("d", $date_recovered);
                $date_recovered_fmt = $year."".$month."".$day;

                //reaction format
                switch ($report->duration_id) {
                    case 1:
                        $patientonsetageunit = 801;
                        break;
                    case 2:
                        $patientonsetageunit = 802;
                        break;
                    case 3:
                        $patientonsetageunit = 803;
                        break;
                    case 4:
                        $patientonsetageunit = 804;
                        break;
                    case 4:
                        $patientonsetageunit = 805;
                        break;

                }

                //mentration end date
                $last_menstruation_date =strtotime($report->last_menstruation_date); //gets dates instance
                $year = date("Y", $last_menstruation_date);
                $month = date("m", $last_menstruation_date);
                $day = date("d", $last_menstruation_date);
                $last_menstruation_date_fmt = $year."".$month."".$day;

                //report refs
                $reportid = $report->tracking_no;
                /*
                    safetyreport
                */
                $xml_string .= "
                <safetyreport>
                    <safetyreportversion>1</safetyreportversion> 
                    <safetyreportid>".$reportid."</safetyreportid>
                    <primarysourcecountry>BW</primarysourcecountry>
                    <occurcountry>BW</occurcountry>
                    <transmissiondateformat>102</transmissiondateformat>
                    <transmissiondate>".$trans_date_fmt."</transmissiondate>
                    <reporttype>1</reporttype>
                    <serious>".$serious."</serious>
                    <seriousnessdeath>".$is_death."</seriousnessdeath>
                    <seriousnesslifethreatening>".$is_lifethreatening."</seriousnesslifethreatening>
                    <seriousnesshospitalization>".$is_hospitalized."</seriousnesshospitalization>
                    <seriousnessdisabling>".$is_disabling."</seriousnessdisabling>
                    <seriousnesscongenitalanomali>".$is_congenital."</seriousnesscongenitalanomali>
                    <seriousnessother>".$is_other_serious."</seriousnessother>
                    <receivedateformat>102</receivedateformat>
                    <receivedate>".$date_added_fmt."</receivedate>
                    <receiptdateformat>102</receiptdateformat>
                    <receiptdate>".$receipt_date_fmt."</receiptdate>
                    <additionaldocument>".$report->has_documents."</additionaldocument>
                    <fulfillexpeditecriteria>1</fulfillexpeditecriteria>
                    <companynumb>".$reportid."</companynumb>
                    <primarysource>
                        <reportertitle>".$report->professional_title."</reportertitle>
                        <reportergivename>PRIVACY</reportergivename>
                        <reporterfamilyname>PRIVACY</reporterfamilyname>
                        <reporterorganization>PRIVACY</reporterorganization>
                        <reportercountry>BW</reportercountry>
                        <qualification>".$report->professional_qualification_id."</qualification>
                    </primarysource>
                    <sender>
                        <sendertype>2</sendertype>
                        <senderorganization>BOMRA</senderorganization>
                        <senderdepartment>PV-Department</senderdepartment>
                        <senderstreetaddress>BOMRA HQ</senderstreetaddress>
                        <sendercity>Gaborone</sendercity>
                        <sendercountrycode>BW</sendercountrycode>
                        <sendertel></sendertel>
                        <sendertelextension></sendertelextension>
                        <sendertelcountrycode></sendertelcountrycode>
                    </sender>
                    <receiver>
                        <receivertype>2</receivertype>
                        <receiverorganization>BOMRA</receiverorganization>
                        <receivercountrycode>BW</receivercountrycode>
                    </receiver>";

                //patient
                if($report->gender_id == 1){//male
                    $xml_string .= "
                    <patient>
                        <patientinitial>".$report->patient_title."</patientinitial>
                        <patientonsetage>".$report->patient_age."</patientonsetage>
                        <patientonsetageunit>".$patientonsetageunit."</patientonsetageunit>
                        <patientweight>".$report->patient_weight."</patientweight> 
                        <patientsex>".$report->gender_id."</patientsex>
                        <patientmedicalhistorytext>".$report->other_medical_conditions."</patientmedicalhistorytext>";
                }else{ //female
                    $xml_string .= "
                    <patient>
                        <patientinitial>".$report->patient_title."</patientinitial>
                        <patientonsetage>".$report->patient_age."</patientonsetage>
                        <patientonsetageunit>".$patientonsetageunit."</patientonsetageunit>
                        <patientweight>".$report->patient_weight."</patientweight>
                        <patientsex>".$report->gender_id."</patientsex>
                        <lastmenstrualdateformat>102</lastmenstrualdateformat>
                        <patientlastmenstrualdate>".$last_menstruation_date_fmt."</patientlastmenstrualdate>
                        <patientmedicalhistorytext>".$report->other_medical_conditions."</patientmedicalhistorytext>";
                }
                $xml_string .= "<patientdeath>";
                if($report->adr_outcome_id == 7 && $report->date_recovered){
                        $xml_string .= "
                            <patientdeathdateformat>102</patientdeathdateformat>
                            <patientdeathdate>".$date_recovered_fmt."</patientdeathdate>";
                }
                // else if($report->adr_outcome_id == 6 && $report->date_recovered){
                //         $xml_string .= "
                //             <patientdeathdateformat>102</patientdeathdateformat>
                //             <patientdeathdate>".$date_recovered_fmt."</patientdeathdate>";
                // }
                switch ($report->autopsy_done) {
                    case 1:
                        $xml_string .= "<patientautopsyyesno>1</patientautopsyyesno>";
                        break;
                    case 2:
                        $xml_string .= "<patientautopsyyesno>2</patientautopsyyesno>";
                        break;
                    
                    default:
                        $xml_string .= "<patientautopsyyesno>3</patientautopsyyesno>";
                        break;
                }
                $xml_string .= "</patientdeath>";
                //reaction
                $xml_string .="
                <reaction>
                    <primarysourcereaction>".$report->adverse_event."</primarysourcereaction>

                    <reactionmeddraversionllt>21.0</reactionmeddraversionllt>
                    <reactionmeddrallt>10033557</reactionmeddrallt>

                    <termhighlighted>".$report->termhighlighted."</termhighlighted>
                    <reactionstartdateformat>102</reactionstartdateformat>
                    <reactionstartdate>".$reaction_start_date_fmt."</reactionstartdate>";
                if($report->date_recovered){
                   $xml_string .= "<reactionenddateformat>102</reactionenddateformat>
                    <reactionenddate>".$date_recovered_fmt."</reactionenddate>"; 
                }
                    
                $xml_string .= "<reactionoutcome>".$report->termhighlighted."</reactionoutcome>
                </reaction>";

                $investigational_products = DB::table('tra_pv_suspected_drugs')->where('application_code', $report->application_code)->get();
                foreach ($investigational_products as $product) {
                    if($product->is_other_drugs_used == 1){
                        $drugcharacterization = 3;
                    }else{
                        $drugcharacterization = 1;
                    }
                    //drugstartdate
                    $start_date =strtotime($product->start_date); //gets dates instance
                    $year = date("Y", $start_date);
                    $month = date("m", $start_date);
                    $day = date("d", $start_date);
                    $start_date_fmt = $year."".$month."".$day;
                    // drugenddate
                    $end_date =strtotime($product->end_date); //gets dates instance
                    $year = date("Y", $end_date);
                    $month = date("m", $end_date);
                    $day = date("d", $end_date);
                    $end_date_fmt = $year."".$month."".$day;
                    $route_of_administration = getSingleRecordColValue('par_route_of_administration',['id'=>$product->route_of_administration_id], 'name');
                    $dosage_form = getSingleRecordColValue('par_dosage_forms',['id'=>$product->dosage_form_id], 'name');

                    $xml_string .="<drug>
                        <drugcharacterization>".$drugcharacterization."</drugcharacterization>
                        <medicinalproduct>".$product->brand_name."</medicinalproduct>
                        <obtaindrugcountry>BW</obtaindrugcountry>
                        <drugbatchnumb>".$product->batch_no."</drugbatchnumb>
                        <drugauthorizationcountry></drugauthorizationcountry>
                        <drugauthorizationholder></drugauthorizationholder>
                        <drugdosagetext>".$product->dosage." - ".$product->frequency."</drugdosagetext>
                        <drugdosageform>".$dosage_form."( with Route of administration being - ".$route_of_administration." )</drugdosageform>
                        ";
                    if($product->start_date){
                        $xml_string .=
                        "<drugstartdateformat>201</drugstartdateformat>
                        <drugstartdate>".$start_date_fmt."</drugstartdate>
                        ";
                    }
                    if($product->end_date){
                        $xml_string .="
                        <drugenddateformat>201</drugenddateformat>
                        <drugenddate>".$end_date_fmt."</drugenddate>";
                    }
                    $xml_string .=
                        "<actiondrug>".$product->drug_action_id."</actiondrug>              
                        <activesubstance>
                            <activesubstancename></activesubstancename>
                        </activesubstance>
                        
                    </drug>";
                }
               $xml_string .= 
                    "<summary>
                        <narrativeincludeclinical>
                        Treatment sourced 
                        ".$report->treatment.". 
                        Pre-Exisitng conditions 
                        ".$report->other_medical_conditions.".</narrativeincludeclinical>
                    </summary>
                </patient>
            </safetyreport>";
            //update status
            updateRecord('tra_pv_applications', ['application_code' => $application_code], ['is_exported'=>1]);
        }
        $xml_string.="</ichicsr>";
    

    //create a file and add content
    // file_put_contents(storage_path().'/file.xml', $xml_string);
        $response = Response::create($xml_string, 200);
        $response->header('Content-Type', 'text/xml');
        $response->header('Cache-Control', 'public');
        $response->header('Content-Description', 'File Transfer');
        $response->header('Content-Disposition', 'attachment; filename='.$reportid.'.xml');
        $response->header('Content-Transfer-Encoding', 'binary');
        return $response;

            
        } catch (\Exception $exception) {
            sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            $res = array('success'=> false, 'message'=>$exception->getMessage(), 'source'=> 'mis');

        } catch (\Throwable $throwable) {
            sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            $res = array('success'=> false, 'message'=>$throwable->getMessage(), 'source'=> 'mis');
        }
        return \response()->json($res);
    }
   
}

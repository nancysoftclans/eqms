<?php

namespace Modules\QualityDocumentControl\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
// use Illuminate\Http\File;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;
use Pion\Laravel\ChunkUpload\Handler\HandlerFactory;
use ZanySoft\Zip\Zip;
use File;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use ZipArchive;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Arr;


//watermark
use Exports\GridExport;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Excel;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PDF;
use \Mpdf\Mpdf as mPDF;
use PhpOffice\PhpPresentation\Style\Alignment;
use PhpOffice\PhpPresentation\Style\Color;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Style\Font;
use PhpOffice\PhpWord\Shared\Converter;
//use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\TemplateProcessor;

class QualityDocumentControlController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    protected $user_id;

    public function __construct(Request $req)
    {
        $is_mobile = $req->input('is_mobile');
        if (is_numeric($is_mobile) && $is_mobile > 0) {
            $this->user_id = auth('api')->user()->id;
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
    public function getdocdefinationrequirementDetails(Request $req)
{
 
    try {
     $results = DB::table('tra_documentmanager_application as t1')
    ->leftJoin('par_document_types as t2', 't1.document_type_id', '=', 't2.id')
    ->leftJoin('users as t3', 't1.owner_user_id', '=', 't3.id')
    ->leftJoin('wf_workflow_stages as t4', 't1.workflow_stage_id', '=', 't4.id')
    ->leftJoin('wf_processes as t5', 't1.process_id', '=', 't5.id')
    ->leftJoin('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
    ->leftJoin('par_navigator_folders as t7', 't1.navigator_folder_id', '=', 't7.id')
    ->leftJoin('par_groups as t8', 't1.owner_group_id', '=', 't8.id')
    ->select(
        DB::raw("decrypt(t3.first_name) as first_name,decrypt(t3.last_name) as last_name"),
        't1.doc_title AS mtype',
        't2.name AS document_type',
        't4.name AS workflow_stage',
        't6.name AS status',
        't5.name AS process_name',
        't7.name AS navigator_name',
        't8.name AS group_owner',
        't1.*',
        // DB::raw("(SELECT t2.navigator_folder_name
        //   FROM tra_documentmanager_application t2
        //   WHERE t1.navigator_folder_id = t2.id) as navigator_name")

    )->get();

        $results = convertStdClassObjToArray($results);
        $res = decryptArray($results);
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
    }
    return $res;
}

    /**
     * Show the form for creating a new resource.
     * @return Renderable
     */
    public function create()
    {
        return view('qualitydocumentcontrol::create');
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Renderable
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function show($id)
    {
        return view('qualitydocumentcontrol::show');
    }

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function edit($id)
    {
        return view('qualitydocumentcontrol::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Renderable
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Renderable
     */
    public function destroy($id)
    {
        //
    }
}

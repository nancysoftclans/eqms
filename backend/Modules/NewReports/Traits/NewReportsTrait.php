<?php


namespace Modules\NewReports\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;

trait NewReportsTrait
{
    //datefilter column
    private $date_filter_column = 't1.date_received';

   public function DateFilter(request $req){
    $from_date=$req->from_date;
    $to_date=$req->to_date;
    $where_raw=array();
    
    if($from_date != '' && $to_date != ''){
       $where_raw[]="TO_CHAR(date_filter, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
      }
      //dd($where_raw);
    $date_filter='';
    if (!empty($where_raw)) {
                     $date_filter = implode(' AND ', $where_raw);
                    }
     return $date_filter;

    }


  
   public function getTableName($module){

          $qry=DB::table('modules')
                ->where('id',$module)->first();

          $table=$qry->table_name;

          return $table;
     }

 
   public function getTotalReceivedApplications($table, $table2,$field,$filterdata,$subfilterdata,$from_date,$to_date,$has_payment_processing = null, $is_detailed_report ,$done_by_user_id){
          if($table2 == ''){
            $qry=DB::table($table." as t1")
                    ->leftJoin('tra_submissions as t4','t1.application_code','t4.application_code')
                  ->where($subfilterdata);
          }else{
            $qry=DB::table($table." as t1")
            ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
            ->leftJoin('tra_submissions as t4','t1.application_code','t4.application_code')
            ->where($subfilterdata);
        
          //filter by submodule and section
           if($filterdata!=''){
              $qry=DB::table($table." as t1")
              ->leftJoin('tra_submissions as t4','t1.application_code','t4.application_code')
                  ->whereRaw($filterdata);
            }
            if($done_by_user_id != ''){
               $qry=DB::table($table." as t1")
                   ->leftJoin('tra_submissions as t4','t1.application_code','t4.application_code')
                  ->where('t4.usr_to',$done_by_user_id);
            }
          //chek if has payment 
          if($has_payment_processing != 1){
            if(isset($to_date) & $to_date != ''){
              $qry->whereDate('t4.date_received','<=', formatDate($to_date));
          }
          if(isset($from_date) & $from_date != ''){
              $qry->whereDate('t4.date_received', '>=', formatDate($from_date))
                   ->whereDate('t4.date_received','<=', formatDate($to_date));
          }
            //filter by date
          //  if($datefilter!=''){
          //     $datefilter = str_replace('date_filter','t1.date_added',$datefilter);
          //     $qry->whereRAW($datefilter);
          //    }

          }
          else{
            if(isset($to_date) & $to_date != ''){
             // $qry->whereBetween('t1.created_on',[$from_date,$to_date]);
              $qry->whereDate('t4.date_received','<=', formatDate($to_date))
                  ->whereDate('t4.date_received', '>=', formatDate($from_date));

          }
        }
       }
       $qry->where('t4.current_stage', 401);
        if($is_detailed_report != 1){
              $total=$qry->distinct('t1.application_code')->count();
              return $total;

        
           }
          else{

            $res=$qry->get();
             return $qry;
          }

      }
    public function getBroughtForwardApplication($table, $table2,$field,$filterdata,$subfilterdata,$is_detailed_report,$from_date,$to_date,$module_id,$done_by_user_id){
        if($table2 == ''){
         if($module_id==4 || $module_id==4){
            $qry=DB::table($table.' as t1')
                 ->leftJoin('tra_payments as tp','t1.application_code','tp.application_code')
                 ->leftJoin('tra_permitsrelease_recommendation as t5','t1.application_code','t5.application_code')
                 ->whereRaw("to_char($this->date_filter_column, '%Y-%m-%d') < '".formatDate($from_date)."' and (to_char(t5.approval_date, '%Y-%m-%d') > '".formatDate($from_date)."' or t5.id is null)");
         }else{
             $qry=DB::table($table.' as t1')
                 ->leftJoin('tra_payments as tp','t1.application_code','tp.application_code')
                 ->leftJoin('tra_approval_recommendations as t5','t1.application_code','t5.application_code')
                 ->whereRaw("to_char($this->date_filter_column, '%Y-%m-%d') < '".formatDate($from_date)."' and (to_char(t5.approval_date, '%Y-%m-%d') > '".formatDate($from_date)."' or t5.id is null)");
             }
               
              $qry->where($subfilterdata);
            
          }else{
            $qry=DB::table($table.' as t1')
                 ->join($table2.' as t3','t1.'.$field,'t3.id')
                 ->leftJoin('tra_payments as tp','t1.application_code','tp.application_code')
                 ->leftJoin('tra_approval_recommendations as t5','t1.application_code','t5.application_code')
                 ->whereRaw("to_char($this->date_filter_column, '%Y-%m-%d') < '".formatDate($from_date)."' and (to_char(t5.approval_date, '%Y-%m-%d') > '".formatDate($from_date)."' or t5.id is null)");
            $qry->where($subfilterdata);
          }
            //filter by submodule and section
          if($filterdata!=''){
              $qry->whereRAW($filterdata);
            }
          if(isset($to_date) & $to_date != ''){
            $qry->whereDate('t5.created_on','<', formatDate($to_date))
                   ->whereDate('t5.created_on', '>', formatDate($from_date));
          }
            
          if(validateIsNumeric($done_by_user_id)){
              $qry->where('t5.created_by', $done_by_user_id);
          }
          if($is_detailed_report != 1){
               $total = $qry->distinct('t1.application_code')->count();
              return $total;
          }
          else{
               return $qry;
          }
            
         }
         
      public function getCarriedForwardApplication($table, $table2,$field,$filterdata,$subfilterdata,$is_detailed_report,$from_date,$to_date,$done_by_user_id){
            $qry=DB::table($table.' as t1')
                 ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
                 ->leftJoin('tra_payments as tp','t1.application_code','tp.application_code')
                 ->leftJoin('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
                 ->leftJoin('par_approval_decisions as t4','t2.decision_id','t4.id')
                  ->whereRaw("to_char($this->date_filter_column, '%Y-%m-%d') <='".formatDate($to_date)."' ")
                 ->whereNull('t2.id');
              $qry->where($subfilterdata);
            //filter by submodule and section
           if($filterdata!=''){
              $qry->whereRAW($filterdata);
            }
            if(validateIsNumeric($done_by_user_id)){
              $qry->where('t2.created_by', $done_by_user_id);
          }
        
          if($is_detailed_report != 1){
              $total=$qry->distinct('t1.application_code')->count();
              return $total;
          }
          else{
               return $qry;
             }
         }

public function getEvaluatedInspectedApplications($table, $table2,$field,$filterdata,$subfilterdata,$from_date,$to_date,$is_detailed_report,$module_id, $done_by_user_id){
    DB::enableQueryLog();
     if($table2 == ''){
         $qry=DB::table($table.' as t1')
       ->join('tra_evaluation_recommendations as t2','t1.application_code','t2.application_code')
       ->join('par_recommendations as t4','t2.recommendation_id','t4.id')
       ->where($subfilterdata);
  
          }else{
           $qry=DB::table($table.' as t1')
           ->leftjoin('tra_evaluation_recommendations as t2','t1.application_code','t2.application_code')
           ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
           ->leftjoin('par_recommendations as t4','t2.recommendation_id','t4.id')
           ->where($subfilterdata);
         
          }

           if(is_numeric($module_id) && $module_id==2 || $module_id===2){
              $qry->leftjoin('tra_premiseinspection_applications as t5','t1.application_code','t5.application_code');
              $qry->where('t5.recommendation_id',1);
          }

            if(is_numeric($module_id) && $module_id==4 || $module_id===4){
              $qry->where('t2.recommendation_id',2);
          }
          // if(is_numeric($done_by_user_id)){
          //   $qry->where('t2.created_by',$done_by_user_id);
          //    }
             //filter by submodule and section
          if($filterdata!=''){
              $qry->whereRAW($filterdata);
          }
          //   //filter by date
            if(isset($to_date) & $to_date != ''){
              $qry->whereDate('t2.created_on','<', formatDate($to_date))
                   ->whereDate('t2.created_on', '>', formatDate($from_date));
               }
          if($is_detailed_report != 1){
                $count = $qry->distinct('t1.application_code')->count();
                 return $count;
              }
              else{
                 return $qry;
              }
          
          }
public function getScreenedApplications($table, $table2,$field,$filterdata, $subfilterdata,$from_date,$to_date,$is_detailed_report){
         if($table2 == ''){
             $qry=DB::table($table.' as t1')
             ->join('tra_product_screening_approvals as t2','t1.application_code','t2.application_code')
             ->where($subfilterdata);
               //filter by date
           if($datefilter!=''){
              $datefilter = str_replace('date_filter','t2.submission_date',$datefilter);
              $qry->whereRAW($datefilter);
            }
             }else{
                 $qry=DB::table($table.' as t1')
                 ->join('tra_product_screening_approvals as t2','t1.application_code','t2.application_code')
                 ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
                 ->where($subfilterdata);

           //filter by submodule and section
           if($filterdata!=''){
              $qry->whereRAW($filterdata);
            }
          //      //filter by date
          //  if($datefilter!=''){
          //     $datefilter = str_replace('date_filter','t1.submission_date',$datefilter);
          //     $qry->whereRAW($datefilter);
          //   }
          if(isset($to_date) & $to_date != ''){
            $qry->whereDate('t2.created_on','<', $to_date)
                 ->whereDate('t2.created_on', '>', $from_date);
             }
          }
        if($is_detailed_report != 1){
             $total=$qry->distinct('t1.application_code')->count();
             return $total;
          }
          else{
             return $qry;
          }
        
          }
  
     public function funcGetQueryResponseApplications($table, $table2,$field,$filterdata, $subfilterdata,$from_date,$to_date,$is_detailed_report,$done_by_user_id, $datefilter=''){
   
         if($table2 == ''){
             $qry=DB::table($table.' as t1')
             ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
             ->where($subfilterdata);
               //filter by date
           if($datefilter!=''){
              $datefilter = str_replace('date_filter','t2.response_received_on',$datefilter);
              $qry->whereRAW($datefilter);
            }
             }else{
                 $qry=DB::table($table.' as t1')
                 ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
                 ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
                 ->where($subfilterdata);

           //filter by submodule and section
           if($filterdata!=''){
              $qry->whereRAW($filterdata);
            }
               //filter by date
            if(isset($to_date) & $to_date != ''){
              $qry->whereDate('t2.response_received_on','<', formatDate($to_date))
                   ->whereDate('t2.response_received_on', '>', formatDate($from_date));
               }
          }
          if(validateIsNumeric($done_by_user_id)){
                $qry->where('t2.queried_by', $done_by_user_id);
            }
            if($is_detailed_report != 1){
              $count = $qry->distinct('t1.application_code')->count();
              return $count;
          }
          else{
               return $qry;
            }
            
          }

    public function getQueriedApplications($table, $table2,$field,$filterdata,$subfilterdata, $from_date,$to_date,$is_detailed_report,$done_by_user_id){
        if($table2 == ''){
          $qry=DB::table($table.' as t1')
                 ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
                 ->where($subfilterdata);
           }else{
            $qry=DB::table($table.' as t1')
                   ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
                  ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
                  ->where($subfilterdata);
           }
          //filter by submodule and section
           if($filterdata!=''){
              $qry->whereRAW($filterdata);
            }
             //filter by date
          if(isset($to_date) & $to_date != ''){
            $qry->whereDate('t2.queried_on','<', formatDate($to_date))
                 ->whereDate('t2.queried_on', '>', formatDate($from_date));
             }
            if($is_detailed_report != 1){
               $count = $qry->distinct('t1.application_code')->count();
               return $count;
          }
          else{
               return $qry;
          }

            
    }
      

   public function getApprovedApplications($table, $table2,$field,$filterdata,$subfilterdata,$from_date,$to_date,$is_detailed_report, $done_by_user_id=''){
         if($table2 == ''){
            $qry=DB::table($table.' as t1')
           ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
           ->join('par_approval_decisions as t4','t2.decision_id','t4.id')
           ->leftjoin('tra_evaluation_recommendations as t22','t1.application_code','t22.application_code')
           ->where($subfilterdata)
           ->where('t2.decision_id',1);
          }else{
           $qry=DB::table($table.' as t1')
           ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
           ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
           ->join('par_approval_decisions as t4','t2.decision_id','t4.id')
           ->leftjoin('tra_evaluation_recommendations as t22','t1.application_code','t22.application_code')
           ->where($subfilterdata)
           ->where('t2.decision_id',1);
          }
    
        //filter by submodule and section
       if($filterdata!=''){
             $qry->whereRAW($filterdata);
         }

        if(isset($to_date) & $to_date != ''){
          $qry->whereDate('t2.approval_date','<', formatDate($to_date))
               ->whereDate('t2.approval_date', '>', formatDate($from_date));
           }
        // if(validateIsNumeric($done_by_user_id)){
        //         $qry->where('t2.created_by', $done_by_user_id);
        //     }
          
        if($is_detailed_report != 1){
          $count = $qry->distinct('t1.application_code')->count();
          return $count;
          }

          else{
               return $qry;
          }

        } 
 public function getRejectedApplications($table, $table2,$field,$filterdata,$subfilterdata,$from_date,$to_date,$is_detailed_report,  $done_by_user_id=''){
            if($table2 == ''){
             $qry=DB::table($table.' as t1')
           ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
           ->join('par_approval_decisions as t4','t2.decision_id','t4.id')
           ->leftjoin('tra_evaluation_recommendations as t22','t1.application_code','t22.application_code')
           ->where($subfilterdata)
           ->where('t2.decision_id',2);
          }else{
            $qry=DB::table($table.' as t1')
           ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
           ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
           ->join('par_approval_decisions as t4','t2.decision_id','t4.id')
           ->leftjoin('tra_evaluation_recommendations as t22','t1.application_code','t22.application_code')
           ->where($subfilterdata)
           ->where('t2.decision_id',2);
          }
       

        //filter by submodule and section
       if($filterdata!=''){
             $qry->whereRAW($filterdata);
         }
         //filter by date
        if(isset($to_date) & $to_date != ''){
          $qry->whereDate('t2.created_on','<', formatDate($to_date))
               ->whereDate('t2.created_on', '>', formatDate($from_date));
           }
           if(validateIsNumeric($done_by_user_id)){
                $qry->where('t22.created_by', $done_by_user_id);
            }
         if($is_detailed_report != 1){
              $count = $qry->distinct('t1.application_code')->count();
              return $count;
          }
          else{
               return $qry;
          }
        } 

 public function getPermitReviewApplications($table, $table2,$field,$filterdata,$subfilterdata,$datefilter,$is_detailed_report){
        //dd($subfilterdata);
        $qry=DB::table($table.' as t1')
           ->join('tra_managerpermits_review as t2','t1.application_code','t2.application_code')
           ->where($subfilterdata)
           ->where('t2.decision_id',1);
          //  $data=$qry->get();
          //  $total=$qry->count();
           //dd($total);
        //filter by submodule and section
       if($filterdata!=''){
             $qry->whereRAW($filterdata);
         }
         //filter by date
        if($datefilter!=''){
          $datefilter = str_replace('date_filter','t2.approval_date',$datefilter);
          $qry->whereRAW($datefilter);
           }
         if($is_detailed_report != 1){
               $qry->select(DB::raw('count(DISTINCT(t1.application_code)) as counter'));
               $data=$qry->first();
               $total=$qry->count();
              return $total;
          }
          else{
               return $qry;
          }
        } 

   public function getPermitReleaseApplications($table, $table2,$field,$filterdata,$subfilterdata,$datefilter,$is_detailed_report){
        $qry=DB::table($table.' as t1')
           ->join('tra_permitsrelease_recommendation as t2','t1.application_code','t2.application_code')
           ->where($subfilterdata)
           ->where('t2.decision_id',1);

        //filter by submodule and section
       if($filterdata!=''){
             $qry->whereRAW($filterdata);
         }
         //filter by date
        if($datefilter!=''){
          $datefilter = str_replace('date_filter','t2.approval_date',$datefilter);
          $qry->whereRAW($datefilter);
           }
         if($is_detailed_report != 1){
               $qry->select(DB::raw('count(DISTINCT(t1.application_code)) as counter'));
               $data=$qry->first();
             
              return $data->counter;
          }
          else{
               return $qry;
          }
        }

    public function getPermitRejectionApplications($table, $table2,$field,$filterdata,$subfilterdata,$datefilter,$is_detailed_report){
        $qry=DB::table($table.' as t1')
           ->join('tra_permitsrelease_recommendation as t2','t1.application_code','t2.application_code')
           ->where($subfilterdata)
           ->where('t2.decision_id',3);

        //filter by submodule and section
       if($filterdata!=''){
             $qry->whereRAW($filterdata);
         }
         //filter by date
        if($datefilter!=''){
          $datefilter = str_replace('date_filter','t2.approval_date',$datefilter);
          $qry->whereRAW($datefilter);
           }
         if($is_detailed_report != 1){
               $qry->select(DB::raw('count(DISTINCT(t1.application_code)) as counter'));
               $data=$qry->first();
             
              return $data->counter;
          }
          else{
               return $qry;
          }
        } 



function toAlpha($num){
    return chr(substr("000".($num+65),-3));
}
function number_to_alpha($num,$code)
{   
    $alphabets = array('', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');

    $division = floor($num / 26);
    $remainder = $num % 26; 

    if($remainder == 0)
    {
        $division = $division - 1;
        $code .= 'Z';
    }
    else
        $code .= $alphabets[$remainder];

    if($division > 26)
        return number_to_alpha($division, $code);   
    else
        $code .= $alphabets[$division];     

    return strrev($code);
} 
public function getArrayColumns($array){
  $temp=array();
  if(!empty($array[1])){
      foreach ($array[1] as $key=>$udata){
      //
        //  $temp[]=strtoupper(str_replace("_"," ",strtoupper($key)));
      $temp[] =$key;
          }
    }
  else if(!empty($array[0])){
    foreach ($array[0] as $key=>$udata){
        $temp[]=$key;
        }
    }
  
  return $temp;
   
   }

   public function getPublishedPvApplications($table, $table2,$field,$filterdata,$subfilterdata,$datefilter,$is_detailed_report){
   
       $qry=DB::table($table.' as t1')
      ->where($subfilterdata)
      ->where('t1.is_published',1);
      $total=$qry->count();
      return $total;

   //filter by submodule and section
  if($filterdata!=''){
        $qry->whereRAW($filterdata);
    }
    //filter by date
   if($datefilter!=''){
     $datefilter = str_replace('date_filter','t2.approval_date',$datefilter);
     $qry->whereRAW($datefilter);
      }
   if($is_detailed_report != 1){
          $qry->select(DB::raw('count(DISTINCT(t1.application_code)) as counter'));
          //$data=$qry->first();
          $total=$qry->count();
         return $total;
     }
     else{
         $total=$qry->count();
          return $total;
     }

   } 
   public function getReporterNotifiedPvApplications($table, $table2,$field,$filterdata,$subfilterdata,$datefilter,$is_detailed_report){
   
    $qry=DB::table($table.' as t1')
   ->where($subfilterdata)
   ->where('t1.is_reporter_notified',1);
   $total=$qry->count();
   return $total;

//filter by submodule and section
if($filterdata!=''){
     $qry->whereRAW($filterdata);
 }
 //filter by date
if($datefilter!=''){
  $datefilter = str_replace('date_filter','t2.approval_date',$datefilter);
  $qry->whereRAW($datefilter);
   }
if($is_detailed_report != 1){
       $qry->select(DB::raw('count(DISTINCT(t1.application_code)) as counter'));
       //$data=$qry->first();
       $total=$qry->count();
      return $total;
  }
  else{
      $total=$qry->count();
       return $total;
  }
} 
public function getExportedPvApplications($table, $table2,$field,$filterdata,$subfilterdata,$datefilter,$is_detailed_report){
   
  $qry=DB::table($table.' as t1')
 ->where($subfilterdata)
 ->where('t1.is_exported',1);
 $total=$qry->count();
 return $total;

//filter by submodule and section
if($filterdata!=''){
   $qry->whereRAW($filterdata);
   $total=$qry->count();
   return $total;
}
//filter by date
if($datefilter!=''){
  $datefilter = str_replace('date_filter','t2.approval_date',$datefilter);
   $qry->whereRAW($datefilter);
   $total=$qry->count();
   return $total;
 }
if($is_detailed_report != 1){
     $qry->select(DB::raw('count(DISTINCT(t1.application_code)) as counter'));
     //$data=$qry->first();
     $total=$qry->count();
    return $total;
}
else{
    $total=$qry->count();
     return $total;
}

} 

public function getDroppedEnforcementReportsApplications($table, $table2,$field,$filterdata,$subfilterdata,$datefilter,$is_detailed_report){
  if($table2 == ''){
   $qry=DB::table($table.' as t1')
      ->join('tra_investigation_approvals as t2','t1.application_code','t2.application_code')
      ->join('par_investigation_decisions as t4','t2.investigation_decision_id','t4.id')
      ->where($subfilterdata)
      ->where('t2.investigation_decision_id',2);
   }else{
  $qry=DB::table($table.' as t1')
     ->join('tra_investigation_approvals as t2','t1.application_code','t2.application_code')
     ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
     ->join('par_investigation_decisions as t4','t2.investigation_decision_id','t4.id')
     ->where($subfilterdata)
     ->where('t2.investigation_decision_id',2);
   }


//filter by submodule and section
if($filterdata!=''){
   $qry->whereRAW($filterdata);
}
//filter by date
// if($datefilter!=''){
// $datefilter = str_replace('date_filter','t2.approval_date',$datefilter);
// $qry->whereRAW($datefilter);
//  }
if($is_detailed_report != 1){
     $qry->select(DB::raw('count(DISTINCT(t1.application_code)) as counter'));
     $data=$qry->first();
   
    return $data->counter;
}
else{
     return $qry;
}
} 

public function getSubmittedForInvestigationApplications($table, $table2,$field,$filterdata,$subfilterdata,$datefilter,$is_detailed_report){
  if($table2 == ''){
   $qry=DB::table($table.' as t1')
 ->join('tra_investigation_approvals as t2','t1.application_code','t2.application_code')
 ->join('par_investigation_decisions as t4','t2.investigation_decision_id','t4.id')
 ->where($subfilterdata)
 ->where('t2.investigation_decision_id',1);
}else{
  $qry=DB::table($table.' as t1')
 ->join('tra_investigation_approvals as t2','t1.application_code','t2.application_code')
 ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
 ->join('par_investigation_decisions as t4','t2.investigation_decision_id','t4.id')
 ->where($subfilterdata)
 ->where('t2.investigation_decision_id',1);
}


//filter by submodule and section
if($filterdata!=''){
   $qry->whereRAW($filterdata);
}
//filter by date
// if($datefilter!=''){
// $datefilter = str_replace('date_filter','t2.approval_date',$datefilter);
// $qry->whereRAW($datefilter);
//  }
if($is_detailed_report != 1){
     $qry->select(DB::raw('count(DISTINCT(t1.application_code)) as counter'));
     $data=$qry->first();
   
    return $data->counter;
}
else{
     return $qry;
}
} 

public function getClosedInvestigation($table, $table2,$field,$filterdata,$subfilterdata,$datefilter,$is_detailed_report){
  if($table2 == ''){
   $qry=DB::table($table.' as t1')
 ->join('tra_investigation_approvals as t2','t1.application_code','t2.application_code')
 ->join('par_investigation_decisions as t4','t2.investigation_decision_id','t4.id')
 ->where($subfilterdata)
 ->where('t2.investigation_decision_id',1);
}else{
  $qry=DB::table($table.' as t1')
 ->join('tra_investigation_approvals as t2','t1.application_code','t2.application_code')
 ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
 ->join('par_investigation_decisions as t4','t2.investigation_decision_id','t4.id')
 ->where($subfilterdata)
 ->where('t2.investigation_decision_id',1);
}


//filter by submodule and section
if($filterdata!=''){
   $qry->whereRAW($filterdata);
}
//filter by date
// if($datefilter!=''){
// $datefilter = str_replace('date_filter','t2.approval_date',$datefilter);
// $qry->whereRAW($datefilter);
//  }
if($is_detailed_report != 1){
     $qry->select(DB::raw('count(DISTINCT(t1.application_code)) as counter'));
     $data=$qry->first();
   
    return $data->counter;
}
else{
     return $qry;
}
} 

}

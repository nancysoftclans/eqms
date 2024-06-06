<?php

namespace Modules\IssueManagement\Entities;

use Illuminate\Database\Eloquent\Model;

class IssueManagement extends Model
{
    protected $table = 'tra_issue_management_applications';

    protected $fillable = [
        'submission_id',
        'issue_type_id',
        'title',
        'description',
        'target_resolution_date',
        'follow_up_on',
        'section_ids',
        'issue_status_id',
        'complainant_address',
        'complainant_name',
        'organisation_name',
        'complainant_telephone',
        'complaint_mode_id',
        'complaint_type_id',
        'created_by',
        'altered_by',
        'created_on',
        'dola',
        'date_closed',
        'application_code',
        'workflow_stage_id',
        'application_status_id',
        'reference_no',
        'tracking_no'
    ];

    public $timestamps = false;
}

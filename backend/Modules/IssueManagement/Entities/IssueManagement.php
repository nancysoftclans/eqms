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
        'tracking_no',
        'process_id',
        'complaint_direct_or_indirect',
        'office_assigned_to',
        'complaint_scheduling_delay',
        'complaint_manner_of_advisor',
        'complaint_turnaround',
        'complaint_response_delay',
        'complaint_other',
        'problem_statement',
        'rca_team',
        'responsible_officer',
        'complaint_placing_budgetary',
        'complaint_placing_schedule',
        'complaint_lacking_knowledge',
        'complaint_practicing_autocratic',
        'complaint_processes',
        'complaint_ineffective_processes',
        'complaint_inefficient_processes',
        'complaint_ineffective_support',
        'complaint_system_documentation',
        'complaint_incomplete_system',
        'complaint_ineffective_system',
        'complaint_inefficient_system',
        'complaint_analytical_methods',
        'complaint_validated_methods',
        'issue_resolution',
        'complaint_fully_addressed'
    ];

    public $timestamps = false;
}

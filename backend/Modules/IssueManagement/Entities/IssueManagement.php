<?php

namespace Modules\IssueManagement\Entities;

use Illuminate\Database\Eloquent\Model;

class IssueManagement extends Model
{
    protected $table = 'tra_issue_management_applications';

    protected $fillable = [
        'issue_type_id',
        'title',
        'description',
        'target_resolution_date',
        'follow_up_on',
        'section_ids',
        'issue_status_id',
        'complainant_address',
        'complainant_name',
        'complainant_telephone',
        'complaint_mode_id',
        'complaint_type_id',
        'created_by',
        'altered_by',
        'created_on',
        'dola',
    ];

    public $timestamps = false;
}

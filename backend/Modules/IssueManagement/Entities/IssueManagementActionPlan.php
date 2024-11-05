<?php

namespace Modules\IssueManagement\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IssueManagementActionPlan extends Model
{
    use HasFactory;

    protected $table = 'tra_issue_management_action_plans';

    protected $fillable = [
        'issue_id',
        'action',
        'responsible_person',
        'start_date',
        'completion_date',
        'is_enabled',
        'created_by',
        'altered_by',
        'created_on',
        'dola'
    ];

    public $timestamps = false;
}

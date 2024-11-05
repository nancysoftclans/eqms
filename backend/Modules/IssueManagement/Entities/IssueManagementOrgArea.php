<?php

namespace Modules\IssueManagement\Entities;

use Illuminate\Database\Eloquent\Model;

class IssueManagementOrgArea extends Model
{
    protected $table = 'tra_issue_management_organisational_areas';

    protected $fillable = [
        'issue_id',
        'department_id',
        'is_enabled',
        'created_by',
        'altered_by'
    ];

    public $timestamps = false;
}

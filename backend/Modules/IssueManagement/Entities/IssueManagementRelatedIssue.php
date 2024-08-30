<?php

namespace Modules\IssueManagement\Entities;

use Illuminate\Database\Eloquent\Model;

class IssueManagementRelatedIssue extends Model
{
    protected $table = 'tra_issue_management_related_issues';

    protected $fillable = [
        'issue_id',
        'related_id',
        'is_enabled',
        'created_by',
        'altered_by'
    ];

    public $timestamps = false;
}

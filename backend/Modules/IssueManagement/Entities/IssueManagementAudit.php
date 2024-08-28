<?php

namespace Modules\IssueManagement\Entities;

use Illuminate\Database\Eloquent\Model;

class IssueManagementAudit extends Model
{
    protected $table = 'tra_issue_management_audits';

    protected $fillable = [
        'issue_id',
        'audit_id',
        'is_enabled',
        'created_by',
        'altered_by'
    ];

    public $timestamps = false;
}

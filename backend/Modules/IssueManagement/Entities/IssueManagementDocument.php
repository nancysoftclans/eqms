<?php

namespace Modules\IssueManagement\Entities;

use Illuminate\Database\Eloquent\Model;

class IssueManagementDocument extends Model
{
    protected $table = 'tra_issue_management_documents';

    protected $fillable = [
        'issue_id',
        'document_id',
        'type',
        'is_enabled',
        'created_by',
        'altered_by'
    ];

    public $timestamps = false;
}

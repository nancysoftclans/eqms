<?php

namespace Modules\IssueManagement\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IssueStatusGroups extends Model
{
    use HasFactory;

    protected $table = 'par_issue_status_groups';

    protected $fillable = [
        'title',
        'is_enabled',
        'created_by',
        'altered_by',
        'issue_status_ids'
    ];

    public $timestamps = false;
}

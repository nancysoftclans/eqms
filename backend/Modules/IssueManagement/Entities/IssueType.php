<?php

namespace Modules\IssueManagement\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class IssueType extends Model
{
    use HasFactory;

    protected $table = 'par_issue_types';

    protected $fillable = [
        'title',
        'description',
        'form_id',
        'is_enabled',
        'created_by',
        'altered_by'
    ];

    public $timestamps = false;
}

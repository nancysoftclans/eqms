<?php

namespace Modules\Workflow\Entities;

use Illuminate\Database\Eloquent\Model;

class SubModule extends Model
{
    protected $table='par_sub_modules';
    protected $guarded=[];
    const UPDATED_AT = 'dola';
    const CREATED_AT = 'created_on';
}

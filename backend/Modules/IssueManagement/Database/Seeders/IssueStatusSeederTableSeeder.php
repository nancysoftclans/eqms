<?php

namespace Modules\IssueManagement\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IssueStatusSeederTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $seeder=array(
            array(
                'name'=>'Draft',
                'description'=>'Draft'
            ),
            array(
                'name'=>'In Progress',
                'description'=>'In Progress'
            ),
            array(
                'name'=>'Paused',
                'description'=>'Paused'
            ),
            array(
                'name'=>'On Hold',
                'description'=>'On Hold'
            ),
            array(
                'name'=>'Under investigation',
                'description'=>'Under investigation'
            ),
            array(
                'name'=>'Cancelled',
                'description'=>'Cancelled'
            ),
            array(
                'name'=>'Closed',
                'description'=>'Closed'
            ),
            array(
                'name'=>'Withdrawn',
                'description'=>'Withdrawn'
            ),
            array(
                'name'=>'Rejected',
                'description'=>'Rejected'
            ),
        );
        // update or insert depending on the name
        foreach($seeder as $seed){
            DB::table('par_issue_statuses')->updateOrInsert(
                ['name'=>$seed['name']],
                $seed
            );
        }
    }
}

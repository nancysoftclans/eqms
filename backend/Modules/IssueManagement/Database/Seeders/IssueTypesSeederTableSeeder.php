<?php

namespace Modules\IssueManagement\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IssueTypesSeederTableSeeder extends Seeder
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
                'title'=>'Customer Complaints And Appeals',
                'description'=>'Customer Complaints And Appeals'
            ),
            array(
                'title'=>'Corrective Actions',
                'description'=>'Corrective Actions'
            ),
            array(
                'title'=>'Change Management',
                'description'=>'Change Management'
            ),
            array(
                'title'=>'Deviation',
                'description'=>'Deviation'
            )
        );
        // update or insert depending on the title
        foreach($seeder as $seed){
            DB::table('par_issue_types')->updateOrInsert(
                ['title'=>$seed['title']],
                $seed
            );
        }
    }
}

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
                'name'=>'Customer Complaints And Appeals',
                'description'=>'Customer Complaints And Appeals'
            ),
            array(
                'name'=>'Corrective Actions',
                'description'=>'Corrective Actions'
            ),
            array(
                'name'=>'Change Management',
                'description'=>'Change Management'
            ),
            array(
                'name'=>'Deviation',
                'description'=>'Deviation'
            )
        );
        // update or insert depending on the name
        foreach($seeder as $seed){
            DB::table('par_issue_types')->updateOrInsert(
                ['name'=>$seed['name']],
                $seed
            );
        }
    }
}

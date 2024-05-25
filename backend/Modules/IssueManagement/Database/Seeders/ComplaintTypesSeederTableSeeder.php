<?php

namespace Modules\IssueManagement\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComplaintTypesSeederTableSeeder extends Seeder
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
                'name'=>'Complaint',
                'description'=>'Complaint'
            ),
            array(
                'name'=>'1st Appeal',
                'description'=>'First Appeal'
            ),
            array(
                'name'=>'2rd Appeal',
                'description'=>'Second Appeal'
            )
        );
        // update or insert depending on the name
        foreach($seeder as $seed){
            DB::table('par_complaint_types')->updateOrInsert(
                ['name'=>$seed['name']],
                $seed
            );
        }
    }
}

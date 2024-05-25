<?php

namespace Modules\IssueManagement\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComplaintModesSeederTableSeeder extends Seeder
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
                'name'=>'In Person',
                'description'=>'In Person'
            ),
            array(
                'name'=>'Letter',
                'description'=>'Letter'
            ),
            array(
                'name'=>'E-Mail',
                'description'=>'Mail'
            ),
            array(
                'name'=>'Telephone',
                'description'=>'Telephone'
            ),
            array(
                'name'=>'Website',
                'description'=>'Website'
            ),
            array(
                'name'=>'Comments Box',
                'description'=>'Comments Box'
            ),
            array(
                'name'=>'Other',
                'description'=>'Other Channel'
            )
        );
        // update or insert depending on the name
        foreach($seeder as $seed){
            DB::table('par_complaint_modes')->updateOrInsert(
                ['name'=>$seed['name']],
                $seed
            );
        }
    }
}

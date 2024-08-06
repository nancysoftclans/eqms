<?php

namespace Modules\IssueManagement\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IssueStateSeederTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $seeder = array(
            array(
                'title' => 'Open'
            ),
            array(
                'title' => 'Closed'
            ),
            array(
                'title' => 'In Progress'
            ),            
            array(
                'title' => 'Cancelled'
            ),
            array(
                'title' => 'On Hold'
            )
        );
        // update or insert depending on the title
        foreach ($seeder as $seed) {
            DB::table('par_issue_states')->updateOrInsert(
                ['title' => $seed['title']],
                $seed
            );
        }
    }
}

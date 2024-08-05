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
        $seeder = array(
            array(
                'title' => 'Raised',
                'issue_state_id' => 1,
            ),
            array(
                'title' => 'In Progress',
                'issue_state_id' => 1
            ),
            array(
                'title' => 'Paused',
                'issue_state_id' => 1
            ),
            array(
                'title' => 'Pause',
                'issue_state_id' => 5
            ),
            array(
                'title' => 'On Hold',
                'issue_state_id' => 1
            ),
            array(
                'title' => 'Under investigation',
                'issue_state_id' => 3
            ),
            array(
                'title' => 'Cancelled',
                'issue_state_id' => 4
            ),
            array(
                'title' => 'Closed',
                'issue_state_id' => 2
            ),
            array(
                'title' => 'Withdrawn',
                'issue_state_id' => 4
            ),
            array(
                'title' => 'Rejected',
                'issue_state_id' => 4
            ),
        );
        // update or insert depending on the title
        foreach ($seeder as $seed) {
            DB::table('par_issue_statuses')->updateOrInsert(
                ['title' => $seed['title']],
                $seed
            );
        }
    }
}

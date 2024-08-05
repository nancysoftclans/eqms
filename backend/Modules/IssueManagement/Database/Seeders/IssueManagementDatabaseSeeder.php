<?php

namespace Modules\IssueManagement\Database\Seeders;

use Illuminate\Database\Seeder;

class IssueManagementDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            ComplaintModesSeederTableSeeder::class,
            ComplaintTypesSeederTableSeeder::class,
            IssueStateSeederTableSeeder::class,
            IssueStatusSeederTableSeeder::class,
            IssueTypesSeederTableSeeder::class
        ]);
    }
}

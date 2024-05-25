<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\IssueManagement\Database\Seeders\IssueManagementDatabaseSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            IssueManagementDatabaseSeeder::class
        ]);
    }
}

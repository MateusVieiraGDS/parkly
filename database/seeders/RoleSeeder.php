<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $time = now();
        
        DB::table('roles')->insert([
            [
                'id' => 1, 
                'role' => 'master',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'id' => 2, 
                'role' => 'admin',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'id' => 3, 
                'role' => 'treasurer',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'id' => 4, 
                'role' => 'member',
                'created_at' => $time,
                'updated_at' => $time
            ],
        ]);
    }
}

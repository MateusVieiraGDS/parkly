<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $time = now();
        
        DB::table('users')->insert([
            [
                'name' => 'master admin',
                'email' => 'master@admin.admin',
                'email_verified_at' => now(),
                'password' => Hash::make('m_admin_2023_passwd'),
                'role_id' => 1,
                'created_at' => $time,
                'updated_at' => $time,
            ]
        ]);
    }
}

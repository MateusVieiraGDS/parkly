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
                'email' => 'mateusvieirap010@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('123456789'),
                'created_at' => $time,
                'updated_at' => $time,
            ]
        ]);
    }
}

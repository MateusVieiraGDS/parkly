<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        $this->call(AdminSeeder::class);
        $this->call(CongregacoesSeeder::class);
        $this->call(CargosSeeder::class);
        $this->call(GruposSeeder::class);
        $this->call(StateSeeder::class);
        $this->call(CitySeeder::class);
    }
}

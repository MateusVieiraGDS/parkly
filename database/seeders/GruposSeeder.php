<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GruposSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $time = now();
        
        DB::table('grupos')->insert([
            [
                'nome' => 'Varões',
                'description' => 'Composto pela membrezia masculina devidamente casados.',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'nome' => 'Irmãs',
                'description' => 'Composto pela membrezia feminina devidamente casadas.',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'nome' => 'Adolecentes',
                'description' => 'Composto pela membrezia entre 11 e 14 anos de idade.',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'nome' => 'Jovens',
                'description' => 'Composto pela membrezia apartir de 15 anos de idade.',
                'created_at' => $time,
                'updated_at' => $time
            ]
        ]);
    }
}

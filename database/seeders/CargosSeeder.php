<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CargosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $time = now();
        
        DB::table('cargos')->insert([
            [
                'nome' => 'Auxiliar',
                'description' => 'Auxilia nas funções gerais da igreja.',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'nome' => 'Diaconato',
                'description' => 'Responsável pelas funções gerais, visitas, ceia.',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'nome' => 'Evangelista',
                'description' => 'Direito a sentar no altar, pregador externo da palavra.',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'nome' => 'Membro',
                'description' => 'Membro registrado da nave da igreja.',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'nome' => 'Missionário',
                'description' => 'Agente pregador mais externo da igreja, incubido de obras sociais e evangelizações apoiadas pela igreja.',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'nome' => 'Pastor',
                'description' => 'Responsável por pastorear, aconselhar e acompanhar os trabalhos, caso dirigente, responsável pela membresia em questão.',
                'created_at' => $time,
                'updated_at' => $time
            ],
            [
                'nome' => 'Presbítero',
                'description' => 'Responsável por manter a ordem, aconselhar abaixo de pastor, caso dirigente, responsável pela membresia em questão.',
                'created_at' => $time,
                'updated_at' => $time
            ]
        ]);
    }
}

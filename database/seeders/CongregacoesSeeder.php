<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CongregacoesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $time = now();
        
        DB::table('congregacoes')->insert([
            [
                'nome' => 'Sede Assembléia de Deus Ministério Toyama',
                'rua' => 'Rua Um Conjunto Residencial Toyama',
                'numero' => '379',
                'bairro' => 'Jardim Armênia',
                'cidade' => 'Mogi das Cruzes',
                'uf' => 'SP',
                'complemento' => '',
                'cep' => '08780685',
                'created_at' => $time,
                'updated_at' => $time
            ]
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = date("Y-m-d H:i:s");

        DB::table("states")->insert([
            [
                "id"         => 11,
                "name"       => "Rondônia",
                "uf"       => "RO",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 12,
                "name"       => "Acre",
                "uf"       => "AC",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 13,
                "name"       => "Amazonas",
                "uf"       => "AM",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 14,
                "name"       => "Roraima",
                "uf"       => "RR",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 15,
                "name"       => "Pará",
                "uf"       => "PA",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 16,
                "name"       => "Amapá",
                "uf"       => "AP",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 17,
                "name"       => "Tocantins",
                "uf"       => "TO",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 21,
                "name"       => "Maranhão",
                "uf"       => "MA",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 22,
                "name"       => "Piauí",
                "uf"       => "PI",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 23,
                "name"       => "Ceará",
                "uf"       => "CE",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 24,
                "name"       => "Rio Grande do Norte",
                "uf"       => "RN",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 25,
                "name"       => "Paraíba",
                "uf"       => "PB",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 26,
                "name"       => "Pernambuco",
                "uf"       => "PE",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 27,
                "name"       => "Alagoas",
                "uf"       => "AL",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 28,
                "name"       => "Sergipe",
                "uf"       => "SE",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 29,
                "name"       => "Bahia",
                "uf"       => "BA",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 31,
                "name"       => "Minas Gerais",
                "uf"       => "MG",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 32,
                "name"       => "Espírito Santo",
                "uf"       => "ES",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 33,
                "name"       => "Rio de Janeiro",
                "uf"       => "RJ",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 35,
                "name"       => "São Paulo",
                "uf"       => "SP",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 41,
                "name"       => "Paraná",
                "uf"       => "PR",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 42,
                "name"       => "Santa Catarina",
                "uf"       => "SC",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 43,
                "name"       => "Rio Grande do Sul",
                "uf"       => "RS",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 50,
                "name"       => "Mato Grosso do Sul",
                "uf"       => "MS",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 51,
                "name"       => "Mato Grosso",
                "uf"       => "MT",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 52,
                "name"       => "Goiás",
                "uf"       => "GO",
                "created_at" => $now,
                "updated_at" => $now,
            ], [
                "id"         => 53,
                "name"       => "Distrito Federal",
                "uf"       => "DF",
                "created_at" => $now,
                "updated_at" => $now,
            ],
        ]);
    }
}

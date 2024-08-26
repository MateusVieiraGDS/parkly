<?php

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    use SoftDeletes;
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('membros', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();


            $table->char('rg', 10)->unique();
            $table->char('cpf', 11)->unique();
            $table->date('nasc');
            $table->enum('sexo', ['MASCULINO', 'FEMININO']);
            $table->enum('estado_civil', ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO']);            
            $table->enum('situacao', ['ATIVO', 'INATIVO', 'FALECIDO'])->default("ATIVO");
            $table->enum('pendencia', ['SIM', 'NAO'])->default(("NAO"));

            $table->foreignId('rg_state_id')->references('id')->on('states');
            $table->foreignId('nat_state_id')->references('id')->on('states');
            $table->foreignId('nat_city_id')->references('id')->on('cities');

            $table->foreignId('file_cert_nascimento')->nullable()->references('id')->on('files');

            $table->foreignId('file_doc_image')->nullable()->references('id')->on('files');

            $table->foreignId('file_foto')->nullable()->references('id')->on('files');

            $table->foreignId('user_id')->unique()->references('id')->on('users');
            
            $table->foreignId('grupo_id')->nullable()->references('id')->on('grupos');

            $table->foreignId('congregacao_id')->references('id')->on('congregacoes');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membros');
    }
};

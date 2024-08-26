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
        Schema::create('consagracoes', function (Blueprint $table) {
            $table->id();
            $table->date('data_consagracao');
            $table->string('ministerio', 75)->nullable();

            $table->foreignId('membro_id')->references('id')->on('membros');

            $table->foreignId('cargo_id')->references('id')->on('cargos');            

            $table->foreignId('file_cert_consagracao')->nullable()->references('id')->on('files');

            $table->enum('situacao', ['ATIVO', 'INATIVO']);
            
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['membro_id', 'cargo_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consagracoes');
    }
};

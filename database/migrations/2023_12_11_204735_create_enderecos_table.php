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
        Schema::create('enderecos', function (Blueprint $table) {
            $table->id();

            $table->string('rua', 125);
            $table->integer('numero');
            $table->string('bairro', 125);
            $table->foreignId('city_id')->references('id')->on('cities');
            $table->foreignId('state_id')->references('id')->on('states');
            $table->string('complemento', 125)->nullable();
            $table->char('cep', 8);

            $table->foreignId('membro_id')->references('id')->on('membros');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enderecos');
    }
};

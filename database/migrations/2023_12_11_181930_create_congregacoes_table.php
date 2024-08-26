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
        Schema::create('congregacoes', function (Blueprint $table) {
            $table->id();

            $table->string('nome', 75)->unique();
            $table->string('rua', 125);
            $table->integer('numero');
            $table->string('bairro', 125);
            $table->string('cidade', 125);
            $table->char('uf', 2);
            $table->string('complemento', 125);
            $table->char('cep', 8);            

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('congregacoes');
    }
};

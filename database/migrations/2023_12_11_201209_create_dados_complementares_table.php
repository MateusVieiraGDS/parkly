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
        Schema::create('dados_complementares', function (Blueprint $table) {
            $table->id();

            $table->string('nome_pai', 75)->nullable();
            $table->string('nome_mae', 75)->nullable();
            $table->string('ministerio_anterior', 75)->nullable();

            $table->foreignId('membro_id')->unique()->references('id')->on('membros');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dados_complementares');
    }
};

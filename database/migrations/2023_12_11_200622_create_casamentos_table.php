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
        Schema::create('casamentos', function (Blueprint $table) {
            $table->id();

            $table->date('data_casamento');

            $table->foreignId('file_cert_casamento')->references('id')->on('files');

            $table->foreignId('file_cert_divorcio')->references('id')->on('files');

            $table->foreignId('file_cert_obito')->references('id')->on('files');

            $table->foreignId('membro_conjuge_1')->references('id')->on('membros');

            $table->foreignId('membro_conjuge_2')->references('id')->on('membros');

            $table->unique(['membro_conjuge_1', 'membro_conjuge_2']);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('casamentos');
    }
};

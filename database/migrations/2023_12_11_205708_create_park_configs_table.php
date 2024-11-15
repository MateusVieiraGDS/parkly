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
        Schema::create('park_configs', function (Blueprint $table) {
            $table->id();
            
            $table->integer('vagas')->unsigned();
            $table->decimal('valor_hora', 10, 2);
            $table->time('abertura');
            $table->time('fechamento');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('park_configs');
    }
};

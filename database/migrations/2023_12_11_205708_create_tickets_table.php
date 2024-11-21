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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            
            $table->decimal("valor_hora", 10, 2);
            
            $table->foreignId('car_id')->nullable();
            $table->foreign("car_id")->references('id')->on('cars');

            $table->foreignId('image_id')->nullable();
            $table->foreign("image_id")->references('id')->on('images');
            
            $table->foreignId('client_id')->nullable();
            $table->foreign("client_id")->references('id')->on('clients');

            $table->dateTime("saida")->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

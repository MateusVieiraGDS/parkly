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
        Schema::create('client_plates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('api_plate_id');
            $table->foreign("api_plate_id")->references('id')->on('api_plates');
            
            $table->foreignId('client_id');
            $table->foreign("client_id")->references('id')->on('clients');
            

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_plates');
    }
};

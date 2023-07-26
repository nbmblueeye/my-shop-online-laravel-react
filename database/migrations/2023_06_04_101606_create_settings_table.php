<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();

            $table->string('websiteName')->nullable();
            $table->string('websiteUrl')->nullable();
            $table->longText('websiteDescription')->nullable();
            $table->string('pageTitle')->nullable();
            $table->string('metaKeywords')->nullable();
            $table->string('metaDes')->nullable();

            $table->text('address')->nullable();
            $table->string('phoneNo1')->nullable();
            $table->string('phoneNo2')->nullable();
            $table->string('emailNo1')->nullable();
            $table->string('emailNo2')->nullable();

            $table->string('facebook')->nullable();
            $table->string('twitter')->nullable();
            $table->string('instagram')->nullable();
            $table->string('youtube')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};

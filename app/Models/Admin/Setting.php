<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $table = 'settings';
    protected $fillable = [
        'websiteName',
        'websiteUrl',
        'websiteDescription',
        'pageTitle',
        'metaKeywords',
        'metaDes',
        'address',
        'phoneNo1',
        'phoneNo2',
        'emailNo1',
        'emailNo2',
        'facebook',
        'twitter',
        'instagram',
        'youtube',
    ];

    protected $visible = [
        'websiteName',
        'websiteUrl',
        'websiteDescription',
        'pageTitle',
        'metaKeywords',
        'metaDes',
        'address',
        'phoneNo1',
        'phoneNo2',
        'emailNo1',
        'emailNo2',
        'facebook',
        'twitter',
        'instagram',
        'youtube',
    ];
}

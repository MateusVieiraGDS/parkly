<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

trait UploadTrait
{    
    private function upload(UploadedFile $file, $path = '', $disk = 'do', $visibility = 'public'): string|false
    {
        $path = !empty($path) ? $path : $this->folder();
        if( $visibility === 'private') {
            return $file->store($path, $disk);
        }
        return $file->storePublicly($path, $disk);
    }

    private function deleteFile(string $path = null, $disk = 'do'): bool
    {
        if (empty($path) || $path == null) {
            return false;
        }
        if (Storage::disk($disk)->exists("{$this->folder()}/{$path}")) {
            Storage::disk($disk)->delete("{$this->folder()}/{$path}");
            return true;
        }
        return false;
    }

    private function folder()
    {
        return "folder_back_adtoyama";
    }
}
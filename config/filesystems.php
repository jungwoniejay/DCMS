<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application for file storage.
    |
    | On Railway, the filesystem is ephemeral — all files written to local
    | storage are lost on every redeploy. Set FILESYSTEM_DISK=s3 in your
    | Railway environment variables and configure the AWS_* variables below
    | to persist uploaded files (profile pictures, enrollment photos, etc.)
    | in S3 or an S3-compatible service such as Cloudflare R2.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Below you may configure as many filesystem disks as necessary, and you
    | may even configure multiple disks for the same driver. Examples for
    | most supported storage drivers are configured here for reference.
    |
    | Supported drivers: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],

        /*
        |----------------------------------------------------------------------
        | S3 / Cloudflare R2 Disk
        |----------------------------------------------------------------------
        |
        | Required Railway environment variables:
        |
        |   FILESYSTEM_DISK=s3
        |   AWS_ACCESS_KEY_ID=your-access-key-id
        |   AWS_SECRET_ACCESS_KEY=your-secret-access-key
        |   AWS_DEFAULT_REGION=ap-southeast-1        (or your bucket's region)
        |   AWS_BUCKET=your-bucket-name
        |   AWS_URL=https://your-bucket.s3.ap-southeast-1.amazonaws.com
        |
        | For Cloudflare R2 (S3-compatible, no egress fees), use:
        |
        |   AWS_ACCESS_KEY_ID=<R2 Access Key ID>
        |   AWS_SECRET_ACCESS_KEY=<R2 Secret Access Key>
        |   AWS_DEFAULT_REGION=auto
        |   AWS_BUCKET=your-r2-bucket-name
        |   AWS_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
        |   AWS_URL=https://pub-<hash>.r2.dev              (public bucket URL)
        |   AWS_USE_PATH_STYLE_ENDPOINT=true
        |
        | Make sure the bucket (or R2 bucket) has public read access enabled
        | so that uploaded images can be served directly to browsers.
        |
        */

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'visibility' => 'public',
            'throw' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Here you may configure the symbolic links that will be created when the
    | `storage:link` Artisan command is executed. The array keys should be
    | the locations of the links and the values should be their targets.
    |
    | Note: symbolic links are only relevant for the local "public" disk.
    | When FILESYSTEM_DISK=s3, files are served directly from S3/R2 and
    | the storage:link step is not required.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];

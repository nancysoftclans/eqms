<?php

return [

    //for passport clients
    'client_id' => env('PASSPORT_CLIENT_ID', 2),
    'client_secret' => env('PASSPORT_CLIENT_SECRET', 7),
    
    //security
    'encryption_key' => 'ERxNN4ZsK3w4X9ceFZM8DMCUMwV2qYrcHReWy2AJ',
    'encryption_iv' => 'Xs12tr7jK/q2d*W$',
    'openssl_encryption_algo' => 'aes-256-cbc',

    //dms
    'dms' => [
        'dms_adminusr' => env('DMS_ADMINUSR', 'admin'),
        'dms_adminpassword' => env('DMS_ADMINPASSWORD', 'Da97vid27'),
        'dms_url' => env('DMS_URL', 'http://localhost:8080/alfresco/'),
        'dms_approotsite' => env('DMS_APPROOTSITE', 'bomra'),
        'dms_approotsitecontainer' => env('DMS_APPROOTSITECONTAINER', 'bomra'),
        'dms_approotsitecontainernode' => env('DMS_APPROOTSITECONTAINERNODE', 'documentLibrary'),
        'dms_approotsite_id' => env('DMS_APPROOTSITE_ID', 1),
        'doc_rootupload' => env('DOC_ROOTUPLOAD', '/public/resources/upload/'),
        'upload_directory' => env('UPLOAD_DIRECTORY'),
        'upload_url' => env('UPLOAD_URL'),
        'system_uploaddirectory' => env('SYSTEM_UPLOADDIRECTORY'),
        'system_uploadurl'=> env('SYSTEM_UPLOADURL'),
    ],
    'esign' => [
        'base_url' => 'https://testbrimsesign.bomra.co.bw/public/api',
		'certificate' => storage_path('esgin_ssl/bomrabw.crt'),
		'cert_key' => storage_path('esgin_ssl/BoMRARSA.key'),
		'web_url' =>'https://testbrimsesign.bomra.co.bw',
    ],
    'jasper' => [
        'jasper_server_url' => env('JASPER_SERVER_URL', 'http://10.0.0.12:8080/jasperserver'),
        'jasper_server_username' => env('JASPER_SERVER_USERNAME', 'jasperadmin'),
        'jasper_server_password' => env('JASPER_SERVER_PASSWORD', 'jasperadmin'),
        'reports_baseurl' => env('REPORTS_BASEURL', 'jasperadmin'),

    ]

];

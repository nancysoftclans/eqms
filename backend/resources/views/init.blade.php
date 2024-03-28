<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}"/>
    <link rel="shortcut icon" href="{{asset('resources/images/favicon.ico')}}">
    <link rel="stylesheet" type="text/css" href="{{asset('resources/css/toastr.css')}}"/>
    <link rel="stylesheet" type="text/css" href="{{asset('resources/css/custom.css')}}"/>

    <title><?php echo $system_name; ?></title>
</head>
<body>
    <audio id="notithi" src="tone.mp3" preload="auto"></audio>
<script type="text/javascript">
    var token = document.querySelector('meta[name="csrf-token"]').content;
    //var token = '';
    var is_logged_in = '<?php echo $is_logged_in; ?>';
    var force_password_change = '<?php echo $force_password_change; ?>';
    var report_server_url = '<?php echo $report_server_url; ?>';
    var is_reset_pwd = '<?php echo $is_reset_pwd; ?>';
    var user_id = '<?php echo $user_id; ?>';
    var title_id = '<?php echo $title_id; ?>';
    var gender_id = '<?php echo $gender_id; ?>';
    var profile_pic_url = '<?php echo $profile_pic_url; ?>';
    var first_name = '<?php echo $first_name; ?>';
    var last_name = '<?php echo $last_name; ?>';
    var fullnames = '<?php echo $title . ' ' . $first_name . ' ' . $last_name; ?>';
    var base_url = '<?php echo $base_url; ?>'+'/';
    var upload_directory =  '<?php echo $upload_directory; ?>';
    var user_role_description = '<?php echo $access_point . ' - ' . $role; ?>';
    var email_address = '<?php echo $email; ?>';
    var phone_number = '<?php echo $phone; ?>';
    var mobile_number = '<?php echo $mobile; ?>';
    var guid = '<?php echo $guid; ?>';
    var dms_url = '<?php echo $base_url . '/mis_dms/'; ?>';

    var system_name = '<?php echo $system_name; ?>';
    var organisation_full_name = '<?php echo $organisation_full_name; ?>';
    var org_abr_name = '<?php echo $org_abr_name; ?>';
    var ministry_name = '<?php echo $ministry_name; ?>';
    var access_token = '<?php echo $access_token; ?>';
    var system_dashboard = '<?php echo $system_dashboard; ?>';
    var scheduledtcmeeting_counter = '<?php echo  $scheduledtcmeeting_counter; ?>';
    var notifications_counter = '<?php echo $notifications_counter; ?>';
    var last_login ='<?php echo $last_login; ?>';
    var refreshTimer = '<?php echo $refreshTimer; ?>';
    var prevhash = window.location.hash.substring(1);
    var tracking_no = '';
    var esign_url = '<?php echo $esign_url; ?>';
    var Ext = Ext || {}; // Ext namespace won't be defined yet...
    

    // This function is called by the Microloader after it has performed basic
    // device detection. The results are provided in the "tags" object. You can
    // use these tags here or even add custom tags. These can be used by platform
    // filters in your manifest or by platformConfig expressions in your app.
    //
    Ext.beforeLoad = function (tags) {
        var s = location.search,  // the query string (ex "?foo=1&bar")
            profile;

        // For testing look for "?classic" or "?modern" in the URL to override
        // device detection default.
        //
        if (s.match(/\bclassic\b/)) {

        } else if (s.match(/\bmodern\b/)) {
            profile = 'modern';
        }
        // uncomment this if you have added native build profiles to your app.json
        /*else if (tags.webview) {
            if (tags.ios) {
                profile = 'ios';
            }
            // add other native platforms here
        }*/
        else {
            //profile = tags.desktop ? 'classic' : 'modern';
            profile = tags.phone ? 'modern' : 'classic';
        }
        profile = 'classic';
        Ext.manifest = profile; // this name must match a build profile name

        // This function is called once the manifest is available but before
        // any data is pulled from it.
        //
        //return function (manifest) {
        // peek at / modify the manifest object
        //};
    };
</script>
<div class="loader"><img src="resources/images/eqms-logo.png"></div>
<script type="text/javascript" src="{{asset('resources/js/jquery-3.6.0.min.js')}}"></script>
<script type="text/javascript" src="{{asset('resources/js/toastr.js')}}"></script>
<script type="text/javascript" src="{{asset('resources/js/resumable.min.js')}}"></script>

<!-- The line below must be kept intact for Sencha Cmd to build your application -->
<script id="microloader" type="text/javascript" src="{{asset('bootstrap.js')}}"></script>

</body>
</html>

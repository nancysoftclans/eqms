<?php
/**
 * Created by PhpStorm.
 * Time: 2:43 PM
 */

namespace App\Helpers;

use App\Jobs\GenericSendEmailJob;
use App\Jobs\GenericAttachmentSendEmailJob;
use App\Jobs\GenericMultipleAttachmentsSendEmailJob;
use App\Mail\AccountActivation;
use App\Mail\GenericPlainMail;
use App\Mail\GenericAttachmentMail;
use App\Mail\GenericMultipleAttachmentsMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\ForgotPassword;
use Illuminate\Support\Carbon;

class EmailHelper
{

    static function getEmailTemplateInfo($template_id, $vars)
    {
        $template_info = DB::table('par_email_messages_templates')
            ->where('id', $template_id)
            ->first();
        if (is_null($template_info)) {
            $template_info = (object) array(
                'subject' => 'Error',
                'body' => 'Sorry this email was delivered wrongly, kindly ignore.'
            );
        }
        $template_info->subject = strtr($template_info->subject, $vars);
        $template_info->body = strtr($template_info->body, $vars);
        return $template_info;
    }

    static function onlineApplicationNotificationMail($template_id, $email, $vars, $identification_no)
    {
        $template_info = self::getEmailTemplateInfo($template_id, $vars);
        $subject = $template_info->subject;
        $message = $template_info->body;
        //email notofications 

        //Mail::to($email)->send(new GenericPlainMail($subject, $message));
        $emailJob = (new GenericSendEmailJob($email, $subject, $message))->delay(Carbon::now()->addSeconds(5));
        dispatch($emailJob);

        //the details 
        if (validateIsNumeric($identification_no)) {
            //insert data 
            $data = array(
                'identification_no' => $identification_no,
                'subject' => $subject,
                'message' => $message,
                'sent_on' => Carbon::now(),
                'is_read' => 0
            );

            insertRecord('wb_appnotification_details', $data, '', 'portal_db');

        }
    }

    static function forgotPasswordEmail($template_id, $email, $link, $vars)
    {
        $template_info = self::getEmailTemplateInfo($template_id, $vars);
        $subject = $template_info->subject;
        $message = $template_info->body;
        Mail::to($email)->send(new ForgotPassword($subject, $message, $link));
        if (count(Mail::failures()) > 0) {
            $res = array(
                'success' => false,
                'message' => 'Problem was encountered while sending email. Please try again later!!'
            );
        } else {
            $res = array(
                'success' => true,
                'message' => 'Password reset instructions sent to your email address!!'
            );
        }
        return $res;
    }

    static function accountRegistrationEmail($template_id, $email, $password, $link, $vars)
    {
        $template_info = self::getEmailTemplateInfo($template_id, $vars);
        $subject = $template_info->subject;
        $message = $template_info->body;
        // if (str_contains(strtolower($email), 'bomra')) {
        Mail::to(strtolower($email))->send(new AccountActivation($subject, $message, $email, $password, $link));

        if (count(Mail::failures()) > 0) {
            $res = array(
                'success' => false,
                'message' => 'Problem was encountered while sending email. Please try again later!!'
            );
        } else {
            $params = array(
                'email_to' => $email,
                'subject' => $subject,
                'message' => $message,
                'exception' => 'All went well',
                'created_on' => Carbon::now()
            );

            DB::table('tra_email_notifications')
                ->insert($params);
            $res = array(
                'success' => true,
                'message' => 'Account registration instructions sent to your email address!!'
            );
        }

        $res = array(
            'success' => true,
            'message' => 'Account registration instructions sent to your email address!!'
        );
        return $res;
        // }
    }

    static function applicationInvoiceEmail($template_id, $email, $vars, $report, $attachment_name)
    {
        $template_info = self::getEmailTemplateInfo($template_id, $vars);
        $subject = $template_info->subject;
        $message = $template_info->body;
        if (str_contains(strtolower($email), 'bomra')) {
            Mail::to($email)->send(new GenericAttachmentMail($subject, $message, $report, $attachment_name));
            // return Mail::failures();

            return true;
        }

    }

    static function applicationPermitEmail($template_id, $email, $vars, $permit_report, $certificate_report)
    {
        $template_info = self::getEmailTemplateInfo($template_id, $vars);
        $subject = $template_info->subject;
        $message = $template_info->body;
        //Mail::to($email)->send(new GenericMultipleAttachmentsMail($subject, $message, $permit_report, $certificate_report));
        $emailJob = (new GenericMultipleAttachmentsSendEmailJob($email, $subject, $message, $permit_report, $certificate_report))->delay(Carbon::now()->addSeconds(5));
        dispatch($emailJob);
    }
    static function sendMailNotification($trader_name, $to, $subject, $email_content, $cc, $bcc, $attachement, $attachement_name, $template_id, $vars)
    {
        $from_email = Config('constants.mail_from_address');
        if (validateIsNumeric($template_id)) {
            $template_info = self::getEmailTemplateInfo($template_id, $vars);
            $subject = $template_info->subject;
            $email_content = $template_info->body;
        }
        $data = array(
            'subject' => $subject,
            'email_content' => $email_content,
            'trader_name' => $trader_name,
            'from_email' => $from_email,
            'to' => $to,
            'title' => $subject
        );
        //cleaning address
        $to = str_replace(' ', '', $to);
        $bcc = str_replace(' ', '', $bcc);
        $cc = str_replace(' ', '', $cc);
        //expode
        if ($to != '') {
            $to = explode(';', $to);
        }
        if ($bcc != '') {
            $bcc = explode(';', $bcc);
        }
        if ($cc != '') {
            $cc = explode(';', $cc);
        }

        //send mail
        Mail::send('emailnotification', $data, function ($message) use ($to, $trader_name, $subject, $cc, $bcc, $attachement, $attachement_name) {
            if ($bcc != '') {
                $message->bcc($bcc, $trader_name)
                    ->subject($subject);
            } else if ($cc) {
                $message->to($to, $trader_name)
                    ->cc($cc)
                    ->subject($subject);
            } else {
                $message->to($to, $trader_name)
                    ->subject($subject);
            }
            if ($attachement != '') {
                $message->attach($attachement, [
                    'as' => $attachement_name . '.pdf',
                    'mime' => 'application/pdf',
                ]);
            }


        });

        if (Mail::failures()) {
            $data = array('success' => false, 'message' => 'Email submission failed, contact system admin for further guidelines');
        } else {
            $data = array('success' => true, 'message' => 'Email Sent successfully');
        }
        return $data;
        return true;
    }

    static function SendMailQueue($email, $subject, $message)
    {
        $emailJob = (new GenericSendEmailJob($email, $subject, $message))->delay(Carbon::now()->addSeconds(5));
        dispatch($emailJob);
    }

    //indicated mail from
    static function sendMailFromNotification($trader_name, $to, $subject, $email_content, $from, $cc)
    {

        $from_email = $from;

        $data = array(
            'subject' => $subject,
            'email_content' => $email_content,
            'trader_name' => $trader_name,
            'from_email' => $from_email,
            'to' => $to,
            'title' => $subject
        );
        // //cleaning address
        // if($cc!=''){
        //     $cc = str_replace(' ', '', $cc);
        //     //expode
        //     $cc = explode(',',$cc);
        // }else{
        //     $cc = '';
        // }
        $emailJob = (new GenericSendEmailJob($to, $subject, $email_content, $cc))->delay(Carbon::now()->addSeconds(2));
        dispatch($emailJob);
        //send mail
        // Mail::send('emailnotification', $data, function($message)use ($to,$trader_name,$subject,$cc,$from_email) {
        //     if($cc!=''){
        //         $message->to($to, $trader_name)
        //                 ->cc($cc)
        //                 ->subject($subject);
        //     }
        //     else{
        //         $message->to($to, $trader_name)
        //                 ->subject($subject);
        //     }

        // });
        $data = array('success' => true, 'message' => 'Email Sent successfully');
        // if (Mail::failures()) {
        //     $data = array('success'=>false, 'message'=>'Email submission failed, contact system admin for further guidelines');
        // }
        // else{
        //     $data = array('success'=>true, 'message'=>'Email Sent successfully');
        // }
        return $data;
    }

    static function sendTemplatedApplicationNotificationEmail($template_id, $email, $vars)
    {

        $template_info = self::getEmailTemplateInfo($template_id, $vars);
        $subject = $template_info->subject;
        $message = $template_info->body;
        //dd($message);
        //email notofications job creation
        $emailJob = (new GenericSendEmailJob($email, $subject, $message))->delay(Carbon::now()->addSeconds(2));
        dispatch($emailJob);


    }
    //mails for expiry notification
    static function applicationExpiryNotificationMail($template_id, $email, $vars, $applicant_id)
    {

        $template_info = self::getEmailTemplateInfo($template_id, $vars);
        $subject = $template_info->subject;
        $message = $template_info->body;

        //email notofications job creation
        $emailJob = (new GenericSendEmailJob($email, $subject, $message))->delay(Carbon::now()->addSeconds(2));
        dispatch($emailJob);


    }
    static function sendInvitationMail($template_id, $participantEmail, $vars)
    {
        $date = Carbon::parse($vars['{date_requested}']);
        $time = Carbon::parse($vars['{meeting_time}']);
        $from = Carbon::createFromFormat('Y-m-d H:i', $date->format('Y-m-d') . $time->format('H:i'));
        $to = Carbon::createFromFormat('Y-m-d H:i', $date->format('Y-m-d') . $time->format('H:i'));
        $template_info = self::getEmailTemplateInfo($template_id, $vars);
        $subject = $template_info->subject;
        $body = $template_info->body;
        $data = array(
            'subject' => $subject,
            'email_content' => $body,
            'trader_name' => 'mwangi',
            'from_email' => 'me@gmail.com',
            'to' => $participantEmail,
            'title' => $subject,
            'start_date' => $from
        );
        // $link = Link::create($vars['{meeting_name}'], $from, $to)
        //     ->description($vars['{app_description}'])
        //     ->address($vars['{meeting_venue}']);


        // // $emailJob = (new GenericSendEmailJob($participantEmail, $subject, $message))->attachData($link->ics(), 'invite.ics', [
        //         //     'mime' => 'text/calendar;charset=UTF-8;method=REQUEST',
        //         // ])->delay(Carbon::now()->addSeconds(2));
        //  Mail::send('emailnotification', $data, function($message)use ($participantEmail, $subject, $body, $link) {

        //          $message->to($participantEmail, 'RUN')
        //                 ->subject($subject);
        //          $message->attach($link->ics(), [
        //             'as'=> 'invite.ics',
        //             'mime' => 'text/calendar;charset=UTF-8;method=REQUEST',
        //         ]);
        //      }


        //     );


        //  dispatch($emailJob);
        //working on google calender
        // Mail::send('emailnotification', $data, function($message) use($data)
        //     {
        //         $filename = "invite.ics";
        //         $meeting_duration = (3600 * 2); // 2 hours
        //         $meetingstamp = strtotime( $data['start_date'] . " UTC");
        //         $dtstart = gmdate('Ymd\THis\Z', $meetingstamp);
        //         $dtend =  gmdate('Ymd\THis\Z', $meetingstamp + $meeting_duration);
        //         $todaystamp = gmdate('Ymd\THis\Z');
        //         $uid = date('Ymd').'T'.date('His').'-'.rand().'@bomra.co.bw';
        //         $description = strip_tags($data['to']);
        //         $location = "video conference";
        //         $titulo_invite = "Your meeting title";
        //         $organizer = "CN=Organizer name:onesmas.kungu@softclans.co.ke";

        //         // ICS
        //         $mail[0]  = "BEGIN:VCALENDAR";
        //         $mail[1] = "PRODID:-//Google Inc//Google Calendar 70.9054//EN";
        //         $mail[2] = "VERSION:2.0";
        //         $mail[3] = "CALSCALE:GREGORIAN";
        //         $mail[4] = "METHOD:REQUEST";
        //         $mail[5] = "BEGIN:VEVENT";
        //         $mail[6] = "DTSTART;TZID=America/Sao_Paulo:" . $dtstart;
        //         $mail[7] = "DTEND;TZID=America/Sao_Paulo:" . $dtend;
        //         $mail[8] = "DTSTAMP;TZID=America/Sao_Paulo:" . $todaystamp;
        //         $mail[9] = "UID:" . $uid;
        //         $mail[10] = "ORGANIZER;" . $organizer;
        //         $mail[11] = "CREATED:" . $todaystamp;
        //         $mail[12] = "DESCRIPTION:" . $description;
        //         $mail[13] = "LAST-MODIFIED:" . $todaystamp;
        //         $mail[14] = "LOCATION:" . $location;
        //         $mail[15] = "SEQUENCE:0";
        //         $mail[16] = "STATUS:CONFIRMED";
        //         $mail[17] = "SUMMARY:" . $titulo_invite;
        //         $mail[18] = "TRANSP:OPAQUE";
        //         $mail[19] = "END:VEVENT";
        //         $mail[20] = "END:VCALENDAR";

        //         $mail = implode("\r\n", $mail);
        //         header("text/calendar");
        //         file_put_contents($filename, $mail);

        //         $message->subject($data['subject']);
        //         $message->to($data['to']);
        //         $message->attach($filename, array('mime' => "text/calendar"));
        //     });
        // $from = DateTime::createFromFormat('Y-m-d H:i', '2018-02-01 09:00');
        // $to = DateTime::createFromFormat('Y-m-d H:i', '2018-02-01 18:00');




        $link = Link::create('Sebastian’s birthday', $from, $to)
            ->description('Cookies & cocktails!')
            ->address('Kruikstraat 22, 2018 Antwerpen');
        //create file
        $filename = "invite.ics";
        file_put_contents($filename, $link->ics());
        //send
        Mail::send('emailnotification', $data, function ($message) use ($participantEmail, $subject, $body, $link, $filename) {

            $message->to($participantEmail)
                ->subject($link->webOutlook());
            $message->attach($link->webOutlook(), array('as' => 'schedule.ics', 'mime' => 'data:text charset=utf8'));
        });
    }
    static function notifyGroupUsers($template_id, $workflow_stage_id, $vars)
    {
        $template_info = self::getEmailTemplateInfo($template_id, $vars);
        $subject = $template_info->subject;
        $message = $template_info->body;

        //email notofications job creation
        //get users
        $users = DB::table('wf_stages_groups as t1')
            ->join('tra_user_group as t2', 't1.group_id', 't2.group_id')
            ->join('users as t3', 't2.user_id', 't3.id')
            ->select('t3.email')
            ->where('t1.stage_id', $workflow_stage_id)
            ->get();
        foreach ($users as $user) {
            $emailJob = (new GenericSendEmailJob($user->email, $subject, $message))->delay(Carbon::now()->addSeconds(2));
            dispatch($emailJob);
        }

    }


}
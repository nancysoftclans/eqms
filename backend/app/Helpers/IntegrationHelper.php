<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use Carbon\Carbon;
use GuzzleHttp\Client as Client;
use GuzzleHttp\Psr7;
use GuzzleHttp\RequestOptions;
use GuzzleHttp\Exception\RequestException;
// use \CurlFile;
// use App\User;
use Illuminate\Http\Request;

class IntegrationHelper
{
    static function loginToEsign(){
        try{
           $url = Config('constants.esign.base_url');
           $client = new Client([
                'base_uri' => Config('constants.esign.base_url'),
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json'
                ],
				'verify' => Config('constants.esign.certificate')
            ]); 
            $res = $client->request('POST', $url.'/authentication/onUserLogin', [
                'exceptions' => false,
                'form_params' => [
                    'email' => 'kunguadvert@gmail.com',
                    'password' => '4oOWYyDn',
                ],
				'verify' => Config('constants.esign.certificate'),
				'cert' => Config('constants.esign.certificate'),
				'ssl_key' => Config('constants.esign.cert_key')
            ]);
    
            $success = false;

            if ($res->getStatusCode() == 200) {
                $res->getBody()->rewind();
                $response = json_decode((string)$res->getBody());
				if(!isset($response->access_token)){
					return array('success' =>  $response->success, 'message' => $response->message);
				}
                $data = array('success' => true, 'message' => $response->message, 'access_token' => $response->access_token);
                //session setup
                

            } else if ($res->getStatusCode() == 403) {
                $res->getBody()->rewind();

                $response = json_decode((string)$res->getBody());

                $data = array('success' => $success, 'message' => $response->message);

            } else {
                $response = json_decode((string)$res->getBody());

                $data = array('success' => false, 'user_id' => $response->message);

            }

        } catch (RequestException $e) {

            if ($e->hasResponse()) {
                $response_msg = $e->getMessage();
                $response = json_encode($response_msg);

                $data = array('success' => false, 'message' => $response);

            } else {
                $data = array('success' => false, 'message' => 'Check DMS Connection.');

            }
        }

        return $data;
    }
    static function postRequest($data){
        try{
            $auth = self::loginToEsign();
            if(isset($auth['access_token'])){
                $url = Config('constants.esign.base_url');
                $client = new Client([
                    'base_uri' => Config('constants.esign.base_url'),
                    'headers' => [
                        'Accept' => 'application/json',
                        'Content-Type' => 'application/json',
                    ],
					'verify' => Config('constants.esign.certificate')
                ]);
                $res = $client->request('POST', $url.'/integration/receiveSignRequest', [
                    'exceptions' => false,
                    'headers' => [
                        'Accept' => 'application/json',
                        'Content-Type' => 'application/json',
                        'Authorization' => 'Bearer '.$auth['access_token'],
                    ],
                    'query' => $data,
					'verify' => Config('constants.esign.certificate')
					
                ]);
        
                $success = false;

                if ($res->getStatusCode() == 200) {
                    $res->getBody()->rewind();
                    $response = json_decode((string)$res->getBody());
                    $data = array('success' => $response->success, 'message' => $response->message);
                    //session setup
                    

                } else if ($res->getStatusCode() == 403) {
                    $res->getBody()->rewind();

                    $response = json_decode((string)$res->getBody());

                    $data = array('success' => $success, 'message' => $response->message);

                } else {
                    $response = json_decode((string)$res->getBody());

                    $data = array('success' => false, 'user_id' => $response->message);

                }
            }else{
                $data = array('success'=>false, 'message'=>'Esigner Unreachable');
            }

        } catch (RequestException $e) {

            if ($e->hasResponse()) {
                $response_msg = $e->getMessage();
                $response = json_encode($response_msg);

                $data = array('success' => false, 'message' => $response);

            } else {
                $data = array('success' => false, 'message' => 'Check Esigner Connection.');

            }
        }

        return $data;
    }

}

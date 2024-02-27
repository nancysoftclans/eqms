<?php

namespace App\Helpers;

use NoProtocol\Encryption\MySQL\AES\Crypter;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Encryption\Encrypter;

class SecurityHelper
{
    public static function getDecryptFunParams(){
        return "'".Config('constants.encryption_key')."','".Config('constants.encryption_iv')."'";
    }
    static function getEncryptionSecrets(){
        $params = array(
            'key' => Config('constants.encryption_key'),
            'iv' => Config('constants.encryption_iv'),
            'openssl_encryption_algo' => Config('constants.openssl_encryption_algo')
        );
        if($params['key'] == 'none' || $params['iv'] == 'none' || $params['openssl_encryption_algo'] == 'none'){
            dd("Encryption params are not set");
        }else{
            return $params;
        }
    }
    static function funcEncrypt($plainText){
        try {
            //pure algoritm
           $enc_secrets = self::getEncryptionSecrets();
           $encrypted = openssl_encrypt($plainText, $enc_secrets['openssl_encryption_algo'], $enc_secrets['key'], 0,$enc_secrets['iv']);
            return ($encrypted);
        } catch (Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 1, "Encryption Algorithm Failure", "Encrypt Global Function", \Auth::user()->id);
        }
    }
    static function funcDecrypt($val){
        try {
            $original_val = $val;
            $enc_secrets = self::getEncryptionSecrets();
            if (self::is_base64_encoded($val) == true || self::is_base64_encoded($val) == 'true' || self::is_base64_encoded($val) == 1 || self::is_base64_encoded($val) == '1') {
                //$val = base64_decode($val);
                $decrypted =  openssl_decrypt($val, $enc_secrets['openssl_encryption_algo'], $enc_secrets['key'], 0,$enc_secrets['iv']);
                if ($decrypted == '') {
                    return $original_val;
                }
                $valid_encoding = mb_check_encoding($decrypted, 'UTF-8');//check if malformed for the specified encoding
                if ($valid_encoding == false) {
                    return $original_val;
                }
                return $decrypted;
            }
            return $original_val;

        } catch (Exception $exception) {
             $res = sys_error_handler($exception->getMessage(), 1, "decryption Algorithm Failure", "Decrypt Global Function", \Auth::user()->id);
        }
    }

    static function encryptArray($array, $skip = array())
    {
        $return_array = array();
        foreach ($array as $key => $value) {
            if (in_array($key, $skip)) {
                $return_array[$key] = $value;
            } else {
                $return_array[$key] = funcEncrypt($value);
            }
        }
        return $return_array;
    }

    static function decryptArray($arrays)
    {
        $new_array = array();
        foreach ($arrays as $value) {
            foreach ($value as $nested_key => $nested_value) {
                if ($nested_value == '' || $nested_value == null || $nested_value == NULL || $nested_value == ' ' || $nested_value == " " || $nested_key == 'uuid') {
                    $value [$nested_key] = '';
                } else {
                    $value [$nested_key] = self::funcDecrypt($nested_value);
                }
            }
            $new_array [] = $value;
        }
        return $new_array;
    }

    static function decryptSimpleArray($array)
    {
        $new_array = array();
        foreach ($array as $key => $value) {
            $new_array[$key] = self::funcDecrypt($value);
        }
        return $new_array;
    }

    static function is_base64_encoded($data)
    {
        if (is_numeric($data)) {
            return false;
        }
        try {
            $decoded = base64_decode($data, true);
            if (base64_encode($decoded) === $data) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            // If exception is caught, then it is not a base64 encoded string
            return false;
        }
    }
    static function decryptUserCollection($userCol){

        foreach ($userCol as $user) {
            $user->first_name = funcDecrypt($user->first_name);
            $user->last_name = funcDecrypt($user->last_name);
            $user->mobile = funcDecrypt($user->mobile);
            $user->phone = funcDecrypt($user->phone);
            $user->fullnames = $user->first_name. ' '. $user->last_name;

        }
        return $userCol;
    }

}

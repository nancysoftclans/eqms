<?php

namespace App\Helpers;

class AuthHelper
{

    static function generateUniqID()
    {
        //generate a random unique string thats stron crptographically
        $uuid = bin2hex(random_bytes(12));
        return $uuid;
    }

    static function generatePwdSaltOnRegister($username)
    {
        $uuid = self::generateUniqID();
        $salt = sha1($username . $uuid);
        return $salt;
    }

    static function generatePwdSaltOnLogin($username, $uuid)
    {
        $salt = sha1($username . $uuid);
        return $salt;
    }

    static function hashPwd($username, $uuid, $pwd)
    {
        $salt=self::generatePwdSaltOnLogin($username, $uuid);
        $hashed_pwd = crypt($pwd,"$6$".$salt);
        return $hashed_pwd;
    }

    static function hashPwdOnRegister($username, $pwd)
    {
        $salt=self::generatePwdSaltOnRegister($username);
        $hashed_pwd = crypt($pwd,"$6$".$salt);
        return $hashed_pwd;
    }

    static function hashPwdOnLogin($username, $uuid, $pwd)
    {
        $salt=self::generatePwdSaltOnLogin($username, $uuid);
        $hashed_pwd = crypt($pwd,"$6$".$salt);
        return $hashed_pwd;
    }
}
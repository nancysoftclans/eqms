Ext.define('Admin.view.authentication.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',

    //TODO: implement central Facebook OATH handling here

    onFaceBookLogin : function() {
        this.redirectTo('dashboard', true);
    },

    onLoginButton: function(btn) {
        var form = btn.up('form'),
            name = form.up('window'),
            frm = form.getForm(),
            me = this;
        if (frm.isValid()) {
            frm.submit({
                dataType: 'JSON',
                url: base_url+'login',
                method: 'POST',
                waitTitle: 'Connecting',
                waitMsg: 'Authenticating Credentials...',
                headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Accept': 'application/json'
                    },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        message = response.message,
                        success = response.success;
                    if(success){
                        var user = response.user,
                            token = response.token;

                        // Ext.state.Manager.set('user', {
                        //       first_name: user.name,
                        //       access_token: token
                        //     });

                        // me.redirectTo('dashboard', true);

                        toastr.success(message, "Logged In!!");

                        setTimeout(function () {
                            location.reload();
                        }, 100);

                    }else{
                        toastr.success(message, "Authentication Failed!!");
                    }
                        
                },
                failure: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        message = response.message,
                        status = action.response.status;
                    toastr.error(message, 'Failure Response');
                    if (status == 400) {
                        // toastr.error('Reload page', 'Your ');
                    }
                    if (action.failureType == 'server') {
                        //toastr.error(message, 'Login failed!');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        }else{ 
             toastr.error('Error check the form', 'Error Response');
        }
        
    },

    onLoginAsButton: function() {
        this.redirectTo('login', true);
    },

    onNewAccount:  function() {
        this.redirectTo('register', true);
    },

    onSignupClick:  function() {
        this.redirectTo('dashboard', true);
    },

    onResetClick:  function() {
        this.redirectTo('dashboard', true);
    },
    onResetPasswordClick: function (item) {
        var loginwin = this.getView().up().down('#loginFormItemid');
            logoutwin = this.getView().up().down('#logoutFormItemid');

        loginwin.setVisible(false);     
        logoutwin.setVisible(true);
    },
    onLoginClick: function () {
        var loginwin = this.getView().up().down('#loginFormItemid');
            logoutwin = this.getView().up().down('#logoutFormItemid');

        loginwin.setVisible(true);     
        logoutwin.setVisible(false);
    },
    updatePassword: function (btn) {
        var me = this,
            form = btn.up('form'),
            frm = form.getForm(),
            win = form.up('window');
        if (frm.isValid()) {
            frm.submit({
                dataType: 'JSON',
                url: 'usermanagement/changeUserPassword',
                method: 'POST',
                waitTitle: 'updating',
                waitMsg: 'Updating Password...',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        message = response.message;

                    toastr.success(message, "Success Response");
                   win.close();;
                },
                failure: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        message = response.message;
                    if (action.failureType == 'server') {
                        toastr.error(message, 'Failure Response!');
                        //Ext.Msg.alert('Login failed!', 'Login data is incorrect!');
                    } else {
                        toastr.error('Error!', 'The authentication server is not responding : ' + action.response.responseText);
                        //Ext.Msg.alert('Warning!', 'The authentication server is not responding : ' + action.response.responseText);
                    }

                    //frm.reset();
                }
            });
        }else{ 
             toastr.error('Error check the form', 'Error Response');
        }
    },
    onResetPwdClick: function (btn) {
        var me = this,
            form = btn.up('form'),
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                dataType: 'JSON',
                url: 'recoverForgotPassword',
                method: 'POST',
                waitTitle: 'Connecting',
                waitMsg: 'Sending email link...',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        message = response.message;
                    toastr.success(message, "Success Response");
                    setTimeout(function () {
                        me.onLoginClick();
                    }, 50);
                },
                failure: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        message = response.message;
                    if (action.failureType == 'server') {
                        toastr.error(message, 'Failure Response!');
                        //Ext.Msg.alert('Login failed!', 'Login data is incorrect!');
                    } else {
                        toastr.error('Error!', 'The authentication server is not responding : ' + action.response.responseText);
                        //Ext.Msg.alert('Warning!', 'The authentication server is not responding : ' + action.response.responseText);
                    }

                    //frm.reset();
                }
            });
        }else{ 
             toastr.error('Error check the form', 'Error Response');
        }
    },
    onSaveNewPassword: function (btn) {
        var form = btn.up('form'),
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                dataType: 'JSON',
                url: 'saveNewPassword',
                method: 'POST',
                waitTitle: 'Connecting',
                waitMsg: 'Saving new password...',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        message = response.message;
                    toastr.success(message, "Success Response");
                    Ext.Function.defer(function () {
                        location.href = base_url;
                    }, 500);
                },
                failure: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        message = response.message;
                    if (action.failureType == 'server') {
                        toastr.error(message, 'Failure Response!');
                        //Ext.Msg.alert('Login failed!', 'Login data is incorrect!');
                    } else {
                        toastr.error('Error!', 'The authentication server is not responding : ' + action.response.responseText);
                        //Ext.Msg.alert('Warning!', 'The authentication server is not responding : ' + action.response.responseText);
                    }
                }
            });
        }else{ 
             toastr.error('Error check the form', 'Error Response');
        }
    },
});
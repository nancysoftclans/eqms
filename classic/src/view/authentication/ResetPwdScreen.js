Ext.define('Admin.view.authentication.ResetPwdScreen', {
    extend: 'Admin.view.authentication.LockingWindow',
    xtype: 'resetpwdscreen',

    requires: [
        'Admin.view.authentication.Dialog',
        'Ext.form.Label',
        'Ext.form.field.Text',
        'Ext.button.Button'
    ],
    title: 'Reset Password',

    defaultFocus : 'authdialog',  // Focus the Auth Form to force field focus as well

    items: [
        {
            xtype: 'authdialog',
            defaultButton: 'loginButton',
            autoComplete: true,
            bodyPadding: '20 20',
            cls: 'auth-dialog-login',
            header: false,
            width: 500,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults: {
                margin: '5 0',
                allowBlank: false,
                msgTarget: 'under'
            },

            items: [
                {
                    xtype: 'label',
                    text: 'Change Your Password!!',

                },
                {
                    xtype: 'textfield',
                    value: token,
                    name: '_token',
                    hidden: true
                },
                {
                    xtype: 'textfield',
                    value: guid,
                    name: 'guid',
                    hidden: true
                },

                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    name: 'new_password',
                    id: 'pass',
                    height: 55,
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: 'New Password',
                    inputType: 'password',
                    blankText: "Enter your new password",
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    },
                    validators: [{
                        errorMessage: "Password should contain at least 8 character;",
                        fn: (value) => {
                            return value.length >= 8
                        }
                    }, {
                        errorMessage: "Password should contain at least one number;",
                        fn: (value) => {
                            return /\d/.test(value)
                        }
                    }, {
                        errorMessage: "Password should contain at least one lowercase and one uppercase letter;",
                        fn: (value) => {
                            return /[a-z]/.test(value) && /[A-Z]/.test(value);
                        }
                    }, {
                        errorMessage: "Password should contain at least one special character;",
                        fn: (value) => {
                            return /[!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/.test(value);
                        }
                    }
                ],
                    validator: function(val) {
                        const errorMessages = [];
                        var check = true;
                        this.validators.map( (validator, index) => {
                            var prev = check;
                            check = validator.fn(val) ? true : false;
                            if(!check){
                                errorMessages.push(`<li>${validator.errorMessage}</li>`);
                            }
                            if(prev && check){
                                check = true;
                            }else{
                                check = false;
                            }      
                        });
                        if(check){
                            return true;
                        }else{
                            return errorMessages.join('');
                        }
                        
                    }
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    name: 'confirm_new_password',
                    inputType: 'password',
                    id: 'pass2',
                    vtype: 'password',
                    initialPassField: 'pass',
                    height: 55,
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: 'Confirm New Password',
                    blankText: "Confirm your new password",
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    }
                },
                {
                    xtype: 'button',
                    reference: 'resetPassword',
                    scale: 'large',
                    ui: 'soft-blue',
                    //formBind: true,
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-save',
                    text: 'Save New Password',
                    listeners: {
                        click: 'onSaveNewPassword'
                    }
                }
            ]
        }
    ]
});


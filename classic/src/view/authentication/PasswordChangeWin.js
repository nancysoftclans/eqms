Ext.define('Admin.view.authentication.PasswordChangeWin', {
    extend: 'Ext.window.Window',
    xtype: 'passwordchangewin',
    modal: true,
    title: 'Password Change',
    controller: 'authentication',
    padding: 3,
    requires: [
        'Ext.form.*',
        'Ext.layout.container.Form',
        'Ext.button.*'
    ],

    items: [
        {
            xtype: 'form',
            frame: true,
            layout: {
                type: 'form'
            },
            defaults:{
                allowBlank: false,
                msgTarget: 'under'
            },
            items:[
                {
                    xtype: 'textfield',
                    hidden: true,
                    fieldLabel: 'Token',
                    name: '_token',
                    value: token
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Old Password',
                    inputType: 'password',
                    name: 'old_password'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'New Password',
                    inputType: 'password',
                    id: 'new_password',
                    name: 'new_password',
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
                },{
                    xtype: 'textfield',
                    fieldLabel: 'Confirm New Password',
                    inputType: 'password',
                    id: 'confirm_new_password',
                    initialPassField: 'new_password',
                    vtype: 'password',
                    name: 'confirm_new_password'
                }
            ],
            buttons:[
                {
                    xtype: 'button',
                    text: 'Save',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    formBind: true,
                    handler: 'updatePassword'
                },
                {
                    xtype: 'button',
                    text: 'Close',
                    iconCls: 'x-fa fa-close',
                    action: 'close',
                    handler: function (btn) {
                        btn.up('form').up('window').close();
                    }
                }
            ]
        }
    ]
});
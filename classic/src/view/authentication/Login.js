Ext.define('Admin.view.authentication.Login', {
    extend: 'Admin.view.authentication.LockingWindow',
    xtype: 'login',
    itemId: 'loginWinItemId',
    requires: [
        'Admin.view.authentication.Dialog',
        'Ext.container.Container',
        'Ext.form.field.Text',
        'Ext.form.field.Checkbox',
        'Ext.button.Button'
    ],

   // title: 'Let\'s Log In',
    defaultFocus: 'authdialog', // Focus the Auth Form to force field focus as well
    items: [
        {
            xtype: 'authdialog',
            itemId: 'loginFormItemid',
            defaultButton : 'loginButton',
            autoComplete: true,
            bodyPadding: '20 20',
            cls: 'auth-dialog-login',
            header: false,
            width: 415,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults : {
                margin : '5 0'
            },

            items: [
                {
                    xtype: 'label',
                    html: '<h1>BOMRA Staff Login</h1>'
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    name: 'email',
                    bind: '{userid}',
                    height: 55,
                    hideLabel: true,
                    inputType: 'email',
                    allowBlank : false,
                    emptyText: 'username/Email',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-email-trigger'
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    emptyText: 'Password',
                    inputType: 'password',
                    name: 'password',
                    bind: '{password}',
                    allowBlank : false,
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    }
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkboxfield',
                            flex : 1,
                            cls: 'form-panel-font-color rememberMeCheckbox',
                            height: 30,
                            bind: '{persist}',
                            boxLabel: 'Remember me'
                        },
                        {
                            xtype: 'box',
                            html: '<a href="#passwordreset" class="link-forgot-password"> Forgot Password ?</a>',
                            listeners: {
                                el: {
                                    delegate: 'a',
                                    click: 'onResetPasswordClick'
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'button',
                    reference: 'loginButton',
                    scale: 'large',
                    ui: 'soft-blue',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Login',
                    formBind: true,
                    handler: 'onLoginButton'
                }
                
            ]
        },{
            xtype: 'authdialog',
            defaultButton: 'loginButton',
            itemId: 'logoutFormItemid',
            autoComplete: true,
            hidden: true,
            bodyPadding: '20 20',
            cls: 'auth-dialog-login',
            header: false,
            width: 500,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults: {
                margin: '5 0'
            },

            items: [
                {
                    xtype: 'label',
                    text: 'Enter your email address for further reset instructions!!',
                    style: {
                        'font-weight': 'bold',
                        'font-size': '14px'
                    }
                },
                {
                    xtype: 'textfield',
                    value: token,
                    name: '_token',
                    hidden: true
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    name: 'email',
                    height: 55,
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: 'Registered Email Address',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-envelope-trigger'
                        }
                    }
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'box',
                            html: '<a href="#login" class="link-forgot-password" onclick="event.preventDefault()"><i class="x-fa fa-angle-left"></i> Back to Log In</a>',
                            listeners: {
                                el: {
                                    delegate: 'a',
                                    click: 'onLoginClick'
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'button',
                    reference: 'resetPassword',
                    scale: 'large',
                    ui: 'soft-blue',
                    formBind: true,
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Reset Password',
                    listeners: {
                        click: 'onResetPwdClick'
                    }
                }
            ]
        }
    ],

    initComponent: function() {
        this.addCls('user-login-register-container');
        this.callParent(arguments);
    }
});

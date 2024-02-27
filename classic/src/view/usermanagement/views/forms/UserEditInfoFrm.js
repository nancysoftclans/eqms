Ext.define('Admin.view.usermanagement.views.forms.UserEditInfoFrm', {
    extend: 'Ext.form.Panel',
    xtype:'usereditinfofrm',
    bodyPadding: 8,
    controller: 'usermanagementvctr',
    autoScroll: true,
    viewModel: 'usermanagementvm',
    width:'50%',
     requires: [
        'Ext.form.*',
        'Ext.layout.container.Form',
        'Ext.button.*'
      ],
      listeners: {
        beforerender: 'getUpdateinfo'
     },

    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            margin: '0 0 10 0',
            items: [
                {
                    xtype: 'image',
                    cls: 'userProfilePic',
                    name: 'user_photo',
                    height: 120,
                    width: 120,
                    columnWidth: 0.1,
                    bind: {
                        src: '{imgData}'
                    },
                    alt: 'profile-picture',
                    //src: 'resources/images/placeholder.png'
                }, 
                {
                    xtype: 'filefield',
                    buttonOnly: true,
                    name: 'profile_photo',
                    buttonText: 'Upload',
                    anchor: '100%',
                    margin: '0 0 0 5',
                    labelWidth: 200,
                    columnWidth: 0.85,
                    listeners: {
                        change (field) {
                            const dom = Ext.getDom(field.fileInputEl);
                            const form = field.up('form');
                            const viewModel = form.getViewModel();
                            const reader = new FileReader();
         
                            reader.onload = e => viewModel.set('imgData', e.target.result);
         
                            reader.readAsDataURL(dom.files[ 0 ]);
                        }
                    },
                },
                {
                    xtype: 'hiddenfield',
                    name: 'saved_name'
                }
            ]
        }, {
            xtype: 'container',
            // layout: 'column',
            layout: {
                type: 'form'
            },
            defaults: {
                labelAlign: 'top',
                labelStyle: {
                    'font-weight': 'bold'
                },
                allowBlank: true
            },
            fieldDefaults: {
                xtype: 'textfield',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold'
                }
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    fieldLabel: 'id',
                    columnWidth: 0.33,
                    margin: '0 20 20 0',
                    name: 'id'
                }, {
                    xtype: 'textfield',
                    value: token,
                    name: '_token',
                    hidden: true
                }, {
                    xtype: 'hiddenfield',
                    fieldLabel: 'table name',
                    value: 'users',
                    margin: '0 20 20 0',
                    name: 'table_name'
                }, {
                    xtype: 'hiddenfield',
                    value: 'title_id,gender_id,branch_id,department_id,has_account_timestamp,active_from,active_to,has_expiry_exemption,expiry_exemption_remark,has_dormant_exemption,dormant_exemption_remark,has_password_change_exemption,password_change_exemption',
                    name: 'skip'
                }, {
                    xtype: 'combo', anyMatch: true,
                    fieldLabel: 'Title',
                    reference: 'titleField',
                    displayField: 'name',
                    valueField: 'id',
                    columnWidth: 0.33,
                    allowBlank: false,
                    margin: '0 20 0 0',
                    name: 'title_id',
                    // editable: true,
                    forceSelection: true,
                    queryMode: 'local',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    },
                    listeners: {
                        beforerender: {
                            fn: 'setCompStore',
                            config: {
                                pageSize: 100,
                                proxy: {
                                    extraParams: {
                                        table_name: 'par_titles'
                                    }
                                }
                            },
                            isLoad: true
                        }
                    }
                },
                
                {
                    xtype: 'textfield',
                    fieldLabel: 'First Name',
                    columnWidth: 0.33,
                    allowBlank: false,
                    margin: '0 20 0 0',
                    name: 'first_name',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    },
                    enableKeyEvents: true,
                   
                    //bind: '{firstName}'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Other Names',
                    allowBlank: false,
                    columnWidth: 0.33,
                    margin: '0 20 0 0',
                    name: 'last_name',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    },
                    enableKeyEvents: true,
                   
                    //bind: '{lastName}'
                }, {
                    xtype: 'combo', anyMatch: true,
                    fieldLabel: 'Gender',
                    allowBlank: false,
                    displayField: 'name',
                    valueField: 'id',
                    columnWidth: 0.33,
                    margin: '0 20 0 0',
                    name: 'gender_id',
                    forceSelection: true,
                    queryMode: 'local',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    },
                    listeners: {
                        beforerender: {
                            fn: 'setCompStore',
                            config: {
                                pageSize: 100,
                                proxy: {
                                    extraParams: {
                                        table_name: 'par_gender'
                                    }
                                }
                            },
                            isLoad: true
                        }
                    }
                },
                {
                    xtype: 'hiddenfield',
                    fieldLabel: 'Email Address',
                    columnWidth: 0.33,
                    margin: '0 20 0 0',
                    name: 'email',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    },
                    allowBlank: false,
                    vtype: 'email',
                    enableKeyEvents: true,
                    editable:false
                },
               
                {
                    xtype: 'textfield',
                    fieldLabel: 'Phone No',
                    allowBlank: false,
                    columnWidth: 0.33,
                    margin: '0 20 0 0',
                    name: 'phone',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    }
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Mobile No',

                    allowBlank: false,
                    columnWidth: 0.33,
                    margin: '0 20 0 0',
                    name: 'mobile',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    }
                }
            ]
          

        },
       
    ],
    buttons:[
        '->',
    {
        xtype: 'button',
        text: 'Reset',
        iconCls: 'fa fa-sync-alt',
        handler: function (btn) {
            btn.up('form').getForm().reset();
            
        }
    },
        {
            xtype: 'button',
            text: 'Save',
            iconCls: 'x-fa fa-save',
            action: 'save',
            formBind: true,
            handler: 'saveUpdateUserInformation'
        }
    ]
});

Ext.define('Admin.view.notifications.views.forms.Notificationsfrm', {
    extend: 'Ext.form.Panel',
    xtype: 'notificationsfrm',
    controller: 'notificationsvctr',
    layout: 'form',
    autoScroll: true,
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
   items: [
        {
            xtype: 'hiddenfield',
            margin: '0 20 20 0',
            value:'par_notifications',
            allowBlank: true,
            name: 'table_name'
        },
        {
            xtype: 'hiddenfield',
            margin: '0 20 20 0',
            allowBlank: true,
            value: token,
            name: '_token'
        },
        {
            xtype: 'hiddenfield',
            margin: '0 20 20 0',
            allowBlank: true,
            name: 'id'
        },
        {
            xtype: 'hiddenfield',
            margin: '0 20 20 0',
            allowBlank: true,
            name: 'sender_id'
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Select Recepient',
            margin: '0 20 20 0',
            allowBlank: true,
            queryMode: 'local',
            displayField: 'name',
            name: 'is_group',
            valueField: 'flag',
            editable: false,
            forceSelection: true,
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            extraParams: {
                                table_name: 'par_notification_recepients'
                            }
                        }
                    },
                    isLoad: true
                },
                change: function(combo, newValue, oldValue, eopts) {
                 groupTagfield = this.up().down('tagfield[name=groups_id]');
                 userTagField = this.up().down('tagfield[name=user_id]');
                 departmentTagField = this.up().down('tagfield[name=module_id]');
                  if(newValue==1){
                    groupTagfield .setVisible(true);
                    groupTagfield.allowBlank=false;
                    userTagField.setVisible(false);
                    userTagField .allowBlank=true;
                    departmentTagField.setVisible(false);
                    departmentTagField.allowBlank=true;
                  }else if(newValue==2){
                    userTagField .setVisible(true);
                    userTagField .allowBlank=false;
                    groupTagfield.setVisible(false);
                    groupTagfield.allowBlank=true;
                    departmentTagField.setVisible(false);
                    departmentTagField.allowBlank=true;

                  }
                  else if(newValue==3){
                    departmentTagField.setVisible(true);
                    departmentTagField .allowBlank=false;
                    groupTagfield.setVisible(false);
                    groupTagfield.allowBlank=true;
                    userTagField.setVisible(false);
                    userTagField.allowBlank=true;
                  }
                }
            }
            },
        {
            xtype: 'tagfield',
            fieldLabel: 'Select Recepient Groups',
            displayField: 'name',
            margin: '0 20 20 0',
            itemId: 'value_1-label',
            valueField: 'id',
            name:'groups_id',
            hidden: true,
            queryMode: 'local',
            filterPickList: true,
            encodeSubmitValue: true,
            listeners:{
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            extraParams: {
                                table_name: 'par_groups'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
        {
            xtype: 'tagfield',
            fieldLabel: 'Select Recepient Users',
            margin: '0 20 20 0',
            itemId: 'value_2-label',
            displayField: 'first_name',
            valueField: 'id',
            name:'user_id',
            hidden: true,
            queryMode: 'local',
            // filterPickList: true,
            encodeSubmitValue: true,
            listeners:{
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                           url:'usermanagement/getActiveSystemUsers',
                        }
                    },
                    isLoad: true
                }
            },
         
        },
        {
            xtype: 'tagfield',
            fieldLabel: 'Select Recepient Departments',
            margin: '0 20 20 0',
            itemId: 'value_3-label',
            displayField: 'name',
            valueField: 'id',
            name:'module_id',
            hidden: true,
            queryMode: 'local',
            filterPickList: true,
            encodeSubmitValue: true,
            listeners:{
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            extraParams: {
                                table_name: 'par_modules'
                            }
                        }
                    },
                    isLoad: true
                }
            }
         
        },
        {
          xtype: 'textfield',
            fieldLabel: 'Subject',
            margin: '0 20 20 0',
            allowBlank: false,
            name: 'subject'
        },
        {
            xtype: 'htmleditor',
            allowBlank: false,
            buttonDefaults:{
        
            },
            labelAlign: 'top',
            fieldLabel: 'Message',
            margin: '0 20 20 0',
            name: 'body'
        },
        {
            xtype: 'filefield',
            width: 400,
            labelWidth: 80,
            fieldLabel: ' Add Attachment',
            labelSeparator: '',
            name: 'Attachments',
            buttonConfig: {
                xtype: 'filebutton',
                glyph:'',
                iconCls: 'x-fa fa-cloud-upload-alt',
                text: 'Upload file'
            }
        },
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [
                {
                        text: 'Cancel',
                        iconCls: 'x-fa fa-times',
                        ui: 'soft-purple',
                        handler: 'func_closeFormWin'   
                },
                '->', {
                    text: 'Send',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'par_notifications',
                    storeID: 'NotificationsStr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'notifications/saveGroupNotificationsData',
                    handler: 'doCreateConfigParamWin'
                },   
            ]
        },
      
    ],
  
});

/**
 */
Ext.define('Admin.view.usermanagement.views.forms.PassResetOptionsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'passresetoptionsfrm',
    layout: 'form',
    controller: 'usermanagementvctr',
    frame: true,
    items: [
        {
            xtype: 'hiddenfield',
            name: 'user_id'
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Select Option',
            allowBlank: false,
            forceSelection: true,
            displayField: 'name',
            emptyText: 'Select Option',
            valueField: 'id',
            queryMode: 'local',
            name: 'reset_option',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 100,
                        storeId: 'passresetoptionsstr',
                        proxy: {
                            extraParams: {
                                table_name: 'par_password_reset_options'
                            }
                        }
                    },
                    isLoad: true
                }
            }
            
        }
    ],
    buttons: [
        {
            xtype: 'button',
            text: 'Proceed',
            iconCls: 'x-fa fa-check',
            iconAlign: 'right',
            formBind: true,
            action: 'reset_pwd_proceed',
            handler: 'onPwdResetOptionProceed'
        }
    ]
});
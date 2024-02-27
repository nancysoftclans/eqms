/**
 * Created by Softclans
 */
Ext.define('Admin.view.configurations.views.forms.LetterHeaderFooter', {
    extend: 'Ext.form.Panel',
    xtype: 'letterheaderfooterfrm',
    autoScroll: true,
    controller: 'configurationsvctr',
    layout: 'form',
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    items: [{
        xtype: 'hiddenfield',
        name: 'table_name',
        value: 'par_brimsletter_header_footer',

    }, {
        xtype: 'hiddenfield',
        name: '_token',
        value: token,
      
    }, {
        xtype: 'hiddenfield',
        name: 'id'
    },{
        xtype: 'filefield',
        fieldLabel: 'Select Header',
        name : 'header',
        labelWidth: 120,
        msgTarget: 'side',
        allowBlank: false,
        anchor: '100%',
        buttonText: 'Browse',
        listeners: {
            change: function (fileField, value) {
                var allowedExtensions = ['png']; 
                var fileExtension = value.split('.').pop().toLowerCase();
                
                if (allowedExtensions.indexOf(fileExtension) === -1) {
                    Ext.Msg.alert('Error', 'Only image files with extensions ' + allowedExtensions.join(', ') + ' are allowed.');
                    fileField.reset(); 
                }
            }
        },
    },
    {
        xtype: 'filefield',
        fieldLabel: 'Select Footer',
        name : 'footer',
        labelWidth: 120,
        msgTarget: 'side',
        allowBlank: false,
        anchor: '100%',
        buttonText: 'Browse',
        listeners: {
            change: function (fileField, value) {
                var allowedExtensions = ['png']; 
                var fileExtension = value.split('.').pop().toLowerCase();
                
                if (allowedExtensions.indexOf(fileExtension) === -1) {
                    Ext.Msg.alert('Error', 'Only image files with extensions ' + allowedExtensions.join(', ') + ' are allowed.');
                    fileField.reset(); 
                } 
            }
        },
    },
    {
        xtype: 'checkbox',
        inputValue: 1,
        uncheckedValue: 0,
        checked: false,
        fieldLabel: 'Is Current',
        name: 'is_current',
        allowBlank: true
    }
    
],
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [
                '->', {
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'par_brimsletter_header_footer',
                    storeID: 'letterheaderfootersstr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'documentmanagement/saveHeaderFooter',
                    handler: 'doCreateConfigParamWin'
                }, {
                    text: 'Reset',
                    iconCls: 'x-fa fa-close',
                    ui: 'soft-purple',
                    handler: function (btn) {
                        btn.up('form').getForm().reset();
                    }
                }
            ]
        }
    ]
});
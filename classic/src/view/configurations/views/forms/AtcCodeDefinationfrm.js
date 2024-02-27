
Ext.define('Admin.view.configurations.views.forms.AtcCodeDefinationfrm', {
    extend: 'Ext.form.Panel',
    xtype: 'atcCodeDefinationfrm',
    autoScroll: true,
    controller: 'configurationsvctr',
    layout: 'column',
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false,
        columnWidth: 1
    },
    items: [ 
        {
            xtype: 'hiddenfield',
            margin: '0 20 20 0',
            value:'par_atc_codes',
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
        },{
            xtype: 'textfield',
            fieldLabel: 'ATC Term/Name',
            margin: '0 20 20 0',
            name: 'name',
            allowBlank: false
        },{
            xtype: 'textfield',
            fieldLabel: 'ATC Code',
            margin: '0 20 20 0',
            name: 'code',
            allowBlank: false
        },
        {
            xtype: 'combo', 
            anyMatch: true,
            fieldLabel: 'Parent Category (leave blank if not applicable)',
            margin: '0 20 20 0',
            name: 'parent_id',
            forceSelection: true,
            queryMode: 'local',
            allowBlank: true,
            displayField: 'code',
            valueField: 'id',
            pageSize: 100,
            queryMode: 'remote',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div class="x-boundlist-item">{code} - {name}</div>',
                '</tpl>'
            ),
            listeners:{
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 100,
                        proxy: {
                            extraParams: {
                                table_name: 'par_atc_codes'
                            }
                        }
                    },
                    isLoad: true
                }
            }
    },
    {
        xtype: 'textarea',
        fieldLabel: 'Description',
        margin: '0 20 20 0',
        name: 'description',
        allowBlank: true
    },
    {
        xtype: 'checkbox',
        inputValue: 1,
        uncheckedValue: 0,
        fieldLabel: 'Is Enabled',
        margin: '0 20 20 0',
        name: 'is_enabled',
        allowBlank: true,
        checked: true
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
                    table_name: 'par_atc_codes',
                    storeID: 'atccodedefinationpreviewStr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/saveConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }, 
            ]
        }
    ]
});
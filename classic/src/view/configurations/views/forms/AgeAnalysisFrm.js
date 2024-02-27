
Ext.define('Admin.view.configurations.views.forms.AgeAnalysisFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'ageAnalysisfrm',
    autoScroll: true,
    frame: true,
    controller: 'configurationsvctr',
    layout: 'form',
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    items: [ 
        {
            xtype: 'hiddenfield',
            margin: '0 20 20 0',
            value:'par_ageanalysisdays_span',
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
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'module',
        margin: '0 20 20 0',
        name: 'module_id',
        forceSelection: true,
        queryMode: 'local',
        allowBlank: false,
        displayField: 'name',
        valueField: 'id',
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
        xtype: 'numberfield',
        fieldLabel: 'Minimum Days',
        margin: '0 20 20 0',
        allowBlank: false,
        name: 'min_days'
    },
    {
        xtype: 'numberfield',
        fieldLabel: 'Maximum Days',
        margin: '0 20 20 0',
        allowBlank: false,
        name: 'max_days'
    },
    {
        xtype: 'numberfield',
        fieldLabel: 'Order no',
        margin: '0 20 20 0',
        allowBlank: false,
        name: 'order_no'
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
                    table_name: 'par_ageanalysisdays_span',
                    storeID: 'AgeAnalysisStr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/saveConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }, 
            ]
        }
    ]
});
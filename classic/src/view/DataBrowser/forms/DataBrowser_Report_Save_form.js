Ext.define('Admin.view.DataBrowser.forms.DataBrowser_Report_Save_form', {
    extend: 'Ext.form.Panel',
    xtype: 'dataBrowser_Report_Save_form',
    controller: 'databrowserVCtr',
    autoScroll: true,
    layout: 'form',
    width: '100%',
    bodyPadding: 8,
    
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'header',
        fieldLabel: 'header',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'filter',
        margin: '0 20 20 0',
        name: 'filter',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'module_id',
        margin: '0 20 20 0',
        name: 'module_id',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'form_filters',
        margin: '0 20 20 0',
        name: 'form_filters',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'report_id',
        margin: '0 20 20 0',
        name: 'report_id',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'url',
        margin: '0 20 20 0',
        name: 'url',
        allowBlank: true
    },{
        xtype: 'textfield',
        fieldLabel: 'report_name',
        name: 'report_name',
        margin: '0 20 20 0',
        allowBlank: false
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Is Public',
        forceSelection: true,
        queryMode: 'local',
        valueField: 'id',
        margin: '0 20 20 0',
        displayField: 'name',
        name: 'is_public',
        allowBlank: false,
        listeners: {
            beforerender: {
                fn: 'setAircraftComboStore',
                config: {
                    pageSize: 100,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'confirmation'
                        }
                   }
                },
                isLoad: true
            },
            change: function(combo, newVal, oldVal, eopts) {
                if(newVal == 2){
                    var form = combo.up('form'),
                        groups = form.down('tagfield[name=group_id]'),
                        str = groups.getStore();
                    str.load();
                    groups.setVisible(true);
                }
                
            }

        }
        },{
        xtype: 'tagfield',
        fieldLabel: 'Access Groups',
        forceSelection: true,
        hidden: true,
        queryMode: 'local',
        //filterPickList: true,
        encodeSubmitValue: true,
        //growMax: 100,
        valueField: 'id',
        margin: '0 20 20 0',
        displayField: 'name',
        name: 'group_id',
        allowBlank: true,
        listeners: {
            beforerender: {
                fn: 'setConfigCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        table_name: 'par_groups'
                       }
                },
                isLoad: true
            }

        }
        }],
    dockedItems:[
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items:[
                '->',{
                    text: 'Save Report',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    formBind: true,
                    tooltip: 'save_report',
                    ui: 'soft-blue',
                    action_url: 'summaryreport/saveDefinedDataBrowserReport',
                    handler: 'doUrlFrmSubmit'
                }
            ]
        }
    ]
});
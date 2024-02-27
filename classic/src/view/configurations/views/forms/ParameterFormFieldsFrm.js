
Ext.define('Admin.view.configurations.views.forms.ParameterFormFieldsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'parameterformfieldsfrm',
    autoScroll: true,
    frame: true,
    height: Ext.Element.getViewportHeight() - 118,
    controller: 'configurationsvctr',
    layout: 'form',
    bodyPadding: 5,
    defaults: {
        labelAlign: 'top',
        margin: '0 20 20 0',
        allowBlank: false
    },
    items: [ {
        xtype: 'hiddenfield',
        //margin: '0 20 20 0',
        name: '_token',
        value: token,
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'id',
        //margin: '0 20 20 0',
        name: 'id',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'def_id',
        //margin: '0 20 20 0',
        name: 'def_id',
        allowBlank: true
    },{
        xtype:'fieldset',
        title: 'Parameter Details',
        collapsible: true,
        defaultType: 'textfield',
        layout: 'column',
        defaults: {
            columnWidth: 0.25,
            labelAlign: 'top',
            margin: '0 20 0 0',
            allowBlank: false
        },
        items :[{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Connection',
            displayField: 'name',
            valueField: 'id',
            name: 'connection_id',
            forceSelection: true,
            queryMode: 'local',
            allowBlank: true,
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 100,
                        proxy: {
                            url: 'configurations/getConfigParamFromTable',
                            extraParams: {
                                table_name: 'par_connections'
                            }
                        }
                    },
                    isLoad: true
                },
                select: function(cmb, record, eopts){
                    var form = cmb.up('form'),
                        tblcb = form.down('combo[name=table_name]').getStore(),
                        addBtn = form.down('button[name=add_tables]');
                    tblcb.removeAll();
                    addBtn.db_con = record.get('name');
                    tblcb.load({params: {'in_db': record.get('name')}});
                }
            }
        },{
            fieldLabel: 'Parameter Title',
            name: 'param_title'
        }, {
            fieldLabel: 'Parameter Name',
            name: 'param_name'
        },{
            xtype: 'combobox',
            queryMode: 'local',
            fieldLabel: 'Parameter Table',
            displayField: 'table_name',
            valueField: 'table_name',
            name: 'table_name',
            listeners:
             {
                 beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 10000,
                        proxy: {
                            url: 'configurations/getTableslist',
                            extraParams:{
                                in_db:'mis'
                            }
                        }
                    },
                    isLoad: false
                }
                 
             }
                
           }]
    },{
        xtype:'fieldset',
        defaultType: 'textfield',
        layout: 'column',
        defaults: {
            labelAlign: 'left',
            allowBlank: false,
            margin: '0 20 0 0'
        },
        items :[{
            xtype: 'numberfield',
            fieldLabel: 'No of Joins',
            name: 'no_joins',
            columnWidth: 0.3,
            margin: '0 0 0 0'
        },{
            xtype: 'button',
            name: 'add_tables',
            text: 'Add',
            db_con: 'mysql',
            margin: '0 0 0 0',
            columnWidth: 0.2,
            handler: 'addTableJoinsDefination'
        },{
            xtype: 'button',
            name: 'remove',
            text: 'Remove Joins',
            margin: '0 0 0 40',
            columnWidth: 0.2,
            handler: 'removeTableJoinsDefination'
        }]
    },{
        xtype:'fieldset',
        name: 'joins_fieldsets',
        layout: 'form',
        defaults: {
            labelAlign: 'left',
            allowBlank: false
        },
        items :[]
    }],
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
                    formBind: true,
                    ui: 'soft-blue',
                    action: 'save',
                    table_name: 'par_parameter_definations',
                    storeID: 'parameterDefinationStr',
                    action_url: 'configurations/saveParameterConfig',
                    handler: 'doCreateConfigParamWin'
                    //handler: 'saveParameterConfig'
                }, {
                    text: 'Reset',
                    iconCls: 'x-fa fa-close',
                    ui: 'soft-blue',
                    handler: function (btn) {
                        btn.up('form').getForm().reset();
                    }
                }
            ]
        }
    ]
});
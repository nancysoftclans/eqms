Ext.define('Admin.view.configurations.views.forms.ExcelUploadsConfigFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'excelUploadsConfigfrm',
    controller: 'configurationsvctr',
    autoScroll: true,
    layout: 'form',
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'par_exceluploads_config',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: '_token',
        value: token,
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'id',
        margin: '0 20 20 0',
        name: 'id',
        allowBlank: true
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Module',
        margin: '0 20 20 0',
        name: 'module_id',
        valueField: 'id',
        allowBlank: false,
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        
                        extraParams: {
                            table_name: 'par_modules'
                        }
                    }
                   },
              isLoad: true
            },
            change: function(combo, newVal, oldval, eopts){
                var form = combo.up('form'),
                    sub_moduleStr = form.down('combo[name=sub_module_id]').getStore(),
                    filters = JSON.stringify({'module_id': newVal});
                    sub_moduleStr.removeAll();
                    sub_moduleStr.load({params: {filters: filters}});
              
            }
           
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Sub Module',
        margin: '0 20 20 0',
        name: 'sub_module_id',
        valueField: 'id',
        allowBlank: false,
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        
                        extraParams: {
                            table_name: 'par_sub_modules'
                        }
                    }
                   },
              isLoad: false
            },        
        }
    },
 
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'ADR Type',
        margin: '0 20 20 0',
        name: 'adrtype_id',
        valueField: 'id',
        allowBlank: false,
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        
                        extraParams: {
                            table_name: 'par_adr_types'
                        }
                    }
                   },
              isLoad: true
            }  
        }
    },
    
    {
        xtype: 'textfield',
        fieldLabel: 'Excel Column Name',
        margin: '0 20 20 0',
        name: 'excelcolumnname',
        allowBlank: false
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Config Type',
        margin: '0 20 20 0',
        name: 'excel_config_type_id',
        valueField: 'id',
        allowBlank: false,
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        
                        extraParams: {
                            table_name: 'par_exceluploads_config_type'
                        }
                    }
                   },
              isLoad: true
            },
            select: function (field, record) {
                var form = this.up('excelUploadsConfigfrm'),
                newVal=record.get('table_nm'),
                join_column_nameStr = form.down("combo[action=column_name]").getStore();
                join_column_nameStr.removeAll();
                join_column_nameStr.load({params:{'table_name':newVal}});
            },
           }
    },
    {
        xtype: 'combobox',
        queryMode: 'local',
        fieldLabel: 'Table Column',
        name: 'table_column',
        action:'column_name',
        displayField: 'column_name',
        valueField: 'column_name',
        columnWidth: 0.2,
        listeners:
         {
             beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getTablescolumns',
                        extraParams:{
                           // db_con: btn.db_con
                        }
                    }
                },
                isLoad: false
            }   
             
         }

      },
  
  
    {
        xtype: 'checkbox',
        inputValue: 1,
        uncheckedValue: 0,
        fieldLabel: 'Is Enabled',
        margin: '0 20 20 0',
        name: 'is_enabled',
        allowBlank: true
    }],
    dockedItems:[
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items:[
                '->',{
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'par_exceluploads_config',
                    storeID: 'excelUploadConfigStr',
                    formBind: true,
                    ui: 'soft-blue',
                    action_url: 'configurations/saveConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});
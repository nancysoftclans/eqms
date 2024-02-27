Ext.define('Admin.view.configurations.views.forms.ExcelUploadsConfigTypeFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'excelUploadsConfigTypefrm',
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
        value: 'par_exceluploads_config_type',
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
    },

    {
        xtype: 'textfield',
        fieldLabel: 'Name',
        margin: '0 20 20 0',
        name: 'name',
        allowBlank: false
    },
    {
        xtype: 'combobox',
        queryMode: 'local',
        fieldLabel: 'Table Name',
        displayField: 'table_name',
        valueField: 'table_name',
        name: 'table_nm',
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
                isLoad: true
            },
          
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
                    table_name: 'par_exceluploads_config_type',
                    storeID: 'excelUploadConfigTypeStr',
                    formBind: true,
                    ui: 'soft-blue',
                    action_url: 'configurations/saveConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});
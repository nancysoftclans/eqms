Ext.define('Admin.view.documentManager.views.forms.NavigatorForm',{
    extend: 'Ext.form.Panel',
    xtype: 'navigatorform',
    controller: 'documentsManagementvctr',
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
       value: 'tra_documentmanager_application',
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
    }, {
        xtype: 'textfield',
        fieldLabel: 'Title',
        margin: '0 20 20 0',
        name: 'navigator_folder_name',
        allowBlank: false
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Has Associated Folder',
        margin: '0 20 20 0',
        name: 'has_parent_level',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                       
                        extraParams: {
                            table_name: 'par_confirmations'
                        }
                    }
                   },
              isLoad: true
            },
            change: 'showHideParent'
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Associated Folder',
        margin: '0 20 20 0',
        name: 'docparent_id',
        valueField: 'id',
        hidden: true,
        displayField: 'navigator_folder_name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                       
                        extraParams: {
                            table_name: 'tra_documentmanager_application'
                        }
                     }
                },
                isLoad: true
            }
        }
    },
    //{
    //     xtype: 'combo', anyMatch: true,
    //     fieldLabel: 'Section',
    //     margin: '0 20 20 0',
    //     name: 'section_id',
    //     valueField: 'id',
    //     hidden: true,
    //     allowBlank: true,
    //     displayField: 'name',
    //     forceSelection: true,
    //     queryMode: 'local',
    //     listeners: {
    //         beforerender: {
    //             fn: 'setCompStore',
    //             config: {
    //                 proxy: {
                        
    //                     extraParams: {
    //                         table_name: 'par_sections'
    //                     }
    //                 }
    //                },
    //           isLoad: true
    //         },
    //         change: function(combo, newVal, oldval, eopts){
    //             var form = combo.up('form'),
    //                 prodclassStr = form.down('combo[name=prodclass_category_id]').getStore(),
    //                 premiseStr = form.down('combo[name=premise_type_id]').getStore(),
    //                 filters = JSON.stringify({'section_id': newVal});
    //                 prodclassStr.removeAll();
    //                 premiseStr.removeAll();
    //                 prodclassStr.load({params: {filters: filters}});
    //                 premiseStr.load({params: {filters: filters}});
    //         }
           
    //     }
    // },{
    //     xtype: 'combo', anyMatch: true,
    //     fieldLabel: 'Prodclass Category',
    //     margin: '0 20 20 0',
    //     name: 'prodclass_category_id',
    //     valueField: 'id',
    //     allowBlank: true,
    //     displayField: 'name',
    //     hidden: true,
    //     forceSelection: true,
    //     queryMode: 'local',
    //     listeners: {
    //         beforerender: {
    //             fn: 'setCompStore',
    //             config: {
    //                 proxy: {
                        
    //                     extraParams: {
    //                         table_name: 'par_prodclass_categories'
    //                     }
    //                 }
    //                },
    //           isLoad: false
    //         }
           
    //     }
    // },{
    //     xtype: 'combo', anyMatch: true,
    //     fieldLabel: 'Premise Type',
    //     margin: '0 20 20 0',
    //     name: 'premise_type_id',
    //     valueField: 'id',
    //     allowBlank: true,
    //     displayField: 'name',
    //     forceSelection: true,
    //     hidden: true,
    //     queryMode: 'local',
    //     listeners: {
    //         beforerender: {
    //             fn: 'setCompStore',
    //             config: {
    //                 proxy: {
                        
    //                     extraParams: {
    //                         table_name: 'par_premises_types'
    //                     }
    //                 }
    //                },
    //           isLoad: true
    //         }
           
    //     }
    // },{
    //     xtype: 'combo', anyMatch: true,
    //     fieldLabel: 'Import Permit Type',
    //     margin: '0 20 20 0',
    //     name: 'importexport_permittype_id',
    //     valueField: 'id',
    //     allowBlank: true,
    //     displayField: 'name',
    //     forceSelection: true,
    //     hidden: true,
    //     queryMode: 'local',
    //     listeners: {
    //         beforerender: {
    //             fn: 'setCompStore',
    //             config: {
    //                 proxy: {
                        
    //                     extraParams: {
    //                         table_name: 'par_importexport_permittypes'
    //                     }
    //                 }
    //                },
    //           isLoad: true
    //         }
           
    //     }
    // },
    {  xtype: 'checkbox',
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
                    table_name: 'par_navigator_folder',
                    storeID: 'docdefinationrequirementstr',
                    formBind: true,
                    ui: 'soft-blue',
                    //action_url: 'configurations/saveConfigCommonData',
                    action_url: 'configurations/navigatorFolder',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});
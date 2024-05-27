
 Ext.define('Admin.view.documentManager.views.forms.DocdefinationRequirementFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'docdefinationrequirementfrm',
    height: Ext.Element.getViewportHeight() - 118,
    controller: 'documentsManagementvctr',
    autoScroll: true,
    viewModel: {
        type: 'documentcreationvm'
    },
    layout: {
        type: 'column'
    },
    //bodyPadding: 5,
    defaults: {
        columnWidth: 0.33,
        margin: 5,
        labelAlign: 'top'
    },
    frame: true,
    bodyPadding: 8,
    items: [
    {
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'tra_documentmanager_application',
        allowBlank: true
    },{
        xtype: 'hiddenfield',
        name: 'module_id'
    }, {
        xtype: 'hiddenfield',
        name: 'sub_module_id'
    },{
        xtype: 'hiddenfield',
        name: 'application_code'
    },{
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
    },  {
        xtype:'fieldset',
        columnWidth: 1,
        title: "Create Document",
        collapsible: true,
        defaults: {
            labelAlign: 'top',
            allowBlank: false,
            labelAlign: 'top',
            margin: 5,
            xtype: 'textfield',
            allowBlank: false,
            columnWidth: 0.33,
        },
        layout: 'column',
        items:[{
        xtype: 'textfield',
        fieldLabel: 'Document Title',
        margin: '0 20 20 0',
        name: 'doc_title'
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Document Type',
        margin: '0 20 20 0',
        name: 'document_type_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: false,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_document_types'
                        }
                    }
                },
                isLoad: true
            }
        }
    },{
        xtype: 'textfield',
        fieldLabel: 'Version',
        margin: '0 20 20 0',
        name: 'doc_version'
    },{
            xtype: 'combo',
            queryMode: 'local',
            forceSelection: true,
            valueField: 'id',
            margin: '0 20 20 0',
            displayField: 'name',
            fieldLabel: 'Owner Type',
            name: 'owner_type_id',
            //store: 'confirmationstr',
            listeners: {
                change: function (cmb, newVal) {
                    var form = cmb.up('form'),
                        owneruser = form.down('combo[name=owner_user_id]'),
                        ownergroup = form.down('combo[name=owner_group_id]');
                    if (newVal == 1 || newVal === 1) {
                        owneruser.setVisible(true);
                    } else {
                        ownergroup.setVisible(true);
                    }
                },beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            url: 'configurations/getNonrefParameter',
                            extraParams: {
                                table_name: 'par_owner_type'
                            }
                        }
                    },
                    isLoad: true
                }
            }
            
        },{
        xtype: 'combo', 
        fieldLabel: 'Owner User',
        name: 'owner_user_id',
        valueField: 'id',
        margin: '0 20 20 0',
        displayField: `firstname`,
        forceSelection: true,
        allowBlank: true,
        hidden: true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'usermanagement/documentOwner',
                        extraParams: {
                            //table_name: 'par_user_roles'
                        }
                    }
                },
                isLoad: true
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Owner Group',
        name: 'owner_group_id',
        valueField: 'id',
        displayField: `name`,
        margin: '0 20 20 0',
        forceSelection: true,
        allowBlank: true,
        hidden: true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        //url: 'usermanagement/documentOwner',
                        extraParams: {
                            table_name: 'par_groups'
                        }
                    }
                },
                isLoad: true
            }
        }
    },{
        xtype: 'textarea',
        fieldLabel: 'Description',
        name: 'doc_description',
        allowBlank: true,
        columnWidth: 1,
        labelAlign: 'top'
    } , {
                    xtype: 'textfield',
                    name: 'recoil',
                    columnWidth: 0.9,
                    allowBlank: false,
                    fieldLabel: 'Navigator folders',
                   readOnly: true
                },{
                    xtype: 'textfield',
                    name: 'navigator_folder_id',
                    columnWidth: 0.9,
                    allowBlank: false,
                    hidden: true,
                    fieldLabel: 'DOC ID',
                   readOnly: true
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-search',
                    columnWidth: 0.1,
                    tooltip: 'Search',
                    action: 'search_navigator',
                    childXtype: 'navigatorselectfoldergrid',
                    winTitle: 'Select Folder',
                    winWidth: '90%',
                    margin: '34 0 0 0',
                    bind: {
                        disabled: '{isReadOnly}'
                    }
                }
    ]
    },

   


     {
        xtype: 'combo', anyMatch: true,
        name: 'has_document_template',
        store: 'confirmationstr',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        readOnly: true,
        forceSelection: true,
        hidden: true,
        fieldLabel: 'Has Document Template?',
        value: 2,
        // listeners: {
        //     change: function (cmb, newVal) {
        //         var form = cmb.up('form'),
        //         document_template = form.down('filefield[name=document_template]');
        //         if (newVal == 1 || newVal === 1) {
        //             document_template.allowBlank = false;
        //             document_template.validate();
        //             document_template.setVisible(true);
        //         } else {
        //             document_template.allowBlank = true;
        //             document_template.validate();
        //             document_template.setVisible(false);
        //         }
        //     }
        // }
    },
    // {
    //     xtype: 'filefield',
    //     fieldLabel: 'Document Template',
    //     allowBlank: true,
    //     hidden: true,
    //     name: 'document_template'
    // },
   ]
    //dockedItems:[
    // {
    //         xtype: 'toolbar',
    //         ui: 'footer',
    //         dock: 'bottom',
    //         items:[
    //             '->',{
    //                 text: 'Save Details',
    //                 iconCls: 'x-fa fa-save',
    //                 action: 'save',
    //                 table_name: 'tra_documentupload_requirements',
    //                 storeID: 'docdefinationrequirementstr',
    //                 formBind: true,
    //                 ui: 'soft-purple',
    //                 action_url: 'configurations/saveDocDefinationrequirement',
    //                 handler: 'doCreateConfigParamWin'
    //             },{
    //                 text: 'Reset',
    //                 iconCls: 'x-fa fa-close',
    //                 ui: 'soft-purple',
    //                 handler: function (btn) {
    //                     btn.up('form').getForm().reset();
    //                 }
    //             }
    //         ]
    //     }
    //]
});

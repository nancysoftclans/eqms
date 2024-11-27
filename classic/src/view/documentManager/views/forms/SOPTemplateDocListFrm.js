
 Ext.define('Admin.view.documentManager.views.forms.SOPTemplateDocListFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'soptemplatedoclistfrm',
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
        title: "Form Details",
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
        items:[

        {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Template Type',
        margin: '0 20 20 0',
        name: 'template_id',
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
                            table_name: 'qms_template_types'
                        }
                    }
                },
                isLoad: true
            }
        }
    },{
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
                            table_name: 'par_qms_documents_types'
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
        name: 'doc_version',
        value: '1.0',
        readOnly: true
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
        displayField: `fullname`,
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
                    name: 'navigator_name',
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
   ]
});

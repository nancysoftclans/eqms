
 Ext.define('Admin.view.documentsManagement.views.forms.DocdefinationRequirementFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'docdefinationrequirementfrm',
    height: Ext.Element.getViewportHeight() - 118,
    controller: 'documentsManagementvctr',
    autoScroll: true,
    layout: 'form',
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    items: [
    {
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'tra_documentupload_requirements',
        allowBlank: true
    },
    {
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: '_token',
        value: token,
        allowBlank: true
    }, 
    {
        xtype: 'hiddenfield',
        fieldLabel: 'id',
        margin: '0 20 20 0',
        name: 'id',
        allowBlank: true
    }, 
    {
        xtype: 'filefield',
        fieldLabel: 'New Attachment',
        allowBlank: true,
        hidden: false,
        name: 'document_template'
        
    },
    {
        xtype: 'textfield',
        fieldLabel: 'Title',
        margin: '0 20 20 0',
        name: 'title',
        allowBlank: false,
    },
    {
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
    }, 
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Has Parent',
        margin: '0 20 20 0',
        name: 'has_parent_level',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        hidden: true,
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
    },
    {
		xtype: 'checkbox',
		fieldLabel: 'Is Mandatory',
		name: 'is_mandatory',
		inputValue: 1,
		uncheckedValue: 0,
        hidden: true
	},{
        xtype: 'checkbox',
        fieldLabel: 'Portal Uploadable',
        name: 'portal_uploadable',
        inputValue: 1,
        uncheckedValue: 0,
        align: 'center',
        hidden: true
    },{
        xtype: 'tagfield',
        fieldLabel: 'Allowed Document Extensions',
        margin: '0 20 20 0',
        name: 'document_extension_ids',
        allowBlank: false,
        forceSelection: true,
        filterPickList: true,
        encodeSubmitValue: true,
        emptyText: 'Select Document Extensions',
        growMax: 100,
        queryMode: 'local',
        valueField: 'id',
        displayField: 'extension',
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_document_extensionstypes'
                        }
                    }
                },
                isLoad: true
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        name: 'has_document_template',
        store: 'confirmationstr',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        readOnly: true,
        forceSelection: true,
        fieldLabel: 'Has Document Template?',
        value: 2,
        hidden: true
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
    
    {
		xtype: 'textarea',
		fieldLabel: 'Description',
		name: 'description',
        allowBlank: true
		
	}],
    dockedItems:[{
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items:[
                '->',{
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'tra_documentupload_requirements',
                    storeID: 'docdefinationrequirementstr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/saveDocDefinationrequirement',
                    handler: 'doCreateConfigParamWin'
                },{
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


    // {
    //     xtype: 'combo', anyMatch: true,
    //     fieldLabel: 'Parent Document',
    //     margin: '0 20 20 0',
    //     name: 'docparent_id',
    //     valueField: 'id',
    //     hidden: true,
    //     displayField: 'name',
    //     forceSelection: true,
    //     allowBlank: true,
    //     queryMode: 'local',
    //     listeners: {
    //         afterrender: {
    //             fn: 'setCompStore',
    //             config: {
    //                 pageSize: 10000,
    //                 proxy: {
                       
    //                     extraParams: {
    //                         table_name: 'tra_documentupload_requirements'
    //                     }
    //                  }
    //             },
    //             isLoad: true
    //         }
    //     }
    // },

 Ext.define('Admin.view.documentsManagement.views.forms.DocdefinationRequirementFrm', {
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
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'tra_documentupload_requirements',
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
    }, {
        xtype: 'textfield',
        fieldLabel: 'Document Title',
        margin: '0 20 20 0',
        name: 'name'
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
                            table_name: 'par_form_categories'
                        }
                    }
                },
                isLoad: true
            }
        }
    },{
      xtype: 'tagfield',
        fieldLabel: 'Allowed Document Extensions',
        margin: '0 20 20 0',
        name: 'document_extension_ids',
        allowBlank: true,
        forceSelection: true,
        hidden: true,
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
        xtype: 'textfield',
        fieldLabel: 'Version',
        margin: '0 20 20 0',
        name: 'version'
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Document Owner',
        margin: '0 20 20 0',
        name: 'document_owner_id',
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
                            table_name: 'par_user_roles'
                        }
                    }
                },
                isLoad: true
            }
        }
    },{
        xtype: 'datefield',
        name: 'assessment_date',bind: {
            readOnly: '{isReadOnly}'
        },
        format:'Y-m-d',
        altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00',
        fieldLabel: 'Assessment Date',
    },{
        xtype:'fieldset',
        columnWidth: 1,
        title: 'Related Fields',
        collapsible: true,
        defaults: {
            labelAlign: 'top',
            allowBlank: false,
            labelAlign: 'top',
            margin: 5,
            allowBlank: true,
            columnWidth: 1,
        },
        layout: 'column',
        items :[
            {
                // xtype: 'htmleditor',
                // fieldLabel: 'Status of development Details',
                // name: 'pacra_reg_no',
                // allowBlank: true,
                // labelAlign: 'top'
            }]
    },{
        xtype: 'htmleditor',
        fieldLabel: 'Description',
        name: 'description',
        allowBlank: true,
        columnWidth: 1,
        labelAlign: 'top'
    },{
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

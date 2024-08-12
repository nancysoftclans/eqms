Ext.define('Admin.view.auditManagement.views.forms.AuditFindingsFrm',{
    extend: 'Ext.form.Panel',
    xtype: 'auditfindingsfrm',
    controller: 'auditMgmntVctr',
    autoScroll: true,
      bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    viewModel: {
        type: 'documentcreationvm'
    },
    layout: {
        type: 'column'
    },
    bodyPadding: 5,
    defaults: {
        columnWidth: 0.33,
        margin: 5,
        labelAlign: 'top'
    },

     
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
       value: 'par_qms_audit_types',
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
        xtype:'fieldset',
        columnWidth: 1,
        title: "Finding",
        collapsible: true,
        defaults: {
            labelAlign: 'top',
            allowBlank: false,
            labelAlign: 'top',
            margin: 5,
            xtype: 'textfield',
            allowBlank: false,
            columnWidth: 0.5,
        },
        layout: 'column',
        items:[
        {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Finding type',
        margin: '0 20 20 0',
        name: 'finding_type',
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
                            table_name: 'par_finding_types'
                        }
                    }
                   },
              isLoad: true
            },
        }
    },{
        xtype: 'textfield',
        fieldLabel: 'Title',
        margin: '0 20 20 0',
        name: 'finding_title',
        allowBlank: false
    },{
        xtype: 'textarea',
        fieldLabel: 'Description',
        margin: '0 20 20 0',
        name: 'description',
        columnWidth: 1,
        allowBlank: false
    },{
        xtype: 'textarea',
        fieldLabel: 'Results',
        margin: '0 20 20 0',
        name: 'results',
        columnWidth: 1,
        allowBlank: false
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
    },
    ]},
    {
    xtype:'fieldset',
    columnWidth: 1,
    title: "Associated Issue",
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
            xtype: 'textfield',
            fieldLabel: 'ISSUE TYPE',
            name: 'issue_type',
            columnWidth: 0.23,
            readOnly: true
        },
        {
            xtype: 'textfield',
            name: 'issue_type_id',
            columnWidth: 0.9,
            allowBlank: false,
            hidden: true,
            fieldLabel: 'ISSUE ID',
            readOnly: true
        },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-link',
            columnWidth: 0.10,
            tooltip: 'Select Issue Type',
           // handler: 'showAuditTypesRecords',
            winTitle: 'Select Audit Type',
            winWidth: '90%',
            margin: '35 0 0 0',
            action: 'search_issue_type',
            childXtype: 'audittypesgrid',
        },
        {
            xtype: 'textfield',
            fieldLabel: 'CREATION DATE',
            name: 'created_on',
            readOnly: true
        },
        {
            xtype: 'textfield',
            fieldLabel: 'STATUS',
            name: 'status',
            readOnly: true
        },
     ]
 },],
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
                    table_name: 'par_qms_audit_types',
                    storeID: 'audittypesstr',
                    formBind: true,
                    ui: 'soft-blue',
                    action_url: 'auditManagement/saveAuditType',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
})
Ext.define('Admin.view.commoninterfaces.ReceiptingGenericPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'receiptingGenericPnl',
    controller: 'commoninterfacesVctr',
    height: Ext.Element.getViewportHeight() - 118,
    layout: 'border',
    viewModel: {
        type: 'configurationsvm'
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        ui: 'footer',
        height: 35,
        height: 60,
        defaults: {
            labelAlign: 'top',
            margin: '-12 5 0 5',
            labelStyle: "color:#595959;font-size:13px"
        },
        items: ['->', {
            xtype: 'displayfield',
            name: 'process_name',
            fieldLabel: 'Process',
            fieldStyle: {
                'color': 'green',
                'font-weight': 'bold',
                'font-size': '12px'
            }
        }, {
                xtype: 'tbseparator',
                width: 20
            }, {
                xtype: 'displayfield',
                name: 'workflow_stage',
                fieldLabel: 'Workflow Stage',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '12px'
                }
            }, {
                xtype: 'tbseparator',
                width: 20
            }, {
                xtype: 'displayfield',
                name: 'application_status',
                fieldLabel: 'App Status',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '12px'
                }
            }, {
                xtype: 'tbseparator',
                width: 20
            }, {
                xtype: 'displayfield',
                name: 'tracking_no',
                fieldLabel: 'Tracking No',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '12px'
                }
            }, {
                xtype: 'displayfield',
                name: 'reference_no',
                fieldLabel: 'Ref No',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '12px'
                }
            }, {
                xtype: 'hiddenfield',
                name: 'process_id'
            }, {
                xtype: 'hiddenfield',
                name: 'workflow_stage_id'
            }, {
                xtype: 'hiddenfield',
                name: 'active_application_id'
            }, {
                xtype: 'hiddenfield',
                name: 'active_application_code'
            }, {
                xtype: 'hiddenfield',
                name: 'application_status_id'
            }, {
                xtype: 'hiddenfield',
                name: 'module_id'
            }, {
                xtype: 'hiddenfield',
                name: 'sub_module_id'
            }, {
                xtype: 'hiddenfield',
                name: 'section_id'
            }, {
                xtype: 'hiddenfield',
                name: 'applicant_id'
            }, {
                xtype: 'hiddenfield',
                name: 'application_code'
            }, {
                xtype: 'hiddenfield',
                name: 'prodclass_category_id'
            }, {
                xtype: 'hiddenfield',
                name: 'product_id'
            },{
                name: 'premise_id',
                xtype: 'hiddenfield'
            },{
                name: 'manufacturing_site_id',
                xtype: 'hiddenfield'
            },{
                name: 'gmp_type_id',
                xtype: 'hiddenfield'
            },{
                name: 'importexport_permittype_id',
                xtype: 'hiddenfield'
            }
        ]
    }
    ],
    items: [{
            xtype: 'toolbar',
            region: 'north',
            collapsible: true,
            collapsed: false,
            items: [{
                    xtype: 'displayfield',
                    fieldLabel: 'Application Details',
                    name: 'application_details',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '12px'
                    }
                },'->',{
                xtype: 'button',
                text: 'View All Application Details',
                iconCls: 'fa fa-eye',
                name: 'more_app_details',
                ui: 'soft-blue',
                isReadOnly: true,
                listeners: {
                    afterrender: 'add_application_details_tag'
                },
                handler: 'showApplicationMoreDetails'
            },{
                xtype: 'button',
                text: 'View Associated Documents',
                iconCls: 'fa fa-file-download',
                name: 'more_app_details',
                ui: 'soft-blue',
                winWidth: '60%',
                winTitle: 'Uploaded Documents',
                isReadOnly: true,
                handler: 'showPreviousNonGridPanelUploadedDocs'
            }]
        },{
            title: 'Generated Invoices',
            region: 'center',
            header: {
                style: {
                    backgroundColor: '#2eadf5'
                }
            },
            xtype: 'invoicepaymentverificationdetailsGrid'
        }],
    initComponent: function () {
        var me = this;
        this.bbar = {
            reference: 'navigation-toolbar',
            ui: 'footer',
            items: [{
                xtype: 'transitionsbtn'
            },'->',
                {
                    text: 'Submit Application',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-check',
                    name: 'process_submission_btn',
                    storeID: 'commonuseregistrationstr',
                    table_name: '',
                    winWidth: '50%'
                }
            ]
        };
        me.callParent(arguments);
    }
});
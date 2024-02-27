
Ext.define('Admin.view.commoninterfaces.PaymentVerificationPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'paymentVerificationPnl',
    //height: Ext.Element.getViewportHeight() - 118,
    layout: 'border',
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
                name: 'premise_id',
                xtype: 'hiddenfield'
            },{
                name: 'premise_type_id',
                xtype: 'hiddenfield'
            },{
                name: 'importexport_permittype_id',
                xtype: 'hiddenfield'
            }
        ]
    }
    ],
    items: [{
        title: 'Other Details',
        region: 'north',
        width: 200,
        name: 'other_details',
      //  collapsed: true,
        collapsible: true,
        collapsed: false,
        titleCollapse: true,
        items: [
            {
                xtype: 'form',
                bodyPadding: 5,
                layout: 'column',
                defaults: {
                    margin: 2,
                    labelAlign: 'top',
                    columnWidth: 0.5
                },
                fieldDefaults: {
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    }
                },
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Applicant Details',
                        name: 'applicant_details',
                        padding: 10
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Product Details',
                        name: 'product_details',
                        hidden: true
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Premise Details',
                        name: 'premise_details',
                        hidden: true
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Promotion And Advertisement Details',
                        name: 'promotion_materials_details',
                        hidden: true
                    },
                    {
                        xtype: 'toolbar',
                        ui: 'footer',
                        columnWidth: 1,
                        items: [{xtype:'tbfill'},
                            {
                                text: 'View Application Details',
                                iconCls: 'fa fa-bars',
                                name: 'more_app_details',
                                isReadOnly: 1,
                                is_temporal: 0
                            }
                        ]
                    }
                ]
            }
        ]
    },{
      xtype:'tabpanel',
      title: 'Payment Details',region:'center',
      layout:'fit',
      items:[{
            xtype: 'invoicepaymentverificationdetailsGrid',
            title:'Invoice & Payment Details'
        },{
            title: 'Customer Uploaded Payments Details',
            xtype: 'uploadedapplicationpaymentsgrid'
        }]
    }],
    initComponent: function () {
        var me = this;
        this.bbar = {
            reference: 'navigation-toolbar',
            ui: 'footer',
            items: ['->', {
                    text: 'Return Back Application',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-check',
                    name: 'process_returnsubmission_btn',
                    storeID: 'commonuseregistrationstr',
                    table_name: '',
                    winWidth: '50%'
                },
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
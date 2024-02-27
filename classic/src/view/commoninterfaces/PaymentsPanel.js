Ext.define('Admin.view.commoninterfaces.PaymentsPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'paymentspanel',
    layout: {
        type: 'border'
    },
    defaults: {
        split: true
    },
    itemId: 'paymentspanelRefId',
    tbar: [],
    items:[{
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
                            name: 'applicant_details'
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
        },
        {
            xtype: 'tabpanel',
            region: 'center',
            layout: 'fit',
            dockedItems:[{
                xtype: 'toolbar',
                dock: 'bottom',
                //flex: 0.2,
                width: '100%',
                height: 30,
                padding: '0 0 0 5',
                ui: 'footer',
                items: [{
                        xtype: 'displayfield',
                        //flex: 0.1,
                        labelWidth: 860,
                        margin: '0 0 0 42',
                        fieldLabel: 'RUNNING BALANCE',
                        labelStyle: 'font-weight:bold;color:red',
                        name: 'running_balance',
                        fieldStyle: {
                            'color': 'red'
                        }
            }]
            }],
            items: [{
                title: 'Invoice Details',
                xtype: 'paymentinvoicingcostdetailsgrid',
                 
            },{
                title: 'Customer Uploaded Payments Details',
                xtype: 'uploadedapplicationpaymentsgrid',
                 
            }
        //     ,{
        //         title: 'Payments/Receipting',
        //         scrollable: true,
        //         hidden: true,
        //         layout: 'fit',
        //         xtype: 'applicationpaymentsgrid',
        //        features:[{
        //            ftype:'searching'
        //        }]
        // }
        ],
            
        },
        
        {
            xtype: 'toolbar',
            ui: 'footer',
            region: 'south',
            height: 45,
            split: false,
            items: [
                
                '->',
                {
                    xtype: 'button',
                    text: 'Receive Payments',
                    iconCls: 'x-fa fa-plus',
                    ui: 'soft-blue',
                    winTitle: 'Account Transactions',
                    winWidth: '60%',
                    hidden: true,
                    name: 'receive_payments',
                    childXtype: 'paymentsreceptionfrm',
                    stores: '["receipttypestr","paymentmodesstr","banksstr"]'
                },
                {
                    text: 'Submit Application',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-check',
                    hidden: true,
                    name: 'process_submission_btn',
                    storeID: 'commonuseregistrationstr',
                    table_name: 'tra_premises_applications',
                    winWidth: '50%'
                }
            ]
        }
    ]
});
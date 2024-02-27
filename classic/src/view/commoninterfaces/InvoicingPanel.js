/**
 */
Ext.define('Admin.view.commoninterfaces.InvoicingPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'invoicingpanel',
    layout: {
        type: 'border'
    },
    defaults: {
        split: true
    },
    items: [
        {
            title: 'Cost Elements',
            region: 'center',
            layout: 'vbox',
            items: [
                {
                    xtype: 'invoicingcostelementsgrid',
                    flex: 1
                },
                {
                    xtype: 'toolbar',
                    ui: 'footer',
                    height: 45,
                    width: '100%',
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'isLocked'
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Paying Currency',
                            labelWidth: 120,
                            labelStyle: 'font-weight:bold',
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'combo', anyMatch: true,
                            name: 'paying_currency_id',
                            forceSelection: true,
                            displayField: 'name',
                            valueField: 'id',
                            queryMode: 'local',
                            emptyText: 'Select Paying Currency',
                            width: 240,
                            anyMatch: true,
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            },
                            listeners: {
                                beforerender: {
                                    fn: 'setCompStore',
                                    config: {
                                        pageSize: 1000,
                                        storeId: 'currenciesstr',
                                        proxy: {
                                            extraParams:{
                                                table_name: 'par_currencies'
                                            }
                                        }
                                    },
                                    isLoad: true
                                }
                                
                            }
                        },
                        {
                            xtype: 'tbspacer',
                            width: 20
                        },
                        {
                            xtype: 'checkbox',
                            fieldLabel: 'Is Fast Track',
                            name: 'is_fast_track',
                            inputValue: 1,
                            labelWidth: 90,
                            uncheckedValue: 2,
                            labelStyle: 'font-weight:bold'
                        },
                        '->',
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Invoice No',
                            name: 'invoice_no',
                            labelWidth: 90,
                            value: '****',
                            labelStyle: 'font-weight:bold',
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'tbspacer',
                            width: 10
                        }
                    ]
                },
                {
                    xtype: 'invoicingcostdetailsgrid',
                    flex: 0.9
                }
            ]
        },
        {
            title: 'Other Details',
            region: 'north',
            width: 200,
            collapsed: false,
            collapsible: true,
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
                            xtype: 'toolbar',
                            ui: 'footer',
                            columnWidth: 1,
                            items: [
                                {
                                    text: 'View Application Details',
                                    iconCls: 'fa fa-bars',
                                    name: 'more_app_details',
                                    isReadOnly: 1,
                                    is_temporal: 0
                                },{
                                    text: 'Variation Request',
                                    iconCls: 'fa fa-bars',
                                    name: 'variation_requests',
                                    hidden: true,
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
            xtype: 'toolbar',
            ui: 'footer',
            region: 'south',
            height: 45,
            split: false,
            items: [
                {
                    xtype: 'transitionsbtn'
                },
                {
                    xtype: 'applicationdismissalbtn'
                },
                {
                    text: 'Print Invoice',
                    ui: 'soft-blue',
                    name: 'print_invoice',
                    iconCls: 'fa fa-print',
                    report_type: 'Invoice'
                },
                {
                    text: 'Remove Selected Items',
                    ui: 'soft-blue',
                    name: 'remove_selected',
                    iconCls: 'fa fa-close',
                    disabled: true
                },
                {
                    text: 'Delete Invoice',
                    ui: 'soft-blue',
                    name: 'delete_invoice',
                    hidden: true,
                    iconCls: 'fa fa-trash-o'
                },
                {
                    text: 'Refresh',
                    hidden: true,
                    ui: 'soft-blue',
                    iconCls: 'fa fa-refresh',
                    handler: function () {
                        var panel = this.up('panel'),
                            store = panel.down('invoicingcostdetailsgrid').getStore(),
                            store2 = panel.down('invoicingcostelementsgrid').getStore();
                        store.load();
                        store2.load();
                    }
                },
                '->',
                {
                    text: 'Save/Update Invoice Details',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-save',
                    name: 'save_btn',
                    toaster: 1,
                    isLocked: 0,
                    isSubmission: 0
                },
                {
                    text: 'Generate/Confirm Invoice Details',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-save',
                    name: 'commit_btn',
                    toaster: 1,
                    isLocked: 1,
                    isSubmission: 0
                },
                {
                    text: 'Submit Application',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-check',
                    name: 'process_submission_btn',
                    winWidth: '50%',
                    toaster: 0,
                    isLocked: 1,
                    isSubmission: 1
                }
            ]
        }
    ]
});
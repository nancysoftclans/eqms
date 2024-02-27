/**
 * user robinson odhiambo
 * Kip on 9/24/2018.
 */
Ext.define('Admin.view.commoninterfaces.ImportPermitInvoicingPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.importpermitinvoicingpanel',
    padding: '2 0 2 0',
    autoScroll: true,
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
            items: [ {
                    xtype: 'toolbar',
                    ui: 'footer',
                    height: 80,
                    width: '100%',
                    name: 'invoicing_details',
                    defaults:{
                        labelWidth: 108,
                        width: 280,
                        labelAlign: 'top'
                    },
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'isLocked'
                        },{
                            xtype: 'hiddenfield',
                            name: 'application_feetype_id',
                            value:6
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: 'Request FOB Value',
                            name: 'permit_fob_value',
                            readOnly: true,labelWidth: 108,
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'combo', anyMatch: true,
                            name: 'permit_currency_id',
                            forceSelection: true,
                            displayField: 'name',
                            valueField: 'id',
                            queryMode: 'local', 
                            fieldLabel: 'Request Proforma Currency',
                            anyMatch: true,
                            readOnly: true,
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            },
                            listeners: {
                                afterrender: {
                                    fn: 'setWorkflowCombosStore',
                                    config: {
                                        pageSize: 10000,
                                        proxy: {
                                            extraParams: {
                                                table_name: 'par_currencies'
                                            }
                                        }
                                    },
                                    isLoad: true
                                }
                            }
                        },
                        ,{
                            xtype: 'checkbox',
                            fieldLabel: 'Is Fast Track',
                            name: 'is_fast_track',
                            inputValue: 1,
                            labelWidth: 90,
                            hidden: true,
                            uncheckedValue: 0,
                            labelStyle: 'font-weight:bold'
                        },
                        {
                            xtype: 'tbspacer',
                            width: 20
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
                        },{

                            xtype: 'hiddenfield',
                            name: 'invoice_id'
                        }
                    ]
                },
                {
                    xtype: 'importinvoicingcostdetailsgrid',
                    flex: 0.9
                }
            ]
        },
        {
            title: 'Other Details',
            region: 'north',
            width: 200,
            
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
                        },{
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
                    ui: 'soft-blue',
                    iconCls: 'fa fa-refresh',
                    handler: function () {
                        var panel = this.up('panel'),
                            store = panel.down('importinvoicingcostdetailsgrid').
                        store.load();
                    }
                },
                '->',
                {
                    text: 'Save/Update Invoice Details',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-save',
                    name: 'save_btn',
                    hidden: true,
                    toaster: 1,
                    isLocked: 0,
                    isSubmission: 0
                },
                {
                    text: 'Generate/Confirm Invoice Details',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-save',
                    application_feetype_id: 6,
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

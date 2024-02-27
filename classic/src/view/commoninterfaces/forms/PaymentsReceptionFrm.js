/**
 */
Ext.define('Admin.view.commoninterfaces.forms.PaymentsReceptionFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'paymentsreceptionfrm',
    controller: 'commoninterfacesVctr',
    frame: true,
    bodyPadding: 5,
    items: [
        {
            xtype: 'hiddenfield',
            name: 'id'
        },{
            xtype: 'hiddenfield',
            name: 'invoice_no'
        },{
            xtype: 'hiddenfield',
            name: 'invoice_id'
        },
        {
            xtype: 'panel',
            layout: 'accordion',
            items: [
                {
                    xtype: 'panel',
                    hidden: true
                },
                {
                    xtype: 'panel',
                    title: 'Company/Applicant Details',
                    layout: 'column',
                    frame: true,
                    defaults: {
                        columnWidth: 0.5,
                        margin: 2
                    },
                    fieldDefaults: {
                        fieldStyle: {
                            'color': 'green',
                            'font-weight': 'bold'
                        }
                    },
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'applicant_id'
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Name',
                            name: 'applicant_name',
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Contact Person',
                            name: 'contact_person',
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Postal Address',
                            name: 'postal_address',
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Physical Address',
                            name: 'physical_address',
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'District',
                            name: 'district_name',
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Region/State',
                            name: 'region_name',
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Country',
                            name: 'country_name',
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Telephone',
                            name: 'telephone_no',
                            fieldStyle: {
                                'color': 'green',
                                'font-weight': 'bold'
                            }
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            layout: 'column',
            defaults: {
                columnWidth: 0.33,
                margin: 3,
                labelAlign: 'top'
            },
            fieldDefaults: {
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold'
                }
            },
            items: [
                {
                    xtype: 'datefield',
                    fieldLabel: 'Transaction Date',
                    maxValue: new Date(),
                    name: 'trans_date',
                    submitFormat: 'Y-m-d',
                    allowBlank: false
                },
                {
                    xtype: 'combo', anyMatch: true,
                    fieldLabel: 'Currency',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    forceSelection: true,
                    readOnly: true,
                    name: 'currency_id',
                    allowBlank: false,
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
                    xtype: 'numberfield',
                    fieldLabel: 'Amount',
                    minValue: 1,
                    name: 'amount_paid',
                    allowBlank: false
                },
                {
                    xtype: 'combo', anyMatch: true,
                    fieldLabel: 'Receipt Type',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    forceSelection: true,
                    name: 'receipt_type_id',
                    allowBlank: false,
                    listeners: {
                        beforerender: {
                            fn: 'setCompStore',
                            config: {
                                pageSize: 1000,
                                storeId: 'receipttypestr',
                                proxy: {
                                    extraParams:{
                                        table_name: 'par_receipt_types'
                                    }
                                }
                            },
                            isLoad: true
                        },
                        change: function (cmb, newVal) {
                            var form = cmb.up('form'),
                                manual_receipt_no = form.down('textfield[name=manual_receipt_no]');
                            if (newVal == 2 || newVal === 2) {
                                manual_receipt_no.setVisible(true);
                            } else {
                                manual_receipt_no.setVisible(false);
                            }
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Manual Receipt No',
                    name: 'manual_receipt_no',
                    hidden: true
                },
                {
                    xtype: 'combo', anyMatch: true,
                    fieldLabel: 'Payment Mode',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    forceSelection: true,
                    name: 'payment_mode_id',
                    allowBlank: false,
                    listeners: {
                        beforerender: {
                            fn: 'setCompStore',
                            config: {
                                pageSize: 1000,
                                storeId: 'paymentmodesstr',
                                proxy: {
                                    extraParams:{
                                        table_name: 'par_payment_modes'
                                    }
                                }
                            },
                            isLoad: true
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Bank Payment Reference No',
                    name: 'trans_ref'
                },
                {
                    xtype: 'combo', anyMatch: true,
                    fieldLabel: 'Bank Name',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    forceSelection: true,
                    name: 'bank_id',
                    allowBlank: false,
                    listeners: {
                        beforerender: {
                            fn: 'setCompStore',
                            config: {
                                pageSize: 1000,
                                storeId: 'banksstr',
                                proxy: {
                                    extraParams:{
                                        table_name: 'par_banks'
                                    }
                                }
                            },
                            isLoad: true
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Drawer',
                    name: 'drawer'
                },
                {
                    xtype: 'textarea',
                    fieldLabel: 'Reason for Non-Electronic Payment',
                    name: 'non_electronic_reason',
                    columnWidth: 1,
                    allowBlank: false
                }
            ]
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: [
                '->',
                {
                    xtype: 'button',
                    text: 'Save Details',
                    ui: 'soft-blue',
                    iconCls: 'x-fa fa-save',
                    formBind: true,
                    table_name: 'tra_payments',
                    action_url: 'revenuemanagement/saveApplicationPaymentDetails',
                    name: 'save_details',
                    storeID: 'applicationApprovedQuotationStr'
                },
                {
                    xtype: 'button',
                    text: 'Clear',
                    ui: 'soft-blue',
                    iconCls: 'x-fa fa-close',
                    action: 'save_requery',
                    action_url: '',
                    handler: ''
                }
            ]
        }
    ]
});
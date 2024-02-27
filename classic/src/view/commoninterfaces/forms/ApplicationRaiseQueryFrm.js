/**
 */
Ext.define('Admin.view.commoninterfaces.forms.ApplicationRaiseQueryFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'applicationRaiseQueryFrm',
    controller: 'commoninterfacesVctr',
    itemId: 'applicationRaiseQueryFrmId',
    height: Ext.Element.getViewportHeight() - 118,
    autoScroll: true,
    scrollable: true,
    // frame: true,
    layout: {
        type: 'column'
    },
    bodyPadding: 5,
    defaults: {
        margin: 5,
        labelAlign: 'top',
        columnWidth: 1,
        allowBlank: false
    },
    items: [
        {
            xtype: 'hiddenfield',
            name: 'table_name',
            value: 'tra_checklistitems_queries'
        },{
            xtype: 'hiddenfield',
            name: 'module_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'sub_module_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'section_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'application_code'
        },{
            xtype: 'hiddenfield',
            name: 'application_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'workflow_stage_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'query_id'
        },{
            xtype: 'hiddenfield',
            name: 'invoice_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'process_id'
        },{
            xtype: 'hiddenfield',
            name: 'is_manager_review'
        },{
            xtype: 'hiddenfield',
            name: 'status_id'
        },
        {
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        },{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Query Category',
            name: 'query_processstage_id',
            forceSelection: true,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            allowBlank: false,
            listeners: {
                beforerender: {
                    fn: 'setParamCombosStore',
                    config: {
                        pageSize: 10000,
                        proxy: {
                            
                            extraParams: {
                                table_name: 'par_query_processstages'
                            }
                        }
                    },
                    isLoad: true
                },
                change:function(cbo,value){
                            var frm = cbo.up('form'), 
                            query_typeStr = frm.down('combo[name=query_type_id]').getStore(),
                            filters = {query_processstage_id: value},
                            filters = JSON.stringify(filters);
                            query_typeStr.load({params:{filters:filters}});
                }
            }
        },{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Request for Additional Information/Query Type',
            name: 'query_type_id',
            forceSelection: true,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            allowBlank: false,
            listeners: {
                beforerender: {
                    fn: 'setParamCombosStore',
                    config: {
                        pageSize: 10000,
                        proxy: {
                            
                            extraParams: {
                                table_name: 'par_query_types'
                            }
                        }
                    },
                    isLoad: false
                }
            }
        },
        // {
        //     xtype: 'combo', anyMatch: true,
        //     fieldLabel: 'is Checklist Based Query ',
        //     name: 'is_structured',
        //     forceSelection: true,
        //     queryMode: 'local',
        //     displayField: 'name',
        //     valueField: 'id',
        //     allowBlank: false,
        //     listeners: {
        //         beforerender: {
        //             fn: 'setParamCombosStore',
        //             config: {
        //                 pageSize: 10,
        //                 proxy: {
                            
        //                     extraParams: {
        //                         table_name: 'par_confirmations'
        //                     }
        //                 }
        //             },
        //             isLoad: true
        //         },
        //         // change: 'toggleQueryChecklistView'
        //     }
        // },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Requires Payment',
            name: 'has_payment',
            forceSelection: true,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            hidden: true,
            allowBlank: true,
            listeners: {
                beforerender: {
                    fn: 'setParamCombosStore',
                    config: {
                        pageSize: 10,
                        proxy: {
                            
                            extraParams: {
                                table_name: 'par_confirmations'
                            }
                        }
                    },
                    isLoad: true
                },
                change: function(combo, newVal, oldVal, eopts){
                    var form = combo.up('form'),
                        inv_btn = form.down('button[name=generate_invoice]'),
                        reasonfield = form.down('textarea[name=reason_for_non_payment]');
                    if(newVal == 1){
                        reasonfield.setVisible(false);
                        reasonfield.allowBlank = true;
                        reasonfield.validate();
                        reasonfield.setValue('');
                        inv_btn.setVisible(true);
                    }else{
                        reasonfield.setVisible(true);
                        reasonfield.allowBlank = false;
                        inv_btn.setVisible(false);
                        reasonfield.validate();
                    }
                }
            }
        },
        {
            xtype: 'textarea',
            fieldLabel: 'Reason for Not Issuing Invoice',
            name: 'reason_for_non_payment',
            hidden: true,
            allowBlank: true
        },{
            xtype: 'htmleditor',
            fieldLabel: 'Query',
            name: 'query_txt',
            resizable: true,
            allowBlank: false
        },{
            xtype: 'textarea',
            fieldLabel: 'Query Remarks/Comment',
            name: 'query_remark',
            allowBlank: true
        },{
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Manager Approval Decision',
            name: 'approval_decision_id',
            forceSelection: true,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            hidden: true,
            allowBlank: true,
            listeners: {
                beforerender: {
                    fn: 'setParamCombosStore',
                    config: {
                        pageSize: 10,
                        proxy: {
                            
                            extraParams: {
                                table_name: 'par_approval_decisions'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
        {
            xtype: 'textarea',
            fieldLabel: 'Manager Remark',
            hidden: true,
            name: 'manager_remark',
            allowBlank: true
        },
        {
            xtype: 'htmleditor',
            fieldLabel: 'Query Responses',
            // hidden: true,
            name: 'query_response',
            allowBlank: true
        },
        {
            xtype: 'htmleditor',
            fieldLabel: 'Query Responses Comments',
            // hidden: true,
            name: 'query_response_comments',
            allowBlank: true
        },
        {
            xtype: 'datefield',
            fieldLabel: 'Query Responses Date',
            // hidden: true,
            value: new Date(),
            altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00',
            name: 'responded_on',
            allowBlank: true
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->',{
                    text: 'Generate Invoce',
                    name: 'generate_invoice',
                    handler: 'GenerateQueryInvoice',
                    iconCls: 'x-fa fa-credit-card',
                    hidden: true,
                    ui: 'soft-blue'
                },{
                    text: 'View Invoce',
                    name: 'print_invoice',
                    handler: 'ViewQueryInvoice',
                    iconCls: 'x-fa fa-print',
                    hidden: true,
                    ui: 'soft-blue'
                },
                {
                    xtype: 'button',
                    text: 'Save Query',
                    ui: 'soft-blue',
                    nextStep: 1,
                    iconCls: 'x-fa fa-forward',
                    name: 'qry_tochecklist_btn',
                    formBind: true,
                    action: 'save_query',
                    action_url: 'common/saveChecklistApplicationQuery',
                    handler: 'saveChecklistApplicationQuery'
                }
            ]
        }
    ],
    listeners: {
        afterrender: function (form) {
            var query_id = form.down('hiddenfield[name=query_id]').getValue(),
                status_id = form.down('hiddenfield[name=status_id]').getValue(),
                invoice_id = form.down('hiddenfield[name=invoice_id]').getValue(),
                record = form.getValues(),
                has_payment = record.has_payment,
                query_type = record.query_type_id,
                is_manager_review = form.down('hiddenfield[name=is_manager_review]').getValue();

            if(is_manager_review && status != 4){
                form.down('textarea[name=manager_remark]').setVisible(true);
                form.down('combo[name=approval_decision_id]').setVisible(true);
                // form.down('htmleditor[name=query_response]').setVisible(true);
                // form.down('combo[name=has_payment]').setVisible(true);
                // if(invoice_id){
                    // form.down('button[name=print_invoice]').setVisible(true);
                    // form.down('button[name=generate_invoice]').setVisible(false);
                    // form.down('combo[name=has_payment]').setReadOnly(true);
                // }else{
                    // form.down('button[name=generate_invoice]').setVisible(true);
                // } 
            }
        }
    }
});
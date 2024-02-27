
Ext.define('Admin.view.workflowmanagement.views.forms.WorkflowTransitionsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'workflowtransitionsfrm',
    autoScroll: true,
    frame: true,
    controller: 'workflowmanagementvctr',
    height: Ext.Element.getViewportHeight() - 118,
    layout: 'column',
    bodyPadding: 8,
    defaults: {
        //labelAlign: 'right',
        labelWidth: 130,
        allowBlank: false,
        columnWidth: 1,
        margin: 5,
        labelStyle: 'font-weight:bold'
    },
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'wf_workflow_transitions',
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
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'id',
        margin: '0 20 20 0',
        name: 'workflow_id',
        allowBlank: true
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Stage(From/Prev)',
        name: 'stage_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'workflow/getWorkflowStages'
                    }
                },
                isLoad: true
            },
            afterrender: 'addWorkflowId',
            change: 'addWorkflowStageId'
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Action',
        name: 'action_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'workflow/getWorkflowActions'
                    }
                },
                isLoad: false
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Next Stage',
        name: 'nextstage_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'workflow/getWorkflowStages'
                    }
                },
                isLoad: true
            },
            afterrender: 'addWorkflowId',
            change: function (cmbo, newVal) {
                var frm = cmbo.up('form'),
                    prevStage = frm.down('combo[name=stage_id]').getValue();
                if (!prevStage) {
                    toastr.warning('Select Stage(From/Prev) first!!', 'Warning Response');
                    cmbo.reset();
                    return false;
                } else if (newVal == prevStage || newVal === prevStage) {
                    toastr.warning('Stage(From/Prev) and Next Stage cannot be the same!!', 'Warning Response');
                    cmbo.reset();
                    return false;
                }
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Application Status',
        name: 'application_status_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'workflow/getApplicationStatuses'
                    }
                },
                isLoad: false
            },
            afterrender: function () {
                var store = this.store,
                    form = this.up('form'),
                    workflow_id = form.down('hiddenfield[name=workflow_id]').getValue();
                store.removeAll();
                store.load({params: {workflow_id: workflow_id}});
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Is Payment Transition',
        name: 'is_paymenttransition',
        valueField: 'id',
        value: 2,
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        store: 'confirmationstr',
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'is_approval_decision_confirmation',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        fieldLabel: 'Is Approval Decision Confirmation Transition?',
        store: 'confirmationstr',
        value: 2,
        listeners: {
            change: function(combo, newVal, oldVal, eopts){
                var form = combo.up('form'),
                    certificate_confirmation_decision = form.down('combo[name=approval_decision_confirmation_id]');
                if(newVal == 1){
                    certificate_confirmation_decision.setVisible(true);
                    certificate_confirmation_decision.allowBlank = false;
                }else{
                    certificate_confirmation_decision.setVisible(false);
                    certificate_confirmation_decision.clearValue();
                    certificate_confirmation_decision.allowBlank = true;
                }   
                certificate_confirmation_decision.validate();          
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        name: 'approval_decision_confirmation_id',
        valueField: 'id',
        displayField: 'name',
        allowBlank: true,
        forceSelection: true,
        queryMode: 'local',
        hidden: true,
        fieldLabel: 'Certificate Confirmation Decision',
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'commonparam/getCommonParamFromTable',
                        extraParams: {
                            table_name: 'par_approval_decision_responses'
                        }
                    }
                },
                isLoad: true
            }
           
        }
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'is_multi_submission',
        store: 'confirmationstr',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        fieldLabel: 'Is Multi Submission?',
        value: 2,
        listeners: {
            change: function (cmb, newVal) {
                var form = cmb.up('form'),
                 multinextstage = form.down('combo[name=multinextstage_id]');
                if (newVal == 1 || newVal === 1) {
                    multinextstage.allowBlank = false;
                    multinextstage.validate();
                    multinextstage.setVisible(true);
                } else {
                    multinextstage.allowBlank = true;
                    multinextstage.validate();
                    multinextstage.setVisible(false);
                }
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'multinextstage_id',
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        allowBlank: true,
        hidden: true,
        fieldLabel: 'Second Stage Defination',
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'workflow/getWorkflowStages'
                    }
                },
                isLoad: true
            },
            afterrender: 'addWorkflowId'
        }
    }, {
        xtype: 'textarea',
        fieldLabel: 'Description',
        name: 'description',
        allowBlank: true
    }],
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: ['->', {
                text: 'Save Details',
                iconCls: 'x-fa fa-save',
                action: 'save',
                table_name: 'wf_workflow_transitions',
                storeID: 'workflowtransitionsstr',
                formBind: true,
                ui: 'soft-purple',
                action_url: 'workflow/saveWorkflowTransition',
                handler: 'doCreateWorkflowParamWin'
            }, {
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

Ext.define('Admin.view.workflowmanagement.views.forms.WorkflowStagesFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'workflowstagesfrm',
    autoScroll: true,
    controller: 'workflowmanagementvctr',
    layout: 'column',
    frame: true,
    bodyPadding: 5,
    height: Ext.Element.getViewportHeight() - 280,
    defaults: {
        labelAlign: 'top',
        allowBlank: false,
        columnWidth: 1,
        margin: 2
    },
    items: [{
        xtype: 'hiddenfield',
        name: 'table_name',
        value: 'wf_workflow_stages',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        //margin: '0 20 20 0',
        name: '_token',
        value: token,
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'id',
        name: 'id',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        name: 'workflow_id'
    }, {
        xtype: 'hiddenfield',
        name: 'module_id'
    },{
        xtype: 'hiddenfield',
        name: 'sub_module_id'
    }, {
        xtype: 'textfield',
        fieldLabel: 'Name',
        name: 'name'
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'stage_status',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        value: 2,
        columnWidth: 0.33,//0.4,
        queryMode: 'local',
        fieldLabel: 'Stage/State Status',
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 100,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'wf_workflowstages_statuses'
                        }
                    }
                },
                isLoad: true
            }
        }
    }, {
        xtype: 'numberfield',
        fieldLabel: 'Order No',
        name: 'order_no',
        allowBlank: true,
        columnWidth: 0.33,//0.2
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'is_general',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.4,
        fieldLabel: 'Is General?',
        store: 'confirmationstr',
        value: 2
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'stage_category_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.4,
        allowBlank: true,
        fieldLabel: 'Stage Category?',
        value: 2,
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'wf_stage_categories'
                        }
                    }
                },
                isLoad: true
            }
           
        }
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'is_manager_query',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.2,
        fieldLabel: 'Manager Query?',
        store: 'confirmationstr',
        value: 2
    },{
        xtype: 'combo', anyMatch: true,
        name: 'is_manager_precheckingquery',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.4,
        fieldLabel: 'Manager Prechecking Query?',
        store: 'confirmationstr',
        value: 2
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'is_manager_query_response',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.4,
        fieldLabel: 'Manager Query Response?',
        store: 'confirmationstr',
        value: 2
    },{
        xtype: 'combo', anyMatch: true,
        name: 'is_screeningquery_response',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.4,
        fieldLabel: 'Screening Query Response?',
        store: 'confirmationstr',
        value: 2
    },{
        xtype: 'combo', anyMatch: true,
        name: 'is_portalapp_initialstage',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.4,
        allowBlank:true,
        fieldLabel: 'Portal Application Initial Stage?',
        store: 'confirmationstr',
        value: 2
    },{
        xtype: 'combo', anyMatch: true,
        name: 'is_portalapp_previousstage',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.4,
        fieldLabel: 'Act as Portal Previous Stage?',
        store: 'confirmationstr',
        value: 2
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'needs_responsible_user',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.4,
        fieldLabel: 'Needs Responsible User?',
        store: 'confirmationstr',
        value: 1
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'is_inspection',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.2,
        fieldLabel: 'Is Inspection?',
        store: 'confirmationstr',
        value: 2
    },{
        xtype: 'combo', anyMatch: true,
        name: 'is_inspassessment_stage',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.3,
        fieldLabel: 'Is Inspection/Assessment/Evaluation Stage?',
        store: 'confirmationstr',
        value: 2
    }, {
        xtype: 'combo', anyMatch: true,
        name: 'is_manager_submission',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.3,
        fieldLabel: 'Is Manager Submission(Set Schedule Details)?',
        store: 'confirmationstr',
        value: 2,
        listeners: {
            change: function(combo, newVal, oldVal, eopts){
                var form = combo.up('form'),
                    process_type = form.down('combo[name=process_type_id]');
                if(newVal == 1){
                    process_type.setVisible(true);
                    process_type.allowBlank = false;
                }else{
                    process_type.setVisible(false);
                    process_type.allowBlank = true;
                }   
                process_type.validate();          
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        name: 'process_type_id',
        valueField: 'id',
        displayField: 'name',
        allowBlank: true,
        forceSelection: true,
        queryMode: 'local',
        columnWidth: 0.33,//0.3,
        hidden: true,
        fieldLabel: 'Process Type',
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_process_types'
                        }
                    }
                },
                isLoad: true
            }
           
        }
    },{
        xtype: 'combo', anyMatch: true,
        name: 'appdismissal_allowed',
        valueField: 'id',
        displayField: 'name',
        columnWidth: 0.33,//0.3,
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        fieldLabel: 'Application Dismissal Allowed?',
        store: 'confirmationstr',
        value: 2
    },
    {
        xtype: 'combo', anyMatch: true,
        name: 'interface_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        columnWidth: 0.33,//0.4,
        queryMode: 'local',
        fieldLabel: 'Interface',
        anyMatch: true,
        listeners: {
            beforerender: {
                fn: 'setWorkflowCombosStore',
                config: {
                    pageSize: 100,
                    proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'wf_workflow_interfaces'
                        }
                    }
                },
                isLoad: true
            },
            // afterrender: function () {
            //     var store = this.getStore(),
            //         form = this.up('form'),
            //         module_id = form.down('hiddenfield[name=module_id]').getValue(),
            //         filterObj = {module_id: module_id},
            //         filterStr = JSON.stringify(filterObj);
            //     store.removeAll();
            //     store.load({params: {filter: filterStr}});
            // }
        }
    }, {
        xtype: 'textarea',
        fieldLabel: 'Description',
        name: 'description',
        allowBlank: true
    }],
    buttons: [
        {
            xtype: 'button',
            text: 'Save Details',
            iconCls: 'x-fa fa-save',
            action: 'save',
            table_name: 'wf_workflow_stages',
            storeID: 'workflowstagesstr',
            formBind: true,
            ui: 'soft-purple',
            action_url: 'workflow/saveWorkflowStage',
            handler: 'saveWorkflowStageDetails'
        }
    ]
});
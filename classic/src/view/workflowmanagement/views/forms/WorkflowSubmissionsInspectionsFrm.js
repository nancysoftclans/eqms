
Ext.define('Admin.view.workflowmanagement.views.forms.WorkflowSubmissionsInspectionsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'workflowsubmissionsinspectionsfrm',
    autoScroll: true,
    controller: 'workflowmanagementvctr',
    layout: 'form',
    frame: true,
    fieldDefaults: {
        fieldStyle: {
            'color': 'green',
            'font-weight': 'bold'
        }
    },
    config: {
        applicationSelectionMode: 'selected'
    },
    items: [{
        xtype: 'hiddenfield',
        name: 'application_id'
    }, {
        xtype: 'hiddenfield',
        name: 'application_code'
    }, {
        xtype: 'hiddenfield',
        name: 'process_id'
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
        name: 'curr_stage_id'
    }, {
        xtype: 'hiddenfield',
        name: 'table_name'
    }, {
        xtype: 'hiddenfield',
        name: 'workflowaction_type_id'
    },{
        xtype: 'hiddenfield',
        name: 'non_mainpanel_close'
    },{
        xtype: 'hiddenfield',
        name: 'is_dataammendment_request'
    },{
        xtype: 'hiddenfield',
        name: 'is_external_usersubmission'
    },{
        xtype: 'hiddenfield',
        name: 'is_inspection_submission'
    }, {
        xtype: 'hiddenfield',
        name: 'application_status_id'
    }, {
        xtype: 'hiddenfield',
        name: 'inspection_id'
    }, 
    {
        xtype: 'hiddenfield',
        name: 'has_queries'
    },
    {
        xtype: 'hiddenfield',
        name: 'is_manager_submission'
    },
    {
        xtype: 'hiddenfield',
        name: 'process_type_id'
    },
    {
        xtype: 'fieldset',
        layout: 'form',
        style: 'background:white;padding:0',
        collapsible: true,
        collapsed: true,
        title: 'Current Info',
        items: [
            {
                xtype: 'textfield',
                readOnly: true,
                fieldLabel: 'Process',
                name: 'process_name',
                allowBlank: true
            }, {
                xtype: 'textfield',
                readOnly: true,
                fieldLabel: 'Current Stage',
                name: 'current_stage_name',
                allowBlank: true
            }, {
                xtype: 'textfield',
                readOnly: true,
                fieldLabel: 'Application Status',
                name: 'application_status',
                allowBlank: true
            },
            {
                xtype: 'datefield',
                hidden: true,
                fieldLabel: 'Expected start date',
                name: 'expected_start_date',
                allowBlank: true
            },
            {
                xtype: 'datefield',
                hidden: true,
                fieldLabel: 'Expected End date',
                name: 'expected_end_date',
                allowBlank: true
            }
        ]
    }, {
        xtype: 'fieldset',
        layout: 'form',
        style: 'background:white;padding:0',
        defaults: {
            allowBlank: false
        },
        items: [
            {
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Action',
                name: 'action',
                store: 'submissionstageactionsstr',
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                forceSelection: true,
                listeners: {
                    afterrender: function () {
                        var store = this.store,
                            form = this.up('form'),
                            curr_stage = form.down('hiddenfield[name=curr_stage_id]').getValue(),
                            has_queries = form.down('hiddenfield[name=has_queries]').getValue();
                        store.removeAll();
                        store.load({params: {stage_id: curr_stage, has_queries: has_queries, is_submission: 1}});
                    },
                    change: 'setWorkFlowNextStageDetails'
                }
            }, {
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Next Stage',
                readOnly: true,
                store: 'submissionnextstagesstr',
                name: 'next_stage',
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                forceSelection: true,
                listeners: {
                    afterrender: function (cmb) {
                        var form = cmb.up('form'),
                            process_id = form.down('hiddenfield[name=process_id]').getValue(),
                            store = cmb.store;
                        store.removeAll();
                        store.load({params: {process_id: process_id}});
                    },
                    change: function (cmb, newVal) {
                        var thisStore = cmb.getStore(),
                            record = thisStore.getById(newVal),
                            needs_responsible_user = 1,
                            is_inspection = 1,
                            is_inspection_submission = 0,
                            form = cmb.up('form'),
                            responsible_users = form.down('combo[name=responsible_user]'),
                            current_stage_id = form.down('hiddenfield[name=curr_stage_id]').getValue(),
                            store = responsible_users.store,
                            inspection_id = form.down('hiddenfield[name=inspection_id]').getValue(),
                            module_id = form.down('hiddenfield[name=module_id]').getValue();
                        responsible_users.reset();
                        if (record && record != null) {
                            needs_responsible_user = record.get('needs_responsible_user');
                            is_inspection = record.get('is_inspection');
                            //is_inspection_submission = record.get('is_inspection_submission');
                        }
                        is_external_usersubmission = form.down('hiddenfield[name=is_external_usersubmission]').getValue();
                        is_inspection_submission = form.down('hiddenfield[name=is_inspection_submission]').getValue();
                       
                        if(is_external_usersubmission != 1){
                            if (needs_responsible_user == 2 || needs_responsible_user === 2) {
                                responsible_users.setVisible(false);
                                responsible_users.allowBlank = true;
                                responsible_users.validate();
                            } else if(is_inspection_submission != 0){
                                    responsible_users.setVisible(false);
                                    responsible_users.allowBlank = true;
                                    responsible_users.validate();
                            } else {
                                responsible_users.setVisible(true);
                                responsible_users.allowBlank = false;
                                responsible_users.validate();
                                store.load({
                                    params: {
                                        next_stage: newVal,
                                        is_inspection: is_inspection,
                                        module_id: module_id,
                                        inspection_id: inspection_id
                                    }
                                });
                            }
                        }
                       
                    }
                }
            },{
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Re-Invoicing Type',
                name: 'additionalpayment_type_id',
                valueField: 'id',
                displayField: 'name',
                forceSelection: true,
                queryMode: 'local',
                allowBlank: true,
                hidden: true,
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 10,
                            proxy: {
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_additionalpayment_types'
                                }
                            }
                        },
                        isLoad: true
                    }
                   
                }
                
            }, {
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Directive',
                name: 'directive_id',
                store: 'applicationreturnoptionsstr',
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                forceSelection: true,
                allowBlank: true,
                hidden: true
            }, {
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Status',
                readOnly: true,
                allowBlank: true,
                name: 'status',
                hidden: true
            }, {//selection set up is in store
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Responsible User',
                name: 'responsible_user',
                store: 'submissionresponsibleusersstr',
               // id: 'responsibleUserCombo',
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                forceSelection: true,
                anyMatch: true
            }, {
                xtype: 'combo', anyMatch: true,
                name: 'external_user_id',
                allowBlank: true,hidden: true,
                fieldLabel: 'Select External User',
                queryMode: 'local',
                valueField: 'id',
                displayField: 'fullnames', columnWidth: 0.7,
                listeners: {
                    afterrender: {
                        fn: 'setConfigCombosStore',
                        config: {
                            pageSize: 10000,
                            storeId: 'externalusersstr',
                            proxy: {
                                url: 'usermanagement/getExternalSystemUsers'
                            }
                        },
                        isLoad: true
                    }
                }

            },{
                xtype: 'combo', anyMatch: true,
                fieldLabel: 'Urgency',
                name: 'urgency',
                store: 'submissionsurgenciesstr',
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                forceSelection: true,
                value: 1,
                listeners: {
                    beforerender: function () {
                        var store = this.getStore();
                        store.removeAll();
                        store.load();
                    }
                }
            }, {
                xtype: 'textarea',
                name: 'remarks',
                fieldLabel: 'Remarks',
                allowBlank: true
            }
        ]
    }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [
                '->', {
                    text: 'Submit Application',
                    iconCls: 'x-fa fa-check-square',
                    name: 'app_submission_btn',
                    action: 'submit',
					gridXtype:'#premisesinspectionprocessgrid',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'workflow/handleManagersApplicationSubmissions'
                }, {
                    text: 'Close',
                    iconCls: 'x-fa fa-close',
                    ui: 'soft-purple',
                    handler: function (btn) {
                        btn.up('window').close();
                    }
                }
            ]
        }
    ]
});
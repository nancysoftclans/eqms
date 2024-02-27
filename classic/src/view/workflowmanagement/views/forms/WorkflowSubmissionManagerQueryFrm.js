
Ext.define('Admin.view.workflowmanagement.views.forms.WorkflowSubmissionManagerQueryFrm', {
    extend: 'Admin.view.workflowmanagement.views.forms.WorkflowSubmissionsGenericFrm',
    xtype: 'workflowsubmissionmanagerqueryfrm',
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
        name: 'application_status_id'
    },{
        xtype: 'hiddenfield',
        name: 'is_dataammendment_request'
    },{
        xtype: 'hiddenfield',
        name: 'is_external_usersubmission'
    },  {
        xtype: 'hiddenfield',
        name: 'has_queries'
    }, {
        xtype: 'hiddenfield',
        name: 'inspection_id'
    }, {
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
            }, {
                xtype: 'hiddenfield',
                name: 'gmpinspection_type_id'
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
                            gmpinspection_type_id = form.down('hiddenfield[name=gmpinspection_type_id]').getValue();
                        store.removeAll();
                        store.load({
                            params: {
                                stage_id: curr_stage,
                                gmpinspection_type_id: gmpinspection_type_id,
                                is_submission: 1
                            }
                        });
                    },
                    change: 'setManagerQueryWorkFlowNextStageDetails'
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
                    /*change: function (cmb, newVal) {
                        var form = cmb.up('form'),
                            responsible_users = form.down('combo[name=responsible_user]'),
                            store = responsible_users.store;
                        store.removeAll();
                        store.load({params: {next_stage: newVal}});
                    }*/
                    change: function (cmb, newVal) {
                        var thisStore = cmb.getStore(),
                            record = thisStore.getById(newVal),
                            needs_responsible_user = 1,
                            is_inspection = 0,
                            form = cmb.up('form'),
                            responsible_users = form.down('combo[name=responsible_user]'),
                            current_stage_id = form.down('hiddenfield[name=curr_stage_id]').getValue(),
                            store = responsible_users.store,
                            inspection_id = form.down('hiddenfield[name=inspection_id]').getValue(),
                            module_id = form.down('hiddenfield[name=module_id]').getValue();
                        if (record && record != null) {
                            needs_responsible_user = record.get('needs_responsible_user');
                            is_inspection = record.get('is_inspection');
                        }
                        store.removeAll();
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
                fieldLabel: 'Responsible User',
                name: 'responsible_user',
                id: 'responsibleUserCombo',
                store: 'submissionresponsibleusersstr',
                valueField: 'id',
                displayField: 'name',
                queryMode: 'local',
                forceSelection: true
            }, {
                xtype: 'combo', anyMatch: true,
                name: 'external_user_id',
                allowBlank: true,hidden: true,
                fieldLabel: 'Select External User',
                queryMode: 'local',
                valueField: 'id',
                displayField: 'fullnames',
                listeners: {
                    afterrender: {
                        fn: 'setConfigCombosStore',
                        config: {
                            pageSize: 10000,
                            proxy: {
                                url: 'usermanagement/getExternalSystemUsers'
                            }
                        },
                        isLoad: true
                    }
                }

            } , {
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
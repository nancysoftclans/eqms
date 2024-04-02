Ext.define('Admin.view.QMS.auditManagement.panels.AuditPlanningWizardPnl',{
    extend: 'Ext.panel.Panel',
    alias: 'widget.auditPlanningWizardPnl',
    padding: '2 0 2 0',

    requires: [
        'Ext.layout.container.*',
        'Ext.toolbar.Fill'
    ],
    reference: 'wizardpnl',
    layout: 'card',
    itemId: 'wizardpnl',
    //bodyPadding: 3,
    flex: 1,
    autoScroll: true,
    cls: 'wizard three shadow',
    colorScheme: 'soft-blue',

    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            ui: 'footer',
            height: 80,
            defaults: {
                labelAlign: 'top',
                margin: '-12 5 0 5',
                labelStyle: "color:#595959;font-size:13px"
            },
            items: [
                '->', {
                    xtype: 'displayfield',
                    name: 'process_name',
                    fieldLabel: 'Process',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '12px'
                    }
                },
                {
                    xtype: 'tbseparator',
                    width: 20
                },
                {
                    xtype: 'displayfield',
                    name: 'workflow_stage',
                    fieldLabel: 'Workflow Stage',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '12px'
                    }
                },
                {
                    xtype: 'tbseparator',
                    width: 20
                },
                {
                    xtype: 'displayfield',
                    name: 'application_status',
                    fieldLabel: 'App Status',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '12px'
                    }
                }, 
                {
                    xtype: 'tbseparator',
                    width: 20
                },
                {
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
                    name: 'status_type_id'
                },
            ]
        }
        
    ],
    items: [{
        xtype: 'tabpanel',
        layout: 'fit',
        defaults: {
            margin: 3
        },
        items: [
            {
                xtype: 'auditPlanMainDetailsFrm',
                title: 'MainDetails',
            }
        ]
    }],

    initComponent: function () {
         
        var me = this;
        this.tbar = {
            reference: 'progress',
            itemId: 'progress_tbar',
            defaultButtonUI: 'wizard-blue',
            cls: 'wizardprogressbar',
            style: {
                "color": "#90c258"
            },
            bodyStyle: {
                "background-color": "#90c258"
            },
            layout: {
                pack: 'center'
            },
        };
        this.bbar = {
            reference: 'navigation-toolbar',
            ui: 'footer',
            items: ['->',
                {
                    text: 'Save Audit Details',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-save',
                    name: 'save_btn',
                    bind: {
                        disabled: '{isReadOnly}'
                    },
                    action_url: 'saveNewAuditPlanDetails',
                    handler: 'saveNewAuditPlanDetails',

                },
                {
                    text: 'Submit Audit for Scheduling',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-check',
                    name: 'process_submission_btn',
                    winWidth: '50%',
                    handler: 'showReceivingApplicationSubmissionWin',
                }
            ]
        };
        me.callParent(arguments);
    }
})
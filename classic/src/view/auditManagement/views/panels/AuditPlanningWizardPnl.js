Ext.define('Admin.view.auditManagement.panels.AuditPlanningWizardPnl',{
    extend: 'Ext.panel.Panel',
    alias: 'widget.auditPlanningWizardPnl',
    //itemId: 'auditPlanningWizardPnl',
    padding: '2 0 2 0',

    requires: [
        'Ext.layout.container.*',
        'Ext.toolbar.Fill'
    ],
    viewModel: {
        type: 'auditplanvm'
    },
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
            height: 55,
            defaults: {
                labelAlign: 'top',
                margin: '-12 5 0 5',
                labelStyle: "color:#595959;font-size:10px"
            },
            items: [
                '->', {
                    xtype: 'displayfield',
                    name: 'process_name',
                    fieldLabel: 'Process',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '10px'
                    }
                },
                {
                    xtype: 'tbseparator',
                    width: 5
                },
                {
                    xtype: 'displayfield',
                    name: 'workflow_stage',
                    fieldLabel: 'Workflow Stage',
                    hidden: true,
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '10px'
                    }
                },
                {
                    xtype: 'displayfield',
                    name: 'application_status',
                    fieldLabel: 'Status',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '10px'
                    }
                },
                 {
                    xtype: 'tbseparator',
                    width: 5
                },
                {
                    xtype: 'displayfield',
                    name: 'tracking_no',
                    fieldLabel: 'Reference',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '10px'
                    }
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
            xtype: 'auditsmaindetailspnl',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    ui: 'footer',
                    dock: 'top',
                    margin: 3,
                }
            ],
        }, {
           // xtype: 'checklistresponsescmngrid',
            xtype: 'auditchecklistgrid',
            title: 'Questionnaire'
        },{
            xtype: 'auditfindingsgrid',
            title: 'Findings'
        },{
            xtype: 'docuploadsgrid',
            title: 'Associated document'
        },
        {
            xtype: 'hiddenfield',
            name: 'active_application_id'
        }
    ],

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
            bodystyle: {
                "color": "#90c258"
            },
            layout: {
                pack: 'center'
            },
            items: [
                
                {
                    step: 0,
                    iconCls: 'fa fa-university',
                    enableToggle: true,
                    pressed: true,
                    text: 'Audit Details',
                    max_step:3,
                    action: 'quickNav', wizard: 'auditPlanningWizardPnl',
                    handler: 'quickNavigation'
                }, {
                    step: 1,
                    iconCls: 'fa fa-clipboard',
                    enableToggle: true,
                    max_step:3,
                    text: 'Questionnaire',
                    action: 'quickNav', 
                    wizard: 'auditPlanningWizardPnl',
                    handler: 'quickNavigation'
                },{
                    step: 2,
                    iconCls: 'fa fa-search',
                    enableToggle: true,
                    max_step:3,
                    text: 'Findings',
                    action: 'quickNav', 
                    wizard: 'auditPlanningWizardPnl',
                    handler: 'quickNavigation'
                },{
                    step: 3,
                    iconCls: 'fa fa-link',
                    enableToggle: true,
                    max_step:3,
                    text: 'Associated items',
                    action: 'quickNav', 
                    wizard: 'auditPlanningWizardPnl',
                    handler: 'quickNavigation'
                }
            ]
        };
        this.bbar = {
            reference: 'navigation-toolbar',
            ui: 'footer',
            items: [{
                text: 'Logs',
                iconCls: 'x-fa fa-list',
                //handler: 'getAuditLogsClick'
                tooltip: 'View Logs',
                action: 'logs',
                childXtype: 'loggrid',
                winTitle: 'Logs',
                winWidth: '100%',
                handler: 'showLogGridwin'
            },'->',
                //  {
                //     text: 'Previous',
                //     ui: 'soft-blue',
                //     iconCls: 'fa fa-arrow-left',
                //     max_step:3,
                //     bind: {
                //         disabled: '{atBeginning}'
                //     },
                //     wizard:'auditPlanningWizardPnl',
                //     handler: 'onPrevCardClick'
                // },
                {
                    text: 'Save Audit Details',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-save',
                    name: 'save_btn',
                    bind: {
                        disabled: '{isReadOnly}'
                    },
                    wizard: 'auditPlanningWizardPnl',
                    form_panel:'#auditPlanMainDetailsFrm',
                    action_url: 'saveNewAuditPlanDetails',
                    handler: 'saveNewAuditPlanDetails',

                },
                {
                    text: 'Change Status',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-check',
                    name: 'process_submission_btn',
                    winWidth: '50%',
                    handler: 'showRAuditApplicationSubmissionWin',
                },
                //  {
                //     text: 'Next',
                //     ui: 'soft-blue',
                //     reference: 'nextbutton',
                //     iconCls: 'fa fa-arrow-right',
                //     iconAlign: 'right',
                //     max_step:3,
                //     bind: {
                //         disabled: '{atEnd}'
                //     },wizard:'auditPlanningWizardPnl',
                //     handler: 'onNextCardClick'
                // }
            ]
        };
        me.callParent(arguments);
    }
})
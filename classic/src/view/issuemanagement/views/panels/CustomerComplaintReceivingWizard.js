/**
 * Created by softclans
 */
Ext.define('Admin.view.issuemanagement.views.panels.CustomerComplaintReceivingWizard', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.customercomplaintreceivingwizard',
    padding: '2 0 2 0',
    requires: [
        'Ext.layout.container.*',
        'Ext.toolbar.Fill'
    ],
    viewModel: {
        type: 'issuemgmtvm'
    },
    reference: 'wizardpnl',
    layout: 'card',
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
            hidden: true,
            height: 60,
            defaults: {
                labelAlign: 'left',
                margin: '-12 5 0 5',
                labelStyle: "color:#595959;font-size:10px"
            },
            items: ['->',  {
                xtype: 'displayfield',
                name: 'process_name',
                margin: '0 0 0 0',
                padding: '0 0 0 0',
                fieldLabel: 'Process',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '10px'
                }
            }, {
                    xtype: 'tbseparator',
                    width: 5
                }, {
                    xtype: 'displayfield',
                    name: 'workflow_stage',
                     hidden: true,
                    fieldLabel: 'Workflow Stage',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '10px'
                    }
                }, {
                    xtype: 'tbseparator',
                    hidden: true,
                    width: 5
                }, {
                    xtype: 'displayfield',
                    name: 'application_status',
                     hidden: true,
                    fieldLabel: 'App Status',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '10px'
                    }
                }, {
                    xtype: 'tbseparator',
                     hidden: true,
                    width: 5
                },{
                    xtype: 'displayfield',
                    name: 'tracking_no',
                    fieldLabel: 'Tracking No',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '10px'
                    }
                },  {
                    xtype: 'displayfield',
                    name: 'reference_no',
                     hidden: true,
                    fieldLabel: 'Ref No',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '10px'
                    }
                }, {
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
                    name: 'module_id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'sub_module_id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'active_application_code'
                }, {
                    xtype: 'hiddenfield',
                    name: 'application_status_id'
                }]
        }

    ],
    items: [{
            xtype: 'customercomplaintdetailspnl',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    ui: 'footer',
                    dock: 'top',
                    margin: 3,
                }
            ],
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
                    iconCls: 'fa fa-info-circle',
                    enableToggle: true,
                    pressed: true,
                    text: 'Complaint Details',
                    max_step:1,
                    action: 'quickNav', wizard: 'customercomplaintreceivingwizard',
                    handler: 'quickNavigation'
                }
            ]
        };
        this.bbar = {
            reference: 'navigation-toolbar',
            ui: 'footer',
            items: [
                {
                    text: 'Back to List',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-bars',
                    name: 'back_to_list',
                    hidden: true
                },
                '->',
                {
                    text: 'Previous',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-arrow-left',
                    max_step:1,
                    bind: {
                        disabled: '{atBeginning}'
                    },
                    wizard:'customercomplaintreceivingwizard',
                    handler: 'onPrevCardClick'
                },{
                    text: 'Save Details',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-save',
                    table_name: 'tra_issuemanagement_applications',
                    name: 'save-complaint-button', 
                    form_panel:'#docdefinationrequirementfrm',
                    action_url:'saveDocDefinationrequirement',
                    wizard: 'customercomplaintreceivingwizard',
                    
                },
                {
                    text: 'Submit Application',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-check',
                    name: 'process_submission_btn',
                    storeID: 'drugproductregistrationstr',
                    table_name: 'tra_documentupload_requirements',
                    winWidth: '50%',
                    action: 'process_submission_btn',
                    
                },
                {
                    text: 'Next',
                    ui: 'soft-blue',
                    reference: 'nextbutton',
                    iconCls: 'fa fa-arrow-right',
                    iconAlign: 'right',
                    max_step:1,
                    bind: {
                        disabled: '{atEnd}'
                    },wizard:'documentapplicationreceivingwizard',
                    handler: 'onNextCardClick'
                }
            ]
        };
        me.callParent(arguments);
    }
});

/**
 * Created by softclans
 */
Ext.define('Admin.view.documentManager.views.panels.ReceivingSOPTemplatePnl',{
    extend: 'Ext.panel.Panel',
    alias: 'widget.receivingsoptemplatepnl',
    padding: '2 0 2 0',
    requires: [
        'Ext.layout.container.*',
        'Ext.toolbar.Fill'
    ],
    viewModel: {
        type: 'documentcreationvm'
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
            height: 55,
            defaults: {
                labelAlign: 'left',
                margin: '-12 5 0 5',
                labelStyle: "color:#595959;font-size:10px"
            },
            items: [{
                xtype: 'displayfield',
                name: 'created_on',
                fieldLabel: 'Effective date:',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '10px'
                }
            },'->',  {
                xtype: 'displayfield',
                name: 'process_name',
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
                    name: 'document_number',
                    fieldLabel: 'Document No.',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '10px'
                    }
                },{
                    xtype: 'displayfield',
                    name: 'workflow_stage',
                    hidden: true,
                    fieldLabel: 'Stage',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '10px'
                    }
                }, {
                xtype: 'displayfield',
                name: 'application_status',
                hidden: true,
                fieldLabel: 'App Status',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '12px',  'margin-top': '-2px'
                }
            }, {
                    xtype: 'tbseparator',
                    width: 5
                },{
                    xtype: 'displayfield',
                    name: 'tracking_no',
                    fieldLabel: 'Issue No:',
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
                },{
                    xtype: 'hiddenfield',
                    name: 'stage_category_id'
                }]
        }

    ],
    items: [{
            xtype: 'soptemplatedocumentdetailspnl',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    ui: 'footer',
                    dock: 'top',
                    margin: 3,
                }
            ],
        }, {
            xtype: 'soptemplategrid',
            title: 'SOP Document Upload'
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
                    text: 'SOP Template Application Details',
                    max_step:1,
                    action: 'quickNav', wizard: 'receivingsoptemplatepnl',
                    handler: 'quickNavigation'
                }, {
                    step: 1,
                    iconCls: 'fa fa-product-hunt',
                    enableToggle: true,
                    max_step:1,
                    text: 'SOP Document Upload',
                    action: 'quickNav', 
                    wizard: 'receivingsoptemplatepnl',
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
                {
                    text: 'Logs',
                    iconCls: 'x-fa fa-list',
                    tooltip: 'View Logs',
                    action: 'logs',
                    childXtype: 'documentLoggrid',
                    winTitle: 'Logs',
                    winWidth: '100%',
                    handler: 'showLogConfigwin',
                    // bind: {
                    //     disabled: '{isReadOnly}'
                    // },
                    stores: '[]'
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
                    wizard:'receivingsoptemplatepnl',
                    handler: 'onPrevCardClick'
                },{
                    text: 'Save SOP Details',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-save',
                    table_name: 'tra_documentmanager_application',
                    name: 'save', 
                   // formBind: true,
                    form_panel:'#soptemplatedoclistfrm',
                    action_url:'saveDocDefinationrequirement',
                    wizard: 'receivingsoptemplatepnl',
                    handler: 'saveSOPTemplateApplicationReceivingBaseDetails'
                },
                {
                    text: 'Submit Application',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-check',
                    name: 'process_submission_btn',
                    storeID: 'drugproductregistrationstr',
                    table_name: 'tra_documentmanager_application',
                    winWidth: '50%',
                    handler: 'showReceivingApplicationSubmissionWin'
                },
                {
                    text: 'Add Approval Decision',
                    iconCls: 'fa fa-plus',
                    name: 'approval',
                    hidden: true,
                    handler: 'getDocumentReleaseRecommendationDetails',
                    approval_frm: 'documentreviewrecommfrm',
                    vwcontroller: 'documentsManagementvctr',
                    stores: '["productApprovalDecisionsStr"]',
                    table_name: 'tra_documentmanager_application',
                    is_siginig:0
                },

                {
                    text: 'Recommendations & Comments',
                    ui: 'soft-blue', 
                    iconCls: 'fa fa-clipboard-check',
                    hidden: true,
                    childXtype: 'applicationcommentspnl',
                    winTitle: 'Process Comments',
                    winWidth: '60%',
                    name:'recommendation',
                    comment_type_id: 3,
                    stores: '[]'
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
                    },wizard:'receivingsoptemplatepnl',
                    handler: 'onNextCardClick'
                }
            ]
        };
        me.callParent(arguments);
    }
});

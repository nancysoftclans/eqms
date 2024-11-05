/**
 * Created by softclans
 */
Ext.define('Admin.view.documentManager.views.panels.DocumentReleasePnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'documentreleasepnl',
    layout: {
        type: 'border'
    },
    defaults: {
        split: true
    },

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        ui: 'footer',
        height: 55,
            defaults: {
                labelAlign: 'top',
                margin: '-12 5 0 5',
                labelStyle: "color:#595959;font-size:10px"
            },
            items: ['->', {
                xtype: 'displayfield',
                name: 'process_name',
                fieldLabel: 'Process',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '12px',  'margin-top': '-2px'
                }
            }, {
                xtype: 'tbseparator',
                width: 20
            }, {
                xtype: 'displayfield',
                name: 'workflow_stage',
                fieldLabel: 'Stage',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '12px',  'margin-top': '-2px'
                }
            }, {
                xtype: 'tbseparator',
                hidden: true,
                width: 20
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
                width: 20
            },{
                xtype: 'displayfield',
                name: 'tracking_no',
               // hidden: true,
                fieldLabel: 'Tracking No',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '12px',  'margin-top': '-2px'
                }
            },  {
                xtype: 'displayfield',
                name: 'reference_no',
                hidden: true,
                fieldLabel: 'Ref No',
                fieldStyle: {
                    'color': 'green',
                    'font-weight': 'bold',
                    'font-size': '12px',  'margin-top': '-2px'
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
            },{
                xtype: 'hiddenfield',
                name: 'active_application_code'
            }, {
                xtype: 'hiddenfield',
                name: 'application_status_id'
            },{
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
                name: 'applicant_id'
            }
            ]
        }
    ],
    items: [
        {
            title: 'Document Application Processing',
            region: 'center',
            layout: 'fit',
            items: [{
                xtype: 'docreleasegrid',
                
            }]
        },
        {
            title: 'Other Details',
            region: 'east',
            width: 800,
            collapsed: true,
            collapsible: true,
            titleCollapse: true,
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 5,
                    defaults: {
                        margin: 2,
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
                            xtype: 'qmsdoclistfrm',
                            // fieldLabel: 'Applicant Details',
                            // name: 'applicant_details'
                        },
                        // {
                        //     xtype: 'displayfield',
                        //     fieldLabel: 'Premises Details',
                        //     name: 'premises_details'
                        // }
                    ]
                }
            ]
        },
        {
            xtype: 'toolbar',
            ui: 'footer',
            scrollable: true,
            autoScroll: true,
            region: 'south',
            height: 45,
            split: false,
            defaults: {
                margin: 5
            },
            items: [
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
                // {
                //     text: 'Preview & documents Permit Details',
                //     iconCls: 'fa fa-edit',
                //     isReadOnly: 0,
                //     is_detached: 1,
                //     handler:'showApplicationMoreDetails',
                //     stores: '[]'
                // },
                // {
                //     text: 'Previous Permits',
                //     iconCls: 'fa fa-upload',
                //     childXtype: 'previmportexportpermitreleasegrid',
                //     winTitle: 'Preview Previous Permits',
                //     winWidth: '80%',
                //     handler: 'showPrevimportexportPermitreleasegrid',
                // },  
                {
                    text: 'Add Approval Decision',
                    iconCls: 'fa fa-plus',
                    name: 'approval',
                    hidden: true,
                    handler: 'getDocumentReleaseRecommendationDetails',
                    approval_frm: 'documentapprovalfrm',
                    vwcontroller: 'documentsManagementvctr',
                    stores: '["productApprovalDecisionsStr"]',
                    table_name: 'tra_documentmanager_application',
                    is_siginig:0
                },

                {
                    text: 'Recommendations & Comments',
                    ui: 'soft-blue', 
                    hidden: true,
                    iconCls: 'fa fa-clipboard-check',
                    childXtype: 'applicationcommentspnl',
                    winTitle: 'Process Comments',
                    winWidth: '60%',
                    name:'recommendation',
                    comment_type_id: 3,
                    stores: '[]'
                },
                // {
                //     text: 'Preview Permit/Letter',
                //     iconCls: 'fa fa-print',
                //     childXtype: 'previmportexportpermitreleasegrid',
                //     winTitle: 'Preview permit letter details',
                //     winWidth: '80%',
                //     handler: 'printPreviewPermitForApproval',
                // },
                // {
                //     text: 'Submit for signing',
                //     iconCls: 'fa fa-check',
                //     handler: 'getPermitReleaseRecommendationDetails',
                //     approval_frm: 'importexportreviewrecommfrm',
                //     vwcontroller: 'importexportpermitsvctr',
                //     stores: '["productApprovalDecisionsStr"]',
                //     table_name: 'tra_documentmanager_application',
                //     is_siginig:1
                // },
                {
                    text: 'Submit',
                    hidden: true,
                    ui: 'soft-blue',
                    iconCls: 'fa fa-check',
                    name: 'process_submission_btn',
                    table_name: 'tra_documentmanager_application',
                    winWidth: '50%',
                    handler: 'showReceivingApplicationSubmissionWin'
                }
                ]
        }
    ]
});

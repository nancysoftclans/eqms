/**
 * Created by softclans
 */
Ext.define('Admin.view.documentsManagement.views.panels.DocumentApplicationReceivingWizard', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.documentapplicationreceivingwizard',
    padding: '2 0 2 0',
    requires: [
        'Ext.layout.container.*',
        'Ext.toolbar.Fill'
    ],
    // viewModel: {
    //     type: 'importexportpermitsvm'
    // },
    reference: 'wizardpnl',
    layout: 'card',
    bodyPadding: 3,
    flex: 1,
    autoScroll: true,
    cls: 'wizard three shadow',
    colorScheme: 'soft-purple',
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            ui: 'footer',
            height: 55,
            defaults: {
                labelAlign: 'top',
                margin: '-10 5 0 5',
                labelStyle: "color:#595959;font-size:13px"
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
                    fieldLabel: 'Application Status',
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
                    name: 'application_status',
                    fieldLabel: 'App Status',
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
                    name: 'tracking_no',
                    fieldLabel: 'Tracking No',
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold',
                        'font-size': '12px',  'margin-top': '-2px'
                    }
                },  {
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
            xtype: 'documentdetailspnl',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    ui: 'footer',
                    dock: 'top',
                    margin: 3,
                    items: [
                        {
                            xtype: 'tbseparator',
                            width: 2
                        },
                        // {
                        //     xtype: 'combo',
                        //     fieldLabel: 'Zone',
                        //     labelWidth: 50,
                        //     width: 400,
                        //     name: 'zone_id',
                        //     valueField: 'id',
                        //     displayField: 'name',
                        //     queryMode: 'local',
                        //     forceSelection: true,
                        //     listeners: {
                        //         beforerender: {
                        //             fn: 'setOrgConfigCombosStore',
                        //             config: {
                        //                 pageSize: 1000,
                        //                 proxy: {
                        //                     extraParams: {
                        //                         model_name: 'Zone'
                        //                     }
                        //                 }
                        //             },
                        //             isLoad: true
                        //         }
                        //     },
                        //     labelStyle: 'font-weight:bold'
                        // }
                        // '->',{
                        //     xtype: 'fieldcontainer',
                        //     layout: 'column',
                           
                        //     items: [
                        //         {
                        //             xtype: 'textfield',
                        //             name: 'reference_no',
                        //             hidden: false,fieldLabel: 'Visa Application Details',
                        //             readOnly: true,
                        //             columnWidth: 0.9
                        //         },
                        //         {
                        //             xtype: 'button',
                        //             iconCls: 'x-fa fa-search',
                        //             columnWidth: 0.1,
                        //             hidden: false,
                        //             text: 'Search',
                        //             tooltip: 'Select Application',
                        //             name: 'select_applications',
                        //             childXtype: 'allapprovedvisaapplicationsgrid',
                        //             winTitle:'Approved Visa Applications',
                        //             winWidth:'70%',
                        //             handler: 'showIEApplicationsSelectionList'
                        //         }
                        //     ]
                        // }
                    ]
                }
            ],
        },
        // {
        //     xtype: 'licensepermitsproductsgrid',
        //     title: 'Permit Products Details',
        //  },
          {
            xtype: 'docuploadsgrid',
            title: 'Document Upload'
         },
        //{
        //     xtype: 'productscreeninggrid',
        //     title: 'Import/Export Permit Prechecking'
        // },
        // {
        //     xtype: 'appinvoicepaymentspanel'
           
        // },
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
            defaultButtonUI: 'wizard-' + this.colorScheme,
            cls: 'wizardprogressbar',
            style: {
                "background-color": "#90c258"
            },
            bodyStyle: {
                "background-color": "#90c258"
            },
            layout: {
                pack: 'center'
            },
            items: [
               
                {
                    step: 0,
                    iconCls: 'fa fa-university',
                    enableToggle: true,iconAlign: 'top',
                    text: 'Document Creation Application Details',max_step:1,
                    action: 'quickNav', wizard: 'documentapplicationreceivingwizard',
                    handler: 'quickNavigation',
                    fieldStyle: {
                        'font-weight': 'bold',
                        'font-size': '12px',  'margin-top': '-2px'
                    }
                },
                // {
                //     step: 1,
                //     iconCls: 'fa fa-university',
                //     enableToggle: true,iconAlign: 'top',
                //     text: 'License Product Details',max_step:4,
                //     action: 'quickNav', wizard: 'documentapplicationreceivingwizard',
                //     handler: 'quickNavigation'
                // }, 
                {
                    step: 1,
                    iconCls: 'fa fa-upload',
                    enableToggle: true,max_step: 1,
                    text: 'Document Upload',
                    action: 'quickNav', iconAlign: 'top',
                    wizard: 'documentapplicationreceivingwizard',
                    handler: 'quickNavigation'
                }, 
                // {
                //     step: 3,
                //     iconCls: 'fa fa-product-hunt',
                //     enableToggle: true,max_step: 4,
                //     text: 'License Prechecking Checklist',
                //     action: 'quickNav', iconAlign: 'top',
                //     wizard: 'documentapplicationreceivingwizard',
                //     handler: 'quickNavigation'
                // // },
                // {
                //     step: 2,
                //     iconCls: 'fa fa-dollar',
                //     enableToggle: true,max_step: 2,
                //     text: 'Invoice & Payment Details',
                //     action: 'quickNav',iconAlign: 'top',
                //     wizard: 'documentapplicationreceivingwizard',
                //     handler: 'quickNavigation',
                // }
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
                    ui: 'soft-blue',max_step:1,
                    iconCls: 'fa fa-arrow-left',
                    bind: {
                        disabled: '{atBeginning}'
                    },
                    wizard:'documentapplicationreceivingwizard',
                    handler: 'onPrevCardClick'
                },
                {
                    text: 'Save Details',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-save',
                    table_name: 'tra_documentupload_requirements',
                    name: 'save', 
                   // formBind: true,
                    form_panel:'#docdefinationrequirementfrm',
                    action_url:'saveDocDefinationrequirement',
                    wizard: 'documentapplicationreceivingwizard',
                    handler: 'saveDocumentApplicationReceivingBaseDetails'
                },
                {
                    text: 'Submit Application',
                    ui: 'soft-blue',
                    iconCls: 'fa fa-check',
                    name: 'process_submission_btn',
                    storeID: 'drugproductregistrationstr',
                    table_name: 'tra_documentupload_requirements',
                    winWidth: '50%',
                    handler: 'showReceivingApplicationSubmissionWin'
                },
                {
                    text: 'Next',
                    ui: 'soft-blue',
                    reference: 'nextbutton',
                    iconCls: 'fa fa-arrow-right',
                    max_step:1,
                    iconAlign: 'right',
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

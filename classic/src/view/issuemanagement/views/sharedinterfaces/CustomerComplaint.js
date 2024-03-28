/**
 * Created by Wainaina on 25/03/2024
 */
Ext.define('Admin.view.issuemanagement.views.sharedinterfaces.CustomerComplaint', {
    extend: 'Ext.panel.Panel',
    xtype: 'customercomplaint',
    controller: 'issuemgmtvctr',
    viewModel: 'issuemgmtvm',
    layout: 'fit',
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            ui: 'footer',
            height: 40,
            defaults: {
                labelAlign: 'top',
                margin: '-12 5 0 5',
                labelStyle: "color:#595959;font-size:11px"
            },
            items: ['<-', {
                xtype: 'displayfield',
                name: 'process_name',
                fieldLabel: 'Process',
                fieldStyle: {
                    'color': 'soft-blue',
                    'font-weight': 'bold',
                    'font-size': '10px',
                    'margin-top': '-2px'
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'displayfield',
                name: 'workflow_stage',
                fieldLabel: 'Workflow Stage',
                fieldStyle: {
                    'color': 'soft-blue',
                    'font-weight': 'bold',
                    'font-size': '10px',
                    'margin-top': '-2px'
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'displayfield',
                name: 'application_status',
                fieldLabel: 'App Status',
                fieldStyle: {
                    'color': 'soft-blue',
                    'font-weight': 'bold',
                    'font-size': '10px',
                    'margin-top': '-2px'
                }
            },
            {
                xtype: 'tbseparator'
            },
            {
                xtype: 'displayfield',
                name: 'tracking_no',
                hidden: false,
                fieldLabel: 'Tracking No',
                fieldStyle: {
                    'color': 'soft-blue',
                    'font-weight': 'bold',
                    'font-size': '10px',
                    'margin-top': '-2px'
                }
            }, 
            {
                xtype: 'tbseparator',
                hidden: true
            },
            {
                xtype: 'displayfield',
                name: 'reference_no',
                fieldLabel: 'Reference No',
                hidden: true,
                fieldStyle: {
                    'color': 'soft-blue',
                    'font-weight': 'bold',
                    'font-size': '10px',
                    'margin-top': '-2px'
                }
            }, 
            {
                xtype: 'hiddenfield',
                name: 'process_id',
            }, {
                xtype: 'hiddenfield',
                name: 'workflow_stage_id'
            }, {
                xtype: 'hiddenfield',
                name: 'active_application_id',
            }, {
                xtype: 'hiddenfield',
                name: 'active_application_code'
            }, 
            {   xtype: 'hiddenfield',
                name: 'application_code',
            },{
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
            },
            {
                xtype: 'hiddenfield',
                name: 'program_id'
            }, {
                xtype: 'hiddenfield',
                name: "complaint_id"
            },

            ]
        }
    ]
});
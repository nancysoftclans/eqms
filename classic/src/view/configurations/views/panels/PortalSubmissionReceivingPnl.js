Ext.define('Admin.view.configurations.views.panels.PortalSubmissionReceivingPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalSubmissionReceivingPnl',
    controller: 'configurationsvctr',
    //title: 'Portal Online submissions Receiving',
    viewModel: 'configurationsvm',
    layout: 'fit',
    items: [
        {
            xtype: 'portalSubmissionReceivingGrid'
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
            name: 'applicant_id'
        }, {
            xtype: 'hiddenfield',
            name: 'application_code'
        }, {
            xtype: 'hiddenfield',
            name: 'prodclass_category_id'
        }, {
            xtype: 'hiddenfield',
            name: 'product_id'
        },{
            name: 'premise_id',
            xtype: 'hiddenfield'
        },{
            name: 'manufacturing_site_id',
            xtype: 'hiddenfield'
        },{
            name: 'gmp_type_id',
            xtype: 'hiddenfield'
        },{
            name: 'meeting_id',
            xtype: 'hiddenfield'
        },
    ],
        initComponent: function () {
            var me = this;
            this.bbar = {
                reference: 'navigation-toolbar',
                ui: 'footer',
                items: ['->',
                    {
                        text: 'Receive Application',
                        ui: 'soft-blue',
                        iconCls: 'fa fa-check',
                        name: 'process_receive_btn',
                        storeID: 'portalSubmissionReceivingGridStr',
                        hidden:true,
                        table_name: '',
                        winWidth: '50%'
                    }
                ]
            };
            me.callParent(arguments);
        }
   
});
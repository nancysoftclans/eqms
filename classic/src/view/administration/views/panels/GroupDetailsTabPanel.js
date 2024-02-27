
Ext.define('Admin.view.administration.views.panels.GroupDetailsTabPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'groupdetailstabpanel',
    margin: 3,
    items: [
        {
            title: 'Users',
            xtype: 'groupusersgrid'
        },
        {
            title: 'Navigation Access',
            xtype: 'systemrolestreegrid'
        },{
            title: 'Workflow Stages Access',
            xtype: 'panel',
            height: Ext.Element.getViewportHeight() - 118,
            
         //   widht: 700,
            layout:{
                    type: 'border'
                },
                defaults:{
                    split: true,
                    margin:1
                },
            items: [{
                xtype: 'workflowlistgrid',
                region: 'west'
            },{
                xtype: 'syncworkflowstagesgrid',
                region: 'center'
            }],
        },
        {
            xtype: 'hiddenfield',
            name: 'active_group_id'
        }
    ]
});
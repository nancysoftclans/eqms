Ext.define('Admin.view.QMS.auditManagement.views.panels.AuditMgmntDashPnl',{ 
    extend: 'Ext.Container',
    xtype: 'auditMgmntDashPnl',
    layout: 'border',

    items: [
        {
            xtype: 'AuditMgmntGrid',
            region: 'center',
            // title: 'Active Tasks',
            margin: 2,
            bbar: [
                {
                    xtype: 'pagingtoolbar',
                    width: '100%',
                    displayInfo: true,
                    displayMsg: 'Showing {0} - {1} of {2} total records',
                    emptyMsg: 'No Records',
                }
            ]
        }
       
    ]

});
Ext.define('Admin.view.QMS.gbt.views.dashboard.GbtMgmntDashPnl',{ 
    extend: 'Ext.Container',
    xtype: 'gbtMgmntDashPnl',
    layout: 'border',

    items: [
        {
            xtype: 'gbtMgmntGrid',
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



// layout: 'border',
//     items: [{
//         xtype: 'hiddenfield',
//         name: 'module_id',
//         value: 26
//     },
//     {
//             xtype: 'hiddenfield',
//             name: 'sub_module_id',
//             value: 101
//         },
//       {
//             xtype: 'qmsdoclistgrid',
//             region: 'center',
//             title: 'Active Tasks',
//             margin: 2
//         }
//     ]
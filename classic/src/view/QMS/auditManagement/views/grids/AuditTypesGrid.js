Ext.define('Admin.view.QMS.auditManagement.views.grids.AuditTypesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'auditTypesGrid',
    controller: 'auditMgmntVctr',
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 100,
                storeId: 'auditTypesStr',
                remoteFilter: true,
                enablePaging: true,
                proxy: {
                    url: 'auditManagement/getAuditTypes', 
                }
            }
        },
        itemdblclick: 'onSelectAuditType'
    },
    plugins:[
        {
            ptype: 'filterfield'
        }
    ],
    bbar: [
        {
            xtype: 'pagingtoolbar',
            width: '100%',
            displayInfo: true,
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
           
        }
    ],
    tbar: [
        {
            xtype: 'hiddenfield',
            name: 'isReadOnly' 
        },
        {
            text: 'Create New Audit Type',
            ui: 'soft-blue',
            winTitle: 'Audit Type',
            width: '20%',
            iconCls: 'x-fa fa-plus',
            ui: 'soft-blue',

            handler: function(btn) {
                var winWidth = btn.winWidth,
                winTitle = btn.winTitle,
                newAuditTypePanel = Ext.widget('newAuditTypePnl');
                funcShowCustomizableWindow(winTitle, winWidth, newAuditTypePanel, 'customizablewindow');
            }
        },
        {
            xtype: 'displayfield',
            value: 'Double click to select!!',
            fieldStyle: {
                'color':'green'
            }
        },
        {xtype:'tbfill'},
        
    ],
   
   
   
    columns: [{
        xtype: 'gridcolumn',
        text: 'Code',
        dataIndex: 'audit_type_code',
        flex: 1,

        filter: {
             xtype: 'textfield',

        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'audit_title',
        text: 'Title',
        flex: 1,
        filter: {
            xtype: 'textfield'
        }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'audit_prefix_type',
        text: 'Prefix Type',
        flex: 1,
        
    }
]
})
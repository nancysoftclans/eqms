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
            },
            isLoad: true,
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
                funcShowCustomizableWindow(winTitle, '90%', newAuditTypePanel, 'customizablewindow');
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
        
    },
    {
        text: 'Options',
        xtype: 'widgetcolumn',
        width: 90,
        widget: {
            width: 75,
            textAlign: 'left',
            xtype: 'splitbutton',
            iconCls: 'x-fa fa-th-list',
            ui: 'gray',
            menu: {
                xtype: 'menu',
                items: [{
                    text: 'Edit',
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'Edit Record',
                    action: 'edit',
                    panelXtype: 'newAuditTypePnl',
                    handler: 'showEditAuditType'
                }]
            }
        }
    }
]
})
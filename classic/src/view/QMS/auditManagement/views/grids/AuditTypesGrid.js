Ext.define('Admin.view.QMS.auditManagement.views.grids.AuditTypesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'auditTypesGrid',
    
    autoScroll: true,
    autoHeight: true,
    width: '100%',

    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',

    },

    tbar: [
        {
            text: 'Create New Audit Type',
            ui: 'soft-blue',
            winTitle: 'Audit Type',
            width: '70%',
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
            xtype: 'tbspacer',
            width: 20
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
    plugins:[
        {
            ptype: 'filterfield'
        },{
            ptype: 'gridexporter'
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
    listeners: {
        beforesender: {
            fn: 'setGridStore',
            config: {
                pageSize: 200,
                remoteFilter: true,

                proxy: {
                    url: 'auditManagement/getAuditTypes',
                }
            },
            isLoad: true
        }
    },
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'audit_code',
        text: 'Code',
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
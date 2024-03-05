Ext.define('Admin.view.documentControl.views.grids.documentControlDashGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'documentcontrolvctr',
    xtype: 'documentControlDashGrid',
    itemId: 'documentControlDashGrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',

    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
    },
    tbar: [
        {
            xtype: 'exportbtn',
        },{
            xtype: 'tbspacer',
        width: 50
        }
    ],
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],

    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    },

    ],
    columns: [
        {
            xtype: 'gridcolumn',
            dataIndex: 'tracking_no',
            text: 'Tracking Number',
            flex: 1
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'reference_no',
            text: 'Ref Number',
            flex: 1
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'process_name',
            text: 'Process',
            flex: 1,
        }, {
            xtype: 'gridcolumn',
            text: 'From',
            dataIndex: 'from_user',
            flex: 1,
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'To',
            dataIndex: 'to_user',
            flex: 1,
            tdCls: 'wrap'
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'applicant_name',
            text: 'Applicant',
            flex: 1
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'workflow_stage',
            text: 'Workflow Stage',
            flex: 1
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'application_status',
            text: 'Application Status',
            flex: 1,
            tdCls: 'wrap'
        }, {
            xtype: 'gridcolumn',
            text: 'Date Received',
            dataIndex: 'date_received',
            flex: 1,
            tdCls: 'wrap-text',
            renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
        } 
    ]
    
    

});
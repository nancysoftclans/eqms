
Ext.define('Admin.view.workflowmanagement.views.grids.MultiTransitionsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'multitransitionsgrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    frame: true,
    height: 550,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display'
    },
    tbar:[
        {
            xtype: 'exportbtn'
        },{
			xtype:'hiddenfield',
			name:'application_code'
			
		},{
			xtype:'hiddenfield',
			name:'reference_no'
			
		}
    ],
    bbar: [
        {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            store: 'transitionsstr',
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
            table_name: 'tra_premises_applications',
            beforeLoad: function () {
                this.up('grid').fireEvent('refresh', this);
            }
        }

    ],
    plugins:[
        {
            ptype: 'gridexporter'
        }
    ],
    features: [{
        ftype: 'searching',
        mode: 'local',
        minChars: 2
    }],
    listeners: {
        afterrender: function () {
            var store = this.store;
            store.removeAll();
            store.load();
        }
    },
    store: 'transitionsstr',
    columns: [{
            xtype: 'gridcolumn',
            text: 'Processed By',
            dataIndex: 'author',
			tdCls:'wrap-text',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            text: 'From',
            dataIndex: 'from_stage_name',
            flex: 1,
			tdCls:'wrap-text',
            renderer: function (val, meta) {
                meta.tdCls = 'forward-cell';
                return val;
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'To',
			tdCls:'wrap-text',
            dataIndex: 'to_stage_name',
            flex: 1
        },
        
        {
            xtype: 'datecolumn',
            text: 'Date',
			tdCls:'wrap-text',
            dataIndex: 'changes_date',
            flex: 1
        },
        
        {
            xtype: 'gridcolumn',
            text: 'Remark/Comment',
			tdCls:'wrap-text',
            dataIndex: 'remarks',
            flex: 1,
            tdCls: 'wrap'
        }
    ]
});

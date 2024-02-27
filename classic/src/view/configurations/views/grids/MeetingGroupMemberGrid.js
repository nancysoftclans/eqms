
Ext.define('Admin.view.configurations.views.grids.MeetingGroupMemberGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'configurationsvctr',
    xtype: 'meetingGroupMemberGrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    height: Ext.Element.getViewportHeight() - 118,
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var is_enabled = record.get('is_enabled');
            if (is_enabled == 0 || is_enabled === 0) {
                return 'invalid-row';
            }
        }
    },

    tbar: [
           {
        xtype: 'exportbtn'
    },{
        xtype: 'hiddenfield',
        name: 'group_id'
    }],
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    selModel:{
        selType: 'checkboxmodel',
        mode: 'MULTI'
    },
    export_title: 'groupmembers',
    
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function(){
            var store = this.getStore(),
            grid = this.up("grid"),
            group_id = grid.down('hiddenfield[name=group_id]').getValue();
            store.getProxy().extraParams = {
                group_id: group_id,
            };
        }
    }],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 1000,
                storeId: 'meetingGroupMemberGridStr',
                proxy: {
                    url: 'configurations/getMeetingGroupMembers',
                    extraParams:{
                    	//is_config: 1,
                       // table_name: 'par_meeting_groups'
                    }
                }
            },
            isLoad: true
        }
    },
    columns: [
        {
            xtype: 'rownumberer',
         
        },{
        xtype: 'gridcolumn',
        dataIndex: 'participant_name',
        text: 'Name',
        flex: 1
         },{
        xtype: 'gridcolumn',
        dataIndex: 'phone',
        text: 'Phone',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'email',
        text: 'Email',
        flex: 1
    }
]
});

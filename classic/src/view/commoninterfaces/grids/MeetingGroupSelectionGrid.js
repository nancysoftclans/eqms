Ext.define('Admin.view.commoninterfaces.grids.MeetingGroupSelectionGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'commoninterfacesVctr',
    xtype: 'meetingGroupSelectionGrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    height: 400,
    width: '100%',
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
  
    bbar: [
    {
        xtype: 'hiddenfield',
        name: '_token',
        value: token
    },{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
    }],
    tbar: [
        {
            xtype: 'displayfield',
            value: 'Double click to select!'
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
                pageSize: 10000,
                storeId: 'meetingGroupSelectionGridstr',
                proxy: {
                    url: 'configurations/getConfigParamFromTable',
                    extraParams:{
                    	is_config: 1,
                        table_name: 'par_meeting_groups'
                    }
                }
            },
            isLoad: true
        }
    },
    columns: [ 
    {
        xtype: 'gridcolumn',
        dataIndex: 'name',
        text: 'Group Name',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'description',
        text: 'Description',
        flex: 1
    }]
});


Ext.define('Admin.view.configurations.views.grids.MeetingSchedulesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'meetingschedulesgrid',
    controller: 'configurationsvctr',
    useArrows: true,
    columnLines: true,
    rootVisible: false,
    height: Ext.Element.getViewportHeight() - 118,
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
    tbar: [{
        xtype: 'button',
        text: 'Add Meeting Schedules',
        ui: 'soft-blue',
        iconCls: 'x-fa fa-plus',
        action: 'add',
        winTitle:'Meeting Schedules form',
        winWidth:'40%',
        childXtype: 'meetingschedulesfrm',
        handler: 'showAddConfigParamWinFrm',
        stores: '[]'
    }, 
    {
        xtype: 'exportbtn'
    },
],
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
            storeId: 'MeetingShedulesStr',
            proxy: {
                url: 'configurations/getMeetingSchedules',
                extraParams:{
                  is_config:1,
                    table_name: 'tc_meeting_details'
                }
            }
        },
        isLoad: true
    }
},
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
      
    }],
    columns: [
         {
            xtype: 'rownumberer',
         
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'meeting_name',
            text: 'Meeting Name',
            flex: 1,
           
        },{
            xtype: 'gridcolumn',
            dataIndex: 'meeting_desc',
            text: 'Meeting Description',
            flex: 1,
            
        },{
            xtype: 'gridcolumn',
            dataIndex: 'meeting_venue',
            text: 'Meeting Venue',
            flex: 1,
           
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'date_requested',
            text: 'Meeting Date',
            flex: 1,
            
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'meeting_time',
            text: 'Meeting Time',
            flex: 1,
           
        }, 
      
        {
            text: 'Options',
            xtype: 'widgetcolumn',
            width: 90,
            widget: {
                textAlign: 'left',
                xtype: 'splitbutton',
                ui: 'gray',
                width: 75,
                iconCls: 'x-fa fa-th-list',
                menu: {
                    xtype: 'menu',
                    items: [

                        {
                        text: 'Edit meeting schedules',
                        iconCls: 'x-fa fa-edit',
                        tooltip: 'Edit Record',
                        action: 'edit',
                        childXtype:'meetingschedulesfrm',
                        winTitle: ' Meeting Schedules form',
                        winWidth:'40%',
                        handler: 'showEditConfigParamWinFrm',
                        stores: '[]'
                    },
                    {
                        text: 'Add Meeting Participants',
                        iconCls: 'x-fa fa-plus',
                        storeID: 'MeetingShedulesStr',
                         handler: 'showAddParticipantsGrid',
                         childXtype: 'meetingschedulesparticipantsselectiongrid',
                        // childXtype: 'meetingparticipantsgrid',
                         winTitle: 'Meeting Participants',
                         winWidth:'60%',
                    },
                
                    {
                        text: 'Delete meeting schedules',
                        iconCls: 'x-fa fa-trash',
                        tooltip: 'Delete Record',
                        table_name: 'tc_meeting_details',
                        storeID: 'MeetingShedulesStr',
                        action_url: 'configurations/deleteConfigRecord',
                        action: 'actual_delete',
                        handler: 'doDeleteConfigWidgetParam',
    
                    },

                    ]
                }
            },

        }]
});

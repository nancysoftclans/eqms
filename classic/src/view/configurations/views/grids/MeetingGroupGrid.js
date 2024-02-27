
Ext.define('Admin.view.configurations.views.grids.MeetingGroupGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'configurationsvctr',
    xtype: 'meetingGroupGrid',
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
        xtype: 'button',bind: {
            disabled: '{isReadOnly}'
        },
        text: 'Add',
        iconCls: 'x-fa fa-plus',
        action: 'add',
        ui: 'soft-blue',
        childXtype: 'meetingGroupsFrm',
        winTitle: 'MeetingGroups',
        winWidth: '40%',
        handler: 'showAddConfigParamWinFrm',
        stores: '[]'
    }, {
        xtype: 'exportbtn'
    }, {
        xtype: 'displayfield',
        value: 'Go to options to view group members!',
        fieldStyle: {
            'color':'green'
        }
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
    export_title: 'agegroups',
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records'
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
                storeId: 'meetinggroupsStr',
                proxy: {
                    url: 'configurations/getMeetingGroups',
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
        dataIndex: 'name',
        text: 'Name',
        flex: 1
         },{
        xtype: 'gridcolumn',
        dataIndex: 'description',
        text: 'Description',
        flex: 1
    },{
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
                    childXtype: 'meetingGroupsFrm',
                    winTitle: 'Meeting Groups',
                    winWidth: '40%',
                    handler: 'showEditConfigParamWinFrm',
                    stores: '[]'
                }, 
                {
                    text: 'View Members',
                    iconCls: 'x-fa fa-eye',
                    tooltip: 'View Group Members',
                    action: 'view',
                    childXtype: 'meetingGroupMemberGrid',
                    winTitle: 'Meeting Participants',
                    winWidth: '70%',
                    handler: 'showMeetingGroupParticipantsWin',
                    stores: '[]'
                },{
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    table_name: 'par_meeting_groups',
                    storeID: 'meetinggroupsStr',
                    action_url: 'configurations/deleteConfigRecord',
                    action: 'actual_delete',
                    handler: 'doDeleteConfigWidgetParam'
                }, 
                ]
            }
        },
    }]
});

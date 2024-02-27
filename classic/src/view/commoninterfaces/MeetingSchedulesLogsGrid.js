/**
 */
Ext.define('Admin.view.commoninterfaces.grids.MeetingSchedulesLogsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'meetingSchedulesLogsGrid',
    controller: 'commoninterfacesVctr',
    autoScroll: true,
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
    tbar: [{
        xtype: 'exportbtn'
    }, {
        xtype: 'hiddenfield',
        name: 'module_id'
    },{
        xtype: 'displayfield',
        value: 'Double click to select!!',
        fieldStyle: {
            'color':'green'
        }
    }],
    plugins: [{
        ptype: 'gridexporter'
    }],
    features: [{
        ftype: 'grouping',
        startCollapsed: true,
        groupHeaderTpl: 'For => ({[values.rows[0].data.module_name]})',
        hideGroupedHeader: true,
        enableGroupingMenu: false
    }],
    listeners: {
        beforerender: {
            fn: 'setPremiseRegGridsStore',
            config: {
                pageSize: 1000,
                storeId: 'meetingSchedulesLogsGridStr',
                groupField: 'module_id',
                proxy: {
                    url: 'common/getmeetingSchedulesLogs'
                }
            },
            isLoad: true
        },
        itemdblclick: 'loadSelectedSchedule'
    },
    columns: [{
        xtype: 'rownumberer',
        text: 'S/N'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'meeting_name',
        text: 'Meeting Name',
        width: 200,
        tdCls: 'wrap'
    },  {
        xtype: 'gridcolumn',
        dataIndex: 'meeting_venue',
        text: 'Venue',
        tdCls: 'wrap',
        width: 200,
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'meeting_desc',
        text: 'Meeting Description',
        tdCls: 'wrap',
        width: 200,
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'date_requested',
        text: 'Meeting Date',
        format: 'Y-m-d',
        tdCls: 'wrap',
        width: 150,
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'meeting_time',
        text: 'Meeting Time',
        tdCls: 'wrap',
        width: 150,
    }],
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function () {
            var grid = this.up('grid'),
                store = this.getStore(),
                module_id = grid.down('hiddenfield[name=module_id]').getValue();

            store.getProxy().extraParams = {
                module_id: module_id
            };
        }
    }]
});

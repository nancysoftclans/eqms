
 Ext.define('Admin.view.configurations.views.grids.MeetingSchedulesParticipantsSelectionGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'meetingschedulesparticipantsselectiongrid',
    controller: 'commoninterfacesVctr',
    selModel: {
        selType: 'checkboxmodel',
        mode: 'MULTI',
        allowDeselect: true
    },
    frame: true,
    height: 500,
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 10000,
                storeId: 'parmeetingparticipantsstr',
                proxy: {
                    url: 'usermanagement/getActiveSystemUsers'
                   /* extraParams: {
                        model_name: 'MeetingParticipant'
                    }*/
                }
            },
            isLoad: true
        },
        select: function (sel, record, index, eOpts) {
            var grid = sel.view.grid,
                selCount = grid.getSelectionModel().getCount();
            if (selCount > 0) {
                grid.down('button[name=save_selected]').setDisabled(false);
            }
        },
        deselect: function (sel, record, index, eOpts) {
            var grid = sel.view.grid,
                selCount = grid.getSelectionModel().getCount();
            if (selCount < 1) {
                grid.down('button[name=save_selected]').setDisabled(true);
            }
        }
    },
    tbar: [
        {
            xtype: 'button',
            text: 'External Participant',
            ui: 'soft-blue',
            iconCls: 'x-fa fa-plus',
            handler: 'showAddTcMeetingExternalParticipant',
           // childXtype: 'meetingparticipantsfrm',
            childXtype: 'meetingschedulesparticipantsfrm',
            winTitle: 'Meeting Participant',
            winWidth: '40%',
            stores: '[]'
        },
        {
            xtype: 'button',
            text: 'Save Selected',
            ui: 'soft-blue',
            iconCls: 'x-fa fa-save',
            disabled: true,
            name: 'save_selected'
        },
        {
            xtype: 'hiddenfield',
            name: 'meeting_id'
        }
    ],
    bbar: [
        {
            xtype: 'pagingtoolbar',
            width: '100%',
            displayInfo: true
        }
    ],
	features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    columns: [
        {
            text: 'Participant Name',
            dataIndex: 'fullnames',
            flex: 1
        },
       
        {
            text: 'Phone No',
            dataIndex: 'phone',
            flex: 1
        },
        {
            text: 'Email',
            dataIndex: 'email',
            flex: 1
        },
      {
    text: 'gender',
    dataIndex: 'gender',
    flex: 1
},
{
    text: 'title',
    dataIndex: 'title',
    flex: 1
},
       
    ]
});
// {
//     text: 'hiddenfield',
//     dataIndex: 'branch',
//     hidden:'true',
//     flex: 1
// },
// {
//     text: 'hiddenfield',
//     dataIndex: 'department',
//     hidden:'true',
//     flex: 1
// },
// {
//     text: 'hiddenfield',
//     dataIndex: 'gender',
//     hidden:'true',
//     flex: 1
// },
// {
//     text: 'hiddenfield',
//     dataIndex: 'title',
//     hidden:'true',
//     flex: 1
// },
/**
 * Created by Softclans
 */
Ext.define('Admin.view.commoninterfaces.grids.viewMeetingParticipantsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'viewMeetingparticipantsgrid',
    controller: 'commoninterfacesVctr',
    name: 'meetingParticipantsGrid',
    viewModel: 'commoninterfacesVm',
   
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 10000,
                storeId: 'tcmeetingparticipantsstr',
                proxy: {
                    url: 'common/getTcMeetingParticipants'
                }
            },
            isLoad: true
        }
    },
    tbar: [
        {
            xtype: 'hiddenfield',
            name: 'isReadOnly'
        }
    ],
    plugins: [{
        ptype: 'gridexporter'
    }, {
        ptype: 'cellediting',
        clicksToEdit: 1,
        editing: true
    }],
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [
                {
                    xtype: 'pagingtoolbar',
                    displayInfo: true,
                    width: '80%',
                    emptyMsg: 'No Records',
                    beforeLoad: function () {
                        var store = this.getStore(),
                            grid = this.up('grid'),
                            pnl = grid.up('panel'),
                            meeting_id = pnl.down('hiddenfield[name=meeting_id]').getValue();
                        store.getProxy().extraParams = {
                            meeting_id: meeting_id
                        }
                    }
                }
            ]
        }
    ],
    columns: [
        {
            text: 'Participant Name',
            dataIndex: 'participant_name',
            flex: 1
        },
        {
            text: 'Participant Contact',
            dataIndex: 'phone',
            flex: 1
        }
    ]
});
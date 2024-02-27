/**
 * Created by Softclans
 */
Ext.define('Admin.view.commoninterfaces.grids.TcMeetingParticipantsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'tcmeetingparticipantsgrid',
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
            isLoad: false
        }
    },
    tbar: [
        {
            xtype: 'hiddenfield',
            name: 'isReadOnly'
        },
        {
            xtype: 'button',
            text: 'Add',
            name: 'add_participant',
            iconCls: 'x-fa fa-plus',
            ui: 'soft-blue',
            handler: 'showAddTcMeetingParticipants',
            childXtype: 'meetingparticipantsgrid',
            winTitle: 'Meeting Participants',
            winWidth: '50%',
            stores: '[]'
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
                            mainTabPnl = pnl.up('#contentPanel'),
                            activeTab = mainTabPnl.getActiveTab(),
                            meeting_id = activeTab.down('hiddenfield[name=id]').getValue();
                        store.getProxy().extraParams = {
                            meeting_id: meeting_id
                        }
                    }
                },'->',{
                    xtype: 'button',
                    name: 'update_attendance',
                    text: 'Update Attendance',
                    ui: 'soft-blue',
                    hidden: true,
                    iconCls: 'fa fa-save',
                    listeners: {
                        beforerender: function(btn){
                            var grid = btn.up('grid'),
                                is_meeting = grid.is_meeting;
                            if(is_meeting == 1){
                                btn.setVisible(true);
                                grid.columns[2].setVisible(true);
                            }else{
                                grid.columns[2].setVisible(false);
                            }

                        },
                    },
                    handler: 'updateMeetingAttendance'
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
        },
        {
            text: 'Attendance',
            dataIndex: 'has_attended',
            // hidden: true,
            width: 100,
            editor: {
                xtype: 'checkbox',
                // checked: true,
                inputValue: '1',
                name: 'has_attended'

            },
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.tdStyle = 'color:white;background-color:green';
                    return "Attended";
                }else {
                    metaData.tdStyle = 'color:white;background-color:grey';
                    return "Missed";
                }
            }
        },
        {
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
                            text: 'Delete',
                            iconCls: 'x-fa fa-trash',
                            tooltip: 'Delete Record',
                            table_name: 'tc_meeting_participants',
                            // bind: {
                            //     hidden: '{isReadOnly}'
                            // },
                            storeID: 'tcmeetingparticipantsstr',
                            action_url: 'configurations/deleteConfigRecord',
                            action: 'actual_delete',
                            handler: 'doDeleteCommonParamWidgetParam',
                            // hidden: Admin.global.GlobalVars.checkForProcessVisibility('actual_delete')
                        }
                    ]
                }
            }, onWidgetAttach: function (col, widget, rec) {
                var grid =widget.up('grid'),
                    is_meeting = grid.is_meeting;
                if (is_meeting === 1 || is_meeting == 1) {
                    widget.setVisible(false);;
                } 
                else {
                    widget.setVisible(true);
                }
            }
        }
    ]
});
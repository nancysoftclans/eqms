/**
 * Created by Softclans
 */
Ext.define('Admin.view.commoninterfaces.grids.TcMeetingAgendasGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'tcmeetingagendasgrid',
    controller: 'commoninterfacesVctr',
    listeners: {
        beforerender: {
            fn: 'setConfigGridsStore',
            config: {
                pageSize: 10000,
                storeId: 'tcmeetingagendassstr',
                proxy: {
                    url: 'common/getTcMeetingAgendas'
                }
            },
            isLoad: true
        },
        afterrender: function () {
            var grid = this,
                isReadOnly = grid.down('hiddenfield[name=isReadOnly]').getValue(),
                add_btn = grid.down('button[name=add_agendas]'),
                widgetCol = grid.columns[grid.columns.length - 1];
            if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
                add_btn.setVisible(false);
                widgetCol.setHidden(true);
                widgetCol.widget.menu.items = [];
            } else {
                add_btn.setVisible(true);
                widgetCol.setHidden(false);
                widgetCol.widget.menu.items = [
                    {
                        text: 'Delete',
                        iconCls: 'x-fa fa-trash',
                        tooltip: 'Delete Record',
                        table_name: 'tc_meeting_agendas',
                        storeID: 'tcmeetingagendassstr',bind: {
                            hidden: '{isReadOnly}'  // negated
                        },
                        //action_url: 'common/deleteCommonRecord',
                        action_url: 'premiseregistration/deletePremiseRegRecord',
                        action: 'actual_delete',
                        handler: 'doDeleteCommonParamWidgetParam',
                      //  hidden: Admin.global.GlobalVars.checkForProcessVisibility('actual_delete')
                    }
                ];
            }
        }
    },
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [{
                xtype: 'pagingtoolbar',
                displayInfo: true,
                emptyMsg: 'No Records',
                table_name: 'tra_product_applications',
                beforeLoad: function () {
                    var store = this.getStore(),
                        grid = this.up('grid'),
                        mainTabPnl = grid.up('#contentPanel'),
                        containerPnl = mainTabPnl.getActiveTab(),
                        form = containerPnl.down('form'),
                        meeting_id = form.down('hiddenfield[name=id]').getValue();
                    store.getProxy().extraParams = {
                        meeting_id: meeting_id
                    };
                }
            }
            ]
        }
    ],
    columns: [
        {
            text: 'Agenda',
            dataIndex: 'agenda',
            flex: 1
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
                    items: [
                        {
                            text: 'Delete',
                            iconCls: 'x-fa fa-trash',
                            tooltip: 'Delete Record',
                            table_name: 'tc_meeting_agendas',
                            storeID: 'tcmeetingagendassstr',
                            //action_url: 'common/deleteCommonRecord',
                            action_url: 'premiseregistration/deletePremiseRegRecord',
                            action: 'actual_delete', bind: {
                                hidden: '{isReadOnly}'  // negated
                            },
                            handler: 'doDeleteCommonParamWidgetParam',
                           // hidden: Admin.global.GlobalVars.checkForProcessVisibility('actual_delete')
                        }
                    ]
                }
            }
        }
    ]
});
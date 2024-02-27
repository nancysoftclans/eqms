/**
 */
Ext.define('Admin.view.usermanagement.views.grids.DropGroupGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.dropgroupgrid',
    cls: 'dashboard-todo-list',
    collapseMode: 'header',
    hideHeaders: false,
    scroll: true,
    autoHeight: true,
    width: '100%',
    // requires: [
    //     'Ext.button.Button',
    //     'Ext.menu.Menu',
    //     'Ext.toolbar.Paging',
    //     'Admin.view.plugins.Searching',
    //     'Ext.grid.*'
    // ],
    selModel: {
        selType: 'checkboxmodel',
        mode: 'MULTI'
    },
    plugins:[
        {
            ptype:'gridfilters'
        }
    ],
    // multiSelect: true,
    stripeRows: true,
    //height: Ext.Element.getViewportHeight() - 550,
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        //enableTextSelection: true
        plugins: {
            ptype: 'gridviewdragdrop',
            dragGroup: 'dropgroupgridDDGroup',
            dropGroup: 'draggroupgridDDGroup'
        },
        listeners: {
            drop: 'onDropDropGroupGrid'
            /* drop: function (node, data, dropRec, dropPosition) {
                 var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
             }*/
        },
        dropZone: {
            overClass: 'dd-over-gridview'
        }
    },
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 10000,
                storeId: 'dropgroupstr',
                proxy: {
                    url: 'usermanagement/getAssignedUserGroups'
                }
            },
            isLoad: true
        }
    },
    bbar: [
        {
            xtype: 'pagingtoolbar',
            displayInfo: false,
            itemId: 'dropgroupgrid_paging',
            beforeLoad: function () {
                var store = this.getStore(),
                    userswizardfrm = this.up('grid').up('userswizardfrm'),
                    active_user_id = userswizardfrm.down('hiddenfield[name=active_user_id]').getValue();
                if (active_user_id) {
                     store.getProxy().extraParams = {
                            user_id: active_user_id
                        };
                }
            }
        },
        {
            xtype: 'displayfield',
            value: 'Assigned Groups',
            fieldStyle: {
                'color': 'green',
                'font-weight': 'bold'
            }
        }
    ],
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'name',
        text: 'Name',
        flex: 1,
        filter: {
            type: 'string'
        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'description',
        text: 'Description',
        flex: 1
    }]

});

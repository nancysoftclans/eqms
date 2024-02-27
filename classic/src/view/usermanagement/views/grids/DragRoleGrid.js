/**
 */
Ext.define('Admin.view.usermanagement.views.grids.DragRoleGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.dragrolegrid',
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
        selType: 'checkboxmodel'
    },
    stripeRows: true,
    //height: Ext.Element.getViewportHeight() - 460,
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        //enableTextSelection: true
        plugins: {
            ptype: 'gridviewdragdrop',
            dragGroup: 'dragrolegridDDGroup',
            dropGroup: 'droprolegridDDGroup'
        },
        listeners: {
            drop: 'onDropDragRoleGrid'
            /*  drop: function (node, data, dropRec, dropPosition) {
                  var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
              }*/
        }
    },
    // plugins:[
    //     {
    //         //ptype:'gridfilters'
    //     }
    // ],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 10000,
                storeId: 'dragrolestr',
                proxy: {
                    url: 'usermanagement/getOpenUserRoles',
                }
            },
            isLoad: true
        }
    },
    bbar: [
        {
            xtype: 'pagingtoolbar',
            displayInfo: false,
            itemId: 'dragrolegrid_paging',
            beforeLoad: function(){
                var store = this.getStore(),
                    userswizardfrm = this.up('grid').up('userswizardfrm'),
                    basicFrm = userswizardfrm.down('userbasicinfofrm'),
                    department_id = basicFrm.down('combo[name=department_id]').getValue(),
                    branch_id = basicFrm.down('combo[name=branch_id]').getValue(),
                    active_user_id = userswizardfrm.down('hiddenfield[name=active_user_id]').getValue();
                if (department_id && branch_id) {
                     store.getProxy().extraParams = {
                            user_id: active_user_id,
                            department_id: department_id,
                            branch_id: branch_id
                        };
                }
            }
        },
        {
            xtype: 'displayfield',
            value: 'Available Roles',
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

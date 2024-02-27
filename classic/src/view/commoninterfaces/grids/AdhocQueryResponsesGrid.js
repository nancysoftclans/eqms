Ext.define('Admin.view.commoninterfaces.grids.AdhocQueryResponsesGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'commoninterfacesVctr',
    xtype: 'adhocqueryresponsesgrid',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    height: 500,
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
        name: 'application_id'
    }, {
        xtype: 'hiddenfield',
        name: 'application_code'
    }, {
        xtype: 'hiddenfield',
        name: 'module_id'
    }, {
        xtype: 'hiddenfield',
        name: 'sub_module_id'
    }, {
        xtype: 'hiddenfield',
        name: 'section_id'
    }, {
        xtype: 'hiddenfield',
        name: 'is_manager_query'
    }, {
        xtype: 'hiddenfield',
        name: 'is_manager_query_response'
    }, {
        xtype: 'hiddenfield',
        name: 'item_resp_id'
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Checklist Category',
        labelWidth: 150,
        width: 400,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        name: 'category_id',
        queryMode: 'local',
        fieldStyle: {
            'color': 'green',
            'font-weight': 'bold'
        },
        listeners: {
            beforerender: {
                fn: 'setConfigCombosStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        extraParams: {
                            model_name: 'ChecklistCategory'
                        }
                    }
                },
                isLoad: true
            },
            change: function () {
                var store = this.up('grid').getStore();
                store.load();
            }
        },
        triggers: {
            clear: {
                type: 'clear',
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    }],
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    export_title: 'Queries',
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function () {
            var store = this.store,
                grid = this.up('grid'),
                application_id = grid.down('hiddenfield[name=application_id]').getValue(),
                application_code = grid.down('hiddenfield[name=application_code]').getValue(),
                module_id = grid.down('hiddenfield[name=module_id]').getValue(),
                sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
                section_id = grid.down('hiddenfield[name=section_id]').getValue(),
                checklist_category = grid.down('combo[name=category_id]').getValue(),
                is_manager_query = grid.down('hiddenfield[name=is_manager_query]').getValue();
            store.getProxy().extraParams = {
                application_id: application_id,
                application_code: application_code,
                module_id: module_id,
                sub_module_id: sub_module_id,
                section_id: section_id,
                checklist_category: checklist_category,
                is_manager_query: is_manager_query
            };
        }
    }],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }, {
        ftype: 'grouping',
        startCollapsed: true,
        //groupHeaderTpl: 'Checklist Type: {[values.rows[0].data.checklist_type]}, Checklist Item: {[values.rows[0].data.checklist_item_name]} [{rows.length} {[values.rows.length > 1 ? "queries" : "query"]}]',
        groupHeaderTpl: 'Checklist Item: {[values.rows[0].data.checklist_item_name]} [{rows.length} {[values.rows.length > 1 ? "queries" : "query"]}]',
        hideGroupedHeader: true,
        enableGroupingMenu: false
    }],
    listeners: {
        beforerender: {
            fn: 'setPremiseRegGridsStore',
            config: {
                pageSize: 10000,
                groupField: 'checklist_item_id',
                storeId: 'applicationadhocqueriesStr',
                proxy: {
                    url: 'common/getAllApplicationQueries'
                }
            },
            isLoad: true
        },
        afterrender: function () {
            var grid = this,
                is_manager_query_response = grid.down('hiddenfield[name=is_manager_query_response]').getValue();
            if ((is_manager_query_response) && is_manager_query_response > 0) {
                grid.columns[grid.columns.length - 1].widget.menu.items = [
                    {
                        text: 'Approve/Close Query',
                        iconCls: 'x-fa fa-check',
                        table_name: 'tra_checklistitems_queries',
                        storeID: 'applicationqueriesstr',
                        action: 'close_query',
                        action_url: 'common/closeApplicationQuery',
                        handler: 'closeApplicationQuery',
                        hidden: true
                    },{
                        text: 'Print Query Letter',
                        iconCls: 'x-fa fa-print',
                        tooltip: 'Preview query Letter',
                        action: 'preview_query',
                        handler: 'showPreviewQueryLetter',
                        stores: '[]',
                        // hidden: true
                    },{
                        text: 'Approve Query Letter',
                        iconCls: 'x-fa fa-print',
                        tooltip: 'Approve query Letter',
                        action: 'approve_query',
                        handler: 'showApproveQueryLetter',
                        stores: '[]',
                        // hidden: true
                    }, {
                        text: 'Edit',
                        iconCls: 'x-fa fa-edit',
                        tooltip: 'Edit Record',
                        action: 'edit',
                        childXtype: 'adhocqueryfrm',
                        winTitle: 'Edit Query',
                        winWidth: '75%',
                        handler: 'showEditAdhocQueryFrm',
                        stores: '[]',
                        hidden: true
                    }];
            } else {
                grid.columns[grid.columns.length - 1].widget.menu.items = [
                    {
                        text: 'Approve/Close Query',
                        iconCls: 'x-fa fa-check',
                        table_name: 'tra_checklistitems_queries',
                        storeID: 'applicationqueriesstr',
                        action: 'close_query',
                        action_url: 'common/closeApplicationQuery',
                        handler: 'closeApplicationQuery',
                        hidden: true
                    },{
                        text: 'Approve Query Letter',
                        iconCls: 'x-fa fa-sign-in',
                        tooltip: 'Approve query Letter',
                        action: 'approve_query',
                        handler: 'showApproveQueryLetter',
                        stores: '[]',
                        // hidden: true
                    },{
                        text: 'Print Query Letter',
                        iconCls: 'x-fa fa-print',
                        tooltip: 'Preview query Letter',
                        action: 'preview_query',
                        handler: 'showPreviewQueryLetter',
                        stores: '[]',
                        // hidden: true
                    }, {
                        text: 'Edit Query',
                        iconCls: 'x-fa fa-edit',
                        tooltip: 'Edit Record',
                        action: 'edit',
                        childXtype: 'applicationqueryfrm',
                        winTitle: 'Query',
                        winWidth: '75%',
                        handler: 'showEditAdhocQueryFrm',
                        stores: '[]',
                        hidden: true
                    }];
            }
            
        }
    },
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'query',
        text: 'Query',
        flex: 1,
        tdCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'comment',
        text: 'Comment',
        hidden: true,
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'queried_by',
        text: 'Queried By',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'queried_on',
        text: 'Queried On',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'reference_details',
        text: 'Reference Details',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'reference_section',
        text: 'Reference Section',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'last_response',
        text: 'Response',
        tdCls: 'wrap',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'manager_queryresp_comment',
        text: 'Manager Query Response Comment',
        tdCls: 'wrap',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'query_status',
        text: 'Status',
        flex: 1
    }, {
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
                items: []
            }
        }, onWidgetAttach: function (col, widget, rec) {
            var status = rec.get('status'),
                grid = widget.up('grid'),
                is_manager_query_response = grid.down('hiddenfield[name=is_manager_query_response]').getValue();
            if ((is_manager_query_response) && is_manager_query_response > 0) {
                if (status === 1 || status == 1) {//open
                    widget.down('menu menuitem[action=edit]').setVisible(true);
                    widget.down('menu menuitem[action=close_query]').setVisible(false);
                }
                if (status === 2 || status == 2) {//responded
                    widget.down('menu menuitem[action=close_query]').setVisible(true);
                    widget.down('menu menuitem[action=edit]').setVisible(true);
                }
                if (status == 4 || status === 4) {//closed
                    widget.down('menu menuitem[action=close_query]').setVisible(false);
                }
            } else {
                if (status === 1 || status == 1) {//open
                    widget.down('menu menuitem[action=edit]').setVisible(true);
                    widget.down('menu menuitem[action=close_query]').setVisible(true);
                }
                if (status === 2 || status == 2) {//responded
                    widget.down('menu menuitem[action=close_query]').setVisible(true);
                    widget.down('menu menuitem[action=edit]').setVisible(false);
                }
                if (status == 3 || status === 3) {//re queried
                }
                if (status == 4 || status === 4) {//closed
                    widget.down('menu menuitem[action=close_query]').setVisible(false);
                }
            }
        }
    }]
});

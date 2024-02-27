/**
 */
Ext.define('Admin.view.commoninterfaces.grids.ApplicationQueriesGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'commoninterfacesVctr',
    xtype: 'applicationqueriesgrid',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    height: 500,
    frame: true,
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var queryref_status_id = record.get('queryref_status_id');
            if (queryref_status_id == 0 || queryref_status_id === 0) {
                return 'valid-row';
            }
        }
    },
    tbar: [{
        xtype: 'button',
        text: 'Add Query',
        iconCls: 'x-fa fa-plus',
        ui: 'soft-blue',
        name: 'add_query',
        storeID: 'applicationqueriesstr',
        handler: 'showAddApplicationQueryForm',
        stores: '[]'
    },{
        xtype: 'button',
        text: 'Auto Generate (Based on Checklist)',
        iconCls: 'x-fa fa-plus',
        ui: 'soft-blue',
        name: 'add_query',
        storeID: 'applicationqueriesstr',
        handler: 'autoGenerateChecklistBasedQueries',
        stores: '[]'
    }, {
        xtype: 'exportbtn'
    }, {
        xtype: 'hiddenfield',
        name: 'isReadOnly'
    }, {
        xtype: 'hiddenfield',
        name: 'checklistquery_type_id'
    }, {
        xtype: 'hiddenfield',
        name: 'pass_status'
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
        name: 'application_code'
    }, {
        xtype: 'hiddenfield',
        name: 'workflow_stage_id'
    }, {
        xtype: 'hiddenfield',
        name: 'process_id'
    },{
        xtype: 'hiddenfield',
        name: 'is_manager_query'
    },{
        xtype: 'hiddenfield',
        name: 'is_manager_query_response'
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
                module_id = grid.down('hiddenfield[name=module_id]').getValue(),
                sub_module_id = grid.down('hiddenfield[name=sub_module_id]').getValue(),
                section_id = grid.down('hiddenfield[name=section_id]').getValue(),
                application_code = grid.down('hiddenfield[name=application_code]').getValue(),
                process_id = grid.down('hiddenfield[name=process_id]').getValue(),
                workflow_stage_id = grid.down('hiddenfield[name=workflow_stage_id]').getValue();

            store.getProxy().extraParams = {
                module_id: module_id,
                sub_module_id: sub_module_id,
                section_id: section_id,
                application_code: application_code,
                process_id: process_id,
                workflow_stage_id: workflow_stage_id
            };
        }
    }],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    listeners: {
        beforerender: {
            fn: 'setCommonGridsStore',
            config: {
                pageSize: 10000,
                storeId: 'applicationqueriesstr',
                proxy: {
                    url: 'common/getApplicationChecklistQueries'
                }
            },
            isLoad: true
        },
        afterrender: function () {
            var grid = this,
                isReadOnly = grid.down('hiddenfield[name=isReadOnly]').getValue(),
                pass_status = grid.down('hiddenfield[name=pass_status]').getValue(),
                add_btn = grid.down('button[name=add_query]');
            if ((isReadOnly) && isReadOnly > 0) {
                add_btn.setVisible(false);
                grid.columns[grid.columns.length - 1].widget.menu.items = [
                    {
                        text: 'Previous Responses',
                        iconCls: 'x-fa fa-exchange',
                        handler: 'showQueryPrevResponses',
                        stores: '[]'
                    }];
            } else {
                if (pass_status == 1 || pass_status === 1) {

                } else {
                    add_btn.setVisible(true);
                    grid.columns[grid.columns.length - 1].widget.menu.items = [
                         {
                            text: 'Edit Query',
                            iconCls: 'x-fa fa-edit',
                            tooltip: 'Edit Record',
                            action: 'edit',
                            childXtype: 'applicationRaiseQueryFrm',
                            winTitle: 'Query',
                            winWidth: '70%',
                            handler: 'showEditApplicationQueryForm',
                            stores: '[]',
                            hidden: true
                        },{
                            text: 'Previous Responses',
                            iconCls: 'x-fa fa-exchange',
                            disabled: true,
                            hidden: true,
                            handler: 'showQueryPrevResponses',
                            stores: '[]'
                        }, {
                            text: 'Close Query',
                            iconCls: 'x-fa fa-check',
                            table_name: 'tra_checklistitems_queries',
                            storeID: 'applicationqueriesstr',
                            action: 'close_query',
                            action_url: 'common/closeApplicationQuery',
                            handler: 'closeApplicationQuery',
                            hidden: true
                        },{
                            text: 'Approve Query Letter',
                            iconCls: 'x-fa fa-print',
                            tooltip: 'Approve query Letter',
                            action: 'approve_query',
                            handler: 'showApproveQueryLetter',
                            stores: '[]',
                            // hidden: true
                        },{
                            text: 'Preview Query Letter',
                            iconCls: 'x-fa fa-sign-in',
                            tooltip: 'Preview query Letter',
                            action: 'preview_query',
                            handler: 'showPreviewQueryLetter',
                            stores: '[]',
                            // hidden: true
                        }, {
                            text: 'Re-Query/Re-Open Query',
                            iconCls: 'x-fa fa-reply',
                            action: 're_query',
                            handler: 'showReQueryApplicationQueryForm',
                            stores: '[]',
                            hidden: true
                        }, {
                            text: 'Delete Query',
                            iconCls: 'x-fa fa-trash',
                            tooltip: 'Delete Record',
                            table_name: 'tra_checklistitems_queries',
                            storeID: 'applicationqueriesstr',
                            action_url: 'common/deleteChecklistRaisedQuery',
                            action: 'actual_delete',
                            handler: 'deleteChecklistRaisedQuery',
                            hidden: true
                        }];
                }
            }
        }
    },
    columns: [{
        xtype: 'rownumberer'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'query_ref',
        text: 'Query Ref No',
        tdCls:'wrap-text',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'checklist_category',
        text: 'Query Category',
        hidden: true,
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'query_type',
        text: 'Query Type',
        width: 100,
        tdCls: 'wrap'
    }, {
        xtype: 'datecolumn',
        dataIndex: 'queried_on',
        text: 'Query Date',
        format: 'Y-m-d',
        width: 100,
        tdCls: 'wrap'
    }, {
        xtype: 'datecolumn',
        dataIndex: 'query_submission_date',
        text: 'Submission Date',
        format: 'Y-m-d',
        width: 100,
        tdCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'query_response',
        text: 'Responses',
        flex: 1
    }, {
        xtype: 'datecolumn',
        dataIndex: 'responded_on',
        text: 'Response Date',
        format: 'Y-m-d',
        width: 100,
        tdCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'query_remark',
        text: 'Remarks',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'status_id',
        text: 'Status',
        width: 100,
        renderer: function (value, metaData) {
            if (value == 1) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Open";
            }
            if (value == 5) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Approved";
            }
            if (value == 2) {
                metaData.tdStyle = 'color:green;background-color:white';
                return "Responded";
            }
            if (value == 3) {
                metaData.tdStyle = 'color:white;background-color:gray';
                return "Re-Queried";
            }
            if (value == 4) {
                metaData.tdStyle = 'color:white;background-color:gray';
                return "Closed";
            }

            metaData.tdStyle = 'color:white;background-color:red';
            return "Not Tracked";
        }
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
            var status = rec.get('status_id'),
                grid = widget.up('grid'),
                queried_by = rec.get('queried_by'),
                isReadOnly = grid.down('hiddenfield[name=isReadOnly]').getValue();
            if ((isReadOnly) && isReadOnly > 0) {
                //do nothing
            } else {
                if (status === 1 || status == 1) {//open
                    // widget.down('menu menuitem[action=actual_delete]').setVisible(true);
                    widget.down('menu menuitem[action=edit]').setVisible(true);
                    widget.down('menu menuitem[action=re_query]').setVisible(false);
                    widget.down('menu menuitem[action=close_query]').setVisible(true);
                }
                if (status === 5 || status == 5) {//open
                    // widget.down('menu menuitem[action=actual_delete]').setVisible(true);
                    widget.down('menu menuitem[action=edit]').setVisible(true);
                    widget.down('menu menuitem[action=re_query]').setVisible(false);
                    widget.down('menu menuitem[action=close_query]').setVisible(true);
                }
                if (status === 2 || status == 2) {//responded
                    widget.down('menu menuitem[action=re_query]').setVisible(true);
                    widget.down('menu menuitem[action=close_query]').setVisible(true);
                    // widget.down('menu menuitem[action=actual_delete]').setVisible(false);
                    widget.down('menu menuitem[action=edit]').setVisible(false);
                }
                if (status == 3 || status === 3) {//re queried
                    widget.down('menu menuitem[action=re_query]').setVisible(false);
                }
                if (status == 4 || status === 4) {//closed
                    widget.down('menu menuitem[action=re_query]').setVisible(true);
                    widget.down('menu menuitem[action=close_query]').setVisible(false);
                    widget.down('menu menuitem[action=edit]').setVisible(false);
                }
                if(queried_by == user_id){
                    widget.down('menu menuitem[action=actual_delete]').setVisible(true);
                }else{
                    widget.down('menu menuitem[action=actual_delete]').setVisible(false);
                }
            }
        }
    }]
});

/**
 */
Ext.define('Admin.view.commoninterfaces.grids.ApplicationCommentsGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'commoninterfacesVctr',
    xtype: 'applicationcommentsgrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    height: 400,
    width: '100%',
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
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    export_title: 'Application comments',
    bbar: [
    {
        xtype: 'hiddenfield',
        name: '_token',
        value: token
    },{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function () {
            this.up('grid').fireEvent('refresh', this.up('grid'));
        }
    }],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    features: [{
        ftype: 'grouping',
        startCollapsed: true,
        groupHeaderTpl: 'Service Type => {[values.rows[0].data.recommendation]} ({rows.length})',
        hideGroupedHeader: false,
        enableGroupingMenu: false
    }],
    listeners: {
        beforerender: {
            fn: 'setPremiseRegGridsStore',
            config: {
                pageSize: 10000,
                storeId: 'applicationcommentsstr',
                groupField: 'recommendation_id',
                proxy: {
                    url: 'configurations/getApplicationComments'
                }
            },
            isLoad: true
        }
    },
    columns: [
    {
        xtype: 'gridcolumn',
        dataIndex: 'recommendation',
        text: 'Recommendation',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'remarks',
        text: 'Comment',
        flex: 1
    }, {
        xtype: 'datecolumn',
        dataIndex: 'assessment_start_date',
        hidden: true,
        text: 'Assessment Start Date',
        flex: 1,
        // renderer: Ext.util.Format.dateRenderer('Y/m/d H:i:s')
    }, {
        xtype: 'datecolumn',
        dataIndex: 'assessment_end_date',
        hidden: true,
        text: 'Asessment End Date',
        flex: 1,
        // renderer: Ext.util.Format.dateRenderer('Y/m/d H:i:s')
    }, {
        xtype: 'datecolumn',
        dataIndex: 'created_on',
        text: 'Date',
        flex: 1,
        // renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'author',
        text: 'Author',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'stage_name',
        text: 'Origin',
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
                items: [{
                    text: 'Edit',
                    iconCls: 'x-fa fa-edit',
                    tooltip: 'View Task',
                    action: 'edit',
                    hidden: true,
                    handler: 'showEditApplicationComment',
                    stores: '[]'
                }, {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Record',
                    table_name: 'tra_evaluation_recommendations',
                    storeID: 'applicationcommentsstr',
                    action_url: 'configurations/deleteConfigRecord',
                    action: 'actual_delete',
                    hidden: true,
                    handler: 'doDeleteCommonWidgetParam',
                    
                }
                ]
            }
        },
        onWidgetAttach: function (col, widget, rec) {
            var author_id = rec.get('author_id'),
                current_user = rec.get('current_user');
            if(author_id == current_user){
                widget.down('menu menuitem[action=actual_delete]').setVisible(true);
                widget.down('menu menuitem[action=edit]').setVisible(true);
            }
                

        }
    }]
});

/**
 */
Ext.define('Admin.view.commoninterfaces.grids.RcRecommendationLogGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'rcRecommendationLogGrid',
    controller: 'commoninterfacesVctr',
    autoScroll: true,
    width: '100%',
    height: Ext.Element.getViewportHeight() - 118,
    tbar: [{
        xtype: 'exportbtn'
    }, {
        xtype: 'hiddenfield',
        name: 'application_code'
    }, {
        xtype: 'hiddenfield',
        name: 'stage_category_id'
    }, {
        xtype: 'hiddenfield',
        name: 'module_id'
    }, {
        xtype: 'hiddenfield',
        name: 'meeting_id'
    }],
    plugins: [{
        ptype: 'gridexporter'
    }],
    features: [{
        ftype: 'grouping',
        startCollapsed: true,
        groupHeaderTpl: 'Service Type => {[values.rows[0].data.recommendation]} ({rows.length})',
        hideGroupedHeader: true,
        enableGroupingMenu: false
    }],
    listeners: {
        beforerender: {
            fn: 'setPremiseRegGridsStore',
            config: {
                pageSize: 1000,
                storeId: 'rcRecommendationLogGridStr',
                groupField: 'recommendation_id',
                proxy: {
                    url: 'common/getRcRecommendationLogs'
                }
            },
            isLoad: true
        }
    },
    columns: [{
        xtype: 'rownumberer',
        text: 'S/N'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'participant_name',
        text: 'Member',
        flex: 1,
        tdCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'recommendation_date',
        text: 'Recommendation Date',
        flex: 1,
        tdCls: 'wrap'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'recommendation_id',
        text: 'Recommendation',
        align: 'center',
        flex: 1,
        renderer: function (value, metaData) {
            if (value == 1) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Recommended";
            }

            metaData.tdStyle = 'color:white;background-color:red';
            return "Not Recommended";
        }
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
                application_code = grid.down('hiddenfield[name=application_code]').getValue(),
                stage_category_id = grid.down('hiddenfield[name=stage_category_id]').getValue(),
                module_id = grid.down('hiddenfield[name=module_id]').getValue(),
                meeting_id = grid.down('hiddenfield[name=meeting_id]').getValue();

            store.getProxy().extraParams = {
                application_code: application_code,
                stage_category_id: stage_category_id,
                module_id: module_id,
                meeting_id: meeting_id
            };
        }
    }]
});

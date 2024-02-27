/**
 */
Ext.define('Admin.view.commoninterfaces.grids.VariationRequestsAbstractGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'variationrequestsabstractgrid',
    controller: 'commoninterfacesVctr',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display'
    },
    selModel: {
        selType: 'checkboxmodel'
    },
    features: [{
        ftype: 'searching',
        mode: 'local',
        minChars: 2
    }],
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    tbar: [{
        xtype: 'hiddenfield',
        name: 'isReadOnly'
    },{
        xtype: 'hiddenfield',
        name: 'application_code'
    },{
        xtype: 'hiddenfield',
        name: 'application_id'
    },  {
        xtype: 'button',
        text: 'Add Request',
        iconCls: 'x-fa fa-plus',
        ui: 'soft-blue',
        name: 'add_variation',
        winTitle: 'Amendment/Variation Request',
        childXtype: 'applicationvariationrequestsfrm',
        winWidth: '60%',
        stores: '[]'
    }, {
        xtype: 'exportbtn'
    }],
    listeners: {
        beforerender: {
            fn: 'setCommonGridsStore',
            config: {
                pageSize: 1000,
                storeId: 'variationrequestsabstractstr',
                proxy: {
                    url: 'common/getApplicationVariationRequests',
                }
            },
            isLoad: true
        }
    },
    initComponent: function () {
        var defaultColumns = [
            {
                xtype: 'rownumberer'
            },{
                xtype: 'gridcolumn',
                dataIndex: 'id',
                text: 'Ref ID',
                hidden: true,
                width: 50
            },{
                xtype: 'gridcolumn',
                dataIndex: 'variation_type',
                text: 'Variation Type',
                width: 200,
                tdCls: 'wrap'
            },{
                xtype: 'gridcolumn',
                dataIndex: 'variation_number',
                text: 'Variation Number',
                hidden: true,
                width: 200,
                tdCls: 'wrap'
            },{
                xtype: 'gridcolumn',
                dataIndex: 'variation_no_description',
                hidden: true,
                text: 'Variation Number Description',
                width: 200,
                tdCls: 'wrap'
            },{
                xtype: 'gridcolumn',
                dataIndex: 'present_details',
                text: 'Present(Approved) Detail',
                width: 200,
                tdCls: 'wrap'
            },{
                xtype: 'gridcolumn',
                dataIndex: 'proposed_variation',
                text: 'Proposed Detail',
                width: 200,
                tdCls: 'wrap'
            },{
                xtype: 'gridcolumn',
                dataIndex: 'variation_background_information',
                text: 'Variation Justification',
                flex: 1,
                tdCls: 'wrap'
            },{
                xtype:'actioncolumn',
                width:50,
                items: [{
                    iconCls: 'x-fa fa-download',
                    tooltip: 'Download Document',
                    ui:'soft-blue',
                    text: 'Download Document',
                    handler: 'funcDOwnloadApplicationVariationDoc'
                }]
            }
        ];
        this.columns = defaultColumns.concat(this.columns);
        this.callParent(arguments);
    
    }
});

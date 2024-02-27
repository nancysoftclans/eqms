Ext.define('Admin.view.summaryreport.controlleddocumentsrpt.grid.ControlledDocumentsSummaryGrid',{
	extend: 'Ext.grid.Panel',
	xtype: 'controlleddocumentssummarygrid',
	width: '100%',
    listeners: {
        beforerender: {
            fn: 'setConfigGridsStore',
            config: {
                pageSize: 100,
                storeId: 'controlleddocumentssummarystr',
                groupField: 'document_type',
                proxy: {
                    url: 'summaryreport/getControlledDocumentsSummaryRpt'
                }
            },
            isLoad: true
        }
    },
	columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'directorate_name',
        name: 'directorate_name',
        text: 'Directorate Name',
        flex: 1,
        tbCls: 'wrap',
    },{
        xtype: 'gridcolumn',
        dataIndex: 'directorate_unit',
        name: 'directorate_unit',
        text: 'Directorate Unit',
        flex: 1,
        tbCls: 'wrap',
    },{
        xtype: 'gridcolumn',
        dataIndex: 'document_type',
        name: 'document_type',
        text: 'Document Type',
        flex: 1,
        tbCls: 'wrap',
    },{
        xtype: 'gridcolumn',
        dataIndex: 'no_of_documents',
        name: 'no_of_documents',
        text: 'Number of Controlled Documents',
        flex: 0.5,
        tbCls: 'wrap'
    },{
        xtype: 'widgetcolumn',
        text: 'View Controlled Documents',
        widht: 150,
        widget: {
            xtype: 'button',
            iconCls: 'x-fa fa-file',
            ui: 'soft-green',
            text: 'Preview Controlled Documents Type',
            name: 'certificate',
            tooltip: 'Preview Controlled Documents Type',
            childXtype:'controllleddocumentsaccessgrid',
            winTitle:'List of Controlled Documents Type',
            winWidth:'85%',
            handler: 'previewControlledDocumentsType'
        }
    }],
    features: [{
        ftype:'groupingsummary',
        startCollapsed: true,
        groupHeaderTpl: 'Controlled Document-Type: {[values.rows[0].data.document_type]} [{rows.length} {[values.rows.length > 1 ? "Applications" : "Application"]}]',
    }],
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '80%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} out of {2}',
        emptyMsg: 'No Records',
        beforeLoad: function() {
        		var grid=this.up('grid'),
        			pnl=grid.up('panel'),
        			filter=pnl.down('form'),
                    document_type_id = filter.down('combo[name=document_type_id]').getValue(),
                    directorate_id = filter.down('combo[name=directorate_id]').getValue(),			          
                       
			           directorate_unit_id = filter.down('combo[name=directorate_unit_id]').getValue(),
			           from_date = filter.down('datefield[name=from_date]').getValue(),
			           to_date = filter.down('textfield[name=to_date]').getValue();

        		 var store=this.getStore();
        		 store.getProxy().extraParams = {
                           document_type_id: document_type_id,
                            directorate_id:directorate_id,
                            directorate_unit_id: directorate_unit_id,
                            from_date: from_date,
                            to_date: to_date

                }
                
        	},

        
        
    },'->',{
        xtype:'button',
        ui: 'soft-green',
        text: 'Print(Summary Report)',
        iconCls: 'x-fa fa-file',
        handler: 'printControlledDocumentsTypeReport'
    },]
});
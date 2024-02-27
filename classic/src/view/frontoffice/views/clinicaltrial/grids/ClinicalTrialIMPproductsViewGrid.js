 Ext.define('Admin.view.frontoffice.clinicaltrial.grids.ClinicalTrialIMPproductsViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   titleCollapse: true,
   width: '100%',
   collapsible: true,
    xtype: 'clinicaltrialimpproductview',
    layout:'fit',
    title: 'IMP Product information',
     viewConfig: {
            emptyText: 'No information found'
        },
        listeners: {
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'clinicaltrialimpproductsstr',
                    proxy: {
                        url: 'openoffice/getClinicalTrialsIMPProducts',
                        
                    }
                },
                isLoad: true
            },
        
        },
        bbar: [{
            xtype: 'pagingtoolbar',
            width: '100%',
            displayInfo: true,
            hidden:true,
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
        }],
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'category',
        name: 'category',
        text: 'Product Category',
        width: 150,
        tbCls: 'wrap'
        
    },{
        xtype: 'gridcolumn',
        dataIndex: 'brand_name',
        name: 'brand_name',
        text: 'Brand Name',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'generic_name',
        name: 'generic_name',
        text: 'Generic Name',
        width: 150,
        tbCls: 'wrap'
        
    },{
        xtype: 'gridcolumn',
        dataIndex: 'dosage_form',
        name: 'dosage_form',
        text: 'Dosage Form',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'adminRoute',
        name: 'adminRoute',
        text: 'Route of Administration',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'product_strength',
        name: 'product_strength',
        text: 'Strength',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'Units',
        name: 'Units',
        text: 'Unit',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'registration_no',
        name: 'registration_no',
        text: 'Registration No.',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'identification_mark',
        name: 'identification_mark',
        text: 'Identification Mark',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'mrktLocation',
        name: 'mrktLocation',
        text: 'Market Location',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'product_desc',
        name: 'product_desc',
        text: 'Product Desc',
        width: 150,
        tbCls: 'wrap'
    }]


  });
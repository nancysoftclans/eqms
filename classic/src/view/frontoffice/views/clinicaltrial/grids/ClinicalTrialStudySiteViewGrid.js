 Ext.define('Admin.view.frontoffice.clinicaltrial.grids.ClinicalTrialStudySiteViewGrid', {
 extend: 'Ext.grid.Panel',  
   scroll: true,
   titleCollapse: true,
   width: '100%',
   collapsible: true,
    xtype: 'clinicaltrialstudysiteview',
    layout:'fit',
    title: 'Study Site Details',
     viewConfig: {
            emptyText: 'No information found'
        },
        listeners: {
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'clinicaltrialstudysitestr',
                    proxy: {
                        url: 'openoffice/getClinicalTrialsStudySite',
                        
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
        dataIndex: 'site',
        name: 'site',
        text: 'Site Name',
        width: 150,
        tbCls: 'wrap'
        
    },{
        xtype: 'gridcolumn',
        dataIndex: 'country',
        name: 'country',
        text: 'Site Country',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'region',
        name: 'region',
        text: 'Site Region',
        width: 150,
        tbCls: 'wrap'
        
    },{
        xtype: 'gridcolumn',
        dataIndex: 'postal_address',
        name: 'postal_address',
        text: 'Postal Address',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'physical_address',
        name: 'physical_address',
        text: 'Physical Address',
        width: 150,
        tbCls: 'wrap'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'telephone',
        name: 'telephone',
        text: 'Telephone',
        width: 150,
        tbCls: 'wrap'
    }]


  });

/**
 * Created by Softclans 
 */
Ext.define('Admin.view.documentsManagement.views.panels.PoeInspectionDetailsPnl', {
    extend: 'Ext.tab.Panel',
    xtype: 'poeinspectiondetailspnl',
    layout: 'fit',
    defaults:{
        margin: 3
    },viewModel: {
        type: 'documentcreationvm'
    },
    items: [{
       // xtype: 'poeinspectionpnlfrm',
        autoScroll: true,
        collapsible: true,
        height: 250,
        title: 'Import/Export Inspection Details',
        buttons:[{
            text:'Save Inspection Details',
            iconCls:'x-fa fa-save',
            ui:'soft-blue',
            action_url:'savePOEInspectionPermitDetails',
            handler:'funcSavePOEInspectionPermitDetails'
        }]
    }, {
        xtype: 'docuploadsgrid',
        region: 'center',
        title: 'Import/Export Permit Products Details',
    },
    // {
    //     xtype: 'productscreeninggrid',
    //     title: 'Consignment Checklist'
    // },  
    // {
    //     xtype: 'previousinspectionsgrid',
    //     autoScroll:true,
    //     region: 'south',
    //     title: 'Previous Inspections',
        
    // },
    {
        xtype: 'hiddenfield',
        name: '_token',
        value: token
    }]
});



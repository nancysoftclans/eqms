
/**
 * Created by Softclans
 */
Ext.define('Admin.view.documentManager.views.panels.InspectionImportExportDetailsPnl', {
    extend: 'Ext.tab.Panel',
    xtype: 'inspectionimportexportdetailspnl',
    layout:  'fit',
    defaults:{
        margin: 3
    },
    viewModel: 'documentcreationvm',
    items: [{
        xtype: 'docdefinationrequirementfrm',
        autoScroll: true,
        title: 'Import/Export Permit Information'
    }, 
    // {
    //     xtype: 'senderreceiverdetailsfrm',
    //     hidden: true,
    //     title: 'Sender/Receiver Details',
    // },{
    //     xtype: 'importexportpermitsproductsgrid', autoScroll: true,hidden: true,
    //     title: 'Import/Export Permit Products Details',
    // },  
    {
        xtype: 'hiddenfield',
        name: '_token',
        value: token
    }]
});



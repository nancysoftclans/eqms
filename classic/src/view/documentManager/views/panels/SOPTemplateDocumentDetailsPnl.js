
Ext.define('Admin.view.documentManager.views.panels.SOPTemplateDocumentDetailsPnl', {
    extend: 'Ext.tab.Panel',
    xtype: 'soptemplatedocumentdetailspnl',
    layout: {//
        type: 'fit'
    },
    defaults:{
        margin: 3
    },viewModel: {
        type: 'documentcreationvm'
    },
    // listeners: {
    //     tabchange: 'funcActiveImportOtherInformationTab'
    // },
    items: [{
            xtype: 'soptemplatedoclistfrm',
            autoScroll: true, 
            title: 'TEMPLATE DETAILS'
           },
        {
        xtype: 'hiddenfield',
        name: '_token',
        value: token
    }]
});



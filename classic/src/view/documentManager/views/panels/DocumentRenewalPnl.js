
Ext.define('Admin.view.documentManager.views.panels.DocumentRenewalPnl', {
    extend: 'Ext.tab.Panel',
    xtype: 'documentrenewalpnl',
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
            xtype: 'docrenewalfrm',
            autoScroll: true, 
            title: 'DOCUMENT DETAILS'
           },
        {
        xtype: 'hiddenfield',
        name: '_token',
        value: token
    }]
});



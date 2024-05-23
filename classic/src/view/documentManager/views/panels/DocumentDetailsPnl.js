
Ext.define('Admin.view.documentManager.views.panels.DocumentDetailsPnl', {
    extend: 'Ext.tab.Panel',
    xtype: 'documentdetailspnl',
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
            xtype: 'docdefinationrequirementfrm',
            autoScroll: true, 
            title: 'DOCUMENT DETAILS'
           },
        {
        xtype: 'hiddenfield',
        name: '_token',
        value: token
    }]
});



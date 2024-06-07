
Ext.define('Admin.view.auditManagement.views.panels.AuditsMainDetailsPnl', {
    extend: 'Ext.tab.Panel',
    xtype: 'auditsmaindetailspnl',
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
            xtype: 'auditPlanMainDetailsFrm',
            autoScroll: true, 
            title: 'Audit Details'
           },
        {
        xtype: 'hiddenfield',
        name: '_token',
        value: token
    }]
});



Ext.define('Admin.view.auditManagement.views.panels.LogPanel', {
    extend: 'Ext.window.Window',
    xtype: 'logpanel',
    itemId: 'logpanel',
    layout: 'fit',
    width: '100%',
    height: '100%',  
    //collapsible: true,
    //collapsed: true, // Initially collapsed
    items: [{
        xtype: 'loggrid'  
    }]
});

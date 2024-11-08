Ext.define('Admin.view.issuemanagement.views.panels.LogPanel', {
    extend: 'Ext.window.Window',
    xtype: 'logpanel',
    itemId: 'logpanel',
    layout: 'fit',
    width: 800,
    height: '100%',  
    //collapsible: true,
    //collapsed: true, // Initially collapsed
    items: [{
        xtype: 'issueloggrid'  
    }]
});

Ext.define('Admin.view.documentManager.views.panels.DocumentArchive',  {
    extend: 'Ext.panel.Panel',
    xtype: 'documentarchive',
    title: 'Document Type',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'documentarchivegrid'
        }
    ]
});

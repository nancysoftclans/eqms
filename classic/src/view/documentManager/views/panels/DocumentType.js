Ext.define('Admin.view.documentManager.views.panels.DocumentType',  {
    extend: 'Ext.panel.Panel',
    xtype: 'documenttype',
    title: 'Document Type',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'documenttypegrid'
        }
    ]
});

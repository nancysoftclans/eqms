Ext.define('Admin.view.documentsManagement.views.panels.DocumentType',  {
    extend: 'Ext.panel.Panel',
    xtype: 'documenttype',
    title: 'Forms Categories',
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

Ext.define('Admin.view.configurations.views.panels.EmailTemplatesPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'emailtemplatespnl',
    title: 'Email Templates',
    userCls: 'big-100 small-100',
    controller: 'configurationsvctr',
    viewModel: 'configurationsvm',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },
    items: [
        {
            xtype: 'emailtemplatesgrid'
        }
    ]
});

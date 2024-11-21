/**
 * Created by softclans
 */

Ext.define('Admin.view.documentManager.views.toolbars.DocumentRenewTb', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'documentrenewtb',
    ui: 'footer',
    defaults: {
        //arrowAlign: 'bottom',
        ui: 'soft-blue',
        iconAlign: 'top'
    },
    requires: [
        'Ext.ux.BoxReorderer'
    ],
    plugins: 'boxreorderer',
    overflowHandler: 'scroller',
    items: [
        {
            text: 'Home',
            iconCls: 'x-fa fa-home',
            sec_dashboard:'livedocumentapplicationwrapper',
            name: 'disposalpermitstbRegHomeBtn'
        },
        {
                text: 'Renew Document',
                iconCls: 'x-fa fa-edit',
                handler:'onInitiateLiveDocumentApplication',
                app_type: 105,
                renewal: 1
        },
       
    ]
});
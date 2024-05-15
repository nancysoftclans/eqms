/**
 * Created by softclans
 */
Ext.define('Admin.view.documentManager.views.toolbars.DocumentTypeTb', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'documenttypetb',
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
            sec_dashboard:'documentapplicationwrapper',
            name: 'disposalpermitstbRegHomeBtn'
        },
        {
            text: 'Initiate Document Creation',
            iconCls: 'x-fa fa-plus-square',
            menu:{
                xtype: 'menu',
                items:[{
                    text: 'Document Creation Application',
                    iconCls: 'x-fa fa-sitemap',
                    handler:'onInitiateDocumentApplication',
                    app_type: 101
                }
                ]
            }
        },
       
    ]
});
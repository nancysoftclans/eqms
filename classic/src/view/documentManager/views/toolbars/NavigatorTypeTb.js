/**
 * Created by softclans
 */
Ext.define('Admin.view.documentManager.views.toolbars.NavigatorTypeTb', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'navigatortypetb',
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
            hidden: true,
            sec_dashboard:'documentapplicationwrapper',
            name: 'disposalpermitstbRegHomeBtn'
        },
        {
            text: 'Create Document',
            iconCls: 'x-fa fa-plus-square',
            handler:'onInitiateNavigatorApplication',
            app_type: 101
            // menu:{
            //     xtype: 'menu',
            //     items:[{
            //         text: 'Create Document',
            //         iconCls: 'x-fa fa-sitemap',
            //         handler:'onInitiateDocumentApplication',
            //         app_type: 101
            //     }
            //     ]
            // }
        },
       
    ]
});
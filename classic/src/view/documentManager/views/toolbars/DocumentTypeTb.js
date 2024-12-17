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
            text: 'Create Document',
            handler:'onInitiateDocumentApplication',
            iconCls: 'x-fa fa-plus-square',
            app_type: 104,
            //  menu:{
            //     xtype: 'menu',
            //         items:[{
            //         text: 'Quality Manual',
            //         iconCls: 'x-fa fa-envelope',
            //         handler:'onInitiateDocumentApplication',
            //         app_type: 101,
            //         hidden: true
            //     },
            //     {
            //         text: 'Template for Procedures, WI, Policies, Appendix',
            //         iconCls: 'x-fa fa-file',
            //         handler:'onInitiateDocumentApplication',
            //         app_type: 104,
            //         hidden: true
            //     },
            //     {
            //         text: 'Form Format',
            //         iconCls: 'x-fa fa-file-alt',
            //         handler:'onInitiateDocumentApplication',
            //         app_type: 106,
            //         hidden: true
            //     },
            //     {
            //         text: 'LOG Databases',
            //         iconCls: 'x-fa fa-database',
            //         handler:'onInitiateDocumentApplication',
            //         app_type: 107,
            //         hidden: true
            //     }
            //     ]
            // }
        },
       
    ]
});
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
            iconCls: 'x-fa fa-plus-square',
             menu:{
                xtype: 'menu',
                    items:[{
                    text: 'Create Document',
                   // iconCls: 'x-fa fa-file',
                    iconCls: 'x-fa fa-envelope',
                    handler:'onInitiateDocumentApplication',
                    app_type: 101
                },
                {
                    text: 'Template for Procedures, WI, Policies, Manuals, Appendix',
                    iconCls: 'x-fa fa-file',
                    handler:'onInitiateDocumentApplication',
                    app_type: 104
                },
                {
                    text: 'Form Format',
                    iconCls: 'x-fa fa-file-alt',
                    handler:'onInitiateDocumentApplication',
                    app_type: 106
                },
                {
                    text: 'LOG Databases',
                    iconCls: 'x-fa fa-database',
                    handler:'onInitiateDocumentApplication',
                    app_type: 107
                }
                ]
            }
        },
       
    ]
});
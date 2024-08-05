/**
 * Created by softclans
 */
Ext.define('Admin.view.documentManager.views.toolbars.QMSRecordTb', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'qmsrecordtb',
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
            sec_dashboard:'qmsrecordapplicationwrapper',
            name: 'disposalpermitstbRegHomeBtn'
        },
        {
            text: 'Add Record',
            iconCls: 'x-fa fa-plus-square',
            handler:'onInitiateQmsRecordApplication',
            app_type: 108
        },
       
    ]
});
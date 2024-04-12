/**
 * Created by Jeff on 09/02/2024.
 */
Ext.define('Admin.view.issuemanagement.views.containers.IssueMgmtCtn', {
    extend: 'Ext.Container',
    xtype: 'issuemgmtctn',
    controller: 'issuemgmtvctr',
    layout: 'border',
    items: [
        {
            xtype: 'hiddenfield',
            name: 'module_id',
            value: 34
        },
        {
            xtype: 'issuemgmtdashwrapper',
            region: 'center'
        },
        {
            xtype: 'issuemgmttb',
            region: 'south'
        }
        ]
});
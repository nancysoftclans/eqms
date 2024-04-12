/**
 * Created by Jeff on 09/02/2024.
 */
Ext.define('Admin.view.issuemanagement.views.dashboards.IssueMgmtDashWrapper', {
    extend: 'Ext.Container',
    xtype: 'issuemgmtdashwrapper',
    layout: 'fit',
    items: [
        {
            xtype: 'issuemgmtdash'
        }
    ]
});
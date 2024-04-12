/**
 * Created by Jeff on 25/03/2024.
 */
Ext.define('Admin.view.issuemanagement.views.dashboards.IssueMgmtDash', {
    extend: 'Ext.Container',
    xtype: 'issuemgmtdash',
    layout:'border',
    items: [
        {
            xtype: 'issuemgmtgrid',
            region: 'center',
            title: 'Active Customer Complaints',
            margin:2
        }

    ]
});
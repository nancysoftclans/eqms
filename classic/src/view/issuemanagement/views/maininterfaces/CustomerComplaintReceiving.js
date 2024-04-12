/**
 * Created by Jeff on 14/2/2024.
 */
Ext.define('Admin.view.issuemanagement.views.maininterfaces.CustomerComplaintReceiving', {
    extend: 'Admin.view.issuemanagement.views.sharedinterfaces.CustomerComplaint',
    xtype: 'customercomplaintreceiving',

    items: [
        {
            xtype: 'customercomplaintreceivingwizard',
        },
        {
            xtype: 'hiddenfield',
            name: 'workflow_stage_id',
            value: 1442
        },
        {
            xtype: 'hiddenfield',
            name: 'process_id',
            value: 238
        }
    ]
});
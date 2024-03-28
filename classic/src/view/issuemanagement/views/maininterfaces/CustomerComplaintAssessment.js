/**
 * Created by Jeff on 27/3/2024.
 */
Ext.define('Admin.view.issuemanagement.views.maininterfaces.CustomerComplaintAssessment', {
    extend: 'Admin.view.issuemanagement.views.sharedinterfaces.CustomerComplaint',
    xtype: 'customercomplaintassessment',

    items: [
        {
            xtype: 'customercomplaintreceivingwizard',
        },
        {
            xtype: 'hiddenfield',
            name: 'workflow_stage_id',
            value: 1443
        },
        {
            xtype: 'hiddenfield',
            name: 'process_id',
            value: 238
        }
    ]
});
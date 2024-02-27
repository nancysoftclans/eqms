
Ext.define('Admin.view.workflowmanagement.views.forms.WorkflowPortalReceivingSubmissionFrm', {
    extend: 'Admin.view.workflowmanagement.views.forms.WorkflowManagerSubmissionsGenericFrm',
    xtype: 'workflowPortalReceivingSubmissionFrm',
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [
                '->', {
                    text: 'Submit Application',
                    iconCls: 'x-fa fa-check-square',
                    name: 'app_submission_btn',
                    action: 'submit',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'workflow/handleManagersApplicationSubmissions'
                }, {
                    text: 'Close',
                    iconCls: 'x-fa fa-close',
                    ui: 'soft-purple',
                    handler: function (btn) {
                        btn.up('window').close();
                    }
                }
            ]
        }
    ]

});
Ext.define('Admin.view.issuemanagement.viewmodel.IssueManagementVm', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.issuemanagementvm',

    stores: {
    },
    data: {
        atBeginning: true,
        atEnd: false,
    },
    formulas: {
        isReadOnlyField: function (get) {
              return get('isReadOnly');
        }
    }
});
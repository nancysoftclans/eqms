Ext.define('Admin.view.issuemanagement.viewmodel.IssueMgmtVm', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.issuemgmtvm',

    stores: {
        /*
        A declaration of Ext.data.Store configurations that are first processed as binds to produce an effective
        store configuration. For example:

        users: {
            model: 'ProductRegistrationVm',
            autoLoad: true
        }
        */
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
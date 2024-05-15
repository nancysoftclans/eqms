Ext.define('Admin.view.documentManager.viewmodels.DocumentCreationVm', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.documentcreationvm',

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
        isReadOnly: false,
        application_title: 'Document Creation Application',
        // isVisaApplication: true,
        // showProdDosageForm: false,
        // showProdSubCategory:false
    },
    formulas: {
        isReadOnlyField: function (get) {
              return get('isReadOnly');
        }
    }
});
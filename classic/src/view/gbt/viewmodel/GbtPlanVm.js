Ext.define('Admin.view.gbt.viewmodels.GbtPlanVm', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.gbtplanvm',

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
        application_title: 'Audit Planning',
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
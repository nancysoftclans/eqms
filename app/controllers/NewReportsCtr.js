Ext.define('Admin.controller.NewReportsCtr', {
    extend: 'Ext.app.Controller',
    stores: [],
    config: {
        refs: [{
            ref: 'mainPanel',
            selector: 'maincontainerwrap'
        }, {
            ref: 'mainTabPanel',
            selector: '#contentPanel'
        }
        ],
        control: {
            'clinicaltrialtabularrepresentationgrid': {
                refresh: 'refreshClinicaltrialtabularrepresentationgrid'
            },
            'premisestabularrepresentationgrid': {
                refresh: 'refreshPremisestabularrepresentationgrid'
            },
        }
        //

    },
    /**
     * Called when the view is created
     */
    init: function () {

    },

    listen: {
        controller: {
            '*': {
                // onNewPvApplication: 'onNewPvApplication',
                // funcActiveOtherPvInformationTab: 'funcActiveOtherPvInformationTab'
                // showDynamicSelectionList: 'showDynamicSelectionList',
                // LoadCallerForm: 'LoadCallerForm',
                // viewApplicationRecommendationLogs: 'viewApplicationRecommendationLogs',
                // onReProductRegApplication: 'onReProductRegApplication',
                // doSaveResearchFindings: 'doSaveResearchFindings'
            }
        }
    },
    refreshClinicaltrialtabularrepresentationgrid: function (me) {
        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
			console.log(activeTab);
           // clinicaltrialtabpnl=activeTab.down(clinicaltrialtabpnl);
			// clinicaltrialreportpnl=clinicaltrialtabpnl.up(clinicaltrialreportpnl);
			//clinicaltrialreportfiltersfrm = activeTab.down('clinicaltrialreportfiltersfrm');
            clinicaltrialreportfiltersfrm = Ext.widget('clinicaltrialreportfiltersfrm');
            clinicaltrialreportpnl = Ext.widget('clinicaltrialreportpnl');
            console.log(clinicaltrialreportfiltersfrm);
			            sub_module_id = clinicaltrialreportfiltersfrm.down('combo[name=sub_module_id]').getValue(),  
                        from_date = clinicaltrialreportfiltersfrm.down('datefield[name=from_date]').getValue(),
                        to_date = clinicaltrialreportfiltersfrm.down('textfield[name=to_date]').getValue(), 
                        //module_id = clinicaltrialreportpnl.down('hiddenfield[name=module_id]').getValue();
                   store.getProxy().extraParams = {
                                //module_id: module_id,
                                sub_module_id: sub_module_id,
                                from_date: from_date,
                                to_date: to_date
        };
    },
    refreshPremisestabularrepresentationgrid: function (me) {
        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
			console.log(activeTab);
           // clinicaltrialtabpnl=activeTab.down(clinicaltrialtabpnl);
			// clinicaltrialreportpnl=clinicaltrialtabpnl.up(clinicaltrialreportpnl);
			premisesreportfiltersfrm = activeTab.down('premisesreportfiltersfrm');
            console.log(premisesreportfiltersfrm);
            // clinicaltrialreportfiltersfrm = Ext.widget('clinicaltrialreportfiltersfrm');
            // clinicaltrialreportpnl = Ext.widget('clinicaltrialreportpnl');
           //console.log(clinicaltrialreportfiltersfrm);
			            sub_module_id = premisesreportfiltersfrm.down('combo[name=sub_module_id]').getValue(),  
                        from_date = premisesreportfiltersfrm.down('datefield[name=from_date]').getValue(),
                        to_date = premisesreportfiltersfrm.down('textfield[name=to_date]').getValue(),
                        premise_type = premisesreportfiltersfrm.down('combo[name=premise_type]').getValue(); 
                        //module_id = clinicaltrialreportpnl.down('hiddenfield[name=module_id]').getValue();
                   store.getProxy().extraParams = {
                                //module_id: module_id,
                                sub_module_id: sub_module_id,
                                from_date: from_date,
                                to_date: to_date
        };
    },
    //     //                sub_module_id = frm.down('combo[name=sub_module_id]').getValue();
                    //                console.log(sub_module_id);
                    //                from_date = frm.down('datefield[name=from_date]').getValue(),
                    //                console.log(from_date);
                    //                to_date = frm.down('textfield[name=to_date]').getValue(),
                    //                premise_type = frm.down('combo[name=premise_type]').getValue();  
                    //              //  module_id=panel.down('hiddenfield[name=module_id]').getValue();
                              
                    //           //frm = filter.getForm();
                    //           if (frm.isValid()) {
                    //          store.getProxy().extraParams = {

                    //            // module_id: module_id,
                    //             sub_module_id: sub_module_id,
                    //             premise_type: premise_type,
                    //             from_date: from_date,
                    //             to_date: to_date
});
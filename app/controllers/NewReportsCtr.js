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
                   generateDocumentPermit:'generateDocumentPermit',
                   generateAuditReport: 'generateAuditReport'
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

        generateDocumentPermit: function (application_code) {
        var action_url = 'reports/generateDocumentPermit?application_code=' + application_code;
        print_report(action_url);
    },

    generateAuditReport: function (application_code) {
        var action_url = 'reports/generateAuditReport?application_code=' + application_code;
        print_report(action_url);
},
});
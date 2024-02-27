Ext.define('Admin.controller.PromoAndAdvertMaterialsController', {
    extend: 'Ext.app.Controller',
	
	
	stores:[
            'Admin.store.promotionalMaterial.PromotionalMaterialProductsStr'
			/*
			'Admin.store.promotionmaterials.PromotionMaterialApplicationStr',

			'Admin.store.promotionmaterials.PromotionMaterialProductParticularStr',
			'Admin.store.promotionmaterials.PromotionMaterialDetailStr',
			'Admin.store.promotionmaterials.ProductIngredientStrengthStr',
			'Admin.store.promotionmaterials.PromotionAdvertsFoodApplicationStr',
			'Admin.store.promotionmaterials.PromotionAdvertsCosmeticApplicationStr',
			'Admin.store.promotionmaterials.PromotionAdvertsMedicalDevicesApplicationStr',
			'Admin.store.promotionmaterials.OnlinePromotionAdvertsFoodApplicationStr'

			 */
	],
	config:{
		refs:[
			{
				ref: 'mainPanel',
				selector: 'maincontainerwrap'
			}, {
				ref: 'mainTabPanel',
				selector: '#contentPanel'
			}, {
				ref: 'productManuctureringFrm',
				selector: '#productManuctureringFrm'
			}, {
				ref: 'productApiManuctureringFrm',
				selector: '#productApiManuctureringFrm'
			}
		]
	},
	
	onLaunch:function(){
		
		this.control({
			
			
			'medicinepromomaterialstoolbar button[name=promotionAndAdvert]':{
				click:'promotionMaterialHome'
			},
			'foodpromoadvertstoolbar button[name=promotionAndAdvert]':{
				click:'promotionAdvertFoodHome'
			},
			'cosmeticspromoadvertstoolbar button[name=promotionAndAdvert]':{
				click:'promotionAdvertCosmeticHome'
			},
			'medicaldevicespromoadvertstoolbar button[name=promotionAndAdvert]':{
				click:'promotionAdvertMedicalDevicesHome'
			},
			'applicantpromotionmaterialselectiongrid':{
				itemdblclick:'onApplicantSelectionListDblClick'
			},
			'sponsorsgrid':{
				itemdblclick:'sponsorsgridDblClick'
			},
			'promotionandadvertsregisteredproductsdetailsgrid':{
				itemdblclick:'onRegisteredProductGridDoubleClick'
			},
			
			'onlinepromoadvertsfoodappgrid':{
				itemdblclick:'onDoubleClickPromotionAdvertOnlineAppGrid'
			},
			//onDoubleClickPromotionAdvertOnlineAppGrid
			'sponsorform button[action=save_sponsor_details]':{
				click:'saveSponsorDetails'
				
			},
			'promotionmaterialproductparticularsform button[action=save_product_particulars]':{
				click:'saveProductParticulars'
			},
            'promotionAssessmentFrm button[action=save_product_particulars]':{
				click:'saveProductParticulars'
			},
			'promotionmaterialdetailsform button[action=save_promotion_materials_other_details]':{
				click:'savePromotionMaterialDetails'
				
			},
            'editpromotionmaterialdetailsform button[action=save_promotion_materials_other_details]':{
                click:'savePromotionMaterialDetails'

            },
			'newpromotionmaterialwizard button[action=save_applicant_details]':{
				click:'saveApplicantPromotionMaterialsDetails'
				
			},'newpromotionmaterialwizard button[action=submit_application]':{
				click:'showNewReceivingApplicationSubmissionWin'
				
			},
			
			'promotionmaterialevaluationcontentpanel button[name=process_submission_btn]': {
                click: 'showEvaluationApplicationSubmissionWin'
            },
			'promoandadvertreceptingpanel form toolbar button[name=more_app_details]': {
                click: 'showBtnPanelApplicationMoreDetailsGeneric'
            },
            
			 'promotionadvertsevaluationcommentspnl button[name=save_comment]':{
				click:'saveApplicationComment'
			}, 
			'promotionadvertsevaluationdocpanel button[name=more_app_details]':{
				click:'showEvaluationMoreDetails'
			},
			'productingredientstrengthform button[action=save]':{
				click:'saveIngredientStrengthDetails'
			},
            'promoadvertonlinepreviewwizard': {
                afterrender: 'prepareOnlinePromotionalAppReceiving'
            },
			'newpromotionmaterialwizard': {
                afterrender: 'preparePromotionalAppReceiving'
            },
			
			
			//main interfaces 
			'promotionmaterialpermitsinvoice': {
                afterrender: 'preparePromotionAdvertsInvoicing'
            },
			 'promoandadvertreceptingpanel': {
                afterrender: 'prepareNewPromotionMaterialPayments'
            },
			'promotionandadvertverificationpnl': {
                afterrender: 'preparePromotionMaterialsManagerEvaluation'
            },
            'promoandadvertmanagerevaluationpanel': {
                afterrender: 'preparePromotionMaterialsManagerEvaluation'
            },

			 'promotionmaterialevaluationmaincontentpanel': {
                afterrender: 'preparePromotionAndAdvertsEvaluation'
            },
            'promtionadvertspreviewdetailswizard': {
                afterrender: 'preparePromotionAndAdvertsDetailsWizard'
            },
            
			'promotionadvertsevaluationdocpanel button[name=process_submission_btn]': {
                click: 'showEvaluationApplicationSubmissionWin'
            },
            'portalPromotionMaterialProductGrid': {
                refresh: 'refreshPortalPromotionalOtherDetailsGrid'
            },
            'portalPromotionMaterialsGrid': {
                refresh: 'refreshPortalPromotionalOtherDetailsGrid'
            },
            'promotiommaterialproductgrid': {
                refresh: 'refreshPromotionalOtherDetailsGrid'
            },
            'promotionmaterialdetailsgrid': {
                refresh: 'refreshPromotionalOtherDetailsGrid'
            },
            'promotionAssessmentGrid': {
                refresh: 'refreshPromotionalOtherDetailsGrid'
            },
            'promoSummaryGrid': {
                refresh: 'refreshPromotionalOtherDetailsGrid'
            },
            'promotionmaterialhomegrid': {
                refresh: 'refreshPromotionalHomeGrid'
            },
            'promotionPeerMeetingApplicationsListGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'pVACMeetingGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'promotionPeerReviewSchedulingPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'promotionPeerMeetingPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'pvacMeetingPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'pvacMeetingSchedulingPnl button[name=process_submission_btn]': {
                click: 'showApplicationSubmissionWin'
            },
            'promotionPeerReviewSchedulingPnl': {
                afterrender: 'preparePromotionManagerMeeting'
            },
            'promotionPeerMeetingPnl': {
                afterrender: 'preparePromotionManagerMeeting'
            },
            'pvacMeetingPnl': {
                afterrender: 'preparePromotionManagerMeeting'
            },
            'pvacMeetingSchedulingPnl': {
                afterrender: 'preparePromotionManagerMeeting'
            },
            'promotionRecommFrm button[name=save_comment]': {
                click: 'saveMeetingApplicationComment'
            },
            'promoQueryGrid button[action=process_submission_btn]': {
                click: 'showManagerApplicationSubmissionWinGeneric'
            },
            'promoQueryGrid': {
                refresh: 'addApplicationWorkflowParams'
            },
		 /*   'PartMedCenterDataEntryMain button[action=prev_ame_card]': {
				click: 'onPrevMedCardClick'
			},
						
				  //full edit 
			 'PartMedOrgsGrid':{
				 fullEdit:'showMedFullEditForm',
				 forwardOrgRecord:'genericForwardRecord',
			   	 viewTaskForm:'showReadOnlyForm',
				 sendRecordToArchive:'sendRecordToArchive',
				 sendRecordToOversight:'sendRecordToArchive',
				 deleteOrgRecord:'deleteOrgRecord'
				
			  },
			 */
			
		});
		
	},
	
	init:function()
	{
		
		
	},
	
	listen:{
		
		controller:{
			'*':{
				
				showPromotionAndAdvertMaterialWorkflow:'showPromotionMaterialWorkflow',
				onNewPromotionMaterials:'onNewPromotionMaterials',
				viewPromotionMaterials:'viewPromotionMaterials',
				saveApplicantDetails:'saveApplicantPromotionMaterialsDetails',
				setPromotionMaterialGridsStore:'setPromotionMaterialGridsStore',
				setCustomPromotionMaterialGridsStore:'setCustomPromotionMaterialGridsStore',
				showPromotionAndAdvertsApplicationMoreDetailsOnDblClick:'showApplicationMoreDetailsGeneric',
				// showApplicationMoreDetails:'showApplicationMoreDetails',
				custStoreConfig:'custStoreConfig',
				showPromotionAdvertsRegWorkflow:'showPromotionAdvertsRegWorkflow',
				customShowApplicationMoreDetailsGeneric:'customShowApplicationMoreDetailsGeneric',
				
				setPromAdvertsRegGridsStore:'setPromAdvertsRegGridsStore',
				deleteRecordFromIDComplex:'deleteRecordFromIDComplex',
				deleteRecordSingleParam:'deleteRecordSingleParam',
                previewOnlinePromotionalApplication:'previewOnlinePromotionalApplication',
                getPromotionBatchApplicationApprovalDetails:'getPromotionBatchApplicationApprovalDetails',
                showPrevUploadedPromDoc:'showPrevUploadedPromDoc',
                getPromotionApplicationApprovalDetails: 'getApplicationApprovalDetails',
				
			}
		}
    },
    getPromotionBatchApplicationApprovalDetails:function(btn){
        //Ext.getBody().mask('Please wait...');
        var me = this,
            grid = btn.up('grid'),
            table_name = btn.table_name,
            approval_frm = btn.approval_frm,
            form = Ext.widget(approval_frm),
            storeArray = eval(btn.stores),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(), 
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(), 
            arrayLength = storeArray.length;
            sm = grid.getSelectionModel(),
            selected_records = sm.getSelection(),
            selected= [];

             Ext.each(selected_records, function (item) {
                selected.push(item.data.application_code);
            });

        form.setController('promotionmaterialviewcontroller');
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        selected = JSON.stringify(selected),
        form.down('hiddenfield[name=table_name]').setValue(table_name);
        form.down('hiddenfield[name=process_id]').setValue(process_id);
        form.down('hiddenfield[name=selected_appcodes]').setValue(selected);
        form.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        funcShowCustomizableWindow('Recommendation', '40%', form, 'customizablewindow');
    },
    preparePromotionAndAdvertsDetailsWizard:function(pnl){
            
        Ext.getBody().mask('Please wait...');
        var me = this, mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            console.log(activeTab);
            applicantFrm = activeTab.down('promotionapplicantdetailsfrm'),
            products_detailsfrm = activeTab.down('#promotionalappdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code= activeTab.down('hiddenfield[name=active_application_code]').getValue();
            assessment_summaryfrm = activeTab.down('promotionAssessmentSummaryFrm');
            console.log(assessment_summaryfrm);
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'promotionmaterials/preparePromotionalAppDetailsReceiving',
                params: {
                    application_id: application_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        summary = resp.summary,
                        model = Ext.create('Ext.data.Model', results);
                        model2 = Ext.create('Ext.data.Model', summary);
                    if (success == true || success === true) {
                        applicantFrm.loadRecord(model);
                        products_detailsfrm.loadRecord(model);
                        assessment_summaryfrm.loadRecord(model2);
                        pnl.getViewModel().set('isReadOnly', true);

                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Ext.getBody().unmask();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }

    },
    prepareOnlinePromotionalAppReceiving: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl;
        application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),

         //   app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            applicantFrm = activeTab.down('promotionalapplicantdetailsfrm'),
            products_detailsfrm = activeTab.down('#promotionalappdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            status_type_id = activeTab.down('hiddenfield[name=status_type_id]').getValue(),
            application_code= activeTab.down('hiddenfield[name=application_code]').getValue(),
            
            last_query_ref_id= activeTab.down('hiddenfield[name=last_query_ref_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=zone_id]');
        filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();


        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        
        var checklistTypesGrid = pnl.down('combo[name=applicable_checklist]'),
        checklistTypesStr = checklistTypesGrid.getStore();
        checklistTypesStr.removeAll();
        checklistTypesStr.load({params: {module_id: module_id, sub_module_id: sub_module_id, section_id: section_id}});
       
            pnl.getViewModel().set('prechecking_querytitle', 'PRE-CHECKING');

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'promotionmaterials/prepareOnlinePromotionalAppReceiving',
                params: {
                    application_id: application_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        zone_id = results.zone_id,
                        model = Ext.create('Ext.data.Model', results);
                    if (success == true || success === true) {
                        applicantFrm.loadRecord(model);
                        products_detailsfrm.loadRecord(model);
                        zone_cbo.setReadOnly(true);
                        zone_cbo.setValue(zone_id);
                        activeTab.down('displayfield[name=application_status]').setValue(results.application_status);
                        activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                        activeTab.down('displayfield[name=process_name]').setValue(results.process_name);
                        pnl.getViewModel().set('isReadOnly', true);
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Ext.getBody().unmask();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },
    preparePromotionalAppReceiving: function (wizardPnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            application_status_id = wizardPnl.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = wizardPnl.down('promotionapplicantdetailsfrm'),
            promotionalappdetailsfrm = wizardPnl.down('promotionalappdetailsfrm'),
            application_id = wizardPnl.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = wizardPnl.down('hiddenfield[name=process_id]').getValue(),
            module_id = wizardPnl.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = wizardPnl.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = wizardPnl.down('hiddenfield[name=section_id]').getValue(),
        filter = {section_id: section_id},
            workflow_stage_id = wizardPnl.down('hiddenfield[name=workflow_stage_id]').getValue();

        if (application_status_id == 4 || application_status_id === 4) {
            wizardPnl.down('button[name=queries_responses]').setVisible(true);
        }
        /*
        
        var checklistTypesGrid = pnl.down('combo[name=applicable_checklist]'),
            checklistTypesStr = checklistTypesGrid.getStore();
            checklistTypesStr.removeAll();
            checklistTypesStr.load({params: {module_id: module_id, sub_module_id: sub_module_id, section_id: section_id}});
        
            pnl.getViewModel().set('prechecking_querytitle', 'PRE-CHECKING');
*/
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'promotionmaterials/preparePromotionalAppReceiving',
                params: {
                    application_id: application_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        applicantDetails = resp.applicant_details,
                        promotionDetails = resp.promotion_details,
                        applicantFrmModel = Ext.create('Ext.data.Model', applicantDetails),
                        promotionalAppDetailsFrmModel = Ext.create('Ext.data.Model', promotionDetails);

                    if (success == true || success === true) {

                        applicantFrm.loadRecord(applicantFrmModel);
                        promotionalappdetailsfrm.loadRecord(promotionalAppDetailsFrmModel);
                        //wizardPnl.down('displayfield[name=application_status]').setValue(applicantDetails.application_status);
                        //wizardPnl.down('displayfield[name=tracking_no]').setValue(applicantDetails.tracking_no);
                        //wizardPnl.down('displayfield[name=process_name]').setValue(applicantDetails.process_name);
                        // wizardPnl.getViewModel().set('isReadOnly', true);

                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Ext.getBody().unmask();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },
    
    refreshPromotionalOtherDetailsGrid: function (me) {
        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        //check if has been set or use window 
        if (activeTab.down('hiddenfield[name=active_application_id]')) {
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();

        } else {
         
            var panel = me.up('window'),
            application_id = panel.down('hiddenfield[name=active_application_id]').getValue();

        }

        store.getProxy().extraParams = {
            application_id: application_id,

        };
    },

    refreshPromotionalHomeGrid: function (me) {
        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();

        store.getProxy().extraParams = {
            module_id: module_id,
            section_id: section_id

        };
    },

    previewOnlinePromotionalApplication: function (view, record) {
        var grid = view.grid,
            isRejection = grid.isRejection,
            isReadOnly = grid.isReadOnly,
            status_id = record.get('application_status_id'),
            status_name = record.get('application_status'),
            tracking_no = record.get('tracking_no'),
            application_id = record.get('active_application_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            last_query_ref_id =  record.get('last_query_ref_id'),
            application_code = record.get('application_code'),
            status_type_id = record.get('status_type_id'),
            application_status_id = record.get('application_status_id'),
            onlinePanel = Ext.widget('promoadvertonlinepreviewwizard');
        
        onlinePanel.down('hiddenfield[name=active_application_id]').setValue(application_id);
        onlinePanel.down('hiddenfield[name=active_application_code]').setValue(application_code);
        onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
        onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
        onlinePanel.down('hiddenfield[name=application_status_id]').setValue(application_status_id);

        docsGrid = onlinePanel.down('onlineproductdocuploadsgrid');
        docsGrid.down('hiddenfield[name=application_code]').setValue(application_code);
        docsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
        docsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
        docsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        docsGrid.down('hiddenfield[name=query_ref_id]').setValue(last_query_ref_id);
       
        onlinePanel.down('hiddenfield[name=status_type_id]').setValue(status_type_id);
        funcShowCustomizableWindow(tracking_no, '80%', onlinePanel, 'customizablewindow');
    },
	
	
	setPromAdvertsRegGridsStore: function (me, options) {
		
         var config = options.config,
            isLoad = options.isLoad,
            toolbar = me.down('pagingtoolbar'),
            store = Ext.create('Admin.store.premiseRegistration.PremiseRegGridAbstractStore', config);
			
        me.setStore(store);
        toolbar.setStore(store);
		
             if (isLoad === false || isLoad == false) {
			
            store.removeAll();
			store.load({params: {
				comment_type_id: 2,
				application_id: 21,
				application_code:3321,
				workflow_stage_id: 391
				
				}});
          
        } 
    },
	
	
	
	saveApplicationComment: function (btn) {
        var  mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(), 
			workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(), 
			active_application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(), 
            formPnl = btn.up('form'),
            table_name = btn.table_name,
            frm = formPnl.getForm(),
            panel = formPnl.up('panel'),
            grid = panel.down('grid'),
			store = Ext.getStore(btn.storeID),
                      add_btn = grid.down('button[name=add_btn]');
        if (frm.isValid()) {
            frm.submit({
                url: 'promotionmaterials/insertUpdatePromoAdvertComments',
                params: {
					comment_type_id:2,//evaluation
					workflow_stage_id:workflow_stage_id,
                    application_code:application_code,
					application_id:active_application_id,
                    table_name:'tra_applications_comments'
				
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                waitMsg: 'Please wait...',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load({params:{
							
							
							comment_type_id: 2,
							application_id: active_application_id,
							application_code:application_code,
							workflow_stage_id: workflow_stage_id
							
							
						}});
                        formPnl.setVisible(false);
                        add_btn.setDisabled(false);
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
	
	//Added*****
	
	
	
	
	
	showPromotionAdvertsRegWorkflow: function (me, options) {
        var config = options.config,
            isLoad = options.isLoad,
            store = Ext.create('Admin.store.premiseRegistration.PremiseRegComboAbstractStore', config);
        me.setStore(store);
        if (isLoad === true || isLoad == true) {
            store.removeAll();
            store.load();
        }
    },

	
	
	setCustomPromotionMaterialGridsStore:function (me, options) {
		
	   
        var config = options.config,
		 workflow_stage_id=me.up('panel').down('hiddenfield[name=workflow_stage_id]').getValue(),
		 section_id=me.up('panel').down('hiddenfield[name=section_id]').getValue(),
            isLoad = options.isLoad,
            toolbar = me.down('pagingtoolbar'),
            store = Ext.create('Admin.store.premiseRegistration.PremiseRegGridAbstractStore', config);
			
		
		me.setStore(store);
		
        toolbar.setStore(store);
		
	
		
        if (isLoad === true || isLoad == true) {
			
            store.removeAll();
			store.load({params: {table_name:'tra_promotion_adverts_applications',
				workflow_stage_id: workflow_stage_id,
				section_id: section_id}});
          
        } 
    },
	custStoreConfig:function(me, options){
		

		
        var config = options.config,
		 workflow_stage_id=me.up('panel').up('panel').down('hiddenfield[name=workflow_stage_id]').getValue(),
		 section_id=me.up('panel').up('panel').down('hiddenfield[name=section_id]').getValue(),
            isLoad = options.isLoad,
            toolbar = me.down('pagingtoolbar'),
            store = Ext.create('Admin.store.premiseRegistration.PremiseRegGridAbstractStore', config);
			
		
		me.setStore(store);
		
        toolbar.setStore(store);
		
	
		
        if (isLoad === true || isLoad == true) {
			
            store.removeAll();
			store.load({params: {table_name:'tra_promotion_adverts_applications',
				workflow_stage_id: workflow_stage_id,
				section_id: section_id}});
          
        } 
	},
		
	setPromotionMaterialGridsStore: function (me, options) {
	
	      var config = options.config,
		
            isLoad = options.isLoad,
            toolbar = me.down('pagingtoolbar'),
            store = Ext.create('Admin.store.premiseRegistration.PremiseRegGridAbstractStore', config);
			
		
		me.setStore(store);
		
        toolbar.setStore(store);
		
	
		
        if (isLoad === true || isLoad == true) {
			
            store.removeAll();
		    store.load();
        } 
    },
	
	
	onNewPromotionMaterials: function (sub_module_id,section_id,xtypeWrapper) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down(/* '#promotionmaterialswrapper' */xtypeWrapper),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
           // section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            filter = { section_id: section_id };

        workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id);
        if (!workflow_details) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        dashboardWrapper.removeAll();
        var workflowContainer = Ext.widget(workflow_details.viewtype);
        workflowContainer.down('displayfield[name=process_name]').setValue(workflow_details.processName);
        workflowContainer.down('displayfield[name=workflow_stage]').setValue(workflow_details.initialStageName);
        workflowContainer.down('displayfield[name=application_status]').setValue(workflow_details.initialAppStatus);
        workflowContainer.down('hiddenfield[name=process_id]').setValue(workflow_details.processId);
        workflowContainer.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_details.initialStageId);
        workflowContainer.down('hiddenfield[name=module_id]').setValue(module_id);
        workflowContainer.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        workflowContainer.down('hiddenfield[name=section_id]').setValue(section_id);
        dashboardWrapper.add(workflowContainer);
		workflowContainer.getViewModel().set({readOnly:false});
        //reload Stores 
        var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
		app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore();
		
		app_check_types_store.removeAll();
        app_check_types_store.load({
            params: {
                process_id:workflow_details.processId,
                workflow_stage:  workflow_details.initialStageId
            }
        });
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: workflow_details.processId,
                workflow_stage: workflow_details.initialStageId
            }
        });
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);

        //load the stores
    },
	
	
	
	promotionAdvertFoodHome: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('promotionadvertsfoodwrapper');
        if (!dashboardWrapper.down('promoadvertfooddashboard')) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: 'promoadvertfooddashboard'});
        }
    },
	promotionMaterialHome: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('promotionmaterialswrapper');
        if (!dashboardWrapper.down('promomaterdashboard')) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: 'promomaterdashboard'});
        }
    },
	promotionAdvertCosmeticHome: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('promotionadvertcosmeticwrapper');
        if (!dashboardWrapper.down('promoadvertcosmeticdashboard')) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: 'promoadvertcosmeticdashboard'});
        }
    },
	promotionAdvertMedicalDevicesHome: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('promotionadvertmedicaldeviceswrapper');
        if (!dashboardWrapper.down('promoadvertmedicaldevicesdashboard')) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: 'promoadvertmedicaldevicesdashboard'});
        }
    },
	
	showPromotionMaterialWorkflow: function (sub_module_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#promotionmaterialswrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_details = getBasicWorkflowDetails(module_id, section_id, sub_module_id);
        if (!workflow_details) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        dashboardWrapper.removeAll();
        var workflowContainer = Ext.widget('workflowcontainerpnlgeneric');
        workflowContainer.down('displayfield[name=workflow_name]').setValue(workflow_details.name);
        workflowContainer.down('hiddenfield[name=active_workflow_id]').setValue(workflow_details.workflow_id);
        dashboardWrapper.add(workflowContainer);
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
	 onApplicantSelectionListDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
        mask.show();
		
		//'t1.id as link_applicant_as_sponsor', 't1.name as applicant_sponsor_name', 
		
		
        if (grid.for_applicant_details ==1 || grid.for_applicant_details ===1 ) {
            var applicantForm = activeTab.down('promotionapplicantdetailsfrm');
            applicantForm.loadRecord(record);
        } else {
            applicantForm = activeTab.down('promotionAdvertsappdetails');
            applicantForm.down('textfield[name=applicant_sponsor_name]').setValue(record.get('sponsor_name'));
			applicantForm.down('hiddenfield[name=sponsor_id]').setValue(record.get('id'));
        }

        Ext.Function.defer(function () {
            mask.hide();
            win.close();
        }, 200);
    },
    
    sponsorsgridDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
         mask.show();
            applicantForm = activeTab.down('promotionalappdetailsfrm');
            applicantForm.down('textfield[name=applicant_sponsor_name]').setValue(record.get('sponsor_name'));
			applicantForm.down('hiddenfield[name=sponsor_id]').setValue(record.get('id'));
       
        Ext.Function.defer(function () {
            mask.hide();
            win.close();
        }, 200);
    },

	 onRegisteredProductGridDoubleClick: function (view, record, item, index, e, eOpts)
	 {
		var me = this,
            grid = view.grid,
			win = grid.up('window'),
			form=win.object_1,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
        mask.show();
		
		form.down('textfield[name=registration_no]').setValue(record.get('certificate_no'));
		form.down('textfield[name=brand_name]').setValue(record.get('brand_name'));
		form.down('textfield[name=common_name]').setValue(record.get('common_name'));
        form.down('combo[name=section_id]').setValue(record.get('section_id'));
        form.down('combo[name=prodclass_category_id]').setValue(record.get('prodclass_category_id'));
        form.down('combo[name=schedule_id]').setValue(record.get('schedule_id'));
        form.down('combo[name=product_origin_id]').setValue(record.get('product_origin_id'));
        form.down('textfield[name=manufacturing_site]').setValue(record.get('manufacturer'));
        form.down('textarea[name=indications]').setValue(record.get('indications'));
		
		Ext.Function.defer(function () {
            mask.hide();
             win.close();
        }, 200);
		 
	 },
	
	
	viewPromotionMaterials: function (grid,record) {
		
		
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            process_id = record.get('process_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            workflow_stage = record.get('workflow_stage'),
            ref_no = record.get('reference_no'),
            workflow_details = getAllWorkflowDetails(process_id, workflow_stage_id);
        if (!workflow_details) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
		
        var tab = mainTabPanel.items.find(function (i) {
            if (i.title.indexOf(ref_no) !== -1) {
                return i;
            } else {
                return false;
            }
        });
		
		

        if (!tab) {
            var newTab = Ext.widget(workflow_details.viewtype, {
                title: workflow_stage + '-' + record.get('tracking_no'),
                closable: true
            });
			
			
		 if(newTab.down('panel').down('form'))
		 {
			  newTab.down('panel').down('form').loadRecord(record);
		 }
		 
		 // find
		 
		 if(newTab.record)
		{
			newTab.record=record;
			
		}
		 
	
		 //   newTab.down('panel').down('form').loadRecord(record);
		
            me.prepareApplicationBaseDetails(newTab, record);
            mainTabPanel.add(newTab);
            var lastTab = mainTabPanel.items.length - 1;
            mainTabPanel.setActiveTab(lastTab);
        } else {
            mainTabPanel.setActiveTab(tab);
        }
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },

    prepareApplicationBaseDetails: function (tab, record) {
        var me = this,
            application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            process_name = record.get('process_name'),
            workflow_stage = record.get('workflow_stage'),
            application_status = record.get('application_status'),
            reference_no = record.get('reference_no'),
			tracking_no = record.get('tracking_no'),
            process_id = record.get('process_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            workflow_stage_id = record.get('workflow_stage_id');
            tab.down('hiddenfield[name=active_application_id]').setValue(application_id);
            //tab.down('hiddenfield[name=application_id]').setValue(application_id);
            var application_code_field = tab.down('hiddenfield[name=active_application_code]');
            if (application_code_field) {
                application_code_field.setValue(application_code);
            }
            tab.down('hiddenfield[name=active_application_code]').setValue(application_code);
            tab.down('hiddenfield[name=process_id]').setValue(process_id);
            tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
            tab.down('hiddenfield[name=module_id]').setValue(module_id);
            tab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            tab.down('hiddenfield[name=section_id]').setValue(section_id);
            tab.down('displayfield[name=process_name]').setValue(process_name);
            tab.down('displayfield[name=workflow_stage]').setValue(workflow_stage);
            tab.down('displayfield[name=application_status]').setValue(application_status);
            tab.down('displayfield[name=tracking_no]').setValue(tracking_no);
            tab.down('displayfield[name=reference_no]').setValue(reference_no);
            
        
				
    },
	
	saveIngredientStrengthDetails:function(btn)
	{
		
		var win=btn.up('window'),
		    form=win.down('form'),
			panel=win.object_1.up('panel'),
			product_id=panel.product_id,
			table_name=btn.table_name,
			url=btn.action_url,
			store=win.object_1.getStore(),
			form = form.getForm();
			this.saveFormData(form,product_id,table_name,win,store,url);
			/* return;
			
        if (form.isValid()) {
            form.submit({
                url: url,
                params: {product_id: product_id},
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
						store.removeAll();
                        store.load({params:{active_application_id:product_id}});
                        toastr.success(message, "Success Response");
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        } */
		
	},
	
	saveSponsorDetails:function(btn)
	{
		 var me = this,
		    active_application_id = null,
            url = btn.action_url,
            table_name = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            store = win.object_1,
            //store = Ext.getStore(storeID),
            frm = form.getForm();
			this.saveFormData(frm,active_application_id,table_name,win,store,url);
	},
	savePromotionMaterialDetails:function (btn) {
        var me = this,
		    mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            active_application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            url = btn.action_url,
            table_name = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm();
			this.saveFormData(frm,active_application_id,table_name,win,store,url);
        
    },
	saveProductParticulars: function (btn) {
        var me = this,
		    mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            url = btn.action_url,
            table_name = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm();
            store.reload();
			this.saveFormDataComplex(frm,application_id,table_name,win,store,url);
        
    },
	saveFormDataComplex:function(frm,application_id,table_name,win,store,url)
	{
		if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {application_id: application_id,table_name:table_name},
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
						product_id = response.product_id;
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
						//store.setExtraParam('load({params:{application_id',application_id);
                        store.load({params:{application_id:application_id}});
                       // win.down('panel').product_id=product_id;
						//win.down('panel').down('button[name=add]').enable();
                        win.close()
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
	},
     saveFormData:function(frm,active_application_id,table_name,win,store,url)
	{
		
		if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {application_id: active_application_id,table_name:table_name},
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
						
                        store.load({params:{active_application_id:active_application_id}});
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
	},
	
	
   showNewReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
		
		
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            storeID = 'promotionmaterialapplicationstr',//getApplicationStore(module_id, section_id),
            table_name ='tra_promotion_adverts_applications';//getApplicationTable(module_id);

        valid = this.validatePromotionMaterialReceivingSubmission(btn);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID);
        } else {
            toastr.warning('Please Enter All the required Details!!', 'Warning Response');
            Ext.getBody().unmask();
        }
    },
	validatePromotionMaterialReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('promotionapplicantdetailsfrm'),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),
            promotiommaterialproductgrid = activeTab.down('promotiommaterialproductgrid'),
			promotionmaterialdetailsgrid = activeTab.down('promotionmaterialdetailsgrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
			
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
    /*     if (!premiseFrm.isValid()) {
            toastr.warning('Please Enter All the required Premise Details!!', 'Warning Response');
            return false;
        } */
        // this.saveApplicantPromotionMaterialsDetails(btn);

        if (promotiommaterialproductgrid.getStore().getModifiedRecords().length > 0) {
            toastr.warning('There are unsaved product particulars info!!', 'Warning Response');
            return false;
        }if (promotionmaterialdetailsgrid.getStore().getModifiedRecords().length > 0) {
            toastr.warning('There are unsaved promotion material details!!', 'Warning Response');
            return false;
        }
        return true;
    },
	
	//savePromotionMaterialsApplicantDetails
	saveApplicantPromotionMaterialsDetails: function (btn) {
		////console.log( btn.action_url);
        var wizard = btn.wizardpnl
             wizardPnl = btn.up(wizard),
            // action_url = btn.action_url,
            mainTabPnl = btn.up('#contentPanel')
            containerPnl = mainTabPnl.getActiveTab(),

            process_id = containerPnl.down('hiddenfield[name=process_id]').getValue(),
            module_id = containerPnl.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = containerPnl.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = containerPnl.down('hiddenfield[name=section_id]').getValue(),
            workflow_stage_id = containerPnl.down('hiddenfield[name=workflow_stage_id]').getValue(),
            active_application_id = containerPnl.down('hiddenfield[name=active_application_id]').getValue(),
            checkapplication_id = containerPnl.down('hiddenfield[name=active_application_id]').getValue(),
            
            promotionalappdetailsfrm = containerPnl.down('promotionalappdetailsfrm'),
            promotionapplicantdetailsfrm = containerPnl.down('promotionapplicantdetailsfrm'),
            applicant_id = promotionapplicantdetailsfrm.down('hiddenfield[name=applicant_id]').getValue();
           // local_applicant_id = localApplicantDetailsForm.down('hiddenfield[name=applicant_id]').getValue();
            //productDetailsForm = containerPnl.down('#productsDetailsFrm'),
           // productDetailsFrm = productDetailsForm.getForm();

        if (!applicant_id) {
            toastr.warning('Please select applicant!!', 'Warning Response');
            return false;
        }

        if (promotionalappdetailsfrm.isValid()) {
            promotionalappdetailsfrm.submit({
                url: 'promotionmaterials/savePromotionMaterialsAppDetails',//+action_url,
                waitMsg: 'Please wait...',
                params: {
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    active_application_id: active_application_id,
                    applicant_id: applicant_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    '_token': token
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success,
                        active_application_id = resp.record_id,
						application_code=resp.application_code,
						process_id=resp.process_id,
                        tracking_no = resp.tracking_no;
						////console.log(resp);
						
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        if (checkapplication_id == '') {
                            containerPnl.down('hiddenfield[name=active_application_id]').setValue(active_application_id);
							containerPnl.down('hiddenfield[name=active_application_code]').setValue(application_code);
							containerPnl.down('hiddenfield[name=process_id]').setValue(process_id);
                            containerPnl.down('displayfield[name=tracking_no]').setValue(tracking_no);
                            
                        }

                    } else {
                        toastr.error(message, "Failure Response");
                    }
                },
                failure: function (frm, action) {
                    var resp = action.result,
                        message = resp.message;
                    toastr.error(message, "Failure Response");
                }
            });
        } else {
            toastr.warning('Please fill all the required fields!!', 'Warning Response');
        }
    },
	//prepareNewProductPayments
	//
	
	prepareNewPromotionMaterialPayments: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]'),
            invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            running_balance = activeTab.down('displayfield[name=running_balance]'),

            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
			
			
        if (application_id) {
           
            Ext.Ajax.request({
                method: 'GET',
                url: 'promotionmaterials/preparePromotionAndAdvertPaymentStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_promotion_adverts_applications'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        balance = resp.balance,
                        invoice_amount = resp.invoice_amount,
                        results = resp.results,
                        txt;
                    if (success == true || success === true) {
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        if (Math.abs(parseFloat(balance)) == parseFloat(invoice_amount) || Math.abs(parseFloat(balance)) === parseFloat(invoice_amount)) {
                            txt = ' (Not Paid)';
                        } else if (parseFloat(balance) > 0) {
                            txt = ' (Over-Paid)';
                        } else if (parseFloat(balance) < 0) {
                            txt = ' (Under-Paid)';
                        } else {
                            txt = ' (Cleared)';
                        }
                        applicant_details.setValue(results.applicant_details);
                      

                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Ext.getBody().unmask();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },
	     
	preparePromotionMaterialsManagerEvaluation: function () {
		
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainGrid = activeTab.down('grid'),
            mainStore = mainGrid.getStore(),
            sm = mainGrid.getSelectionModel(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
			

        if (application_id) {
            mainStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },

	
    preparePromotionAndAdvertsEvaluation: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            app_check_types_store = activeTab.down('combo[name=applicable_checklist]').store,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            promotion_materials_details = otherDetailsFrm.down('displayfield[name=promotion_materials_details]');
        if (application_id) {
            app_check_types_store.load({
                params: {
                    process_id: process_id,
                    workflow_stage: workflow_stage_id
                }
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'promotionmaterials/prepareForPromotionAndAdvertsEvaluation',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_promotion_adverts_applications'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results;
                    if (success == true || success === true) {
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=active_application_id]').setValue(results.application_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        applicant_details.setValue(results.applicant_details);
                        if (module_id == 2 || module_id === 2) {
                            promotion_materials_details.setVisible(true);
                            promotion_materials_details.setValue(results.application_id);
                        }
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Ext.getBody().unmask();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },
	
	
	showEvaluationApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = true,
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            //workflowsubmissionsfrm
            showRecommendationWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsstrictrecommfrm', winWidth, storeID, 2);
        } else {
            Ext.getBody().unmask();
        }
    },
	
	
	// showApplicationMoreDetails: function (record) {
		
    //     this.customShowApplicationMoreDetailsGeneric(record);
    // },
	editpreviewPromotionalQueryinformation:function(grid,record){
        this.customShowApplicationMoreDetailsGeneric(record,1);
    },
	
	customShowApplicationMoreDetailsGeneric: function (record,show_portal_btns) 
    {
        Ext.getBody().mask('Please wait...');
        var me = this,
            wizardPnl = Ext.widget('newpromotionmaterialwizard'),
             applicantFrm = wizardPnl.down('promotionapplicantdetailsfrm'),
			 promotiommaterialproductgrid = wizardPnl.down('promotiommaterialproductgrid'),
			// promotionmaterialproductparticularsform=wizardPnl.down('promotionmaterialproductparticularsform'),
			// productingredientsstrengthgrid= wizardPnl.down('productingredientsstrengthgrid'),
			 promotionmaterialdetailsgrid = wizardPnl.down('promotionmaterialdetailsgrid'),
			 viewModel = wizardPnl.getViewModel();
             wizardPnl.setHeight(500);
		
		
		
		//porta action buttons
		if(show_portal_btns){
			
			wizardPnl.down('button[name=receive_btn]').show();
			wizardPnl.down('button[name=query_btn]').show();
			wizardPnl.down('button[name=reject_btn]').show();
			wizardPnl.down('hiddenfield[name=is_portal]').setValue(1);
		}
		
		
		
		applicantFrm.loadRecord(record);//
		
        applicantFrm.down('button[name=link_applicant]').setDisabled(true);
		promotiommaterialproductgrid.down('button[name=add_details]').setDisabled(true);
		promotionmaterialdetailsgrid.down('button[name=add_details]').setDisabled(true);
		

		
		
		
		wizardPnl.down('displayfield[name=application_status]').setValue(record.get('application_status'));
		wizardPnl.down('displayfield[name=tracking_no]').setValue(record.get('tracking_no'));
		
		wizardPnl.down('hiddenfield[name=active_application_id]').setValue(record.get('active_application_id'));
        wizardPnl.down('hiddenfield[name=process_id]').setValue(record.get('process_id'));
        wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(record.get('workflow_stage_id'));
        wizardPnl.down('hiddenfield[name=active_application_id]').setValue(record.get('application_id'));
        wizardPnl.down('hiddenfield[name=module_id]').setValue(record.get('module_id'));
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(record.get('sub_module_id'));
		wizardPnl.down('hiddenfield[name=application_status_id]').setValue(record.get('application_status_id'));
		wizardPnl.down('hiddenfield[name=section_id]').setValue(record.get('section_id'));
		
        viewModel.set({readOnly:true});
		 viewModel.set({isReadOnly:true});
		applyReadOnlytoForms(applicantFrm);
		
		
		funcShowCustomizableWindow(record.get('tracking_no'), '85%', wizardPnl, 'customizablewindow');
		
		Ext.getBody().unmask();
		
		
		
     
    },
	showBtnPanelApplicationMoreDetailsGeneric:function(btn){

       // this.showApplicationMoreDetailsGeneric(application_id, premise_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, is_temporal);

    },
	

    showApplicationMoreDetailsGeneric: function (application_id, premise_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, is_temporal) {
        Ext.getBody().mask('Please wait...');
        Ext.getBody().mask('Please wait...');
        var me = this,
            wizardPnl = Ext.widget('promtionadvertsmoredetailswizard'),
             applicantFrm = wizardPnl.down('promotionAdvertsappdetails'),
			 promotiommaterialproductgrid = wizardPnl.down('promotiommaterialproductgrid'),
			// promotionmaterialproductparticularsform=wizardPnl.down('promotionmaterialproductparticularsform'),
			// productingredientsstrengthgrid= wizardPnl.down('productingredientsstrengthgrid'),
			 promotionmaterialdetailsgrid = wizardPnl.down('promotionmaterialdetailsgrid'),
			 viewModel = wizardPnl.getViewModel();
             wizardPnl.setHeight(500);
		//porta action buttons
		if(show_portal_btns){
			wizardPnl.down('button[name=receive_btn]').show();
			wizardPnl.down('button[name=query_btn]').show();
			wizardPnl.down('button[name=reject_btn]').show();
			wizardPnl.down('hiddenfield[name=is_portal]').setValue(1);
		}

		applicantFrm.loadRecord(record);//
		
        applicantFrm.down('button[name=link_applicant]').setDisabled(true);
		promotiommaterialproductgrid.down('button[name=add_details]').setDisabled(true);
		promotionmaterialdetailsgrid.down('button[name=add_details]').setDisabled(true);
		
		wizardPnl.down('displayfield[name=application_status]').setValue(record.get('application_status'));
		wizardPnl.down('displayfield[name=tracking_no]').setValue(record.get('tracking_no'));
		
		wizardPnl.down('hiddenfield[name=active_application_id]').setValue(record.get('active_application_id'));
        wizardPnl.down('hiddenfield[name=process_id]').setValue(record.get('process_id'));
        wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(record.get('workflow_stage_id'));
        wizardPnl.down('hiddenfield[name=application_id]').setValue(record.get('application_id'));
        wizardPnl.down('hiddenfield[name=module_id]').setValue(record.get('module_id'));
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(record.get('sub_module_id'));
		wizardPnl.down('hiddenfield[name=application_status_id]').setValue(record.get('application_status_id'));
		wizardPnl.down('hiddenfield[name=section_id]').setValue(record.get('section_id'));
		
        viewModel.set({readOnly:true});
		 viewModel.set({isReadOnly:true});
		applyReadOnlytoForms(applicantFrm);
		
		
		funcShowCustomizableWindow(record.get('tracking_no'), '85%', wizardPnl, 'customizablewindow');
		
		Ext.getBody().unmask();
		
    },
	
	
	
	  deleteRecordFromIDComplex: function (id, table_name, storeID, url, method,record) {
			
			
        var me = this,
            store = Ext.getStore(storeID);
        Ext.MessageBox.confirm('Delete', 'Are you sure to perform this action ?', function (btn) {
            if (btn === 'yes') {
                Ext.getBody().mask('Deleting record...');
                if (!method) {
                    method = "POST";
                }
                Ext.Ajax.request({
                    url: url,
                    method: method,
                    params: {
                        table_name: table_name,
                        id: id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                            store.removeAll();
                            store.load({params:{
			        comment_type_id:2,//evaluation
					workflow_stage_id:record.get('workflow_stage_id'),
                    application_code:record.get('application_code'),
					application_id:record.get('active_application_id'),
                    table_name:'tra_applications_comments'
					}});
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                    }
                });
            } else {
                //
            }
        });
    },
	deleteRecordSingleParam: function (id, table_name, storeID, url, method,record) {
			
			
        var me = this,
            store = Ext.getStore(storeID);
        Ext.MessageBox.confirm('Delete', 'Are you sure to perform this action ?', function (btn) {
            if (btn === 'yes') {
                Ext.getBody().mask('Deleting record...');
                if (!method) {
                    method = "POST";
                }
                Ext.Ajax.request({
                    url: url,
                    method: method,
                    params: {
                        table_name: table_name,
                        id: id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                            store.removeAll();
                            store.load({params:{
			      
					id:record.get('product_id'),
                  
					}});
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                    }
                });
            } else {
                //
            }
        });
    },
	showEvaluationMoreDetails:function(btn)
	{
		
		 this.customShowApplicationMoreDetailsGeneric(btn.up('promotionadvertsevaluationdocpanel').record);
	},
    
	
	//online app
	onDoubleClickPromotionAdvertOnlineAppGrid: function (grid, record) {
		 //show online portal action btns
		//this.fireEvent('viewPromotionMaterials',grid, record);
		//showApplicationMoreDetails: function (record) ;
		this.customShowApplicationMoreDetailsGeneric(record,true);

    },
	
	
	
 preparePromotionAdvertsInvoicing: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]'),
            invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            invoiceSummaryGrid = activeTab.down('invoicingcostdetailsgrid'),
            invoiceSummaryStore = invoiceSummaryGrid.getStore(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            /* premise_details = otherDetailsFrm.down('displayfield[name=premise_details]'), */
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            paying_currency = activeTab.down('combo[name=paying_currency_id]'),
            isFastTrack = activeTab.down('checkbox[name=is_fast_track]'),
            save_btn = activeTab.down('button[name=save_btn]'),
            commit_btn = activeTab.down('button[name=commit_btn]');
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'promotionmaterials/getPromotionApplicationMoreDetails',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_promotion_adverts_applications'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        isLocked = results.isLocked,
                        is_fast_track = results.is_fast_track;
                    if (success == true || success === true) {
                        var module_id = results.module_id;
                        //activeTab.down('hiddenfield[name=premise_id]').setValue(results.premise_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        activeTab.down('hiddenfield[name=isLocked]').setValue(isLocked);
                        activeTab.down('checkbox[name=is_fast_track]').setValue(is_fast_track);
                        paying_currency.setValue(results.paying_currency_id);
                        invoice_id.setValue(results.invoice_id);
                        invoice_no.setValue(results.invoice_no);
                        applicant_details.setValue(results.applicant_details);
                        invoiceSummaryStore.removeAll();
                        invoiceSummaryStore.load({
                            params: {
                                invoice_id: results.invoice_id
                            }
                        });
                        if (isLocked == 1 || isLocked === 1) {
                            paying_currency.setReadOnly(true);
                            isFastTrack.setReadOnly(true);
                            save_btn.setVisible(false);
                            commit_btn.setDisabled(true);
                        }
                       /*  if (module_id == 2 || module_id === 2) {
                            premise_details.setVisible(true);
                            premise_details.setValue(results.premise_details);
                        } */
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Ext.getBody().unmask();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },

	showPrevUploadedPromDoc:function(item){
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),

            document_type_id = item.document_type_id,
            winTitle = item.winTitle,
            winWidth = item.winWidth,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();

        ref_no = record.get('tracking_no');
        grid = Ext.widget('promotionmaterialsdocuploadsgenericgrid');
        store = grid.store;
        grid.height = Ext.Element.getViewportHeight() - 118;
     
        grid.down('hiddenfield[name=process_id]').setValue(record.get('process_id'));
        grid.down('hiddenfield[name=section_id]').setValue(record.get('section_id'));
        grid.down('hiddenfield[name=module_id]').setValue(record.get('module_id'));
        grid.down('hiddenfield[name=sub_module_id]').setValue(record.get('sub_module_id'));
        grid.down('hiddenfield[name=application_code]').setValue(record.get('application_code'));
        grid.down('combo[name=applicable_documents]').setValue(document_type_id);
        funcShowCustomizableWindow("Associated Preview " + ' :' + ref_no, winWidth, grid, 'customizablewindow', item);

    },
    refreshPortalPromotionalOtherDetailsGrid: function (me) {
        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            activeTab = activeTab.down('portalSubmissionReceivingPnl');
            console.log(activeTab);
        //check if has been set or use window 
        if (activeTab.down('hiddenfield[name=active_application_id]')) {
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();

        } else {
         
            var panel = me.up('window'),
            application_id = panel.down('hiddenfield[name=active_application_id]').getValue();

        }

        store.getProxy().extraParams = {
            application_id: application_id,

        };
    },
    saveTCMeetingDetails: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('meetingdetailsfrm'),
            toaster = btn.toaster,
            frm = form.getForm(),
            applicationsGrid = activeTab.down('#application_list'),
            sm = applicationsGrid.getSelectionModel(),
            selected_records = sm.getSelection(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
            selected = [];
        Ext.each(selected_records, function (item) {
            selected.push(item.data.application_code);
        });
        if (frm.isValid()) {
            if (!sm.hasSelection()) {
                toastr.warning('Please select at least one application!!', 'Warning Response');
                return false;
            }
            frm.submit({
                url: 'promotionmaterials/saveTCMeetingDetails',
                params: {
                    application_code: application_code,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    workflow_stage_id: workflow_stage_id,
                    section_id: section_id,
                    _token: token,
                    selected: JSON.stringify(selected),
                },
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message,
                        record_id = response.record_id;
                    if (success == true || success === true) {
                        form.down('hiddenfield[name=id]').setValue(record_id);
                        applicationsStore.load();
                        if (toaster == 1 || toaster === 1) {
                            toastr.success(message, "Success Response");
                        }
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        } else {
            toastr.warning('Fill all required fields!!', 'Warning Response');
            return false;
        }
    },
    showApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            valid = true,
            // storeID = getApplicationStore(module_id, section_id),
            storeID = 'enforcementStr',
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },
    preparePromotionManagerMeeting: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('#application_list');
        this.preparePromotionMeetingDetailsGeneric(activeTab, applicationsGrid, 0);
    },
    preparePromotionMeetingDetailsGeneric: function (activeTab, applicationsGrid, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            meetingDetailsFrm = activeTab.down('form'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
            participantsGrid = activeTab.down('tcmeetingparticipantsgrid'),
            participantsStore = participantsGrid.getStore(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sm = applicationsGrid.getSelectionModel();
        participantsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            meetingDetailsFrm.getForm().getFields().each(function (field) {
                field.setReadOnly(true);
            });
        }
        // this.redoTcMeetingParticipantsGrid(participantsGrid);
        if (application_id) {
            applicationsStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'promotionmaterials/preparePromotionRegMeetingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    workflow_stage_id: workflow_stage_id,
                    table_name: 'tra_promotion_adverts_applications'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results;
                    if (success == true || success === true) {
                        if (results) {
                            var model = Ext.create('Ext.data.Model', results);
                            meetingDetailsFrm.loadRecord(model);
                        }
                        applicationsStore.load();
                        participantsStore.load();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Ext.getBody().unmask();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        } else {
            Ext.getBody().unmask();
            //It's a new application
        }
    },

    saveMeetingApplicationComment: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(), 
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(), 
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(), 
            formPnl = btn.up('form'),
            frm = formPnl.getForm(),
            store = Ext.getStore(btn.storeID),
            win = formPnl.up('window');

        if (frm.isValid()) {
            frm.submit({
                url: 'promotionmaterials/savePromotionComments',
                params: {
                    application_code: application_code,
                    module_id: module_id,
                    workflow_stage_id: workflow_stage_id
                },
                waitMsg: 'Please wait...',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        store.load();
                        win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },

    getApplicationApprovalDetails: function (item) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            is_update = item.is_update,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            process_id = record.get('process_id'),
            module_id = record.get('module_id'),
            recommendation_id=record.get('recommendation_id'),
            // reg_product_id = record.get('reg_product_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            table_name = item.table_name,
            approval_frm = item.approval_frm,
            form = Ext.widget(approval_frm),
            storeArray = eval(item.stores),
            arrayLength = storeArray.length;
            console.log(form);
        form.setController('enforcementvctr');
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        if( form.down('datefield[name=expiry_date]')){
            form.down('datefield[name=expiry_date]').setReadOnly(true); 
        }
        if (is_update > 0) {
            form.down('combo[name=decision_id]').setReadOnly(true);
            form.down('datefield[name=approval_date]').setReadOnly(true);
           
            form.down('textarea[name=comment]').setReadOnly(true);
            form.down('button[name=save_recommendation]').setText('Update Recommendation');
        }
        form.down('hiddenfield[name=table_name]').setValue(table_name);
        form.down('hiddenfield[name=module_id]').setValue(module_id);
        //form.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        // form.down('hiddenfield[name=reg_product_id]').setValue(reg_product_id);
        Ext.Ajax.request({
            method: 'GET',
            url: 'common/getApplicationApprovalDetails',
            params: {
                application_id: application_id,
                application_code: application_code,
                module_id:module_id,
                // sub_module_id:sub_module_id,
                recommendation_id:recommendation_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    results = resp.results,
                    model = Ext.create('Ext.data.Model', results);
                   // console.log(results)
                if (success == true || success === true) {
                    form.loadRecord(model);
                    form.down('hiddenfield[name=application_id]').setValue(application_id);
                    form.down('hiddenfield[name=application_code]').setValue(application_code);
                    form.down('hiddenfield[name=process_id]').setValue(process_id);
                    form.down('hiddenfield[name=module_id]').setValue(module_id);
                    //form.down('hiddenfield[name=recommendation_id]').setValue(recommendation_id);
                    form.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
                    funcShowCustomizableWindow('Recommendation', '60%', form, 'customizablewindow', item);
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },

    showManagerApplicationSubmissionWinGeneric: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            categorize_selected=btn.categorize_selected,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
      
            valid = true,
            is_dataammendment_request =0,
            storeID = btn.storeID,
            table_name = getApplicationTable(module_id);
            if(activeTab.down('hiddenfield[name=is_dataammendment_request]')){
                is_dataammendment_request =activeTab.down('hiddenfield[name=is_dataammendment_request]').getValue();
            }
            if(btn.table_name != ''){
                table_name = btn.table_name;
            }
            if(categorize_selected){
                //check if inspections type set
            }
            
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagersgenericfrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
         
        } else {
            Ext.getBody().unmask();
        }
    },
    addApplicationWorkflowParams: function (me) {
        var store = me.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            table_name = getApplicationTable(module_id);
      
        store.getProxy().extraParams = {
            table_name: table_name,
            workflow_stage_id: workflow_stage_id,
        };
    },
});

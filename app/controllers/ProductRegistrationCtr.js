Ext.define('Admin.controller.ProductRegistrationCtr', {
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
        , {
            ref: 'productManuctureringFrm',
            selector: '#productManuctureringFrm'
        }, {
            ref: 'productApiManuctureringFrm',
            selector: '#productApiManuctureringFrm'
        }, {
            ref: 'productgmpinspectiondetailsFrm',
            selector: '#productgmpinspectiondetailsFrm'
        }
        ],
        control: {
            'productregtb button[name=drugProductRegHomeBtn]': {
                click: 'productRegHome'
            },
            'vetproductregtb button[name=drugProductRegHomeBtn]': {
                click: 'productRegHome'
            },
            'mdproductregtb button[name=drugProductRegHomeBtn]': {
                click: 'productRegHome'
            },
            'exproductregtb button[name=drugProductRegHomeBtn]': {
                click: 'productRegHome'
            },
            'compproductregtb button[name=drugProductRegHomeBtn]': {
                click: 'productRegHome'
            },
            'productapplicantselectiongrid': {
                itemdblclick: 'onApplicantSelectionListDblClick'
            },
            'exmpProductApplicationGrid': {
                itemdblclick: 'onExmpApplicantSelectionListDblClick'
            },
            'registredFacilitygrid': {
                itemdblclick: 'RegisteredFacilitygridDblClick'
            },
            

            /* 'productscreeninggrid': {
                 refresh: 'refreshScreeningChecklistItemsGrid'
             },*/
            

            //preparing functions   
            'drugproductreceiving': {
                afterrender: 'prepareNewProductReceiving'
            },
             'newdrugproductreceiving': {
                afterrender: 'prepareNewProductReceiving'
            },
           'listingreceiving':{
            afterrender: 'prepareNewProductReceiving'
           },
            'newdrugproductRegistration': {
                afterrender: 'prepareNewProductReceiving'
            },
            //renewal and alteration
            'alterationdrugsproductreceiving': {
                afterrender: 'prepareRenAltProductReceiving'
            },
            'renewaldrugproductreceiving': {
                afterrender: 'prepareNewProductReceiving'
            },
            'altdrugproductreceiving': {
                afterrender: 'prepareNewProductReceiving'
            },
            'wdrugproductreceiving': {
                afterrender: 'prepareNewProductReceiving'
            },
            'exemptionVetProductReceiving': {
                afterrender: 'prepareNewExemptionProductReceiving'
            },
            'exemptionVetWSProductregisrationwizard': {
                afterrender: 'prepareNewExemptionProductReceiving'
            },
            'exemptionDrugProductReceiving': {
                afterrender: 'prepareNewExemptionProductReceiving'
            },
            'exemptionMDProductReceiving': {
                afterrender: 'prepareNewProductReceiving'
            },
            'exemptionWSProductReceiving': {
                afterrender: 'prepareNewExemptionProductReceiving'
            },
            'exemptionDrugsProductsFrm': {
                afterrender: 'hideShowSaveAddbutton'
            },
            'exemptionMDDrugsProductsFrm': {
                afterrender: 'hideShowSaveAddbutton'
            },
            'exemptionIngredientsGrid': {
                afterrender: 'hideShowSaveAddbutton'
            },
            'renewaldrugsproductsreceiving': {
                afterrender: 'prepareRenAltProductReceiving'
            },'renewalmedicaldevicesreceiving': {
                afterrender: 'prepareRenAltProductReceiving'
            },
            'alterationmedicaldevicesreceiving': {
                afterrender: 'prepareRenAltProductReceiving'
            },

            
            'medicineproductdataammendrequestwizard': {
                afterrender: 'prepareAmmendementProductReceiving'
            }, 'meddevproductdataammendrequestwizard': {
                afterrender: 'prepareAmmendementProductReceiving'
            }, 
            

            'meddevproductdataammendwizard': {
                afterrender: 'prepareAmmendementProductReceiving'
            },'medicinesproductappealrequestwizard': {
                afterrender: 'prepareRenAltProductReceiving'
            },'meddeviceproductappealrequestwizard': {
                afterrender: 'prepareRenAltProductReceiving'
            },'withdrawaldrugsproductsreceivingwizard': {
              //  afterrender: 'prepareRenAltProductReceiving'
            },
            //withdrawal
            'withdrawaldrugsproductsreceivingwizard': {
                afterrender: 'prepareWithdrawalProductReceiving'
            },
            
            
            'productInvoicingPnl': {
                afterrender: 'prepareNewProductsInvoicing'
            },
            'productpaymentpnl': {
                afterrender: 'prepareNewProductPayments'
            },
            'drugproductsamplereceivingpnl': {
                afterrender: 'prepareNewProductSampleReceiving'
            },
            'medicaldevicesproductsamplereceivingpnl': {
                afterrender: 'prepareNewProductSampleReceiving'
            },
            'drugnewevaluationpnl': {
                afterrender: 'prepareProductsProcessUploadEvaluation'
            },
            'drugnewauditingpnl': {
                afterrender: 'prepareProductsProcessUploadAuditingProcess'
            },
            'medicaldevicenewevaluationpnl': {
                afterrender: 'prepareProductsProcessUploadEvaluation'
            },'medicaldevnewauditingpnl': {
                afterrender: 'prepareProductsProcessUploadAuditingProcess'
            },
            //query processing  
            'drugsmanagerqueryprocesspnl': {
                afterrender: 'prepareDrugsProductsUploadQueryPanel'
            },
            //query processing 
            // 'productDocUploadsGrid button[name=add_upload]': {
            //     click: 'showApplicationDocUploadWin'
            // },
            'productImagesUploadsGrid button[name=add_upload]': {
                click: 'showProductsImagesDocUploadWin'
            },
            // 'productDocUploadsGrid button[name=upload_file_btn]': {
            //     click: 'showApplicationDocUploadWin'
            // },

            'medicaldeviceproductregistrationgrid': {
                refresh: 'refreshProductRegistrationsMainGrids'
            },
            'drugsproductregistrationgrid': {
                refresh: 'refreshProductRegistrationsMainGrids'
            },

            'drugsIngredientsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'cosmeticsIngredientsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'exemptiondrugsProductslistGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'exemptionMddrugsProductslistGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'inspectioninothercountriesGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'drugsProductPackagingGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'productManuctureringGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'productApiManuctureringGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'productnotificationnanuctureringgrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'portalProductRegInOtherCountriesGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'productGmpInspectionDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            }, 'productsSampledetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
             'productvariationrequestsgrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'animalMedicinalRequirmentGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'animalHoldingUnitGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'pharmacyDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'pharmacyWSDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'impDistributorDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'prescriberDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'personnelDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'patientDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'productevaluationcommentsgrid': {
                refresh: 'refreshproductevaluationcommentsgrid'
            },
            'portalExemptiondrugsProductslistGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'portalAnimalMedicinalRequirementGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'portalPharmacyDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'portalPrescriberDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'portalPatientDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'portalImpDistributorsDetailsGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'portalAnimalHoldingUnitGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'portalExemptionMDdrugsProductListGrid': {
                refresh: 'refreshProductsOtherDetailsGrid'
            },
            'drugnewinvoicingpnl button[name=saveinvoice_btn]': {
                click: 'saveDrugProductInvoicingDetails'
            },
            'drugnewreceivingwizard button[name=process_submission_btn]': {
                click: 'showReceivingApplicationSubmissionWin'
            },
            'exemptionVetWSProductregisrationwizard button[name=process_submission_btn]': {
                click: 'showReceivingApplicationSubmissionWin'
            },
           
            'productinvoicingcostelementsgrid combo[name=fee_type_id]': {
                change: 'onInvoiceFeeTypeChange'
            },
            // submissions
            'drugnewinvoicingpnl button[name=process_submission_btn]': {
                click: 'showInvoicingApplicationSubmissionWin'
            },
            
            'drugnewevaluationpnl button[name=process_submission_btn]': {
                click: 'showEvaluationApplicationSubmissionWin'
            },
            'drugnewauditingpnl button[name=process_submission_btn]': {
                click: 'showAuditingApplicationSubmissionWin'
            },'medicaldevicenewevaluationpnl button[name=process_submission_btn]': {
                click: 'showEvaluationApplicationSubmissionWin'
            },'medicaldevnewauditingpnl button[name=process_submission_btn]': {
                click: 'showAuditingApplicationSubmissionWin'
            },
            'drugsmanagerqueryprocesspnl button[name=process_submission_btn]': {
                click: 'showEvaluationApplicationSubmissionWin'
            },
            'managerCertificateRejectionIntentPnl button[name=process_submission_btn]': {
                click: 'showRejectionIntentApplicationSubmissionWin'
            },
            'drugworkflowsubmissionsmanevafrm button[name=app_submission_btn]': {
                click: 'funcSubmitApplicationManagerEvaluation'
            },
            'drugnewinvoicingpnl button[name=save_btn]': {
                click: 'saveNewProductsInvoicingDetails'
            },
            'manufacturingDetailsFrm button[action=btn_savedetails]': {
                click: 'onSaveManufacturerDetails'
            }, 'manufacturingSiteDetailsFrm button[action=btn_savedetails]': {
                click: 'onSaveManufacturerSiteDetails'
            },
            'manufacturingDetailsAPIFrm button[action=btn_savedetails]': {
                click: 'onSaveAPIManufacturerDetails'
            },
            'newproductspaymentspanel toolbar button[name=receive_payments]': {
                click: 'showPaymentReceptionForm'
            },
            '#manufacturingDetailsGrid': {
                itemdblclick: 'funcManufacturerSelection'
            },
            '#manufacturingSiteDetailsGrid': {
                itemdblclick: 'funcManufacturerSelection'
            },
            
            '#manufacturingDetailsAPIGrid': {
                itemdblclick: 'funcAPIManufacturerSelection'
            },
            'gmpInspectionDetailsGrid': {
                itemdblclick: 'funcSelectgmpInspectionDetailsGrid'
            },
            //product more details
            //change to product interface
            // 'paymentVerificationPnl form toolbar button[name=more_app_details]': {
            //     click: 'showProductApplicationMoreDetails'
            // },
            'newproductspaymentspanel form toolbar button[name=more_app_details]': {
                click: 'showProductApplicationMoreDetails'
            },
            'newproductinvoicingpanel toolbar button[name=variation_requests]': {
                click: 'showApplicationVariationRequests'
            },
            'medicaldevicenewevaluationpnl toolbar button[name=variation_requests]': {
                click: 'showApplicationVariationRequests'
            }, 'drugproductevaluation toolbar button[name=variation_requests]': {
                click: 'showApplicationVariationRequests'
            },


            
            
            'peerMeetingApplicationListGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'rcMeetingApplicationListGrid button[name=save_btn]': {
                click: 'saveTCMeetingDetails'
            },
            'productManagerMeetingGrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'productReviewTCMeetingGrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'productApprovalTCMeetingGrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'productcertificatereleasegrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'renewalproductapprovalgrid': {
                refresh: 'managerMeetingRefreshGrid',
                beforedeselect: 'beforeManagerMeetingAppsGridDeselect'
            },
            'alterationproductapprovalgrid': {
                refresh: 'alterationproductapprovalRefreshgrid'
            },
            'alterationproductcertificatereleasegrid': {
                refresh: 'alterationproductapprovalRefreshgrid'
            },
            'productappealapprovalgrid': {
                refresh: 'alterationproductapprovalRefreshgrid'
            },
            
            //meeting panel 
            'peerReviewSchedulingPnl': {
                afterrender: 'prepareProductManagerMeeting'
            },
            'rcReviewSchedulingPnl': {
                afterrender: 'prepareProductManagerMeeting'
            },
            'peerReviewMeetingPnl': {
                afterrender: 'prepareProductManagerMeeting'
            },
            'rcReviewMeetingPnl': {
                afterrender: 'prepareProductManagerMeeting'
            },
            'newProductTcReviewMeetingpnl': {
                afterrender: 'prepareProductRecommReview'
            },
            'newProductApprovalPnl': {
                afterrender: 'prepareProductApprovals'
            },
            'renewalproductapprovalpnl': {
                afterrender: 'prepareRenProductApprovals'
            },
            'newProductApprovalspnl': {
                afterrender: 'prepareProductApprovals'
            },
            'productCertificateReleasePnl': {
                afterrender: 'prepareProductCertificateRelease'
            },

            'newProductCommunicationPnl': {
                afterrender: 'prepareNewProductCommunication'
            },
            'productParmeetingParticipantsGrid button[name=save_selected]': {
                click: 'addTcMeetingParticipants'
            },
            //view details 
            'productInvoicingPnl button[name=more_app_details]': {
                click: 'showProductApplicationMoreDetails'
            },
            'productpaymentpnl button[name=more_app_details]': {
                click: 'showProductApplicationMoreDetails'
            },
            'drugnewevaluationpnl toolbar button[name=more_app_details]': {
                click: 'showProductApplicationMoreDetails'
            },  'applicationcommentsFrm button[name=save_comment]': {
                click: 'saveApplicationComment'
            }, 'drugnewauditingpnl toolbar button[name=more_app_details]': {
                click: 'showProductApplicationMoreDetails'
            }, 'foodevaluationpnl toolbar button[name=more_app_details]': {
                click: 'showProductApplicationMoreDetails'
            },
            //
            'drugsmanagerqueryprocesspnl  toolbar button[name=more_app_details]': {
                click: 'showProductApplicationMoreDetails'
            },
            'previewproductDocUploadsGrid': {
                refresh: 'refreshAllApplicationDocUploadsGrid'
            },  
            'registeredproductsgrid': {
                refresh: 'refreshRegisteredProductsgrid'
            }, 
               
            
            'onlineproductregistrationgrid': {
                refresh: 'refreshOnlineProductsRegsMainGrids',
                submitApplication: 'submitRejectedOnlineApplication'
            }, 'registeredproductsgrid': {
                itemdblclick: 'onRegisteredProductsgridDblClick'
            }, 'productImagesUploadsGrid': {
                refresh: 'refreshProductImagesUploadsGrid'
            }, 'button[name=uploadimage_btn]': {
                click: 'uploadImageApplicationFile'
            }, 'documentssubmissionrecommendationfrm button[name=savesamplesubmissionremarks]': {
                click: 'funcdocumentssubmissionrecommendationfrm'
            },
            
            //online products applicaitons 
            'onlinedrugproductreceivingwizard': {
                afterrender: 'prepareOnlineProductReceiving'
            },'onlineantisepticproductreceivingwizard': {
                afterrender: 'prepareOnlineProductReceiving'
            },
            'onlinealtmedicalproductreceivingwizard': {
                afterrender: 'prepareOnlineProductReceiving'
            },
            'onlinealtdrugproductreceivingwizard': {
                afterrender: 'prepareOnlineProductReceiving'
            },
            'onlinewithdrawaldrugproductreceivingwizard': {
                afterrender: 'prepareOnlineProductReceiving'
            },
            'onlinefoodproductreceivingwizard': {
                afterrender: 'prepareOnlineProductReceiving'
            }, 'onlinemedicaldevicesreceivingwizard': {
                afterrender: 'prepareOnlineProductReceiving'
            },
             'onlinecosmeticsreceivingwizard': {
                afterrender: 'prepareOnlineProductReceiving'
            },'drugsproductsqueriesgrid': {
                refresh: 'refreshdrugsproductsqueriesgrid'
            },
			'productapplicationqueriesgrid': {
                refresh: 'refreshdrugsproductsqueriesgrid'
            } ,
			'drugsmanagerproductsqueriesgrid': {
                refresh: 'refreshdrugsproductsqueriesgrid'
            } ,'managerprecheckingqueryprocessgrid button[action=process_submission_btn]': {
                click: 'showManagerQueryApplicationSubmissionWin'
            },'eacmedicinesregistrationgrid': {
                refresh: 'refreshOEACnlineProductsRegsMainGrids',
            },'productnotprecheckingqueryprocessgrid button[action=process_submission_btn]': {
                click: 'showManagerQueryApplicationSubmissionWin'
            },'onlineantisepticproductreceivingwizard button[name=save_productapplications]': {
                click: 'funcSaveOnlineProductApplications'
            },'onlinemedicaldevicesreceivingwizard button[name=save_productapplications]': {
                click: 'funcSaveOnlineProductApplications'
            },'onlinedrugproductreceivingwizard button[name=save_productapplications]': {
                click: 'funcSaveOnlineProductApplications'
            },
            'productreginothercountriesfrm': {
                afterrender: 'addApplicationCodetoForm'
            },
            'productVariationFrm': {
                afterrender: 'prepareVariationForm'
            },
            'conductedproductclinicaltrialfrm': {
                afterrender: 'addApplicationCodetoForm'
            },
            'inspectioninothercountriesfrm': {
                afterrender: 'addApplicationCodeProductIdtoForm'
            },
            'animalMedicinalRequirmentFrm': {
                afterrender: 'addApplicationCodeProductIdtoComboInForm'
            },
            'managerCertificateRejectionIntentPnl button[name=add_remarks_intent_rejection]': {
                click: 'addRejectionAppealResponseRecommendation'
            },
            // new form renderer for applications
            // 'drugsProductsDetailsFrm': {
            //     beforerender: 'prepareInterfaceBasedonConfig'
            // },
            // 'medicaldevicesProductsDetailsFrm': {
            //     beforerender: 'prepareInterfaceBasedonConfig'
            // },//
            'newdrugproductreceivingwizard': {
                beforerender: 'updateVisibilityAccess'
            }, 
            'listingreceivingWizard': {
                beforerender: 'updateVisibilityAccess'
            }, 
            'newdrugproductregisrationwizard': {
                beforerender: 'updateVisibilityAccess'
            }, 
            'onlinedrugproductreceivingwizard': {
                beforerender: 'updateVisibilityAccess'
            }, 
            'mdAssessmentToolPnl': {
                afterrender: 'setApplicationCodeIfAvailable'
            },
            'mdAssessmentToolHistoryFrm': {
                afterrender: 'loadMdAssessmentHistory'
            },
            // 'renewaldrugproductregisrationwizard': {
            //     beforerender: 'updateVisibilityAccess'
            // }, 
            'productScreeningPnl button[name=process_submission_btn]': {
                click: 'showEvaluationApplicationSubmissionWin'
            },
            'productScreeningaAuditPnl button[name=process_submission_btn]': {
                click: 'showEvaluationApplicationSubmissionWin'
            },
            'drugsProductPackagingFrm': {
                afterrender: 'showandhidefields'
            },
            'drugsIngredientsFrm': {
                beforerender: 'showandhideIngredientsfields'
            },
            'productScreeningPnl': {
                afterrender: 'prepareExemptionsProductId'
            },
            'productScreeningaAuditPnl': {
                afterrender: 'prepareExemptionsProductId'
            }
        }

    },
    /**
     * Called when the view is created
     */
    init: function () {

    },

    listen: {
        controller: {
            '*': {
                showProductRegWorkflow: 'showProductRegWorkflow',
                onNewProductRegApplication: 'onNewProductRegApplication',
                onEditDrugProductRegApplication: 'onEditDrugProductRegApplication',
                showReceivingApplicationSubmissionWin: 'showReceivingApplicationSubmissionWin',
                showExmpReceivingApplicationSubmissionWin:'showExmpReceivingApplicationSubmissionWin',
                showSamplerecApplicationSubmissionWin: 'showSamplerecApplicationSubmissionWin',
                applicationProductMoreDetails: 'applicationProductMoreDetailsGeneric',
                funcActiveProductsOtherInformationTab: 'funcActiveProductsOtherInformationTab',
                showAddProductOtherdetailsWinFrm: 'showAddProductOtherdetailsWinFrm',
                doSubmitData: 'doSubmitData',
                editpreviewProductInformation: 'editpreviewProductInformation',//editpreviewPermitnformation
                editpreviewGmpProductInformation:'editpreviewGmpProductInformation',
                previewproductApplicationQueries:'previewproductApplicationQueries',
                saveProductInformation: 'saveProductInformation',
                getApplicationApprovalDetails: 'getApplicationApprovalDetails',
                getBatchApplicationApprovalDetails:'getBatchApplicationApprovalDetails',
                showProductApplicationMoreDetails: 'showProductApplicationMoreDetails',
                funcPanelEvaluationReportUpload: 'funcPanelEvaluationReportUpload',
                
                refreshProductsOtherDetailsGrid: 'refreshProductsOtherDetailsGrid',
                funcPrevEvaluationReportUpload: 'funcPrevEvaluationReportUpload',
                funcPrevAuditReportUpload: 'funcPrevAuditReportUpload',
                onRenAltProductRegistration: 'onNewProductRegApplication',
                showPreviousUploadedDocs: 'showPreviousUploadedDocs',
                showPreviousNonGridPanelUploadedDocs:'showPreviousNonGridPanelUploadedDocs',
                showUploadEvaluationDocuments:'showUploadEvaluationDocuments',
                previewProductOnlineApplication:'previewProductOnlineApplication',
                showEvaProductRegistration: 'showEvaProductRegistration',
                loadProductWizardFromRecord: 'onEditDrugProductRegApplication',
                loadAltRenWizardFromRecord: 'onRenProductRegApplication',
                showAddExemptionProductOtherdetailsWinFrm: 'showAddExemptionProductOtherdetailsWinFrm',
                setSectionAsValue: 'setSectionAsValue',
                setMDAssessmentNextQuestion: 'setMDAssessmentNextQuestion',
                loadMdAssessmentHistory: 'loadMdAssessmentHistory',
                showProductRegister:'showProductRegister',
                // addListenerToConfig:'addListenerToConfig'
            }
        }
    },
    previewProductOnlineApplication: function (view, record) {
        
        var grid = view.grid,
            tracking_no = record.get('tracking_no'),
            application_id = record.get('active_application_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            is_manager_query  = record.get('is_manager_query'),
            process_id  = record.get('process_id'),
            last_query_ref_id =  record.get('last_query_ref_id'),
            status_type_id  = record.get('status_type_id'),
            prodclass_category_id  = record.get('prodclass_category_id'),
            isRejection = grid.isRejection,

            application_code = record.get('application_code');
            
            if(section_id == 2 || section_id ==10 || section_id ==3){
               var wizard_pnl = 'onlinedrugproductreceivingwizard',
                    alterationwizard_pnl = 'onlinealtdrugproductreceivingwizard',
                    withdrawalwizard_pnl ='onlinewithdrawaldrugproductreceivingwizard';
            }
            else{ 
                var wizard_pnl = 'onlinemedicaldevicesreceivingwizard',
                alterationwizard_pnl = 'onlinealtmedicalproductreceivingwizard',
                withdrawalwizard_pnl ='onlinewithdrawalmedicalproductreceivingwizard';
           
            }
            // if(prodclass_category_id == 2){
            //     if(sub_module_id == 9 ){

            //         wizard_pnl = 'onlineantisepticproductreceivingwizard';
    
            //     }
            //     else if(sub_module_id == 17){
    
            //         wizard_pnl = 'onlineantisepticproductreceivingwizard';
    
            //     }
            //     else{
            //         //then for the screening grid change to 
            //         wizard_pnl = 'onlineantisepticproductreceivingwizard';
                    
            //     }
            // }
            //else{
                if(sub_module_id == 9 ){

                    wizard_pnl = alterationwizard_pnl;
    
                }
                else if(sub_module_id == 17){
    
                    wizard_pnl = withdrawalwizard_pnl;
    
                }
                else if(sub_module_id == 30){
    
                    wizard_pnl = 'onlinemedicaldevicesnotificationrecwizard';
    
                }
                else{
                    //then for the screening grid change to 
                    wizard_pnl = wizard_pnl;
                    
                }
            //}
           
            onlinePanel = Ext.widget(wizard_pnl);
            if(sub_module_id == 7 || sub_module_id == 8){
                // querygrid = onlinePanel.down('productapplicationqueriesgrid');
                // querygrid.down('hiddenfield[name=application_code]').setValue(application_code);
                // querygrid.down('hiddenfield[name=section_id]').setValue(section_id);
                // querygrid.down('hiddenfield[name=module_id]').setValue(module_id);
                // querygrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
    
            }
            if (status_type_id == 3) {
              //  onlinePanel.down('button[name=preview_queries_btn]').setVisible(true);
               
            }
            if (status_type_id != 1) {
              //  onlinePanel.down('button[name=preview_queries_btn]').setVisible(true);
            }
            
            if (isRejection == 1) {
                onlinePanel.down('button[name=prev_rejections]').setVisible(false);
                onlinePanel.down('button[name=actions]').setVisible(true);
                onlinePanel.down('button[name=submit_btn]').setVisible(false);
                onlinePanel.down('button[name=query_btn]').setVisible(false);
                onlinePanel.down('button[name=reject_btn]').setVisible(false);
            }   
            
            onlinePanel.down('hiddenfield[name=active_application_code]').setValue(application_code);
            onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
            onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
            onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            //onlinePanel.down('hiddenfield[name=last_query_ref_id]').setValue(last_query_ref_id);

            
            onlinePanel.down('hiddenfield[name=active_application_id]').setValue(application_id);
            onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
            onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
            onlinePanel.down('button[name=link_applicant]').setDisabled(true);
            onlinePanel.down('button[name=link_localagent]').setDisabled(true);
            onlinePanel.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);
            onlinePanel.down('hiddenfield[name=process_id]').setValue(process_id);
            

            docsGrid = onlinePanel.down('onlineproductdocuploadsgrid');
            docsGrid.down('hiddenfield[name=application_code]').setValue(application_code);
            docsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
            docsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
            docsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            docsGrid.down('hiddenfield[name=query_ref_id]').setValue(last_query_ref_id);
            docsGrid.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);

            onlinePanel.down('hiddenfield[name=status_type_id]').setValue(status_type_id);
            //docsGrid.store.load();
            //show
            funcShowCustomizableWindow(tracking_no, '90%', onlinePanel, 'customizablewindow');
            //alert(prodclass_category_id)
           // onlinePanel.getViewModel().set('isReadOnly', true);
                
    }, refreshOnlineProductsRegsMainGrids: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
            module_id = (activeTab.down('hiddenfield[name=module_id]')) ? activeTab.down('hiddenfield[name=module_id]').getValue() : null,
            section_id = (activeTab.down('hiddenfield[name=section_id]')) ? activeTab.down('hiddenfield[name=section_id]').getValue() : null;

            store.getProxy().extraParams = {
                module_id: module_id,
                section_id: section_id,
                sub_module_id: sub_module_id
            };
            
    },refreshOEACnlineProductsRegsMainGrids:function(me){

        var store = me.store,
                grid = me.up('grid'),
                mainTabPanel = this.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                module_id = (activeTab.down('hiddenfield[name=module_id]')) ? activeTab.down('hiddenfield[name=module_id]').getValue() : null,
                section_id = (activeTab.down('hiddenfield[name=section_id]')) ? activeTab.down('hiddenfield[name=section_id]').getValue() : null;
            store.getProxy().extraParams = {
                module_id: module_id,
                section_id: section_id
            };

    },funcSaveOnlineProductApplications:function(btn){
        var wizard_pnl = btn.wizard,
            wizardPnl = btn.up(wizard_pnl),
            branch_id = wizardPnl.down('combo[name=branch_id]').getValue(),
            application_code = wizardPnl.down('hiddenfield[name=active_application_code]').getValue(),
            section_id = wizardPnl.down('hiddenfield[name=section_id]').getValue(),
            form = wizardPnl.down('#productsDetailsFrm'),
            form = form.getForm();

        if(form.isValid()){
                form.submit({
                    params: {
                        branch_id: branch_id,
                        section_id:section_id,
                        application_code:application_code
                    },headers: {
                        'X-CSRF-Token': token
                    }, headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    waitMsg: 'Updating Product Registration Details',
                    url: 'productregistration/saveOnlineProductRegistrationReceiving',
                    success: function (fm, action) {
                        var response = Ext.decode(action.response.responseText),
                            message = response.message,
                            success = response.success;
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (fm, action) {
                        var response = Ext.decode(action.response.responseText),
                            message = response.message;
                            toastr.error(message, 'Failure Response');
                    },error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });


        }
        else{

            toastr.error('Fill in all the Products Details', 'Error Response');
        }
        


    }, refreshdrugsproductsqueriesgrid: function (me) {

        var store = me.store,
            grid = me.up('grid'),
            status_id = grid.querystatus_id,
            application_code = grid.down('hiddenfield[name=application_code]').getValue();

            store.getProxy().extraParams = {
                application_code: application_code,
                status: status_id
            };
    },
    showProductRegister: function (sub_module_id, wrapper_xtype) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down(wrapper_xtype);
            dashboardWrapper.removeAll();
        var productRegisterGrid = Ext.widget('productRegisterGrid');
        dashboardWrapper.add(productRegisterGrid);
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    uploadImageApplicationFile: function (btn) {
        var me = this,
            form = btn.up('form'),
            win = form.up('window'),
            frm = form.getForm(),
            storeID = btn.storeID,
            uploads_store = Ext.getStore(storeID);

        frm.submit({
            //clientValidation: false,
            url: 'documentmanagement/uploadProductImages',
            waitMsg: 'Uploading...',
            success: function (fm, action) {
                var response = Ext.decode(action.response.responseText),
                    message = response.message,
                    success = response.success;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    uploads_store.load();
                    win.close();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (fm, action) {
                var response = Ext.decode(action.response.responseText),
                    message = response.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    
    funcdocumentssubmissionrecommendationfrm: function (btn) {
        var me = this,
            form = btn.up('form'),
            win = form.up('window'),
            frm = form.getForm();

        frm.submit({
            //clientValidation: false,
            url: 'productregistration/savedocumentssubmissionrecommendation',
            waitMsg: 'Uploading...',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (fm, action) {

                var response = Ext.decode(action.response.responseText),
                    message = response.message,
                    success = response.success;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    win.close();
                } else {
                    toastr.error(message, 'Failure Response');
                }

            },
            failure: function (fm, action) {
                var response = Ext.decode(action.response.responseText),
                    message = response.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    submitRejectedOnlineApplication: function (application_id, application_code, action_url, table_name) {
        Ext.MessageBox.confirm('Confirm', 'Are you sure to reject this application?', function (button) {
            if (button === 'yes') {
                Ext.MessageBox.show({
                    title: 'Remarks',
                    msg: 'Remarks/Comments:',
                    width: 320,
                    buttons: Ext.MessageBox.OKCANCEL,
                    multiline: true,
                    scope: this,
                    //animateTarget: bttn,
                    fn: function (btn, text) {
                        var comment = text;
                        if (btn === 'ok') {
                            Ext.getBody().mask('Please wait...');
                            if (comment == '' || comment === '') {
                                Ext.getBody().unmask();
                                toastr.warning('Please Enter Remark!!', 'Warning Response');
                                return;
                            }
                            Ext.Ajax.request({
                                url: action_url,
                                params: {
                                    application_id: application_id,
                                    application_code: application_code,
                                    comment: comment,
                                    table_name: table_name
                                },
                                headers: {
                                    'Authorization': 'Bearer ' + access_token,
                                    'X-CSRF-Token': token
                                },
                                success: function (response) {
                                    Ext.getBody().unmask();
                                    var resp = Ext.JSON.decode(response.responseText),
                                        success = resp.success,
                                        message = resp.message;
                                    if (success == true || success === true) {
                                        toastr.success(message, 'Success Response');
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
                        }
                    }
                });
            }
        });
    },

    refreshAllApplicationDocUploadsGrid: function (me) {

        var store = me.store,
            grid = me.up('treepanel'),
            document_type_id = grid.down('combo[name=applicable_documents]').getValue(),
            table_name = grid.table_name,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        store.getProxy().extraParams = {
            application_code: application_code,
            sub_module_id:sub_module_id,
            module_id:module_id,
            table_name: table_name
        };
    }, 
    onRegisteredProductsgridDblClick: function (grid, record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            // win = grid.up('window'),
            activeTab = mainTabPanel.getActiveTab(),
            reg_product_id = record.get('reg_product_id'),
            tra_product_id = record.get('tra_product_id'),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]'),
            applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            products_detailsfrm = activeTab.down('#productsDetailsFrm'),
            is_populate_primaryappdata = false,
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]');
            assessmentprocedure_type_id = activeTab.down('combo[name=assessmentprocedure_type_id]');
            assessment_procedure_id = activeTab.down('combo[name=assessment_procedure_id]');
            if(activeTab.down('hiddenfield[name=is_populate_primaryappdata]')){

                is_populate_primaryappdata = activeTab.down('hiddenfield[name=is_populate_primaryappdata]').getValue();
            }
        filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        // if(sub_module_id == 7 || sub_module_id == 8){
        //     app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore()
        //     app_check_types_store.removeAll();
        //     app_check_types_store.load({
        //         params: {
        //             process_id: process_id,
        //             workflow_stage: workflow_stage_id
        //         }
        //     });

        // }
        
        
        if (reg_product_id || sub_module_id == 70) {
            app_doc_types_store.getStore().removeAll();
            app_doc_types_store.getStore().load({
                params: {
                    process_id: process_id,
                    workflow_stage: workflow_stage_id
                }
            });
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/onRegisteredProductsSearchdetails',
                params: {
                    reg_product_id: reg_product_id,
                    tra_product_id: tra_product_id
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        results = resp.results,
                        ltrResults = resp.ltrDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                    ltr_model = Ext.create('Ext.data.Model', ltrResults);

                    if (success == true || success === true) {

                        applicantFrm.loadRecord(model);
                        localagentFrm.loadRecord(ltr_model);
                        products_detailsfrm.loadRecord(model);
                        // zone_cbo.setReadOnly(true);
                        zone_cbo.setValue(branch_id);
                        assessmentprocedure_type_id.setValue(results.assessmentprocedure_type_id);
                        assessment_procedure_id.setValue(results.assessment_procedure_id);
                        if(is_populate_primaryappdata == 1){
                            
                            activeTab.down('hiddenfield[name=active_application_code]').setValue(results.active_application_code);
                            activeTab.down('hiddenfield[name=active_application_id]').setValue(results.active_application_id);
                            activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                            activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                            
                            activeTab.down('hiddenfield[name=product_id]').setValue(results.tra_product_id);
                            
                            activeTab.down('#product_panel').getViewModel().set('isReadOnly', true);
                           // console.log('here onRegisteredProductsSearchdetails');
                        }
                        // win.close();
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
     getApplicationApprovalDetails: function (item) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            is_update = item.is_update,
            btn = item.up('button'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            record = btn.getWidgetRecord(),
            application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            process_id = record.get('process_id'),
            module_id = record.get('module_id'),
            reg_product_id = record.get('reg_product_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            table_name = item.table_name,
            approval_frm = item.approval_frm,
            form = Ext.widget(approval_frm),
            storeArray = eval(item.stores),
            arrayLength = storeArray.length;
        form.setController('productregistrationvctr');
        //update selected application on active
        activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
        
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
        form.down('hiddenfield[name=reg_product_id]').setValue(reg_product_id);
        Ext.Ajax.request({
            method: 'GET',
            url: 'common/getApplicationApprovalDetails',
            params: {
                application_id: application_id,
                application_code: application_code
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
                if (success == true || success === true) {
                    form.loadRecord(model);
                    form.down('hiddenfield[name=application_id]').setValue(application_id);
                    form.down('hiddenfield[name=application_code]').setValue(application_code);
                    form.down('hiddenfield[name=process_id]').setValue(process_id);
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
    getBatchApplicationApprovalDetails:function(btn){
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

        form.setController('productregistrationvctr');
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
    saveApplicationComment: function (btn) {
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
                url: 'productregistration/saveProductRegistrationComments',
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
    showPreviousComments: function (btn) {

       
    },
    saveProductInformation: function (btn) {
        var me = this,
            mainTabPnl = this.getMainTabPanel(),
            url = btn.action_url,
            table = btn.table_name,
            activeTab = mainTabPnl.getActiveTab();
        if (activeTab.down('#productsDetailsFrm')) {
            var form = activeTab.down('#productsDetailsFrm'),
                product_id = activeTab.down('hiddenfield[name=product_id]').getValue(),
                application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        } else {
            var win = btn.up('window'),

                form = win.down('form'),
                product_id = form.down('hiddenfield[name=product_id]').getValue(),
                application_id = '';
        }

        frm = form.getForm();
        if (frm.isValid()) {
            if (frm.isValid()) {
                frm.submit({
                    url: url,
                    waitMsg: 'Please wait...',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    params: {
                        application_id: application_id,
                        product_id: product_id
                    },
                    success: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            success = response.success,
                            message = response.message;
                        if (success == true || success === true) {
                            toastr.success(message, "Success Response");
                            // win.close();
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
        }
    },
    showAddProductOtherdetailsWinFrm: function (btn) {

        var me = this,
            mainTabPnl = this.getMainTabPanel(),
            activeTab = mainTabPnl.getActiveTab();

        if (activeTab.down('hiddenfield[name=product_id]')) {
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        } else {
            var win = btn.up('window'),
                product_id = win.down('hiddenfield[name=product_id]').getValue();
                section_id = win.down('hiddenfield[name=section_id]').getValue();
        }

        var childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            child = Ext.widget(childXtype),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;

            if (child.down('hiddenfield[name=section_id]')){

                child.down('hiddenfield[name=section_id]').setValue(section_id);
                
            }
        console.log(section_id);
        // child.setHeight(Ext.Element.getViewportHeight() - 118);
        // child.setScrollable(true);
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow',btn);
        child.down('hiddenfield[name=product_id]').setValue(product_id);
       
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
    },
    showAddExemptionProductOtherdetailsWinFrm: function (btn) {

        var me = this,
            mainTabPnl = this.getMainTabPanel(),
            activeTab = mainTabPnl.getActiveTab();

        if (activeTab.down('hiddenfield[name=active_application_code]')) {
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
        } 
        else {
            var win = btn.up('window'),
                application_code = win.down('hiddenfield[name=active_application_code]').getValue();
                prodclass_category_id = win.down('hiddenfield[name=prodclass_category_id]').getValue();
                section_id = win.down('hiddenfield[name=section_id]').getValue();
        }
        if(prodclass_category_id == 51){
            var store = btn.up('grid').getStore(),
                count = store.getTotalCount();
            if(count >= 1){
                toastr.warning('Only one Product Is Allowed for this type of exemption!!', 'Warning Response');
                return false;
            }
        }

        var childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            child = Ext.widget(childXtype),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;

            if (child.down('hiddenfield[name=section_id]')){

                child.down('hiddenfield[name=section_id]').setValue(section_id);
                
            }

        // child.setHeight(Ext.Element.getViewportHeight() - 118);
        // child.setScrollable(true);
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow',btn);
        child.down('hiddenfield[name=application_code]').setValue(application_code);
       
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
    },
    showSamplerecApplicationSubmissionWinInvalidated: function (btn) {
        
        var me = this,
            mainTabPnl = this.getMainTabPanel(),
            activeTab = mainTabPnl.getActiveTab();

        if (activeTab.down('hiddenfield[name=product_id]')) {
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
        } else {
            var win = btn.up('window'),
                product_id = win.down('hiddenfield[name=product_id]').getValue();
        }
        childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            child = Ext.widget(childXtype),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;

        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
        child.down('hiddenfield[name=product_id]').setValue(product_id);
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        
    },
    editpreviewGmpProductInformation: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            isReadOnly = item.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            product_id = record.get('product_id'),
            section_id = record.get('section_id'),
            applicant_id = record.get('applicant_id'),
            sub_module_id = record.get('sub_module_id'),
            module_id = record.get('module_id'),
            ref_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            appdata_ammendementrequest_id = record.get('appdata_ammendementrequest_id'),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        //if for the products forms 
        
        if(section_id == 2){

            productdetails_panel = 'drugsProductsDetailsPanel';

        }
        else if(section_id == 4){
            productdetails_panel = 'medicaldevicesproductsdetailspanel';

        }
        this.showProductApplicationMoreDetailsGeneric(application_code,productdetails_panel, application_id, product_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, is_temporal,appdata_ammendementrequest_id);

    },
    //preview product information 
    editpreviewProductInformation: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            isReadOnly = item.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            
            application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            product_id = record.get('product_id'),
            section_id = record.get('section_id'),
            applicant_id = record.get('applicant_id'),
            ref_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            appdata_ammendementrequest_id = record.get('appdata_ammendementrequest_id'),
            
            module_id = record.get('module_id'),
            
            sub_module_id = record.get('sub_module_id'),
            
            
            section_id = record.get('section_id');
        

            if(activeTab.down('#main_processpanel')){
                productdetails_panel = activeTab.down('#main_processpanel').productdetails_panel;
            }
                else{
                    if(section_id == 2){
                        productdetails_panel = 'drugsProductsDetailsPnl';
                    }   
                    else{
                        productdetails_panel = 'drugsProductsDetailsPnl';//'medicaldevicesproductsdetailspanel';
                    }
            }
           
        //by default alter prodclass category and a
        if(activeTab.down('hiddenfield[name=prodclass_category_id]')){
           activeTab.down('hiddenfield[name=prodclass_category_id]').setValue(record.get('prodclass_category_id')); 
        }
        //if for the products forms 

        this.showProductApplicationMoreDetailsGeneric(application_code,productdetails_panel, application_id, product_id, applicant_id, ref_no, process_id, '', module_id, sub_module_id, section_id, isReadOnly, is_temporal,appdata_ammendementrequest_id);

    },
    previewproductApplicationQueries: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            isReadOnly = item.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            productqueriespanel = activeTab.down('#main_processpanel').productqueriespanel,
            application_id = record.get('active_application_id'),
            product_id = record.get('product_id'),
            section_id = record.get('section_id'),
            applicant_id = record.get('applicant_id'),
            ref_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            productqueriespanel = Ext.widget(productqueriespanel);

        productqueriespanel.height =Ext.Element.getViewportHeight() - 118;
        productqueriespanel.querystatus_id= '1,3';
        productqueriespanel.isReadOnly=1;
        //if for the products forms 
        productqueriespanel.down('hiddenfield[name=application_code]').setValue(record.get('application_code'));

        funcShowCustomizableWindow(ref_no, '85%', productqueriespanel, 'customizablewindow');
      
    },
    showPreviousUploadedDocs: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),

            document_type_id = item.document_type_id,
            winTitle = item.winTitle,
            winWidth = item.winWidth,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        console.log(record);
        ref_no = record.get('tracking_no');
        grid = Ext.widget('previewproductDocUploadsGrid');//('previewproductDocUploadsGrid');
        store = grid.store;
        grid.height = Ext.Element.getViewportHeight() - 118;
       // grid.setController('productregistrationvctr');
        grid.down('hiddenfield[name=process_id]').setValue(record.get('process_id'));
        grid.down('hiddenfield[name=section_id]').setValue(record.get('section_id'));
        grid.down('hiddenfield[name=module_id]').setValue(record.get('module_id'));
        grid.down('hiddenfield[name=sub_module_id]').setValue(record.get('sub_module_id'));
        grid.down('hiddenfield[name=application_code]').setValue(record.get('application_code'));
        grid.down('combo[name=applicable_documents]').setValue(document_type_id);
        funcShowCustomizableWindow("Associated Preview " + ' :' + ref_no, winWidth, grid, 'customizablewindow', item);

    },showPreviousNonGridPanelUploadedDocs: function (btn) {
        var document_type_id = btn.document_type_id,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        //for manager previews
        if(btn.is_manager == 1){
            var button = btn.up('button'),
                record = button.getWidgetRecord(),
                application_code = record.get('application_code');
        }
        grid = Ext.widget('previewproductDocUploadsGrid');//('previewproductDocUploadsGrid'applicationdocuploadsgrid);
       // store = grid.store;
        grid.height = Ext.Element.getViewportHeight() - 118;
       // grid.setController('productregistrationvctr');
        grid.down('hiddenfield[name=process_id]').setValue(process_id);
        grid.down('hiddenfield[name=section_id]').setValue(section_id);
        grid.down('hiddenfield[name=module_id]').setValue(module_id);
        grid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        grid.down('hiddenfield[name=application_code]').setValue(application_code);

        grid.down('combo[name=applicable_documents]').setValue(document_type_id);
        grid.down('hiddenfield[name=is_original_dossier]').setValue(btn.is_original_dossier);
        
        funcShowStatelessCustomizableWindow(winTitle , winWidth, grid, 'customizablewindow', btn);

    },
    showUploadEvaluationDocuments: function (btn) {
        var document_type_id = btn.document_type_id,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        grid = Ext.widget('productDocUploadsGrid');
        store = grid.store;
        grid.height = Ext.Element.getViewportHeight() - 118;
       // grid.setController('productregistrationvctr');
        funcShowCustomizableWindow(winTitle , winWidth, grid, 'customizablewindow');
        grid.down('hiddenfield[name=process_id]').setValue(process_id);
        grid.down('hiddenfield[name=module_id]').setValue(module_id);
        grid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        grid.down('hiddenfield[name=application_code]').setValue(application_code);

        grid.down('hiddenfield[name=section_id]').setValue(section_id);
        grid.down('combo[name=applicable_documents]').setValue(document_type_id);

    },
    
    funcPrevAuditReportUpload: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),

            application_code = record.get('application_code'),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();
            section_id = record.get('section_id');

        ref_no = record.get('reference_no');
        prodclass_category_id = record.get('prodclass_category_id');
        section_id = record.get('section_id');
        classification_id = record.get('classification_id');
        checklist_category_id = '';//for chekclist based 
        //get the evaluation grids options checklist or upload 
        if (section_id == 4 || prodclass_category_id == 2 && section_id == 5556) {
            grid = Ext.widget('productevaluationchecklistsGrid');
            checklist_category_id = 2;
            params = {application_code: application_code, checklist_category_id: checklist_category_id};
            
            var url = 'reports/generateProductAuditReport?application_code=' + application_code + '&sub_module_id=' + sub_module_id;
            print_report(url);
        }else {
            panel = Ext.widget('evaluationReportReviewPnl');
            grid = panel.down('previewproductDocUploadsGrid');
            store = grid.store;
            grid.height = Ext.Element.getViewportHeight() - 118;
            //grid.setController('productregistrationvctr');
            funcShowCustomizableWindow(ref_no, '85%', panel, 'customizablewindow');
            grid.down('hiddenfield[name=process_id]').setValue(record.get('process_id'));
            grid.down('hiddenfield[name=section_id]').setValue(record.get('section_id'));
            grid.down('hiddenfield[name=module_id]').setValue(record.get('module_id'));
            grid.down('hiddenfield[name=sub_module_id]').setValue(record.get('sub_module_id'));
            grid.down('hiddenfield[name=application_code]').setValue(record.get('application_code'));
            grid.down('combo[name=applicable_documents]').setValue(9);

        }
    },//previewproductApplicationQueries
    funcPrevEvaluationReportUpload: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),

            application_code = record.get('application_code'),
            application_id = record.get('application_id'),
            sub_module_id = record.get('sub_module_id');

        ref_no = record.get('reference_no');
        prodclass_category_id = record.get('prodclass_category_id');
        
        section_id = record.get('section_id');
        classification_id = record.get('classification_id');
        checklist_category_id = '';//for chekclist based 
        //get the evaluation grids options checklist or upload 
        if (section_id == 4 || prodclass_category_id == 2 && section_id == 5556) {
            grid = Ext.widget('productevaluationchecklistsGrid');
            checklist_category_id = 2;
            params = {application_code: application_code, checklist_category_id: checklist_category_id};//generateProductAuditReport
            var url = 'reports/generateProductEvaluationReport?application_code=' + application_code + '&sub_module_id=' + sub_module_id;
            print_report(url);

        } else {
            panel = Ext.widget('evaluationReportReviewPnl');
            grid = panel.down('previewproductDocUploadsGrid');
            store = grid.store;
            grid.height = Ext.Element.getViewportHeight() - 118;
           // grid.setController('productregistrationvctr');
            funcShowCustomizableWindow(ref_no, '85%', panel, 'customizablewindow');
            grid.down('hiddenfield[name=process_id]').setValue(record.get('process_id'));
            grid.down('hiddenfield[name=section_id]').setValue(record.get('section_id'));
            grid.down('hiddenfield[name=module_id]').setValue(record.get('module_id'));
            grid.down('hiddenfield[name=sub_module_id]').setValue(record.get('sub_module_id'));
            panel.down('hiddenfield[name=workflow_stage_id]').setValue(record.get('workflow_stage_id'));
            grid.down('hiddenfield[name=application_code]').setValue(record.get('application_code'));
            grid.down('combo[name=applicable_documents]').setValue(8);

        }

    },funcPanelEvaluationReportUpload: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            ref_no = activeTab.down('displayfield[name=reference_no]').getValue(),
            isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal;

        checklist_category_id = '';//for chekclist based 
        //get the evaluation grids options checklist or upload 
        if (section_id == 1 || section_id == 3 && section_id == 5556) {
            grid = Ext.widget('productevaluationchecklistsGrid');
            checklist_category_id = 2;
            params = {application_code: application_code, checklist_category_id: checklist_category_id};
            //print reports 
            //genertae evaluation reports
            var url = "evaluationreport";
            print_report(url)
        } else {
            grid = Ext.widget('previewproductDocUploadsGrid');
            store = grid.store;
            grid.height = Ext.Element.getViewportHeight() - 118;
          //  grid.setController('productregistrationvctr');
            funcShowCustomizableWindow(ref_no, '85%', grid, 'customizablewindow');
            grid.down('hiddenfield[name=process_id]').setValue(process_id);
            grid.down('hiddenfield[name=section_id]').setValue(section_id);
            grid.down('hiddenfield[name=module_id]').setValue(module_id);
            grid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            grid.down('hiddenfield[name=application_code]').setValue(application_code);
            grid.down('combo[name=applicable_documents]').setValue(8);

        }

    },
    showProductApplicationMoreDetails: function (btn) {
       
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(activeTab.down('#main_processpanel')){
                var productdetails_panel = activeTab.down('#main_processpanel').productdetails_panel;
            }else{
                var productdetails_panel = 'drugsProductsDetailsPanel';
            }
            
        var application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
            ref_no = activeTab.down('displayfield[name=reference_no]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();

        this.showProductApplicationMoreDetailsGeneric(application_code,productdetails_panel, application_id, product_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, is_temporal);
    },
    funcActiveProductsOtherInformationTab: function (tab) {

        var mainTabPnl = this.getMainTabPanel(),
            activeTab = mainTabPnl.getActiveTab(),
            product_id;
            console.log(activeTab);
        if(tab.down('hiddenfield[name=product_id]')){
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
            console.log(tab);
            // console.log(activeTab.down('hiddenfield[name=product_id]').getValue());
            if(activeTab.down('hiddenfield[name=product_id]')){
                activeTab.down('hiddenfield[name=product_id]').setValue(product_id);
            }
        }
        if (activeTab.down('hiddenfield[name=product_id]') && product_id == '') {
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
            console.log(product_id);
        }
        if (product_id == '' && !tab.up('window')) {
            tab.setActiveTab(0);
            toastr.error('Save Product details to proceed', 'Failure Response');
            return;
        }
    },
    showProductApplicationMoreDetailsGeneric: function (application_code,productdetails_panel,isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            ref_no = activeTab.down('displayfield[name=tracking_no]').getValue(),
            is_dataammendment_request =0;
        //when fired from a manager grid and the selection is different from what was loaded from intray
        //this helps product wizard grids to load with the correct application  code
        // if(application_code){
        //     activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
        // }
        var me = this,
            productdetails_panel = Ext.widget(productdetails_panel);

        // productdetails_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        productdetails_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'productregistration/getProductApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    applicantDetails = resp.applicant_details,
                    product_details = resp.product_details,
                    prodclass_category_id = product_details.prodclass_category_id,
                    branch_id = resp.branch_id;
                if (success == true || success === true) {
                    productdetails_panel.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);
                    products_form = productdetails_panel.down('form');
                    funcShowCustomizableWindow(ref_no, '85%', productdetails_panel, 'customizablewindow');
                    if (product_details) {
                        var model2 = Ext.create('Ext.data.Model', product_details);
                        products_form.loadRecord(model2);
                        productdetails_panel.getViewModel().set('model', model2);
                    }
                    
                    if (isReadOnly == 1) {

                        productdetails_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        productdetails_panel.getViewModel().set('isReadOnly', false);

                    }

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
    prepareProductManagerMeeting: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('#application_list');
        this.prepareProductMeetingDetailsGeneric(activeTab, applicationsGrid, 0);
    },

    prepareProductRecommReview: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('productReviewTCMeetingGrid');
        this.prepareProductMeetingDetailsGeneric(activeTab, applicationsGrid, 1);
    },

    prepareProductApprovals: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('productApprovalTCMeetingGrid');
        this.prepareProductMeetingDetailsGeneric(activeTab, applicationsGrid, 1);

    },
    prepareProductCertificateRelease: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('productcertificatereleasegrid');
        this.prepareProductMeetingDetailsGeneric(activeTab, applicationsGrid, 1);

    },

    prepareRenProductApprovals: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('renewalproductapprovalgrid');
        this.prepareProductMeetingDetailsGeneric(activeTab, applicationsGrid, 1);

    },
    prepareNewProductCommunication: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('productcommunicationsgrid');
        this.prepareProductMeetingDetailsGeneric(activeTab, applicationsGrid, 1);
    },

    prepareProductMeetingDetailsGeneric: function (activeTab, applicationsGrid, isReadOnly) {
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
                url: 'productregistration/prepareProductsRegMeetingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    workflow_stage_id: workflow_stage_id,
                    table_name: 'tra_product_applications'
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
    //save meeting details 
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
                url: 'productregistration/saveTCMeetingDetails',
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
    redoTcMeetingParticipantsGrid: function (grid) {
        var isReadOnly = grid.down('hiddenfield[name=isReadOnly]').getValue(),
            add_btn = grid.down('button[name=add_participant]'),
            widgetCol = grid.columns[grid.columns.length - 1];
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            add_btn.setVisible(false);
            widgetCol.setHidden(true);
            widgetCol.widget.menu.items = [];
        } else {
            add_btn.setVisible(true);
            widgetCol.setHidden(false);
            widgetCol.widget.menu.items = [
                {
                    text: 'Delete',
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Record',
                    table_name: 'tc_meeting_participants',
                    storeID: 'productTcMeetingParticipantsStr',
                    action_url: 'productregistration/onDeleteProductOtherDetails',
                    action: 'actual_delete',
                    handler: 'doDeleteProductRegWidgetParam',
                    
                }
            ];
        }
    },
    managerMeetingRefreshGrid: function (me) {
        var store = me.store,
            table_name = me.table_name,
            strict_mode = me.strict_mode,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            meeting_id = activeTab.down('form').down('hiddenfield[name=id]').getValue();
        store.getProxy().extraParams = {
            table_name: table_name,
            workflow_stage_id: workflow_stage_id,
            meeting_id: meeting_id,
            strict_mode: strict_mode
        };
    },
    alterationproductapprovalRefreshgrid: function (me) {
        var store = me.store,
            table_name = me.table_name,
            strict_mode = me.strict_mode,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        store.getProxy().extraParams = {
            table_name: table_name,
            workflow_stage_id: workflow_stage_id,
            strict_mode: strict_mode
        };
    },
    beforeManagerMeetingAppsGridDeselect: function (sel, record, index, eOpts) {
        var grid = sel.view.grid,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code1 = record.get('application_code'),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        if (application_code1 == application_code) {
            /* toastr.warning('Action not allowed on this application!!', 'Warning Response');
             return false;*/
        }
    },
    addTcMeetingParticipants: function (btn) {
        var grid = btn.up('grid'),
            win = grid.up('window'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form'),
            meeting_id = form.down('hiddenfield[name=id]').getValue(),
            store = Ext.getStore('productTcMeetingParticipantsStr'),
            sm = grid.getSelectionModel(),
            selected_records = sm.getSelection(),
            selected = [],
            mask = new Ext.LoadMask(
                {
                    target: grid,
                    msg: 'Please wait...'
                }
            );
        if (!meeting_id) {
            toastr.warning('Please save meeting details first!!', 'Warning Response');
            return false;
        }
        Ext.each(selected_records, function (item) {
            var user_id = item.data.id,
                name = item.data.fullnames,
                phone = item.data.phone,
                email = item.data.email,
                obj = {
                    user_id: user_id,
                    participant_name: name,
                    phone: phone,
                    email: email
                };
            selected.push(obj);
            //selected.push(item.data.id);
        });
        mask.show();
        Ext.Ajax.request({
            url: 'productregistration/syncTcMeetingParticipants',
            params: {
                selected: JSON.stringify(selected),
                meeting_id: meeting_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                mask.hide();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success || success == true || success === true) {
                    toastr.success(message, 'Success Response!!');
                    store.load();
                    win.close();
                } else {
                    toastr.error(message, 'Failure Response!!');
                }
            },
            failure: function (response) {
                mask.hide();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                mask.hide();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showApplicationVariationRequests: function (btn) {

       var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        var childObject = Ext.widget('productsvariationrequestsgrid');
            childObject.down('hiddenfield[name=application_id]').setValue(application_id);
            childObject.down('hiddenfield[name=application_code]').setValue(application_code);
            childObject.height =Ext.Element.getViewportHeight() - 118;
            funcShowCustomizableWindow(' Variation Request', '70%', childObject, 'customizablewindow');


    },
    add_application_details_tag:function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            container = btn.up().down('displayfield[name=application_details]');
        Ext.Ajax.request({
            method: 'GET',
            url: 'productregistration/getProductApplicationDetailsTag',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    results = resp.results;
                if (success == true || success === true) {
                    if (!results) {
                        return false;
                    }
                    container.setValue(results);
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
    showApplicationMoreDetails: function (btn) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue(),
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
            ref_no = activeTab.down('displayfield[name=reference_no]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            child = 'drugsProductsDetailsPnl';

        if(sub_module_id == 9){
             child = 'altdrugsProductsDetailsPnl';
        }else if(sub_module_id == 75){
             child = 'exemptionVetProductsDetailsPnl';
        }

        this.showProductApplicationMoreDetailsGeneric(application_code,child,isReadOnly);
    },
    applicationProductMoreDetailsGeneric: function (application_id, premise_id, applicant_id, ref_no, process_id, workflow_stage_id, module_id, sub_module_id, section_id, isReadOnly, is_temporal) {
        
        Ext.getBody().mask('Please wait...');
        
        var me = this,
            wizardPnl = Ext.widget('premiseappmoredetailswizard'),
            applicantFrm = wizardPnl.down('applicantdetailsfrm'),
            premiseFrm = wizardPnl.down('premisedetailsfrm'),
            premiseDetailsTabPnl = wizardPnl.down('premisedetailswintabpnl'), //premisedetailstabpnl
            personnelDetailsGrid = wizardPnl.down('premisepersonneldetailsgrid'),
            otherDetailsGrid = wizardPnl.down('premiseotherdetailsgrid');
        applicantFrm.setHeight(400);
        premiseDetailsTabPnl.setHeight(400);
        applicantFrm.down('button[action=link_applicant]').setDisabled(true);
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
        wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        wizardPnl.down('hiddenfield[name=application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
        }
        personnelDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        otherDetailsGrid.down('hiddenfield[name=is_temporal]').setValue(is_temporal);
        personnelDetailsGrid.down('hiddenfield[name=is_temporal]').setValue(is_temporal);
        premiseFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        Ext.Ajax.request({
            method: 'GET',
            url: 'premiseregistration/getPremApplicationMoreDetails',
            params: {
                application_id: application_id,
                premise_id: premise_id,
                applicant_id: applicant_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    applicantDetails = resp.applicant_details,
                    premiseDetails = resp.premise_details;
                if (success == true || success === true) {
                    var model1 = Ext.create('Ext.data.Model', applicantDetails),
                        model2 = Ext.create('Ext.data.Model', premiseDetails);
                    applicantFrm.loadRecord(model1);
                    premiseFrm.loadRecord(model2);
                    funcShowCustomizableWindow(ref_no, '85%', wizardPnl, 'customizablewindow');
                    if (sub_module_id == 2 || sub_module_id === 2) {
                        if (isReadOnly < 1) {
                            premiseFrm.getForm().getFields().each(function (field) {
                                field.setReadOnly(true);
                            });
                            personnelDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
                            otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
                            me.fireEvent('formAuth', process_id, 1, premiseFrm);
                            me.fireEvent('otherPartsAuth', process_id, wizardPnl);
                        }
                    }
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

    funcSelectgmpInspectionDetailsGrid: function (grid, record) {
        
        var me = this,
            win = grid.up('window'),
            manufacturing_site_id = record.get('manufacturing_site_id');
            producmanufacturer_form = me.getProductgmpinspectiondetailsFrm(),
            gmp_productlineStr = producmanufacturer_form.down('combo[name=gmp_productline_id]').getStore();

            gmp_productlineStr.removeAll()
            gmp_productlineStr.load({params:{manufacturing_site_id:manufacturing_site_id}});

            producmanufacturer_form.loadRecord(record);

            win.close();
    },
    funcManufacturerSelection: function (grid, record) {
        var me = this,
            is_apimanufacturer = grid.is_apimanufacturer,
            win = grid.up('window'),
            form = me.getProductManuctureringFrm();
                win.close();
               
            delete record.data.id;
             // console.log(record);
                form.loadRecord(record);

    },

    funcAPIManufacturerSelection: function (grid, record) {
        var me = this,
            is_apimanufacturer = grid.is_apimanufacturer,
            form = me.getProductApiManuctureringFrm();

        win = grid.up('window');
       
        delete record.data.id;
         // console.log(record);
        win.close();
        form.loadRecord(record);
    },
    onSaveManufacturerDetails: function (btn) {
        var me = this,
            producmanufacturer_form = this.getProductManuctureringFrm();
        this.funcSaveproductManufacturedetails(btn, producmanufacturer_form, me);
    },
    onSaveManufacturerSiteDetails: function (btn) {
        var me = this,
            producmanufacturer_form = me.getProductManuctureringFrm();
        this.funcSaveproductManufacturedetails(btn, producmanufacturer_form, me);
    },
    
    onSaveAPIManufacturerDetails: function (btn) {
        var me = this,
            producmanufacturer_form = me.getProductApiManuctureringFrm();
        this.funcSaveproductManufacturedetails(btn, producmanufacturer_form, me);
    },

    funcSaveproductManufacturedetails: function (btn, producmanufacturer_form, me) {
        var url = btn.action_url,
            table = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            is_apimanufacturer = btn.is_apimanufacturer,
            is_manufacturingsite = btn.is_manufacturingsite,
            store = Ext.getStore(storeID),
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {model: table},
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
                        store.load();
                        if (producmanufacturer_form) {
                            if(is_manufacturingsite == 1){
                                producmanufacturer_form.down('textfield[name=manufacturing_site]').setValue(response.manufacturer_name);
                                producmanufacturer_form.down('hiddenfield[name=man_site_id]').setValue(response.manufacturer_id);
                                producmanufacturer_form.down('textfield[name=physical_address]').setValue(response.physical_address);

                            }
                            else{
                                
                                producmanufacturer_form.down('textfield[name=manufacturer_name]').setValue(response.manufacturer_name);
                                producmanufacturer_form.down('hiddenfield[name=manufacturer_id]').setValue(response.manufacturer_id);
                                producmanufacturer_form.down('textfield[name=physical_address]').setValue(response.physical_address);
                            }
                        }
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
    showPaymentReceptionForm: function (btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            title = btn.winTitle,
            width = btn.winWidth,
            childXtype = btn.childXtype,
            table_name = btn.table_name,
            child = Ext.widget(childXtype),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        Ext.Ajax.request({
            method: 'GET',
            url: 'premiseregistration/getApplicationApplicantDetails',
            params: {
                application_id: application_id,
                table_name: table_name
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    results = resp.results;
                if (success == true || success === true) {
                    if (!results) {
                        toastr.warning('Problem getting applicant details!!', 'Warning Response');
                        return false;
                    }
                    var model = Ext.create('Ext.data.Model', results);
                    child.loadRecord(model);
                    child.down('textfield[name=drawer]').setValue(results.applicant_name);
                    funcShowCustomizableWindow(title, width, child, 'customizablewindow');
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
    prepareNewProductPayments: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            //invoice_id = activeTab.down('hiddenfield[name=invoice_id]'),
            //invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            running_balance = activeTab.down('displayfield[name=running_balance]'),
            invoiceSummaryGrid = activeTab.down('paymentinvoicingcostdetailsgrid'),
            invoiceSummaryStore = invoiceSummaryGrid.getStore(),
            // paymentsGrid = activeTab.down('applicationpaymentsgrid'),
            // paymentsStore = paymentsGrid.getStore(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            product_details = otherDetailsFrm.down('displayfield[name=product_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        
        activeTab.down('button[name=receive_payments]').setVisible(true);
        activeTab.down('button[name=process_submission_btn]').setVisible(true);
        
        if (application_id) {
            // paymentsStore.removeAll();
            // paymentsStore.load({
            //     params: {
            //         application_id: application_id,
            //         application_code: application_code
            //     }
            // });
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareNewProductPaymentStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_product_applications'
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
                        activeTab.down('hiddenfield[name=product_id]').setValue(results.product_id);
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
                        //invoice_id.setValue(results.invoice_id);
                        //invoice_no.setValue(results.invoice_no);
                        applicant_details.setValue(results.applicant_details);

                        product_details.setValue(results.product_details);

                        running_balance.setValue(balance + txt);
                        invoiceSummaryStore.removeAll();
                        invoiceSummaryStore.load({
                            params: {
                                invoice_id: results.invoice_id
                            }
                        });

                        if (module_id == 1 || module_id === 1) {
                            product_details.setVisible(true);
                            product_details.setValue(results.product_details);
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
    saveNewProductsInvoicingDetails: function (btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoicingDetailsGrid = activeTab.down('invoicingcostdetailsgrid'),
            invoicingDetailsStore = invoicingDetailsGrid.getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            invoice_id_field = activeTab.down('hiddenfield[name=invoice_id]'),
            invoice_no_field = activeTab.down('displayfield[name=invoice_no]'),
            invoice_id = invoice_id_field.getValue(),
            storeData = invoicingDetailsStore.getData().items,
            details = [];
        if (!application_id) {
            toastr.warning('Problem encountered, application id not set!!', 'Warning Response');
            Ext.getBody().unmask();
            return false;
        }
        if (invoicingDetailsStore.data.length < 1) {
            toastr.warning('No Cost Elements Selected For Invoicing!!', 'Warning Response');
            Ext.getBody().unmask();
            return false;
        }
        Ext.each(storeData, function (item) {
            var element_costs_id = item.data.element_costs_id,
                cost = item.data.cost,
                currency_id = item.data.currency_id,
                exchange_rate = item.data.exchange_rate,
                obj = {
                    element_costs_id: element_costs_id,
                    cost: cost,
                    currency_id: currency_id,
                    exchange_rate: exchange_rate
                };
            details.push(obj);
        });
        Ext.Ajax.request({
            url: 'productregistration/saveApplicationInvoicingDetails',
            jsonData: details,
            params: {
                application_id: application_id,
                application_code: application_code,
                invoice_id: invoice_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    invoice_id_field.setValue(resp.invoice_id);
                    invoice_no_field.setValue(resp.invoice_no);
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
    
    refreshProductRegistrationsMainGrids: function (me) {

        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = (grid.down('combo[name=sub_module_id]')) ? grid.down('combo[name=sub_module_id]').getValue() : null,
            workflow_stage_id = (grid.down('combo[name=workflow_stage_id]')) ? grid.down('combo[name=workflow_stage_id]').getValue() : null;

            store.getProxy().extraParams = {
                module_id: module_id,
                sub_module_id: sub_module_id,
                section_id: section_id,
                workflow_stage_id: workflow_stage_id
            };

    },
    //funcActiveProductsOtherInformationTab
    refreshProductsOtherDetailsGrid: function (me) {
        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            product_id, application_code;
            console.log(activeTab);
        //check if has been set or use window 
        //for product wizard
        if(module_id == 1){
             if(sub_module_id == 75){
                if (activeTab.down('hiddenfield[name=product_id]')) {
                    product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
                    console.log(product_id);
                    application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
                } else {
                    var panel = me.up('window');
                    if(panel.down('hiddenfield[name=product_id]').getValue()){
                        product_id = panel.down('hiddenfield[name=product_id]').getValue();
                       
                    }
                }
                if(me.table_name != ''){
                    store.getProxy().extraParams = {
                        product_id: product_id,
                        table_name: me.table_name,
                        application_code: application_code
                    };
                } else{
                        store.getProxy().extraParams = {
                        product_id: product_id,
                        application_code: application_code
                }    
                }
             }
             else{
                if (activeTab.down('hiddenfield[name=product_id]')) {
                    product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
                    application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
                    console.log(product_id);
                }
                if(!product_id) {
                    var panel = me.up('window');
                    console.log(panel);
                    if(panel.down('hiddenfield[name=product_id]')){
                        if(panel.down('hiddenfield[name=product_id]').getValue()){
                            product_id = panel.down('hiddenfield[name=product_id]').getValue();
                        }
                    }
                }
                if(me.table_name != ''){
                    store.getProxy().extraParams = {
                        product_id: product_id,
                        table_name: me.table_name,
                        application_code: application_code
                    };
                }else{
                    store.getProxy().extraParams = {
                        product_id: product_id,
                        application_code: application_code
                    };
                }
             }
         
        }
        else if(module_id == 2){
            console.log(me);
            //PSUR/PBRER REPORTS
        } else if(module_id == 25){
            if (activeTab.down('hiddenfield[name=product_id]')) {
                product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
            } else {
                var panel = me.up('window');
                if(panel.down('hiddenfield[name=product_id]').getValue()){
                    product_id = panel.down('hiddenfield[name=product_id]').getValue();
                }
            }
                store.getProxy().extraParams = {
                    product_id: product_id,
                
            }
        }else{ 
            console.log('failed across checks');
        }
        
    },

    refreshproductevaluationcommentsgrid: function (me) {

        var store = me.store,
            grid = me.up('grid'),
            document_type_id = grid.document_type_id,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        store.getProxy().extraParams = {
            application_code: application_code
        };
    },
    onInvoiceFeeTypeChange: function (cmbo, newVal) {
        var mainTabPanel = this.getMainTabPanel(),
            grid = cmbo.up('grid'),
            costCategoriesStore = grid.down('combo[name=cost_category_id]').getStore(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            filter = {
                section_id: section_id,
                fee_type_id: newVal
            };
        filter = JSON.stringify(filter);
        costCategoriesStore.removeAll();
        costCategoriesStore.load({params: {filter: filter}});
        //costCategoriesStore.load({params: {section_id: section_id, fee_type_id: newVal}});
    },
    saveDrugProductInvoicingDetails: function (btn) {
        Ext.getBody().mask('Please wait...');
        var panel = btn.up('drugnewinvoicingpnl'),
            me = this,
            containerPnl = panel.up('newdrugproductinvoicing'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoicingDetailsGrid = activeTab.down('invoicingcostdetailsgrid'),
            invoicingDetailsStore = invoicingDetailsGrid.getStore(),
            application_id = containerPnl.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = containerPnl.down('hiddenfield[name=active_application_code]').getValue(),
            invoice_id_field = containerPnl.down('hiddenfield[name=invoice_id]'),
            invoice_no_field = panel.down('displayfield[name=invoice_no]'),
            invoice_id = invoice_id_field.getValue(),
            storeData = invoicingDetailsStore.getData().items,
            details = [];
        if (!application_id) {
            toastr.warning('Problem encountered, application id not set!!', 'Warning Response');
            Ext.getBody().unmask();
            return false;
        }
        if (invoicingDetailsStore.data.length < 1) {
            toastr.warning('No Cost Elements Selected For Invoicing!!', 'Warning Response');
            Ext.getBody().unmask();
            return false;
        }
        Ext.each(storeData, function (item) {
            var element_costs_id = item.data.element_costs_id,
                cost = item.data.cost,
                currency_id = item.data.currency_id,
                exchange_rate = item.data.exchange_rate,
                obj = {
                    element_costs_id: element_costs_id,
                    cost: cost,
                    currency_id: currency_id,
                    exchange_rate: exchange_rate
                };
            details.push(obj);
        });
        Ext.Ajax.request({
            url: 'productregistration/saveApplicationInvoicingDetails',
            jsonData: details,
            params: {
                application_id: application_id,
                application_code: application_code,
                invoice_id: invoice_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    invoice_id_field.setValue(resp.invoice_id);
                    invoice_no_field.setValue(resp.invoice_no);
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

    showProductRegWorkflow: function (sub_module_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#dashboardWrapper'),
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

    getWorkflowDetails: function (module_id, section_id, application_type, is_initial) {
        var results = [];
        Ext.Ajax.request({
            method: 'GET',
            async: false,
            url: 'workflow/getWorkflowDetails',
            params: {
                module_id: module_id,
                section_id: section_id,
                sub_module_id: application_type,
                is_initial: is_initial
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success;
                if (success || success == true || success === true) {
                    results = resp.results;
                }
            }
        });
        return results;
    },

    onNewProductRegApplication: function (sub_module_id,btn, section_id, prodclass_category_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#productRegDashWrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id, is_dataammendment_request, prodclass_category_id);

        if (!workflow_details || workflow_details.length === 0) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        dashboardWrapper.removeAll();
        var workflowContainer = Ext.widget(workflow_details.viewtype);
        workflowContainer.down('displayfield[name=process_name]').setValue(workflow_details.processName);
        workflowContainer.down('displayfield[name=workflow_stage]').setValue(workflow_details.initialStageName);
        workflowContainer.down('displayfield[name=application_status]').setValue(workflow_details.applicationStatus);
        workflowContainer.down('hiddenfield[name=process_id]').setValue(workflow_details.processId);
        workflowContainer.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_details.initialStageId);
        workflowContainer.down('hiddenfield[name=module_id]').setValue(module_id);
        workflowContainer.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        workflowContainer.down('hiddenfield[name=prodclass_category_id]').setValue(workflow_details.prodclass_category_id);
        workflowContainer.down('hiddenfield[name=section_id]').setValue(section_id);
        dashboardWrapper.add(workflowContainer);
        //reload Stores 
        //console.log(section_id);
        var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
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
        //hide unecessary tabs for MD
        if(sub_module_id==79){
        }else{
            if(section_id == 4){
                if(workflowContainer.down('drugsIngredientsGrid')){
                    workflowContainer.down('drugsIngredientsGrid').destroy();
                }
                if(workflowContainer.down('productApiManuctureringGrid')){
                    workflowContainer.down('productApiManuctureringGrid').destroy();
                }
                if(workflowContainer.down('drugsProductPackagingGrid')){
                    workflowContainer.down('drugsProductPackagingGrid').destroy();
                }
            }
        }
       
        //load the stores

    },
     showEvaProductRegistration: function (sub_module_id,btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#productRegDashWrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(1, 2, sub_module_id);

        if (!workflow_details || workflow_details.length === 0) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        dashboardWrapper.removeAll();
        var workflowContainer = Ext.widget(workflow_details.viewtype);
        workflowContainer.down('displayfield[name=process_name]').setValue(workflow_details.processName);
        workflowContainer.down('displayfield[name=workflow_stage]').setValue(workflow_details.initialStageName);
        workflowContainer.down('displayfield[name=application_status]').setValue(workflow_details.applicationStatus);
        workflowContainer.down('hiddenfield[name=process_id]').setValue(workflow_details.processId);
        workflowContainer.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_details.initialStageId);
        workflowContainer.down('hiddenfield[name=module_id]').setValue(module_id);
        workflowContainer.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        workflowContainer.down('hiddenfield[name=prodclass_category_id]').setValue(workflow_details.prodclass_category_id);
        workflowContainer.down('hiddenfield[name=section_id]').setValue(section_id);
        dashboardWrapper.add(workflowContainer);
        //reload Stores 
        //console.log(section_id);
        var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
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
    onEditDrugProductRegApplication: function (view, record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            grid = view.grid,
            process_id = record.get('process_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            sub_module_id = grid.sub_module_id,
            module_id = record.get('module_id'),
            section_id = record.get('section_id'),
            workflow_stage = record.get('workflow_stage'),
            view_id = record.get('view_id'),
            ref_no = record.get('tracking_no'),
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id); //getAllWorkflowDetails(process_id, workflow_stage_id);
        if (!workflow_details) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        var tab = mainTabPanel.getComponent(view_id);
        if (!tab) {
            var newTab = Ext.widget(workflow_details.viewtype, {
                title: 'Product Registration',
                closable: true
            });
            record.set('sub_module_id', sub_module_id);
            record.set('process_id', workflow_details.processId);
            record.set('workflow_stage_id', workflow_details.initialStageId);
            record.set('workflow_stage', workflow_details.initialStageName);
            record.set('application_status', workflow_details.initialAppStatus);
            record.set('process_name', workflow_details.processName);
            // console.log(record);
            me.prepareApplicationBaseDetails(newTab, record);
            mainTabPanel.add(newTab);
            var lastTab = mainTabPanel.items.length - 1;
            mainTabPanel.setActiveTab(lastTab);
        } else {
            mainTabPanel.setActiveTab(tab);
        }
        //close pop up if there
        grid = Ext.ComponentQuery.query("#productApprovedApplicationListGrid")[0];
        if(grid){
            grid.up('window').close();
        }
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    onRenProductRegApplication: function (view, record) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            grid = view.grid,
            process_id = record.get('process_id'),
            workflow_stage_id = record.get('workflow_stage_id'),
            sub_module_id = grid.sub_module_id,
            module_id = record.get('module_id'),
            section_id = record.get('section_id'),
            workflow_stage = record.get('workflow_stage'),
            prodclass_category_id = record.get('prodclass_category_id'),
            ref_no = record.get('tracking_no'),
             view_id = record.get('view_id'),
            title = 'Product Renewal',
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id, null, prodclass_category_id); //getAllWorkflowDetails(process_id, workflow_stage_id);
        if (!workflow_details) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        var tab = mainTabPanel.getComponent(view_id);
        if(sub_module_id == 9){
            title = "Product Alteration/Variation";
        }else if(sub_module_id == 17){
            title = 'Product Withdrawal';
        }else if(sub_module_id == 70){
            title = 'Product Registration';
        }
        if (!tab) {
            var newTab = Ext.widget(workflow_details.viewtype, {
                title: title,
                closable: true
            });
            record.set('sub_module_id', sub_module_id);
            record.set('process_id', workflow_details.processId);
            record.set('workflow_stage_id', workflow_details.initialStageId);
            record.set('workflow_stage', workflow_details.initialStageName);
            record.set('application_status', workflow_details.initialAppStatus);
            record.set('process_name', workflow_details.processName);
        //set prerequisites
        me.prepareRenApplicationBaseDetails(newTab, record);
        if(sub_module_id == 8 || sub_module_id == 9 || sub_module_id == 70){
            newTab.getViewModel().set('isReadOnly', true);
        }
         if(sub_module_id == 17){
            newTab.getViewModel().set('isReadOnly', false);
        }
        if(sub_module_id != 70){
            newTab.down('button[name=save_btn]').action_url = 'saveRenAltProductReceivingBaseDetails';
        }
        if(record.get('section_id') == 4 && record.get('module_id') == 1 && record.get('sub_module_id') != 75){
            if(newTab.down('drugsIngredientsGrid')){
                newTab.down('drugsIngredientsGrid').destroy();
            }
            if(newTab.down('productApiManuctureringGrid')){
                newTab.down('productApiManuctureringGrid').destroy();
            }
            if(newTab.down('productGmpInspectionDetailsGrid')){
                newTab.down('productGmpInspectionDetailsGrid').setTitle('GMP/QMS Inspection Details');
            }
            if(newTab.down('inspectioninothercountriesGrid')){
                newTab.down('inspectioninothercountriesGrid').setTitle('GMP/QMS Inspection In Other Countries');
            }
            if(newTab.down('drugsProductPackagingGrid')){
                newTab.down('drugsProductPackagingGrid').destroy();
            }
        }
        //load form
            mainTabPanel.add(newTab);
            var lastTab = mainTabPanel.items.length - 1;
            mainTabPanel.setActiveTab(lastTab);
        } else {
            mainTabPanel.setActiveTab(tab);
        }

        //loading prefilled form
        me.onRegisteredProductsgridDblClick(newTab, record);

        //close pop up if there
        grid = Ext.ComponentQuery.query("#productApprovedApplicationListGrid")[0];
        if(grid){
            grid.up('window').close();
        }
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    prepareApplicationBaseDetails: function (tab, record) {
        var me = this,
            application_id = record.get('active_application_id'),
            application_code = record.get('active_application_code'),
            process_name = record.get('process_name'),
            workflow_stage = record.get('workflow_stage'),
            application_status = record.get('application_status'),
            reference_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            workflow_stage_id = record.get('workflow_stage_id');
        tab.down('hiddenfield[name=active_application_id]').setValue(application_id);
 
        var application_code_field = tab.down('hiddenfield[name=active_application_code]');
        if (application_code_field) {
            application_code_field.setValue(application_code);
        }
        if(tab.down('hiddenfield[name=prodclass_category_id]')){
             tab.down('hiddenfield[name=prodclass_category_id]').setValue(record.get('prodclass_category_id'));
        }

        tab.down('hiddenfield[name=process_id]').setValue(process_id);
        tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        tab.down('hiddenfield[name=module_id]').setValue(module_id);
        tab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        tab.down('hiddenfield[name=section_id]').setValue(section_id);
        tab.down('displayfield[name=process_name]').setValue(process_name);
        tab.down('displayfield[name=workflow_stage]').setValue(workflow_stage);
        tab.down('displayfield[name=application_status]').setValue(application_status);
        tab.down('displayfield[name=reference_no]').setValue(reference_no);
    },
    prepareRenApplicationBaseDetails: function (tab, record) {
        var me = this,
            process_name = record.get('process_name'),
            workflow_stage = record.get('workflow_stage'),
            application_status = record.get('application_status'),
            reference_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            workflow_stage_id = record.get('workflow_stage_id');
        if(tab.down('hiddenfield[name=prodclass_category_id]')){
             tab.down('hiddenfield[name=prodclass_category_id]').setValue(record.get('prodclass_category_id'));
        }
        tab.down('hiddenfield[name=process_id]').setValue(process_id);
        tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        tab.down('hiddenfield[name=module_id]').setValue(module_id);
        tab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        tab.down('hiddenfield[name=section_id]').setValue(section_id);
        tab.down('displayfield[name=process_name]').setValue(process_name);
        tab.down('displayfield[name=workflow_stage]').setValue(workflow_stage);
        tab.down('displayfield[name=application_status]').setValue(application_status);
        tab.down('displayfield[name=reference_no]').setValue(reference_no);
    },

    prepareNewProductReceiving: function (me) {
        // this.updateVisibilityAccess(me);
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            products_detailsfrm = activeTab.down('#productsDetailsFrm'),
            product_panel = activeTab.down('#product_detailspanel'),
            // app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore(),
            prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]'),
            assessment_procedure = activeTab.down('combo[name=assessment_procedure_id]'),
            assessmentprocedure_type = activeTab.down('combo[name=assessmentprocedure_type_id]'),
            filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            if(activeTab.down('exemptionDrugProductsDetailsPnl')){
                var tab=Ext.widget('exemptionDrugProductsDetailsPnl');
  
              }
              else {

              }
        // app_check_types_store.removeAll();
        // app_check_types_store.load({
        //     params: {
        //         process_id: process_id,
        //         workflow_stage: workflow_stage_id
        //     }
        // });
       
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        

        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareNewProductReceivingStage',
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
                        ltrResults = resp.ltrDetails,
                        branch_id = results.branch_id,
                        product_id = results.product_id,
                        model = Ext.create('Ext.data.Model', results);
                    ltr_model = Ext.create('Ext.data.Model', ltrResults);

                    if (success == true || success === true) {

                        applicantFrm.loadRecord(model);
                        localagentFrm.loadRecord(ltr_model);
                        if(products_detailsfrm){
                            products_detailsfrm.loadRecord(model);
                        }
                        else{

                        }
                        // zone_cbo.setReadOnly(true);
                        //set invoice id
                        activeTab.down('hiddenfield[name=invoice_id]').setValue(results.invoice_id);
                        activeTab.down('hiddenfield[name=product_id]').setValue(results.product_id);
                        tab.down('hiddenfield[name=product_id]').setValue(results.product_id);
                        zone_cbo.setValue(branch_id);
                        if(section_id ==2){

                            assessment_procedure.setValue(results.assessment_procedure_id);
                            assessmentprocedure_type.setValue(results.assessmentprocedure_type_id);
                        }
                        //trigger model
                        // if(sub_module_id == 8){
                        //     console.log(sub_module_id);
                        //     product_panel.getViewModel().set('isReadOnly', true);
                        //     console.log(product_panel.getViewModel().set('isReadOnly'));
                        // }

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
    prepareNewExemptionProductReceiving: function (me) {
        // this.updateVisibilityAccess(me);
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
            if(prodclass_category_id ==50){
                applicantFrm = activeTab.down('productapplicantdetailsfrm');
            }
            else{
                applicantFrm = activeTab.down('exmpProductsDetailsFrm');
            }
            
            //localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            products_detailsfrm = activeTab.down('#productsDetailsFrm'),
            product_panel = activeTab.down('#product_detailspanel'),
            // app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore(),
            prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]'),
            assessment_procedure = activeTab.down('combo[name=assessment_procedure_id]'),
            assessmentprocedure_type = activeTab.down('combo[name=assessmentprocedure_type_id]'),
            filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            if(activeTab.down('exemptionVetWSProductsDetailsPnl')){
              var tab=Ext.widget('exemptionVetWSProductsDetailsPnl');

            }
            else if(activeTab.down('exemptionDrugProductsDetailsPnl')){
                var tab=Ext.widget('exemptionDrugProductsDetailsPnl');
            }
            else{

            }
        // app_check_types_store.removeAll();
        // app_check_types_store.load({
        //     params: {
        //         process_id: process_id,
        //         workflow_stage: workflow_stage_id
        //     }
        // });
       
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        

        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareNewProductReceivingStage',
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
                        ltrResults = resp.ltrDetails,
                        branch_id = results.branch_id,
                        product_id = results.product_id,
                        model = Ext.create('Ext.data.Model', results);
                    ltr_model = Ext.create('Ext.data.Model', ltrResults);

                    if (success == true || success === true) {

                        applicantFrm.loadRecord(model);
                        //localagentFrm.loadRecord(ltr_model);
                        // products_detailsfrm.loadRecord(model);
                        // zone_cbo.setReadOnly(true);
                        //set invoice id
                        activeTab.down('hiddenfield[name=invoice_id]').setValue(results.invoice_id);
                        tab.down('hiddenfield[name=product_id]').setValue(product_id);
                        activeTab.down('hiddenfield[name=product_id]').setValue(product_id);
                        zone_cbo.setValue(branch_id);
                        if(section_id ==2){

                            assessment_procedure.setValue(results.assessment_procedure_id);
                            assessmentprocedure_type.setValue(results.assessmentprocedure_type_id);
                        }
                        //trigger model
                        // if(sub_module_id == 8){
                        //     console.log(sub_module_id);
                        //     product_panel.getViewModel().set('isReadOnly', true);
                        //     console.log(product_panel.getViewModel().set('isReadOnly'));
                        // }

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
    //withdrawal
    prepareWithdrawalProductReceiving: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),

            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            products_detailsfrm = activeTab.down('searchdrugsProductsDetailsFrm'),
            //app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]'),
            assessment_procedure = activeTab.down('combo[name=assessment_procedure_id]'),
            filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
       
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        }); 
       
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareNewProductReceivingStage',
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
                        ltrResults = resp.ltrDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                    ltr_model = Ext.create('Ext.data.Model', ltrResults);

                    if (success == true || success === true) {

                        applicantFrm.loadRecord(model);
                        localagentFrm.loadRecord(ltr_model);
                        products_detailsfrm.loadRecord(model);
                      
                        zone_cbo.setValue(branch_id);
                        if(section_id ==2){

                            assessment_procedure.setValue(results.assessment_procedure_id);
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
    //applications 
    prepareOnlineProductReceiving: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl,
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),

         //   app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            products_detailsfrm = activeTab.down('#productsDetailsFrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            status_type_id = activeTab.down('hiddenfield[name=status_type_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            
            last_query_ref_id= activeTab.down('hiddenfield[name=last_query_ref_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]'),
            filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

            if(pnl.down('paymentspanel')){
                var payment_pnl = pnl.down('paymentspanel')
                payment_pnl.down('panel[name=other_details]').setVisible(false);
            }
            

        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        
        if(sub_module_id == 7 && sub_module_id == 8){
           var checklistTypesGrid = pnl.down('combo[name=applicable_checklist]'),
            checklistTypesStr = checklistTypesGrid.getStore();
            checklistTypesStr.removeAll();
            checklistTypesStr.load({params: {module_id: module_id, sub_module_id: sub_module_id, section_id: section_id}});
    
    
        }

         pnl.getViewModel().set('prechecking_querytitle', 'Product Application Documents Submission');

          if(status_type_id == 3){
            
            querieschecklistgrid =  activeTab.down('productapplicationqueriesgrid');

           // checklist_gridpanel.remove(productonlinescreeninggrid, true);
            //querieschecklistgrid.setVisible(true); prechecking_querytitle
            querieschecklistgrid.down('hiddenfield[name=application_code]').setValue(application_code);
            querieschecklistgrid.down('hiddenfield[name=last_query_ref_id]').setValue(last_query_ref_id);
          
           // activeTab.down('button[name=save_screening_btn]').setDisabled(true);
            pnl.getViewModel().set('isReadOnly', true);
            pnl.getViewModel().set('prechecking_querytitle', 'Application Query Response Details');
        }
        else{
            if(activeTab.down('productapplicationqueriesgrid')){
                activeTab.down('productapplicationqueriesgrid').hide();
            }
            
            if(activeTab.down('button[name=save_screening_btn]')){
                activeTab.down('button[name=save_screening_btn]').setDisabled(false);
            }
            pnl.getViewModel().set('prechecking_querytitle', 'Product Application Documents Submission');

        }
      
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareOnlineProductReceivingStage',
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
                        ltrResults = resp.ltrDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                    ltr_model = Ext.create('Ext.data.Model', ltrResults);

                    if (success == true || success === true) {

                        applicantFrm.loadRecord(model);
                        localagentFrm.loadRecord(ltr_model);
                        products_detailsfrm.loadRecord(model);
                        zone_cbo.setReadOnly(true);
                        zone_cbo.setValue(branch_id);
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
    prepareRenAltProductReceiving: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
        application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            // stores = '[]',
            // storeArray = eval(stores),
        app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            products_detailsfrm = activeTab.down('#productsDetailsFrm'),
           // app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]'),
        filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        is_populate_primaryappdata= 0;
        if(activeTab.down('hiddenfield[name=is_populate_primaryappdata]')){
            is_populate_primaryappdata= activeTab.down('hiddenfield[name=is_populate_primaryappdata]').getValue();
        }
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareNewProductReceivingStage',
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
                        ltrResults = resp.ltrDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                    ltr_model = Ext.create('Ext.data.Model', ltrResults);

                    if (success == true || success === true) {

                        applicantFrm.loadRecord(model);
                        localagentFrm.loadRecord(ltr_model);
                        products_detailsfrm.loadRecord(model);
                        // zone_cbo.setReadOnly(true);
                        zone_cbo.setValue(branch_id);
                        if(is_populate_primaryappdata ==1){
                            activeTab.down('hiddenfield[name=sub_module_id]').setValue(results.sub_module_id);
                        }
                        if(sub_module_id == 9){
                            
                            activeTab.down('productsvariationrequestsgrid').down('hiddenfield[name=application_code]').setValue(application_code);
                            activeTab.down('productsvariationrequestsgrid').down('hiddenfield[name=application_id]').setValue(application_id);
                        }
                        else if(sub_module_id == 17){
                            activeTab.down('productswithdrawalreasonsgrid').down('hiddenfield[name=application_code]').setValue(application_code);
                            activeTab.down('productswithdrawalreasonsgrid').down('hiddenfield[name=application_id]').setValue(application_id);
                        }
                        else if(sub_module_id == 20){
                            activeTab.down('productdataappealrequestsgrid').down('hiddenfield[name=application_code]').setValue(application_code);
                            activeTab.down('productdataappealrequestsgrid').down('hiddenfield[name=application_id]').setValue(application_id);
                            activeTab.down('productdataappealrequestsgrid').store.load();
                        }
                        
                        if(sub_module_id == 17){
                            activeTab.down('combo[name=withdrawal_type_id]').setValue(results.withdrawal_type_id);
                            
                        }else if(sub_module_id == 20){
                            activeTab.down('combo[name=appeal_type_id]').setValue(results.appeal_type_id);
                             
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
    prepareAmmendementProductReceiving: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
        application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            stores = '["dosageformstr", "assessmentprocedurestr", "classificationstr","commonnamesstr","siunitstr","distributionCategoryStr","storageconditionstr","routeofAdministrationStr","routeofAdministrationStr"]',
            storeArray = eval(stores),
             app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            products_detailsfrm = activeTab.down('#productsDetailsFrm'),
            product_panel= activeTab.down('#product_panel'),
           // app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            is_populate_primaryappdata= activeTab.down('hiddenfield[name=is_populate_primaryappdata]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            isReadOnly = activeTab.down('hiddenfield[name=isReadOnly]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]');
        filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareNewProductAmmendMentReceivingStage',
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
                        ltrResults = resp.ltrDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                    ltr_model = Ext.create('Ext.data.Model', ltrResults);

                    if (success == true || success === true) {

                        applicantFrm.loadRecord(model);
                        localagentFrm.loadRecord(ltr_model);
                        products_detailsfrm.loadRecord(model);
                        // zone_cbo.setReadOnly(true);
                        zone_cbo.setValue(branch_id);
                        if(is_populate_primaryappdata ==1){
                            activeTab.down('hiddenfield[name=sub_module_id]').setValue(results.sub_module_id);
                        }
                        if( activeTab.down('productdataammendmentrequestsgrid')){
                            activeTab.down('hiddenfield[name=appdata_ammendementrequest_id]').setValue(results.appdata_ammendementrequest_id);
                            activeTab.down('productdataammendmentrequestsgrid').down('hiddenfield[name=application_code]').setValue(application_code);
                            activeTab.down('productdataammendmentrequestsgrid').down('hiddenfield[name=application_id]').setValue(application_id);
                            activeTab.down('productdataammendmentrequestsgrid').down('hiddenfield[name=appdata_ammendementrequest_id]').setValue(results.appdata_ammendementrequest_id);
    
                            activeTab.down('productdataammendmentrequestsgrid').store.load();

                        }
                        //
                       // alert(isReadOnly)
                       if(isReadOnly == true){
                                 product_panel.getViewModel().set('isReadOnly', true);
                       }
                       else{
                        product_panel.getViewModel().set('isReadOnly', false);
                       }
                        
                        //set the readOnly to product details \
                        me.setApplicationDetailsAlterationSetup(application_code,results.appdata_ammendementrequest_id,product_panel);

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
    setApplicationDetailsAlterationSetup:function(application_code,appdata_ammendementrequest_id,productapp_panel){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            Ext.getBody().mask('Synchronising Data Ammendment Setup......');
        Ext.Ajax.request({
            method: 'GET',
            url: 'api/getApplicationDetailsAlterationSetup',
            params: {
                application_code: application_code,appdata_ammendementrequest_id:appdata_ammendementrequest_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success,
                    ammendementrequests = resp.ammendementrequests;

                if (success == true || success === true) {
                   
                    Ext.each(ammendementrequests, function (item) {
                        if(item.status_id == 3){
                                var panel_item_id = item.panel_item_id;
                                    product_panel = activeTab.down('#'+panel_item_id);
                                   // product_panel.setViewModel('productregistrationvm');

                                    product_panel.getViewModel().set('isReadOnly', false);
                              

                        }
                    });
                    
                } else {
                    toastr.error(message, 'Failure Response');
                }
               //productapp_panel.getViewModel().set('isReadOnly', true);
                Ext.getBody().unmask();
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


    },
    prepareNewProductSampleReceiving: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            stores = '["dosageformstr", "assessmentprocedurestr", "classificationstr","commonnamesstr","siunitstr","distributionCategoryStr","storageconditionstr","routeofAdministrationStr","routeofAdministrationStr"]',
            storeArray = eval(stores),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            product_panel = activeTab.down('#product_panel'),
            product_detailspanel = activeTab.down('#product_detailspanel'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),

            applicant_details = activeTab.down('displayfield[name=applicant_details]'),
            local_agentdetails = activeTab.down('displayfield[name=local_agentdetails]'),
            app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore(),
            filter = {section_id: section_id},
            sampleStore = Ext.getStore('productsSampledetailsStr'),
            zone_cbo = activeTab.down('combo[name=branch_id]'),
            assessment_procedure = activeTab.down('combo[name=assessment_procedure_id]'),
            assessmentprocedure_type_cbo = activeTab.down('combo[name=assessmentprocedure_type_id]'),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        // var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
        // app_doc_types_store.removeAll();
        // app_doc_types_store.load({
        //     params: {
        //         process_id: process_id,
        //         workflow_stage: workflow_stage_id
        //     }
        // });
        
        var app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore();
        app_check_types_store.removeAll();
        app_check_types_store.load({
            params: {
                process_id: process_id,
                active_application_code: application_code,
                workflow_stage: workflow_stage_id
            }
        });
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        if (application_id) {
            me.fireEvent('refreshStoresWithFilters', storeArray, filter);
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareNewProductReceivingStage',
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
                        ltrResults = resp.ltrDetails,
                        ltrResults = resp.ltrDetails,
                        product_id = results.product_id;
                        prodclass_category_id = results.prodclass_category_id;
                        model = Ext.create('Ext.data.Model', results);

                    if (success == true || success === true) {
                        
                        // if(prodclass_category_id == 2){
                            
                        //     product_detailspanel.removeAll();
                        //     product_detailspanel.add({xtype: 'antisepticproductsdetailsfrm'});
                            
                        // }

                        productsDetailsFrm = activeTab.down('#productsDetailsFrm'),
                        productsDetailsFrm.loadRecord(model);
                        applicant_details.setValue(results.applicant_name + ', ' + results.app_physical_address);
                        if (ltrResults) {
                            local_agentdetails.setValue(ltrResults.applicant_name + ', ' + ltrResults.app_physical_address);

                        }
                
                        //set tbar values
                        if(assessment_procedure){
                            assessment_procedure.setValue(results.assessment_procedure_id);
                        }
                        if(assessmentprocedure_type_cbo){
                            assessmentprocedure_type_cbo.setValue(results.assessmentprocedure_type_id);
                        }
                        if(zone_cbo){
                            zone_cbo.setValue(results.branch_id);
                            zone_cbo.setReadOnly(true);
                        }
                        //reload stores
                        sampleStore.removeAll();
                        sampleStore.load({
                            params: {
                                product_id: product_id
                            }
                        });
                    
                        product_detailspanel.getViewModel().set('isReadOnly', true);
   
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
    productRegHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down(btn.homeDashWrapper);
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
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
        
        if (grid.applicantType === 'nonlocal') {
            if(activeTab = 'productRegisterPnl'){
               var applicantForm = Ext.ComponentQuery.query('#productapplicantdetailsfrmId')[0];
               applicantForm.loadRecord(record);
            }
            else{
                var applicantForm = activeTab.down('productapplicantdetailsfrm');
                applicantForm.loadRecord(record);
            }
        } else if (grid.applicantType === 'importer'){
            var applicantForm = Ext.ComponentQuery.query('#'+grid.callerItemId)[0];
            record.set('importer_id', record.get('applicant_id'));
            applicantForm.loadRecord(record);
        }else if(grid.applicantType === 'vet_exemption'){
            var applicantForm = activeTab.down('drugsProductsDetailsFrm');
            applicantForm.loadRecord(record);
        }else {
            if(activeTab = 'productRegisterPnl'){
                var applicantForm = Ext.ComponentQuery.query('#productlocalapplicantdetailsfrmId')[0];
                 applicantForm.loadRecord(record);
             }
             else{
                applicantForm = activeTab.down('productlocalapplicantdetailsfrm');
                if (applicantForm != null) {
                    applicantForm.loadRecord(record);
                }
             }
           
        }

        Ext.Function.defer(function () {
            mask.hide();
            win.close();
        }, 200);
    },
    onExmpApplicantSelectionListDblClick: function (view, record, item, index, e, eOpts) {
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
        
        if (grid.applicantType === 'nonlocal') {
            var applicantForm = activeTab.down('exmpProductsDetailsFrm');
            applicantForm.loadRecord(record);
        } else if (grid.applicantType === 'importer'){
            var applicantForm = Ext.ComponentQuery.query('#'+grid.callerItemId)[0];
            record.set('importer_id', record.get('applicant_id'));
            applicantForm.loadRecord(record);
        }else {
            applicantForm = activeTab.down('productlocalapplicantdetailsfrm');
            if (applicantForm != null) {
                applicantForm.loadRecord(record);
            }
        }

        Ext.Function.defer(function () {
            mask.hide();
            win.close();
        }, 200);
    },
    refreshScreeningChecklistItemsGrid: function (me) {

        var store = me.getStore(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            checklist_type = activeTab.down('combo[name=applicable_checklist]').getValue();
        store.getProxy().extraParams = {
            application_code: application_code,
            checklist_type: checklist_type
        };
    },
    refreshRegisteredProductsgrid: function (me) {

        var store = me.getStore(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            status_id = activeTab.down('hiddenfield[name=status_id]').getValue();

                store.getProxy().extraParams = {
                    section_id: section_id,
                    status_id: status_id
                };

    },

    showReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            is_dataammendment_request =0,
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
            if(activeTab.down('hiddenfield[name=is_dataammendment_request]')){
                is_dataammendment_request = activeTab.down('hiddenfield[name=is_dataammendment_request]').getValue();
            }
            
                valid = this.validateNewProductReceivingSubmission();
       
        if (valid) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
          
        } else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
            return;
        }
    },
    showExmpReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            is_dataammendment_request =0,
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
            if(activeTab.down('hiddenfield[name=is_dataammendment_request]')){
                is_dataammendment_request = activeTab.down('hiddenfield[name=is_dataammendment_request]').getValue();
            }
            
                valid = this.validateNewExmpProductReceivingSubmission();
       
        if (valid) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
          
        } else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
            return;
        }
    },
    showSamplerecApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
        application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
        workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            storeID = getApplicationStore(module_id, section_id);
             var valid = this.validateproducsampleReceivingSubmission(),
                hasQueries = checkApplicationRaisedQueries(application_code, module_id);
             // valid = this.validateNewPremiseReceivingSubmission(btn),
              storeID = getApplicationStore(module_id, section_id);
              table_name = getApplicationTable(module_id);
              extraParams = [{
                  field_type: 'hiddenfield',
                  field_name: 'has_queries',
                  value: hasQueries
              }];
              
                if (valid) {
                    
                    showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,extraParams,'','',workflow_stage_id);
                   
                } else {
                    Ext.getBody().unmask();
                    toastr.warning('Please Enter All the required Product Sample Details!!', 'Warning Response');
                    return;
                }

       
    },
    
    showManagerQueryApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            valid = true,
            storeID = getApplicationStore(module_id, section_id),
            table_name = getApplicationTable(module_id);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagerqueryfrm', winWidth, storeID,'','','',workflow_stage_id);
           
        } else {
            Ext.getBody().unmask();
        }
    },
    validateproducsampleReceivingSubmission: function () {

        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            productsDetailsFrm = activeTab.down('#productsDetailsFrm'),
            screeningGrid = activeTab.down('productscreeninggrid'),
            productsSampledetailsGrid = activeTab.down('productsSampledetailsGrid'),
            //productDocUploadsGrid = activeTab.down('productDocUploadsGrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        //ckech the details 

        if (!productsDetailsFrm.isValid()) {
          //  toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
            //return false;
        }
        if(section_id != 4){
            if (productsSampledetailsGrid.getStore().data.length < 1) {
                toastr.warning('Product Sample details have not been received!!', 'Warning Response');
                return false;
            }
        }
        

        // if (productDocUploadsGrid.getStore().data.length < 1) {
        //     //   toastr.warning('Upload the Required Application Documents!!', 'Warning Response');
        //     // return false;
        // }

        if (screeningGrid.getStore().getModifiedRecords().length > 0) {
          //  toastr.warning('There are unsaved screening data!!', 'Warning Response');
          //  return false;
        }
      

        return true;

    },
    validateNewProductReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        //for exemptions
        if(sub_module_id == 75 && section_id == 3){
           var applicantFrm = activeTab.down('exmpProductsDetailsFrm');
           console.log(applicantFrm);
        } else if(sub_module_id == 75 && section_id == 2){
            if(activeTab.down('exmpProductsDetailsFrm')){
                var applicantFrm = activeTab.down('exmpProductsDetailsFrm');
            }
            else{
                var applicantFrm = activeTab.down('productapplicantdetailsfrm');
                console.log(applicantFrm);
            }  
            
         }else{
            var applicantFrm = activeTab.down('productapplicantdetailsfrm');
        }
        //proceed
        var application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),

            productsDetailsFrm = activeTab.down('#productsDetailsFrm'),
            screeningGrid = activeTab.down('foodpremscreeninggrid'),
            //more details verification
            drugsIngredientsGrid = activeTab.down('drugsIngredientsGrid'),
            drugsProductPackagingGrid = activeTab.down('drugsProductPackagingGrid'),
            productManuctureringGrid = activeTab.down('productManuctureringGrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
        if (!productsDetailsFrm.isValid()) {
                toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
                return false;
          
        }
        if(drugsIngredientsGrid){
            if (drugsIngredientsGrid.getStore().getTotalCount() < 1) {
                toastr.warning('Please Enter Product Ingredients Details (Under Product Other Details)!!', 'Warning Response');
                return false;
            }
            if (drugsProductPackagingGrid.getStore().getTotalCount() < 1) {
                toastr.warning('Please Enter Product Packaging Details (Under Product Other Details)!!', 'Warning Response');
                return false;
            }
            if (productManuctureringGrid.getStore().getTotalCount() < 1) {
                toastr.warning('Please Enter Product Manufacturer Details (Under Product Other Details)!!', 'Warning Response');
                return false;
            }
        }
        
        return true;
    },
    validateNewExmpProductReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
            if(prodclass_category_id ==50){
                applicantFrm = activeTab.down('productapplicantdetailsfrm');
            }
            else{
                applicantFrm = activeTab.down('exmpProductsDetailsFrm');
            }
          
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),
            drugsIngredientsGrid = activeTab.down('exemptiondrugsProductslistGrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        
            if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
        if (drugsIngredientsGrid.getStore().getTotalCount() < 1) {
            toastr.warning('Please Enter Product  (Under Product Details)!!', 'Warning Response');
            return false;
        }
        
        return true;
    },
    showInvoicingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
        valid = this.validateProductsInvoicingSubmission(btn);

        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,'','','',workflow_stage_id);
        } else {
            Ext.getBody().unmask();
        }
    },
    
   
    validateProductsInvoicingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoiceDetailsGrid = activeTab.down('invoicingcostdetailsgrid'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!invoice_id) {
            toastr.warning('Please Save Invoice Details!!', 'Warning Response');
            return false;
        }
        if (invoiceDetailsGrid.getStore().data.length < 1) {
            toastr.warning('No Cost Elements Selected For Invoicing!!', 'Warning Response');
            return false;
        } else {
            this.saveNewProductsInvoicingDetails(btn);
        }
        return true;
    },

    showManagerEvaluationApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
        valid = true;// this.validateFoodPremisePaymentSubmission();
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'drugworkflowsubmissionsmanevafrm', winWidth, storeID, '','','',workflow_stage_id);
        } else {
            Ext.getBody().unmask();
        }
    },

    //manager evaluation
    FManagerEvaluation: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            grid = activeTab.down('productmanagerevaluationgrid'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            inTrayStore = Ext.getStore('intraystr'),
            outTrayStore = Ext.getStore('outtraystr'),
            form = btn.up('form'),
            win = form.up('window'),
            frm = form.getForm(),
            sm = grid.getSelectionModel(),
            records = sm.getSelection(),
            selected = [];
        Ext.each(records, function (record) {
            var id = record.get('id');
            if (id) {
                //var obj = {id: id};
                selected.push(id);
            }
        });
        if (frm.isValid()) {
            frm.submit({
                url: 'workflow/submitApplicationManagerEvaluation',
                waitMsg: 'Please wait...',
                params: {
                    selected: JSON.stringify(selected)
                },
                headers: {
                    'X-CSRF-Token': token
                },
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.load();
                        inTrayStore.load();
                        outTrayStore.load();
                        win.close();
                        mainTabPanel.remove(activeTab);
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    showEvaluationApplicationSubmissionWin: function (btn) {

        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            // form = activeTab.down('form').getForm(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            
            hasRecommendation = checkApplicationEvaluationOverralRecom(application_code, 2, workflow_stage_id),
            hasQueries = checkApplicationRaisedQueries(application_code, module_id),
            storeID = getApplicationStore(module_id, section_id);
        valid = true;
        if(!hasRecommendation){
            toastr.warning('Enter the Assessmenet Overrall Recommendation to Proceed!!', 'Warning Response');
            Ext.getBody().unmask();
            return false;
           
        }
        // if(!form.isValid()){
        //    // toastr.warning('Enter all the product application details to proceed!!', 'Warning Response');
        //    // Ext.getBody().unmask();
        //    // return false;
        // }
        if(section_id == 3 || sub_module_id == 88 || sub_module_id == 99){

            var storeID = getApplicationStore(module_id, section_id),
                table_name = getApplicationTable(module_id),
                extraParams = [{
                    field_type: 'hiddenfield',
                    field_name: 'has_queries',
                    value: hasQueries
                }];
            
            if (valid == true || valid === true) {
                showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID, extraParams,'','',workflow_stage_id);//workflowsubmissionsfrm
            } else {
                Ext.getBody().unmask();
            }
        }
        else{
            checklist_category_id = '';
            if(activeTab.down('combo[name=applicable_checklist]') ){
                checklist_category_id = activeTab.down('combo[name=applicable_checklist]').getValue();
            }
           
            hasEvalUploadChecklist = checkApplicationChecklistUploadDetails(application_code, module_id,sub_module_id,section_id,checklist_category_id,workflow_stage_id);
            if(!hasEvalUploadChecklist){
                toastr.warning('Upload the evaluation report or fill in the Evaluation checklist details(for checklist based evaluation) to proceed!!', 'Warning Response');
                Ext.getBody().unmask();
                return false;
               
            }
            extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'has_queries',
                value: hasQueries
            }];
            if (valid == true || valid === true) {
                showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsstrictrecommfrm', winWidth, storeID,extraParams,'','',workflow_stage_id);
            } else {
                Ext.getBody().unmask();
            }

        }
    },
    showAuditingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            
            form = activeTab.down('form').getForm(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),

            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            checklist_category_id = '';
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id),
            hasStructureQueries = checkApplicationRaisedQueries(application_code, module_id);
            // hasQueries = checkApplicationUnstructuredQueries(application_code,module_id);

        valid = true;
        has_queries = false;
        if(!hasStructureQueries){
            has_queries = true;
        }
        else{
            has_queries = true;
        }
        hasEvalUploadChecklist = checkApplicationChecklistUploadDetails(application_code, module_id,sub_module_id,section_id,checklist_category_id,workflow_stage_id);
        if(!hasEvalUploadChecklist){
            toastr.warning('Upload the evaluation report or fill in the Evaluation checklist details(for checklist based evaluation) to proceed!!', 'Warning Response');
            Ext.getBody().unmask();
            return false;
           
        }
        extraParams = [{
            field_type: 'hiddenfield',
            field_name: 'has_queries',
            value: has_queries
        }];
        if(!form.isValid()){
            toastr.warning('Enter all the product application details to proceed!!', 'Warning Response');
            Ext.getBody().unmask();
            return false;

        }
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsstrictrecommfrm', winWidth, storeID,extraParams,'','',workflow_stage_id);

            // showRecommendationWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsstrictrecommfrm', winWidth, storeID,1,extraParams,workflow_stage_id);
        } else {
            Ext.getBody().unmask();
        }
    },

    doSubmitData: function (data, storeId, method, url, callback) {
        Ext.getBody().mask('Saving record...');
        Ext.Ajax.on('beforerequest', function (conn, options) {
            Ext.Ajax.setDefaultHeaders({
                'X-CSRF-TOKEN': token,
                'Content-Type': 'application/json'
            });
        });
        Ext.Ajax.request({
            url: url,
            method: method,
            params: JSON.stringify(data),
            success: function (conn, response, options, eOpts) {
                var result = Ext.JSON.decode(conn.responseText, true);
                var store = null;
                if (storeId != null) {
                    store = Ext.getStore(storeId);
                }

                if (!result) {
                    result = {};
                    result.success = false;
                    result.msg = "Failed to decode the message from the server";
                }

                if (result.success) {
                    toastr.success(result.message);
                    if (store != null) {
                        store.load();
                    }
                } else {
                    toastr.warning(result.message);
                }
                callback(result);
                Ext.getBody().unmask();
            },
            failure: function (conn, response, options, eOpts) {
                Ext.getBody().unmask();
                toastr.error(conn.responseText);
            }
        });
    },

    showMeetingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
        valid = this.validateManagerMeetingApplicationSubmission(btn);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,'','','',workflow_stage_id);
        } else {
            Ext.getBody().unmask();
        }
    },
    validateManagerMeetingApplicationSubmission: function (btn) {
        var valid = true,
            saveInfo = this.saveTCMeetingDetails(btn);
        if (saveInfo == false || saveInfo === false) {
            valid = false;
        }
        return valid;
    },
    showApplicationDocUploadWin: function (btn) {
        var childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            isWin = btn.isWin,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            form = Ext.widget(childXtype);
        form.down('hiddenfield[name=application_id]').setValue(application_id);
        form.down('hiddenfield[name=application_code]').setValue(application_code);
        form.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        form.down('button[name=upload_file_btn]').isWin = isWin;
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
    },
    showProductsImagesDocUploadWin: function (btn) {
        var childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            isWin = btn.isWin,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue(),
            form = Ext.widget(childXtype);
        form.add({
            xtype: 'hiddenfield',
            name: 'product_id'
        });
        form.down('hiddenfield[name=application_id]').setValue(application_id);
        form.down('hiddenfield[name=application_code]').setValue(application_code);
        form.down('hiddenfield[name=product_id]').setValue(product_id);

        form.down('button[name=uploadimage_btn]').isWin = isWin;
        form.down('hiddenfield[name=document_type_id]').setValue(6);
        
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
       // docReqStr = Ext.getStore('document_requirementsStr');
        docReqStr =  form.down('combo[name=document_requirement_id]').getStore()
        docReqStr.load({
            params: {
                docType_id: 6,
                section_id: section_id,
                module_id: module_id,
                sub_module_id: sub_module_id
            }
        });
    },
    //manager evaluation/Auditing
    funcSubmitApplicationManagerEvaluation: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            grid = activeTab.down('grid'),//assumptions=>there is one main grid
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            inTrayStore = Ext.getStore('intraystr'),
            outTrayStore = Ext.getStore('outtraystr'),
            form = btn.up('form'),
            win = form.up('window'),
            frm = form.getForm(),
            sm = grid.getSelectionModel(),
            records = sm.getSelection(),
            selected = [];
        Ext.each(records, function (record) {
            var id = record.get('id');
            if (id) {
                //var obj = {id: id};
                selected.push(id);
            }
        });
        if (frm.isValid()) {
            frm.submit({
                url: 'workflow/submitApplicationManagerEvaluation',
                waitMsg: 'Please wait...',
                params: {
                    selected: JSON.stringify(selected)
                },
                headers: {
                    'X-CSRF-Token': token
                },
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.load();
                        inTrayStore.load();
                        outTrayStore.load();
                        win.close();
                        mainTabPanel.remove(activeTab);
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (fm, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    prepareProductsChecklistAuditing: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            checklist_grid = activeTab.down('grid'),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            product_details = otherDetailsFrm.down('displayfield[name=product_details]'),

            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareProductsInvoicingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_product_applications'
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
                        activeTab.down('hiddenfield[name=product_id]').setValue(results.product_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);

                        applicant_details.setValue(results.applicant_details);
                        product_details.setValue(results.product_details);

                        product_details.setVisible(true);
                        product_details.setValue(results.product_details);
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
    prepareFoodProductsEvalAud: function () {
        
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            checklist_grid = activeTab.down('grid'),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            product_details = otherDetailsFrm.down('displayfield[name=product_details]'),

            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        var applicable_checkliststore = activeTab.down('combo[name=applicable_checklist]').getStore();
        applicable_checkliststore.removeAll();
        applicable_checkliststore.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareProductsInvoicingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_product_applications'
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
                        activeTab.down('hiddenfield[name=product_id]').setValue(results.product_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);

                        applicant_details.setValue(results.applicant_details);
                        product_details.setValue(results.product_details);
                        //uploads details 

                        /* checklist_grid.store.removeAll();
                         checklist_grid.store.load({
                             params: {
                                 application_code: application_code
                             }
                         });
                         */
                        product_details.setVisible(true);
                        product_details.setValue(results.product_details);
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
    prepareDrugsProductsUploadQueryPanel: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            product_details = otherDetailsFrm.down('displayfield[name=product_details]'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

            activeTab.down('drugsmanagerproductsqueriesgrid').down('hiddenfield[name=application_code]').setValue(application_code);
                        
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareProductsInvoicingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_product_applications'
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
                        activeTab.down('hiddenfield[name=product_id]').setValue(results.product_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);

                        applicant_details.setValue(results.applicant_details);
                        product_details.setValue(results.product_details);
                        //uploads details 
                        
                        product_details.setVisible(true);

                        product_details.setValue(results.product_details);


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
    prepareProductsProcessUploadEvaluation: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            upload_grid = activeTab.down('grid'),
            applicant_details = activeTab.down('displayfield[name=applicant_details]'),
            product_details = activeTab.down('displayfield[name=product_details]'),
            preview_productdetails = activeTab.down('#preview_productdetails'),
            product_panel = preview_productdetails.down('#product_panel'),
            product_detailspanel = activeTab.down('#product_detailspanel'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

            
            if(sub_module_id ==9){
                if(activeTab.down('button[name=upload_evaluationreport]')){
                    activeTab.down('button[name=variation_requests]').setVisible(true);
                }

            }
        /*
save_evaluationchecklist
'modhas_payment_processing' in 'where clause' (SQL: select * from `modules
        */
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareProductsUniformStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_product_applications'
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
                        model = Ext.create('Ext.data.Model', results);

                    if (success == true || success === true) {
                        var prodclass_category_id = results.prodclass_category_id;

                        activeTab.down('hiddenfield[name=product_id]').setValue(results.product_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        prodclass_category_id = results.prodclass_category_id;
                        
                        classification_id = results.classification_id;
                        //|| classification_id == 365
                        // if(prodclass_category_id == 2 || results.section_id == 4){
                        //    if(activeTab.down('button[name=upload_evaluationreport]')){
                        //         activeTab.down('button[name=upload_evaluationreport]').setVisible(true);
                            
                        //     }
                        //     var evaluation_panel = activeTab.down('#evaluation_panel');
                        //         evaluation_panel.removeAll();
                        //         evaluation_panel.add({xtype:'productevaluationchecklistsGrid'});
                        //         var applicable_checkliststore = activeTab.down('combo[name=applicable_checklist]').getStore();
                        //             applicable_checkliststore.removeAll();
                        //             applicable_checkliststore.load({
                        //                 params: {
                        //                     process_id: process_id,
                        //                     active_application_code: application_code,
                        //                     workflow_stage: workflow_stage_id
                        //                 }
                        //             });

                        //             //activeTab.down('button[name=btn_raisequery]').setVisible(true);
                        //             //activeTab.down('button[name=save_evaluationchecklist]').setVisible(true);
                        //             // if(prodclass_category_id == 2){
                        //             //     product_detailspanel.removeAll();
                        //             //     product_detailspanel.add({xtype: 'antisepticproductsdetailsfrm'});
                                        
                        //             // }
                                    
                        //         }
                                // else{
                                    
                                    if(activeTab.down('button[name=upload_evaluationreport]')){
                                        activeTab.down('button[name=upload_evaluationreport]').setVisible(false);
                                    
                                    }
                                   
                                        //activeTab.down('button[name=btn_raisequery]').setVisible(true);
                                        //activeTab.down('button[name=save_evaluationchecklist]').setVisible(false);
                                        var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
                                            app_doc_types_store.removeAll();
                                            app_doc_types_store.load({
                                                params: {
                                                    process_id: process_id,
                                                    workflow_stage: workflow_stage_id
                                                }
                                            });
                                        upload_grid.store.removeAll();
                                        upload_grid.store.load({
                                            params: {
                                                application_code: application_code
                                            }
                                        });


                        // }
                        
                        //uploads details
                        applicant_details.setValue(results.applicant_details);
                       
                        //productsDetailsFrm = activeTab.down('#productsDetailsFrm'),
                        //productsDetailsFrm.loadRecord(model);

                        //product_panel.getViewModel().set('isReadOnly', true);

                        preview_productdetails.getViewModel().set('isReadOnly', true);
                       
                        product_details.setValue(results.product_details);
                        //hold on to data
                        preview_productdetails.getViewModel().set('model', model);

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
    prepareProductsProcessUploadAuditingProcess: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            upload_grid = activeTab.down('grid'),
            applicant_details = activeTab.down('displayfield[name=applicant_details]'),
            product_details = activeTab.down('displayfield[name=product_details]'),
            // product_panel = activeTab.down('#product_panel'),

            preview_productdetails = activeTab.down('#preview_productdetails'),
            // product_panel = preview_productdetails.down('#product_panel'),

            product_detailspanel = activeTab.down('#product_detailspanel'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        // console.log(preview_productdetails.getViewModel());

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareProductsUniformStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_product_applications'
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
                        model = Ext.create('Ext.data.Model', results);

                    if ((success == true || success === true) && results )  {
                        var module_id = results.module_id,
                           prodclass_category_id = results.prodclass_category_id;

                        activeTab.down('hiddenfield[name=product_id]').setValue(results.product_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        prodclass_category_id = results.prodclass_category_id;
                        
                        classification_id = results.classification_id;
                        
                        
                        // if(prodclass_category_id == 2 || results.section_id == 4){
                            
                        //     // if(prodclass_category_id == 2){
                        //     //     product_detailspanel.removeAll();
                        //     //     product_detailspanel.add({xtype: 'antisepticproductsdetailsfrm'});
                                
                        //     // }
                        //     var evaluation_panel = activeTab.down('#auditing_panel');
                        //         evaluation_panel.removeAll();
                        //         evaluation_panel.add({xtype:'productAuditingCheckGrid'});
                        //         var applicable_checkliststore = activeTab.down('combo[name=applicable_checklist]').getStore();
                        //             applicable_checkliststore.removeAll();
                        //             applicable_checkliststore.load({
                        //                 params: {
                        //                     process_id: process_id,
                        //                     active_application_code: application_code,
                        //                     workflow_stage: workflow_stage_id
                        //                 }
                        //             });


                        //             //activeTab.down('button[name=btn_raisequery]').setVisible(true);
                                    
                        //            // activeTab.down('button[name=save_evaluationchecklist]').setVisible(true);
                        //         }
                        //         else{
                                    
                           // activeTab.down('button[name=btn_raisequery]').setVisible(true);
                            
                            //activeTab.down('button[name=save_evaluationchecklist]').setVisible(false);
                            var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
                                app_doc_types_store.removeAll();
                                app_doc_types_store.load({
                                    params: {
                                        process_id: process_id,
                                        workflow_stage: workflow_stage_id
                                    }
                                });
                            upload_grid.store.removeAll();
                            upload_grid.store.load({
                                params: {
                                    application_code: application_code
                                }
                            });


                        // }
                        //uploads details
                        applicant_details.setValue(results.applicant_details);
                        product_details.setValue(results.product_details);

                        // productsDetailsFrm = activeTab.down('#productsDetailsFrm'),
                        // productsDetailsFrm.loadRecord(model);
                        preview_productdetails.getViewModel().set('model', model);
                        preview_productdetails.getViewModel().set('isReadOnly', true);
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
    prepareMedicalDevProductsUploadAud: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            product_details = otherDetailsFrm.down('displayfield[name=product_details]'),
            product_panel = activeTab.down('#product_panel'),
            product_detailspanel = activeTab.down('#product_detailspanel'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),

            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareProductsUniformStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_product_applications'
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
                        classification_id = results.classification_id;

                    if (success == true || success === true) {
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=product_id]').setValue(results.product_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);

                        applicant_details.setValue(results.applicant_details);
                        product_details.setValue(results.product_details);
                        //uploads details 
                        if(results.section_id == 4){
                            var evaluation_panel = activeTab.down('#auditing_panel');
                                evaluation_panel.removeAll();
                                evaluation_panel.add({xtype:'productauditingchecklistsGrid'});
                                
                        }
                        else{
                            
                           var upload_grid = activeTab.down('grid'),
                                app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
                            app_doc_types_store.removeAll();
                            app_doc_types_store.load({
                                params: {
                                    process_id: process_id,
                                    workflow_stage: workflow_stage_id
                                }
                            });
                            upload_grid.store.removeAll();
                            upload_grid.store.load({
                                params: {
                                    application_code: application_code
                                }
                            });
                        }
                       

                        product_details.setVisible(true);
                        product_details.setValue(results.product_details);
                       
                        product_detailspanel.getViewModel().set('isReadOnly', true);
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
    
    prepareNewProductsInvoicing: function () {
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
            product_details = otherDetailsFrm.down('displayfield[name=product_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            paying_currency = activeTab.down('combo[name=paying_currency_id]'),
            isFastTrack = activeTab.down('checkbox[name=is_fast_track]'),
            save_btn = activeTab.down('button[name=save_btn]'),
            commit_btn = activeTab.down('button[name=commit_btn]');
            variation_requests = activeTab.down('button[name=variation_requests]');

            
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareProductsInvoicingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_product_applications'
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
                        
                        isLocked = results.isLocked,
                        is_fast_track = results.is_fast_track;
                    if (success == true || success === true) {
                        var module_id = results.module_id;
                        activeTab.down('hiddenfield[name=product_id]').setValue(results.product_id);
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);

                        activeTab.down('hiddenfield[name=isLocked]').setValue(isLocked);
                        activeTab.down('checkbox[name=is_fast_track]').setValue(is_fast_track);

                        paying_currency.setValue(results.paying_currency_id);
                        invoice_id.setValue(results.invoice_id);
                        invoice_no.setValue(results.invoice_no);

                        applicant_details.setValue(results.applicant_details);
                        product_details.setValue(results.product_details);

                        invoiceSummaryStore.removeAll();
                        invoiceSummaryStore.load({
                            params: {
                                invoice_id: results.invoice_id
                            }
                        });
                        if (isLocked == 1 || isLocked === 1) {
                            //paying_currency.setReadOnly(true);
                            isFastTrack.setReadOnly(true);
                            save_btn.setVisible(false);
                            commit_btn.setDisabled(true);
                        }
                        if (module_id == 1 || module_id === 1) {

                            product_details.setVisible(true);
                            product_details.setValue(results.product_details);

                        }
                        if(sub_module_id  == 9){
                            variation_requests.setHidden(false);
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
    refreshProductImagesUploadsGrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            table_name = grid.table_name,
            document_type_id = grid.document_type_id,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();

        if (activeTab.down('hiddenfield[name=product_id]')) {
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue();

        } else {

            var panel = me.up('window'),
                product_id = panel.down('hiddenfield[name=product_id]').getValue();

        }

        store.getProxy().extraParams = {
            document_type_id: document_type_id,
            product_id: product_id
        };
    },
    // prepareInterfaceBasedonConfig: function(me){//me - the form
    //      var frm_cont = me.up('panel'),
    //         wizard = frm_cont.up('panel');
           
    //     if(wizard.down('hiddenfield[name=module_id]')){
    //         if(wizard.down('hiddenfield[name=module_id]').getValue()){
    //             var module_id = wizard.down('hiddenfield[name=module_id]').getValue(),
    //             sub_module_id = wizard.down('hiddenfield[name=sub_module_id]').getValue(),
    //             prodclass_category_id = wizard.down('hiddenfield[name=prodclass_category_id]').getValue(),
    //             section_id = wizard.down('hiddenfield[name=section_id]').getValue();
                
    //         }else{
    //             var wizard = wizard.up(),
    //                 module_id = wizard.down('hiddenfield[name=module_id]').getValue(),
    //                 sub_module_id = wizard.down('hiddenfield[name=sub_module_id]').getValue(),
    //                 prodclass_category_id = wizard.down('hiddenfield[name=prodclass_category_id]').getValue(),
    //                 section_id = wizard.down('hiddenfield[name=section_id]').getValue();
                   
    //        }

    //     }else{
    //         var mainTabPanel = this.getMainTabPanel(),
    //             activeTab = mainTabPanel.getActiveTab(),
    //             module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
    //             sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
    //             prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue(),
    //             section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
     
    //     }  

    //     if(me.down('hiddenfield[name=prodclass_category_id]')){
    //         prodclass_category_id = me.down('hiddenfield[name=prodclass_category_id]').getValue();
    //     }

    //      Ext.Ajax.request({
    //             url: 'configurations/prepareInterfaceBasedonConfig',
    //             params: {
    //                 module_id:module_id,
    //                 sub_module_id:sub_module_id,
    //                 section_id:section_id,
    //                 prodclass_category_id:prodclass_category_id
    //             },
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': 'Bearer ' + access_token,
    //                 'X-CSRF-Token': token
    //             },
    //             success: function (response) {
              
    //                 var resp = Ext.JSON.decode(response.responseText),
    //                     success = resp.success,
    //                     message = resp.message;
    //                     result = resp.results;
    //                 if (success == true || success === true) {
    //                     //render form
    //                     for (var i = result.length - 1; i >= 0; i--) {
    //                         var base_result = result[i];
    //                         var field_name =  base_result.field_name;
    //                         var label =  base_result.label;
    //                         var is_enabled =  base_result.is_enabled;
    //                         var is_mandatory =  base_result.is_mandatory;
    //                         var is_readOnly =  base_result.is_readOnly;
    //                         var has_relation =  base_result.has_relation;
    //                         var bind_column =  base_result.bind_column;
    //                         var child_combo =  base_result.child_combo;
    //                         var parent_combo =  base_result.parent_combo;
    //                         var xtype =  base_result.xtype;
    //                         var table =  base_result.combo_table;
    //                         var displayfield =  base_result.displayfield;
    //                         var valuefield =  base_result.valuefield;
    //                         var is_parent =  base_result.is_parent;
    //                         var is_hidden =  base_result.is_hidden;
    //                         var is_multiparent =  base_result.is_multiparent;
    //                         var total_children =  base_result.total_children;
                            

    //                         if(is_mandatory == 1 ){
    //                             is_mandatory = false;
    //                         }else{
    //                             is_mandatory = true;
    //                         }
    //                         if(is_hidden == 1 ){
    //                             is_hidden = true;
    //                         }else{
    //                             is_hidden = false;
    //                         }
    //                         if( result[i].form_field_type_id == 6 ){
    //                             if(is_multiparent){
    //                                 if(is_readOnly == 1){
    //                                     var configs = {
    //                                         name: field_name,
    //                                         fieldLabel: label,
    //                                         allowBlank: is_mandatory,
    //                                         valueField: valuefield,
    //                                         hidden: is_hidden,
    //                                         total_children: total_children,
    //                                         displayField: displayfield,
    //                                         readOnly: true,
    //                                         forceSelection: true,
    //                                         queryMode: 'local',
    //                                         listeners: {
    //                                             beforerender: {
    //                                                 fn: 'setCompStore',
    //                                                 config: {
    //                                                     pageSize: 1000,
    //                                                     proxy: {
    //                                                         extraParams: {
    //                                                             table_name: table
    //                                                         }
    //                                                     }
    //                                                 },
    //                                                 isLoad: true
    //                                             },
    //                                             afterrender: function(me){
    //                                                 // //console.log('rendered');
    //                                                 me.addListener('change',function(combo, newVal, oldvalue, eopts) {
    //                                                    var form = combo.up('form'),
    //                                                        total_children = me.total_children;
    //                                                     //console.log(me);
    //                                                    for (var i = total_children - 1; i >= 0; i--) {

    //                                                       var child_combo = 'child_combo'+i,
    //                                                           bind_column = 'bind_column'+i,
    //                                                           store = form.down('combo[name='+me[child_combo]+']').getStore(),
    //                                                           filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
    //                                                           store.removeAll();
    //                                                           store.load({params:{filters:filters}});
    //                                                    }
    //                                                  });
    //                                                 // me.fireEvent('addListenerToConfig', me);
    //                                             }
                                               
    //                                         }
    //                                     };
    //                                 }else{
    //                                     var configs = {
    //                                         name: field_name,
    //                                         fieldLabel: label,
    //                                         allowBlank: is_mandatory,
    //                                         valueField: valuefield,
    //                                         hidden: is_hidden,
    //                                         total_children: total_children,
    //                                         displayField: displayfield,
    //                                         bind: {
    //                                             readOnly: '{isReadOnly}' 
    //                                         },
    //                                         forceSelection: true,
    //                                         queryMode: 'local',
    //                                         listeners: {
    //                                             beforerender: {
    //                                                 fn: 'setCompStore',
    //                                                 config: {
    //                                                     pageSize: 1000,
    //                                                     proxy: {
    //                                                         extraParams: {
    //                                                             table_name: table
    //                                                         }
    //                                                     }
    //                                                 },
    //                                                 isLoad: true
    //                                             },
    //                                             afterrender: function(me){
    //                                                 // //console.log('rendered');
    //                                                 me.addListener('change',function(combo, newVal, oldvalue, eopts) {
    //                                                    var form = combo.up('form'),
    //                                                        total_children = me.total_children;
    //                                                     //console.log(me);
    //                                                    for (var i = total_children - 1; i >= 0; i--) {

    //                                                       var child_combo = 'child_combo'+i,
    //                                                           bind_column = 'bind_column'+i,
    //                                                           store = form.down('combo[name='+me[child_combo]+']').getStore(),
    //                                                           filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
    //                                                           store.removeAll();
    //                                                           store.load({params:{filters:filters}});
    //                                                    }
    //                                                  });
    //                                                 // me.fireEvent('addListenerToConfig', me);
    //                                             }
                                               
    //                                         }
    //                                     };
    //                                 }
    //                                 for (var i = total_children - 1; i >= 0; i--) {
    //                                     var child_combo = 'child_combo'+i;
    //                                     var bind_column = 'bind_column'+i;
    //                                     configs[child_combo] = base_result[child_combo];
    //                                     configs[bind_column] = base_result[bind_column];
    //                                 }
    //                                  var field = Ext.create('Ext.form.ComboBox', configs);
    //                             }
    //                             else if(is_parent){
    //                                 if(is_readOnly == 1){
    //                                     var field = Ext.create('Ext.form.ComboBox',{
    //                                         name: field_name,
    //                                         fieldLabel: label,
    //                                         allowBlank: is_mandatory,
    //                                         valueField: valuefield,
    //                                         child_combo: child_combo,
    //                                         bind_column: bind_column,
    //                                         hidden: is_hidden,
    //                                         displayField: displayfield,
    //                                         readOnly: true, 
    //                                         forceSelection: true,
    //                                         queryMode: 'local',
    //                                         listeners: {
    //                                             beforerender: {
    //                                                 fn: 'setCompStore',
    //                                                 config: {
    //                                                     pageSize: 1000,
    //                                                     proxy: {
    //                                                         extraParams: {
    //                                                             table_name: table
    //                                                         }
    //                                                     }
    //                                                 },
    //                                                 isLoad: true
    //                                             },
    //                                             afterrender: function(me){
    //                                                 //console.log('rendered');
    //                                                 me.addListener('change',function(combo, newVal, oldvalue, eopts) {
    //                                                    var form = combo.up('form'),
    //                                                     store = form.down('combo[name='+me.child_combo+']').getStore(),
    //                                                     filters = JSON.stringify({[me.bind_column]:newVal});
    //                                                     store.removeAll();
    //                                                     store.load({params:{filters:filters}});
    //                                                  });
    //                                             }
                                               
    //                                         }
    //                                     });
    //                                 }else{
    //                                     if(is_readOnly == 1){
    //                                         var field = Ext.create('Ext.form.ComboBox',{
    //                                             name: field_name,
    //                                             fieldLabel: label,
    //                                             allowBlank: is_mandatory,
    //                                             valueField: valuefield,
    //                                             child_combo: child_combo,
    //                                             bind_column: bind_column,
    //                                             hidden: is_hidden,
    //                                             displayField: displayfield,
    //                                             readOnly: true,
    //                                             forceSelection: true,
    //                                             queryMode: 'local',
    //                                             listeners: {
    //                                                 beforerender: {
    //                                                     fn: 'setCompStore',
    //                                                     config: {
    //                                                         pageSize: 1000,
    //                                                         proxy: {
    //                                                             extraParams: {
    //                                                                 table_name: table
    //                                                             }
    //                                                         }
    //                                                     },
    //                                                     isLoad: true
    //                                                 },
    //                                                 afterrender: function(me){
    //                                                     //console.log('rendered');
    //                                                     me.addListener('change',function(combo, newVal, oldvalue, eopts) {
    //                                                        var form = combo.up('form'),
    //                                                         store = form.down('combo[name='+me.child_combo+']').getStore(),
    //                                                         filters = JSON.stringify({[me.bind_column]:newVal});
    //                                                         store.removeAll();
    //                                                         store.load({params:{filters:filters}});
    //                                                      });
    //                                                 }
                                                   
    //                                             }
    //                                         });
    //                                     }else{
    //                                         var field = Ext.create('Ext.form.ComboBox',{
    //                                             name: field_name,
    //                                             fieldLabel: label,
    //                                             allowBlank: is_mandatory,
    //                                             valueField: valuefield,
    //                                             child_combo: child_combo,
    //                                             bind_column: bind_column,
    //                                             hidden: is_hidden,
    //                                             displayField: displayfield,
    //                                             bind: {
    //                                                 readOnly: '{isReadOnly}' 
    //                                             },
    //                                             forceSelection: true,
    //                                             queryMode: 'local',
    //                                             listeners: {
    //                                                 beforerender: {
    //                                                     fn: 'setCompStore',
    //                                                     config: {
    //                                                         pageSize: 1000,
    //                                                         proxy: {
    //                                                             extraParams: {
    //                                                                 table_name: table
    //                                                             }
    //                                                         }
    //                                                     },
    //                                                     isLoad: true
    //                                                 },
    //                                                 afterrender: function(me){
    //                                                     //console.log('rendered');
    //                                                     me.addListener('change',function(combo, newVal, oldvalue, eopts) {
    //                                                        var form = combo.up('form'),
    //                                                         store = form.down('combo[name='+me.child_combo+']').getStore(),
    //                                                         filters = JSON.stringify({[me.bind_column]:newVal});
    //                                                         store.removeAll();
    //                                                         store.load({params:{filters:filters}});
    //                                                      });
    //                                                 }
                                                   
    //                                             }
    //                                         });
    //                                     }
    //                                 }
    //                              }else{
    //                                 if(is_readOnly == 1){
    //                                     var field = Ext.create('Ext.form.ComboBox',{
    //                                         name: field_name,
    //                                         fieldLabel: label,
    //                                         allowBlank: is_mandatory,
    //                                         valueField: valuefield,
    //                                         displayField: displayfield,
    //                                         hidden: is_hidden,
    //                                         forceSelection: true,
    //                                         queryMode: 'local',
    //                                         readOnly: true,
    //                                         listeners: {
    //                                             beforerender: {
    //                                                 fn: 'setCompStore',
    //                                                 config: {
    //                                                     pageSize: 1000,
    //                                                     proxy: {
    //                                                         extraParams: {
    //                                                             table_name: table
    //                                                         }
    //                                                     }
    //                                                 },
    //                                                 isLoad: true
    //                                             }
                                               
    //                                         }
    //                                     });
    //                                 }else{
    //                                     var field = Ext.create('Ext.form.ComboBox',{
    //                                         name: field_name,
    //                                         fieldLabel: label,
    //                                         allowBlank: is_mandatory,
    //                                         valueField: valuefield,
    //                                         displayField: displayfield,
    //                                         hidden: is_hidden,
    //                                         forceSelection: true,
    //                                         queryMode: 'local',
    //                                         bind: {
    //                                             readOnly: '{isReadOnly}' 
    //                                         },
    //                                         listeners: {
    //                                             beforerender: {
    //                                                 fn: 'setCompStore',
    //                                                 config: {
    //                                                     pageSize: 1000,
    //                                                     proxy: {
    //                                                         extraParams: {
    //                                                             table_name: table
    //                                                         }
    //                                                     }
    //                                                 },
    //                                                 isLoad: true
    //                                             }
                                               
    //                                         }
    //                                     });
    //                                 }
                                    
    //                             }

    //                         }else{
    //                             if(is_readOnly == 1){
    //                                 var field = Ext.create('Ext.form.'+xtype,{
    //                                     name: field_name,
    //                                     fieldLabel: label,
    //                                     hidden: is_hidden,
    //                                     allowBlank: is_mandatory,
    //                                     readOnly: true
    //                                 });
    //                             }else{
    //                                var field = Ext.create('Ext.form.'+xtype,{
    //                                     name: field_name,
    //                                     fieldLabel: label,
    //                                     hidden: is_hidden,
    //                                     allowBlank: is_mandatory,
    //                                     bind: {
    //                                         readOnly: '{isReadOnly}' 
    //                                     }
    //                                 });   
    //                             }
                                
    //                         }
    //                         me.insert(1,field);
    //                     }
    //                     if(me.up().up().getViewModel()){
    //                         var vmodel = me.up().up().getViewModel();
    //                             model = vmodel.get('model');
    //                             if(!Ext.Object.isEmpty(model)){
    //                                 me.loadRecord(model);
    //                             }
    //                     }
    //                     // me.down('combo[name=prodclass_category_id]').setValue(prodclass_category_id);
                        
    //                     if(me.down('combo[name=section_id]')){
    //                         me.down('combo[name=section_id]').setValue(section_id);
    //                     }
    //                     //set model for renewal and withdrawal
    //                     if(sub_module_id == 8 || sub_module_id == 9){
    //                         if(me.up().up().getViewModel()){
    //                             var vmodel = me.up().up().getViewModel();
    //                               vmodel.set('isReadOnly', true);  
    //                         }
    //                     }
    //                     if(sub_module_id == 17){
    //                         if(me.up().up().getViewModel()){
    //                             var vmodel = me.up().up().getViewModel();
    //                               vmodel.set('isReadOnly', false);  
    //                         }
    //                     }
                        
                        
    //                 } else {
    //                     toastr.error(message, 'Failure Response');
    //                 }
    //             },
    //             failure: function (response) {
    //                 btn.setLoading(false);
    //                 var resp = Ext.JSON.decode(response.responseText),
    //                     message = resp.message;
    //                 toastr.error(message, 'Failure Response');
    //             },
    //             error: function (jqXHR, textStatus, errorThrown) {
    //                 btn.setLoading(false);
    //                 toastr.error('Error: ' + errorThrown, 'Error Response');
    //             }
    //         });
        
    // },
    prepareInterfaceBasedonConfig: function(me){//me - the form
         var frm_cont = me.up('panel'),
            wizard = frm_cont.up('panel'),
            premise_type_id,prodclass_category_id,start_index=1;
           //console.log(wizard);
        if(wizard.down('hiddenfield[name=module_id]')){
            if(wizard.down('hiddenfield[name=module_id]').getValue()){
                var module_id = wizard.down('hiddenfield[name=module_id]').getValue(),
                    sub_module_id = wizard.down('hiddenfield[name=sub_module_id]').getValue(),
                    section_id = wizard.down('hiddenfield[name=section_id]').getValue();
                if(wizard.down('hiddenfield[name=prodclass_category_id]')){
                    prodclass_category_id = wizard.down('hiddenfield[name=prodclass_category_id]').getValue();
                }
            }else{
                var wizard = wizard.up(),
                    module_id = wizard.down('hiddenfield[name=module_id]').getValue(),
                    sub_module_id = wizard.down('hiddenfield[name=sub_module_id]').getValue(),
                    section_id = wizard.down('hiddenfield[name=section_id]').getValue();
                if(wizard.down('hiddenfield[name=prodclass_category_id]')){
                    prodclass_category_id = wizard.down('hiddenfield[name=prodclass_category_id]').getValue();
                }
           }

        }else{
            var mainTabPanel = this.getMainTabPanel(),
                activeTab = mainTabPanel.getActiveTab(),
                module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
                sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
                section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        }  

        if(module_id == 1 && me.down('hiddenfield[name=prodclass_category_id]') && me.down('hiddenfield[name=prodclass_category_id]').getValue()){
            prodclass_category_id = me.down('hiddenfield[name=prodclass_category_id]').getValue();
        }
        else if(activeTab && module_id == 1 && activeTab.down('hiddenfield[name=prodclass_category_id]') && activeTab.down('hiddenfield[name=prodclass_category_id]').getValue()){
            prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
        }
        if(module_id == 2){
            premise_type_id = wizard.down('hiddenfield[name=premise_type_id]').getValue();
        }   
        // if(sub_module_id == 2 || sub_module_id == 6){
        //     start_index = 8;
        // }
        // if(sub_module_id == 8){
        //     start_index = 5;
        // }
        // if(sub_module_id == 68){
        //     start_index = 8;
        // }
         Ext.Ajax.request({
                url: 'configurations/prepareInterfaceBasedonConfig',
                params: {
                    module_id:module_id,
                    sub_module_id:sub_module_id,
                    section_id:section_id,
                    prodclass_category_id: prodclass_category_id,
                    premise_type_id: premise_type_id
                },
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (response) {
              
                    var resp = Ext.JSON.decode(response.responseText),
                        success = resp.success,
                        message = resp.message;
                        result = resp.results;
                    if (success == true || success === true) {
                        //render form
                        for (var i = result.length - 1; i >= 0; i--) {
                            var base_result = result[i];
                            var field_name =  base_result.field_name;
                            var label =  base_result.label;
                            var is_enabled =  base_result.is_enabled;
                            var is_mandatory =  base_result.is_mandatory;
                            var is_readOnly =  base_result.is_readOnly;
                            var has_relation =  base_result.has_relation;
                            var bind_column =  base_result.bind_column;
                            var child_combo =  base_result.child_combo;
                            var parent_combo =  base_result.parent_combo;
                            var xtype =  base_result.xtype;
                            var table =  base_result.combo_table;
                            var displayfield =  base_result.displayfield;
                            var valuefield =  base_result.valuefield;
                            var is_parent =  base_result.is_parent;
                            var is_hidden =  base_result.is_hidden;
                            var is_multiparent =  base_result.is_multiparent;
                            var total_children =  base_result.total_children;
                            var has_logic =  base_result.has_logic;
                            var other_logic = base_result.other_logic;

                            if(is_mandatory == 1 ){
                                is_mandatory = false;
                            }else{
                                is_mandatory = true;
                            }
                            if(is_hidden == 1 ){
                                is_hidden = true;
                            }else{
                                is_hidden = false;
                            }
                            if( result[i].form_field_type_id == 6 ){
                                if(is_multiparent){
                                    if(is_readOnly == 1){
                                        var configs = {
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            hidden: is_hidden,
                                            total_children: total_children,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            readOnly: true,
                                            forceSelection: true,
                                            queryMode: 'local',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    // //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                           total_children = me.total_children;
                                                        //console.log(me);
                                                       for (var i = total_children - 1; i >= 0; i--) {
                                                        //console.log(me);
                                                          var child_combo = 'child_combo'+i,
                                                              bind_column = 'bind_column'+i,
                                                              store = form.down('combo[name='+me[child_combo]+']').getStore(),
                                                              filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
                                                              store.removeAll();
                                                              store.load({params:{filters:filters}});
                                                       }
                                                       // if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){
                                                            eval(me.other_logic);
                                                       }
                                                    // me.fireEvent('addListenerToConfig', me);
                                                }
                                               
                                            }
                                        };
                                    }else{
                                        var configs = {
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            hidden: is_hidden,
                                            total_children: total_children,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            forceSelection: true,
                                            queryMode: 'local',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    // //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                           total_children = me.total_children;
                                                        //console.log(me);
                                                       for (var i = total_children - 1; i >= 0; i--) {
                                                        //console.log(me);
                                                          var child_combo = 'child_combo'+i,
                                                              bind_column = 'bind_column'+i,
                                                              store = form.down('combo[name='+me[child_combo]+']').getStore(),
                                                              filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
                                                              store.removeAll();
                                                              store.load({params:{filters:filters}});
                                                       }
                                                       // if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){

                                                            eval(me.other_logic);
                                                       }
                                                    // me.fireEvent('addListenerToConfig', me);
                                                }
                                               
                                            }
                                        };
                                    }
                                    
                                    for (var i = total_children - 1; i >= 0; i--) {
                                        var child_combo = 'child_combo'+i;
                                        var bind_column = 'bind_column'+i;
                                        configs[child_combo] = base_result[child_combo];
                                        configs[bind_column] = base_result[bind_column];
                                    }
                                     var field = Ext.create('Ext.form.ComboBox', configs);
                                }
                                else if(is_parent){
                                    if(is_readOnly==1){
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            child_combo: child_combo,
                                            bind_column: bind_column,
                                            hidden: is_hidden,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            readOnly: true,
                                            forceSelection: true,
                                            queryMode: 'local',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                        store = form.down('combo[name='+me.child_combo+']').getStore(),
                                                        filters = JSON.stringify({[me.bind_column]:newVal});
                                                        store.removeAll();
                                                        store.load({params:{filters:filters}});
                                                       //  if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){
                                                            eval(me.other_logic);
                                                       }
                                                }
                                               
                                            }
                                        });
                                    }else{
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            child_combo: child_combo,
                                            bind_column: bind_column,
                                            hidden: is_hidden,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            forceSelection: true,
                                            queryMode: 'local',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                        store = form.down('combo[name='+me.child_combo+']').getStore(),
                                                        filters = JSON.stringify({[me.bind_column]:newVal});
                                                        store.removeAll();
                                                        store.load({params:{filters:filters}});
                                                       //  if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                    if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                   }
                                                }
                                               
                                            }
                                        });
                                    }
                                    
                                 }else{
                                    if(is_readOnly == 1){
                                       var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            displayField: displayfield,
                                            hidden: is_hidden,
                                            forceSelection: true,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            queryMode: 'local',
                                            readOnly: true,
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    if(me.has_logic == 1){
                                                        // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                        //    var form = combo.up('form');
                                                        //     eval(combo.other_logic);
                                                        //  });
                                                        eval(me.other_logic);
                                                    }
                                                }
                                            }
                                        }); 
                                    }else{
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            displayField: displayfield,
                                            hidden: is_hidden,
                                            forceSelection: true,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            queryMode: 'local',
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        pageSize: 1000,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    if(me.has_logic == 1){
                                                        // me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                        //    var form = combo.up('form');
                                                        //     eval(combo.other_logic);
                                                        //  });
                                                        eval(me.other_logic);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }

                            }
                            //for grid combo
                            else if(result[i].form_field_type_id == 7 ){
                                if(is_multiparent){
                                    if(is_readOnly==1){
                                        var configs = {
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            hidden: is_hidden,
                                            total_children: total_children,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            readOnly: true,
                                            pageSize: 20,
                                            listConfig:{
                                                minWidth:400,
                                                loadingText: 'Searching...',
                                                emptyText: 'No match found.', 
                                            },
                                            forceSelection: true,
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        enablePaging:true,
                                                        remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    // //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                           total_children = me.total_children;
                                                        //console.log(me);
                                                       for (var i = total_children - 1; i >= 0; i--) {

                                                          var child_combo = 'child_combo'+i,
                                                              bind_column = 'bind_column'+i,
                                                              store = form.down('combo[name='+me[child_combo]+']').getStore(),
                                                              filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
                                                              store.removeAll();
                                                              store.load({params:{filters:filters}});
                                                       }
                                                     });
                                                    if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                    // me.fireEvent('addListenerToConfig', me);
                                                }
                                               
                                            }
                                        };
                                    }else{
                                        var configs = {
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            hidden: is_hidden,
                                            total_children: total_children,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            pageSize: 20,
                                            listConfig:{
                                                minWidth:400,
                                                loadingText: 'Searching...',
                                                emptyText: 'No match found.', 
                                            },
                                            forceSelection: true,
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        enablePaging:true,
                                                        remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    // //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                           total_children = me.total_children;
                                                        //console.log(me);
                                                       for (var i = total_children - 1; i >= 0; i--) {

                                                          var child_combo = 'child_combo'+i,
                                                              bind_column = 'bind_column'+i,
                                                              store = form.down('combo[name='+me[child_combo]+']').getStore(),
                                                              filters = JSON.stringify({[me[bind_column]]:newVal});
                                                              
                                                              store.removeAll();
                                                              store.load({params:{filters:filters}});
                                                       }
                                                       // if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                     if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                    // me.fireEvent('addListenerToConfig', me);
                                                }
                                               
                                            }
                                        };
                                    }
                                    for (var i = total_children - 1; i >= 0; i--) {
                                        var child_combo = 'child_combo'+i;
                                        var bind_column = 'bind_column'+i;
                                        configs[child_combo] = base_result[child_combo];
                                        configs[bind_column] = base_result[bind_column];
                                    }
                                     var field = Ext.create('Ext.form.ComboBox', configs);
                                }
                                else if(is_parent){
                                    if(is_readOnly==1){
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            child_combo: child_combo,
                                            bind_column: bind_column,
                                            hidden: is_hidden,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            readOnly: true,
                                            forceSelection: true,
                                            pageSize: 20,
                                            listConfig:{
                                                minWidth:400,
                                                loadingText: 'Searching...',
                                                emptyText: 'No match found.', 
                                            },
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        enablePaging:true,
                                                        remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                        store = form.down('combo[name='+me.child_combo+']').getStore(),
                                                        filters = JSON.stringify({[me.bind_column]:newVal});
                                                        store.removeAll();
                                                        store.load({params:{filters:filters}});
                                                       //  if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                     if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                }
                                               
                                            }
                                        });
                                    }else{
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            child_combo: child_combo,
                                            bind_column: bind_column,
                                            hidden: is_hidden,
                                            displayField: displayfield,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            forceSelection: true,
                                            pageSize: 20,
                                            listConfig:{
                                                minWidth:400,
                                                loadingText: 'Searching...',
                                                emptyText: 'No match found.', 
                                            },
                                            queryMode: 'remote',
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        enablePaging:true,
                                                        remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                       var form = combo.up('form'),
                                                        store = form.down('combo[name='+me.child_combo+']').getStore(),
                                                        filters = JSON.stringify({[me.bind_column]:newVal});
                                                        store.removeAll();
                                                        store.load({params:{filters:filters}});
                                                       //  if(combo.has_logic == 1){
                                                       //      eval(combo.other_logic);
                                                       // }
                                                     });
                                                     if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                }
                                               
                                            }
                                        });
                                    }
                                 }else{
                                    if(is_readOnly==1){
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            displayField: displayfield,
                                            hidden: is_hidden,
                                            forceSelection: true,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            pageSize: 20,
                                            listConfig:{
                                                minWidth:400,
                                                loadingText: 'Searching...',
                                                emptyText: 'No match found.', 
                                            },
                                            queryMode: 'remote',
                                            readOnly: true,
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        enablePaging:true,
                                                        remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    // if(me.has_logic == 1){
                                                    //     me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                    //        var form = combo.up('form');
                                                    //         eval(combo.other_logic);
                                                    //      });
                                                    // }
                                                     if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                }
                                            }
                                        });
                                    }else{
                                        var field = Ext.create('Ext.form.ComboBox',{
                                            name: field_name,
                                            fieldLabel: label,
                                            allowBlank: is_mandatory,
                                            valueField: valuefield,
                                            displayField: displayfield,
                                            hidden: is_hidden,
                                            forceSelection: true,
                                            has_logic: has_logic,
                                            other_logic: other_logic,
                                            pageSize: 20,
                                            listConfig:{
                                                minWidth:400,
                                                loadingText: 'Searching...',
                                                emptyText: 'No match found.', 
                                            },
                                            queryMode: 'remote',
                                            bind: {
                                                readOnly: '{isReadOnly}' 
                                            },
                                            listeners: {
                                                beforerender: {
                                                    fn: 'setCompStore',
                                                    config: {
                                                        enablePaging:true,
                                                        remoteFilter: true,
                                                        pageSize: 20,
                                                        proxy: {
                                                            extraParams: {
                                                                table_name: table
                                                            }
                                                        }
                                                    },
                                                    isLoad: true
                                                },
                                                afterrender: function(me){
                                                    //console.log('rendered');
                                                    // if(me.has_logic == 1){
                                                    //     me.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                                    //        var form = combo.up('form');
                                                    //         eval(combo.other_logic);
                                                    //      });
                                                    // }
                                                     if(me.has_logic == 1){
                                                        eval(me.other_logic);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    
                                }

                            }
                            //other fields
                            else{
                                if(is_readOnly==1){

                                    var field = Ext.create('Ext.form.'+xtype,{
                                        name: field_name,
                                        fieldLabel: label,
                                        hidden: is_hidden,
                                        allowBlank: is_mandatory,
                                        readOnly: true
                                    }); 
                                }else{
                                    var field = Ext.create('Ext.form.'+xtype,{
                                        name: field_name,
                                        fieldLabel: label,
                                        hidden: is_hidden,
                                        allowBlank: is_mandatory,
                                        bind: {
                                            readOnly: '{isReadOnly}' 
                                        }
                                    });
                                }
                                  
                            }
                            me.insert(start_index,field);
                        }
                        if(me.up().up().getViewModel()){
                            var vmodel = me.up().up().getViewModel();
                                model = vmodel.get('model');
                                if(!Ext.Object.isEmpty(model)){
                                    me.loadRecord(model);
                                }
                        }
                        if(module_id == 2){
                          //  me.down('combo[name=premise_type_id]').setValue(premise_type_id);
                        }else{
                           // me.down('combo[name=prodclass_category_id]').setValue(prodclass_category_id);
                        }
                        
                        
                        if(me.down('combo[name=section_id]')){
                            me.down('combo[name=section_id]').setValue(section_id);
                        }
                        
                        
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (response) {
                    btn.setLoading(false);
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    btn.setLoading(false);
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
        
    },
    updateVisibilityAccess: function(me){
      var me = me.up('panel');
      if(me.down('hiddenfield[name=workflow_stage_id]')){
          workflow_stage_id = me.down('hiddenfield[name=workflow_stage_id]').getValue();
      }else{
         toastr.error('Please setup the beforerender collectly for control access', 'Error on Code');
      }

        Ext.Ajax.request({
            url: 'workflow/checkWorkflowStageInformationVisibilityMode',
            params: {
                stage_id: workflow_stage_id,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success || success == true || success === true) {
                    var right = resp.access_level;
                    // console.log(me.getViewModel());
      //               if(me.getViewModel()){
						// console.log(right);
      //                   if(right == 2){
      //                       console.log('2');
      //                       me.getViewModel().set('isReadOnly', true);
      //                       me.getViewModel().set('hideDeleteButton', false);
      //                   }
      //                   if(right == 3){
      //                      me.getViewModel().set('isReadOnly', false);
      //                      me.getViewModel().set('hideDeleteButton', false); 
      //                   }
      //                   if(right == 4){
      //                       me.getViewModel().set('hideDeleteButton', true); 
      //                       me.getViewModel().set('isReadOnly', false); 
      //                   }
      //                   if(right == 1){
      //                       me.getViewModel().set('isReadOnly', true); 
      //                       me.getViewModel().set('hideDeleteButton', false); 
      //                   }

      //               }
                } else {
                    toastr.error(message, 'Failure Response!!');
                }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    
    addApplicationCodetoForm: function(pnl){
       var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        if(activeTab){
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
        }else{
            console(grid.up('customizablewindow'));
        }
        if(application_code){
            pnl.down('hiddenfield[name=application_code]').setValue(application_code);
        }else{
            toastr.error('Failed to fetch application details', 'Error Response');
        }
    },
    prepareVariationForm: function(pnl){
       var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id, section_id ;
        if(activeTab){
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue();
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
        }else{
            toastr.error('failed to fetch application details', 'Error');
        }
        if(application_code){
            pnl.down('hiddenfield[name=application_code]').setValue(application_code);
            pnl.down('hiddenfield[name=module_id]').setValue(module_id);
            pnl.down('hiddenfield[name=section_id]').setValue(section_id);
            pnl.down('hiddenfield[name=product_id]').setValue(product_id);
        }else{
            toastr.error('Failed to fetch application details', 'Error Response');
        }
    },
    addApplicationCodeProductIdtoForm: function(pnl){
       var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        if(activeTab){
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
        }else{
            console(grid.up('customizablewindow'));
        }
        if(application_code){
            pnl.down('hiddenfield[name=application_code]').setValue(application_code);
            pnl.down('hiddenfield[name=product_id]').setValue(product_id);
        }else{
            toastr.error('Failed to fetch application details', 'Error Response');
        }
    },
    addApplicationCodetoGridStore: function(grid){
       var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            store = grid.getStore(),
            application_code;
        if(activeTab){
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        }else{
            console(grid.up('customizablewindow'));
        }
        if(application_code){
            store.getProxy().extraParams = {application_code: application_code};
        }else{
            toastr.error('Failed to fetch application details', 'Error Response');
        }
    },
    showRejectionIntentApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        valid = this.checkRejectionAppealResponseRecommendation(application_code);
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,'','','',workflow_stage_id);
        } else {
            toastr.error('Please provide recommendation and remarks', 'Missing Remarks');
            Ext.getBody().unmask();
        }
    },
    checkRejectionAppealResponseRecommendation: function(application_code){
         Ext.Ajax.request({
            url: 'productregistration/checkRejectionAppealResponseRecommendation',
            params: {
                application_code: application_code,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success || success == true || success === true) {
                    var has_recommendation = resp.has_recommendation;
                        return has_recommendation;
                    }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    addRejectionAppealResponseRecommendation: function(btn){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=application_code]').getValue(),
            recommendation_frm = Ext.widget('rejectionAppealResponseRecommendationFrm');

        recommendation_frm.down('hiddenfield[name=application_code]').setValue(application_code);
        funcShowCustomizableWindow('Recommendation and Remarks', '40%', recommendation_frm, 'customizablewindow');
    },
    hideShowSaveAddbutton: function(view) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        Ext.Ajax.request({
            url: 'configurations/getConfigParamFromTable',
            method: 'GET',
            params: {
                table_name: 'wf_workflow_stages',
                filters: JSON.stringify({id: workflow_stage_id}),
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    results = resp.results,
                    message = resp.message;
                if (success || success == true || success === true) {
                        stage_category_id = results[0].stage_category_id;
                        if(stage_category_id != 1 ){
                            me.setActionButtonVisibility(view, 1);
                        }else{
                            me.setActionButtonVisibility(view, 2);
                        }
                        
                    }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
            
    },
    setActionButtonVisibility:function(view, readOnly) {
        if(readOnly == 1){
            var comps = view.query('[isActionBtn=1]');
            for (var i = 0; i < comps.length; i++) {
                var comp = comps[i];
                comp.setVisible(false);
            }
        }else{
            var comps = view.query('[isActionBtn=1]');
            for (var i = 0; i < comps.length; i++) {
                var comp = comps[i];
                comp.setVisible(true);
            }
        }
        //add product approved quantity field.
        if(stage_category_id == 3 || stage_category_id == 13 || stage_category_id == 15){
            if(view.xtype == 'exemptionDrugsProductsFrm'){
                view.getForm().getFields().each (function (field) {
                    field.setReadOnly (false);
                });
                view.down('numberfield[name=approved_quantity]').setVisible(true);
                view.down('numberfield[name=approved_quantity]').setReadOnly(false);
                view.down('textfield[name=approval_remarks]').setReadOnly(false);
                view.down('textfield[name=approval_remarks]').setVisible(true);
                view.down('textfield[name=pack_size]').setReadOnly(false);
                view.down('textfield[name=pack_size]').setVisible(true);
                view.down('combo[name=product_schedule_id]').setReadOnly(false);
                view.down('combo[name=product_schedule_id]').setVisible(true);
                // view.down('combo[name=pack_unit_id]').setVisible(true);
                // view.down('combo[name=pack_unit_id]').setVisible(true);
                view.down('button[action=save_details]').setVisible(true);
            }
        }
    },
    setSectionAsValue: function(combo) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        combo.setValue(section_id);
    },
    setApplicationCodeIfAvailable: function(pnl){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]'),
            application_code;

        if(active_application_code){
            application_code = active_application_code.getValue();
        }

        pnl.down('hiddenfield[name=application_code]').setValue(application_code);
    },
    loadMdAssessmentHistory: function(form){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]'),
            assessment_history_id = form.down('hiddenfield[name=assessment_history_id]').getValue(),
            application_code;

        if(active_application_code){
            application_code = active_application_code.getValue();
        }
        form.down('hiddenfield[name=application_code]').setValue(application_code);

        Ext.Ajax.request({
            url: 'productregistration/loadMdAssessmentHistory',
            method: 'GET',
            params: {
                application_code: application_code,
                assessment_history_id: assessment_history_id,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    results = resp.results,
                    message = resp.message;
                if (success || success == true || success === true) {
                    question = results.question;
                    question_id = results.question_id;
                    answer_id = results.answer_id;
                    assessment_history_id = results.assessment_history_id;
                    var fs = Ext.create('Ext.form.FieldSet', {
                            xtype:'fieldset',
                            columnWidth: 1,
                            name: 'field_set',
                            title: 'Question',
                            collapsible: true,
                            layout: 'column',
                            defaults: {
                                labelAlign: 'top',
                                allowBlank: false,
                                columnWidth: 1
                            },
                            items: [{
                                xtype: 'label',
                                text: question,
                                margin: '0 0 0 10',
                                style: {
                                    'color': 'green',
                                    'font-weight': 'bold',
                                    'font-size': '12px'
                                }
                            },{
                                xtype: 'tbspacer',
                                width: 2
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: 'Select an Answer',
                                name: 'answer_id',
                                valueField: 'id',
                                displayField: 'answer',
                                // value: 0,
                                answer_id: answer_id,
                                question_id: question_id,
                                assessment_history_id: assessment_history_id,
                                queryMode: 'local',
                                forceSelection: true,
                                labelStyle: 'font-weight:bold',
                                listeners: {
                                    beforerender: {
                                        fn: 'setCompStore',
                                        config: {
                                            pageSize: 100,
                                            proxy: {
                                                url: 'productregistration/getMDAssessmentAnswers',
                                                extraParams: {
                                                    table_name: 'par_medical_device_assesment_answers',
                                                    question_id: question_id
                                                }
                                            }
                                        },
                                        isLoad: true
                                    },
                                    afterrender: function(combo){
                                        if(combo.answer_id > 0){
                                            combo.setValue(combo.answer_id);
                                        }
                                    },
                                    change: 'setMDAssessmentNextQuestion'
                                }
                            }]
                        }); 
                    form.insert(fs);   
                }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });

    },
    setMDAssessmentNextQuestion: function(combo, newVal, oldvalue, eopts){
        var question_id = combo.question_id,
            answer_id = newVal,
            form = combo.up('form'),
            oldfs = combo.up('fieldset'),
            application_code = form.down('hiddenfield[name=application_code]').getValue(),
            assessment_history_id = form.down('hiddenfield[name=assessment_history_id]').getValue();
        
        if(!assessment_history_id){
            assessment_history_id = combo.assessment_history_id;
        }
        combo.setReadOnly(true);
        Ext.Ajax.request({
            url: 'productregistration/loadMdAssessmentHistory',
            method: 'GET',
            params: {
                application_code: application_code,
                assessment_history_id: assessment_history_id,
                question_id: question_id,
                answer_id: answer_id,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    results = resp.results,
                    message = resp.message;
                if (success || success == true || success === true) {
                    question = results.question;
                    question_id = results.question_id;
                    answer_id = results.answer_id;
                    is_final_outcome = results.is_final_outcome;
                    if(is_final_outcome == 1){
                        var fs = Ext.create('Ext.form.Label', {
                            text: question,
                            margin: '10 0 0 0',
                            style: {
                                'color': 'blue',
                                'font-weight': 'bold',
                                'font-size': '16px'
                            }
                        });
                    }
                    else{
                        var fs = Ext.create('Ext.form.FieldSet', {
                                xtype:'fieldset',
                                columnWidth: 1,
                                name: 'field_set',
                                title: 'Question',
                                collapsible: true,
                                layout: 'column',
                                defaults: {
                                    // labelAlign: 'top',
                                    allowBlank: false,
                                    labelAlign: 'top',
                                    columnWidth: 1,
                                },
                                items: [{
                                    xtype: 'label',
                                    text: question,
                                    margin: '0 0 0 10',
                                    flex: 1,
                                    style: {
                                        'color': 'green',
                                        'font-weight': 'bold',
                                        'font-size': '12px'
                                    }
                                },{
                                    xtype: 'tbspacer',
                                    width: 2
                                },
                                {
                                    xtype: 'combo',
                                    emptyText: 'Select an Answer',
                                    name: 'answer_id',
                                    valueField: 'id',
                                    displayField: 'answer',
                                    // value: 0,
                                    question_id: question_id,
                                    answer_id: answer_id,
                                    assessment_history_id: assessment_history_id,
                                    queryMode: 'local',
                                    forceSelection: true,
                                    labelStyle: 'font-weight:bold',
                                    listeners: {
                                        beforerender: {
                                            fn: 'setCompStore',
                                            config: {
                                                pageSize: 100,
                                                proxy: {
                                                    url: 'productregistration/getMDAssessmentAnswers',
                                                    extraParams: {
                                                        table_name: 'par_medical_device_assesment_answers',
                                                        question_id: question_id
                                                    }
                                                }
                                            },
                                            isLoad: true
                                        },
                                        afterrender: function(combo){
                                            if(combo.answer_id > 0){

                                                combo.setValue(combo.answer_id);
                                            }
                                        },
                                        change: 'setMDAssessmentNextQuestion'
                                    }
                                }]
                            }); 
                    }
                    form.insert(fs);
                    oldfs.setCollapsed(true);
                }
            },
            failure: function (response) {
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
    showandhidefields: function(frm){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();

        if(section_id == 4){
            frm.down('numberfield[name=unit_pack]').setVisible(true);
            frm.down('numberfield[name=unit_pack]').allowBlank = false;
        }else{
            frm.down('numberfield[name=unit_pack]').setVisible(false);
            frm.down('numberfield[name=unit_pack]').allowBlank = true;
        }


    },
    showandhideIngredientsfields: function(frm){
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();

        if(section_id == 7){
            frm.down('textfield[name=acceptance_id]').setVisible(true);
            frm.down('textfield[name=specification_type_id]').setVisible(false);
            frm.down('textfield[name=strength]').setVisible(true);
            frm.down('textfield[name=ingredientssi_unit_id]').setVisible(false);
            frm.down('textfield[name=altenative_name]').setVisible(true);
            frm.down('textfield[name=ing_processing]').setVisible(true);
            frm.down('textfield[name=ing_source]').setVisible(true);
            frm.down('textfield[name=cas_number]').setVisible(true);
            frm.down('textfield[name=inclusion_reason_id]').setVisible(true);
            frm.down('fieldcontainer[name=atc]').setVisible(false);
            frm.down('combo[name=atc_code_id]').setVisible(false);
        } else if(section_id == 3){
            frm.down('textfield[name=acceptance_id]').setVisible(true);
            frm.down('textfield[name=specification_type_id]').setVisible(true);
            frm.down('textfield[name=strength]').setVisible(true);
            frm.down('textfield[name=ingredientssi_unit_id]').setVisible(false);
            frm.down('textfield[name=altenative_name]').setVisible(false);
            frm.down('textfield[name=ing_processing]').setVisible(false);
            frm.down('textfield[name=ing_source]').setVisible(false);
            frm.down('textfield[name=cas_number]').setVisible(false);
            frm.down('textfield[name=inclusion_reason_id]').setVisible(true);
            frm.down('combo[name=atc_code_id]').setVisible(true);
           

        }else{
            frm.down('textfield[name=acceptance_id]').setVisible(true);
            frm.down('textfield[name=specification_type_id]').setVisible(true);
            frm.down('textfield[name=strength]').setVisible(true);
            frm.down('textfield[name=ingredientssi_unit_id]').setVisible(false);
            frm.down('textfield[name=altenative_name]').setVisible(false);
            frm.down('textfield[name=ing_processing]').setVisible(false);
            frm.down('textfield[name=ing_source]').setVisible(false);
            frm.down('textfield[name=cas_number]').setVisible(false);
            frm.down('textfield[name=inclusion_reason_id]').setVisible(true);
            frm.down('combo[name=atc_code_id]').setVisible(false);
            frm.down('fieldcontainer[name=atc]').setVisible(false);
        }

    },

    RegisteredFacilitygridDblClick: function (view, record)
    {
       var me = this,
           grid = view.grid,
           win = grid.up('window'),
           form=win.object_1,
           mainTabPanel = me.getMainTabPanel(),
           activeTab = mainTabPanel.getActiveTab(),
           application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
          
           mask = new Ext.LoadMask({
               msg: 'Please wait...',
               target: win
           });
           // console.log(application_code);
       mask.show();
        console.log(form);
       if (activeTab.down('pharmacyDetailsFrm')){
        form.down('hiddenfield[name=application_code]').setValue(application_code);
        form.down('hiddenfield[name=premise_id]').setValue(record.get('premise_id'));
        form.down('textfield[name=name]').setValue(record.get('name'));
        form.down('combo[name=country_id]').setValue(record.get('country_id'));
        form.down('combo[name=region_id]').setValue(record.get('region_id'));
        form.down('combo[name=district_id]').setValue(record.get('district_id'));
        form.down('textfield[name=email_address]').setValue(record.get('email'));
        form.down('textfield[name=physical_address]').setValue(record.get('physical_address'));
        form.down('textfield[name=postal_address]').setValue(record.get('postal_address'));
        form.down('textfield[name=telephone_no]').setValue(record.get('telephone'));
       }else{
        form.down('hiddenfield[name=application_code]').setValue(application_code);
        form.down('hiddenfield[name=premise_id]').setValue(record.get('premise_id'));
        form.down('textfield[name=name]').setValue(record.get('name'));
        form.down('combo[name=country_id]').setValue(record.get('country_id'));
        form.down('combo[name=region_id]').setValue(record.get('region_id'));
        form.down('combo[name=district_id]').setValue(record.get('district_id'));
        form.down('textfield[name=email_address]').setValue(record.get('email'));
        form.down('textfield[name=physical_address]').setValue(record.get('physical_address'));
        form.down('textfield[name=postal_address]').setValue(record.get('postal_address'));
        form.down('textfield[name=telephone_no]').setValue(record.get('telephone'));   
       }
       
       Ext.Function.defer(function () {
           mask.hide();
            win.close();
       }, 200);
        
    },
    addApplicationCodeProductIdtoComboInForm: function(form){
       var me = this,
            mainTabPanel = me.getMainTabPanel(),
            comboStr = form.down('combo[name=exemption_product_id]').getStore(),
            activeTab = mainTabPanel.getActiveTab();

        comboStr.removeAll();

        if(activeTab){
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            product_id = activeTab.down('hiddenfield[name=product_id]').getValue();
        }else{
            console.log('no active tab found');
        }
        if(application_code){
            comboStr.load({params: {application_code: application_code, product_id: product_id}});
        }else{
            toastr.error('Failed to fetch application details please resave the application', 'Error Response');
        }
    },

    prepareExemptionsProductId: function (activeTab, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var me = this
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue();
        if (sub_module_id ==75 || sub_module_id ==7) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'productregistration/prepareExemptionsProductId',
                params: {
                    application_code: application_code,
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
                        activeTab.down('hiddenfield[name=product_id]').setValue(results.product_id); 
                        if(activeTab.down('hiddenfield[name=product_id]')){
                            activeTab.down('hiddenfield[name=local_applicant_id]').setValue(results.local_agent_id);
                        }  
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
    


});

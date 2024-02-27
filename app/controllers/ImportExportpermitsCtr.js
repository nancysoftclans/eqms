/**
 * Created by softclans
 * user robinson odhiambo
 * on 9/22/2018.
 */
Ext.define('Admin.controller.ImportExportpermitsCtr', {
    extend: 'Ext.app.Controller',
    stores: [],
    config: {
        refs: [{
            ref: 'mainPanel',
            selector: 'maincontainerwrap'
        }, {
            ref: 'mainTabPanel',
            selector: '#contentPanel'
        },{
            ref: 'senderreceiverdetailsfrm',
            selector: 'senderreceiverdetailsfrm'
        },{
            ref: 'importexportpremisesfrm',
            selector: 'importexportpremisesfrm'
        },{
            ref: 'Importexportdetailsfrm',
            selector: 'Importexportdetailsfrm'
        },{
            ref: 'previewimportexportpermitdetails',
            selector: '#previewimportexportpermitdetails'
        }],
        control: {
            'onlineimportexportappsgrid': {
                refresh: 'refreshonlineimportexportappsgrid'
            },
            'importexportpermitsdashgrid': {
                refresh: 'refreshimportexportpermitsdashgrid'
            },
            
            'importexportcompletedpermitsdashgrid': {
                refresh: 'refreshimportexportcompletedpermitsdashgrid'
            },
            
            'previmportexportpermitreleasegrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'personalusepermitsproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'narcoticsdrugspermitsproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'importexportpermitsproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'portalImportExportProductsGrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'controldrugsimppermitsproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'portalControlDrugsPermitsProductsGrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },'controldrugslicensesproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'onlineordersupplydangerousgoodproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },'ordersupplydangerousgoodproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            
            'onlineimportexportpermitsproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'onlinecontrolledpermitsproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            
            'declaredonlineimportexportpermitsproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'disposaldestsupervisorsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'disposalpermitsproductsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },
            'registerednonregisteredprodgrid': {
                refresh: 'refreshregisterednonregisteredprodgrid'
            },
            'onlineimportexportdocuploadsgrid': {
                refresh: 'refreshonlineimportexportdocuploadsgrid'
            },
            'onlinedeclaredimportexportdocuploadsgrid': {
                refresh: 'refreshonlineimportexportdocuploadsgrid'
            },
          
            'foodimportexportpermitsdashgrid': {
                refresh: 'refreshimportexportpermitsdashgrid'
            },
            'drugsimportexportpermitsdashgrid':{
                refresh: 'refreshimportexportpermitsdashgrid'
            },
            'cosmeticsimportexportpermitsdashgrid':{
                refresh: 'refreshimportexportpermitsdashgrid'
            },'medicaldevimportexportpermitsdashgrid':{
                refresh: 'refreshimportexportpermitsdashgrid'
            },'declaredimportexportpermitsdashgrid':{
                refresh: 'refreshdeclaredimportexportpermitsdashgrid'
            },
            
            
            'senderreceiverinformationgrid': {
                refresh: 'refreshsenderreceiverinformationgrid'
            },
            'personaluserpermitsreceivingwizard':{
                afterrender: 'prepaprePersonalPermitsReceiving'
            },
            'importexportonlinereceivingwizard': {
                afterrender: 'prepapreImportExportOnlineReceiving'
            },'controldrugsimponlinereceivingwizard': {
                afterrender: 'prepapreImportExportOnlineReceiving'
            },'controldrugsliconlinereceivingwizard': {
                afterrender: 'prepapreImportExportOnlineReceiving'
            },'onlineordersupplydangerousgoodsreceiving': {
                afterrender: 'prepapreImportExportOnlineReceiving'
            },
            
            
            'declaredimportexportonlinereceivingwizard': {
                afterrender: 'prepapreDeclaredImportExportOnlineReceiving'
            },
            'permitdeclarationpreviewwizard': {
                afterrender: 'prepapreDeclaredImportExportOnlineReceiving'
            },
            
            'importexportreceivingpermitswizard': {
                    afterrender: 'prepapreImportExportReceiving'
            },
            // 'permitCancellationPnl': {
            //     afterrender: 'prepapreImportExportReceiving'
            // },
            'permitCancellationReceivingPnl': {
                afterrender: 'prepaprePermitCancellationReceiving'
        },
            'transitreceivingpermitswizard': {
                afterrender: 'prepapreTransitPermitReceiving'
            },
            'importreceivingamendmentpermitswizard': {
                    afterrender: 'prepapreImportExportReceiving'
            },
            'controlleddrugspermitsreceivingwizard': {
                afterrender: 'prepapreImportExportReceiving'
        }, 'ordersupplydangerousgoodsreceivingwizard': {
                afterrender: 'prepapreImportExportReceiving'
        },
        
            'importexportpermitmanagerreviewwizard': {
                    afterrender: 'prepapreImportExportManagerReview'
            },
            'controlleddrugsimpmanagerreviewwizrd': {
                afterrender: 'prepapreImportExportManagerReview'
        },'ordersupplydangerousgoodsapprovalwizard': {
            afterrender: 'prepapreImportExportManagerReview'
    },
        
            'importexportdeclaredpermitmanagerreviewwizard': {
                    afterrender: 'prepapreImportExportManagerReview'
            },
            'specialimportexportpermitapprovalwizard': {
                    afterrender: 'prepapreImportExportManagerReview'
            },
            
            //
            
            'specialimportexportpermitapprovalwizard button[name=process_submission_btn]': {
                click: 'showApplicationApprovalApplicationSubmissionWin'
            },
            'importexportpermitmanagerreviewwizard button[name=process_submission_btn]': {
                click: 'showManagerReviewApplicationSubmissionWin'
            },
            'controlleddrugsimpmanagerreviewwizrd button[name=process_submission_btn]': {
                click: 'showManagerReviewApplicationSubmissionWin'
            },
            'ordersupplydangerousgoodsapprovalwizard button[name=process_submission_btn]': {
                click: 'showManagerReviewApplicationSubmissionWin'
            },

            
            'importexportpermitmanagerreviewwizard button[name=process_tradersubmission_btn]': {
                click: 'showManagerReviewApplicationTraderSubmissionWin'
            },
            
            'importexportpermitmanagerreviewwizard button[name=returnback_submission_btn]': {
                click: 'showReturnBackApplicationSubmissionWin'
            },'importexportpermitmanagerreviewwizard button[name=review_recommendation]': {
                click: 'showManagerReviewRecommendationWin'
            },
            
            'ordersupplydangerousgoodsapprovalwizard button[name=review_recommendation]': {
                click: 'showManagerReviewRecommendationWin'
            },
            'importexportdeclaredpermitmanagerreviewwizard button[name=review_recommendation]': {
                click: 'showManagerReviewRecommendationWin'
            }, 'controlleddrugsimpmanagerreviewwizrd button[name=review_recommendation]': {
                click: 'showManagerReviewRecommendationWin'
            },
            'importexportdeclaredpermitmanagerreviewwizard button[name=process_submission_btn]': {
                click: 'showManagerReviewApplicationSubmissionWin'
            },
            'importexportdeclaredpermitmanagerreviewwizard button[name=process_tradersubmission_btn]': {
                click: 'showManagerReviewApplicationTraderSubmissionWin'
            },
            'controlleddrugsimpmanagerreviewwizrd button[name=process_tradersubmission_btn]': {
                click: 'showManagerReviewApplicationTraderSubmissionWin'
            }, 'ordersupplydangerousgoodsapprovalwizard button[name=process_tradersubmission_btn]': {
                click: 'showManagerReviewApplicationTraderSubmissionWin'
            },
            
            'ordersupplydangerousgoodsapprovalwizard button[name=returnback_submission_btn]': {
                click: 'showReturnBackApplicationSubmissionWin'
            },
            'controlleddrugsimpmanagerreviewwizrd button[name=returnback_submission_btn]': {
                click: 'showReturnBackApplicationSubmissionWin'
            },
            'importexportdeclaredpermitmanagerreviewwizard button[name=returnback_submission_btn]': {
                click: 'showReturnBackApplicationSubmissionWin'
            },
            
            /*
            'importexportdeclaredpermitmanagerreviewwizard button[name=review_recommendation]': {
                click: 'showManagerReviewRecommendationWin'
            },
*/
            
            'specialimportexportpermitapprovalwizard button[name=review_recommendation]': {
                click: 'showSpecialImpExpApprovalWin'
            },
            
            'onlinedisposalapplicationswizard':{
                afterrender: 'prepapreDisposalOnlineReceiving'
            },
            'importexportpermitstb button[name=permithome_btn]': {
                click: 'importexportPermitHome'
            },'importexportapplicantdetailsfrm button[action=link_applicant]': {
                click: 'showApplicantSelectionList'
            },'importexppermitapplicantselectiongrid': {
                itemdblclick: 'onPermitApplicantSelectionListDblClick' 
            },'importexportpremisesfrm button[action=search_premise]': {
                click: 'showImpPremiseSelectionList'
            },'importexportpermitsproductsfrm button[action=btn_savepermitproducts]': {
                click: 'onSavePermitProductsDetails'
            },'narcoticsdrugspermitsproductsfrm button[action=btn_savepermitproducts]': {
                click: 'onSavePermitProductsDetails'
            },'personalusepermitsproductsfrm button[action=btn_savepermitproducts]': {
                click: 'onSavePermitProductsDetails'
            },
            'controldrugslicensessproductsfrm button[action=btn_savepermitproducts]': {
                click: 'onSavePermitProductsDetails'
            },  'controldrugsimppermitsproductsfrm button[action=btn_savepermitproducts]': {
                click: 'onSavePermitProductsDetails'
            },
            'ordersupplydangerousgoodproductsfrm button[action=btn_savepermitproducts]': {
                click: 'onSavePermitProductsDetails'
            },'ordersupplydangerousgoodproductsfrm button[action=btn_savepermitproducts]': {
                click: 'onSavePermitProductsDetails'
            },
            
            'btn_savepermitproducts button[action=btn_savepermitproducts]': {
                click: 'onSavePermitProductsDetails'
            },
            'registeredpremisesdetailsgrid': {
                itemdblclick: 'onPremiseImpSelectionListDblClick'
            },'senderreceiverdetailsfrm button[action=link_applicant]': {
                click: 'showImpSenderReceiverlectionList'
            },'senderreceiverinformationgrid': {
                itemdblclick: 'onSenderreceiverinformationDLBClick'
            },'importexportpermitevaluationpnl': {
                afterrender: 'prepareImportExportPermitEvaluationPnl'
            },'importexportpermitevaluationpnl button[name=more_app_details]': {
                click: 'showPermitApplicationMoreDetails'
            },'controldrugsimpevaluationpnl': {
                afterrender: 'prepareImportExportPermitEvaluationPnl'
            },'ordersupplydangerousgoodscreening': {
                afterrender: 'prepareImportExportPermitEvaluationPnl'
            },

            
            'importexportevaluationpnl': {
                afterrender: 'prepareImportExportPermitEvaluationPnl'
            },
            // 'permitCancellationReceivingPnl': {
            //     afterrender: 'prepareImportExportPermitEvaluationPnl'
            // },
            'controldrugsimpevaluationpnl button[name=more_app_details]': {
                click: 'showPermitApplicationMoreDetails'
            },
           
            'importexportevaluationpnl button[name=more_app_details]': {
                click: 'showPermitApplicationMoreDetails'
            },
            
            'importpermitinvoicingpanel form toolbar button[name=more_app_details]': {
                click: 'showPermitApplicationMoreDetails'
            },
           
            'importpermitinvoicingpanel form toolbar button[name=more_app_details]': {
                click: 'showPermitApplicationMoreDetails'
            },
            'importexportpermitreceiptingpnl form toolbar button[name=more_app_details]': {
                click: 'showPermitApplicationMoreDetails'
            },
            'controlleddrugspaymentverificationpnl form toolbar button[name=more_app_details]': {
                click: 'showPermitApplicationMoreDetails'
            },
            
            
            'importexportpermitevaluationpnl button[name=process_submission_btn]': {
                click: 'showPermitEvaluationApplicationSubmissionWin'
            },
            'controldrugsimpevaluationpnl button[name=process_submission_btn]': {
                click: 'showPermitEvaluationApplicationSubmissionWin'
            },
            'ordersupplydangerousgoodscreening button[name=process_submission_btn]': {
                click: 'showPermitEvaluationApplicationSubmissionWin'
            },
            
            'importexportevaluationpnl button[name=process_submission_btn]': {
                click: 'showPermitEvaluationApplicationSubmissionWin'
            },
            'disposalpermitevaluationpnl button[name=process_submission_btn]': {
                click: 'showDisposalPermitEvaluationApplicationSubmissionWin'
            },
            'applicationpermitsdeclarationsdash button[action=returns_submission_btn]': {
                click: 'showPermitReturnSubmissionWin'
            },
            'importpermitinvoicingpnl': {
                afterrender: 'prepareNewImportsInvoicing'
            },
            'importpermitinvoicingpnl toolbar[name=invoicing_details]': {
                afterrender: 'prepareImportsInvoicingOtherDetails'
            },

            'importpermitdeclarationinvoicingpnl': {
                afterrender: 'prepareNewImportsInvoicing'
            },
            'importpermitdeclarationinvoicingpnl toolbar[name=invoicing_details]': {
                afterrender: 'prepareImportsInvoicingOtherDetails'
            },
            
            'importexportpermitreceiptingpnl': {
                afterrender: 'prepareNewImportExportPayments'
            },
            'controlleddrugspaymentverificationpnl': {
                afterrender: 'prepareNewImportExportPayments'
            },
            'importexportpermitapprovalwizard': {
                    afterrender: 'prepapreImportExportManagerReview'
            },  'importexportpermitreleasepnl': {
                afterrender: 'prepapareImportpermitUniformStage'
            },
            'controlleddrugsimppermitreleasepnl': {
                afterrender: 'prepapareImportpermitUniformStage'
            },
            
            'ordersupplydangerousgoodsprintingpnl': {
                afterrender: 'prepapareImportpermitUniformStage'
            },
            
            
            'importexportmanagersubmissionpnl': {
                afterrender: 'prepapareImportpermitUniformStage'
            },'importexportpermitreleasegrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },'ordersupplydangerousgoodsprintinggrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },
            'importexportpermitreleaseapprovalgrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },
            'permitCancellationApprovalGrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },
            'importexportpermitmanagersubgrid': {
                refresh: 'importpermitApplicationsSubmissionGridRefresh'
            },
            'narcoticdrugspermitreleasegrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },
            'hospitalcontroldrugspermitreleasegrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },'narcoticsdrugspermitapprovalgrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },
            'hospitalcontroldrugspermitapprovalgrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },
            'importexportreviewrecommfrm button[name=save_recommendation]': {
                click: 'saveImportAppReviewRecommendationDetails'
            },
            'permitCancellationRecommFrm button[name=save_recommendation]': {
                click: 'savePermitCancellationRecommendationDetails'
            },
            
            'importexportpermitmanagerreviewgrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },'narcoticsdrugspermitapproval': {
                refresh: 'importpermitApplicationsGridRefresh'
            },'importexportqueryverificationgrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },'disposalpermitsqueryverificationgrid': {
                refresh: 'importpermitApplicationsGridRefresh'
            },   'importexportpermitmanagerreviewpnl': {
                afterrender: 'prepapareImportpermitUniformStage'
            },
            'permitdeclarationmanagerreviewpnl': {
                afterrender: 'prepapreImportExportManagerReview'
            },
            'exportpermitinvoicingpnl': {
                afterrender: 'prepareNewImportsInvoicing'
            },'impexppermitsmanagerevaluationgrid': { 
                refresh: 'importpermitApplicationsGridRefresh'
            },'controldrugsimpmanagerevaluationgrid': { 
                refresh: 'importpermitApplicationsGridRefresh'
            },
            'specialcaseapplicationapprovalgrid': { 
                refresh: 'importpermitApplicationsGridRefresh'
            } , 'specialcaseapplicationapprovalpnl': {
                afterrender: 'prepapareImportpermitUniformStage'
            },'disposalpermitmangereviewgrid': { 
                refresh: 'importpermitApplicationsGridRefresh'
            },
            'disposalapplicationsdashgrid':{
                refresh: 'refreshimportexportpermitsdashgrid'
            },'disposalpermitverificationpnl': {
                afterrender: 'prepapareDisposalVerificationUniformStage'
            },'disposalpermitevaluation': {
                afterrender: 'prepapareDisposalEvaluationUniformStage'
            },
            
            
            'disposaldestsupervisorsgrid': {
                refresh: 'refreshimportexportpermitsproductsgrid'
            },'pardisposalinternalsupervisorsfrm button[name=savesupervisors]': {
                click: 'onSaveDisposalinternalsupervisorsfrm'
            },'pardisposalexternalsupervisorsfrm button[name=savesupervisors]': {
                click: 'onSaveDisposalinternalsupervisorsfrm'
            },'disposalpermitverification button[action=process_submission_btn]': {
                click: 'showDisposalPermitDisposalSubmissionWin'
            },'disposalpermitverificationpnl button[action=process_submission_btn]': {
                click: 'showDisposalPermitDisposalSubmissionWin'
            },'disposalapplicantselectiongrid': {
                itemdblclick: 'onDisposalPermitApplicantSelectionListDblClick' 
            },'disposalpermitstb button[name=disposalpermitstbRegHomeBtn]': {
                click: 'permitsRegHome'
            },
            'poeinspectionprocesstb button[name=poepermitstbRegHomeBtn]': {
                click: 'poepermitsRegHome'
            },
            'importexportpersonaluserpermitstb button[name=permitstbRegHomeBtn]': {
                click: 'personalUsepermitsRegHome'
            },
            'controlleddrugslicensepermitstb button[name=poepermitstbRegHomeBtn]': {
                click: 'hfdpermitsRegHome'
            },
            
            'hospitalpermitsdruncontrreceivingpermitswizard': {
                afterrender: 'prepapreControlledDrugsPermitsReceiving'
             }, 
            'controlleddrugsreceivingpermitswizard': {
                afterrender: 'prepapreControlledDrugsPermitsReceiving'
             }, 
             'controlleddrugslicensesreceiving': {
                afterrender: 'prepapreControlledDrugsPermitsReceiving'
             }, 
            'disposalapplicationswizard': {
                afterrender: 'prepapreDisposalReceiving'
             },      'disposalpermitsproductsfrm button[action=btn_savepermitproducts]': {
                    click: 'onSavePermitProductsDetails'
                },   
                'disposalpermitsinvoicingpnl': {
                    afterrender: 'prepareNewDisposalPaermitssInvoicing'
                },  'disposalpermitreceiptingpnl': {
                      afterrender: 'prepareNewDisposalPayments'
                },'disposalpermitsinvoicingpnl toolbar[name=invoicing_details]': {
                    afterrender: 'prepareDisposalInvoicingOtherDetails'
                },'specialcaseimpexpapprovalpnlgrid': {
                    refresh: 'importpermitApplicationsGridRefresh'
                },
                'inspectionimportexportspermitgrid': {
                    refresh: 'refreshinspectionimportexportspermitgrid'
                },'previousinspectionsgrid': {
                    refresh: 'refreshpreviousinspectionsgrid'
                },
                'poeinspectionpermitsproductsgrid': {
                    refresh: 'refreshpoeinspectionpermitsproductsgrid'
                },
                'declaredpoeinspectionpermitsproductsgrid': {
                    refresh: 'refreshpoeinspectionpermitsproductsgrid'
                },

                'inspectionimportexportspermitgrid': {
                    itemdblclick: 'inspectionimportexportspermitgridDblClick' 
                },
                'poeinspectionprocessdashgrid': {
                    refresh: 'refreshpoeinspectionprocessdashgrid'
                },'receivingpoeinspectionswizard': {
                        afterrender: 'prepareReceivingpoeinspectionswizard'
                },'receivingpoeConsumptioninspectionswizard': {
                        afterrender: 'prepareReceivingpoeConsignmentInspectionswizard'
                },'poeinspectionpermitsproductsgrid button[name=update_products]': {
                    click: 'funcSavePOEPermitProductDetails'
                },'poeinspectionpermitsproductsgrid button[name=update_allproducts]': {
                    click: 'funcSaveAllPOEPermitProductDetails'
                },'declaredpoeinspectionpermitsproductsgrid button[name=update_products]': {
                    click: 'funcSavePOEPermitProductDetails'
                },'declaredpoeinspectionpermitsproductsgrid button[name=update_allproducts]': {
                    click: 'funcSaveAllPOEPermitProductDetails'
                },
                
                
                'poeinspectionrecommendationfrm button[name=save_recommendation]': {
                    click: 'funcsavePOEPermitRecommendations'
                },'poeinspectionverificationfrm button[name=save_recommendation]': {
                    click: 'funcsavePOEPermitVerificationRecommendations'
                },
            'clearedconsigmentpermitsproductsdashgrid': {
                refresh: 'refreshclearedconsigmentpermitsproductsdashgrid'
            } ,

            'inspectedpoepermitsdashgrid': {
                    refresh: 'refreshinspectedpoepermitsdashgrid'
                } , 
                'inspectedpoepermitsproductsdashgrid': {
                    refresh: 'refreshinspectedpoepermitsdashgrid'
                } ,
                
                'impexppermitsmanagerevaluationgrid button[action=process_submission_btn]': {
                    click: 'showManagerApplicationSubmissionWin'
                },
                'importexportmanagersubmissionpnl button[action=process_submission_btn]': {
                    click: 'showManagerApplicationSubmissionWin'
                },
                'permitCancellationApprovalWizard button[action=process_submission_btn]': {
                    click: 'showManagerApplicationSubmissionWin'
                }, 
                'controldrugsimpmanagerevaluationgrid button[action=process_submission_btn]': {
                    click: 'showManagerApplicationSubmissionWin'
                },
                // 'permitCancellationReceivingPnl button[action=processreceiving_submission_btn]': {
                //     click: 'showManagerApplicationSubmissionWin'
                // },
                'drugsimportexportpermitstb button[name=disposalpermitstbRegHomeBtn]': {
                    click: 'importpermitsRegHome'
                },
                'permitvariationrequestsgrid': {
                    refresh: 'refreshvariationGrid'
                },
                'permitVariationFrm': {
                    afterrender: 'prepareVariationForm'
                },
                
        }
    },
    init: function () {

        
    },
    listen: {
        controller: {
            '*': {
               showImportExportPermitRegWorkflow:'showImportExportPermitRegWorkflow',
               showImportPermitApplication:'showImportPermitApplication',
               getImportpermitApplicationApprovalDetails:'getImportpermitApplicationApprovalDetails',
               getPermitReleaseRecommendationDetails:'getPermitReleaseRecommendationDetails',
                 showImpExpReceivingApplicationSubmissionWin: 'showImpExpReceivingApplicationSubmissionWin',
                showTransitPermitReceivingApplicationSubmissionWin:'showTransitPermitReceivingApplicationSubmissionWin',
                showDisposalReceivingApplicationSubmissionWin:'showDisposalReceivingApplicationSubmissionWin',
                showPermitCancellationReceivingApplicationSubmissionWin:'showPermitCancellationReceivingApplicationSubmissionWin',
                 savePermitInformation: 'savePermitInformation',
                 editpreviewNarcoticsPermitinformation:'editpreviewNarcoticsPermitinformation',
                 editpreviewPermitinformation: 'editpreviewPermitinformation',
                 
                 editpreviewPermitQueryinformation:'editpreviewPermitQueryinformation',
                 editpreviewDisposalQueryinformation:'editpreviewDisposalQueryinformation',
                 editDisposalpreviewPermitinformation:'editDisposalpreviewPermitinformation',
                 editpreviewPermitVerificationinformation:'editpreviewPermitVerificationinformation',
                 productPreviewEditDisposalDetails:'productPreviewEditDisposalDetails',
                 showNewDisposalApplications:'showNewDisposalApplications',
                 showAddPermitsOtherdetailsWinFrm: 'showAddPermitsOtherdetailsWinFrm',
                 onshowNewImportExportPOEInspection:'onshowNewImportExportPOEInspection',
                 onInitializeControlledDrugsImpPermits:'onInitializeControlledDrugsImpPermits',
                 onshowPersonalUsePermitsDeclaration:'onshowPersonalUsePermitsDeclaration',
                 onViewDeclaredPermitApplication:'onViewDeclaredPermitApplication',
                 previewImpExpOnlineApplication:'previewImpExpOnlineApplication',
                 previewControlDrugsOnlineApplication:'previewControlDrugsOnlineApplication',
                 previewDeclarationImpExpOnlineApplication:'previewDeclarationImpExpOnlineApplication',
                 previewOnlineDisposalApplication:'previewOnlineDisposalApplication',
                 onInitiateImportExportApplication: 'onInitiateImportExportApplication',
                 onInitiatePermitReturnsApplication: 'onInitiatePermitReturnsApplication',
                 onInitiateImportExportApplicationammendment:'onInitiateImportExportApplicationammendment',
                 previewPreviousDeclaredImpExpApplication:'previewPreviousDeclaredImpExpApplication',
                 onApprovedPermitSelectedApplication:'onApprovedPermitSelectedApplication',
                 funcSavePOEApplication: 'funcSavePOEApplication',
                 funcSavePOEConsumptionApplication: 'funcSavePOEConsumptionApplication',
                 showReceivingPoeApplicationSubmissionWin: 'showReceivingPoeApplicationSubmissionWin',
                 verifyHFDProductCount: 'verifyHFDProductCount',
                 loadPermitApprovalReleaseForm: 'loadPermitApprovalReleaseForm',
                 onInitiateImportExportCancellationApplication:'onInitiateImportExportCancellationApplication',
                 loadSelectedPermitDetails:'loadSelectedPermitDetails',
            }
        }
    }, onApprovedPermitSelectedApplication:function(view,record){

        var mainTabPanel = this.getMainTabPanel(),
             activeTab = mainTabPanel.getActiveTab(), 
             wrapper = activeTab.down('importreceivingamendmentpermitswizard'),
            app_pnl = wrapper.down('importexportdetailspnl'),
            app_form = app_pnl.down('importexportdetailsfrm'),
            sender_receiver_frm = wrapper.down('senderreceiverdetailsfrm'),
            applicant_form = wrapper.down('importexportapplicantdetailsfrm'),
            premise_frm = app_pnl.down('importexportpremisesfrm'),
            grid = view.up('grid');
           
        //load applicant form details
        Ext.getBody().mask('loading...');
        Ext.Ajax.request({
                    url: "importexportpermits/getSenderreceiverinformation",
                    method: 'GET',
                    params: {
                        applicant_id: record.get('sender_receiver_id'),
                        start: 0,
                        limit: 1000
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                       
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        if (success == true || success === true) {
                            var model = Ext.create('Ext.data.Model', resp.results[0]);
                             
                           sender_receiver_frm.loadRecord(model);
                        } else {
                            toastr.error(message, 'Failure Response');
                            var model = Ext.create('Ext.data.Model', []);
                            return model;
                        }
                    },
                    failure: function (response) {
                        
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                        var model = Ext.create('Ext.data.Model', []);
                        return model;
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      
                        toastr.error('Error fetching data: ' + errorThrown, 'Error Response');
                        var model = Ext.create('Ext.data.Model', []);
                        return model;
                    }
                });
       Ext.Ajax.request({
                    url: "importexportpermits/getTraderRegisteredPremisesDetails",
                    method: 'GET',
                    params: {
                        premise_id: record.get('premise_id'),
                        applicant_id: record.get('applicant_id'),
                        start: 0,
                        limit: 1000
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                       
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        if (success == true || success === true) {
                            var model = Ext.create('Ext.data.Model', resp.results[0]);
                               
                           premise_frm.loadRecord(model);
                        } else {
                            toastr.error(message, 'Failure Response');
                            
                        }
                    },
                    failure: function (response) {
                        
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                        
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      
                        toastr.error('Error fetching data: ' + errorThrown, 'Error Response');
                       
                    }
                });
        //remove sub_module_id
       delete(record.data.sub_module_id);
        app_form.loadRecord(record);
        applicant_form.loadRecord(record);
        activeTab.getViewModel().set('model', record);
        // app_pnl.down('combo[name=branch_id]').setValue(record.get('branch_id'));
        wrapper.down('hiddenfield[name=active_application_code]').setValue(record.get('application_code'));
        activeTab.down('hiddenfield[name=importexport_permittype_id]').setValue(record.get('importexport_permittype_id'));
        activeTab.down('hiddenfield[name=section_id]').setValue(record.get('section_id'));
        wrapper.down('textfield[name=reference_no]').setValue(record.get('reference_no'));
        // wrapper.down('hiddenfield[name=active_application_id]').setValue(record.get('application_id'));
       
        wrapper.down('hiddenfield[name=sub_module_id]').setValue(73);
        // wrapper.down('hiddenfield[name=process_id]').setValue(record.get('process_id'));
        app_form.down('hiddenfield[name=id]').setValue();
        Ext.getBody().unmask();
        grid.up('window').close();


    }, previewOnlineDisposalApplication: function (view, record) {
        var ref_no = record.get('reference_no'),
            application_id = record.get('active_application_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            status_type_id = record.get('status_type_id'),
            isRejection= record.get('status_type_id'),
            grid = view.up('grid'),
            
            application_code = record.get('application_code'),
            onlinePanel = Ext.widget('onlinedisposalapplicationswizard');

            onlinePanel.down('hiddenfield[name=active_application_code]').setValue(application_code);
            onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
            onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
            onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

            onlinePanel.down('hiddenfield[name=active_application_id]').setValue(application_id);
            onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
            onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);

            onlinePanel.down('hiddenfield[name=status_type_id]').setValue(status_type_id);
              
            
            docsGrid = onlinePanel.down('onlineimportexportdocuploadsgrid');
            docsGrid.down('hiddenfield[name=application_code]').setValue(application_code);
            docsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
            docsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
            docsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

         
            funcShowCustomizableWindow(ref_no, '80%', onlinePanel, 'customizablewindow');

            onlinePanel.getViewModel().set('isReadOnly', true);

    },
    onInitiateImportExportApplication: function (sub_module_id,importexport_permittype_id,btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
        is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#importexportpermitsappswrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, '', sub_module_id,is_dataammendment_request,'',importexport_permittype_id);

        if (!workflow_details) {
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
        workflowContainer.down('hiddenfield[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
        workflowContainer.down('combo[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
        dashboardWrapper.add(workflowContainer);
        dashboardWrapper.down('premisedetailscmnfrm').down('button[action=search_premise]').enable();
        //reload Stores prepareImportExporPermitReceivingStage 
       
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
    onInitiateImportExportCancellationApplication: function (sub_module_id,importexport_permittype_id,btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
        is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#importexportpermitsappswrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, '', sub_module_id,is_dataammendment_request,'',importexport_permittype_id);
         
        if (!workflow_details) {
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
        workflowContainer.down('hiddenfield[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
        workflowContainer.down('combo[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
        dashboardWrapper.add(workflowContainer);
        dashboardWrapper.down('premisedetailscmnfrm').down('button[action=search_premise]').enable();
        //reload Stores prepareImportExporPermitReceivingStage 
        
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

    onInitiatePermitReturnsApplication: function (sub_module_id,importexport_permittype_id,btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#importexportpermitsappswrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, '', sub_module_id,is_dataammendment_request,'',importexport_permittype_id);

        if (!workflow_details) {
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
        workflowContainer.down('hiddenfield[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
        dashboardWrapper.add(workflowContainer);
        dashboardWrapper.down('premisedetailscmnfrm').down('button[action=search_premise]').enable();
        //reload Stores prepareImportExporPermitReceivingStage
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
    onInitiateImportExportApplicationammendment: function (sub_module_id,importexport_permittype_id,btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
        is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#importexportpermitsappswrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, '', sub_module_id,is_dataammendment_request,'',importexport_permittype_id,'',7);

        if (!workflow_details) {
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
        workflowContainer.down('hiddenfield[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
        workflowContainer.down('combo[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
        dashboardWrapper.add(workflowContainer);
        
        //dashboardWrapper.down('premisedetailscmnfrm').down('button[action=search_premise]').enable();
        //reload Stores prepareImportExporPermitReceivingStage 
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

    },
    
    previewDeclarationImpExpOnlineApplication:function(view,record){

        var ref_no = record.get('reference_no'),
        application_id = record.get('active_application_id'),
        module_id = record.get('module_id'),
        sub_module_id = record.get('sub_module_id'),
        section_id = record.get('section_id'),
        status_type_id = record.get('status_type_id'),
        isRejection= record.get('isRejection'),
        wizard_pnl = 'declaredimportexportonlinereceivingwizard', 
        
        application_code = record.get('application_code'),
        onlinePanel = Ext.widget(wizard_pnl);

        onlinePanel.down('hiddenfield[name=active_application_code]').setValue(application_code);
        onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
        onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
        onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

        onlinePanel.down('hiddenfield[name=active_application_id]').setValue(application_id);
        onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
        onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
        
        onlinePanel.down('button[action=link_applicant]').setDisabled(true);
        onlinePanel.down('hiddenfield[name=status_type_id]').setValue(status_type_id);
        if (status_type_id != 1) {
            onlinePanel.down('button[name=preview_queries_btn]').setVisible(false);
        }
        
        if (isRejection == 1) {
            onlinePanel.down('button[name=prev_rejections]').setVisible(true);
            onlinePanel.down('button[name=actions]').setVisible(true);
            onlinePanel.down('button[name=receive_btn]').setVisible(false);
            onlinePanel.down('button[name=query_btn]').setVisible(false);
            onlinePanel.down('button[name=reject_btn]').setVisible(false);
        }   
        
        docsGrid = onlinePanel.down('declaredimportexportdocuploadsgrid');
        docsGrid.down('hiddenfield[name=application_code]').setValue(application_code);
        docsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
        docsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
        docsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

        docsGrid.portal_uploads =3;
        funcShowCustomizableWindow(ref_no, '80%', onlinePanel, 'customizablewindow');

        onlinePanel.getViewModel().set('isReadOnly', true);
    },
    previewControlDrugsOnlineApplication: function (view, record) {
            
        var ref_no = record.get('reference_no'),
        application_id = record.get('active_application_id'),
        module_id = record.get('module_id'),
        sub_module_id = record.get('sub_module_id'),
        section_id = record.get('section_id'),
        status_type_id = record.get('status_type_id'),
        process_id = record.get('process_id'),
        isRejection= record.get('isRejection');

        if(sub_module_id == 60){
            wizard_pnl = 'controldrugsliconlinereceivingwizard';
        }
        else if(sub_module_id == 71){
            wizard_pnl = 'onlineordersupplydangerousgoodsreceiving';
        }
        else{
            wizard_pnl = 'controldrugsimponlinereceivingwizard';
        }
       
        application_code = record.get('application_code');

        onlinePanel = Ext.widget(wizard_pnl);

        onlinePanel.down('hiddenfield[name=active_application_code]').setValue(application_code);
        onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
        onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
        onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

        onlinePanel.down('hiddenfield[name=active_application_id]').setValue(application_id);
        onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
        onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
        onlinePanel.down('hiddenfield[name=process_id]').setValue(process_id);
        
        onlinePanel.down('button[action=link_applicant]').setDisabled(true);
        onlinePanel.down('hiddenfield[name=status_type_id]').setValue(status_type_id);
      
        docsGrid = onlinePanel.down('onlineimportexportdocuploadsgrid');
        docsGrid.down('hiddenfield[name=application_code]').setValue(application_code);
        docsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
        docsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
        docsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

    
        funcShowCustomizableWindow(ref_no, '80%', onlinePanel, 'customizablewindow');

        onlinePanel.getViewModel().set('isReadOnly', true);

},
     previewImpExpOnlineApplication: function (view, record) {
        
            var ref_no = record.get('reference_no'),
            application_id = record.get('active_application_id'),
            module_id = record.get('module_id'),
            sub_module_id = record.get('sub_module_id'),
            section_id = record.get('section_id'),
            process_id = record.get('process_id'),
            status_type_id = record.get('status_type_id'),
            isRejection= record.get('isRejection'),
            wizard_pnl = 'importexportonlinereceivingwizard', 
            
            application_code = record.get('application_code'),
            onlinePanel = Ext.widget(wizard_pnl);

            onlinePanel.down('hiddenfield[name=active_application_code]').setValue(application_code);
            onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
            onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
            onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

            onlinePanel.down('hiddenfield[name=active_application_id]').setValue(application_id);
            onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
            onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
            onlinePanel.down('hiddenfield[name=process_id]').setValue(process_id);
            
            onlinePanel.down('button[action=link_applicant]').setDisabled(true);
            onlinePanel.down('hiddenfield[name=status_type_id]').setValue(status_type_id);
            
            
            docsGrid = onlinePanel.down('onlineimportexportdocuploadsgrid');
            docsGrid.down('hiddenfield[name=application_code]').setValue(application_code);
            docsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
            docsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
            docsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

         
            funcShowCustomizableWindow(ref_no, '80%', onlinePanel, 'customizablewindow');

            onlinePanel.getViewModel().set('isReadOnly', true);

    },
    onViewDeclaredPermitApplication: function ( record) {
        
        var ref_no = record.get('reference_no'),
        application_id = record.get('active_application_id'),
        module_id = record.get('module_id'),
        sub_module_id = record.get('sub_module_id'),
        section_id = record.get('section_id'),
        status_type_id = record.get('status_type_id'),
        isRejection= record.get('isRejection'),
        
        wizard_pnl = 'permitdeclarationpreviewwizard', //
        
        application_code = record.get('application_code'),
        onlinePanel = Ext.widget(wizard_pnl);
        if(application_code < 1){
            Ext.getBody().unmask();
            toastr.warning("The selected Permit declaration application, hasn't been processes, contact the system admin for enquiry.", 'Warning Response');
            return;
        }

        onlinePanel.down('hiddenfield[name=active_application_code]').setValue(application_code);
        onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
        onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
        onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

        onlinePanel.down('hiddenfield[name=active_application_id]').setValue(application_id);
        onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
        onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
        
        onlinePanel.down('button[action=link_applicant]').setDisabled(true);
        onlinePanel.down('hiddenfield[name=status_type_id]').setValue(status_type_id);
        if (status_type_id != 1) {
          //  onlinePanel.down('button[name=preview_queries_btn]').setVisible(false);
        }
        
        if (isRejection == 1) {
            onlinePanel.down('button[name=prev_rejections]').setVisible(true);
            onlinePanel.down('button[name=actions]').setVisible(true);
            onlinePanel.down('button[name=receive_btn]').setVisible(false);
            onlinePanel.down('button[name=query_btn]').setVisible(false);
            onlinePanel.down('button[name=reject_btn]').setVisible(false);
        }   
        
        docsGrid = onlinePanel.down('onlineimportexportdocuploadsgrid');
        docsGrid.down('hiddenfield[name=application_code]').setValue(application_code);
        docsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
        docsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
        docsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

     
        funcShowCustomizableWindow(ref_no, '80%', onlinePanel, 'customizablewindow');

        onlinePanel.getViewModel().set('isReadOnly', true);

},
previewPreviousDeclaredImpExpApplication: function (view, record) {
        
    var ref_no = record.reference_no,
    application_id = record.active_application_id,
    module_id = record.module_id,
    sub_module_id = record.sub_module_id,
    section_id = record.get('section_id'),
    status_type_id = record.status_type_id,
    wizard_pnl = 'importexportonlinereceivingwizard', 
    
    application_code = record.application_code,
    onlinePanel = Ext.widget(wizard_pnl);

    onlinePanel.down('hiddenfield[name=active_application_code]').setValue(application_code);
    onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
    onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
    onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

    onlinePanel.down('hiddenfield[name=active_application_id]').setValue(application_id);
    onlinePanel.down('hiddenfield[name=module_id]').setValue(module_id);
    onlinePanel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
    onlinePanel.down('hiddenfield[name=section_id]').setValue(section_id);
    
    onlinePanel.down('button[action=link_applicant]').setDisabled(true);

    docsGrid = onlinePanel.down('onlineimportexportdocuploadsgrid');
    docsGrid.down('hiddenfield[name=application_code]').setValue(application_code);
    docsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
    docsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
    docsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);

 
    funcShowCustomizableWindow(ref_no, '80%', onlinePanel, 'customizablewindow');

    onlinePanel.getViewModel().set('isReadOnly', true);

},
    onshowPersonalUsePermitsDeclaration:function(sub_module_id){
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#permitsdashwrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            
        dashboardWrapper.removeAll();
        var workflowContainer = Ext.widget('personaluserpermitsreceiving');
        workflowContainer.down('displayfield[name=process_name]').setValue('Personal Use Permits Declaration');
        workflowContainer.down('displayfield[name=workflow_stage]').setValue('Permit Declaration');
      
        workflowContainer.down('hiddenfield[name=module_id]').setValue(4);
        
        dashboardWrapper.add(workflowContainer);
        workflowContainer.getViewModel().set('isReadOnly', false);
                       
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);

    },
    onInitializeControlledDrugsImpPermits: function (sub_module_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#permitsdashwrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            filter = {section_id: section_id};
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
            workflowContainer.down('displayfield[name=application_status]').setValue(workflow_details.applicationStatus);
            workflowContainer.down('hiddenfield[name=process_id]').setValue(workflow_details.processId);
            workflowContainer.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_details.initialStageId);
            workflowContainer.down('hiddenfield[name=module_id]').setValue(module_id);
            workflowContainer.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            workflowContainer.down('hiddenfield[name=section_id]').setValue(section_id);
            workflowContainer.down('hiddenfield[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
            workflowContainer.down('combo[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);

            dashboardWrapper.add(workflowContainer);
            workflowContainer.getViewModel().set('isReadOnly', false);
                        
            Ext.Function.defer(function () {
                Ext.getBody().unmask();
            }, 300);
    },
    onshowNewImportExportPOEInspection: function (sub_module_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#poeinspectionprocessdashwrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        workflow_details = getInitialWorkflowDetails(module_id, '', sub_module_id);

        if (!workflow_details) {
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


        // workflowContainer.down('hiddenfield[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
        // workflowContainer.down('combo[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
       
        dashboardWrapper.add(workflowContainer);
        if(sub_module_id == 97){
            workflowContainer.down('hiddenfield[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
            workflowContainer.down('combo[name=importexport_permittype_id]').setValue(workflow_details.importexport_permittype_id);
        }else{
             workflowContainer.getViewModel().set('isReadOnly', true);
        }
        //set grid to POE
        importexportpermitsproductsgrid = workflowContainer.down('importexportpermitsproductsgrid');
        if(importexportpermitsproductsgrid){
            importexportpermitsproductsgrid.is_poe = 1;
        }
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    permitsRegHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#disposalapplicationsdashwrapper');
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
    },
    importpermitsRegHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#drugsimportexportpermitsappsWrapper');
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
    },
     poepermitsRegHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#poeinspectionprocessdashwrapper');
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
    }, personalUsepermitsRegHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#importexportpersonaluserpermitsdashwrapper');
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
    },
    hfdpermitsRegHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#permitsdashwrapper');
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
    },
    
    showAddPermitsOtherdetailsWinFrm: function (btn) {

        var me = this,
            mainTabPnl = this.getMainTabPanel(),
            activeTab = mainTabPnl.getActiveTab(),
        childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            child = Ext.widget(childXtype),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;
            child.setHeight(450);
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
        
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
    },
    importpermitApplicationsGridRefresh: function (me) {
        var store = me.store,
            table_name = me.table_name,
            strict_mode = me.strict_mode,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            branch_id = 0;

            if(activeTab.down('combo[name=branch_id]')){
                branch_id = activeTab.down('combo[name=branch_id]').getValue();
            }
            store.getProxy().extraParams = {
                table_name: table_name,
                workflow_stage_id: workflow_stage_id,
                section_id: section_id,
                branch_id:branch_id,
                strict_mode: strict_mode
            };

    },
    importpermitApplicationsSubmissionGridRefresh: function (me) {
        var store = me.store,
            table_name = me.table_name,
            strict_mode = me.strict_mode,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            branch_id = 0;
            if(activeTab.down('combo[name=branch_id]')){
                branch_id = activeTab.down('combo[name=branch_id]').getValue();
            }
        store.getProxy().extraParams = {
            table_name: table_name,
            branch_id:branch_id,
            workflow_stage_id: workflow_stage_id,
            section_id:section_id,
            strict_mode: strict_mode
        };
    },

    
    refreshpreviousinspectionsgrid: function (me) {
        var store = me.store,
            table_name = me.table_name,
            strict_mode = me.strict_mode,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            store.getProxy().extraParams = {
                application_code: active_application_code
            };
    },
    refreshpoeinspectionpermitsproductsgrid: function (me) {
        var store = me.store,
            table_name = me.table_name,
            strict_mode = me.strict_mode,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            poe_application_id = activeTab.down('hiddenfield[name=poe_application_id]').getValue();
            
            active_application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            store.getProxy().extraParams = {
                poe_application_id: poe_application_id,
                application_code:active_application_code
            };
    },refreshpoeinspectionprocessdashgrid: function (me) {
        
        var store = me.store,
            inspection_status_id = me.inspection_status_id,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            store.getProxy().extraParams = {
                section_id: section_id,
                inspection_status_id:inspection_status_id
            };
    },
    refreshinspectedpoepermitsdashgrid: function (me) {
        
        var store = me.store,
            inspection_status_id = me.inspection_status_id,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form'),
            formValues = activeTab.down('form').getValues();
            //get the 
            Ext.apply(store.getProxy().extraParams, formValues);
    },
    refreshclearedconsigmentpermitsproductsdashgrid: function (me) {

        var store = me.store,
            inspection_status_id = me.inspection_status_id,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form'),
            formValues = activeTab.down('form').getValues();
        //get the
        Ext.apply(store.getProxy().extraParams, formValues);
    },
    funcsavePOEPermitVerificationRecommendations:function(btn){
        var mainTabPnl = this.getMainTabPanel(),
                storeId = btn.storeId,
                action_url = btn.action_url,
                store = Ext.getStore(storeId),
                form = btn.up('form'),
                win = form.up('window'),
                permit_verificationstatus_id = form.down('combo[name=permit_verificationstatus_id]').getValue(),
                permit_verification_remarks = form.down('htmleditor[name=verification_remarks]').getValue(),
                containerPnl = mainTabPnl.getActiveTab();
    
        if(form.isValid()){
            form.submit({
                url: 'importexportpermits/savePOEPermitVerificationRecommendations',
                waitMsg: 'Saving POE Permit Verification wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success;
                    if (success == true || success === true) {
                        toastr.success(message, 'Success Response');
                        containerPnl.down('displayfield[name=verification_status]').setValue(resp.verification_status);
                        containerPnl.down('hiddenfield[name=permit_verificationstatus_id]').setValue(permit_verificationstatus_id);
                        containerPnl.down('hiddenfield[name=permit_verification_remarks]').setValue(permit_verification_remarks);
                        //inspectionimportexportspermitgrid
                            win.close();
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

        } 
           
    },
    
    funcsavePOEPermitRecommendations:function(btn){
        var mainTabPnl = this.getMainTabPanel(),
                storeId = btn.storeId,
                action_url = btn.action_url,
                store = Ext.getStore(storeId),
                form = btn.up('form'),
                record = form.getValues(),
                win = form.up('window'),
                containerPnl = mainTabPnl.getActiveTab();
    
        if(form.isValid()){
            form.submit({
                url: 'importexportpermits/savePOEPermitRecommendations',
                waitMsg: 'Saving POE Permit Recommendation wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success;
                    if (success == true || success === true) {
                        toastr.success(message, 'Success Response');
                            containerPnl.down('hiddenfield[name=inspection_recommendation_id]').setValue(record.inspection_recommendation_id);
                            containerPnl.down('hiddenfield[name=inspection_remarks]').setValue(record.remarks);
                            // mainTabPnl.remove(containerPnl);
                            if(store){
                                store.removeAll();
                                store.load();
                            }
                            win.close();
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

        } 
           
    },
    // 
    showSpecialImpExpApprovalWin:function(btn){
        Ext.getBody().mask('Please wait...');
        var me = this,
             mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue();
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            
            table_name = btn.table_name,
            approval_frm = btn.approval_frm,
            form = Ext.widget(approval_frm),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;
        form.setController('importexportpermitsvctr');
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        
        form.down('hiddenfield[name=table_name]').setValue(table_name);
        Ext.Ajax.request({
            method: 'GET',
            url: 'getApplicationApprovalDetails',
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
                    funcShowCustomizableWindow('Special Import/Export Approval Recommendation', '40%', form, 'customizablewindow');
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
    showManagerReviewRecommendationWin:function(btn){
        Ext.getBody().mask('Please wait...');
        var me = this,
             mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            table_name = btn.table_name,
            approval_frm = btn.approval_frm,
            form = Ext.widget(approval_frm),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;
            
        form.setController('importexportpermitsvctr');
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        
        form.down('hiddenfield[name=table_name]').setValue(table_name);
        Ext.Ajax.request({
            method: 'GET',
            url: 'common/getImporPermitApplicationApprovalDetails',
            params: {
                application_id: application_id,
                approval_table:'tra_managerpermits_review',
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
                    funcShowCustomizableWindow('Review Recommendation', '40%', form, 'customizablewindow', btn);
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
    getPermitReleaseRecommendationDetails:function(record,btn){
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = record.get('application_id'),
            application_code = record.get('application_code'),
            reference_no =  record.get('reference_no'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            table_name = btn.table_name,
            approval_frm = btn.approval_frm,
            form = Ext.widget(approval_frm),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        form.down('hiddenfield[name=table_name]').setValue(table_name);
        Ext.Ajax.request({
            method: 'GET',
            url: 'common/getPermitReleaseRecommendationDetails',
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
                    form.down('hiddenfield[name=reference_no]').setValue(reference_no);
                    form.down('hiddenfield[name=process_id]').setValue(process_id);
                    form.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
                    funcShowCustomizableWindow('Permit release Recommendation', '40%', form, 'customizablewindow');
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
   
    getImportpermitApplicationApprovalDetails: function (btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue();
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            
            table_name = btn.table_name,
            approval_frm = btn.approval_frm,
            form = Ext.widget(approval_frm),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;
        form.setController('productregistrationvctr');
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        
        form.down('hiddenfield[name=table_name]').setValue(table_name);
        Ext.Ajax.request({
            method: 'GET',
            url: 'common/getImporPermitApplicationApprovalDetails',
            params: {
                application_id: application_id,
                application_code: application_code,
                approval_table:'tra_approval_recommendations',
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
                    funcShowCustomizableWindow('Recommendation', '40%', form, 'customizablewindow');
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
    editpreviewPermitVerificationinformation:function(item){
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            isReadOnly = item.isReadOnly,
            is_temporal = btn.is_temporal,
            application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            process_id = record.get('process_id'),
            workflow_stage_id = record.get('workflow_stage_id');
            
            var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            detailed_pnl = activeTab.down('#main_processpanel'),
            permitsverification_panel =detailed_pnl.permitsverification_panel,
            permitsverification_panel = Ext.widget(permitsverification_panel),
            disposaldestruction_frm = permitsverification_panel.down('disposaldestructionfrm').getForm();

            var applicable_checkliststore = permitsverification_panel.down('combo[name=applicable_checklist]').getStore();
            
            applicable_checkliststore.removeAll();
            applicable_checkliststore.load({
                params: {
                    process_id: process_id,
                    workflow_stage: workflow_stage_id
                }
            });

            this.showdisposalVerificationsUniformStage(application_id,application_code,disposaldestruction_frm,'', permitsverification_panel);
            
    },
    prepapareDisposalEvaluationUniformStage:function(){
        

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            checklist_grid = activeTab.down('grid'),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),

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
        var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepapareDisposalVerificationUniform',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_disposal_application'
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
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);

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
    prepapareDisposalVerificationUniformStage: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();

        var me = this,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            wizardactive_application = activeTab.down('disposalpermitverificationwizard').down('hiddenfield[name=active_application_id]'),
            disposaldestruction_frm = activeTab.down('disposaldestructionfrm').getForm(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

            var applicable_checkliststore = activeTab.down('combo[name=applicable_checklist]').getStore();
            
            applicable_checkliststore.removeAll();
            applicable_checkliststore.load({
                params: {
                    process_id: process_id,
                    workflow_stage: workflow_stage_id
                }
            });
            
            this.showdisposalVerificationsUniformStage(application_id,application_code,disposaldestruction_frm,wizardactive_application,'');

    },
   showdisposalVerificationsUniformStage:function(application_id,application_code,disposaldestruction_frm,wizardactive_application,permitsdetails_panel){
        
        Ext.getBody().mask('Please wait...');
        if (application_id) {

            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepapareDisposalVerificationUniform',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_disposal_applications'
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success,
                        permit_details = resp.results;
                    if(permitsdetails_panel != ''){
                        funcShowCustomizableWindow('Disposal Permit Verification Details', '85%', permitsdetails_panel, 'customizablewindow');
                        permitsdetails_panel.down('button[name=save_btn]').setVisible(false);
                        permitsdetails_panel.down('button[name=previewpermitsdetailsbtn]').setVisible(false);
                        permitsdetails_panel.down('button[action=process_submission_btn]').setVisible(false);
                        
                    }
                    else{
                        wizardactive_application.setValue(application_id);
                    }
                    if (success == true || success === true) {
                        var model2 = Ext.create('Ext.data.Model', permit_details);
                        
                        disposaldestruction_frm.loadRecord(model2);
                        
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
    prepapareImportpermitUniformStage: function () {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicationsGrid = activeTab.down('grid');
      
        Ext.getBody().mask('Please wait...');
        var me = this,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicationsStore = applicationsGrid.getStore(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            sm = applicationsGrid.getSelectionModel();
         

        if (application_id) {

            applicationsStore.on('load', function (store, records, options) {
                var record = store.getById(application_id),
                    rowIndex = store.indexOf(record);
                sm.select(rowIndex, true);
            });

            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepapareImportpermitUniformStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_importexport_applications'
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
                        
                        applicationsStore.load();

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
    funcPreparePaymentsStage:function(table_name){
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]'),
            invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            running_balance = activeTab.down('displayfield[name=running_balance]'),
           // invoiceSummaryGrid = activeTab.down('paymentinvoicingcostdetailsgrid'),
            //invoiceSummaryStore = invoiceSummaryGrid.getStore(),
            // paymentsGrid = activeTab.down('applicationpaymentsgrid'),
            // paymentsStore = paymentsGrid.getStore(),
           otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        if (application_code) {
           
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareNewImportExportPaymentStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: table_name
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
    prepareNewImportExportPayments: function () {

        this.funcPreparePaymentsStage('tra_importexport_applications');
        
    },
    prepareNewDisposalPayments: function () {

        this.funcPreparePaymentsStage('tra_disposal_applications');

    },
    prepareNewImportsInvoicing: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]'),
            module_id = activeTab.down('hiddenfield[name=module_id]'),
            invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            paying_currency = activeTab.down('combo[name=paying_currency_id]'),
            isFastTrack = activeTab.down('checkbox[name=is_fast_track]'),
            save_btn = activeTab.down('button[name=save_btn]'),
            commit_btn = activeTab.down('button[name=commit_btn]'),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            application_feetype_id =6,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),

            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            if(sub_module_id == 16 || sub_module_id == 13){
                var invoiceSummaryGrid = activeTab.down('invoicingcostdetailsgrid'),
                invoiceSummaryStore = invoiceSummaryGrid.getStore();
            }
            else{

               var invoiceSummaryGrid = activeTab.down('importinvoicingcostdetailsgrid'),
              invoiceSummaryStore = invoiceSummaryGrid.getStore();
            }
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareImportInvoicingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    application_feetype_id:application_feetype_id,
                    table_name: 'tra_importexport_applications'
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
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);
                        
                        activeTab.down('hiddenfield[name=isLocked]').setValue(isLocked);
                        activeTab.down('checkbox[name=is_fast_track]').setValue(is_fast_track);

                        
                        invoice_id.setValue(results.invoice_id);
                        invoice_no.setValue(results.invoice_no);

                        applicant_details.setValue(results.applicant_details);
                        
                        invoiceSummaryStore.removeAll();
                        invoiceSummaryStore.load({
                            params: {
                                application_code: application_code,
                                module_id: module_id,
                                invoice_id: results.invoice_id,
                                application_feetype_id:application_feetype_id
                            }
                        });

                        if (isLocked == 1 || isLocked === 1) {
                           // paying_currency.setReadOnly(true);
                            isFastTrack.setReadOnly(true);
                            save_btn.setVisible(false);
                            commit_btn.setDisabled(true);
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
    prepareNewDisposalPaermitssInvoicing: function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            invoice_id = activeTab.down('hiddenfield[name=invoice_id]'),
            invoice_no = activeTab.down('displayfield[name=invoice_no]'),
            
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            paying_currency = activeTab.down('combo[name=paying_currency_id]'),
            isFastTrack = activeTab.down('checkbox[name=is_fast_track]'),
            save_btn = activeTab.down('button[name=save_btn]'),
            commit_btn = activeTab.down('button[name=commit_btn]');
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            if(sub_module_id == 16 || sub_module_id == 13){
                var invoiceSummaryGrid = activeTab.down('invoicingcostdetailsgrid'),
                invoiceSummaryStore = invoiceSummaryGrid.getStore();
            }
            else{

               var invoiceSummaryGrid = activeTab.down('importinvoicingcostdetailsgrid'),
              invoiceSummaryStore = invoiceSummaryGrid.getStore();
            }
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareDisposalPermitsInvoicingStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_disposal_applications'
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
    
    prepareImportsInvoicingOtherDetails:function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

            permit_currency = activeTab.down('combo[name=permit_currency_id]');
            permit_fob_value = activeTab.down('numberfield[name=permit_fob_value]');

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/getImportsInvoicingOtherDetails',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_importexport_applications'
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
                        
                        permit_currency.setValue(results.permit_currency_id);
                        permit_fob_value.setValue(results.permit_fob_value);

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
    
    prepareDisposalInvoicingOtherDetails:function () {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

            permit_currency = activeTab.down('combo[name=permit_currency_id]');
            permit_fob_value = activeTab.down('numberfield[name=permit_fob_value]');

        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/getDisposalInvoicingOtherDetails',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_disposal_applications'
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
                        
                        permit_currency.setValue(results.permit_currency_id);
                        permit_fob_value.setValue(results.permit_fob_value);

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
    showDisposalPermitDisposalSubmissionWin: function (btn) {
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
            storeID = getApplicationStore(module_id, section_id);
        valid = true;
        //this.validateFoodPremisePaymentSubmission();
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID);
        } else {
            Ext.getBody().unmask();
        }
    },
    showPermitEvaluationApplicationSubmissionWin: function (btn) {
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
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            hasQueries = checkApplicationRaisedQueries(application_code, module_id),
            storeID = getApplicationStore(module_id, section_id);
        valid = true;
        hasRecommendation = checkApplicationEvaluationOverralRecom(application_code, 2, workflow_stage_id);
        valid = true;
        checklist_category_id = '';
        if(activeTab.down('combo[name=applicable_checklist]') ){
            checklist_category_id = activeTab.down('combo[name=applicable_checklist]').getValue();
        }
        hasEvalUploadChecklist = checkApplicationChecklistDetails(application_code, module_id,sub_module_id,section_id,checklist_category_id,workflow_stage_id,process_id);
            if(!hasEvalUploadChecklist){
                toastr.warning('Fill in the Screening checklist details(for checklist based checklist)!!', 'Warning Response');
                Ext.getBody().unmask();
                return false;
               
            }
        if(!hasRecommendation){
            toastr.warning('Enter the Assessmenet Overrall Recommendation to Proceed!!', 'Warning Response');
            Ext.getBody().unmask();
            return false;
           
        }
        extraParams = [{
            field_type: 'hiddenfield',
            field_name: 'has_queries',
            value: hasQueries
        }];
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,extraParams);
        } else {
            Ext.getBody().unmask();
        }
    },

    showDisposalPermitEvaluationApplicationSubmissionWin: function (btn) {
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
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            hasQueries = checkApplicationRaisedQueries(application_code, module_id),
            storeID = getApplicationStore(module_id, section_id);
        valid = true;
        hasRecommendation = checkApplicationEvaluationOverralRecom(application_code, 2, workflow_stage_id);
        valid = true;
        checklist_category_id = '';
        if(activeTab.down('combo[name=applicable_checklist]') ){
            checklist_category_id = activeTab.down('combo[name=applicable_checklist]').getValue();
        }
       
        if(!hasRecommendation){
        //    toastr.warning('Enter the Assessment Overrall Recommendation to Proceed!!', 'Warning Response');
           // Ext.getBody().unmask();
          //  return false;
           
        }
        extraParams = [{
            field_type: 'hiddenfield',
            field_name: 'has_queries',
            value: hasQueries
        }];
        if (valid == true || valid === true) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,extraParams);
        } else {
            Ext.getBody().unmask();
        }
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
    prepareImportExportPermitEvaluationPnl: function () {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            checklist_grid = activeTab.down('grid'),
            otherDetailsFrm = activeTab.down('form'),
            applicant_details = otherDetailsFrm.down('displayfield[name=applicant_details]'),
            premises_details = otherDetailsFrm.down('displayfield[name=premises_details]'),

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
                url: 'importexportpermits/prepapareImportpermitUniformStage',
                params: {
                    application_id: application_id,
                    application_code: application_code,
                    table_name: 'tra_importexport_applications'
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
                        activeTab.down('hiddenfield[name=applicant_id]').setValue(results.applicant_id);

                        applicant_details.setValue(results.applicant_details);
                        premises_details.setValue(results.premises_details);
                        
                        premises_details.setVisible(true);;
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
  
    savePermitInformation: function (btn) {
        var me = this,
            panel = btn.up('importexportdetailspanel'),
            form = panel.down('importexportdetailsfrm'),
            mainTabPnl = this.getMainTabPanel(),
            url = btn.action_url;

        frm = form.getForm();
        if (frm.isValid()) {
            if (frm.isValid()) {
                frm.submit({
                    url: url,
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
    
    productPreviewEditDisposalDetails: function (btn) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            permitsdetails_panel = activeTab.down('#main_processpanel').permitsdetails_panel,
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),

            
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
            ref_no = activeTab.down('displayfield[name=reference_no]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();
            
        this.showDisposalPermitApplicationMoreDetailsGeneric(permitsdetails_panel, application_id,  applicant_id, ref_no, process_id,  isReadOnly,workflow_stage_id,module_id,sub_module_id);


    },
    editDisposalpreviewPermitinformation: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            isReadOnly = item.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            permitsdetails_panel = activeTab.down('#main_processpanel').permitsdetails_panel,
            application_id = record.get('active_application_id'),
            section_id = record.get('section_id'),
            applicant_id = record.get('applicant_id'),
            ref_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
          

    this.showDisposalPermitApplicationMoreDetailsGeneric(permitsdetails_panel, application_id,  applicant_id, ref_no, process_id,  isReadOnly,workflow_stage_id,module_id,sub_module_id,section_id);

    },
    showDisposalPermitApplicationMoreDetailsGeneric: function (permitsdetails_panel, application_id,  applicant_id, ref_no, process_id, isReadOnly,workflow_stage_id,module_id,sub_module_id,section_id) {
        Ext.getBody().mask('Please wait...');

        var me = this,
            permitsdetails_panel = Ext.widget(permitsdetails_panel),
            tab = permitsdetails_panel.down('panel'),
            applicantFrm = permitsdetails_panel.down('disposalapplicantdetailsfrm'),
            importexportpremisesfrm = permitsdetails_panel.down('#importexportpremisesfrm'),
            disposalpermitsdetailsfrm = permitsdetails_panel.down('#disposalpermitsdetailsfrm');
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            permitsdetails_panel.down('button[name=save_btn]').setVisible(false);
            //   prepareNewProductReceivingStage
        }
        permitsdetails_panel.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id)
        permitsdetails_panel.down('hiddenfield[name=module_id]').setValue(module_id)
        permitsdetails_panel.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id) 
        permitsdetails_panel.down('hiddenfield[name=section_id]').setValue(section_id)      
        Ext.Ajax.request({
            method: 'POST',
            url: 'importexportpermits/getDisposalPermitsApplicationMoreDetails',
            params: {
                application_id: application_id,
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
                    permit_details = resp.permit_details,
                    premisesDetails = resp.premisesDetails;
                if (success == true || success === true) {
                    
                    if (permit_details) {
                        var model2 = Ext.create('Ext.data.Model', permit_details);
                        applicantFrm.loadRecord(model2);
                        disposalpermitsdetailsfrm.loadRecord(model2);
                      
                    }
                    permitsdetails_panel.height = 550;
                    funcShowCustomizableWindow(ref_no, '85%', permitsdetails_panel, 'customizablewindow');

                    if (isReadOnly == 1) {

                        permitsdetails_panel.getViewModel().set('isReadOnly', true);
                       
                        permitsdetails_panel.down('button[name=save_btn]').setVisible(false);
                      //  permitsdetails_panel.down('button[name=link_applicant]').setDisable(true);
                        me.fireEvent('formAuth', process_id, 1, permitsdetails_panel);
                        
                    }else{
                        permitsdetails_panel.down('button[name=save_btn]').setVisible(true);
                     //   permitsdetails_panel.down('button[name=link_applicant]').setDisable(true);
                    }
                    permitsdetails_panel.down('hiddenfield[name=active_application_id]').setValue(application_id)
                   
                    permitsdetails_panel.down('button[name=save_btn]').handler = 'updateDisposaltReceivingBaseDetails'
                    permitsdetails_panel.down('button[name=save_btn]').action_url = 'updateDisposalApplicationDetails'

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
	editpreviewDisposalQueryinformation:function(grid,record){
        var isReadOnly = grid.isReadOnly,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            permitsdetails_panel = activeTab.down('#main_processpanel').permitsdetails_panel,
            application_id = record.get('active_application_id'),
            applicant_id = record.get('applicant_id'),
            ref_no = record.get('reference_no'),
            process_id = record.get('process_id');
            this.showDisposalPermitApplicationMoreDetailsGeneric(permitsdetails_panel, application_id,  applicant_id, ref_no, process_id,  isReadOnly);
    },
    editpreviewPermitQueryinformation:function(grid,record){
        var isReadOnly = grid.isReadOnly,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            permitsdetails_panel = activeTab.down('#main_processpanel').permitsdetails_panel,
            application_id = record.get('active_application_id'),
            applicant_id = record.get('applicant_id'),
            ref_no = record.get('reference_no'),
            process_id = record.get('process_id');
            this.showPermitApplicationMoreDetailsGeneric(permitsdetails_panel, application_id,  applicant_id, ref_no, process_id,  isReadOnly);
    },
    editpreviewNarcoticsPermitinformation:function(item){
        var btn = item.up('button'),
        record = btn.getWidgetRecord(),
        isReadOnly = item.isReadOnly,
        is_temporal = btn.is_temporal,
        mainTabPanel = this.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab(),
        permitsdetails_panel = activeTab.down('#main_processpanel').permitsdetails_panel,
        application_id = record.get('active_application_id'),
        product_id = record.get('product_id'),
        section_id = record.get('section_id'),
        applicant_id = record.get('applicant_id'),
        ref_no = record.get('reference_no'),
        process_id = record.get('process_id'),
        workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
        module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
        sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
        section_id = activeTab.down('hiddenfield[name=section_id]').getValue();

    //if for the products forms 

    this.showNarcoticsPermitApplicationMoreDetailsGeneric(permitsdetails_panel, application_id,  applicant_id, ref_no, process_id,  isReadOnly);

},
showNarcoticsPermitApplicationMoreDetailsGeneric: function (permitsdetails_panel, application_id,  applicant_id, ref_no, process_id, isReadOnly) {
    Ext.getBody().mask('Please wait...');

    var me = this,
        permitsdetails_panel = Ext.widget(permitsdetails_panel),
        tab = permitsdetails_panel.down('panel'),
        permit_form = permitsdetails_panel.down('form'),
        importexportapplicantdetailsfrm = permitsdetails_panel.down('importexportapplicantdetailsfrm');
        importexportdetailsfrm = permitsdetails_panel.down('#permitsdetailsfrm');
        
        senderreceiverdetailsfrm = permitsdetails_panel.down('#senderreceiverdetailsfrm');
        
    if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
        permitsdetails_panel.down('button[name=save_btn]').setVisible(false);
        //   prepareNewProductReceivingStage
    }

    Ext.Ajax.request({
        method: 'POST',
        url: 'importexportpermits/getPermitsApplicationMoreDetails',
        params: {
            application_id: application_id,
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
                permit_details = resp.permit_details,
                senderReceiverDetails = resp.senderReceiverDetails;

            if (success == true || success === true) {

                if (permit_details) {
                    var model2 = Ext.create('Ext.data.Model', permit_details);
                    
                   var senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails);    
                        senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                        importexportapplicantdetailsfrm.loadRecord(model2);
                        importexportdetailsfrm.loadRecord(model2);
                        permitsdetails_panel.down('combo[name=branch_id]').setValue(permit_details.branch_id);
                        application_code = permit_details.application_code;
                }
                permitsdetails_panel.height = 550;
                funcShowCustomizableWindow(ref_no, '85%', permitsdetails_panel, 'customizablewindow');

                if (isReadOnly == 1) {
                    me.fireEvent('formAuth', process_id, 1, permitsdetails_panel);
                    
                }
               
                permitsdetails_panel.getViewModel().set('isReadOnly', true);
                permitsdetails_panel.down('hiddenfield[name=active_application_id]').setValue(application_id);
                permitsdetails_panel.down('hiddenfield[name=active_application_code]').setValue(application_code);
                

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
showPermitApplicationMoreDetails: function (btn) {
    var isReadOnly = btn.isReadOnly,
        mainTabPanel = this.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab(),
        application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
        applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
        ref_no = activeTab.down('displayfield[name=reference_no]').getValue(),
        permitsdetails_panel = activeTab.down('#main_processpanel').permitsdetails_panel,
        process_id = activeTab.down('hiddenfield[name=process_id]').getValue();

    this.showPermitApplicationMoreDetailsGeneric(permitsdetails_panel,application_id, applicant_id, ref_no, process_id,  isReadOnly, btn.is_detached);

    },
    editpreviewPermitinformation: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            isReadOnly = item.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            permitsdetails_panel = activeTab.down('#main_processpanel').permitsdetails_panel,
            application_id = record.get('active_application_id'),
            product_id = record.get('product_id'),
            section_id = record.get('section_id'),
            applicant_id = record.get('applicant_id'),
            application_code = record.get('application_code'),
            ref_no = record.get('reference_no'),
            process_id = record.get('process_id'),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            permitsdetails_panelwin = Ext.widget(permitsdetails_panel);
        //if for the products forms 
            // console.log(activeTab.down('hiddenfield[name=importexport_permittype_id]').getValue());
        permitsdetails_panelwin.down('hiddenfield[name=active_application_code]').setValue(application_code);
        permitsdetails_panelwin.down('hiddenfield[name=importexport_permittype_id]').setValue(record.get('importexport_permittype_id'));
        this.showPermitApplicationMoreDetailsGeneric(permitsdetails_panel, application_id,  applicant_id, ref_no, process_id,  isReadOnly, item.is_detached);

    },
    showPermitApplicationMoreDetails: function (btn) {
        var isReadOnly = btn.isReadOnly,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue(),
            ref_no = activeTab.down('displayfield[name=reference_no]').getValue(),
            permitsdetails_panel = activeTab.down('#main_processpanel').permitsdetails_panel,
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue();

        this.showPermitApplicationMoreDetailsGeneric(permitsdetails_panel,application_id, applicant_id, ref_no, process_id,  isReadOnly, btn.is_detached);
    },
    showPermitApplicationMoreDetailsGeneric: function (permitsdetails_panel, application_id,  applicant_id, ref_no, process_id, isReadOnly, is_detached=0) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            permitsdetails_panel = Ext.widget(permitsdetails_panel),
            tab = permitsdetails_panel.down('panel'),
            module_id = permitsdetails_panel.down('hiddenfield[name=module_id]'),
            sub_module_id = permitsdetails_panel.down('hiddenfield[name=sub_module_id]').getValue(),
            permit_form = permitsdetails_panel.down('form'),
            importexportapplicantdetailsfrm = permitsdetails_panel.down('importexportapplicantdetailsfrm');
            importexportdetailsfrm = permitsdetails_panel.down('#importexportdetailsfrm');
            senderreceiverdetailsfrm = permitsdetails_panel.down('#senderreceiverdetailsfrm');
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            permitsdetails_panel.down('button[name=save_btn]').setVisible(false);
            //   prepareNewProductReceivingStage applicant_id
        }
        Ext.Ajax.request({
            method: 'POST',
            url: 'importexportpermits/getPermitsApplicationMoreDetails',
            params: {
                application_id: application_id,
                applicant_id: applicant_id,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    permit_details = resp.permit_details,
                    senderReceiverDetails = resp.senderReceiverDetails,
                    senderReceiverDetails = resp.senderReceiverDetails,
                    premisesDetails = resp.premisesDetails;
                if (success == true || success === true) {
                    if (permit_details) {
                        var model2 = Ext.create('Ext.data.Model', permit_details);
                        var senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails),
                            premisesDetails = Ext.create('Ext.data.Model', premisesDetails);
                            // if(permit_details.module_id != 20){
                            //     importexportpremisesfrm = permitsdetails_panel.down('#importexportpremisesfrm'),
                            //     importexportpremisesfrm.loadRecord(premisesDetails);
                            // }
                            if(senderreceiverdetailsfrm){
                                senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                            }
                            importexportapplicantdetailsfrm.loadRecord(model2);
                            importexportdetailsfrm.loadRecord(model2);
                            if(permitsdetails_panel.down('combo[name=branch_id]')){
                                permitsdetails_panel.down('combo[name=branch_id]').setValue(permit_details.branch_id);
                            }
                            if(permitsdetails_panel.down('hiddenfield[name=importexport_permittype_id]')){
                                permitsdetails_panel.down('hiddenfield[name=importexport_permittype_id]').setValue(permit_details.importexport_permittype_id);
                            }
                    }
                    permitsdetails_panel.height = 550;
                    if(is_detached == 1){
                        funcShowStatelessCustomizableWindow(ref_no, '95%', permitsdetails_panel, 'customizablewindow');
                    }else{
                        funcShowCustomizableWindow(ref_no, '85%', permitsdetails_panel, 'customizablewindow');
                    }
                    if (isReadOnly == 1) {
                        me.fireEvent('formAuth', process_id, 1, permitsdetails_panel); 
                    }
                    permitsdetails_panel.down('hiddenfield[name=active_application_code]').setValue(permit_details.application_code);
                    permitsdetails_panel.down('hiddenfield[name=section_id]').setValue(permit_details.section_id);
                    permitsdetails_panel.down('hiddenfield[name=module_id]').setValue(permit_details.module_id);
                    permitsdetails_panel.down('hiddenfield[name=sub_module_id]').setValue(permit_details.sub_module_id);
                    if(permit_details.module_id == 20){
                        docsGrid = permitsdetails_panel.down('declaredimportexportdocuploadsgrid');
                    }
                    else{
                        docsGrid = permitsdetails_panel.down('onlineimportexportdocuploadsgrid');
                    }
                    docsGrid.down('hiddenfield[name=application_code]').setValue(permit_details.application_code);
                    docsGrid.down('hiddenfield[name=section_id]').setValue(permit_details.section_id);
                    docsGrid.down('hiddenfield[name=module_id]').setValue(permit_details.module_id);
                    docsGrid.down('hiddenfield[name=sub_module_id]').setValue(permit_details.sub_module_id);
                    if(docsGrid.down('hiddenfield[name=importexport_permittype_id]')){

                        docsGrid.down('hiddenfield[name=importexport_permittype_id]').setValue(permit_details.importexport_permittype_id);
                      
                    }
                    if(permit_details.sub_module_id == 73){
                        permitsdetails_panel.down('importexportdetailspnl').add(4, {
                            xtype: 'permitvariationrequestsgrid',
                            title: 'Permit Variations'
                        });
                        // permitsdetails_panel.down('#variationrequestsgrid').setVisible(true);
                    }
                    if(permitsdetails_panel.down('#variationrequestsgrid')){
                        if(permitsdetails_panel.down('#variationrequestsgrid').down('hiddenfield[name=application_code]')){
                            permitsdetails_panel.down('#variationrequestsgrid').down('hiddenfield[name=application_code]').setValue(permit_details.application_code);
                            permitsdetails_panel.down('#variationrequestsgrid').down('hiddenfield[name=application_id]').setValue(application_id);
                        }

                    }
                    activeTab.getViewModel().set('model', model2);
                   permitsdetails_panel.getViewModel().set('model', model2);
                    permitsdetails_panel.getViewModel().set('isReadOnly', true);
                    permitsdetails_panel.down('hiddenfield[name=active_application_id]').setValue(application_id);

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
    showAmmendmentReceivingApplicationSubmissionWin:function(btn){
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
           
        if (valid) {
           
        Ext.Ajax.request({
            method: 'POST',
            url: 'importexportpermits/validateImportExportAppReceiving',
            params: {
                application_code: application_code,
                workflow_stage_id:workflow_stage_id,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success;
                   
                if (success == true || success === true) {
                    extraParams =[{
                        field_type: 'hiddenfield',
                        field_name: 'has_queries'
                    },{
                        stage_status: 7
                    }];
                    showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,extraParams);

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
           
        }
        else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
            return;
        }

    },
    showImpExpReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
           // premise_id = activeTab.down('hiddenfield[name=premise_id]').getValue(),
            // storeID = getApplicationStore(module_id, section_id),
            valid = this.validateNewIMPReceivingSubmission(),
            // validateInvoicing = validateHasInvoiceGeneration(application_code,sub_module_id),
            validatePermitsProducts = validateHasImportExportProductDetils(application_code),
           // hasQueries = checkApplicationRaisedQueries(application_code, module_id),
            validateHasDocuments = validateHasUploadedDocumentsDetils(application_code, module_id,sub_module_id,section_id,0,workflow_stage_id,process_id);
            
            if(!validateHasDocuments){
                toastr.error('Response: Please Upload the required documents to proceed.'); 
                Ext.getBody().unmask();
                return;
            }
            if(!validatePermitsProducts){

                toastr.error('Response: Please add the Permits products details to proceed.'); 
                Ext.getBody().unmask();
                return;
            }
            // if(!validateInvoicing){
            //     toastr.warning('Please Generate Proforma Invoice Or Upload Proof of Payment to proceed!!', 'Warning Response');
           
            //     Ext.getBody().unmask();
            //     return;
            // }
            // if(!premise_id){
            //     toastr.warning('Please provide the premise/facility details!!', 'Warning Response');
           
            //     Ext.getBody().unmask();
            //     return;
            // }

        if (valid) {
           
        Ext.Ajax.request({
            method: 'POST',
            url: 'importexportpermits/validateImportExportAppReceiving',
            params: {
                application_code: application_code,
                workflow_stage_id:workflow_stage_id,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success;
                if (success == true || success === true) {
                    extraParams =[{
                        field_type: 'hiddenfield',
                        field_name: 'has_queries',
                       // value: hasQueries
                    }];
                    showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,extraParams,'');

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
           
        }
        else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
            return;
        }
    },
    showTransitPermitReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id),
            valid = this.validateNewTransitReceivingSubmission();
            //validateInvoicing = validateHasInvoiceGeneration(application_code,sub_module_id),
           // validatePermitsProducts = validateHasImportExportProductDetils(application_code),
            // = checkApplicationRaisedQueries(application_code, module_id),
            // = validateHasUploadedDocumentsDetils(application_code, module_id,sub_module_id,section_id,0,workflow_stage_id,process_id);

        // if(!validateHasDocuments){
        //     toastr.error('Response: Please Upload the required documents to proceed.');
        //     Ext.getBody().unmask();
        //     return;
        // }
        // if(!validatePermitsProducts){

        //     toastr.error('Response: Please add the Permits products details to proceed.');
        //     Ext.getBody().unmask();
        //     return;
        // }
        // if(!validateInvoicing){
        //     toastr.warning('Please Generate Proforma Invoice Or Upload Proof of Payment to proceed!!', 'Warning Response');

        //     Ext.getBody().unmask();
        //     return;
        // }

        if (valid) {

            Ext.Ajax.request({
                method: 'POST',
                url: 'importexportpermits/validateImportExportAppReceiving',
                params: {
                    application_code: application_code,
                    workflow_stage_id:workflow_stage_id,
                    _token: token
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message,
                        success = resp.success;

                    if (success == true || success === true) {
                        extraParams =[{
                            field_type: 'hiddenfield',
                            field_name: 'has_queries',
                            //value: hasQueries
                        }];
                        showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,extraParams,'');

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

        }
        else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
            return;
        }
    },
    showDisposalReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
            valid = this.validateNewDisposalReceivingSubmission();
            
        if (valid) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID);
        }
        else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
            return;
        }
    },
    validateNewDisposalReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('disposalapplicantdetailsfrm'),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),

            disposalpermitsdetailsfrm = activeTab.down('#disposalpermitsdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
        if (!disposalpermitsdetailsfrm.isValid()) {
            toastr.warning('Please Enter All the required Permits Details!!', 'Warning Response');
            return false;
        }
        return true;
    },
    validateNewIMPReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('importexportapplicantdetailsfrm'),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),

            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
        if (!importexportdetailsfrm.isValid()) {
            toastr.warning('Please Enter All the required Permits Details!!', 'Warning Response');
            return false;
        }
        
        return true;
    },
    validateNewTransitReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('importexportapplicantdetailsfrm'),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),

            importexportdetailsfrm = activeTab.down('#transitdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        if (!application_id) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
        if (!importexportdetailsfrm.isValid()) {
            toastr.warning('Please Enter All the required Permits Details!!', 'Warning Response');
            return false;
        }

        return true;
    },
    onSenderreceiverinformationDLBClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            // sender_receiver_id = record.get('trader_id'),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            // mask = new Ext.LoadMask({
            //     msg: 'Please wait...',
            //     target: win
            // });
            if(grid.btn_consignee){
                var btn = grid.btn_consignee,
                    frm = btn.up('form'),
                    consignee_name = frm.down('textfield[name=consignee_name]'),
                    consignee_id = frm.down('hiddenfield[name=consignee_id]');
                consignee_name.setValue(record.get('applicant_name'));
                consignee_id.setValue(record.get('applicant_id'));
                    
            }else{
                var  senderreceiverdetailsfrm = me.getSenderreceiverdetailsfrm();
                    senderreceiverdetailsfrm.loadRecord(record);
            }
            
            win.close();
/*
        mask.show();
        
        Ext.Ajax.request({
            method: 'POST',
            url: 'importexportpermits/onSaveImportPermitSenderReceiverData',
            params: {
                application_code: application_code,
                sender_receiver_id:sender_receiver_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success;
                   
                if (success == true || success === true) {
                  
                       

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
        */
        // Ext.Function.defer(function () {
        //     mask.hide();
        //     win.close();
        // }, 200);
    },
    onPremiseImpSelectionListDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            premise_id = record.get('premise_id'),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
        mask.show();
        
        Ext.Ajax.request({
            method: 'POST',
            url: 'importexportpermits/onSaveImportPermitPremisesData',
            params: {
                application_code: application_code,
                premise_id:premise_id,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success;
                   
                if (success == true || success === true) {
                    var  importexportpremisesfrm = me.getImportexportpremisesfrm();
           
                         importexportpremisesfrm.loadRecord(record);
   
                         win.close();
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
        Ext.Function.defer(function () {
            mask.hide();
            win.close();
        }, 200);
    },
    onSavePermitProductsDetails:function(btn){
        var me = this,
        mainTabPnl = this.getMainTabPanel(),
        url = btn.action_url,
        form = btn.up('form'),
        win = form.up('window'),
        store = btn.store,
        action_url = btn.action_url,
        prodpermitStr = Ext.getStore(store)
        activeTab = mainTabPnl.getActiveTab();
        section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        importexport_permittype_id = activeTab.down('hiddenfield[name=importexport_permittype_id]');
        
        if(this.getPreviewimportexportpermitdetails()){
            
            application_code = this.getPreviewimportexportpermitdetails().down('hiddenfield[name=active_application_code]').getValue();
           
        }
        else{
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        }
        if(importexport_permittype_id){
            importexport_permittype_id = importexport_permittype_id.getValue();
            if(importexport_permittype_id == 15){
                valid = this.verifyHFDProductCount(form);
            }else{
                valid = true;
            }
        }
        frm = form.getForm();
        if(valid){
            if (frm.isValid()) {
                if (frm.isValid()) {
                    frm.submit({
                        url: action_url ,
                        waitMsg: 'Please wait...',
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        },
                        params: {
                            application_code: application_code,
                            section_id: section_id
                        },
                        success: function (form, action) {
                            var response = Ext.decode(action.response.responseText),
                                success = response.success,
                                message = response.message;
                            if (success == true || success === true) {
                                toastr.success(message, "Success Response");
                                win.close();
                               // closeActiveWindow();
                                prodpermitStr.removeAll();
                                prodpermitStr.load();
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
            else{

                toastr.error('Fill In all the form Fields', 'Failure Response');
            }
        }else{ 
            toastr.error('You have exceeded the 3 product limit set for each controlled drug type', 'Failure Response');
        }

    },
    onSaveDisposalinternalsupervisorsfrm:function(btn){
        var me = this,
        mainTabPnl = this.getMainTabPanel(),
        url = btn.action_url,
        form = btn.up('form'),
        win = form.up('window'),
        prodpermitStr = Ext.getStore('disposaldestsupervisorsstr')
        activeTab = mainTabPnl.getActiveTab();
        section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
        application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();

        frm = form.getForm();
        if (frm.isValid()) {
            if (frm.isValid()) {
                frm.submit({
                    url: 'importexportpermits/onSaveDisposalinternalsupervisors',
                    waitMsg: 'Please wait...',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    params: {
                        application_code: application_code,
                        section_id: section_id
                    },
                    success: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            success = response.success,
                            message = response.message;
                        if (success == true || success === true) {
                            toastr.success(message, "Success Response");
                            win.close();
                            prodpermitStr.removeAll();
                            prodpermitStr.load();

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
    
    showImpPremiseSelectionList:function(btn){
        var me = this,
            childXtype = 'registeredpremisesdetailsgrid',
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            activeTab = mainTabPanel.getActiveTab();
            gmp_type_id = 0;
        var childObject = Ext.widget(childXtype);
        childObject.setHeight(450);
            childObject.down('hiddenfield[name=section_id]').setValue(section_id);
            childObject.down('hiddenfield[name=application_code]').setValue(application_code);
            funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');

    },
    showImpSenderReceiverlectionList:function(btn){
        var me = this,
            childXtype = 'senderreceiverinformationgrid',
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            gmp_type_id = 0;
       
        var childObject = Ext.widget(childXtype);
            funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');

    },
    showApplicantSelectionList: function (btn) {
        var childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            childObject = Ext.widget(childXtype);
        funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow');
    },
    onPermitApplicantSelectionListDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();

            if(activeTab.down('importexportapplicantdetailsfrm')){

                applicantForm = activeTab.down('importexportapplicantdetailsfrm');
            }
            else{
                applicantForm = activeTab.down('revenueapplicantdetailsfrm');
            }
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
        mask.show();
        applicantForm.loadRecord(record);
        Ext.Function.defer(function () {
            mask.hide();
            win.close();
        }, 200);
    },
    inspectionimportexportspermitgridDblClick: function (view, record, item, index, e, eOpts) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
             grid = view.grid,
            win = grid.up('window'),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            importexportpremisesfrm = activeTab.down('#importexportpremisesfrm'),
            senderreceiverdetailsfrm = activeTab.down('#senderreceiverdetailsfrm'),
            poeinspectionpermitsproductsgrid = activeTab.down('#poeinspectionpermitsproductsgrid'),
            active_application_id = record.get('active_application_id'),
            application_code = record.get('application_code'),
            verification_status =record.get('verification_status'),
            
            permit_verificationstatus_id =record.get('permit_verificationstatus_id'),
           
            is_permitexpired =record.get('is_permitexpired'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]');
            
        if(is_permitexpired == 1){
            toastr.error('The selected permit has already Expired, kindly reject or request for permit Extension.', 'Alert');
            Ext.getBody().unmask();
            return;
        }
        
        if(permit_verificationstatus_id > 0){
            toastr.error('The selected permit has already been verified, kindly confirm on the inspection detail and released consignment details permit Extension.', 'Alert');
         //   return;
        }
        if (active_application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareImportExporPermitReceivingStage',
                params: {
                    application_id: active_application_id
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
                        senderReceiverDetails = resp.senderReceiverDetails,
                        premisesDetails = resp.premisesDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                        senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails);
                        premisesDetails = Ext.create('Ext.data.Model', premisesDetails);

                    if (success == true || success === true) {
                        activeTab.down('displayfield[name=verification_status]').setValue(verification_status);
                        importexportdetailsfrm.loadRecord(model);

                        importexportpremisesfrm.loadRecord(premisesDetails);
                        if(senderreceiverdetailsfrm){
                            senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                        }

                        zone_cbo.setValue(branch_id);

                        activeTab.down('displayfield[name=application_status]').setValue(results.application_status);

                        activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                        activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
                        poeinspectionpermitsproductsgrid.store.load();
                        if(me.getMainTabPanel().getActiveTab().getViewModel()){
                                me.getMainTabPanel().getActiveTab().getViewModel().set('model', model);
                            }
                        win.close();
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
            // activeTab.down('combo[name=sub_module_id]').setDisabled(true);
            activeTab.down('combo[name=sub_module_id]').setValue(sub_module_id);
                          
        }
    },
    prepareReceivingpoeinspectionswizard: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl,
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            importexportpremisesfrm = activeTab.down('importexportpremisesfrm'),
           
            senderreceiverdetailsfrm = activeTab.down('#senderreceiverdetailsfrm'),
            poeinspectionpnlfrm = activeTab.down('#poeinspectionpnlfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            poeinspectionpermitsproductsgrid = activeTab.down('#poeinspectionpermitsproductsgrid'),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]'),
            filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
         
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareReceivingpoeinspectionswizard',
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
                        senderReceiverDetails = resp.senderReceiverDetails,
                        premisesDetails = resp.premisesDetails,
                        // branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                        senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails);
                        premisesDetails = Ext.create('Ext.data.Model', premisesDetails);

                    if (success == true || success === true) {
                        
                        importexportdetailsfrm.loadRecord(model);
                        poeinspectionpnlfrm.loadRecord(model);
                        if(importexportpremisesfrm){
                            importexportpremisesfrm.loadRecord(premisesDetails);
                        }
                        if(senderreceiverdetailsfrm){
                            senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                        }
                        if(zone_cbo){
                            // zone_cbo.setValue(branch_id);
                        }
                        activeTab.down('hiddenfield[name=poe_application_id]').setValue(results.poe_application_id);
                        activeTab.down('hiddenfield[name=imp_application_code]').setValue(results.imp_application_code);
                        activeTab.down('hiddenfield[name=inspection_recommendation_id]').setValue(results.inspection_recommendation_id);
                        activeTab.down('hiddenfield[name=permit_verificationstatus_id]').setValue(results.permit_verificationstatus_id);
                        activeTab.down('hiddenfield[name=inspection_remarks]').setValue(results.remarks);
                        activeTab.down('hiddenfield[name=permit_verification_remarks]').setValue(results.permit_verification_remarks);
                        activeTab.down('displayfield[name=permit_expiry_date]').setValue(resp.permit_expiry_date);
                        activeTab.down('displayfield[name=verification_status]').setValue(resp.verification_status);
                        activeTab.down('textfield[name=permit_no]').setValue(resp.permit_no);
                        poeinspectionpermitsproductsgrid.store.load();
                        pnl.getViewModel().set('isReadOnly', true);
                        if(activeTab.down('inspectionimportexportdetailspnl')){
                            activeTab.down('inspectionimportexportdetailspnl').getViewModel().set('isReadOnly', true);
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
            activeTab.down('combo[name=sub_module_id]').setDisabled(true);
            activeTab.down('combo[name=sub_module_id]').setValue(sub_module_id);
                          
        }
    },
    prepareReceivingpoeConsignmentInspectionswizard: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl,
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            poeconsignmentinspectionpermitsproductsgrid = activeTab.down('#poeconsignmentinspectionpermitsproductsgrid'),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
         
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareReceivingpoeConsignmentinspectionswizard',
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
                        // branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);

                    if (success == true || success === true) {
                        
                        importexportdetailsfrm.loadRecord(model);
                        activeTab.down('hiddenfield[name=poe_application_id]').setValue(results.poe_application_id);
                        activeTab.down('hiddenfield[name=imp_application_code]').setValue(results.imp_application_code);
                        activeTab.down('hiddenfield[name=inspection_recommendation_id]').setValue(results.inspection_recommendation_id);
                        activeTab.down('hiddenfield[name=permit_verificationstatus_id]').setValue(results.permit_verificationstatus_id);
                        activeTab.down('hiddenfield[name=inspection_remarks]').setValue(results.remarks);
                        activeTab.down('hiddenfield[name=permit_verification_remarks]').setValue(results.permit_verification_remarks);
                        activeTab.down('displayfield[name=permit_expiry_date]').setValue(resp.permit_expiry_date);
                        activeTab.down('displayfield[name=verification_status]').setValue(resp.verification_status);
                        activeTab.down('textfield[name=permit_no]').setValue(resp.permit_no);
                        poeconsignmentinspectionpermitsproductsgrid.store.load();
                        // pnl.getViewModel().set('isReadOnly', true);
             
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
            activeTab.down('combo[name=sub_module_id]').setDisabled(true);
            activeTab.down('combo[name=sub_module_id]').setValue(sub_module_id);
                          
        }
    },
    
    onDisposalPermitApplicantSelectionListDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            win = grid.up('window'),
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantForm = activeTab.down('disposalapplicantdetailsfrm'),
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
        mask.show();
        applicantForm.loadRecord(record);
        Ext.Function.defer(function () {
            mask.hide();
            win.close();
        }, 200);
    },
    importexportPermitHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('panel'); //('#importexportpermitsdashwrapper');
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({ xtype: sec_dashboard });
        }
    },
   
    showImportPermitApplication: function (sub_module_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            filter = { section_id: section_id };
    },
    refreshScreeningChecklistItemsGrid: function (me) {
        var store = me.getStore(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            checklist_type ='';
            if(activeTab.down('combo[name=applicable_checklist]')){
                checklist_type = activeTab.down('combo[name=applicable_checklist]').getValue();
                store.getProxy().extraParams = {
                    application_code: application_code,
                    checklist_type: checklist_type
                };
            }
    },
    refreshdeclaredimportexportpermitsdashgrid:function(me){
        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = (grid.down('combo[name=sub_module_id]')) ? grid.down('combo[name=sub_module_id]').getValue() : null,
            workflow_stage_id = (grid.down('combo[name=workflow_stage_id]')) ? grid.down('combo[name=workflow_stage_id]').getValue() : null;

        store.getProxy().extraParams = {
            module_id: module_id,
            sub_module_id: sub_module_id,
            workflow_stage_id: workflow_stage_id
        };
    },
    refreshimportexportpermitsdashgrid: function (me) {
        
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
    refreshimportexportcompletedpermitsdashgrid: function (me) {
        
        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = (grid.down('combo[name=sub_module_id]')) ? grid.down('combo[name=sub_module_id]').getValue() : null,
            workflow_stage_id = (grid.down('combo[name=workflow_stage_id]')) ? grid.down('combo[name=workflow_stage_id]').getValue() : null;

        store.getProxy().extraParams = {
            module_id: module_id,
            sub_module_id: sub_module_id,
            workflow_stage_id: workflow_stage_id
        };
    },

    
    
    refreshsenderreceiverinformationgrid: function (me) {

        var store = me.store;

        store.getProxy().extraParams = {
            'sender_details':''
        };
    },
    showImportExportPermitRegWorkflow: function (sub_module_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#importexportpermitsappswrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getBasicWorkflowDetails(module_id,  sub_module_id);
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
    
    prepaprePersonalPermitsReceiving: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl;
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]');
            filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
       
        if (application_code) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepaprePersonalPermitsReceiving',
                params: {
                    application_code: application_code
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
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);

                    if (success == true || success === true) {
                        
                        importexportdetailsfrm.loadRecord(model);

                        zone_cbo.setValue(branch_id);

                        activeTab.down('displayfield[name=application_status]').setValue(results.application_status);

                        activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                        
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
           activeTab.down('combo[name=sub_module_id]').setDisabled(true);
           activeTab.down('combo[name=sub_module_id]').setValue(sub_module_id);
                          
        }
    },
    prepapreImportExportReceiving: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl,
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = activeTab.down('importexportapplicantdetailsfrm'),
            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            importexportpremisesfrm = activeTab.down('#importexportpremisesfrm'),
            senderreceiverdetailsfrm = activeTab.down('#senderreceiverdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]'),
            filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        if(sub_module_id == 73 && application_id > 0){
            activeTab.down('button[name=select_applications]').setVisible(false);
            activeTab.down('textfield[name=reference_no]').setVisible(false);
        }
        var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareImportExporPermitReceivingStage',
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
                        senderReceiverDetails = resp.senderReceiverDetails,
                        premisesDetails = resp.premisesDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                        senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails);
                        premisesDetails = Ext.create('Ext.data.Model', premisesDetails);

                    if (success == true || success === true) {
                        
                        applicantFrm.loadRecord(model);
                        importexportdetailsfrm.loadRecord(model);

                        // importexportpremisesfrm.loadRecord(premisesDetails);
                        if(senderreceiverdetailsfrm){
                            senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                        }

                        // zone_cbo.setValue(branch_id);

                        activeTab.down('displayfield[name=application_status]').setValue(results.application_status);

                        activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                        
                        var parent_pnl = pnl.up('panel');
                            parent_pnl.getViewModel().set('isReadOnly', false);
                           // activeTab.down('button[action=search_premise]').setDisabled(true);
                           // activeTab.down('button[action=link_applicant]').setDisabled(true);
                            if(me.getMainTabPanel().getActiveTab().getViewModel()){
                                me.getMainTabPanel().getActiveTab().getViewModel().set('model', model);
                            }
                            // activeTab.down('combo[name=sub_module_id]').setDisabled(true);
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
            // activeTab.down('combo[name=sub_module_id]').setDisabled(true);
            activeTab.down('combo[name=sub_module_id]').setValue(sub_module_id);
                          
        }
    },
    prepapreTransitPermitReceiving: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl;
        application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = activeTab.down('importexportapplicantdetailsfrm'),
            importexportdetailsfrm = activeTab.down('#transitdetailsfrm'),
            importexportpremisesfrm = activeTab.down('#importexportpremisesfrm'),
            senderreceiverdetailsfrm = activeTab.down('#senderreceiverdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]');
        filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareImportExporPermitReceivingStage',
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
                        senderReceiverDetails = resp.senderReceiverDetails,
                        premisesDetails = resp.premisesDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                    senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails);
                    premisesDetails = Ext.create('Ext.data.Model', premisesDetails);

                    if (success == true || success === true) {

                        applicantFrm.loadRecord(model);
                        importexportdetailsfrm.loadRecord(model);

                        importexportpremisesfrm.loadRecord(premisesDetails);

                        if(senderreceiverdetailsfrm){
                            senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                        }

                      //  zone_cbo.setValue(branch_id);

                        activeTab.down('displayfield[name=application_status]').setValue(results.application_status);

                        activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);

                        var parent_pnl = pnl.up('panel');
                        parent_pnl.getViewModel().set('isReadOnly', false);
                        // activeTab.down('button[action=search_premise]').setDisabled(true);
                        // activeTab.down('button[action=link_applicant]').setDisabled(true);
                        if(me.getMainTabPanel().getActiveTab().getViewModel()){
                                me.getMainTabPanel().getActiveTab().getViewModel().set('model', model);
                            }
                        // activeTab.down('combo[name=sub_module_id]').setDisabled(true);
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
            // activeTab.down('combo[name=sub_module_id]').setDisabled(true);
            activeTab.down('combo[name=sub_module_id]').setValue(sub_module_id);

        }
    },
    prepapreControlledDrugsPermitsReceiving:function(pnl){

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('importexportapplicantdetailsfrm'),
            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            senderreceiverdetailsfrm = activeTab.down('senderreceiverdetailsfrm'),
            
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            
            zone_cbo = activeTab.down('combo[name=branch_id]');
          
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareNarcoticsPermitReceivingStage',
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
                        senderReceiverDetails = resp.senderReceiverDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                        senderreceiverdetailsmdl = Ext.create('Ext.data.Model', senderReceiverDetails);

                    if (success == true || success === true) {
                        
                        applicantFrm.loadRecord(model);
                        importexportdetailsfrm.loadRecord(model);
                        if(senderreceiverdetailsfrm){
                            senderreceiverdetailsfrm.loadRecord(senderreceiverdetailsmdl);
                        }
                        
                        zone_cbo.setValue(branch_id);

                        activeTab.down('displayfield[name=application_status]').setValue(results.application_status);

                        activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                        
                        var parent_pnl = pnl.up('panel');
                            parent_pnl.getViewModel().set('isReadOnly', false);
                        
                            //activeTab.down('button[action=link_applicant]').setDisabled(true);{} 


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
            Ext.getBody().unmask();
            //It's a new application
            activeTab.down('combo[name=sub_module_id]').setDisabled(true);
            activeTab.down('combo[name=sub_module_id]').setValue(sub_module_id);
                          

        }


    },
    prepapreDisposalReceiving: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('disposalapplicantdetailsfrm'),
            disposalpermitsdetailsfrm = activeTab.down('#disposalpermitsdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]');
          
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareDisposalPermitReceivingStage',
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
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);

                    if (success == true || success === true) {
                        
                       
                        if(applicantFrm){
                                applicantFrm.loadRecord(model);
                        }
                        disposalpermitsdetailsfrm.loadRecord(model);
                        zone_cbo.setValue(branch_id);

                        activeTab.down('displayfield[name=application_status]').setValue(results.application_status);

                        activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                        
                        var parent_pnl = pnl.up('panel');
                            parent_pnl.getViewModel().set('isReadOnly', false);
                            activeTab.down('button[action=search_premise]').setDisabled(true);
                            activeTab.down('button[action=link_applicant]').setDisabled(true);


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
            
            activeTab.down('button[name=process_submission_btn]').setDisabled(false);

            activeTab.down('button[name=process_submission_btn]').setVisible(true);

        }
    },
    prepapreImportExportManagerReview: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl,
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            
            applicantFrm = activeTab.down('importexportapplicantdetailsfrm'),
            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            importexportpremisesfrm = activeTab.down('#importexportpremisesfrm'),
            senderreceiverdetailsfrm = activeTab.down('#senderreceiverdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]'),
            filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareImportExporPermitReceivingStage',
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
                        senderReceiverDetails = resp.senderReceiverDetails,
                        premisesDetails = resp.premisesDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                        senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails);
                        premisesDetails = Ext.create('Ext.data.Model', premisesDetails);

                    if (success == true || success === true) {
                        
                        applicantFrm.loadRecord(model);
                        if(results.module_id != 20){
                            importexportpremisesfrm.loadRecord(premisesDetails);
                            activeTab.down('button[action=search_premise]').setDisabled(true);
                        }
                        importexportdetailsfrm.loadRecord(model);
                        if(senderreceiverdetailsfrm){
                            senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                        }
                        if(zone_cbo){
                            zone_cbo.setValue(branch_id);
                            zone_cbo.setDisabled(true);
                        }

                        activeTab.down('displayfield[name=application_status]').setValue(results.application_status);

                        activeTab.down('displayfield[name=reference_no]').setValue(results.tracking_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(results.reference_no);
                        if(results.module_id != 20){
                            if(results.sub_module_id == 13 || results.sub_module_id == 15){
                                activeTab.down('combo[name=approval_recommendation_id]').setValue(results.approval_recommendation_id);
                                activeTab.down('combo[name=approval_recommendation_id]').setVisible(true);
                            }else{
                                activeTab.down('combo[name=approval_recommendation_id]').setVisible(false);
                            }
                           

                        }
                        else{
                            docsGrid = activeTab.down('declaredimportexportdocuploadsgrid');
                            docsGrid.down('hiddenfield[name=application_code]').setValue(results.application_code);
                            docsGrid.down('hiddenfield[name=section_id]').setValue(results.section_id);
                            docsGrid.down('hiddenfield[name=module_id]').setValue(results.module_id);
                            docsGrid.down('hiddenfield[name=sub_module_id]').setValue(results.sub_module_id);
                    
                            docsGrid.portal_uploads =3;
                            docsGrid.getStore().load();

                        }
                       
                        activeTab.down('combo[name=prechecking_recommendation_id]').setValue(results.prechecking_recommendation_id);
                        activeTab.down('combo[name=review_recommendation_id]').setValue(results.review_recommendation_id);
                        


                        var parent_pnl = pnl.up('panel');
                            parent_pnl.getViewModel().set('isReadOnly', true);
                            if(me.getMainTabPanel().getActiveTab().getViewModel()){
                                me.getMainTabPanel().getActiveTab().getViewModel().set('model', model);
                            }
                            // activeTab.down('combo[name=sub_module_id]').setDisabled(true);
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
            // activeTab.down('combo[name=sub_module_id]').setDisabled(true);
            activeTab.down('combo[name=sub_module_id]').setValue(sub_module_id);
                          
        }
    },
    prepapreDisposalOnlineReceiving: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl;
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = activeTab.down('disposalapplicantdetailsfrm'),
            onlinedisposalpermitsdetailsfrm = activeTab.down('#onlinedisposalpermitsdetailsfrm'),
            importexportpremisesfrm = activeTab.down('#importexportpremisesfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]');
            filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
			checklistTypesGrid = pnl.down('combo[name=applicable_checklist]'),
            checklistTypesStr = checklistTypesGrid.getStore(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        checklistTypesStr.removeAll();
        checklistTypesStr.load({params: {module_id: module_id, sub_module_id: sub_module_id, section_id: section_id}});


        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepapreDisposalOnlineReceiving',
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
                        senderReceiverDetails = resp.senderReceiverDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                        senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails);

                    if (success == true || success === true) {
                        

                        applicantFrm.loadRecord(model);
                        onlinedisposalpermitsdetailsfrm.loadRecord(model);

                        // zone_cbo.setReadOnly(true);
                        zone_cbo.setValue(branch_id);
                        zone_cbo.setDisabled(true);
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
    prepapreDeclaredImportExportOnlineReceiving:function(pnl){
            
        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl;
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = activeTab.down('importexportapplicantdetailsfrm'),
            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            senderreceiverdetailsfrm = activeTab.down('#senderreceiverdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]');
            filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
     
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepapreDeclaredImportExportOnlineReceivingStage',
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
                        senderReceiverDetails = resp.senderReceiverDetails,
                        premisesDetails = resp.premisesDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                        senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails);

                    if (success == true || success === true) {
                        

                        applicantFrm.loadRecord(model);
                        importexportdetailsfrm.loadRecord(model);
                        if(senderreceiverdetailsfrm){
                            senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                        }
                        // zone_cbo.setReadOnly(true);
                        zone_cbo.setValue(branch_id);
                        zone_cbo.setDisabled(true);
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
    prepapreImportExportOnlineReceiving: function (pnl) {

        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl;
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = activeTab.down('importexportapplicantdetailsfrm'),
            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            importexportpremisesfrm = activeTab.down('#importexportpremisesfrm'),
            senderreceiverdetailsfrm = activeTab.down('#senderreceiverdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]');
            filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();

        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareOnlineImportExporPermitReceivingStage',
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
                        senderReceiverDetails = resp.senderReceiverDetails,
                        premisesDetails = resp.premisesDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                        senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails);
                        premisesDetails = Ext.create('Ext.data.Model', premisesDetails);

                    if (success == true || success === true) {
                        

                        applicantFrm.loadRecord(model);
                        importexportdetailsfrm.loadRecord(model);

                        importexportpremisesfrm.loadRecord(premisesDetails);
                        if(senderreceiverdetailsfrm){
                            senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                        }

                        // zone_cbo.setReadOnly(true);
                        zone_cbo.setValue(branch_id);
                        zone_cbo.setDisabled(true);
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
    }, refreshonlineimportexportappsgrid: function (me) {
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
    },
    refreshimportexportpermitsdashgrid:function(me){
        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            
            activeTab = mainTabPanel.getActiveTab(),
            workflow_stage_id = activeTab.down('combo[name=workflow_stage_id]').getValue();
            sub_module_id = activeTab.down('combo[name=sub_module_id]').getValue();
            
            store.getProxy().extraParams = {
                workflow_stage_id: workflow_stage_id,
                sub_module_id: sub_module_id
            };
   
    },
    refreshimportexportpermitsproductsgrid: function (me) {
        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            section_id;
        //check if has been set or use window 
        if (me.up('window')) {
            var panel = me.up('window'),
            application_code = panel.down('hiddenfield[name=active_application_code]').getValue();
        }
        else {
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        }
        if(activeTab.down('hiddenfield[name=imp_application_code]')){
            application_code = activeTab.down('hiddenfield[name=imp_application_code]').getValue();
        }
        if(activeTab.down('hiddenfield[name=old_application_code]')){
            application_code = activeTab.down('hiddenfield[name=old_application_code]').getValue();
        }
        if(activeTab.down('hiddenfield[name=section_id]')){
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        }

        store.getProxy().extraParams = {
            application_code: application_code,
            section_id: section_id
        };
    },
    refreshregisterednonregisteredprodgrid: function (me) {

        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            prodclass_category_id,section_id, sub_module_id;

        //check if has been set or use window 
        if (activeTab.down('hiddenfield[name=importexport_permittype_id]')) {
            importexport_permittype_id = activeTab.down('hiddenfield[name=importexport_permittype_id]').getValue();
            applicant_id = activeTab.down('hiddenfield[name=applicant_id]').getValue();
 
        }
        else {

            var panel = me.up('window'),
            importexport_permittype_id = panel.down('hiddenfield[name=importexport_permittype_id]').getValue();
                applicant_id = panel.down('hiddenfield[name=applicant_id]').getValue();

        }
        if(activeTab.down('combo[name=prodclass_category_id]')){
            prodclass_category_id = activeTab.down('combo[name=prodclass_category_id]').getValue();
        }
        if(activeTab.down('combo[name=section_id]')){
            section_id = activeTab.down('combo[name=section_id]').getValue();
        }
        if(activeTab.down('hiddenfield[name=sub_module_id]')){
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();
        }
        store.getProxy().extraParams = {
            importexport_permittype_id: importexport_permittype_id,
            applicant_id:applicant_id,
            prodclass_category_id: prodclass_category_id,
            section_id: section_id,
            sub_module_id: sub_module_id    
        };
    },
    searchproductsinformationgrid: function (me) {

        

    },
    
    refreshonlineimportexportdocuploadsgrid: function (me) {

        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();

        //check if has been set or use window 
        if ( me.up('window')) {
            var panel = me.up('window'),
            application_code = panel.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = panel.down('hiddenfield[name=module_id]').getValue(),
            section_id = panel.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = panel.down('hiddenfield[name=sub_module_id]').getValue();

        }
        else {
           
            var application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();
          
                
        }
//console.log(application_code);
        store.getProxy().extraParams = {
            application_code: application_code,
            module_id: module_id,
            section_id: section_id,
            sub_module_id: sub_module_id,
            portal_uploads:1
        };

    },
    refreshpreviousimportexportdocuploadsgrid: function (me) {

        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();

        //check if has been set or use window 
        if (me.up('window')) {
           
                var panel = me.up('window'),
                    application_code = panel.down('hiddenfield[name=active_application_code]').getValue();
                    module_id = panel.down('hiddenfield[name=module_id]').getValue(),
                    section_id = panel.down('hiddenfield[name=section_id]').getValue(),
                    sub_module_id = panel.down('hiddenfield[name=sub_module_id]').getValue();
                    
        }
        else {
 
            var application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
                                        module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
                                        section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
                                        sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();

           
        }

        store.getProxy().extraParams = {
            application_code: application_code
        };

    },
    
    showNewDisposalApplications: function (sub_module_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#disposalapplicationsdashwrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            filter = {section_id: section_id};
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
        workflowContainer.down('displayfield[name=application_status]').setValue(workflow_details.applicationStatus);
        workflowContainer.down('hiddenfield[name=process_id]').setValue(workflow_details.processId);
        workflowContainer.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_details.initialStageId);
        workflowContainer.down('hiddenfield[name=module_id]').setValue(module_id);
        workflowContainer.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        workflowContainer.down('hiddenfield[name=section_id]').setValue(section_id);
        dashboardWrapper.add(workflowContainer);
        //reload Stores 
        var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: workflow_details.processId,
                workflow_stage: workflow_details.initialStageId
            }
        });
        activeTab.down('button[action=search_premise]').setDisabled(false);
        activeTab.down('button[action=link_applicant]').setDisabled(false);
       //disposalpermitreceiving
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);

        //load the stores

    },
    //poe import products 
    funcSavePOEPermitProductDetails: function (btn) {
        var grid = btn.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            poe_application_id = activeTab.down('hiddenfield[name=poe_application_id]').getValue(),
            store = grid.getStore(),
            params = [];

        for (var i = 0; i < store.data.items.length; i++) {
            var record = store.data.items [i],
                 poe_permitsdata_id = record.get('id'),
                 permits_product_id = record.get('permits_product_id'),
                 batch_numbers = record.get('batch_numbers'),
                 remarks = record.get('remarks'),
                 poe_prod_quantity = record.get('poe_prod_quantity');
        
                 if(batch_numbers != ''){
                    var obj = {
                        poe_permitsdata_id: poe_permitsdata_id,
                        permits_product_id: permits_product_id,
                        batch_numbers:batch_numbers,
                        remarks:remarks,
                        poe_prod_quantity: poe_prod_quantity
                    };
                    if (record.dirty) {
                        params.push(obj);
                    }
                 }else{
                    toastr.warning('Enter the products Batch Number!!', 'Warning Response');
                    return false;
                 }
           
        }
       
        this.funcUpdatePOEPermitProdctDetails(btn,params);
    },funcSaveAllPOEPermitProductDetails:function(btn){
        var grid = btn.up('grid');
            sm = grid.getSelectionModel(),
            selected_records = sm.getSelection();
            params = [];
            Ext.each(selected_records, function (item) {
                
                    var poe_permitsdata_id = item.data.id,
                    permits_product_id = item.data.permits_product_id,
                    
                    batch_numbers = item.data.batch_numbers,
                    poe_prod_quantity = item.data.balance;

                        if(batch_numbers != ''){
                            var obj = {
                                poe_permitsdata_id: poe_permitsdata_id,
                                permits_product_id: permits_product_id,
                                batch_numbers:batch_numbers,
                                poe_prod_quantity: poe_prod_quantity
                            };
                            params.push(obj);
                         }else{
                            toastr.warning('Enter the products Batch Number!!', 'Warning Response');
                            return false;
                         }
            });
            this.funcUpdatePOEPermitProdctDetails(btn,params);
    },
    funcUpdatePOEPermitProdctDetails:function(btn,params){
        var grid = btn.up('grid'),
        mainTabPanel = this.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab(),
        application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
        poe_application_id = activeTab.down('hiddenfield[name=poe_application_id]').getValue(),
        store = grid.getStore();
        
        if (params.length < 1) {
            btn.setLoading(false);
            toastr.warning('No records to save!!', 'Warning Response');
            return false;
        }
        grid.mask('updating');
        params = JSON.stringify(params);
        Ext.Ajax.request({
                    url: 'importexportpermits/savePOEPermitProductDetails',
                    params: {
                        poe_application_id: poe_application_id,
                        application_code: application_code,
                        poe_products: params
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                        btn.setLoading(false);
                        grid.unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message;
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                            store.load();
                        } else {
                            toastr.error(message, 'Failure Response');
                        }

                    },
                    failure: function (response) {
                        grid.unmask();
                        btn.setLoading(false);
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        btn.setLoading(false);
                        grid.unmask();
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
        })


    },showManagerQueryApplicationSubmissionWin: function (btn) {
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
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagersgenericfrm', winWidth, storeID,'','','',workflow_stage_id);
           
        } else {
            Ext.getBody().unmask();
        }
    },showManagerApplicationSubmissionWin: function (btn) {
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
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagersgenericfrm', winWidth, storeID,'','','',workflow_stage_id);
           
        } else {
            Ext.getBody().unmask();
        }
    },
    
    showApplicationApprovalApplicationSubmissionWin: function (btn) {

        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form').getForm(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            hasReviewRecommendation  = checkApprovalREcommendationDEtails(application_code),
            storeID = getApplicationStore(module_id, section_id);
        if(!hasReviewRecommendation){
               
            toastr.error('Response: Enter the Review recommendation to proceed', 'Error Response'); 
            Ext.getBody().unmask();
            return;
        }
        showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,'','','',workflow_stage_id);
        Ext.getBody().unmask();
    },
    showReturnBackApplicationSubmissionWin:function(btn){

        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form').getForm(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
            extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'workflowaction_type_id',
                value: 9
            }]; 
        showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth,storeID,extraParams,'','',workflow_stage_id);
        Ext.getBody().unmask();
    },
    showManagerReviewApplicationSubmissionWin: function (btn) {

        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form').getForm(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            hasReviewRecommendation  = checkReviewREcommendationDEtails(application_code),
            review_recommendation_id = activeTab.down('combo[name=review_recommendation_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
        if(!hasReviewRecommendation){
            toastr.error('Response: Enter the Review recommendation to proceed', 'Error Response'); 
            Ext.getBody().unmask();
            return;
        }
        if(review_recommendation_id == 3){
            extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'workflowaction_type_id',
                value: 13
            }];
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,extraParams,'','',workflow_stage_id);
        }
        else if(review_recommendation_id == 4){
            extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'workflowaction_type_id',
                value: 14
            }];
            
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,extraParams,'','',workflow_stage_id);
        }
        else{
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,'','','',workflow_stage_id);
        }
     
        Ext.getBody().unmask();
    },

    
    showManagerReviewApplicationTraderSubmissionWin: function (btn) {

        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            form = activeTab.down('form').getForm(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
            extraParams = [{
                field_type: 'hiddenfield',
                field_name: 'workflowaction_type_id',
                value: 4
            }]; 
        showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsfrm', winWidth, storeID,extraParams,'','',workflow_stage_id);
        Ext.getBody().unmask();
    },
    saveImportAppReviewRecommendationDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainStore = activeTab.down('grid').getStore(),
            form = btn.up('form'),
            decision_id = form.down('combo[name=decision_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue();
            console.log(module_id);
            frm = form.getForm(),
            win = form.up('window'),
            action_url = 'common/saveApplicationApprovalDetails';
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                params: {
                    //module_id: module_id
                },
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        if(activeTab.down('combo[name=review_recommendation_id]')){
                            activeTab.down('combo[name=review_recommendation_id]').setValue(decision_id);
                        }
                        else{
                            mainStore.load();
                        }
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
        }else{
            toastr.error('failed to fetch application details', 'Error');
        }
        if(application_code){
            pnl.down('hiddenfield[name=application_code]').setValue(application_code);
            pnl.down('hiddenfield[name=module_id]').setValue(module_id);
            pnl.down('hiddenfield[name=section_id]').setValue(section_id);
        }else{
            toastr.error('Failed to fetch application details', 'Error Response');
        }
    },
    refreshvariationGrid: function(me) {
        var grid = me.up('grid'),
            store = grid.store,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();

        store.getProxy().extraParams = {
            application_code: application_code,
            module_id: module_id,
            section_id: section_id,
            sub_module_id: sub_module_id,
            table_name: 'tra_variation_requests'
        };
    },
    funcSavePOEApplication: function(btn){
         var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            imp_application_code = activeTab.down('hiddenfield[name=imp_application_code]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            poe_application_id = activeTab.down('hiddenfield[name=poe_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();

        if (imp_application_code) {
            btn.setLoading(true);
           Ext.Ajax.request({
                url: 'importexportpermits/saveInitialPOEPermitAppDetails',
                params: {
                    poe_application_id: poe_application_id,
                    application_code: application_code,
                    application_id: application_id,
                    sub_module_id: sub_module_id,
                    process_id: process_id,
                    workflow_stage_id: workflow_stage_id,
                    imp_application_code: imp_application_code
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (response) {
                    btn.setLoading(false);
                    var resp = Ext.JSON.decode(response.responseText),
                        success = resp.success,
                        message = resp.message;
                    if (success == true || success === true) {
                        toastr.success(message, 'Success Response');
                        activeTab.down('displayfield[name=reference_no]').setValue(resp.reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(resp.tracking_no);
                        activeTab.down('hiddenfield[name=active_application_code]').setValue(resp.application_code);
                        activeTab.down('hiddenfield[name=active_application_id]').setValue(resp.active_application_id);
                        activeTab.down('hiddenfield[name=poe_application_id]').setValue(resp.active_application_id);
                        activeTab.down('displayfield[name=application_status]').setValue(resp.application_status);
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
        } else {
            toastr.warning('Please select a permit first!!', 'Warning Response');
        }
    },
    showPermitReturnSubmissionWin: function (btn) {
     alert();
    },
    showReceivingPoeApplicationSubmissionWin: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            imp_application_code = activeTab.down('hiddenfield[name=imp_application_code]').getValue(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            poe_application_id = activeTab.down('hiddenfield[name=poe_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            inspection_recommendation_id = activeTab.down('hiddenfield[name=inspection_recommendation_id]').getValue(),
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();
       
        if(poe_application_id != '' && inspection_recommendation_id != ''){
           showWorkflowSubmissionWin(poe_application_id, application_code, 'tra_poe_applications', 'workflowsubmissionsreceivingfrm', '60%', btn.storeID);
        }else{
            toastr.error('Please provide the Inspection Final Recommendation!!', 'Failure Response');
            
        }
    },
    verifyHFDProductCount: function(frm){
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            controlleddrugs_type_id = frm.down('combo[name=controlleddrugs_type_id]').getValue(),
            id = frm.down('hiddenfield[name=id]').getValue(),
            prodlist = activeTab.down('controldrugsimppermitsproductsgrid'),
            store = prodlist.getStore();
        
        if(id > 0){
            return true;
        }
        var count = store.queryBy(function(rec, id) {
            return rec.get('controlleddrugs_type_id') == controlleddrugs_type_id;
        });
        total = count.getCount();
        
        if(total > 2){
            return false;
        }else{
            return true;
        }
    },
    loadPermitApprovalReleaseForm:function(btn){
        var button = btn.up('button'),
            record = button.getWidgetRecord(),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();

        //reset values 
        activeTab.down('hiddenfield[name=active_application_id]').setValue(record.get('application_id'));
        activeTab.down('hiddenfield[name=active_application_code]').setValue(record.get('application_code'));

        this.showManagerReviewRecommendationWin(btn);

    },
    prepaprePermitCancellationReceiving: function (pnl) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            activeTab = pnl,
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicantFrm = activeTab.down('importexportapplicantdetailsfrm'),
            importexportdetailsfrm = activeTab.down('#importexportdetailsfrm'),
            importexportpremisesfrm = activeTab.down('#importexportpremisesfrm'),
            senderreceiverdetailsfrm = activeTab.down('#senderreceiverdetailsfrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            zone_cbo = activeTab.down('combo[name=branch_id]'),
            filter = { section_id: section_id },
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            
        if (application_status_id == 4 || application_status_id === 4) {
            activeTab.down('button[name=queries_responses]').setVisible(true);
        }
        if(sub_module_id == 73 && application_id > 0){
            activeTab.down('button[name=select_applications]').setVisible(false);
            activeTab.down('textfield[name=reference_no]').setVisible(false);
        }
        var app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore();
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        if (application_id) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'importexportpermits/prepareImportExporPermitReceivingStage',
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
                        senderReceiverDetails = resp.senderReceiverDetails,
                        premisesDetails = resp.premisesDetails,
                        branch_id = results.branch_id,
                        model = Ext.create('Ext.data.Model', results);
                        senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails);
                        premisesDetails = Ext.create('Ext.data.Model', premisesDetails);

                    if (success == true || success === true) {
                        
                        applicantFrm.loadRecord(model);
                        importexportdetailsfrm.loadRecord(model);
                        if(senderreceiverdetailsfrm){
                            senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                        }
                        if(importexportpremisesfrm){
                            importexportpremisesfrm.loadRecord(premisesDetails);
                        }
                        activeTab.down('displayfield[name=application_status]').setValue(results.application_status);
                        activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                        activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                        if(me.getMainTabPanel().getActiveTab().getViewModel()){
                                me.getMainTabPanel().getActiveTab().getViewModel().set('model', model);
                            }
                            // activeTab.down('combo[name=sub_module_id]').setDisabled(true);
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
            // activeTab.down('combo[name=sub_module_id]').setDisabled(true);
            activeTab.down('combo[name=sub_module_id]').setValue(sub_module_id);
                          
        }
    },

    showPermitCancellationReceivingApplicationSubmissionWin: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            storeID = btn.storeID,
            table_name = btn.table_name,
            winWidth = btn.winWidth,
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
        application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = getApplicationStore(module_id, section_id);
            //valid = this.validateNewDisposalReceivingSubmission();
            
        //if (valid) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID);
      //  }
        // else {
        //     Ext.getBody().unmask();
        //     toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
        //     return;
        // }
    },
    savePermitCancellationRecommendationDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainStore = activeTab.down('grid').getStore(),
            form = btn.up('form'),
            decision_id = form.down('combo[name=decision_id]').getValue(),
            frm = form.getForm(),
            win = form.up('window'),
            action_url = 'importexportpermits/savePermitCancellationApprovalDetails';
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                params: {
                    module_id: 4
                },
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        if(activeTab.down('combo[name=review_recommendation_id]')){
                            activeTab.down('combo[name=review_recommendation_id]').setValue(decision_id);
                        }
                        else{
                            mainStore.load();
                        }
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
        }
    },
    funcSavePOEConsumptionApplication: function(btn){
        var mainTabPanel = this.getMainTabPanel(),
           activeTab = mainTabPanel.getActiveTab(),
           application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
           imp_application_code = activeTab.down('hiddenfield[name=imp_application_code]').getValue(),
           application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
           module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
           section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
           poe_application_id = activeTab.down('hiddenfield[name=poe_application_id]').getValue(),
           process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
           workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue(),
           form = activeTab.down('importexportdetailsfrm'),
           frm = form.getForm(),
           sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue();
       if(form.isValid()){
           form.submit({
               url: 'importexportpermits/savePOEConsignmentPermitVerification',
               waitMsg: 'Saving POE Permit Verification wait...',
               params: {
                   poe_application_id: poe_application_id,
                   application_code: application_code,
                   application_id: application_id,
                   sub_module_id: sub_module_id,
                   process_id: process_id,
                   workflow_stage_id: workflow_stage_id,
                   _token: token,
                   imp_application_code: imp_application_code
               },
               headers: {
                   'Authorization': 'Bearer ' + access_token
               },
               success: function (frm, action) {
                   btn.setLoading(false);
                   var resp = action.result,
                       success = resp.success,
                       message = resp.message;
                   if (success == true || success === true) {
                       toastr.success(message, 'Success Response');
                       activeTab.down('displayfield[name=reference_no]').setValue(resp.reference_no);
                       activeTab.down('displayfield[name=tracking_no]').setValue(resp.tracking_no);
                       activeTab.down('hiddenfield[name=active_application_code]').setValue(resp.application_code);
                       activeTab.down('hiddenfield[name=active_application_id]').setValue(resp.active_application_id);
                       activeTab.down('hiddenfield[name=poe_application_id]').setValue(resp.active_application_id);
                       activeTab.down('displayfield[name=application_status]').setValue(resp.application_status);
                   } else {
                       toastr.error(message, 'Failure Response');
                   }
               },
               failure: function (frm, action) {
                   var resp = action.result,
                       message = resp.message;
                   toastr.error(message, "Failure Response");
               }
           });
       } else {
           toastr.warning('Please fill all required consignment details!!', 'Warning Response');
       }
   },
   generateImportExportpermit:function(application_code,module_id,permit_watermark ){

    var action_url = 'reports/genenerateImportExportPermit?application_code=' + application_code + '&&module_id=' + module_id+'&permit_watermark='+permit_watermark;
        print_report(action_url);

},
loadSelectedPermitDetails: function (view, record) {
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
        reference_no = record.get('reference_no'),
        view_id = record.get('view_id'),
        title = 'Permit cancellation';
        workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id,null,null,null,null);
    if (!workflow_details) {
        Ext.getBody().unmask();
        toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
        return false;
    }
    var tab = mainTabPanel.getComponent(view_id);
    title = "Permit Cancellation";
    if (!tab) {
        var newTab = Ext.widget(workflow_details.viewtype, {
            title: title,
            closable: true
        });
        record.set('sub_module_id', sub_module_id);
        record.set('process_id', workflow_details.processId);
        record.set('workflow_stage_id', workflow_details.initialStageId);
        record.set('workflow_stage', workflow_details.initialStageName);
       // record.set('application_status', workflow_details.initialAppStatus);
        record.set('process_name', workflow_details.processName);
    //set prerequisites
    me.preparePermitCancellationApplicationBaseDetails(newTab, record);
    newTab.getViewModel().set('isReadOnly', false);
    //load form
        mainTabPanel.add(newTab);
        var lastTab = mainTabPanel.items.length - 1;
        mainTabPanel.setActiveTab(lastTab);
    } else {
        mainTabPanel.setActiveTab(tab);
    }

    //loading prefilled form
    me.onApprovedPermitCancellationDblClick(newTab, record);

    //close pop up if there
    grid = Ext.ComponentQuery.query("#permitSelectionGrid")[0];
    if(grid){
        grid.up('window').close();
    }
    Ext.Function.defer(function () {
        Ext.getBody().unmask();
    }, 300);
},
preparePermitCancellationApplicationBaseDetails: function (tab, record) {
    var me = this,
        process_name = record.get('process_name'),
        workflow_stage = record.get('workflow_stage'),
       // application_status = record.get('application_status'),
        reference_no = record.get('reference_no'),
        process_id = record.get('process_id'),
        module_id = record.get('module_id'),
        sub_module_id = record.get('sub_module_id'),
        section_id = record.get('section_id'),
        active_application_id = record.get('active_application_id'),
        workflow_stage_id = record.get('workflow_stage_id');
        application_code = record.get('application_code');
    tab.down('hiddenfield[name=process_id]').setValue(process_id);
    tab.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
    tab.down('hiddenfield[name=module_id]').setValue(module_id);
    tab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
    tab.down('hiddenfield[name=section_id]').setValue(section_id);
    tab.down('hiddenfield[name=active_application_id]').setValue(active_application_id);
    tab.down('displayfield[name=process_name]').setValue(process_name);
    tab.down('displayfield[name=workflow_stage]').setValue(workflow_stage);
    tab.down('displayfield[name=application_status]').setVisible(false);
    tab.down('displayfield[name=reference_no]').setValue(reference_no);
    tab.down('hiddenfield[name=old_application_code]').setValue(application_code);
},
onApprovedPermitCancellationDblClick: function (grid, record) {
    Ext.getBody().mask('Please wait...');
    var me = this,
        mainTabPanel = me.getMainTabPanel(),
        activeTab = mainTabPanel.getActiveTab();
        console.log(activeTab);
        module_id = record.get('module_id'),
        sub_module_id = record.get('sub_module_id'),
        section_id = record.get('section_id'),
        active_application_id = record.get('active_application_id'),
        permit_id = record.get('permit_id'),
        app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
        app_form = activeTab.down('importexportdetailsfrm'),
        app_form = Ext.widget(app_form);
        applicant_form = activeTab.down('importexportapplicantdetailsfrm'),
        sender_receiver_frm = activeTab.down('senderreceiverdetailsfrm'),
        sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
        process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
        section_id = activeTab.down('hiddenfield[name=section_id]').getValue();
        activeTab.down('hiddenfield[name=module_id]').setValue(module_id);
        activeTab.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        activeTab.down('hiddenfield[name=section_id]').setValue(section_id);
        activeTab.down('hiddenfield[name=active_application_id]').setValue(active_application_id);
        active_application_id = activeTab.down('hiddenfield[name=active_application_id]');
        filter = {section_id: section_id},
        workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
    app_doc_types_store.removeAll();
    app_doc_types_store.load({
        params: {
            process_id: process_id,
            workflow_stage: workflow_stage_id
        }
    });
    if (permit_id) {
        Ext.Ajax.request({
            method: 'GET',
            url: 'importexportpermits/getGrantedPermitDetails',
            params: {
                permit_id:permit_id
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message,
                    success = resp.success,
                    results = resp.results,
                    senderdetails = resp.senderdetails,
                    model = Ext.create('Ext.data.Model', results);
                    model2 = Ext.create('Ext.data.Model', senderdetails);
                if (success == true || success === true) {
                    app_form.loadRecord(model);
                    applicant_form.loadRecord(model);
                    sender_receiver_frm.loadRecord(model2);
                    active_application_id.setValue();
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
    }
},
});

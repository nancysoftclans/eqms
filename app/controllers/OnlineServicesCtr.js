Ext.define('Admin.controller.OnlineServicesCtr', {
    extend: 'Ext.app.Controller',
    stores: ['Admin.store.online_services.OnlineMenusStr'],
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
                receivePortalApplicationsGeneric: 'receivePortalApplicationsGeneric',
                showPortalReceivingApplicationMoreDetails: 'showPortalReceivingApplicationMoreDetails',
            }
        }
    },
    showPortalReceivingApplicationMoreDetails: function (btn,application_code,module_id,sub_module_id,section_id,prodclass_category_id,ref_no,application_id,applicant_id,process_id) {
        var isReadOnly = btn.isReadOnly,
            is_temporal = btn.is_temporal,
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            console.log(activeTab);
            if(section_id ==4){
                view = 'mDDrugsPortalProductsDetailsPnl'; 
            }
            else{
                view = 'drugsPortalProductsDetailsPnl';
            }
            //products details
            if(sub_module_id == 9){
                view = 'altdrugsProductsDetailsPnl';
           }
           else if(sub_module_id == 79){
               view = 'listingproductdetailsPnl';
           }
           else if(sub_module_id == 75){
              // prodclass_category_id = activeTab.down('hiddenfield[name=prodclass_category_id]').getValue();
               console.log(prodclass_category_id);
               if(section_id == 4){
                   view = 'portalExemptionMDProductsDetailsPnl';
               }
               else if(prodclass_category_id){
                   if(prodclass_category_id == 47){
                       view = 'portalExemptionVetProductsDetailsPnl';
                   }
                   else if(prodclass_category_id == 51){
                       view = 'portalExemptionsWSProductsDetailsPnl';
                   }
                     else if(prodclass_category_id == 372){
                       view = 'portalExemptionVetWSProductsDetailPnl';
                   }
                   else if(prodclass_category_id == 373){
                    view = 'portalExemptionVetWSProductsDetailPnl';
                   }
                   else if(prodclass_category_id == 48){
                       view = 'portalExemptionVetWSProductsDetailPnl';
                   }
                   else if(prodclass_category_id == 50){
                       view = 'portalExemptionsDrugProductsDetailsPnl';
                   }    
               }
           }
           else if(sub_module_id ==78 || sub_module_id ==3){
               view='premiseAltappmoredetailswizard'
           }
           else if(sub_module_id ==33){
               view='portalPromotionMaterialDetailsPnl'
           }
           if(module_id==1){
            this.showProductPortalApplicationMoreDetailsGeneric(application_code,view,isReadOnly,ref_no);
        }else if(module_id == 2){
            this.showPortalPremiseApplicationMoreDetailsGeneric(application_code, application_id, applicant_id, ref_no, process_id, module_id, sub_module_id, section_id, isReadOnly);
        }else if(sub_module_id == 73){
            this.showPermitPortalApplicationMoreDetailsGeneric('previewAmmendimportexportpermitdetails',application_id, applicant_id, ref_no, process_id,  isReadOnly);
        }
        else if(module_id == 4){
            this.showPermitPortalApplicationMoreDetailsGeneric('portalImportExportPermitDetailsPnl',application_id, applicant_id, ref_no, process_id,  isReadOnly);
        }
        else if(module_id == 12){
            this.showPermitPortalApplicationMoreDetailsGeneric('previewPortalControlledDrugsImpPermitDetails',application_id, applicant_id, ref_no, process_id,  isReadOnly);
        } else if(module_id==3){
            // var application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            //     site_id = activeTab.down('hiddenfield[name=manufacturing_site_id]').getValue(),
            //     gmp_type_id = activeTab.down('hiddenfield[name=gmp_type_id]').getValue();
            this.showGmpPortalApplicationMoreDetailsGeneric(application_id, application_code, applicant_id, ref_no, process_id, module_id, sub_module_id, section_id, isReadOnly);
        }else if(module_id == 7){
            this.showClinicalTrialPortalApplicationMoreDetailsGeneric(application_id, application_code, applicant_id, ref_no, process_id, module_id, sub_module_id, section_id, isReadOnly);
        }else if(module_id == 21){
            this.showPvPortalApplicationMoreDetailsGeneric(application_code, 'pvPortalDetailsPnl', isReadOnly,ref_no);
        }else if(module_id == 14){
            this.showPortalPromotionMaterialApplicationMoreDetailsGeneric(application_id,application_code, applicant_id, ref_no, process_id, module_id, sub_module_id, section_id, isReadOnly,view);
        }else if(module_id == 25){
            this.showPortalPsurApplicationMoreDetailsGeneric(application_code, 'portalPsurDetailsPnl', isReadOnly,ref_no);
        }
    },
    showProductPortalApplicationMoreDetailsGeneric: function (application_code,productdetails_panel,isReadOnly,ref_no) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
            }
            is_dataammendment_request =0;
        //when fired from a manager grid and the selection is different from what was loaded from intray
        //this helps product wizard grids to load with the correct application  code
        // if(application_code){
        //     activeTab.down('hiddenfield[name=active_application_code]').setValue(application_code);
        // }
        var me = this,
            productdetails_panel = Ext.widget(productdetails_panel);
        productdetails_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'onlineservices/getProductPortalApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    applicantDetails = resp.applicant_details,
                    ltrDetails = resp.ltrDetails,
                    product_details = resp.product_details,
                    prodclass_category_id = product_details.prodclass_category_id,
                    section_id = product_details.section_id,
                    branch_id = resp.branch_id;
                if (success == true || success === true) {
                    productdetails_panel.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);

                    products_form = productdetails_panel.down('form');

                    //add applicant
                  if(prodclass_category_id == 50){
                   // productdetails_panel.add(0, {title: 'Presciber', xtype: 'productlocalapplicantdetailsfrm'});
                    productdetails_panel.add(0, {title: 'Pharmacist(Applicant)', xtype: 'productapplicantdetailsfrm'});
                }else if(prodclass_category_id == 51){
                    productdetails_panel.add(0, {title: 'Practitioner Details', xtype: 'exmpProductsDetailsFrm'});
                }else if(prodclass_category_id == 47){
                    productdetails_panel.add(0, {title: 'Application on behalf of the Animal Holding Unit (Farm or Homestead)', xtype: 'portalAnimalHoldingUnitGrid'});
                    productdetails_panel.add(0, {title: 'PRESCRIBER/ APPLICANT Details (Veterinary Surgeon or Paraprofessional)', xtype: 'exmpProductsDetailsFrm'});
                }else if(prodclass_category_id == 48){
                    productdetails_panel.add(0, {title: 'Practitioner/ Applicant (RESPONSIBLE PERSON [Pharmacist / Veterinary Surgeon or Principal Investigator)', xtype: 'exmpProductsDetailsFrm'});
                }else if(prodclass_category_id == 372){
                    productdetails_panel.add(0, {title: 'Practitioner/ Applicant (RESPONSIBLE PERSON [Pharmacist / Veterinary Surgeon or Principal Investigator)', xtype: 'exmpProductsDetailsFrm'});
                }else if(prodclass_category_id == 373){
                    productdetails_panel.add(0, {title: 'Practitioner/ Applicant (RESPONSIBLE PERSON [Pharmacist / Veterinary Surgeon or Principal Investigator)', xtype: 'exmpProductsDetailsFrm'});
                }else{
                    productdetails_panel.add(0, {title: 'Contact Person', xtype: 'productlocalapplicantdetailsfrm'});
                    productdetails_panel.add(0, {title: 'Applicant', xtype: 'productapplicantdetailsfrm'});
                }
                if(!products_form){ //loads after added forms intop if the original view had no form
                    products_form = productdetails_panel.down('form');
                }
                    funcShowStatelessCustomizableWindow(ref_no, '85%', productdetails_panel, 'customizablewindow');
                    if (product_details) {
                        var model2 = Ext.create('Ext.data.Model', product_details);
                        products_form.loadRecord(model2);
                        productdetails_panel.getViewModel().set('model', model2);

                        //load data
                        if(productdetails_panel.down('productapplicantdetailsfrm')){
                            productdetails_panel.down('productapplicantdetailsfrm').loadRecord(model2);
                        }
                        if(productdetails_panel.down('exmpProductsDetailsFrm')){
                            productdetails_panel.down('exmpProductsDetailsFrm').loadRecord(model2);
                        }
                        var model3 = Ext.create('Ext.data.Model', ltrDetails);
                        if(productdetails_panel.down('productlocalapplicantdetailsfrm')){
                            productdetails_panel.down('productlocalapplicantdetailsfrm').loadRecord(model3);
                        }
                    }

                    if (isReadOnly == 1) {

                        productdetails_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        productdetails_panel.getViewModel().set('isReadOnly', false);

                    }
                    productdetails_panel.setActiveTab(0);

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

showPortalPremiseApplicationMoreDetailsGeneric: function (application_code,application_id, applicant_id, ref_no, process_id, module_id, sub_module_id, section_id, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            wizardPnl = Ext.widget('portalPremiseAppDetailsPnl'),//premiseappmoredetailswizard
            applicantPanel = wizardPnl.down('premiseapplicantpnl'),
            applicantFrm = applicantPanel.down('applicantdetailsfrm'),
            premiseFrm = wizardPnl.down('premisedetailsfrm'),
            contactFrm = wizardPnl.down('premisecontactpersonfrm'),
            personnelGrid = wizardPnl.down('portalPremisePersonnelDetailsGrid'),
            premiseproprietorsdetailsgrid = wizardPnl.down('portalPremiseProprietorsDetailsGrid'),
            portalPremisePersonnelTabPnl = wizardPnl.down('portalPremisePersonnelTabPnl'),
            otherDetailsGrid = wizardPnl.down('premiseotherdetailswingrid');

        wizardPnl.setHeight(500);
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
       // wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        wizardPnl.down('hiddenfield[name=application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
        wizardPnl.down('hiddenfield[name=premise_type_id]').setValue(premise_type_id);
        
        // if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
        //     wizardPnl.down('button[name=save_btn]').setVisible(false);
        // }
        wizardPnl.down('combo[name=branch_id]').setReadOnly(true);
        wizardPnl.down('combo[name=application_region_id]').setReadOnly(true);
        personnelGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        premiseproprietorsdetailsgrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        //otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        premiseFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        // applicantFrm.down('button[action=link_applicant]').setDisabled(true);
        // premiseFrm.down('button[name=hospital_facilitybutton]').setDisabled(true);
        contactFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        personnelGrid.setIsWin(1);
        premiseproprietorsdetailsgrid.setIsWin(1);
        Ext.Ajax.request({
            method: 'GET',
            url: 'onlineservices/getPortalPremApplicationMoreDetails',
            params: {
                application_id: application_id,
                //premise_id: premise_id,
                applicant_id: applicant_id,
                application_code : application_code
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
                    premiseDetails = resp.premise_details,
                    contactDetails = resp.contact_details;
                    premise_id = premiseDetails.id;
                    console.log(premise_id);
                if (success == true || success === true) {
                    if(wizardPnl.down('hiddenfield[name=premise_type_id]')){
                        wizardPnl.down('hiddenfield[name=premise_type_id]').setValue(premiseDetails.premise_type_id);
                        
                    } if(portalPremisePersonnelTabPnl.down('hiddenfield[name=premise_id]')){
                        portalPremisePersonnelTabPnl.down('hiddenfield[name=premise_id]').setValue(premise_id);
                    }
                    if (applicantDetails) {
                        var model1 = Ext.create('Ext.data.Model', applicantDetails);
                        applicantFrm.loadRecord(model1);
                    }
                    if (premiseDetails) {
                        var model2 = Ext.create('Ext.data.Model', premiseDetails);
                        premiseFrm.loadRecord(model2);
                        //hold details for rendering load
                        wizardPnl.getViewModel().set('model', model2);
                    }
                    if (contactDetails) {
                        var model3 = Ext.create('Ext.data.Model', contactDetails);
                        contactFrm.loadRecord(model3);
                    }
                    funcShowCustomizableWindow(ref_no, '85%', wizardPnl, 'customizablewindow');
                    if (sub_module_id == 2 || sub_module_id === 2) {
                        if (isReadOnly < 1) {
                            
                            //personnelDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
                           // otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
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
 showPermitPortalApplicationMoreDetailsGeneric: function (permitsdetails_panel, application_id,  applicant_id, ref_no, process_id, isReadOnly) {
        Ext.getBody().mask('Please wait...');

        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            permitsdetails_panel = Ext.widget(permitsdetails_panel),
            tab = permitsdetails_panel.down('panel'),
            module_id = permitsdetails_panel.down('hiddenfield[name=module_id]'),
            permit_form = permitsdetails_panel.down('form'),
            
            importexportapplicantdetailsfrm = permitsdetails_panel.down('importexportapplicantdetailsfrm');
            importexportdetailsfrm = permitsdetails_panel.down('#portalImportExportDetailsFrm');
                
            senderreceiverdetailsfrm = permitsdetails_panel.down('#senderreceiverdetailsfrm');
            
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
           // permitsdetails_panel.down('button[name=save_btn]').setVisible(false);
            //   prepareNewProductReceivingStage applicant_id
        }

        Ext.Ajax.request({
            method: 'GET',
            url: 'onlineservices/getPortalPermitsApplicationMoreDetails',
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
                            model3 = Ext.create('Ext.data.Model', permit_details);
                       var senderReceiverDetails = Ext.create('Ext.data.Model', senderReceiverDetails),
                            premisesDetails = Ext.create('Ext.data.Model', premisesDetails);
                            if(permit_details.module_id != 20){
                                importexportpremisesfrm = permitsdetails_panel.down('#importexportpremisesfrm'),
                                importexportpremisesfrm.loadRecord(premisesDetails);
                                console.log(importexportpremisesfrm);
                            }
                            if(senderreceiverdetailsfrm){
                                senderreceiverdetailsfrm.loadRecord(senderReceiverDetails);
                            }
                            importexportdetailsfrm.loadRecord(model2);
                            importexportapplicantdetailsfrm.loadRecord(model3);
                          
                            if(permitsdetails_panel.down('combo[name=branch_id]')){
                                permitsdetails_panel.down('combo[name=branch_id]').setValue(permit_details.branch_id);
                            }
                    }
                    permitsdetails_panel.height = 550;
                    funcShowCustomizableWindow(ref_no, '85%', permitsdetails_panel, 'customizablewindow');

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
                    if(permitsdetails_panel.down('#variationrequestsgrid')){
                        if(permitsdetails_panel.down('#variationrequestsgrid').down('hiddenfield[name=application_code]')){
                            permitsdetails_panel.down('#variationrequestsgrid').down('hiddenfield[name=application_code]').setValue(permit_details.application_code);
                            permitsdetails_panel.down('#variationrequestsgrid').down('hiddenfield[name=application_id]').setValue(application_id);
                        }
                    }
                    //activeTab.getViewModel().set('model', model2);
                    permitsdetails_panel.getViewModel().set('model', model2);
                    permitsdetails_panel.getViewModel().set('isReadOnly', true);
                    permitsdetails_panel.down('hiddenfield[name=active_application_id]').setValue(application_id);
                    permitsdetails_panel.down('hiddenfield[name=importexport_permittype_id]').setValue(permit_details.importexport_permittype_id);

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
    showGmpPortalApplicationMoreDetailsGeneric: function (application_id, application_code, applicant_id, ref_no, process_id, module_id, sub_module_id, section_id, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var childXtype = 'mansiteappmoredetailswizard';
        if (sub_module_id == 40 || sub_module_id === 40) {
            childXtype = 'mansiteappmoredetailsaltwizard';
        }

        var me = this,
            wizardPnl = Ext.widget(childXtype),
            applicantFrm = wizardPnl.down('gmpapplicantdetailsfrm'),
            siteFrm = wizardPnl.down('mansitedetailsfrm'),
            contactPersonFrm = wizardPnl.down('premisecontactpersonfrm'),
            ltrFrm = wizardPnl.down('ltrfrm'),
            otherDetailsGrid = wizardPnl.down('mansiteotherdetailswingrid'),
            productLineDetailsGrid = wizardPnl.down('productlinedetailswingrid'),
            gmpProductDetailsGrid = wizardPnl.down('gmpproductslinkagedetailswingrid'),
            blocksGrid = wizardPnl.down('mansiteblockdetailswingrid'),
            assessmentType_fld = wizardPnl.down('combo[name=assessment_type_id]'),
            assessment_procedure_id_fld = wizardPnl.down('combo[name=assessment_procedure_id]'),
            gmpType_fld = wizardPnl.down('combo[name=gmp_type_id]'),
            deviceType_fld = wizardPnl.down('combo[name=device_type_id]'),
            siteReadOnly = 0,
            personnelTabPnl = wizardPnl.down('mansitepersonneltabpnl'),
            personnelDetailsGrid = Ext.widget('mansitepersonneldetailswingrid', {
                title: 'Other Personnel'
            });
        // if (gmp_type_id == 2 || gmp_type_id === 2) {
        //     siteReadOnly = 0;
        // }
        contactPersonFrm.setMoreDetails(1);
        personnelTabPnl.remove(personnelTabPnl.items.getAt(1));
        personnelTabPnl.add(personnelDetailsGrid);
        wizardPnl.setHeight(550);
        applicantFrm.down('button[name=link_applicant]').setDisabled(false);
        siteFrm.down('button[action=search_site]').setDisabled(false);
        siteFrm.down('button[name=search_manufacturer]').setDisabled(false);
        ltrFrm.down('button[action=link_ltr]').setDisabled(false);
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
        //wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        wizardPnl.down('hiddenfield[name=application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=application_code]').setValue(application_code);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
       // wizardPnl.down('hiddenfield[name=gmp_type_id]').setValue(gmp_type_id);
        //wizardPnl.down('combo[name=zone_id]').setReadOnly(false);
        if ((siteReadOnly) && (siteReadOnly == 1 || siteReadOnly === 1)) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
        }
        /* personnelDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         blocksGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         productLineDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         gmpProductDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
         */
        siteFrm.down('hiddenfield[name=isReadOnly]').setValue(siteReadOnly);
        if (section_id == 4) {
            wizardPnl.down('button[name=line_details]').setText('DEVICE TYPE DETAILS');
            wizardPnl.down('combo[name=device_type_id]').setVisible(true);
            wizardPnl.down('combo[name=device_type_id]').setReadOnly(false);
            productLineDetailsGrid.down('button[name=add_line]').setText('Add Device Type');
            productLineDetailsGrid.columns[0].setText('Device Type');
            productLineDetailsGrid.columns[1].setText('Device Type Category');
            productLineDetailsGrid.columns[2].setText('Device Type Description');
        }
        if (sub_module_id == 40 || sub_module_id === 40) {
            wizardPnl.down('gmpvariationrequestsgrid').down('hiddenfield[name=isReadOnly]').setValue(siteReadOnly);
        }
        Ext.Ajax.request({
            method: 'GET',
            url: 'onlineservices/getPortalGmpApplicationMoreDetails',
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
                    //applicantDetails = resp.applicant_details,
                    siteDetails = resp.site_details,
                    ltrDetails = resp.ltr_details,
                    contactPersonDetails = resp.contact_details;
                if (success == true || success === true) {
                    // if (applicantDetails) {
                    //     var model1 = Ext.create('Ext.data.Model', applicantDetails);
                    //     applicantFrm.loadRecord(model1);
                    //     assessmentType_fld.setValue(applicantDetails.assessment_type_id);
                    //     gmpType_fld.setValue(applicantDetails.gmp_type_id);
                    //     assessment_procedure_id_fld.setValue(applicantDetails.assessment_procedure_id);
                    // }
                    if (siteDetails) {
                        deviceType_fld.setValue(siteDetails.device_type_id);
                        var model2 = Ext.create('Ext.data.Model', siteDetails);
                        siteFrm.loadRecord(model2);
                    }
                    if (ltrDetails) {
                        var model3 = Ext.create('Ext.data.Model', ltrDetails);
                        ltrFrm.loadRecord(model3);
                    }
                    if (contactPersonDetails) {
                        var model4 = Ext.create('Ext.data.Model', contactPersonDetails);
                        contactPersonFrm.loadRecord(model4);
                    }
                    funcShowCustomizableWindow(ref_no, '85%', wizardPnl, 'customizablewindow');
                    if (sub_module_id == 6 || sub_module_id === 6) {
                        if (isReadOnly < 1) {
                            siteFrm.getForm().getFields().each(function (field) {
                                field.setReadOnly(true);
                            });
                            personnelDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(1);
                            otherDetailsGrid.down('hiddenfield[name=isReadOnly]').setValue(0);
                            me.fireEvent('formAuth', process_id, 1, siteFrm);
                            me.fireEvent('gmpOtherPartsAuth', process_id, wizardPnl);
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
    showClinicalTrialPortalApplicationMoreDetailsGeneric: function (application_id, application_code, applicant_id, ref_no, process_id, module_id, sub_module_id, section_id, isReadOnly) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            wizardPnl = Ext.widget('portalClinicalTrialAppMoreDetailsPnl'),
            applicantFrm =wizardPnl.down('clinicaltrialapplicantdetailsfrm'),
            detailsFrm = wizardPnl.down('clinicaltrialdetailsfrm'),
            sponsorFrm = wizardPnl.down('clinicaltrialsponsorfrm'),
            investigatorFrm = wizardPnl.down('clinicaltrialltrfrm'),
            clinicalparticipantsfrm = wizardPnl.down('clinicalparticipantsfrm'),
            //otherDetailsFrm = wizardPnl.down('clinicaltrialotherdetailsfrm'),
            studySitesGrid = wizardPnl.down('portalclinicaltrialstudysitesgrid'),
            impProductsGrid = wizardPnl.down('portalImpProductsGrid'),
            investigatorsWinGrid = wizardPnl.down('portalClinicalTrialOtherInvestigatorGrid'),
            previewproductDocUploadsGrid = wizardPnl.down('previewproductDocUploadsGrid');
        if(wizardPnl.down('previewproductDocUploadsGrid')){
            previewproductDocUploadsGrid.setController('productregistrationvctr');

            previewproductDocUploadsGrid.down('hiddenfield[name=process_id]').setValue(process_id);
            previewproductDocUploadsGrid.down('hiddenfield[name=section_id]').setValue(section_id);
            previewproductDocUploadsGrid.down('hiddenfield[name=module_id]').setValue(module_id);
            previewproductDocUploadsGrid.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
            previewproductDocUploadsGrid.down('hiddenfield[name=application_code]').setValue(application_code);

        }

        wizardPnl.setHeight(500);
        applicantFrm.down('button[name=link_applicant]').setDisabled(true);
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
       // wizardPnl.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        wizardPnl.down('hiddenfield[name=application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=application_code]').setValue(application_code);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
        detailsFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        sponsorFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        investigatorFrm.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
       // studySitesGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        // impProductsGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        // investigatorsWinGrid.down('hiddenfield[name=isReadOnly]').setValue(isReadOnly);
        if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
            wizardPnl.down('button[name=save_btn]').setVisible(false);
            wizardPnl.down('button[name=save_clinicaltrial_details_btn]').setVisible(false);
        }


        Ext.Ajax.request({
            method: 'GET',
            url: 'onlineservices/getPortalClinicalTrialApplicationMoreDetails',
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
                    applicantDetails = resp.applicant_details,
                    appDetails = resp.app_details,
                    sponsorDetails = resp.sponsor_details,
                    participants_data = resp.participants_data,
                    investigatorDetails = resp.investigator_details;
                   // application_id = appDetails.id;
                if (success == true || success === true) {
                    if(wizardPnl.down('hiddenfield[name=application_id]')){
                        wizardPnl.down('hiddenfield[name=application_id]').setValue(appDetails.id);
                        
                    }
                    if (applicantDetails) {
                        var model1 = Ext.create('Ext.data.Model', applicantDetails);
                        applicantFrm.loadRecord(model1);
                    }
                    if (appDetails) {
                        var model2 = Ext.create('Ext.data.Model', appDetails);
                        detailsFrm.loadRecord(model2);
                    }
                    if (sponsorDetails) {
                        var model3 = Ext.create('Ext.data.Model', sponsorDetails);
                        sponsorFrm.loadRecord(model3);
                    }
                    if (investigatorDetails) {
                        var model4 = Ext.create('Ext.data.Model', investigatorDetails);
                        investigatorFrm.loadRecord(model4);
                    }
                    if (participants_data) {
                        var participants_data = Ext.create('Ext.data.Model', participants_data);
                        clinicalparticipantsfrm.loadRecord(participants_data);
                    }

                    funcShowCustomizableWindow(ref_no, '85%', wizardPnl, 'customizablewindow');
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

    receivePortalApplicationsGeneric: function (btn,application_code,application_id,workflow_stage_id,module_id,sub_module_id,section_id) {
        Ext.getBody().mask('Please wait...');
        is_dataammendment_request =0,
        storeID = btn.storeID,
        winWidth = btn.winWidth,
        table_name = btn.table_name,
        storeID = 'portalSubmissionReceivingGridStr',
        store = Ext.getStore(storeID),
        Ext.Ajax.request({
            method: 'GET',
            url: 'configurations/receivePortalManagersApplicationsGeneric',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            params: {
                application_code: application_code,
              // application_id:application_id,
                module_id:module_id,
                sub_module_id:sub_module_id,
                section_id:section_id,
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                    store.removeAll();
                    store.load();
                if (success == true || success === true) {
                    toastr.success(message, "Success Response"); 
                   // showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagersgenericfrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
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

    showPvPortalApplicationMoreDetailsGeneric: function (application_code,details_panel,isReadOnly,ref_no) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
            if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
            }
            is_dataammendment_request =0;
       
        var me = this,
            details_panel = Ext.widget(details_panel);

        // details_panel.down('hiddenfield[name=section_id]').setValue(section_id);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'pv/getPvPortalApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    // applicantDetails = resp.applicant_details,
                    pv_details = resp.pv_details;
                if (success == true || success === true) {
                    mir_form = details_panel.down('form');
                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (pv_details) {
                        var model2 = Ext.create('Ext.data.Model', pv_details);
                        mir_form.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                    }

                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

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
    showPortalPromotionMaterialApplicationMoreDetailsGeneric:function(application_id,application_code, applicant_id, ref_no, process_id, module_id, sub_module_id, section_id, isReadOnly,view){
        Ext.getBody().mask('Please wait...');
        var me = this,
            wizardPnl = Ext.widget('portalPromotionMaterialDetailsPnl'),
            applicantFrm = wizardPnl.down('promotionapplicantdetailsfrm'),
            promotionalappdetailsfrm = wizardPnl.down('promotionalappdetailsfrm'),
            appDetailsReadOnly=1;

        wizardPnl.setHeight(500);        
        wizardPnl.down('hiddenfield[name=process_id]').setValue(process_id);
        wizardPnl.down('hiddenfield[name=active_application_id]').setValue(application_id);
        wizardPnl.down('hiddenfield[name=application_code]').setValue(application_code);
        wizardPnl.down('hiddenfield[name=module_id]').setValue(module_id);
        wizardPnl.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
        wizardPnl.down('hiddenfield[name=section_id]').setValue(section_id);
  
        view.height = Ext.Element.getViewportHeight() - 118;

        Ext.Ajax.request({
            method: 'GET',
            url: 'promotionmaterials/getPortalPromotionApplicationMoreDetails',
            params: {
                application_id: application_id,
                applicant_id: applicant_id,
                // application_code : active_application_code
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
                    promotionDetails = resp.promotion_details;

                if (success == true || success === true) {
                    if (applicantDetails) {
                        var model1 = Ext.create('Ext.data.Model', applicantDetails);
                        applicantFrm.loadRecord(model1);
                    }
                    if(promotionDetails){
                        var model2 = Ext.create('Ext.data.Model', promotionDetails);
                        promotionalappdetailsfrm.loadRecord(model2);
                    }

                    funcShowCustomizableWindow(ref_no, '85%', wizardPnl, 'customizablewindow');
                    
                    if (isReadOnly == 1) {

                        wizardPnl.getViewModel().set('isReadOnly', true);

                    } else {
                        wizardPnl.getViewModel().set('isReadOnly', false);

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
    showPortalPsurApplicationMoreDetailsGeneric: function (application_code,details_panel,isReadOnly,ref_no) {
        Ext.getBody().mask('Please wait...');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab();
        if(!ref_no){
                ref_no = activeTab.down('displayfield[name=tracking_no]').getValue();
            }
            is_dataammendment_request =0;
        var me = this,
        details_panel = Ext.widget(details_panel);
        details_panel.height = Ext.Element.getViewportHeight() - 118;
        Ext.Ajax.request({
            method: 'GET',
            url: 'psur/getPortalPsurApplicationMoreDetails',
            params: {
                application_code: application_code
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message,
                    psur_details = resp.psur_details;
                if (success == true || success === true) {
                    productapplicantdetailsfrm = details_panel.down('productapplicantdetailsfrm'),
                    psurdetailsFrm = details_panel.down('psurdetailsFrm'),
                    funcShowCustomizableWindow(ref_no, '85%', details_panel, 'customizablewindow');
                    if (psur_details) {
                        var model2 = Ext.create('Ext.data.Model', psur_details);
                        psurdetailsFrm.loadRecord(model2);
                        productapplicantdetailsfrm.loadRecord(model2);
                        details_panel.getViewModel().set('model', model2);
                    }
                    if (isReadOnly == 1) {

                        details_panel.getViewModel().set('isReadOnly', true);

                    } else {
                        details_panel.getViewModel().set('isReadOnly', false);

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
});

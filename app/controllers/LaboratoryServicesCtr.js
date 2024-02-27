/**
 * Created by softclans
 */
Ext.define('Admin.controller.LaboratoryServicesCtr', {
    extend: 'Ext.app.Controller',
    config: {
        refs: [{
            ref: 'mainPanel',
            selector: 'maincontainerwrap'
        },  {
            ref: 'mainTabPanel',
            selector: '#contentPanel'
        },{
            ref: 'contentPanel',
            selector: '#contentPanel'
        }, {
            ref: 'sampleanalysistestrequestspnl',
            selector: '#sampleanalysistestrequestspnl'
        }],

        control: {
            'drugssampleanalysistestrequestswizard button[action=btn_savesampledetails]': {
                click: 'funcSaveSampleDetails'
            },

            'sampleanalysistestrequestswizard button[action=btn_savesampledetails]': {
                click: 'funcInitiateSampleTestrequestApplication'
            },  'sampleanalysisreceivingwizard button[action=btn_savesampledetails]': {
                click: 'funcSaveSampleDetails'
            },
            'sampleanalysisreceivingwizard': {
                afterrender: 'prepareSampleReceiving'
            }, 
            'sampletestrequestsreviewwizard': {
                afterrender: 'prepareSampleReceiving'
            },'samplenalysistestsresultswizard': {
                afterrender: 'prepareSampleReceiving'
            },'sampleanalysisresultsreviewapprovalwizard': {
                afterrender: 'prepareSampleReceiving'
            },
            'lasboratorysampleanalysisgrid': {
                refresh: 'refreshlasboratorysampleanalysisgrid'
            },'sampleanalysistestrequestsgrid': {
                refresh: 'refreshsampleanalysistestrequestsgrid'
            },

            'testparameterssgrid': {
                refresh: 'refreshtestparameterssgrid'
            },
            'sampleanalysistestparameterssgrid': {
                refresh: 'refreshsampleanalysistestparameterssgrid'
            }, 'sampleanalysistestparreviewgrid': {
                refresh: 'refreshsampleanalysistestparameterssgrid'
            },
            'samplelabanalysistestresultsgrid': {
                refresh: 'refreshsampleanalysistestparameterssgrid'
            }, 'samplelabanalysistestapprovalgrid': {
                refresh: 'refreshsampleanalysistestparameterssgrid'
            },
            
            'sampleanalysistestresultsgrid': {
                refresh: 'refreshsampleanalysistestresultsgrid'
            },

            'sampleanalysistestrequestsprocessesgrid': {
                refresh: 'refreshsampleanalysistestrequestsprocessesgrid'
            },

           
            'testparameterssgrid button[action=addsampletestparameters]': {
                click: 'funcAddSampleTestParameters'
            }, 'sampletestrequestsreviewwizard button[name=savetestrequestparameters]': {
                click: 'saveTestRequestParametersReview'
            },'samplelabanalysistestresultsgrid button[name=savetestrequestparameters]': {
                click: 'saveSampleTestAnalysisResults'
            },'samplelabanalysistestapprovalgrid button[name=savetestrequestparameters]': {
                click: 'saveSampleTestAnalysisResults'
            }, 'sampleanalysisresultsreviewapprovalwizard button[name=review_recommendation]': {
                click: 'showSampleAnalysisApprovalRecommendationWin'
            },'sampleanalysisreviewrecommfrm button[name=save_recommendation]': {
                click: 'saveSampleanalysisAppReviewRecommendationDetails'
            },'sampleanalysiscertificatereleasegrid': {
                refresh: 'sampleanalysisApplicationsGridRefresh'
            }
            
        }
    },
    init: function () {

    },
    listen: {
        controller: {
            '*': {// This selector matches any originating Controller, you can specify controller name instead of *
                showSampleAnalysisrequestswin: 'showSampleAnalysisrequestswin',
                showNewSampleAnalysisRequest:'showNewSampleAnalysisRequest',
                showSampleAnalysisAppSubmissionWin: 'showSampleAnalysisAppSubmissionWin',
                showSampleAnalysisReviewAppSubmissionWin:'showSampleAnalysisReviewAppSubmissionWin',
                editpreviewSampleinformation:'editpreviewSampleinformation'
            }
        }
    }, sampleanalysisApplicationsGridRefresh: function (me) {
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

    },saveSampleanalysisAppReviewRecommendationDetails: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mainStore = activeTab.down('grid').getStore(),
            form = btn.up('form'),
            frm = form.getForm(),
            win = form.up('window'),
            action_url = 'sampleanalysis/saveSampleanalysisReviewRecommendationDetails';
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
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
    },showSampleAnalysisApprovalRecommendationWin:function(btn){
        Ext.getBody().mask('Please wait...');
        var me = this,
             mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue();
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue();
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            
            table_name = btn.table_name,
            approval_frm = btn.approval_frm,
            form = Ext.widget(approval_frm),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;
        form.setController('sampleanalysisvctr');
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        
        form.down('hiddenfield[name=table_name]').setValue(table_name);
        Ext.Ajax.request({
            method: 'GET',
            url: 'getSampelAnalysisApplicationApprovalDetails',
            params: {
                application_id: application_id,
                approval_table:'tra_sampleanalysisreview_recommendation',
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
                    funcShowCustomizableWindow('Sample Analysis results Approval Recommendation', '40%', form, 'customizablewindow');
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


    }, saveTestRequestParametersReview: function (btn) {
        btn.setLoading(true);
        console.log('called');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            limssample_id = activeTab.down('hiddenfield[name=limssample_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            testparametergrid = activeTab.down('#sampleanalysistestparameterssgrid');
        this.commitTestRequestParametersReview(btn, limssample_id,testparametergrid,application_code);
    },
    saveSampleTestAnalysisResults: function (btn) {
        btn.setLoading(true);
        console.log('called');
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            limssample_id = activeTab.down('hiddenfield[name=limssample_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            testparametergrid = activeTab.down('#sampleanalysistestparameterssgrid');
        this.commitSampleTestAnalysisResults(btn, limssample_id,testparametergrid,application_code);
    },
    
    commitTestRequestParametersReview: function (btn, limssample_id,testparametergrid,application_code) {
        var store = testparametergrid.getStore(),
            params = [];
        for (var i = 0; i < store.data.items.length; i++) {
            var record = store.data.items [i],
                test_request_id = record.get('id'),
                pass_status = record.get('pass_status'),
                quantity = record.get('quantity'),
                verification_comments = record.get('verification_comments');
            var obj = {
                limssample_id: limssample_id,
                test_request_id: test_request_id,
                pass_status: pass_status,
                quantity:quantity,
                verification_comments: verification_comments
            };
            if (record.dirty) {
                params.push(obj);
            }
        }
        this.saveSampleTestREsultsDetails(btn,params,'saveTestRequestParametersReview',application_code,store);

       
    },

    commitSampleTestAnalysisResults: function (btn, limssample_id,testparametergrid,application_code) {
        var store = testparametergrid.getStore(),
            params = [];
        for (var i = 0; i < store.data.items.length; i++) {
            var record = store.data.items [i],
                test_request_id = record.get('id'),
                test_analysisresult_id = record.get('test_analysisresult_id'),
                test_methods = record.get('test_methods'),
                specifications = record.get('specifications'),
                results = record.get('results'),
                analyst_remarks = record.get('analyst_remarks'),
                recommendation_comment = record.get('recommendation_comment'),
                analysis_comments = record.get('analysis_comments');
            var obj = {
                limssample_id: limssample_id,
                test_request_id: test_request_id,
                test_analysisresult_id: test_analysisresult_id,
                test_methods: test_methods,
                specifications:specifications,
                analyst_remarks: analyst_remarks,
                results:results,
                recommendation_comment:recommendation_comment,
                analysis_comments: analysis_comments
            };
            if (record.dirty) {
                params.push(obj);
            }
        }
        this.saveSampleTestREsultsDetails(btn,params,'sampleTestAnalysisResults',application_code,store);

    },
    
    saveSampleTestREsultsDetails:function(btn,params,action_url,application_code,store){
        if (params.length < 1) {
            btn.setLoading(false);
            toastr.warning('No records to save!!', 'Warning Response');
            return false;
        }
        params = JSON.stringify(params);
        Ext.Ajax.request({
            url: 'sampleanalysis/'+action_url,
            params: {
                application_code: application_code,
                test_parameters: params
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
                    store.load();
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
    refreshsampleanalysistestrequestsgrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            panel = me.up('panel[name=sampleanalysistestrequestspnl]'),
            module_id = panel.down('hiddenfield[name=module_id]').getValue(),
            application_code = panel.down('hiddenfield[name=application_code]').getValue(),
            sample_application_code = panel.down('hiddenfield[name=sample_application_code]').getValue(),
            misproduct_id = panel.down('hiddenfield[name=misproduct_id]').getValue(),
            missample_id = panel.down('hiddenfield[name=sample_id]').getValue(),
            section_id = panel.down('hiddenfield[name=section_id]').getValue();

        store.getProxy().extraParams = {
            module_id: module_id,
            application_code: application_code,
            sample_application_code: sample_application_code,
            misproduct_id: misproduct_id,
            missample_id: missample_id,
            section_id: section_id
        };
    },
  refreshtestparameterssgrid: function (btn) {
        // 'sub_cat_id','',
        var grid = btn.up('grid'),
            store = grid.store,
            sub_cat_id = grid.down('combo[name=sub_cat_id]').getValue(),
            cost_category_id = grid.down('combo[name=cost_category_id]').getValue();

        store.getProxy().extraParams = {
            sub_cat_id: sub_cat_id,
            cost_category_id: cost_category_id
        };

    },
    refreshsampleanalysistestparameterssgrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            panel = mainTabPanel.getActiveTab(),
            pms_plan_id, limssample_id;
            if(me.up('window')){
                panel = me.up('window');

            }
            limssample = panel.down('hiddenfield[name=limssample_id]');
            pms_plan = panel.down('hiddenfield[name=pms_plan_id]');

        if(pms_plan){
            pms_plan_id = pms_plan.getValue();
        }
        if(limssample){
            limssample_id = limssample.getValue();
        }
        store.getProxy().extraParams = {
            limssample_id: limssample_id,
            pms_plan_id: pms_plan_id
        };

    }, refreshsampleanalysistestresultsgrid: function (me) {
        var store = me.store,
            grid = me.up('grid');
            mainTabPanel = this.getMainTabPanel(),
            panel = mainTabPanel.getActiveTab();
            if(me.up('window')){
                panel = me.up('window');

            }
            limssample_id = panel.down('hiddenfield[name=limssample_id]').getValue();

        store.getProxy().extraParams = {
            limssample_id: limssample_id
        };

    },  refreshsampleanalysistestrequestsprocessesgrid: function (me) {
        var store = me.store,
            grid = me.up('grid'),
            labreference_no = grid.down('hiddenfield[name=labreference_no]').getValue();

        store.getProxy().extraParams = {
            reference_no: labreference_no
        };
    },funcAddSampleTestParameters: function (btn) {
        Ext.getBody().mask('Please wait...');
        var mainPnl = this.getSampleanalysistestrequestspnl(),
            grid = btn.up('grid'),
            win = grid.up('window'),
            limssample_id = mainPnl.down('hiddenfield[name=limssample_id]').getValue(),
            storeId = btn.storeId,
            store = Ext.getStore(storeId),
            sm = grid.getSelectionModel(),
            selected_records = sm.getSelection(),
            selected = [];
        Ext.each(selected_records, function (item) {
            selected.push(item.data.parameter_costs_id);
        });
        Ext.Ajax.request({
            url: 'sampleanalysis/funcAddSampleTestParameters',
            params: {
                selected: JSON.stringify(selected),
                limssample_id: limssample_id,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                Ext.getBody().unmask();
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
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.warning(message, 'Failure Response!!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    },
showSampleAnalysisAppSubmissionWin: function (btn) {
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
            storeID = getApplicationStore(module_id, '');

        valid = this.validateSampleAnalysisReceivingSubmission();
        if (valid) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,'','','',workflow_stage_id);
          
        } else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Samples Details!!', 'Warning Response');
            return;
        }
    },
    showSampleAnalysisReviewAppSubmissionWin: function (btn) {
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
            storeID = getApplicationStore(module_id, '');

        valid = checkSampleAnalysisReviewRecommendationDEtails(application_code);
        if (valid) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,'','','',workflow_stage_id);
          
        } else {
            Ext.getBody().unmask();
            toastr.warning('Please Sample Analysis Results Recommendation!!', 'Warning Response');
            return;
        }
    },
    
    showSampleAnalysisAppSubmissionWin: function (btn) {
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
            storeID = getApplicationStore(module_id, '');

        valid = this.validateSampleAnalysisReceivingSubmission();
        if (valid) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,'','','',workflow_stage_id);
          
        } else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
            return;
        }
    },
    
    
    validateSampleAnalysisReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),

            sampledetailsfrm = activeTab.down('#sampledetailsfrm'),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
        if (!application_code) {
            toastr.warning('Please Save Application Details!!', 'Warning Response');
            return false;
        }
        if (!applicant_id) {
            toastr.warning('Please Select Applicant!!', 'Warning Response');
            return false;
        }
        if (!sampledetailsfrm.isValid()) {
            toastr.warning('Please Enter All the required Product Details!!', 'Warning Response');
            return false;
        }
        return true;
    },showNewSampleAnalysisRequest: function (sub_module_id,btn) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#lasboratorysampleanalysisdashwrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
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
        
        dashboardWrapper.add(workflowContainer);
        
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);

        //load the stores

    },refreshlasboratorysampleanalysisgrid: function (me) {

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
    prepareSampleReceiving:function(me){

        // this.updateVisibilityAccess(me);
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),

           // app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            applicantFrm = activeTab.down('applicantdetailsfrm'),
           
            products_detailsfrm = activeTab.down('#sampledetailsfrm'),
          //  app_check_types_store = activeTab.down('combo[name=applicable_checklist]').getStore(),
           
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            testrequestStr = activeTab.down('#sampleanalysistestparameterssgrid').getStore();
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
            /*
                    app_check_types_store.removeAll();
                    app_check_types_store.load({
                        params: {
                            process_id: process_id,
                            workflow_stage: workflow_stage_id
                        }
                    });
                
                    app_doc_types_store.removeAll();
                    app_doc_types_store.load({
                        params: {
                            process_id: process_id,
                            workflow_stage: workflow_stage_id
                        }
                    });
                    
            */
        if (application_code) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'sampleanalysis/prepareSampleReceiving',
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
                        model = Ext.create('Ext.data.Model', results);

                    if (success == true || success === true) {
                        activeTab.down('hiddenfield[name=limssample_id]').setValue(results.limssample_id);

                        products_detailsfrm.loadRecord(model);
                        applicantFrm.loadRecord(model);
                        testrequestStr.load();
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
    editpreviewSampleinformation: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord();
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

        this.showPermitApplicationMoreDetailsGeneric(permitsdetails_panel, application_id,  applicant_id, ref_no, process_id,  isReadOnly);
        
    },
    funcInitiateSampleTestrequestApplication: function (btn) {
        var containerPnl = this.getSampleanalysistestrequestspnl(),
            action_url = btn.action_url,
            module_id = containerPnl.down('hiddenfield[name=module_id]').getValue(),
            mis_sample_id = containerPnl.down('hiddenfield[name=sample_id]').getValue(),
            analysis_type_id = containerPnl.down('hiddenfield[name=analysis_type_id]').getValue(),
            application_code = containerPnl.down('hiddenfield[name=application_code]').getValue(),
            applicant_id = containerPnl.down('hiddenfield[name=applicant_id]').getValue(),
            sample_application_code = containerPnl.down('hiddenfield[name=application_code]').getValue(),
            section_id = containerPnl.down('hiddenfield[name=section_id]').getValue(),
            branch_id = containerPnl.down('hiddenfield[name=branch_id]').getValue(),
            code_ref_no = containerPnl.down('hiddenfield[name=code_ref_no]').getValue(),
            workflow_stage_id = containerPnl.down('hiddenfield[name=workflow_stage_id]').getValue(),
            productDetailsForm = containerPnl.down('#sampledetailsfrm'),
            
            productDetailsFrm = productDetailsForm.getForm();
        if (productDetailsFrm.isValid()) {
            productDetailsFrm.submit({
                url: 'sampleanalysis/' + action_url,
                waitMsg: 'Please wait...',
                params: {
                    application_code: application_code,
                    sample_application_code: sample_application_code,
                    workflow_stage_id: workflow_stage_id,
                    module_id: module_id,
                    section_id: section_id,
                    branch_id: branch_id,
                    code_ref_no: code_ref_no,
                    mis_sample_id: mis_sample_id,
                    applicant_id: applicant_id,
                    analysis_type_id: analysis_type_id,
                    _token: token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success,
                        laboratory_reference_no = resp.laboratory_reference_no,
                        limssample_id = resp.sample_id;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        containerPnl.down('displayfield[name=laboratoryreference_no]').setValue(laboratory_reference_no);
                        containerPnl.down('hiddenfield[name=limssample_id]').setValue(limssample_id);
                        if(section_id == 2){
                            sampletabpanel = containerPnl.down('#sampletabpanel'),
                            sampletabpanel.setActiveTab(1);
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

    funcSaveSampleDetails: function (btn) {
        var containerPnl = this.getSampleanalysistestrequestspnl(),
            action_url = btn.action_url,
            module_id = containerPnl.down('hiddenfield[name=module_id]').getValue(),
           // mis_sample_id = containerPnl.down('hiddenfield[name=sample_id]').getValue(),
            //analysis_type_id = containerPnl.down('hiddenfield[name=analysis_type_id]').getValue(),
            application_code = containerPnl.down('hiddenfield[name=active_application_code]').getValue(),
           // branch_id = containerPnl.down('combo[name=branch_id]').getValue(),
            workflow_stage_id = containerPnl.down('hiddenfield[name=workflow_stage_id]').getValue(),
            applicantDetailsForm = containerPnl.down('applicantdetailsfrm'),
            applicant_id = applicantDetailsForm.down('hiddenfield[name=applicant_id]').getValue(),
            productDetailsForm = containerPnl.down('#sampledetailsfrm'),
            
            productDetailsFrm = productDetailsForm.getForm();
            if (!applicant_id) {
                //
                toastr.warning('Please select applicant!!', 'Warning Response');
                return false;
            }
        if (productDetailsFrm.isValid()){

            productDetailsFrm.submit({
                url: 'sampleanalysis/' + action_url,
                waitMsg: 'Please wait...',
                params: {
                    application_code: application_code,
                    workflow_stage_id: workflow_stage_id,
                    module_id: module_id,
                    applicant_id:applicant_id,
                    _token: token
                },
                success: function (frm, action) {
                    var resp = action.result,
                        message = resp.message,
                        success = resp.success,
                        laboratory_reference_no = resp.laboratory_reference_no,
                        limssample_id = resp.sample_id;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        containerPnl.down('displayfield[name=reference_no]').setValue(laboratory_reference_no);
                        containerPnl.down('hiddenfield[name=active_application_code]').setValue(resp.sample_application_code);
                        containerPnl.down('hiddenfield[name=limssample_id]').setValue(limssample_id);
                        productDetailsForm.down('hiddenfield[name=limssample_id]').setValue(limssample_id);
                        
                         sampletabpanel = containerPnl.down('#sampletabpanel'),
                            sampletabpanel.setActiveTab(1);
                        
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
    showSampleAnalysisrequestswin: function (btn) {
  
        var me = this,
            childXtype = btn.childXtype,
            winTitle = btn.winTitle,
            winWidth = btn.winWidth,
            isWin = btn.isWin,
            child = Ext.widget(childXtype),
            storeArray = eval(btn.stores),
            mainTabPnl = btn.up('#contentPanel'),
            containerPnl = mainTabPnl.getActiveTab(),
            product_id = containerPnl.down('hiddenfield[name=product_id]').getValue(),
            application_code = containerPnl.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = containerPnl.down('hiddenfield[name=module_id]').getValue(),
            section_id = containerPnl.down('hiddenfield[name=section_id]').getValue(),
            workflow_stage_id = containerPnl.down('hiddenfield[name=workflow_stage_id]').getValue(),
            applicant_id = containerPnl.down('hiddenfield[name=applicant_id]').getValue(),
            reference_no = containerPnl.down('displayfield[name=reference_no]').getValue(),
            
            arrayLength = storeArray.length;
            // child.setHeight(600);
       
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow', btn);
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        //set values 
        child.down('hiddenfield[name=application_code]').setValue(application_code);
        child.down('hiddenfield[name=section_id]').setValue(section_id);
        child.down('hiddenfield[name=module_id]').setValue(module_id);
        child.down('hiddenfield[name=misproduct_id]').setValue(product_id);
        
        child.down('hiddenfield[name=code_ref_no]').setValue(reference_no);
        
        child.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
        child.down('hiddenfield[name=applicant_id]').setValue(applicant_id);
        
    }

});
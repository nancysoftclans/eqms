Ext.define('Admin.controller.MirCtr', {
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
            'mirtb button[name=mirHomeBtn]': {
                click: 'mirHome'
            },
            'mirgrid': {
                refresh: 'refreshMirMainGrids'
            },
            'mirMedicalHistoryGrid': {
                refresh: 'refreshMirAdditionalGrids'
            },
            'mirRelatedEnqueriesgrid': {
                refresh: 'refreshMirAdditionalGrids'
            },
            'newMirReceivingWizard': {
                afterrender: 'prepareMirReceiving'
            },
            'mirMedicalHistoryFrm': {
                afterrender: 'addMirIDApplicationCodeToCaller'
            },
            'newMirReceivingWizard button[name=process_submission_btn]': {
                click: 'showReceivingApplicationSubmissionWin'
            },
            'mirFindingsPnl button[name=process_submission_btn]': {
                click: 'showFindingsApplicationSubmissionWin'
            },
            // 'mirFindingsFrm': {
            //     afterrender: 'addMirIDApplicationCodeToCaller'
            // },
            'mirFindingsPnl': {
                afterrender: 'prepareFindingsInterface'
            },

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
                onNewMirApplication: 'onNewMirApplication',
                funcActiveOtherMirInformationTab: 'funcActiveOtherMirInformationTab',
                showDynamicSelectionList: 'showDynamicSelectionList',
                LoadCallerForm: 'LoadCallerForm',
                viewApplicationRecommendationLogs: 'viewApplicationRecommendationLogs',
                onReProductRegApplication: 'onReProductRegApplication',
                doSaveResearchFindings: 'doSaveResearchFindings'
            }
        }
    },
    onNewMirApplication: function (sub_module_id, btn, section_id) {
        Ext.getBody().mask('Please wait...');
        var me = this,
            is_dataammendment_request = btn.is_dataammendment_request,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#mirDashWrapper'),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id, is_dataammendment_request);

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
     mirHome: function (btn) {
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            sec_dashboard = btn.sec_dashboard,
            activeTab = mainTabPanel.getActiveTab(),
            dashboardWrapper = activeTab.down('#mirDashWrapper');
        if (!dashboardWrapper.down(sec_dashboard)) {
            dashboardWrapper.removeAll();
            dashboardWrapper.add({xtype: sec_dashboard});
        }
    },
    refreshMirMainGrids: function (me) {

        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            section_id = (activeTab.down('hiddenfield[name=section_id]')) ? grid.down('combo[name=section_id]').getValue() : null,
            sub_module_id = (grid.down('combo[name=sub_module_id]')) ? grid.down('combo[name=sub_module_id]').getValue() : null,
            workflow_stage_id = (grid.down('combo[name=workflow_stage_id]')) ? grid.down('combo[name=workflow_stage_id]').getValue() : null;

            store.getProxy().extraParams = {
                module_id: module_id,
                sub_module_id: sub_module_id,
                section_id: section_id,
                workflow_stage_id: workflow_stage_id
            };

    },
    prepareMirReceiving: function (me) {
        // this.updateVisibilityAccess(me);
        Ext.getBody().mask('Please wait...');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),

            app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            detailsFrm = activeTab.down('#DetailsFrm'),
            application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
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
                url: 'mir/prepareNewMirReceivingStage',
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
                        model = Ext.create('Ext.data.Model', results);
                        ltr_model = Ext.create('Ext.data.Model', ltrResults);

                    if (success == true || success === true) {
                        detailsFrm.loadRecord(model);
                        applicantFrm.loadRecord(model);
                        localagentFrm.loadRecord(ltr_model);
                        activeTab.down('hiddenfield[name=invoice_id]').setValue(results.invoice_id);

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
    funcActiveOtherMirInformationTab: function (tab) {

        var mainTabPnl = this.getMainTabPanel(),
            activeTab = mainTabPnl.getActiveTab(),
            mir_id;
        if(tab.down('hiddenfield[name=mir_id]')){
            mir_id = tab.down('hiddenfield[name=mir_id]').getValue();
            if(activeTab.down('hiddenfield[name=mir_id]')){
                activeTab.down('hiddenfield[name=mir_id]').setValue(mir_id);
            }
        }
        if (activeTab.down('hiddenfield[name=mir_id]') && mir_id == '') {
            mir_id = activeTab.down('hiddenfield[name=mir_id]').getValue();
        }
        if (mir_id == '') {
            tab.setActiveTab(0);
            toastr.error('Save Request details to proceed', 'Failure Response');
            return;
        }
    },
    showDynamicSelectionList: function(btn){
        var table_name = btn.table_name,
            form = btn.up('form'),
            def_id = btn.def_id,
            itemId = form.itemId;

        this.renderGridTable(table_name, itemId, def_id, btn);

    },
    renderGridTable: function(table, itemId, def_id, btn){
       
        Ext.Ajax.request({
                url: 'configurations/getParameterGridColumnsConfig',
                method: 'GET',
                params: {
                    def_id: def_id
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
                },
                success: function (response) {

                    var resp = Ext.JSON.decode(response.responseText),
                        success = resp.success,
                        message = resp.message,
                        result = resp.results,
                        title = resp.title;
                        table_name = resp.table_name;
                    if (success == true || success === true) {
                        
                        var panel = Ext.create('Ext.panel.Panel',{
                            viewModel: 'configurationsvm',
                            controller: 'configurationsvctr',
                            callerItemId: itemId,
                            userCls: 'big-100 small-100',
                            height: Ext.Element.getViewportHeight() - 118,
                            layout:{
                                type: 'fit'
                            },
                            items: []
                        });
                        var grid = Ext.create('Ext.grid.Panel',{
                                        cls: 'dashboard-todo-list',
                                        autoScroll: true,
                                        autoHeight: true,
                                        valuefield: btn.valuefield,
                                        displayfield: btn.displayfield,
                                        formfield: btn.formfield,
                                        callerItemId: itemId,
                                        width: '100%',
                                        //height: Ext.Element.getViewportHeight() - 118,
                                        viewConfig: {
                                            deferEmptyText: false,
                                            emptyText: 'Nothing to display',
                                            getRowClass: function (record, rowIndex, rowParams, store) {
                                                var is_enabled = record.get('is_enabled');
                                                if (is_enabled == 0 || is_enabled === 0) {
                                                    return 'invalid-row';
                                                }
                                            }
                                        },
                                        tbar: [{
                                            xtype: 'button',
                                            text: 'Add',
                                            iconCls: 'x-fa fa-plus',
                                            action: 'add',
                                            ui: 'soft-blue',
                                            //childXtype: 'actingreasonFrm',
                                            winTitle: title+'',
                                            winWidth: '40%',
                                            handler: 'renderParameterForm',
                                            stores: '[]'
                                        },{
                                            xtype: 'hiddenfield',
                                            name: 'def_id',
                                            fieldLabel: 'def_id',
                                            value: def_id,
                                            allowBlank: true
                                        },{
                                            xtype: 'hiddenfield',
                                            name: 'db_con',
                                            fieldLabel: 'db_con',
                                            allowBlank: true
                                        }, {
                                            xtype: 'exportbtn'
                                        }, {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Double click to select',
                                            fieldStyle: {
                                                'color': 'green',
                                                'font-weight': 'bold',
                                                'font-size': '12px'
                                            }
                                        }],
                                        plugins: [
                                            {
                                                ptype: 'gridexporter'
                                            }
                                        ],
                                        export_title: title+'',
                                        bbar: [{
                                            xtype: 'pagingtoolbar',
                                            width: '100%',
                                            displayInfo: true,
                                            displayMsg: 'Showing {0} - {1} of {2} total records',
                                            emptyMsg: 'No Records',
                                            beforeLoad: function() {
                                                var grid=this.up('grid'),
                                                    store = grid.getStore(),
                                                    def_id=grid.down('hiddenfield[name=def_id]').getValue();

                                                 var store=this.getStore();
                                                 store.getProxy().extraParams = {
                                                        def_id:def_id
                                                    }
                                                }
                                        }],
                                        features: [{
                                            ftype: 'searching',
                                            minChars: 2,
                                            mode: 'local'
                                        }],
                                        listeners: {
                                            beforerender: {
                                                fn: 'setGridStore',
                                                config: {
                                                    pageSize: 1000,
                                                    storeId: table_name+'Str',
                                                    proxy: {
                                                       url: 'configurations/getParameterGridConfig'
                                                    }
                                                },
                                                isLoad: true
                                            },
                                            itemdblclick:  function(view, record){
                                                var grid = view.grid,
                                                    ctr =  Ext.getApplication().getController("DashboardCtr");
                                                ctr.fireEvent('LoadCallerForm', view, record);
                                            }//'LoadCallerForm'
                                        },
                                    
                                    columns:[{
                                            xtype: 'gridcolumn',
                                            dataIndex: 'id',
                                            text: 'Ref ID'
                                        },{
                                            xtype: 'gridcolumn',
                                            dataIndex: 'is_enabled',
                                            text: 'Enable',
                                            width: 150,
                                            renderer: function (value, metaData) {
                                                if (value) {
                                                    metaData.tdStyle = 'color:white;background-color:green';
                                                    return "True";
                                                }

                                                metaData.tdStyle = 'color:white;background-color:red';
                                                return "False";
                                            }
                                        },{
                                        text: 'Options',
                                        xtype: 'widgetcolumn',
                                        width: 90,
                                        widget: {
                                            width: 75,
                                            textAlign: 'left',
                                            xtype: 'splitbutton',
                                            iconCls: 'x-fa fa-th-list',
                                            ui: 'gray',
                                            menu: {
                                                xtype: 'menu',
                                                items: [{
                                                    text: 'Edit',
                                                    iconCls: 'x-fa fa-edit',
                                                    tooltip: 'Edit Record',
                                                    action: 'edit',
                                                    //childXtype: 'actingreasonFrm',
                                                    winTitle: title+'',
                                                    winWidth: '40%',
                                                    handler: 'renderParameterForm',
                                                    stores: '[]'
                                                }, {
                                                    text: 'Disable',
                                                    iconCls: 'x-fa fa-repeat',
                                                    table_name: table_name,
                                                    storeID: table_name+'Str',
                                                    db_con: resp.db_con_name,
                                                    action_url: 'configurations/softDeleteConfigRecord',
                                                    action: 'soft_delete',
                                                    handler: 'deleteRecordFromIDByConnection'
                                                }, {
                                                    text: 'Delete',
                                                    iconCls: 'x-fa fa-trash',
                                                    tooltip: 'Delete Record',
                                                    db_con: resp.db_con_name,
                                                    table_name: table_name,
                                                    storeID: table_name+'Str',
                                                    action_url: 'configurations/deleteConfigRecord',  
                                                    action: 'actual_delete',
                                                    handler: 'deleteRecordFromIDByConnection',
                                                }, {
                                                    text: 'Enable',
                                                    iconCls: 'x-fa fa-undo',
                                                    tooltip: 'Enable Record',
                                                    db_con: resp.db_con_name,
                                                    table_name: table_name,
                                                    storeID: table_name+'Str',
                                                    action_url: 'configurations/undoConfigSoftDeletes',
                                                    action: 'enable',
                                                    disabled: true,
                                                    handler: 'deleteRecordFromIDByConnection'
                                                }
                                                ]
                                            }
                                        }, onWidgetAttach: function (col, widget, rec) {
                                            var is_enabled = rec.get('is_enabled');
                                            if (is_enabled === 0 || is_enabled == 0) {
                                                widget.down('menu menuitem[action=enable]').setDisabled(false);
                                                widget.down('menu menuitem[action=soft_delete]').setDisabled(true);
                                            } else {
                                                widget.down('menu menuitem[action=enable]').setDisabled(true);
                                                widget.down('menu menuitem[action=soft_delete]').setDisabled(false);
                                            }
                                        }
                                    }]
                                    });
                        //add columns
                        var tot = result.length-1;
                        if(tot > 5){
                            for (var i = result.length - 1; i >= 0; i--) {
                                var column = Ext.create('Ext.grid.column.Column', {
                                        text: result[i]+'',
                                        dataIndex: result[i]+'',
                                        width: 150,
                                        tbCls: 'wrap'
                                    });
                                 grid.headerCt.insert(
                                      grid.columns.length-2, 
                                      column);
                              }
                          }else{
                            for (var i = result.length - 1; i >= 0; i--) {
                                var column = Ext.create('Ext.grid.column.Column', {
                                        text: result[i]+'',
                                        dataIndex: result[i]+'',
                                        flex: 1,
                                        tbCls: 'wrap'
                                    });
                                 grid.headerCt.insert(
                                      grid.columns.length-2, 
                                      column);
                              }
                          }
                        grid.down('hiddenfield[name=def_id]').setValue(def_id);
                        grid.down('hiddenfield[name=db_con]').setValue(resp.db_con_name);
                        panel.add(grid);

                        // var main_panel =  Ext.ComponentQuery.query("#contentPanel")[0];
                        funcShowCustomizableWindow('Selection List', '60%', panel, 'customizablewindow', btn);
                        Ext.getBody().unmask();
                    } else {
                        Ext.getBody().unmask();
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
    LoadCallerForm: function(view, record){
        var me = this,
            grid = view.grid,
            itemID = grid.callerItemId,
            valuefield = grid.valuefield,
            formfield = grid.formfield,
            displayfield = grid.displayfield,
            form = Ext.ComponentQuery.query("#"+itemID)[0];
        form.down('hiddenfield[name='+formfield+']').setValue(record.get(valuefield));
        form.down('textfield[name='+displayfield+']').setValue(record.get(displayfield));
        grid.up('panel').up('window').close();
    },
    refreshMirAdditionalGrids: function (me, table_name = '') {

        var store = me.store,
            grid = me.up('grid'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mir_id = activeTab.down('hiddenfield[name=mir_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            
            store.getProxy().extraParams = {
                mir_id: mir_id,
                application_code: application_code,
                table_name: table_name
            };

    },
    addMirIDApplicationCodeToCaller: function (me) {

        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            mir_id = activeTab.down('hiddenfield[name=mir_id]').getValue(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
            
        me.down('hiddenfield[name=mir_id]').setValue(mir_id);
        me.down('hiddenfield[name=application_code]').setValue(application_code);

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
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            storeID = 'intraystr';
            if(activeTab.down('hiddenfield[name=is_dataammendment_request]')){
                is_dataammendment_request = activeTab.down('hiddenfield[name=is_dataammendment_request]').getValue();
            }
        valid = this.validateNewMirReceivingSubmission();
        if (valid) {
            showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsreceivingfrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
          
        } else {
            Ext.getBody().unmask();
            toastr.warning('Please Enter All the required Request Details!!', 'Warning Response');
            return;
        }
    },
    validateNewMirReceivingSubmission: function (btn) {
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            application_status_id = activeTab.down('hiddenfield[name=application_status_id]').getValue(),
            applicant_id = applicantFrm.down('hiddenfield[name=applicant_id]').getValue(),

            productsDetailsFrm = activeTab.down('#DetailsFrm'),
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
            toastr.warning('Please Enter All the required Request Details!!', 'Warning Response');
            return false;
        }
        return true;
    },
    showFindingsApplicationSubmissionWin: function (btn) {

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
            // hasQueries = checkApplicationRaisedQueries(application_code, module_id),
            mirFindingsFrm = activeTab.down('#mirFindingsFrm'),
            findings_id = mirFindingsFrm.down('hiddenfield[name=id]');

        valid = true;
        if(!findings_id){
            toastr.warning('Please save the research findings!!', 'Warning Response');
            Ext.getBody().unmask();
            return false;
           
        }
        if(!hasRecommendation){
            toastr.warning('Please provide a Recommendation from the comment and recommendation button!!', 'Warning Response');
            Ext.getBody().unmask();
            return false;
        }
        
        showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionsstrictrecommfrm', winWidth, storeID,'','','',workflow_stage_id);
        
    },
    prepareFindingsInterface:function(pnl){
        var mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            mirFindingsFrm = activeTab.down('#mirFindingsFrm');

        mirFindingsFrm = mirFindingsFrm.getForm();
        Ext.getBody().mask('preparing...');
        Ext.Ajax.request({
                method: 'GET',
                url: 'mir/prepareMirFindingsStage',
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
                        mirFindingsDetails = resp.mirFindingsDetails,
                        model = Ext.create('Ext.data.Model', mirFindingsDetails);

                    if (success == true || success === true) {
                        //check if its peer review
                        if(results){
                            console.log({results});
                            stage_category_id = results.stage_category_id;
                            if(stage_category_id == 3){
                                activeTab.down('button[name=sync]').setVisible(false);
                                // activeTab.down('#prev_comments').setVisible(true);
                            }
                            if(stage_category_id == 12){
                                activeTab.down('button[name=sync]').setVisible(false);
                                activeTab.down('button[action=save]').setVisible(false);
                                // activeTab.down('#prev_comments').setVisible(true);
                            }
                            mirFindingsFrm.loadRecord(model);
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
    },
    viewApplicationRecommendationLogs:function(btn) {
        var button = btn.up('button'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            grid = Ext.widget('applicationRecommendationLogGrid');
      
       
        grid.down('hiddenfield[name=application_code]').setValue(application_code);
        grid.down('hiddenfield[name=module_id]').setValue(module_id);
        
        funcShowCustomizableWindow('Findings Recommendations', '60%', grid, 'customizablewindow', btn);
        
    },
    onReProductRegApplication: function (view, record) {
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
            ref_no = record.get('tracking_no'),
             view_id = record.get('view_id'),
            title = 'Request Re-Evaluation',
            workflow_details = getInitialWorkflowDetails(module_id, section_id, sub_module_id); //getAllWorkflowDetails(process_id, workflow_stage_id);
        if (!workflow_details) {
            Ext.getBody().unmask();
            toastr.warning('Problem encountered while fetching workflow details-->Possibly workflow not set!!', 'Warning Response');
            return false;
        }
        var tab = mainTabPanel.getComponent(view_id);
       
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
        me.prepareReApplicationBaseDetails(newTab, record);
    
        //load form
            mainTabPanel.add(newTab);
            var lastTab = mainTabPanel.items.length - 1;
            mainTabPanel.setActiveTab(lastTab);
        } else {

            mainTabPanel.setActiveTab(tab);
        }

        //loading prefilled form
        me.onRegisteredMirgridDblClick(newTab, record);

        //close pop up if there
        grid = Ext.ComponentQuery.query("#mirCompletedApplicationGrid")[0];
        if(grid){
            grid.up('window').close();
        }
        Ext.Function.defer(function () {
            Ext.getBody().unmask();
        }, 300);
    },
    prepareReApplicationBaseDetails: function (tab, record) {
    
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
    onRegisteredMirgridDblClick: function (grid, record) {
        Ext.getBody().mask('Please wait...');
         console.log('gege');
        var me = this,
            mainTabPanel = me.getMainTabPanel(),
            // win = grid.up('window'),
            activeTab = mainTabPanel.getActiveTab(),
            reg_mir_id = record.get('reg_mir_id'),
            tra_mir_id = record.get('tra_mir_id'),
             app_doc_types_store = activeTab.down('combo[name=applicable_documents]').getStore(),
            applicantFrm = activeTab.down('productapplicantdetailsfrm'),
            localagentFrm = activeTab.down('productlocalapplicantdetailsfrm'),
            detailsfrm = activeTab.down('#DetailsFrm'),
            sub_module_id = activeTab.down('hiddenfield[name=sub_module_id]').getValue(),
            process_id = activeTab.down('hiddenfield[name=process_id]').getValue(),
            section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            
        filter = {section_id: section_id},
            workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
    
        
        app_doc_types_store.removeAll();
        app_doc_types_store.load({
            params: {
                process_id: process_id,
                workflow_stage: workflow_stage_id
            }
        });
        if (reg_mir_id || sub_module_id == 77) {
            Ext.Ajax.request({
                method: 'GET',
                url: 'mir/onRegisteredMirSearchdetails',
                params: {
                    reg_mir_id: reg_mir_id,
                    tra_mir_id: tra_mir_id
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
                        detailsfrm.loadRecord(model);
                        
                        if(is_populate_primaryappdata == 1){
                            
                            activeTab.down('hiddenfield[name=active_application_code]').setValue(results.active_application_code);
                            activeTab.down('hiddenfield[name=active_application_id]').setValue(results.active_application_id);
                            activeTab.down('displayfield[name=tracking_no]').setValue(results.tracking_no);
                            activeTab.down('displayfield[name=reference_no]').setValue(results.reference_no);
                            
                            activeTab.down('hiddenfield[name=mir_id]').setValue(results.tra_mir_id);
                            
                            activeTab.down('#product_panel').getViewModel().set('isReadOnly', true);
                           
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
    doSaveResearchFindings: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form_xtype = btn.up('form'),
            mainTabPanel = this.getMainTabPanel(),
            activeTab = mainTabPanel.getActiveTab(),
            application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            mir_id = activeTab.down('hiddenfield[name=mir_id]').getValue(),
            storeID = btn.storeID,
            store = Ext.getStore(storeID);

        
        var frm = form_xtype.getForm();
            
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {
                    table_name: table,
                    application_code: application_code,
                    mir_id: mir_id,
                    _token: token
                },
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        record_id = response.record_id,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        form_xtype.down('hiddenfield[name=id]').setValue(record_id);
                        store.removeAll();
                        store.load();
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


});
Ext.define('Admin.view.reports.viewcontroller.ProductReportCtr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.productreportctr',
   

    init: function () {
    
    },
    //Start of graph helpers function
    onAxisLabelRender: function (axis, label, layoutContext) {
        var value = layoutContext.renderer(label);
        return value === 0 ? '0' : Ext.util.Format.number(value);
    },

    onSeriesLabelRender: function (value) {
        return Ext.util.Format.number(value);
    },

    onGridColumnRender: function (v) {
        return Ext.util.Format.number(v);
    },
    //end of graph helper functions

    
    setWorkflowCombosStore: function (obj, options) {
        this.fireEvent('setWorkflowCombosStore', obj, options);
    },
    setOrgConfigCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
      setConfigCombosStore: function (obj, options) {
        this.fireEvent('setConfigCombosStore', obj, options);
    },
    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setConfigGridsStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    func_tipRender: function(toolTip, storeItem, item){
                  toolTip.setHtml(storeItem.get('received_applications')+' '+item.field+ ' for '+storeItem.get('classification_name') );
                },
   
    func_setStore: function(me,options){
       var config = options.config,
           isLoad = options.isLoad,
           store = Ext.create('Admin.store.abstract.AbstractStore', config);
           me.setStore(store); 
       if (isLoad === true || isLoad == true) {
          store.removeAll();
          store.load();
        }
    },
    loadPromotionClassCombo: function(combo,newValue,old,eopt) {
     var form = combo.up('form'),
       classCombo = form.down('combo[name=prodclass_category]');
         
         

      if(newValue!=0){
         var filter = {'section_id':newValue};
         var filters = JSON.stringify(filter);
         var store = classCombo.getStore();
         store.removeAll();
         store.load({params:{filters:filters}});
      }else{
         var store=classCombo.getStore();
         store.removeAll();
         store.load();
      }
          
   },
   

    loadProductReportFilters: function (btn) {
      var grid = btn.up('form'),
        filter=Ext.ComponentQuery.query('#productreportfiltersfrm')[0];
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        prodclass_category = filter.down('combo[name=prodclass_category]').getValue(),
        section_id = filter.down('combo[name=section_id]').getValue(),
       // classification_category = filter.down('combo[name=classification_category]').getValue(),
        product_origin_id = filter.down('combo[name=product_origin_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        producttabularrepresentationgrid=Ext.ComponentQuery.query('#producttabularrepresentationgrid')[0];
        gridStr = producttabularrepresentationgrid.getStore(),
        productcartesian=Ext.ComponentQuery.query('#productcartesian')[0];
        graphStr = productcartesian.getStore();
        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                section_id: section_id,
                //classification_category: classification_category,
                from_date: from_date,
                to_date: to_date,
                prodclass_category: prodclass_category,
                product_origin_id: product_origin_id
                },  
            });
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                section_id: section_id,
                //classification_category: classification_category,
                from_date: from_date,
                to_date: to_date,
                prodclass_category: prodclass_category,
                product_origin_id: product_origin_id
                },  
            });     
    },
     reloadProductCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        filter=Ext.ComponentQuery.query('#productreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        prodclass_category = filter.down('combo[name=prodclass_category]').getValue(),
        section_id = filter.down('combo[name=section_id]').getValue(),
       // classification_category = filter.down('combo[name=classification_category]').getValue(),
        product_origin_id = filter.down('combo[name=product_origin_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        productcartesian=Ext.ComponentQuery.query('#productcartesian')[0]; 
        graphStr = productcartesian.getStore();  
        frm = filter.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                section_id: section_id,
              //  classification_category: classification_category,
                from_date: from_date,
                to_date: to_date,
                prodclass_category: prodclass_category,
                product_origin_id: product_origin_id
                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },

    loadImportExportReportFilters: function (btn) {
      var grid = btn.up('form'),
      filter=Ext.ComponentQuery.query('#importexportreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        permit_type = filter.down('combo[name=permit_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        importexporttabularrepresentationgrid=Ext.ComponentQuery.query('#importexporttabularrepresentationgrid')[0]; 
        gridStr = importexporttabularrepresentationgrid.getStore();
        importexportcartesian=Ext.ComponentQuery.query('#importexportcartesian')[0]; 
        graphStr = importexportcartesian.getStore();  

        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                permit_type: permit_type,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                permit_type: permit_type,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
               
    },

     loadOrderSupplyReportFilters: function (btn) {
      var grid = btn.up('form'),
        sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
        from_date = grid.down('datefield[name=from_date]').getValue(),
        to_date = grid.down('datefield[name=to_date]').getValue(),
        panel = grid.up('panel'),
        tabs = panel.down('localsupplytabpnl'),
        gridStr = tabs.down('localsupplytabularrepresentationgrid').getStore();
        graphStr = tabs.down('cartesian').getStore();  

        module_id=panel.down('hiddenfield[name=module_id]').getValue();

        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
               
    },
     loadApprovalCertificateReportFilters: function (btn) {
      var grid = btn.up('form'),
        sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
        from_date = grid.down('datefield[name=from_date]').getValue(),
        to_date = grid.down('datefield[name=to_date]').getValue(),
        panel = grid.up('panel'),
        tabs = panel.down('approvalcertificatetabpnl'),
        gridStr = tabs.down('approvalcertificatetabularrepresentationgrid').getStore();
        graphStr = tabs.down('cartesian').getStore();  

        module_id=panel.down('hiddenfield[name=module_id]').getValue();

        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
               
    },
    loadImpImportPermitReportFilters: function (btn) {
        var grid = btn.up('form'),
          sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
          permit_type = grid.down('combo[name=permit_type]').getValue(),
          from_date = grid.down('datefield[name=from_date]').getValue(),
          to_date = grid.down('datefield[name=to_date]').getValue(),
          panel = grid.up('panel'),
          tabs = panel.down('controlleddrugsimportpermittabpnl'),
          gridStr = tabs.down('importpermittabularrepresentationgrid').getStore();

          graphStr = tabs.down('cartesian').getStore();  
  
          module_id=panel.down('hiddenfield[name=module_id]').getValue();
  
          gridStr.removeAll();
          gridStr.load({
              params:{
                    sub_module_id:sub_module_id,
                    module_id: module_id,
                    from_date: from_date,
                    to_date: to_date,
                    permit_type:permit_type
                  },
          });
          
          graphStr.removeAll();
          graphStr.load({
              params:{
                  sub_module_id:sub_module_id,
                  module_id: module_id,
                  from_date: from_date,
                  to_date: to_date,
                  permit_type:permit_type
                  
  
                  },
                    
              });
                 
      },
     loadImportPermitReportFilters: function (btn) {
      var grid = btn.up('form'),
      filter=Ext.ComponentQuery.query('#importexportreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        permit_type = filter.down('combo[name=permit_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        importpermittabularrepresentationgrid=Ext.ComponentQuery.query('#importpermittabularrepresentationgrid')[0];
        gridStr = importpermittabularrepresentationgrid.getStore();
        importexportcartesian=Ext.ComponentQuery.query('#importexportcartesian')[0]; 
        graphStr = importexportcartesian.getStore();  

        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date,
                permit_type:permit_type
                

                },
                  
            });
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date,
                permit_type:permit_type
                

                },
                  
            });
               
    },
     loadOrderSupplyReportFilters: function (btn) {
      var grid = btn.up('form'),
        sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
        from_date = grid.down('datefield[name=from_date]').getValue(),
        to_date = grid.down('datefield[name=to_date]').getValue(),
        panel = grid.up('panel'),
        tabs = panel.down('localsupplytabpnl'),
        gridStr = tabs.down('localsupplytabularrepresentationgrid').getStore();
        graphStr = tabs.down('cartesian').getStore();  

        module_id=panel.down('hiddenfield[name=module_id]').getValue();

        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
               
    },

     reloadImportExportCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        filter=Ext.ComponentQuery.query('#importexportreportfiltersfrm')[0];
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        permit_type = filter.down('combo[name=permit_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        importexportcartesian=Ext.ComponentQuery.query('#importexportcartesian')[0];
        graphStr = importexportcartesian.getStore();  

        
        frm = filter.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                permit_type: permit_type,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },
    
     loadPremisesReportFilters: function (btn) {
      var grid = btn.up('form'),
      filter=Ext.ComponentQuery.query('#premisesreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        premise_type = filter.down('combo[name=premise_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        premisestabularrepresentationgrid=Ext.ComponentQuery.query('#premisestabularrepresentationgrid')[0];
        gridStr = premisestabularrepresentationgrid.getStore(),
        premisecartesian=Ext.ComponentQuery.query('#premisecartesian')[0]; 
        graphStr = premisecartesian.getStore();  
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                premise_type: premise_type,
                from_date: from_date,
                to_date: to_date
                },
                  
            });

        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                premise_type: premise_type,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
               
    },
    reloadPremisesCartesianFilters: function (btn) {
        var chart = btn.up('panel');
        console.log(chart);
        filter=Ext.ComponentQuery.query('#premisesreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        premise_type = filter.down('combo[name=premise_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(), 
        premisecartesian=Ext.ComponentQuery.query('#premisecartesian')[0]; 
        graphStr = premisecartesian.getStore();
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        frm = filter.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                premise_type: premise_type,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });

        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },
     loadGmpReportFilters: function (btn) {
      var grid = btn.up('form'),
      filter=Ext.ComponentQuery.query('#gmpreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        gmp_license_type= filter.down('combo[name=gmp_license_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        gmptabularrepresentationgrid=Ext.ComponentQuery.query('#gmptabularrepresentationgrid')[0];
        gridStr = gmptabularrepresentationgrid.getStore();
        gmpcartesian=Ext.ComponentQuery.query('#gmpcartesian')[0];
        graphStr = gmpcartesian.getStore();  

        module_id=filter.down('hiddenfield[name=module_id]').getValue();

        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                gmp_license_type: gmp_license_type,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                gmp_license_type: gmp_license_type,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
               
    },
    loadClinicalTrialReportFilters: function (btn) {
      var grid = btn.up('form'),
       filter=Ext.ComponentQuery.query('#clinicaltrialreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        clinicaltrialtabularrepresentationgrid=Ext.ComponentQuery.query('#clinicaltrialtabularrepresentationgrid')[0]; 
        gridStr = clinicaltrialtabularrepresentationgrid.getStore();
        clinicalTrialcartesian=Ext.ComponentQuery.query('#clinicalTrialcartesian')[0]; 
        graphStr = clinicalTrialcartesian.getStore();  
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                },
                  
            });
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                },        
            });      
    },
     reloadClinicalTrialCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        filter=Ext.ComponentQuery.query('#clinicaltrialreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        clinicalTrialcartesian=Ext.ComponentQuery.query('#clinicalTrialcartesian')[0]; 
        graphStr = clinicalTrialcartesian.getStore();  

        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        frm = filter.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },
    reloadGmpCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        filter=Ext.ComponentQuery.query('#gmpreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        gmp_license_type = filter.down('combo[name=gmp_license_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        gmpcartesian=Ext.ComponentQuery.query('#gmpcartesian')[0]; 
        graphStr = gmpcartesian.getStore();  

        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        frm = filter.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                gmp_license_type: gmp_license_type,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },

    exportPremiseSummaryReport: function(btn) {
    var panel=btn.up('panel'),
    filter=Ext.ComponentQuery.query('#premisesreportfiltersfrm')[0]; 
    sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
    premise_type = filter.down('combo[name=premise_type]').getValue(),
    from_date = filter.down('datefield[name=from_date]').getValue(),
    to_date = filter.down('textfield[name=to_date]').getValue();
    from_date = Ext.Date.format(from_date,'Y-m-d');   
    to_date = Ext.Date.format(to_date,'Y-m-d'); 
    module_id=filter.down('hiddenfield[name=module_id]').getValue();
    // var tab = panel.down('premisestabpnl'),
    // activeTab = tab.getActiveTab(),
    // index = tab.items.indexOf(activeTab);
         //hidden value
   
    frm = filter.getForm();
     if (frm.isValid()) {
    Ext.getBody().mask('Exporting...Please wait...');
            
    Ext.Ajax.request({
        url: 'newreports/exportPremiseSummaryReport',
        method: 'GET',
        headers: {
             'Authorization':'Bearer '+access_token
                 },
        params : {
            'sub_module_id':sub_module_id,
            'module_id': module_id,
            'premise_type': premise_type,
            'from_date': from_date,
            'to_date': to_date,
             },
                      
        success: function (response, textStatus, request) {
            Ext.getBody().unmask();

            var t = JSON.parse(response.responseText);
            var a = document.createElement("a");
            a.href = t.file; 
            a.download = t.name;
            document.body.appendChild(a);

            a.click();
                     
            a.remove();
      
        },
        failure: function(conn, response, options, eOpts) {
            Ext.getBody().unmask();
            Ext.Msg.alert('Error', 'please try again');
        }
       });
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    },
   
   printProductSummary: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#productreportfiltersfrm')[0];
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        section_id = filter.down('combo[name=section_id]').getValue(),
        //classification_category = filter.down('combo[name=classification_category]').getValue(),
        prodclass_category = filter.down('combo[name=prodclass_category]').getValue(),
        product_origin_id = filter.down('combo[name=product_origin_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        tab=Ext.ComponentQuery.query('#producttabpnl')[0];
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
         //hidden value
        // module_id=panel.down('hiddenfield[name=module_id]').getValue();
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        frm = filter.getForm();
        if (frm.isValid()) {

        if(index == 0){
           print_report('newreports/printProductSummaryReport?sub_module_id='+sub_module_id+'&section_id='+section_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id+'&prodclass_category='+prodclass_category+'&product_origin_id='+product_origin_id);
        }
        else{
           print_report('newreports/printProductSummaryReport?sub_module_id='+sub_module_id+'&section_id='+section_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id+'&prodclass_category='+prodclass_category+'&product_origin_id='+product_origin_id);
       }
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
     },

  printProductDetailed: function(btn) {
     var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#productreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        section_id = filter.down('combo[name=section_id]').getValue(),
        //classification_category = filter.down('combo[name=classification_category]').getValue(),
        prodclass_category = filter.down('combo[name=prodclass_category]').getValue(),
        product_origin_id = filter.down('combo[name=product_origin_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        tab=Ext.ComponentQuery.query('#producttabpnl')[0];
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
         //hidden value
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        
    frm = filter.getForm();
     if (frm.isValid()) {
    if(index == 0){
      print_report('newreports/printProductDetailedReport?sub_module_id='+sub_module_id+'&section_id='+section_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id+'&prodclass_category='+prodclass_category+'&product_origin_id='+product_origin_id);
    }
    else{
      print_report('newreports/printProductDetailedReport?sub_module_id='+sub_module_id+'&section_id='+section_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id+'&prodclass_category='+prodclass_category+'&product_origin_id='+product_origin_id);
    }
     } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
  },
  
 expProductWinShow: function(item) {
    var me = this,
    childXtype = item.childXtype,
    winTitle=item.winTitle,
    winWidth=item.winWidth,
    child = Ext.widget(childXtype);
    // var grid = item.up('panel');
    // console.log(grid);
    var elem = item.up('form');
    var panel=item.up('panel'),
    filter=Ext.ComponentQuery.query('#productreportfiltersfrm')[0]; 
    grid=Ext.ComponentQuery.query('#productreportpnl')[0]; 
    comb_class=Ext.ComponentQuery.query('#classification_process')[0]; 

    frm = filter.getForm();
    var comb=comb_class.getValue();
    if (comb!= null){
    if (frm.isValid()) {
    child.down('textfield[name=from_date]').setValue(filter.down('datefield[name=from_date]').getValue());
    child.down('datefield[name=to_date]').setValue(filter.down('datefield[name=to_date]').getValue());
    child.down('textfield[name=section_id]').setValue(filter.down('combo[name=section_id]').getValue());
    child.down('textfield[name=sub_module_id]').setValue(filter.down('combo[name=sub_module_id]').getValue());
    child.down('textfield[name=grid]').setValue(item.xspreadsheet);
    child.down('textfield[name=process_class]').setValue(comb);
           
`   `
    if(item.module=='productWin'){
        child.down('textfield[name=user_id]').setValue(filter.down('combo[name=user_id]').getValue());
        child.down('textfield[name=prodclass_category]').setValue(filter.down('combo[name=prodclass_category]').getValue());
        child.down('textfield[name=product_origin_id]').setValue(filter.down('combo[name=product_origin_id]').getValue());
    }
          
    var dPrint=child.down('button[name=detailed]');
    dPrint.xFileName=item.xFileName;
    dPrint.xPrintFunc=item.xPrintFunc;
    dPrint.xspreadsheet=item.xspreadsheet;
    dPrint.xheading=item.xheading;
    var center = Ext.create({
        xtype: item.xspreadsheet,
        region: 'center',
        bbar: [{
             beforeLoad: function() {
                    var grid=this.up('grid'),
                        form=grid.up('form'),     
                        section_id = form.down('textfield[name=section_id]').getValue(), 
                        sub_module_id = form.down('textfield[name=sub_module_id]').getValue(),  
                        from_date = form.down('datefield[name=from_date]').getValue(),
                        to_date = form.down('datefield[name=to_date]').getValue(),
                        user_id = form.down('textfield[name=user_id]').getValue(),
                        prodclass_category = form.down('textfield[name=prodclass_category]').getValue(), 
                        product_origin_id = form.down('textfield[name=product_origin_id]').getValue(),
                        process_class = form.down('textfield[name=process_class]').getValue(); 
                   

                    store.getProxy().extraParams = {
                        'section_id': section_id,
                        'sub_module_id': sub_module_id,
                        'from_date': from_date,
                        'to_date': to_date, 
                        'user_id': user_id, 
                        'prodclass_category': prodclass_category,
                        'product_origin_id': product_origin_id,
                        'process_class':process_class
                       
                        }
                            
                    }, 
            xtype: 'pagingtoolbar',
            width: '90%',
            displayInfo: true,
            hidden: false,
            displayMsg: 'Showing {0} - {1} out of {2}',
            emptyMsg: 'No Records'                                
        }]
    });
    var storeConfig = {
        proxy: {
             url: 'newreports/productDetailedReportPreview',
        reader: {
             type: 'json',
             rootProperty: 'results',
             totalProperty: 'totalResults'
            }
        }
    };
    store = Ext.create('Admin.store.abstract.AbstractStore', storeConfig);
    center.down('pagingtoolbar').setStore(store);
    center.setStore(store);

    var west = Ext.create({
        xtype: item.xvisibleColumns,
        region: 'west',
        width: 200
    });

    child.add(center);
    child.add(west);

    //hide the action column of the grid
    var x=child.down(item.xspreadsheet),
    y=x.getView().grid;
    y.columns[0].setVisible(0);


    //display window
    funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
     } else {
        toastr.error('Please select Process ', 'Failure Response');
        }
    
  },
 
 loadExportProductWinStoreReload: function(btn) {
    var sub_module_id = btn.down('textfield[name=sub_module_id]').getValue(),
    section_id = btn.down('textfield[name=section_id]').getValue(),
    from_date = btn.down('datefield[name=from_date]').getValue(),
    module_name = btn.down('textfield[name=module_name]').getValue(),
    action_url = btn.down('textfield[name=action_url]').getValue(),
    to_date = btn.down('datefield[name=to_date]').getValue();

          
    if(module_name=="product"){
       user_id = btn.down('textfield[name=user_id]').getValue();
        prodclass_category = btn.down('textfield[name=prodclass_category]').getValue();
        product_origin_id = btn.down('textfield[name=product_origin_id]').getValue();
        process_class = btn.down('textfield[name=process_class]').getValue();
    }
     
      
    //if(section_id!=0 ||sub_module_id!=0 ||classification!=0||prodclass_category!=0||product_origin_id!=0){       
    var store = btn.down('pagingtoolbar').store;
    store.getProxy().url = 'newreports/'+action_url;
        
    store.load({params:{
        'section_id': section_id,
        'sub_module_id': sub_module_id,
        'from_date': from_date,
        'to_date': to_date, 
        //'classification_category': classification, 
        'prodclass_category': prodclass_category,
        'product_origin_id': product_origin_id,
        'process_class':process_class
        }
   })
    // } else {
    //     toastr.error('Please make sure unique Submodule,classification,Product Class and Product Origin is selected to preview and export Detailed Report ', 'Failure Response');
    //     }
    ;


          //disable filters
    var spreadsheetGrid=btn.down('grid'),
    storeGrid = spreadsheetGrid.getStore();
    var t=spreadsheetGrid.down('headercontainer').getGridColumns();

    for (var i = t.length - 1; i >= 2; i--) {
        column=t[i];
        if(column.down('textfield')){
            var textfield=column.down('textfield');

            textfield.disable(true);
        }
                      
        storeGrid.removeFilter(column.filter.property || column.dataIndex);
                   
    }
  },
ExpPremiseWinShow: function(item) {
    var me = this,
    childXtype = item.childXtype,
    winTitle=item.winTitle,
    winWidth=item.winWidth,
    child = Ext.widget(childXtype);
    
            
    //var grid = item.up('panel');
    var elem = item.up('form');
     var panel=item.up('panel'),
    filter=Ext.ComponentQuery.query('#premisesreportfiltersfrm')[0]; 
    grid=Ext.ComponentQuery.query('#premisesreportpnl')[0]; 
    frm = filter.getForm();
    comb_class=Ext.ComponentQuery.query('#classification_process')[0]; 
    var comb=comb_class.getValue();
    if (comb!= null){
     if (frm.isValid()) {
    child.down('textfield[name=from_date]').setValue(filter.down('datefield[name=from_date]').getValue());
    child.down('datefield[name=to_date]').setValue(filter.down('datefield[name=to_date]').getValue());
    child.down('textfield[name=sub_module_id]').setValue(filter.down('combo[name=sub_module_id]').getValue());
    child.down('textfield[name=grid]').setValue(item.xspreadsheet);
    child.down('textfield[name=process_class]').setValue(comb);
           
`   `
    if(item.module=='premiseWin'){
        child.down('textfield[name=premise_type]').setValue(filter.down('combo[name=premise_type]').getValue());

    }
          
    var dPrint=child.down('button[name=detailed]');
    dPrint.xFileName=item.xFileName;
    dPrint.xPrintFunc=item.xPrintFunc;
    dPrint.xspreadsheet=item.xspreadsheet;
    dPrint.xheading=item.xheading;
     
    var center = Ext.create({
        xtype: item.xspreadsheet,
        region: 'center',
        bbar: [{
             beforeLoad: function() {
                    var grid=this.up('grid'),
                    form=grid.up('form'),
                                
                        premise_type = form.down('textfield[name=premise_type]').getValue(), 
                        sub_module_id = form.down('textfield[name=sub_module_id]').getValue(),  
                        from_date = form.down('datefield[name=from_date]').getValue(),
                        to_date = form.down('datefield[name=to_date]').getValue(),
                        process_class = form.down('textfield[name=process_class]').getValue(); 
                   
                    store.getProxy().extraParams = {
                        'premise_type': premise_type,
                        'sub_module_id': sub_module_id,
                        'from_date': from_date,
                        'to_date': to_date, 
                        'process_class':process_class
                       
                        }
                            
                    }, 
            xtype: 'pagingtoolbar',
                    width: '90%',
                    displayInfo: true,
                    hidden: false,
                    displayMsg: 'Showing {0} - {1} out of {2}',
                    emptyMsg: 'No Records',
                                               
        }]
    });
    var storeConfig = {
        proxy: {
             url: 'newreports/premiseDetailedReportPreview',
             reader: {
               type: 'json',
               rootProperty: 'results',
               totalProperty: 'totalResults'
         }
        }
    };
    store = Ext.create('Admin.store.abstract.AbstractStore', storeConfig);
    center.down('pagingtoolbar').setStore(store);
    center.setStore(store);

    var west = Ext.create({
        xtype: item.xvisibleColumns,
        region: 'west',
        width: 200
    });

    child.add(center);
    child.add(west);

    //hide the action column of the grid
    var x=child.down(item.xspreadsheet),
    y=x.getView().grid;
    y.columns[0].setVisible(0);


    //display window
    funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    } else {
        toastr.error('Please select Process ', 'Failure Response');
        }
    
  },
 loadExportPremiseWinStoreReload: function(btn) {
    var sub_module_id = btn.down('textfield[name=sub_module_id]').getValue(),
    from_date = btn.down('datefield[name=from_date]').getValue(),
    module_name = btn.down('textfield[name=module_name]').getValue(),
    action_url = btn.down('textfield[name=action_url]').getValue(),
    to_date = btn.down('datefield[name=to_date]').getValue();

          
     if(module_name=="premise"){
        premise_type = btn.down('textfield[name=premise_type]').getValue();
        process_class = btn.down('textfield[name=process_class]').getValue();
    }
            
    // if(premise_type!=0 && sub_module_id!=0){   
    var store = btn.down('pagingtoolbar').store;
    store.getProxy().url = 'newreports/'+action_url;
        
    store.load({params:{
        'premise_type': premise_type,
        'sub_module_id': sub_module_id,
        'from_date': from_date,
        'to_date': to_date, 
        'process_class':process_class
        }

   })
  //   } else {
  //       toastr.error('Please make sure one of the Submodules and Premise type is selected ', 'Failure Response');
  //       }
  // 
  ;


          //disable filters
    var spreadsheetGrid=btn.down('grid'),
    storeGrid = spreadsheetGrid.getStore();
    var t=spreadsheetGrid.down('headercontainer').getGridColumns();

    for (var i = t.length - 1; i >= 2; i--) {
        column=t[i];
        if(column.down('textfield')){
            var textfield=column.down('textfield');

            textfield.disable(true);
        }
                      
        storeGrid.removeFilter(column.filter.property || column.dataIndex);
                   
    }
  },
  func_ExpImportExportWinShow: function(item) {
    var me = this,
    childXtype = item.childXtype,
    winTitle=item.winTitle,
    winWidth=item.winWidth,
    child = Ext.widget(childXtype);
    
            
    var grid = item.up('panel');
    var elem = item.up('form');
     var panel=item.up('panel'),
    filter=panel.down('form'),
    frm = filter.getForm();
    var comb=grid.down('combo[name=classification_process]').getValue();
    if (comb!= null){
     if (frm.isValid()) {
    child.down('textfield[name=from_date]').setValue(grid.down('datefield[name=from_date]').getValue());
    child.down('datefield[name=to_date]').setValue(grid.down('datefield[name=to_date]').getValue());
    child.down('textfield[name=sub_module_id]').setValue(grid.down('combo[name=sub_module_id]').getValue());
    child.down('textfield[name=grid]').setValue(item.xspreadsheet);
    child.down('textfield[name=process_class]').setValue(grid.down('combo[name=classification_process]').getValue());
           
`   `
    if(item.module=='importexportWin'){
        child.down('textfield[name=permit_type]').setValue(grid.down('combo[name=permit_type]').getValue());

    }
          
    var dPrint=child.down('button[name=detailed]');
    dPrint.xFileName=item.xFileName;
    dPrint.xPrintFunc=item.xPrintFunc;
    dPrint.xspreadsheet=item.xspreadsheet;
    dPrint.xheading=item.xheading;
     
    var center = Ext.create({
        xtype: item.xspreadsheet,
        region: 'center',
        bbar: [{
             beforeLoad: function() {
                    var grid=this.up('grid'),
                    form=grid.up('form'),
                                
                        permit_type = form.down('textfield[name=permit_type]').getValue(), 
                        sub_module_id = form.down('textfield[name=sub_module_id]').getValue(),  
                        from_date = form.down('datefield[name=from_date]').getValue(),
                        to_date = form.down('datefield[name=to_date]').getValue(),
                        process_class = form.down('textfield[name=process_class]').getValue(); 
                   
                    store.getProxy().extraParams = {
                        'permit_type': permit_type,
                        'sub_module_id': sub_module_id,
                        'from_date': from_date,
                        'to_date': to_date, 
                        'process_class':process_class
                       
                        }
                            
                    }, 
            xtype: 'pagingtoolbar',
                    width: '90%',
                    displayInfo: true,
                    hidden: false,
                    displayMsg: 'Showing {0} - {1} out of {2}',
                    emptyMsg: 'No Records',
                                               
        }]
    });
    var storeConfig = {
        proxy: {
             url: 'newreports/importExportDetailedReportPreview',
        reader: {
             type: 'json',
             rootProperty: 'results',
             totalProperty: 'totalResults'
            }
        }
    };
    store = Ext.create('Admin.store.abstract.AbstractStore', storeConfig);
    center.down('pagingtoolbar').setStore(store);
    center.setStore(store);

    var west = Ext.create({
        xtype: item.xvisibleColumns,
        region: 'west',
        width: 200
    });

    child.add(center);
    child.add(west);

    //hide the action column of the grid
    var x=child.down(item.xspreadsheet),
    y=x.getView().grid;
    y.columns[0].setVisible(0);


    //display window
    funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    } else {
        toastr.error('Please select Filters Process', 'Failure Response');
        }
    
  },
 fun_loadExportImportExportWinStoreReload: function(btn) {
    var sub_module_id = btn.down('textfield[name=sub_module_id]').getValue(),
    from_date = btn.down('datefield[name=from_date]').getValue(),
    module_name = btn.down('textfield[name=module_name]').getValue(),
    action_url = btn.down('textfield[name=action_url]').getValue(),
    to_date = btn.down('datefield[name=to_date]').getValue();

          
     if(module_name=="importexport"){
        permit_type = btn.down('textfield[name=permit_type]').getValue();
        process_class = btn.down('textfield[name=process_class]').getValue();
    }
            
    //if(permit_type!=0 && sub_module_id!=0){   
    var store = btn.down('pagingtoolbar').store;
    store.getProxy().url = 'newreports/'+action_url;
        
    store.load({params:{
        'permit_type': permit_type,
        'sub_module_id': sub_module_id,
        'from_date': from_date,
        'to_date': to_date, 
        'process_class':process_class
        }

   })
    // } else {
    //     toastr.error('Please make sure one of the Submodules and Permit type is selected ', 'Failure Response');
    //     }
  ;


          //disable filters
    var spreadsheetGrid=btn.down('grid'),
    storeGrid = spreadsheetGrid.getStore();
    var t=spreadsheetGrid.down('headercontainer').getGridColumns();

    for (var i = t.length - 1; i >= 2; i--) {
        column=t[i];
        if(column.down('textfield')){
            var textfield=column.down('textfield');

            textfield.disable(true);
        }
                      
        storeGrid.removeFilter(column.filter.property || column.dataIndex);
                   
    }
  },
   loadProductClassificationCombo:function(combo,newValue,old,eopt) {
     
      var form=combo.up('form'),
         classCombo=form.down('combo[name=prodclass_category]');

      if(newValue!=0){
       var filter = {'section_id':newValue};
          var filters = JSON.stringify(filter);
         var store=classCombo.getStore();
         store.removeAll();
         store.load({params:{filters:filters}});
      }else{
         var store=classCombo.getStore();
         store.removeAll();
         store.load();
      }
    
      },
  pickFirstEntryOnCombo:function(combo) {
      console.log(combo.getStore().getAt(1));
           combo.setValue(combo.getStore().getAt(0));
   },
  func_toggleExportBtn(combo, newValue, old, eopt){
    var form=combo.up('panel'),
        btn=form.down('button[name=DetailedExport]');    
    if(newValue==0){
        btn.setDisabled(true);
    }else{
      btn.setDisabled(false);
    }
   },

  loadClassAndCategoryCombo: function(combo,newValue,old,eopt) {
     var form = combo.up('form'),
        classCombo = form.down('combo[name=prodclass_category]'),
        sub_module_id = form.down('combo[name=sub_module_id]').getValue();
         
      if(newValue!=0){
         var filter = {'section_id':newValue, sub_module_id: sub_module_id};
         var filters = JSON.stringify(filter);
         var store = classCombo.getStore();
        // var store2 = catCombo.getStore();
         store.removeAll();
        // store2.removeAll();
         store.load({params:{filters:filters}});
        // store2.load({params:{filters:filters}});
      }else{
         var store=classCombo.getStore();
        // var store2=catCombo.getStore();
        // store2.removeAll();
         store.removeAll();
        // store2.load();
         store.load();
      }
          
   },
   

   func_LoadClassificationCombo: function(combo,newValue,old,eopt) {
      var form=combo.up('form'),
      //catCombo=form.down('combo[name=classification_category]'),
      section_id= form.down('combo[name=section_id]').getValue();
      if(newValue!=0){
       var filter = {'prodclass_category_id':newValue};
       var filters = JSON.stringify(filter);
       var store=catCombo.getStore();
       store.removeAll();
       store.load({params:{filters:filters}});
      }else{
        if(section_id !=0){
          var filter = {'section_id':section_id};
          var filters = JSON.stringify(filter);
          var filters = JSON.stringify(filter);
          var store=catCombo.getStore();
          store.removeAll();
          store.load({params:{filters:filters}});
         }
         else{
          var store=catCombo.getStore();
          store.removeAll();
          store.load();
         }
        
      }
     
     },
   loadPermitTypeCombo: function(combo,newValue,old,eopt) {
      var form=combo.up('form'),
      permitCombo=form.down('combo[name=permit_type]'),
      sub_module_id= form.down('combo[name=sub_module_id]').getValue();
      
        if(sub_module_id !=0){
          var filter = {'sub_module_id':sub_module_id};
          var filters = JSON.stringify(filter);
          var filters = JSON.stringify(filter);
          var store=permitCombo.getStore();
          store.removeAll();
          store.load({params:{filters:filters}});
         }
         else{
          var store=permitCombo.getStore();
          store.removeAll();
          store.load();
         }
     },


   loadProductClassificationComboFromGrid: function(combo,newValue,old,eOpts) {
     var grid=combo.up('grid'),
     ClassStr=grid.down('combo[name=classification]').getStore();
     ClassStr.removeAll();
      if(newValue!=0){
          var filter = {'section_id':newValue};
          var filters = JSON.stringify(filter);
          ClassStr.load({params:{filters:filters}})
      }else{
           ClassStr.load();
           }
      },
  loadProductClassificationComboFromForm: function(combo,newValue,old,eOpts) {
    var form=combo.up('form'),
    ClassStr=form.down('combo[name=classification_id]').getStore();
    ClassStr.removeAll();
    if(newValue!=0){
        var filter = {'section_id':newValue};
        var filters = JSON.stringify(filter);
        ClassStr.load({params:{filters:filters}})
    }else{
          ClassStr.load();
     }
    },

  exportProductDetailedReport: function (btn) {
     var filter_array='';
     var name=btn.name,
     xPrintFunc=btn.xPrintFunc,
     xFileName=btn.xFileName;
     var elem = btn.up('form'),
     grid=elem.down(btn.xspreadsheet),
     sub_module_id = elem.down('textfield[name=sub_module_id]').getValue(),
     section_id = elem.down('textfield[name=section_id]').getValue(),
     to_date = elem.down('datefield[name=to_date]').getValue(),
     from_date = elem.down('datefield[name=from_date]').getValue(),
     filterfield = grid.getPlugin('filterfield');
                   
                 
    if(btn.module=="product"){
        //var classification = elem.down('textfield[name=classification_category]').getValue();
        prodclass_category = elem.down('textfield[name = prodclass_category]').getValue();
        product_origin_id = elem.down('textfield[name = product_origin_id]').getValue();
        process_class = elem.down('textfield[name=process_class]').getValue();
        }
                 
        if(name=='filtered'){
        //filters
            var filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
        }

        var header=Ext.pluck(grid.query('gridcolumn:not([hidden])'), 'name');
        var header2=[];
        var x=0;
        for (var i = 0; i <= header.length; i++) {
        header2[x]= header[i];
        x++;
        }
                 
        var header=header2;
            
        filter_array = Ext.JSON.encode(filter_array);
            
        Ext.Ajax.request({
            url: 'newreports/exportDetailedReport',
            method: 'GET',
            headers: {
                'Authorization':'Bearer '+access_token
            },
            params : {

                'header':JSON.stringify(header),
                'section_id': section_id,
                'sub_module_id': sub_module_id,
                'from_date': from_date,
                'to_date': to_date, 
                 //'classification_category': classification, 
                'prodclass_category': prodclass_category,
                'product_origin_id': product_origin_id,
                'filter': JSON.stringify(filter_array),
                'function': xPrintFunc,
                'filename': xFileName,
                'process_class':process_class,
                'headingText':btn.xheading,
                                
            },
                      
            success: function (response, textStatus, request) {
                Ext.getBody().unmask();
                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);

                a.click();
                     
                 a.remove();
      
            },
            failure: function(conn, response, options, eOpts) {
                //Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
                 }
            });
                  
            

     },
  func_downloadgraph: function(btn, e, eOpts) {
        var panel = btn.up('panel');
        console.log(panel);
        if(panel='premisegraphicalrepresentationgraph'){
          chart=Ext.ComponentQuery.query('#premisecartesian')[0];
        }
        console.log(chart);
        FileName=btn.FileName;
            var link = document.createElement("a");
            link.setAttribute("href", chart.getImage("stream").data);
            link.setAttribute("download", FileName);
            link.click();
            link.remove();
    },

  func_exportImportExportSummaryReport: function(btn) {
    var panel=btn.up('panel'),
    filter=Ext.ComponentQuery.query('#importexportreportfiltersfrm')[0]; 
    sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
    permit_type = filter.down('combo[name=permit_type]').getValue(),
    from_date = filter.down('datefield[name=from_date]').getValue(),
    to_date = filter.down('textfield[name=to_date]').getValue();
    from_date = Ext.Date.format(from_date,'Y-m-d');   
    to_date = Ext.Date.format(to_date,'Y-m-d'); 
    module_id=filter.down('hiddenfield[name=module_id]').getValue();
    tab=Ext.ComponentQuery.query('#importexporttabpnl')[0]; 
    activeTab = tab.getActiveTab(),
    index = tab.items.indexOf(activeTab);
         //hidden value
   
    frm = filter.getForm();
     if (frm.isValid()) {
    Ext.getBody().mask('Exporting...Please wait...');
            
    Ext.Ajax.request({
        url: 'newreports/importExportSummaryReportExport',
        method: 'GET',
        headers: {
             'Authorization':'Bearer '+access_token
                 },
        params : {
            'sub_module_id':sub_module_id,
            'module_id': module_id,
            'permit_type': permit_type,
            'from_date': from_date,
            'to_date': to_date,
             },
                      
        success: function (response, textStatus, request) {
            Ext.getBody().unmask();

            var t = JSON.parse(response.responseText);
            var a = document.createElement("a");
            a.href = t.file; 
            a.download = t.name;
            document.body.appendChild(a);

            a.click();
                     
            a.remove();
      
        },
        failure: function(conn, response, options, eOpts) {
            Ext.getBody().unmask();
            Ext.Msg.alert('Error', 'please try again');
        }
       });
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    },
      printPremiseSummary: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#premisesreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        premise_type = filter.down('combo[name=premise_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        tab=Ext.ComponentQuery.query('#premisestabpnl')[0];
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
         //hidden value
        module_id=filter.down('hiddenfield[name=module_id]').getValue();

        frm = filter.getForm();
        if (frm.isValid()) {

        if(index == 0){
           print_report('newreports/printPremiseSummaryReport?sub_module_id='+sub_module_id+'&premise_type='+premise_type+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
        else{
           print_report('newreports/printPremiseSummaryReport?sub_module_id='+sub_module_id+'&premise_type='+premise_type+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
       }
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
     },
     printImportExportSummary: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#importexportreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        permit_type = filter.down('combo[name=permit_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d');
        tab=Ext.ComponentQuery.query('#importexporttabpnl')[0];
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
         //hidden value
        module_id=filter.down('hiddenfield[name=module_id]').getValue();

        frm = filter.getForm();
        if (frm.isValid()) {

        if(index == 0){
           print_report('newreports/printImportExportSummaryReport?sub_module_id='+sub_module_id+'&permit_type='+permit_type+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
        else{
           print_report('newreports/printImportExportSummaryReport?sub_module_id='+sub_module_id+'&permit_type='+permit_type+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
     },
  exportProductSummaryReport: function(btn) {
    var panel=btn.up('panel'),
    filter=Ext.ComponentQuery.query('#productreportfiltersfrm')[0]; 
    sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
    section_id = filter.down('combo[name=section_id]').getValue(),
   // classification_category = filter.down('combo[name=classification_category]').getValue(),
    prodclass_category = filter.down('combo[name=prodclass_category]').getValue(),
    product_origin_id = filter.down('combo[name=product_origin_id]').getValue(),
    from_date = filter.down('datefield[name=from_date]').getValue(),
    to_date = filter.down('textfield[name=to_date]').getValue();
    from_date = Ext.Date.format(from_date,'Y-m-d');   
    to_date = Ext.Date.format(to_date,'Y-m-d'); 
    module_id=filter.down('hiddenfield[name=module_id]').getValue();
    tab=Ext.ComponentQuery.query('#producttabpnl')[0]; 
    activeTab = tab.getActiveTab(),
    index = tab.items.indexOf(activeTab);
         //hidden value
    
    frm = filter.getForm();
     if (frm.isValid()) {
    Ext.getBody().mask('Exporting...Please wait...'); 
    Ext.Ajax.request({
        url: 'newreports/exportProductSummaryReport',
        method: 'GET',
        headers: {
             'Authorization':'Bearer '+access_token
                 },
        params : {
            'sub_module_id':sub_module_id,
            'module_id': module_id,
            'section_id': section_id,
           // 'classification_category': classification_category,
            'from_date': from_date,
            'to_date': to_date,
            'prodclass_category': prodclass_category,
            'product_origin_id': product_origin_id,
             },
                      
        success: function (response, textStatus, request) {
            Ext.getBody().unmask();

            var t = JSON.parse(response.responseText);
            var a = document.createElement("a");
            a.href = t.file; 
            a.download = t.name;
            document.body.appendChild(a);

            a.click();
                     
            a.remove();
      
        },
        failure: function(conn, response, options, eOpts) {
            Ext.getBody().unmask();
            Ext.Msg.alert('Error', 'please try again');
        }
       });
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    },

    exportPremiseDetailedReport: function (btn) {
         var filter_array='';
         var name=btn.name,
         xPrintFunc=btn.xPrintFunc,
         xFileName=btn.xFileName;

         var elem = btn.up('form'),
         grid=elem.down(btn.xspreadsheet),
         sub_module_id = elem.down('textfield[name=sub_module_id]').getValue(),
         to_date = elem.down('datefield[name=to_date]').getValue(),
         from_date = elem.down('datefield[name=from_date]').getValue(),
         filterfield = grid.getPlugin('filterfield');
                       
                     
        if(btn.module=="premise"){
            var premise_type = elem.down('textfield[name=premise_type]').getValue();
         
            }
                     
            if(name=='filtered'){
            //filters
                var filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
            }

            var header=Ext.pluck(grid.query('gridcolumn:not([hidden])'), 'name');
            var header2=[];
            var x=0;
            for (var i = 0; i <= header.length; i++) {
            header2[x]= header[i];
            x++;
            }
                     
            var header=header2;
                
            filter_array = Ext.JSON.encode(filter_array);
                
            Ext.Ajax.request({
                url: 'newreports/exportDetailedReport',
                method: 'GET',
                headers: {
                    'Authorization':'Bearer '+access_token
                },
                params : {

                    'header':JSON.stringify(header),
                    'premise_type': premise_type,
                    'sub_module_id': sub_module_id,
                    'from_date': from_date,
                    'to_date': to_date, 
                    'filter': JSON.stringify(filter_array),
                    'function': xPrintFunc,
                    'filename': xFileName,
                    'process_class':process_class,
                    'headingText':btn.xheading,
                                    
                },
                          
                success: function (response, textStatus, request) {
                    Ext.getBody().unmask();
                    var t = JSON.parse(response.responseText);
                    var a = document.createElement("a");
                    a.href = t.file; 
                    a.download = t.name;
                    document.body.appendChild(a);

                    a.click();
                         
                     a.remove();
          
                },
                failure: function(conn, response, options, eOpts) {
                    //Ext.getBody().unmask();
                    Ext.Msg.alert('Error', 'please try again');
                     }
                });
                      
            

     },
    func_exportImportExportDetailedReport: function (btn) {
         var filter_array='';
         var name=btn.name,
         xPrintFunc=btn.xPrintFunc,
         xFileName=btn.xFileName;

         var elem = btn.up('form'),
         grid=elem.down(btn.xspreadsheet),
         sub_module_id = elem.down('textfield[name=sub_module_id]').getValue(),
         to_date = elem.down('datefield[name=to_date]').getValue(),
         from_date = elem.down('datefield[name=from_date]').getValue(),
         filterfield = grid.getPlugin('filterfield');
                       
                     
        if(btn.module=="importexport"){
            var permit_type = elem.down('textfield[name=permit_type]').getValue();
         
            }
                     
            if(name=='filtered'){
            //filters
                var filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
            }

            var header=Ext.pluck(grid.query('gridcolumn:not([hidden])'), 'name');
            var header2=[];
            var x=0;
            for (var i = 0; i <= header.length; i++) {
            header2[x]= header[i];
            x++;
            }
                     
            var header=header2;
                
            filter_array = Ext.JSON.encode(filter_array);
                
            Ext.Ajax.request({
                url: 'newreports/exportDetailedReport',
                method: 'GET',
                headers: {
                    'Authorization':'Bearer '+access_token
                },
                params : {

                    'header':JSON.stringify(header),
                    'permit_type': permit_type,
                    'sub_module_id': sub_module_id,
                    'from_date': from_date,
                    'to_date': to_date, 
                    'filter': JSON.stringify(filter_array),
                    'function': xPrintFunc,
                    'filename': xFileName,
                    'process_class':process_class,
                    'headingText':btn.xheading,
                                    
                },
                          
                success: function (response, textStatus, request) {
                    Ext.getBody().unmask();
                    var t = JSON.parse(response.responseText);
                    var a = document.createElement("a");
                    a.href = t.file; 
                    a.download = t.name;
                    document.body.appendChild(a);

                    a.click();
                         
                     a.remove();
          
                },
                failure: function(conn, response, options, eOpts) {
                    //Ext.getBody().unmask();
                    Ext.Msg.alert('Error', 'please try again');
                     }
                });
                      
                

     },
    printGmpSummary: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#gmpreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        gmp_license_type = filter.down('combo[name=gmp_license_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        tab=Ext.ComponentQuery.query('#gmptabpnl')[0];
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
        //hidden value

        frm = filter.getForm();
        if (frm.isValid()) {

        if(index == 0){
            print_report('newreports/printGmpSummaryReport?sub_module_id='+sub_module_id+'&gmp_license_type='+gmp_license_type+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
         else{
            print_report('newreports/printGmpSummaryReport?sub_module_id='+sub_module_id+'&gmp_license_type='+gmp_license_type+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
     },
    func_gmpSummaryReport: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#gmpreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        gmp_license_type = filter.down('combo[name=gmp_license_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        var tab = panel.down('gmptabpnl'),
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
             //hidden value
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        frm = filter.getForm();
         if (frm.isValid()) {
        Ext.getBody().mask('Exporting...Please wait...');
                
        Ext.Ajax.request({
            url: 'newreports/gmpSummaryReportExport',
            method: 'GET',
            headers: {
                 'Authorization':'Bearer '+access_token
                     },
            params : {
                'sub_module_id':sub_module_id,
                'module_id': module_id,
                'gmp_license_type': gmp_license_type,
                'from_date': from_date,
                'to_date': to_date,
                 },
                          
            success: function (response, textStatus, request) {
                Ext.getBody().unmask();

                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);

                a.click();
                         
                a.remove();
          
            },
            failure: function(conn, response, options, eOpts) {
                Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
            }
           });
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
    },
    func_ExpGmpWinShow: function(item) {
        var me = this,
        childXtype = item.childXtype,
        winTitle=item.winTitle,
        winWidth=item.winWidth,
        child = Ext.widget(childXtype);
        var grid = item.up('panel');
        var elem = item.up('form');
         var panel=item.up('panel'),
        // filter=panel.down('form'),
        // frm = filter.getForm();
        filter=Ext.ComponentQuery.query('#gmpreportfiltersfrm')[0]; 
        comb_class=Ext.ComponentQuery.query('#classification_process')[0]; 
       // var comb=grid.down('combo[name=classification_process]').getValue();
        var comb=comb_class.getValue(); 
        if (comb!= null)
       {
         if (frm.isValid()) {
        child.down('textfield[name=from_date]').setValue(filter.down('datefield[name=from_date]').getValue());
        child.down('datefield[name=to_date]').setValue(filter.down('datefield[name=to_date]').getValue());
        child.down('textfield[name=sub_module_id]').setValue(filter.down('combo[name=sub_module_id]').getValue());
        child.down('textfield[name=grid]').setValue(item.xspreadsheet);
        child.down('textfield[name=process_class]').setValue(comb);
               
    `   `
        if(item.module=='gmpWin'){
            child.down('textfield[name=gmp_license_type]').setValue(filter.down('combo[name=gmp_license_type]').getValue());

        }
              
        var dPrint=child.down('button[name=detailed]');
        dPrint.xFileName=item.xFileName;
        dPrint.xPrintFunc=item.xPrintFunc;
        dPrint.xspreadsheet=item.xspreadsheet;
        dPrint.xheading=item.xheading;
         
        var center = Ext.create({
            xtype: item.xspreadsheet,
            region: 'center',
            bbar: [{
                 beforeLoad: function() {
                        var grid=this.up('grid'),
                        form=grid.up('form'),
                                    
                            gmp_license_type = form.down('textfield[name=gmp_license_type]').getValue(), 
                            sub_module_id = form.down('textfield[name=sub_module_id]').getValue(),  
                            from_date = form.down('datefield[name=from_date]').getValue(),
                            to_date = form.down('datefield[name=to_date]').getValue(),
                            process_class = form.down('textfield[name=process_class]').getValue(); 
                       
                        store.getProxy().extraParams = {
                            'gmp_license_type': gmp_license_type,
                            'sub_module_id': sub_module_id,
                            'from_date': from_date,
                            'to_date': to_date, 
                            'process_class':process_class
                           
                            }
                                
                        }, 
               xtype: 'pagingtoolbar',
                        width: '90%',
                        displayInfo: true,
                        hidden: false,
                        displayMsg: 'Showing {0} - {1} out of {2}',
                        emptyMsg: 'No Records',
                                                   
            }]
        });
        var storeConfig = {
            proxy: {
                 url: 'newreports/gmpDetailedReportPreview',
            reader: {
                 type: 'json',
                 rootProperty: 'results',
                 totalProperty: 'totalResults'
              }
            }
        };
        store = Ext.create('Admin.store.abstract.AbstractStore', storeConfig);
        center.down('pagingtoolbar').setStore(store);
        center.setStore(store);

        var west = Ext.create({
            xtype: item.xvisibleColumns,
            region: 'west',
            width: 200
        });

        child.add(center);
        child.add(west);

        //hide the action column of the grid
        var x=child.down(item.xspreadsheet),
        y=x.getView().grid;
        y.columns[0].setVisible(0);


        //display window
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
        } else {
        toastr.error('Please select Process ', 'Failure Response');
        }
        
       },
    fun_loadExportGmpWinStoreReload: function(btn) {
        var sub_module_id = btn.down('textfield[name=sub_module_id]').getValue(),
        from_date = btn.down('datefield[name=from_date]').getValue(),
        module_name = btn.down('textfield[name=module_name]').getValue(),
        action_url = btn.down('textfield[name=action_url]').getValue(),
        to_date = btn.down('datefield[name=to_date]').getValue();

              
         if(module_name=="gmp"){
            gmp_license_type = btn.down('textfield[name=gmp_license_type]').getValue();
            process_class = btn.down('textfield[name=process_class]').getValue();
        }
                
        //if(permit_type!=0 && sub_module_id!=0){   
        var store = btn.down('pagingtoolbar').store;
        store.getProxy().url = 'newreports/'+action_url;
            
        store.load({params:{
            'gmp_license_type': gmp_license_type,
            'sub_module_id': sub_module_id,
            'from_date': from_date,
            'to_date': to_date, 
            'process_class':process_class
            }

       })
        // } else {
        //     toastr.error('Please make sure one of the Submodules and Permit type is selected ', 'Failure Response');
        //     }
      ;
              //disable filters
        var spreadsheetGrid=btn.down('grid'),
        storeGrid = spreadsheetGrid.getStore();
        var t=spreadsheetGrid.down('headercontainer').getGridColumns();

        for (var i = t.length - 1; i >= 2; i--) {
            column=t[i];
            if(column.down('textfield')){
                var textfield=column.down('textfield');

                textfield.disable(true);
            }
                          
            storeGrid.removeFilter(column.filter.property || column.dataIndex);
                       
        }
      },
   func_exportGmpDetailedReport: function (btn) {
     var filter_array='';
     var name=btn.name,
     xPrintFunc=btn.xPrintFunc,
     xFileName=btn.xFileName;

     var elem = btn.up('form'),
     grid=elem.down(btn.xspreadsheet),
     sub_module_id = elem.down('textfield[name=sub_module_id]').getValue(),
     to_date = elem.down('datefield[name=to_date]').getValue(),
     from_date = elem.down('datefield[name=from_date]').getValue(),
     filterfield = grid.getPlugin('filterfield');
                   
                 
    if(btn.module=="gmp"){
        var gmp_license_type = elem.down('textfield[name=gmp_license_type]').getValue();
     
        }
                 
        if(name=='filtered'){
        //filters
            var filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
        }

        var header=Ext.pluck(grid.query('gridcolumn:not([hidden])'), 'name');
        var header2=[];
        var x=0;
        for (var i = 0; i <= header.length; i++) {
        header2[x]= header[i];
        x++;
        }
                 
        var header=header2;
            
        filter_array = Ext.JSON.encode(filter_array);
            
        Ext.Ajax.request({
            url: 'newreports/exportDetailedReport',
            method: 'GET',
            headers: {
                'Authorization':'Bearer '+access_token
            },
            params : {

                'header':JSON.stringify(header),
                'gmp_license_type': gmp_license_type,
                'sub_module_id': sub_module_id,
                'from_date': from_date,
                'to_date': to_date, 
                'filter': JSON.stringify(filter_array),
                'function': xPrintFunc,
                'filename': xFileName,
                'process_class':process_class,
                'headingText':btn.xheading,
                                
            },
                      
            success: function (response, textStatus, request) {
                Ext.getBody().unmask();
                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);

                a.click();
                     
                 a.remove();
      
            },
            failure: function(conn, response, options, eOpts) {
                //Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
                 }
            });
                  
            

     },
    printClinicalTrialSummary: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#clinicaltrialreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        tab=Ext.ComponentQuery.query('#clinicaltrialtabpnl')[0]; 
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
        //hidden value
         module_id=filter.down('hiddenfield[name=module_id]').getValue();

        frm = filter.getForm();
        if (frm.isValid()) {


        if(index == 0){
            print_report('newreports/printClinicalTrialSummaryReport?sub_module_id='+sub_module_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
         else{
            print_report('newreports/printClinicalTrialSummaryReport?sub_module_id='+sub_module_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
         },
   func_clinicalTrialSummaryReport: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#clinicaltrialreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        tab=Ext.ComponentQuery.query('#clinicaltrialtabpnl')[0]; 
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
             //hidden value
        frm = filter.getForm();
         if (frm.isValid()) {
        Ext.getBody().mask('Exporting...Please wait...');
                
        Ext.Ajax.request({
            url: 'newreports/clinicalTrialSummaryReportExport',
            method: 'GET',
            headers: {
                 'Authorization':'Bearer '+access_token
                     },
            params : {
                'sub_module_id':sub_module_id,
                'module_id': module_id,
                'from_date': from_date,
                'to_date': to_date,
                 },
                          
            success: function (response, textStatus, request) {
                Ext.getBody().unmask();

                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);

                a.click();
                         
                a.remove();
          
            },
            failure: function(conn, response, options, eOpts) {
                Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
            }
           });
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
        },
    func_ExpClinicalTrialWinShow: function(item) {
        var me = this,
        childXtype = item.childXtype,
        winTitle=item.winTitle,
        winWidth=item.winWidth,
        child = Ext.widget(childXtype);     
        var grid = item.up('panel');
        var elem = item.up('form');
         var panel=item.up('panel'),
        //filter=panel.down('form'),
       // frm = filter.getForm();
        filter=Ext.ComponentQuery.query('#clinicaltrialreportfiltersfrm')[0]; 
        var comb_class=Ext.ComponentQuery.query('#classification_process')[0];
        var comb=comb_class.getValue();
         if (comb!= null){
         if (frm.isValid()) {
        child.down('textfield[name=from_date]').setValue(filter.down('datefield[name=from_date]').getValue());
        child.down('datefield[name=to_date]').setValue(filter.down('datefield[name=to_date]').getValue());
        child.down('textfield[name=sub_module_id]').setValue(filter.down('combo[name=sub_module_id]').getValue());
        child.down('textfield[name=grid]').setValue(item.xspreadsheet);
        child.down('textfield[name=process_class]').setValue(comb);
               
              
        var dPrint=child.down('button[name=detailed]');
        dPrint.xFileName=item.xFileName;
        dPrint.xPrintFunc=item.xPrintFunc;
        dPrint.xspreadsheet=item.xspreadsheet;
        dPrint.xheading=item.xheading;
         
        var center = Ext.create({
            xtype: item.xspreadsheet,
            region: 'center',
            bbar: [{
                 beforeLoad: function() {
                        var grid=this.up('grid'),
                        form=grid.up('form'),
                                    
                            category = form.down('textfield[name=category]').getValue(), 
                            sub_module_id = form.down('textfield[name=sub_module_id]').getValue(),  
                            from_date = form.down('datefield[name=from_date]').getValue(),
                            to_date = form.down('datefield[name=to_date]').getValue(),
                            process_class = form.down('textfield[name=process_class]').getValue(); 
                       
                        store.getProxy().extraParams = {
                            'sub_module_id': sub_module_id,
                            'from_date': from_date,
                            'to_date': to_date, 
                            'process_class':process_class
                           
                            }
                                
                        }, 
                xtype: 'pagingtoolbar',
                        width: '90%',
                        displayInfo: true,
                        hidden: false,
                        displayMsg: 'Showing {0} - {1} out of {2}',
                        emptyMsg: 'No Records',
                                                   
            }]
        });
        var storeConfig = {
            proxy: {
                 url: 'newreports/gmpDetailedReportPreview',
            reader: {
             type: 'json',
             rootProperty: 'results',
             totalProperty: 'totalResults'
              }
            }
        };
        store = Ext.create('Admin.store.abstract.AbstractStore', storeConfig);
        center.down('pagingtoolbar').setStore(store);
        center.setStore(store);

        var west = Ext.create({
            xtype: item.xvisibleColumns,
            region: 'west',
            width: 200
        });

        child.add(center);
        child.add(west);

        //hide the action column of the grid
        var x=child.down(item.xspreadsheet),
        y=x.getView().grid;
        y.columns[0].setVisible(0);


        //display window
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
         } else {
            toastr.error('Please select Process ', 'Failure Response');
            }
        
      },
    fun_loadExportClinicalTrialWinStoreReload: function(btn) {
        var sub_module_id = btn.down('textfield[name=sub_module_id]').getValue(),
        from_date = btn.down('datefield[name=from_date]').getValue(),
        module_name = btn.down('textfield[name=module_name]').getValue(),
        action_url = btn.down('textfield[name=action_url]').getValue(),
        to_date = btn.down('datefield[name=to_date]').getValue();
        process_class = btn.down('textfield[name=process_class]').getValue();

          if(module_name=="clinicaltrial"){
            process_class = btn.down('textfield[name=process_class]').getValue();
        }

                
        //if(permit_type!=0 && sub_module_id!=0){   
        var store = btn.down('pagingtoolbar').store;
        store.getProxy().url = 'newreports/'+action_url;
            
        store.load({params:{
            'sub_module_id': sub_module_id,
            'from_date': from_date,
            'to_date': to_date, 
            'process_class':process_class
            }

       })
        // } else {
        //     toastr.error('Please make sure one of the Submodules and Permit type is selected ', 'Failure Response');
        //     }
      ;
              //disable filters
        var spreadsheetGrid=btn.down('grid'),
        storeGrid = spreadsheetGrid.getStore();
        var t=spreadsheetGrid.down('headercontainer').getGridColumns();

        for (var i = t.length - 1; i >= 2; i--) {
            column=t[i];
            if(column.down('textfield')){
                var textfield=column.down('textfield');

                textfield.disable(true);
            }
                          
            storeGrid.removeFilter(column.filter.property || column.dataIndex);
                       
        }
      },
    func_exportClinicalTrialDetailedReport: function (btn) {
         var filter_array='';
         var name=btn.name,
         xPrintFunc=btn.xPrintFunc,
         xFileName=btn.xFileName;

         var elem = btn.up('form'),
         grid=elem.down(btn.xspreadsheet),
         sub_module_id = elem.down('textfield[name=sub_module_id]').getValue(),
         to_date = elem.down('datefield[name=to_date]').getValue(),
         from_date = elem.down('datefield[name=from_date]').getValue(),
         filterfield = grid.getPlugin('filterfield');
                       
                           
         if(name=='filtered'){
            //filters
             var filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
        }

        var header=Ext.pluck(grid.query('gridcolumn:not([hidden])'), 'name');
         var header2=[];
        var x=0;
         for (var i = 0; i <= header.length; i++) {
        header2[x]= header[i];
        x++;
        }
                     
        var header=header2;
                
        filter_array = Ext.JSON.encode(filter_array);
                
        Ext.Ajax.request({
            url: 'newreports/exportDetailedReport',
            method: 'GET',
            headers: {
                'Authorization':'Bearer '+access_token
             },
            params : {

                'header':JSON.stringify(header),
                'sub_module_id': sub_module_id,
                'from_date': from_date,
                'to_date': to_date, 
                'filter': JSON.stringify(filter_array),
                'function': xPrintFunc,
                'filename': xFileName,
                'process_class':process_class,
                'headingText':btn.xheading,
                                    
               },
                          
            success: function (response, textStatus, request) {
            Ext.getBody().unmask();
                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);

                a.click();
                         
                a.remove();
          
              },
            failure: function(conn, response, options, eOpts) {
                //Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
                    }
            });
                      
                

        },
    loadPromotionAdvertisementReportFilters: function (btn) {
       var grid = btn.up('form'),
       filter=Ext.ComponentQuery.query('#promotionadvertisementreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        advertisement_type_id = filter.down('combo[name=advertisement_type_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        promotionadvertisementtabularrepresentationgrid=Ext.ComponentQuery.query('#promotionadvertisementtabularrepresentationgrid')[0];
        gridStr = promotionadvertisementtabularrepresentationgrid.getStore(),
        promotionadvertisementcartesian=Ext.ComponentQuery.query('#promotionadvertisementcartesian')[0]; 
        graphStr = promotionadvertisementcartesian.getStore();
        module_id=filter.down('hiddenfield[name=module_id]').getValue();

        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                advertisement_type_id:advertisement_type_id,
                from_date: from_date,
                to_date: to_date

                },
                  
            });
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                advertisement_type_id:advertisement_type_id,
                from_date: from_date,
                to_date: to_date
                },
                  
            });
               
    },
     reloadPromotionAdvertisementCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        filter=Ext.ComponentQuery.query('#promotionadvertisementreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        advertisement_type_id = filter.down('combo[name=advertisement_type_id]').getValue()
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        promotionadvertisementcartesian=Ext.ComponentQuery.query('#promotionadvertisementcartesian')[0]; 
        graphStr = promotionadvertisementcartesian.getStore();
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        frm = filter.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                advertisement_type_id:advertisement_type_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },
    expPromotionAdvertisementWinShow: function(item) {
    var me = this,
    childXtype = item.childXtype,
    winTitle=item.winTitle,
    winWidth=item.winWidth,
    child = Ext.widget(childXtype);
    
            
    var grid = item.up('panel');
    var elem = item.up('form');
    var panel=item.up('panel'),
    filter=panel.down('form'),
    frm = filter.getForm();
    var comb=grid.down('combo[name=classification_process]').getValue();
    if (comb!= null){
     if (frm.isValid()) {
    child.down('textfield[name=from_date]').setValue(grid.down('datefield[name=from_date]').getValue());
    child.down('datefield[name=to_date]').setValue(grid.down('datefield[name=to_date]').getValue());
    child.down('textfield[name=sub_module_id]').setValue(grid.down('combo[name=sub_module_id]').getValue());
    child.down('textfield[name=grid]').setValue(item.xspreadsheet);
    child.down('textfield[name=process_class]').setValue(grid.down('combo[name=classification_process]').getValue());
    
    if(item.module=='promotionadvertisementWin'){
        child.down('textfield[name=advertisement_type_id]').setValue(grid.down('combo[name=advertisement_type_id]').getValue());

    }

    var dPrint=child.down('button[name=detailed]');
    dPrint.xFileName=item.xFileName;
    dPrint.xPrintFunc=item.xPrintFunc;
    dPrint.xspreadsheet=item.xspreadsheet;
    dPrint.xheading=item.xheading;
     
    var center = Ext.create({
        xtype: item.xspreadsheet,
        region: 'center',
        bbar: [{
             beforeLoad: function() {
                    var grid=this.up('grid'),
                    form=grid.up('form'),
                                
                        sub_module_id = form.down('textfield[name=sub_module_id]').getValue(),  
                        from_date = form.down('datefield[name=from_date]').getValue(),
                        advertisement_type_id = form.down('textfield[name=advertisement_type_id]').getValue(),
                        to_date = form.down('datefield[name=to_date]').getValue(),
                        process_class = form.down('textfield[name=process_class]').getValue(); 
                   

                    store.getProxy().extraParams = {
                        'sub_module_id': sub_module_id,
                        'from_date': from_date,
                        'advertisement_type_id':advertisement_type_id,
                        'to_date': to_date, 
                        'process_class':process_class
                       
                        }
                            
                    }, 
            xtype: 'pagingtoolbar',
                    width: '90%',
                    displayInfo: true,
                    hidden: false,
                    displayMsg: 'Showing {0} - {1} out of {2}',
                    emptyMsg: 'No Records',
                                               
        }]
    });
    var storeConfig = {
        proxy: {
             url: 'newreports/promotionAdvertisementDetailedReportPreview',
        reader: {
             type: 'json',
             rootProperty: 'results',
             totalProperty: 'totalResults'
            }
        }
    };
    store = Ext.create('Admin.store.abstract.AbstractStore', storeConfig);
    center.down('pagingtoolbar').setStore(store);
    center.setStore(store);

    var west = Ext.create({
        xtype: item.xvisibleColumns,
        region: 'west',
        width: 200
    });

    child.add(center);
    child.add(west);

    //hide the action column of the grid
    var x=child.down(item.xspreadsheet),
    y=x.getView().grid;
    y.columns[0].setVisible(0);


    //display window
    funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    } else {
        toastr.error('Please select Process', 'Failure Response');
        }
    
  },
 
 loadExportPromotionAdvertisementWinStoreReload: function(btn) {
    var sub_module_id = btn.down('textfield[name=sub_module_id]').getValue(),
    from_date = btn.down('datefield[name=from_date]').getValue(),
    module_name = btn.down('textfield[name=module_name]').getValue(),
    advertisement_type_id = btn.down('textfield[name=advertisement_type_id]').getValue(),
    action_url = btn.down('textfield[name=action_url]').getValue(),
    to_date = btn.down('datefield[name=to_date]').getValue();
    process_class = btn.down('textfield[name=process_class]').getValue();

     
      
    //if(section_id!=0 ||sub_module_id!=0 ||classification!=0||prodclass_category!=0||product_origin_id!=0){       
    var store = btn.down('pagingtoolbar').store;
    store.getProxy().url = 'newreports/'+action_url;
        
    store.load({params:{
        'sub_module_id': sub_module_id,
        'advertisement_type_id': advertisement_type_id,
        'from_date': from_date,
        'to_date': to_date, 
        'process_class':process_class
        }
   })
    // } else {
    //     toastr.error('Please make sure unique Submodule,classification,Product Class and Product Origin is selected to preview and export Detailed Report ', 'Failure Response');
    //     }
    ;


          //disable filters
    var spreadsheetGrid=btn.down('grid'),
    storeGrid = spreadsheetGrid.getStore();
    var t=spreadsheetGrid.down('headercontainer').getGridColumns();

    for (var i = t.length - 1; i >= 2; i--) {
        column=t[i];
        if(column.down('textfield')){
            var textfield=column.down('textfield');

            textfield.disable(true);
        }
                      
        storeGrid.removeFilter(column.filter.property || column.dataIndex);
                   
    }
    },
    exportPromotionAdvertisementDetailedReport: function (btn) {
     var filter_array='';
     var name=btn.name,
     xPrintFunc=btn.xPrintFunc,
     xFileName=btn.xFileName;

     var elem = btn.up('form'),
     grid=elem.down(btn.xspreadsheet),
     sub_module_id = elem.down('textfield[name=sub_module_id]').getValue(),
     to_date = elem.down('datefield[name=to_date]').getValue(),
     from_date = elem.down('datefield[name=from_date]').getValue(),
     filterfield = grid.getPlugin('filterfield')


        if(btn.module=="promotionadvertisement"){
            var advertisement_type_id = elem.down('textfield[name=advertisement_type_id]').getValue(),
             process_class = elem.down('textfield[name=process_class]').getValue();
         
            }

       
                 
        if(name=='filtered'){
        //filters
            var filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
        }

        var header=Ext.pluck(grid.query('gridcolumn:not([hidden])'), 'name');
        var header2=[];
        var x=0;
        for (var i = 0; i <= header.length; i++) {
        header2[x]= header[i];
        x++;
        }
                 
        var header=header2;
            
        filter_array = Ext.JSON.encode(filter_array);
            
        Ext.Ajax.request({
            url: 'newreports/exportDetailedReport',
            method: 'GET',
            headers: {
                'Authorization':'Bearer '+access_token
            },
            params : {

                'header':JSON.stringify(header),
                'sub_module_id': sub_module_id,
                'advertisement_type_id':advertisement_type_id,
                'from_date': from_date,
                'to_date': to_date, 
                'filter': JSON.stringify(filter_array),
                'function': xPrintFunc,
                'filename': xFileName,
                'process_class':process_class,
                'headingText':btn.xheading,
                                
            },
                      
            success: function (response, textStatus, request) {
                Ext.getBody().unmask();
                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);

                a.click();
                     
                 a.remove();
      
            },
            failure: function(conn, response, options, eOpts) {
                //Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
                 }
            });
                  
            

     },
     printPromotionAdvertisementSummary: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#promotionadvertisementreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        advertisement_type_id = filter.down('combo[name=advertisement_type_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        tab=Ext.ComponentQuery.query('#promotionadvertisementtabpnl')[0]; 
        activeTab = tab.getActiveTab()
        console.log(activeTab);
        index = tab.items.indexOf(activeTab);
         //hidden value
       

        frm = filter.getForm();
        if (frm.isValid()) {

        if(index == 0){
           print_report('newreports/printPromotionAdvertisementSummaryReport?sub_module_id='+sub_module_id+'&advertisement_type_id='+advertisement_type_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
        else{
           print_report('newreports/printPromotionAdvertisementSummaryReport?sub_module_id='+sub_module_id+'&advertisement_type_id='+advertisement_type_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
       }
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
     },
 exportPromotionAdvertisementSummaryReport: function(btn) {
    var panel=btn.up('panel'),
    filter=Ext.ComponentQuery.query('#promotionadvertisementreportfiltersfrm')[0]; 
    sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
    advertisement_type_id = filter.down('combo[name=advertisement_type_id]').getValue(),
    from_date = filter.down('datefield[name=from_date]').getValue(),
    to_date = filter.down('textfield[name=to_date]').getValue();
    from_date = Ext.Date.format(from_date,'Y-m-d');   
    to_date = Ext.Date.format(to_date,'Y-m-d'); 
    module_id=filter.down('hiddenfield[name=module_id]').getValue();
    tab=Ext.ComponentQuery.query('#promotionadvertisementtabpnl')[0]; 
    activeTab = tab.getActiveTab(),
    index = tab.items.indexOf(activeTab);
         //hidden value
    
    frm = filter.getForm();
     if (frm.isValid()) {
    Ext.getBody().mask('Exporting...Please wait...');
            
    Ext.Ajax.request({
        url: 'newreports/promotionAdvertisementSummaryReportExport',
        method: 'GET',
        headers: {
             'Authorization':'Bearer '+access_token
                 },
        params : {
            'sub_module_id':sub_module_id,
            'advertisement_type_id':advertisement_type_id,
            'module_id': module_id,
            'from_date': from_date,
            'to_date': to_date
            
             },
                      
        success: function (response, textStatus, request) {
            Ext.getBody().unmask();

            var t = JSON.parse(response.responseText);
            var a = document.createElement("a");
            a.href = t.file; 
            a.download = t.name;
            document.body.appendChild(a);

            a.click();
                     
            a.remove();
      
        },
        failure: function(conn, response, options, eOpts) {
            Ext.getBody().unmask();
            Ext.Msg.alert('Error', 'please try again');
        }
       });
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    },

    loadDisposalReportFilters: function (btn) {
       var grid = btn.up('form'),
        sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
        //section_id = grid.down('combo[name=section_id]').getValue(),
        from_date = grid.down('datefield[name=from_date]').getValue(),
        to_date = grid.down('datefield[name=to_date]').getValue(),
        panel = grid.up('panel'),
        tabs = panel.down('disposaltabpnl'),
        gridStr = tabs.down('disposaltabularrepresentationgrid').getStore(),

        graphStr = tabs.down('cartesian').getStore();
        module_id=panel.down('hiddenfield[name=module_id]').getValue();

        gridStr.removeAll();
        gridStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
               // section_id:section_id,
                from_date: from_date,
                to_date: to_date

                },
                  
            });

         
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                //section_id:section_id,
                from_date: from_date,
                to_date: to_date
                },
                  
            });
               
    },
     reloadDisposalCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        tabs = chart.up('disposaltabpnl'),
        panelmain=tabs.up('panel'),
        form=panelmain.down('form'),
        sub_module_id = form.down('combo[name=sub_module_id]').getValue(),
        //section_id = form.down('combo[name=section_id]').getValue()
        from_date = form.down('datefield[name=from_date]').getValue(),
        to_date = form.down('datefield[name=to_date]').getValue(),
        panel = chart.up('panel'),
        tabs = panel.down('disposaltabpnl'),
        graphStr = chart.down('cartesian').getStore();  

        module_id=panelmain.down('hiddenfield[name=module_id]').getValue();
        frm = form.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                //section_id:section_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },
    expDisposalWinShow: function(item) {
    var me = this,
    childXtype = item.childXtype,
    winTitle=item.winTitle,
    winWidth=item.winWidth,
    child = Ext.widget(childXtype);
    
            
    var grid = item.up('panel');
    var elem = item.up('form');
     var panel=item.up('panel'),
    filter=panel.down('form'),
    frm = filter.getForm();
    var comb=grid.down('combo[name=classification_process]').getValue();
    if (comb!= null){
     if (frm.isValid()) {
    child.down('textfield[name=from_date]').setValue(grid.down('datefield[name=from_date]').getValue());
    child.down('datefield[name=to_date]').setValue(grid.down('datefield[name=to_date]').getValue());
    child.down('textfield[name=sub_module_id]').setValue(grid.down('combo[name=sub_module_id]').getValue());
    child.down('textfield[name=grid]').setValue(item.xspreadsheet);
    child.down('textfield[name=process_class]').setValue(grid.down('combo[name=classification_process]').getValue());
    
    // if(item.module=='disposalWin'){
    //     child.down('textfield[name=section_id]').setValue(grid.down('combo[name=section_id]').getValue());

    // }

    var dPrint=child.down('button[name=detailed]');
    dPrint.xFileName=item.xFileName;
    dPrint.xPrintFunc=item.xPrintFunc;
    dPrint.xspreadsheet=item.xspreadsheet;
    dPrint.xheading=item.xheading;
     
    var center = Ext.create({
        xtype: item.xspreadsheet,
        region: 'center',
        bbar: [{
             beforeLoad: function() {
                    var grid=this.up('grid'),
                    form=grid.up('form'),
                                
                        sub_module_id = form.down('textfield[name=sub_module_id]').getValue(),  
                        from_date = form.down('datefield[name=from_date]').getValue(),
                        //section_id = form.down('textfield[name=section_id]').getValue(),
                        to_date = form.down('datefield[name=to_date]').getValue(),
                        process_class = form.down('textfield[name=process_class]').getValue(); 
                   

                    store.getProxy().extraParams = {
                        'sub_module_id': sub_module_id,
                        'from_date': from_date,
                        'to_date': to_date, 
                        'process_class':process_class
                       
                        }
                            
                    }, 
            xtype: 'pagingtoolbar',
                    width: '90%',
                    displayInfo: true,
                    hidden: false,
                    displayMsg: 'Showing {0} - {1} out of {2}',
                    emptyMsg: 'No Records',
                                               
        }]
    });
    var storeConfig = {
        proxy: {
             url: 'newreports/disposalDetailedReportPreview',
        reader: {
             type: 'json',
             rootProperty: 'results',
             totalProperty: 'totalResults'
         }
        }
    };
    store = Ext.create('Admin.store.abstract.AbstractStore', storeConfig);
    center.down('pagingtoolbar').setStore(store);
    center.setStore(store);

    var west = Ext.create({
        xtype: item.xvisibleColumns,
        region: 'west',
        width: 200
    });

    child.add(center);
    child.add(west);

    //hide the action column of the grid
    var x=child.down(item.xspreadsheet),
    y=x.getView().grid;
    y.columns[0].setVisible(0);


    //display window
    funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    } else {
        toastr.error('Please select Process ', 'Failure Response');
        }
    
  },
 
 loadDisposalWinStoreReload: function(btn) {
    var sub_module_id = btn.down('textfield[name=sub_module_id]').getValue(),
    from_date = btn.down('datefield[name=from_date]').getValue(),
    module_name = btn.down('textfield[name=module_name]').getValue(),
    //section_id = btn.down('textfield[name=section_id]').getValue(),
    action_url = btn.down('textfield[name=action_url]').getValue(),
    to_date = btn.down('datefield[name=to_date]').getValue();
    process_class = btn.down('textfield[name=process_class]').getValue();

     
      
    //if(section_id!=0 ||sub_module_id!=0 ||classification!=0||prodclass_category!=0||product_origin_id!=0){       
    var store = btn.down('pagingtoolbar').store;
    store.getProxy().url = 'newreports/'+action_url;
        
    store.load({params:{
        'sub_module_id': sub_module_id,
       // 'section_id': section_id,
        'from_date': from_date,
        'to_date': to_date, 
        'process_class':process_class
        }
   })
    // } else {
    //     toastr.error('Please make sure unique Submodule,classification,Product Class and Product Origin is selected to preview and export Detailed Report ', 'Failure Response');
    //     }
    ;


          //disable filters
    var spreadsheetGrid=btn.down('grid'),
    storeGrid = spreadsheetGrid.getStore();
    var t=spreadsheetGrid.down('headercontainer').getGridColumns();

    for (var i = t.length - 1; i >= 2; i--) {
        column=t[i];
        if(column.down('textfield')){
            var textfield=column.down('textfield');

            textfield.disable(true);
        }
                      
        storeGrid.removeFilter(column.filter.property || column.dataIndex);
                   
    }
    },
    exportDisposalDetailedReport: function (btn) {
     var filter_array='';
     var name=btn.name,
     xPrintFunc=btn.xPrintFunc,
     xFileName=btn.xFileName;

     var elem = btn.up('form'),
     grid=elem.down(btn.xspreadsheet),
     sub_module_id = elem.down('textfield[name=sub_module_id]').getValue(),
     to_date = elem.down('datefield[name=to_date]').getValue(),
     from_date = elem.down('datefield[name=from_date]').getValue(),
     filterfield = grid.getPlugin('filterfield')


        if(btn.module=="disposal"){
            var process_class = elem.down('textfield[name=process_class]').getValue();
         
            }

       
                 
        if(name=='filtered'){
        //filters
            var filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
        }

        var header=Ext.pluck(grid.query('gridcolumn:not([hidden])'), 'name');
        var header2=[];
        var x=0;
        for (var i = 0; i <= header.length; i++) {
        header2[x]= header[i];
        x++;
        }
                 
        var header=header2;
            
        filter_array = Ext.JSON.encode(filter_array);
            
        Ext.Ajax.request({
            url: 'newreports/exportDetailedReport',
            method: 'GET',
            headers: {
                'Authorization':'Bearer '+access_token
            },
            params : {

                'header':JSON.stringify(header),
                'sub_module_id': sub_module_id,
                //'section_id':section_id,
                'from_date': from_date,
                'to_date': to_date, 
                'filter': JSON.stringify(filter_array),
                'function': xPrintFunc,
                'filename': xFileName,
                'process_class':process_class,
                'headingText':btn.xheading,
                                
            },
                      
            success: function (response, textStatus, request) {
                Ext.getBody().unmask();
                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);

                a.click();
                     
                 a.remove();
      
            },
            failure: function(conn, response, options, eOpts) {
                //Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
                 }
            });
                  
            

     },
     printDisposalSummary: function(btn) {
        var panel=btn.up('panel'),
        filter=panel.down('form'),
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        //section_id = filter.down('combo[name=section_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        var tab = panel.down('disposaltabpnl'),
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
         //hidden value
        module_id=panel.down('hiddenfield[name=module_id]').getValue();

        frm = filter.getForm();
        if (frm.isValid()) {

        if(index == 0){
           print_report('newreports/printDisposalSummaryReport?sub_module_id='+sub_module_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
        else{
           print_report('newreports/printDisposalSummaryReport?sub_module_id='+sub_module_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
       }
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
     },
     exportDisposalSummaryReport: function(btn) {
    var panel=btn.up('panel'),
    filter=panel.down('form'),
    sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
    //section_id = filter.down('combo[name=section_id]').getValue(),
    from_date = filter.down('datefield[name=from_date]').getValue(),
    to_date = filter.down('textfield[name=to_date]').getValue();
    from_date = Ext.Date.format(from_date,'Y-m-d');   
    to_date = Ext.Date.format(to_date,'Y-m-d'); 
    var tab = panel.down('disposaltabpnl'),
    activeTab = tab.getActiveTab(),
    index = tab.items.indexOf(activeTab);
         //hidden value
    module_id=panel.down('hiddenfield[name=module_id]').getValue();
    frm = filter.getForm();
     if (frm.isValid()) {
    Ext.getBody().mask('Exporting...Please wait...');
            
    Ext.Ajax.request({
        url: 'newreports/disposalSummaryReportExport',
        method: 'GET',
        headers: {
             'Authorization':'Bearer '+access_token
                 },
        params : {
            'sub_module_id':sub_module_id,
            //'section_id':section_id,
            'module_id': module_id,
            'from_date': from_date,
            'to_date': to_date
            
             },
                      
        success: function (response, textStatus, request) {
            Ext.getBody().unmask();

            var t = JSON.parse(response.responseText);
            var a = document.createElement("a");
            a.href = t.file; 
            a.download = t.name;
            document.body.appendChild(a);

            a.click();
                     
            a.remove();
      
        },
        failure: function(conn, response, options, eOpts) {
            Ext.getBody().unmask();
            Ext.Msg.alert('Error', 'please try again');
        }
       });
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    },
     reloadImportPermitCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        tabs = chart.up('importpermittabpnl'),
        panelmain=tabs.up('panel'),
        form=panelmain.down('form'),
        sub_module_id = form.down('combo[name=sub_module_id]').getValue(),
        permit_type = form.down('combo[name=permit_type]').getValue(),
        from_date = form.down('datefield[name=from_date]').getValue(),
        to_date = form.down('datefield[name=to_date]').getValue(),
        panel = chart.up('panel'),
        tabs = panel.down('importpermittabpnl'),
        graphStr = chart.down('cartesian').getStore();  

        module_id=panelmain.down('hiddenfield[name=module_id]').getValue();
        frm = form.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                permit_type: permit_type,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },
    reloadApprovalCertificateCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        tabs = chart.up('approvalcertificatetabpnl'),
        panelmain=tabs.up('panel'),
        form=panelmain.down('form'),
        sub_module_id = form.down('combo[name=sub_module_id]').getValue(),
        from_date = form.down('datefield[name=from_date]').getValue(),
        to_date = form.down('datefield[name=to_date]').getValue(),
        panel = chart.up('panel'),
        tabs = panel.down('approvalcertificatetabpnl'),
        graphStr = chart.down('cartesian').getStore();  

        module_id=panelmain.down('hiddenfield[name=module_id]').getValue();
        frm = form.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },
    reloadLocalSupplyCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        tabs = chart.up('localsupplytabpnl'),
        panelmain=tabs.up('panel'),
        form=panelmain.down('form'),
        sub_module_id = form.down('combo[name=sub_module_id]').getValue(),
        from_date = form.down('datefield[name=from_date]').getValue(),
        to_date = form.down('datefield[name=to_date]').getValue(),
        panel = chart.up('panel'),
        tabs = panel.down('localsupplytabpnl'),
        graphStr = chart.down('cartesian').getStore();  

        module_id=panelmain.down('hiddenfield[name=module_id]').getValue();
        frm = form.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date
                

                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },
    printLocalSupplySummary: function(btn) {
        var panel=btn.up('panel'),
        filter=panel.down('form'),
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        var tab = panel.down('localsupplytabpnl'),
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
         //hidden value
        module_id=panel.down('hiddenfield[name=module_id]').getValue();

        frm = filter.getForm();
        if (frm.isValid()) {

        if(index == 0){
           print_report('newreports/printCertificateOrderSummaryReport?sub_module_id='+sub_module_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
        else{
           print_report('newreports/printCertificateOrderSummaryReport?sub_module_id='+sub_module_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
       }
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
     },
  exportLocalSupplySummaryReport: function(btn) {
        var panel=btn.up('panel'),
        filter=panel.down('form'),
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        var tab = panel.down('localsupplytabpnl'),
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
             //hidden value
        module_id=panel.down('hiddenfield[name=module_id]').getValue();
        frm = filter.getForm();
         if (frm.isValid()) {
        Ext.getBody().mask('Exporting...Please wait...');
                
        Ext.Ajax.request({
            url: 'newreports/certificateOrderSummaryReportExport',
            method: 'GET',
            headers: {
                 'Authorization':'Bearer '+access_token
                     },
            params : {
                'sub_module_id':sub_module_id,
                //'section_id':section_id,
                'module_id': module_id,
                'from_date': from_date,
                'to_date': to_date
                
                 },
                          
            success: function (response, textStatus, request) {
                Ext.getBody().unmask();

                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);

                a.click();
                         
                a.remove();
          
            },
            failure: function(conn, response, options, eOpts) {
                Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
            }
           });
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
        },
    printApprovalCertificateSummary: function(btn) {
        var panel=btn.up('panel'),
        filter=panel.down('form'),
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        var tab = panel.down('approvalcertificatetabpnl'),
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
         //hidden value
        module_id=panel.down('hiddenfield[name=module_id]').getValue();

        frm = filter.getForm();
        if (frm.isValid()) {

        if(index == 0){
           print_report('newreports/printCertificateOrderSummaryReport?sub_module_id='+sub_module_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
        else{
            print_report('newreports/printCertificateOrderSummaryReport?sub_module_id='+sub_module_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
       }
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
     },
  exportApprovalCertificateSummaryReport: function(btn) {
        var panel=btn.up('panel'),
        filter=panel.down('form'),
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        var tab = panel.down('approvalcertificatetabpnl'),
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
             //hidden value
        module_id=panel.down('hiddenfield[name=module_id]').getValue();
        frm = filter.getForm();
         if (frm.isValid()) {
        Ext.getBody().mask('Exporting...Please wait...');
                
        Ext.Ajax.request({
            url: 'newreports/certificateOrderSummaryReportExport',
            method: 'GET',
            headers: {
                 'Authorization':'Bearer '+access_token
                     },
            params : {
                'sub_module_id':sub_module_id,
                'module_id': module_id,
                'from_date': from_date,
                'to_date': to_date
                
                 },
                          
            success: function (response, textStatus, request) {
                Ext.getBody().unmask();

                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);

                a.click();
                         
                a.remove();
          
            },
            failure: function(conn, response, options, eOpts) {
                Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
            }
           });
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
        },
    printImportPermitSummary: function(btn) {
        var panel=btn.up('panel'),
        filter=panel.down('form'),
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        permit_type = filter.down('combo[name=permit_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        tab=Ext.ComponentQuery.query('#importpermittabpnl')[0];
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
         //hidden value
        module_id=panel.down('hiddenfield[name=module_id]').getValue();

        frm = filter.getForm();
        if (frm.isValid()) {

        if(index == 0){
           print_report('newreports/printControlledDrugsImportPermitSummaryReport?sub_module_id='+sub_module_id+'&to_date='+to_date+'&from_date='+from_date+'&permit_type='+permit_type+'&module_id='+module_id);
        }
        else{
            print_report('newreports/printControlledDrugsImportPermitSummaryReport?sub_module_id='+sub_module_id+'&to_date='+to_date+'&from_date='+from_date+'&permit_type='+permit_type+'&module_id='+module_id);
       }
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
     },
  exportImportPermitSummaryReport: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#importexportreportfiltersfrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        permit_type = filter.down('combo[name=permit_type]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        tab=Ext.ComponentQuery.query('#importpermittabpnl')[0]; 
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
             //hidden value
        frm = filter.getForm();
         if (frm.isValid()) {
        Ext.getBody().mask('Exporting...Please wait...');
                
        Ext.Ajax.request({
            url: 'newreports/controlledDrugsImportPermitSummaryReportExport',
            method: 'GET',
            headers: {
                 'Authorization':'Bearer '+access_token
                     },
            params : {
                'sub_module_id':sub_module_id,
                'permit_type':permit_type,
                'module_id': module_id,
                'from_date': from_date,
                'to_date': to_date
                
                 },
                          
            success: function (response, textStatus, request) {
                Ext.getBody().unmask();

                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);

                a.click();
                         
                a.remove();
          
            },
            failure: function(conn, response, options, eOpts) {
                Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
            }
           });
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
        },
    func_ExpControlledDrugsWinShow: function(item) {
    var me = this,
    childXtype = item.childXtype,
    winTitle=item.winTitle,
    winWidth=item.winWidth,
    child = Ext.widget(childXtype);
    
            
    var grid = item.up('panel');
    var elem = item.up('form');
     var panel=item.up('panel'),
    filter=panel.down('form'),
    frm = filter.getForm();
    var comb=grid.down('combo[name=classification_process]').getValue();
    if (comb!= null){
     if (frm.isValid()) {
    child.down('textfield[name=from_date]').setValue(grid.down('datefield[name=from_date]').getValue());
    child.down('datefield[name=to_date]').setValue(grid.down('datefield[name=to_date]').getValue());
    child.down('textfield[name=sub_module_id]').setValue(grid.down('combo[name=sub_module_id]').getValue());
    child.down('textfield[name=grid]').setValue(item.xspreadsheet);
    child.down('textfield[name=process_class]').setValue(grid.down('combo[name=classification_process]').getValue());
       
    var dPrint=child.down('button[name=detailed]');
    dPrint.xFileName=item.xFileName;
    dPrint.xPrintFunc=item.xPrintFunc;
    dPrint.xspreadsheet=item.xspreadsheet;
    dPrint.xheading=item.xheading;
     
    var center = Ext.create({
        xtype: item.xspreadsheet,
        region: 'center',
        bbar: [{
             beforeLoad: function() {
                    var grid=this.up('grid'),
                    form=grid.up('form'),
                                
                        sub_module_id = form.down('textfield[name=sub_module_id]').getValue(),  
                        from_date = form.down('datefield[name=from_date]').getValue(),
                        to_date = form.down('datefield[name=to_date]').getValue(),
                        process_class = form.down('textfield[name=process_class]').getValue(); 
                   
                    store.getProxy().extraParams = {
                        'sub_module_id': sub_module_id,
                        'from_date': from_date,
                        'to_date': to_date, 
                        'process_class':process_class
                       
                        }
                            
                    }, 
            xtype: 'pagingtoolbar',
                    width: '90%',
                    displayInfo: true,
                    hidden: false,
                    displayMsg: 'Showing {0} - {1} out of {2}',
                    emptyMsg: 'No Records',
                                               
        }]
    });
    var storeConfig = {
        proxy: {
             url: 'newreports/controlledDDetailedReportPreview',
        reader: {
             type: 'json',
             rootProperty: 'results',
             totalProperty: 'totalResults'
            }
        }
    };
    store = Ext.create('Admin.store.abstract.AbstractStore', storeConfig);
    center.down('pagingtoolbar').setStore(store);
    center.setStore(store);

    var west = Ext.create({
        xtype: item.xvisibleColumns,
        region: 'west',
        width: 200
    });

    child.add(center);
    child.add(west);

    //hide the action column of the grid
    var x=child.down(item.xspreadsheet),
    y=x.getView().grid;
    y.columns[0].setVisible(0);


    //display window
    funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    } else {
        toastr.error('Please select Filters Process', 'Failure Response');
        }
    
  },
 fun_loadCertificateOrderWinStoreReload: function(btn) {
    var sub_module_id = btn.down('textfield[name=sub_module_id]').getValue(),
    from_date = btn.down('datefield[name=from_date]').getValue(),
    module_name = btn.down('textfield[name=module_name]').getValue(),
    action_url = btn.down('textfield[name=action_url]').getValue(),
    to_date = btn.down('datefield[name=to_date]').getValue();

          
     if(module_name=="controlleddrugs"){
        permit_type = btn.down('textfield[name=permit_type]').getValue();
        process_class = btn.down('textfield[name=process_class]').getValue();
    }
            
    //if(permit_type!=0 && sub_module_id!=0){   
    var store = btn.down('pagingtoolbar').store;
    store.getProxy().url = 'newreports/'+action_url;
        
    store.load({params:{
        'permit_type': permit_type,
        'sub_module_id': sub_module_id,
        'from_date': from_date,
        'to_date': to_date, 
        'process_class':process_class
        }

   })
    // } else {
    //     toastr.error('Please make sure one of the Submodules and Permit type is selected ', 'Failure Response');
    //     }
  ;


          //disable filters
    var spreadsheetGrid=btn.down('grid'),
    storeGrid = spreadsheetGrid.getStore();
    var t=spreadsheetGrid.down('headercontainer').getGridColumns();

    for (var i = t.length - 1; i >= 2; i--) {
        column=t[i];
        if(column.down('textfield')){
            var textfield=column.down('textfield');

            textfield.disable(true);
        }
                      
        storeGrid.removeFilter(column.filter.property || column.dataIndex);
                   
    }
  },

  func_ExpImportPermitWinShow: function(item) {
    var me = this,
    childXtype = item.childXtype,
    winTitle=item.winTitle,
    winWidth=item.winWidth,
    child = Ext.widget(childXtype);
    
            
    var grid = item.up('panel');
    var elem = item.up('form');
     var panel=item.up('panel'),
    filter=panel.down('form'),
    frm = filter.getForm();
    var comb=grid.down('combo[name=classification_process]').getValue();
    if (comb!= null){
     if (frm.isValid()) {
    child.down('textfield[name=from_date]').setValue(grid.down('datefield[name=from_date]').getValue());
    child.down('datefield[name=to_date]').setValue(grid.down('datefield[name=to_date]').getValue());
    child.down('textfield[name=sub_module_id]').setValue(grid.down('combo[name=sub_module_id]').getValue());
    child.down('textfield[name=grid]').setValue(item.xspreadsheet);
    child.down('textfield[name=process_class]').setValue(grid.down('combo[name=classification_process]').getValue());
           
`   `
    if(item.module=='importpermitWin'){
        child.down('textfield[name=permit_type]').setValue(grid.down('combo[name=permit_type]').getValue());

    }
          
    var dPrint=child.down('button[name=detailed]');
    dPrint.xFileName=item.xFileName;
    dPrint.xPrintFunc=item.xPrintFunc;
    dPrint.xspreadsheet=item.xspreadsheet;
    dPrint.xheading=item.xheading;
     
    var center = Ext.create({
        xtype: item.xspreadsheet,
        region: 'center',
        bbar: [{
             beforeLoad: function() {
                    var grid=this.up('grid'),
                    form=grid.up('form'),
                                
                        permit_type = form.down('textfield[name=permit_type]').getValue(), 
                        sub_module_id = form.down('textfield[name=sub_module_id]').getValue(),  
                        from_date = form.down('datefield[name=from_date]').getValue(),
                        to_date = form.down('datefield[name=to_date]').getValue(),
                        process_class = form.down('textfield[name=process_class]').getValue(); 
                   
                    store.getProxy().extraParams = {
                        'permit_type': permit_type,
                        'sub_module_id': sub_module_id,
                        'from_date': from_date,
                        'to_date': to_date, 
                        'process_class':process_class
                       
                        }
                            
                    }, 
            xtype: 'pagingtoolbar',
                    width: '90%',
                    displayInfo: true,
                    hidden: false,
                    displayMsg: 'Showing {0} - {1} out of {2}',
                    emptyMsg: 'No Records',
                                               
        }]
    });
    var storeConfig = {
        proxy: {
             url: 'newreports/controlledDDetailedReportPreview',
        reader: {
             type: 'json',
             rootProperty: 'results',
             totalProperty: 'totalResults'
            }
        }
    };
    store = Ext.create('Admin.store.abstract.AbstractStore', storeConfig);
    center.down('pagingtoolbar').setStore(store);
    center.setStore(store);

    var west = Ext.create({
        xtype: item.xvisibleColumns,
        region: 'west',
        width: 200
    });

    child.add(center);
    child.add(west);

    //hide the action column of the grid
    var x=child.down(item.xspreadsheet),
    y=x.getView().grid;
    y.columns[0].setVisible(0);


    //display window
    funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
    } else {
        toastr.error('Please select Filters Process', 'Failure Response');
        }
    
  },
 fun_loadExportImportExportWinStoreReload: function(btn) {
    var sub_module_id = btn.down('textfield[name=sub_module_id]').getValue(),
    from_date = btn.down('datefield[name=from_date]').getValue(),
    module_name = btn.down('textfield[name=module_name]').getValue(),
    action_url = btn.down('textfield[name=action_url]').getValue(),
    to_date = btn.down('datefield[name=to_date]').getValue();

          
     if(module_name=="importexport"){
        permit_type = btn.down('textfield[name=permit_type]').getValue();
        process_class = btn.down('textfield[name=process_class]').getValue();
    }
            
    //if(permit_type!=0 && sub_module_id!=0){   
    var store = btn.down('pagingtoolbar').store;
    store.getProxy().url = 'newreports/'+action_url;
        
    store.load({params:{
        'permit_type': permit_type,
        'sub_module_id': sub_module_id,
        'from_date': from_date,
        'to_date': to_date, 
        'process_class':process_class
        }

   })
    // } else {
    //     toastr.error('Please make sure one of the Submodules and Permit type is selected ', 'Failure Response');
    //     }
  ;


          //disable filters
    var spreadsheetGrid=btn.down('grid'),
    storeGrid = spreadsheetGrid.getStore();
    var t=spreadsheetGrid.down('headercontainer').getGridColumns();

    for (var i = t.length - 1; i >= 2; i--) {
        column=t[i];
        if(column.down('textfield')){
            var textfield=column.down('textfield');

            textfield.disable(true);
        }
                      
        storeGrid.removeFilter(column.filter.property || column.dataIndex);
                   
    }
  },


    loadadditionalinfo: function() {
        console.log('all is well');
        },
    func_showhideSpreasheetColumn: function (chk, value) {
         var  chk_name = chk.name;
         var name=chk.up('form'),
         con=name.up('form'),
         grid=con.down('textfield[name=grid]').getValue();
         var grid=Ext.ComponentQuery.query(grid);
          grid[0].columns[chk_name].setVisible(value);
    },    
    
    addAllToCombo:function(combo,r,e,d) {
         var store=combo.combo.getStore();
         var all={name: 'All',id:0};
         store.insert(0, all);
     },
     loadAdrReportFilters: function (btn) {
        var grid = btn.up('form'),
        filter=Ext.ComponentQuery.query('#adrReportFilterFrm')[0]; 
         sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
         adr_type_id = filter.down('combo[name=adr_type_id]').getValue(),
         from_date = filter.down('datefield[name=from_date]').getValue(),
         to_date = filter.down('datefield[name=to_date]').getValue(),
         module_id=filter.down('hiddenfield[name=module_id]').getValue();
         adrtabularrepresentationgrid=Ext.ComponentQuery.query('#adrtabularrepresentationgrid')[0];
         gridStr = adrtabularrepresentationgrid.getStore(),
         adrcartesian=Ext.ComponentQuery.query('#adrcartesian')[0]; 
         graphStr = adrcartesian.getStore();

         gridStr.removeAll();
         gridStr.load({
             params:{
                 sub_module_id:sub_module_id,
                 module_id: module_id,
                 adr_type_id:adr_type_id,
                 from_date: from_date,
                 to_date: to_date
 
                 },
                   
             });
         graphStr.removeAll();
         graphStr.load({
             params:{
                 sub_module_id:sub_module_id,
                 module_id: module_id,
                 adr_type_id:adr_type_id,
                 from_date: from_date,
                 to_date: to_date
                 },
                   
             });
                
     },
     reloadAdrCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        filter=Ext.ComponentQuery.query('#adrReportFilterFrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        adr_type_id = filter.down('combo[name=adr_type_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        adrcartesian=Ext.ComponentQuery.query('#adrcartesian')[0]; 
        graphStr = adrcartesian.getStore();  
        frm = filter.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                adr_type_id: adr_type_id,
                from_date: from_date,
                to_date: to_date,
                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },
    loadMirReportFilters: function (btn) {
        var grid = btn.up('form'),
        filter=Ext.ComponentQuery.query('#mirReportFilterFrm')[0]; 
         sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
         request_mode_id = filter.down('combo[name=request_mode_id]').getValue(),
         from_date = filter.down('datefield[name=from_date]').getValue(),
         to_date = filter.down('datefield[name=to_date]').getValue(),
         module_id=filter.down('hiddenfield[name=module_id]').getValue();
         mirtabularrepresentationgrid=Ext.ComponentQuery.query('#mirtabularrepresentationgrid')[0];
         gridStr = mirtabularrepresentationgrid.getStore(),
         mircartesian=Ext.ComponentQuery.query('#mircartesian')[0]; 
         graphStr = mircartesian.getStore();

         gridStr.removeAll();
         gridStr.load({
             params:{
                 sub_module_id:sub_module_id,
                 module_id: module_id,
                 request_mode_id:request_mode_id,
                 from_date: from_date,
                 to_date: to_date
 
                 },
                   
             });
         graphStr.removeAll();
         graphStr.load({
             params:{
                 sub_module_id:sub_module_id,
                 module_id: module_id,
                 request_mode_id:request_mode_id,
                 from_date: from_date,
                 to_date: to_date
                 },
                   
             });
                
     },
     reloadMirCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        filter=Ext.ComponentQuery.query('#mirReportFilterFrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        request_mode_id = filter.down('combo[name=request_mode_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        mircartesian=Ext.ComponentQuery.query('#mircartesian')[0]; 
        graphStr = mircartesian.getStore();  
        frm = filter.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                request_mode_id: request_mode_id,
                from_date: from_date,
                to_date: to_date,
                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },

    loadEnforcementReportFilters: function (btn) {
        var grid = btn.up('form'),
        filter=Ext.ComponentQuery.query('#enforcementReportFilterFrm')[0]; 
         sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
         from_date = filter.down('datefield[name=from_date]').getValue(),
         to_date = filter.down('datefield[name=to_date]').getValue(),
         module_id=filter.down('hiddenfield[name=module_id]').getValue();
         enforcementtabularrepresentationgrid=Ext.ComponentQuery.query('#enforcementtabularrepresentationgrid')[0];
         gridStr = enforcementtabularrepresentationgrid.getStore(),
         enforcementcartesian=Ext.ComponentQuery.query('#enforcementcartesian')[0]; 
         graphStr = enforcementcartesian.getStore();
         gridStr.removeAll();
         gridStr.load({
             params:{
                 sub_module_id:sub_module_id,
                 module_id: module_id,
                 from_date: from_date,
                 to_date: to_date
 
                 },
                   
             });
         graphStr.removeAll();
         graphStr.load({
             params:{
                 sub_module_id:sub_module_id,
                 module_id: module_id,
                 from_date: from_date,
                 to_date: to_date
                 },
                   
             });
                
     },
     reloadEnforcementCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        filter=Ext.ComponentQuery.query('#enforcementReportFilterFrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        enforcementcartesian=Ext.ComponentQuery.query('#enforcementcartesian')[0]; 
        graphStr = enforcementcartesian.getStore();  
        frm = filter.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                from_date: from_date,
                to_date: to_date,
                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },
    loadSurveillanceReportFilters: function (btn) {
        var grid = btn.up('form'),
        filter=Ext.ComponentQuery.query('#surveillanceReportFilterFrm')[0]; 
         sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
         program_id = filter.down('combo[name=program_id]').getValue(),
         from_date = filter.down('datefield[name=from_date]').getValue(),
         to_date = filter.down('datefield[name=to_date]').getValue(),
         module_id=filter.down('hiddenfield[name=module_id]').getValue();
         surveillancetabularrepresentationGrid=Ext.ComponentQuery.query('#surveillancetabularrepresentationGrid')[0];
         gridStr = surveillancetabularrepresentationGrid.getStore(),
         surveillancecartesian=Ext.ComponentQuery.query('#surveillancecartesian')[0]; 
         graphStr = surveillancecartesian.getStore();
         gridStr.removeAll();
         gridStr.load({
             params:{
                 sub_module_id:sub_module_id,
                 module_id: module_id,
                 program_id:program_id,
                 from_date: from_date,
                 to_date: to_date
 
                 },
                   
             });
         graphStr.removeAll();
         graphStr.load({
             params:{
                 sub_module_id:sub_module_id,
                 module_id: module_id,
                 program_id:program_id,
                 from_date: from_date,
                 to_date: to_date
                 },
                   
             });
                
     },
     expSurveillanceWinShow: function(item) {
        var me = this,
        childXtype = item.childXtype,
        winTitle=item.winTitle,
        winWidth=item.winWidth,
        child = Ext.widget(childXtype);
        var grid = item.up('panel');
        var elem = item.up('form');
        var panel=item.up('panel'),
        //filter=panel.down('form'),
        filter=Ext.ComponentQuery.query('#surveillanceReportFilterFrm')[0]; 
        console.log(filter);
        comb_class=Ext.ComponentQuery.query('#classification_process')[0];
        frm = filter.getForm();
      //  var comb=grid.down('combo[name=classification_process]').getValue();
        var comb=comb_class.getValue();
        var program_id = filter.down('combo[name=program_id]').getValue();
        if (comb!= null){
         if (frm.isValid()) {
        child.down('textfield[name=from_date]').setValue(filter.down('datefield[name=from_date]').getValue());
        child.down('datefield[name=to_date]').setValue(filter.down('datefield[name=to_date]').getValue());
        child.down('textfield[name=sub_module_id]').setValue(filter.down('combo[name=sub_module_id]').getValue());
        child.down('textfield[name=grid]').setValue(item.xspreadsheet);
        child.down('textfield[name=process_class]').setValue(comb);
        
        if(item.module=='surveillanceWin'){
            child.down('textfield[name=program_id]').setValue(program_id);
    
        }
    
        var dPrint=child.down('button[name=detailed]');
        dPrint.xFileName=item.xFileName;
        dPrint.xPrintFunc=item.xPrintFunc;
        dPrint.xspreadsheet=item.xspreadsheet;
        dPrint.xheading=item.xheading;
         
        var center = Ext.create({
            xtype: item.xspreadsheet,
            region: 'center',
            bbar: [{
                 beforeLoad: function() {
                        var grid=this.up('grid'),
                        form=grid.up('form'),
                                    
                            sub_module_id = form.down('textfield[name=sub_module_id]').getValue(),  
                            from_date = form.down('datefield[name=from_date]').getValue(),
                            program_id = form.down('textfield[name=program_id]').getValue(),
                            to_date = form.down('datefield[name=to_date]').getValue(),
                            process_class = form.down('textfield[name=process_class]').getValue(); 
                       
    
                        store.getProxy().extraParams = {
                            'sub_module_id': sub_module_id,
                            'from_date': from_date,
                            'program_id':program_id,
                            'to_date': to_date, 
                            'process_class':process_class
                           
                            }
                                
                        }, 
                xtype: 'pagingtoolbar',
                        width: '90%',
                        displayInfo: true,
                        hidden: false,
                        displayMsg: 'Showing {0} - {1} out of {2}',
                        emptyMsg: 'No Records',
                                                   
            }]
        });
        var storeConfig = {
            proxy: {
                 url: 'newreports/promotionAdvertisementDetailedReportPreview',
            reader: {
                 type: 'json',
                 rootProperty: 'results',
                 totalProperty: 'totalResults'
                }
            }
        };
        store = Ext.create('Admin.store.abstract.AbstractStore', storeConfig);
        center.down('pagingtoolbar').setStore(store);
        center.setStore(store);
    
        var west = Ext.create({
            xtype: item.xvisibleColumns,
            region: 'west',
            width: 200
        });
    
        child.add(center);
        child.add(west);
    
        //hide the action column of the grid
        var x=child.down(item.xspreadsheet),
        y=x.getView().grid;
        y.columns[0].setVisible(0);
    
    
        //display window
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
        } else {
            toastr.error('Please select Process', 'Failure Response');
            }
        
      },
      reloadSurveillanceCartesianFilters: function (btn) {
        var chart = btn.up('panel'), 
        filter=Ext.ComponentQuery.query('#surveillanceReportFilterFrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        program_id = filter.down('combo[name=program_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('datefield[name=to_date]').getValue(),
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        surveillancecartesian=Ext.ComponentQuery.query('#surveillancecartesian')[0]; 
        graphStr = surveillancecartesian.getStore();  
        frm = filter.getForm();
        if (frm.isValid()) {
        graphStr.removeAll();
        graphStr.load({
            params:{
                sub_module_id:sub_module_id,
                module_id: module_id,
                program_id: program_id,
                from_date: from_date,
                to_date: to_date,
                },
                  
            });
        
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
               
    },

    adrfunc_downloadgraph: function(btn, e, eOpts) {
        var panel = btn.up('panel');
        console.log(panel);
        if(panel='adrGraphicalRepresentationGraph'){
          chart=Ext.ComponentQuery.query('#adrcartesian')[0];
        }
        console.log(chart);
        FileName=btn.FileName;
            var link = document.createElement("a");
            link.setAttribute("href", chart.getImage("stream").data);
            link.setAttribute("download", FileName);
            link.click();
            link.remove();
    },
    ctfunc_downloadgraph: function(btn, e, eOpts) {
        var panel = btn.up('panel');
        console.log(panel);
        if(panel='clinicaltrialgraphicalrepresentationgraph'){
          chart=Ext.ComponentQuery.query('#clinicalTrialcartesian')[0];
        }
        console.log(chart);
        FileName=btn.FileName;
            var link = document.createElement("a");
            link.setAttribute("href", chart.getImage("stream").data);
            link.setAttribute("download", FileName);
            link.click();
            link.remove();
    },
    enforcementfunc_downloadgraph: function(btn, e, eOpts) {
        var panel = btn.up('panel');
        console.log(panel);
        if(panel='enforcementGraphicalRepresentation'){
          chart=Ext.ComponentQuery.query('#enforcementcartesian')[0];
        }
        console.log(chart);
        FileName=btn.FileName;
            var link = document.createElement("a");
            link.setAttribute("href", chart.getImage("stream").data);
            link.setAttribute("download", FileName);
            link.click();
            link.remove();
    },
    gmpfunc_downloadgraph: function(btn, e, eOpts) {
        var panel = btn.up('panel');
        console.log(panel);
        if(panel='gmpgraphicalrepresentationgraph'){
          chart=Ext.ComponentQuery.query('#gmpcartesian')[0];
        }
        console.log(chart);
        FileName=btn.FileName;
            var link = document.createElement("a");
            link.setAttribute("href", chart.getImage("stream").data);
            link.setAttribute("download", FileName);
            link.click();
            link.remove();
    }, 
    importexportfunc_downloadgraph: function(btn, e, eOpts) {
        var panel = btn.up('panel');
        console.log(panel);
        if(panel='importexportgraphicalrepresentationgraph'){
          chart=Ext.ComponentQuery.query('#importexportcartesian')[0];
        }
        console.log(chart);
        FileName=btn.FileName;
            var link = document.createElement("a");
            link.setAttribute("href", chart.getImage("stream").data);
            link.setAttribute("download", FileName);
            link.click();
            link.remove();
    },
    mirfunc_downloadgraph: function(btn, e, eOpts) {
        var panel = btn.up('panel');
        console.log(panel);
        if(panel='mirGraphicalRepresentationGraph'){
          chart=Ext.ComponentQuery.query('#mircartesian')[0];
        }
        console.log(chart);
        FileName=btn.FileName;
            var link = document.createElement("a");
            link.setAttribute("href", chart.getImage("stream").data);
            link.setAttribute("download", FileName);
            link.click();
            link.remove();
    },
    productfunc_downloadgraph: function(btn, e, eOpts) {
        var panel = btn.up('panel');
        console.log(panel);
        if(panel='productgraphicalrepresentationgraph'){
          chart=Ext.ComponentQuery.query('#productcartesian')[0];
        }
        console.log(chart);
        FileName=btn.FileName;
            var link = document.createElement("a");
            link.setAttribute("href", chart.getImage("stream").data);
            link.setAttribute("download", FileName);
            link.click();
            link.remove();
    },
    promotionfunc_downloadgraph: function(btn, e, eOpts) {
        var panel = btn.up('panel');
        console.log(panel);
        if(panel='promotionadvertisementgraphicalrepresentationgraph'){
          chart=Ext.ComponentQuery.query('#promotionadvertisementcartesian')[0];
        }
        console.log(chart);
        FileName=btn.FileName;
            var link = document.createElement("a");
            link.setAttribute("href", chart.getImage("stream").data);
            link.setAttribute("download", FileName);
            link.click();
            link.remove();
    },
    surveillancefunc_downloadgraph: function(btn, e, eOpts) {
        var panel = btn.up('panel');
        console.log(panel);
        if(panel='surveillanceGraphicalRepresentationGraph'){
          chart=Ext.ComponentQuery.query('#surveillancecartesian')[0];
        }
        console.log(chart);
        FileName=btn.FileName;
            var link = document.createElement("a");
            link.setAttribute("href", chart.getImage("stream").data);
            link.setAttribute("download", FileName);
            link.click();
            link.remove();
    },
    printAdrReportSummary: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#adrReportFilterFrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        adr_type_id = filter.down('combo[name=adr_type_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        tab=Ext.ComponentQuery.query('#adrtabpnl')[0]; 
        activeTab = tab.getActiveTab()
        console.log(activeTab);
        index = tab.items.indexOf(activeTab);
         //hidden value
       

        frm = filter.getForm();
        if (frm.isValid()) {

        if(index == 0){
           print_report('newreports/printAdrReportSummary?sub_module_id='+sub_module_id+'&adr_type_id='+adr_type_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
        }
        else{
           print_report('newreports/printAdrReportSummary?sub_module_id='+sub_module_id+'&adr_type_id='+adr_type_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
       }
        } else {
        toastr.error('Please select Filters first ', 'Failure Response');
        }
     },
     exportAdrSummaryReport: function(btn) {
        var panel=btn.up('panel'),
        filter=Ext.ComponentQuery.query('#adrReportFilterFrm')[0]; 
        sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
        adr_type_id = filter.down('combo[name=adr_type_id]').getValue(),
        from_date = filter.down('datefield[name=from_date]').getValue(),
        to_date = filter.down('textfield[name=to_date]').getValue();
        from_date = Ext.Date.format(from_date,'Y-m-d');   
        to_date = Ext.Date.format(to_date,'Y-m-d'); 
        module_id=filter.down('hiddenfield[name=module_id]').getValue();
        tab=Ext.ComponentQuery.query('#adrtabpnl')[0]; 
        activeTab = tab.getActiveTab(),
        index = tab.items.indexOf(activeTab);
             //hidden value
        
        frm = filter.getForm();
         if (frm.isValid()) {
        Ext.getBody().mask('Exporting...Please wait...');
                
        Ext.Ajax.request({
            url: 'newreports/AdrSummaryReportExport',
            method: 'GET',
            headers: {
                 'Authorization':'Bearer '+access_token
                     },
            params : {
                'sub_module_id':sub_module_id,
                'adr_type_id':adr_type_id,
                'module_id': module_id,
                'from_date': from_date,
                'to_date': to_date
                
                 },
                          
            success: function (response, textStatus, request) {
                Ext.getBody().unmask();
    
                var t = JSON.parse(response.responseText);
                var a = document.createElement("a");
                a.href = t.file; 
                a.download = t.name;
                document.body.appendChild(a);
    
                a.click();
                         
                a.remove();
          
            },
            failure: function(conn, response, options, eOpts) {
                Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'please try again');
            }
           });
        } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
        },

    printPromotionAdvertisementSummary: function(btn) {
            var panel=btn.up('panel'),
            filter=Ext.ComponentQuery.query('#surveillanceReportFilterFrm')[0]; 
            sub_module_id = filter.down('combo[name=sub_module_id]').getValue(),
            program_id = filter.down('combo[name=program_id]').getValue(),
            from_date = filter.down('datefield[name=from_date]').getValue(),
            to_date = filter.down('textfield[name=to_date]').getValue();
            module_id=filter.down('hiddenfield[name=module_id]').getValue();
            from_date = Ext.Date.format(from_date,'Y-m-d');   
            to_date = Ext.Date.format(to_date,'Y-m-d'); 
            tab=Ext.ComponentQuery.query('#surveillancetabpnl')[0]; 
            activeTab = tab.getActiveTab()
            console.log(activeTab);
            index = tab.items.indexOf(activeTab);
             //hidden value
           
            frm = filter.getForm();
            if (frm.isValid()) {
    
            if(index == 0){
               print_report('newreports/printPromotionAdvertisementSummaryReport?sub_module_id='+sub_module_id+'&program_id='+program_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
            }
            else{
               print_report('newreports/printPromotionAdvertisementSummaryReport?sub_module_id='+sub_module_id+'&program_id='+program_id+'&to_date='+to_date+'&from_date='+from_date+'&module_id='+module_id);
           }
            } else {
            toastr.error('Please select Filters first ', 'Failure Response');
            }
         },

});
var premise_type_id="";
var sub_module="";
Ext.define('Admin.view.openOffice.POE.controller.SpreadSheetPoeVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.spreadSheetPoeVctr',

         reloadSheetStore: function(combo,newValue,old,eOpts) {
           var form=combo.up('form'),
                store=form.down('pagingtoolbar').getStore();
                sub_module=newValue;
                if(newValue==0){
                  sub_module="";
                }

           store.load();
         },  
         setGridStore: function (obj, options) {
          this.fireEvent('setGridStore', obj, options);
      },
          loadApplicationColumns: function(sender,record) {
            premise_type_id=record.data['id'];
               if(premise_type_id==0){
                premise_type_id='';
               }
              //load filters to other depedent stores
              var filter = {'t1.premise_type_id':premise_type_id};
              var   filters = JSON.stringify(filter);
              var form =this.lookupReference('premisegridpanel'),
               BsnTypestore=form.down('combo[name=BsnType_id]').getStore();
    
               BsnTypestore.removeAll();
               BsnTypestore.load();

               sub_module=this.getView().down('combo[name=sub_module]').getValue();
              //add filters
              var filter = {'t1.premise_type_id':premise_type_id,'t1.sub_module_id':sub_module};
              var   filters = JSON.stringify(filter);
              BsnTypestore.load({params:{filters:filters}});

            },
          loadadditionalinfo:  function(sender,record) {
              var mirid=record.data['mir_id'];
              var filter = { 't1.mir_id':mirid };
              var   filters = JSON.stringify(filter);
               Ext.data.StoreManager.lookup('spreadsheetmirmedicalinforstr').reload({params:{filters:filters}});
    
            },
          funcReloadspreadSheetStrs: function() {
            console.log('dd00');
                   Ext.data.StoreManager.lookup('spreadsheetpremiseapplicationcolumnsstr').reload();
                 }, 
          func_showhideSpreasheetColumn: function (chk, value) {
                  var  chk_name = chk.name;
                  var grid =this.lookupReference('mirgridpanel');
                  grid.columns[chk_name].setVisible(value);
            },
            
             func_exportpremisespreadsheet: function (btn) {

                 var name=btn.name;
                  var grid = this.lookupReference('mirgridpanel'),
                      premises_type_grid = this.lookupReference('spreadsheetpremisetypes'),
                      filterfield = grid.getPlugin('filterfield');
                  //filters
                     var filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
                     var  Category_id=grid.down('combo[name=Category_id]').getValue(),
                      BsnType_id=grid.down('combo[name=BsnType_id]').getValue(),
                      BsnScale_id=grid.down('combo[name=BsnScale_id]').getValue(),
                      zone_id=grid.down('combo[name=zone_id]').getValue(),
                      registration_status=grid.down('combo[name=registration_status]').getValue(),
                      validity_status=grid.down('combo[name=validity_status]').getValue(),
                      BsnCategory_id=grid.down('combo[name=BsnCategory_id]').getValue();


                    
                  //get the premises types 
                  premise_type_id = 0;
                  var sel = premises_type_grid.getSelectionModel();
                      records = sel.getSelection();
                      if(records){
                          premise_type_id = records[0].get('id');

                      }
                      var Originalfilter = {'t1.sub_module_id':sub_module,'premise_type_id':premise_type_id};
                      var filters = JSON.stringify(Originalfilter);
                   //headers
                   if(name=='summary'){
                   var header=Ext.pluck(grid.query('gridcolumn:not([hidden])'), 'name');
                   var header2=[];
                   var x=0;
                   for (var i = 1; i <= header.length; i++) {
                    header2[x]= header[i];
                     x++;
                   }
                 }else{
                  var header=Ext.pluck(grid.columns, 'name');
                  var header2=[];
                   var x=0;
                   for (var i = 2; i <= header.length; i++) {
                    header2[x]= header[i];
                     x++;
                   }
                 }
                   xheading = 'POE APPLICATIONS SPREADSHEET';
                   print_report('openoffice/exportall?header='+encodeURIComponent(JSON.stringify(header2))+'&filters='+encodeURIComponent(filters)+'&filter='+encodeURIComponent(JSON.stringify(filter_array))+'&function=getPremiseApplicationColumns&filename=PremiseProdductsSpreadsheet&headingText='+xheading+'&Category='+ Category_id+'&BsnType='+ BsnType_id+'&BsnCategory='+ BsnCategory_id+'&BsnScale_id='+ BsnScale_id+'&issueplace='+zone_id+'&registration_status='+registration_status+'&validity_status='+validity_status);
                   // var header= Ext.encode(header2);
                   // Ext.getBody().mask('Exporting Records Please wait...');
                   // filter_array = Ext.JSON.encode(filter_array);
                   //  Ext.Ajax.request({
                   //    url: 'openoffice/exportall',
                   //    method: 'POST',
                   //    params : {
                   //                'header':header,
                   //                'section_id':sectionid,
                   //                'filters':filters,
                   //                'filter':filter_array,
                   //                'Category': Category_id,
                   //                'BsnType': BsnType_id,
                   //                'BsnCategory': BsnCategory_id,
                   //                'BsnScale_id':BsnScale_id,
                   //                'issueplace':zone_id,
                   //                'headingText': 'PREMISE APPLICATIONS SPREADSHEET',
                   //                'function':'getPremiseApplicationColumns',
                   //                'filename':'PremiseProdductsSpreadsheet'
                   //  },
                      
                   //     success: function (response, textStatus, request) {
                   //      var t = JSON.parse(response.responseText);
                   //      var a = document.createElement("a");
                   //      a.href = t.file; 
                   //      a.download = t.name;
                   //      document.body.appendChild(a);

                   //      a.click();
                     
                   //      a.remove();
                   //     Ext.getBody().unmask();
      
                   //    },
                   //    failure: function(conn, response, options, eOpts) {
                   //         Ext.getBody().unmask();
                   //         Ext.Msg.alert('Error', 'please try again');
                   //    }});
        

             },
             func_clearfilters: function(btn) {
               grid = this.lookupReference('premisegridpanel');
                
                 var t=grid.down('headercontainer').getGridColumns();

                 for (var i = t.length - 1; i >= 2; i--) {
                      column=t[i];
                      var textfield=column.down('textfield');
                      var combo=column.down('combobox');

                      if(textfield!=null){
                         textfield.setValue('');
                      }else{
                          combo.setValue(0);
                      }

                      grid = column.up('grid');
                      grid.getStore().removeFilter(column.filter.property || column.dataIndex);
                     // column.setText(column.textEl.dom.firstElementChild.innerText);
                 
                   }

             },
             setPageSize: function(combo, newValue){
               var pagesize=combo.getValue();
                console.log('reser');
               Ext.apply(Ext.getStore('spreadsheetpremiseapplicationcolumnsstr'), {pageSize: pagesize});
             },
             setConfigCombosStore: function (obj, options) {
                this.fireEvent('setCompStore', obj, options);
    },
    setWorkflowCombosStore: function (obj, options) {
      this.fireEvent('setWorkflowCombosStore', obj, options);
  },
    func_viewUploadedDocs: function(btn) {
         var me = btn.up('button'),
              record = me.getWidgetRecord(),
              form = Ext.widget('uploadeddocsperapplicationGrid'),
              application_code = record.get('application_code');
              form.down('hiddenfield[name=application_code]').setValue(application_code);

              funcShowCustomizableWindow('Application Documents', '60%', form, 'customizablewindow');
      
    },
    func_checkFilters: function(btn) {
      var container=btn.up('form'),
      form = container.down('spreadsheetpremisevisiblecolumns'),
      fields=form.getForm().getFields();

      fields.each(function(checkbox){
            checkbox.setValue(btn.re);
      });
      if(btn.re){
        btn.re=false;
        btn.setText('Unselect All');
      }
      else{
        btn.re=true;
        btn.setText('Select All');
       }
    },
         

});
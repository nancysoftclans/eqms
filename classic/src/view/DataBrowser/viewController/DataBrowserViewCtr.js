Ext.define('Admin.view.DataBrowser.viewController.DataBrowserViewCtr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.databrowserVCtr',

    
    init: function(view) {
        },
    setConfigGridsStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setConfigCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
    setComboStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
    renderSpreadsheet: function(pnl) {
        var module_id = pnl.down('combo[name=module_id]').getValue(),
          
            form = pnl.down('form'),
            form_filters = JSON.stringify(form.getValues()),
            add_grid = [],
            column = [{
                        text: 'Action',
                        xtype: 'widgetcolumn',
                        width: 90,
                        widget: {
                            width: 75,
                            iconCls: 'x-fa fa-th-list',
                            textAlign: 'left',
                            xtype: 'splitbutton',
                            menu: {
                                xtype: 'menu',
                                items: [{
                                        text: 'Associated Documents',
                                        iconCls: 'x-fa fa-print',
                                        tooltip: 'Associated Documents',
                                        handler: 'func_viewUploadedDocs'
                                       }]
                              }
                            }
                         }],
            ck_boxes = [];
         Ext.getBody().mask('Please wait...');
         Ext.Ajax.request({
            url: 'summaryreport/generateSpreadsheeetviewData',
            method: 'GET',
            params: {
                module_id: module_id,
                gridCall: 0,
                form_filters: form_filters
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText);
                //generate views 
                var main_data  = resp.main_data,
                    additional_data = resp.additional_data,
                    filter_columns = resp.filter_columns,
                    length = main_data.length-1;

                    for (i = length; i >= 0 ; i--) {
                        text = main_data[i].replace('_', " ");
                        text = text.toLocaleUpperCase();
                        column.push({
                                      text: text,
                                      xtype: 'gridcolumn',
                                      dataIndex: main_data[i]+'',
                                      width: 150,
                                      hidden: true,
                                      tblCls: 'wrap',
                                      filter: {
                                          xtype: 'textfield'
                                      }
                                  });
                        ck_boxes.push({
                            boxLabel: text,//main_data[i],
                            name: length-i + 1,
                            checked: false,
                            listeners: {
                                change: 'func_showhideSpreasheetColumn'
                            }
                       })
                    }
                    var add_count = additional_data.length - 1;
                    for (k = add_count; k >= 0 ; k--) {
                        var add_column = [],
                            col_count = additional_data[k].column.length - 1;
                        for (j = col_count; j >= 0 ; j--) {
                            //make separate
                            addtext = additional_data[k].column[j]+'';
                            addtext = addtext.replace('_', " ").toLocaleUpperCase();
                            add_column.push({
                                xtype: 'gridcolumn',
                                dataIndex: additional_data[k].column[j]+'',
                                text: addtext,//additional_data[k].column[j]+'',
                                width: 150,
                                tblCls: 'wrap',
                            });
                        }

                        add_grid.push({
                            xtype: 'grid',
                            title: additional_data[k].title,
                            filter_column: additional_data[k].filter_column,
                            listeners: {
                                beforerender: {
                                    fn: 'setComboStore',
                                    config: {
                                        pageSize: 100,
                                        proxy: {
                                            url: ''+additional_data[k].url
                                        }
                                    },
                                    isLoad: false
                                },
                            },
                            columns: add_column
                        });
                    }
                    var panel = Ext.create('Ext.panel.Panel', {
                        layout: 'border',
                        controller: 'databrowserVCtr',
                        height: Ext.Element.getViewportHeight() - 118,
                        items:[{
                            xtype: 'form',
                            layout: 'form',
                            region: 'west',
                            collapsible: true, 
                            collapsed: false,
                            titleCollapse: true,
                            width:250,
                            split: true,
                            autoScroll : true,
                            border: true,
                            title: 'Visible Columns',
                            defaults: {
                                xtype: 'checkbox',
                                labelAlign: 'right',
                                margin: 5,
                                labelSeparator: ':',
                            },
                            height: '100%',
                            items: ck_boxes
                        },{
                            xtype: 'grid',
                            title: 'View Details',
                            name: 'main',
                            region: 'center',
                            plugins: [{
                                ptype: 'filterfield'
                            }],
                            listeners: {
                                beforerender: {
                                    fn: 'setConfigGridsStore',
                                    config: {
                                        pageSize: 100,
                                        autoLoad: false,
                                        remoteFilter: true,
                                        proxy: {
                                            url: 'summaryreport/generateSpreadsheeetviewData',
                                            gridCall: 1
                                        }
                                    },
                                    isLoad: false
                                },
                                select: 'loadadditionalinfo'
                            },
                            columns: column,
                            bbar: [{
                                xtype: 'pagingtoolbar',
                                width: '90%',
                                displayInfo: true,
                                displayMsg: 'Showing {0} - {1} of {2} total records',
                                emptyMsg: 'No Records',
                                beforeLoad: function() {
                                    var grid=this.up('grid'),
                                        pnl = grid.up('panel'),
                                        wrapper = pnl.up('panel'),
                                        form = wrapper.down('form'),
                                        form_filters = JSON.stringify(form.getValues()),
                                        module_id = wrapper.down('combo[name=module_id]').getValue();
                                       
                                    var store=this.getStore();
                                     store.getProxy().extraParams = {
                                            module_id:module_id,
                                            gridCall: 1,
                                            form_filters: form_filters
                                        }
                                    }
                            },{
                                xype: 'button',
                                name: 'save_export',
                                ui: 'black',
                                text: 'Save Filtered Report',
                                report_id: '',
                                handler: 'saveDataReport'
                            }],

                        },{
                            xtype: 'panel',
                            region: 'east',
                            name: 'additional_details',
                            collapsible: true, 
                            collapsed: true,
                            titleCollapse: true,
                            width:250,
                            split: true,
                            autoScroll : true,
                            border: true,
                            layout: 'accordion',
                            title: 'Additional Information',
                            items: add_grid
                        }]
                    });
                pnl.add(panel);
                var filter_form = pnl.down('form[name=filter]');
                if(filter_form.down('tagfield[name=filter_column]')){
                    filter_form.down('tagfield[name=filter_column]').destroy();
                }
                pnl.down('form[name=filter]').insert(2, {
                          xtype: 'tagfield',
                          fieldLabel: 'Filters',
                          forceSelection: true,
                          queryMode: 'local',
                          encodeSubmitValue: true,
                          valueField: 'id',
                          displayField: 'name',
                          name: 'filter_column',
                          maxWidth: 400,
                          allowBlank: true,
                          store: filter_columns 
                      });
                Ext.getBody().unmask();
            },
            failure: function (response) {
                Ext.getBody().unmask();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error(errorThrown, 'Error');
            }
        });

    },
    func_showhideSpreasheetColumn: function (chk, value) {
                  var  chk_name = chk.name,
                          form = chk.up('form'),
                          panel = form.up('panel'),
                          grid = panel.down('grid[name=main]');
                  grid.columns[chk_name].setVisible(value);
            },
    loadadditionalinfo: function(sender,record) {
        // console.log(sender);
        var grid = sender.view.grid,
            panel = grid.up('panel'),
            add_panel = panel.down('panel[name=additional_details]'),
            grid_array = add_panel.items.items;
            // console.log(grid_array);
            for (var i = 0; i <= grid_array.length-1; i++) {
                  var store =  grid_array[i].getStore();
                  filter_column = grid_array[i].filter_column;
                  console.log(filter_column);
                  store.removeAll();
                  store.load({params:{[filter_column]:record.get(filter_column)}});
               }
        
    },
    func_exportSpreadsheet: function (btn) {

             var name=btn.name,
                 pnlfrm = btn.up('form'),
                 pnl = pnlfrm.up('panel'),
                 grid = pnl.down('grid[name=main]'),
                 module_id = pnl.down('combo[name=module_id]').getValue(),
                 fil_form = pnl.down('form[name=filter]'),
                 form_filters = JSON.stringify(fil_form.getValues()),
                 filterfield = grid.getPlugin('filterfield');
                 
                  //filters  form_filters
             var filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
                      
               //headers
               if(name=='summary'){
                       var header=grid.getVisibleColumns();
                       var header2=[];
                       var x=0;
                       for (var i = 1; i <= header.length-1; i++) {
                        header2[x]= header[i].config.text;
                         x++;
                       }
                 }else{
                  // var header=Ext.pluck(grid.columns, 'name');
                  var header2=[];
                   // var x=0;
                   // for (var i = 2; i <= header.length; i++) {
                   //  header2[x]= header[i];
                   //   x++;
                   // }
                 }
                var header= Ext.encode(header2);
                filter_array = Ext.JSON.encode(filter_array);
                var url = 'reports/exportDataBrowser?form_filters='+encodeURIComponent(form_filters)+'&header='+encodeURIComponent(JSON.stringify(header))+'&filter='+encodeURIComponent(filter_array)+'&module_id='+module_id;
                var win = Ext.create('Ext.window.Window', {
                                title: 'Preview',
                                modal: true,
                                minimizable: true,
                                width: 1000,
                                height: 650,
                                frame: true,
                                items: [{
                                    xtype: 'component',
                                    autoEl: {
                                        tag: 'iframe',
                                        style: 'height: 100%; width: 100%; overflow-x: auto;',
                                        src: url
                                    },
                                    listeners: {
                                        load: {
                                            element: 'el',
                                            fn: function () {
                                                win.body.unmask();
                                            }
                                        },
                                        render: function () {

                                            this.up('window').body.mask('downloading'+'......');
                                        }
                                    }
                                }]
                            });
                            win.show();

     },
    func_clearfilters: function(btn) {
         var pnl = btn.up('panel'),
             grid = pnl.down('grid[name=main]');
        
         var t=grid.down('headercontainer').getGridColumns();

         for (var i = t.length - 1; i >= 2; i--) {
              column=t[i];
              var textfield=column.down('textfield');

              if(textfield!=null){
                 textfield.setValue('');
              }

              grid = column.up('grid');
              grid.getStore().removeFilter(column.filter.property || column.dataIndex);
             
           }

     },
    refreshView:function(btn){
         // var pnl = btn.up('panel');
         // pnl.removeAll();
         this.refreshViewFromCombo(btn);
         // pnl.destroy();
     },
    refreshViewFromCombo:function(combo, newVal, oldVal, eopts){
         var frm = combo.up('form'),
             pnl = frm.up('panel');
         pnl.removeAll();
         this.renderSpreadsheet(pnl);
         // pnl.destroy();
     },
   func_viewUploadedDocs: function(btn) {
       var button = btn.up('button'),
           record = button.getWidgetRecord(),
           gridwin = Ext.widget('databrowserdocumentpreview');
        gridwin.down('hiddenfield[name=application_code]').setValue(record.get('application_code'));
        gridwin.down('hiddenfield[name=record_id]').setValue(record.get('id'));
   funcShowCustomizableWindow('Documents', '60%', gridwin, 'customizablewindow');
       
   },
   // func_viewUploadedDocs: function(btn) {
   //      // showApplicationMoreDetails
   //       var button = btn.up('button'),
   //          grid = button.up('grid'),
   //          container = grid.up('panel'),
   //          container = grid.up('panel'),
   //          record = button.getWidgetRecord(),
   //          application_code = record.get('application_code');
   //      container.down('hiddenfield[name=active_application_code]').setValue(application_code);
   //      this.fireEvent('showApplicationUploadedDocument', btn);
   //  },
   // funcShowCustomizableWindow: function(title, width, childObject, winXtype) {
   //      var view = Ext.apply({
   //          xtype: winXtype,
   //          title: title,
   //          bodyPadding: 3,
   //          width: width,
   //          autoScroll: true,
   //          items: [
   //              Ext.apply(
   //                  childObject
   //              )
   //          ]
   //      });
   //      Ext.create(view);
   //  },
    saveDataReport: function(btn){
        var grid = btn.up('grid'),
            main_pnl = grid.up('panel[name=main-panel]'),
            v_form = main_pnl.down('form'),
            report_id = btn.report_id,
            module_id = main_pnl.down('combo[name=module_id]').getValue(),
            fil_form = main_pnl.down('form[name=filter]'),
            form_filters = JSON.stringify(fil_form.getValues()),
            filter_array, c_col,
            filterfield = grid.getPlugin('filterfield'),
            save_frm = Ext.widget('dataBrowser_Report_Save_form');
                 
            //filters
            filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
            //headers
            var header=grid.getVisibleColumns();
            console.log(header);
            var header2=[];
            var x=0;
            for (var i = 1; i <= header.length-1; i++) {
                header2[x]= header[i].config.text;
                 x++;
               }
            var header= Ext.encode(header2);
            filter_array = Ext.JSON.encode(filter_array);
            var url = 'reports/generateSpreadsheeetviewData?filter='+encodeURIComponent(filter_array)+'&module_id='+module_id;
            save_frm.down('hiddenfield[name=header]').setValue(header);
            save_frm.down('hiddenfield[name=filter]').setValue(filter_array);
            save_frm.down('hiddenfield[name=form_filters]').setValue(form_filters);
            save_frm.down('hiddenfield[name=report_id]').setValue(report_id);
            save_frm.down('hiddenfield[name=url]').setValue(url);
            save_frm.down('hiddenfield[name=module_id]').setValue(module_id);
            
           funcShowCustomizableWindow('save_report', '40%', save_frm, 'customizablewindow');

    },
    doUrlFrmSubmit: function(btn){
        var form = btn.up('form'),
            url = btn.action_url,
            win = form.up('window'),
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: url,
                waitMsg: 'pls_wait',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                        console.log(response);
                    if (success == true || success === true) {
                        toastr.success({headline: 'success', text: eval(message)});
                        console.log(win);
                        if(win){
                            win.close();
                        }
                         win.close();
                        
                    } else {
                        toastr.error({headline: 'failed', text: eval(message)});
                         win.close();
                    }
                },
                failure: function (form, action) {
                    console.log(form);
                    var resp = action.result;
                    toastr.error({headline: 'failed', text: 'failed_desc'});
                }
            });
        }
    },
    previewSavedReport: function(btn){
        var rec = btn.getWidgetRecord(),
            header = rec.get('header'),
            url = rec.get('url'),
            report_name = rec.get('report_name'),
            form_filters = rec.get('form_filters'),
            header_array = Ext.decode(header),
            length = header_array.length,
            column = [{
                        text: 'Action',
                        xtype: 'widgetcolumn',
                        width: 90,
                        widget: {
                            width: 75,
                            iconCls: 'x-fa fa-th-list',
                            textAlign: 'left',
                            xtype: 'splitbutton',
                            menu: {
                                xtype: 'menu',
                                items: [{
                                        text: 'documents_associated',
                                        iconCls: 'x-fa fa-print',
                                        tooltip: 'documents_associated',
                                        handler: 'func_viewUploadedDocs'
                                       }]
                              }
                            }
                         }];
        for (i = length-1; i >= 0 ; i--) {
            column.push({
                          text: header_array[i],
                          xtype: 'gridcolumn',
                          dataIndex: header_array[i]+'',
                          width: 150,
                          tblCls: 'wrap'
                      });
        }
        var grid = Ext.create('Ext.panel.Panel', {
                controller: 'databrowserVCtr',
                layout: 'fit',
                height: Ext.Element.getViewportHeight() - 118,
                items:{
                    xtype: 'grid',
                    tbar:['->',{ 
                           text: 'export_summary',
                           name: 'summary',
                           ui: 'black',
                           form_filters: rec.get('form_filters'),
                           header: rec.get('header'),
                           filter_array: rec.get('filter'),
                           record_id: rec.get('id'),
                           module_id: rec.get('module_id'),
                           iconCls: 'x-fa fa-print', 
                           handler: 'exportSavedReport'
                     }],
                    plugins: [{
                        ptype: 'gridexporter'
                    }],
                    listeners: {
                      beforerender: {
                        fn: 'setConfigGridsStore',
                        config: {
                            pageSize: 100,
                            proxy: {
                                url: '' + url,
                                extraParams: {
                                    gridCall: 1,
                                    form_filters: form_filters
                                }
                            }
                        },
                        isLoad: true
                    }
                },
                columns: column,
                bbar: [{
                    xtype: 'pagingtoolbar',
                    width: '90%',
                    displayInfo: true,
                    displayMsg: 'Showing'+' {0} - {1} '+'of'+' {2} '+'totalrecords',
                    emptyMsg: 'No Records'
                }]
            }
                
        });
         funcShowCustomizableWindow(report_name, '90%', grid, 'customizablewindow'); 
    },
    showEditReportWin: function(btn){
         var rec = btn.getWidgetRecord(),
            header = rec.get('header'),
            header_array = Ext.decode(header),
            url = rec.get('url'),
            me = this,
            module_id = rec.get('module_id'),
            report_name = rec.get('report_name'),
            form_filters = rec.get('form_filters'),
            report_id = rec.get('id'),
            add_grid = [],
            column =  [{
                        text: 'Action',
                        xtype: 'widgetcolumn',
                        width: 90,
                        widget: {
                            width: 75,
                            iconCls: 'x-fa fa-th-list',
                            textAlign: 'left',
                            xtype: 'splitbutton',
                            menu: {
                                xtype: 'menu',
                                items: [{
                                        text: 'documents_associated',
                                        iconCls: 'x-fa fa-print',
                                        tooltip: 'documents_associated',
                                        handler: 'func_viewUploadedDocs'
                                       }]
                              }
                            }
                         }],
            ck_boxes = [];
         Ext.getBody().mask('Please Wait');
         Ext.Ajax.request({
            url: url,
            method: 'GET',
            params: {
                gridCall: 0,
                form_filters: form_filters
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText);
                //generate views 
                var main_data  = resp.main_data,
                    additional_data = resp.additional_data,
                    filter_columns = resp.filter_columns,
                    length = main_data.length-1;
                    length2 = main_data.length;

                    for (i = length; i >= 0 ; i--) {
                        column.push({
                                      text: main_data[i],
                                      xtype: 'gridcolumn',
                                      dataIndex: main_data[i]+'',
                                      width: 150,
                                      hidden: true,
                                      tblCls: 'wrap',
                                      filter: {
                                          xtype: 'textfield'
                                      }
                                  });
                        ck_boxes.push({
                            boxLabel: main_data[i],
                            name: length2-i,
                            checked: false,
                            listeners: {
                                change: 'func_showhideSpreasheetColumn'
                            }
                       })
                    }
                    var add_count = additional_data.length - 1;
                    for (k = add_count; k >= 0 ; k--) {
                        var add_column = [],
                            col_count = additional_data[k].column.length - 1;
                        for (j = col_count; j >= 0 ; j--) {
                            add_column.push({
                                xtype: 'gridcolumn',
                                dataIndex: additional_data[k].column[j]+'',
                                text: additional_data[k].column[j]+'',
                                width: 150,
                                tblCls: 'wrap',
                            });
                        }

                        add_grid.push({
                            xtype: 'grid',
                            title: additional_data[k].title,
                            listeners: {
                                beforerender: {
                                    fn: 'setComboStore',
                                    config: {
                                        pageSize: 100,
                                        proxy: {
                                            url: '' + additional_data[k].url
                                        }
                                    },
                                    isLoad: false
                                },
                            },
                            columns: add_column
                        });
                    }
                    var panel = Ext.create('Ext.panel.Panel', {
                        layout: 'border',
                        name: 'main-panel',
                        controller: 'databrowserVCtr',
                        height: Ext.Element.getViewportHeight() - 118,
                        tbar: [{
                            xtype: 'form',
                            name: 'filter',
                            layout: 'column',
                            collapsible: true,
                            title: 'filter',
                            width: '100%',
                            defaults: {
                                columnWidth: 0.2,
                                labelAlign: 'top'
                            },
                            items:[{
                                xtype: 'combo', anyMatch: true,
                                fieldLabel: 'Module',
                                name: 'module_id',
                                valueField: 'id',
                                displayField: 'name',
                                forceSelection: true,
                                readOnly: true,
                                queryMode: 'local',
                                listeners: {
                                    beforerender: {
                                        fn: 'setConfigCombosStore',
                                        config: {
                                            pageSize: 1000,
                                            proxy: {
                                                url: 'configurations/getConfigParamFromTable',
                                                extraParams: {
                                                    table_name: 'par_modules'
                                                }
                                            }
                                        },
                                        isLoad: true
                                    },
                                   
                                }
                            },{
                                xtype: 'tagfield',
                                fieldLabel: 'filter',
                                forceSelection: true,
                                queryMode: 'local',
                                //filterPickList: true,
                                encodeSubmitValue: true,
                                //growMax: 100,
                                valueField: 'name',
                                displayField: 'name',
                                name: 'filter_column',
                                allowBlank: true,
                                maxWidth: 400,
                                store: filter_columns
                            },{
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                name: 'date_from',
                                allowBlank: 'true',
                                fieldLabel: 'date_from'
                            },{
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                name: 'date_to',
                                allowBlank: 'true',
                                fieldLabel: 'date_to'
                            }]
                        }],
   
                        items:[{
                            xtype: 'form',
                            layout: 'form',
                            region: 'west',
                            name: 'chk_form',
                            collapsible: true, 
                            collapsed: false,
                            titleCollapse: true,
                            width:250,
                            split: true,
                            autoScroll : true,
                            border: true,
                            title: 'Visible Columns',
                            defaults: {
                                xtype: 'checkbox',
                                labelAlign: 'right',
                                margin: 5,
                                labelSeparator: ':',
                            },
                            height: '100%',
                            items: ck_boxes
                        },{
                            xtype: 'grid',
                            title: 'View Details',
                            name: 'main',
                            region: 'center',
                            plugins: [{
                                ptype: 'filterfield'
                            }],
                            listeners: {
                                beforerender: {
                                    fn: 'setConfigGridsStore',
                                    config: {
                                        pageSize: 1000,
                                        proxy: {
                                            url: 'summaryreport/generateSpreadsheeetviewData',
                                            gridCall: 1
                                        }
                                    },
                                    isLoad: true
                                },
                                select: 'loadadditionalinfo'
                            },
                            columns: column,
                            bbar: [{
                                xtype: 'pagingtoolbar',
                                width: '90%',
                                displayInfo: true,
                                displayMsg: 'Showing'+' {0} - {1} '+'of'+' {2} '+'totalrecords',
                                emptyMsg: 'No Records',
                                beforeLoad: function() {
                                    var grid=this.up('grid'),
                                        form_filters = rec.get('form_filters'),
                                        module_id = rec.get('module_id');
                                       
                                    var store=this.getStore();
                                     store.getProxy().extraParams = {
                                            module_id:module_id,
                                            gridCall: 1,
                                            form_filters: form_filters
                                        }
                                    }
                            },{
                                xype: 'button',
                                name: 'save_export',
                                ui: 'soft-blue',
                                text: 'save_report',
                                report_id: report_id,
                                handler: 'saveDataReport'
                            }],

                        },{
                            xtype: 'panel',
                            region: 'east',
                            name: 'additional_details',
                            collapsible: true, 
                            collapsed: true,
                            titleCollapse: true,
                            width:250,
                            split: true,
                            autoScroll : true,
                            border: true,
                            layout: 'accordion',
                            title: 'additional_info',
                            items: add_grid
                        }]
                    });
                 var checkbox_frm = panel.down('form[name=chk_form]'),
                     grid = panel.down('grid[name=main]'),
                     length = header_array.length;
                for (i = length-1; i >= 0 ; i--) {
                    var checkbox = checkbox_frm.down('checkbox[boxLabel='+header_array[i]+']');
                    if(checkbox){
                        index = checkbox.name;
                        checkbox.setValue(true);
                        grid.columns[index].setVisible(true);
                    }else{
                        console.log("missed "+header_array[i]);
                    }
                    
                    
                }
                //solution for now on setting search values
                var filters = Ext.decode(rec.get('filter'));
                for (i = filters.length-1; i >= 0 ; i--) {
                    dataIndex = filters[i].property;
                    grid.down('gridcolumn[dataIndex='+dataIndex+']').items.items[0].items.items[0].setValue(filters[i].value);
                }
                panel.down('combo[name=module_id]').setValue(rec.get('module_id'));
                var form_filters = Ext.decode(rec.get('form_filters'));
                panel.down('tagfield[name=filter_column]').setValue(eval(form_filters.filter_column));
                panel.down('datefield[name=date_from]').setValue(form_filters.date_from);
                panel.down('datefield[name=date_to]').setValue(form_filters.date_to);

              funcShowCustomizableWindow(report_name, '95%', panel, 'customizablewindow'); 
                Ext.getBody().unmask();
            },
            failure: function (response) {
                Ext.getBody().unmask();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error(errorThrown, 'Error');
            }
        });
    },
     updatesavedDataReport: function(btn){
        var grid = btn.up('grid'),
            main_pnl = grid.up('panel[name=main-panel]'),
            module_id = main_pnl.down('combo[name=module_id]').getValue(),
            report_id = btn.report_id,
            module_id = main_pnl.down('combo[name=module_id]').getValue(),
            fil_form = main_pnl.down('form[name=filter]'),
            form_filters = JSON.stringify(fil_form.getValues()),
            filter_array, c_col,
            filterfield = grid.getPlugin('filterfield'),
            save_frm = Ext.widget('dataBrowser_Report_Save_form');
                 
            //filters
            filter_array =Ext.pluck( filterfield.getgridFilters(grid), 'config');
            //headers
            var header=grid.getVisibleColumns();
            var header2=[];
            var x=0;
            for (var i = 1; i <= header.length-1; i++) {
                header2[x]= header[i].config.text;
                 x++;
               }
            var header= Ext.encode(header2);
            filter_array = Ext.JSON.encode(filter_array);
            var url = 'reports/generateSpreadsheeetviewData?filter='+encodeURIComponent(filter_array)+'&module_id='+module_id;
            save_frm.down('hiddenfield[name=header]').setValue(header);
            save_frm.down('hiddenfield[name=filter]').setValue(filter_array);
            save_frm.down('combo[name=module_id]').setValue(module_id);
            save_frm.down('hiddenfield[name=form_filters]').setValue(form_filters);
            save_frm.down('hiddenfield[name=report_id]').setValue(report_id);
            save_frm.down('hiddenfield[name=url]').setValue(url);
            save_frm.down('hiddenfield[name=module_id]').setValue(module_id);
            
           funcShowCustomizableWindow('save_report', '40%', save_frm, 'customizablewindow');

    },
    filterDataBrowserReport: function(btn){
        var form = btn.up('form'),
            pnl = form.up('panel'),
            store = pnl.down('grid[name=main]').getStore();
            store.removeAll();
            store.load();
    },
    exportSavedReport: function(btn){
                //var url = 'reports/exportDataBrowser?form_filters='+encodeURIComponent(form_filters)+'&header='+encodeURIComponent(JSON.stringify(header))+'&filter='+encodeURIComponent(filter_array)+'&module_id='+module_id;
        var url = 'reports/exportDataBrowser?form_filters='+encodeURIComponent(btn.form_filters)+'&header='+encodeURIComponent(JSON.stringify(btn.header))+'&filter='+encodeURIComponent(btn.filter_array)+'&module_id='+btn.module_id+'&saved_report=1&report_id='+btn.record_id;
        var win = Ext.create('Ext.window.Window', {
                    title: 'preview',
                    modal: true,
                    minimizable: true,
                    width: 1000,
                    height: 650,
                    frame: true,
                    items: [{
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            style: 'height: 100%; width: 100%; overflow-x: auto;',
                            src: url
                        },
                        listeners: {
                            load: {
                                element: 'el',
                                fn: function () {
                                    win.body.unmask();
                                }
                            },
                            render: function () {

                                this.up('window').body.mask('downloading'+'......');
                            }
                        }
                    }]
                });
                win.show();
    }

});

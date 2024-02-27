Ext.define('Admin.view.frontoffice.adr.container.SpreadSheetAdrCnt', {
    extend: 'Ext.form.Panel',
    xtype: 'spreadSheetAdrCnt',
    layout:'border',
    controller: 'spreadSheetAdrCtr',
            tbar: [
               {
                    xtype: 'combobox',
                    forceSelection: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'sub_module',
                    widht: 200,
                    fieldLabel: 'Application Type',
                    labelStyle: 'margin-left:20px',
                    value: 'New',
                    listeners:
                     {
                         beforerender: {//getConfigParamFromTable
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                    extraParams: {
                                        table_name: 'par_sub_modules',
                                        filters: '{"module_id":21}'
                                    }
                                    
                                }
                            },
                            isLoad: true
                        },
                        beforequery: function() {
                          var store=this.getStore();
                          
                            var all={name: 'All',id:0};
                              store.insert(0, all);
                            },
                        change: 'reloadSheetStore',
                      
                       }
                 },'->',
                    { 
                       xtype: 'button', 
                       text: 'Export Summary',
                       name: 'summary',
                       ui: 'soft-blue',
                       iconCls: 'x-fa fa-cloud-upload', 
                       handler: 'func_exportpremisespreadsheet'
                    },{
                       xtype: 'button', 
                       text: 'Export Detailed Report(All)',
                       name: 'detailed',
                       ui: 'soft-blue',
                       iconCls: 'x-fa fa-refresh', 
                       handler: 'func_exportpremisespreadsheet'
                    },{
                       xtype: 'button', 
                       text: 'clear Filter',
                       ui: 'soft-blue',
                       iconCls: 'x-fa fa-print', 
                       handler: 'func_clearfilters'
                    }
                  ],
               items: [{
                  xtype: 'panel',
                  titleCollapse: true,
                  title: 'View Options',
                  region:'west',
                  collapsible: true, 
                  height: '100%',
                  preventHeader: true, 
                  width: 200,
                  border: true,
                  split: true,
                  layout: 'border',
                  items: [
                  {
                    	xtype: 'spreadsheetadrvisiblecolumns',
                      height: 200,
                      region: 'center',
                   },{
                    xtype: 'adrAdditionalFiltersFrm',
                    height: 200,
                    region: 'south'
                   }
               ]
               },
               {
                   xtype: 'spreadsheetadrview',
                  region:'center'
               },
               {
                  title: 'Additional Information',
                  xtype: 'panel',
                  collapsible: true, 
                  collapsed: true,
                  titleCollapse: true,
                  width:250,
                  split: true,
                  autoScroll : true,
                  border: true,
                  region: 'east',
                  layout: 'accordion',
                  items:[{
                          xtype: 'adrDrugInfogrid',
                          height: 200
                  }
                  ]
                 
               }
            ]
});
Ext.define('Admin.view.frontoffice.product.container.MedicalDeviceSpreadSheetCnt', {
    extend: 'Ext.form.Panel',
    xtype: 'medicaldevicespreadsheetcnt',
    layout:'border',
    controller: 'spreadsheetproductctr',
            tbar: [{
                    xtype: 'combobox',
                    forceSelection: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'sub_module',
                    widht: 200,
                    fieldLabel: 'Applcation Type',
                    //value: 'New',
                    listeners:
                     {
                         beforerender: {//getConfigParamFromTable
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                    extraParams: {
                                        table_name: 'sub_modules',
                                        filters: '{"module_id":1}'
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
                       ui: 'soft-purple',
                       name: 'summary',
                       gridXtype: 'mdspreadsheetview',
                       iconCls: 'x-fa fa-cloud-upload', 
                       handler: 'func_exportproductspreadsheet'
                    },{ 
                       xtype: 'button', 
                       text: 'Export Detailed Report(All)',
                       ui: 'soft-purple',
                       name: 'detailed',
                       iconCls: 'x-fa fa-cloud-upload', 
                       gridXtype: 'mdspreadsheetview',
                       handler: 'func_exportproductspreadsheet'
                    },{
                       xtype: 'button', 
                       text: 'clear Filter',
                       ui: 'soft-purple',
                       name: 'clearFilter',
                       iconCls: 'x-fa fa-refresh', 
                       handler: 'func_clearfilters'
                    },{
                      xtype: 'hiddenfield',
                      name: 'section_id',
                      value: 4
                    }
                  ],
               items: [{
                  xtype: 'panel',
                  titleCollapse: true,
                  title: 'View free Options',
                  region:'west',
                  collapsible: true, 
                   height: '100%',
                  preventHeader: true, 
                  width: 200,
                  border: true,
                  split: true,
                  layout:'border',
                  items: [
                  // {
                  //   	xtype: 'spreadsheetapplicationtypes',
                  //   	height: 150,
                  //     region: 'north'
                  //  },
                   {
                    	xtype: 'mdspreadsheetproductvisiblecolumns',
                      height: 200,
                      region: 'center'
                   },{
                      xtype: 'productadditionalfiltersview',
                      height: 200,
                      region: 'south'
                   }]
               },{
                  xtype: 'mdspreadsheetview',
                  region:'center',
                 
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
                //  preventHeader: true, 
                  border: true,
                  region: 'east',
                  layout: 'accordion',
                  items:[
                  // {
                  //         xtype: 'productingridientsview',
                  //         height: 250
                  // },{
                  // 	xtype: 'productnutrientsview',
                  // 	height: 250
                  // },
                  // {
                  // 	xtype: 'productpackagingview',
                  // 	height: 250
                  // },
                  {
                  	xtype: 'productmanufacturerview',
                  height: 250
                  },
                  {
                  	xtype: 'productinspectionview',
                  	height: 150
                  },
                //  {
                //   xtype: 'productsampleinfoview',
                //   height: 250
                // },
                {
                  xtype: 'productImageview',
                  height: 250
                }
                  

                  ]
                 
               }]
});
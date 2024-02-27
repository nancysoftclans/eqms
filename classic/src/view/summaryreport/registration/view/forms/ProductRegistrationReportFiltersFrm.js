Ext.define('Admin.view.summaryreport.registration.form.ProductRegistrationReportFilters', {
	extend: 'Ext.form.Panel',
	xtype: 'productregistrationreportFiltersFrm',
	layout: 'fit',
	defaults:{
		bodyPadding: 1,
        margins: '0 0 0 0',
	},
   items: [{ 
        	xtype: 'fieldset',
            style: 'margin:0px',
        	layout: 'column',
            defaults: {
                columnWidth: 0.2
            },
              items:[{
                xtype: 'hiddenfield',
                name: 'module_id',
                value: 1,
                hidden: true
            },{
                    xtype: 'combo',
                    fieldLabel: 'Sub Process',
                    labelAlign : 'top',
                    valueField: 'id',
                    displayField: 'name',
                    forceSelection: true,
                    name: 'sub_module_id',
                    queryMode: 'local',
                    allowBlank: false,
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    },
                    listeners: {
                        beforerender: {
                            fn: 'setWorkflowCombosStore',
                            config: {
                                pageSize: 1000,
                                proxy: {
                                    url: 'workflow/getSystemSubModules',
                                    extraParams: {
                                        model_name: 'SubModule',
                                        module_id: 1
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
                         afterrender: function(combo) {
        		            		combo.select(combo.getStore().getAt(0));	
        		            	},
                    }
                
                },{
                    xtype: 'combo',
                    fieldLabel: 'Product Type',
                    forceSelection: true,
                    queryMode: 'local',
                    valueField: 'id',
                    labelAlign : 'top',
                    displayField: 'name',
                    name: 'section_id',
                    allowBlank: false,
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    },
                    listeners: {
                        beforerender: {
                            fn: 'setOrgConfigCombosStore',
                            config: {
                                pageSize: 100,
                                proxy: {
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_sections'
                                }
                               }
                            },
                            isLoad: false
                        },
                        beforequery: function() {
                            var store=this.getStore();
                            
                            var all={name: 'All',id:0};
                              store.insert(0, all);
                            },
                        afterrender: function(combo) {
                                    combo.select(combo.getStore().getAt(0));    
                                },
                        change: 'loadClassAndCategoryCombo',

                    }
                },{
                      xtype: 'combo',
                      fieldLabel: 'Product Class Category',
                      forceSelection: true,
                      queryMode: 'local',
                      valueField: 'id',
                      labelAlign: 'top',
                      displayField: 'name',
                      name: 'product_class_category',
                      allowBlank: false,
                      fieldStyle: {
                          'color': 'green',
                          'font-weight': 'bold'
                      },
                      listeners: {
                          beforerender: {
                              fn: 'setOrgConfigCombosStore',
                              config: {
                                  pageSize: 100,
                                  proxy: {
                                      url: 'configurations/getConfigParamFromTable',
                                      extraParams: {
                                          table_name: 'par_prodclass_categories'
                                      }
                                  }
                              },
                              isLoad: false
                          },
                          beforequery: function() {
                              var store = this.getStore();

                              var all = { name: 'All', id: 0 };
                              store.insert(0, all);
                          },
                          afterrender: function(combo) {
                              combo.select(combo.getStore().getAt(0));
                          },
                          change: 'func_LoadClassificationCombo'
                      }
                  }, {
                    xtype: 'combo',
                    fieldLabel: 'Product Classification Category',
                    forceSelection: true,
                    queryMode: 'local',
                    valueField: 'id',
                    labelAlign : 'top',
                    displayField: 'name',
                    name: 'classification_category',
                    allowBlank: false,
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    },
                    listeners: {
                         beforerender: {
                            fn: 'setOrgConfigCombosStore',
                            config: {
                                pageSize: 100,
                                proxy: {
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_classifications'
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
                        afterrender: function(combo) {
                                    combo.select(combo.getStore().getAt(0));    
                                }
                    }
                },{
                    xtype: 'combo',
                    fieldLabel: 'Product Origin',
                    forceSelection: true,
                    queryMode: 'local',
                    valueField: 'id',
                    labelAlign : 'top',
                    displayField: 'name',
                    name: 'product_origin_id',
                    allowBlank: false,
                    fieldStyle: {
                        'color': 'green',
                        'font-weight': 'bold'
                    },
                    listeners: {
                        beforerender: {
                            fn: 'setOrgConfigCombosStore',
                            config: {
                                pageSize: 100,
                                proxy: {
                                url: 'configurations/getConfigParamFromTable',
                                extraParams: {
                                    table_name: 'par_product_origins'
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
                        afterrender: function(combo) {
                                    combo.select(combo.getStore().getAt(0));    
                                }

                    }
                },{
                    xtype: 'datefield',
                    fieldLabel: 'Date From',
                    columnWidth: 0.2,
                    labelAlign : 'top',
                    format: 'Y-m-d',
                    name: 'from_date',
                    allowBlank: false,
                    minValue: new Date(2020, 6)
                },{
                    xtype: 'datefield',
                    name: 'to_date',
                    format: 'Y-m-d',
                    fieldLabel: 'Date From',
                    labelAlign : 'top',
                    allowBlank: false,
                    minValue: new Date(2020, 6)
                },{ 
                    xtype: 'button',
                    text: 'Search Filter',
                    margin: '30 0 0 10',
                    name: 'filter_SummaryReport',
                    ui: 'soft-green',
                    iconCls: 'fa fa-search',
                    handler: 'func_LoadreportFilters',
                    formBind: true,
                }
		       ]
            }
         
          ]
   

});
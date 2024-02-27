Ext.define('Admin.view.summaryreport.registration.form.ModuleRegistrationReportFilters', {
	extend: 'Ext.form.Panel',
	xtype: 'moduleregistrationreportFiltersFrm',
	layout: 'fit',
	defaults: {
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
        items: [{
            xtype: 'combo',
            fieldLabel: 'Module',
            labelAlign: 'top',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            name: 'module_id',
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
                            url: 'configurations/getConfigParamFromTable',
                            extraParams: {
                                table_name: 'modules',
                                filters: JSON.stringify({'is_application': 1})
                                    }
                                }
                            },
                            isLoad: true
                        },
                        change: function(combo, newVal, oldVal, eopts) {
                                var form = combo.up('form'),
                                    subStr = form.down('combo[name=sub_module_id]').getStore();
                                subStr.removeAll();
                                subStr.load({params:{'module_id': newVal}});   
                            },
                        beforequery: function() {
                            var store=this.getStore();
                            
                            var all={name: 'All',id:0};
                              store.insert(0, all);
                            },
                    }
                
                },{
                    xtype: 'combo',
                    fieldLabel: 'Sub Module',
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
                                        module_id: 4
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
                    fieldLabel: 'Section',
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
                },
                 {
                    xtype: 'combo',
                    fieldLabel: 'Zones',
                    forceSelection: true,
                    queryMode: 'local',
                    valueField: 'id',
                    labelAlign : 'top',
                    displayField: 'name',
                    name: 'zone_id',
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
                                    table_name: 'par_zones'
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
                    fieldLabel: 'From',
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
                    fieldLabel: 'To',
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
                    handler: 'func_LoadModuleRegReportFilters',
                    formBind: true,
                }
		       ]
            }
         
          ]
   

});
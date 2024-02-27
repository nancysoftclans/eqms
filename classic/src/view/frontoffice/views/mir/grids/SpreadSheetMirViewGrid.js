Ext.define('Admin.view.frontoffice.mir.grids.SpreadSheetMirViewGrid', {
    extend: 'Ext.grid.Panel',  
    autoScroll: true,
    width: '100%',
    xtype: 'spreadsheetmirViewGrid',
    layout: 'fit',
    title: 'Medicine Information Requests SpreadSheet',
    referenceHolder: true,
    reference:'mirgridpanel',
   
    plugins: [{
            ptype: 'filterfield'
        }],
        listeners: {
            select: 'loadadditionalinfo',
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetmirpplicationcolumnsstr',
                    proxy: {
                        url: 'openoffice/getMirApplicationColumns',
                        
                    }
                },
                isLoad: true
            },
        
        },
         viewConfig: {
            emptyText: 'No information found under this creteria'
        },
    columns: [ {
        text: 'Action',
        xtype: 'widgetcolumn',
        width: 90,
        widget: {
            width: 75,
            ui: 'gray',
            iconCls: 'x-fa fa-th-list',
            textAlign: 'left',
            xtype: 'splitbutton',
            menu: {
                xtype: 'menu',
                items: [{
                        text: 'Documents',
                        iconCls: 'x-fa fa-edit',
                        tooltip: 'View Documents',
                        handler: 'func_viewUploadedDocs'
                       }]
              }
            }
         },
        
    {
        xtype: 'gridcolumn',
        dataIndex: 'mir_id',
        name: 'id',
        hidden: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'patient_weight',
        name: 'patient_weight',
        text: 'Patient Weight',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'patient_age',
        name: 'patient_age',
        text: 'Patient Age',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'infant_age',
        name: 'infant_age',
        text: 'Infant Age',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'allergies',
        name: 'allergies',
        text: 'Allergies',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'pregnantstatus',
        name: 'pregnantstatus',
        text: 'Is Pregnant?',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'is_pregnant',
                    listeners:
                     {
                         beforerender: {//getConfigParamFromTable
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_confirmations'
                                    }
                                }
                            },
                            isLoad: true
                        },
                        change: function(cmb, newValue, oldValue, eopts) {
                            var grid = cmb.up('grid');
                                grid.getStore().reload();
                         }
                 }
                
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'smoker',
        name: 'smoker',
        text: 'Is Smoker?',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'is_smoker',
                    listeners:
                     {
                         beforerender: {//getConfigParamFromTable
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_confirmations'
                                    }
                                }
                            },
                            isLoad: true
                        },
                        change: function(cmb, newValue, oldValue, eopts) {
                            var grid = cmb.up('grid');
                                grid.getStore().reload();
                         }
                 }
                
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'usesalcohol',
        name: 'usesalcohol',
        text: 'Uses Alcohol?',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'uses_alcohol',
                    listeners:
                     {
                         beforerender: {//getConfigParamFromTable
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_confirmations'
                                    }
                                }
                            },
                            isLoad: true
                        },
                        change: function(cmb, newValue, oldValue, eopts) {
                            var grid = cmb.up('grid');
                                grid.getStore().reload();
                         }
                 }
                
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'breastfeeding',
        name: 'breastfeeding',
        text: 'Breast feeding?',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'is_breast_feeding',
                    listeners:
                     {
                         beforerender: {//getConfigParamFromTable
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_confirmations'
                                    }
                                }
                            },
                            isLoad: true
                        },
                        change: function(cmb, newValue, oldValue, eopts) {
                            var grid = cmb.up('grid');
                                grid.getStore().reload();
                         }
                 }
                
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'gender',
        name: 'Gender',
        text: 'Patient Gender',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'gender_id',
                    listeners:
                     {
                         beforerender: {//getConfigParamFromTable
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_gender'
                                    }
                                }
                            },
                            isLoad: true
                        },
                        change: function(cmb, newValue, oldValue, eopts) {
                            var grid = cmb.up('grid');
                                grid.getStore().reload();
                         }
                 }
                
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'RequestMode',
        name: 'RequestMode',
        text: 'Request Mode',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'request_mode_id',
                    listeners:
                     {
                         beforerender: {//getConfigParamFromTable
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_request_sources'
                                    }
                                }
                            },
                            isLoad: true
                        },
                        change: function(cmb, newValue, oldValue, eopts) {
                            var grid = cmb.up('grid');
                                grid.getStore().reload();
                         }
                 }
                
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'ResponseMode',
        name: 'ResponseMode',
        text: 'Response Mode',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'response_method_id',
                    listeners:
                     {
                         beforerender: {//getConfigParamFromTable
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_response_methods'
                                    }
                                }
                            },
                            isLoad: true
                        },
                        change: function(cmb, newValue, oldValue, eopts) {
                            var grid = cmb.up('grid');
                                grid.getStore().reload();
                         }
                 }
                
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'enquiry_reasons',
        name: 'enquiry_reasons',
        text: 'Enquiry Reasons',
        width: 200,
        filter: {
            xtype: 'textfield',
        }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'references_consulted',
        name: 'references_consulted',
       text: 'References Consulted',
       width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'enquiry',
        name: 'enquiry',
        text: 'Enquiry',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
                }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'enquirer_response',
        name: 'enquirer_response',
        text: 'Enquirer Response',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
                }
    },

    {
        xtype: 'gridcolumn',
        dataIndex: 'Trader',
        name: 'Trader',
        text: 'Applicant',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'TraderPostalA',
        name: 'TraderPostalA',
        text: 'Applicant Postal Address',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'TraderPhysicalA',
        name: 'TraderPhysicalA',
        text: 'Applicant Physical Address',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'TraderTell',
        name: 'TraderTell',
        text: 'Applicant Telephone',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'TraderMobile',
        name: 'TraderMobile',
        text: 'Applicant Mobile No',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'TraderEmail',
        name: 'TraderEmail',
        text: 'Applicant Email',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'TraderCountry',
        name: 'TraderCountry',
        text: 'Applicant Country',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'TraderRegion',
        name: 'TraderRegion',
        text: 'Applicant Region',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },
   
     {
        xtype: 'gridcolumn',
        dataIndex: 'tracking_no',
        name: 'tracking_no',
        text: 'Tracking No',
        width: 150,
        filter: {
                xtype: 'textfield',
            }
    },
     {
        xtype: 'gridcolumn',
        dataIndex: 'reference_no',
        name: 'reference_no',
        text: 'Reference No',
        width: 150,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'datecolumn',
        dataIndex: 'ReceivedFrom',
        name: 'ReceivedFrom',
        format: 'Y-m-d',
        text: 'Received From',
        width: 210, hidden: true,
        filter: {
                xtype: 'datefield',
                format: 'Y-m-d'
            }
    }, {
        xtype: 'datecolumn',
        dataIndex: 'ReceivedTo',
        name: 'ReceivedTo',
         format: 'Y-m-d',
        text: 'Received To',
        width: 210, hidden: true,
        filter: {
                xtype: 'datefield',
                format: 'Y-m-d'
            }
    },
    ],bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} out of {2}',
        emptyMsg: 'No Records',
         beforeLoad: function () {
                    var store = this.getStore(),
                     range = this.down('combo[name=Range]').getValue();
                     var grid=this.up('grid'),
                      is_pregnant=grid.down('combo[name=is_pregnant]').getValue(),
                      is_smoker=grid.down('combo[name=is_smoker]').getValue(),
                      uses_alcohol=grid.down('combo[name=uses_alcohol]').getValue(),
                      is_breast_feeding=grid.down('combo[name=is_breast_feeding]').getValue(),
                      gender_id=grid.down('combo[name=gender_id]').getValue(),
                      request_mode_id=grid.down('combo[name=request_mode_id]').getValue(),
                      response_method_id=grid.down('combo[name=response_method_id]').getValue();
                     
               //acquire original filters
               var filter = {'t1.section_id':sectionid,'t1.sub_module_id':sub_module};
               var   filters = JSON.stringify(filter);

              //pass to store
              var store=this.getStore();
                store.getProxy().extraParams = {
                    pageSize:range,
                    is_pregnant:is_pregnant,
                    is_smoker:is_smoker,
                    uses_alcohol:uses_alcohol,
                    is_breast_feeding:is_breast_feeding,
                    gender_id: gender_id,
                    request_mode_id: request_mode_id,
                    response_method_id: response_method_id,
                    filters: filters
                          };
                    },
            items:[{
                 xtype: 'combobox',
                 forceSelection: true,
                 fieldLabel: 'Range',
                 displayField: 'size',
                 valueField: 'size',
                 name: 'Range',
                 queryMode: 'local',
                 value: 25,
                 listeners:{
                    afterrender: {//getConfigParamFromTable
                             fn: 'setConfigCombosStore',
                            config: {
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                    extraParams: {
                                        table_name: 'par_page_sizes'
                                    }
                                }
                            },
                            isLoad: true
                        },
                    select: 'setPageSize'
                   }
            }]
    }],
      
});
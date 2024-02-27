Ext.define('Admin.view.frontoffice.enforcement.grids.SpreadSheetenforcementViewGrid', {
    extend: 'Ext.grid.Panel',  
    autoScroll: true,
    width: '100%',
    xtype: 'spreadsheetenforcementViewGrid',
    layout: 'fit',
    title: 'Law Enforcement Investigation SpreadSheet',
    referenceHolder: true,
    reference:'enforcementgridpanel',
   
    plugins: [{
            ptype: 'filterfield'
        }],
        listeners: {
            select: 'loadadditionalinfo',
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetenforcementpplicationcolumnsstr',
                    proxy: {
                        url: 'openoffice/getEnforcementApplicationColumns',
                        
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
        dataIndex: 'enforcement_id',
        name: 'id',
        hidden: true
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'report_type',
        name: 'report_type',
        text: 'Report Type',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'report_type_id',
                    listeners:
                     {
                         beforerender: {//getConfigParamFromTable
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_report_type'
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
        dataIndex: 'applicant_name',
        name: 'applicant_name',
        text: 'Applicant name',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'country_name',
        name: 'country_name',
        text: 'Applicant Country name',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'app_email',
        name: 'app_email',
        text: 'Applicant email',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'app_physical_address',
        name: 'app_physical_address',
        text: 'Applicant physical address',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'app_telephone',
        name: 'app_telephone',
        text: 'Applicant telephone',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'complainant_gender',
        name: 'complainant_gender',
        text: 'Complainant Gender',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'complainant_gender',
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
        dataIndex: 'complainant_age',
        name: 'complainant_age',
        text: 'Complainant age',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'suspect_name',
        name: 'suspect_name',
        text: 'Suspect Name',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'suspect_omang',
        name: 'suspect_omang',
        text: 'Suspect Omang',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'suspect_telephone',
        name: 'suspect_telephone',
        text: 'Suspect Telephone',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'suspect_address',
        name: 'suspect_address',
        text: 'Suspect Address',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'fullnames',
        name: 'fullnames',
        text: 'Internal Reporter Name',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'country',
        name: 'country',
        text: 'Internal Reporter Country',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'department_name',
        name: 'department_name',
        text: 'Internal Reporter Department',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'age',
        name: 'age',
        text: 'Internal Reporter age',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'gender',
        name: 'gender',
        text: 'Internal Reporter gender',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'phone',
        name: 'phone',
        text: 'Internal Reporter phone',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'email',
        name: 'email',
        text: 'Internal Reporter email',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'id_no',
        name: 'id_no',
        text: 'Internal Reporter Id',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'common_name',
        name: 'common_name',
        text: 'Reported Product Common Name',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'brand_name',
        name: 'brand_name',
        text: 'Reported Product Brand Name',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'batch_number',
        name: 'batch_number',
        text: 'Reported Product batch number',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'expiry_date',
        name: 'expiry_date',
        text: 'Reported Product expiry date',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'premise_name',
        name: 'premise_name',
        text: 'Reported Facility',
        width: 200,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'tracking_no',
        name: 'tracking_no',
        text: 'Tracking No',
        width: 150,
        filter: {
                xtype: 'textfield',
            }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'reference_no',
        name: 'reference_no',
        text: 'Reference No',
        width: 150,
        filter: {
                xtype: 'textfield',
            }
    },{
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
    },{
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
                     report_type_id=grid.down('combo[name=report_type_id]').getValue(),
                     complainant_gender=grid.down('combo[name=complainant_gender]').getValue();
               //acquire original filters
               var filter = {'t2.section_id':sectionid,'t2.sub_module_id':sub_module};
               var   filters = JSON.stringify(filter);

              //pass to store
              var store=this.getStore();
                store.getProxy().extraParams = {
                    pageSize:range,
                    report_type_id:report_type_id,
                    complainant_gender:complainant_gender,
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
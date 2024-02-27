Ext.define('Admin.view.frontoffice.rmu.grids.RmuViewGrid', {
    extend: 'Ext.grid.Panel',  
    autoScroll: true,
    width: '100%',
    xtype: 'rmuViewGrid',
    layout: 'fit',
    title: 'RMU SpreadSheet',
    referenceHolder: true,
    reference:'rmuViewGridpanel',
    plugins: [{
            ptype: 'filterfield'
        }],
        listeners: {
            select: 'loadadditionalinfo',
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetrmupplicationcolumnsstr',
                    proxy: {
                        url: 'openoffice/getRmuApplicationColumns',
                        
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
            dataIndex: 'submission_category',
            name: 'submission_category',
            text: 'Submission category',
            width: 200, 
           // hidden: true,
             filter: {
                xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'rmu_submission_category_id',
                        listeners:
                         {
                             beforerender: {
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                         extraParams: {
                                            table_name: 'par_rmu_submission_categories'
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
        },{
        xtype: 'gridcolumn',
        dataIndex: 'remarks',
        name: 'remarks',
        text: 'Remarks',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'department',
        name: 'department',
        text: 'Department',
        width: 200, 
        //hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'department_id',
                    listeners:
                     {
                         beforerender: {
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_departments'
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
        dataIndex: 'agency',
        name: 'agency',
        text: 'Agency',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'agency_id',
                    listeners:
                     {
                         beforerender: {
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_rmu_agencies'
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
        dataIndex: 'creator_ref',
        name: 'creator_ref',
        text: 'Creator reference',
        width: 200, hidden: true,
        filter: {
                xtype: 'textfield',
            }
    },
    {
        xtype: 'gridcolumn',
        dataIndex: 'file',
        name: 'file',
        text: 'File Name',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'file_name_id',
                    listeners:
                     {
                         beforerender: {
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_rmu_record_file'
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
        dataIndex: 'record_group',
        name: 'record_group',
        text: 'Record Group',
        width: 200, hidden: true,
         filter: {
            xtype: 'combobox',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    name: 'record_group_id',
                    listeners:
                     {
                         beforerender: {
                            fn: 'setConfigCombosStore',
                            config: {
                                pageSize: 10000,
                                proxy: {
                                    url: 'configurations/getConfigParamFromTable',
                                     extraParams: {
                                        table_name: 'par_rmu_record_group'
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
        dataIndex: 'quote_previous',
        name: 'quote_previous',
        text: 'Previous Quote',
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
                     var grid=this.up('grid');
                     rmu_submission_category_id=grid.down('combo[name=rmu_submission_category_id]').getValue();
                     department_id=grid.down('combo[name=department_id]').getValue();
                     agency_id=grid.down('combo[name=agency_id]').getValue();
                     file_name_id=grid.down('combo[name=file_name_id]').getValue();
                     record_group_id=grid.down('combo[name=record_group_id]').getValue();
                     
               //acquire original filters
               var filter = {'t1.section_id':sectionid,'t1.sub_module_id':sub_module};
               var   filters = JSON.stringify(filter);

              //pass to store
              var store=this.getStore();
                store.getProxy().extraParams = {
                    pageSize:range,
                    rmu_submission_category_id:rmu_submission_category_id,
                    department_id:department_id,
                    agency_id:agency_id,
                    file_name_id:file_name_id,
                    record_group_id:record_group_id,
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
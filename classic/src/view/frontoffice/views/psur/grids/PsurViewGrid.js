Ext.define('Admin.view.frontoffice.psur.grids.PsurViewGrid', {
    extend: 'Ext.grid.Panel',  
    autoScroll: true,
    width: '100%',
    xtype: 'psurViewGrid',
    layout: 'fit',
    title: 'PSUR/PBRER SpreadSheet',
    referenceHolder: true,
    reference:'psurViewGridpanel',
    plugins: [{
            ptype: 'filterfield'
        }],
        listeners: {
          //  select: 'loadadditionalinfo',
            beforerender: {
                fn: 'setGridStore',
                config: {
                    pageSize: 100,
                    storeId: 'spreadsheetpsurpplicationcolumnsstr',
                    proxy: {
                        url: 'openoffice/getPsurApplicationColumns',
                        
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
            dataIndex: 'report_type',
            name: 'report_type',
            text: 'Report Type',
            width:200,
            growToLongestValue : true,
             filter: {
                xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'psur_type_id',
                        listeners:
                         {
                             beforerender: {//getConfigParamFromTable
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                        extraParams: {
                                            table_name: 'par_psur_type'
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
            dataIndex: 'remarks',
            name: 'remarks',
            text: 'Remarks',
            width: 200,
             filter: {
                    xtype: 'textfield',
                }
        },
        {
            xtype: 'datecolumn',
            dataIndex: 'from_date',
            name: 'from_date',
             format: 'Y-m-d',
            text: 'From date',
            width: 210, hidden: true,
            filter: {
                    xtype: 'datefield',
                    format: 'Y-m-d'
                }
        },
        {
            xtype: 'datecolumn',
            dataIndex: 'to_date',
            name: 'to_date',
             format: 'Y-m-d',
            text: 'To date',
            width: 210, hidden: true,
            filter: {
                    xtype: 'datefield',
                    format: 'Y-m-d'
                }
        },
         {
            xtype: 'gridcolumn',
            dataIndex: 'brand_name',
            name: 'brand_name',
            text: 'Brand Name',
            width: 150,
            filter: {
                    xtype: 'textfield',
                }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'commonName',
            name: 'commonName',
            text: 'CommonName',
            width: 200,
             filter: {
                    xtype: 'textfield',
                }
        },
          {
            xtype: 'gridcolumn',
            dataIndex: 'Classification',
            name: 'Classification',
            text: 'Classification',
            width:200,
            growToLongestValue : true,
             filter: {
                xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'Classification_id',
                        listeners:
                         {
                             beforerender: {//getConfigParamFromTable
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                        extraParams: {
                                            table_name: 'par_classifications'
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
            dataIndex: 'Category',
            name: 'Category',
            text: 'Category',
            width: 200, hidden: true,
           filter: {
                        xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'Category_id',
                        listeners:
                         {
                             afterrender: {//getConfigParamFromTable
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                         extraParams: {
                                            table_name: 'par_product_subcategories'
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
            dataIndex: 'SubCategory',
            name: 'SubCategory',
            text: 'SubCategory',
            width: 200, hidden: true,
            filter: {
                xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'SubCategory_id',
                        listeners:
                         {
                             afterrender: {//getConfigParamFromTable
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                         extraParams: {
                                            table_name: 'par_subproduct_categories'
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
            dataIndex: 'SpecialCategory',
            name: 'SpecialCategory',
            text: 'SpecialCategory',
            width: 200, hidden: true,
            filter: {
                xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'SpecialCategory_id',
                        listeners:
                         {
                             afterrender: {//getConfigParamFromTable
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                         extraParams: {
                                            table_name: 'par_productspecial_categories'
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
            dataIndex: 'ProductType',
            name: 'ProductType',
            text: 'ProductType',
            width: 200, hidden: true,
             filter: {
                xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'ProductType_id',
                        listeners:
                         {
                             afterrender: {//getConfigParamFromTable
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                         extraParams: {
                                            table_name: 'par_product_types'
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
            dataIndex: 'ProductForm',
            name: 'ProductForm',
            text: 'ProductForm',
            width: 150, hidden: true,
            filter: {
                xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        name: 'ProductForm_id',
                        valueField: 'id',
                        listeners:
                         {
                             afterrender: {//getConfigParamFromTable
                               fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                        extraParams: {
                                            table_name: 'par_dosage_forms'
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
            dataIndex: 'physical_description',
            name: 'physical_description',
            text: 'Physical Description',
            width: 150, hidden: true,
            filter: {
                    xtype: 'textfield',
                    }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'StorageCondition',
            name: 'StorageCondition',
            text: 'Storage Condition',
            width: 150, hidden: true,
            filter: {
                    xtype: 'textfield',
                    }
        },
         {
            xtype: 'gridcolumn',
            dataIndex: 'shelf_life',
            name: 'shelf_life',
            text: 'shelf life(Months)',
            width: 200, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'shelf_lifeafter_opening',
            name: 'shelf_lifeafter_opening',
            text: 'Shelf Life After Open',
            width: 200, hidden: true,
            filter: {
                    xtype: 'textfield',
                    }
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'shelflifeduration_desc',
            name: 'shelflifeduration_desc',
            text: 'Duration Description',
            width: 200, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'instructions_of_use',
            name: 'instructions_of_use',
            text: 'Instruction of use',
            width: 210, hidden: true,
            filter: {
                    xtype: 'textfield',
                    }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'warnings',
            name: 'warnings',
            text: 'warnings',
            width: 150, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'IntendedUsers',
            name: 'IntendedUsers',
            text: 'Intended End Users',
            width: 210, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'Applicant',
            name: 'Applicant',
            text: 'Applicant',
            width: 150, hidden: true,
             filter: {
                        xtype: 'textfield'                
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'ApplicantPostalA',
            name: 'ApplicantPostalA',
            text: 'Applicant Postal Address',
            width: 200, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'ApplicantPhysicalA',
            name: 'ApplicantPhysicalA',
            text: 'Applicant Physical Address',
            width: 210, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'ApplicantTell',
            name: 'ApplicantTell',
            text: 'Applicant Tell',
            width:200, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'ApplicantMobile',
            name: 'ApplicantMobile',
            text: 'Applicant Mobile No.',
            width:200, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'ApplicantEmail',
            name: 'ApplicantEmail',
            text: 'Applicant Email',
            width: 200, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'ApplicantCountry',
            name: 'ApplicantCountry',
            text: 'Applicant Country',
            width:200, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'ApplicantRegion',
            name: 'ApplicantRegion',
            text: 'Applicant Region',
            width:200, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'LocalAgent',
            name: 'LocalAgent',
            text: 'Local Agent',
            width: 200, hidden: true,
            filter: {
                        xtype: 'textfield'
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'LocalAgentPostalA',
            name: 'LocalAgentPostalA',
            text: 'Local AgentPostalAddress',
            width: 210, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'LocalAgentPhysicalA',
            name: 'LocalAgentPhysicalA',
            text: 'Local AgentPhysical Address',
            width: 210, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'LocalAgentTell',
            name: 'LocalAgentTell',
            text: 'Local Agent Tell',
            width: 210, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'AgentMobile',
            name: 'AgentMobile',
            text: 'Agent Mobile NO',
            width: 210, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'LocalAgentEmail',
            name: 'LocalAgentEmail',
            text: 'Local Agent Email',
            width: 210, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },{
            xtype: 'gridcolumn',
            dataIndex: 'AgentCountry',
            name: 'AgentCountry',
            text: 'Local Agent Country',
            width: 210, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'AgentRegion',
            name: 'AgentRegion',
            text: 'Local Agent Region',
            width: 210, hidden: true,
            filter: {
                    xtype: 'textfield',
                }
        },  
        {
            xtype: 'datecolumn',
            dataIndex: 'submission_date',
            name: 'submission_date',
             format: 'Y-m-d',
            text: 'Application Date',
            width: 210, hidden: true,
            filter: {
                    xtype: 'datefield',
                    format: 'Y-m-d'
                }
        },{
            xtype: 'datecolumn',
            dataIndex: 'CertIssueDate',
            name: 'CertIssueDate',
             format: 'Y-m-d',
            text: 'Certificate Issue Date',
            width: 210, hidden: true,
            filter: {
                    xtype: 'datefield',
                    format: 'Y-m-d'
                }
        }, {
            xtype: 'datecolumn',
            dataIndex: 'CertExpiryDate',
            name: 'CertExpiryDate',
             format: 'Y-m-d',
            text: 'Certificate Expiry Date',
            width: 210, hidden: true,
            filter: {
                    xtype: 'datefield',
                    format: 'Y-m-d'
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
            text: 'Application No',
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
        },{
            xtype: 'datecolumn',
            dataIndex: 'IssueFrom',
            name: 'IssueFrom',
            format: 'Y-m-d',
            text: 'Issue From',
            width: 210, hidden: true,
            filter: {
                    xtype: 'datefield',
                    format: 'Y-m-d'
                }
        }, {
            xtype: 'datecolumn',
            dataIndex: 'IssueTo',
            name: 'IssueTo',
             format: 'Y-m-d',
            text: 'Issue To',
            width: 210, hidden: true,
            filter: {
                    xtype: 'datefield',
                    format: 'Y-m-d'
                }
        },
         {
            xtype: 'gridcolumn',
            dataIndex: 'product_strength',
            name: 'product_strength',
            text: 'Product Strength',
            width: 150,
            filter: {
                    xtype: 'textfield',
                }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'certificate_no',
            name: 'certificate_no',
            text: 'Marketing Authorisation No',
            width: 150,
            filter: {
                xtype: 'textfield',
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'atc_code',
            name: 'atc_code',
            text: 'ATC Code',
            width: 150,
            filter: {
                xtype: 'textfield',
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'atc_code_defination',
            name: 'atc_code_defination',
            text: 'ATC Code Defination',
            width: 150,
            filter: {
                xtype: 'textfield',
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'registration_status',
            name: 'registration_status',
            text: 'Registration Status',
            width: 200,
           filter: {
                        xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'registration_status',
                        listeners:
                         {
                             afterrender: {//getConfigParamFromTable
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                         extraParams: {
                                            table_name: 'par_registration_statuses'
                                        }
                                    }
                                },
                               isLoad: true
                            },
                                       
                         
                         change: function(combo, newval, oldVal, eopts) {
                            var store = combo.up('grid').getStore();
                            store.reload();
                         }
                     }                
                }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'validity_status',
            name: 'validity_status',
            text: 'Validity Status',
            width: 200,
           filter: {
                        xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'validity_status',
                        listeners:
                         {
                             afterrender: {//getConfigParamFromTable
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                         extraParams: {
                                            table_name: 'par_validity_statuses'
                                        }
                                    }
                                },
                               isLoad: true
                            },
                                       
                         
                         change: function(combo, newval, oldVal, eopts) {
                            var store = combo.up('grid').getStore();
                            store.reload();
                         }
                     }                
                }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'retention_status',
            name: 'retention_status',
            text: 'Retention Status',
            width: 200,
            filter: {
                        xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'retention_status',
                        listeners:
                         {
                             afterrender: {//getConfigParamFromTable
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                         extraParams: {
                                            table_name: 'par_retention_statuses'
                                        }
                                    }
                                },
                               isLoad: true
                            },
                                       
                         
                         change: function(combo, newval, oldVal, eopts) {
                            var store = combo.up('grid').getStore();
                            store.reload();
                         }
                     }                
                }
        }
        ,{
            xtype: 'gridcolumn',
            dataIndex: 'application_status',
            name: 'application_status',
            text: 'Application Status',
            width: 200,
            filter: {
                        xtype: 'combobox',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        name: 'application_status',
                        listeners:
                         {
                             afterrender: {//getConfigParamFromTable
                                fn: 'setConfigCombosStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                         extraParams: {
                                            table_name: 'par_system_statuses'
                                        }
                                    }
                                },
                               isLoad: true
                            },
                                       
                         
                         change: function(combo, newval, oldVal, eopts) {
                            var store = combo.up('grid').getStore();
                            store.reload();
                         }
                     }                
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
                     Classification_id=grid.down('combo[name=Classification_id]').getValue(),
                     Category_id=grid.down('combo[name=Category_id]').getValue(),
                     ProductForm_id=grid.down('combo[name=ProductForm_id]').getValue(),
                     ProductType_id=grid.down('combo[name=ProductType_id]').getValue(),
                     SpecialCategory_id=grid.down('combo[name=SpecialCategory_id]').getValue(),
                     registration_status=grid.down('combo[name=registration_status]').getValue(),
                     validity_status=grid.down('combo[name=validity_status]').getValue(),
                     application_status=grid.down('combo[name=application_status]').getValue(),
                     SubCategory_id=grid.down('combo[name=SubCategory_id]').getValue(),
                     retention_status=grid.down('combo[name=retention_status]').getValue();
                     
               //acquire original filters
               var filter = {'t1.section_id':sectionid,'t1.sub_module_id':sub_module};
               var   filters = JSON.stringify(filter);

              //pass to store
              var store=this.getStore();
                store.getProxy().extraParams = {
                    pageSize:range,
                    Classification: Classification_id,
                    Category: Category_id,
                    ProductForm: ProductForm_id,
                    ProductType: ProductType_id,
                    SpecialCategory: SpecialCategory_id,
                    SubCategory: SubCategory_id,
                    registration_status:registration_status,
                    validity_status:validity_status,
                    application_status: application_status,
                    retention_status:retention_status,
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
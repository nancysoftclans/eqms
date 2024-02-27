/**
 */
Ext.define('Admin.view.commoninterfaces.forms.DrugsSampleDetailsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'drugssampledetailsfrm',
    bodyPadding: 5,
    layout: 'column',
    autoScroll: true,
    height: Ext.Element.getViewportHeight() - 120,
    scrollable: true,
    defaults: {
        columnWidth: 0.33,
        margin: 5,
        labelAlign: 'top',
        allowBlank: false
    },
    items: [{
        xtype: 'hiddenfield',
        name: 'branch_id'
    }, {
        xtype: 'hiddenfield',
        name: 'limssample_id'
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Lab Station',
        emptyText: 'Laboratory Station',
        name: 'laboratory_id',
        forceSelection: true,
        queryMode: 'local',
        anyMatch: true,
        valueField: 'id',
        displayField: 'name',
        listeners: {
            afterrender: {
                fn: 'setConfigCombosSampleSectionfilterStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'sampleanalysis/getSampleAnalyisParameter',
                        extraParams: {
                            table_name: 'laboratory_stations',
                            has_filter: 0
                        }
                    }
                },
                isLoad: true
            }
        }
    }, {
        xtype: 'fieldcontainer',
        layout: 'column',
        defaults: {
            labelAlign: 'top'
        },
        fieldLabel: 'Sample Name',
        items: [
            {
                xtype: 'textfield',
                name: 'brand_name',
                allowBlank: false,
                columnWidth: 0.9
            },
            {
                xtype: 'button',
                iconCls: 'x-fa fa-search',
                columnWidth: 0.1,
                tooltip: 'Search Sample',
                action: 'search_sample',
                childXtype: 'sampleselectiongrid',
                winTitle: 'Sample/Product Selection List',
                winWidth: '90%'
            }
        ]
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Sample Category',
        emptyText: 'Sample Category',
        name: 'sample_category_id',
        forceSelection: true,
        queryMode: 'local',
        anyMatch: true,
        valueField: 'id',
        displayField: 'name',
        listeners: {
            afterrender: {
                fn: 'setConfigCombosSampleSectionfilterStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'sampleanalysis/getSampleAnalyisParameter',
                        extraParams: {
                            table_name: 'samplecategory',
                            has_filter: 0
                        }
                    }
                },
                isLoad: true
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Dosage Form',
        name: 'dosage_form_id',
        forceSelection: true,
        queryMode: 'local',
        anyMatch: true,
        valueField: 'id',
        displayField: 'name',
        listeners: {
            beforerender: {
                fn: 'setConfigCombosSampleSectionfilterStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'sampleanalysis/getSampleAnalyisParameter',
                        extraParams: {
                            table_name: 'dosageform',
                            has_filter: 1
                        }
                    }
                },
                isLoad: true
            }
        }
    }, {
        xtype: 'textfield',
        fieldLabel: 'Batch No',
        name: 'batchno'
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Test Purpose',
        emptyText: 'Test Purpose',
        name: 'sample_purpose',
        forceSelection: true,
        queryMode: 'local',
        anyMatch: true,
        valueField: 'id',
        displayField: 'name',
        listeners: {
            beforerender: {
                fn: 'setConfigCombosSampleSectionfilterStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'sampleanalysis/getSampleAnalyisParameter',
                        extraParams: {
                            table_name: 'sample_purpose',
                            has_filter: 0
                        }
                    }
                },
                isLoad: true
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Classification',
        name: 'classification_id',
        forceSelection: true,
        queryMode: 'local',
        anyMatch: true,
        valueField: 'id',
        displayField: 'name',
        listeners: {
            beforerender: {
                fn: 'setConfigCombosSampleSectionfilterStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'sampleanalysis/getSampleAnalyisParameter',
                        extraParams: {
                            table_name: 'classification',
                            has_filter: 1
                        }
                    }
                },
                isLoad: true
            }
        }
    }, {
        fieldLabel: 'Submission Date',
        xtype: 'datefield',
        name: 'submission_date',
        maxValue: new Date(),
        readOnly: true,
        value: new Date(),
        submitFormat: 'Y-m-d',
        format: 'd/m/Y',
        altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00'
    }, {
        fieldLabel: 'Manufacturer Date',
        xtype: 'datefield',
        name: 'manufacturedate',
        maxValue: new Date(),
        submitFormat: 'Y-m-d',allowBlank: true,
        format: 'd/m/Y',
        altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00'

    }, {
        fieldLabel: 'Expiry Date',
        xtype: 'datefield',
        name: 'expirydate',
        submitFormat: 'Y-m-d',
        format: 'd/m/Y',allowBlank: true,
        altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00'
    }, {
        xtype: 'fieldcontainer',
        layout: 'column',
        fieldLabel: 'Quantity & Units',
        defaults: {
            labelAlign: 'top',
            allowBlank: true
        },
        items: [{
            xtype: 'textfield',
            columnWidth: 0.6,
            emptyText: 'Quantity',
            name: 'quantity',
            allowBlank: true
        }, {
            xtype: 'combo', anyMatch: true,
            emptyText: 'Quantity Units',
            name: 'quantity_unit_id',
            forceSelection: true,
            queryMode: 'local',
            anyMatch: true,
            columnWidth: 0.4,
            valueField: 'id',
            displayField: 'name',
            listeners: {
                beforerender: {
                    fn: 'setConfigCombosSampleSectionfilterStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            url: 'sampleanalysis/getSampleAnalyisParameter',
                            extraParams: {
                                table_name: 'packaging_units',
                                has_filter: 1
                            }
                        }
                    },
                    isLoad: true
                }
            }
        }]
    }, {
        xtype: 'fieldcontainer',
        layout: 'column',
        fieldLabel: 'Packaging Size',
        defaults: {
            labelAlign: 'top',
            allowBlank: true
        },
        items: [{
            emptyText: 'Packaging Size',
            xtype: 'textfield',
            columnWidth: 0.6,
            name: 'pack_size',
            allowBlank: true
        }, {
            xtype: 'combo', anyMatch: true,
            name: 'pack_unit_id',
            emptyText: 'Packaging Size Units',
            forceSelection: true,
            columnWidth: 0.4,
            queryMode: 'local',
            anyMatch: true,allowBlank: true,
            valueField: 'id',
            displayField: 'name',
            listeners: {
                beforerender: {
                    fn: 'setConfigCombosSampleSectionfilterStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            url: 'sampleanalysis/getSampleAnalyisParameter',
                            extraParams: {
                                table_name: 'packaging_units',
                                has_filter: 1
                            }
                        }
                    },
                    isLoad: true
                }
            }
        }]
    }, {
        fieldLabel: 'Reasons for analysis',
        xtype: 'combo', anyMatch: true,
        queryMode: 'local',
        emptyText: 'Reasons for analysis',
        valueField: 'id',
        allowBlank: false,
        name: 'reason_for_analysis',
        displayField: 'name',
        listeners: {
            beforerender: {
                fn: 'setConfigCombosSampleSectionfilterStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'sampleanalysis/getSampleAnalyisParameter',
                        extraParams: {
                            table_name: 'analysisreason',
                            has_filter: 0
                        }
                    }
                },
                isLoad: true
            }

        }
    }
    ]
});
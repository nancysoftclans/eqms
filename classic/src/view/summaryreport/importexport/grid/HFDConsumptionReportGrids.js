Ext.define('Admin.view.summaryreport.importexport.grid.HFDConsumptionReportGrids',{
	extend: 'Ext.grid.Panel',
	xtype: 'hfdConsumptionReportGrids',
	width: '100%',
    listeners: {
        beforerender: {
            fn: 'setConfigGridsStore',
            config: {
                pageSize: 100,
                storeId: 'hfdConsumptionReportGridstr',
                groupField: 'controlled_drug',
                proxy: {
                    url: 'summaryreport/getHFDConsumptionLog'
                }
            },
            isLoad: true
        }
           
    },
    tbar: [{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Controlled Drug Type',
        name: 'controlleddrugs_type_id',
        forceSelection: true,
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        bind: {
            readOnly: '{isReadOnly}'
        },
        listeners: {
            beforerender: {
                fn: 'setConfigCombosStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getRegistrationApplicationParameters',
                        extraParams: {
                            table_name: 'par_controlleddrugs_types',
                            is_enabled:1
                        }
                    }
                },
                isLoad: true
            },
            change:'onChangeControlledDrugType'
        },
        triggers: {
            clear: {
                type: 'clear',
                flex: 1,
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Controlled Drugs Substance',
        name: 'controlled_drugssubstances_id',
        forceSelection: true,
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        bind: {
            readOnly: '{isReadOnly}'
        },
        listeners: {
            beforerender: {
                fn: 'setConfigCombosStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getRegistrationApplicationParameters',
                        extraParams: {
                            table_name: 'par_controlled_drugssubstances',
                            is_enabled:1
                        }
                    }
                },
                isLoad: false
            },
            change:'funcDrugsContentsCalculations'
        },
        triggers: {
            clear: {
                type: 'clear',
                flex: 1,
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Esther/Salt',
        name: 'controlleddrugs_basesalt_id',
        forceSelection: true,
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        bind: {
            readOnly: '{isReadOnly}'
        },
        listeners: {
            beforerender: {
                fn: 'setConfigCombosStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'configurations/getRegistrationApplicationParameters',
                        extraParams: {
                            table_name: 'par_controlleddrugs_basesalts',
                            is_enabled:1
                        }
                    }
                },
                isLoad: true
            },
            change:'func_normalGrid'
        },
        triggers: {
            clear: {
                type: 'clear',
                flex: 1,
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    },{
        xtype: 'datefield',
        name: 'year',
        submitFormat: 'Y',
        fieldLabel: 'Year',
        format: 'Y',
        listeners: {
            change: 'func_normalGrid'
        },
        triggers: {
            clear: {
                type: 'clear',
                flex: 1,
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    },{
        xtype: 'exportbtn'
    }],
    features: [
        {
            ftype: 'grouping',
            startCollapsed: true,
            hideGroupedHeader: false,
            enableGroupingMenu: false
        }
    ],
    plugins: [{
        ptype: 'gridexporter'
    }],
    export_title: 'HFD Utilization',
	columns: [{
        xtype: 'rownumberer'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'controlled_drug',
        name: 'controlled_drug',
        text: 'Drug Type',
        flex: 1,
        tbCls: 'wrap',
    },{
        xtype: 'gridcolumn',
        dataIndex: 'controlled_drug_substance',
        name: 'controlled_drug_substance',
        text: 'Controlled Substance',
        flex: 1,
        tbCls: 'wrap',
    },{
        xtype: 'gridcolumn',
        dataIndex: 'controlled_drug_salt',
        name: 'controlled_drug_salt',
        text: 'Salt',
        flex: 1,
        tbCls: 'wrap',
    },{
        xtype: 'gridcolumn',
        dataIndex: 'year',
        name: 'year',
        width: 150,
        text: 'Received',
    },{
        xtype: 'gridcolumn',
        dataIndex: 'quota_quantity',
        name: 'quota_quantity',
        width: 150,
        text: 'Allocated Quota',
    },{
        xtype: 'gridcolumn',
        dataIndex: 'quantity',
        name: 'quantity',
        width: 150,
        text: 'Imported Quantity (KG)'
    }
    ],
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '80%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} out of {2}',
        emptyMsg: 'No Records',
        beforeLoad: function() {
        		var grid=this.up('grid'),
                   controlleddrugs_type_id = grid.down('combo[name=controlleddrugs_type_id]').getValue(),
                   year = grid.down('datefield[name=year]').getSubmitValue(),
		           controlled_drugssubstances_id = grid.down('combo[name=controlled_drugssubstances_id]').getValue(),
		           controlleddrugs_basesalt_id = grid.down('combo[name=controlleddrugs_basesalt_id]').getValue();

        		 var store=this.getStore();
        		 store.getProxy().extraParams = {
                        controlleddrugs_type_id: controlleddrugs_type_id,
                        controlled_drugssubstances_id:controlled_drugssubstances_id,
                        year:year,
                        controlleddrugs_basesalt_id: controlleddrugs_basesalt_id
                }
                
        	},

        
        
    }]

    });
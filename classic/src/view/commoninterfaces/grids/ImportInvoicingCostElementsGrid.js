/**
 * Robinson Odhiambo
 * on 10/12/2018.
 */
Ext.define('Admin.view.premiseregistration.views.grids.ImportInvoicingCostElementsGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'premiseregistrationvctr',
    xtype: 'importinvoicingcostelementsgrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var is_enabled = record.get('is_enabled');
            if (is_enabled == 0 || is_enabled === 0) {
                return 'invalid-row';
            }
        }
    },
    selModel: {
        selType: 'checkboxmodel',
        mode: 'single',
    },
    tbar: [
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Fee Type',
            name: 'fee_type_id',
            valueField: 'id',
            labelWidth: 80,
            width: 380,
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            fieldStyle: {
                'font-weight': 'bold'
            },
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        storeId: 'feetypesstr',
                        proxy: {
                            extraParams:{
                                table_name: 'par_fee_types'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Cost Category',
            // store: 'costcategoriesstr',
            name: 'cost_category_id',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            width: 380,
            fieldStyle: {
                'font-weight': 'bold'
            },
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        storeId: 'costcategoriesstr',
                        proxy: {
                            extraParams:{
                                table_name: 'par_cost_categories'
                            }
                        }
                    },
                    isLoad: true
                },
                change: function (cmbo, newVal) {
                    var grid = cmbo.up('grid'),
                        costSubStore = grid.down('combo[name=cost_subcategory_id]').getStore(),
                        filter = {
                            cost_category_id: newVal
                        };
                        filter = JSON.stringify(filter);
                    costSubStore.removeAll();
                    costSubStore.load({params: {filter: filter}});
                }
            },
            triggers: {
                clear: {
                    type: 'clear',
                    hideWhenEmpty: true,
                    hideWhenMouseOut: false,
                    clearOnEscape: true
                }
            }
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Cost Sub Category',
            labelWidth: 130,
            valueField: 'id',
            name: 'cost_subcategory_id',
            displayField: 'name',
            forceSelection: true,
            width: 380,
            queryMode: 'local',
            fieldStyle: {
                'font-weight': 'bold'
            },
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        storeId: 'costsubcategoriesstr',
                        proxy: {
                            extraParams:{
                                table_name: 'par_cost_sub_categories'
                            }
                        }
                    },
                    isLoad: true
                },
                change: function (cmbo) {
                    var grid = cmbo.up('grid'),
                        grid_store = grid.getStore();
                    grid_store.load();
                }
            },
            triggers: {
                clear: {
                    type: 'clear',
                    hideWhenEmpty: true,
                    hideWhenMouseOut: false,
                    clearOnEscape: true
                }
            }
        }
    ],
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        hidden: true,
        beforeLoad: function () {
            var store = this.store,
                grid = this.up('grid'),
                fee_type = grid.down('combo[name=fee_type_id]').getValue(),
                cost_subcategory = grid.down('combo[name=cost_subcategory_id]').getValue();
            store.getProxy().extraParams = {
                fee_type: fee_type,
                cost_subcategory: cost_subcategory
            };
        }
    }],
    /*  features: [{
          ftype: 'searching',
          minChars: 2,
          mode: 'local'
      }],*/
    listeners: {
        beforerender: {
            fn: 'setPremiseRegGridsStore',
            config: {
                pageSize: 10000,
                storeId: 'invoicingcostelementsstr',
                proxy: {
                    url: 'common/getElementCosts'
                }
            },
            isLoad: false
        }
    },
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'element',
        text: 'Cost Element',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'sub_element',
        text: 'Sub Element',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'cost',
        text: 'Cost',
        flex: 1,
        renderer: function (val) {
            return Ext.util.Format.number(val, '0,000.00');
        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'currency',
        text: 'Currency',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'formula',
        text: 'Is Formula',
        flex: 0.2,
        renderer: function (value, metaData) {
            if(value) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "True";
            }
            metaData.tdStyle = 'color:white;background-color:red';
            return "False";
        }

    } ,]
});

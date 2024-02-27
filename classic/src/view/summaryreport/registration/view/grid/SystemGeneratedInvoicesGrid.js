Ext.define('Admin.view.summaryreport.registration.view.grid.SystemGeneratedInvoicesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'systemgeneratedinvoicesgrid',
    controller: 'registrationreportviewctr',
    height: Ext.Element.getViewportHeight() - 118,
    tbar: [{
        xtype: 'hiddenfield',
        fieldLabel: 'module_id',
        name: 'module_id',
        readOnly: true
    },{
        xtype: 'textfield',
        fieldLabel: 'Reference',
        name: 'reference_no',
        readOnly: true
    },{
        xtype: 'combo',
        fieldLabel: 'Applicable Documents',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        name: 'doc_type',
        queryMode: 'local',
        readOnly: true,
        labelStyle: "font-weight:bold",
        listeners: {
            beforerender: {
                    fn: 'setOrgConfigCombosStore',
                    config: {
                        pageSize: 100,
                        proxy: {
                        url: 'configurations/getConfigParamFromTable',
                        extraParams: {
                            table_name: 'par_document_types'
                        }
                       }
                    },
                    isLoad: true
                }
        }
       }],
	   bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        //store: 'uploadedDocStr', set by controller
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function () {
             var filters=this.up('grid'),
                 type=filters.down('combo[name=doc_type]').getValue(),
                 module_id=filters.down('hiddenfield[name=module_id]').getValue(),
                 Reference=filters.down('textfield[name=reference_no]').getValue(),
                 Store=this.getStore();

            Store.getProxy().extraParams = {
                        doc_type:type,
                        module_id:module_id,
                        reference_no:Reference
                }
            }
    }],
   listeners: {
        beforerender: {
            fn: 'setPremiseRegGridsStore',
            config: {
                pageSize: 10000,
                storeId: 'systemgeneratedinvoicesgridstr',
                proxy: {
                    url: 'revenuemanagement/getApplicationRaisedInvoices'
                }
            },
            isLoad: true
        }
    },
    columns: [{
        xtype: 'rownumberer'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'invoice_no',
        text: 'Invoice No',
        flex: 1
    },{
        xtype: 'datecolumn',
        dataIndex: 'date_of_invoicing',
        text: 'Invoice Date',
        format: 'Y-m-d',
        flex: 1,
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'total_element_amount',
        text: 'Total Cost',
        flex: 1,
        summaryType: 'sum',
        renderer: function (val, meta, record) {
            return Ext.util.Format.number(val, '0,000.00');
        },
        summaryRenderer: function (val) {
            val = Ext.util.Format.number(val, '0,000.00');
            return '<b>' + val + '</b>';
        }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'currency',
        text: 'Currency',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'exchange_rate',
        text: 'Exchange Rate(Current)',
        flex: 1,
        renderer: function (val) {
            return Ext.util.Format.number(val, '0,000.00');
        }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'equivalent_paid',
        text: 'Equivalent(Paying Curreny)',
        flex: 1,
        summaryType: 'sum',
        renderer: function (val,meta) {
            meta.tdStyle = 'color:#005985';
            return Ext.util.Format.number(val, '0,000.00');
        },
        summaryRenderer: function (val) {
            val = Ext.util.Format.number(val, '0,000.00');
            return '<b>' + val + '</b>';
        }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'invoice_type',
        text: 'Invoice Type',
        flex: 1
    }, {
        text: 'Options',
        xtype: 'widgetcolumn',
        width: 90,
        widget: {
            width: 75,
            textAlign: 'left',
            xtype: 'button',
            iconCls: 'x-fa fa-print',
            ui: 'soft-green',
            name:'print_invoice',
            text: 'Print Invoice',
            report_type: 'Invoice',
            handler: 'funcPrintGeneratedInvoice'
        }
    }]
    
});
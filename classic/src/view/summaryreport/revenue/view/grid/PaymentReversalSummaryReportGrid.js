Ext.define('Admin.view.summaryreport.revenue.view.grid.PaymentReversalSummaryReportGrid', {
    extend: 'Ext.grid.Panel',
    controller: 'revenueReportViewCtr',
    xtype: 'paymentreversalsummaryreportgrid',
    cls: 'dashboard-todo-list',
    autoScroll: true,
    autoHeight: true,
    width: '100%',

    bbar: [{
        xtype: 'pagingtoolbar',
        displayInfo: true,
        width: '70%',
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function() {
            var grid = this.up('grid'),
                pnl = grid.up('panel'),
                form = pnl.down('form'),
                store = this.getStore(),
                form_values = form.getValues();
            //form_values = convert_object(form_values);
            Ext.apply(store.getProxy().extraParams, form.getValues());

        }
    },'->',{
        text: 'Export Detailed Reports',
        handler: 'func_exportRevenueReport',
        xFileName: 'PaymentReversalSummaryReport',
        xPrintFunc: 'getProductsRevenue'
    }],

    listeners: {
        beforerender: {
            fn: 'setConfigGridsStore',

            config: {
                pageSize: 100,
                storeId: 'paymentreversalsummaryreportgridStr',
                remoteFilter: true,
                groupField: 'applicant_name',
                proxy: {
                    url: 'summaryreport/getApprovedPaymentsREversalsummaryReport'
                }
            },
            isLoad: true
        }
    }, 
    plugins: [{
        ptype: 'filterfield'
    }, {
        ptype: 'gridexporter'
    }],
    features: [
        {
            ftype: 'grouping',
            startCollapsed: false,
            groupHeaderTpl: 'Applicant: {[values.rows[0].data.applicant_name]}, [{rows.length} {[values.rows.length > 1 ? "Requests" : "Request"]}]',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }
    ],
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'reference_no',
        text: 'Reference Number',
        flex: 1, filter: {
            xtype: 'textfield'
        }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'tracking_no',
        text: 'Tracking Number',
        flex: 1, filter: {
            xtype: 'textfield'
        }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'invoice_no',
        text: 'Invoice Number',
        flex: 1, filter: {
            xtype: 'textfield'
        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'receipt_no',
        text: 'Receipt Number',
        flex: 1, filter: {
            xtype: 'textfield'
        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'amount_paid',
        text: 'Amount Reversed',
        flex: 1,
        filter: {
            xtype: 'textfield'
        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'currency',
        text: 'Currency',
        flex: 1,
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'exchange_rate',
        text: 'Exchange Rate',
        flex: 1,
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'amount_in_tsh',
        text: 'Amount(Converted)',
        flex: 1
    }, {
        xtype: 'datecolumn',
        dataIndex: 'trans_date',
        text: 'Transaction Date',
        flex: 1,
        filter: {
            xtype: 'datefield'
        }
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'requested_by',
        text: 'Requested By'
    }, {
        xtype: 'datecolumn',
        dataIndex: 'requested_on',
        format: 'Y-m-d',
        text: 'Requested_on'
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'approved_by',
        text: 'Approved By',
        flex: 1
    }, {
        xtype: 'datecolumn',
        dataIndex: 'approved_on',
        text: 'Approved On',
        flex: 1
    }, {
        xtype: 'gridcolumn',
        dataIndex: 'reason',
        text: 'Reason/Description',
        flex: 1
    },{
        text: 'Options',
        xtype: 'widgetcolumn',
        width: 90,
        widget: {
            width: 75,
            textAlign: 'left',
            xtype: 'button',
            hidden: true,
            iconCls: 'x-fa fa-print',
            ui: 'soft-blue',
            text: 'Print Receipt',
            iconCls: 'x-fa fa-file-pdf-o',
            report_type: 'Receipt',
            handler: 'printColumnReceipt'
        }
    }]
    
});

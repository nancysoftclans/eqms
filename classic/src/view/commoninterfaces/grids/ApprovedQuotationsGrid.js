Ext.define('Admin.view.commoninterfaces.grids.ApprovedQuotationsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'approvedQuotationsGrid',
    cls: 'dashboard-todo-list',
    // header: false,
    controller: 'commoninterfacesVctr',
    autoScroll: true,
    // autoHeight: true,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'No Quotations Found',
    },
    
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '80%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function(){
            var grid = this.up('grid'),
                pnl = grid.up('panel'),
                module_id = pnl.down('hiddenfield[name=module_id]').getValue(),
                application_code = pnl.down('hiddenfield[name=active_application_code]').getValue(),
                store = this.getStore();
            store.removeAll();
            store.getProxy().extraParams = {
                application_code: application_code,
                module_id: module_id
            }
        }
    },'->',{
        xtype: 'button',
        text: 'Generate Invoice',
        name: 'generate_invoice',
        ui: 'soft-blue',
        disabled: true,
        iconCls: 'fa fa-money-bill-wave',
        action_url: 'revenuemanagement/generateInvoiceBasedonQuote',
        handler: 'InvoiceOnlineApplicationDetails'
    }],

    selModel:{
        selType: 'checkboxmodel',
        mode: 'SINGLE'
    },
    // features: [{
    //     ftype: 'searching',
    //     minChars: 2,
    //     mode: 'local'
    // }],
    listeners: {
        beforerender: {
            fn: 'setPremiseRegGridsStore',
            config: {
                pageSize: 100,
                storeId: 'applicationApprovedQuotationStr',
                proxy: {
                    url: 'revenuemanagement/getApprovedInvoiceQuotation',
                    
                }
            },
            isLoad: true
        },
        select: function(sel, record, index, eOpts) {
            var me = this,
                grid = sel.view.grid,
                selCount = grid.getSelectionModel().getCount();
            if (selCount > 0 && record.get('is_cleared') ==1 ) {
                grid.down('button[name=generate_invoice]').setDisabled(false);
            }else{
                grid.down('button[name=generate_invoice]').setDisabled(true);
            }
    
         }
    },
    columns: [{
        xtype: 'gridcolumn',
        text: 'Fee Type',
        width: 200,
        tdCls: 'wrap',
        dataIndex: 'fee_type',
    },{
        xtype: 'gridcolumn',
        text: 'Cost Element',
        width: 300,
        tdCls: 'wrap',
        dataIndex: 'element',
     },{
        xtype: 'gridcolumn',
        text: 'Application Fee Type',
        width: 150,
        tdCls: 'wrap',
        dataIndex: 'cost_type',
     },{
        xtype: 'gridcolumn',
        width: 150,
        tdCls: 'wrap',
        text: 'Is Fast Track',
        dataIndex: 'is_fast_track',
        renderer: function (value, metaData) {
            if (value) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Yes";
            }

            metaData.tdStyle = 'color:white;background-color:red';
            return "No";
        }
    },{
        xtype: 'gridcolumn',
        width: 150,
        tdCls: 'wrap',
        dataIndex: 'currency',
        text: 'Cost Currency',
    },{
        xtype: 'gridcolumn',
        text: 'Cost',
        width: 150,
        tdCls: 'wrap',
        dataIndex: 'cost'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'is_dispatched',
        text: 'Is Dispatched',
        width: 150,
        tdCls: 'wrap',
        renderer: function (value, metaData) {
            if (value) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Shared";
            }

            metaData.tdStyle = 'color:white;background-color:red';
            return "Pending";
        }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'balance',
        width: 150,
        tdCls: 'wrap',
        text: 'Balance'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'amount_paid',
        width: 150,
        tdCls: 'wrap',
        text: 'Amount Paid'
    },{
        xtype: 'gridcolumn',
        dataIndex: 'is_cleared',
        text: 'Payment Status',
        width: 150,
        tdCls: 'wrap',
        renderer: function (value, metaData) {
            if (value) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "Cleared";
            }

            metaData.tdStyle = 'color:white;background-color:red';
            return "Pending";
        }
    }, {
        text: 'Options',
        xtype: 'widgetcolumn',
        width: 150,
        widget: {
            textAlign: 'left',
            xtype: 'button',
            iconCls: 'x-fa fa-print',
            ui: 'soft-blue',
            name:'print_invoice',
            text: 'Print Quote',
            report_type: 'quote',
            handler: 'printQuote'
        }
    },{
        text: 'Options',
        xtype: 'widgetcolumn',
        width: 150,
        widget: {
            textAlign: 'left',
            xtype: 'splitbutton',
            iconCls: 'x-fa fa-th-list',
            ui: 'gray',
            menu: {
                xtype: 'menu',
                items: [{
                    text: 'Share with Customer',
                    iconCls: 'fa fa-mail-bulk',
                    tooltip: 'dispach the quote to the customer',
                    action: 'share_customer',
                    handler: 'shareQuotewithCustomer',
                    // bind: {
                    //     disabled: '{isReadOnly}'
                    // },
                },{
                    text: 'Receive Payments',
                    iconCls: 'fa fa-money-bill-wave',
                    tooltip: 'receive Invoice Payment',
                    action: 'receive_payments',
                    winTitle: 'Account Transactions',
                    winWidth: '60%',
                    name: 'receive_payments',
                    childXtype: 'paymentsreceptionfrm',
                    handler: 'receiveInvoicePayment',
                    bind: {
                        disabled: '{isReadOnly}'
                    },
                },{
                    text: 'View Payments',
                    iconCls: 'x-fa fa-eye',
                    tooltip: 'View Payment Receipts',
                    action: 'view',
                    childXtype: 'cmnpaymentreceiptsGrid',
                    winWidth: '70%',
                    handler: 'showPaymentReceiptsWin',
                    bind: {
                        disabled: '{isReadOnly}'
                    },
                    stores: '[]'
                }
                ]
            }
        }, onWidgetAttach: function (col, widget, rec) {
            var is_cleared = rec.get('is_cleared');
            var is_receipting_stage = rec.get('is_receipting_stage');
            var is_dispatched = rec.get('is_dispatched');
            if (is_cleared === 0 || is_cleared == 0 || is_receipting_stage != 1) {
                // widget.down('menu menuitem[action=receive_payments]').setVisible(true);
                widget.up('grid').down('button[name=generate_invoice]').setDisabled(true);
            } else {
                // widget.down('menu menuitem[action=receive_payments]').setVisible(false);
                widget.up('grid').down('button[name=generate_invoice]').setDisabled(false);
            }
            if (is_dispatched === 0 || is_dispatched == 0 || is_dispatched == null) {
                widget.down('menu menuitem[action=share_customer]').setVisible(true);
                // widget.down('menu menuitem[action=receive_payments]').setVisible(false);
            } else {
               widget.down('menu menuitem[action=share_customer]').setVisible(false);
               // widget.down('menu menuitem[action=receive_payments]').setVisible(true);
            }
        }
    }],
});

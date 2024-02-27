Ext.define('Admin.view.commoninterfaces.grids.ApplicationQuotationsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'applicationQuotationsGrid',
    cls: 'dashboard-todo-list',
    // header: false,
    controller: 'commoninterfacesVctr',
    autoScroll: true,
    // autoHeight: true,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'No Quotations Found',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var is_approved_quote = record.get('is_approved_quote');
            if (is_approved_quote == 0 || is_approved_quote === 0) {
                return 'invalid-row';
            }else{
                return 'valid-row';
            }
        }
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
        text: 'Approve Quote',
        name: 'approve_quote',
        ui: 'soft-blue',
        disabled: true,
        alert_msg: 'Are you sure you want to use this quotation for billing ?',
        iconCls: 'fa fa-money-bill-wave',
        action_url: 'revenuemanagement/approveSelectedQuote',
        handler: 'InvoiceOnlineApplicationDetails'
    }],

    selModel:{
        selType: 'checkboxmodel',
        mode: 'SINGLE'
    },
    listeners: {
        beforerender: {
            fn: 'setPremiseRegGridsStore',
            config: {
                pageSize: 100,
                storeId: 'applicationQuotationStr',
                proxy: {
                    url: 'revenuemanagement/getNewInvoiceQuotation',
                    
                }
            },
            isLoad: true
        },
        select: function(sel, record, index, eOpts) {
            var me = this,
                grid = sel.view.grid,
                selCount = grid.getSelectionModel().getCount();
            if (selCount > 0 ) {
                grid.down('button[name=approve_quote]').setDisabled(false);
            }else{
                grid.down('button[name=approve_quote]').setDisabled(true);
            }
            if (record.get('is_approved_quote') == 1 ) {
                grid.up('panel').down('button[name=process_submission_btn]').setDisabled(false);
                grid.up('panel').down('button[name=approve_quote]').setDisabled(true);
                grid.up('panel').down('button[name=print_quote]').setDisabled(false);
            }else{
                grid.up('panel').down('button[name=print_quote]').setDisabled(true);
                grid.up('panel').down('button[name=process_submission_btn]').setDisabled(true);
                grid.up('panel').down('button[name=approve_quote]').setDisabled(false);
            }
            
    
         }
    },
    columns: [{
            xtype: 'gridcolumn',
            text: 'Fee Type',
            width: 300,
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
            width: 200,
            tdCls: 'wrap',
            dataIndex: 'cost_type',
         },{
            xtype: 'gridcolumn',
            width: 100,
            tdCls: 'wrap',
            text: 'Is Fast Track',
            dataIndex: 'is_fast_track',
            renderer: function (value, metaData) {
                if (value) {
                    metaData.tdStyle = 'color:white;background-color:green';
                    return "True";
                }

                metaData.tdStyle = 'color:white;background-color:red';
                return "False";
            }
        },{
            xtype: 'gridcolumn',
            text: 'Cost',
            width: 150,
            tdCls: 'wrap',
            dataIndex: 'cost'
        },{
            xtype: 'gridcolumn',
            width: 150,
            tdCls: 'wrap',
            dataIndex: 'currency',
            text: 'Cost Currency',
        }, {
            text: 'Options',
            xtype: 'widgetcolumn',
            width: 150,
            widget: {
                textAlign: 'left',
                xtype: 'button',
                iconCls: 'x-fa fa-print',
                ui: 'soft-blue',
                name:'print_quote',
                text: 'Preview Quote',
                report_type: 'quote',
                handler: 'printQuote',
                disabled: true,
            }
        }],
});

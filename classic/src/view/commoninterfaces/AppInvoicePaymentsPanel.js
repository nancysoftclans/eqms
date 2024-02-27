Ext.define('Admin.view.commoninterfaces.AppInvoicePaymentsPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'appinvoicepaymentspanel',
    layout: {
        type: 'fit'
    },
    defaults: {
        split: true
    },
    dockedItems: [ {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            margin: 2,
            items: ['->',{
                text: 'Generate Invoice',
                iconCls: 'x-fa fa-credit-card',
                ui: 'soft-blue',
                menu:{
                    xtype: 'menu',
                    items:[
                        {
                            text: 'Generate Invoice (Normal Track)',
                            application_feetype_id: 1,  
                            ui: 'soft-blue',
                            winTitle: 'Generate Invoice(Normal Track)',
                            winWidth: '60%', 
                            fasttrack_option_id: 2,
                            name: 'generate_invoice'
                
                        },{
                            text: 'Generate Invoice (Fast Track Double Charges)',
                            application_feetype_id: 1,
                            fasttrack_option_id: 1,  ui: 'soft-blue',
                            winTitle: 'Generate Invoice (Fast Track Double Charges)',
                            winWidth: '60%',
                            name: 'generate_invoice'
                        }
                    ]
                }
             }]
    }],
  
    items:[{
        xtype:'tabpanel',
        items:[{
            title: 'Invoice Details',
            xtype: 'paymentinvoicingcostdetailsgrid',
            features:[{
                ftype:'searching'
            }]
        },{
            title: 'Payments/Receipting',
            scrollable: true,
            layout: 'fit',
            xtype: 'applicationpaymentsgrid',
           features:[{
               ftype:'searching'
           }]
        }]
    }
    ]
});
Ext.define('Admin.view.commoninterfaces.views.SignaturePnl', {
    extend : 'Ext.panel.Panel',
    xtype : 'signaturePnl',
    controller: 'commoninterfacesVctr',
    height: 250,
    width: '100%',
    modal: true,
    autoShow: true,
    // title: 'Sign Terms and Conditions',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack  : 'start'
    },
    items: [{
        xtype: 'signaturePad'
    }],
    bbar: [{
        xtype: 'toolbar',
        ui: 'footer',
        layout: 'hbox',
        items: [{
            xtype: 'button',bind: {
            disabled: '{isReadOnly}'
        },
            ui: 'soft-red',
            text: 'Clear',
            handler: function (me) {
                var pnl = me.up('panel'),
                    pad = pnl.down('signaturePad');
                pad.clear();
            }
        },'->',{
            xtype: 'button',bind: {
            disabled: '{isReadOnly}'
        },
            name: 'save_signature_btn',//addAuthSignature
            ui: 'soft-blue',
            callerId: '',
            text: 'Add Signature',
            handler: 'SaveAuthSignature'
        }]
    }]
});
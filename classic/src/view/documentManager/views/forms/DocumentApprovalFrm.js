/**
 * Created by Softclans.
 */
Ext.define('Admin.view.documentManager.views.forms.DocumentApprovalFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'documentapprovalfrm',
    itemId: 'documentapprovalfrmItemId',
    controller:'documentsManagementvctr',
    layout: 'form',
    frame: true,
    defaults: {
        allowBlank: false,
        margin: 5,
        columnWidth: 1,
        labelStyle: 'font-weight:bold'
    },
    fieldDefaults: {
        fieldStyle: {
            'color': 'green',
            'font-weight': 'bold'
        }
    },
    items: [{
        xtype: 'hiddenfield',
        name: 'reg_product_id'
    },
    {
        xtype: 'hiddenfield',
        name: 'recommendation_id'
    },
    {
        xtype: 'hiddenfield',
        name: '_token',
        value: token
    },
    {
        xtype: 'hiddenfield',
        name: 'application_id'
    },
    {
        xtype: 'hiddenfield',
        name: 'application_code'
    },
    {
        xtype: 'hiddenfield',
        name: 'process_id'
    },
    {
        xtype: 'hiddenfield',
        name: 'workflow_stage_id'
    },
    {
        xtype: 'hiddenfield',
        name: 'sub_module_id'
    },
    {
        xtype: 'hiddenfield',
        name: 'module_id',
        value:26
    },
    {
        xtype: 'hiddenfield',
        name: 'table_name'
    },
    {
        xtype: 'combo', anyMatch: true,
        queryMode: 'local',
        forceSelection: true,
        valueField: 'id',
        columnWidth: 1,
        displayField: 'name',
        fieldLabel: 'Recommendation',
        name: 'decision_id',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 100,
                    storeId:'configurations/getNonrefParameter',
                    proxy: {
                        extraParams:{
                             table_name: "par_permits_reviewrecommendations"
                         }
                    }
                },
                isLoad: true
            },
            change: function (cmb, newVal) {

                var form = cmb.up('form'),
                    signatory = form.down('combo[name=dg_signatory]'),
                    permit_signatory = form.down('combo[name=permit_signatory]'),
                    expiry_date = form.down('datefield[name=expiry_date]');
                    // reason_for_conditionalapproval = form.down('htmleditor[name=reason_for_conditionalapproval]');
                    reason_for_rejection = form.down('htmleditor[name=reason_for_rejection]');

                if (newVal == 1 || newVal === 1) {
                    signatory.setDisabled(false);
                    expiry_date.setDisabled(false);
                    // reason_for_conditionalapproval.setVisible(false);
                    reason_for_rejection.setVisible(false);
                    expiry_date.setReadOnly(true);
                    expiry_date.setReadOnly(true);
                    expiry_date.allowBlank = true;
                    // reason_for_conditionalapproval.allowBlank = true;
                    reason_for_rejection.allowBlank = true;
                }else if (newVal == 2 || newVal === 2) {
                    signatory.setDisabled(true);
                    permit_signatory.allowBlank = true;
                    permit_signatory.validate();
                    permit_signatory.reset();
                    expiry_date.setDisabled(true);
                    permit_signatory.setVisible(false);
                    // reason_for_conditionalapproval.setVisible(false);
                    reason_for_rejection.setVisible(true);
                    expiry_date.allowBlank = true;
                    // reason_for_conditionalapproval.allowBlank = true;
                    reason_for_rejection.allowBlank = false;
                }
            }
        }
    },
    {
        xtype: 'datefield',
        fieldLabel: 'Approval Date',
        value: new Date(),
        maxValue: new Date(),
        columnWidth: 1,
        name: 'approval_date',
        readOnly: true,
        // disabled: true,
        submitFormat: 'Y-m-d',
        format: 'd/m/Y',
        altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00'
    },
    {
        xtype: 'textfield',
        fieldLabel: 'Permit Number',
        name: 'certificate_no',
        columnWidth: 1,
        allowBlank: true,
        readOnly: true,
        disabled: true
    },
    {
        xtype: 'datefield',
        fieldLabel: 'Expiry Date',
        allowBlank: true,
        readOnly: true,
        disabled: true,
        name: 'expiry_date',
        columnWidth: 1,
        submitFormat: 'Y-m-d',
        format: 'd/m/Y',
        altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00'
    },
    {
        xtype: 'textarea',
        fieldLabel: 'Comment',
        columnWidth: 1,
        name: 'comment',
        allowBlank: true
    },
    {
        xtype: 'combo', anyMatch: true,
        store: 'confirmationstr',
        value: 1,
        fieldLabel: 'Approval Signatory?',
        columnWidth: 1,
        queryMode: 'local',
        forceSelection: true,
        valueField: 'id',
        displayField: 'name',
        name: 'dg_signatory',
        listeners: {
            change: function (cmbo, newVal) {
                var form = cmbo.up('form'),
                    permit_signatory = form.down('combo[name=permit_signatory]');
                if (newVal == 2 || newVal === 2) {
                    permit_signatory.setVisible(true);
                    permit_signatory.allowBlank = false;
                    permit_signatory.validate();
                } else {
                    permit_signatory.setVisible(false);
                    permit_signatory.allowBlank = true;
                    permit_signatory.validate();
                }
            }
        }
    },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Permit Signatory',
        margin: '0 20 20 0',
        columnWidth: 1,
        name: 'permit_signatory',
        hidden: true,
        allowBlank: true,
        valueField: 'id',
        displayField: 'fullnames',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        url: 'usermanagement/getActiveSystemUsers'
                    }
                },
                isLoad: true
            },
            beforequery: function (record) {
                record.query = new RegExp(record.query, 'ig');
                record.forceAll = true;
            }
        }
    },{
            xtype: 'htmleditor',
            name:'reason_for_conditionalapproval',
            hidden: true,
            columnWidth: 1,
            fieldLabel:'Reasons for Conditional Approval'
    },{
            xtype: 'htmleditor',
            name:'reason_for_rejection',
            hidden: true,
            columnWidth: 1,
            fieldLabel:'Reasons for Rejection Approval'
    },
    //this part should be as shonw on all calls within the system
    {
        xtype: 'textfield',
        name: 'sign_file',//authSignature
        hidden: true,
        columnWidth: 1,
        allowBlank: true
    }
],
    dockedItems:[
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            layout: 'vbox',
            items:[{
                xtype: 'button',
                bind: {
                    disabled: '{isReadOnly}'
                },
                text: 'Send for Sigining',
                name: 'signature_btn',
                margin: '20 0 0 0',
                formBind: true,
                callerPnl: 'documentapprovalfrmItemId', //item id for reference, all calls are done from widget with itemId
                handler: 'addAuthSignature'
            },{
                xtype: 'fieldset',
                title: 'signature',
                collapsible: true,
                height: 100,
                layout: 'fit',
                margin: '0 0 20 0',
                name: 'sign_container',
                readOnly: true,
                ui: 'footer',
                items: [{
                    xtype: 'signaturePad'
                }],
                listeners: {
                    boxready : function(me) {
                        var frm = me.up('form'),
                            pad = frm.down('signaturePad'),
                            sign_data = frm.down('textfield[name=sign_file]').getValue();
                        if(sign_data){
                            pad.fromDataURL(sign_data);
                        }else{
                            pad.fromDataURL("data:image/png;base64,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")
                        }
                        pad.off();
                    }
                }
                
            }
            ]
        }
    ],
    buttons: [
        {
            xtype: 'button',
            text: 'Save Recommendation',
            ui: 'soft-blue',
            iconCls: 'x-fa fa-save',
            formBind: true,
            //hidden: true,
            name: 'save_recommendation'
        },
        {
            xtype: 'button',
            text: 'Clear',
            ui: 'soft-blue',
            hidden: true,
            iconCls: 'x-fa fa-close',
            handler: function () {
                this.up('form').getForm().reset();
            }
        }
    ]
});
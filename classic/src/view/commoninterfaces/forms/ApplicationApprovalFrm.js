Ext.define('Admin.view.commoninterfaces.forms.ApplicationApprovalFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'applicationApprovalFrm',
    layout: 'column',
    height: Ext.Element.getViewportHeight() - 118,
    bodyPadding: 5,
    controller: 'commoninterfacesVctr',
    defaults: {
        margin: 5,
        labelAlign: 'top',
        width: '100%',
        allowBlank: false,
        columnWidth: 1
    },
    items: [{   
            xtype: 'hiddenfield',
            name: 'approval_id',
            allowBlank: true
        },
        {   
            xtype: 'hiddenfield',
            name: 'application_code'
        },
        {   
            xtype: 'hiddenfield',
            name: 'sub_module_id'
        },
        {   
            xtype: 'hiddenfield',
            name: 'module_id'
        },
        {   
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        }, {
            xtype: 'combo', anyMatch: true,
            name: 'decision_id',
            allowBlank: true,
            queryMode: 'local',
            fieldLabel: 'Approval Decision',
            valueField: 'id',
            displayField: 'name',
            listeners: {
                afterrender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 10000,
                        proxy: {
                            extraParams:{
                                table_name: 'par_approval_decisions'
                            }
                        }
                    },
                    isLoad: true
                },
                change: function(combo, newVal, oldVal, eopts){
                    var form = combo.up('form'),
                        exCombo = form.down('datefield[name=expiry_date]');
                    if(newVal == 2){
                        exCombo.setVisible(false);
                    }
                    else{
                        exCombo.setVisible(true);
                    }
                }
            }
        },{
            xtype: 'datefield',
            name: 'approval_date',
            columnWidth: 1,
            format: 'Y-m-d',
            maxValue: new Date(),
            altFormats: 'Y-m-d H:i:s|Y-m-d',
            fieldLabel: 'Approval Date',
            allowBlank: false,
            listeners: {
                change: 'getExpiryDate'
            }
        },{
            xtype: 'datefield',
            name: 'expiry_date',
            columnWidth: 1,
            format: 'Y-m-d H:i:s',
            altFormats: 'Y-m-d H:i:s|Y-m-d',
            fieldLabel: 'Expiry Date',
            allowBlank: true,
            readOnly: true
        },
        {
            xtype: 'htmleditor',
            columnWidth: 1,
            name: 'remarks',
            isFocusable: true,
            fieldLabel:'Remarks',
            emptyText: 'Any Remarks...',
            allowBlank: false,
        }
    ],
    dockedItems: [{
        xtype: 'toolbar',
        ui: 'footer',
        dock: 'bottom',
        items: [
            '->', {
                text: 'Save Decision',
                iconCls: 'x-fa fa-save',
                action: 'save',
                table_name: '',
                storeID: 'productScreeningApprovalGridStr',
                formBind: true,
                ui: 'soft-blue',
                action_url: 'common/onSaveApplicationApprovalDecision',
                handler: 'saveApplicationApprovaldetails'
            }
        ]
    }
    ]
});
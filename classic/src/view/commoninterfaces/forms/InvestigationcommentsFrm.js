Ext.define('Admin.view.Enforcement.views.forms.investigation.InvestigationcommentsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'investigationcommentsFrm',
    layout: 'column',
    bodyPadding: 5,
    controller: 'enforcementvctr',
    defaults: {
        margin: 5,
        labelAlign: 'top',
        width: '100%',
        allowBlank: false,
        columnWidth: 1
    },
    scrollable: true,
    autoScroll: true,
    items: [{   
            xtype: 'hiddenfield',
            name: 'id',
        },
        {   
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        }, {
            xtype: 'combo', anyMatch: true,
            name: 'case_decision_id',
            allowBlank: true,
            queryMode: 'local',
            fieldLabel: 'Investigation recommendation',
            valueField: 'id',
            displayField: 'name',
            listeners: {
                afterrender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 10000,
                        proxy: {
                            extraParams:{
                                table_name: 'par_investigation_comments'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
        {
            xtype: 'datefield',
            name: 'investigation_start_date',
            format: 'Y-m-d H:i:s',
            columnWidth: 1,
            altFormats: 'Y-m-d H:i:s|Y-m-d',
            maxValue: new Date(),
            fieldLabel: 'Investigation Start Date',
            allowBlank: true,
        },{
            xtype: 'datefield',
            name: 'investigation_end_date',
            columnWidth: 1,
            format: 'Y-m-d H:i:s',
            maxValue: new Date(),
            altFormats: 'Y-m-d H:i:s|Y-m-d',
            fieldLabel: 'Investigation  End Date',
            allowBlank: true
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
                table_name: '',
                storeID: 'investigationcommentsgridstr',
                formBind: true,
                name:'save_comment',
                ui: 'soft-blue',
            }
        ]
    }
    ]
});
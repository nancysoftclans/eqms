/**
 */
Ext.define('Admin.view.commoninterfaces.ApplicationPremisePnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'applicationpremisepnl',
    layout: 'fit',

    tbar: [{
        xtype: 'hiddenfield',
        name: 'premise_type_id'
    },
    {
        xtype: 'hiddenfield',
        name: 'section_id'
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
        name: 'module_id'
    },
    {
        xtype: 'hiddenfield',
        name: 'sub_module_id'
    }
],
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            hidden: true,
            dock: 'top',
            margin: 3,
            items:[
                {
                    xtype: 'tbspacer',
                    width: 2
                },
                {
                    xtype: 'combo', anyMatch: true,
                    fieldLabel: 'Branch',
                    labelWidth: 50,
                    width: 400,
                    name: 'branch_id',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    forceSelection: true,
                    listeners: {
                        beforerender: {
                            fn: 'setOrgConfigCombosStore',
                            config: {
                                pageSize: 1000,
                                proxy: {
                                    extraParams: {
                                        model_name: 'Zone'
                                    }
                                }
                            },
                            isLoad: true
                        }
                    },
                    labelStyle: 'font-weight:bold'
                }
            ]
        }
    ],
    items: [
        {
            xtype: 'premisedetailstabpnl'
        }
    ]
});
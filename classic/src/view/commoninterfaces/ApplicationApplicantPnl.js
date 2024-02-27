Ext.define('Admin.view.commoninterfaces.ApplicationApplicantPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'applicationapplicantpnl',
    autoScroll: true,
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            hidden: true,
            dock: 'top',
            margin: 2,
            items: [
                {
                    xtype: 'tbspacer',
                    width: 2
                },
                {
                    xtype: 'fieldset',
                    title: 'Application Processing',
                    //checkboxToggle: true,
                    collapsible: false,
                    layout: 'column',
                    defaults: {
                        columnWidth: 0.33,
                        margin: 5
                    },
                    items: [
                        {
                            xtype: 'combo', anyMatch: true,
                            fieldLabel: 'Country',
                            labelWidth: 55,
                            width: 350,
                            readOnly: true,
                            name: 'application_country_id',
                            valueField: 'id',
                            displayField: 'name',
                            queryMode: 'local',
                            forceSelection: true,
                            labelStyle: 'font-weight:bold',
                            listeners: {
                                beforerender: {
                                    fn: 'setOrgConfigCombosStore',
                                    config: {
                                        pageSize: 1000,
                                    },
                                    isLoad: false
                                },
                                afterrender: function () {
                                    var store = this.getStore(),
                                        filterObj = {id: 36},
                                        filterStr = JSON.stringify(filterObj);
                                    store.removeAll();
                                    store.load({params: {table_name: 'par_countries', filters: filterStr}});
                                    this.setValue(36);
                                },
                                change: function (cmb, newVal) {
                                    var store = this.getStore(),
                                        filterObj = {country_id: newVal},
                                        filterStr = JSON.stringify(filterObj),
                                        panel = cmb.up('applicationapplicantpnl'),
                                        regions_store = panel.down('combo[name=application_region_id]').getStore();
                                    regions_store.removeAll();
                                    regions_store.load({params: {table_name: 'par_regions', filters: filterStr}});
                                }
                            }
                        },
                        {
                            xtype: 'combo', anyMatch: true,
                            fieldLabel: 'District',
                            labelWidth: 50,
                            width: 350,
                            name: 'application_region_id',
                            valueField: 'id',
                            displayField: 'name',
                            queryMode: 'local',
                            forceSelection: true,
                            labelStyle: 'font-weight:bold',
                            listeners: {
                                beforerender: {
                                    fn: 'setOrgConfigCombosStore',
                                    config: {
                                        pageSize: 1000,
                                    },
                                    isLoad: false
                                },
                                change: function (cmb, newVal) {
                                    var store = cmb.getStore(),
                                        record = store.getById(newVal),
                                        branch_id = record.get('branch_id'),
                                        panel = cmb.up('applicationapplicantpnl');
                                    panel.down('combo[name=branch_id]').setValue(branch_id);

                                }
                            }
                        },
                        {
                            xtype: 'combo', anyMatch: true,
                            fieldLabel: 'Branch',
                            labelWidth: 45,
                            width: 350,
                            name: 'branch_id',
                            valueField: 'id',
                            displayField: 'name',
                            readOnly: true,
                            queryMode: 'local',
                            forceSelection: true,
                            labelStyle: 'font-weight:bold',
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
                            }
                        }
                    ]
                }
            ]
        }
    ],
    items: [
        {
            xtype: 'gmpapplicantdetailsfrm'
        }
    
    ]
});
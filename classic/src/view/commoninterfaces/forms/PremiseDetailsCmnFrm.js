/**
 */
Ext.define('Admin.view.commoninterfaces.forms.PremiseDetailsCmnFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'premisedetailscmnfrm',
    layout: {
        type: 'column'
    },
    bodyPadding: 5,
    defaults: {
        columnWidth: 0.25,
        margin: 5,
        labelAlign: 'top',
        allowBlank: false
        
    },
    listeners: {
        afterrender: function () {
            var form = this,
                isReadOnly = form.down('hiddenfield[name=isReadOnly]').getValue();
            if ((isReadOnly) && (isReadOnly == 1 || isReadOnly === 1)) {
                form.getForm().getFields().each(function (field) {
                    field.setReadOnly(true);
                });
            }
        }
    },
    items: [
        {
            xtype: 'hiddenfield',
            name: 'isReadOnly'
        },
        {
            xtype: 'hiddenfield',
            name: 'premise_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'manufacturing_site_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'main_registered_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'temporal_premise_id'
        },
        {
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        },
        {
            xtype: 'fieldcontainer',
            layout: 'column',
            defaults: {
                labelAlign: 'top'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    columnWidth: 0.9,
                    allowBlank: false,
                    fieldLabel: 'Name',
                    bind: {
                        readOnly: '{isReadOnly}'
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-search',
                    disabled: true,
                    columnWidth: 0.1,
                    tooltip: 'Search',
                    action: 'search_premise',
                    childXtype: 'premiseselectiongrid',
                    winTitle: 'Premises Selection List',
                    winWidth: '90%',
                    margin: '30 0 0 0',
                    bind: {
                        disabled: '{isReadOnly}'
                    }
                }
            ]
        },
        {
            xtype: 'textfield',
            name: 'premise_reg_no',
            fieldLabel: 'Registration No',
            hidden: true,
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'textfield',
            name: 'permit_no',
            fieldLabel: 'Permit No',
            hidden: true,
            readOnly: true
        },
        {
            xtype: 'textfield',
            name: 'gmp_cert_no',
            fieldLabel: 'GMP Certificate No',
            hidden: true,
            readOnly: true
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Country',
            name: 'country_id',
            forceSelection: true,
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        storeId: 'currenciesstr',
                        proxy: {
                            extraParams:{
                                table_name: 'par_currencies'
                            }
                        }
                    },
                    isLoad: true
                },
                change: function (cmbo, newVal) {
                    var form = cmbo.up('form'),
                        regionStore = form.down('combo[name=region_id]').getStore(),
                        filterObj = {country_id: newVal},
                        filterStr = JSON.stringify(filterObj);
                    regionStore.removeAll();
                    regionStore.load({params: {filter: filterStr}});
                }
            },
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'District',
            name: 'region_id',
            forceSelection: true,
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        storeId: 'regionsstr',
                        proxy: {
                            extraParams:{
                                table_name: 'par_regions'
                            }
                        }
                    },
                    isLoad: true
                },
                change: function (cmbo, newVal) {
                    var form = cmbo.up('form'),
                        districtStore = form.down('combo[name=district_id]').getStore(),
                        filterObj = {region_id: newVal},
                        filterStr = JSON.stringify(filterObj);
                    districtStore.removeAll();
                    districtStore.load({params: {filter: filterStr}});
                }
            },
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Region/City/Town',
            name: 'district_id',
            forceSelection: true,
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            bind: {
                readOnly: '{isReadOnly}'
            },
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        storeId: 'districtsstr',
                        proxy: {
                            extraParams:{
                                table_name: 'par_districts'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Street',
            name: 'street',
            allowBlank: true,
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Telephone',
            name: 'telephone',
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Fax',
            name: 'fax',
            allowBlank: true,
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Email Address',
            name: 'email',
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Website',
            name: 'website',
            allowBlank: true,
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Physical Address',
            name: 'physical_address',
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Postal Address',
            name: 'postal_address',
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Business Scale',
            name: 'business_scale_id',
            valueField: 'id',
            displayField: 'name',
            allowBlank: true,
            queryMode: 'local',
            forceSelection: true,
            listeners:{
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        storeId: 'businessscalesstr',
                        proxy: {
                            extraParams:{
                                table_name: 'par_business_scales'
                            }
                        }
                    },
                    isLoad: true
                }
            },
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Longitude',
            name: 'longitude',
            allowBlank: true,
            bind: {
                readOnly: '{isReadOnly}'
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Latitude',
            name: 'latitude',
            allowBlank: true,
            bind: {
                readOnly: '{isReadOnly}'
            }
        }
    ]
});
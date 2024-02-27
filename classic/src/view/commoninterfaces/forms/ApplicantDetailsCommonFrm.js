Ext.define('Admin.view.commoninterfaces.views.forms.ApplicantDetailsCommonFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'applicantdetailscommonfrm',
    layout: {
        type: 'column'
    },
    autoScroll: true,
    scrollable: true,
    bodyPadding: 5,
    defaults: {
        columnWidth: 0.33,
        margin: 5,
        readOnly: true,
        labelAlign: 'top',
        bind: {
           // disabled: '{isReadOnly}'
        }
    },
    items: [
        {
            xtype: 'hiddenfield',
            name: 'applicant_id'
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
            fieldLabel: 'Applicant Name',
            items: [
                {
                    xtype: 'textfield',
                    name: 'applicant_name',
                    readOnly: true,
                    columnWidth: 0.9
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-link',
                    columnWidth: 0.1,
                    tooltip: 'Link Applicant',
                    name: 'link_applicant',
                    bind: {
                       disabled: '{isReadOnly}'
                    },
                    handler: 'showApplicantSelectionList'
                }
            ]
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Contact Person',
            readOnly: true,
            name: 'contact_person'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'TIN Number',
            readOnly: true,
            hidden: true,
            name: 'tpn'
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Country',
            margin: '0 20 20 0',
            name: 'app_country_id',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            allowBlank: false,
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        proxy: {
                            url: 'configurations/getConfigParamFromTable',
                            extraParams: {
                                table_name: 'par_countries'
                            }
                        }
                    },
                    isLoad: true
                },
                change: function(combo,newValue,old,eopts) {
                    var form=this.up('form'),
                        regionStr=form.down('combo[name=app_region_id]').getStore();
                    regionStr.removeAll();
                    var filters = JSON.stringify({'country_id':newValue});
                    regionStr.load({params:{filters:filters}});
                },

            }
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'District',
            margin: '0 20 20 0',
            name: 'app_region_id',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            allowBlank: false,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        proxy: {
                            url: 'configurations/getConfigParamFromTable',
                            extraParams: {
                                table_name: 'par_regions'
                            }
                        }
                    },
                    isLoad: false
                },
                change: function(combo,newValue,old,eopts) {
                    var form=this.up('form'),
                        districtStr=form.down('combo[name=app_district_id]').getStore();
                    districtStr.removeAll();
                    var filters = JSON.stringify({'region_id':newValue});
                    districtStr.load({params:{filters:filters}});
                }

            }
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Region',
            margin: '0 20 20 0',
            name: 'app_district_id',
            valueField: 'id',
            allowBlank: true,
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        proxy: {
                            url: 'configurations/getConfigParamFromTable',
                            extraParams: {
                                table_name: 'par_districts'
                            }
                        }
                    },
                    isLoad: false
                }

            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Physical Address',
            readOnly: true,
            name: 'app_physical_address'
        },
        {
            xtype: 'textfield',
            readOnly: true,
            fieldLabel: 'Postal Address',
            name: 'app_postal_address'
        },
        {
            xtype: 'textfield',
            readOnly: true,
            fieldLabel: 'Telephone',
            name: 'app_telephone'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Fax',
            hidden: true,
            readOnly: true,
            name: 'app_fax'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Email',
            readOnly: true,
            name: 'app_email'
        },
        {
            xtype: 'textfield',
            readOnly: true,
            fieldLabel: 'Website',
            name: 'app_website'
        }
    ]
});
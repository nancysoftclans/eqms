Ext.define('Admin.view.configurations.views.forms.ManufacturerConfigFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'manufacturerConfigFrm',
    controller: 'configurationsvctr',
    autoScroll: true,
    layout: 'column',
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: true,
        columnWidth: 0.33
    },
    
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'tra_manufacturers_information',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: '_token',
        value: token,
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'id',
        margin: '0 20 20 0',
        name: 'id',
        allowBlank: true
    },{
        xtype: 'textfield',
        fieldLabel: 'Name',
        margin: '0 20 20 0',
        name: 'name',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Contact Person',
        margin: '0 20 20 0',
        name: 'contact_person',
        // allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Physical Address',
        margin: '0 20 20 0',
        name: 'physical_address',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Postal Address',
        margin: '0 20 20 0',
        name: 'postal_address',
        // allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Telephone',
        margin: '0 20 20 0',
        name: 'telephone_no',
        // allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Mobile No',
        margin: '0 20 20 0',
        name: 'mobile_no',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Email Address',
        margin: '0 20 20 0',
        name: 'email_address',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'website',
        margin: '0 20 20 0',
        name: 'website',
        // allowBlank: false
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Country',
        margin: '0 20 20 0',
        name: 'country_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_countries'
                        }
                    }
                },
                isLoad: true
            },
            change: function(cmb, newValue, oldVal, eopts) {
                var form = cmb.up('form'),
                    region = form.down('combo[name=region_id]').getStore(),
                    filters = JSON.stringify({'country_id':newValue});
                   region.removeAll();
                   region.load({params:{filters:filters}});

                var store = this.getStore(),
                    index = store.findExact('id',newValue),
                    rec = store.getAt(index);
                    console.log(rec);
                   if(rec.get('is_local') == 1){
                        form.down('textfield[name=tin_no]').allowBlank = false;
                        form.down('textfield[name=tin_no]').setVisible(true);
                   }else{
                     form.down('textfield[name=tin_no]').allowBlank = true;
                     form.down('textfield[name=tin_no]').setVisible(false);
                   }
            },
           
        }
    },{
        xtype: 'textfield',
        fieldLabel: 'TIN Number',
        margin: '0 20 20 0',
        name: 'tin_no',
        hidden: true,
        allowBlank: true
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'District',
        margin: '0 20 20 0',
        name: 'region_id',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_regions'
                        }
                    }
                },
                isLoad: false
            }
           
        }
    },{
        xtype: 'textarea',
        fieldLabel: 'Description',
        margin: '0 20 20 0',
        name: 'description',
        allowBlank: true
    },{
        xtype: 'checkbox',
        inputValue: 1,
        fieldLabel: 'Is Enabled',
        margin: '0 20 20 0',
        name: 'is_enabled',
        allowBlank: true
    }],
    dockedItems:[
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items:[
                '->',{
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'tra_manufacturers_information',
                    storeID: 'manufacturersConfigStr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/saveConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});
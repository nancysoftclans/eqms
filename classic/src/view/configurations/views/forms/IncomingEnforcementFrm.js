Ext.define('Admin.view.configurations.views.forms.IncomingEnforcementFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'incomingEnforcementFrm',
    controller: 'configurationsvctr',
    autoScroll: true,
    layout: 'column',
    frame: true,
    height: Ext.Element.getViewportHeight() - 118,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        columnWidth: 1,
        allowBlank: false
    },
    
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'tra_incoming_enforcement_reports',
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
        fieldLabel: 'Reporter',
        margin: '0 20 20 0',
        name: 'reporter_name',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Contact Details',
        margin: '0 20 20 0',
        name: 'contact_details',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Reporter Location',
        margin: '0 20 20 0',
        name: 'location',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Reporter Age',
        margin: '0 20 20 0',
        name: 'age',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Product Name',
        margin: '0 20 20 0',
        name: 'product_name',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Facility Name',
        margin: '0 20 20 0',
        name: 'facility_name',
        allowBlank: false
    },{
        xtype: 'textfield',
        fieldLabel: 'Willing to be contacted',
        margin: '0 20 20 0',
        name: 'communicate_id',
        allowBlank: false
    },{
        xtype: 'htmleditor',
        fieldLabel: 'Report',
        margin: '0 20 20 0',
        name: 'report',
        allowBlank: true
    },{
        xtype: 'htmleditor',
        fieldLabel: 'Additional Information',
        margin: '0 20 20 0',
        name: 'additional_info',
        allowBlank: true
    }]
});
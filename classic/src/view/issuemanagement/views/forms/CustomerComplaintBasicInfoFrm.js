
Ext.define('Admin.view.issuemanagement.views.forms.CustomerComplaintBasicInfoFrm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.customercomplaintbasicinfofrm',
    itemId: 'customercomplaintbasicinfofrm',
    height: Ext.Element.getViewportHeight() - 118,
    controller: 'issuemgmtvctr',
    autoScroll: true,
    layout: {
        type: 'fit',
    },
    defaults: {
        columnWidth: 0.5,
        margin: 5,
        labelAlign: 'top'
    },
    frame: true,
    bodyPadding: 24,
    items: [
        {
            xtype: 'container',
            layout: 'column',
            defaults: {
                labelAlign: 'top',
                labelStyle: {
                    'font-weight': 'bold'
                },
                allowBlank: true
            },
            fieldDefaults: {
                xtype: 'textfield',
                fieldStyle: {
                    'color': 'soft-blue',
                    'font-weight': 'bold'
                }
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    fieldLabel: 'id',
                    margin: '0 20 20 0',
                    name: 'id'
                }, {
                    xtype: 'textfield',
                    value: token,
                    name: '_token',
                    hidden: true
                }, {
                    xtype: 'hiddenfield',
                    margin: '0 20 20 0',
                    name: 'table_name',
                    value: 'tra_complaints',
                    allowBlank: true
                },
                {   xtype: 'hiddenfield',
                    name: 'isReadOnly',

                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Name of Complainant',
                    name: 'name',
                    margin: '0 20 20 0',
                    allowBlank: false,
                    bind: {
                        readOnly: '{isReadOnly}'  // negated
                    }
                },
            
                {
                    xtype: 'textfield',
                    fieldLabel: 'Name of Organization (If applicable)',
                    name: 'organization_name',
                    margin: '0 20 20 0',
                    allowBlank: true,
                    bind: {
                        readOnly: '{isReadOnly}'  // negated
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Complainant Address',
                    name: 'address',
                    margin: '0 20 20 0',
                    allowBlank: true,
                    bind: {
                        readOnly: '{isReadOnly}'  // negated
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Phone Number (250...)',
                    name: 'phone_no',
                    margin: '0 20 20 0',
                    allowBlank: false,
                    maxLength: 12, // Limit the maximum length of input to 12 digits
                    enforceMaxLength: true, // Ensures that maxLength is enforced for user input
                    validator: function(value) {
                        // Validate if the input value has a maximum of 12 digits
                        if (value && value.toString().length > 12) {
                            return 'Phone number should have a maximum of 12 digits.';
                        }
                        return true; // Return true to indicate validation success
                    },
                    bind: {
                        readOnly: '{isReadOnly}'  // negated
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Email Address',
                    name: 'email',
                    margin: '0 20 20 0',
                    allowBlank: true,
                    vtype: 'email',
                    bind: {
                        readOnly: '{isReadOnly}'  // negated
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: 'Mode of Complaint',
                    displayField: 'name',
                    margin: '0 20 20 0',
                    name: 'mode_id',
                    valueField: 'id',       
                    allowBlank: false,
                    listeners: {
                        beforerender: {
                            fn: 'setCompStore',
                            config: {
                                proxy: {
                                    
                                    extraParams: {
                                        table_name: 'par_complaint_modes',
                                    }
                                }
                               },
                          isLoad: true
                        }
                    },
                    bind: {
                        readOnly: '{isReadOnly}'  // negated
                    }
                },                             
                {
                    xtype: 'datefield',
                    fieldLabel: 'Date of Complaint',
                    name: 'date_of_complaint',
                    margin: '0 20 20 0',
                    allowBlank: true,
                    format: 'Y-m-d',
                    bind: {
                        readOnly: '{isReadOnly}'  // negated
                    } 
                },
                {
                    xtype: 'htmleditor',
                    fieldLabel: 'Details of Complaint',
                    margin: '0 20 20 0',
                    name: 'details_of_complaint',
                    allowBlank: true,
                    bind: {
                        readOnly: '{isReadOnly}'  // negated
                    }
                },

        

            ]
        }
    ]
});


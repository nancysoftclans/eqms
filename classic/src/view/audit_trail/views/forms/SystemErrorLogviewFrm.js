Ext.define('Admin.view.audit_trail.views.forms.SystemErrorLogviewFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'systemErrorLogviewFrm',
    controller: 'audit_trialViewCtr',
    autoScroll: true,
    layout: 'form',
    widht: '100%',
   // bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        readOnly: true,
        allowBlank: true
    },
    
    items: [{
        xtype: 'textarea',
        margin: '0 20 0 0',
        fieldLabel:'Error',
        name: 'error'
    },{
        xtype: 'textarea',
        margin: '0 20 0 0',
        fieldLabel:'Error Origin',
        name: 'error_origin'
    },{
        xtype: 'textarea',
        fieldLabel:'Resolution Comment',
        margin: '0 20 0 0',
        name: 'resolution_comment'
    },{
        xtype: 'datefield',
        format: 'Y-m-d',
        margin: '0 20 0 0',
        altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00',
        name: 'generated_on',
        fieldLabel: 'Originated On'
    },{
        xtype: 'datefield',
        format: 'Y-m-d',
        margin: '0 20 0 0',
        name: 'resolved_on',
        altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00',
        fieldLabel: 'Resolved On'
    }]
});





Ext.define('Admin.view.configurations.views.forms.MeetingSchedulesFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'meetingschedulesfrm',
    autoScroll: true,
    frame: true,
    controller: 'configurationsvctr',
    layout: 'form',
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    items: [ 
        {
            xtype: 'hiddenfield',
            margin: '0 20 20 0',
            value:'tc_meeting_details',
            allowBlank: true,
            name: 'table_name'
        },
        {
            xtype: 'hiddenfield',
            margin: '0 20 20 0',
            allowBlank: true,
            value: token,
            name: '_token'
        },
        {
            xtype: 'hiddenfield',
            margin: '0 20 20 0',
            allowBlank: true,
            name: 'id'
        },
  
    {
        xtype: 'textfield',
        fieldLabel: 'Meeting Name',
        margin: '0 20 20 0',
        allowBlank: false,
        name: 'meeting_name'
    },
    {
        xtype: 'textfield',
        fieldLabel: 'Meeting Venue',
        margin: '0 20 20 0',
        allowBlank: false,
        name: 'meeting_venue'
    },
  
    {
        xtype: 'textarea',
        fieldLabel: 'Meeting Description',
        margin: '0 20 20 0',
        name: 'meeting_desc',
        allowBlank: false
    },
    {
        xtype: 'datefield',
        fieldLabel: 'Meeting Date',
        margin: '0 20 20 0',
        name: 'date_requested',
        allowBlank: false
    },
    {
        xtype: 'timefield',
        fieldLabel:'Meeting Time',
        name: 'meeting_time',
        format: 'H:i',
        altFormats:'H:i',
        increment: 30,
        bind: {
            readOnly: '{isReadOnly}'  // negated
        }
    }
  
   ],
   
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [
                '->', {
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'par_meeting_schedules',
                    // storeID: 'AgeAnalysisStr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/saveConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }, 
            ]
        }
    ]
});
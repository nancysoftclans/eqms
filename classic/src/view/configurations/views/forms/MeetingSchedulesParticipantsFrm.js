/**
 * Created by Softclans
 */
 Ext.define('Admin.view.configurations.views.forms.MeetingSchedulesParticipantsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'meetingschedulesparticipantsfrm',
    controller: 'configurationsvctr',
    bodyPadding: 5,
    frame: true,
    layout: 'column',
    defaults:{
        margin: 3,
        labelAlign: 'top',
        columnWidth: 1,
        allowBlank: false
    },
    items: [
        {
            xtype: 'hiddenfield',
            name: 'id'
        },{
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        },
        {
            xtype: 'hiddenfield',
            name: 'meeting_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'table_name',
            value: 'tc_meeting_participants'
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
                    name: 'participant_name',
                    columnWidth: 1,
                    allowBlank: false,
                    fieldLabel: 'Name'
                }
            ]
        },
        {
            xtype: 'textfield',
            name: 'phone',
            fieldLabel: 'Phone No',
            allowBlank: true
        },
        {
            xtype: 'textfield',
            name: 'email',
            fieldLabel: 'Email',
            allowBlank: true
        }
    ],
    buttons:[
        {
            xtype: 'button',
            text: 'Save Details',
            iconCls: 'fa fa-save',
            ui: 'soft-blue',
            formBind: true,
            handler: 'doCreateCommonParamWin',
            action_url:'configurations/saveConfigCommonData',
            table_name:'tc_meeting_participants',
            storeID:'tcmeetingparticipantsstr',
        }
    ]
});
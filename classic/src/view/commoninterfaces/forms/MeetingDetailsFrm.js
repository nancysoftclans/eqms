/**
 * Created by Softclans
 */
Ext.define('Admin.view.commoninterfaces.forms.MeetingDetailsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'meetingdetailsfrm',
    layout: 'column',
    itemId: 'meetingdetailsfrm',
    reference: 'meetingdetailsfrm',
    defaults: {
        labelAlign: 'top',
        columnWidth: 0.33,
        margin: 5,
        allowBlank: false
    },
    controller: 'commoninterfacesVctr',
    viewModel: 'commoninterfacesVm',
    tbar: [{
        xtype: 'button',
        text: 'Select Exisiting Schedules',
        ui: 'soft-blue',
        name: 'saveExisting',
        iconCls: 'fa fa-list-alt',
        listeners:{
            beforerender: function(btn){
                var form = btn.up('form'),
                    is_meeting = form.is_meeting;
                if(is_meeting == 1){
                    btn.setVisible(false);
                }
            },
        },
        handler: 'showMeetingSchedules'
    }],
    items: [
        {
            xtype: 'hiddenfield',
            name: 'id'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Name',
            name: 'meeting_name',
            bind: {
                readOnly: '{isReadOnly}'  // negated
            }
        },{
            xtype: 'textfield',
            fieldLabel: 'Meeting Venue',
            name: 'meeting_venue',
            bind: {
                readOnly: '{isReadOnly}'  // negated
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Description',
            name: 'meeting_desc',
            allowBlank: false,
            bind: {
                readOnly: '{isReadOnly}'  // negated
            }
        },
        {
            xtype: 'datefield',
            fieldLabel: 'Date Requested',
            name: 'date_requested',
            submitFormat: 'Y-m-d',
            format: 'd/m/Y',
            altFormats: 'Y-m-d H:i:s|Y-m-d',
            // altFormats: 'd,m,Y|d.m.Y|Y-m-d|d/m/Y/d-m-Y|d,m,Y 00:00:00|Y-m-d 00:00:00|d.m.Y 00:00:00|d/m/Y 00:00:00',
            bind: {
                readOnly: '{isReadOnly}'  // negated
            }
        },{
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
    // buttons: ['->',{
    //     xtype: 'button',
    //     text: 'Save Meeting Details',
    //     iconCls: 'fa fa-save',
    //     ui: 'soft-blue',
    //     name: 'save_btn',
    //     table_name: 'tra_product_applications',
    //     toaster: 1
    // }]

});
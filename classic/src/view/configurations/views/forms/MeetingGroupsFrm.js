Ext.define('Admin.view.configurations.views.forms.MeetingGroupsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'meetingGroupsFrm',
    controller: 'configurationsvctr',
    autoScroll: true,
    layout: 'form',
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'par_meeting_groups',
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
    },
    {
        xtype: 'tagfield',
        fieldLabel: 'Select Participants',
        margin: '0 20 20 0',
        itemId: 'value_2-label',
        displayField: 'fullnames',
        valueField: 'id',
        name:'participant_id',
        queryMode: 'local',
        filterPickList: true,
        encodeSubmitValue: true,
        growMax: 100,
        listeners:{
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                       url:'usermanagement/getActiveSystemUsers',
                    }
                },
                isLoad: true
            }
        },
     
    },
    {
        xtype: 'textarea',
        fieldLabel: 'Description',
        margin: '0 20 20 0',
        name: 'description',
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
                    table_name: 'par_meeting_groups',
                    storeID: 'meetinggroupsStr',
                    formBind: true,
                    ui: 'soft-purple',
                    action_url: 'configurations/onSaveMeetingGroups',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});
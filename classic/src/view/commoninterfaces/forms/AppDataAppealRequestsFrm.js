/**
 */
Ext.define('Admin.view.commoninterfaces.forms.AppDataAppealRequestsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'appdataappealrequestsfrm',
    controller: 'commoninterfacesVctr',
    layout: 'column',
    frame: true,
    bodyPadding: 5,
    defaults:{
        labelAlign: 'top',
        columnWidth: 1,
        margin: 4
    },
    items: [
        {
            xtype: 'hiddenfield',
            name: 'id'
        },
        {
            xtype: 'hiddenfield',
            name: 'application_code'
        },
        {
            xtype: 'hiddenfield',
            name: 'module_id'
        },{
            xtype: 'hiddenfield',
            name: 'section_id'
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Type of Appeal',
            name: 'appeal_type_id',
            forceSelection: true,
            allowBlank: false,
            //readOnly: true,
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            listeners: {
                beforerender: {
                    fn: 'setParamCombosStore',
                    config: {
                        pageSize: 10000,
                        proxy: {
                            extraParams:{
                                table_name: 'par_appeal_types'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
        {
            xtype: 'htmleditor',
            name: 'appeal_request',
            fieldLabel: 'Appeal Request'
        }
    ],
    buttons:[
        {
            text: 'Save Details',
            iconCls: 'x-fa fa-save',
            formBind: true,
            ui: 'soft-blue',
            action_url: 'common/saveApplicatioAppealReasons',
            handler: 'doCreateCommonParamWin',
            storeID: 'appdataappealrequestsstr',
            table_name: 'tra_application_appealdata'
        }
    ]
});
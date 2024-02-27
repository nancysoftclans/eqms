/**
 */
Ext.define('Admin.view.commoninterfaces.forms.MeetingMembersRecommendationFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'meetingMembersRecommendationFrm',
    itemId: 'recommendationfrmItemId',
    controller: 'commoninterfacesVctr',
    frame: true,
    bodyPadding: 5,
    layout: 'form',
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    items: [
        {
            xtype: 'hiddenfield',
            name: 'recommendation_record_id'
        },{
            xtype: 'hiddenfield',
            name: 'application_code'
        },{
            xtype: 'hiddenfield',
            name: 'stage_category_id'
        },{
            xtype: 'hiddenfield',
            name: 'module_id'
        },{
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        },
        
        {
            xtype: 'combo', anyMatch: true,
            name: 'recommendation_id',
            fieldLabel: 'Recommendation',
            queryMode: 'local',
            forceSelection: true,
            valueField: 'id',
            displayField: 'name',
            listeners: {
                beforerender: {
                    fn: 'setParamCombosStore',
                    config: {
                        pageSize: 100,
                        proxy: {
                            
                            extraParams: {
                                table_name: 'par_recommendations'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
        {
            xtype: 'htmleditor',
            name: 'remarks',
            fieldLabel: 'Remarks',
            allowBlank: false
        }
    ],
    buttons: [
        {
            text: 'Save Details',
            iconCls: 'fa fa-save',
            formBind: true,
            ui: 'soft-blue',
            handler: 'doSavePrecheckingecommendationDetails',
            action_url: 'common/saveMeetingMembersRecommendationDetails',
            table_name: 'tra_evalution_recommendations',
        }
    ]
});
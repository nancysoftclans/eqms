/**
 */
Ext.define('Admin.view.commoninterfaces.forms.EnforcementActionFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'enforcementActionfrm',
    itemId: 'enforcementActionfrmItemId',
    controller: 'commoninterfacesVctr',
    frame: true,
    bodyPadding: 5,
    layout: 'form',
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
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
            allowBlank: false,
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
                                table_name: 'par_enforcement_actions_type'
                            }
                        }
                    },
                    isLoad: true
                },
                change: function(combo, newVal,oldval, eopts){
                    var form = combo.up('form')
                        remarks =form.down('textarea[fieldLabel=Remarks]'),
                        lead_investigator =form.down('combo[name=lead_investigator]'),
                        co_investigators =form.down('tagfield[name=co_investigators]'),
                        corrective_action =form.down('textarea[name=corrective_action]');
                    
                        if(newVal == 2){
                            lead_investigator.setVisible(true);
                            co_investigators.setVisible(true);
                            corrective_action.setVisible(false);
                        }else if(newVal == 3){
                            corrective_action.setVisible(true);
                            lead_investigator.setVisible(false);
                            co_investigators.setVisible(false);
                        }else{
                            corrective_action.setVisible(false);
                            lead_investigator.setVisible(false);
                            co_investigators.setVisible(false);
                        }
                    }
            }
        },
        {
            xtype: 'textarea',
            name: 'remarks',
            fieldLabel: 'Remarks',
        }, 
        {
            xtype: 'textarea',
            name: 'corrective_action',
            fieldLabel: 'Corrective Action',
            hidden:true,
        }, 
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Lead Investigator',
            name: 'lead_investigator',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            hidden:true,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        proxy: {
                            url:'enforcement/getusers'
                        }
                    },
                    isLoad: true
                }, 
            }
            
        }, 
        {
            xtype: 'tagfield',
            fieldLabel: 'Co Investigators',
            name: 'co_investigators',
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            filterPickList: true,
            encodeSubmitValue: true,
            hidden:true,
            queryMode: 'local',
            growMax: 10,
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        proxy: {
                            url:'enforcement/getusers'
                        }
                    },
                    isLoad: true
                }, 
            }
            
        }

    ],
    buttons: [
        {
            text: 'Save Details',
            iconCls: 'fa fa-save',
            formBind: true,
            ui: 'soft-blue',
            handler: 'doSavePrecheckingecommendationDetails',
            action_url: 'enforcement/saveEnforcementActionRecommendationDetails',
            table_name: 'par_enforcement_action_recommendation',
            
        }
    ]
});
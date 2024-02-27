/**
 */
Ext.define('Admin.view.commoninterfaces.forms.MonitoringRecommendation', {
    extend: 'Ext.form.Panel',
    xtype: 'monitoringrecommendationfrm',
    height: Ext.Element.getViewportHeight() - 118,
    width : '65%',
    bodyPadding: 5,
    frame: true,
    autoScroll: true,
    
    // itemId: 'recommendationfrmItemId',
    controller: 'commoninterfacesVctr',
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
        },
        {
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        },    
        {
            xtype: 'textarea',
            name: 'medicine_records',
            fieldLabel: 'Available (or accessibility) of records for medicines',
            allowBlank: false
        },
        {
            xtype: 'textarea',
            name: 'expiry_date',
            fieldLabel: 'Keeping medicines in trade past the expiry date ',
            allowBlank: false
        },
        {
            xtype: 'numberfield',
            name: 'validity_dispensed_prescriptions',
            fieldLabel: 'Validity of written or dispensed prescriptions(%)',
            allowBlank: false
        },        
        {
            xtype: 'textarea',
            name: 'compliance_personnel',
            fieldLabel: 'Compliance to dispensing by a pharmacist or authorized persons',
            allowBlank: false
        },
        {
            xtype: 'numberfield',
            name: 'compliance_dispensing_label',
            fieldLabel: 'Compliance of container label of dispensed medicines(%)',
            allowBlank: false
        }, 
        {
            xtype: 'textarea',
            name: 'handling_medicines',
            fieldLabel: 'General handling of medicines',
            allowBlank: false
        },
        {
            xtype: 'htmleditor',
            name: 'remedial_actions',
            fieldLabel: 'Remedial actions/areas advised or agreed',
            allowBlank: false
        },
        {
            xtype: 'htmleditor',
            name: 'action_item',
            fieldLabel: 'Action item (and deadline)',
            allowBlank: false
        },
        {
            xtype: 'textfield',
            name: 'responsible_person',
            fieldLabel: 'Name of responsible person',
            allowBlank: false
        },{
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
                                table_name: 'par_monitoring_decisions'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
    ],
    buttons: [
        {
            text: 'Save Details',
            iconCls: 'fa fa-save',
            name:'save_monitoring_Recommendation',
            formBind: true,
            ui: 'soft-blue',
            handler: 'doSavePrecheckingecommendationDetails',
            action_url: 'enforcement/saveMonitoringRecommendationDetails',
            table_name: 'par_debrief_recommendations',
        }
        
    ]
});
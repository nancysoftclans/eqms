Ext.define('Admin.view.configurations.views.forms.UploadMedicalDevicesAssesmentFrm',{
    
    extend: 'Ext.form.Panel',
    xtype: 'uploadmedicaldevicesmedicalassesmentquestionsfrm',
    controller : 'configurationsvctr',
    layout:'form',
    frame: true,
    bodyPadding : 8,


    items : [
        {
            xtype: 'filefield',
            name: 'file',
            fieldLabel: 'upload',
            allowBlank: false,
            buttonText: 'upload excel file...',
            // queryMode : 'local',
           
        }
    ],
    dockedItems:[
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items:[
                '->',{
                    //xtype : 'button',
                    text: 'Save details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    
                    formBind: true,
                    ui: 'soft-purple',
                    
                    handler: 'doUploadQuestionsForMedicalDeviceAssesment',
                }
            ]
            
        }
    ]

});
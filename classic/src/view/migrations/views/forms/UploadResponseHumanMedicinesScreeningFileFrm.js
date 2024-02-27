Ext.define('Admin.view.migrations.views.forms.UploadResponseHumanMedicinesScreeningFileFrm',{

    extend: 'Ext.form.Panel',
    xtype: 'uploadresponsehumanmedicinesscreeningfilefrm',
    controller : 'migrationviewctr',
    layout:'form',
    frame: true,
    bodyPadding : 8,

    items : [
        {
            xtype: 'filefield',
            name: 'excelfile',
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
                    
                    handler: 'doUploadResponseToHumanMedicinesScreeningSpreadsheet',
                }
            ]
            
        }
    ]
})
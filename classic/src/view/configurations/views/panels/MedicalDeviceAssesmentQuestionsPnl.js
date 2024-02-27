Ext.define('Admin.view.configurations.views.panels.MedicalDeviceAssesmentQuestionsPnl', {
    extend: 'Ext.panel.Panel',
    xtype : 'medicaldeviceassesmentquestionspnl',
   
    autoScroll: true,
    autoHeight: true,
    layout : 'fit' ,
    items: [
        {
            xtype: 'medicaldeviceassesmentquestionsgrd'
        }
    ],
});
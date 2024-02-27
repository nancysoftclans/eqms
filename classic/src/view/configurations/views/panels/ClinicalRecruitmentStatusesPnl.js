Ext.define('Admin.view.configurations.views.panels.ClinicalRecruitmentStatusesPnl', {
    extend: 'Ext.panel.Panel',
    xtype: 'clinicalrecruitmentstatuses',
    title: 'Clinical Recruitment Statuses',
    userCls: 'big-100 small-100',
    height: Ext.Element.getViewportHeight() - 118,
    layout:{
        type: 'fit'
    },

    items: [
        {
            xtype: 'clinicalrecruitmentstatusesGrid'
        }
    ],

});

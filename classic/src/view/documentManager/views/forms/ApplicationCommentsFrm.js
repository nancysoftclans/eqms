Ext.define('Admin.view.documentManager.views.forms.ApplicationCommentsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'applicationcommentsFrm',
    controller: 'documentsManagementvctr',
    height: Ext.Element.getViewportHeight() - 118,
    autoScroll: true,
    frame: true,
    layout: 'column',
    bodyPadding: 5,
    defaults: {
        margin: 5,
        allowBlank: false,
        columnWidth: 1
    },
    items: [
        {
            xtype: 'hiddenfield',
            name: 'id'
        },{
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        },{
			xtype: 'combo', 
            anyMatch: true,
			queryMode: 'local',
			forceSelection: true,
			valueField: 'id',
			displayField: 'name',
			columnWidth: 1,
			fieldLabel: 'Recommendation',
			name: 'recommendation_id',
			listeners: {
				beforerender: {
					fn: 'setCompStore',
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
		},{
            xtype: 'datefield',
            name: 'assessment_start_date',
            format: 'Y-m-d H:i:s',
            columnWidth: 1,
            hidden: true,
            altFormats: 'Y-m-d H:i:s|Y-m-d',
            maxValue: new Date(),
            fieldLabel: 'Assessment Start Date',
            allowBlank: true,
        },{
            xtype: 'datefield',
            name: 'assessment_end_date',
            columnWidth: 1,
            format: 'Y-m-d H:i:s',
            maxValue: new Date(),
            hidden: true,
            altFormats: 'Y-m-d H:i:s|Y-m-d',
            fieldLabel: 'Assessment End Date',
            allowBlank: true
        },
        {
            xtype: 'htmleditor',
			columnWidth: 1,
            name: 'remarks',
			isFocusable: true,
			fieldLabel:'Comments/Remarks',
            emptyText: 'Your comment...',
            allowBlank: false,
        }
    ],
    buttons: [
        {
            xtype: 'button',
            text: 'Save Comment',
            ui: 'soft-blue',
            name: 'save_comment',
            iconCls: 'x-fa fa-save',
            storeID: 'applicationcommentsstr',
            formBind: true
        }
    ]
});
                
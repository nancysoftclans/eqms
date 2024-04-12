/**
 * Created by Kip on 2/26/2019.
 */
Ext.define('Admin.view.issuemanagement.views.toolbars.IssueMgmtTb', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'issuemgmttb',
    ui: 'footer',
    defaults: {
        ui: 'soft-blue',
        iconAlign: 'top'
    },
    requires: [
        'Ext.ux.BoxReorderer'
    ],
    plugins: 'boxreorderer',
    overflowHandler: 'scroller',
    items: [
        {
            text: 'Home',
            iconCls: 'x-fa fa-home',
            name: 'drugsSurveillanceHomeBtn',
            dash_wrapper: 'drugssurveillancedashwrapper',
            dashboard: 'drugssurveillancedashwrapper'
        },
        {
            text: 'Issue Initialisation',
            iconCls: 'x-fa fa-plus-square',
            menu:{
                xtype: 'menu',
                items:[
                    {
                        text:'Customer Complaints & Appeal',
                        iconCls: 'x-fa fa-check',
                        wrapper_xtype: 'issuemgmtdashwrapper',
                        handler:'showNewIssueApplication',
                        app_type: 102
                    }
                ]
            }
        },{
            text: 'Program Plan Implementation Details',
            iconCls: 'x-fa fa-folder',
            handler:'funcPreviewProgramImplDetails',
            winTitle: 'Program Plan Implementation Details',
            winWidth:'90%',
            childObject:'programimplementationdetailsgrid',
            hidden: true
        },
        '->',
        
        {
            text: 'Workflow',
            iconCls: 'x-fa fa-sitemap',
            menu:{
                xtype: 'menu',
                items:[
                    {
                        text: 'Structured Surveillance',
                        iconCls: 'x-fa fa-check',
                        handler:'showPmsApplicationWorkflow',
                        wrapper_xtype: 'drugssurveillancedashwrapper',
                        app_type: 38
                    },
                    {
                        text: 'Non-Structured Surveillance',
                        iconCls: 'x-fa fa-check',
                        handler:'showPmsApplicationWorkflow',
                        wrapper_xtype: 'drugssurveillancedashwrapper',
                        app_type: 37
                    }
                ]
            }
        }
    ]
});
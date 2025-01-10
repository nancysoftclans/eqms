Ext.define('Admin.Application', {
    extend: 'Ext.app.Application',
    
    name: 'Admin',
    requires: ['Admin.view.plugins.Badge', 'Ext.*'],

    controllers:[
        'SharedUtilitiesCtr',
        'WorkflowManagementCtr',
        'DashboardCtr',
        'PremiseRegistrationCtr',
        'PromoAndAdvertMaterialsController',
        'PvCtr',
        'SurveillanceCtr',
        'ImportExportpermitsCtr',
        'EnforcementCtr',
        'RMUCtr',
        'RevenueManagementCtr',
        'ApplicationAssignmentCtr',
        'NewReportsCtr',
        'PsurCtr',
        'OnlineServicesCtr',
        'IssueManagementCtr',
        'AuditManagementCtr',
        'GbtManagementCtr',
    ],
    defaultToken : system_dashboard,
    // The name of the initial view to create. This class will gain a "viewport" plugin
    // if it does not extend Ext.Viewport.
    //
    //mainView: 'Admin.view.main.Main',

    launch: function () {
        //If user is logged in open 'app-main' else open 'login'
        Ext.create({
            xtype: (is_logged_in) ? (force_password_change=='1')?'resetpwdscreen':'main-app' : ((is_reset_pwd) ? 'resetpwdscreen' : 'login')
        });
        //logged in

        if(is_logged_in){
            var navigationstr = Ext.getStore('navigationstr');
            navigationstr.load();
            setTimeDuration();
            checkUserNewTasks(60000);
            setupTimers();
            refreshTimerEvent();
            // submitPlannedActivities();
            // submitApplicationForInvestigation();
            // listMonitoringComplianceFacilities();
           // syncOnlineApplications();

        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }


});

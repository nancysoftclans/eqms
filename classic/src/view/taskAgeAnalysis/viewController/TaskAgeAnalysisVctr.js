Ext.define('Admin.view.taskAgeAnalysis.viewController.TaskAgeAnalysisVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.taskAgeAnalysisVctr',
    init: function () {

    },
    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
});
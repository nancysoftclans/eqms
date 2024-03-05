Ext.define('Admin.view.documentControl.viewControllers.DocumentControlVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.documentcontrolvctr',
    
    /**
     * Called when the view is created
     */

    init: function() {
         
    },

    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
	setConfigGridsStore: function (obj, options) {
        this.fireEvent('setConfigGridsStore', obj, options);
    },
    setParamCombosStore: function (obj, options) {
        this.fireEvent('setParamCombosStore', obj, options);
    },

    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

})
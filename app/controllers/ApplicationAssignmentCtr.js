Ext.define('Admin.controller.ApplicationAssignmentCtr', {
    extend: 'Ext.app.Controller',

    stores: [],
    config: {
        refs: [{
            ref: 'mainPanel',
            selector: 'maincontainerwrap'
        }, {
            ref: 'mainTabPanel',
            selector: '#contentPanel'
        }
        ],  
        control :{

        } 

    },

        /**
     * Called when the view is created
     */
        init: function () {

        },
        listen: {
            controller: {
                '*': {
                   
                }
            } 
        },
});
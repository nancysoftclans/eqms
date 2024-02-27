Ext.define('Admin.view.migrations.viewcontroller.Migrationviewctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.migrationviewctr',

    /**
     * Called when the view is created
     */
   
	// 
    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setDynamicTreeGridStore: function (obj, options) {
        this.fireEvent('setDynamicTreeGridStore', obj, options);
    },

    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
	showAddConfigParamWinFrm: function (btn) {
        var me = this,
            childXtype = btn.childXtype,
            winTitle=btn.winTitle,
            winWidth=btn.winWidth,
            child = Ext.widget(childXtype);

        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
       
    },

    //HUMAN MEDICINES SCREEING GRID

    
    savedirtydata : function(btn){

        //store = humamedicinesscreeninggrd.upgetStore();
        grid = btn.up('grid');
        store = grid.getStore();
        params = [];

        for(var i = 0 ; i < store.data.items.length ; i ++)
        {
            //looping through each field for each record
            var record = store.data.items[i];
            // screening_item_id = record.get('id'),
            // screening_number = record.get('Screening number'),
            // date_logged_in_rmu = record.get('Date logged in RMU');
           console.log(record);

            // var obj = 
            // {
            //     screening_number: screening_number,
            //     date_logged_in_rmu : date_logged_in_rmu,
            // }
            if(record.dirty){
                params.push(record.data)
            }
            
           
        }
        if (params.length < 1) {
            btn.setLoading(false);
            toastr.warning('No records to save!!', 'Warning Response');
            return false;
        }
        params = JSON.stringify(params);

        

        Ext.Ajax.request({
            url: 'migrations/saveDirtyData',
            method : 'POST',
            params: {
              
                _token: token,
               params: params
            },
            success: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    store.load();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                btn.setLoading(false);
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
        
    },
    savedirtydataforresponsetohumanmedicinesscreening:function(btn){
         //store = humamedicinesscreeninggrd.upgetStore();
         grid = btn.up('grid');
         store = grid.getStore();
         console.log(store);
         params = [];
         
 
         for(var i = 0 ; i < store.data.items.length ; i ++)
         {
             //looping through each field for each record
             var record = store.data.items[i];
             console.log(record);
             // screening_item_id = record.get('id'),
             // screening_number = record.get('Screening number'),
             // date_logged_in_rmu = record.get('Date logged in RMU');
            
 
             // var obj = 
             // {
             //     screening_number: screening_number,
             //     date_logged_in_rmu : date_logged_in_rmu,
             // }
             if(record.dirty){
                 params.push(record.data)
             }
             
            
         }
         if (params.length < 1) {
             btn.setLoading(false);
             toastr.warning('No records to save!!', 'Warning Response');
             return false;
         }
         params = JSON.stringify(params);
 
         
 
         Ext.Ajax.request({
             url: 'migrations/saveDirtyDataforResponseToHumanMedsScreening',
             method : 'POST',
             params: {
               
                 _token: token,
                params: params
             },
             success: function (response) {
                 btn.setLoading(false);
                 var resp = Ext.JSON.decode(response.responseText),
                     success = resp.success,
                     message = resp.message;
                 if (success == true || success === true) {
                     toastr.success(message, 'Success Response');
                     store.load();
                 } else {
                     toastr.error(message, 'Failure Response');
                 }
             },
             failure: function (response) {
                 btn.setLoading(false);
                 var resp = Ext.JSON.decode(response.responseText),
                     message = resp.message;
                 toastr.error(message, 'Failure Response');
             },
             error: function (jqXHR, textStatus, errorThrown) {
                 btn.setLoading(false);
                 toastr.error('Error: ' + errorThrown, 'Error Response');
             }
         });
    },
    createtruncatetablesform:function(btn){
        var me = this,
        //btn = item.up('button'),
        childXtype =  'truncatetablesFrm',
        winTitle = 'Select tables to clean',
        winWidth= '40%',
        form = Ext.widget(childXtype);
        

        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
    },
    truncatSelectedTables: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form_xtype = btn.up('form'),
            win = form_xtype.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID);

        //for variations calls add flag
        var is_variation = form_xtype.is_variation
        var frm = form_xtype.getForm();
        console.log(frm);
        if (frm.isValid()) {
            frm.submit({
                url: url,
                method : 'POST',
                params: {
                    table_name: table,
                    is_variation: is_variation,
                    _token: token
                },
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        // if(form_xtype.down('hiddenfield[name=common_name_id]')){

                        //     store.load({params:{common_name_id: form_xtype.down('hiddenfield[name=common_name_id]').getValue()}});
                        // }
                        // else{

                        //     store.load();
                        // }
                        win.close();
                    } else {
                        //toastr.error(message, 'Failure Response');
                        toastr.success(message, "Success Response");
                        //store.removeAll();
                        // if(form_xtype.down('hiddenfield[name=common_name_id]')){

                        //     store.load({params:{common_name_id: form_xtype.down('hiddenfield[name=common_name_id]').getValue()}});
                        // }
                        // else{

                        //     store.load();
                        // }
                        win.close();
                    }
                },
                failure: function (form, action) {
                     var resp = action.result;
                     toastr.success(resp.message, 'sucess Response');
                     win.close();
                }
            });
        }
    },

    uploadexcelspreadsheetform:function(item){
        // var me = this,
      
        childXtype = 'uploadhumanmedicinesscreeningfilefrm',
        winTitle   = 'Import Data From Excel Sheet',
        winWidth   = '40%',
        child      =  Ext.widget(childXtype);
        if(item.base_url){
            child.down('button[action=save]').url = item.base_url;
        }
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');

        // var me = this,
        // btn = item.up('button'),

        // childXtype = item.childXtype,
        // winTitle=item.winTitle,
        // winWidth=item.winWidth,
        // form = Ext.widget(childXtype);
        

        // funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
       

    },
    
    
    uploadexcelspreadsheetformforresponsetohumanmedsscreening:function(btn){
        var me = this,
        //btn = item.up('button'),
        childXtype =  'uploadresponsehumanmedicinesscreeningfilefrm',
        winTitle = 'Import Data From Excel Sheet',
        winWidth= '40%',
        form = Ext.widget(childXtype);
        

        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
    },
    doUploadHumanMedicinesScreeningSpreadsheet:function(btn){
        
        
        var me = this,
           // url = btn.action_url,
        
            form_xtype = btn.up('form'),
            win = form_xtype.up('window');
            //grid = form_xtype.up('grid');
            //store = grid.getStore();
           
        if(btn.url){
            base_url = btn.url;
        }else{
            base_url = 'migrations/uploadExcelSheetForHumanMedsScreening';
        }
        var frm = form_xtype.getForm();
        //filename = frm.getInput('filename');
       if(frm.isValid()){
            frm.submit({
                url: base_url,
                //method : 'POST',
                params: {
                    _token: token,
                },
                waitMsg: 'Please wait...',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        
                        win.close();
                        //store.load()
                    } else {
                        toastr.error(message, "Failure Response");
                        //toastr.error(message, 'Failure Response');
                        win.close();
                        //store.load();
                    }
                },
                failure: function (form, action) {
                  
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                    win.close();
                    // store.load();
                }
               
            });
       }
       
      
    },
    uploadexcelspreadsheetformfordrugs:function(btn){
        var childXtype = 'uploaddrugsfileform',
            winTitle   = 'Import Data From Excel Sheet',
            winWidth   = '40%',
            child      =  Ext.widget(childXtype),
            base_url = btn.base_url;

        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    },

    doUploadDrugsSpreadsheet :function(btn){
        var me = this,
           // url = btn.action_url,
        
            form_xtype = btn.up('form'),
            win = form_xtype.up('window');
           
       
        var frm = form_xtype.getForm();
        //filename = frm.getInput('filename');
        if(frm.isValid()){
                frm.submit({
                    url: 'migrations/uploadExcelSheetForDrugs',
                    
                    //method : 'POST',
                    params: {
                        _token: token,
                    },
                    waitMsg: 'Please wait...',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            success = response.success,
                            message = response.message;
                        if (success == true || success === true) {
                            toastr.success(message, "Success Response");
                            
                            win.close();
                            store.load();
                        } else {
                            toastr.error(message, 'Failure Response');
                            win.close();
                            store.load();
                        }
                    },
                    failure: function (form, action) {
                        var resp = action.result;
                        toastr.error(resp.message, 'Failure Response');
                        win.close();
                        store.load();
                    }
                
                });
        }
    },
    doUploadResponseToHumanMedicinesScreeningSpreadsheet:function(btn){
        
        
        var me = this,
           // url = btn.action_url,
        
            form_xtype = btn.up('form'),
            win = form_xtype.up('window');
           
       
        var frm = form_xtype.getForm();
        //filename = frm.getInput('filename');
        if(frm.isValid()){
                frm.submit({
                    url: 'migrations/uploadExcelSheetForResponseToHumanMedsScreening',
                    //method : 'POST',
                    params: {
                        _token: token,
                    },
                    waitMsg: 'Please wait...',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            success = response.success,
                            message = response.message;
                        if (success == true || success === true) {
                            toastr.success(message, "Success Response");
                            
                            win.close();
                            store.load();
                        } else {
                            toastr.error(message, 'Failure Response');
                            win.close();
                            store.load();
                        }
                    },
                    failure: function (form, action) {
                        var resp = action.result;
                        toastr.error(resp.message, 'Failure Response');
                        win.close();
                        store.load();
                    }
                
                });
        }
       
      
    },

    transfertotranscationaltables:function(btn){
        
       if(btn.url){
            url = btn.url;
       }else{
            url = 'migrations/transferdatatotransactionaltables';
       }
      
        Ext.Ajax.request({

            url: url,
            method : 'POST',
            params: {
            
                _token: token,
               
            },
            waitMsg: 'Please wait...',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    store.load();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                btn.setLoading(false);
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });

    },

    //vetinarymedicinesscreening
    savedirtydataforvetinarymedicinesscreening:function(btn){

        grid = btn.up('grid');

        store = grid.getStore();

       // console.log(store);

        params = [];

        for(var i = 0 ; i < store.data.items.length ; i++)
        {
            var record = store.data.items[i];

            //console.log(record);

            if(record.dirty){
                params.push(record.data);

               // console.log(params);

            }
        }

        if(params.length < 1){
            btn.setLoading(false);
            toastr.warning('No records to have been edited', 'Warning Response');

            return false;


        }
        params = JSON.stringify(params);

        //console.log(params);

        Ext.Ajax.request({


            url : 'migrations/saveDirtyDataForVetinaryMedicinesScreening',
            method : 'POST',

            params : {

                _token : token,
                params : params
            },

            success: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    store.load();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                btn.setLoading(false);
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        })


    },

    //

    savedirtydataforvetinarymedicinesvariations:function(btn){
        
       grid = btn.up('grid');

       store = grid.getStore();
       params = [];


       for(var i = 0 ; i < store.data.items.length ; i ++){

        var record = store.data.items[i];
        // screening_item_id = record.get('id'),
        // screening_number = record.get('Screening number'),
        // date_logged_in_rmu = record.get('Date logged in RMU');
        console.log(record);

        if(record.dirty){
            params.push(record.data)
        }


       }
       if (params.length < 1) {
        btn.setLoading(false);
        toastr.warning('No records to save!!', 'Warning Response');
        return false;
        }
        params = JSON.stringify(params);
       // console.log(params);
        Ext.Ajax.request({
            url: 'migrations/savedirtydataforvetinarymedicinesvariations',
            method : 'POST',
            params: {
            
                _token: token,
            params: params
            },
            success: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    store.load();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                btn.setLoading(false);
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });


    },

    //

    savedirtydataforvetmedicinesapplications:function(btn){
       grid = btn.up('grid');

       store = grid.getStore();
       params = [];


       for(var i = 0 ; i < store.data.items.length ; i ++){

        var record = store.data.items[i];
        // screening_item_id = record.get('id'),
        // screening_number = record.get('Screening number'),
        // date_logged_in_rmu = record.get('Date logged in RMU');
        //console.log(record);

        if(record.dirty){
            params.push(record.data)
        }

        params.push(record.data);
       }
       if (params.length < 1) {
        btn.setLoading(false);
        toastr.warning('No records to save!!', 'Warning Response');
        return false;
        }
        params = JSON.stringify(params);
        //console.log(params);
        Ext.Ajax.request({
            url: 'migrations/savedirtydataforvetinarymedicinesapplications',
            method : 'POST',
            params: {
            
                _token: token,
                params: params
            },
            success: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success,
                    message = resp.message;
                if (success == true || success === true) {
                    toastr.success(message, 'Success Response');
                    store.load();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            },
            failure: function (response) {
                btn.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                btn.setLoading(false);
                toastr.error('Error: ' + errorThrown, 'Error Response');
            }
        });
    }
});
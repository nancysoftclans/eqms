Ext.define('Admin.view.notifications.viewcontroller.NotificationsVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.notificationsvctr',

   // require:UsershareditemsStr,

    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },

    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
      //dynamic parameters views
      renderParameterGrid: function(btn) {
        var record =  btn.getWidgetRecord(),
            def_id = record.get('id');
         this.fireEvent('renderParameterMenu', def_id);
   },
    // onComposeDiscardClick: function(bt) {
    //     var win = bt.up('form');
    //     if (win) {
    //         win.close();
    //     }
    // },
  
    onInboxItemClick: function (view, record, item, index, e, eOpts) {
        this.fireEvent('onViewInboxNotifications', record);
    },
   
    onInboxNotificationItemClick: function (view, record, item, index, e, eOpts) {
        var id = record.get('id'),
           grid = view.grid,
           user_notification_id=record.get('user_notification_id'),
           group_notification_id=record.get('group_notification_id'),
           store = grid.getStore();
           
       grid.mask('Marking as read');
         Ext.Ajax.request({
            url: 'notifications/updateInboxNotification',
            method: 'POST',
            // timeout: 60000,
            params:
            {
                id: id ,
                user_notification_id: user_notification_id,
                group_notification_id: group_notification_id,
                _token: token

            },
          
            success: function (response,) {
                var response = Ext.JSON.decode(response.responseText),
                success = response.success,
                message = response.message;
                grid.unmask();
                if (success == true || success === true) {
                    toastr.success(message, "Success Response");

                        store.load();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            
            
            },
            failure: function (response) {
                grid.unmask();
                toastr.error('Server error', 'Failure Response');

            }
        });
   
    },
//     onItemClick: function (view, record, item, index, e, eOpts) {
//         var id = record.get('id');
//         var subject= record.get('subject');
//         var message= record.get('body');
//         var sender= record.get('sender');
//         var senderProfile= record.get('saved_name');
//         var attachment=record.get('attachment_name');
//         var recipient= record.get('sender_id');
//         grid = view.grid,
//         user_notification_id=record.get('user_notification_id'),
//         group_notification_id=record.get('group_notification_id'),
//         store = grid.getStore();
//         winTitle = 'Notifications Reply',
//         childXtype = Ext.widget('replyNotificationPnl');
//         childXtype.down('hiddenfield[name=notification_id]').setValue(id);
//         childXtype.down('hiddenfield[name=recipient_id]').setValue(recipient);
//         childXtype.down('displayfield[name=subject]').setValue(subject);
//         childXtype.down('displayfield[name=body]').setValue(message);
//        childXtype.down('displayfield[name=sender]').setValue(sender);
//        childXtype.down('#userImage').setSrc(base_url +'/resources/images/user-profile/'+ senderProfile);
//        childXtype.down('#attachments').setSrc(base_url +'/resources/images/user-profile/'+ attachment);
//        grid.mask('loading');
//        Ext.Ajax.request({
//           url: 'notifications/updateInboxNotification',
//           method: 'POST',
//           // timeout: 60000,
//           params:
//           {
//               id: id ,
//               user_notification_id: user_notification_id,
//               group_notification_id: group_notification_id,
//               _token: token

//           },
        
//           success: function (response,) {
//               var response = Ext.JSON.decode(response.responseText),
//               success = response.success,
//               message = response.message;
//               grid.unmask();
//               if (success == true || success === true) {
//                   toastr.success(message, "Success Response");
//                       store.load();
//               } else {
//                   toastr.error(message, 'Failure Response');
//               }
          
          
//           },
//           failure: function (response) {
//               grid.unmask();
//               toastr.error('Server error', 'Failure Response');

//           }
//       });
//       funcShowCustomizableWindow(winTitle, '70%', childXtype, 'customizablewindow');
//   },

  onItemClick: function (view, record, item, index, e, eOpts) {
      this.fireEvent('loadnotificationsReply',view, record);
    },
   
   
    setCurrentView: function(hashTag) {
        hashTag = (hashTag || '').toLowerCase();
        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            store = navigationList.getStore(),
            node = store.findNode('routeId', hashTag) ||
                   store.findNode('viewType', hashTag);
            if (node == null) {
            store.on('load',function (th, records, success, eOpts) {
                    //callback : function() {}
                    var store = navigationList.getStore();
                    node = store.findNode('routeId', hashTag) || store.findNode('viewType', hashTag);
                    me.setCurrentPage(node, store, me, hashTag, navigationList, mainCard, mainLayout);
                }
            );
        }
        else {
            //function call
            me.setCurrentPage(node, store, me, hashTag, navigationList, mainCard, mainLayout);
        }
    },
    markModuleNotificationClick: function (view, record, item, index, e, eOpts) {
        // alert('welcome')
        var id = record.get('id'),
        module_id= record.get('module_id')
           grid = view.grid,
           store = grid.getStore();
           
       grid.mask('Marking as read');
         Ext.Ajax.request({
            url: 'notifications/updateModuleNotification',
            method: 'POST',
            // timeout: 60000,
            params:
            {
                id: id ,
                module_id:module_id,
                _token: token

            },
          
            success: function (response,) {
                var response = Ext.JSON.decode(response.responseText),
                success = response.success,
                message = response.message;
                grid.unmask();
                if (success == true || success === true) {
                    toastr.success(message, "Success Response");

                        store.load();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            
            
            },
            failure: function (response) {
                grid.unmask();
                toastr.error('Server error', 'Failure Response');

            }
        });
   
    },
    markNotificationClick: function (btn) {
        var me = this,
        grid=btn.up('grid')
        store = grid.getStore();
    //    var grid = view.grid;
       grid.mask('Marking as read');
         Ext.Ajax.request({
            url: 'notifications/markAllNotifications',
            method: 'POST',
            // timeout: 60000,
            params:
            {
                _token: token
            },
          
            success: function (response,) {
                var response = Ext.JSON.decode(response.responseText),
                success = response.success,
                message = response.message;
                grid.unmask();
                if (success == true || success === true) {
                    toastr.success(message, "Success Response");

                         store.load();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            
            
            },
            failure: function (response) {
                grid.unmask();
                toastr.error('Server error', 'Failure Response');

            }
        });
   
    },
    test: function (btn) {
        var me = this,
        grid=btn.up('grid')
        store = grid.getStore();
    //    var grid = view.grid;
       grid.mask('testing');
         Ext.Ajax.request({
            url: 'notifications/submitPlannedActivities',
            method: 'GET',
            // timeout: 60000,
            params:
            {
                _token: token
            },
          
            success: function (response,) {
                var response = Ext.JSON.decode(response.responseText),
                success = response.success,
                message = response.message;
                grid.unmask();
                if (success == true || success === true) {
                    toastr.success(message, "Success Response");

                         store.load();
                } else {
                    toastr.error(message, 'Failure Response');
                }
            
            
            },
            failure: function (response) {
                grid.unmask();
                toastr.error('Server error', 'Failure Response');

            }
        });
   
    },
    //test
 
 showAddConfigParamWinFrm: function (btn) {
        var me = this,
            childXtype = btn.childXtype,
            winTitle=btn.winTitle,
            winWidth=btn.winWidth,
            child = Ext.widget(childXtype);
        
        if(btn.has_params){
            var param_value = btn.up('grid').down('hiddenfield[name='+btn.param_name+']').getValue();
            child.down('hiddenfield[name='+btn.param_name+']').setValue(param_value);
        }
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
       
    },
    showEditConfigParamWinFrm: function (item) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            childXtype = item.childXtype,
            winTitle=item.winTitle,
            winWidth=item.winWidth,
            form = Ext.widget(childXtype),
            storeArray = eval(item.stores),
            arrayLength = storeArray.length;
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        if(btn.has_params){
            var param_value = item.up('grid').down('hiddenfield[name='+btn.param_name+']').getValue();
            child.down('hiddenfield[name='+btn.param_name+']').setValue(param_value);
        }
        form.loadRecord(record);
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
    
    },
    doDeleteConfigWidgetParam: function (item) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            id = record.get('id'),
            storeID = item.storeID,
            table_name = item.table_name,
            url = item.action_url;
        this.fireEvent('deleteRecord', id, table_name, storeID, url);
    },
    doCreateConfigParamPanel: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form_xtype = btn.up('form'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID);
        var frm = form_xtype.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {table_name: table},
                waitMsg: 'Please wait...',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
    
                            store.load();
                        
                            form_xtype.destroy();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    doCreateConfigParamWin: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form_xtype = btn.up('form'),
           win= form_xtype.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID);
        var frm = form_xtype.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {table_name: table},
                waitMsg: 'Please wait...',
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
    
                            store.load();
                        
                            win.close();
                    } else {
                        toastr.error(message, 'Failure Response');
                    }
                },
                failure: function (form, action) {
                    var resp = action.result;
                    toastr.error(resp.message, 'Failure Response');
                }
            });
        }
    },
    func_closeFormWin: function(btn) {
        var form = btn.up('form')
            //panel = form.up('panel');
            console.log(form);
            form.destroy();
    },
    funcSendTraderEmailNotification: function(btn) {
        var form = btn.up('form'),
            store = Ext.getStore(btn.store)
            win = form.up('window');
        if (form.isValid()) {
                       form.submit({
                           url: btn.url,
                           method: 'POST',
                           waitMsg: 'Please wait...',
                           submitEmptyText: false,
                           headers: {
                               'Authorization': 'Bearer ' + access_token,
                               'X-CSRF-Token': token
                           },
                           success: function (form, action) {
                               var response = Ext.decode(action.response.responseText),
                                   success = response.success,
                                   message = response.message;
                               if (success == true || success === true) {
                                   toastr.success(message, "Success Response");
                                   store.removeAll();
                                   store.load();
                                   win.close();
                               } else {
                                   toastr.error(message, 'Failure Response');
                               }
                               win.close();
                           },
                           failure: function (form, action) {
                               var resp = action.result;
                               toastr.error(resp.message, 'Failure Response');
                           }
                       });
                 }

          },
          doDeleteConfigWidgetParam: function (item) {
            var me = this,
                btn = item.up('button'),
                record = btn.getWidgetRecord(),
                id = record.get('id'),
                storeID = item.storeID,
                table_name = item.table_name,
                url = item.action_url;
            this.fireEvent('deleteRecord', id, table_name, storeID, url);
        },
        
        func_deleteMail:function(btn) {
            var record = btn.getWidgetRecord(),
                store = btn.up('grid').getStore(),
                id = record.get('id');
            Ext.getBody().mask('Deleting mail...');
            Ext.Ajax.request({
                    url: 'notifications/DeleteTraderNotificationMail',
                    params: {
                        id: id
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                       Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message;
                        if (success || success == true || success === true) {
                            toastr.success(message, 'Success Response!!');
                            store.load();
                            
                        } else {
                            toastr.error(message, 'Failure Response!!');
                        }
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.warning(message, 'Failure Response!!');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
            
        },
});
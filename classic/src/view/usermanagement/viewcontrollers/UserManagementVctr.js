Ext.define('Admin.view.usermanagement.viewcontrollers.UserManagementVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.usermanagementvctr',

    /**
     * Called when the view is created
     */
    init: function () {

    }, 
    assignResponsibleUserToEnquiryApplication: function (view, record, item, index, e, eOpts) {
        var submission_id = record.get('submission_id'),
            application = 'Reference No: '+record.get('reference_no')+' -- Tracking-No: '+record.get('tracking_no'),
            form = Ext.widget('enquiriesTaskAssignmentFrm');
            
            form.loadRecord(record);
  
            form.down('displayfield[name=reference_no]').setValue(application);
            funcShowCustomizableWindow("Assign Application", "40%", form, 'customizablewindow');
          
      },
    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },

    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
    showSimpleUserModuleGridForm: function (btn) {
            var me = this,
                formWidget = btn.form,
                grid = btn.up('grid'),
                parentPanel = grid.up('panel'),
                form = Ext.widget(formWidget),
                storeArray = eval(btn.stores),
                arrayLength = storeArray.length;
            if (arrayLength > 0) {
                me.fireEvent('refreshStores', storeArray);
            }
            grid.hide();
            parentPanel.add(form);
       
    },
    func_referenceSearch:function(btn){
        var grid = btn.up('grid'),
            store = grid.store,
            reference = grid.down('textfield[name=Reference]').getValue();
            store.removeAll();
            store.load({
                params:{
                    reference:reference
                }
            })
    },
    userBackToDashboard: function (btn) {
        var currentPnl = btn.up('form'),
            containerPnlXtype = btn.containerPnlXtype,
            hiddenCompXtype = btn.hiddenCompXtype,
            containerPnl = btn.up(containerPnlXtype),
            grid = containerPnl.down(hiddenCompXtype);
        containerPnl.remove(currentPnl);
        grid.show();
    },

    userBackToDashboardFromActiveUsers: function (btn) {
        var currentPnlXtype = btn.currentPnlXtype,
            currentPnl = btn.up(currentPnlXtype),
            containerPnlXtype = btn.containerPnlXtype,
            hiddenCompXtype = btn.hiddenCompXtype,
            containerPnl = btn.up(containerPnlXtype),
            grid = containerPnl.down(hiddenCompXtype);
        containerPnl.remove(currentPnl);
        grid.show();
    },

    showEditUserParamGridFrm: function (item) {//for tree panels
        if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
            var me = this,
                btn = item.up('button'),
                grid = btn.up('grid'),
                parentPanel = grid.up('panel'),
                record = btn.getWidgetRecord(),
                formWidget = item.form,
                form = Ext.widget(formWidget),
                storeArray = eval(item.stores),
                arrayLength = storeArray.length;
            if (arrayLength > 0) {
                me.fireEvent('refreshStores', storeArray);
            }
            form.loadRecord(record);
            grid.hide();
            parentPanel.add(form);
        } else {
            toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
            return false;
        }
    },

    doCreateUserParam: function (btn) {
        var me = this,
            action_url = btn.action_url,
            form = btn.up('form'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID),
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: action_url,
                waitMsg: 'Please wait...',
                success: function (fm, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        store.removeAll();
                        store.load();
                        me.userBackToDashboard(btn);
                        toastr.success(message, "Success Response");
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

    doDeleteUserWidgetParam: function (item) {
        if (this.fireEvent('checkFullAccess')) {
            var me = this,
                btn = item.up('button'),
                record = btn.getWidgetRecord(),
                id = record.get('id'),
                storeID = item.storeID,
                table_name = item.table_name,
                url = item.action_url;
            this.fireEvent('deleteRecord', id, table_name, storeID, url);
        } else {
            toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
            return false;
        }
    },

    onPrevCardClick: function (btn) {
        var wizardPnl = btn.up('userswizardfrm'),
            motherPnl = wizardPnl.up('userspnl');
        motherPnl.getViewModel().set('atEnd', false);
        this.navigate(btn, wizardPnl, 'prev');
    },

    onNextCardClick: function (btn) {
        var wizardPnl = btn.up('userswizardfrm'),
            motherPnl = wizardPnl.up('userspnl'),
            basicFrm = wizardPnl.down('userbasicinfofrm'),
            department_id = basicFrm.down('combo[name=department_id]').getValue(),
            branch_id = basicFrm.down('combo[name=branch_id]').getValue();
        if (department_id && branch_id) {
            //continue
        } else {
            toastr.warning('Select department and zone!!', 'Warning Response');
            return false;
        }
        motherPnl.getViewModel().set('atBeginning', false);
        this.navigate(btn, wizardPnl, 'next');
    },

    navigate: function (button, panel, direction) {
        var layout = panel.getLayout(),
            progress = this.lookupReference('progress'),
            model = panel.up('userspnl').getViewModel(),
            progressItems = progress.items.items,
            item, i, activeItem, activeIndex;

        layout[direction]();

        activeItem = layout.getActiveItem();
        activeIndex = panel.items.indexOf(activeItem);

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (activeIndex === item.step) {
                item.setPressed(true);
            } else {
                item.setPressed(false);
            }

            // IE8 has an odd bug with handling font icons in pseudo elements;
            // it will render the icon once and not update it when something
            // like text color is changed via style addition or removal.
            // We have to force icon repaint by adding a style with forced empty
            // pseudo element content, (x-sync-repaint) and removing it back to work
            // around this issue.
            // See this: https://github.com/FortAwesome/Font-Awesome/issues/954
            // and this: https://github.com/twbs/bootstrap/issues/13863
            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }

        activeItem.focus();

        // beginning disables previous
        if (activeIndex === 0) {
            model.set('atBeginning', true);
        }

        // wizard is 4 steps. Disable next at end.
        if (activeIndex === 1) {
            model.set('atEnd', true);
        }
    },

    quickNavigation: function (btn) {
        var step = btn.step,
            formPnl = btn.up('userswizardfrm'),
            motherPnl = formPnl.up('userspnl'),
            basicFrm = formPnl.down('userbasicinfofrm'),
            department_id = basicFrm.down('combo[name=department_id]').getValue(),
            branch_id = basicFrm.down('combo[name=branch_id]').getValue(),
            progress = formPnl.down('#progress_tbar'),
            progressItems = progress.items.items;

        if (step > 0) {
            var thisItem = progressItems[step];
            if (department_id && branch_id) {
                //continue
            } else {
                thisItem.setPressed(false);
                toastr.warning('Select department and zone!!', 'Warning Response');
                return false;
            }
        }

        if (step == 1) {
            motherPnl.getViewModel().set('atEnd', true);
        } else {
            motherPnl.getViewModel().set('atEnd', false);
        }
        if (step == 0) {
            motherPnl.getViewModel().set('atBeginning', true);
        } else {
            motherPnl.getViewModel().set('atBeginning', false);
        }

        formPnl.getLayout().setActiveItem(step);
        var layout = formPnl.getLayout(),
            model = motherPnl.getViewModel(),
            item = null,
            i = 0,
            activeItem = layout.getActiveItem(),
            activeIndex = formPnl.items.indexOf(activeItem);

        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (step === item.step) {
                item.setPressed(true);
            } else {
                item.setPressed(false);
            }

            if (Ext.isIE8) {
                item.btnIconEl.syncRepaint();
            }
        }
        activeItem.focus();
    },

    saveUserInformation: function (btn) {
        if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
            var me = this,
                progressPanel = btn.up('userswizardfrm'),
                containerPanel = progressPanel.up('activeuserspnl'),
                userPnl = progressPanel.up('userspnl'),
                dashboardContainer = containerPanel.up('#ActiveUsersDashboard'),
                grid = containerPanel.down('grid'),
                form = progressPanel.down('userbasicinfofrm'),
                frm = form.getForm(),
                assignedGroups = progressPanel.down('dropgroupgrid'),
                assignedGroupsStore = assignedGroups.store,
                groupsArray = [];
            assignedGroupsStore.each(function (record, idx) {
                var group_id = record.get('id');
                groupsArray.push(group_id);
            });
            if (frm.isValid()) {
                //a user must have a group and a role/post
                if (assignedGroupsStore.data.items.length < 1) {
                    //Store is empty
                    toastr.warning('A user must belong to at least one group. Please assign user to the group!!', 'Warning Response');
                    return false;
                }
                frm.submit({
                    clientValidation: false,
                    url: 'usermanagement/saveUserInformation',
                    method: 'POST',
                    contentType: false,
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Accept': 'application/json'
                    },
                    params: {
                        groups: JSON.stringify(groupsArray)
                    },
                    waitMsg: 'Please wait...',
                    success: function (fm, action) {
                        var response = Ext.decode(action.response.responseText),
                            message = response.message,
                            success = response.success;
                        if (success == true || success === true) {
                            /*dashboardContainer*/
                            containerPanel.remove(userPnl, true);
                            grid.store.load();
                            grid.show();
                            toastr.success(message, 'Success Response');
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            message = response.message,
                            success = response.success;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
            } else {
                toastr.warning('Invalid form submission, please fill all the required details!!', 'Warning Response');
                return false;
            }
        } else {
            toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
            return false;
        }
    },
    
    saveUpdateUserInformation: function (btn) {
       var form=  btn.up('form');
       var window = form.up('window')
       console.log(form);
        if(form.isValid()){
                form.submit({
                    url: 'usermanagement/saveUpdateUserInformation',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Accept': 'application/json'
                    },
                    waitMsg: 'Please wait...',
                    success: function (fm, action) {
                        var response = Ext.decode(action.response.responseText),
                            message = response.message,
                            success = response.success;
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                            window.close();
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            message = response.message,
                            success = response.success;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
            }else {
                toastr.warning('Invalid form submission, please fill all the required details!!', 'Warning Response');
                return false;
            }
        
    },

    onDropDragGroupGrid: function (node, data, dropRec, dropPosition) {
        this.onDrop(dropRec, data.records[0], dropPosition, 'Drag from right to left');
    },

    onDropDropGroupGrid: function (node, data, dropRec, dropPosition) {
        this.onDrop(dropRec, data.records[0], dropPosition, 'Drag from left to right');
    },

    onDropDragRoleGrid: function (node, data, dropRec, dropPosition) {
        this.onDrop(dropRec, data.records[0], dropPosition, 'Drag from right to left');
    },

    onDropDropRoleGrid: function (node, data, dropRec, dropPosition) {
        this.onDrop(dropRec, data.records[0], dropPosition, 'Drag from left to right');
    },

    onDrop: function (onRec, rec, dropPosition, title) {
        var dropOn = onRec ? ' ' + dropPosition + ' ' + onRec.get('name') : ' on empty view';
    },

    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

    // uploadUserImage: function (btn) {
    //     var me = this,
    //         form = btn.up('form'),
    //         profile_field = form.down('image[name=user_photo]'),
    //         uploaded_img = form.down('filefield[name=profile_photo]').getValue(),
    //         frm = form.getForm();
    //     frm.submit({
    //         clientValidation: false,
    //         url: 'usermanagement/saveUserImage',
    //         params: {
    //             _token: token
    //         },
    //         headers: {
    //             'Authorization': 'Bearer ' + access_token,
    //             'Accept': 'application/x-www-form-urlencoded'
    //         },
    //         waitMsg: 'Uploading...',
    //         success: function (fm, action) {
    //             var response = Ext.decode(action.response.responseText),
    //                 message = response.message,
    //                 success = response.success;
    //             if (success == true || success === true) {
    //                 var savedName = response.image_name;
    //                 toastr.success(message, 'Success Response');
    //                 form.down('image[name=user_photo]').setSrc(base_url + '/resources/images/user-profile/' + savedName);
    //                 form.down('hiddenfield[name=saved_name]').setValue(savedName);
    //             } else {
    //                 toastr.error(message, 'Failure Response');
    //             }
    //         },
    //         failure: function (fm, action) {
    //             var response = Ext.decode(action.response.responseText),
    //                 message = response.message;
    //             toastr.error(message, 'Failure Response');
    //         },
    //         error: function (jqXHR, textStatus, errorThrown) {
    //             toastr.error('Error: ' + errorThrown, 'Error Response');
    //         }
    //     });
    // },

    showEditSystemUser: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            profile_url = record.get('saved_name'),
            user_id = record.get('id'),
            directorate_units = record.get('directorate_units'),
            panel = grid.up('panel'),
            userContainerPnl = Ext.widget('userspnl'),
            userWizardPnl = userContainerPnl.down('userswizardfrm'),
            basicFrm = userWizardPnl.down('userbasicinfofrm');
           
        //basicFrm.down('textfield[name=email]').setReadOnly(true);
        userWizardPnl.down('hiddenfield[name=active_user_id]').setValue(user_id);
        userWizardPnl.down('button[action=reset_pwd]').setVisible(true);
        userWizardPnl.down('button[action=block]').setVisible(true);
        userWizardPnl.down('button[action=delete]').setVisible(true);
        basicFrm.loadRecord(record);
        /*if(directorate_units != ''){
            
            directorate_unitArray = directorate_units.split(",")
            basicFrm.down('tagfield[name=directorate_units]').setValue(directorate_unitArray);
       
        }
        */
       
        if (profile_url) {
            var viewModel = basicFrm.getViewModel();
            viewModel.set('imgData', base_url + '/resources/images/user-profile/' + profile_url);
            // basicFrm.down('image[name=user_photo]').setSrc(base_url + '/resources/images/user-profile/' + profile_url);
        }

        grid.hide();
        panel.add(userContainerPnl);
    },


getUpdateinfo: function(form){
    // var form=form.getForm();
  console.log(form);
         Ext.Ajax.request({
                url: 'usermanagement/getUpdateInfo',
                method: 'GET',
               
                success: function (response) {
                   Ext.getBody().unmask();
                   var  resp =Ext.JSON.decode(response.responseText),
                   message = resp.message,
                   success=resp.success;
                   if(success == true || success === true) {
                       var results = resp.results,
                      
                       model= Ext.create('Ext.data.Model',results);
                       form.loadRecord(model);
                       file_name=results.profile_photo;
                       form.getViewModel().set('imgData', base_url + '/resources/images/user-profile/' + file_name);
                   }
                },
                failure: function (response) {
                    Ext.Msg.alert('Status', 'Request Failed.');
    
                }
            });
},

    showUploadUserSignature: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            record = btn.getWidgetRecord(),
            user_id = record.get('id'),
            user = record.get('fullnames'),
            childObject = Ext.widget('signatureuploadfrm');
        childObject.down('hiddenfield[name=user_id]').setValue(user_id);
        funcShowCustomizableWindow(user, '30%', childObject, 'customizablewindow');
    },

    updateModelUserFirstNameOnChange: function (textfield, newVal, oldVal) {
        var form = textfield.up('form'),
            containerPnl = form.up('userspnl'),
            vm = containerPnl.getViewModel();
        vm.set('firstName', newVal);
    },

    updateModelUserLastNameOnChange: function (textfield, newVal, oldVal) {
        var form = textfield.up('form'),
            containerPnl = form.up('userspnl'),
            vm = containerPnl.getViewModel();
        vm.set('lastName', newVal);
    },

    updateModelUserEmailOnChange: function (textfield, newVal, oldVal) {
        var form = textfield.up('form'),
            containerPnl = form.up('userspnl'),
            vm = containerPnl.getViewModel();
        vm.set('email', newVal);
    },

    resetUserPassword: function (btn) {
        var me = this,
            panel = btn.up('panel'),
            basic_frm = panel.down('userbasicinfofrm'),
            user_id = basic_frm.down('hiddenfield[name=id]').getValue(),
            form = Ext.widget('passresetoptionsfrm');
        form.down('hiddenfield[name=user_id]').setValue(user_id);
        funcShowCustomizableWindow('Password Reset Options', '30%', form, 'customizablewindow');
    },

    deactivateSystemUser: function (button) {
        var me = this,
            wizardFrmPnl = button.up('userswizardfrm'),
            basicUserFrm = wizardFrmPnl.down('userbasicinfofrm'),
            containerPanel1 = wizardFrmPnl.up('userspnl'),
            containerPanel2 = containerPanel1.up('panel'),
            grid = containerPanel2.down('grid'),
            id = basicUserFrm.down('hiddenfield[name=id]').getValue(),
            email = basicUserFrm.down('textfield[name=email]').getValue(),
            table_name = 'users',
            storeID = 'usersstr',
            action_url = 'usermanagement/blockSystemUser',
            store = Ext.getStore(storeID);
        Ext.MessageBox.show({
            title: 'Reason',
            msg: 'Please enter the reason for blocking/deactivating this user:',
            width: 320,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: true,
            scope: this,
            // fn: this.deactivateSystemUser(btn, me),
            animateTarget: button,
            fn: function (btn, text) {
                var reason = text;
                if (btn === 'ok') {
                    if (reason == '' || reason === '') {
                        toastr.warning('Please Enter Reason!!', 'Warning Response');
                        return;
                    }
                    Ext.getBody().mask('Blocking user...');
                    Ext.Ajax.request({
                        url: action_url,
                        params: {
                            table_name: table_name,
                            reason: reason,
                            email: email,
                            id: id,
                            _token: token
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText);
                            toastr.success(resp.message, 'Success Response');
                            store.removeAll();
                            store.load();
                            containerPanel2.remove(containerPanel1, true);
                            grid.show();
                        },
                        failure: function (response) {
                            Ext.getBody().unmask();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            Ext.getBody().unmask();
                            toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                        }
                    });
                }
            }
        });
    },

    deleteSystemUser: function (button) {
        var me = this,
            wizardFrmPnl = button.up('userswizardfrm'),
            containerPanel1 = wizardFrmPnl.up('userspnl'),
            containerPanel2 = containerPanel1.up('panel'),
            basicFrm = wizardFrmPnl.down('userbasicinfofrm'),
            grid = containerPanel2.down('grid'),
            id = basicFrm.down('hiddenfield[name=id]').getValue(),
            table_name = 'users',
            storeID = 'usersstr',
            action_url = 'usermanagement/deleteUserRecord',
            store = Ext.getStore(storeID);

        Ext.MessageBox.confirm('Confirm', 'Are you sure to delete this user ?', function (btn) {
            if (btn === 'yes') {
                Ext.getBody().mask('Deleting user...');
                Ext.Ajax.request({
                    url: action_url,
                    params: {
                        table_name: table_name,
                        id: id,
                        _token: token
                    },
                    headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText);
                        toastr.success(resp.message, 'Success Response');
                        store.removeAll();
                        store.load();
                        containerPanel2.remove(containerPanel1, true);
                        grid.show();
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                    }
                });
            } else {
                //
            }
        });
    },

    unblockSystemUser: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            id = record.get('id'),
            user_id = record.get('account_id'),
            action_url = 'usermanagement/unblockSystemUser',
            store = grid.getStore();
        Ext.MessageBox.show({
            title: 'Reason',
            msg: 'Please enter the reason for unblocking this user:',
            width: 320,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: true,
            scope: this,
            //animateTarget: view,
            fn: function (btn, text) {
                var reason = text;
                if (btn === 'ok') {
                    if (reason == '' || reason === '') {
                        toastr.warning('Please Enter Reason!!', 'Warning Response');
                        return;
                    }
                    Ext.getBody().mask('Activating user...');
                    Ext.Ajax.request({
                        url: action_url,
                        params: {
                            reason: reason,
                            id: id,
                            user_id: user_id,
                            _token: token
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText);
                            toastr.success(resp.message, 'Success Response');
                            store.load();
                        },
                        failure: function (response) {
                            Ext.getBody().unmask();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            Ext.getBody().unmask();
                            toastr.error('Error activating user: ' + errorThrown, 'Error Response');
                        }
                    });
                }
            }
        });
    },


    //api user
showEditApiSystemUser: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            profile_url = record.get('saved_name'),
            user_id = record.get('id'),
            panel = grid.up('panel'),
            userContainerPnl = Ext.widget('apiusersFrmpnl'),
            userWizardPnl = userContainerPnl.down('apiuserswizardfrm'),
            basicFrm = userWizardPnl.down('apiuserbasicinfofrm');
        basicFrm.down('textfield[name=email]').setReadOnly(true);
        userWizardPnl.down('hiddenfield[name=api_user_id]').setValue(user_id);
        userWizardPnl.down('button[action=block]').setVisible(true);
        userWizardPnl.down('button[action=delete]').setVisible(true);
        basicFrm.loadRecord(record);
        if (profile_url) {
            basicFrm.down('image[name=user_photo]').setSrc(base_url + '/resources/images/user-profile/' + profile_url);
        }
        grid.hide();
        panel.add(userContainerPnl);
    },
     showUploadApiUserSignature: function (item) {
        var btn = item.up('button'),
            grid = btn.up('grid'),
            record = btn.getWidgetRecord(),
            user_id = record.get('id'),
            user = record.get('fullnames'),
            childObject = Ext.widget('signatureuploadfrm');
        childObject.down('hiddenfield[name=user_id]').setValue(user_id);
        funcShowCustomizableWindow(user, '30%', childObject, 'customizablewindow');
    },

    updateModelApiUserFirstNameOnChange: function (textfield, newVal, oldVal) {
        var form = textfield.up('form'),
            containerPnl = form.up('apiusersFrmpnl'),
            vm = containerPnl.getViewModel();
        vm.set('firstName', newVal);
    },

    updateModelApiUserLastNameOnChange: function (textfield, newVal, oldVal) {
        var form = textfield.up('form'),
            containerPnl = form.up('apiusersFrmpnl'),
            vm = containerPnl.getViewModel();
        vm.set('lastName', newVal);
    },

    updateModelApiUserEmailOnChange: function (textfield, newVal, oldVal) {
        var form = textfield.up('form'),
            containerPnl = form.up('apiusersFrmpnl'),
            vm = containerPnl.getViewModel();
        vm.set('email', newVal);
    },
 saveApiUserInformation: function (btn) {
        if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
            var me = this,
                progressPanel = btn.up('apiuserswizardfrm'),
                containerPanel = progressPanel.up('apiuserspnl'),
                userPnl = progressPanel.up('apiusersFrmpnl'),
                dashboardContainer = containerPanel.up('#ApiUsersDashboard'),
                grid = containerPanel.down('grid'),
                form = progressPanel.down('apiuserbasicinfofrm'),
                frm = form.getForm();
               
            if (frm.isValid()) {
                //a user must have a group and a role/post
               
                frm.submit({
                    url: 'usermanagement/saveApiUserInformation',
                    params: {
                        _token: token
                    },
                    headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                    waitMsg: 'Please wait...',

                    success: function (fm, action) {
                        var response = Ext.decode(action.response.responseText),
                            message = response.message,
                            success = response.success;
                        if (success == true || success === true) {
                            /*dashboardContainer*/
                            containerPanel.remove(userPnl, true);
                            grid.store.load();
                            grid.show();
                            toastr.success(message, 'Success Response');
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            message = response.message,
                            success = response.success;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
            } else {
                toastr.warning('Invalid form submission, please fill all the required details!!', 'Warning Response');
                return false;
            }
        } else {
            toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
            return false;
        }
    },
     deactivateSystemApiUser: function (button) {
        var me = this,
            wizardFrmPnl = button.up('apiuserswizardfrm'),
            basicUserFrm = wizardFrmPnl.down('apiuserbasicinfofrm'),
            containerPanel1 = wizardFrmPnl.up('apiusersFrmpnl'),
            containerPanel2 = containerPanel1.up('panel'),
            grid = containerPanel2.down('grid'),
            id = basicUserFrm.down('hiddenfield[name=id]').getValue(),
            email = basicUserFrm.down('textfield[name=email]').getValue(),
            table_name = 'apiusers',
            storeID = 'apiusersstr',
            action_url = 'usermanagement/blockSystemApiUser',
            store = Ext.getStore(storeID);
        Ext.MessageBox.show({
            title: 'Reason',
            msg: 'Please enter the reason for blocking/deactivating this user:',
            width: 320,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: true,
            scope: this,
            // fn: this.deactivateSystemUser(btn, me),
            animateTarget: button,
            fn: function (btn, text) {
                var reason = text;
                if (btn === 'ok') {
                    if (reason == '' || reason === '') {
                        toastr.warning('Please Enter Reason!!', 'Warning Response');
                        return;
                    }
                    Ext.getBody().mask('Blocking user...');
                    Ext.Ajax.request({
                        url: action_url,
                        params: {
                            table_name: table_name,
                            reason: reason,
                            email: email,
                            id: id,
                            _token: token
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText);
                            toastr.success(resp.message, 'Success Response');
                            store.removeAll();
                            store.load();
                            containerPanel2.remove(containerPanel1, true);
                            grid.show();
                        },
                        failure: function (response) {
                            Ext.getBody().unmask();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            Ext.getBody().unmask();
                            toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                        }
                    });
                }
            }
        });
    },

    deleteSystemApiUser: function (button) {
        var me = this,
            wizardFrmPnl = button.up('apiuserswizardfrm'),
            containerPanel1 = wizardFrmPnl.up('apiusersFrmpnl'),
            containerPanel2 = containerPanel1.up('panel'),
            basicFrm = wizardFrmPnl.down('apiuserbasicinfofrm'),
            grid = containerPanel2.down('grid'),
            id = basicFrm.down('hiddenfield[name=id]').getValue(),
            table_name = 'apiusers',
            storeID = 'apiusersstr',
            action_url = 'usermanagement/deleteUserRecord',
            store = Ext.getStore(storeID);

        Ext.MessageBox.confirm('Confirm', 'Are you sure to delete this user ?', function (btn) {
            if (btn === 'yes') {
                Ext.getBody().mask('Deleting user...');
                Ext.Ajax.request({
                    url: action_url,
                    params: {
                        table_name: table_name,
                        id: id,
                        _token: token
                    },
                    headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText);
                        toastr.success(resp.message, 'Success Response');
                        store.removeAll();
                        store.load();
                        containerPanel2.remove(containerPanel1, true);
                        grid.show();
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                    }
                });
            } else {
                //
            }
        });
    },

    unblockSystemApiUser: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            id = record.get('id'),
            user_id = record.get('account_id'),
            action_url = 'usermanagement/unblockSystemUser',
            store = grid.getStore();
        Ext.MessageBox.show({
            title: 'Reason',
            msg: 'Please enter the reason for unblocking this user:',
            width: 320,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: true,
            scope: this,
            //animateTarget: view,
            fn: function (btn, text) {
                var reason = text;
                if (btn === 'ok') {
                    if (reason == '' || reason === '') {
                        toastr.warning('Please Enter Reason!!', 'Warning Response');
                        return;
                    }
                    Ext.getBody().mask('Activating user...');
                    Ext.Ajax.request({
                        url: action_url,
                        params: {
                            reason: reason,
                            id: id,
                            user_id: user_id,
                            _token: token
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText);
                            toastr.success(resp.message, 'Success Response');
                            store.load();
                        },
                        failure: function (response) {
                            Ext.getBody().unmask();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            Ext.getBody().unmask();
                            toastr.error('Error activating user: ' + errorThrown, 'Error Response');
                        }
                    });
                }
            }
        });
    },
    activateApiUser:function(item) {
        var me = this,
            btn = item.up('button'),
            gridstr=btn.up('grid').getStore();
            record = btn.getWidgetRecord();
          console.log(record.id);
        Ext.Ajax.request({
                        url: item.action_url,
                        method: 'GET',
                        params: {
                            id: record.id,
                            _token: token
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText);
                            toastr.success(resp.message, 'Success Response');
                            gridstr.load();
                        },
                        failure: function (response) {
                            Ext.getBody().unmask();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            Ext.getBody().unmask();
                            toastr.error('Error altering user: ' + errorThrown, 'Error Response');
                        }
                    });
    },



    //external user
    showEditExternalSystemUser: function (view, record, item, index, e, eOpts) {
        var me = this,
            grid = view.grid,
            user_id = record.get('id'),
            panel = grid.up('panel'),
            userContainerPnl = Ext.widget('externalusersFrmpnl'),
            userWizardPnl = userContainerPnl.down('externaluserswizardfrm'),
            basicFrm = userWizardPnl.down('externaluserbasicinfofrm');
        basicFrm.down('textfield[name=email]').setReadOnly(true);
        userWizardPnl.down('hiddenfield[name=external_user_id]').setValue(user_id);
        userWizardPnl.down('button[action=block]').setVisible(true);
        userWizardPnl.down('button[action=delete]').setVisible(true);
        basicFrm.loadRecord(record);
        grid.hide();
        panel.add(userContainerPnl);
    },

    saveExternalUserInformation: function (btn) {
        if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
            var me = this,
                progressPanel = btn.up('externaluserswizardfrm'),
                containerPanel = progressPanel.up('externaluserspnl'),
                userPnl = progressPanel.up('externalusersFrmpnl'),
                dashboardContainer = containerPanel.up('#ExternalUsersDashboard'),
                grid = containerPanel.down('grid'),
                form = progressPanel.down('externaluserbasicinfofrm'),
                frm = form.getForm();
               
            if (frm.isValid()) {
                //a user must have a group and a role/post
               
                frm.submit({
                    url: 'usermanagement/saveExternalUserInformation',
                    params: {
                        _token: token
                    },
                    headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                    waitMsg: 'Please wait...',
                    success: function (fm, action) {
                        var response = Ext.decode(action.response.responseText),
                            message = response.message,
                            success = response.success;
                        if (success == true || success === true) {
                            /*dashboardContainer*/
                            containerPanel.remove(userPnl, true);
                            grid.store.load();
                            grid.show();
                            toastr.success(message, 'Success Response');
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (form, action) {
                        var response = Ext.decode(action.response.responseText),
                            message = response.message,
                            success = response.success;
                        toastr.error(message, 'Failure Response');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
            } else {
                toastr.warning('Invalid form submission, please fill all the required details!!', 'Warning Response');
                return false;
            }
        } else {
            toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
            return false;
        }
    },
     deactivateSystemExternalUser: function (button) {
        var me = this,
            wizardFrmPnl = button.up('externaluserswizardfrm'),
            basicUserFrm = wizardFrmPnl.down('externaluserbasicinfofrm'),
            containerPanel1 = wizardFrmPnl.up('externalusersFrmpnl'),
            containerPanel2 = containerPanel1.up('panel'),
            grid = containerPanel2.down('grid'),
            id = basicUserFrm.down('hiddenfield[name=id]').getValue(),
            email = basicUserFrm.down('textfield[name=email]').getValue(),
            table_name = 'external_users',
            storeID = 'externalusersstr',
            action_url = 'usermanagement/blockSystemExternalUser',
            store = Ext.getStore(storeID);
        Ext.MessageBox.show({
            title: 'Reason',
            msg: 'Please enter the reason for blocking/deactivating this user:',
            width: 320,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: true,
            scope: this,
            // fn: this.deactivateSystemUser(btn, me),
            animateTarget: button,
            fn: function (btn, text) {
                var reason = text;
                if (btn === 'ok') {
                    if (reason == '' || reason === '') {
                        toastr.warning('Please Enter Reason!!', 'Warning Response');
                        return;
                    }
                    Ext.getBody().mask('Blocking user...');
                    Ext.Ajax.request({
                        url: action_url,
                        params: {
                            table_name: table_name,
                            reason: reason,
                            email: email,
                            id: id,
                            _token: token
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText);
                            toastr.success(resp.message, 'Success Response');
                            store.removeAll();
                            store.load();
                            containerPanel2.remove(containerPanel1, true);
                            grid.show();
                        },
                        failure: function (response) {
                            Ext.getBody().unmask();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            Ext.getBody().unmask();
                            toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                        }
                    });
                }
            }
        });
    },

    deleteSystemExternalUser: function (button) {
        var me = this,
            wizardFrmPnl = button.up('externaluserswizardfrm'),
            containerPanel1 = wizardFrmPnl.up('externalusersFrmpnl'),
            containerPanel2 = containerPanel1.up('panel'),
            basicFrm = wizardFrmPnl.down('externaluserbasicinfofrm'),
            grid = containerPanel2.down('grid'),
            id = basicFrm.down('hiddenfield[name=id]').getValue(),
            table_name = 'external_users',
            storeID = 'externalusersstr',
            action_url = 'usermanagement/deleteUserRecord',
            store = Ext.getStore(storeID);

        Ext.MessageBox.confirm('Confirm', 'Are you sure to delete this user ?', function (btn) {
            if (btn === 'yes') {
                Ext.getBody().mask('Deleting user...');
                Ext.Ajax.request({
                    url: action_url,
                    params: {
                        table_name: table_name,
                        id: id,
                        _token: token
                    },
                    headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText);
                        toastr.success(resp.message, 'Success Response');
                        store.removeAll();
                        store.load();
                        containerPanel2.remove(containerPanel1, true);
                        grid.show();
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error deleting data: ' + errorThrown, 'Error Response');
                    }
                });
            } else {
                //
            }
        });
    },showAddConfigParamWinFrm: function (btn) {
        //if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
        var me = this,
            childXtype = btn.childXtype,
            winTitle=btn.winTitle,
            winWidth=btn.winWidth,
            child = Ext.widget(childXtype),
            storeArray = eval(btn.stores),
            arrayLength = storeArray.length;
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
        /* } else {
             toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
             return false;
         }*/
    }, showEditConfigParamWinFrm: function (item) {
        //if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
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
        form.loadRecord(record);
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
        /* } else {
             toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
             return false;
         }*/
    },
    funcSearchPositionSetupdetails:function(btn){
            var grid = btn.up('grid'),
                date_from = grid.down('datefield[name=date_from]').getValue(),
                date_to = grid.down('datefield[name=date_to]').getValue(),
                store = grid.store;
                store.removeAll();
                store.load({
                    params:{
                        date_from: date_from,
                        date_to: date_to
                    }
                })

            
    },
    funcClearPositionSetupdetails:function(btn){
        var grid = btn.up('grid');
        grid.down('datefield[name=date_from]').setValue();
        grid.down('datefield[name=date_to]').setValue();
        store = grid.store;
        store.removeAll();
        store.load()
    },
    doCreateConfigParamWin: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form_xtype = btn.up('form'),
            win = form_xtype.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore(storeID);

        var frm = form_xtype.getForm();
            
        if (frm.isValid()) {
            frm.submit({
                url: url,
                // params: {model: table},
                waitMsg: 'Please wait...',
                 
                success: function (form, action) {
                    var response = Ext.decode(action.response.responseText),
                        success = response.success,
                        message = response.message;
                    if (success == true || success === true) {
                        toastr.success(message, "Success Response");
                        store.removeAll();
                        if(form_xtype.down('hiddenfield[name=common_name_id]')){

                            store.load({params:{common_name_id: form_xtype.down('hiddenfield[name=common_name_id]').getValue()}});
                        }
                        else{

                            store.load();
                        }
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

     func_makeResubmissionRequest:function(item) {
        var me = this,
            btn = item.up('button'),
            grid =btn.up('grid'),
            gridstr=btn.up('grid').getStore();
            record = btn.getWidgetRecord();
            module_id = record.get('module_id'),
            current_stage = record.get('current_stage'),
            application_code = record.get('application_code'),
            workflow_stage_id = record.get('workflow_stage_id'),
            Ext.getBody().mask(item.action+'...');
       
          
        Ext.Ajax.request({
            url: item.action_url,
            method: 'GET',
            params: {
                submission_id: record.id,
                module_id: module_id,
                current_stage:current_stage,
                application_code:application_code,
                workflow_stage_id: workflow_stage_id ,
                _token: token
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Accept': 'application/json'
            },
            success: function (response) {
                Ext.getBody().unmask();
                var resp = Ext.JSON.decode(response.responseText);
                toastr.success(resp.message, 'Success Response');
                gridstr.removeAll();
                gridstr.load();
                if(Ext.getStore('intraystr')){
                    Ext.getStore('intraystr').load();
                }
                
            },
            failure: function (response) {
                 var resp = Ext.JSON.decode(response.responseText);
                 toastr.error(resp.message, 'Failure Response');
                Ext.getBody().unmask();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Ext.getBody().unmask();
                toastr.error('Error : ' + errorThrown, 'Error Response');
            }
        });
    },


    func_reassignTask: function (btn) {
        var me = this,
            form_xtype = btn.up('form'),
            storeID = btn.storeID,
            win = form_xtype.up('window'),
            store = Ext.getStore(storeID);

        var frm = form_xtype.getForm();
            
        if (frm.isValid()) {
            frm.submit({
                url: 'usermanagement/doReassignApplicationTask',
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
    func_loadResponsibleUsers(combo){
        var frm = combo.up('form'),
            next_stage = frm.down('hiddenfield[name = workflow_stage_id]').getValue(),
            store = combo.getStore();
        store.load({params:{next_stage:next_stage}});
    },
    func_hideshowOnlineSubmissionRequest: function (item) {
        var me = this,
            btn = item.up('button'),
            gridstr=btn.up('grid').getStore();
            record = btn.getWidgetRecord();
            Ext.getBody().mask(item.action+' application...');
       
        Ext.Ajax.request({
                        url: item.action_url,
                        method: 'GET',
                        params: {
                            submission_id: record.id,
                            action_type: item.action_type,
                            _token: token
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Accept': 'application/json'
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText);
                            toastr.success(resp.message, 'Success Response');
                            gridstr.removeAll();
                            gridstr.load();
                        },
                        failure: function (response) {
                             var resp = Ext.JSON.decode(response.responseText);
                             toastr.error(resp.message, 'Failure Response');
                            Ext.getBody().unmask();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            Ext.getBody().unmask();
                            toastr.error('Error : ' + errorThrown, 'Error Response');
                        }
                    });
    },
    showUserLoginLogs: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            childXtype = 'loginLogsGrid',
            winTitle= 'Login Logs',
            winWidth= '80%',
            grid = Ext.widget(childXtype);
            grid.down('combo[name=user_id]').setValue(record.get('id'));
            grid.down('combo[name=user_id]').setReadOnly(true);
        funcShowCustomizableWindow(winTitle, winWidth, grid, 'customizablewindow');
              
    },
    showUserPasswordResetLogs: function (item) {
        var btn = item.up('button'),
            record = btn.getWidgetRecord(),
            childXtype = item.childXtype,
            winTitle= item.winTitle,
            winWidth= item.winWidth,
            grid = Ext.widget(childXtype);
            grid.down('displayfield[name=user_name]').setValue(record.get('first_name')+" "+record.get('last_name')+" Logs");
            grid.down('hiddenfield[name=user_id]').setValue(record.get('id'));
            
        funcShowCustomizableWindow(winTitle, winWidth, grid, 'customizablewindow');
              
    },
    showPreviewUpdatedUserDetails: function(view, record, item, index, e, eOpts) {
     var me = this,
            profile_url = record.get('saved_name'),
            user_id = record.get('id'),
            directorate_units = record.get('directorate_units'),
            userContainerPnl = Ext.widget('userspnl'),
            userWizardPnl = userContainerPnl.down('userswizardfrm'),
            basicFrm = userWizardPnl.down('userbasicinfofrm');
           
        //basicFrm.down('textfield[name=email]').setReadOnly(true);
        userWizardPnl.down('hiddenfield[name=active_user_id]').setValue(user_id);
        userWizardPnl.down('button[action=reset_pwd]').setVisible(false);
        userWizardPnl.down('button[action=block]').setVisible(false);
        userWizardPnl.down('button[action=save]').setVisible(false);
        userWizardPnl.down('button[action=reset_pwd]').setVisible(false);
        userWizardPnl.down('button[action=block]').setVisible(false);
        userWizardPnl.down('button[action=delete]').setVisible(false);
        userWizardPnl.down('button[action=next_user_card]').setVisible(false);
        userWizardPnl.down('button[text=Next]').setVisible(false);
        userWizardPnl.down('button[action=back]').setVisible(false);
        userWizardPnl.down('filefield[name=profile_photo]').setVisible(false);
        userWizardPnl.down('button[step=1]').setVisible(false);
        basicFrm.loadRecord(record);
        /*if(directorate_units != ''){
            
            directorate_unitArray = directorate_units.split(",")
            basicFrm.down('tagfield[name=directorate_units]').setValue(directorate_unitArray);
       
        }
        */
       userContainerPnl.setHeight(Ext.Element.getViewportHeight() - 118);
        if (profile_url) {
            basicFrm.down('image[name=user_photo]').setSrc(base_url + '/resources/images/user-profile/' + profile_url);
        }
        funcShowCustomizableWindow("Update Logs", "70%", userContainerPnl, 'customizablewindow');

    },
    onPwdResetOptionProceed: function (btn) {
        var me = this,
            form = btn.up('form'),
            win1 = form.up('window'),
            option = form.down('combo[name=reset_option]').getValue(),
            user_id = form.down('hiddenfield[name=user_id]').getValue();
        if (option == 1 || option === 1) {
            me.resetUserPasswordToDefault(user_id, win1);
        } else {
            var form2 = Ext.widget('userresetpwdfrm');
            form2.down('hiddenfield[name=user_id]').setValue(user_id);
            win1.close();
            funcShowCustomizableWindow('Password Change Request', '30%', form2, 'customizablewindow');
        }
    },
    resetUserPasswordToDefault: function (user_id, win) {
        var mask = new Ext.LoadMask({
            msg: 'Please wait...',
            target: win
        });
        Ext.MessageBox.confirm('Confirm', 'This will reset user\'s credentials to default settings. Do you really want to perform this action?', function (btn) {
            if (btn === 'yes') {
                mask.show();
                Ext.Ajax.request({
                    url: 'usermanagement/resetUserPassword',
                    params: {
                        id: user_id,
                        _token: token
                    },
                    success: function (response) {
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        mask.hide();
                        win.close();
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        toastr.error(message, 'Failure Response');
                        mask.hide();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        mask.hide();
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
            }
        });
    },
    updateUserPassword: function (btn) {
        var win = btn.up('window'),
            form = win.down('form'),
            user_id = form.down('hiddenfield[name=user_id]').getValue(),
            new_pwd = form.down('textfield[name=new_password]').getValue(),
            mask = new Ext.LoadMask({
                msg: 'Please wait...',
                target: win
            });
        Ext.MessageBox.confirm('Confirm', 'Are you sure to change your password?', function (btn) {
            if (btn === 'yes') {
                mask.show();
                Ext.Ajax.request({
                    url: 'usermanagement/updateUserPassword',
                    params: {
                        id: user_id,
                        new_pwd: new_pwd,
                        _token: token
                    },
                    success: function (response) {
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        mask.hide();
                        win.close();
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        toastr.error(message, 'Failure Response');
                        mask.hide();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        mask.hide();
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
            }
        });
    },
    submitApplicationAssignment: function(btn) {
        var form = btn.up('form'),
            store = Ext.getStore(btn.storeID),
            frm = form.getForm(),
            win = form.up('window');
        if (frm.isValid()) {
             frm.submit({
                 url: btn.action_url,
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
  

});
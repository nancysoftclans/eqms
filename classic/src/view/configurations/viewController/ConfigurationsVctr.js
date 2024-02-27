Ext.define('Admin.view.configurations.viewcontroller.ConfigurationsVctr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.configurationsvctr',

    setGridStore: function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },
    setParamCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },

    setCompStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
    addAuthSignature: function(btn) {
        this.fireEvent('addAuthSignature', btn);
    },
    setConfigCombosStore: function (obj, options) {
        this.fireEvent('setConfigCombosStore', obj, options);
    },
    setOrgConfigCombosStore: function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
    //dynamic parameters views
    renderParameterGrid: function(btn) {
       var record =  btn.getWidgetRecord(),
           def_id = record.get('id');
        this.fireEvent('renderParameterMenu', def_id);
  },
  setGridTreeStore: function (obj, options) {
        this.fireEvent('setGridTreeStore', obj, options);
    },
  showAddParticipantsGrid: function(item) {
          var me = this,
           btn = item.up('button'),
            record =  btn.getWidgetRecord(), 
            meeting_id = record.get('id'),
            childXtype = item.childXtype,
            winTitle = item.winTitle,
            winWidth = item.winWidth,
            childObject;
            childObject = Ext.widget(childXtype);
            //console.log(childXtype);
            
            childObject.down('hiddenfield[name=meeting_id]').setValue(meeting_id);
        funcShowCustomizableWindow(winTitle, winWidth, childObject, 'customizablewindow')
},


  showAddConfigParamWinFrm: function (btn) {
        var me = this,
            mainTabPnl = Ext.ComponentQuery.query("#contentPanel")[0],
            activeTab = mainTabPnl.getActiveTab(),
            childXtype = btn.childXtype,
            winTitle=btn.winTitle,
            winWidth=btn.winWidth,
            child = Ext.widget(childXtype);
        
        if(btn.has_params){

            var param_value = btn.up('grid').down('hiddenfield[name='+btn.param_name+']').getValue();
            child.down('hiddenfield[name='+btn.param_name+']').setValue(param_value);
        }
      if(btn.has_params_ctr){
        console.log(1);
          var application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue();
          child.down('hiddenfield[name=application_code]').setValue(application_code);
          console.log(2);
      }
        if(btn.is_caller){
            if(btn.up('form')){
                caller = btn.up('form').itemId;
            }
            else if(btn.up('panel')){
                caller = btn.up('panel').itemId;
            }
            child.caller = caller;
        }
        console.log(3);
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow', btn);
       
    },
    showAddChecklistItemConfigParamWinFrm: function (btn) {
        //if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
        var me = this,
            childXtype = btn.childXtype,
            winTitle=btn.winTitle,
            winWidth=btn.winWidth,
            child = Ext.widget(childXtype),
            storeArray = eval(btn.stores),
            grid = btn.up('grid'),
            checklist_type_id = grid.down('hiddenfield[name=checklist_type_id]').getValue(),
            checklist_category_id = grid.down('hiddenfield[name=checklist_category_id]').getValue(),
            arrayLength = storeArray.length;
        if (arrayLength > 0) {
            me.fireEvent('refreshStores', storeArray);
        }
        child.down('combo[name=checklist_type_id]').setValue(checklist_type_id);
        child.down('combo[name=checklist_category_id]').setValue(checklist_category_id);
        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
        /* } else {
             toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
             return false;
         }*/
    },
    showAddParameterFrm: function (btn, evt, opts) {
        console.log(btn);
        if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
            var me = this,
                formWidget = btn.form,
                grid = btn.up('grid'),
                activeTab = grid.up('panel'),
                form = Ext.widget(formWidget);
            form.action = "create";
            grid.hide();
            activeTab.add(form);
        } else {
            toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
            return false;
        }
    },

    doCostElementEdit: function(item) {
        //alert();
        if (this.fireEvent('checkFullAccess') || this.fireEvent('checkWriteUpdate')) {
            var me = this,
                btn = item.up('button'),
                grid = btn.up('grid'),
                activeTab = grid.up('panel'),
                record = btn.getWidgetRecord(),
                id = record.get('id'),
                form = Ext.widget(item.form),
                routeId = activeTab.routeId;

            form.action = "edit";
            form.loadRecord(record);
            grid.hide();
            activeTab.add(form);
        }
    },


 showEditConfigParamWinFrm: function (item) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            participant_id = record.get('participant_id'),
            childXtype = item.childXtype,
            winTitle=item.winTitle,
            winWidth=item.winWidth,
            form = Ext.widget(childXtype);
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
    previewHeaderFooter:function(item){
        var btn = item.up('button'),
        preview = item.preview,
        record = btn.getWidgetRecord(),
        record_id = record.get('id');
        //get the document path 
        item.setLoading(true);
      
        Ext.Ajax.request({
            url: 'documentmanagement/getHeaderFooterImages',
            method: 'GET',
            params: {
                record_id: record_id,
            },
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'X-CSRF-Token': token
            },
            success: function (response) {
                item.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    success = resp.success;
                header = resp.header;
                footer = resp.footer;
            
                if (success == true || success === true) {
                    new_header = "data:image/png;base64,"+header;
                    new_footer = "data:image/png;base64,"+footer;

                    if(preview == 1){//header
                        var newTabContent = '<html><body><img src="' + new_header + '"></body></html>';
                        var newTab= window.open('','_blank', 'resizable=yes,scrollbars=yes,directories=no, titlebar=no, toolbar=no,menubar=no,location=no,directories=no, status=no');
                        newTab.document.open();
                        newTab.document.write(newTabContent);
                        newTab.document.close();

                    }else{//footer
                        var newTabContent = '<html><body><img src="' + new_footer + '"></body></html>';
                        var newTab= window.open('','_blank', 'resizable=yes,scrollbars=yes,directories=no, titlebar=no, toolbar=no,menubar=no,location=no,directories=no, status=no');
                        newTab.document.open();
                        newTab.document.write(newTabContent);
                        newTab.document.close();
                    }
                } else {
                    toastr.error(resp.message, 'Failure Response');
                }
            },
            failure: function (response) {
                item.setLoading(false);
                var resp = Ext.JSON.decode(response.responseText),
                    message = resp.message;
                toastr.error(message, 'Failure Response');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                item.setLoading(false);
                toastr.error('Error downloading data: ' + errorThrown, 'Error Response');
            }
        });
    },
  renderParameterForm:function(btn) {
      var grid = btn.up('grid'),
          def_id = grid.down('hiddenfield[name=def_id]').getValue(),
          db_con = grid.down('hiddenfield[name=db_con]').getValue();
      Ext.getBody().mask('loading...');
      grid.mask('Please Wait');
      Ext.Ajax.request({
                        url: 'configurations/getParameterFormColumnsConfig',
                        method: 'GET',
                        params: {
                            def_id: def_id
                        },
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'X-CSRF-Token': token
                        },
                        success: function (response) {

                            var resp = Ext.JSON.decode(response.responseText),
                                success = resp.success,
                                message = resp.message,
                                join_fields = resp.join_fields,
                                table_name = resp.table_name,
                                main_fields = resp.main_fields;
                               // console.log(main_fields);
                                //console.log(main_fields[0]['field']);
                            if (success == true || success === true) {
                                var form = Ext.create('Ext.form.Panel',{
                                    controller: 'configurationsvctr',
                                    autoScroll: true,
                                    layout: 'column',
                                    frame: true,
                                    maxHeight: Ext.Element.getViewportHeight() - 118,
                                    bodyPadding: 8,
                                    defaults: {
                                        labelAlign: 'top',
                                        allowBlank: false,
                                        columnWidth: 1
                                    },
                                      items: [{
                                            xtype: 'hiddenfield',
                                            margin: '0 20 20 0',
                                            name: 'table_name',
                                            value: table_name+'',
                                            allowBlank: true
                                        }, {
                                            xtype: 'hiddenfield',
                                            margin: '0 20 20 0',
                                            name: 'db_con',
                                            value: db_con,
                                            allowBlank: true
                                        }, {
                                            xtype: 'hiddenfield',
                                            margin: '0 20 20 0',
                                            name: '_token',
                                            value: token,
                                            allowBlank: true
                                        }, {
                                            xtype: 'hiddenfield',
                                            fieldLabel: 'id',
                                            margin: '0 20 20 0',
                                            name: 'id',
                                            allowBlank: true
                                        },{
                                            xtype: 'checkbox',
                                            inputValue: 1,
                                            uncheckedValue: 0,
                                            fieldLabel: 'Is Enabled',
                                            margin: '0 20 20 0',
                                            name: 'is_enabled',
                                            allowBlank: true
                                        }],
                                        dockedItems:[
                                        {
                                            xtype: 'toolbar',
                                            ui: 'footer',
                                            dock: 'bottom',
                                            items:[
                                                '->',{
                                                    text: 'Save Details',
                                                    iconCls: 'x-fa fa-save',
                                                    action: 'save',
                                                    table_name: table_name,
                                                    storeID: table_name+'Str',
                                                    formBind: true,
                                                    ui: 'soft-blue',
                                                    action_url: 'configurations/saveConfigCommonData',
                                                    handler: 'doCreateConfigParamWin'
                                                }
                                            ]
                                        }
                                    ]
                                });
                            var counter = 1
                            for (var i = main_fields.length - 1; i >= 0; i--) {

                                if(main_fields[i]['field'] == 'tablename'){
                                    var field = Ext.create('Ext.form.ComboBox',{
                                        name: 'tablename',
                                        fieldLabel: 'Table Name',
                                        allowBlank:  main_fields[i]['null'],
                                        valueField: 'table_name',
                                        displayField: 'table_name',
                                        forceSelection: main_fields[i]['null'],
                                        queryMode: 'local',
                                        listeners: {
                                            beforerender: {
                                                fn: 'setCompStore',
                                                config: {
                                                    pageSize: 1000,
                                                    proxy: {
                                                            url: 'configurations/getTableslist',
                                                            extraParams:{
                                                                in_db: db_con
                                                            }
                                                        }
                                                },
                                                isLoad: true
                                            }
                                           
                                        }
                                    });
                                }else if(main_fields[i]['field'] == 'description'){
                                    var field = Ext.create('Ext.form.field.HtmlEditor',{
                                        name: main_fields[i]['field'],
                                        fieldLabel: main_fields[i]['label'],
                                        allowBlank: main_fields[i]['null'],
                                        columnWidth: 1
                                    }); 
                                }
                                else{
                                    var field = Ext.create('Ext.form.TextField',{
                                        name: main_fields[i]['field'],
                                        fieldLabel: main_fields[i]['label'],
                                        allowBlank: main_fields[i]['null'],
                                    }); 
                                }
                               
                                counter++;
                                form.insert(1,field);

                            }
                            for (var i = join_fields.length - 1; i >= 0; i--) {
                                if(join_fields[i].is_child == 1){
                                    is_load = false;
                                }else{
                                    is_load = true;
                                }
                                if(join_fields[i].is_parent != 1){
                                    var combo = Ext.create('Ext.form.ComboBox',{
                                        name: join_fields[i].param_column_name,
                                        fieldLabel: join_fields[i].label,
                                        allowBlank: join_fields[i].null,
                                        valueField: 'id',
                                        displayField: join_fields[i].join_disp_column_name,
                                        forceSelection: true,
                                        queryMode: 'local',
                                        listeners: {
                                            beforerender: {
                                                fn: 'setCompStore',
                                                config: {
                                                    pageSize: 1000,
                                                    proxy: {
                                                        url: 'configurations/getConfigParamFromTable',
                                                        extraParams: {
                                                            table_name: join_fields[i].table,
                                                            con: db_con
                                                        }
                                                    }
                                                },
                                                isLoad: is_load
                                            }
                                           
                                        }
                                    });
                                }
                                else{
                                   var combo = Ext.create('Ext.form.ComboBox',{
                                        name: join_fields[i].param_column_name,
                                        fieldLabel: join_fields[i].label,
                                        allowBlank: join_fields[i].null,
                                        logic: join_fields[i].logic,
                                        valueField: 'id',
                                        displayField: join_fields[i].join_disp_column_name,
                                        forceSelection: true,
                                        queryMode: 'local',
                                        listeners: {
                                            beforerender: {
                                                fn: 'setCompStore',
                                                config: {
                                                    pageSize: 1000,
                                                    proxy: {
                                                        url: 'configurations/getConfigParamFromTable',
                                                        extraParams: {
                                                            table_name: join_fields[i].table,
                                                            con: db_con
                                                        }
                                                    }
                                                },
                                                isLoad: is_load
                                            },
                                            afterrender: function(me){
                                                if(me.logic){
                                                        eval(me.logic);
                                                   }
                                                // me.fireEvent('addListenerToConfig', me);
                                            }
                                           
                                        }
          
                                    }); 
                                 // var parent_combo = form.down('combo[name='+join_fields[i].parent_combo_name+']'),
                                 //     param_column_name = join_fields[i].param_column_name,
                                 //     link_column_name = join_fields[i].link_column_name;

                                 // parent_combo.addListener('change',function(combo, newVal, oldvalue, eopts) {
                                 //     var obj = {};
                                 //        obj[link_column_name] = newVal;

                                 //     var frm = combo.up('form'),
                                 //         comboStr = frm.down('combo[name='+param_column_name+']').getStore(),
                                 //         filters = JSON.stringify(obj);

                                 //    comboStr.removeAll();
                                 //    comboStr.load({params:{filters:filters}});
                                     
                                 // });

                                }
                                form.insert(counter, combo);
                            }
                    if(btn.action == 'edit'){
                       var item = btn.up('button'),
                           record = item.getWidgetRecord();
                        form.loadRecord(record);
                    }
                    Ext.getBody().unmask();
                    grid.unmask();
                    funcShowCustomizableWindow(btn.winTitle, btn.winWidth, form, 'customizablewindow', btn);
                  }
                },
               failure: function (response) {
                    Ext.getBody().unmask();
                    var resp = Ext.JSON.decode(response.responseText),
                        message = resp.message;
                    toastr.error(message, 'Failure Response');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Ext.getBody().unmask();
                    toastr.error('Error: ' + errorThrown, 'Error Response');
                }
            });
  },

  //defination
  loadParameterConfig: function(chk, newVal, oldVal, eopts) {
       var form = chk.up('form'),
           id = form.down('hiddenfield[name=id]').getValue();
          
       
       if(newVal == 1){
            Ext.getBody().mask('loading.....');
            Ext.Ajax.request({
                    url: 'configurations/checkParamMenuDefination',
                    method: 'GET',
                    params: {
                        menu_id: id,
                        _token: token
                    },
                    headers: {
                        'Authorization':'Bearer '+access_token
                    },
                    success: function (response) {
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message;
                        if (success || success == true || success === true) {
                            Ext.getBody().unmask();
                             if(resp.is_defined){
                               var btn = Ext.create('Ext.Button', {
                                  iconCls: 'fa fa-cog',
                                  action: 'view',
                                  name: 'config_btn',
                                  text: 'View Parameter Config',
                                  handler: 'setConfigForm'
                                }); 
                               form.add(btn); 
                           }else{
                              var btn = Ext.create('Ext.Button', {
                                  text: 'Configure Parameter',
                                  iconCls: 'fa fa-cog',
                                  action: 'add',
                                  name: 'config_btn',
                                  handler: 'setConfigForm' 
                                });
                                form.add(btn);   
                           }
                        } else {
                             Ext.getBody().unmask();
                            toastr.error(message, 'Failure Response!!');
                        }
                    },
                    failure: function (response) {
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message;
                        toastr.warning(message, 'Failure Response!!');
                         Ext.getBody().unmask();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                         Ext.getBody().unmask();
                    }
                });
       }else{
           var btn = form.down('button[name=config_btn]');
           btn.destroy();
       }
   },
   setConfigForm:function(btn) {
   var me = this;

    if(btn.action == 'view'){
        edit = 1;
        var grid = btn.up('grid'),
            record = btn.getWidgetRecord(),
            def_id = record.get('id');
        Ext.getBody().mask('Loading...');

        Ext.Ajax.request({
                    url: 'configurations/getParameterConfig',
                    method: 'GET',
                    params: {
                        def_id: def_id,
                        '_token': token
                    },
                    headers: {
                        'Authorization':'Bearer '+access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message;
                            results = resp.results;
                        if (success || success == true || success === true) {
                           var form = Ext.widget('parameterformfieldsfrm');
                           var def_id =resp.def_id;
                           if(def_id != 0){

                               form.down('combo[name=connection_id]').setValue(record.get('connection_id'));
                               form.down('hiddenfield[name=def_id]').setValue(def_id);
                               form.down('numberfield[name=no_joins]').setValue(resp.no_joins);
                               form.down('textfield[name=param_title]').setValue(results['param_title']);
                               form.down('textfield[name=param_name]').setValue(results['param_name']);
                               form.down('combo[name=table_name]').setValue(results['table_name']);
                               var btn = form.down('button[name = add_tables]');
                               btn.db_con = results['db_con_name'];

                               me.addTableJoinsDefination(btn);
                              
                               model = Ext.create('Ext.data.Model', results);
                               form.loadRecord(model);
                               funcShowCustomizableWindow("Config Parameter", '80%', form, 'customizablewindow');

                           }
                        } else {
                            toastr.error(message, 'Failure Response!!');
                        }
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            success = resp.success,
                            message = resp.message;
                        toastr.warning(message, 'Failure Response!!');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Ext.getBody().unmask();
                        toastr.error('Error: ' + errorThrown, 'Error Response');
                    }
                });
        }else{
            var form = Ext.widget('parameterformfieldsfrm');
            funcShowCustomizableWindow("Config Parameter", '80%', form, 'customizablewindow');
        }
       
       
   },
   addTableJoinsDefination: function(btn) {
       var form = btn.up('form'),
           fieldset = form.down('fieldset[name=joins_fs]'),
           no_field = form.down('numberfield[name=no_joins]'),
           no = no_field.getValue(),
           save_btn = form.down('button[action=save]'),
           joins_fieldsets = form.down('fieldset[name=joins_fieldsets]'),
           frm = form.getForm();
      
      if(frm.isValid()){
          
            no_field.setReadOnly(true);
           btn.setDisabled(true);
       
        for (var i = no-1; i >= 0; i--) {
            var join_type_id = 'join_type_id'+i,
                join_table_name = 'join_table_name'+i,
                join_column_name = 'join_column_name'+i,
                join_disp_column_name = 'join_disp_column_name'+i,
                link_column_name = 'logic'+i,
                param_column_name = 'param_column_name'+i;

            var fieldset = Ext.create('Ext.form.FieldSet' , {
                layout: 'column',
                title: 'Join table',
                name: 'joins_definations',
                defaults: {
                    labelAlign: 'top',
                    margin: '0 20 0 0',
                    allowBlank: false
                },
                items :[{
                        xtype: 'combobox',
                        queryMode: 'local',
                        fieldLabel: 'Join Type',
                        displayField: 'name',
                        valueField: 'id',
                        name: join_type_id+'',
                        columnWidth: 0.2,
                        listeners:
                         {
                             beforerender: {
                                fn: 'setCompStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getConfigParamFromTable',
                                    extraParams:{
                                            table_name: 'par_join_types'
                                        }
                                    }
                                },
                                isLoad: true
                            }
                             
                         }
                
                      },{
                        xtype: 'combobox',
                        queryMode: 'local',
                        fieldLabel: 'Join Table',
                        displayField: 'table_name',
                        valueField: 'table_name',
                        name: join_table_name+'',
                        columnWidth: 0.25,
                        listeners:
                         {
                             beforerender: {
                                fn: 'setCompStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getTableslist',
                                         extraParams:{
                                            in_db: btn.db_con
                                        }
                                    }
                                },
                                isLoad: true
                            },
                            change: function(combo, newVal, oldVal, eOpts) {
                               
                                var form = combo.up('fieldset'),
                                    join_column_nameStr = form.down("combo[action=column_name]").getStore();
                                    join_column_dispStr = form.down("combo[action=disp_column_name]").getStore();
                                   // link_column_dispStr = form.down("combo[action=param_column_name]").getStore();

                                join_column_nameStr.removeAll();
                                join_column_nameStr.load({params:{'table_name':newVal}});
                                join_column_dispStr.removeAll();
                                join_column_dispStr.load({params:{'table_name':newVal}});
                                //link_column_dispStr.removeAll();
                                //link_column_dispStr.load({params:{'table_name':newVal}});
                                //main table
                                var main_form = combo.up('form'),
                                    param_table = main_form.down('combo[name=table_name]').getValue(),
                                    param_column_Str = form.down('combo[action=param_column_name]').getStore();
                                    
                                 param_column_Str.removeAll();
                                 param_column_Str.load({params:{'table_name':param_table, db_con: btn.db_con}});


                            },
                             
                         }
                
                      },
                      {
                        xtype: 'combobox',
                        queryMode: 'local',
                        fieldLabel: 'Join Column',
                        displayField: 'column_name',
                        valueField: 'column_name',
                        action: 'column_name',
                        name: join_column_name+'',
                        columnWidth: 0.2,
                        listeners:
                         {
                             beforerender: {
                                fn: 'setCompStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getTablescolumns',
                                        extraParams:{
                                            db_con: btn.db_con
                                        }
                                    }
                                },
                                isLoad: false
                            }   
                             
                         }
                
                      },
                      {
                        xtype: 'combobox',
                        queryMode: 'local',
                        fieldLabel: 'Display Column',
                        displayField: 'column_name',
                        valueField: 'column_name',
                        action: 'disp_column_name',
                        name: join_disp_column_name+'',
                        columnWidth: 0.2,
                        listeners:
                         {
                             beforerender: {
                                fn: 'setCompStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getTablescolumns',
                                        extraParams:{
                                            db_con: btn.db_con
                                        }
                                    }
                                },
                                isLoad: false
                            }   
                             
                         }
                
                      },{
                        xtype: 'combobox',
                        queryMode: 'local',
                        fieldLabel: 'Param Column',
                        displayField: 'column_name',
                        valueField: 'column_name',
                        action: 'param_column_name',
                        name: param_column_name+'',
                        columnWidth: 0.2,
                        listeners:
                         {
                             beforerender: {
                                fn: 'setCompStore',
                                config: {
                                    pageSize: 10000,
                                    proxy: {
                                        url: 'configurations/getTablescolumns'
                                    }
                                },
                                isLoad: false
                            },
                            afterRender: function(me,eopts) {
                                var form = me.up('form'),
                                    param_table = form.down('combo[name=table_name]').getValue()
                                    store = me.getStore();
                                store.removeAll();
                                store.load({params:{table_name:param_table, db_con: btn.db_con}});
                            }, 
                             
                         }
                
                      },{
                          xtype: 'textfield',
                          name: 'table_label'+i,
                          fieldLabel: 'Label',
                          columnWidth: 0.15
                      },{
                        xtype: 'checkbox',
                        inputValue: 1,
                        uncheckedValue: 2,
                        fieldLabel: 'Has Logic',
                        margin: '0 20 20 0',
                        name: 'is_parent'+i,
                        allowBlank: true,
                        listeners: {
                            change: function(checkbox, newValue, oldValue, eOpts) {
                                var fieldset = checkbox.up('fieldset'),
                                    chk = fieldset.down('textfield[action=link_column_name]');
                                if (newValue == 1) {
                                    chk.show();
                                } else {
                                    chk.hide();
                                }
                            }
                        }
                    },{
                        xtype: 'textarea',
                        allowBlank: true,
                        fieldLabel: 'Add Logic',
                        name: link_column_name+'',
                        hidden: true,
                        action: 'link_column_name',
                        columnWidth:1,
                      },{
                          xtype: 'numberfield',
                          name: 'level',
                          hidden: true,
                          value: i
                      }]
            });
        joins_fieldsets.add(fieldset);
        }
       }else{
          toastr.warning("Please Fill all the Initial Parameter Details", 'Failure Response!!'); 
       }
                              

   },
   deleteRecordFromIDByConnection: function (item) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            id = record.get('id'),
            storeID = item.storeID,
            table_name = item.table_name,
            url = item.action_url,
            db_con = item.db_con,
            store = Ext.getStore(storeID);
        Ext.MessageBox.confirm('Delete', 'Are you sure to perform this action ?', function (btn) {
            if (btn === 'yes') {
                Ext.getBody().mask('Deleting record...');
                
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    params: {
                        table_name: table_name,
                        id: id,
                        db_con: db_con
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'X-CSRF-Token': token
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message,
                            success = resp.success;
                        if (success == true || success === true) {
                            toastr.success(message, 'Success Response');
                            store.removeAll();
                            store.load();
                        } else {
                            toastr.error(message, 'Failure Response');
                        }
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        var resp = Ext.JSON.decode(response.responseText),
                            message = resp.message;
                        toastr.error(message, 'Failure Response');
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
    doCreateConfigParamWin: function (btn) {
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
            
        if (frm.isValid()) {
            frm.submit({
                url: url,
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
    removeTableJoinsDefination: function(btn) {
      var fieldset = btn.up('fieldset'),
          no = fieldset.down('numberfield[name=no_joins]').getValue(),
          form = fieldset.up('form');
      
             form.down('fieldset[name=joins_fieldsets]').removeAll();
       
      
      form.down('numberfield[name=no_joins]').setReadOnly(false);
      form.down('button[name=add_tables]').setDisabled(false);
  },
    onformcategoryDblClick:function(view, record, item, index, e, eOpts){
            form_category_id = record.get('id');
            var child = Ext.widget('formFieldRelationGrid');
            child.getViewModel().set('form_category_id', form_category_id);
            child.down('hiddenfield[name=form_category_id]').setValue(form_category_id);
            funcShowCustomizableWindow("Field Relations Mapping", '60%', child, 'customizablewindow');

        },
    syncFormFieldRelations:function(btn){
            var grid = btn.up('grid'),
                store = grid.getStore(),
                form_category_id = grid.down('hiddenfield[name=form_category_id]').getValue(),
                params = [];
            for (var i = 0; i < store.data.items.length; i++) {
                var record = store.data.items [i],
                    form_fielddesign_id = record.get('field_id'),
                    parent_field_id = record.get('parent_field_id'),
                    bind_column = record.get('bind_column'),
                    has_logic = record.get('has_logic'),
                    other_logic = record.get('other_logic'),
                    has_relation = 1;
                var obj = {
                    form_fielddesign_id: form_fielddesign_id,
                    parent_field_id: parent_field_id,
                    bind_column: bind_column,
                    has_logic: has_logic,
                    other_logic: other_logic,
                    has_relation: has_relation
                };
                if (record.dirty) {
                    params.push(obj);
                }
            }
            if (params.length < 1) {
                btn.setLoading(false);
                toastr.warning('No records to save!!', 'Warning Response');
                return false;
            }
            params = JSON.stringify(params);
            Ext.Ajax.request({
                url: 'configurations/saveFormFieldRelations',
                params: {
                    form_category_id: form_category_id,
                    relation_details: params
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'X-CSRF-Token': token
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
    AddFormTypeFields: function (item) {
        var me = this,
            btn = item.up('button'),
            record = btn.getWidgetRecord(),
            childXtype = item.childXtype,
            winTitle=item.winTitle,
            winWidth=item.winWidth,
            form = Ext.widget(childXtype),
            form_category_id = record.get('id');
        form.down('hiddenfield[name=form_category_id]').setValue(form_category_id);
        funcShowCustomizableWindow(winTitle, winWidth, form, 'customizablewindow');
    },
    loadPersonnelDetails: function(view, record, item, index, e, eOpts){
        var grid = view.grid,
            caller = grid.caller,
            callerRef = Ext.ComponentQuery.query("#"+caller)[0];
            // personnel_type = callerRef.down('combo[name=]')
        record.set('id', '');
        if(callerRef){
            callerRef.loadRecord(record);
        }else{
             toastr.error('Failed to fetch reference of the caller instance', 'Failure Response');
        }
        grid.up('window').close();
    },
    showPersonnelSelectionList: function(btn){
        var caller = btn.caller,
            grid = Ext.widget(btn.childXtype);
        grid.caller = caller;
        funcShowCustomizableWindow(btn.winTitle, btn.winWidth, grid, 'customizablewindow');
    },
    showRegistererdFacilitySelectionList: function (btn) {
        var grid = Ext.widget('registredFacilitygrid'),
		form=btn.up('form');
        risk_premise_type = form.down('hiddenfield[name=risk_premise_type]').getValue();
        grid.down('hiddenfield[name=risk_premise_type]').setValue(risk_premise_type);
        funcShowCustomizableWindowWithObject('Licensed Facility Selection List', '65%', grid, 'customizablewindow',form);
    },
    doCreateCommonParamWin: function (btn) {
        var me = this,
            url = btn.action_url,
            table = btn.table_name,
            form = btn.up('form'),
            win = form.up('window'),
            storeID = btn.storeID,
            store = Ext.getStore('tcmeetingparticipantsstr');
            frm = form.getForm();
        if (frm.isValid()) {
            frm.submit({
                url: url,
                params: {model: table},
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
                      // store.removeAll();
                      // var store = Ext.getStore(storeId)
                       // store.load();
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

    showApplicantGridSelection: function (btn) {
        var grid = Ext.widget('productapplicantselectiongrid');
        
        grid.applicantType = 'importer';
        grid.callerItemId = 'impDistributorDetailsFrmItemId';
        
        funcShowCustomizableWindow('Applicant Selection List', '90%', grid, 'customizablewindow');
    },

    doUploadQuestionsFromExcelSheets:function(btn){
        
        childXtype = 'uploadmedicaldevicesmedicalassesmentquestionsfrm',
        winTitle   = 'Upload from excel',
        winWidth   = '40%',
        child      =  Ext.widget(childXtype);

        funcShowCustomizableWindow(winTitle, winWidth, child, 'customizablewindow');
    },

    doUploadQuestionsForMedicalDeviceAssesment:function(btn){
        
        var me = this,
           // url = btn.action_url,
        
            form_xtype = btn.up('form'),
            win = form_xtype.up('window');
           
       
        var frm = form_xtype.getForm();
        //filename = frm.getInput('filename');
        if(frm.isValid()){
                frm.submit({
                    url: 'configurations/saveAllQuestionsForMedicalAssesment',
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
    showApplicationUploadedDocument: function(btn) {
        this.fireEvent('showPreviousUploadedDocs', btn);
       
   },
   previewPortalReceivingApplicationQueries: function (item) {
    this.fireEvent('showApplicationQueries', item);
},
    showSelectedProductPortalApplicationMoreDetails: function(btn) {
        var button = btn.up('button'),
           grid = button.up('grid'),
           container = grid.up('panel'),
           record = button.getWidgetRecord(),
           application_code = record.get('application_code');
           prodclass_category_id = record.get('prodclass_category_id');
           module_id = record.get('module_id');
           sub_module_id = record.get('sub_module_id');
           section_id = record.get('section_id');
           ref_no = record.get('tracking_no');
           application_id = record.get('active_application_id');
           applicant_id = record.get('trader_id');
           process_id = record.get('process_id');
           if(record.get('product_id')){
            product_id = record.get('product_id');
            container.down('hiddenfield[name=product_id]').setValue(product_id);
           }
           if(record.get('registered_product_id')){
            registered_product_id = record.get('registered_product_id');
            container.down('hiddenfield[name=product_id]').setValue(registered_product_id);
           }
       container.down('hiddenfield[name=application_code]').setValue(application_code);
       container.down('hiddenfield[name=active_application_code]').setValue(application_code);
       container.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);
       container.down('hiddenfield[name=module_id]').setValue(module_id);
       container.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
       container.down('hiddenfield[name=section_id]').setValue(section_id);
       container.down('hiddenfield[name=active_application_id]').setValue(application_id);
       console.log(module_id);
       this.fireEvent('showPortalReceivingApplicationMoreDetails', btn,application_code,module_id,sub_module_id,section_id,prodclass_category_id,ref_no,application_id,applicant_id,process_id);
   },
   
   showPortalSubmissionWinGeneric: function (btn) {
    var button = btn.up('button'),
           grid = button.up('grid'),
           container = grid.up('panel'),
           record = button.getWidgetRecord(),
           application_code = record.get('application_code');
           prodclass_category_id = record.get('prodclass_category_id');
           module_id = record.get('module_id');
           sub_module_id = record.get('sub_module_id');
           section_id = record.get('section_id');
           ref_no = record.get('tracking_no');
           application_id = record.get('application_id');
           workflow_stage_id = record.get('workflow_stage_id');
           winWidth = btn.winWidth,
            // categorize_selected=btn.categorize_selected,
            // activeTab = mainTabPanel.getActiveTab(),
            // module_id = activeTab.down('hiddenfield[name=module_id]').getValue(),
            // section_id = activeTab.down('hiddenfield[name=section_id]').getValue(),
            // application_id = activeTab.down('hiddenfield[name=active_application_id]').getValue(),
            // application_code = activeTab.down('hiddenfield[name=active_application_code]').getValue(),
            // workflow_stage_id = activeTab.down('hiddenfield[name=workflow_stage_id]').getValue();
  
        valid = true,
        is_dataammendment_request =0,
        storeID = btn.storeID,
        table_name = getApplicationTable(module_id);
        if(btn.table_name != ''){
            table_name = btn.table_name;
        }
        
    if (valid == true || valid === true) {
        showWorkflowSubmissionWin(application_id, application_code, table_name, 'workflowsubmissionmanagersgenericfrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
     
    } 
},
showReceivePortalApplicationsWinGeneric: function(btn) {
    var button = btn.up('button'),
       grid = button.up('grid'),
       container = grid.up('panel'),
       record = button.getWidgetRecord(),
       application_code = record.get('application_code');
       application_id = record.get('application_id');
       prodclass_category_id = record.get('prodclass_category_id');
       module_id = record.get('module_id');
       sub_module_id = record.get('sub_module_id');
       section_id = record.get('section_id');
       ref_no = record.get('tracking_no');
       workflow_stage_id= record.get('workflow_stage_id');
       new_application_id = record.get('new_application_id');
       console.log(new_application_id);
   container.down('hiddenfield[name=application_code]').setValue(application_code);
   container.down('hiddenfield[name=active_application_code]').setValue(application_code);
   container.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);
   container.down('hiddenfield[name=module_id]').setValue(module_id);
   container.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
   container.down('hiddenfield[name=section_id]').setValue(section_id);
   if(new_application_id){
    toastr.error('Application is already synced', 'Failure Response');
     }
   else{
    this.fireEvent('receivePortalApplicationsGeneric', btn,application_code,application_id,workflow_stage_id,module_id,sub_module_id,section_id);
   }

},

showSubmitPortalApplicationsWinGeneric: function(btn) {
    var button = btn.up('button'),
       is_dataammendment_request =0,
       storeID = btn.storeID,
       winWidth = btn.winWidth,
       table_name = btn.table_name,
       grid = button.up('grid'),
       container = grid.up('panel'),
       record = button.getWidgetRecord(),
       application_code = record.get('application_code');
       application_id = record.get('application_id');
       new_application_id = record.get('new_application_id');
       console.log(new_application_id)
       prodclass_category_id = record.get('prodclass_category_id');
       importexport_permittype_id = record.get('importexport_permittype_id');
       premise_type_id = record.get('premise_type_id');
       module_id = record.get('module_id');
       sub_module_id = record.get('sub_module_id');
       section_id = record.get('section_id');
       ref_no = record.get('tracking_no');
       //workflow_stage_id= record.get('workflow_stage_id');
   container.down('hiddenfield[name=application_code]').setValue(application_code);
   container.down('hiddenfield[name=prodclass_category_id]').setValue(prodclass_category_id);
   container.down('hiddenfield[name=module_id]').setValue(module_id);
   container.down('hiddenfield[name=sub_module_id]').setValue(sub_module_id);
   container.down('hiddenfield[name=section_id]').setValue(section_id);
   if(!new_application_id){
    toastr.error('Sync Application first', 'Failure Response');
     }
 else{
    Ext.Ajax.request({
        method: 'GET',
        url: 'configurations/getApplicationWorkFlowStageSubmissionDetails',
        params: {
            module_id: module_id,
            sub_module_id: sub_module_id,
            section_id: section_id,
            prodclass_category_id: prodclass_category_id,
            importexport_permittype_id: importexport_permittype_id,
            premise_type_id: premise_type_id
        },
        success: function (response) {
           // Ext.getBody().unmask();
            var resp = Ext.JSON.decode(response.responseText),
                success = resp.success,
                message = resp.message,
                results = resp.results,
                workflow_stage_id = results.id;
                console.log(workflow_stage_id)
                container.down('hiddenfield[name=workflow_stage_id]').setValue(workflow_stage_id);
            if (success == true || success === true) {
                showWorkflowSubmissionWin(new_application_id, application_code, table_name, 'workflowPortalReceivingSubmissionFrm', winWidth, storeID,'','','',workflow_stage_id,is_dataammendment_request);
                //markasPortalMisReceived(application_id, new_application_id, module_id, sub_module_id, section_id, tracking_no,application_code);
            }
        },
        failure: function (response) {
            //Ext.getBody().unmask();
            var resp = Ext.JSON.decode(response.responseText),
                message = resp.message;
            toastr.error(message, 'Failure Response');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //Ext.getBody().unmask();
            toastr.error('Error: ' + errorThrown, 'Error Response');
        }
         }); 
   }
},
showMeetingGroupParticipantsWin: function (item) {
    var me = this,
        btn = item.up('button'),
        record = btn.getWidgetRecord(),
        group_id = record.get('id');
        childXtype = item.childXtype,
        winTitle=item.winTitle,
        winWidth=item.winWidth,
        grid = Ext.widget(childXtype);
        grid.down('hiddenfield[name=group_id]').setValue(group_id);
    funcShowCustomizableWindow(winTitle, winWidth, grid, 'customizablewindow');
},
refreshGrid: function (btn) {
    btn.up('panel').getStore().reload();
},
loadAtcCodesToVetIngredientFrm: function (view, record, item, index, e, eOpts) {
    var frm = Ext.ComponentQuery.query("#drugsIngredientsFrmId")[0];
    if(record.get('leaf')){
        if(frm){
            if(frm.down('combo[name=atc_code_id]')){
                frm.down('combo[name=atc_code_id]').setValue(record.get('id'));
                frm.down('combo[name=ingredient_id]').setValue(record.get('ingredient_id'));
                frm.down('textarea[name=acceptance_statement]').setValue(record.get('acceptance_statement'));
                acceptanceCombo = frm.down('combo[name=acceptance_id]');
                is_accepted = record.get('is_accepted');
                if(is_accepted == 1){
                        acceptanceCombo.setFieldStyle('background:#32CD32');
                    }else if(is_accepted == 2){
                        acceptanceCombo.setFieldStyle('background:#FF5252');
                    }else{
                       acceptanceCombo.setFieldStyle('background:#FFFFFF'); 
                    }                    
                    acceptanceCombo.setValue(is_accepted);
            }
           view.grid.up('window').close();
        }
    }
},
loadAtcCodesToVetExmpIngredientFrm: function (view, record, item, index, e, eOpts) {
    var frm = Ext.ComponentQuery.query("#exemptionIngredientsFrm")[0];
    if(record.get('leaf')){
        if(frm){
            if(frm.down('combo[name=atc_code_id]')){
                frm.down('combo[name=atc_code_id]').setValue(record.get('id'));
                frm.down('combo[name=ingredient_id]').setValue(record.get('ingredient_id'));
                frm.down('textarea[name=acceptance_statement]').setValue(record.get('acceptance_statement'));
                acceptanceCombo = frm.down('combo[name=acceptance_id]');
                is_accepted = record.get('is_accepted');
                if(is_accepted == 1){
                        acceptanceCombo.setFieldStyle('background:#32CD32');
                    }else if(is_accepted == 2){
                        acceptanceCombo.setFieldStyle('background:#FF5252');
                    }else{
                       acceptanceCombo.setFieldStyle('background:#FFFFFF'); 
                    }                    
                    acceptanceCombo.setValue(is_accepted);
            }
           view.grid.up('window').close();
        }
    }
}
});

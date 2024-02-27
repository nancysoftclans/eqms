Ext.define('Admin.view.audit_trail.viewcontroller.Audit_TrialViewCtr', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.audit_trialViewCtr',

    init: function () {
      // Ext.apply(Ext.form.field.VTypes, {
      //   timerange: function(val, field) {
      //       var date = new Date();
      //       var year = date.getFullYear();
      //       var datetime = new Date(year+'T' + val);

      //     if (isNaN(datetime.getTime())) {
      //     return false;
      //     }else{
      //       return true
      //     }
      //    },
      //    validateQuery: function(value, field) {
      //           if(this.validateQueryRe.test(value)){
      //               field.setValue(value.slice(0, -6));
      //               return false;
      //           }
      //           return true;
      //       },
      //   timerangeText: "Time should be exactly xx:xx:xx 24hrs format",
      //   validateQueryRe: /update\s|insert|delete|create\s/i,
      //   validateQueryText: "Only selection queries allowed"
      //   })
    },

    //end of graphs
setCompStore:function (obj, options) {
        this.fireEvent('setCompStore', obj, options);
    },
setGridStore:function (obj, options) {
        this.fireEvent('setGridStore', obj, options);
    },

func_reloadGridStore: function(item) {
  var store = item.up('grid').getStore();
  store.removeAll();
  store.load();
},

func_AllRecordsTrans:function(item,event,eopts)
 {       
      var me = this,
          btn=item.up('button'),
            childXtype = item.childXtype,
            record = btn.getWidgetRecord(),
            winTitle=item.winTitle,
            winWidth=item.winWidth,
            panel = Ext.widget(childXtype),
            id=panel.down('hiddenfield[name=id]');
            table_name=panel.down('hiddenfield[name=table_name]');
            record_id=panel.down('hiddenfield[name=record_id]');
            id.setValue(record.data.id);
            table_name.setValue(record.data.table_name);
            record_id.setValue(record.data.record_id);

            //set labels 
            panel.down('label[name=record_label]').setHtml("<b>Record Id : <i>"+record.data.record_id+"</i></b>");
            panel.down('label[name=table_label]').setHtml("<b>Table Name : <i>"+record.data.table_name+"</i></b>");


        funcShowCustomizableWindow(winTitle, winWidth, panel, 'customizablewindow');
    },

func_viewRecords:function(item,event,eopts) 
{
    var me = this,
        btn=item.up('button'),
        childXtype = item.childXtype,
        record = btn.getWidgetRecord(),
        winTitle=item.winTitle,
        winWidth=item.winWidth,
        panel = Ext.widget(childXtype),
        id=panel.down('hiddenfield[name=id]');
        table_name=panel.down('hiddenfield[name=table_name]');
        record_id=panel.down('hiddenfield[name=record_id]');
        id.setValue(record.data.id);
        table_name.setValue(record.data.table_name);
        record_id.setValue(record.data.record_id);

        //set labels 
        panel.down('label[name=record_label]').setHtml("<b>Record Id : <i>"+record.data.record_id+"</i> | </b>");
        panel.down('label[name=table_label]').setHtml("<b>Table Name : <i>"+record.data.table_name+"</i> | </b>");

        if(item.name=='single'){
        panel.down('label[name=action_label]').setHtml("<b>Action : <i>"+record.data.table_action+"</i> | </b>");
        panel.down('label[name=actionby_label]').setHtml("<b>Action By : <i>"+record.data.created_by+"</i></b>");
        }

        //revert action toggle
        if(record.data.table_action!='delete'){
          panel.down('button[name=revert]').setVisible(false);
        }
    funcShowCustomizableWindow(winTitle, winWidth, panel, 'customizablewindow');
},

    func_markErrorResolved: function(button){
      var btn = button.up('button'),
          store = btn.up('grid').getStore(),
          record = btn.getWidgetRecord(),
          id = record.get('id');
      Ext.MessageBox.show({
            title: 'Resolution Comment',
            msg: 'Please enter the Resolution Comment',
            width: 320,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: true,
            scope: this,
            animateTarget: button,
            fn: function (btn, text) {
                var comment = text;
                if (btn === 'ok') {
                    if (comment == '' || comment === '') {
                        toastr.warning('Please Enter Reason!!', 'Warning Response');
                        return;
                    }
                    Ext.getBody().mask('Marking as resolved...');
                    Ext.Ajax.request({
                        url: 'audittrail/markErrorLogAsResolved',
                        params: {
                            id: id,
                            comment: comment,
                            _token: token
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            var resp = Ext.JSON.decode(response.responseText);
                            toastr.success(resp.message, 'Success Response');
                            store.removeAll();
                            store.load();
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

    func_viewErrorDetails: function (button) {
       var btn = button.up('button'),
          store = btn.up('grid').getStore(),
          record = btn.getWidgetRecord(),
          form = Ext.widget('systemErrorLogviewFrm');
          form.loadRecord(record);
        funcShowCustomizableWindow('Error Preview', '60%', form, 'customizablewindow');
    },

    func_revertToPreviousTableData:function(btn) 
    {
        var panel=btn.up('panel'), 
            id=panel.down('hiddenfield[name=id]').getValue();
          Ext.Ajax.request({
                          url: 'audittrail/revertAuditRecord',
                          method: 'get',
                          params : {
                                      'id':id,
                                      'type':btn.type //mis or portal
                          },
    
                           success: function (response, textStatus, request) {
                               var res=response.responseText;
                               var Res = JSON.parse(res);
                               Ext.Msg.alert('Results',Res.results);
                          },
    
                          failure: function(conn, response, options, eOpts) {
                                var res=response.responseText;
                                var Res = JSON.parse(res);
                                Ext.Msg.alert('Results',Res.results);
                    }});

    },

    funct_loadColumns:function(grid)
    {
			var store=grid.getStore();
			    grid.getView().refresh();
			    store.load({
			    	callback: function(records, operation, success) {
                 
				         if(records.length!=0){
                  var data=records[0].data;
				        	var keys=Object.keys(data);
                    
				        	 for (var i =0 ; i <= keys.length - 2; i++) {

				        	  var column = Ext.create('Ext.grid.column.Column', {
		                                        text: keys[i],
		                                        dataIndex: keys[i],
                										        width: 150,
                										        tbCls: 'wrap'
		                                    });

			                  grid.headerCt.insert(
			                      grid.columns.length-1, 
			                      column);
			                }
                         }    
				     }});
	},

    export:function(btn) {
        var grid=btn.up('grid'),
            // filterfield = grid.getPlugin('filterfield'),
            // filter_array = Ext.pluck( filterfield.getgridFilters(grid), 'config'),
            table_name=grid.down('combo[name=table_name]').getValue(),
            created_by=grid.down('combo[name=created_by]').getValue(),
            table_data=grid.down('textfield[name=table_data]').getValue(),
            form=Ext.create('Ext.form.Panel', { }),
            frm=form.getForm();
            // filter_array = Ext.JSON.encode(filter_array);

           Ext.getBody().mask('Exporting...Please wait...');
      
        Ext.Msg.show({
           title:'Time Warning',
           message: 'This Export Operation may take some time depending on filters provided',
           buttons: Ext.Msg.OKCANCEL,
           icon: Ext.Msg.QUESTION,
           fn: function(check) {
           if (check === 'ok') {

                  Ext.getBody().mask('Exporting...Please wait...');
                  frm.submit({
                       url: 'audittrail/exportAudit',
                       method: 'GET',
                       params : {
                                    'filter':filter_array,
                                    'table_name':table_name,
                                    'created_by':created_by,
                                    'table_data':table_data,
                                    'type': btn.type 
                                },
                        success: function (action, response) {
                                  var t = response.result;
                                  Ext.getBody().unmask();
                                  var a = document.createElement("a");
                                  a.href = t.file; 
                                  a.download = t.name;
                                  document.body.appendChild(a);

                                   a.click();
                                 
                                   a.remove();
                
                                },
                        failure: function(action, response) {

                                     Ext.Msg.alert('Error', 'please try again');
                                      Ext.getBody().unmask();
                                }
                     });
                  } else {
                      Ext.Msg.alert('Terminated', 'Export operation canceled');
                  }
            }
        });

    },
});
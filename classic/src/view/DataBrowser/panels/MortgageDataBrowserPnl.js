Ext.define('Admin.view.DataBrowser.panels.DataBrowserPnl',{
   extend:'Ext.panel.Panel',
   title:'Data View',
   xtype:'adhocdatabrowserReport',
   controller: 'databrowserVCtr',
   name: 'main-panel',
   width: '100%',
	layout:{
        type: 'fit'
    },
    height: Ext.Element.getViewportHeight() - 118,
    tbar: [{
    	xtype: 'form',
    	name: 'filter',
      width: '100%',
    	layout: 'column',
      collapsible: true,
      split: true,
      title: 'Custom Filters',
      defaults: {
        labelAlign: 'top',
        margin: '2 20 2 0',
        columnWidth: 0.23
      },
    	items: [{
		        xtype: 'combo', anyMatch: true,
		        fieldLabel: 'Spreasheet Module',
		        name: 'module_id',
		        valueField: 'id',
		        displayField: 'name',
		        forceSelection: true,
		        queryMode: 'local',
		        listeners: {
		            beforerender: {
		                fn: 'setConfigCombosStore',
		                config: {
		                    pageSize: 1000,
		                    proxy: {
		                        url: 'configurations/getConfigParamFromTable',
		                        extraParams: {
		                            table_name: 'par_modules'
		                        }
		                    }
		                },
		                isLoad: true
		            },
		            change: function (combo, newVal, oldVal, eopts) {
                     var pnl = combo.up('panel'),
                         comb = pnl.down('combo[name=sub_module_id]').getStore(),
                         filters = JSON.stringify({module_id: newVal});

                     comb.removeAll();
                     comb.load({params: {filters: filters}});
                  }
		        }
		    },{
              xtype: 'combo', anyMatch: true,
              fieldLabel: 'Sub Module',
              name: 'sub_module_id',
              valueField: 'id',
              displayField: 'name',
              forceSelection: true,
              queryMode: 'local',
              listeners: {
                  beforerender: {
                      fn: 'setConfigCombosStore',
                      config: {
                          pageSize: 1000,
                          proxy: {
                              url: 'configurations/getConfigParamFromTable',
                              extraParams: {
                                  table_name: 'par_sub_modules'
                              }
                          }
                      },
                      isLoad: false
                  },
                  change: 'refreshViewFromCombo'
                 
              }
          },{
            xtype: 'datefield',
            format: 'Y-m-d',
            name: 'date_from',
            allowBlank: 'true',
            fieldLabel: 'Date From'
        },{
            xtype: 'datefield',
            format: 'Y-m-d',
            name: 'date_to',
            allowBlank: 'true',
            fieldLabel: 'Date To'
        
        }],
        buttons:[{
           text: 'refresh_view',
           ui: 'soft-blue',
           iconCls: 'x-fa fa-sync', 
           handler: 'refreshView'
        },'->',{ 
           text: 'filter',
           name: 'filter',
           ui: 'soft-blue',
           iconCls: 'x-fa fa-filter', 
           handler: 'filterDataBrowserReport'
        },{ 
           text: 'export_summary',
           name: 'summary',
           ui: 'soft-blue',
           iconCls: 'x-fa fa-print', 
           handler: 'func_exportSpreadsheet'
        },{
           text: 'export_detailed',
           name: 'detailed',
           ui: 'soft-blue',
           iconCls: 'x-fa fa-print', 
           handler: 'func_exportSpreadsheet'
        },{
           text: 'clear_filters',
           ui: 'soft-blue',         
           iconCls: 'x-fa fa-print', 
           handler: 'func_clearfilters'
        }]
    }],
    listeners: {
    	afterRender: 'renderSpreadsheet'
    },
	items: []
});

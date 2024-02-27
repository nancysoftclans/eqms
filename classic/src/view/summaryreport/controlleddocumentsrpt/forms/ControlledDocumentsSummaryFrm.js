var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
Ext.define('Admin.view.summaryreport.product.form.ControlledDocumentsSummaryFrm', {
	extend: 'Ext.form.Panel',
	xtype: 'controlleddocumentssummaryfrm',

    layout: 'column',
           
	 defaults: {
                    columnWidth: 0.33,
                    margin: 2,
                },
   items: [ {
    xtype: 'combo',
    fieldLabel: 'Document Type',
    labelAlign : 'top',
    valueField: 'id',
    displayField: 'name',
    forceSelection: true,
    name: 'document_type_id',
    queryMode: 'local',
    allowBlank: true,
    fieldStyle: {
        'color': 'green',
        'font-weight': 'bold'
    },
    listeners: {
        beforerender: {
            fn: 'setOrgConfigCombosStore',
            config: {
                pageSize: 100,
                proxy: {
                url: 'configurations/getConfigParamFromTable',
                extraParams: {
                    table_name: 'par_controldocument_types'
                }
               }
            },
            isLoad: true
        },
        beforequery: function() {
            var store=this.getStore();
            
            var all={name: 'All',id:0};
              store.insert(0, all);
            }

    }

},{
    xtype: 'combo',
    fieldLabel: 'Directorate',
    labelAlign : 'top',
    valueField: 'id',
    displayField: 'name',
    forceSelection: true,
    name: 'directorate_id',
    queryMode: 'local',
    allowBlank: true,
    fieldStyle: {
        'color': 'green',
        'font-weight': 'bold'
    },
    listeners: {
        beforerender: {
            fn: 'setOrgConfigCombosStore',
            config: {
                pageSize: 100,
                proxy: {
                url: 'configurations/getConfigParamFromTable',
                extraParams: {
                    table_name: 'par_directorates'
                }
               }
            },
            isLoad: true
        },
        change: function(cbo,newVal){
                var frm = cbo.up('form'),
                    directorate_unitStr = frm.down('combo[name=directorate_unit_id]').getStore();
                    
                    var filters = {directorate_id:newVal},
                        filters = JSON.stringify(filters);
                        directorate_unitStr.removeAll();
                        directorate_unitStr.load({params:{filters:filters} });
                
        },
        beforequery: function() {
            var store=this.getStore();
            
            var all={name: 'All',id:0};
              store.insert(0, all);
            }

    }

},{
    xtype: 'combo',
    fieldLabel: 'Directorate Unit',
    labelAlign : 'top',
    valueField: 'id',
    displayField: 'name',
    forceSelection: true,
    name: 'directorate_unit_id',
    queryMode: 'local',
    allowBlank: false,
    fieldStyle: {
        'color': 'green',
        'font-weight': 'bold'
    },
    listeners: {
        beforerender: {
            fn: 'setOrgConfigCombosStore',
            config: {
                pageSize: 100,
                proxy: {
                url: 'configurations/getConfigParamFromTable',
                extraParams: {
                    table_name: 'par_directorate_units'
                }
               }
            },
            isLoad: true
        },
        beforequery: function() {
            var store=this.getStore();
            
            var all={name: 'All',id:0};
              store.insert(0, all);
            }

    }

},{
        xtype: 'datefield',
        fieldLabel: 'From',
        columnWidth: 0.2,
        hidden: true,
        labelAlign : 'top',
        format: 'Y-m-d',
        name: 'from_date',
        allowBlank: true
    },{
        xtype: 'datefield',
        name: 'to_date',
        format: 'Y-m-d',
        hidden: true,
        fieldLabel: 'To',
        labelAlign : 'top',
        allowBlank: true
    }
          ],
          buttons:[{ 
            xtype: 'button',
            text: 'Search Filter',
            name: 'filter_SummaryReport',
            ui: 'soft-green',
            iconCls: 'fa fa-search',
            handler: 'func_RefreshGridReportFilters',
            formBind: true,
        }]
});
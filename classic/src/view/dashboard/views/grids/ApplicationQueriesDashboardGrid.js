Ext.define('Admin.view.dashboard.views.grids.ApplicationQueriesDashboardGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'applicationQueriesDashboardGrid',
    controller: 'dashboardvctr',
    viewConfig: {
        deferEmptyText: false,
        preserveScrollOnReload: true,
        enableTextSelection: true,
        emptyText: 'No Details Available'
    },
    margin: 3,
    tbar: [{
        xtype: 'tbspacer',
        width: 5
    }, {
        xtype: 'combo', anyMatch: true,
        emptyText: 'MODULE',
        flex: 1,
        //labelWidth: 80,
        width: 150,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        name: 'module_id',
        queryMode: 'local',
        fieldStyle: {
            'color': 'green',
            'font-weight': 'bold'
        },
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 100,
                    proxy: {
                        extraParams: {
                            table_name: 'par_modules'
                        }
                    }
                },
                isLoad: true
            },
            change: function (cmbo, newVal) {
                var grid = cmbo.up('grid'),
                sub_module = grid.down('combo[name=sub_module_id]'),
                sub_module_str = sub_module.getStore(),
                filters = JSON.stringify({module_id: newVal});
                sub_module_str.removeAll();
                sub_module_str.load({params: {filters: filters}});
               // grid.getStore().load();
            }
        },
        triggers: {
            clear: {
                type: 'clear',
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        emptyText: 'SECTION',
        flex: 1,
        //labelWidth: 80,
        width: 150,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        name: 'section_id',
        queryMode: 'local',
        fieldStyle: {
            'color': 'green',
            'font-weight': 'bold'
        },
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 100,
                    proxy: {
                        extraParams: {
                            table_name: 'par_sections'
                        }
                    }
                },
                isLoad: true
            },
        },
        triggers: {
            clear: {
                type: 'clear',
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    },{
        xtype: 'combo', anyMatch: true,
        emptyText: 'SUB MODULE',
        flex: 1,
        //labelWidth: 80,
        width: 150,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        name: 'sub_module_id',
        queryMode: 'local',
        fieldStyle: {
            'color': 'green',
            'font-weight': 'bold'
        },
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        extraParams: {
                            table_name: 'par_sub_modules'
                        }
                    }
                },
                isLoad: false
            }, 
            change: function (cmbo, newVal) {
                var grid = cmbo.up('grid'),
                    workflow_stage=grid.down('combo[name=workflow_stage_id]'),
                    workflow_stage_str = workflow_stage.getStore(),
                    filters = JSON.stringify({workflow_id:newVal,});
                    workflow_stage_str.removeAll();
                    workflow_stage_str.load({params: {filters: filters}});
                    
            },
    },
        triggers: {
            clear: {
                type: 'clear',
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    }, {
        xtype: 'combo', anyMatch: true,
        emptyText: 'WORKFLOW STAGE',
        valueField: 'id',
        name: 'workflow_stage_id',
        displayField: 'name',
        queryMode: 'local',
        flex: 1,
        forceSelection: true,
        width: 150,
        fieldStyle: {
            'color': 'green',
            'font-weight': 'bold'
        },
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                        extraParams :{
                            table_name:'wf_workflow_stages'
                        }
                    }
                },
                isLoad: true
            },
        },
        triggers: {
            clear: {
                type: 'clear',
                flex: 1,
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    },{
        xtype: 'button',
        text: 'Filter',
        ui: 'soft-blue',
        iconCls: 'x-fa fa-search',
        handler: function(btn) {
          var grid = btn.up('grid');
              grid.getStore().load();
        },
    },{
        xtype: 'button',
        text: 'Clear',
        ui: 'soft-red',
        iconCls: 'x-fa fa-close',
        handler: function(btn) {
          var grid = btn.up('grid'),
                gridStr = grid.getStore();
                grid.down('combo[name=module_id]').clearValue();
                grid.down('combo[name=section_id]').clearValue();
                grid.down('combo[name=sub_module_id]').clearValue();
                grid.down('combo[name=workflow_stage_id]').clearValue();
                gridStr.load();
        },
    }],
    bbar: [
        {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            width: '60%',
            beforeLoad: function () {
                var store = this.getStore(),
                    grid = this.up('grid'),
                    module_id = grid.down('combo[name=module_id]').getValue(),
                    section_id = grid.down('combo[name=section_id]').getValue(),
                    sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
                    workflow_stage_id = grid.down('combo[name=workflow_stage_id]').getValue();
                store.getProxy().extraParams = {
                    section_id: section_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    workflow_stage_id: workflow_stage_id,
                };
            }
        },
        '->','->',{
          xtype: 'checkbox',
          name:'enable_grouping',
          checked: true,
          boxLabel:'Enable Grouping',
          listeners:{
                change:function(chk,value){
                        var grid = chk.up('grid');
                            grouping = grid.getView().findFeature('grouping');
                            if(value == 1){
                                grouping.enable();
                            }
                            else{
                                grouping.disable();
                            }
                }
          }
        },
        {
            xtype: 'button',
            text: 'Export Intray',
            type: 1,
            is_internaluser: 1,
            ui:'soft-blue',
            iconCls: 'x-fa fa-print',
            handler: 'exportDashboard'
        }
    ],
    features: [
        {
            ftype: 'grouping',
            startCollapsed: true,
            groupHeaderTpl: 'Process: {[values.rows[0].data.process_name]}, Stage: {[values.rows[0].data.workflow_stage]} [{rows.length} {[values.rows.length > 1 ? "Items" : "Item"]}]',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }
    ],
    plugins: [{
        ptype: 'filterfield'
    },{
        ptype: 'gridexporter'
    }],
    export_title: 'Intray',
   
    
    listeners:{
        beforerender: {
            fn: 'setGridStore',
            config: {
                autoLoad: false,
                remoteFilter: true,
                pageSize: 100,
                storeId: 'applicationQueriesDashboardGridstr',
                proxy: {
                   url: 'dashboard/getQeuriedApplications',
                }
            },
            isLoad: true
        },
        //itemdblclick: 'onOlineIntrayItemDblClick'
    },
    
    columns: [
        {
            xtype: 'gridcolumn',
            text: 'Status',
            width: 120,
            dataIndex: 'time_span',
            tdCls: 'wrap',
            renderer: function (value, metaData) {
                if (value <= 10) {
                    metaData.tdStyle = 'color:white;background-color:green';
                    return "NORMAL";
                }
                     else {
                        metaData.tdStyle = 'color:white;background-color:red';
                          return "DELAYED";
                }
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Time Span',
            dataIndex: 'time_span',
            width: 100,
            tdCls: 'wrap',
            renderer: function (val, meta, record) {
                var time_spanexpected = record.get('time_spanexpected'),
                time_span = record.get('time_span');
               
                    return time_span;
              
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Date Received',
            dataIndex: 'date_received',
            width: 150,tbCls: 'wrap',
            tdCls: 'wrap-text',
            renderer: Ext.util.Format.dateRenderer('Y-m-d')
        },
        {
            xtype: 'gridcolumn',
            text: 'Tracking No',
            dataIndex: 'tracking_no',
            width: 150,tbCls: 'wrap',
            tdCls: 'wrap',
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Reference',
            dataIndex: 'reference_no',
            width: 150,tbCls: 'wrap',
            tdCls: 'wrap',
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'module',
            text: 'Module',
            tdCls: 'wrap',
            width: 150,tbCls: 'wrap',
          },
        {
            xtype: 'gridcolumn',
            text: 'Prev Stage',
            dataIndex: 'prev_stage',
            width: 150,tbCls: 'wrap',
            tdCls: 'wrap'
        },{
            xtype: 'gridcolumn',
            text: 'Current Stage',
            dataIndex: 'workflow_stage',
            width: 150,tbCls: 'wrap',
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'From',
            dataIndex: 'from_user',
            width: 150,tbCls: 'wrap',
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'To',
            dataIndex: 'to_user',
            width: 150,tbCls: 'wrap',
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'Applicant',
            dataIndex: 'applicant_name',
            width: 150,tbCls: 'wrap',
            tdCls: 'wrap',
            filter: {
                xtype: 'textfield'
            }
        },
        {
	        text: 'Options',
	        xtype: 'widgetcolumn',
	        width: 90,
	        widget: {
	            width: 75,
	            textAlign: 'left',
	            xtype: 'splitbutton',
	            iconCls: 'x-fa fa-th-list',
	            ui: 'gray',
	            menu: {
	                xtype: 'menu',
	                items: [{
		                text: 'View Application Details',
		                iconCls: 'fa fa-eye',
		                name: 'more_app_details',
		                ui: 'soft-blue',
		                isReadOnly: true,
                        handler: 'showSelectedQueriesApplicationMoreDetails'
		            },{
	                    text: 'View Associated Documents',
	                    iconCls: 'fa fa-file-download',
	                    tooltip: 'View associated documents',
	                    action: 'view',
	                    winWidth: '70%',
	                    handler: 'showApplicationUploadedDocument',
	                    stores: '[]'
	                },{
                        text: 'Preview Application Queries',
                        iconCls: 'x-fa fa-edit',
                        tooltip: 'Preview Record',
                        action: 'edit',
                        childXtype: '',
                        winTitle: 'Preview Application Queries',
                        winWidth: '40%',
                        isReadOnly: 1,
                        handler: 'previewApplicationQueries'
                    },
	                ]
	            }
	        }
    }
     
        
    ]
});
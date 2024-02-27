/**
 * Created by Softclans.
 */
Ext.define('Admin.view.dashboard.grids.DispachedCorrespondenceGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'dispachedCorrespondenceGrid',
    controller: 'dashboardvctr',
    viewConfig: {
        deferEmptyText: false,
        preserveScrollOnReload: true,
        enableTextSelection: true,
        emptyText: 'No Details Available'
    },
    tbar: [{
        xtype: 'tbspacer',
        width: 5
    }, {
        xtype: 'combo', anyMatch: true,
        emptyText: 'SECTION',
        // labelWidth: 80,
        width: 150,
        flex: 1,
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
    }, {
        xtype: 'combo', anyMatch: true,
        emptyText: 'MODULE',
         // labelWidth: 80,
        width: 150,
        flex: 1,
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
        emptyText: 'SUB MODULE',
         // labelWidth: 80,
        width: 150,
        flex: 1,
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
        emptyText: 'WORKFLOW STAGE',
        valueField: 'id',
        name: 'workflow_stage_id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        width: 150,
        flex: 1,
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
                        url: 'workflow/getProcessWorkflowStages'
                    }
                },
                isLoad: false
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
            grid.down('combo[name=section_id]').clearValue();
            grid.down('combo[name=module_id]').clearValue();
            grid.down('combo[name=sub_module_id]').clearValue();
            grid.down('combo[name=workflow_stage_id]').clearValue();
            gridStr.load();
        },
    }],
    bbar: [
        {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            //store: 'outtraystr',
            width: '60%',
            beforeLoad: function () {
                var store = this.getStore(),
                    grid = this.up('grid'),
                    section_id = grid.down('combo[name=section_id]').getValue(),
                    module_id = grid.down('combo[name=module_id]').getValue(),
                    sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
                    workflow_stage_id = grid.down('combo[name=workflow_stage_id]').getValue();
                store.getProxy().extraParams = {
                    section_id: section_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    workflow_stage_id: workflow_stage_id
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
            text: 'Export Outray',
            type: 2,
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
            groupHeaderTpl: 'Department: {[values.rows[0].data.module_name]}, Process: {[values.rows[0].data.process_name]} [{rows.length} {[values.rows.length > 1 ? "Items" : "Item"]}]',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }
    ],
    plugins: [{
        ptype: 'filterfield'
    },{
        ptype: 'gridexporter'
    }],
    listeners:{
        beforerender: {
            fn: 'setGridStore',
            config: {
                autoLoad: false,
                remoteFilter: true,
                grouper: {
                    groupFn: function (item) {
                        return item.get('module_id') + item.get('process_id');
                    }
                },
                pageSize: 100,
                storeId: 'dispachedCorrespondenceGridStr',
                proxy: {
                   url: 'dashboard/getDispatchedCorrespondence',
                }
            },
            isLoad: false
        }
    },
    columns: [
        {
            xtype: 'gridcolumn',
            text: 'Urgency',
            dataIndex: 'urgency_name',
            flex: 1,
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'Tracking No',
            dataIndex: 'tracking_no',
            flex: 1,
            tdCls: 'wrap',
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Reference',
            dataIndex: 'reference_no',
            flex: 1,
            tdCls: 'wrap',
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Process',
            dataIndex: 'process_name',
            flex: 1,
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'Stage',
            dataIndex: 'workflow_stage',
            flex: 1,
            tdCls: 'wrap',
            hidden: true
        },
        {
            xtype: 'gridcolumn',
            text: 'From',
            dataIndex: 'from_user',
            flex: 1,
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'Applicant',
            dataIndex: 'applicant_name',
            flex: 1,
            tdCls: 'wrap',
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Remarks/Comment',
            dataIndex: 'remarks',
            flex: 1,
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'Date Received',
            dataIndex: 'date_received',
            flex: 1,
            tdCls: 'wrap',
            renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
        },
        {
            xtype: 'gridcolumn',
            text: 'Date Released',
            dataIndex: 'date_released',
            flex: 1,
            tdCls: 'wrap',
            renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
        },
        {
            xtype: 'gridcolumn',
            text: 'Dispatch Date',
            dataIndex: 'dispatch_date',
            flex: 1,
            renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s'),
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'Dispatched By',
            dataIndex: 'dispatch_by',
            flex: 1,
            tdCls: 'wrap'
        }, {
        text: 'Dispatch Preview',
        xtype: 'widgetcolumn',
        width: 90,
        widget: {
            width: 100,
            textAlign: 'left',
            xtype: 'button',
            iconCls: 'fa fa-eye',
            ui: 'soft-blue',
            name:'preview_correspondence',
            text: 'Preview Correspondence',
            handler: 'previewCorrespondence'
        }
    }
    ]
});
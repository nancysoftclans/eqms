Ext.define('Admin.view.taskAgeAnalysis.views.grids.ApplicationAssigmentGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'taskageanalysisgrid',
    controller: 'taskAgeAnalysisVctr',
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
    }, 
    {
        xtype: 'combo', anyMatch: true,
        emptyText: 'SECTION',
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
    }, 
    {
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
    }, 
    {
        xtype: 'combo', anyMatch: true,
        emptyText: 'SUB MODULE',
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
    },
    
],
    bbar: [
        {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            width: '60%',
            beforeLoad: function () {
                var store = this.getStore(),
                    grid = this.up('grid'),
                    section_id = grid.down('combo[name=section_id]').getValue(),
                    module_id = grid.down('combo[name=module_id]').getValue(),
                    sub_module_id = grid.down('combo[name=sub_module_id]').getValue();
                    store.getProxy().extraParams = {
                        section_id: section_id,
                        module_id: module_id,
                        sub_module_id: sub_module_id
                    };
            }
        },
        '->',,'->',{
          xtype: 'checkbox',
          name:'enable_grouping',
          boxLabel:'Disable Grouping',
          listeners:{
                change:function(chk,value){
                        var grid = chk.up('grid');
                        console.log(grid.getView())
                            grouping = grid.getView().findFeature('grouping');
                            if(value == 1){
                                grouping.disable();
                            }
                            else{
                                grouping.enable();
                            }
                }
          }
        },
        {
            xtype: 'exportbtn'
        }
    ],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 500,
                enablePagination: true,
                remoteFilter: true,
                grouper: {
                    groupFn: function (item) {
                        return item.get('process_id') + item.get('workflow_stage_id');
                    }
                },
                storeId: 'taskageanalysisgridstr',
                proxy: {
                    url: 'applicationassignment/getApplicationAssaignmentRecords'
                }
            },
            isLoad: true
        },
        afterrender:function(){
            // var view = this.getView();
            // var groupingFeature = view.findFeature("grouping");
            // groupingFeature.enable();
        },
    },
    features: [
        {
            ftype: 'grouping',
            groupHeaderTpl: 'Process: {[values.rows[0].data.process_name]}, Stage: {[values.rows[0].data.workflow_stage]} [{rows.length} {[values.rows.length > 1 ? "Items" : "Item"]}]',
            hideGroupedHeader: true,
            enableGroupingMenu: false,
            startCollapsed: true
        }
    ],
    plugins: [{
        ptype: 'filterfield'
    },{
        ptype: 'gridexporter'
    }],
    export_title: 'applicationassaigment',
    columns: [
        {
            xtype: 'gridcolumn',
            width: 50,
            renderer: function (val, meta, record) {
                var isRead = record.get('isRead');
                if (isRead == 1 || isRead === 1) {
                    //return '<img src="' + base_url + '/resources/images/new3.jpg">';
                } else {
                    return '<img src="' + base_url + '/resources/images/new3.jpg">';
                }
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Time Span',
            dataIndex: 'time_span',
            flex: 1,
            tdCls: 'wrap',
            renderer: function (val, meta, record) {
                var time_spanexpected = record.get('time_spanexpected'),
                time_span = record.get('time_span');
                    return time_span;
            }
        },
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
            text: 'Application No',
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
            tdCls: 'wrap-text',
            hidden: true
        },
        {
            xtype: 'gridcolumn',
            text: 'Prev Stage',
            dataIndex: 'prev_stage',
            flex: 1,
            tdCls: 'wrap'
        },{
            xtype: 'gridcolumn',
            text: 'Current Stage',
            dataIndex: 'workflow_stage',
            flex: 1,
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'Previous User',
            dataIndex: 'from_user',
            flex: 1,
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'Current User',
            dataIndex: 'to_user',
            flex: 1,
            tdCls: 'wrap'
        },
        // {
        //     xtype: 'gridcolumn',
        //     text: 'Applicant',
        //     dataIndex: 'applicant_name',
        //     flex: 1,
        //     tdCls: 'wrap',
        //     filter: {
        //         xtype: 'textfield'
        //     }
        // },
        // {
        //     xtype: 'gridcolumn',
        //     text: 'Date Received',
        //     dataIndex: 'date_received',
        //     flex: 1,
        //     tdCls: 'wrap-text',
        //     renderer: Ext.util.Format.dateRenderer('Y-m-d')
        // },
        {
            xtype: 'gridcolumn',
            text: 'App Status',
            dataIndex: 'application_status',
            flex: 1,
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            width: 50,
            renderer: function (val, meta, record) {
                var is_fast_track = record.get('is_fast_track');
                if (is_fast_track == 1 || is_fast_track === 1) {
                    return '<img src="' + base_url + '/resources/images/fasttrack.jpg">';
                } else {
                    //return '<img src="' + base_url + '/resources/images/fasttrack.jpg">';
                }
            }
        }
    ]
});
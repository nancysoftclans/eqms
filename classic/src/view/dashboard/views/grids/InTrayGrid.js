Ext.define('Admin.view.dashboard.views.grids.InTrayGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'intraygrid',
    controller: 'dashboardvctr',

    viewConfig: {
        deferEmptyText: false,
        preserveScrollOnReload: true,
        enableTextSelection: true,
        emptyText: 'No Details Available',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var is_receipting_stage = record.get('is_receipting_stage'),
                application_status_id = record.get('application_status_id'),
                is_fast_track = record.get('is_fast_track');
            // if (is_receipting_stage == 1) {
            if (application_status_id == 10) {
                return 'invalid-row';
            } else if (application_status_id == 11) {
                return 'valid-row';
            }
            if (is_fast_track == 1) {
                return 'fast-track-row';
            }
            if (record.get('is_read') == 0) {
                sendPushNotification('You have a new task in your intray awaiting your action', 'New Task');
            }
            // }
        }
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
                    filters = JSON.stringify({ module_id: newVal });
                sub_module_str.removeAll();
                sub_module_str.load({ params: { filters: filters } });
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
    }, {
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
                    workflow_stage = grid.down('combo[name=workflow_stage_id]'),
                    workflow_stage_str = workflow_stage.getStore(),
                    filters = JSON.stringify({ workflow_id: newVal, });
                workflow_stage_str.removeAll();
                workflow_stage_str.load({ params: { filters: filters } });

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
                        extraParams: {
                            table_name: 'wf_workflow_stages'
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
    }, {
        xtype: 'button',
        text: 'Filter',
        ui: 'soft-blue',
        iconCls: 'x-fa fa-search',
        handler: function (btn) {
            var grid = btn.up('grid');
            grid.getStore().load();
        },
    }, {
        xtype: 'button',
        text: 'Clear',
        ui: 'soft-red',
        iconCls: 'x-fa fa-close',
        handler: function (btn) {
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
            //store: 'intraystr',
            width: '60%',
            beforeLoad: function () {
                var store = this.getStore(),
                    grid = this.up('grid'),
                    module_id = grid.down('combo[name=module_id]').getValue(),
                    section_id = grid.down('combo[name=section_id]').getValue(),
                    sub_module_id = grid.down('combo[name=sub_module_id]').getValue(),
                    workflow_stage_id = grid.down('combo[name=workflow_stage_id]').getValue(),
                    branch_id = grid.down('combo[name=branch_id]').getValue(),
                    application_status_id = grid.down('combo[name=application_status_id]').getValue();
                store.getProxy().extraParams = {
                    section_id: section_id,
                    module_id: module_id,
                    sub_module_id: sub_module_id,
                    workflow_stage_id: workflow_stage_id,
                    branch_id: branch_id,
                    application_status_id: application_status_id
                };
            }
        },
        '->', '->', {
            xtype: 'checkbox',
            name: 'enable_grouping',
            checked: true,
            boxLabel: 'Enable Grouping',
            listeners: {
                change: function (chk, value) {
                    var grid = chk.up('grid');
                    grouping = grid.getView().findFeature('grouping');
                    if (value == 1) {
                        grouping.enable();
                    }
                    else {
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
            ui: 'soft-blue',
            iconCls: 'x-fa fa-print',
            handler: 'exportDashboard'
        }
    ],
    features: [
        {
            ftype: 'grouping',
            startCollapsed: true,
            // groupHeaderTpl: 'Process: {[values.rows[0].data.process_name]}, Stage: {[values.rows[0].data.workflow_stage]} [{rows.length} {[values.rows.length > 1 ? "Items" : "Item"]}]',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }
    ],
    plugins: [{
        ptype: 'filterfield'
    }, {
        ptype: 'gridexporter'
    }],

    export_title: 'Intray',


    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                autoLoad: false,
                remoteFilter: true,
                grouper: {
                    groupFn: function (item) {
                        if (item.get('is_fast_track') == 1) {
                            return 'Fast Tracked Applications';
                        }
                        else if (item.get('is_receipting_stage') == 1) {

                            return 'Process: ' + item.get('process_name') + ' Stage: ' + item.get('workflow_stage') + ' Status ' + item.get('application_status');
                        }
                        else {
                            return 'Process: ' + item.get('process_name') + ' Stage: ' + item.get('workflow_stage');
                        }
                    }
                },
                pageSize: 100,
                storeId: 'intraystr',
                proxy: {
                    url: 'dashboard/getInTrayItems',
                }
            },
            isLoad: true
        },
        // afterrender: function(grid){
        //     console.log(grid.getPlugin('filterfield').getgridFilters(grid));
        // },
        itemdblclick: 'onIntrayItemDblClick'
    },

    columns: [
        {
            xtype: 'gridcolumn',
            width: 70,
            renderer: function (val, meta, record) {
                var is_fast_track = record.get('is_fast_track');
                if (is_fast_track == 1 || is_fast_track === 1) {
                    return '<img src="' + base_url + '/resources/images/fast-track.gif" height="60px" width="70px">';
                } else {
                    //return '<img src="' + base_url + '/resources/images/fasttrack.jpg">';
                }
            }
        },
        {
            xtype: 'gridcolumn',
            width: 50,
            renderer: function (val, meta, record) {
                var isRead = record.get('is_read');
                if (isRead == 1 || isRead === 1) {
                    //return '<img src="' + base_url + '/resources/images/new3.jpg">';
                } else {
                    return '<img src="' + base_url + '/resources/images/new3.jpg">';
                }
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Urgency',
            dataIndex: 'urgency_name',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'Tracking No',
            dataIndex: 'tracking_no',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap',
            listeners: {
                beforerender: function (column) {
                    column.down('textfield').setValue(tracking_no);
                },
            },
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Reference',
            dataIndex: 'reference_no',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap',
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Process',
            dataIndex: 'process_name',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap-text',
            hidden: true
        },
        {
            xtype: 'gridcolumn',
            text: 'Prev Stage',
            dataIndex: 'prev_stage',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap'
        }, {
            xtype: 'gridcolumn',
            text: 'Current Stage',
            dataIndex: 'workflow_stage',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'From',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap',
            renderer: function (value, metaData, record) {
                var firstName = record.get("from_first_name");
                var lastName = record.get("from_last_name");
                return firstName + " " + lastName;
            },
        },
        {
            xtype: 'gridcolumn',
            text: 'To',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap',
            renderer: function (value, metaData, record) {
                var firstName = record.get("to_first_name");
                var lastName = record.get("to_last_name");
                return firstName + " " + lastName;
            },
        },
        {
            xtype: 'gridcolumn',
            text: 'Applicant',
            dataIndex: 'applicant_name',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap',
            filter: {
                xtype: 'textfield'
            }
        },
        {
            xtype: 'gridcolumn',
            text: 'Remarks/Comment',
            dataIndex: 'remarks',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap'
        },
        {
            xtype: 'gridcolumn',
            text: 'Date Received',
            dataIndex: 'date_received',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap-text',
            renderer: Ext.util.Format.dateRenderer('Y-m-d')
        }, {
            xtype: 'gridcolumn',
            text: 'Expected Start Date',
            dataIndex: 'expected_start_date',
            width: 150, tbCls: 'wrap',
            hidden: true,
            tdCls: 'wrap-text',
            renderer: Ext.util.Format.dateRenderer('Y-m-d')
        }, {
            xtype: 'gridcolumn',
            text: 'Expected End Date',
            dataIndex: 'expected_end_date',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap-text',
            renderer: Ext.util.Format.dateRenderer('Y-m-d')
        },
        {
            xtype: 'gridcolumn',
            text: 'App Status',
            dataIndex: 'application_status',
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'application_status_id',
                displayField: 'name',
                valueField: 'id', queryMode: 'local',
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 1000,
                            proxy: {
                                extraParams: {
                                    table_name: 'par_system_statuses'
                                }
                            }
                        },
                        isLoad: true
                    }, change: function (cmb, newValue, oldValue, eopts) {
                        var grid = cmb.up('grid');
                        grid.getStore().reload();
                    }

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
            xtype: 'gridcolumn',
            text: 'Branch',
            dataIndex: 'branch_name',
            hidden: true,
            width: 150, tbCls: 'wrap',
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'branch_id',
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                listeners: {
                    beforerender: {
                        fn: 'setCompStore',
                        config: {
                            pageSize: 1000,
                            proxy: {
                                extraParams: {
                                    table_name: 'par_branches'
                                }
                            }
                        },
                        isLoad: true
                    }, change: function (cmb, newValue, oldValue, eopts) {
                        var grid = cmb.up('grid');
                        grid.getStore().reload();
                    }

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
            xtype: 'gridcolumn',
            text: 'Sample Analysis Status',
            dataIndex: 'sample_analysis_status',
            tdCls: 'wrap-text',
            width: 150, tbCls: 'wrap',
            hidden: true,
            renderer: function (value, metaData) {
                if (value != '' && value != null) {
                    metaData.tdStyle = 'color:white;background-color:green';
                    return "Has Analysis";
                }
                return "N/A";
            }
        }, {
            xtype: 'gridcolumn',
            text: 'Time Span',
            dataIndex: 'time_span',
            width: 150,
            tdCls: 'wrap',
            renderer: function (val, meta, record) {
                var time_spanexpected = record.get('time_spanexpected'),
                    time_span = record.get('time_span');

                return time_span;

            }
        },

    ]
});
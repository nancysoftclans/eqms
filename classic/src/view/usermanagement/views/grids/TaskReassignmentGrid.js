Ext.define('Admin.view.frontoffice.enquiries.grid.TaskReassignmentGrid', {
    extend: 'Ext.grid.Panel',
	xtype: 'taskreassignmentgrid',
    layout: 'fit',
    controller: 'usermanagementvctr',
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                storeId: 'taskreassignmentStr',
                proxy: {
                    url: 'usermanagement/getTaskReassignmentApplications'
                }
            },
            isLoad: true
        }
    },
   
    tbar:[
    {
        xtype: 'combo', anyMatch: true,
        emptyText: 'USER',
        // labelWidth: 80,
        width: 200,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        name: 'user_id',
        // allowBlank: false,
        queryMode: 'local',
        fieldStyle: {
            'color': 'green',
            'font-weight': 'bold'
        },
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    // pageSize: 100,
                    proxy: {
                    url: 'usermanagement/getUserList'
                   }
                },
                isLoad: true,
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
        emptyText: 'SECTION',
        // labelWidth: 80,
        width: 200,
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
        width: 200,
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
                    pageSize: 1000,
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
        width: 200,
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
        },
        triggers: {
            clear: {
                type: 'clear',
                hideWhenEmpty: true,
                hideWhenMouseOut: false,
                clearOnEscape: true
            }
        }
    }],
    features: [{
            ftype: 'searching',
            minChars: 2,
            mode: 'local'
        },{
            ftype: 'grouping',
            startCollapsed: false,
            groupHeaderTpl: 'Current Stage: {[values.rows[0].data.current_stage]}',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }],
       
    columns: [{
        xtype: 'gridcolumn',
        dataIndex: 'id',
        name: 'id',
        text: 'id',
        hidden: true,
        flex: 1,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'application_code',
        name: 'application_code',
        text: 'application_code',
        flex: 1,
        hidden: true,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'workflow_stage_id',
        name: 'workflow_stage_id',
        text: 'workflow_stage_id',
        hidden: true,
        flex: 1,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'reference_no',
        name: 'reference_no',
        text: 'Reference No',
        flex: 1,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'tracking_no',
        name: 'tracking_no',
        text: 'Tracking No',
        flex: 1,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'full_name',
        name: 'full_name',
        text: 'Full Name',
        flex: 1,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'username',
        name: 'username',
        text: 'User Name',
        flex: 1,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'process_name',
        name: 'process_name',
        text: 'Process',
        flex: 1,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'prev_stage',
        name: 'prev_stage',
        text: 'From',
        flex: 1,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'current_stage',
        name: 'current_stage',
        text: 'Stage',
        flex: 1,
        tbCls: 'wrap'
       
    },{
        xtype: 'gridcolumn',
        dataIndex: 'applicant',
        name: 'applicant',
        text: 'Applicant',
        flex: 1,
        tbCls: 'wrap'
       
    },{
        xtype: 'widgetcolumn',
        text: 'Action',
        flex: 1,
        widget: {
           // width: 75,
            textAlign: 'left',
            xtype: 'splitbutton',
            iconCls: 'x-fa fa-th-list',
            ui: 'gray',
            menu: {
                xtype: 'menu',
                items: [{
                        xtype: 'button',
                        childXtype: 'taskreassingmentfrm',
                        winTitle: 'Task Reassignment',
                        winWidth: '40%',
                        stores: [],
                        text: 'Re-Assign',
                        handler: 'showEditConfigParamWinFrm'
                    }]
                  },
        }
       
    }],

    bbar: [{
        xtype: 'pagingtoolbar',
        width: '100%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} out of {2}',
        emptyMsg: 'No Records',
        beforeLoad:function() {
            var store=this.getStore(),
                grid = this.up('grid'),
                    user_id = grid.down('combo[name=user_id]').getValue(),
                    section_id = grid.down('combo[name=section_id]').getValue();
                    module_id = grid.down('combo[name=module_id]').getValue();
                    sub_module_id = grid.down('combo[name=sub_module_id]').getValue(); 
                 store.getProxy().extraParams = {
                    'user_id':user_id,
                    section_id:section_id,
                    module_id:module_id,
                    sub_module_id:sub_module_id
                 }
        },
    }]

    });

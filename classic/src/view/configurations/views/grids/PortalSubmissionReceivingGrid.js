
Ext.define('Admin.view.configurations.views.grids.PortalSubmissionReceivingGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'portalSubmissionReceivingGrid',
    cls: 'dashboard-todo-list',
    height: Ext.Element.getViewportHeight() - 118,
    // header: false,
    controller: 'configurationsvctr',
    autoScroll: true,
    width: '100%',
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'No Applications Found',
    },
	tbar: [{
        xtype: 'tbspacer',
        width: 5
    },

    {
        xtype: 'displayfield',
        value: 'Go to options to receive application!!',
        fieldStyle: {
            'color':'green'
        }
    }
],
    
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '80%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function(){
            var store = this.getStore(),
            grid = this.up("grid"),
            section_id = grid.down('combo[name=section_id]').getValue(),
            module_id = grid.down('combo[name=module_id]').getValue(),
            sub_module_id = grid.down('combo[name=sub_module_id]').getValue();
            store.getProxy().extraParams = {
                section_id: section_id,
                module_id: module_id,
                sub_module_id: sub_module_id,
            };
        }
    }],

    selModel:{
        selType: 'checkboxmodel',
        mode: 'MULTI'
    },
    plugins: [{
        ptype: 'filterfield'
    },{
        ptype: 'gridexporter'
    }],
    features: [
        {
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }, {
        ftype: 'grouping',
        startCollapsed: false,
        groupHeaderTpl: 'Module: {[values.rows[0].data.module_name]} [{rows.length} {[values.rows.length > 1 ? "Applications" : "Applications"]}]',
        hideGroupedHeader: true,
        enableGroupingMenu: false
    }],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 100,
                storeId: 'portalSubmissionReceivingGridStr',
                grouper: {
                    groupFn: function (item) {
                        return item.get('module_id');
                    }
                },
                proxy: {
                    url: 'configurations/getportalSubmissionReceivingApplications',
                 
                    
                }
            },
            isLoad: true
        },
         select: function(sel, record, index, eOpts) {
            var me = this,
               grid = sel.view.grid,
               panel = grid.up('panel'),
               selCount = grid.getSelectionModel().getCount();
               
           if(selCount > 0 ){
               panel.down('button[name=process_receive_btn]').setDisabled(false);
           }else{
               panel.down('button[name=process_receive_btn]').setDisabled(true);
           }
        },
        deselect: function(sel, record, index, eOpts) {
            var me = this,
               grid = sel.view.grid,
               panel = grid.up('panel'),
               selCount = grid.getSelectionModel().getCount();
               
           if(selCount > 0 ){
               panel.down('button[name=process_receive_btn]').setDisabled(false);
           }else{
               panel.down('button[name=process_receive_btn]').setDisabled(true);
           }
        }
    },
    columns: [{
	    	xtype: 'rownumberer'
	    },{
	        xtype: 'gridcolumn',
	        dataIndex: 'tracking_no',
	        text: 'Tracking No',
            width: 200,
            tbCls: 'wrap',
            filter: {
                xtype: 'textfield'
            }
	    },{
	        xtype: 'gridcolumn',
	        dataIndex: 'reference_no',
	        text: 'Ref Number',
            width: 200,
            tbCls: 'wrap',
            filter: {
                xtype: 'textfield'
            }
	       
	    }, {
	        xtype: 'gridcolumn',
	        dataIndex: 'applicant_name',
	        text: 'Applicant',
	        flex: 1
	    },    {
            xtype: 'gridcolumn',
            text: 'Process',
            dataIndex: 'process_name',
            flex: 1,
            tdCls: 'wrap-text'
        }, {
	        xtype: 'gridcolumn',
	        dataIndex: 'date_submitted',
	        text: 'Submitted On',
            width: 200,
            tdCls: 'wrap',
	    },
        {
            xtype: 'gridcolumn',
            dataIndex: 'module_name',
            text: 'Module',
            name: 'module',
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'module_id',
                valueField: 'id',
                displayField: 'name',
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
                                    table_name: 'par_modules'
                                }
                            }
                        },
                        isLoad: true
                    },
                    change: function(me,newValue, oldVal, eopts){
                        var grid = this.up('grid'),
                            subStr = grid.down('combo[name=sub_module_id]').getStore(),
                            filters = JSON.stringify({module_id:newValue});
                        grid.getStore().reload();
                        subStr.load({params: {filters: filters}})
                    }
                   
                }
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'sub_module_name',
            text: 'Sub Module',
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'sub_module_id',
                valueField: 'id',
                displayField: 'name',
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
                                    table_name: 'par_sub_modules'
                                }
                            }
                        },
                        isLoad: false
                    },
                    change: function(me){
                        this.up('grid').getStore().reload();
                    }
                   
                }
            }
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'section_name',
            text: 'Section',
            width: 200,
            tdCls: 'wrap',
            filter: {
                xtype: 'combo', anyMatch: true,
                name: 'section_id',
                valueField: 'id',
                displayField: 'name',
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
                                    table_name: 'par_sections'
                                }
                            }
                        },
                        isLoad: false
                    },
                    change: function(me){
                        this.up('grid').getStore().reload();
                    }
                   
                }
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
                        handler: 'showSelectedProductPortalApplicationMoreDetails'
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
                        handler: 'previewPortalReceivingApplicationQueries'
                    },{
                        text: 'Sync Application Data',
                        iconCls: 'x-fa fa-retweet',
                        tooltip: 'Receive Application',
                        winWidth: '40%',
                        storeID:'portalSubmissionReceivingGridStr',
                        ui: 'soft-blue',
                        table_name:'',
                        handler: 'showReceivePortalApplicationsWinGeneric'
                    },{
                        text: 'Submit Application',
                        iconCls: 'fa fa-check',
                        tooltip: 'Submit Application',
                        winWidth: '40%',
                        storeID:'portalSubmissionReceivingGridStr',
                        ui: 'soft-blue',
                        table_name:'',
                        handler: 'showSubmitPortalApplicationsWinGeneric'
                    },
	                ]
	            }
	        }
    }
],
});

Ext.define('Admin.view.administration.views.grids.SyncWorkflowStagesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'syncworkflowstagesgrid',
    itemId: 'syncworkflowstagesgridRef',
    cls: 'dashboard-todo-list',
    header: false,
    controller: 'administrationvctr',
    height: Ext.Element.getViewportHeight() - 118,
    autoScroll: true,
    autoHeight: true,
    width: '50%',

    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display'
    },
    
    bbar: [{
        xtype: 'pagingtoolbar',
        width: '80%',
        displayInfo: true,
        displayMsg: 'Showing {0} - {1} of {2} total records',
        emptyMsg: 'No Records',
        beforeLoad: function() {
            var grid = this.up('grid'),
                wf_id = grid.down('hiddenfield[name=workflow_id]').getValue(),
                group_id = grid.down('hiddenfield[name=group_id]').getValue(),
                store = grid.getStore();

         store.getProxy().extraParams = {
                    workflow_id:wf_id,
                    group_id:group_id
                }      
            
        },
     },'->',{
        xtype: 'button',
        text: 'Sync',
        width: 100,
        action: 'sync',
        disabled: true,
        ui: 'soft-blue',
        handler: 'syncGrouptoWorkflow'
    },{
        xtype: 'hiddenfield',
        name: 'workflow_id'
    },{
        xtype: 'hiddenfield',
        name: 'group_id'
    }
    ],

    selModel:{
        selType: 'checkboxmodel',
        checkOnly : true
    },
    features: [{
        ftype:'grouping',
        startCollapsed: true
    }],
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1,
        editing: true
    }],
    listeners: {
        beforerender: {
            fn: 'setGridStore',
            config: {
                pageSize: 100,
                storeId: 'syncworkflowstagesgridstr',
                proxy: {
                    url: 'workflow/getGroupMappedWorkflowStages',
                }
            },
            isLoad: false
        },
        select: function (sel, record, index, eOpts) {
            var me = this,
                grid = sel.view.grid,
                selCount = grid.getSelectionModel().getCount();
            if (selCount > 0) {
                grid.down('button[action=sync]').setDisabled(false);
            }
        },
        afterrender: function () {
            var grid = this,
                sm = grid.getSelectionModel();
                
                
            grid.store.on('load', function (store, records, options) {
                Ext.each(records, function (record) {
                 
                    var rowIndex = store.indexOf(record);
                    if (record.data.has_access > 0 ) {
                        sm.select(rowIndex, true);
                    }
                });
            })
        },
        deselect: function (sel, record, index, eOpts) {
            var me = this,
                grid = sel.view.grid,
                selCount = grid.getSelectionModel().getCount();
            if (selCount < 1) {
                grid.down('button[action=sync]').setDisabled(true);
            }
        },
        validateedit: function(me, context, eOpts){
            var grid = context.grid,
                sm = grid.getSelectionModel(),
                store = grid.getStore(),
                rows = sm.getSelection(),
                curr_rowIndex = context.rowIdx,
                access_level = context.value,
                index;
            if(access_level){
                Ext.each(rows, function(ob){
                    index = store.indexOf(ob);

                      sm.select(index, true);
                });
               sm.select(curr_rowIndex, true);
            }
           
        }
    },
    columns: [
    {
        xtype: 'gridcolumn',
        dataIndex: 'stage_id',
        hidden: true,
        text: 'stage_id',
    },{
        xtype: 'gridcolumn',
        dataIndex: 'stage_name',
        text: 'Stages',
        flex: 1,
    },{
        xtype: 'gridcolumn',
        dataIndex: 'access_level_id',
        text: 'Access Level',
        width: 120,
        editor: {
            xtype: 'combo', anyMatch: true,
            valueField: 'id',
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            listeners: {
                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 10,
                        proxy: {
                            url: base_url+'configurations/getConfigParamFromTable',
                            extraParams: {
                                table_name: 'par_accesslevels'
                            }
                        }
                    },
                    isLoad: true
                }
               
            }
            
        },
        renderer: function (val, meta, record, rowIndex, colIndex, store, view) {
            var textVal = 'Not Set';
            if(record.get('access_level')){
                textVal = record.get('access_level');
            }
            if(record.dirty){
                return 'Pending Save';
            }
            return textVal;
        }
    }]
});

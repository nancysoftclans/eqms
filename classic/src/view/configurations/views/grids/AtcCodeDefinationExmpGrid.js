Ext.define('Admin.view.configurations.views.grids.AtcCodeDefinationExmpGrid', {
    extend: 'Ext.tree.Panel',
    xtype: 'atcCodeDefinationExmpGrid',
    itemId: 'atcCodeDefinationExmpGrid',
    useArrows: true,
    rootVisible: false,
    multiSelect: false,
    singleExpand: true,
    margin: '0 5 0 0',
    selType: 'cellmodel',
    requires: [
        'Ext.grid.*',
        'Ext.tree.*'
    ],
    features: [{
        ftype: 'searching',
        minChars: 2,
        mode: 'local'
    }],
    viewConfig: {
        deferEmptyText: false,
        emptyText: 'Nothing to display',
        getRowClass: function (record, rowIndex, rowParams, store) {
            var is_enabled = record.get('is_enabled');
            if (is_enabled == 0 || is_enabled === 0) {
                return 'invalid-row';
            }
        }
    },
    plugins: [
        {
            ptype: 'gridexporter'
        }
    ],
    tbar:[{
          xtype: 'toolbar',
          ui: 'footer',
          width: '70%',
          layout: 'hbox',
          items: [{
                xtype: 'button',
                text: 'Add',
                ui: 'soft-blue',
                iconCls: 'x-fa fa-plus',
                action: 'add',
                winTitle:'New ATC Code',
                winWidth:'70%',
                childXtype: 'atcCodeDefinationfrm',
                handler: 'showAddConfigParamWinFrm',
                stores: '[]'
            }, 
            {
                xtype: 'exportbtn'
            },
            '->',{
            xtype: 'textfield',
            fieldLabel: 'ATC CODE:',
            labelWidth: 150,
            name: 'atc_code',
            listeners: {
                change: function(me,value,old,opt) {
                    var grid=me.up();
                     if(value!=''){
                      var button=grid.down('button[name=search]').enable();
                      }else{
                        var button=grid.down('button[name=search]').disable();
                      }
                  }
              },
          },{
            xtype: 'button',
            iconCls: 'fa fa-search',
            text: 'Search',
            handler: 'refreshGrid',
            ui: 'soft-blue',
            name: 'search',
            disabled: true
        }],
    }],


    autoScroll: true,
    listeners: {
        beforerender: {
            fn: 'setGridTreeStore',
            config: {
                storeId: 'atccodedefinationpreviewStr',
                proxy: {
                    api: {
                        read: 'configurations/getAtcCodesForPreview'
                    },
                },
            },
            isLoad: true
        },
        itemdblclick: 'loadAtcCodesToVetExmpIngredientFrm'
    },
   
    bbar: [
        {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            displayMsg: 'Showing {0} - {1} of {2} total records',
            emptyMsg: 'No Records',
            beforeLoad: function() {
                var grid = this.up('treepanel'),
                    store= this.getStore(),
                    atc_code = grid.down('textfield[name=atc_code]').getValue();

                    
                    store.getProxy().extraParams = {
                        atc_code: atc_code
                    };
            
            },
        }],
    columns: [{
        xtype: 'treecolumn',
        dataIndex: 'code',
        text: 'ATC Code',
        width: 250,
        sortable: true
    },{
        xtype: 'gridcolumn',
        dataIndex: 'name',
        text: 'Name',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'section_name',
        text: 'Section Name',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'description',
        text: 'Description',
        flex: 1
    },{
        xtype: 'gridcolumn',
        dataIndex: 'is_migrated',
        text: 'Is Migrated',
        renderer: function (value, metaData) {
            if (value) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "True";
            }

            metaData.tdStyle = 'color:white;background-color:red';
            return "False";
        }
    },{
        xtype: 'gridcolumn',
        dataIndex: 'is_enabled',
        text: 'Is_Enabled',
        renderer: function (value, metaData) {
            if (value) {
                metaData.tdStyle = 'color:white;background-color:green';
                return "True";
            }

            metaData.tdStyle = 'color:white;background-color:red';
            return "False";
        }
    },{
            text: 'Options',
            xtype: 'widgetcolumn',
            width: 90,
            widget: {
                textAlign: 'left',
                xtype: 'splitbutton',
                ui: 'gray',
                width: 75,
                iconCls: 'x-fa fa-th-list',
                menu: {
                    xtype: 'menu',
                    items: [{
                        text: 'Edit',
                        iconCls: 'x-fa fa-edit',
                        tooltip: 'Edit Record',
                        action: 'edit',
                        childXtype:'atcCodeDefinationfrm',
                        winTitle: 'Edit ATC Code',
                        winWidth:'70%',
                        handler: 'showEditConfigParamWinFrm',
                        bind:{
                            disabled: '{isReadOnly}'
                            },
                        stores: '[]'
                    },
                    {
                        text: 'Disable',
                        iconCls: 'x-fa fa-eye-slash',
                        table_name: 'par_atc_codes',
                        storeID: 'atccodedefinationpreviewStr',
                        action_url: 'configurations/softDeleteConfigRecord',
                        action: 'soft_delete',
                        bind:{
                            disabled: '{isReadOnly}'
                        },
                        handler: 'doDeleteConfigWidgetParam'
                    },
                
                    {
                        text: 'Delete',
                        iconCls: 'x-fa fa-trash',
                        tooltip: 'Delete Record',
                        table_name: 'par_atc_codes',
                        storeID: 'atccodedefinationpreviewStr',
                        bind:{
                            disabled: '{hideDeleteButton}'
                        },
                        action_url: 'configurations/deleteConfigRecord',
                        action: 'actual_delete',
                        handler: 'doDeleteConfigWidgetParam',
                        bind:{
                            disabled: '{hideDeleteButton}'
                        },
    
                    },
                    {
                        text: 'Enable',
                        iconCls: 'x-fa fa-undo',
                        tooltip: 'Enable Record',
                        table_name: 'par_atc_codes',
                        storeID: 'atccodedefinationpreviewStr',
                        bind:{
                            disabled: '{hideDeleteButton}'
                        },
                        action_url: 'configurations/undoConfigSoftDeletes',
                        action: 'enable',
                        handler: 'doDeleteConfigWidgetParam',
                    },

                    ]
                }
            },
            onWidgetAttach: function(col, widget, rec){
                var is_enabled = rec.get(is_enabled);
                if(is_enabled===0 || is_enabled ==0 ){
                    widget.down('menu menuitem[action=enable]').setDisabled(false);
                    widget.down('menu menuitem[action=soft_delete').setDisabled(true);
                }else{
                    widget.down('menu menuitem[action=enable]').setDisabled(true);
                    widget.down('menu menuitem[action=enable]').setDisabled(false);
                }
            }

        }]
});

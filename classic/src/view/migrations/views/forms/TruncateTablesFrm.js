Ext.define('Admin.view.migratioins.views.forms.TruncateTablesFrm', {


    extend: 'Ext.form.Panel',
    xtype : 'truncatetablesFrm',
    controller: 'migrationviewctr',
    autoScroll: true,
    layout: 'form',
    frame: true,
    bodyPadding: 8,

   

    items : [
       
        {
            xtype: 'tagfield',
            fieldLabel: 'Select Tables To truncate',
            margin: '0 20 20 0',
            itemId: 'value_2-label',
            displayField: 'table_name',
            valueField: 'table_name',
            name:'table_list',
           
            queryMode: 'local',
            filterPickList: true,
            encodeSubmitValue: true,
            
            listeners:{

                beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            url: 'configurations/getTableslist',
                            extraParams:{
    
                                in_db:'mis'
                            }
                        }
                    },
                    isLoad: true
                }
            },
         
        },

        
    ],
    dockedItems:[
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items:[
                '->',{
                    text: 'Truncate selected table',
                    iconCls: 'x-fa fa-times',
                    action: 'truncate',
                    //table_name: 'par_age_groups',
                    storeID: 'agegroupsStr',
                    formBind: true,
                    ui: 'soft-red',
                    action_url: 'migrations/cleanTables',
                    //handler: 'doCreateConfigParamWin'
                    handler : 'truncatSelectedTables'
                }
            ]
        }
    ]


});

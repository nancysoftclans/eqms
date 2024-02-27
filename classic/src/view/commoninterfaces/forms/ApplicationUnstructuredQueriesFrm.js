/**
 */
Ext.define('Admin.view.commoninterfaces.forms.ApplicationUnstructuredQueriesFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'applicationunstructuredqueriesfrm',
    controller: 'commoninterfacesVctr',
    frame: true,
    scrollable: true,
    layout: {
        type: 'column'
    },
    bodyPadding: 5,
    defaults: {
        margin: 3,
        allowBlank: false,
        columnWidth: 1,
        labelAlign: 'top'
    },
    items: [
        {
            xtype: 'hiddenfield',
            name: 'id'
        },
        {
            xtype: 'hiddenfield',
            name: 'module_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'sub_module_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'section_id'
        },{
            xtype: 'hiddenfield',
            name: 'application_code'
        },
        {
            xtype: 'hiddenfield',
            name: 'table_name',
            value: 'tra_checklistitems_queries'
        }, {
            xtype: 'hiddenfield',
            name: 'query_id'
        },{
            xtype: 'hiddenfield',
            name: 'workflow_stage_id'
        },{
            xtype: 'hiddenfield',
            name: 'process_id'
        },{
            xtype: 'hiddenfield',
            name: 'is_structured'
        },{ 
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        },{
            xtype: 'hiddenfield',
            name: 'unset_data',
            value: 'module_id,sub_module_id,section_id,table_name,item_resp_id'
        }, {
            xtype: 'fieldcontainer',
            layout: 'column',
            defaults: {
                columnWidth: 1,
                labelAlign: 'top'
            },
            items:[{
                    xtype: 'combo', anyMatch: true,
                    fieldLabel: 'Query Checklist Item',
                    name: 'checklist_item_id',
                    forceSelection: true,
                    columnWidth: 0.8,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    allowBlank: true,
                    listeners: {
                        beforerender: {
                            fn: 'setPremiseRegCombosStore',
                            config: {
                                pageSize: 10000,
                                storeId: 'checklist_itemsstr',
                                proxy: {
                                    url: 'workflow/getChecklistQueriesApplicableChecklistItems',
                                    extraParams: {
                                        table_name: 'par_checklist_items'
                                    }
                                }
                            },
                            isLoad: false
                        },
                        afterrender: function () {
                            var form = this.up('form'),
                                store = this.getStore(),
                                module_id = form.down('hiddenfield[name=module_id]').getValue(),
                                sub_module_id = form.down('hiddenfield[name=sub_module_id]').getValue(),
                                section_id = form.down('hiddenfield[name=section_id]').getValue(),
                                query_id = form.down('hiddenfield[name=query_id]').getValue(),
                                is_structured = form.down('hiddenfield[name=is_structured]').getValue(),
                                process_id = form.down('hiddenfield[name=process_id]').getValue(),
                                application_code = form.down('hiddenfield[name=application_code]').getValue();

                            store.removeAll();
                            store.load({params: {module_id: module_id, sub_module_id: sub_module_id,section_id:section_id,application_code:application_code,query_id:query_id,process_id:process_id,is_structured:is_structured}});

                        }
                    }
                },
                {
                    xtype: 'button',
                    text: 'Query Checklist Item' ,
                    iconCls:'x-fa fa-plus',
                    columnWidth: 0.2,
                    winTitle: 'Add Query Checklist',
                    margin: '30 0 0 0',winWidth: '45%',
                    childXtype:'querychecklistitemsfrm',
                    handler:'funcAddquerychecklistitems',
                }
            ]
        },
        {
            xtype: 'htmleditor',
            fieldLabel: 'Query/Observations/Finding',
            minHeight: 300,
            name: 'query'
        },
        {
            xtype: 'textarea',
            fieldLabel: 'Comment',
            name: 'comment',
			hidden: true,
            allowBlank: true
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Application Section',
            name: 'application_section_id',
            forceSelection: true,
            queryMode: 'local',  hidden: true,
            displayField: 'name',
            valueField: 'id',
            allowBlank: true,hidden: true,
            listeners: {
                beforerender: {
                    fn: 'setParamCombosStore',
                    config: {
                        pageSize: 10000,
                        proxy: {
                            
                            extraParams: {
                                table_name: 'par_application_sections'
                            }
                        }
                    },
                    isLoad: false
                },
                afterrender: function () {
                    var form = this.up('form'),
                        store = this.getStore(),
                        module_id = form.down('hiddenfield[name=module_id]').getValue(),
                        sub_module_id = form.down('hiddenfield[name=sub_module_id]').getValue(),
                        filterObj = {module_id: module_id, sub_module_id: sub_module_id},
                        filterStr = JSON.stringify(filterObj);
                    store.removeAll();
                    store.load({params: {filters: filterStr}});
                }
            }
        },
        {
            xtype: 'combo', anyMatch: true,
            fieldLabel: 'Reference Details',
            name: 'reference_id',
            forceSelection: true,  hidden: true,
            queryMode: 'local',
            displayField: 'name',hidden: true,
            allowBlank: true,
            valueField: 'id',
            listeners: {
                beforerender: {
                    fn: 'setParamCombosStore',
                    config: {
                        pageSize: 10000,
                        proxy: {
                            
                            extraParams: {
                                table_name: 'par_query_guidelines_references'
                            }
                        }
                    },
                    isLoad: true
                }
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Reference Section',  hidden: true,
            name: 'reference_section',hidden: true,
            allowBlank: true
        },
        {
            xtype: 'htmleditor',
            fieldLabel: 'Manager Query Comment',
            name: 'manager_query_comment',
            allowBlank: true,
            hidden: true,
            readOnly: true
        },
        {
            xtype: 'htmleditor',
            fieldLabel: 'Manager Query Response Comment',
            name: 'manager_queryresp_comment',
            allowBlank: true,
            hidden: true,
            readOnly: true
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
                {
                    xtype: 'button',
                    text: 'Back',
                    ui: 'soft-blue',
                    iconCls: 'x-fa fa-backward',
                    handler: 'backToApplicationQueriesGrid'
                },
                '->',
                {
                    xtype: 'button',
                    text: 'Save Query',
                    ui: 'soft-blue',
                    iconCls: 'x-fa fa-save',
                    formBind: true,
                    reload_base:1,
                    action: 'save_query',
                    action_url: 'common/saveUnstructuredApplicationQuery',
                    handler: 'saveUnstructuredApplicationQuery'
                },
                {
                    xtype: 'button',
                    text: 'Submit Query',
                    ui: 'soft-blue',
                    iconCls: 'x-fa fa-check',
                    action: 'save_requery',
                    formBind: true,
                    reload_base:1,
                    hidden: true,
                    action_url: 'common/saveApplicationReQueryDetails',
                    handler: 'saveApplicationQuery'
                }
            ]
        }
    ]
});
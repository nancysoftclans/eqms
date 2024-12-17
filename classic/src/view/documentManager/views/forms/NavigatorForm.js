Ext.define('Admin.view.documentManager.views.forms.NavigatorForm',{
    extend: 'Ext.form.Panel',
    xtype: 'navigatorform',
    controller: 'documentsManagementvctr',
    autoScroll: true,
      bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },
    viewModel: {
        type: 'documentcreationvm'
    },
    layout: {
        type: 'column'
    },
    bodyPadding: 5,
    defaults: {
        columnWidth: 1,
        margin: 5,
        labelAlign: 'top'
    },

     
    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
       value: 'par_navigator_folders',
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: '_token',
        value: token,
        allowBlank: true
    }, {
        xtype: 'hiddenfield',
        fieldLabel: 'id',
        margin: '0 20 20 0',
        name: 'id',
        allowBlank: true
    }, {
        xtype: 'textfield',
        fieldLabel: 'Title',
        margin: '0 20 20 0',
        name: 'name',
        allowBlank: false
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Has Parent',
        margin: '0 20 20 0',
        name: 'has_parent_level',
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                       
                        extraParams: {
                            table_name: 'par_confirmations'
                        }
                    }
                   },
              isLoad: true
            },
            change: 'showHideParent'
        }
    },{
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Parent Folder',
        margin: '0 20 20 0',
        name: 'docparent_id',
        valueField: 'id',
        hidden: true,
        displayField: 'name',
        forceSelection: true,
        allowBlank: true,
        queryMode: 'local',
        listeners: {
            afterrender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 10000,
                    proxy: {
                       
                        extraParams: {
                            table_name: 'par_navigator_folders'
                        }
                     }
                },
                isLoad: true
            }
        }
    },
    {  xtype: 'checkbox',
        inputValue: 1,
        uncheckedValue: 0,
        fieldLabel: 'Is Enabled',
        margin: '0 20 20 0',
        name: 'is_enabled',
        allowBlank: true
    },{
    xtype:'fieldset',
    columnWidth: 1,
    title: "Restrict permissions",
    collapsible: true,
    defaults: {
        labelAlign: 'top',
        allowBlank: false,
        labelAlign: 'top',
        margin: 5,
        xtype: 'textfield',
        allowBlank: false,
        columnWidth: 1,
    },
    layout: 'column',
     items:[
 {
            xtype: 'combo',
            queryMode: 'local',
            forceSelection: true,
            valueField: 'id',
            margin: '0 20 20 0',
            displayField: 'name',
            fieldLabel: 'Restrict',
            name: 'has_restriction_id',
            //store: 'confirmationstr',
            listeners: {
                change: function (cmb, newVal) {
                    var form = cmb.up('form'),
                        owneruser = form.down('combo[name=navigator_owner_id]'),
                        ownergroup = form.down('combo[name=navigator_group_id]');
                    if (newVal == 1 || newVal === 1) {
                        owneruser.setVisible(true);
                        ownergroup.setVisible(true);
                    } else {
                        ownergroup.setVisible(false);
                        owneruser.setVisible(false);
                    }
                },beforerender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 1000,
                        proxy: {
                            url: 'configurations/getNonrefParameter',
                            extraParams: {
                                table_name: 'par_confirmations'
                            }
                        }
                    },
                    isLoad: true
                }
            }
            
        },{
        xtype: 'tagfield',
        fieldLabel: 'Owner User',
        margin: '0 20 20 0',
        name: 'navigator_owner_id',
        allowBlank: true,
        forceSelection: true,
        filterPickList: true,
        encodeSubmitValue: true,
        hidden: true,
        emptyText: 'Select User',
        growMax: 100,
        queryMode: 'local',
        valueField: 'id',
        displayField: 'fullname',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                        url: 'usermanagement/documentOwner',
                        extraParams: {
                            //table_name: 'par_document_extensionstypes'
                        }
                    }
                },
                isLoad: true
            }
        }
    },
    {
        xtype: 'tagfield',
        fieldLabel: 'Owner Group',
        margin: '0 20 20 0',
        name: 'navigator_group_id',
        allowBlank: true,
        forceSelection: true,
        filterPickList: true,
        encodeSubmitValue: true,
        hidden: true,
        emptyText: 'Select Group',
        growMax: 100,
        queryMode: 'local',
        valueField: 'id',
        displayField: 'name',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    pageSize: 1000,
                    proxy: {
                      //  url: 'usermanagement/documentOwner',
                        extraParams: {
                            table_name: 'par_groups'
                        }
                    }
                },
                isLoad: true
            }
        }
    }]
 },],
    dockedItems:[
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items:[
                '->',{
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'par_navigator_folders',
                    storeID: 'docdefinationrequirementstr',
                    formBind: true,
                    ui: 'soft-blue',
                    action_url: 'configurations/navigatorFolder',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});
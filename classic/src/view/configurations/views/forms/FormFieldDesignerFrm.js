Ext.define('Admin.view.configurations.views.forms.FormFieldDesignerFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'formFieldDesignerFrm',
    controller: 'configurationsvctr',
    autoScroll: true,
    layout: 'form',
    frame: true,
    bodyPadding: 8,
    defaults: {
        labelAlign: 'top',
        allowBlank: false
    },

    items: [{
        xtype: 'hiddenfield',
        margin: '0 20 20 0',
        name: 'table_name',
        value: 'par_formfield_designs',
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
        fieldLabel: 'Label',
        margin: '0 20 20 0',
        name: 'label',
        allowBlank: false
    }, {
        xtype: 'textfield',
        fieldLabel: 'Field Name',
        margin: '0 20 20 0',
        name: 'field_name',
        allowBlank: false
    }, {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Field Type',
        margin: '0 20 20 0',
        name: 'form_field_type_id',
        valueField: 'id',
        allowBlank: false,
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {

                        extraParams: {
                            table_name: 'par_form_field_types'
                        }
                    }
                },
                isLoad: true
            },
            change: function (combo, newVal, oldVal, eopts) {
                var form = combo.up('form'),
                    table = form.down('textfield[name=combo_table]'),
                    displayfield = form.down('textfield[name=displayfield]'),
                    valuefield = form.down('textfield[name=valuefield]'),
                    def_id = form.down('combobox[name=def_id]'),
                    tpl_block = form.down('textarea[name=tpl_block]'),
                    formfield = form.down('textfield[name=formfield]'),
                    optionsfield = form.down('textfield[name=options]');

                if (newVal == 6 || newVal == 7 || newVal == 9 || newVal == 10) {
                    table.setVisible(true);
                    displayfield.setVisible(true);
                    valuefield.setVisible(true);
                    def_id.setVisible(false);
                    formfield.setVisible(false);
                    tpl_block.setVisible(true);
                    optionsfield.setVisible(false);
                } else if (newVal == 8) {
                    table.setVisible(false);
                    displayfield.setVisible(true);
                    def_id.setVisible(true);
                    valuefield.setVisible(true);
                    formfield.setVisible(true);
                    tpl_block.setVisible(false);
                    optionsfield.setVisible(false);
                } else if (newVal == 12 || newVal == 13) {
                    table.setVisible(false);
                    displayfield.setVisible(false);
                    def_id.setVisible(false);
                    valuefield.setVisible(false);
                    formfield.setVisible(false);
                    tpl_block.setVisible(false);
                    optionsfield.setVisible(true);
                } else {
                    table.setVisible(false);
                    displayfield.setVisible(false);
                    def_id.setVisible(false);
                    valuefield.setVisible(false);
                    formfield.setVisible(false);
                    tpl_block.setVisible(false);
                    optionsfield.setVisible(false);
                }
            }

        }
    }, {
        xtype: 'textfield',
        fieldLabel: 'Table',
        margin: '0 20 20 0',
        name: 'combo_table',
        allowBlank: true,
        hidden: true
    }, {
        xtype: 'textfield',
        fieldLabel: 'Display Field',
        margin: '0 20 20 0',
        name: 'displayfield',
        allowBlank: true,
        hidden: true
    }, {
        xtype: 'textfield',
        fieldLabel: 'Value Field',
        margin: '0 20 20 0',
        name: 'valuefield',
        allowBlank: true,
        hidden: true
    }, {
        xtype: 'textarea',
        fieldLabel: 'TPL Block',
        margin: '0 20 20 0',
        name: 'tpl_block',
        allowBlank: true,
        hidden: true
    }, {
        xtype: 'textfield',
        fieldLabel: 'Form Field',
        margin: '0 20 20 0',
        name: 'formfield',
        allowBlank: true,
        hidden: true
    },
    {
        xtype: 'textarea',
        fieldLabel: 'Options',
        margin: '0 20 20 0',
        name: 'options',
        allowBlank: true,
        hidden: true,
        value: 'Default text here'
    },
    // {
    //     xtype: 'textfield',
    //     fieldLabel: 'Field Group(No spaces and its optional)',
    //     margin: '0 20 20 0',
    //     name: 'group',
    //     allowBlank: true
    // },{
    //     xtype: 'textfield',
    //     fieldLabel: 'Group Title (if added above)',
    //     margin: '0 20 20 0',
    //     name: 'group_title',
    //     allowBlank: true
    // },
    {
        xtype: 'combo', anyMatch: true,
        fieldLabel: 'Source Defination',
        margin: '0 20 20 0',
        name: 'def_id',
        valueField: 'id',
        allowBlank: true,
        displayField: 'param_name',
        forceSelection: true,
        queryMode: 'local',
        listeners: {
            beforerender: {
                fn: 'setCompStore',
                config: {
                    proxy: {
                        extraParams: {
                            table_name: 'par_parameter_definations'
                        }
                    }
                },
                isLoad: true
            },
        }
    }, {
        xtype: 'checkbox',
        inputValue: 1,
        uncheckedValue: 0,
        fieldLabel: 'Is Enabled',
        margin: '0 20 20 0',
        name: 'is_enabled',
        allowBlank: true
    }],
    dockedItems: [
        {
            xtype: 'toolbar',
            ui: 'footer',
            dock: 'bottom',
            items: [
                '->', {
                    text: 'Save Details',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    table_name: 'par_formfield_designs',
                    storeID: 'formDesignerStr',
                    formBind: true,
                    ui: 'soft-blue',
                    action_url: 'configurations/saveConfigCommonData',
                    handler: 'doCreateConfigParamWin'
                }
            ]
        }
    ]
});
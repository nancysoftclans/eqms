Ext.define('Admin.view.commoninterfaces.forms.ExcelImportFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'excelImportFrm',
    controller: 'commoninterfacesVctr',
    frame: true,
    layout: {
        type: 'column'
    },
    bodyPadding: 5,
    defaults: {
        margin: 5,
        columnWidth: 1,
        labelAlign: 'top',
        allowBlank: false
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
            name: 'application_code'
        },
        {
            xtype: 'hiddenfield',
            name: 'process_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'workflow_stage_id'
        },

        {
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        },
        {
            xtype: 'combo', anyMatch: true,
            name: 'upload_type_id',
            allowBlank: false,
            forceSelection: true,
            fieldLabel: 'Document Type',
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            listeners: {
                afterrender: {
                    fn: 'setCompStore',
                    config: {
                        pageSize: 100,
                        proxy: {
                            extraParams: {
                                table_name: 'par_exceluploads_config_type'
                            }
                        }
                    },
                    isLoad: true
                },
            }
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Start Column(A,B,C....)',
            name: 'start_column',
            allowBlank: false
        },
        {
            xtype: 'textarea',
            fieldLabel: 'Remarks',
            name: 'description',
            allowBlank: true
        },
        {
            xtype: 'component',
            name: 'name',
            fieldLabel: 'Remarks',
            html: '<input type="text" id="fileName" style="width: 70%;padding: 10px;margin: 8px 0px;display: inline-block;box-sizing: border-box;background: #f1f1f1;outline: 0;border-width: 0 0 2px;border-color: #4664ab;"placeholder="select file" name="uname" readonly><a href="#" style="background-color: #35BAF6;box-shadow: 0 2px 0 darkblue;color: white;padding: 10px;position: relative;width: 30%;text-decoration: none;margin: 8px 0px;"id="browseButton">Select Excel File</a>',
        }
    ],
    buttons: [{
        xtype: 'button',
        text: 'Upload',
        ui: 'soft-blue',
        iconCls: 'x-fa fa-upload',
        upload_tab: '',
        resumable: '',
        progressBar: '',
        storeID: 'excelImportGridStr',
        name: 'upload_excel_btn',
        formBind: true
    }]
});
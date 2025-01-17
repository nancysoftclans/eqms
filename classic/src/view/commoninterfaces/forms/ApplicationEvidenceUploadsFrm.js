Ext.define('Admin.view.commoninterfaces.forms.ApplicationEvidenceUploadsFrm', {
    extend: 'Ext.form.Panel',
    xtype: 'applicationEvidenceUploadsFrm',
    controller: 'commoninterfacesVctr',
    frame: true,
    layout: {
        type: 'column'
    },
    bodyPadding: 5,
    defaults: {
        margin: 5,
        columnWidth: 1,
        allowBlank: false
    },
    items: [
        {
            xtype: 'hiddenfield',
            name: 'id'
        },
        {
            xtype: 'hiddenfield',
            name: 'application_id'
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
            name: 'section_id'
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
            name: 'workflow_stage_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'document_type_id'
        },{
            xtype: 'hiddenfield',
            name: 'prodclass_category_id'
        },{
            xtype: 'hiddenfield',
            name: 'importexport_permittype_id'
        },{
            xtype: 'hiddenfield',
            name: 'premise_type_id'
        },
        
        {
            xtype: 'hiddenfield',
            name: 'query_ref_id'
        },
        {
            xtype: 'hiddenfield',
            name: 'node_ref'
        },
        {
            xtype: 'hiddenfield',
            name: '_token',
            value: token
        },
        {
        xtype: 'hiddenfield',
        fieldLabel: 'checklist_item_id',
        margin: '0 20 20 0',
        name: 'checklist_item_id',
        allowBlank: true
        },
        {
            xtype: 'combo', anyMatch: true,
            name: 'doctype_id',
            hidden: true,
            allowBlank: true,
            forceSelection: true,
            fieldLabel: 'Document Type',
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            listeners: {
                afterrender: {
                    fn: 'setConfigCombosSectionfilterStore',
                    config: {
                        pageSize: 10000,
                        proxy: {
                            url: 'documentmanagement/getProcessApplicableDocTypes'
                        }
                    },
                    isLoad: true
                },
                change: function (cmbo, newVal, oldVal) {
                    var form = cmbo.up('form'),
                        section_id = form.down('hiddenfield[name=section_id]').getValue(),
                        module_id = form.down('hiddenfield[name=module_id]').getValue(),
                        sub_module_id = form.down('hiddenfield[name=sub_module_id]').getValue(),
                        prodclass_category_id = form.down('hiddenfield[name=prodclass_category_id]').getValue(),
                        premise_type_id = form.down('hiddenfield[name=premise_type_id]').getValue(),
                        process_id = form.down('hiddenfield[name=process_id]').getValue(),
                        importexport_permittype_id = form.down('hiddenfield[name=importexport_permittype_id]').getValue(),
                        docReqFld = form.down('combo[name=document_requirement_id]'),
                        docReqStr = docReqFld.getStore(),
                        assessment_start_date = form.down('datefield[name=assessment_start_date]'),
                        assessment_end_date = form.down('datefield[name=assessment_end_date]'),
                        assessment_by = form.down('combo[name=assessment_by]'),
                        selected_record = cmbo.getSelectedRecord();
                    if(selected_record.get('is_assessment_doc') == 1){
                        assessment_start_date.setVisible(true);
                        assessment_end_date.setVisible(true);
                        assessment_start_date.allowBlank = false;
                        assessment_end_date.allowBlank = false;
                        assessment_by.allowBlank = false;
                        assessment_end_date.validateValue(assessment_end_date.getValue());
                        assessment_start_date.validateValue(assessment_start_date.getValue());
                        assessment_by.validateValue(assessment_by.getValue());
                    }
                    docReqStr.removeAll();
                    docReqStr.load({
                        params: {
                            docType_id: newVal,
                            section_id: section_id,
                            module_id: module_id,
                            prodclass_category_id:prodclass_category_id,
                            premise_type_id:premise_type_id,
                            process_id: process_id,
                            importexport_permittype_id:importexport_permittype_id,
                            sub_module_id: sub_module_id
                        }
                    });
                }
            }
        },
        {
            xtype: 'combo', anyMatch: true,
            name: 'document_requirement_id',
            allowBlank: true,
            hidden: true,
            forceSelection: true,
            fieldLabel: 'Document Requirement',
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            listeners: {
                afterrender: {
                    fn: 'setConfigCombosSectionfilterStore',
                    config: {
                        pageSize: 10000,
                        storeId: 'document_requirementsStr',
                        proxy: {
                            url: 'documentmanagement/getProcessApplicableDocRequirements'
                        }
                    },
                    isLoad: false
                }
            }
        },
        // {
        //     xtype: 'combo', anyMatch: true,
        //     queryMode: 'local',
        //     forceSelection: true,
        //     allowBlank: true,
        //     hidden: true,
        //     valueField: 'id',
        //     value: user_id,
        //     displayField: 'name',
        //     fieldLabel: 'Uploaded/Report Prepared By',
        //     name: 'assessment_by',
        //     listeners: {
        //         beforerender: {
        //             fn: 'setConfigCombosStore',
        //             config: {
        //                 pageSize: 100,
        //                 proxy: {
        //                     url: 'usermanagement/getUserList',
        //                 }
        //             },
        //             isLoad: true
        //         }
        //     }
        // },
        {
            xtype: 'datefield',
            name: 'assessment_start_date',
            format: 'Y-m-d H:i:s',
            altFormats: 'Y-m-d H:i:s|Y-m-d',
            fieldLabel: 'Assessment Start Date',
            allowBlank: true,
            hidden: true
        },{
            xtype: 'datefield',
            name: 'assessment_end_date',
            format: 'Y-m-d H:i:s',
            altFormats: 'Y-m-d H:i:s|Y-m-d',
            fieldLabel: 'Assessment End Date',
            allowBlank: true,
            hidden: true
        },
        // {
        //     xtype: 'filefield',
        //     fieldLabel: 'File/Document',
        //     allowBlank: false,
        //     name: 'uploaded_doc'
        // },


     {
    xtype: 'component',
    fieldLabel: 'File Name',
    allowBlank: false,
    name: 'name',
    html: `
        <div style="
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
        ">
            <div style="
                position: relative;
                width: 100%;
            ">
                <input type="text" id="fileName" style="
                    width: 100%;
                    padding: 10px 10px 10px 120px; 
                    margin: 8px 0;
                    box-sizing: border-box;
                    background: #f1f1f1;
                    border: none;
                    border-bottom: 2px solid #4664ab;
                    display: block;
                " placeholder="" name="uname" readonly>
                <span style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%; /* Match the height of the input field */
                    width: 120px; /* Width should match the padding adjustment */
                    background: #f1f1f1; /* Dark grey background */
                    color: #333;
                    padding: 10px;
                    box-sizing: border-box;
                    font-size: 12px;
                    line-height: 1; /* Ensures the text is vertically centered */
                    display: flex;
                    align-items: center; /* Center text vertically */
                    justify-content: center; /* Center text horizontally */
                    text-align: center;
                    border-top-left-radius: 5px; /* Optional: rounded corners */
                    border-bottom-left-radius: 5px; /* Optional: rounded corners */
                ">
                    File Name
                </span>
            </div>
            <a href="#" style="
                background-color: #35BAF6;
                box-shadow: 0 2px 0 darkblue;
                color: white;
                padding: 10px;
                text-decoration: none;
                margin: 8px 0;
                display: block;
                text-align: center;
                width: 100%;
                box-sizing: border-box;
            " id="browseButton">Select file</a>
        </div>
    `,
    style: {
        display: 'block'
    }
}






// {
//     xtype: 'component',
//     fieldLabel: 'File Name',
//     allowBlank: false,
//     name: 'name',
//     html: `
//         <div style="
//             display: flex;
//             flex-direction: column;
//             width: 100%;
//         ">
//             <input type="text" id="fileName" style="
//                 width: 100%;
//                 padding: 10px;
//                 margin: 8px 0;
//                 box-sizing: border-box;
//                 background: #f1f1f1;
//                 border: none;
//                 border-bottom: 2px solid #4664ab;
//                 display: block;
//             " placeholder="Select file" name="uname" readonly>
//             <a href="#" style="
//                 background-color: #35BAF6;
//                 box-shadow: 0 2px 0 darkblue;
//                 color: white;
//                 padding: 10px;
//                 text-decoration: none;
//                 margin: 8px 0;
//                 display: block;
//                 text-align: center;
//                 width: 100%; /* Full width */
//                 box-sizing: border-box;
//             " id="browseButton">Select files</a>
//         </div>
//     `,
//     style: {
//         display: 'block'
//     }
// }


        // {
        //     xtype: 'component',
        //     fieldLabel: 'File Name',
        //     allowBlank: false,
        //     name: 'name',
        //     html: '<input type="text" id="fileName" style="width: 70%;padding: 10px;margin: 8px 0px;display: inline-block;box-sizing: border-box;background: #f1f1f1;outline: 0;border-width: 0 0 2px;border-color: #4664ab;"placeholder="select file" name="uname" readonly><a href="#" style="background-color: #35BAF6;box-shadow: 0 2px 0 darkblue;color: white;padding: 10px;position: relative;width: 30%;text-decoration: none;margin: 8px 0px;"id="browseButton">Select files</a>',
        // }
    ],
    buttons: [{
        xtype: 'button',
        text: 'Upload',
        ui: 'soft-blue',
        iconCls: 'x-fa fa-upload',
        name: 'upload_evidence_btn',
        upload_tab: '',
        resumable: '',
        progressBar: '',
        storeID: 'applicationDocumentsUploadsStr',
        formBind: true
    }]
});
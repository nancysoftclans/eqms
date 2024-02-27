Ext.define('Admin.view.frontoffice.adr.grids.SpreadSheetMirVisibleColumnsFrm', {
    extend: 'Ext.form.Panel',  
    width: '100%',
    xtype: 'spreadsheetMirVisibleColumnsFrm',
    title: 'Select Visible Columns',
    height: '100%',
    layout: 'form',
        margin: 2,
        collapsible: true,
        autoScroll: true,
        defaults: {
            xtype: 'checkbox',
            labelAlign: 'right',
          //  width: 170,
            margin: 5,
            labelSeparator: ':',
            hideLabel: false
        },
              items:[ {
                        boxLabel: 'Tracking No',
                        name: 25,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reference No',
                        name: 26,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    }, {
                        boxLabel: 'Patient weight',
                        name: 2,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Patient age',
                        name: 3,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Infant age',
                        name: 4,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Allergies',
                        name: 5,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Pregnant Status',
                        name: 6,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Smoking Status',
                        name: 7,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Use of alcohol status',
                        name: 8,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Breastfeeding status',
                        name: 9,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Patient Gender',
                        name: 10,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Request Mode',
                        name: 11,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Response Mode',
                        name: 12,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },
                    {
                        boxLabel: 'Enquiry Reasons',
                        name: 13,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'References Consulted',
                        name: 14,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Enquiry',
                        name: 15,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Enquirer Response',
                        name: 16,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Applicant',
                        name: 17,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Applicant Postal Address',
                        name: 18,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Applicant Physical Address',
                        name: 19,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Applicant Telephone',
                        name: 20,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Applicant Mobile No',
                        name: 21,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Applicant Email',
                        name: 22,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Applicant Country',
                        name: 23,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Applicant Region',
                        name: 24,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    }
                    ]
});
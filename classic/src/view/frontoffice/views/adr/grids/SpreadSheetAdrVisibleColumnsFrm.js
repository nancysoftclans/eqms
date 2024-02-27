Ext.define('Admin.view.frontoffice.adr.grids.SpreadSheetAdrVisibleColumnsFrm', {
    extend: 'Ext.form.Panel',  
    width: '100%',
    xtype: 'spreadsheetadrvisiblecolumns',
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
                        name: 20,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reference No',
                        name: 21,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    }, {
                        boxLabel: 'Patient name',
                        name: 2,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Patient weight',
                        name: 3,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Patient Age',
                        name: 4,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Gender',
                        name: 5,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Adr Type',
                        name: 6,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reaction start date',
                        name: 7,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Adverse event',
                        name: 8,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Treatment',
                        name: 9,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Rechallenge outcome',
                        name: 10,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Adr Seriousness',
                        name: 11,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reporter',
                        name: 12,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reporter Postal Address',
                        name: 13,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reporter Physical Address',
                        name: 14,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reporter Telephone',
                        name: 15,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reporter Mobile No',
                        name: 16,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reporter Email',
                        name: 17,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reporter Country',
                        name: 18,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reporter Region',
                        name: 19,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    }
                    ]
});
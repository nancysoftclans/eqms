Ext.define('Admin.view.frontoffice.rmu.forms.RmuVisibleColumnsFrm', {
    extend: 'Ext.form.Panel',  
    width: '100%',
    xtype: 'rmuVisibleColumnsFrm',
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
                        name: 10,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Reference No',
                        name: 11,
                        checked: true,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    }, 
                   {
                        boxLabel: 'submission category',
                        name: 2,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Remarks',
                        name: 3,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Department',
                        name: 4,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Agency',
                        name: 5,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Creater Reference',
                        name: 6,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'File Name',
                        name: 7,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Record Group',
                        name: 8,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    },{
                        boxLabel: 'Previous Quote',
                        name: 9,
                        checked: false,
                        listeners: {
                            change: 'func_showhideSpreasheetColumn'
                        }
                    }
                    
                    ]
});
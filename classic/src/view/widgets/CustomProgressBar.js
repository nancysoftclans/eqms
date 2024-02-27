Ext.define('Admin.view.widgets.CustomProgressBar', {
    extend: 'Ext.Progress',
    alias: 'widget.customprogressbar',
 
    minGradient: null,
    midGradient: null,
    maxGradient: null,
 
    getColorGradient: function(percentage) {
        let beginColor = this.minGradient;
        let midColor = this.midGradient;
        let endColor = this.maxGradient;
        let fade = percentage;
 
        // If gradient between three colors, adjust fade
        if (endColor) {
            fade *= 2;
 
            // Find interval and adjust fade
            if (fade >= 1) {
                fade -= 1;
                beginColor = this.midGradient;
                midColor = this.maxGradient;
            }
        }
 
        const redDelta = midColor.red - beginColor.red;
        const greenDelta = midColor.green - beginColor.green;
        const blueDelta = midColor.blue - beginColor.blue;
 
        const gradient = {
            red: parseInt(Math.floor(beginColor.red + (redDelta * fade)), 10),
            green: parseInt(Math.floor(beginColor.green + (greenDelta * fade)), 10),
            blue: parseInt(Math.floor(beginColor.blue + (blueDelta * fade)), 10)
        };
 
        return this.rgbToHex(gradient.red, gradient.green, gradient.blue);
    },
 
    onRender: function () {
        const me = this;
        me.width = 300;
        me.margin = '5 5 0 5',
            me.callParent(arguments);
    },
 
    setValue: function (newVal) {
        this.callParent([newVal]);
        this.updateColor(this, newVal);
    },
 
    colorValueToHex: colorValue => {
        const hex = colorValue.toString(16);
        return hex.length == 1 ? `0${hex}` : hex;
    },
 
    rgbToHex: function (r, g, b) {
        const hexRed = this.colorValueToHex(r);
        const hexGreen = this.colorValueToHex(g);
        const hexBlue = this.colorValueToHex(b);
 
        return `#${hexRed}${hexGreen}${hexBlue}`;
    },
 
    updateColor: function (obj, val) {
        if (!obj.el) {
            return;
        }
 
        const newColor = this.getColorGradient(val);
 
        obj.el.child(".x-progress-bar", true).style.backgroundColor = newColor;
        obj.el.child(".x-progress-bar", true).style.borderRightColor = newColor;
        obj.el.child(".x-progress-bar", true).style.backgroundImage = "url('')";
    }
});
 
// Ext.define('MyViewModel', {
//     extend: 'Ext.app.ViewModel',
//     alias: 'viewmodel.myvm',
//     data: {
//         progress: .6
//     }
// });
 
// Ext.define('MyPanel', {
//     extend: 'Ext.panel.Panel',
//     xtype: 'mypanel',
//     items: [{
//         xtype: 'customprogressbar',
//         minGradient: {red: 255, green: 0, blue: 0},
//         midGradient: {red: 255, green: 255, blue: 0},
//         maxGradient: {red: 0, green: 255, blue: 0},
//         height: 10,
//         bind: {
//             value: '{progress}'
//         }
//     }, {
//         xtype: 'button',
//         text: '-',
//         handler: function () {
//             const vm = Ext.ComponentQuery
//                 .query('#mainContainer')[0]
//                 .getViewModel();
 
//             let val = vm.get('progress')
//             val = val - .05;
//             val = val < 0 ? 0 : val;
//             vm.set('progress', val);
//         }
//     }, {
//         xtype: 'button',
//         text: '+',
//         handler: function () {
//             const vm = Ext.ComponentQuery
//                 .query('#mainContainer')[0]
//                 .getViewModel();
 
//             let val = vm.get('progress')
//             val = val + .05;
//             val = val > 1 ? 1 : val;
//             vm.set('progress', val);
//         }
//     }, {
//         xtype: 'button',
//         iconCls: 'x-fa fa-play',
//         handler: function() {
//             const vm = Ext.ComponentQuery
//                 .query('#mainContainer')[0]
//                 .getViewModel();
 
//             const bar = Ext.ComponentQuery.query('customprogressbar')[0];
 
//             vm.set('progress', 0);
 
//             let intervalId;
//             let playAnim = function() {
//                 if (bar.getValue() >= 1) {
//                     clearInterval(intervalId);
//                     return;
//                 }
 
//                 vm.set('progress', vm.get('progress') + .01);
//             };
 
//             intervalId = setInterval(playAnim, 10);
//         }
//     }]
// });
 
// Ext.application({
//     name: 'Fiddle',
 
//     launch: function () {
//         Ext.create('Ext.container.Container', {
//             renderTo: Ext.getBody(),
//             itemId: 'mainContainer',
//             width: '100%',
//             height: 500,
//             top: 0,
//             padding: 50,
//             viewModel: {
//                 type: 'myvm'
//             },
//             items: [{
//                 xtype: 'mypanel'
//             }]
//         })
//     }
// });
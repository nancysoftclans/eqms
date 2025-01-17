Ext.define('Admin.view.main.Main', {
    extend: 'Ext.container.Viewport',
    xtype: 'main-app',
    requires: [
        'Ext.button.Segmented',
        'Ext.list.Tree',
        'Ext.ux.TabReorderer',
        'Ext.ux.TabCloseMenu'
    ],

    controller: 'main',
    viewModel: 'main',

    cls: 'sencha-dash-viewport',
    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
       render: 'onMainViewRender'
    },
//<img src="resources/images/favicon.ico">
    items: [
        {
            xtype: 'toolbar',
            cls: 'sencha-dash-dash-headerbar shadow',
            height: 64,
            itemId: 'headerBar',
            items: [
                {
                    xtype: 'component',
                    reference: 'mainLogo',
                    cls: 'sencha-logo',
                    html: '<div class="main-logo">eQMS</div>',
                    width: 250
                },
                {
                    margin: '0 0 0 8',
                    ui: 'header',
                    iconCls:'x-fa fa-bars',
                    id: 'main-navigation-btn',
                    handler: 'onToggleNavigationSize'
                },
                '->',
                // {
                //     xtype: 'displayfield',
                //     name: 'lastlogin',
                //     value: 'Last Login:'+ last_login,
                //     fieldStyle: {
                //         'color': '#35baf6',
                //         'font-weight': 'bold',
                //         'font-size': '15px'
                //     },
                //     margin: '0 15 10 10',
            
                // },
                // {
                //     iconCls: 'x-fa fa-edit',
                //     xtype: 'badgebutton',
                //     tooltip: 'Notifications',
                //     name: 'tcmeeting_btn',
                //     badgeText: 12,
                //     //text:' Scheduled Technical Meeting ('+ scheduledtcmeeting_counter +')',
                //     itemId: 'tcmeeting_btn',
                //     bind: {
                //         text: "Scheduled Technical Meeting <span class=\"noti noti_bubble_insp\" style=\"width: 100%\">{meetings}</span>"
                //         // Scheduled Technical Meeting ({meetings})',
                //     },
                //     ui: 'soft-blue',
                //     handler: 'funcViewScheduledTcMeetingDetails',
                // },

                {
                    xtype: 'component',
                    html: `
                        <div style="display: flex; align-items: center; position: relative;">
                            <input type="checkbox" id="enableNotification" style="display:none;" ${is_notification_enabled ? 'checked' : ''}>
                            <label for="enableNotification" style="position: relative; display: inline-block; width: 34px; height: 20px;">
                                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${is_notification_enabled ? '#2196F3' : '#ccc'}; transition: .4s; border-radius: 20px;"></span>
                                <span style="position: absolute; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; ${is_notification_enabled ? 'transform: translateX(14px);' : ''}"></span>
                            </label>
                            <span style="margin-left: 10px;">Notifications</span>
                            <span id="notificationTooltip" class="x-fa fa-info-circle" style="position: absolute; right: -20px; top: 50%; transform: translateY(-50%); cursor: pointer;"></span>
                        </div>
                    `,
                    listeners: {
                        afterrender: function () {
                            var checkbox = document.getElementById('enableNotification');
                            var slider = checkbox.nextElementSibling;

                            checkbox.addEventListener('change', function () {
                                var isEnabled = checkbox.checked;

                                if (isEnabled) {
                                    slider.firstElementChild.style.backgroundColor = '#2196F3';
                                    slider.lastElementChild.style.transform = 'translateX(14px)';
                                } else {
                                    slider.firstElementChild.style.backgroundColor = '#ccc';
                                    slider.lastElementChild.style.transform = 'none';
                                }

                                // Make AJAX call
                                Ext.Ajax.request({
                                    url: 'updateNotificationEnabled',
                                    params: {
                                        is_enabled: isEnabled,
                                        _token:token,
                                    },
                                    headers: {
                                        'Authorization': 'Bearer ' + access_token
                                    },
                                    success: function(response) {
                                        var resp = Ext.JSON.decode(response.responseText);
                                        if (resp.success == true || resp.success === true) {
                                           toastr.success(resp.message, 'Success');
                                        } else {
                                            toastr.error(resp.message, 'Error');
                                        }
                                    },
                                    failure: function(response) {
                                        toastr.error('Failed to update notification setting.', 'Error');
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        toastr.error('Error: ' + errorThrown, 'Error Response');
                                    }
                                });
                            });

                            // Create the tooltip
                            Ext.create('Ext.tip.ToolTip', {
                                target: 'notificationTooltip',
                                //width: 350,
                                html: 'Turn on "Notifications" option to receive real-time notifications when assigned new tasks. Turn it off right now if you do not want to receive notifications anymore.'
                            });
                        }
                    }
                },{
                     xtype: 'tbspacer',
                     width: 15
                  },
                {
                    iconCls: 'x-fa fa-bell',
                    xtype: 'badgebutton',
                    tooltip: 'Notifications',
                    name: 'notifications_btn',
                    badgeText: 13,
                    bind: {
                        text: ' Notifications <span class=\"noti noti_bubble_insp\" style=\"width: 100%\">{notifications}</span>',
                    },
                    //text:' Notifications ('+ notifications_counter +')', 
                    ui: 'soft-blue',
                    itemId: 'notifications_btn',
                    handler: 'funcViewNotifications'
                    
                },
                {
                    xtype: 'splitbutton',
                    cls: 'header-right-profile-image',
                    ui: 'soft-blue',
                    iconCls: 'x-fa fa-user',
                    text: (fullnames) ? fullnames : 'login',
                    menu: [{
                        text: 'Change Password',
                        iconCls: 'x-fa fa-unlock-alt',
                        handler: 'onChangePasswordClick'

                    },
                    {
                        text: 'Edit Profile',
                        iconCls: 'fa fa-user',
                        handler: 'onEditProfileClick'

                    }, {
                        text: 'Log Out',
                        iconCls: 'fa fa-power-off',
                        handler: 'Logout'
                    }]
                }
                // {
                //     xtype: 'image',
                //     cls: 'header-right-profile-image',
                //     height: 35,
                //     width: 35,
                //     src: profile_pic_url
                // }
            ]
        },
        {
            xtype: 'maincontainerwrap',
            id: 'main-view-detail-wrap',
            reference: 'mainContainerWrap',
            ui:'container-navigation',
            items: [
            {
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                autoScroll: true,
                scrollable: true,
                reference: 'treelistContainer',
                height: Ext.Element.getViewportHeight() - 64,
                bodyStyle: "background-color:#32404E;",
                items: [

                {
                    xtype: 'treelist',
                    reference: 'navigationTreeList',
                    itemId: 'navigationTreeList',
                    ui: 'navigation',
                    store: 'navigationstr',
                    width: 250,
                    autoScroll: true,
                    scrollable: true,
                    expanderFirst: false,
                    expanderOnly: false,
                    singleExpand: true,
                    indent: 0,
                    listeners: {
                        afterRender:function(treelist){
                            treelist.setIndent(0);

                        },
                        selectionchange: 'onNavigationTreeSelectionChange'
                    }
                } ]
            },
                {
                split: true,
                xtype: 'tabpanel',
                flex: 1,
                height: Ext.Element.getViewportHeight() - 64,
                reference: 'mainCardPanel',
                cls: 'sencha-dash-right-main-container',
                itemId: 'contentPanel',
                plugins: [{
                    ptype: 'tabreorderer'
                }, {
                    ptype: 'tabclosemenu'
                }
                ],
                layout: {
                    type: 'card',
                    anchor: '100%'
                },
                autoScroll: true,
                listeners: {
                    beforetabchange: 'beforeTabChange',
                    beforeadd: function (tp, c, index) {
                        if (tp.items.length >= 8) {
                            Ext.Msg.alert('Many Tabs Opened Warning', 'You have opened many tabs, this can easily confuse you. Please close some of the unused tabs!!');
                        }
                    }
                },
                items: [{
                    title: 'Dashboard',
                    xtype: system_dashboard,
                    routeId: system_dashboard,
                    viewType: system_dashboard,
                    menu_id: 1,
                    reorderable: false
                }]
            }
            ]
        }
    ]
});

Ext.define("Admin.view.main.MainController", {
  extend: "Ext.app.ViewController",
  alias: "controller.main",

  listen: {
    controller: {
      "#": {
        unmatchedroute: "onRouteChange",
      },
    },
  },

  routes: {
    ":node": "onRouteChange",
  },

  lastView: null,

  setCurrentView: function (hashTag) {
    hashTag = (hashTag || "").toLowerCase();
    var me = this,
      refs = me.getReferences(),
      mainCard = refs.mainCardPanel,
      mainLayout = mainCard.getLayout(),
      navigationList = refs.navigationTreeList,
      store = navigationList.getStore(),
      node =
        store.findNode("routeId", hashTag) ||
        store.findNode("viewType", hashTag);
    if (node == null) {
      store.on("load", function (th, records, success, eOpts) {
        //callback : function() {}
        var store = navigationList.getStore();
        node =
          store.findNode("routeId", hashTag) ||
          store.findNode("viewType", hashTag);
        me.setCurrentPage(
          node,
          store,
          me,
          hashTag,
          navigationList,
          mainCard,
          mainLayout
        );
      });
    } else {
      //function call
      me.setCurrentPage(
        node,
        store,
        me,
        hashTag,
        navigationList,
        mainCard,
        mainLayout
      );
    }
  },
  setCurrentPage: function (
    node,
    store,
    me,
    hashTag,
    navigationList,
    mainCard,
    mainLayout
  ) {
    //  console.log(node.get('viewType'));
    if (node) {
      var view = (node && node.get("viewType")) || "page404",
        title = node.get("tab_title"),
        module_name = node.get("module_name"),
        menu_id = node.get("menu_id"),
        access_level = node.get("access_level"),
        viewType = node.get("viewType"),
        lastView = me.lastView,
        existingItem = mainCard.child("component[routeId=" + hashTag + "]"),
        newView;
      // Kill any previously routed window
      if (lastView && lastView.isWindow) {
        lastView.destroy();
      }
      lastView = mainLayout.getActiveItem();
      if (!existingItem) {
        newView = Ext.create({
          xtype: view,
          title: title,
          menu_id: menu_id,
          access_level: access_level,
          closable: true,
          routeId: hashTag, // for existingItem search later
          viewType: viewType,
          viewModel: "main",
          hideMode: "offsets",
        });
        // console.log(newView);
      }
      newView;
      if (!newView || !newView.isWindow) {
        // !newView means we have an existing view, but if the newView isWindow
        // we don't add it to the card layout.
        if (existingItem) {
          // We don't have a newView, so activate the existing view.
          if (existingItem !== lastView) {
            mainLayout.setActiveItem(existingItem);
          }
          newView = existingItem;
        } else {
          // newView is set (did not exist already), so add it and make it the
          // activeItem.
          Ext.suspendLayouts();
          mainLayout.setActiveItem(mainCard.add(newView));
          Ext.resumeLayouts(true);
        }
      }

      navigationList.setSelection(node);

      if (newView.isFocusable(true)) {
        newView.focus();
      }
      me.lastView = newView;
    }

    // me.lookupReference('active_tab_display_ref').setValue(module_name);
    //set view model and default access level
    //me.setBindingModelAccessValue(newView);
  },

  //         console.log(node);
  //         var view = (node && node.get('viewType')) || 'page404',
  //         lastView = me.lastView,
  //         existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
  //         newView;

  //     // Kill any previously routed window
  //     if (lastView && lastView.isWindow) {
  //         lastView.destroy();
  //     }

  //     lastView = mainLayout.getActiveItem();

  //     if (!existingItem) {
  //         newView = Ext.create({
  //             xtype: view,
  //             routeId: hashTag,  // for existingItem search later
  //             hideMode: 'offsets'
  //         });
  //     }

  //     if (!newView || !newView.isWindow) {
  //         // !newView means we have an existing view, but if the newView isWindow
  //         // we don't add it to the card layout.
  //         if (existingItem) {
  //             // We don't have a newView, so activate the existing view.
  //             if (existingItem !== lastView) {
  //                 mainLayout.setActiveItem(existingItem);
  //             }
  //             newView = existingItem;
  //         }
  //         else {
  //             // newView is set (did not exist already), so add it and make it the
  //             // activeItem.
  //             Ext.suspendLayouts();
  //             mainLayout.setActiveItem(mainCard.add(newView));
  //             Ext.resumeLayouts(true);
  //         }
  //     }

  //     navigationList.setSelection(node);

  //     if (newView.isFocusable(true)) {
  //         newView.focus();
  //     }

  //     me.lastView = newView;
  // },

  onNavigationTreeSelectionChange: function (tree, node) {
    if (node.get("parameter_id")) {
      this.fireEvent("renderParameterMenu", node.get("parameter_id"));
      return false;
    }
    var to = node && (node.get("routeId") || node.get("viewType"));
    if (to) {
      this.redirectTo(to);
    }
  },

  onToggleNavigationSize: function () {
    var me = this,
      refs = me.getReferences(),
      navigationList = refs.navigationTreeList,
      treeContainer = refs.treelistContainer,
      wrapContainer = refs.mainContainerWrap,
      collapsing = !navigationList.getMicro(),
      new_width = collapsing ? 64 : 250;
    if (Ext.isIE9m || !Ext.os.is.Desktop) {
      Ext.suspendLayouts();
      refs.mainLogo.setWidth(new_width);
      //navigationList.setWidth(new_width);
      //navigationList.setMicro(collapsing);

      treeContainer.setWidth(new_width);
      treeContainer.setMicro(collapsing);

      Ext.resumeLayouts(); // do not flush the layout here...

      // No animation for IE9 or lower...
      wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
      wrapContainer.updateLayout(); // ... since this will flush them
    } else {
      if (!collapsing) {
        // If we are leaving micro mode (expanding), we do that first so that the
        // text of the items in the navlist will be revealed by the animation.
        // navigationList.setMicro(false);
        navigationList.setMicro(false);
      }
      navigationList.canMeasure = false;
      //treeContainer.canMeasure = false;

      // Start this layout first since it does not require a layout
      refs.mainLogo.animate({ dynamic: true, to: { width: new_width } });

      // Directly adjust the width config and then run the main wrap container layout
      // as the root layout (it and its children). This will cause the adjusted size to
      // be flushed to the element and animate to that new size.
      //navigationList.width = new_width;
      treeContainer.width = new_width;
      wrapContainer.updateLayout({ isRoot: true });
      treeContainer.el.addCls("nav-tree-animating");
      // navigationList.el.addCls('nav-tree-animating');

      // We need to switch to micro mode on the navlist *after* the animation (this
      // allows the "sweep" to leave the item text in place until it is no longer
      // visible.
      if (collapsing) {
        treeContainer.on({
          afterlayoutanimation: function () {
            navigationList.setMicro(true);
            navigationList.el.removeCls("nav-tree-animating");
            navigationList.canMeasure = true;
          },
          single: true,
        });
      }
    }
  },

  onMainViewRender: function () {
    // if (!window.location.hash) {
    //     this.redirectTo(system_dashboard);
    // }
    // this.redirectTo("dashboard", true);
    //console.log(window.location.hash);

    var me = this;
    if (prevhash == "") {
      if (!window.location.hash) {
        this.redirectTo(system_dashboard);
      }
    } else {
      // Parse the fragment parameters into an object
      var params = Ext.Object.fromQueryString(prevhash);
      // Access individual parameter values
      if (params.tracking_no) {
        tracking_no = params.tracking_no;
      }
      setTimeout(function () {
        me.redirectTo("" + prevhash);
      }, 300);
    }

    //remove loader
    const elements = document.getElementsByClassName("loader");
    while (elements.length > 0) elements[0].remove();
  },

  onRouteChange: function (id) {
    this.setCurrentView(id);
  },

  onSearchRouteChange: function () {
    this.setCurrentView("searchresults");
  },

  onSwitchToModern: function () {
    Ext.Msg.confirm(
      "Switch to Modern",
      "Are you sure you want to switch toolkits?",
      this.onSwitchToModernConfirmed,
      this
    );
  },

  onSwitchToModernConfirmed: function (choice) {
    if (choice === "yes") {
      var s = window.location.search;

      // Strip "?classic" or "&classic" with optionally more "&foo" tokens
      // following and ensure we don't start with "?".
      s = s.replace(/(^\?|&)classic($|&)/, "").replace(/^\?/, "");

      // Add "?modern&" before the remaining tokens and strip & if there are
      // none.
      window.location.search = ("?modern&" + s).replace(/&$/, "");
    }
  },

  onEmailRouteChange: function () {
    this.setCurrentView("email");
  },
  onChangePasswordClick: function () {
    var me = this,
      win = Ext.widget("passwordchangewin");
    win.show();
  },
  onEditProfileClick: function (btn) {
    // this.setCurrentView('usereditinfofrm');
    var me = this,
      // user_id = record.get('id'),
      form = Ext.widget("usereditinfofrm");

    funcShowCustomizableWindow(
      "Edit Personal Details",
      "40%",
      form,
      "customizablewindow",
      btn
    );
  },
  //

  funcViewScheduledTcMeetingDetails: function () {
    this.setCurrentView("viewscheduledtcmeetings");
  },
  // funcViewNotifications: function (btn) {
  //   this.fireEvent('viewnotifications');
  // },
  funcViewNotifications: function (btn) {
    this.setCurrentView("directMessagePnl");
    //this.fireEvent('directMessagePnl');
  },
  setGridStore: function (me, options) {
    // console.log(me);
    var config = options.config,
      isLoad = options.isLoad,
      toolbar = me.down("pagingtoolbar"),
      store = Ext.create("Admin.store.abstract.AbstractStore", config);
    me.setStore(store);
    toolbar.setStore(store);
    if (isLoad === true || isLoad == true) {
      store.removeAll();
      store.load();
    }
  },
  setGridTreeStore: function (me, options) {
    var config = options.config,
      isLoad = options.isLoad,
      toolbar = me.down("pagingtoolbar"),
      store = Ext.create("Admin.store.abstract.AbstractTreeStr", config);
    me.setStore(store);
    toolbar.setStore(store);
    if (isLoad === true || isLoad == true) {
      store.removeAll();
      store.load();
    }
  },
  Logout: function () {
    Ext.Ajax.request({
      url: base_url + "auth/logout",
      method: "POST",
      params: {
        _token: token,
      },
      // headers: {
      //     'Authorization': 'Bearer ' + access_token,
      // },
      success: function (response) {
        Ext.getBody().unmask();
        var resp = Ext.JSON.decode(response.responseText),
          message = resp.message,
          success = resp.success;
        if (success == true || success === true) {
          toastr.success(message, "Success Response");
          setTimeout(function () {
            location.reload();
          }, 100);
        } else {
          toastr.error(message, "Failure Response");
        }
      },
      failure: function (response) {
        Ext.getBody().unmask();
        var resp = Ext.JSON.decode(response.responseText),
          message = resp.message;
        toastr.error(message, "Failure Response");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        Ext.getBody().unmask();
        toastr.error("Error deleting data: " + errorThrown, "Error Response");
      },
    });
  },
  beforeTabChange: function (tabPnl, newTab, oldTab) {
    var me = this,
      menuId = newTab.menu_id,
      routeId = newTab.routeId,
      viewType = newTab.viewType;
    if (viewType) {
      this.redirectTo(viewType);
    }
  },
});

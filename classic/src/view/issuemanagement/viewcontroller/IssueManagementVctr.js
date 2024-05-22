Ext.define("Admin.view.issuemanagement.viewcontroller.IssueManagementVctr", {
  extend: "Ext.app.ViewController",
  alias: "controller.issuemanagementvctr",

  init: function () {},

  setWorkflowCombosStore: function (obj, options) {
    this.fireEvent("setWorkflowCombosStore", obj, options);
  },
  setCompStore: function (obj, options) {
    this.fireEvent("setCompStore", obj, options);
  },

  showNewIssueApplication: function (btn) {
    var application_type = btn.app_type,
      wrapper_xtype = btn.wrapper_xtype;
    this.fireEvent("onNewIssueApplication", application_type, wrapper_xtype);
  },

  showIssueTypeConfigParam: function (item) {
    var me = this,
      btn = item.up("button"),
      // record = btn.getWidgetRecord(),
      childXtype = item.childXtype,
      winTitle = item.winTitle,
      winWidth = item.winWidth,
      form = Ext.widget(childXtype),
      storeArray = eval(item.stores),
      arrayLength = storeArray.length;
    if (arrayLength > 0) {
      me.fireEvent("refreshStores", storeArray);
    }
    // form.loadRecord(record);
    funcShowCustomizableWindow(winTitle, winWidth, form, "customizablewindow");
    /* } else {
         toastr.warning('Sorry you don\'t have permission to perform this action!!', 'Warning Response');
         return false;
     }*/
  },

  doCreateIssueApplicationWin: function (btn) {
    var me = this,
      form = btn.up("form");
    win = btn.up("window");
    (application_type = btn.app_type), (wrapper_xtype = btn.wrapper_xtype);

    // Get the selected Issue Type
    issueType = form.query('combo[name="issue_type_id"]')[0].getValue();

    if (!isNaN(issueType)) {
      //Find Application type and workflow using this
      //Make the form dynamic based on this issue type i.e Change Management, Customer Complaints, Deviation, Corrective Actions
      this.fireEvent("onNewIssueApplication", application_type, wrapper_xtype);
      win.close();
    }
  },
});

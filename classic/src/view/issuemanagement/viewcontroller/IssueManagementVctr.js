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

  setGridStore: function (obj, options) {
    this.fireEvent("setGridStore", obj, options);
  },

  onViewIssueManagementApplication: function (grid, record) {
    this.fireEvent("viewApplicationDetails", record);
  },

  showIssueTypeConfigParam: function (item) {
    var me = this,
      btn = item.up("button"),
      childXtype = item.childXtype,
      winTitle = item.winTitle,
      winWidth = item.winWidth,
      form = Ext.widget(childXtype),
      storeArray = eval(item.stores),
      arrayLength = storeArray.length;
    if (arrayLength > 0) {
      me.fireEvent("refreshStores", storeArray);
    }
    funcShowCustomizableWindow(winTitle, winWidth, form, "customizablewindow");
  },

  showNewIssueApplication: function (btn) {
    var form = btn.up("form"),
      win = btn.up("window"),
      application_type = btn.app_type,
      wrapper_xtype = btn.wrapper_xtype;
    // Get the selected Issue Type
    issueType = form.query('combo[name="issue_type_id"]')[0].getValue();

    console.log(issueType);

    if (!isNaN(issueType)) {
      //Find Application type and workflow using this
      //Make the form dynamic based on this issue type i.e Change Management, Customer Complaints, Deviation, Corrective Actions
      this.fireEvent("onNewIssueApplication", application_type, wrapper_xtype);
      win.close();
    }
  },
});

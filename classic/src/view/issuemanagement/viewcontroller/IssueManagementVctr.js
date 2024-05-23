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
    var me = this,
      form = btn.up("form"),
      win = btn.up("window"),
      wrapper_xtype = btn.wrapper_xtype;
    // Get the selected Issue Type
    issue_type_id = form.query('combo[name="issue_type_id"]')[0].getValue();

    if (!isNaN(issue_type_id)) {
      //Find Application type and workflow using this
      //Make the form dynamic based on this issue type i.e Change Management, Customer Complaints, Deviation, Corrective Actions
      Ext.Ajax.request({
        url: "issuemanagement/getIssueProcessDetails",
        method: "GET",
        params: {
          issue_type_id: issue_type_id,
        },
        headers: {
          Authorization: "Bearer " + access_token,
          "X-CSRF-Token": token,
        },
        success: function (response) {
          var resp = Ext.JSON.decode(response.responseText),
            success = resp.success,
            results = resp.results;
          if (results != null && success === true) {
            var application_type = resp.results.sub_module_id,
              module_id = resp.results.module_id;
            me.fireEvent(
              "onNewIssueApplication",
              application_type,
              wrapper_xtype
            );
            win.close();
          } else {
            win.close();
            toastr.error(
              "Problem encountered while fetching workflow details-->Possibly workflow not set!!",
              "Failure Response"
            );
          }
        },
        failure: function (response) {
          var resp = Ext.JSON.decode(response.responseText),
            message = resp.message;
          toastr.error(message, "Failure Response");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          toastr.error(
            "Error downloading data: " + errorThrown,
            "Error Response"
          );
        },
      });
    }
  },
});

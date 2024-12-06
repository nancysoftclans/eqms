Ext.define("Admin.view.dashboard.viewController.DashboardController", {
  extend: "Ext.app.ViewController",
  alias: "controller.dashboardvctr",

  requires: ["Ext.util.TaskRunner"],
  setGridStore: function (obj, options) {
    this.fireEvent("setGridStore", obj, options);
  },

  setCompStore: function (obj, options) {
    this.fireEvent("setCompStore", obj, options);
  },
  onHideView: function () {},
  onIntrayItemDblClick: function (view, record, item, index, e, eOpts) {
    this.fireEvent("viewApplicationDetails", record);
  },


  DocumentChangeChartType: function(){
    var chart = this.lookup('chart');
    const series = chart.getSeries()[0];
    var menuItem = btn;
    //var yField = chart.getyField();
    //console.log(yField);
    const currentType = series.type;
    chart.getSeries().forEach(function (s) {
      chart.removeSeries(s);
    });
    if (currentType === 'line') {
      chart.addSeries({
          type: 'bar',
          xField: 'day',
          yField: 'total_documents',
          style: {
              fillStyle: '#35baf6'
          },
          tooltip: {
            trackMouse: true,
            renderer: function (tooltip, model, item) {
                tooltip.setHtml(
                    `Logged in Users: ${model.get('uniqueUsers')}`
                );
            }
        }
        
      });
      menuItem.setText('Bar');
  } else {
      chart.addSeries({
          type: 'line',
          xField: 'day',
          yField: 'total_documents',
          smooth: true,
          style: {
              lineWidth: 2,
              strokeStyle: '#999'
          },
          marker: {
              radius: 4,
              lineWidth: 2
          },
          highlight: {
              fillStyle: '#000',
              radius: 5,
              lineWidth: 2,
              strokeStyle: '#fff'
          },
          tooltip: {
              renderer: function (tooltip, model) {
                  tooltip.setHtml(
                      `Documents waiting review: ${model.get('total_documents')}`
                  );
              }
          }
      });
      menuItem.setText('Line');
      
  }
  chart.redraw();
  
  },



  changeChartType: function (btn) {
    var chart = this.lookup('chart');
    const series = chart.getSeries()[0];
    const currentType = series.type;

    // Access the menu item that triggered the handler
    var menuItem = btn;

    // Remove existing series
    chart.getSeries().forEach(function (s) {
        chart.removeSeries(s);
    });

    // Add the new series based on the current type
    if (currentType === 'line') {
        chart.addSeries({
            type: 'bar',
            xField: 'date',
            yField: 'uniqueUsers',
            style: {
                fillStyle: '#35baf6'
            },
            tooltip: {
                renderer: function (tooltip, model) {
                    tooltip.setHtml(
                        `Logged in Users: ${model.get('uniqueUsers')}`
                    );
                }
            }
        });
        // Change the menu item text to 'Line'
        menuItem.setText('Line');
    } else {
        chart.addSeries({
            type: 'line',
            xField: 'date',
            yField: 'uniqueUsers',
            smooth: true,
            style: {
                lineWidth: 2,
                strokeStyle: '#999'
            },
            marker: {
                radius: 4,
                lineWidth: 2
            },
            highlight: {
                fillStyle: '#000',
                radius: 5,
                lineWidth: 2,
                strokeStyle: '#fff'
            },
            tooltip: {
                renderer: function (tooltip, model) {
                    tooltip.setHtml(
                        `Logged in Users: ${model.get('uniqueUsers')}`
                    );
                }
            }
        });
        // Change the menu item text to 'Bar'
        menuItem.setText('Bar');
    }

    // Redraw the chart to apply changes
    chart.redraw();
},



  onPreview: function () {
    
    var chart = this.lookup('chart');
    chart.preview();
  },

  previewCorrespondence: function (btn) {
    var record = btn.getWidgetRecord(),
      store = btn.up("grid").getStore(),
      application_code = record.get("application_code"),
      module_id = record.get("module_id");
    section_id = record.get("section_id");
    sub_module_id = record.get("sub_module_id");
    correspondence_name = "";

    //correspodence
    if (module_id != "") {
      //product
      correspondence_name == "correspodence";
    } else {
      correspondence_name = "genericLetter";
    }

    previewCorrespondence(
      application_code,
      module_id,
      correspondence_name,
      JSON.stringify({ section_id: section_id, sub_module_id: sub_module_id })
    ); //correspodence letter
  },
  dispatchCorrespondence: function (btn) {
    var record = btn.getWidgetRecord(),
      store = btn.up("grid").getStore(),
      application_code = record.get("application_code"),
      module_id = record.get("module_id");
    Ext.MessageBox.confirm(
      "Dispatch",
      "Are you sure you wish to dispatch this Correspondence to Client ?",
      function (btn) {
        if (btn === "yes") {
          Ext.getBody().mask("Dispatching Correspondence...");

          Ext.Ajax.request({
            url: "dashboard/dispatchCorrespondence",
            method: "POST",
            params: {
              application_code: application_code,
              module_id: module_id,
              _token: token,
            },
            success: function (response) {
              Ext.getBody().unmask();
              var resp = Ext.JSON.decode(response.responseText),
                message = resp.message,
                success = resp.success;
              if (success == true || success === true) {
                toastr.success(message, "Success Response");
                store.removeAll();
                store.load();
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
              toastr.error(
                "Error Dispatching data: " + errorThrown,
                "Error Response"
              );
            },
          });
        } else {
          toastr.warning("Operation Terminated", "Cancelled");
        }
      }
    );
  },
  onOlineIntrayItemDblClick: function (view, record, item, index, e, eOpts) {
    var module_id = record.get("module_id");
    console.log(module_id);
    switch (module_id) {
      case 1:
        this.fireEvent("previewProductOnlineApplication", view, record);
        break;
      case 2:
        this.fireEvent("previewPremisesOnlineApplication", view, record);
        break;
      case 3:
        this.fireEvent("previewGmpOnlineApplication", view, record);
        break;
      case 4:
        this.fireEvent("previewImpExpOnlineApplication", view, record);
        break;
      case 7:
        this.fireEvent("previewOnlineClincialTrialApplication", view, record);
        break;
      case 14:
        this.fireEvent("previewOnlinePromotionalApplication", view, record);
        break;
      case 12:
        this.fireEvent("previewControlDrugsOnlineApplication", view, record);
        break;
      case 15:
        this.fireEvent("previewOnlineDisposalApplication", view, record);
        break;
      case 20:
        this.fireEvent(
          "previewDeclarationImpExpOnlineApplication",
          view,
          record
        );
        break;
      case 28:
        this.fireEvent("viewApplicationDetails", view, record);
        break;
    }
  },
  setDashGridsStore: function (me, options) {
    var config = options.config,
      isLoad = options.isLoad,
      toolbar = me.down("pagingtoolbar"),
      store = Ext.create(
        "Admin.store.dashboard.DashboardGridAbstractStore",
        config
      );
    me.setStore(store);
    toolbar.setStore(store);
    if (isLoad === true || isLoad == true) {
      store.removeAll();
      store.load();
    }
  },
  showSelectedProductPortalApplicationMoreDetails: function (btn) {
    var button = btn.up("button"),
      grid = button.up("grid"),
      container = grid.up("panel"),
      record = button.getWidgetRecord(),
      application_code = record.get("application_code");
    prodclass_category_id = record.get("prodclass_category_id");
    module_id = record.get("module_id");
    sub_module_id = record.get("sub_module_id");
    section_id = record.get("section_id");
    ref_no = record.get("tracking_no");
    application_id = record.get("active_application_id");
    applicant_id = record.get("trader_id");
    process_id = record.get("process_id");
    container
      .down("hiddenfield[name=application_code]")
      .setValue(application_code);
    container
      .down("hiddenfield[name=prodclass_category_id]")
      .setValue(prodclass_category_id);
    container.down("hiddenfield[name=module_id]").setValue(module_id);
    container.down("hiddenfield[name=sub_module_id]").setValue(sub_module_id);
    container.down("hiddenfield[name=section_id]").setValue(section_id);
    console.log(module_id);
    this.fireEvent(
      "showPortalReceivingApplicationMoreDetails",
      btn,
      application_code,
      module_id,
      sub_module_id,
      section_id,
      prodclass_category_id,
      ref_no,
      application_id,
      applicant_id,
      process_id
    );
  },
  showSelectedQueriesApplicationMoreDetails: function (btn) {
    var button = btn.up("button"),
      grid = button.up("grid"),
      container = grid.up("panel");
    console.log(container);
    (record = button.getWidgetRecord()),
      (application_code = record.get("application_code"));
    prodclass_category_id = record.get("prodclass_category_id");
    module_id = record.get("module_id");
    sub_module_id = record.get("sub_module_id");
    section_id = record.get("section_id");
    ref_no = record.get("tracking_no");
    application_id = record.get("active_application_id");
    applicant_id = record.get("trader_id");
    process_id = record.get("process_id");
    container
      .down("hiddenfield[name=application_code]")
      .setValue(application_code);
    container
      .down("hiddenfield[name=prodclass_category_id]")
      .setValue(prodclass_category_id);
    container.down("hiddenfield[name=module_id]").setValue(module_id);
    container.down("hiddenfield[name=sub_module_id]").setValue(sub_module_id);
    container.down("hiddenfield[name=section_id]").setValue(section_id);
    console.log(module_id);
    this.fireEvent(
      "showSelectedQueriesApplicationMoreDetails",
      btn,
      application_code,
      module_id,
      sub_module_id,
      section_id,
      prodclass_category_id,
      ref_no,
      application_id,
      applicant_id,
      process_id
    );
  },
  showApplicationUploadedDocument: function (btn) {
    this.fireEvent("showPreviousUploadedDocs", btn);
  },
  previewApplicationQueries: function (item) {
    this.fireEvent("showApplicationQueries", item);
  },
});

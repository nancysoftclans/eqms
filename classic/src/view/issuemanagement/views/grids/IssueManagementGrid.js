Ext.define("Admin.view.issuemanagement.views.grids.IssueManagementGrid", {
  extend: "Ext.grid.Panel",
  controller: "issuemanagementvctr",
  xtype: "issuemanagementgrid",
  itemId: "issuemanagementgrid",
  cls: "dashboard-todo-list",
  autoScroll: true,
  autoHeight: true,
  width: "100%",
  viewConfig: {
    deferEmptyText: false,
    preserveScrollOnReload: true,
    enableTextSelection: true,
    emptyText: "Nothing to display",
    getRowClass: function (record, rowIndex, rowParams, store) {
      var is_enabled = record.get("is_enabled");
      if (is_enabled == 0 || is_enabled === 0) {
        return "invalid-row";
      }
    },
  },
  tbar: [
    {
      xtype: "panel",
      html: "<h2>Double Click To View Issue Details</h2>",
    },
    {
      xtype: "exportbtn",
      menu: {
        defaults: {
          handler: 'exportTo'
        },
        items: [{
          text: 'Excel',
          cfg: {
            type: 'excel07',
            ext: 'xlsx'
          }
        }, {
          text: 'CSV',
          cfg: {
            type: 'csv'
          }
        }]
      }
    },
    {
      xtype: "tbspacer",
      width: 50,
    },
    {
      xtype: "combo",
      anyMatch: true,
      fieldLabel: "Issue Type",
      labelWidth: 80,
      width: 320,
      valueField: "id",
      displayField: "title",
      forceSelection: true,
      name: "issue_type_id",
      queryMode: "local",
      fieldStyle: {
        color: "green",
        "font-weight": "bold",
      },
      listeners: {
        beforerender: {
          fn: "setCompStore",
          config: {
            pageSize: 1000,
            proxy: {
              extraParams: {
                table_name: "par_issue_types",
              },
            },
          },
          isLoad: true,
        },
        change: "reloadParentGridOnChange",
      },
      triggers: {
        clear: {
          type: "clear",
          hideWhenEmpty: true,
          hideWhenMouseOut: false,
          clearOnEscape: true,
        },
      },
    },
  ],
  plugins: [
    {
      ptype: "gridexporter",
    },
  ],
  listeners: {
    beforerender: {
      fn: "setGridStore",
      config: {
        pageSize: 1000,
        enablePaging: true,
        storeId: "issuemanagementstr",
        grouper: {
          groupFn: function (item) {
            return item.get("process_id") + item.get("workflow_stage_id");
          },
        },
        proxy: {
          url: "issuemanagement/getIssueManagementDetails",
        },
        sorters: [{
          property: 'raised_date',
          direction: 'DESC'
        }]
      },
      isLoad: true,
    },
    itemdblclick: "onViewIssueManagementApplication",
  },
  features: [
    {
      ftype: "searching",
      minChars: 2,
      mode: "local",
    },
    {
      ftype: "grouping",
      startCollapsed: false,
      groupHeaderTpl:
        'Process: {[values.rows[0].data.process_name]}, Stage: {[values.rows[0].data.workflow_stage]} [{rows.length} {[values.rows.length > 1 ? "Items" : "Item"]}]',
      hideGroupedHeader: true,
      enableGroupingMenu: false,
    },
  ],

  bbar: [
    {
      xtype: "pagingtoolbar",
      width: '100%',
      displayInfo: true,
      displayMsg: "Showing {0} - {1} of {2} total records",
      emptyMsg: "No Records",
      beforeLoad: function () {
        var store = this.getStore(),
          grid = this.up("grid"),
          issue_type_id = grid.down('combo[name=issue_type_id]').getValue();
        store.getProxy().extraParams = {
          issue_type_id: issue_type_id,
          table_name: "tra_issue_management_applications",
        };
      },
    },
  ],
  columns: [
    {
      xtype: "gridcolumn",
      dataIndex: "reference_no",
      text: "ID",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "raised_date",
      text: "Date Raised",
      flex: 1,
      tdCls: "wrap",
      renderer: Ext.util.Format.dateRenderer("d M Y"),
    },
    {
      xtype: "gridcolumn",
      dataIndex: "title",
      text: "Title",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      dataIndex: "issue_status",
      text: "Status",
      flex: 1,
      tdCls: "wrap",
    },
    {
      xtype: "gridcolumn",
      text: "Owner",
      flex: 1,
      tdCls: "wrap",
      renderer: function (value, metaData, record) {
        // Concatenate first_name and last_name
        var firstName = record.get("first_name");
        var lastName = record.get("last_name");
        return firstName + " " + lastName;
      },
    },

    {
      xtype: "gridcolumn",
      dataIndex: "target_resolution_date",
      text: "Target Date",
      flex: 1,
      tdCls: "wrap",
      renderer: Ext.util.Format.dateRenderer("d M Y"),
    },
    {
      xtype: "gridcolumn",
      dataIndex: "date_closed",
      text: "Date Closed",
      flex: 1,
      tdCls: "wrap",
      renderer: Ext.util.Format.dateRenderer("d M Y"),
    },
    {
      xtype: "widgetcolumn",
      text: "Actions",
      flex: 1,
      widget: {
        textAlign: "left",
        xtype: "splitbutton",
        iconCls: "x-fa fa-th-list",
        ui: "gray",
        menu: {
          xtype: "menu",
          items: [
            {
              text: "Delete",
              iconCls: "x-fa fa-trash",
              tooltip: "Delete Record",
              table_name: "tra_submissions",
              storeID: "issuemanagementstr",
              action_url: "configurations/deleteConfigRecord",
              action: "actual_delete",
              handler: 'doDeleteIssueManagement',
              bind: {
                disabled: '{hideDeleteButton}'
              },
            },
            {
              text: "Issue Report",
              iconCls: "x-fa fa-certificate",
              tooltip: "Issue Report",
              table_name: "tra_submissions",
              storeID: "issuemanagementstr",
              action_url: "issuemanagement/generateIssueReport",
              action: "issue_report",
              handler: 'generateIssueReport'
            },
          ],
        },
      },
      onWidgetAttach: function (col, widget, rec) {
        var issue_status = rec.get("issue_status_id");
        if (issue_status === 1) {
          widget.down('menu menuitem[action=actual_delete]').setHidden(false);
        }
        if (issue_status === 8) {
          // widget.down('menu menuitem[action=actual_delete]').setHidden(true);
          widget.down('menu menuitem[action=issue_report]').setHidden(false);
        }
        else {
          widget.down('menu menuitem[action=actual_delete]').setHidden(true);
          widget.down('menu menuitem[action=issue_report]').setHidden(true);
        }
      }
    },
  ],
});

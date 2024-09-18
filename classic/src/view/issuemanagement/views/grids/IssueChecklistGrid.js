Ext.define('Admin.view.auditManagement.views.grids.IssueChecklistGrid', {
  extend: 'Ext.grid.Panel',
  xtype: 'issuechecklistgrid',
  cls: 'dashboard-todo-list',
  //controller: 'commoninterfacesVctr',
  autoScroll: true,
  autoHeight: true,
  width: '100%',
  viewConfig: {
    deferEmptyText: false,
    emptyText: 'Nothing to display',
    getRowClass: function (record, rowIndex, rowParams, store) {
      var is_enabled = record.get('is_enabled');
      if (is_enabled == 0 || is_enabled === 0) {
        return 'invalid-row';
      }
    }
  },
  selType: 'cellmodel',
  plugins: [{
    ptype: 'gridexporter'
  }, {
    ptype: 'cellediting',
    clicksToEdit: 1,
    editing: true
  }, {
    ptype: 'filterfield'
  }],
  export_title: 'Checklist',
  features: [{
    ftype: 'grouping',
    startCollapsed: false,
    groupHeaderTpl: '=> {[values.rows[0].data.checklist_type]} [{rows.length} {[values.rows.length > 1 ? "Items" : "Item"]}]',
    hideGroupedHeader: true,
    enableGroupingMenu: false
  }],
  itemId: 'issuechecklistgrid',
  tbar: [{
    xtype: 'hiddenfield',
    name: 'checklist_type_id'
  }, {
    xtype: 'hiddenfield',
    name: 'checklist_category_id'
  }, {
    xtype: 'button', bind: {
      disabled: '{isReadOnly}'
    },
    text: 'Add Item',
    iconCls: 'x-fa fa-plus',
    action: 'add',
    ui: 'soft-blue',
    childXtype: 'auditchecklistitemsfrm',
    winTitle: 'Checklist Item',
    winWidth: '40%',
    handler: 'showAddChecklistItemConfigParamWinFrm',
    stores: '[]'
  }, {
    xtype: 'exportbtn',
    hidden: true
  }, {
    xtype: 'tbspacer',
    width: 50
  }, {
    xtype: 'hiddenfield',
    name: 'isReadOnly'
  }, {
    xtype: 'hiddenfield',
    name: 'item_resp_id'
  }, {
    xtype: 'combo', anyMatch: true,
    fieldLabel: 'Applicable Checklist',
    labelWidth: 150,
    valueField: 'id',
    displayField: 'name',
    forceSelection: true,
    hidden: true,
    name: 'applicable_checklist',
    queryMode: 'local',
    width: 500,
    labelStyle: "font-weight:bold",
    listeners: {
      beforerender: {
        fn: 'setCompStore',
        config: {
          pageSize: 1000,
          proxy: {
            url: 'workflow/getProcessApplicableChecklistTypes'
          }
        },
        isLoad: false
      },
      change: function () {
        var grid = this.up('grid'),
          store = grid.getStore();
        store.load();
      }
    },
    triggers: {
      clear: {
        type: 'clear',
        hideWhenEmpty: true,
        hideWhenMouseOut: false,
        clearOnEscape: true
      }
    }
  }],
  listeners: {
    beforerender: {
      fn: 'setGridStore',
      config: {
        pageSize: 10000,
        storeId: 'applicationpaymentsstr',
        groupField: 'checklist_type',
        proxy: {
          url: 'workflow/getProcessApplicableChecklistItems'
        }
      },
      isLoad: true
    },
  },
  columns: [{
    xtype: 'gridcolumn',
    dataIndex: 'name',
    text: 'Detail',
    tdCls: 'wrap',  // Use the existing wrap class if needed
    flex: 1.2,
    filter: {
      xtype: 'textfield'
    },
    renderer: function (value, metaData) {
      // Apply text alignment and justification via metaData.style
      metaData.style = 'text-align: justify;';  // Justify text alignment
      return value;
    }
  },
  {
    xtype: 'gridcolumn',
    dataIndex: 'order_no',
    hidden: true,
    text: 'Order No',
    flex: 1
  },
  {
    xtype: 'gridcolumn',
    dataIndex: 'pass_status',
    text: 'Tick the appropriate box',
    align: 'center',
    tdCls: 'wrap',
    flex: 0.8,
    editor: {
      xtype: 'combo', anyMatch: true,
      store: 'confirmationstr',
      valueField: 'id',
      displayField: 'name',
      value: 1,
      queryMode: 'local',
      listeners: {
        //change: 'saveApplicationScreeningDetails'
      }
    },
    filter: {
      xtype: 'combo', anyMatch: true,
      store: 'confirmationstr',
      queryMode: 'local',
      valueField: 'id',
      displayField: 'name'
    },
    renderer: function (val, meta, record, rowIndex, colIndex, store, view) {
      var textVal = 'Select Status';
      if (view.grid.columns[colIndex].getEditor().getStore().getById(val)) {
        textVal = view.grid.columns[colIndex].getEditor().getStore().getById(val).data.name;
      }
      return textVal;
    }
  }, {
    xtype: 'gridcolumn',
    dataIndex: 'comment',
    text: 'Comments/Notes',
    tdCls: 'wrap',
    flex: 1.2,
    editor: {
      xtype: 'textarea'
    },
    renderer: function (value, metaData) {
      // Apply text alignment and justification via metaData.style
      metaData.style = 'text-align: justify;';  // Justify text alignment
      return value;
    }
  },  {
    text: 'Options',
    xtype: 'widgetcolumn',
    width: 90,
    widget: {
      width: 75,
      textAlign: 'left',
      xtype: 'splitbutton',
      iconCls: 'x-fa fa-th-list',
      ui: 'gray',
      menu: {
        xtype: 'menu',
        items: [{
            text: 'Enable',
            iconCls: 'x-fa fa-undo',
            tooltip: 'Enable Record',
            table_name: 'par_qms_audit_types',
            hidden: true,
            storeID: 'formCategoryStr',
            action_url: 'configurations/undoConfigSoftDeletes',
            action: 'enable',
            disabled: true, bind: {
              disabled: '{isReadOnly}'
            },
            handler: 'doDeleteConfigWidgetParam'
          }
        ]
      }
    },
  }
  ],

  bbar: [
    {
      xtype: 'pagingtoolbar',
      width: '50%',
      displayInfo: true,
      displayMsg: 'Showing {0} - {1} of {2} total records',
      emptyMsg: 'No Records',
      beforeLoad: function () {
        var grid = this.up('grid');
        grid.fireEvent('refresh', grid);
      }
    }, '->', {
      text: 'Save Checklist Details',
      ui: 'soft-blue',
      bind: {
        hidden: '{isReadOnly}'
      },
      iconCls: 'fa fa-arrow-right',
      name: 'savegrid_screening_btn'
    }
  ]
});

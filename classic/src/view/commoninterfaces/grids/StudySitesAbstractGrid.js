/**
 */
Ext.define('Admin.view.commoninterfaces.grids.StudySitesAbstractGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'studysitesabstractgrid',
    initComponent: function () {
        var defaultColumns = [
            {
                xtype: 'gridcolumn',
                dataIndex: 'name',
                text: 'Site Name',
                flex: 1
            },{
                xtype: 'gridcolumn',
                dataIndex: 'approving_instution',
                text: 'Approving Institution',
                hidden: true,
                flex: 1
            },{
                xtype: 'gridcolumn',
                dataIndex: 'responsible_ethics_committee',
                text: 'Responsible Ethics Committee',
                hidden: true,
                flex: 1
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'approval_date',
                hidden: true,
                text: 'Approval Date',
                flex: 1
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'application_reference_no',
                hidden: true,
                text: 'Ref: No',
                flex: 1
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'country_name',
                text: 'Country',
                flex: 1
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'region_name',
                text: 'District',
                flex: 1
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'physical_address',
                text: 'Physical Address',
                flex: 1
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'postal_address',
                text: 'Postal Address',
                flex: 1
            }
        ];
        this.columns = defaultColumns.concat(this.columns);
        this.callParent(arguments);
    }
});

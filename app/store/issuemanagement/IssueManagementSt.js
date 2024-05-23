Ext.define('Admin.store.issuemanagement.IssueManagementSt', {
    extend: 'Ext.data.TreeStore',
    storeId: 'issuemanagementst',
    alias: 'store.issuemanagementst',
    remoteSort: false,
    remoteFilter: false,
    
    // requires: [
    //     'Admin.model.AdministrationMdl'
    // ],
    // model: 'Admin.model.AdministrationMdl',
    
    autoLoad: false,

    defaultRootId: 'root',
    proxy: {
        type: 'ajax',
        api: {
            read: base_url +'issuemanagement/getIssueManagementDetails'
        },
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Accept': 'application/json'
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            messageProperty: 'msg'
        },
        extraParams: {
            strict_check: true
        }
    }
});

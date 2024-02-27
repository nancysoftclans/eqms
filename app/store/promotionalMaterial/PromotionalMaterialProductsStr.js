Ext.define('Admin.store.promotionalMaterial.PromotionalMaterialProductsStr', {
    extend: 'Ext.data.Store',
    alias: 'store.promotionalmaterialproductsstr',
    storeId: 'promotionalmaterialproductsstr',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'promotionmaterials/getPromotionMaterialsProductParticular',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        reader: {
            type: 'json',
            idProperty: 'id',
            rootProperty: 'results',
            messageProperty: 'message',
            totalProperty: 'total'
        }
    }
});

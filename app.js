//app.js
App({
  onLaunch: function() {
    let that = this

    // 引入 BaaS SDK
    require('./utils/sdk-v1.4.0')

  
    let clientId = this.globalData.clientId

    wx.BaaS.init(clientId)
  },

  globalData: {
    clientId: '658f7f83232aee83ee03', // 从 BaaS 后台获取 ClientID
    tableId: 38417, // 从 https://cloud.minapp.com/dashboard/ 管理后台的数据表中获取
    indexBookTableId: 38530,
  }
})

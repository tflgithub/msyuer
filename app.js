//app.js
App({
  onLaunch: function() {
    var that = this
    wx.onNetworkStatusChange(function(res) {
      that.globalData.netWorkType = res.networkType
    })
  },
  globalData: {
    setUserInfo: null,
  },
})
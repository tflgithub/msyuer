//app.js
import {
  ShowAlert
} from './res/components/showToast/showToast.js'
App({
  ShowAlert,
  onLaunch: function() {
    var that = this
    wx.getNetworkType({
      success: function(res) {
        that.globalData.netWorkType = res.networkType
      }
    })
    wx.onNetworkStatusChange(function(res) {
      that.globalData.isConnected = res.isConnected
      that.globalData.netWorkType = res.networkType
    })
    this.checkAuth()
    // request.getHomeBar(function (res) {
    //   this.setData({
    //     barItems: res.data
    //   })
    // }, function (res) { })
  },
  checkAuth: function() {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          // 未授权，跳转到授权页面
          wx.reLaunch({
            url: '/pages/auth/auth',
          })
        }
      }
    })
  },
  globalData: {
    netWorkType: null,
    isConnected: null,
    token: null,
    userInfo: null,
    setUserInfo: null,
    API_URL: "http://xxx"
  },
})
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
        that.globalData.netWorkType = res.networkType
      }),
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userInfo']) {
            // 未授权，跳转到授权页面
            wx.reLaunch({
              url: '/pages/auth/auth',
            })
          } else {
            wx.getUserInfo({
              success: function(res) {
                that.globalData.userInfo = res.userInfo
              }
            })
          }
        }
      })
  },
  getLoginStatus: function(resovle, reject) {
    wx.getStorage({
      key: 'loginStatus',
      success: resovle,
      fail: reject
    })
  },
  globalData: {
    netWorkType: null,
    userInfo: null,
    setUserInfo: null,
    API_URL: "http://10.30.31.8:8080"
  },
})
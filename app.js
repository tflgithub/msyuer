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
    })
  },
  getLoginStatus: function() {
    var that = this
    return new Promise(function(resolve, reject) {
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userInfo']) {
            // 未授权，跳转到授权页面
            wx.reLaunch({
              url: '/pages/auth/auth',
            })
            reject('未登录');
          } else {
            resolve('已登录');
            wx.getUserInfo({
              success: function(res) {
                that.globalData.userInfo = res.userInfo
              }
            })
          }
        }
      })
    })
  },
  saveLoginStatus: function (data) {
    return new Promise(function(resolve, reject) {
        wx.setStorage({
          key: 'loginStatus',
          data: data,
          success:resolve,
          fail:reject
        }) 
    })
  },
  globalData: {
    netWorkType: null,
    userInfo: null,
    setUserInfo: null,
    API_URL: "http://10.30.31.8:8080"
  },
})
//app.js
import {
  ShowAlert
} from './res/components/showToast/showToast.js'
const util = require('./utils/util.js')
App({
  ShowAlert,
  util,
  onLaunch: function() {
    var that = this
    wx.onNetworkStatusChange(function(res) {
      that.globalData.netWorkType = res.networkType
    })
  },
  isAuth: function() {
    var that = this
    return new Promise(function(resolve, reject) {
      wx.getNetworkType({
        success: function(res) {
          that.globalData.netWorkType = res.networkType
          if (that.globalData.netWorkType === 'none') {
            reject('请检查您的网络连接')
          }
        }
      })
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
            resolve('已授权')
          }
        }
      })
    })
  },
  globalData: {
    netWorkType: null,
    userInfo: null,
    setUserInfo: null,
    token: null,
    API_URL: "https://api.miskitchen.com"
  },
})
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
                wx.login({
                  success: function(res) {
                    if (res.code) {
                      console.log("获取到微信code：" + res.code);
                      wx.request({
                        url: `${that.globalData.API_URL}/api/wxa/v1/login/wxCode`,
                        method: 'post',
                        data: {
                          code: res.code,
                          nickName: that.globalData.userInfo.nickName,
                          avatarUrl: that.globalData.userInfo.avatarUrl
                        },
                        success: function(res) {
                          if (res.data.code === 0) {
                            that.globalData.token = res.data.data.token
                            that.globalData.setUserInfo = res.data.data.setUserInfo
                            that.globalData.canSee = res.data.data.canSee
                            console.log('是否已解锁：'+res.data.data.canSee)
                            that.globalData.hadMsg = res.data.data.hadMsg
                            resolve('登录成功')
                          }
                        },
                        fail: function(res) {
                          console.log("登录服务器失败：" + JSON.stringify(res))
                          reject('糟糕,服务器开小差了~')
                        }
                      })
                    }
                  }
                })
              }
            })
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
    canSee: null,
    hadMsg: null,
    uid: null,
    API_URL: "http://test.miskitchen.com"  //http://10.30.28.69:8080"
  },
})
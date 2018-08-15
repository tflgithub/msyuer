//app.js
import {
  ShowAlert
} from './res/components/showToast/showToast.js'
App({
  ShowAlert,
  onLaunch: function() {
    var that = this
    this.getUserInfo()
    //this.authRequest()
    wx.getNetworkType({
      success: function(res) {
        that.globalData.netWorkType = res.networkType
      }
    })
    wx.onNetworkStatusChange(function(res) {
      that.globalData.netWorkStatus = res.isConnected
      that.globalData.netWorkType = res.networkType
    })
  },
  getUserInfo: function() {
    var that = this
    if (!this.globalData.userInfo) {
      wx.login({
        success: function(res) {
          if (res.code) {
            that.globalData.code = res.code
            wx.setStorageSync('code', res.code)
            wx.getUserInfo({
              success: function(res) {
                that.globalData.userInfo = res.userInfo;
                console.log("获取到用户信息：" + res.userInfo.nickName);
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        },
        fail: function(res) {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      })
    }
  },
  request: function(obj) {
    console.log("请求地址:"+obj.url)
    console.log("请求参数:" + JSON.stringify(obj.data))
    var that = this
    var header = obj.header || {}
    if (!header['content-type']) {
      header['content-type'] = 'application/json'
    }
    if (!header['ms-token']) {
      header['ms-token'] = this.globalData.token
    }
    if (obj.message != "") {
      wx.showLoading({
        title: obj.message,
      })
    }
    // This must be wx.request !
    wx.request({
      url: obj.url,
      data: obj.data || {},
      method: 'post',
      header: header,
      success: function(res) {
        if (obj.message != "") {
          wx.hideLoading()
        }
        if (res.data.code===0) {
          obj.success(res.data)
        } else {
          obj.fail(res.data.msg)
        }
      },
      fail: function(res) {
        if (obj.message != "") {
          wx.hideLoading()
        }
        wx.showModal({
          title: '出错了',
          content: '服务器繁忙...',
          showCancel:false
        })
      }
    })
  },

  authRequest: function() {
    var that = this
    if (!that.globalData.token) {
      that.request({
        url: `${that.globalData.API_URL}/api/wxa/v1/login/wxCode`,
        method: 'POST',
        data: {
          code: that.globalData.code
        },
        success: function(res) {
          if (!res.data.code === 0) {
            that.globalData.token = res.data.token;
            that.globalData.setUserInfo = res.data.setUserInfo;
          }
        },
        fail: function(res) {}
      })
    }
  },
  globalData: {
    netWorkType: null,
    netWorkStatus: null,
    userInfo: null,
    code: null,
    token: null,
    setUserInfo: null,
    API_URL: "http://xxx"
  },
})
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
      that.globalData.netWorkStatus = res.isConnected
      that.globalData.netWorkType = res.networkType
    })
    this.checkAuth()
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
  request: function(obj) {
    if (!this.globalData.token) {
      console.log("服务器token:" + this.globalData.token);
      return
    }
    console.log("请求地址:" + obj.url)
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
        if (res.data.code === 0) {
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
          showCancel: false
        })
      }
    })
  },
  globalData: {
    netWorkType: null,
    netWorkStatus: null,
    token: null,
    userInfo: null,
    setUserInfo: null,
    API_URL: "http://xxx"
  },
})
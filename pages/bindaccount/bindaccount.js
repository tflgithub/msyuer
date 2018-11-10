// pages/bindaccount/bindaccount.js
const request = require('../../utils/wxRequest.js')
const api = require('../../api/config.js').api
const util=require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    msgCode: '',
    getCodeButtonText: '获取验证码',
    disableGetMobileCode: false,
  },
  nextStep: function(event) {
    var that = this;
    if (this.data.mobile === '') {
      util.showToast('请输入手机号码','none',2000)
      return
    }
    if (this.data.msgCode === '') {
      util.showToast('请输入验证码', 'none', 2000)
      return
    }
    var data = {
      mobile: this.data.mobile,
      code: this.data.msgCode
    }
    request.fetch(api.register, data).then(res => {
      wx.setStorageSync('setUserInfo', 1)
      wx.navigateBack({
        delta:1
      })
    }).catch(res => {
      util.showToast(res, 'none', 2000)
    })
  },
  bindGetPassCode: function(e) {
    var that = this
    if (!this.bindCheckMobile(this.data.mobile)) {
      return
    }
    this.setData({
      disableGetMobileCode: true
    })
    request.fetch(api.getSmsCode, {
      data: this.data.mobile
    }).then(data => {
      that.setData({
        disableGetMobileCode: false
      })
      util.showToast('验证码已发送', 'none', 2000)
      that.countDownPassCode();
    }).catch(e => {
      that.setData({
        disableGetMobileCode: false
      })
      util.showToast(e,'none', 2000)
    })
  },
  bindInputMobile: function(e) {
    this.setData({
      mobile: e.detail.value,
    })
  },
  bindInputMsgCode: function(e) {
    console.log(e.detail.value)
    this.setData({
      msgCode: e.detail.value,
    })
  },
  bindCheckMobile: function(mobile) {
    if (mobile === '') {
      util.showToast('请输入手机号码', 'none', 2000)
      return false
    }
    if (!mobile.match(/^1[3-9][0-9]\d{8}$/)) {
      util.showToast('手机号码格式错误', 'none', 2000)
      return false
    }
    return true
  },
  countDownPassCode: function() {
    var pages = getCurrentPages()
    var i = 60
    var intervalId = setInterval(function() {
      i--
      if (i <= 0) {
        pages[pages.length - 1].setData({
          disableGetMobileCode: false,
          getCodeButtonText: '获取验证码'
        })
        clearInterval(intervalId)
      } else {
        pages[pages.length - 1].setData({
          getCodeButtonText: i + '秒后可重新获取',
          disableGetMobileCode: true,
        })
      }
    }, 1000);
  }
})
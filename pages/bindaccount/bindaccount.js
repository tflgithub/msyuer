// pages/bindaccount/bindaccount.js
const request = require('../../api/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    msgCode: '',
    getCodeButtonText: '获取验证码',
    disabledGetMsg: true,
    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,
    countries: ["中国", "美国", "英国"],
    countryIndex: 0,
  },
  bindCountryCodeChange: function(e) {
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  nextStep: function(event) {
    if (this.data.mobile === '') {
      this.show({
        imageToast:'',
        iconToast: 'icon-warning', // 对：icon-dui, 错：icon-cuo,警告：icon-warning
        textToast: '请输入手机号'
      })
      return
    }
    if (this.data.msgCode === '') {
      this.show({
        imageToast: '',
        iconToast: 'icon-warning', // 对：icon-dui, 错：icon-cuo,警告：icon-warning
        textToast: '请输入验证码'
      })
      return
    }

    request.vailPassCode(this.data.mobile, this.data.msgCode, function(res) {
      if (res.data.code === 0) {
        wx.navigateTo({
          url: "../babyinfo/babyinfo?mobile=" + this.data.mobile + "&msgCode=" + this.data.msgCode
        });
      }
      else{
        this.show({
          imageToast: '',
          iconToast: 'icon-cuo', // 对：icon-dui, 错：icon-cuo,警告：icon-warning
          textToast: `${res.data.msg}`
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let app = getApp();
    new app.ShowAlert();
  },
  bindGetPassCode: function(e) {
    var that = this
    if (!this.bindCheckMobile(this.data.mobile)) {
      return
    }

    request.getPassCode(this.data.mobile, function(res) {
      if (res.data.code === 0) {
        this.show({
          imageToast: '',
          iconToast: 'icon-dui', // 对：icon-dui, 错：icon-cuo,警告：icon-warning
          textToast: '验证码已发送'
        })
        that.countDownPassCode()
      } else {
        this.show({
          imageToast: '',
          iconToast: 'icon-cuo', // 对：icon-dui, 错：icon-cuo,警告：icon-warning
          textToast: `${res.data.msg}`
        })
      }
    })
  },
  bindInputMobile: function(e) {
    this.setData({
      mobile: e.detail.value,
    })
  },
  bindInputMsgCode: function(e) {
    this.setData({
      msgCode: e.detail.value,
    })
  },
  bindCheckMobile: function(mobile) {
    if (mobile === '') {
      this.show({
        imageToast: '',
        iconToast: 'icon-warning', // 对：icon-dui, 错：icon-cuo,警告：icon-warning
        textToast: '请输入手机号'
      })
      return false
    }
    if (!mobile.match(/^1[3-9][0-9]\d{8}$/)) {
      this.show({
        imageToast: '',
        iconToast: 'icon-cuo', // 对：icon-dui, 错：icon-cuo,警告：icon-warning
        textToast: '手机号码格式错误'
      })
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
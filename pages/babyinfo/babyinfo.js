// pages/babyinfo/babyinfo.js
const request = require('../../api/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBtn: false,
    inputDisabled: true,
    radioCheckVal: 1,
    mobile: '',
    msgCode: '',
    nickName: '',
    birthDay: ''
  },
  radioCheckedChange: function(e) {
    this.setData({
      radioCheckVal: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let app = getApp();
    new app.ShowAlert();
    if (options.type === 'get') {
      this.getBabyInfo();
    } else {
      this.setData({
        mobile: options.mobile,
        msgCode: options.msgCode,
        inputDisabled: false,
        showBtn: true
      })
    }
  },
  bindInputNickName: function(e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  bindInputBorthDay: function(e) {
    this.setData({
      borthDay: e.detail.value
    })
  },
  getBabyInfo: function() {
    request.getBabyInfo(function(res) {
        this.setData({
          nickName:res.data.nickName,
          borthDay: res.data.birthDay,
          radioCheckVal:res.data.sex
        })
    },function(res){
      this.showToast('cuo', res.data.msg)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  showToast: function(icon, text) {
    this.show({
      imageToast: '',
      iconToast: icon,
      textToast: text
    })
  },
  completed: function(e) {
    var mobile = this.data.mobile;
    var msgCode = this.data.msgCode;
    var nickName = this.data.nickName;
    if (nickName === '') {
      this.showToast('icon-warning', '请填写宝宝昵称')
      return
    }
    var birthDay = this.data.birthDay;
    if (birthDay === '') {
      this.showToast('icon-warning', '请填写宝宝生日')
      return
    }
    var sex = this.data.radioCheckVal;
    request.register(mobile, msgCode, nickName, birthDay, sex, function(res) {
        this.showToast('icon-dui','注册成功');
        this.goHomePage();
    },function(res){
      this.showToast('icon-cuo', res.data.message);
    })
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
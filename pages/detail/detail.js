// pages/detail/detail.js
var WxParse = require('../../wxParse/wxParse.js');
const request = require('../../api/request.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {
      "detailInfo": {
        "summary": `<p>efesgvfv</p >
<p>sfvfdbb&nbsp; &nbsp;</p >
<p>发送方代表v</p >`,
        "duration": "16.23",
        "videoUrl": "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
        "phoUrl": "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
        "detailId": "22222222",
        "clickNum": "2366",
        "title": "abc测试sss",
        "likeNum": "1266"
      },
      "recommendList": [{
          "duration": "04:30",
          "phoUrl": "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
          "detailId": "22222222",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
        {
          "duration": "04:30",
          "phoUrl": "../../image/bar.png",
          "detailId": "22222222",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        }
      ]
    },
    showCenterBtn: false,
    autoPlay: false,
    showCover: false,
    isWifi: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let app = getApp()
    console.log("当前网络:" + app.globalData.netWorkType)
    if (app.globalData.netWorkType === 'wifi') {
      this.setData({
        isWifi: true
      })
    }
    if (app.globalData.setUserInfo) {
      this.setData({
        showCenterBtn: true,
        autoPlay: true,
        showCover: false
      })
    }
    var article = this.data.data.detailInfo.summary;
    WxParse.wxParse('article', 'html', article, this, 5);
    console.log("当前ID：" + options.id);
    request.getVedioDetail(options.id,function(res){
        this.setData({
          data:res.data
        })
    },function(res){

    })
  },
  gotoDetail: function(e) {
    wx.redirectTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  login: function() {
    wx.navigateTo({
      url: '../bindaccount/bindaccount',
    })
  },
  startPlay: function(e) {
    var videoContext = wx.createVideoContext('myVideo');
    videoContext.play();
    this.setData({
      isWifi: true
    })
  },
  dolike: function(e) {
    var detailId=this.data.data.detailInfo.detailId;
    console.log(detailId);
    request.like(detailId, function(res) {
      if (res.data.code === 1) {
        wx.hideLoading();
      } else {
        wx.hideLoading();
      }
    })
  },
  fenxiang: function (e) {
    wx.updateShareMenu({
      withShareTicket: true,
      success() { }
    })
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
// pages/detail/detail.js
var WxParse = require('../../wxParse/wxParse.js');
const request = require('../../api/request.js');
const app = getApp()
const {
  util
} = app
import pageState from '../../common/pageState/pageState.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    videoContext: null,
    likeNum: '',
    hadLike: false,
    isPlaying: null,
    showCover: true,
    recommendList: [],
    dataList: {},
    hideModal: true,
    detailId: null,
    isBindMobile: null,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../image/ic_star_normal.png',
    selectedSrc: '../../image/ic_star_full.png',
    halfSrc: '../../image/ic_star_half.png',
    key: 0, //评分
    bgImage:null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.videoContext = wx.createVideoContext('myVideo')
    this.detailId = options.id
    //this.loadData()
  },
  loadData: function() {
    var that = this;
    console.log("当前ID：" + this.detailId);
    Promise.all([request.getVedioDetail(this.detailId), request.getRecommend(this.detailId)]).then(res => {
      pageState(that).finish()
      var article = res[0].data.detailInfo.summary;
      WxParse.wxParse('article', 'html', article, that, 5);
      that.setData({
        data: res[0].data,
        likeNum: res[0].data.detailInfo.likeNum,
        hadLike: res[0].data.detailInfo.hadLike,
        isBindMobile: res[0].data.setUserInfo,
        recommendList: res[1].data.recommendList
      })
    }).catch(res => {
      pageState(this).error(res)
    })
  },
  onRetry: function() {
    this.loadData()
  },
  gotoDetail: function(e) {
    wx.redirectTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  bindaccount: function() {
    wx.navigateTo({
      url: '../bindaccount/bindaccount',
    })
  },
  startPlay: function(e) {
    if (app.globalData.canSee) {
      this.videoContext.play()
      //如果没有播放过，就发送到服务器
      if (this.isPlaying === null) {
        request.vedioPlay(this.detailId).then(res => {
          console.log("发送播放动作到服务成功")
        }).catch(res => {
          console.log("发送播放动作到服务失败：" + res)
        })
      }
      this.setData({
        isPlaying: true
      })
    } else {
      wx.navigateTo({
        url: '../unlock/invite',
      })
    }
  },
  stopPlay: function() {
    this.videoContext.stop()
    this.setData({
      isPlaying: false
    })
  },
  rating: function(e) {
    this.setData({
      hideModal: false
    })
  },
  modalConfirm: function(e) {
    console.log("点击了提交" + this.data.key + "分")
  },
  modalCancel: function(e) {
    console.log('点击了取消')
    this.setData({
      hideModal: true
    })
  },
  //点击左边,半颗星
  selectLeft: function(e) {
    console.log("点击左边,半颗星")
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    this.setData({
      key: key
    })
  },
  //点击右边,整颗星
  selectRight: function(e) {
    console.log("点击右边,整颗星")
    var key = e.currentTarget.dataset.key
    this.setData({
      key: key
    })
  },
  uploadWorks: function(e) {
    wx.navigateTo({
      url: '../uploadworks/index',
    })
  },
  dolike: function(e) {
    var that = this;
    var detailId = this.data.data.detailInfo.detailId;
    console.log(detailId);
    request.like(detailId, function(res) {
      that.setData({
        likeNum: res.data.likeNum,
        hadLike: true
      })
    }, function(res) {
      util.showToast(res, 'none', 2000)
    })
  },
  fenxiang: function(e) {
    this.stopPlay()
    this.drawInit('', '')
  },
  // 绘制数据初始化
  drawInit(bgImageUrl, qrCode) {
    this.setData({
      dataList: {
        canvasData: {
          type: 'image',
          url: 'https://avatars0.githubusercontent.com/u/28439412?s=460&v=4',
          width: 1300,
          height: 1500,
          comment: '背景图',
          btnText: '保存至相册'
        },
        content: [{
            type: 'image',
            url: 'https://avatars0.githubusercontent.com/u/28439412?s=460&v=4',
            top: 20,
            left: 20,
            shape: 'circle',
            width: 50,
            height: 50,
            comment: '头像'
          },
          {
            type: 'text',
            content: '来自的分享',
            top: 55,
            left: 90,
            fontSize: 18,
            lineHeight: 40,
            color: '#000000',
            textAlign: 'left',
            weight: 'bold'
          },
          {
            type: 'text',
            content: '长按上面二维码识别小程序',
            top: 400,
            left: 50,
            fontSize: 20,
            lineHeight: 40,
            color: '#f00',
            textAlign: 'left',
            weight: 'bold'
          }
        ]
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let base64 = wx.arrayBufferToBase64('../../image/ic_xuanfukuang.png');
    this.data.bgImage = 'data:image/jpg;base64,' + base64;
    console.log(this.data.bgImage)
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
    return {
      title: this.data.data.detailInfo.title,
      path: util.getCurrentPageUrl() + '?id=' + this.detailId
    }
  }
})
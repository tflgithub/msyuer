// pages/detail/detail.js
const WxParse = require('../../wxParse/wxParse.js');
const request = require('../../utils/wxRequest.js');
const api = require('../../api/config.js').api;
const wxapi = require("../../api/base.js").wxapi;
const util = require('../../utils/util.js');
import pageState from '../../common/pageState/pageState.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseInfo: {
      "phoUrl": "../../image/share.png",
      "title": "16.23",
      "videoUrl": "http://ddsfgrfdsg",
      "adUrl": "http://ddsfgrfdsg",
      "courseId": "22222222",
      "price": "2366",
      "oriPrice": "9999",
      "learnNum": "9999",
      "likeNum": "1266",
      "score": "4.3",
      "hadFee": false,
      "hadLike": true,
      "hadScore": true
    },
    summaryInfo: {},
    workInfo: {},
    teacherInfo: {},
    pptInfo: {},
    videoContext: null,
    likeNum: '1',
    hadLike: '',
    hadFee: false,
    hadScore: false,
    isPlaying: null,
    showCover: true,
    worksList: [],
    hideModal: true,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../image/ic_star_normal.png',
    selectedSrc: '../../image/ic_star_full.png',
    halfSrc: '../../image/ic_star_half.png',
    key: 5, //评分
    bgImage: null,
    evaluate: [{
      id: 1,
      text: '很难做',
      checked: false
    }, {
      id: 2,
      text: '步骤不对',
      checked: false
    }, {
      id: 3,
      text: '口感不对',
      checked: false
    }, {
      id: 4,
      text: '非常完美',
      checked: false
    }, {
      id: 5,
      text: '一般吧',
      checked: false
    }],
    currentData: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("传入" + options.id)
    this.videoContext = wx.createVideoContext('myVideo')
    this.setData({
      detailId: options.id
    })
    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: systemInfo.windowHeight,
      currentType: options.id ? options.id : 0
    })
    pageState(this).finish()
    //this.loadData()
  },
  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  buy: function(e) {
    var that = this
    wxapi('getSetting').then(res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.navigateTo({
          url: '../auth/auth'
        })
      } else {
        //手机绑定才能支付
        if (wx.getStorageInfoSync('setUserInfo') == 1) {
          request.fetch(api.pay, {
            courseId: that.data.courseInfo.courseId
          }).then(res => {
            var postData = {
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.packages,
              'paySign': res.data.paySign,
              'signType': res.data.signType
            }
            console.log("支付参数：" + JSON.stringify(postData))
            wxapi('requestPayment', postData).then(res => {
              that.setData({
                hadFee: true
              })
            }).catch(e => {
              util.showToast('支付失败', 'none', 2000)
            })
          }).catch(e => {
            util.showToast(e, 'none', 2000)
          })
        } else {
          wx.navigateTo({
            url: '../bindaccount/bindaccount'
          })
        }
      }
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    var that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  loadData: function() {
    var that = this;
    //pageState(that).loading()
    console.log("当前ID：" + this.data.detailId)
    // Promise.all([request.getVedioDetail(this.data.detailId), request.getRecommend(this.data.detailId)]).then(res => {
    //   pageState(that).finish()
    //   //华为手机有个BUG 必须在 html2json.js 112 行 119 注释console.dir(value),为防止出现意外的坑这里try catch 一下。
    //   try {
    //     WxParse.wxParse('article', 'html', res[0].data.detailInfo.summary, that, 5)
    //   } catch (e) {
    //     console.log(e)
    //   }
    //   that.setData({
    //     data: res[0].data,
    //     likeNum: res[0].data.detailInfo.likeNum,
    //     hadLike: res[0].data.detailInfo.hadLike,
    //     hadScore: res[0].data.detailInfo.hadScore,
    //     videoType: that.setVideoType(res[0].data.detailInfo.sizeType),
    //     isBindMobile: res[0].data.setUserInfo,
    //     recommendList: res[1].data.recommendList
    //   })
    // }).catch(res => {
    //    pageState(this).error('出错啦～我们正在修复...')
    // })
  },
  loadWorks: function() {
    var that = this
    var postData = {
      courseId: this.data.courseInfo.courseId,
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
    }
    request.fetch(api.getWorks,postData).then(res => {
      that.setData({
        currentPage: res.data.lastStamp,
        haveNext: res.data.haveNext,
        worksList: res.data.items,
        toView: that.data.jumpTo
      })
      for (var i in res.data.items) {
        that.data.worksList[i].ellipsis = false; // 添加新属性
      }
      that.setData({
        worksList: that.data.worksList
      })
    }).catch(res => {})
  },
  loadMoreWorks: function() {
    var that = this
    var postData = {
      courseId: this.data.courseInfo.courseId,
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
    }
    request.fetch(api.getWorks, postData).then(res => {
      that.setData({
        showLoading: false
      })
      var list = that.data.worksList;
      list = list.concat(res.data.items);
      that.setData({
        worksList: list,
        haveNext: res.data.haveNext,
        currentPage: res.data.lastStamp
      })
    }).catch(res => {
      that.setData({
        showLoading: false
      })
      util.showToast(res, 'none', 2000)
    })
  },
  onRetry: function() {
    this.loadData()
  },
  startPlay: function(e) {
    this.videoContext.play()
    this.setData({
      isPlaying: true
    })
  },
  stopPlay: function() {
    this.videoContext.stop()
    this.setData({
      isPlaying: false
    })
  },
  evaluateSelection(e) {
    var selectedEvaluate = []
    var index = e.currentTarget.dataset.index
    for (let i = 0; i < this.data.evaluate.length; i++) {
      var item = this.data.evaluate[i]
      if (i === index) {
        if (item.checked) {
          item.checked = false
        } else {
          item.checked = true
        }
      }
      selectedEvaluate.push(item)
    }
    this.setData({
      evaluate: selectedEvaluate
    })
  },
  rating: function(e) {
    if (this.data.isBindMobile != 1) {
      this.bindaccount()
      return
    }
    if (this.data.hadScore) {
      util.showToast('您已经评过分啦～', 'none', 2000)
      return
    }
    this.setData({
      hideModal: false
    })
  },
  modalConfirm: function(e) {
    console.log("点击了提交" + this.data.key + "分")
    var evaluate = []
    for (let i = 0; i < this.data.evaluate.length; i++) {
      var item = this.data.evaluate[i]
      if (item.checked) {
        evaluate.push(item.id)
      }
    }
    var postData = {
      courseId: this.data.courseInfo.courseId,
      score: this.data.key,
      evaluate: evaluate
    }
    request.fetch(api.score, postData).then(res => {
      util.showToast('评分成功', 'none', 2000)
    }).catch(res => {
      util.showToast(res, 'none', 2000)
    })
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
      url: '../uploadworks/index?id=' + this.data.courseInfo.courseId + '&title=' + this.data.courseInfo.title,
    })
  },
  dolike: function(e) {
    var that = this;
    request.fetch(api.like, {
      courseId: this.data.courseInfo.courseId
    }).then(res => {
      that.setData({
        likeNum: res.data.likeNum,
        hadLike: true
      })
      util.showToast('已收藏', 'none', 2000)
    }).catch(res => {
      util.showToast(res, 'none', 2000)
    })
  },
  unlike: function(e) {
    var that = this;
    request.unlike(api.unlike, {
      courseId: this.data.courseInfo.courseId
    }).then(res => {
      that.setData({
        likeNum: res.data.likeNum,
        hadLike: false
      })
      util.showToast('取消收藏', 'none', 2000)
    }).catch(res => {
      util.showToast(res, 'none', 2000)
    })
  },
  previewImage: function(e) {
    var current = e.target.dataset.src
    var index = e.currentTarget.dataset.bindex
    var imageUrls = this.data.worksList[index].workUrls
    console.log(index)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imageUrls // 需要预览的图片http链接列表
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.worksList.length === 0) {
      return
    }
    if (this.data.haveNext) {
      this.setData({
        showLoading: true
      })
      this.loadMoreWorks()
    } else {
      if (!this.data.showNoMore) {
        this.setData({
          showNoMore: true
        })
      }
    }
  }
})
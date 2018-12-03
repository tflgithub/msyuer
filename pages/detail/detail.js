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
    videoUrl: null,
    top: 0,
    radioValues: [{
        'value': '老师讲的不清楚',
        'selected': false
      },
      {
        'value': '步骤不对',
        'selected': false
      },
      {
        'value': '口感不对',
        'selected': false
      },
      {
        'value': '非常完美',
        'selected': true
      },
      {
        'value': '配方不对',
        'selected': false
      }
    ],
    courseInfo: {},
    summaryInfo: {},
    workInfo: {},
    pptInfo: {},
    videoContext: null,
    likeNum: '12',
    hadLike: '',
    hadFee: true,
    hadScore: false,
    isPlaying: false,
    worksList: [],
    hideModal: true,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../image/ic_star_normal.png',
    selectedSrc: '../../image/ic_star_full.png',
    halfSrc: '../../image/ic_star_half.png',
    key: 5, //评分
    bgImage: null,
    currentData: 0,
    courseId: null,
    disabledBuy: false,
    workImages: [],
    isShowCoverView:true
  },
  radioChange: function(e) {
    var index = e.currentTarget.dataset.index;
    var arr = this.data.radioValues;
    for (var v in arr) {
      if (v == index) {
        arr[v].selected = true;
      } else {
        arr[v].selected = false;
      }
    }
    this.setData({
      radioValues: arr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log("传入" + options.id)
    this.videoContext = wx.createVideoContext('myVideo')
    this.setData({
      courseId: options.id
    })
    this.loadData()
    // wxapi('getNetworkType').then(res => {
    //   if ('wifi' == res.networkType) {
    //     that.startPlay();
    //   }
    // })
    wxapi('getSystemInfo').then(res => {
      if (res.platform == 'ios' || res.platform == "devtools") {
        that.setData({
          disabledBuy: true
        })
      }
    })
  },
  reload: function(e) {
    this.setData({
      courseId: e.currentTarget.dataset.id
    })
    this.loadData()
  },
  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  buy: function(e) {
    console.log(JSON.stringify(wx.getStorageSync('token')))
    var that = this
    wxapi('getSetting').then(res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.navigateTo({
          url: '../auth/auth'
        })
      } else {
        //手机绑定才能支付
        console.log(JSON.stringify(wx.getStorageSync('setUserInfo')))
        if (wx.getStorageSync('setUserInfo') == 1) {
          request.fetch(api.pay, {
            courseId: that.data.courseInfo.courseId
          }).then(res => {
            var postData = {
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.package,
              'paySign': res.data.sign,
              'signType': res.data.signType
            }
            console.log("支付参数：" + JSON.stringify(postData))
            wxapi('requestPayment', postData).then(res => {
              that.loadData()
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
    pageState(this).loading()
    request.fetch(api.getCourseDetail, {
      courseId: this.data.courseId
    }).then(data => {
      pageState(that).finish()
      try {
        WxParse.wxParse('article', 'html', data.data.summaryInfo.replace(/\<img/gi, '<img class="rich-img" '), that, 200)
        WxParse.wxParse('teacher_article', 'html', data.data.teacherInfo.summary.replace(/\<img/gi, '<img class="rich-img" '), that, 200)
        if (data.data.pptInfo.content) {
          WxParse.wxParse('ppt_article', 'html', data.data.pptInfo.content.replace(/\<img/gi, '<img class="rich-img" '), that, 200)
        }
      } catch (e) {
        console.log('富文本解析出错')
      }
      var images = []
      if (data.data.workInfo.items.length > 3) {
        for (var i = 0; i < 3; i++) {
          images.push(data.data.workInfo.items[i].phoUrl[0])
        }
      }
      var url = data.data.courseInfo.adUrl;
      if (data.data.courseInfo.hadFee) {
        url = data.data.courseInfo.videoUrl;
      }
      that.setData({
        workImages: images,
        videoUrl: url,
        courseInfo: data.data.courseInfo,
        likeNum: data.data.courseInfo.likeNum,
        hadFee: data.data.courseInfo.hadFee,
        hadLike: data.data.courseInfo.hadLike,
        hadScore: data.data.courseInfo.hadScore,
        summaryInfo: data.data.summaryInfo,
        workInfo: data.data.workInfo,
        teacherInfo: data.data.teacherInfo
      })
    }).catch(e => {
      pageState(this).error(e)
      console.log(JSON.stringify(e))
    })
  },
  onRetry: function() {
    this.loadData()
  },
  startPlay: function(e) {
    this.videoContext.play()
    this.videoContext.requestFullScreen({ direction: 90 })
    this.setData({
      isShowCoverView: false
    })
  },
  stopPlay: function() {
    this.videoContext.stop()
  },
  rating: function(e) {
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
    for (let i = 0; i < this.data.radioValues.length; i++) {
      var item = this.data.radioValues[i]
      if (item.selected) {
        evaluate.push(item.value)
        break;
      }
    }
    var postData = {
      courseId: this.data.courseInfo.courseId,
      score: this.data.key.toString(),
      evaluate: evaluate
    }
    var that = this
    request.fetch(api.score, postData).then(res => {
      util.showToast('评分成功', 'none', 2000)
      that.setData({
        hadScore: true
      })
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
    wxapi('getSetting').then(res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.navigateTo({
          url: '../auth/auth'
        })
      } else {
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
      }
    })
  },
  unlike: function(e) {
    var that = this;
    wxapi('getSetting').then(res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.navigateTo({
          url: '../auth/auth'
        })
      } else {
        request.fetch(api.unLike, {
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
      }
    })
  },
  moreWorks: function(e) {
    wx.navigateTo({
      url: 'works?id=' + this.data.courseInfo.courseId,
    })
  },
  previewImage: function(e) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.workImages[index],
      urls: this.data.workImages
    })
  },
  workLike: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    console.log('workId:' + id + 'index:' + index)
    var that = this;
    wxapi('getSetting').then(res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.navigateTo({
          url: '../auth/auth'
        })
      } else {
        var isLike = 'workInfo.items[' + index + '].isLike';
        var likeNum = 'workInfo.items[' + index + '].likeNum';
        request.fetch(api.workLike, {
          workId: id
        }).then(res => {
          that.setData({
            [isLike]: true,
            [likeNum]: res.data.likeNum
          })
        }).catch(res => {
          util.showToast(res, 'none', 2000)
        })
      }
    })
  },
  unWorkLike: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this;
    wxapi('getSetting').then(res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.navigateTo({
          url: '../auth/auth'
        })
      } else {
        var isLike = 'workInfo.items[' + index + '].isLike';
        var likeNum = 'workInfo.items[' + index + '].likeNum';
        request.fetch(api.workUnlike, {
          workId: id
        }).then(res => {
          that.setData({
            [isLike]: false,
            [likeNum]: res.data.likeNum
          })
        }).catch(res => {
          util.showToast(res, 'none', 2000)
        })
      }
    })
  },
  onscroll: function(e) {
    this.setData({
      top: e.detail.scrollTop
    })
  }
})
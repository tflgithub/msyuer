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
    likeNum: '1',
    hadLike: '',
    hadScore: false,
    isPlaying: null,
    showCover: true,
    recommendList: [],
    worksList: [],
    dataList: {},
    hideModal: true,
    detailId: null,
    isBindMobile: null,
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
    currentPage: 0,
    pageSize: 10,
    haveNext: false,
    showLoading: false,
    showNoMore: false,
    isTop: true,
    videoType: 'video',
    toView: null,
    jumpTo: '',
    hiddenBack: true
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
    if (options.from) {
      console.log(options.from)
      this.setData({
        jumpTo: options.from
      })
    }
    if (options.back) {
      this.setData({
        hiddenBack: false
      })
    }
    this.loadData()
  },
  loadData: function() {
    var that = this;
    pageState(that).loading()
    console.log("当前ID：" + this.data.detailId)
    Promise.all([request.getVedioDetail(this.data.detailId), request.getRecommend(this.data.detailId)]).then(res => {
      pageState(that).finish()
      //华为手机有个BUG 必须在 html2json.js 112 行 119 注释console.dir(value),为防止出现意外的坑这里try catch 一下。
      try {
        WxParse.wxParse('article', 'html', res[0].data.detailInfo.summary, that, 5)
      } catch (e) {
        console.log(e)
      }
      that.setData({
        data: res[0].data,
        likeNum: res[0].data.detailInfo.likeNum,
        hadLike: res[0].data.detailInfo.hadLike,
        hadScore: res[0].data.detailInfo.hadScore,
        videoType: that.setVideoType(res[0].data.detailInfo.sizeType),
        isBindMobile: res[0].data.setUserInfo,
        recommendList: res[1].data.recommendList
      })
    }).catch(res => {
      pageState(this).error('出错啦～我们正在修复...')
    })
  },
  loadWorks: function() {
    var that = this
    request.getAboutWorks(this.data.detailId, this.data.currentPage, this.data.pageSize).then(res => {
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
    }).catch(res => {

    })
  },
  loadMoreWorks: function() {
    var that = this
    request.getAboutWorks(this.data.detailId, this.data.currentPage, this.data.pageSize).then(res => {
      that.setData({
        showLoading: false
      })
      var list = that.data.worksList;
      list = list.concat(res.data.items);
      that.setData({
        worksList: list,
        haveNext: res.data.haveNext,
        currentPage: res.data.lastStamp,
        toView: that.data.jumpTo
      })
      console.log("内容：" + list)
      for (var i in list) {
        console.log(i)
        that.data.worksList[i].ellipsis = false; // 添加新属性
      }
      that.setData({
        workContents: that.data.worksList
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
  gotoDetail: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      detailId: id
    })
    this.loadData()
    this.loadWorks()
  },
  bindaccount: function() {
    wx.navigateTo({
      url: '../bindaccount/bindaccount?navigateBack=1',
    })
  },
  startPlay: function(e) {
    var that = this
    if (app.globalData.canSee) {
      this.videoContext.play()
      this.setData({
        isPlaying: true
      })
    } else {
      //如果没有播放过，就发送到服务器
      console.log(this.data.isPlaying)
      if (this.data.isPlaying === null) {
        request.vedioPlay(this.data.detailId).then(res => {
          if (res.data.canPlay) {
            that.videoContext.play()
            that.setData({
              isPlaying: true
            })
          } else if (res.data.needShareNum == res.data.sharedNum) {
            app.globalData.canSee = true
            that.videoContext.play()
            that.setData({
              isPlaying: true
            })
          } else {
            wx.navigateTo({
              url: '../unlock/invite',
            })
          }
        }).catch(res => {
          console.log("发送播放动作到服务失败：" + res)
          util.showToast(res, 'none', 2000)
        })
      } else {
        this.videoContext.play()
        this.setData({
          isPlaying: true
        })
      }
    }
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
    request.score(this.data.detailId, this.data.key, evaluate).then(res => {
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
    if (this.data.isBindMobile != 1) {
      this.bindaccount()
      return
    }
    wx.navigateTo({
      url: '../uploadworks/index?id=' + this.data.detailId + '&title=' + this.data.data.detailInfo.title,
    })
  },
  dolike: function(e) {
    var that = this;
    request.like(this.data.detailId).then(res => {
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
    request.unlike(this.data.detailId).then(res => {
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
  setVideoType: function(sizeType) {
    var videoType = ''
    switch (sizeType) {
      case 1:
        videoType = 'video'
        break;
      case 2:
        videoType = 'video_horizontal'
        break
      case 3:
        videoType = 'video_vertical'
    }
    console.log(sizeType + ':' + videoType)
    return videoType
  },
  ellipsis: function(e) {
    var idx = e.currentTarget.dataset.idx,
      key = "worksList[" + idx + "].ellipsis",
      val = this.data.worksList[idx].ellipsis
    this.setData({
      [key]: !val
    })
  },
  /*
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
    if (app.globalData.setUserInfo) {
      this.setData({
        isBindMobile: app.globalData.setUserInfo
      })
    }
    this.setData({
      currentPage: 0
    })
    this.loadWorks();
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
  goHome: function() {
    wx.reLaunch({
      url: '../home/home'
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
  },
  onScroll: function(e) {
    var top = e.detail.scrollTop
    if (top > 270 && this.data.isTop==true) {
      this.setData({
        isTop: false
      })
    } else if (top < 270 && this.data.isTop==false) {
      this.setData({
        isTop: true
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    if (this.data.isPlaying) {
      return {
        title: this.data.data.detailInfo.title,
        path: util.getCurrentPageUrl() + '?id=' + this.data.detailId + '&back=' + true
      }
    } else {
      return {
        title: this.data.data.detailInfo.title,
        imageUrl: '../../image/share.png',
        path: util.getCurrentPageUrl() + '?id=' + this.data.detailId + '&back=' + true
      }
    }
  }
})
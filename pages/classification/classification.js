// pages/classification/classification.js
const api = require('../../api/config.js').api
const request = require('../../utils/wxRequest.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryType: [{
        name: "蛋糕",
        page: 0
      },
      {
        name: "甜点",
        page: 0
      },
      {
        name: "面包",
        page: 0
      },
      {
        name: "西餐",
        page: 0
      }
    ],
    currentType: 0,
    list: [
      [],
      [],
      [],
      [],
      []
    ],
    windowHeight: '',
    currentPage: [{}, {}, {}, {}, {}],
    haveNext: [false, false, false, false],
    pageSize: 10
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList();
    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: systemInfo.windowHeight,
      currentType: options.id ? options.id : 0
    })
  },
  bindChange: function(e) {
    this.setData({
      currentType: e.detail.current
    })
    if (!this.data.list[e.detail.current].length)
      this.getList();
  },
  getList() {
    //wx.showLoading();
    var that = this;
    var postData = {
      st: [that.data.currentType],
      lastStamp: that.data.currentPage[that.data.currentType],
      pageSize: that.data.pageSize
    };
    var _page = that.data.categoryType[that.data.currentType].page + 1;
    var param = {},
      str1 = "list[" + that.data.currentType + "]",
      str2 = 'categoryType[' + that.data.currentType + '].page',
      str3 = "currentPage[" + that.data.currentType + "]",
      str4 = "haveNext[" + that.data.currentType + "]";
    param[str1] = [{
      "course": {
        "title": "课程名称多少啊打撒的撒多少啊多少啊多少啊",
        "phoUrl": "../../image/share.png",
        "courseId": "34235",
        "price": "126.6",
        "learnNum": "2356",
        "score": "4.8",
      },
      "teacher": {
        "id": "123",
        "avatarUrl": "老师头像",
        "name": "老师名称",
        "summary": "讲师"
      }
    },
      {
        "course": {
          "title": "课程名称多少的撒打算的",
          "phoUrl": "../../image/share.png",
          "courseId": "34235",
          "price": "126.6",
          "learnNum": "2356",
          "score": "4.8",
        },
        "teacher": {
          "id": "123",
          "avatarUrl": "老师头像",
          "name": "老师名称",
          "summary": "讲师"
        }
      }]
    that.setData(param);
    // request.fetch(api.getCoursesCategory, postData).then(data => {
    //   wx.hideLoading();
    //   param[str1] = data.data.items;
    //   param[str2] = _page;
    //   param[str3] = data.data.lastStamp
    //   param[str4] = data.data.haveNext
    //   that.setData(param);
    // }).catch(e => {
    //   wx.hideLoading();
    //   param[str1] = [];
    //   that.setData(param);
    // })
  },
  // 点击tab切换 
  swichNav: function(res) {
    if (this.data.currentType == res.detail.currentNum) return;
    this.setData({
      currentType: res.detail.currentNum
    })
  },
  bindChange: function(e) {
    this.setData({
      currentType: e.detail.current
    })
    if (!this.data.list[e.detail.current].length)
      this.getList();
  },
  scrolltolower:function(e){
    if (this.data.haveNext[this.data.currentType]) {
      return
    }
    this.getList()
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
// pages/home.js
const request = require('../../utils/wxRequest.js')
const api=require('../../api/config.js').api
import pageState from '../../common/pageState/pageState.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
      bestCourses:null,
      newCourses:null
  },
  goTeacherDetail: function(e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  goCoursesDetail:function(e){
    wx.navigateTo({
        url: `../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    pageState(this).finish()
    this.setData({
      bestCourses:{
        "name": "今日最佳",
        "list": [
          {
            "course": {
              "title": "课程名称1",
              "phoUrl": "../../image/share.png",
              "courseId": "34235"
            },
            "teacher": {
              "id": "123",
              "avatarUrl": "老师头像",
              "name": "老师名称",
              "title": "米其林厨师"
            }
          },
          {
            "course": {
              "title": "课程名称2",
              "phoUrl": "../../image/share.png",
              "courseId": "34235"
            },
            "teacher": {
              "id": "123",
              "avatarUrl": "老师头像",
              "name": "老师名称",
              "title": "米其林厨师"
            }
          }
        ]
      },
      newCourses: {
        "name": "最新课程",
        "list": [
          {
            "course": {
              "title": "课程名称",
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
              "title": "米其林厨师",
              "grade": "讲师"
            }
          },
          {
            "course": {
              "title": "课程名称",
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
              "title": "米其林厨师",
              "grade": "讲师"
            }
          }
        ]}
    })
    //this.onRetry()
  },
  onRetry: function() {
    this.loadData()
  },
  loadData: function() {
    pageState(this).loading()
    var that = this;
    request.fetch(api.index).then(data=>{
      pageState(that).finish()
      that.bestCourses=data.data.items[0]
      that.newCourses=data.data.items[1]
    }).catch(e=>{
      pageState(this).error(e)
    })
  }
})
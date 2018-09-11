const app = getApp()
//公共请求方法  仅支持post
function request(obj) {
  app.globalData.token = wx.getStorageSync('token')
  if (app.globalData.token === null) {
    login().then(res => {
      doRequest(obj)
    })
  } else {
    doRequest(obj)
  }
}

//发起服务器请求
function doRequest(obj) {
  console.log("实际请求token:" + app.globalData.token)
  console.log("请求地址:" + obj.url)
  console.log("请求参数:" + JSON.stringify(obj.data))
  var header = obj.header || {}
  header['content-type'] = 'application/json'
  header['ms-token'] = app.globalData.token
  if (obj.message) {
    wx.showLoading({
      title: obj.message,
      mask: true
    })
  }
  wx.request({
    url: obj.url,
    data: obj.data || {},
    method: 'post',
    header: header,
    success: function(res) {
      if (obj.message) {
        wx.hideLoading()
      }
      if (res.data.code === 403) {
        console.log("token失效：" + JSON.stringify(res.data))
        login().then(res => {
          getCurrentPages()[getCurrentPages().length - 1].onLoad()
        })
      } else if (res.data.code === 0) {
        console.log("响应报文：" + JSON.stringify(res.data))
        obj.success(res.data)
      } else {
        console.log("请求失败返回：" + JSON.stringify(res))
        obj.fail(res.data.msg)
      }
    },
    fail: function(res) {
      if (obj.message) {
        wx.hideLoading()
      }
      if (app.globalData.netWorkType === 'none') {
        obj.fail('请检查您的网络连接')
      } else {
        obj.fail('糟糕,服务器开小差了~')
      }
    }
  })
}

export function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          console.log("登录成功：" + res.code);
          wx.request({
            url: `${app.globalData.API_URL}/api/wxa/v1/login/wxCode`,
            method: 'post',
            data: {
              code: res.code,
              nickName: app.globalData.userInfo.nickName,
              avatarUrl: app.globalData.userInfo.avatarUrl
            },
            success: function(res) {
              console.log("登录：" + JSON.stringify(res))
              if (res.data.code === 0) {
                app.globalData.token = res.data.data.token
                wx.setStorageSync('token', res.data.data.token)
                app.globalData.setUserInfo = res.data.data.setUserInfo
                app.globalData.canSee = res.data.canSee
                app.globalData.hadMsg = res.data.hadMsg
                resolve('登录成功')
              }
            },
            fail: function(res) {
              console.log("登录失败：" + JSON.stringify(res))
              reject('登录失败')
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  })
}
/**
 * 获取短信验证码
 */
export function getPassCode(mobile, resolve, reject) {
  request({
    message: "正在获取验证码",
    url: `${app.globalData.API_URL}/api/wxa/v1/login/getSmsCode`,
    data: {
      mobile: mobile
    },
    success: resolve,
    fail: reject
  })
}

/**
 * 获取小程序二维码
 */
export function getWxQrCode(type, path, width) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/login/wxaQrCode`,
      data: {
        type: type,
        page: path,
        width: width
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 *  验证短信验证
 */
export function vailPassCode(mobile, msgCode, resolve, reject) {
  request({
    message: "正在校验验证码",
    url: `${app.globalData.API_URL}/api/wxa/v1/login/checkSmsCode`,
    data: {
      mobile: mobile,
      code: msgCode
    },
    success: resolve,
    fail: reject
  })
}

/**
 * 注册
 */
export function register(mobile, msgCode, uid) {
  return new Promise(function(resolve, reject) {
    request({
      message: "正在注册...",
      url: `${app.globalData.API_URL}/api/wxa/v1/user/register`,
      data: {
        mobile: mobile,
        code: msgCode,
        shareUid: uid
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取首页bar
 */
export function getHomeBar() {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/video/indexBar`,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 今日推荐
 */
export function getTodayRecommend() {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/video/todayRecommend`,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 热门列表
 */
export function getHotList(lastTimeStamp, pageSize) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/video/hotlist`,
      data: {
        lastTimeStamp: lastTimeStamp,
        pageSize: pageSize
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 最新列表
 */
export function getNewList(lastTimeStamp, pageSize) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/video/newlist`,
      data: {
        lastTimeStamp: lastTimeStamp,
        pageSize: pageSize
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 烹饪方式列表
 */
export function getIndex() {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/video/index`,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 推荐
 */
export function getRecommend(id) {
  return new Promise(function(resolve, reject) {
    request({
      data: {
        detailId: id
      },
      url: `${app.globalData.API_URL}/api/wxa/v1/video/recommend`,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取视频列表
 */
export function getVedioList(st, mt, nextPage, pageSize, resolve, reject) {
  var message = null
  if (nextPage === 0) {
    message = "正在加载..."
  }
  request({
    message: message,
    url: `${app.globalData.API_URL}/api/wxa/v1/video/list`,
    data: {
      st: st,
      mt: mt,
      lastTimeStamp: nextPage,
      pageSize: pageSize
    },
    success: resolve,
    fail: reject
  })
}

/**
 * 获取视频详情
 */
export function getVedioDetail(id) {
  return new Promise(function(resolve, reject) {
    request({
      message: "正在加载...",
      url: `${app.globalData.API_URL}/api/wxa/v1/video/detail`,
      data: {
        detailId: id
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 视频点赞收藏
 */
export function like(id) {
  return new Promise(function(resolve, reject) {
    request({
      message: "正在提交...",
      url: `${app.globalData.API_URL}/api/wxa/v1/video/like`,
      data: {
        detailId: id
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 取消点赞收藏
 */
export function unlike(id) {
  return new Promise(function(resolve, reject) {
    request({
      message: "正在提交...",
      url: `${app.globalData.API_URL}/api/wxa/v1/video/unlike`,
      data: {
        detailId: id
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取当前登录用户信息
 */
export function getUserInfo() {
  return new Promise(function(resolve, reject) {
    request({
      message: "正在加载",
      url: `${app.globalData.API_URL}/api/wxa/v1/user/getUserInfo`,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取用户点赞收藏列表
 */
export function getUserLikes(currentPage, pageSize) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/user/getUserLikes`,
      data: {
        lastStamp: currentPage,
        pageSize: pageSize
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取当前登录用户作品列表
 */
export function getUserWorks(currentPage, pageSize) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/user/getUserWorks`,
      data: {
        lastStamp: currentPage,
        pageSize: pageSize
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取当前登录用户作品的消息列表
 */
export function getUserWorkMsgs(currentPage, pageSize) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/user/getUserWorkMsgs`,
      data: {
        lastStamp: currentPage,
        pageSize: pageSize
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取当前登录用户被助力解锁信息
 */
export function getHelpInfo() {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/user/getUserNeedHelp`,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 用来判断当前登录用户是否已经助力解锁过
 * param:uid 需要被助力的用户id
 */
export function isHelp(uid) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/user/isHelp`,
      data: {
        uid: uid
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 助力解锁  
 * param:uid 需要被助力的用户id
 */
export function help(uid) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/user/help`,
      data: {
        uid: uid
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 评分
 * param:id 视频id score 分数  evaluate 评价内容
 */
export function score(id, score, evaluate) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/user/help`,
      data: {
        detailId: id,
        score: score,
        evaluate: evaluate
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 播放视频
 */
export function vedioPlay(id) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/video/play`,
      data: {
        detailId: id
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 发布作品
 * param:id 相关菜谱视频ID  content:内容  urls: 上传完成的图片（支持多张，最多6张）
 */
export function publishWorks(id, content, urls) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/video/works`,
      data: {
        detailId: id,
        content: content,
        urls: urls
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 删除已发布的作品
 */
export function deleteWork(id) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/user/deleteWorks`,
      data: {
        workId: id
      },
      success: resolve,
      fail: reject
    })
  })
}
/**
 * 获取当前菜谱视频相关的作品列表
 */
export function getAboutWorks(id, currentPage, pageSize) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/video/worksList`,
      data: {
        detailId: id,
        lastStamp: currentPage,
        pageSize: pageSize
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取七牛的token 用来上传图片
 */
export function getQiniuToken() {
  return new Promise(function(resolve, reject) {
    request({
      url: `${app.globalData.API_URL}/api/wxa/v1/tools/qiniuToken`,
      success: resolve,
      fail: reject
    })
  })
}
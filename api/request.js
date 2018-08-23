const app = getApp()
//公共请求方法  仅支持post
function request(obj) {
  if (app.globalData.netWorkType === 'none') {
    wx.showToast({
      title: '无网络连接',
      icon: 'none'
    })
    return
  }
  checkLoginStatus(obj);
}

//检查登录状态
function checkLoginStatus(obj) {
  app.getLoginStatus(function(res) {
    console.log("获取token:" + res.data.token)
    console.log("获取绑定状态:" + res.data.setUserInfo)
    app.globalData.setUserInfo = res.data.setUserInfo
    obj.token = res.data.token
    doRequest(obj)
  }, function(res) {
    console.log("获取登录状态失败，重新登录")
    relogin()
  })
}

//发起服务器请求
function doRequest(obj) {
  console.log("实际请求token:" + obj.token)
  console.log("请求地址:" + obj.url)
  console.log("请求参数:" + JSON.stringify(obj.data))
  var header = obj.header || {}
  header['content-type'] = 'application/json'
  header['ms-token'] = obj.token
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
        relogin()
      } else if (res.data.code === 0) {
        console.log("响应报文：" + JSON.stringify(res.data))
        obj.success(res.data)
      } else {
        console.log("请求失败返回：" + JSON.stringify(res))
        obj.fail(res.data.msg)
      }
    },
    fail: function(res) {
      if (obj.message != "") {
        wx.hideLoading()
      }
      wx.showToast({
        title: '糟糕,服务器开小差了~',
        icon: 'none'
      })
    }
  })
}

function relogin() {
  wx.login({
    success: function(res) {
      if (res.code) {
        console.log("登录成功：" + res.code);
        wx.request({
          url: `${app.globalData.API_URL}/api/wxa/v1/login/wxCode`,
          method: 'post',
          data: {
            code: res.code
          },
          success: function(res) {
            console.log("登录：" + JSON.stringify(res))
            if (res.data.code === 0) {
              wx.clearStorage();
              wx.setStorage({
                key: 'loginStatus',
                data: res.data.data,
                success: function(res) {
                  getCurrentPages()[getCurrentPages().length - 1].onLoad()
                },
                fail: function(res) {
                  console.log("保存登录状态失败：" + JSON.stringify(res))
                }
              })
            }
          },
          fail: function(res) {
            console.log("登录失败：" + JSON.stringify(res))
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
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
 * 注册宝宝信息
 */
export function register(mobile, msgCode, nickName, birthDay, sex, resolve, reject) {
  request({
    message: "正在注册...",
    url: `${app.globalData.API_URL}/api/wxa/v1/user/register`,
    data: {
      mobile: mobile,
      code: msgCode,
      nickName: nickName,
      birthDay: birthDay,
      sex: sex
    },
    success: resolve,
    fail: reject
  })
}

/**
 * 获取宝宝信息
 */
export function getBabyInfo(resolve, reject) {
  request({
    message: "正在加载...",
    url: `${app.globalData.API_URL}/api/wxa/v1/user/getBabyInfo`,
    data: null,
    success: resolve,
    fail: reject
  })
}

/**
 * 获取首页bar
 */
export function getHomeBar(resolve, reject) {
  request({
    url: `${app.globalData.API_URL}/api/wxa/v1/video/indexBar`,
    success: resolve,
    fail: reject
  })
}

/**
 * 获取首页推荐等数据
 */
export function getHomeVedio(resolve, reject) {
  request({
    message: "正在加载...",
    url: `${app.globalData.API_URL}/api/wxa/v1/video/index`,
    success: resolve,
    fail: reject
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
export function getVedioDetail(id, resolve, reject) {
  request({
    message: "正在加载...",
    url: `${app.globalData.API_URL}/api/wxa/v1/video/detail`,
    data: {
      detailId: id
    },
    success: resolve,
    fail: reject
  })
}

/**
 * 视频点赞
 */
export function like(id, resolve, reject) {
  request({
    message: "正在提交...",
    url: `${app.globalData.API_URL}/api/wxa/v1/video/like`,
    data: {
      detailId: id
    },
    success: resolve,
    fail: reject
  })
}

export function getUserInfo(resolve, reject) {
  request({
    message: "正在加载",
    url: `${app.globalData.API_URL}/api/wxa/v1/user/getUserInfo`,
    success: resolve,
    fail: reject
  })
}
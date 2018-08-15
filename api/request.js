const app = getApp()
/**
 * 获取短信验证码
 */
export function getPassCode(mobile, resolve,reject) {
  app.request({
    message: "正在获取验证码...",
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
export function vailPassCode(mobile, msgCode, resolve,reject) {
  app.request({
    message: "正在校验验证码...",
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
  app.request({
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
  app.request({
    message: "正在获取宝宝信息...",
    url: `${app.globalData.API_URL}/api/wxa/v1/user/getBabyInfo`,
    data: null,
    success: resolve,
    fail: reject
  })
}

/**
 * 获取首页bar
 */
export function getHomeBar(resolve,reject) {
  app.request({
    url: `${app.globalData.API_URL}/api/wxa/v1/video/indexBar`,
    success: resolve,
    fail: reject
  })
}

/**
 * 获取首页推荐等数据
 */
export function getHomeVedio(resolve, reject) {
  app.request({
    message: "正在加载...",
    url: `${app.globalData.API_URL}/api/wxa/v1/video/index`,
    success: resolve,
    fail: reject
  })
}


/**
 * 获取视频列表
 */
export function getVedioList(st, mt, nextPage,pageSize, resolve, reject) {
  app.request({
    message: "正在加载...",
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
  app.request({
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
  app.request({
    message: "正在提交...",
    url: `${app.globalData.API_URL}/api/wxa/v1/video/like`,
    data: {
      detailId: id
    },
    success: resolve,
    fail:reject
  })
}
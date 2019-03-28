const api = {
  image_url: 'https://v.miskitchen.com',
  base_url: 'http://test.miskitchen.com',
  login: '/apikt/wxa/v1/login/wxCode',
  getCoursesCategory:'/apikt/wxa/v1/course/list',
  getRecommends:'/apikt/wxa/v1/course/rcmdList',
  getCourseDetail:'/apikt/wxa/v1/course/detail',
  getUserInfo:'/apikt/wxa/v1/user/getUserInfo',
  getCourseWorks:'/apikt/wxa/v1/course/workList',
  getUserWorks:'/apikt/wxa/v1/user/getWorkList',
  publicWork:'/apikt/wxa/v1/course/work',
  getWorks:'/apikt/wxa/v1/work/list',
  getWorkDetail:'/apikt/wxa/v1/work/detail',
  deleteWork: '/apikt/wxa/v1/user/deleteWork',
  getQiuniuToken:'/apikt/wxa/v1/tools/qiniuToken',
}
module.exports = { api }

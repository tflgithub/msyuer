const api = {
  image_url: 'https://v.miskitchen.com',
  base_url: 'http://test.miskitchen.com',
  login: '/apikt/wxa/v1/login/wxCode',
  getSmsCode:'/apikt/wxa/v1/login/getSmsCode',
  register:'/apikt/wxa/v1/user/register',
  index:'/apikt/wxa/v1/home/index',
  getCoursesCategory:'/apikt/wxa/v1/course/list',
  getCourseDetail:'/apikt/wxa/v1/course/detail',
  getUserInfo:'/apikt/wxa/v1/user/getUserInfo',
  getUserLikes:'/apikt/wxa/v1/user/getUserLikes',
  getUserBuyCourses:'/apikt/wxa/v1/user/getUserBuyCourses',
  getUserWorks:'/apikt/wxa/v1/user/getWorks',
  deleteWorks:'/apikt/wxa/v1/user/deleteWorks',
  like:'/apikt/wxa/v1/course/like',
  unLike:'/apikt/wxa/v1/course/unlike',
  score:'/apikt/wxa/v1/course/score',
  publicWork:'/apikt/wxa/v1/course/work',
  getWorks:'/apikt/wxa/v1/course/workList',
  workLike:'/apikt/wxa/v1/work/like',
  workUnlike:'/apikt/wxa/v1/work/unlike',
  getTeachers:'/apikt/wxa/v1/teacher/list',
  getTeacherCourses:'/apikt/wxa/v1/teacher/courseList',
  getQiuniuToken:'/apikt/wxa/v1/tools/qiniuToken',
  pay:'/apikt/wxa/v1/tools/pay'
}
module.exports = { api }
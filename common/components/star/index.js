// common/components/star/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    key: 5,
    list: [0, 1, 2, 3, 4],
    normalSrc: '../../../image/ic_star_normal.png',
    selectedSrc: '../../../image/ic_star_full.png',
    halfSrc: '../../../image/ic_star_half.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectLeft: function (e) {
      var key = e.currentTarget.dataset.key
      if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
        //只有一颗星的时候,再次点击,变为0颗
        key = 0;
      }
      this.setData({
        key: e.currentTarget.dataset.key
      })
      this.triggerEvent('selectLeft', {
        key: e.currentTarget.dataset.key
      })
    },
    selectRight: function (e) {
      var key = e.currentTarget.dataset.key
      this.setData({
        key: e.currentTarget.dataset.key
      })
      this.triggerEvent('selectRight', {
        key: e.currentTarget.dataset.key
      })
    }
  }
})

// common/components/customModal/shareModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideModal: {
      type: Boolean,
      value: true
    },
    height: {
      type: String,
      value: '80%'
    },
    width: {
      type: String,
      value: '80%'
    },
    left: {
      type: String,
      value: '取消'
    },
    right: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.setData({
        hideModal: true
      })
      this.triggerEvent('cancel')
    },
    confirm(){
      this.setData({
        hideModal: true
      })
      this.triggerEvent('confirm')
    }
  }
})

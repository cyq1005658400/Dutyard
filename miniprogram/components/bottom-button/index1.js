import { language } from '../../utils/conf.js'

let buttons = []

// 按钮配置
language.forEach(item=>{
  buttons.push({
    buttonText: item.lang_name,
    lang: item.lang_content,
    lto: item.lang_to[0],
    msg: item.hold_photo,
    buttonType: 'normal',
  })
})

// 按钮对应图片
let buttonBackground = {
  zh_CN: {
    normal: '../../image/button_zh.png',
    press: '../../image/button_zh_press.png',
    disabled: '../../image/button_zh_disabled.png',
  },
  en_US: {
    normal: '../../image/button_en.png',
    press: '../../image/button_en_press.png',
    disabled: '../../image/button_en_disabled.png',
  }
}
Component({
  properties: {
  },

  data: {
    buttons: buttons,
    buttonBackground: buttonBackground,
    currentButtonType: 'normal',
  },

  ready: function () {
    // console.log(this.data.buttonEvent,)
  },

  methods: {

    /**
     * 修改按钮样式
     */
    tap(e) {

      let currentButtonConf = e.currentTarget.dataset.conf
      console.log("click", currentButtonConf)

      this.triggerEvent('click', {
        buttonItem: currentButtonConf
      })
    },
  }
});
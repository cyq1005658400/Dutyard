//app.js

const utils = require('./utils/util.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    //获得系统信息
    wx.getSystemInfo({
      success: (e) => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      },
    })
  },
  // 权限询问
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        console.log("succ")
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("succ auth")
            },
            fail() {
              console.log("fail auth")
            }
          })
        } else {
          console.log("record has been authed")
        }
      },
      fail(res) {
        console.log("fail")
        console.log(res)
      }
    })
  },

  onHide: function () {
    wx.stopBackgroundAudio()
  },
  globalData: {
  }
})
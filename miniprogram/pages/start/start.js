const app = getApp()

Page({
  data: {
    swiper_num: '',
    judge: '',
    windowHeight: "",
    windowWidth: "",
    button_height: "",
    fun_info: [{
        class: "timetable",
        icon: "add-friends",
        title: "校园圈子"
      },
      {
        class: "wrong",
        icon: "time",
        title: "在线课表"
      },
      {
        class:"booknote",
        icon:"note",
        title:"学习笔记"
      },
      {
        class:"clock",
        icon:"done2",
        title:"同声传译"
      }
    ]
  },
  function1: function () {
    if (this.data.judge == 1) {
      wx.navigateTo({
        url: '../web/web',
      })
    } else {
      wx.showToast({
        title: '尚未开发',
        icon: "error"
      })
    }
  },
  function2: function () {
    wx.navigateTo({
      url: '../time/time',
    })
  },
  function3: function () {
    wx.navigateTo({
      url: '../list/list',
    })
  },
  function4: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  onLoad: function (options) {
    var that = this
    //获取信息
    wx.getSystemInfo({
      success(res) {
        console.log("res.model")
        console.log(res.model)
        console.log("res.pixelRatio")
        console.log(res.pixelRatio)
        console.log("res.windowWidth")
        console.log(res.windowWidth)
        console.log("res.windowHeight")
        console.log(res.windowHeight)
        that.setData({
          windowWidth: res.windowWidth
        })
        that.setData({
          windowHeight: res.windowHeight
        })
        var button_height = res.windowHeight * 750 / res.windowWidth - 615
        that.setData({
          button_height: button_height
        })
        console.log("res.language")
        console.log(res.language)
        console.log("res.version")
        console.log(res.version)
        console.log("res.platform")
        console.log(res.platform)
      }
    })
    wx.cloud.init()

    const db = wx.cloud.database()
    db.collection('start_data')
      .where({
        name: "swiper_num"
      })
      .get({
        success: function (res) {
          console.log(res.data)
          console.log(res.data[0].value)
          that.setData({
            swiper_num: res.data[0].value,
            judge: res.data[0].judge
          })
        }
      })
  }
})
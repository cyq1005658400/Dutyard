Page({
  data: {
    title: "",
    content: "",
    newsid: "",
    img: [],
    cTime: "",
    items: [{
        name: '0',
        value: '数学'
      },
      {
        name: '1',
        value: '英语'
      },
      {
        name: '2',
        value: '政治'
      },
      {
        name: '3',
        value: '专业'
      },
    ]
  },

  title: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value //待插入的title字段
    })
  },

  content: function (e) {
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value //待插入的content字段
    })
  },

  radioChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      newsid: e.detail.value //待插入的newsid字段
    })
  },

  picfunction: function () {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        var timestamp = (new Date()).valueOf();
        wx.cloud.uploadFile({
          cloudPath: "img/" + timestamp + ".jpg", // 上传至云端的路径
          filePath: filePath, // 小程序临时文件路径
          success: res => {
            console.log('[上传笔记] 成功：', res)

            var img_temp=that.data.img;
            img_temp.push(res.fileID);

            
            that.setData({
              img:img_temp//待插入的文章img字段
            })
            wx.showToast({
              title: '上传成功',
            })
          },
          fail: e => {
            console.error('[上传笔记] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  submit: function (e) {
    var that = this
    var newDate = new Date();
    that.setData({
      cTime: newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate()
    })

    var that = this;

    console.log("cloud_function")


    if (that.data.title == "") {
      console.log("error")
      wx.showToast({
        title: '标题为空',
        icon: 'none',
      })
    } else if (that.data.content == "") {
      console.log("error")
      wx.showToast({
        title: '内容为空',
        icon: 'none',
      })
    } else if (that.data.newsid == "") {
      console.log("error")
      wx.showToast({
        title: '学科为空',
        icon: 'none',
      })
    } else {
      const db = wx.cloud.database()
      db.collection('message').add({
        data: {
          title: that.data.title,
          content: that.data.content,
          newsid: that.data.newsid,
          img: that.data.img,
          cTime: that.data.cTime
        },
        success: function (res) {
          console.log("插入成功" + res)

          wx.navigateBack({
            delta: 1
          })

          wx.showToast({
            title: '上传笔记成功',
            icon: "success",
            duration: 2000,
          })
        },
        fail: console.error
      })
    }
  }
})
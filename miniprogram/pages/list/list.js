Page({
  /** * 页面的初始数据** */
  data: {
    flag:'',
    shuzu: [],
    detail_id:"n001",
    subject:[
      "数学",
      "英语",
      "政治",
      "专业"]
  },
  /** * 生命周期函数--监听页面加载*** */
  onLoad: function (options) {
    var that = this
    that.setData({
      flag:0
    })
    const db = wx.cloud.database()
    db.collection('message').where({
      newsid: "0"
    }).get({
      success: function (res) {
        console.log(res.data)

        that.setData({
          shuzu: res.data
        })
      }
    })

  },

  onShow: function (options) {
    var that = this
    that.setData({
      flag:0
    })
    const db = wx.cloud.database()
    db.collection('message').where({
      newsid: "0"
    }).get({
      success: function (res) {
        console.log(res.data)
        that.setData({
          shuzu: res.data
        })
      }
    })

  },
  select:function (e) 
  {
    console.log(e)
    var that = this
    var id=e.target.id
    this.setData({
      flag:id
    })
    const db = wx.cloud.database()
    db.collection('message').where({
      newsid:id
    }).get({
      success: function (res){
        console.log(res.data)
        that.setData({
          shuzu: res.data
        })
      }
    })
  },

  /*** 用户点击右上角分享*/
  onShareAppMessage: function () {  
  },

  mefuntion: function (e)
  {
    wx.navigateTo({
      url: '../add/add',
    })
  }
})
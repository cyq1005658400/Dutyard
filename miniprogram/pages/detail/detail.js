
//获取应用实例
var app = getApp()
Page({
  data:{
    id1: 1,
    detail_content: {},
    detail_id:'',
    openid:''
  },

  onLoad: function (options){
    console.log(options)
    var that = this;

    this.getOpenid();

    var detail_id = options.detail_id;
    that.setData({
      detail_id:detail_id
    })
    const db = wx.cloud.database()
    db.collection('message').doc(detail_id).get({
      success: function (res) {
        console.log("content")
        console.log(res.data._openid)
        that.setData({
          detail_content: res.data,
        })
      }
    })
  },
  onShow: function (options){
    console.log(options)
    var that = this;

    this.getOpenid();

    var detail_id = options.detail_id;
    that.setData({
      detail_id:detail_id
    })
    const db = wx.cloud.database()
    db.collection('message').doc(detail_id).get({
      success: function (res) {
        console.log("content")
        console.log(res.data._openid)
        that.setData({
          detail_content: res.data,
        })
      }
    })
  },
  getOpenid(){
    let that=this;
    wx.cloud.callFunction({
      name:'getOpenid',
      success:res=>{
        var openid=res.result.openId;
        that.setData({
          openid:openid
        })
        console.log("Openid")
        console.log(openid)
      }
    })
  },

  delete_message:function(){
    wx.cloud.init({

    });

    
    const db=wx.cloud.database()
    db.collection('message').doc(this.data.detail_id).remove()
    wx.navigateBack({
      delta: 1,
    })

    wx.showToast({
      title:"删除成功"
    })
  }
})
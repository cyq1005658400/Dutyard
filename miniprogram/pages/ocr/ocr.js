const app = getApp()
const util = require('../../utils/util.js')
const plugin = requirePlugin("WechatSI")
import {
  language
} from '../../utils/conf.js'
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()

Page({
  data: {
    dialogList: [
      // {
      //   // 当前语音输入内容
      //   create: '04/27 15:37',
      //   lfrom: 'zh_CN',
      //   lto: 'en_US',
      //   text: '这是测试这是测试这是测试这是测试',
      //   translateText: 'this is test.this is test.this is test.this is test.',
      //   voicePath: '',
      //   translateVoicePath: '',
      //   autoPlay: false, // 自动播放背景音乐
      //   id: 0,
      // },
    ],
    scroll_top: 1000000, // 竖向滚动条位置
    bottomButtonDisabled: false, // 底部按钮disabled
    tips_language: language[0], // 目前只有中文
    initTranslate: {
      // 为空时的卡片内容
      create: '00/00 00:00',
      text: '等待拍照',
    },
    currentTranslate: {
      // 当前语音输入内容
      create: '00/00 00:00',
      text: '等待拍照',
    },
    recording: false, // 正在录音
    recordStatus: 0, // 状态： 0 - 录音中 1- 翻译中 2 - 翻译完成/二次翻译
    toView: 'fake', // 滚动位置
    lastId: -1, // dialogList 最后一个item的 id
    currentTranslateVoice: '', // 当前播放语音路径
  },
  pic: function (e) {
    let detail = e.detail || {}
    let buttonItem = detail.buttonItem || {}
    let that = this
    that.photo(buttonItem)
  },
  photo(buttonItem) {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        //tempFilePath可以作为img标签的src属性显示图片
        let imgUrl = res.tempFilePaths[0];
        that.uploadImg(imgUrl, buttonItem)
      }
    })
  },
  uploadImg(imgUrl, buttonItem) {
    let that = this
    var timestamp = (new Date()).valueOf();
    wx.cloud.uploadFile({
      cloudPath: 'ocr/' + timestamp + '.png',
      filePath: imgUrl, // 文件路径
      success: res => {
        console.log("上传成功", res.fileID)
        that.getImgUrl(res.fileID, buttonItem)
      },
      fail: err => {
        console.log("上传失败", err)
      }
    })
  },
  getImgUrl(imgUrl, buttonItem) {
    let that = this
    wx.cloud.getTempFileURL({
      fileList: [imgUrl],
      success: res => {
        let imgUrl = res.fileList[0].tempFileURL
        console.log("获取图片url成功", imgUrl)
        this.shibie(imgUrl, buttonItem)
      },
      fail: err => {
        console.log("获取图片url失败", err)
      }
    })
  },
  shibie(imgUrl, buttonItem) {
    this.setData({
      recordStatus: 0,
      recording: true,
      currentTranslate: {
        // 当前语音输入内容
        create: util.recordTime(new Date()),
        text: '正在识别中',
        lfrom: buttonItem.lang,
        lto: buttonItem.lto,
      },
    })
    this.scrollToNew();
    wx.serviceMarket.invokeService({
      service: 'wx79ac3de8be320b71', // '固定为服务商OCR的appid，非小程序appid',
      api: 'OcrAllInOne',
      data: {
        img_url: imgUrl,
        data_type: 3,
        ocr_type: 8,
      },
    }).then(
      res => {
        var data = res.data.ocr_comm_res.items
        var data_end = ""
        for (var index in data) {
          data_end = data_end + " " + data[index].text
        }
        let text = data_end

        if (text == '') {
          this.showRecordEmptyTip()
          return
        }

        let lastId = this.data.lastId + 1

        let currentData = Object.assign({}, this.data.currentTranslate, {
          text: text,
          translateText: '正在翻译中',
          id: lastId,
          voicePath: ""
        })

        this.setData({
          currentTranslate: currentData,
          recordStatus: 1,
          lastId: lastId,
        })

        this.scrollToNew();

        this.translateText(currentData, this.data.dialogList.length)
        this.scrollToNew();
        wx.showToast({
          title: lang,
        })
      }
    ).catch(
      err => {
        console.error('invokeService fail', err)
        wx.showModal({
          title: 'fail',
          content: err
        })
      }
    )
  },


  /**
   * 翻译
   */
  translateText: function (item, index) {
    let lfrom = item.lfrom || 'zh_CN'
    let lto = item.lto || 'en_US'
    plugin.translate({
      lfrom: lfrom,
      lto: lto,
      content: item.text,
      tts: true,
      success: (resTrans) => {
        let passRetcode = [
          0, // 翻译合成成功
          -10006, // 翻译成功，合成失败
          -10007, // 翻译成功，传入了不支持的语音合成语言
          -10008, // 翻译成功，语音合成达到频率限制
        ]
        if (passRetcode.indexOf(resTrans.retcode) >= 0) {
          let tmpDialogList = this.data.dialogList.slice(0)
          if (!isNaN(index)) {
            let tmpTranslate = Object.assign({}, item, {
              autoPlay: true, // 自动播放背景音乐
              translateText: resTrans.result,
              translateVoicePath: resTrans.filename || "",
              translateVoiceExpiredTime: resTrans.expired_time || 0
            })
            tmpDialogList[index] = tmpTranslate
            this.setData({
              dialogList: tmpDialogList,
              bottomButtonDisabled: false,
              recording: false,
            })
            this.scrollToNew();
          } else {
            console.error("index error", resTrans, item)
          }
        } else {
          console.warn("翻译失败", resTrans, item)
        }
      },
      fail: function (resTrans) {
        console.error("调用失败", resTrans, item)
        this.setData({
          bottomButtonDisabled: false,
          recording: false,
        })
      },
      complete: resTrans => {
        this.setData({
          recordStatus: 1,
        })
        wx.hideLoading()
      }
    })
  },

  /**
   * 修改文本信息之后触发翻译操作
   */
  translateTextAction: function (e) {
    let detail = e.detail // 自定义组件触发事件时提供的detail对象
    let item = detail.item
    let index = detail.index
    this.translateText(item, index)
  },

  /**
   * 语音文件过期，重新合成语音文件
   */
  expiredAction: function (e) {
    let detail = e.detail || {} // 自定义组件触发事件时提供的detail对象
    let item = detail.item || {}
    let index = detail.index
    if (isNaN(index) || index < 0) {
      return
    }
    let lto = item.lto || 'en_US'
    plugin.textToSpeech({
      lang: lto,
      content: item.translateText,
      success: resTrans => {
        if (resTrans.retcode == 0) {
          let tmpDialogList = this.data.dialogList.slice(0)
          let tmpTranslate = Object.assign({}, item, {
            autoPlay: true, // 自动播放背景音乐
            translateVoicePath: resTrans.filename,
            translateVoiceExpiredTime: resTrans.expired_time || 0
          })
          tmpDialogList[index] = tmpTranslate
          this.setData({
            dialogList: tmpDialogList,
          })
        } else {
          console.warn("语音合成失败", resTrans, item)
        }
      },
      fail: function (resTrans) {
        console.warn("语音合成失败", resTrans, item)
      }
    })
  },

  /**
   * 初始化为空时的卡片
   */
  initCard: function () {
    let initTranslateNew = Object.assign({}, this.data.initTranslate, {
      create: util.recordTime(new Date()),
    })
    this.setData({
      initTranslate: initTranslateNew
    })
  },


  /**
   * 删除卡片
   */
  deleteItem: function (e) {
    let detail = e.detail
    let item = detail.item
    let tmpDialogList = this.data.dialogList.slice(0)
    let arrIndex = detail.index
    tmpDialogList.splice(arrIndex, 1)
    // 不使用setTImeout可能会触发 Error: Expect END descriptor with depth 0 but get another
    setTimeout(() => {
      this.setData({
        dialogList: tmpDialogList
      })
      if (tmpDialogList.length == 0) {
        this.initCard()
      }
    }, 0)
  },
  /**
   * 识别内容为空时的反馈
   */
  showRecordEmptyTip: function () {
    this.setData({
      recording: false,
      bottomButtonDisabled: false,
    })
    wx.showToast({
      title: this.data.tips_language.recognize_nothing,
      icon: 'success',
      image: '/image/no_voice.png',
      duration: 1000,
      success: function (res) {},
      fail: function (res) {
        console.log(res);
      }
    });
  },
  /**
   * 重新滚动到底部
   */
  scrollToNew: function () {
    this.setData({
      toView: this.data.toView
    })
  },
  onShow: function () {
    this.scrollToNew();
    this.initCard()
    if (this.data.recordStatus == 2) {
      wx.showLoading({
        // title: '',
        mask: true,
      })
    }
  },
  onLoad: function () {
    this.setData({
      toView: this.data.toView
    })
    app.getRecordAuth()
  },
  onHide: function () {},
})
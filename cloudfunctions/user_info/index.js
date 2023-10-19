// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  var type = event.type
  var openid = wxContext.OPENID
  var subject = event.subject
  if (type == "event") {
    if (subject == 0) {
      try {
        return { datalist: await db.collection('event').where({ _openid: openid }).get(), pos: subject, type_pos: 1 }
      } catch (e) {
        console.log(e)
      }
    }
    else {
      try {
        return { datalist: await await db.collection('event').where({ subject: subject, _openid: openid }).get(), pos: subject, type_pos: 1 }
      } catch (e) {
        console.log(e)
      }
    }
  }
  if (type == "message") {
    subject--
    if (subject == -1) {
      try {
        return { datalist: await db.collection('message').where({ _openid: openid }).get(), pos: subject + 1, type_pos: 0 }
      } catch (e) {
        console.log(e)
      }
    }
    else {
      var subject_string = subject.toString()
      console.log(subject_string)
      try {
        return { datalist: await db.collection('message').where({ newsid: subject_string, _openid: openid }).get(), pos: subject + 1, type_pos: 0 }
      } catch (e) {
        console.log(e)
      }
    }
  }
  if (type == "todolist") {
    if (subject == 0) {
      try {
        return { datalist: await db.collection('todolist').where({ _openid: openid }).get(), pos: subject, type_pos: 2 }
      } catch (e) {
        console.log(e)
      }
    }
    else {
      try {
        return { datalist: await db.collection('todolist').where({ subject: subject, _openid: openid }).get(), pos: subject, type_pos: 2 }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
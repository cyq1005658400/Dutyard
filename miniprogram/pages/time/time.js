var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "filter": [true, true, true, true],
    "hiddenfilter": true,
    "choose_row": -1,
    "choose_date": -1,
    "choose_week_differ": 0,
    "week_num": "",
    "week_differ": 0,
    "time_update_flag": 0,
    "today": "",
    "input_content": "",
    "date_flag": 0,
    "remark_temp": "",
    "openid": "",
    "event": [],
    "table": [],
    "temp_row": 1,
    "temp_col": 1,
    "last_week": 40,
    "year": 2021,
    "month": 3,
    "day": 21,
    "next_year": 2021,
    "next_month": 3,
    "next_day": 28,
    "row_num": 9,
    "col_num": 8,
    "month_day": [
      "",
      31,
      28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ],
    "num_list": [
      "零",
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
      "十"
    ],
    "subject": [
      "",
      "数学",
      "英语",
      "政治",
      "专业",
      "综合"
    ],
    "sc": [
      "",
      "math",
      "english",
      "politic",
      "major",
      "all"
    ],
    "week_list": [
      "零",
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "日",
      "八",
      "九",
      "十"
    ],
    show: false,
    buttons: [{
        className: 'math choose_subject',
        text: '数学',
        value: 1,
      },
      {
        className: 'english choose_subject',
        text: '英语',
        value: 2,
      },
      {
        className: 'politic choose_subject',
        text: '政治',
        value: 3,
      },
      {
        className: 'major choose_subject',
        text: '专业',
        value: 4,
      },
      {
        className: 'delete',
        text: '删除',
        value: 5
      }
    ],
    dialogShow: false,
    fun_button: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    hiddenmodalput: true,

  },

  // 点击任何一个时间块
  openmodal: function (eve) {
    this.setData({
      hiddenmodalput: false
    })
    let row = eve.currentTarget.dataset.row;
    this.setData({
      temp_row: row
    })
    console.log(row);
    let col = eve.currentTarget.dataset.col;
    this.setData({
      temp_col: col
    })
    console.log(col);
  },

  modalinput() {
    this.setData({
      hiddenmodalput: true
    })
  },

  // 更新备注
  modalconfirm(eve) {
    var table_temp = this.data.table
    var remark = this.data.remark_temp
    var row = this.data.temp_row
    var col = this.data.temp_col;
    var event_temp = this.data.event
    const db = wx.cloud.database()
    var id = table_temp[(row - 1) * 7 + col - 1].pos
    db.collection('event')
      .where({
        day: event_temp[id].day,
        year: event_temp[id].year,
        month: event_temp[id].month,
        block: event_temp[id].block
      })
      .update({
        data: {
          remark: remark
        },
        success: function (res) {
          console.log(res.data)
        }
      })
    event_temp[id].remark = remark
    var content = ""
    this.setData({
      event: event_temp,
      hiddenmodalput: true,
      input_content: content
    })
  },
  remarkconfirm(eve) {
    this.setData({
      remark_temp: eve.detail.value
    })
  },

  // 打开备注框
  openConfirm: function () {
    this.setData({
      dialogShow: true
    })
  },

  // 清空键
  tapDialogButton(eve) {
    var pos = eve.detail.index
    if (pos == 1) {
      var table_temp = this.data.table
      var choose_row = this.data.choose_row
      var choose_week_differ = this.data.choose_week_differ
      var choose_date = this.data.choose_date
      var row_start = 1;
      var row_end = this.data.row_num - 1;
      var col_start = 1;
      var col_end = 7;
      if (choose_row > 0) {
        row_start = choose_row
        row_end = choose_row
      }
      if (choose_date > 0 & choose_week_differ == 0) {
        col_start = choose_date
        col_end = choose_date
      }
      for (var i = row_start; i <= row_end; i++)
        for (var j = col_start; j <= col_end; j++) {
          if (table_temp[(i - 1) * 7 + j - 1].flag == 1)
            this.remove(i, j)
        }
    }
    this.setData({
      dialogShow: false
    })
  },

  remove(row, col) {
    var that = this
    var event_temp = this.data.event
    var table_temp = this.data.table
    var table_id = (row - 1) * 7 + col - 1
    var id = table_temp[table_id].pos;
    // 更新table
    table_temp[table_id].flag = 0;
    table_temp[table_id].pos = -1
    that.setData({
      table: table_temp
    });
    // 更新数据库
    const db = wx.cloud.database()
    db.collection('event')
      .where({
        day: event_temp[id].day,
        year: event_temp[id].year,
        month: event_temp[id].month,
        block: event_temp[id].block
      })
      .remove({
        success: function (res) {
          console.log(res.data)
        }
      })
    // 更新event
    var oldevent = this.data.event
    var temp_subject = oldevent[id].subject
    oldevent[id] = {
      day: 0,
      year: 0,
      month: 0,
      subject: 0,
      remark: "",
      block: 0
    }
    this.setData({
      event: oldevent
    })
  },

  // 点击任何一个时间块
  open: function (eve) {
    this.setData({
      show: true
    })
    let row = eve.currentTarget.dataset.row;
    this.setData({
      temp_row: row
    })
    console.log(row);
    let col = eve.currentTarget.dataset.col;
    this.setData({
      temp_col: col
    })
    console.log(col);
  },

  // 点击任何一个时间块后进行选择
  buttontap(eve) {
    var table_temp = this.data.table
    var event_temp = this.data.event
    var subject = eve.detail.index + 1
    var row = this.data.temp_row
    var col = this.data.temp_col;
    var table_id = (row - 1) * 7 + col - 1
    var id = table_temp[table_id].pos;
    var flag = table_temp[table_id].flag;
    if (flag == 1) {
      if (subject < 5) {
        // 更新数据
        // 更新event
        var oldevent = this.data.event
        oldevent[id].subject = subject
        this.setData({
          event: oldevent
        })
        // 数据库更新
        const db = wx.cloud.database()
        db.collection('event')
          .where({
            day: event_temp[id].day,
            year: event_temp[id].year,
            month: event_temp[id].month,
            block: event_temp[id].block
          })
          .update({
            data: {
              subject: subject
            },
            success: function (res) {
              console.log(res.data)
            }
          })
      } else {
        // 删除,由于异步，最后更新event
        // 更新table
        var that = this
        var table_temp = this.data.table
        table_temp[table_id].flag = 0;
        table_temp[table_id].pos = -1
        that.setData({
          table: table_temp
        });
        // 更新数据库
        const db = wx.cloud.database()
        db.collection('event')
          .where({
            day: event_temp[id].day,
            year: event_temp[id].year,
            month: event_temp[id].month,
            block: event_temp[id].block
          })
          .remove({
            success: function (res) {
              console.log(res.data)
            }
          })
        // 更新event
        var oldevent = this.data.event
        oldevent[id] = {
          day: 0,
          year: 0,
          month: 0,
          subject: 0,
          remark: "",
          block: 0
        }
        this.setData({
          event: oldevent
        })
      }
    }
    if (flag == 0 && subject < 5) {
      // 添加,需要计算时间
      var block_temp = this.data.temp_row
      var year_temp = this.data.year;
      var month_temp = this.data.month;
      var day_temp = this.data.day + col;
      if (day_temp > this.data.month_day[month_temp]) {
        day_temp -= this.data.month_day[month_temp];
        month_temp += 1;
        if (month_temp > 12) {
          year_temp += 1;
          month_temp -= 12;
        }
      }
      // 更新event
      var newevent = {
        day: day_temp,
        year: year_temp,
        month: month_temp,
        subject: subject,
        remark: "",
        block: block_temp
      }
      var oldevent = this.data.event
      oldevent.push(newevent)
      this.setData({
        event: oldevent
      })
      // 更新table
      table_temp[table_id].flag = 1;
      table_temp[table_id].pos = this.data.event.length - 1
      this.setData({
        table: table_temp
      });
      // 更新数据库
      const db = wx.cloud.database()
      db.collection('event')
        .add({
          data: {
            year: year_temp,
            day: day_temp,
            month: month_temp,
            block: block_temp,
            subject: subject,
            remark: ""
          }
        })
    }
    this.setData({
      show: false
    });
  },

  choose_date(eve) {
    var last_day = this.data.last_day
    var last_choose = this.data.choose_date
    var choose_date = eve.currentTarget.dataset.col;
    if (choose_date == last_choose & this.data.choose_week_differ == 0) {
      choose_date = 0
    } else {
      if (last_choose == -1)
        last_choose = this.data.week_num
      last_day = last_day - (choose_date - last_choose)
    }
    this.setData({
      last_day: last_day
    })
    this.setData({
      choose_date: choose_date
    })
    this.setData({
      choose_week_differ: 0
    })
  },

  choose_row(eve) {
    var choose_row = eve.currentTarget.dataset.row;
    if (choose_row == this.data.choose_row) {
      choose_row = 0
    }
    this.setData({
      choose_row: choose_row
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 更新日期
    if (this.data.time_update_flag == 0) {
      var week_num = new Date().getDay();
      var todate = new Date().getDate();
      var tomonth = new Date().getMonth() + 1;
      var toyear = new Date().getFullYear();
      console.log("todate:" + todate);
      console.log("month:" + tomonth);
      console.log("todate:" + toyear);
      var c_day = todate - week_num;
      var c_month = tomonth;
      var c_year = toyear;
      var c_next_day = c_day + 7;
      var c_next_month = tomonth;
      var c_next_year = toyear;
      if ((toyear % 4 == 0 && toyear % 100 != 0) || toyear % 400 == 0) {
        var month_day_temp = this.data.month_day
        month_day_temp[2] = 29
        this.setData({
          month_day: month_day_temp
        })
      }
      if (c_day < 0) {
        c_month -= 1;
        if (c_month < 1) {
          c_year -= 1;
          c_month += 12;
        }
        c_day += this.data.month_day[c_month];
      }
      if (c_next_day > this.data.month_day[c_next_month]) {
        c_next_month += 1;
        if (c_next_month > 12) {
          c_next_year += 1;
          c_next_month -= 12;
        }
        c_next_day -= this.data.month_day[c_next_month - 1];
      }
      // 更新剩余时间
      var last_day = 25 - c_day;
      for (var i = c_month; i < 12; i++) {
        last_day += this.data.month_day[i];
      }
      this.setData({
        last_day: last_day
      })
      this.setData({
        week_num: week_num
      });
      this.setData({
        day: c_day
      });
      this.setData({
        month: c_month
      });
      this.setData({
        year: c_year
      });
      this.setData({
        next_day: c_next_day
      });
      this.setData({
        next_month: c_next_month
      });
      this.setData({
        next_year: c_next_year
      });
      this.setData({
        time_update_flag: 1
      });
    }

    // 从数据库获取event
    wx.cloud.init()
    var today = this.data.day + 1;
    var sunday = this.data.next_day
    var that = this
    var year_temp = this.data.year;
    var month_temp = this.data.month;
    var day_temp = this.data.day;
    var next_year_temp = this.data.next_year;
    var next_month_temp = this.data.next_month;
    var next_day_temp = this.data.next_day;
    var table_temp = [];
    // 初始化记录表
    for (var i = 0; i < this.data.row_num - 1; i++) {
      for (var j = 0; j < this.data.col_num - 1; j++) {
        var x = {
          row: i,
          col: j,
          pos: -1,
          flag: 0
        }
        table_temp.push(x);
      }
    }
    //从数据库更新项目表和记录表
    var oldevent = []
    that.setData({
      event: oldevent
    })
    const db = wx.cloud.database()
    var i = 0;
    for (; i < 7; i++) {
      oldevent = this.data.event
      day_temp++;
      db.collection('event')
        .where({
          // _openid: this.data.openid,
          day: day_temp,
          year: year_temp,
          month: month_temp,
        })
        .get({
          success: function (res) {
            for (var item in res.data) {
              oldevent.push(res.data[item]);
              table_temp[(res.data[item].block - 1) * 7 + res.data[item].day - today].flag = 1;
              table_temp[(res.data[item].block - 1) * 7 + res.data[item].day - today].pos = oldevent.length - 1;
            }
            that.setData({
              event: oldevent
            })
            that.setData({
              table: table_temp
            })
          }
        })
      if (day_temp > next_day_temp) {
        oldevent = this.data.event
        db.collection('event')
          .where({
            day: next_day_temp,
            year: next_year_temp,
            month: next_month_temp,
          })
          .get({
            success: function (res) {
              for (var item in res.data) {
                oldevent.push(res.data[item]);
                table_temp[(res.data[item].block - 1) * 7 + 6 - (sunday - res.data[item].day)].flag = 1;
                table_temp[(res.data[item].block - 1) * 7 + 6 - (sunday - res.data[item].day)].pos = oldevent.length - 1;
              }
              that.setData({
                event: oldevent
              })
              that.setData({
                table: table_temp
              });
            }
          })
        next_day_temp--;
      }
    }
    console.log("table")
    console.log(this.data.table)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  foo: function () {
    if (this.data.content) {
      //Do Something
      this.saveGMAMessage()
    } else {
      //Catch Error
    }
    this.setData({
      content: '' //将data的inputValue清空
    });
  },

  // 减少日期
  reduce_date(eve) {
    var day_temp = this.data.day - 7;
    var month_temp = this.data.month;
    var year_temp = this.data.year;
    var next_day_temp = this.data.next_day - 7;
    var next_month_temp = this.data.next_month;
    var next_year_temp = this.data.next_year;
    var last_temp = this.data.last_day + 7;
    if (day_temp < 0) {
      month_temp -= 1;
      if (month_temp < 1) {
        year_temp -= 1;
        month_temp += 12;
      }
      day_temp += this.data.month_day[month_temp];
    }
    if (next_day_temp < 0) {
      next_month_temp -= 1;
      if (next_month_temp < 1) {
        next_year_temp -= 1;
        next_month_temp += 12;
      }
      next_day_temp += this.data.month_day[next_month_temp];
    }
    this.setData({
      week_differ: this.data.week_differ - 1
    });
    this.setData({
      choose_week_differ: this.data.choose_week_differ - 1
    });
    this.setData({
      day: day_temp
    });
    this.setData({
      month: month_temp
    });
    this.setData({
      year: year_temp
    });
    this.setData({
      next_day: next_day_temp
    });
    this.setData({
      next_month: next_month_temp
    });
    this.setData({
      next_year: next_year_temp
    });
    this.setData({
      last_day: last_temp
    });
    this.onLoad()
  },

  // 增加日期
  increase_date(eve) {
    var day_temp = this.data.day + 7;
    var month_temp = this.data.month;
    var year_temp = this.data.year;
    var next_day_temp = this.data.next_day + 7;
    var next_month_temp = this.data.next_month;
    var next_year_temp = this.data.next_year;
    var last_temp = this.data.last_day - 7;
    if (day_temp > this.data.month_day[month_temp]) {
      month_temp += 1;
      if (month_temp > 12) {
        year_temp += 1;
        month_temp -= 12;
      }
      day_temp -= this.data.month_day[month_temp - 1];
    }
    if (next_day_temp > this.data.month_day[next_month_temp]) {
      next_month_temp += 1;
      if (next_month_temp > 12) {
        next_year_temp += 1;
        next_month_temp -= 12;
      }
      next_day_temp -= this.data.month_day[next_month_temp - 1];
    }
    this.setData({
      week_differ: this.data.week_differ + 1
    });
    this.setData({
      choose_week_differ: this.data.choose_week_differ + 1
    });
    this.setData({
      day: day_temp
    });
    this.setData({
      month: month_temp
    });
    this.setData({
      year: year_temp
    });
    this.setData({
      next_day: next_day_temp
    });
    this.setData({
      next_month: next_month_temp
    });
    this.setData({
      next_year: next_year_temp
    });
    this.setData({
      last_day: last_temp
    });
    this.onLoad()
  },
  // filterOpen: function () {
  //   this.setData({
  //     hiddenfilter: false
  //   })
  // },
  //   //关闭过滤窗口
  //   filterClose: function () {
  //     this.setData({
  //       hiddenfilter: true
  //     })
  //   },
  //   filterSubject: function (i) {
  //     var temp = this.data.filter;
  //     temp[i.currentTarget.id] = !temp[i.currentTarget.id];
  //     this.setData({
  //       filter: temp
  //     })
  //   }
})
import {
  request
} from '../../utils/request.js'
import {
  date,
  week,
  addByTransDate
} from '../../utils/util.js'
Page({
  data: {
    today: '',
    chooseOrderTime: [], //选择的预约时间
    curCk: 100, //选中的周下标
    showExplain: false,
    orderDay: [], //可预约时间
    orderWeek: [], //可预约时间
    doctorList: [{
      id: 1,
      i_doctor_id: 1,
      v_doctor_name: "小张大夫",
      v_examine_date: "2019-02-22",
      i_max_num: 18,
      i_over_num: 10,
      i_examine_money: 400,
      i_examine_flag: true
    }, {
      id: 2,
      i_doctor_id: 3,
      v_doctor_name: "小李大夫",
      v_examine_date: "2019-02-22",
      i_max_num: 18,
      i_over_num: 2,
      i_examine_money: 200,
      i_examine_flag: true
    }],
  },


  onLoad: function(options) {
    // const weeks = JSON.parse(options.weeks); //可挂号日期
    const weeks = {dtm_examine_date: '2019-02-28', week_name:'周四'}; //可挂号日期
    console.log(weeks)
    const today = week(new Date());
    let orderWeek = [],
      orderDay = [],
      w, w2, w3, t, t2, t3;
    t = weeks.dtm_examine_date.substr(8);
    t2 = addByTransDate(weeks.dtm_examine_date, 1).substr(8, 2);
    t3 = addByTransDate(weeks.dtm_examine_date, 2).substr(8, 2);
    w = weeks.week_name;
    w2 = addByTransDate(weeks.dtm_examine_date, 1).substr(11, 14);
    w3 = addByTransDate(weeks.dtm_examine_date, 2).substr(11, 14);
    orderDay.push(t, t2, t3);
    orderWeek.push(w, w2, w3);
    this.setData({
      today,
      weeks,
      orderDay,
      orderWeek
    });

    //根据坐诊日期查询可挂号医生信息
    this.getDoctorExamineByDate();
  },

  //选择就诊时间
  chooseOrderTime(e) {
    const {
      orderDay,
      orderWeek
    } = this.data;
    const curCk = e.currentTarget.dataset.index;
    const orderDay_ck = orderDay[curCk];
    const orderWeek_ck = orderWeek.find((cur, index, arr) => (
      index == curCk
    ));
    let chooseOrderTime = [];
    chooseOrderTime.push(orderDay_ck, orderWeek_ck);
    this.setData({
      curCk,
      orderWeek_ck,
      chooseOrderTime
    })
  },

  //根据坐诊日期查询可挂号医生信息
  getDoctorExamineByDate() {
    request({
      url: 'registerController/getDoctorExamineByDate',
      method: 'POST',
      data: {
        v_date: this.data.weeks.dtm_examine_date
      }
    }).then(res => {
      if (res.statusCode == 200) {
        const doctorList = res.data;
        // 进度条
        for (let i in doctorList) {
          let width = (doctorList[i].i_over_num / doctorList[i].i_max_num) * 100;
          doctorList[i].width = width
        }
        this.setData({
          doctorList
        });
      }
    });
  },

  //去支付
  orderReady(e) {
    if (!this.data.orderWeek_ck) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      });
      return
    } 
    const curIndex = e.currentTarget.dataset.index;
    const doctor = this.data.doctorList.find((cur, index, arr) => (
      index == curIndex
    ));
    if (doctor.i_over_num == doctor.i_max_num) {
      wx.showToast({
        title: '预约人数已满',
        icon: 'none'
      });
      return
    }
    wx.setStorageSync('doctor', JSON.stringify(doctor)||'');
    //微信支付统一下单
    request({
      method: 'POST',
      url: 'registerController/wecharCreateUnified',
      data: {
        openid: wx.getStorageSync('openid'),
        total_fee: (doctor.i_examine_money) * 100
      }
    }).then(res => {
      const hotData = res.data;
      //如果获取到订单号了，就可以去准备挂号
      console.log(JSON.stringify(hotData))
      if (hotData.out_trade_no) {
        wx.setStorageSync('paramPay', JSON.stringify(hotData) || '');
        wx.navigateTo({
          url: `/pages/payDesc/payDesc?chooseOrderTime=${JSON.stringify(this.data.chooseOrderTime)}`
        });
      }
    });
  },

  showExplain() {
    this.setData({
      showExplain: true
    })
  },
  closeExplain() {
    this.setData({
      showExplain: false
    })
  },


  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
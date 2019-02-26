import {
  request
} from '../../utils/request.js'
import {
  date
} from '../../utils/util.js'
Page({
  data: {
    type: '初诊', //就诊类型
    items: [{
        name: 'firstCk',
        value: '初诊',
        checked: 'true'
      },
      {
        name: 'secondCk',
        value: '复诊'
      }
    ]
  },
  onLoad: function(options) {
    const doctor = JSON.parse(wx.getStorageSync('doctor')||''); //医生信息
    const paramPay = JSON.parse(wx.getStorageSync('paramPay') || ''); //支付参数
    const chooseOrderTime = JSON.parse(options.chooseOrderTime); //预约时间
    const patient = wx.getStorageSync('patient') || ''; //患者姓名
    let aToday = date(new Date()).split('-');
    aToday.splice(2, 1);
    aToday.push(chooseOrderTime[0]);
    const orderTime = `${aToday.join("-")}  ${chooseOrderTime[1]}`; //改装后可用的预算时间
    this.setData({
      patient,
      doctor,
      orderTime,
      paramPay
    });
    // 验证绑定 获取用户id
    this.bindUserTag();
  },


  payNow(e) {
    let {
      name,
      doctor,
      orderTime,
      type,
      paramPay
    } = this.data;
    //.挂号
    request({
      url: 'registerController/saveRegisterInfo',
      method: 'POST',
      data: {
        out_trade_no: paramPay.out_trade_no, // 订单号
        i_user_id: wx.getStorageSync('patientId')||'', // 用户id 绑定用户信息中的id
        v_examine_id: doctor.id, // 挂号信息信息中的v_examine_id（未知）
        i_doctor_id: doctor.i_doctor_id, // 挂号信息中医生id
        v_register_type: type, // 就诊类型（出诊/复诊）
        dtm_examine_date: orderTime, // 预约时间 挂号信息中的日期
        v_register_type: (doctor.i_examine_money) * 100 // 挂号费（单位/分）
      }
    }).then(res => {
      const hotData = res.data;
      if (hotData.status_flag) {
        // 挂号成功，立即支付
        return wx.requestPayment({
          'timeStamp': paramPay.timeStamp,
          'nonceStr': paramPay.nonceStr,
          'package': paramPay.package,
          'signType': 'MD5',
          'paySign': paramPay.paySign,
          'success': res=> {
            // 支付成功立即更新订单状态
           request({
              url: 'registerController/uPayStatusByOrderNo',
              method: 'POST',
              data: {
                out_trade_no: paramPay.out_trade_no
              }
           }).then(res => { //更新订单成功
             wx.showToast({
               title: '支付成功',
               icon: 'none'
             });
             // 更新订单成功（也是支付成功）
             wx.navigateTo({
               url: `/pages/paySuccess/paySuccess?outTradeNo=${paramPay.out_trade_no}`
             });
           });
          }
        })
      } else {
        wx.showToast({
          title: '支付失败！',
          icon: 'none'
        });
      }
    })
  },

  chooseType(e) {
    let {
      type
    } = this.data;
    e.detail.value == 'firstCk' ? type = '初诊' : type = '复诊';
    this.setData({
      type
    });

  },

  //给了获取用户id 
  bindUserTag() {
    request({
      url: 'userControl/bindUserTag',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid')
      }
    }).then(res => {
      if (res.data.status_flag) {
        const hotData = res.data.t_userbind_info;
        this.setData({
          id: hotData.id,
          name: hotData.v_user_name
        })
      } else {
        console.log('用户未绑定')
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
//2019-02-27
const date = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
const week = date => {
  const aWeeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-') + ' ' + aWeeks[date.getDay()]
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 根据指定日期向后推算多少号和星期几  2019-02-25/周一
const addByTransDate = (dateParameter, num) => {
  const aWeeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  let translateDate = "",
    dateString = "",
    monthString = "",
    dayString = "";
  translateDate = dateParameter.replace("-", "/");
  let newDate = new Date(translateDate);
  newDate = newDate.valueOf();
  newDate = newDate + num * 24 * 60 * 60 * 1000;
  newDate = new Date(newDate);
  //月
  if ((newDate.getMonth() + 1).toString().length == 1) {
    monthString = newDate.getMonth().toString().padStart(2, "0");
  } else {
    monthString = (newDate.getMonth() + 1).toString();
  }
  //天
  if (newDate.getDate().toString().length == 1) {
    dayString = newDate.getDate().toString().padStart(2, "0");
  } else {
    dayString = newDate.getDate().toString();
  }
  //周
  const week = aWeeks[newDate.getDay()];
  dateString = `${newDate.getFullYear()}-${monthString}-${dayString}/${week}`;
  return dateString;
}


module.exports = {
  date,
  week,
  addByTransDate
}
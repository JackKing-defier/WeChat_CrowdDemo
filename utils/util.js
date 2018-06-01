var app = getApp();
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function strToTime(stringTime){
  //var stringTime = "2014-07-10 10:21:12";
  var timestamp2 = Date.parse(new Date(stringTime));
  timestamp2 = timestamp2 / 1000;
  return timestamp2
}
function getUserAuth(){

    var sysLoginInfo = wx.getStorageSync('user')
    //注意修改request请求部分
    wx.request({
      url: app.globalData.domain + '/api/mation/getuserauth',
      data: {
        openid: sysLoginInfo.openid,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.state == 2) {
          wx.setStorageSync("userAuthData", res.data.res)

        }
      }
    })
}

/**
 * 验证是否登录###############需要修改此部分
 */
function is_login() {
  const app = getApp()
  var userInfo = wx.getStorageSync('userInfo')
  if (userInfo == "") {
    //引导授权登录
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          //授权登录继续
          wx.login({
            success: function (codeInfo) {
              var code = codeInfo.code
              wx.getUserInfo({
                success: function (resUserinfo) {
                  // 可以将 res 发送给后台解码出 unionId
                  wx.request({
                    url: app.globalData.domain + "/api/Wxversion/getVersion",
                    data: {
                      code: code,
                      nick: resUserinfo.userInfo.nickName,
                      sex: resUserinfo.userInfo.gender,
                      avatar: resUserinfo.userInfo.avatarUrl,
                    },
                    method: "POST",
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      if (res.data.code == 200) {
                        wx.setStorageSync('usrlogin', res.data.data);
                        var userInfo = wx.getStorageSync('usrlogin')
                        //返回open_id
                        return userInfo.open_id
                      } else {
                        return false
                      }
                    }
                  })
                }
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您未授权，无操作权限',
            showCancel: false
          })
          return false;
        }
      }
    })
  } else {
    //返回open_id
    return userInfo.openid
  }
}
module.exports = {
  formatTime: formatTime,
  getUserAuth: getUserAuth,
  is_login: is_login,
  strToTime: strToTime

}

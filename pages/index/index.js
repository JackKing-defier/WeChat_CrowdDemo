//index.js
//获取应用实例
import utils from '../../utils/index'
var app = getApp()

Page({
  data: {
    title: '我的书架',
    tableID: app.globalData.indexBookTableId,
    bookList: [],
    creatingBookName: '', // 当前正在创建的书名
    editingBookName: '', // 当前正在编辑的书名
    creatingBookAuthor: '', // 当前正在创建的作者
    editingBookAuthor: '', // 当前正在编辑的作者
  },

  onLoad(options) {

    wx.BaaS.login().then(() => {
      this.setData({
        profile: wx.BaaS.storage.get('userinfo')
      })
      this.fetchBookList()
    })
    //this.fetchBookList()
  },

  userInfoHandler(data) {
    wx.BaaS.handleUserInfo(data).then(res => {
      // res 包含用户完整信息，详见下方描述
    }, res => {
      // **res 有两种情况**：用户拒绝授权，res 包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 Error 对象（详情见下方注解）
      // *Tips*：如果你的业务需要用户必须授权才可进行，由于微信的限制，10 分钟内不可再次弹出授权窗口，此时可以调用 [`wx.openSetting`](https://mp.weixin.qq.com/debug/wxadoc/dev/api/setting.html) 要求用户提供授权
    })
  },

  // 获取 bookList 数据
  fetchBookList() {
    utils.getBooks(this, (res) => {
      this.setData({
        bookList: res.data.objects // bookList array, mock data in mock/mock.js
      })
    })
  },

  // 绑定添加书目的输入框事件，设置添加的书目名称
  bindCreateBookNameInput(e) {
    let that = this
    let value = e.detail.value
    this.setData({
      creatingBookName: value
    })

  },
  // 绑定添加书目作者信息的输入框事件，设置添加的书籍作者
  bindCreateBookAuthorInput(e) {
    let that = this
    let value = e.detail.value
    this.setData({
      creatingBookAuthor: value
    })

  },

  // 绑定添加书目的提交按钮点击事件，向服务器发送数据
  createBook(e) {
    utils.addBook(this, (res) => {
      this.setData({
        createBookValue: '',
      })
      this.fetchBookList()
    })
  },

  // 绑定每一行书目的“编辑”按钮点击事件，控制输入框和文本显示
  editBookButtonClicked(e) {
    let that = this
    let activeIndex = e.currentTarget.dataset.index
    let bookList = this.data.bookList

    bookList.forEach((elem, idx) => {
      if (activeIndex == idx) {
        elem.isEditing = true
      } else {
        elem.isEditing = false
      }
    })

    that.setData({
      bookList
    })
  },

  // 绑定每一行书目的输入框事件，设定当前正在编辑的书名
  bindEditBookNameInput(e) {
    let bookName = e.detail.value
    this.setData({
      editingBookName: bookName,
    })
  },

  // 绑定每一行书目作者的输入框事件，设定当前正在编辑的作者
  bindEditBookAuthorInput(e) {
    let bookAuthor = e.detail.value
    this.setData({
      editingBookAuthor: bookAuthor,
    })
  },

  // 绑定修改书目的提交按钮点击事件，向服务器发送数据
  updateBook(e) {

    this.setData({
      curRecordId: e.target.dataset.bookId,
    })

    utils.updateBook(this, (res) => {
      this.fetchBookList()
      this.setData({ curRecordId: '' })
    })
  },

  // 删除当前行的书目
  deleteBook(e) {
    this.setData({
      curRecordId: e.target.dataset.bookId,
    })
    utils.deleteBook(this, (res) => {
      this.fetchBookList()
      this.setData({ curRecordId: '' })
    })
  },

})
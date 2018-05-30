
let getBooks = (ctx, cb) => {

  let tableId = getApp().globalData.indexBookTableId,
    Books = new wx.BaaS.TableObject(tableId)

  Books.find()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

let addBook = (ctx, cb) => {

  let tableId = getApp().globalData.indexBookTableId,
    Books = new wx.BaaS.TableObject(tableId),
    Book = Books.create(),
    bookName = ctx.data.creatingBookName,
    bookAuthor = ctx.data.creatingBookAuthor

  let data = {
    bookName,
    bookAuthor
  }

  Book.set(data)
    .save()
    .then(res => cb(res))
    .catch(err => console.dir(err))

}

let updateBook = (ctx, cb) => {
  let tableId = getApp().globalData.indexBookTableId,
    recordId = ctx.data.curRecordId,
    bookName = ctx.data.editingBookName
    bookAuthor = ctx.data.editingBookAuthor

  let Books = new wx.BaaS.TableObject(tableId),
    Book = Books.getWithoutData(recordId)

    //注意数据格式
  let data = {
    bookName,
    bookAuthor
  }

  Book.set(data)
    .update()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

let deleteBook = (ctx, cb) => {
  let tableId = getApp().globalData.indexBookTableId,
    recordId = ctx.data.curRecordId

  let Books = new wx.BaaS.TableObject(tableId)

  Books.delete(recordId)
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

module.exports = {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
}
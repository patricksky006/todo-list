module.exports = (error, req, res, next) => {
  console.log(error)
  req.flash('error', error.errorMessage || '處理失敗')
  res.redirect('back')

  next(error) // next(error) 的作用是將錯誤傳遞給下一個錯誤處理 middleware
}

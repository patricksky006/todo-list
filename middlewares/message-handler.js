module.exports = (req, res, next) => {
  res.locals.success_msg = req.flash('success') // 將 'success' 訊息從 req.flash('success') 中取出並存放在 res.locals.success_msg 中
  res.locals.error_msg = req.flash('error') // 將 'error' 閃存訊息從 req.flash('error') 中取出並存放在 res.locals.error_msg 中
  next() // 呼叫 next()，這個函式會將處理流程交給下一個 middleware
}

module.exports = function (req, res, next) {
  res.spa = true
  next()
}

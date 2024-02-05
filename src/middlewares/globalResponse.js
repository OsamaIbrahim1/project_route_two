export const globalResponse = (err, req, res, next) => {
  if (err) {
    return res.status(err['cause'] || 500).json({
      message: 'Catch error',
      errorMsg: err.message,
      errorLocation: err.stack
    })
  }
}

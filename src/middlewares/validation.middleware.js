const reqKey = ['body', 'params', 'query', 'headers']

export const validationMiddleWare = schema => {
  return (req, res, next) => {
    let validationErrorArray = []
    for (const key of reqKey) {
      const validationResult = schema[key]?.validate(req[key], {
        abortEarly: false
      })
      if (validationResult?.error) {
        validationErrorArray.push(...validationResult.error.details)
      }
    }
    if (validationErrorArray.length) {
      return res.status(400).json({
        err_mess: 'validation error',
        errors: validationErrorArray.map(ele => ele.message)
      })
    }
    next()
  }
}

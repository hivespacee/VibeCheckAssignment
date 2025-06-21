const errorHandling = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'fail',
      message: `Invalid ${err.path}: ${err.value}`
    });
  }
}

export default errorHandling;
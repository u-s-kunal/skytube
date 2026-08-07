const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.log(` ERROR AT ASYNCHANDLER..... ${err}`);
      next(err);
    });
  };
};

export default asyncHandler;

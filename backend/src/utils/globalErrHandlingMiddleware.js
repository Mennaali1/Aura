//Showing stack and Code only of you're a developer and have a dev role
let role = "prod";
export const globalErrHandlingMiddleware = (err, req, res, next) => {
  if (role === "dev") {
    devRole(err, res);
  } else {
    prodRole(err, res);
  }
};

const prodRole = (err, res) => {
  let code = err.statusCode || 500;

  res.status(code).json({ Message: err.message });
};
const devRole = (err, res) => {
  let code = err.statusCode || 500;

  res.status(code).json({ code: code, Message: err.message, stack: err.stack });
};

import errors from 'restify-errors';
import verify from '../crypto/verify';

const verifySignature = function verifySignature(request, response, next) {
  if (!request.authorization || !request.authorization.basic) {
    return next();
  }

  const { username, password } = request.authorization.basic;

  try {
    if (!verify(request.rawBody, password, username)) {
      throw new Error('Verification failed');
    }
  } catch (error) {
    return next(
      new errors.InvalidCredentialsError(error.message)
    );
  }

  request.userId = username;

  return next();
};

export default verifySignature;

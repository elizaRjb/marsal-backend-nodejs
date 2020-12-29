import '../env';

import jwt from 'jsonwebtoken';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

/**
 * Authorize access token.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function auth(req, res, next) {
  const authHeader = req.headers['authorization'];

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      error: ReasonPhrases.UNAUTHORIZED
    });
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.currentUser = verifiedUser;
    next();
  } catch(error) {
    console.log('ERROR: ', error);

    return res.status(StatusCodes.FORBIDDEN).send({
      error: ReasonPhrases.FORBIDDEN
    });
  }
}

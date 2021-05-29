import '../env';

import jwt from 'jsonwebtoken';

/**
 * Generate an auth token for given data.
 *
 * @param {Object} data
 * @param {String} expiresIn
 */
export function generateAuthToken(data, expiresIn) {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn });
}

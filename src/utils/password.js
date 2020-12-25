import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Create hashed password of a given password.
 *
 * @param {String} password
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function hashPassword(password, callbackSuccess, callbackError) {
  bcrypt.hash(password, SALT_ROUNDS)
    .then(hashedPassword => {
      callbackSuccess(hashedPassword);
    })
    .catch(error => {
      console.log('ERROR: ', error);
      callbackError();
    });
}

/**
 * Compare a password and its hashed password.
 *
 * @param {String} password
 * @param {String} hashedPassword
 * @param {Function} callbackSuccess
 * @param {Function} callbackError
 */
export function comparePassword(password, hashedPassword, callbackSuccess, callbackError) {
  bcrypt.compare(password, hashedPassword)
    .then(result => {
      if (result) {
        callbackSuccess(true);

        return;
      }

      callbackSuccess(false);
    })
    .catch(error => {
      console.log('ERROR,nnl: ', error);
      callbackError();
    });
}

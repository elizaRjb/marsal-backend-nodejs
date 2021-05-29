/**
 * Returns a random value from an array.
 *
 * @param {Array} list
 */
export function getRandomValueFromList(list) {
  return list[Math.floor(Math.random() * list.length)];
}

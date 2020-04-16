export function toCamelCase(str) {
  const reReplace = /^[\W_]+/
  const reSplit = /[\W_]+/g

  return str
    .replace(reReplace, '')
    .split(reSplit)
    .reduce((result, word, index) => {
      const capFn = index === 0 ? 'toLowerCase' : 'toUpperCase'
      const modifiedWord = word.charAt(0)[capFn]() + word.substr(1)

      return result + modifiedWord
    }, '')
}

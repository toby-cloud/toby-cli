

/**
 * removeHashtags - remove hashtags from a string
 *
 * @param  {String} text the string to remove hashtags from
 * @return {String}      the string with hashtags removed
 */
removeHashtags = function(text) {
  var regexp = new RegExp('#([^\\s]*)','g');
  return text.replace(regexp, '').trim();
}

/**
 * findHashtags - extract all hashtags from a string
 *
 * @param  {String} text the text to extract hashtags from
 * @return {list}   list of hashtags found in string
 */
findHashtags = function(text) {
  var regexp = /(\s|^)\#\w\w+\b/gm
  text = text + " ";
  result = text.match(regexp);
  if (result) {
    result = result.map(function(s){ return s.trim().substring(1);});
    return result;
  } else {
    return [];
  }
}

module.exports.removeHashtags = removeHashtags;
module.exports.findHashtags   = findHashtags;

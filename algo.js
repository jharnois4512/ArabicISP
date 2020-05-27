
exports.algo = function(x){
  var len = x.length;
  var holder = ''

  //arrays for rules
  /*Part A - Normalization*/
  illegal = ['-', '?', '!', ',', '.', '/', '\\', '_', '#', '$', '(', ')']
  /*Part B - list of constant letters*/
  // constant = ['\u0631', '\u0632', '\u0634', '\u0635', '\u0636', '\u', '\u', '\u', '\u', '\u', '\u']
  /*Part C - */
  prefix = ['\u0628', '\u0641', '\u0633', '\u0644']
  suffex = ['\uFEEB']
  prefixSuffex = ['\u0645', '\u0646', '\u0643']
  uncertain = ['\u0621', '\u0648', '\u0627', '\u0623', '\u0626', '\u0676'] // double check with the yamli documentation -> note, we will only have illegal chars from images
  extra = ['\u0629', '\uFE94']
  /*Part D - */

  //searching for illegal characters
  Array.from(x).forEach(letter => {
    if(illegal.includes(letter)) throw new Error('Illegal character')
  });
  return(x)
  //TODO: Make list of constant letters

}


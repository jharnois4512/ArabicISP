
exports.algo = function(x){
  try{
    var errorFlag = 0
    if(x === ' '){
      errorFlag = 1
      throw new Error("illegal execption")
    }
    //error checking for a space
    if(x.indexOf(' ') > 0){
      x = x.substr(0, x.indexOf(' '));
    }
    var len = x.length;
    var holder = []
    holder = Array.from(x)

    //creating a flag array of the size of the word to flag constant letters
    var flagArr = []
    flagArr.length = len
    for(var i; i < len - 1; i++){
      flagArr.push(0)
    }

    //arrays for rules
    /*Part A - Normalization*/
    illegal = ['-', '?', '!', ',', '.', '/', '\\', '_', '#', '$', '(', ')']
    /*Part B - List of constant letters*/
    constant = ['\u0631', '\u0632', '\u0634', '\u0635', '\u0636', '\u0637', '\u0638', '\u0639', '\u063A', '\u0642', '\u062F', '\u0630', '\u062B', '\u062C', '\u062D', '\u062E']
    /*Part C - List of non-constant that might be converted*/
    prefix = ['\u0628', '\u0641', '\u0633', '\u0644']
    suffex = ['\uFEEB']
    prefixSuffex = ['\u0645', '\u0646', '\u0643']
    uncertain = ['\u0621', '\u0648', '\u0627', '\u0623', '\u0626', '\u0676'] // double check with the yamli documentation -> note, we will only have illegal chars from images
    extra = ['\u0629', '\uFE94']
    /*Part D - 
    haven't gotten here yet
    */

    //execution of rules
    /*searching for illegal characters - part A*/
    holder.forEach(letter => {
      if(illegal.includes(letter)){
        errorFlag = 1
        throw new Error("illegal execption")
      }
    })
    /*flagging constant letters - part B*/
    for(var j = 0; j < len; j++){
      if(constant.includes(holder[j])){
        flagArr[j] = 1
      }
    }
  /*TODO: write rule set for part C - #1*/
    /*rules for the prefix letters
    * L S F B
    */
    //L
    if(holder.includes('\u0644')){
      var pos = holder.indexOf('\u0644')
      var inPos = flagArr.indexOf(1)
      //first two rules /*TODO: write 3 and 4*/
      if(inPos < pos || pos > (len / 2)){
        flagArr[pos] = 1
      }
      console.log(flagArr)
      
    }
    //S
    if(holder.includes('\u0633')){
      console.log('S')
    }
    //F
    if(holder.includes('\u0641')){
      console.log('F')
    }
    //B
    if(holder.includes('\u0628')){
      console.log('B')
    }
    

    //placeholder for testing the return for development
    return(x)
  }
  catch(err){
    console.log("Illegal input detected")
    // console.log(err.)
    return -1
  }
}


/*
https://thesai.org/Downloads/Volume9No10/Paper_15-A_Novel_Rule_based_Root_Extraction_Algorithm.pdf
https://en.wikipedia.org/wiki/Arabic_script_in_Unicode
*/


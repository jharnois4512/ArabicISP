//settings
/*yamli settings*/
if (typeof(Yamli) == 'object' && Yamli.init({ startMode:'on' })){
Yamli.yamlify('text', {settingsPlacement:'hide', uiLanguage:'en'});
}
//methods 
function submitform(){
  var formData = document.getElementById("text").value 
  var jsonform = {data: formData}
  var jsonObj = JSON.stringify(jsonform)
  $.ajax({
  type: "POST",
  url: "submitArabic",
  data: jsonObj,
  dataType: "json",
  contentType: "application/json; charset=utf-8",
  success: function(res){
    var replace = document.getElementById("formDiv")
    var replaceTop = document.getElementById("directions")
    var frontJSON = {}
    frontJSON.wordArr = []
    var results = JSON.parse(res)
    frontJSON.root = JSON.parse(results.root).build
    frontJSON.rootMeaning = JSON.parse(results.root).buildMeaning
    if(frontJSON.root != "" || frontJSON.rootMeaning != ""){
      if(JSON.parse(results.rootMeaning).words){
        var wordArr = JSON.parse(results.rootMeaning).words.split("\n")
        wordArr.forEach(function(obj){
          if(obj.includes("(")){
            frontJSON.wordArr.push(obj)
          }
        })
      }
      else{
        var wordArr = ""
        frontJSON.wordArr = wordArr
      }
      frontJSON.wordMeaning = JSON.parse(results.wordMeaning).text[0]
      frontJSON.word = results.word
      //main div to hold everything
      var div = document.createElement("div")
      var topDiv = document.createElement("div")
      //five divs for the contents 
      var divOne = document.createElement("div")
      var divTwo = document.createElement("div")
      var divThree = document.createElement("div")
      var divFour = document.createElement("div")
      var divFive = document.createElement("div")
      //button to return to main page
      var buttonDir = document.createElement("a")
      //elements needed for the table of different words
      var table = document.createElement("table")
      var verbTable = document.createElement("table")
      var tblBody = document.createElement("tbody")
      var verbBody = document.createElement("tbody")
      var rowOne = document.createElement("td")
      var rowTwo = document.createElement("td")
      var rowThree = document.createElement("td")
      var rootTop = document.createElement("tr")
      var nounTop = document.createElement("tr")
      var verbTop = document.createElement("tr")
      var nounTopP = document.createElement("p")
      var nounTopIn = document.createTextNode("Alternative noun forms found for root:")
      rootTop.innerHTML = "Root detected"
      nounTopP.append(nounTopIn)
      nounTop.append(nounTopP)
      verbTop.innerHTML = "Alternative verb forms found for root:"
      rootTop.style.fontSize = "large"
      nounTopP.style.fontSize = "large"
      verbTop.style.fontSize = "large"
      rowOne.append(nounTop)
      rowTwo.append(verbTop)
      rowThree.append(rootTop)
      //for loop though the different words for the table 
      var divTable = document.createElement("div")
      var divTableThree = document.createElement("div")
  
      if(frontJSON.wordArr.length){
        for(let items in frontJSON.wordArr){
          console.log(frontJSON.wordArr[items].indexOf("."))
          if(frontJSON.wordArr[items].indexOf(".") != -1){
            console.log("yup")
            continue
          }
          else{
            console.log("nope")
          }
          // Nouns
          if(frontJSON.wordArr[items].includes('”)') && !frontJSON.wordArr[items].includes('Form')){
            console.log("noun")
            var colOne = document.createElement("tr")
            var nounRowCell = document.createElement("td")
            var firstDiv = document.createElement("div")
            var firstMatch = document.createElement("p")
            firstMatch.style.cssText = "margin-left: 3%;"
            var matchText = document.createTextNode(frontJSON.wordArr[items])
            colOne.innerHTML = frontJSON.wordArr[items]
            firstMatch.append(matchText)
            firstDiv.append(firstMatch)
            rowOne.append(firstDiv)
          }
          // Verbs 
          else if(items > 0 && frontJSON.wordArr[items].indexOf(".") == -1 && !frontJSON.wordArr[items].includes("• (")){
            console.log("verb")
            console.log(frontJSON.wordArr[items])
            console.log("here")
            if(frontJSON.wordArr[items].includes("Form")){
              console.log(frontJSON.wordArr[items])
              var verbRow = document.createElement("tr")
              var verbRowCell = document.createElement("td")
              var firstMatch = document.createElement("p")
              var matchText = document.createTextNode(frontJSON.wordArr[items])
              var firstDiv = document.createElement("div")
              firstMatch.append(matchText)
              firstDiv.append(firstMatch)
              verbRowCell.append(firstDiv)
              verbRow.append(verbRowCell)
              rowTwo.append(verbRow)
            }
            else{
              console.log(frontJSON.wordArr[items])
              var verbRowCell = document.createElement("td")
              var firstMatch = document.createElement("p")
              var matchText = document.createTextNode(frontJSON.wordArr[items])
              var firstDiv = document.createElement("div")
              firstMatch.append(matchText)
              firstDiv.append(firstMatch)
              verbRowCell.append(firstDiv)
              verbRow.append(verbRowCell)
              rowTwo.append(verbRow)
            }
          }
          // Chart starter
          else{
            var colThree = document.createElement("tr")
            var firstDiv = document.createElement("div")
            var firstMatch = document.createElement("p")
            var matchText = document.createTextNode(frontJSON.wordArr[items])
            colThree.innerHTML = frontJSON.wordArr[items]
            rowThree.append(colThree)
            firstMatch.append(matchText)
            firstDiv.append(firstMatch)
            divTable.append(firstDiv)
            console.log(matchText)
          }
        }
        //make these into a table
        tblBody.append(rowThree)
        tblBody.append(rowOne)
        tblBody.append(rowTwo)
        table.append(tblBody)
        table.style.cssText = "width:100%"
        divTwo.append(table)
      }
      else{
        var errorMsg = document.createTextNode("We're sorry! No alternative word forms were found for this word.")
        var errorP = document.createElement('p')
        errorP.append(errorMsg)
        divTwo.append(errorP)
        errorP.style.cssText = "width:100%"
        errorP.style.cssText = "text-align:center;" 
        errorP.style.fontSize = 'large'
      }
  
      //creating all of the text variables
      var breakLine = document.createElement("br")
      var topDivReplace = document.createTextNode("")
      var meaningRoot = document.createTextNode(frontJSON.rootMeaning)
      var rootLabel = document.createTextNode("The root letters of this word are: ")
      var rootAppend = document.createTextNode(frontJSON.root)
      var meaningWord = document.createTextNode(frontJSON.wordMeaning)
      var divFiveIn = document.createTextNode("Translation of this word: ")
      var divThreeIn = document.createTextNode("Translation of this root: ")
  
      // starting the color coding of the word
      var check = []
      for(var t = 0; t < frontJSON.root[0].length; t++){
        check[t] = 0
      }
      var colorHolder = []
      for(var i = frontJSON.word.length - 1; i > -1; i--){
        for(var r = frontJSON.root[0].length - 1 ; r > -1; r--){
          if(frontJSON.word[i] === frontJSON.root[0][r] && check[r] === 0){
            colorHolder[i] = 1
            check[r] = 1
            break
          }
          else{
            colorHolder[i] = 0
          }
        }
      }
      for(let slots in colorHolder){
        if(colorHolder[slots] === 1){
          divOne.innerHTML += "<span style='color:red'>" + frontJSON.word[slots] + "</span>"
        }
        else{
          divOne.innerHTML += "<span>" + frontJSON.word[slots] + "</span>"
        }
      }
      
      //css 
      divOne.style.cssText = "text-align:center;"
      divOne.style.fontSize = "x-large"
      divFour.style.cssText = "text-align:center;"
      divFour.style.fontSize = "x-large"
      divFive.style.cssText = "text-align:center;"
      divFive.style.fontSize = "large"
      divThree.style.cssText = "text-align:center;" 
      divThree.style.fontSize = "large"
      divTwo.style.cssText = "overflow:scroll;"
      divTwo.style.cssText = "margin-top:3%"
      buttonDir.style.cssText = "width:5%"
      buttonDir.innerHTML = "Go back"
      buttonDir.href = "/"
      buttonDir.className = "btn btn-primary"
      
      //appending all of the text variables into their respective divs
      divThree.append(divThreeIn)
      divThree.append(meaningRoot)
      divFour.append(rootLabel)
      divFour.append(rootAppend)
      divFive.append(divFiveIn)
      divFive.append(meaningWord)
      div.append(divOne)
      div.append(divFour)
      div.append(divFive)
      div.append(divThree)
      div.append(divTwo)
      div.append(buttonDir)
      topDiv.append(topDivReplace)
      //replacing the new fully added div to the ui where the form used to be
      replace.replaceWith(div);
      replaceTop.replaceWith(topDiv)
    }
    else{
      console.log("here")
      var replace = document.getElementById("formDiv")
      var errorDiv = document.createElement("div")
      var errorMsg = document.createElement("p")
      errorMsg.style.cssText = "width:100%"
      errorMsg.style.cssText = "text-align:center;" 
      errorMsg.style.fontSize = 'large'
      var buttonDir = document.createElement("a")
      buttonDir.innerHTML = "Go back"
      buttonDir.style.cssText = "width:5%"
      buttonDir.innerHTML = "Go back"
      buttonDir.href = "/"
      buttonDir.className = "btn btn-primary"
      var errorMsgIn = document.createTextNode("Nothing exists for your entry, please enter something different!")
      errorMsg.append(errorMsgIn)
      errorDiv.append(errorMsg)
      errorDiv.append(buttonDir)
      replace.replaceWith(errorDiv)
    }
  }})
}

function submitformImage(){
  var formData = new FormData()
  var fileInit = document.getElementById('inputFile')
  console.log(fileInit.files[0])
  formData.append('image', fileInit.files[0])
  $.ajax({
  type: "POST",
  url: "submitImage",
  data: formData,
  contentType: false, 
  processData: false,
  success: function(res){
    var replace = document.getElementById("formDiv")
    var replaceTop = document.getElementById("directions")
    var frontJSON = {}
    frontJSON.wordArr = []
    var results = JSON.parse(res)
    frontJSON.root = JSON.parse(results.root).build
    frontJSON.rootMeaning = JSON.parse(results.root).buildMeaning
    if(frontJSON.root != "" || frontJSON.rootMeaning != ""){
      if(JSON.parse(results.rootMeaning).words){
        var wordArr = JSON.parse(results.rootMeaning).words.split("\n")
        wordArr.forEach(function(obj){
          if(obj.includes("(")){
            frontJSON.wordArr.push(obj)
          }
        })
      }
      else{
        var wordArr = ""
        frontJSON.wordArr = wordArr
      }
      frontJSON.wordMeaning = JSON.parse(results.wordMeaning).text[0]
      frontJSON.word = results.word
      //main div to hold everything
      var div = document.createElement("div")
      var topDiv = document.createElement("div")
      //five divs for the contents 
      var divOne = document.createElement("div")
      var divTwo = document.createElement("div")
      var divThree = document.createElement("div")
      var divFour = document.createElement("div")
      var divFive = document.createElement("div")
      //button to return to main page
      var buttonDir = document.createElement("a")
      //elements needed for the table of different words
      var table = document.createElement("table")
      var verbTable = document.createElement("table")
      var tblBody = document.createElement("tbody")
      var verbBody = document.createElement("tbody")
      var rowOne = document.createElement("td")
      var rowTwo = document.createElement("td")
      var rowThree = document.createElement("td")
      var rootTop = document.createElement("tr")
      var nounTop = document.createElement("tr")
      var verbTop = document.createElement("tr")
      var nounTopP = document.createElement("p")
      var nounTopIn = document.createTextNode("Alternative noun forms found for root:")
      rootTop.innerHTML = "Root detected"
      nounTopP.append(nounTopIn)
      nounTop.append(nounTopP)
      verbTop.innerHTML = "Alternative verb forms found for root:"
      rootTop.style.fontSize = "large"
      nounTopP.style.fontSize = "large"
      verbTop.style.fontSize = "large"
      rowOne.append(nounTop)
      rowTwo.append(verbTop)
      rowThree.append(rootTop)
      //for loop though the different words for the table 
      var divTable = document.createElement("div")
      var divTableThree = document.createElement("div")
  
      if(frontJSON.wordArr.length){
        for(let items in frontJSON.wordArr){
          console.log(frontJSON.wordArr[items].indexOf("."))
          if(frontJSON.wordArr[items].indexOf(".") != -1){
            console.log("yup")
            continue
          }
          else{
            console.log("nope")
          }
          // Nouns
          if(frontJSON.wordArr[items].includes('”)') && !frontJSON.wordArr[items].includes('Form')){
            console.log("noun")
            var colOne = document.createElement("tr")
            var nounRowCell = document.createElement("td")
            var firstDiv = document.createElement("div")
            var firstMatch = document.createElement("p")
            firstMatch.style.cssText = "margin-left: 3%;"
            var matchText = document.createTextNode(frontJSON.wordArr[items])
            colOne.innerHTML = frontJSON.wordArr[items]
            firstMatch.append(matchText)
            firstDiv.append(firstMatch)
            rowOne.append(firstDiv)
          }
          // Verbs 
          else if(items > 0 && frontJSON.wordArr[items].indexOf(".") == -1 && !frontJSON.wordArr[items].includes("• (")){
            console.log("verb")
            console.log(frontJSON.wordArr[items])
            console.log("here")
            if(frontJSON.wordArr[items].includes("Form")){
              console.log(frontJSON.wordArr[items])
              var verbRow = document.createElement("tr")
              var verbRowCell = document.createElement("td")
              var firstMatch = document.createElement("p")
              var matchText = document.createTextNode(frontJSON.wordArr[items])
              var firstDiv = document.createElement("div")
              firstMatch.append(matchText)
              firstDiv.append(firstMatch)
              verbRowCell.append(firstDiv)
              verbRow.append(verbRowCell)
              rowTwo.append(verbRow)
            }
            else{
              console.log(frontJSON.wordArr[items])
              var verbRowCell = document.createElement("td")
              var firstMatch = document.createElement("p")
              var matchText = document.createTextNode(frontJSON.wordArr[items])
              var firstDiv = document.createElement("div")
              firstMatch.append(matchText)
              firstDiv.append(firstMatch)
              verbRowCell.append(firstDiv)
              verbRow.append(verbRowCell)
              rowTwo.append(verbRow)
            }
          }
          // Chart starter
          else{
            var colThree = document.createElement("tr")
            var firstDiv = document.createElement("div")
            var firstMatch = document.createElement("p")
            var matchText = document.createTextNode(frontJSON.wordArr[items])
            colThree.innerHTML = frontJSON.wordArr[items]
            rowThree.append(colThree)
            firstMatch.append(matchText)
            firstDiv.append(firstMatch)
            divTable.append(firstDiv)
            console.log(matchText)
          }
        }
        //make these into a table
        tblBody.append(rowThree)
        tblBody.append(rowOne)
        tblBody.append(rowTwo)
        table.append(tblBody)
        table.style.cssText = "width:100%"
        divTwo.append(table)
      }
      else{
        var errorMsg = document.createTextNode("We're sorry! No alternative word forms were found for this word.")
        var errorP = document.createElement('p')
        errorP.append(errorMsg)
        divTwo.append(errorP)
        errorP.style.cssText = "width:100%"
        errorP.style.cssText = "text-align:center;" 
        errorP.style.fontSize = 'large'
      }
  
      //creating all of the text variables
      var breakLine = document.createElement("br")
      var topDivReplace = document.createTextNode("")
      var meaningRoot = document.createTextNode(frontJSON.rootMeaning)
      var rootLabel = document.createTextNode("The root letters of this word are: ")
      var rootAppend = document.createTextNode(frontJSON.root)
      var meaningWord = document.createTextNode(frontJSON.wordMeaning)
      var divFiveIn = document.createTextNode("Translation of this word: ")
      var divThreeIn = document.createTextNode("Translation of this root: ")
  
      // starting the color coding of the word
      var check = []
      for(var t = 0; t < frontJSON.root[0].length; t++){
        check[t] = 0
      }
      var colorHolder = []
      for(var i = frontJSON.word.length - 1; i > -1; i--){
        for(var r = frontJSON.root[0].length - 1 ; r > -1; r--){
          if(frontJSON.word[i] === frontJSON.root[0][r] && check[r] === 0){
            colorHolder[i] = 1
            check[r] = 1
            break
          }
          else{
            colorHolder[i] = 0
          }
        }
      }
      for(let slots in colorHolder){
        if(colorHolder[slots] === 1){
          divOne.innerHTML += "<span style='color:red'>" + frontJSON.word[slots] + "</span>"
        }
        else{
          divOne.innerHTML += "<span>" + frontJSON.word[slots] + "</span>"
        }
      }
      
      //css 
      divOne.style.cssText = "text-align:center;"
      divOne.style.fontSize = "x-large"
      divFour.style.cssText = "text-align:center;"
      divFour.style.fontSize = "x-large"
      divFive.style.cssText = "text-align:center;"
      divFive.style.fontSize = "large"
      divThree.style.cssText = "text-align:center;" 
      divThree.style.fontSize = "large"
      divTwo.style.cssText = "overflow:scroll;"
      divTwo.style.cssText = "margin-top:3%"
      buttonDir.style.cssText = "width:5%"
      buttonDir.innerHTML = "Go back"
      buttonDir.href = "/"
      buttonDir.className = "btn btn-primary"
      
      //appending all of the text variables into their respective divs
      divThree.append(divThreeIn)
      divThree.append(meaningRoot)
      divFour.append(rootLabel)
      divFour.append(rootAppend)
      divFive.append(divFiveIn)
      divFive.append(meaningWord)
      div.append(divOne)
      div.append(divFour)
      div.append(divFive)
      div.append(divThree)
      div.append(divTwo)
      div.append(buttonDir)
      topDiv.append(topDivReplace)
      //replacing the new fully added div to the ui where the form used to be
      replace.replaceWith(div);
      replaceTop.replaceWith(topDiv)
    }
    else{
      console.log("here wowsers")
      var replace = document.getElementById("formDiv")
      var errorDiv = document.createElement("div")
      var errorMsg = document.createElement("p")
      errorMsg.style.cssText = "width:100%"
      errorMsg.style.cssText = "text-align:center;" 
      errorMsg.style.fontSize = 'large'
      var buttonDir = document.createElement("a")
      buttonDir.innerHTML = "Go back"
      buttonDir.style.cssText = "width:5%"
      buttonDir.innerHTML = "Go back"
      buttonDir.href = "/"
      buttonDir.className = "btn btn-primary"
      var errorMsgIn = document.createTextNode("Nothing exists for your entry, please enter something different!")
      errorMsg.append(errorMsgIn)
      errorDiv.append(errorMsg)
      errorDiv.append(buttonDir)
      replace.replaceWith(errorDiv)
    }
  }})
}
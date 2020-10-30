 //settings
    /*yamli settings*/
    if (typeof(Yamli) == 'object' && Yamli.init({ startMode:'on' })){
        Yamli.yamlify('text', {settingsPlacement:'hide', uiLanguage:'en'});
      }
      //methods 
      function submitform(){
        var formData = document.getElementById("text").value 
        // console.log(formData)
        var jsonform = {data: formData}
        var jsonObj = JSON.stringify(jsonform)
        // console.log(jsonObj)
        $.ajax({
          type: "POST",
          url: "submitArabic",
          data: jsonObj,
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          success: function(res){
            //TODO: Error handle the stuff that I fixed in the back end
            var replace = document.getElementById("formDiv")
            var replaceTop = document.getElementById("directions")
            var frontJSON = {}
            frontJSON.wordArr = []
            var results = JSON.parse(res)
            frontJSON.root = JSON.parse(results.root).build
            frontJSON.rootMeaning = JSON.parse(results.root).buildMeaning
            // console.log(frontJSON.rootMeaning)
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
            var tblBody = document.createElement("tbody")
            //for loop though the different words for the table 
            // console.log(frontJSON.wordArr)
            if(frontJSON.wordArr.length){
              for(let items in frontJSON.wordArr){
                if(items == 0){
                  var firstDiv = document.createElement("div")
                  var firstMatch = document.createElement("p")
                  var matchText = document.createTextNode(frontJSON.wordArr[items])
                  firstMatch.append(matchText)
                  firstDiv.append(firstMatch)
                  divTwo.append(firstDiv)
                }
                else{
                  var tableDiv = document.createElement("div")
                  if(frontJSON.wordArr[items].includes("Form")){
                    var row = document.createElement("tr")
                    var col = document.createElement("td")
                    var words = document.createTextNode(frontJSON.wordArr[items])
                    col.append(words)
                    row.append(col)
                    tblBody.append(row)
                  }
                  else if(frontJSON.wordArr[items].includes("\")") && !frontJSON.wordArr[items].includes("Form")){
                    var secondDiv = document.createElement("div")
                    var secondMatch = document.createElement("p")
                    var secondMatchText = document.createTextNode(frontJSON.wordArr[items])
                    secondMatch.append(secondMatchText)
                    secondDiv.append(secondMatch)
                    divTwo.append(secondDiv)
                  }
                  else{
                    var row = document.createElement("tr")
                    var col = document.createElement("td")
                    var words = document.createTextNode(frontJSON.wordArr[items])
                    col.append(words)
                    row.append(col)
                    tblBody.append(row)
                  }
                }
                // table.append(tblBody)
                // tableDiv.append(table)
                // divTwo.append(tableDiv)
                }
            }
            else{
              var errorMsg = document.createTextNode("We're sorry! No alternative word forms were found for this word.")
              divTwo.append(errorMsg)
              divTwo.style.cssText = "text-align:center;" 
              divTwo.style.fontSize = "large"
            }
  
            //creating all of the text variables
            var breakLine = document.createElement("br")
            var topDivReplace = document.createTextNode("")
            var meaningRoot = document.createTextNode(frontJSON.rootMeaning)
            var rootAppend = document.createTextNode(frontJSON.root)
            var meaningWord = document.createTextNode(frontJSON.wordMeaning)
            var divFiveIn = document.createTextNode("Translation of this word: ")
            var divThreeIn = document.createTextNode("Translation of this root: ")
            // starting the color coding of the word
            var colorHolder = []
            for(var i = frontJSON.word.length - 1; i > -1; i--){
              for(var r = frontJSON.root[0].length - 1 ; r > -1; r--){
                if(frontJSON.word[i] === frontJSON.root[0][r]){
                  colorHolder[i] = 1
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
            buttonDir.style.cssText = "width:5%"
            buttonDir.innerHTML = "Go back"
            buttonDir.href = "/"
            buttonDir.className = "btn btn-primary"
           
            //appending all of the text variables into their respective divs
            divThree.append(divThreeIn)
            divThree.append(meaningRoot)
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
        })
      }
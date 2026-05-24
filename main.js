   const search = document.getElementById("search")
         const level = document.getElementById("level")
         const scoreID = document.getElementById("score")
        let oldText = false
         let score = Number(localStorage.getItem("score")) || 0
         const levelList = ["Newbie", "Casual", "Scholar", "Studious", "Researcher", "Investigator", "Avid Investigator", "Mastermind", "Genius", "Extreme Genius"]

         function update() {
                            scoreID.innerText = score
                level.innerText = levelList[Math.floor(score / 100) > levelList.length ? levelList.length: Math.floor(score / 100)]
         }
         update()
    async function searchWiki(text, isCate, limit, add) {
        const wikiLoad = document.getElementById("wikiLoad")
        const card = document.getElementById("card")
       const searchCont = document.getElementById("searchCont")
       if (!add || oldText) {
         searchCont.innerHTML = ""
         oldText = false
       }
      
if (isCate === "search") {
        fetch("https://en.wikipedia.org/w/api.php?action=opensearch&search=" + text + "&limit=" + limit + "&format=json&origin=*")
        .then(res => res.json())
        .then(response => {
            console.log(response)
             if (response[1].length === 0) {
                const none = document.createElement("p")
                none.innerText = "Sorry, none are found"
                none.className = "None"
                searchCont.appendChild(none)
                console.log("There is none")
                 return
            }
         response[1].forEach(async (item, index) => {

             const cardClone = card.content.cloneNode(true)
             const info = cardClone.querySelector("#info")
       const title = cardClone.querySelector("#title")
              cardClone.querySelector(".card").addEventListener("click", e => {
                window.open(response[3][index])
                score += 5
                localStorage.setItem("score", score)
                update()
              })
            
               title.innerText = response[1][index]
  fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + response[1][index].replaceAll(" ", "_"))
                .then(res => res.json())
                .then(sum => {

                    cardClone.querySelector(".card").style.backgroundImage = "url('" + sum.originalimage?.source + "')"
                    document.body.style.backgroundImage = "url('" + sum.originalimage?.source + "')"
              
                  console.log(sum)
                    if (sum.extract.split("")[200]) {
                        
                        info.innerText = sum.extract.slice(0,200) + "..."
                    }
                    else {
                        info.innerText = sum.extract
                    }
                    console.log("working")
                    searchCont.appendChild(cardClone)
                })
           
         })
          
        })
    }
    else if (isCate === "categories") {
        fetch("https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:" + text.replaceAll(" ", "_") + "&cmlimit=10&format=json&origin=*")
        .then(resp => resp.json())
        .then(response => {
            console.log(response)
            response.query.categorymembers.forEach(item => {
                 const cardClone = card.content.cloneNode(true)
             const info = cardClone.querySelector("#info")
       const title = cardClone.querySelector("#title")
       title.innerText = item.title.replace("Category:", "")

       cardClone.querySelector(".card").addEventListener("click", e => {
        window.open("https://en.wikipedia.org/wiki/" + item.title.replaceAll(" ", "_"))
        
       })
      
       searchCont.appendChild(cardClone)
            })
            if (response.query.categorymembers.length === 0) {
                console.log("There is none")
            }
        })
    }

    else if (isCate === "images") {
        fetch("https://en.wikipedia.org/w/api.php", {})
        .then(resp => resp.json())
        .then(response => {
            console.log(response)
        })
    }
    }
    search.parentElement.addEventListener("submit", async event => {
        event.preventDefault()
        await searchWiki(search.value, "search", 10, false)
    })
   

    document.addEventListener("click", async event => {

     
    })

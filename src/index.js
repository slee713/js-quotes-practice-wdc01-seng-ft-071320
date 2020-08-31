const baseUrl = "http://localhost:3000/quotes/"
const withLikesUrl = "http://localhost:3000/quotes?_embed=likes"
const likesUrl = "http://localhost:3000/likes/"

const quoteList = document.querySelector("#quote-list")
const form = document.querySelector("#new-quote-form")

fetchQuotes()
function fetchQuotes(){
    fetch(withLikesUrl)
    .then(res => res.json())
    .then(quoteArray => showQuotes(quoteArray))
}


function showQuotes(quoteArray){
    quoteArray.forEach(quote => createQuote(quote))
}

function createQuote(quote){
    let li = document.createElement("li")
    li.className = "quote-card"

    let blockQuote = document.createElement("blockquote")
    blockQuote.className = "blockquote"

    let p = document.createElement("p")
    p.className = "mb-0"
    p.innerText = quote.quote

    let footer = document.createElement("footer")
    footer.className = "blockquote-footer"
    footer.innerText = quote.author

    let br = document.createElement("br")

    let likeBtn = document.createElement("button")
    likeBtn.className = "btn-success"
    likeBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`

    let deleteBtn = document.createElement("button")
    deleteBtn.className = "btn-danger"
    deleteBtn.innerText = "Delete"

    blockQuote.append(p, footer, br, likeBtn, deleteBtn)
    li.append(blockQuote)
    quoteList.append(li)

    deleteBtn.addEventListener("click", ()=> {
        let config = {
            method: "DELETE"
        }
        fetch(baseUrl+`${quote.id}`, config)
        li.remove()
    })

    likeBtn.addEventListener("click", () => {
        let config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quoteId: quote.id
            })
        }
        fetch(likesUrl, config)
        .then(res => res.json())
        .then(like => {
            quote.likes.push(like)
            likeBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`
        })
    })
}

form.addEventListener("submit", ()=>{
    event.preventDefault()
    let newQuote = document.querySelector("#new-quote").value
    let author = document.querySelector("#author").value
    let likes = []
    let config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote: newQuote,
            author: author,
            likes: likes,
        })
    }
    fetch(withLikesUrl, config)
    .then(res => res.json())
    .then(newQuote => createQuote(newQuote))
    form.reset()
})

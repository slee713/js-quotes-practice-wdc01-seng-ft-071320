

const baseUrl = "http://localhost:3000/quotes/"
const withLikesUrl = "http://localhost:3000/quotes?_embed=likes"
const likesUrl = "http://localhost:3000/likes/"

const quoteList = document.querySelector("#quote-list")
const form = document.querySelector("#new-quote-form")

//make hidden form
let formContainer = document.querySelector(".form-container")

let editForm = document.createElement("form")
editForm.setAttribute("id", "edit-quote-form")

let quoteLabel = document.createElement("label")
quoteLabel.innerText = "Quote"
quoteLabel.setAttribute("for", "edit-quote")

let quoteInput = document.createElement("input")
quoteInput.setAttribute("name", "quote")
quoteInput.setAttribute("type", "text")
quoteInput.setAttribute("class", "form-control")
quoteInput.setAttribute("id", "edit-quote")

let quoteID = document.createElement("input")
quoteID.setAttribute("type", "hidden")

let authorLabel = document.createElement("label")
authorLabel.innerText = "Author"
authorLabel.setAttribute("for", "Author")

let authorInput = document.createElement("input")
authorInput.setAttribute("name", "author")
authorInput.setAttribute("type", "text")
authorInput.setAttribute("class", "form-control")
authorInput.setAttribute("id", "author")

let submit = document.createElement("button")
submit.setAttribute("type", "submit")
submit.setAttribute("class", "btn btn-primary")
submit.innerText = "Edit"


editForm.append(quoteID, quoteLabel, quoteInput, authorLabel, authorInput, submit)

formContainer.append(editForm)
formContainer.style.display = "none"

submit.addEventListener("click", ()=>{
    event.preventDefault()
    id = quoteID.value
    editedQuote = quoteInput.value
    editedAuthor = authorInput.value
    config = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            quote: editedQuote,
            author: editedAuthor
        })
    }
    fetch(baseUrl+`${id}`, config)
    .then(res => res.json())
    .then(()=>{
        form.reset()
        formContainer.style.display = "none"
        quoteList.innerHTML = ""
        fetchQuotes()
    })
})







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

    let editBtn = document.createElement("button")
    editBtn.innerText = "Edit"

    blockQuote.append(p, footer, br, likeBtn, deleteBtn, editBtn)
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

    editBtn.addEventListener("click", () => {
        formContainer.style.display = "block"
        quoteID.value = quote.id
        quoteInput.value = quote.quote
        authorInput.value = quote.author
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

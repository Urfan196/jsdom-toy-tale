let addToy = false
let allToys = []

document.addEventListener("DOMContentLoaded", ()=>{
  fetchToys()
  listenToFormSubmit()
  listenToClicks()
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }
  })

})

function getToyCollection() {
  return document.querySelector("#toy-collection")
}

// Fetchin All Toys
function fetchToys() {
  fetch('http://localhost:3005/toys')
    .then(res => res.json())
   .then(allToysJson => {
      allToys = allToysJson;
      getToyCollection().innerHTML = allToys.map(toy => renderSingleToy(toy)).join('')
  })
}

function renderSingleToy(toy) {
  return `
  <div class= "card" id="${toy.id}">
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p id="likes">${toy.likes}</p>
    <button class="like-btn" data-id="${toy.id}" >Like <3</button>
  </div>`
}

// Adding New Toy
function getToyInfo(event) {
  const form = event.target
  const name = form.name.value
  const image = form.image.value

  const toy = {
    name: name,
    image: image
  }

  createToy(toy)
}

function createToy(toy) {
  fetch('http://localhost:3005/toys', {
    method: "POST",
    headers: 
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
     
    body: JSON.stringify({
      "name": `${toy.name}`,
      "image": `${toy.image}`,
      "likes": `${toy.likes}`
    })
  })
  .then(resp => resp.json())
  .then(toy => {
    const newDiv = document.createElement('div')
    newDiv.innerHTML = renderSingleToy(toy)
    getToyCollection().appendChild(newDiv)
  })
}

function listenToFormSubmit() {
  const newPokeForm = document.querySelector('.add-toy-form')
  newPokeForm.addEventListener('submit', function(e) {
    e.preventDefault()
    getToyInfo(e)
  })
}

// Increase Like
function listenToClicks() {
  getToyCollection().addEventListener('click', function(event) {
    const toyId = event.target.dataset.id
    const likes = document.querySelector('#likes')
    fetch(`http://localhost:3005/toys/${toyId}`, {
      method: "PATCH",
      headers: 
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": Number(likes.textContent) + 1
      })      
    })
    .then(resp => resp.json())
    .then(data => {
      likes.textContent = data.likes
    })
  });
}
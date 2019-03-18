// Aquí deberíamos hacer las funciones del DOM, y pasar todo lo anterior al main.js
//fetch data firebase
let usersData = {};
var userId = null;
fetch('https://tejiendo-en-azul.firebaseio.com/users.json').then(
  response => {
    return response.json();
  }).then(data => {
  usersData = data;
  return usersData;
}).then((usersData) => {
  firebase.auth().onAuthStateChanged((user) => {
    if(user){
      userId = user.uid
      console.log(user.uid);
    }
  })
})

const app = {
  pages: [],
  show: new Event('show'),
  init: () => {
    app.pages = document.querySelectorAll('.page'); //identifica las secciones que tienen la clase page
    app.pages.forEach((pg) => {
      pg.addEventListener('show', app.pageShown);
    })
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', app.nav);
    })
    history.replaceState({}, 'Login', '#login');
    window.addEventListener('popstate', app.poppin);
  },
  nav: (ev) => {
    ev.preventDefault(); //mata evento que te lleva al inicio de la página (href="#")
    let currentPage = ev.target.getAttribute('data-target');
    console.log(document.querySelector('.active'));
    document.querySelector('.active').classList.remove('active');
    document.getElementById(currentPage).classList.add('active');
    //recuerda la página a la que se mueve, y le agrega # a la url de la página donde está posicionado
    history.pushState({}, currentPage, `#${currentPage}`)
  },
  pageShown: (ev) => {

  },
  poppin: (ev) => {
    console.log(location.hash);
    let hash = location.hash.replace('#', '');
    document.querySelector('.active').classList.remove('active');
    document.getElementById(hash).classList.add('active');
    console.log(hash);
  }
}
document.addEventListener('DOMContentLoaded', app.init);


// //evento click en el modal:
// const postButton = document.getElementById('post-btn');
// const postCard = document.getElementById('post-card');
// postButton.addEventListener('click', () => {
//   //agrarrar el valor del textarea del modal para ponerlo en la tarjeta de la publicación :D
//   const messageText = document.getElementById('message-text');
//   console.log(usersData);
//   messageText.innerHTML = '';
//   firebase.auth().onAuthStateChanged((user) => {
//   console.log(usersData[user.uid].nickName);
//   for(let id in usersData){
//     if(uid === id){
//       console.log(uid);
//       console.log(id);
//       const posting = document.getElementById('posting');
//       posting.insertAdjacentHTML('beforeend', `<div class="card text-white bg-dark mb-3" style="max-width: 18rem;">
//       <div class="card-header">${usersData[user.uid].nickName}</div>
//       <div class="card-body">
//         <p id="post-card" class="card-text">${messageText.value}</p>
//       </div>
//     </div>`)
      
//     }
//     }
//   })
  
// })
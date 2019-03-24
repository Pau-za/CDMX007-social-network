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
    if (user) {
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



///////////////Funcion para realizar nuevos post///////////////////

const db = firebase.database(); //metodo que contiene los metodos para utilizar real time
const rootRef = firebase.database().ref(); //ref es un metodo que nos premite dirigirnos a algun lugar en especifico

//CONSTANTES

const postButton = document.getElementById('post');
//const postCard = document.getElementById('post-card');
const wall = document.getElementById('wall');
const newPost = document.getElementById('message-text');


//EVENTOS 
postButton.addEventListener('click', (event) => {
  firebase.auth().onAuthStateChanged((user) => {
    const newPostData = {
      message: newPost.value
    }

    const postDataWithUser = {
      userId: usersData[user.uid].name,
    }
    // console.log(postDataWithUser)

    const newPostKey = rootRef.child('post').push().key;

    db.ref('users' + '/' + userId + '/post/' + newPostKey).update(newPostData);
    db.ref(`wall/${newPostKey}`).update(postDataWithUser);
  })
  event.preventDefault();
  location.reload();
})

// Nombre de usuario
const userMyName = document.getElementById('user-name').innerHTML = displayName;
db.ref('users/').on('value', (snapshot) => {
  const allUsers = snapshot.val(); //retorna el objeto de usuarios de base de datos
  wall.innerHTML = '';
  for (usersId in allUsers) {
    console.log(allUsers);
    const usersNickName = usersData[usersId].nickName; //obtenemos los nicknames de todos los usuarios
    const usersPosts = usersData[usersId].post; //obtenemos los posts de cada usuario
    const usersPicture = usersData[usersId].photoUser;
    const usersName = usersData[usersId].name;
    const usersPreferences = usersData[usersId].preferences;
    for (eachPost in usersPosts) {
      if (usersPosts.hasOwnProperty(eachPost)) {
        const element = usersPosts[eachPost];
        console.log(element);
        console.log(eachPost)
        wall.insertAdjacentHTML('afterend', `<div class="card text-white bg-dark mb-3" style="max-width: 18rem;">
        <figure><img src = "${usersPicture}" alt = "Imagen de usuario" class="img-thumbnail" style="width: 30%"></figure>
        <div class="card-header">${usersNickName}</div>
               <div class="card-body">
               <p id="post-card" class="card-text">${element.message}</p>
               </div> 
               <div id="${usersId}" ><button id="${eachPost}" class = "trash-btn"><i class="far fa-trash-alt"></i></button>
               <button >Editar publicación</button></div>
               </div>`)
        //identifica al usuario activo, y compara su id con los id de la base de datos
        if (firebase.auth().currentUser.uid !== usersId) {
          //siempre que el id no coincida con el de usuario activo, va a quitar el ícono de basurita
          // por lo tanto usuario solo tendrá acceso a borrar sus publicaciones
          document.getElementById(usersId).style.display = 'none';
        }
      }
      //sección perfil usuario
      //Primera parte
      if (firebase.auth().currentUser.uid === usersId) {
        document.getElementById('user-photo').innerHTML = `
                        <img src = " ${photoURL} "  class="img-thumbnail" alt = "Imagen de usuario" style="width: 100%">`;
        document.getElementById('user-name').innerHTML = usersName;
        //Segunda parte
        document.getElementById('nick-name').innerHTML = `<br>${usersNickName}</br>`;
        //Tercera parte
        document.getElementById('preferences').innerHTML = `<br>${usersPreferences}</br>`;
      }
    }
  }
  //evento click en botón basurita
  const deleteElement = document.getElementsByClassName('trash-btn');
  console.log(deleteElement);
  for (let i = 0; i < deleteElement.length; i++) {
    deleteElement[i].addEventListener('click', (ev) => {
      ///Alert para confirmar delete
      const option = confirm("Estás seguro de que quieres eliminar tu publicación");
      if (option == true) {
        //message = "Mensaje Borrado";
        console.log(firebase.auth().currentUser.uid, usersId);
        const postId = ev.currentTarget.id;
        console.log(postId);
        fnDelete(uid, postId);
        location.reload();
      } else {
        alert("Cancelado");
      }



      // db.ref('users' + '/' + userId + '/post/' + newPostKey).update(newPostData);
      // db.ref(`wall/${newPostKey}`).update(postDataWithUser);
    })
  }
})

//////// función para borrar publicaciones ///////////
const fnDelete = (uid, postId) => {
  db.ref('users/').on('value', (snapshot) => {
    console.log('mensaje borrado')

    firebase.auth().onAuthStateChanged((user) => {
      if (!!user) {
        const allUsers = snapshot.val(); //retorna el objeto de usuarios de base de datos
        for (usersId in allUsers) {
          if (usersId === uid) {
            const usersPosts = usersData[usersId].post;
            for (eachPost in usersPosts) {
              if (eachPost === postId) {
                // const element = usersPosts[eachPost];
                db.ref('users' + '/' + userId + '/post/' + eachPost).set(null);
              }
            }
          }
        }
      }
    })
  })
}


///////////////// CÓDIGO PARA PINTAR PUBLICACIONES DEL USUARIO LOGEADO /////////////////

// db.ref('wall/').on('value', (snapshot)=>{

//   const allPost = snapshot.val();
//   console.log(snapshot.val())
//   wall.innerHTML= '';
//   const nameUser = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'))
//   for (objectMessage in allPost){
//     const nickName = usersData[userId].nickName
//     const singleMessage = usersData[userId].post;
//     for (const key in singleMessage) {
//       if (singleMessage.hasOwnProperty(key)) {
//         // if(objectMessage === key){
//         const element = singleMessage[key];
//         console.log(element);
//         wall.innerHTML += `<div class="card text-white bg-dark mb-3" style="max-width: 18rem;">
//         <div class="card-header">${nickName}</div>
//         <div class="card-body">
//         <p id="post-card" class="card-text">${element.message}</p>
//         </div>
//         </div>`
//       }
//     }
//     return 
//   }
// })

/// Validar los inputs
///CONSTANTES

const inputFantasticName = document.getElementById('validationServerUsername');
const inputPreferences = document.getElementById('validationServer04');

/// Funcion para validar input nombrefantastico
const validateFantasticName = (string) => {
  if (string.value === '') {
    // alert('Por favor escribe u n nombre de usuario')
  }
}

validateFantasticName(inputFantasticName);

//Input solo acepta números 
const inputAge = document.getElementById("validationServer05");

const validationAge = (number) => {
  if (isNaN(number.age.value) == true || /^[1-9]\d$/.test(number.age.value) == false) {
    alert('Edad debe ser un número');
    correcto = false;
  }

}

//input de ciudad o estado

const inputState = document.getElementById("validationServer03");

const validationState = (string) => {
  if (string.value === "") {
    alert("Te falta decirnos de donde eres")
  }
}
// Perfil de usuario
// Foto de perfil
// const userPhoto = usersData

// // const pictureUser = firebase.auth().currentUser.photoURL;
// // console.log(pictureUser)
// const userPicture = document.getElementById('user-photo').innerHTML = `
//   <img src = "${pictureUser}" alt = "Imagen de usuario">`


//Función de botón de hamburguesa
const burgerBtn = document.getElementById('burger');
burgerBtn.addEventListener('click', () => {
  console.log('holi');
  let bars = document.getElementById("header-buttons");
  if (bars.style.display === "block") {
    bars.style.display = "none";
  } else {
    bars.style.display = "block";
  }
})
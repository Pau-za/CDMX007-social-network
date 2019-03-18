(() => {
  // Inicia el widget de FirebaseUI usando Firebase.
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // el usuario se registró exitosamente
        // Return determina si continúa a la redirección automática
        // o si deja que el desarrollador lo maneje
        window.location.replace("#profile");
        document.getElementById('general-menu').style.display = 'block';
        return true;
      },
      uiShown: function () {
        // El widget está renderizado.
        // Esconde el loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // se usa popup para el ingreso del flujo de los provedores de IDP en lugar del predeterminado, redirecciona.
    signInFlow: 'popup',
    signInSuccessUrl: '#',
    signInOptions: [
      // Solo dejamos las líneas de las formas de registro que vamos a utilizar.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      //firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Términos del servicio de url.
    // tosUrl: '../html/user-information.html',
    // Url de la política de privacidad.
    //privacyPolicyUrl: '<your-privacy-policy-url>'
  }
  // El método de inicio va a comenzar hasta que el dominio se cargue.
  ui.start('#firebaseui-auth-container', uiConfig);
})();

// Verificar correo de nuevo usuario
const verifyEmail = () => {
  const user = firebase.auth().currentUser;
  user.sendEmailVerification().then(() => {
    // Email sent.
    console.log('enviando correo');
  }).catch((error) => {
    // An error happened.
    console.log(error);
  });
}

//Acceso con Google
const firebaseContainer = document.getElementById('firebaseui-auth-container');
firebaseContainer.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider)
    .catch(e => console.log(e.message))
  firebase.auth().getRedirectResult().then(() => {
    //pide verificar el correo mediante una liga que llega a su cuenta de email
    verifyEmail();
  }).catch(function (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorCode);
    alert(errorMessage);
  });
  
  //Acceso con Facebook
  const providerFacebook = new firebase.auth.FacebookAuthProvider();
  providerFacebook.addScope('public_profile')
  firebase.auth().signInWithRedirect(providerFacebook).then(function (result) {
    if (result.credential) {
      verifyEmail();
    }
  }).catch(function (error) {
    // ...
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
    alert(errorCode);
    alert(errorMessage);
  });
})

 //Función de observador de estado de usuarios
//  const menu = 
const observerFn = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('hay usuario activo')

      if (user.emailVerified) {
       document.getElementById('general-menu').style.display = 'block';
       //  document.getElementById('login').classList.remove('active'); 
       window.location.replace("#profile");      
      }
      // ...
    } else {
      console.log('no hay usuario activo')
      uid = null;
      document.getElementById('general-menu').style.display = 'block';
     //  document.getElementById('login').classList.add('active');
      window.location.replace("#login");
      
      // User is signed out.
      // ...
    }
  })
}
observerFn();

// Cerrar sesión
const logOut = () => {
  firebase.auth().signOut();
}

const logOutButton = document.getElementById('logout');
logOutButton.addEventListener('click', () => {
  logOut();
})
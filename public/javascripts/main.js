let mainApp = {};
let data = {};
let uid = '';
(() => {
 const firebase = appFireBase;
 uid = null;
 firebase.auth().onAuthStateChanged((user) => {
   if (user) {
     console.log(user);
     // Usuario está registrado
     uid = user.uid;
     displayName = user.displayName;
     email = user.email;
     photoURL = user.photoURL;

     firebase.database().ref('users/').on('value', (snapshot) => {
       // let str = '';
       const allUsers = snapshot.val(); //retorna el objeto de usuarios de base de datos

       for (const key in allUsers) {
         if (allUsers.hasOwnProperty(key)) {
           const element = allUsers[key];
           if (uid === key) {
             console.log(uid)
             console.log(userId)
             window.location.replace("#user-wall");
             console.log('uid en base de datos')
             break
           } else if(uid !== key ) {
             window.location.replace("#user-information");
             console.log('NO uid en base de datos')
           }

         }
       }
     })
     if (uid === null || uid === undefined) {
       window.location.replace("#login")
       console.log('uid nulo')
       return
     }
   }
 })



 const logOut = () => {
   firebase.auth().signOut();
 }

 const messageHandler = (err) => {
   if (!!err) {
     console.log(err)
   } else {
     console.log("success");
   }
 }

 const fnCreate = () => {
   const inputName = document.getElementById('validationServer01').value;
   const inputLastName = document.getElementById('validationServer02').value;
   const inputAge = document.getElementById('validationServer05').value;
   const inputNickName = document.getElementById('validationServerUsername').value;
   const inputState = document.getElementById('validationServer03').value;
   const inputPreferences = document.getElementById('validationServer04').value;
   const path = 'users/' + uid;
   data = {
     name: inputName,
     lastname: inputLastName,
     age: inputAge,
     nickName: inputNickName,
     city: inputState,
     preferences: inputPreferences,
     photoUser: photoURL,
     emailUser: email,
     posts: []
   }
   console.log(path);
   appFireBase.databaseApi.create(path, data, messageHandler);
   return data;
 }

 const fnRead = () => {}

 const fnUpdate = () => {
   const path = 'users/' + uid;
   data = {
     posts: []
   }
   console.log(path);
   appFireBase.databaseApi.update(path, data, messageHandler);
   return data;

 }
 const fnDelete = () => {
   appFireBase.databaseApi.delete(path, messageHandler);
   return data;
 }

 mainApp.Create = fnCreate;
 mainApp.Read = fnRead;
 mainApp.Update = fnUpdate;
 mainApp.Delete = fnDelete;

 const sendButton = document.getElementById('send');
 sendButton.addEventListener('click', (e) => {
   event.preventDefault(e);
   fnCreate();
   window.location.replace("#profile");
 })
 const newPostProfile = document.getElementById('message-text');
 newPostProfile.addEventListener('click',  () => {
   console.log('función update');
   fnUpdate();

  })
 mainApp.logOut = logOut;
})();
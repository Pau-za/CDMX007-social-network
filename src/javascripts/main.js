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
      window.location.replace("#profile");
    } else {
      //redirecciona a la pagina para login
      uid = null;
      window.location.replace("#login")
    }
  });

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
      posts: []
    }
    console.log(path);
    appFireBase.databaseApi.create(path, data, messageHandler);
    return data;
  }

  const fnRead = () => {


  }

  const fnUpdate = () => {
    const path = 'users/' + uid;
    data = {
      // name: inputName,
      // lastname: inputLastName,
      // age: inputAge,
      // nickName: inputNickName,
      // state: inputState,
      // preferences: inputPreferences,
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
  // const profile = document.getElementById("profile");
  // const userInformation = document.getElementById("user-information");
  sendButton.addEventListener('click', (e) => {
    event.preventDefault(e);
    fnCreate();
    // profile.style.display = "block";
    // userInformation.style.display = "none";
  })
  const newPostProfile = document.getElementById('message-text');
  newPostProfile.addEventListener('click', () => {
    console.log('función update');
    fnUpdate();
  })
  mainApp.logOut = logOut;
})();

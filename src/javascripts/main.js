let mainApp = {};
(() => {
    const firebase= appFireBase;
    let uid = null;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Usuario está registrado
            uid = user.uid;
        } else {
            //redirecciona a la pagina para login
            uid = null;
            window.location.replace("login.html")
        }
    });

    const logOut = () => {
        firebase.auth().signOut();
    }
    mainApp.logOut = logOut;
})();

const logOutButton = document.getElementById('log-out-button');
logOutButton.addEventListener('click', ()=>{
    mainApp.logOut();
})
// import firebasemock as firebase from "./firebaseMock"
// mochear firebase para testear funciones que dependan de firebase

const firebase= {
  auth: () => ({
    currentUser: {
      uid: "1730kf484ky93"
    },
    singnOut: () => {
        firebase.currentUser = null;
    }
  }),
  firestore: () => ({
  })
}

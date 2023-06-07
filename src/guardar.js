
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


function guardar () {
  const db = firebase.firestore();
  const busqueda = document.getElementById ("hist").value;


  db.collection("Historial").add({
    busquedas: busqueda
  })
  .then((docRef) => {
    
  })
  .catch((error) => {
    console.error("Error al agregar el documento: ", error);
  });

 
}

export default guardar;
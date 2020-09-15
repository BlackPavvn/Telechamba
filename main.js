//Variables para luego saber cuales son las etiquetas del navegador para esconder
const loggedOutLinks= document.querySelectorAll('.logged-out');
const loggedInLinks= document.querySelectorAll('.logged-in');


const loginCheck = user => {
    if(user){
        loggedInLinks.forEach(link => link.style.display = 'block');
        loggedOutLinks.forEach(link => link.style.display = 'none');
    }else{
        loggedInLinks.forEach(link => link.style.display = 'none');
        loggedOutLinks.forEach(link => link.style.display = 'block');
    }
}


//Bloque para Sign Up
const signupForm =  document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Guardando localmente los campos de email y contraseña
    const email =  document.querySelector('#signup-email').value;
    const password =  document.querySelector('#signup-password').value;

    auth.createUserWithEmailAndPassword(email, password).then(userCredential =>{

        //Limpiando el formulario
        signupForm.reset();
        
        //Cerrando el formulario
        $('#SignUpModal').modal('hide')

        console.log('sign up')
    }) 
});

//Bloque Sign in
const signinForm =  document.querySelector('#login-form');

signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Guardando localmente los campos de email y contraseña
    const email =  document.querySelector('#login-email').value;
    const password =  document.querySelector('#login-password').value;

    auth.signInWithEmailAndPassword(email, password).then(userCredential =>{

        //Limpiando el formulario
        signupForm.reset();
        
        //Cerrando el formulario
        $('#SignInModal').modal('hide');

        console.log('sign in');
    }); 
});

//Bloque Logout
const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('sign out')
    });
});

//SignIn con Google
const googleButton = document.querySelector('#googleLogin');

googleButton.addEventListener('click', e=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(result => {
        
        console.log("google sign in");

        //Limpiando el formulario
        signupForm.reset();
        
        //Cerrando el formulario
        $('#SignInModal').modal('hide');
    })
})

//Impresion de las publicaciones por medio de la base firestore
const postList = document.querySelector('.posts');

const setupPosts = (data) => {
    if (data.length) {
      let html = "";
      data.forEach((doc) => {
        const post = doc.data();
        const li = `
        <li class="list-group-item list-group-item-action">
          <h5>${post.Titulo}</h5>
          <p>${post.Descripcion}</p>
        </li>
      `;
        html += li;
      });
      postList.innerHTML = html;
    } else {
      postList.innerHTML = '<center><h5 class="text-white" >Login to See Posts</h5></center>';
    }
  };

//Eventos, listado de cambios al estar registrado, por ejemplo, "Si esta autenticado se puede...."
    
auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("Auth: signin");
      fs.collection("posts")
        .get()
        .then((snapshot) => {
          setupPosts(snapshot.docs);
          loginCheck(user);
        });
    } else {
      console.log("Auth: signout");
      setupPosts([]);
      loginCheck(user);
    }
  });
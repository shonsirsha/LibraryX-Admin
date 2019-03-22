const refAdmin = firebase.database().ref('admins');
const refUsers = firebase.database().ref('users');
const refBooks = firebase.database().ref('books');
const refEbooks = firebase.database().ref('ebooks');
var qtyTotal = 0
const fStorage = firebase.storage();

var libIdGlobal;
function login(){
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var statusLogin = document.getElementById('statusLogin');
  statusLogin.innerHTML = "Signing in...";


  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
      if(errorCode == ""){
       
      }else{
         if(errorCode == "auth/wrong-password"){
            statusLogin.innerHTML = "Your password is incorrect.";
         }else if(errorCode == "auth/user-not-found"){
          statusLogin.innerHTML = "Sorry, user doesn't exist. Sign up below!";
         }else if(errorCode == "auth/invalid-email"){
          statusLogin.innerHTML = "Your email is badly formatted.";
         }
      }
    // ...
  })    
}

function logout(){
  firebase.auth().signOut().then(function() {
  }, function(error) {
  });
}


function libIdClearer(){
  libIdGlobal = false
  var libId = document.getElementById('libId');
  libId.value = libId.value.toLowerCase();
  var statusSignUp = document.getElementById('statusSignUp');
  var signUpBtn = document.getElementById('signUpBtn')
  signUpBtn.style.visibility = "hidden"

if(/\s/.test(libId.value)){ // deletes whitepsace
libId.value = libId.value.replace(/\s/g,'');
}else{
  if(libId.value.includes('[')){
    libId.value = libId.value.replace(/\[/g,'');
  }else if(libId.value.includes(']')){
    libId.value = libId.value.replace(/\]/g,'');
  }else if(libId.value.includes('$')){
    libId.value = libId.value.replace(/\$/g,'');
  }else if(libId.value.includes(',')){
    libId.value = libId.value.replace(/\,/g,'');
  }else if(libId.value.includes('#')){
    libId.value = libId.value.replace(/\#/g,'');
  }else if(libId.value.includes('/')){
    libId.value = libId.value.replace(/\//g,'');
  }else if(libId.value.includes('(')){
    libId.value = libId.value.replace(/\(/g,'');
  }else if(libId.value.includes(')')){
    libId.value = libId.value.replace(/\)/g,'');
  }else if(libId.value.includes('{')){
    libId.value = libId.value.replace(/\{/g,'');
  }else if(libId.value.includes('}')){
    libId.value = libId.value.replace(/\}/g,'');
  }else{
    if(libId.value.length >= 8 && libId.value.length <= 20){
      refAdmin.orderByChild("libId").equalTo(libId.value).on("value", snapshot => {
        const uid = snapshot.val();
        if (uid){
          signUpBtn.style.visibility = "hidden"
          libIdGlobal = false
          statusSignUp.innerHTML = "Sorry, that LibraryID is <b>unavailable!</b>"
        }else{
          libIdGlobal = libId.value
          statusSignUp.innerHTML = "LibraryID is <b>available!</b>"
          signUpBtn.style.visibility = "visible"
        }
      });
    }else{
      statusSignUp.innerHTML = "LibraryID must be 8-20 (inclusive) characters and can't contain special characters ([,],/,$,#,etc)"
    }
   
  }
 
}
}


function signUp(){
 

  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var libName = document.getElementById('libName').value;
  var libId = document.getElementById('libId').value;

  var statusSignUp = document.getElementById('statusSignUp');


  if(email != "" && password.length >= 6 && libName != "" && libIdGlobal == libId){

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
      refAdmin.push({
        email: email,
        libId: libId,
        libName : libName
      });
    
     
      statusSignUp.innerHTML = ""
  }, function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if(errorCode == "auth/invalid-email"){
        statusSignUp.innerHTML = "Your email address is incorrect. Please try again."
        var signUpBtn = document.getElementById('signUpBtn')
        signUpBtn.style.visibility = "visible"
    }else if(errorCode == "auth/weak-password"){
      alert("Your password should be at least 6 characters long.");
    }else{
      alert(errorCode)
    }

  });
  
  
  }else{
    alert("HECK!")
  }
 
}


function signUp2(){
 

  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var fullName = document.getElementById('fullName').value;
  var statusAddingMember = document.getElementById('statusAddingMember');



  if(email != "" && fullName != "" && password.length >= 7 && isNaN(password) == true){
    statusAddingMember.innerHTML = "Adding member..."
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
      var user = firebase.auth().currentUser;
      var uid = user.uid;
      refUsers.child(uid).set({
        email: email,
        fullName: fullName,
        uid : uid,
        password: password,
        createdAt: Date.now()
      });

      statusAddingMember.innerHTML = "Member added successfully!"
      email = ""
      password = ""
      fullName = ""
      statusSignUp.innerHTML = ""
  }, function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if(errorCode == "auth/invalid-email"){
        statusAdding.innerHTML = "Email address is incorrect. Please try again."
    }else if(errorCode == "auth/weak-password"){
      statusAdding.innerHTML = "Password should be at least 6 characters long.";
    }else if(errorCode == "auth/email-already-in-use"){
      statusAdding.innerHTML = "Email is unavailable (already in use). Please try again.";
    }else{
      statusAdding.innerHTML = "Error in adding user. Please try again."
    }

  });
  
  
  }else{
    statusAddingMember.innerHTML = "Input(s) must be filled correctly."
  }
 
}

function addBook(){
  var bookTitle = document.getElementById('bookTitle').value;
  var authorName = document.getElementById('authorName').value;
  var year = document.getElementById('year').value;
  var genre1 = document.getElementById('genre1').value;
  var genre2 = document.getElementById('genre2').value;
  var genre3 = document.getElementById('genre3').value;
  var inputImg = document.getElementById('inputImg').files[0];
  var max = document.getElementById('max').value;
  var aisle = document.getElementById('aisle').value;
  var qty = document.getElementById('qty').value;

  var imgPv = document.getElementById('img-pv');
  var addBookForm = document.getElementById('addBookForm')

  var statusAddingBook = document.getElementById('statusAddingBook');
  var prgBar = document.getElementById('prgbar');

  if(year == ""){
    year = "Unknown"
  }

  if(bookTitle != "" && authorName != "" && genre1 != "" && inputImg != null){
    var dateNow = Date.now()
    var storageRef = fStorage.ref('bookPics/' + dateNow);
    var uploadTask = storageRef.put(inputImg);

    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress = Math.round(progress);
      console.log(progress)
      prgBar.innerHTML = '<div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: '+progress+'%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
    
      statusAddingBook.innerHTML = 'Uploading ... ('+progress+'% done)';
    
    
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      
    }, function() {
    
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        refBooks.push({
          bookTitle: bookTitle,
          authorName: authorName,
          genre1: genre1,
          genre2: genre2,
          genre3: genre3,
          image: dateNow,
          year: year,
          status: "avail",
          start: 0,
          until: 0,
          max: parseInt(max),
          availAt: aisle,
          borrowedBy: "none",
          qty: qty,
          setQty: qty
        })
        
        addBookForm.reset()
        imgPv.src = "images/noimg.png"
        prgBar.innerHTML = ""

        statusAddingBook.innerHTML = "A new book has been successfully added to the system."

      });  
       
    
    });


  }else{
    statusAddingBook.innerHTML = "Please fill all required fields (*)"

  }


}


function addEbook(){
  var bookTitle = document.getElementById('bookTitle3').value;
  var authorName = document.getElementById('authorName3').value;
  var year = document.getElementById('year3').value;
  var genre1 = document.getElementById('genre13').value;
  var genre2 = document.getElementById('genre23').value;
  var genre3 = document.getElementById('genre33').value;
  var inputImg = document.getElementById('inputImg3').files[0];
  var inputPdf = document.getElementById('inputPdf').files[0];
  var imgPv = document.getElementById('img-pv3');
  var addEbookForm = document.getElementById('addEbookForm');

  var statusAddingBook = document.getElementById('statusAddingBook2');
  var prgBar = document.getElementById('prgbar3');

  if(year == ""){
    year = "Unknown"
  }

  if(bookTitle != "" && authorName != "" && genre1 != "" && inputImg != null){
    var dateNow = Date.now()
    var storageRef = fStorage.ref('eBooks/' + dateNow);
    var uploadTask = storageRef.put(inputPdf);

    uploadTask.on('state_changed', function(snapshot){
      var prgBar = document.getElementById('prgbar3');
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress = Math.round(progress);
      console.log(progress)
      prgBar.innerHTML = '<div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: '+progress+'%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
    
      statusAddingBook.innerHTML = 'Uploading eBook... ('+progress+'% done)';
    
    
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      
    }, function() {
    
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
       /* refBooks.push({
          bookTitle: bookTitle,
          authorName: authorName,
          genre1: genre1,
          genre2: genre2,
          genre3: genre3,
          image: dateNow,
          year: year,
          status: "avail",
          eBookURL: downloadURL
         
         
        })*/


      var downloadURL = downloadURL
      var storageRef2 = fStorage.ref('bookPics/' + dateNow);
      var uploadTask2 = storageRef2.put(inputImg);
      uploadTask2.on('state_changed', function(snapshot){
      var prgBar = document.getElementById('prgbar3');
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress = Math.round(progress);
      console.log(progress)
      prgBar.innerHTML = '<div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: '+progress+'%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
    
      statusAddingBook.innerHTML = 'Uploading cover picture... ('+progress+'% done)';
    
    
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      console.log(error)
    }, function() {
    
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
       refEbooks.push({
          bookTitle: bookTitle,
          authorName: authorName,
          genre1: genre1,
          genre2: genre2,
          genre3: genre3,
          image: dateNow,
          year: year,
          eBookURL: downloadURL,
          trashedTime: 0,
          status: "avail"
        })

      
        addEbookForm.reset()
        imgPv.src = "images/noimg.png"
        prgBar.innerHTML = ""

        statusAddingBook.innerHTML = "A new eBook has been successfully added to the system."

      });  
       
    
    });

      });  
       
    
    });


  }else{
    statusAddingBook.innerHTML = "Please fill all required fields (*)"

  }


}

function addqty(){
  refBooks.orderByChild("image").once('value', snapshot=>{

    snapshot.forEach(childSnapshot=>{
      var x = childSnapshot.key
      refBooks.child(x).update({
        setQty: 3,
        qty: 3
      })
    })

  })
}
function loadEbooks(){
  var table = document.getElementById('eBookTableContents')
  table.innerHTML = ""

  refEbooks.orderByChild("image").on('value', snapshot=>{
    refEbooks.orderByChild("status").equalTo("del").on('value', snapshot2=>{
      table.innerHTML = ""
      var y = snapshot.numChildren() - snapshot2.numChildren()

      snapshot.forEach(childSnapshot=>{
        var x = childSnapshot.val()
        if (x.status != "del"){
          table.innerHTML = '<tr><td>'+y+'</td><td><b>'+x.bookTitle+'</b></td><td>'+x.authorName+'</td><td>'+x.year+'</td><td><button type="button" class="btn btn-primary" data-toggle="modal" onclick="detailEditEbook('+x.image+')" data-target="#detailEditEbook"><b>Detail / Edit</b></button></td><td><button type="button" class="btn btn-warning" data-toggle="modal" onclick="seeEbookReports('+x.image+')" data-target="#reportEbook"><b>Reports</b></td><td><a target="_blank" href="'+x.eBookURL+'" class="btn btn-info"><b class="white">See eBook</b></a></td> <td><button type="button" class="btn btn-danger" data-toggle="modal" onclick="deleteEbookShowModal('+x.image+')" data-target="#deleteEbook"><b>X</b></button></td></tr>' + table.innerHTML;

          y-= 1
        }

      })

    })
  })
}
function loadTrashEbooks(){ // this is trash folder for eBooks

  var trashTable = document.getElementById('trashEbookTableContents')
  var wholeTable = document.getElementById('trashEbookTable');
  trashTable.innerHTML = ""

  refEbooks.orderByChild("trashedTime").on("value", snapshot=>{

    refEbooks.orderByChild("status").equalTo("del").on('value', snapshot2=>{

      if(snapshot2.exists()){
        wholeTable.style.display = 'block';
        trashTable.innerHTML = ""
      var z = snapshot2.numChildren()
      
      snapshot.forEach(childSnapshot=>{
        var x = childSnapshot.val()

        if(x.status == "del"){
          trashTable.innerHTML = '<tr><td>'+z+'</td><td><b>'+x.bookTitle+'</b></td><td><button type="button" class="btn btn-primary" data-toggle="modal" onclick="detailEditEbook('+x.image+')" data-target="#detailEditEbook"><b>Detail / Edit</b></button></td><td><button type="button" class="btn btn-warning" data-toggle="modal" onclick="seeEbookReports('+x.image+')" data-target="#reportEbook"><b>Reports</b></td><td><a target="_blank" href="'+x.eBookURL+'" class="btn btn-info"><b class="white">See eBook</b></a></td><td><button type="button" class="btn btn-success" onclick="putBackEbook('+x.image+')"><b>Put Back</b></button></td></tr>'  + trashTable.innerHTML

          z-= 1;
        }

      })
      }else{
        wholeTable.style.display = 'none';
      }

    
    })
    
  })


}
function loadBooks(){


  loadTrashFolder()
  loadEbooks()
  loadTrashEbooks()
  loadUsers()
  loadTrashUserFolder()
  var table = document.getElementById('tbl')
  table.innerHTML = ""

  refBooks.orderByChild("image").on('value', snapshot =>{
    refBooks.orderByChild("status").equalTo("del").on('value', snapshot2=>{
      
    table.innerHTML = ""
    var z = snapshot2.numChildren()
    var y = snapshot.numChildren() - snapshot2.numChildren()
    snapshot.forEach(childSnapshot=>{
      
      var x = childSnapshot.val()

     if(x.status != "del"){
       
      if (x.status == "avail"){
        
        if (x.qty == x.setQty) {
        table.innerHTML = '<tr><td>'+y+'</td><td><b>'+x.bookTitle+'</b></td><td>'+x.authorName+'</td><td><b>'+x.year+'</b></td><td>'+x.setQty+'</td><td>'+x.qty+'</td><td><b>'+parseInt(x.setQty - x.qty)+'</b></td><td><button type="button" class="btn btn-primary" data-toggle="modal" onclick="detailEdit('+x.image+')" data-target="#detailEdit"><b>Detail / Edit</b></button></td><td><button type="button" class="btn btn-outline-primary" data-toggle="modal" onclick="seeHistory('+x.image+')" data-target="#history"><b>History</b></button></td><td><button type="button" class="btn btn-warning" data-toggle="modal" onclick="seeReports('+x.image+')" data-target="#reports"><b>Reports</b></td><td><button type="button" class="btn btn-danger" ><b>X</b></button></td></tr>' + table.innerHTML;
         
        }else{
          table.innerHTML = '<tr><td>'+y+'</td><td><b>'+x.bookTitle+'</b></td><td>'+x.authorName+'</td><td><b>'+x.year+'</b></td><td>'+x.setQty+'</td><td>'+x.qty+'</td><td><b>'+parseInt(x.setQty - x.qty)+'</b></td><td><button type="button" class="btn btn-primary" data-toggle="modal" onclick="detailEdit('+x.image+')" data-target="#detailEdit"><b>Detail / Edit</b></button></td><td><button type="button" class="btn btn-outline-primary" data-toggle="modal" onclick="seeHistory('+x.image+')" data-target="#history"><b>History</b></button></td><td><button type="button" class="btn btn-warning" data-toggle="modal" onclick="seeReports('+x.image+')" data-target="#reports"><b>Reports</b></td><td><button type="button" class="btn btn-danger" disabled><b>X</b></button></td></tr>' + table.innerHTML;
        }
       

      }else{
        table.innerHTML = '<tr><td>'+y+'</td><td><b>'+x.bookTitle+'</b></td><td>'+x.authorName+'</td><td><b>'+x.year+'</b></td><td>'+x.setQty+'</td><td>'+x.qty+'</td><td><b>'+parseInt(x.setQty - x.qty)+'</b></td><td><button type="button" class="btn btn-primary" data-toggle="modal" onclick="detailEdit('+x.image+')" data-target="#detailEdit"><b>Detail / Edit</b></button></td><td><button type="button" class="btn btn-outline-primary" data-toggle="modal" onclick="seeHistory('+x.image+')" data-target="#history"><b>History</b></button></td><td><button type="button" class="btn btn-warning" data-toggle="modal" onclick="seeReports('+x.image+')" data-target="#reports"><b>Reports</b></td><td><button type="button" class="btn btn-danger" disabled ><b>X</b></button></td></tr>' + table.innerHTML;
      
      }

      y-= 1 
     }
    
    })
    })
    
  });
}


function detailEditEbook(bookTitle){
  var status = document.getElementById('ebookStatus');
  var bookTitleInput = document.getElementById('ebookTitle');
  var authorName = document.getElementById('ebookAuthorName');
  var year = document.getElementById('ebookYear');
  var genre1 = document.getElementById('ebookGenre1');
  var genre2 = document.getElementById('ebookGenre2');
  var genre3 = document.getElementById('ebookGenre3');
  var img = document.getElementById('ebook-img-pv');
  img.src = "images/loading.gif";
  var btnPlcHolder = document.getElementById("applyBtnEbook");
  status.innerHTML = "";
  btnPlcHolder.innerHTML = '<button type="button" onclick="editEbook('+bookTitle+')" class=" btn btn-primary">Apply & Save</button>'

  refEbooks.orderByChild("image").equalTo(bookTitle).on('value', snapshot =>{
    snapshot.forEach(childSnapshot=>{
      var book = childSnapshot.val()
      bookTitleInput.value = book.bookTitle
      year.value = book.year
      authorName.value = book.authorName
      genre1.value = book.genre1
      genre2.value = book.genre2
      genre3.value = book.genre3

      fStorage.ref('bookPics/'+book.image).getDownloadURL().then(function(url) {
        // `url` is the download URL 
        var img = document.getElementById('ebook-img-pv');
        img.src = url;
      }).catch(function(error) {
        // Handle any errors
      })

    })
  });

}

function editEbook(bookTitle){
  var status = document.getElementById('ebookStatus');
  var bookTitleInput = document.getElementById('ebookTitle');
  var authorName = document.getElementById('ebookAuthorName');
  var year = document.getElementById('ebookYear');
  var genre1 = document.getElementById('ebookGenre1');
  var genre2 = document.getElementById('ebookGenre2');
  var genre3 = document.getElementById('ebookGenre3');
  
  status.innerHTML = "Editing...";

  
  refEbooks.orderByChild("image").equalTo(bookTitle).once('value', snapshot=>{
    var bookKey = Object.keys(snapshot.val())[0];
    refEbooks.child(bookKey).update({
      bookTitle: bookTitleInput.value,
      authorName: authorName.value,
      year: year.value,
      genre1: genre1.value,
      genre2: genre2.value,
      genre3: genre3.value,
    }).then(()=>{
      refUsers.orderByChild('uid').once('value', snapshot2=>{
        snapshot2.forEach(childSnapshot=>{
          refUsers.child(childSnapshot.key).child("savedEbooks").orderByChild("image").equalTo(bookTitle).once('value', snapshot2=>{
            snapshot2.forEach(childSnapshot2=>{
              refUsers.child(childSnapshot.key).child("savedEbooks").child(childSnapshot2.key).update({
                bookTitle: bookTitleInput.value,
                authorName: authorName.value,
                year: year.value,
                genre1: genre1.value,
                genre2: genre2.value,
                genre3: genre3.value,
              }).then(()=>{
                status.innerHTML  = "<b>eBook has been successfully edited!</b>";
              }).catch(()=>{
                status.innerHTML  = "<b>There was an error in editing the eBook. Please try again</b>";
              })
            })
          })
        })
      })
      status.innerHTML  = "<b>Book has been successfully edited!</b>";
    }).catch((error)=>{
      status.innerHTML  = "<b>There was an error in editing the eBook. Please try again</b>";
    });
  });


}

function detailEdit(bookTitle){
  qtyTotal = 0
  var status = document.getElementById('status');
  var bookTitleInput = document.getElementById('bookTitle1');
  var authorName = document.getElementById('authorName1');
  var year = document.getElementById('year1');
  var genre1 = document.getElementById('genre11');
  var genre2 = document.getElementById('genre21');
  var genre3 = document.getElementById('genre31');
  var lastBorrowedBy = document.getElementById('lastBorrowedBy1');
  var aisle = document.getElementById('aisle1');
  var borrowedOn = document.getElementById('borrowedOn1');
  var returnedOn = document.getElementById('returnedOn1');
  var max = document.getElementById('max1');
  var qty = document.getElementById('qty1');

  var img = document.getElementById('img-pv1');
  img.src = "images/loading.gif";
  var btnPlcHolder = document.getElementById("applyBtn");
  status.innerHTML = "";
  var downloadBtn = document.getElementById('downloadQrBtn');
  var canvas = document.getElementById('qr');
  
  var qr = new QRious({
     element: document.getElementById('qr'),
     value:bookTitle.toString(),
     size: 113.3858267717
    });

    downloadBtn.href = canvas.toDataURL()

  btnPlcHolder.innerHTML = '<button type="button" onclick="editBook('+bookTitle+')" class=" btn btn-primary">Apply & Save</button>'

  refBooks.orderByChild("image").equalTo(bookTitle).on('value', snapshot =>{
    snapshot.forEach(childSnapshot=>{
      var book = childSnapshot.val()
      bookTitleInput.value = book.bookTitle
      downloadBtn.download = "BOOK " + book.bookTitle + '.png';
      year.value = book.year
      authorName.value = book.authorName
      genre1.value = book.genre1
      genre2.value = book.genre2
      genre3.value = book.genre3
      aisle.value = book.availAt
      max.value = book.max
      qty.value = book.setQty

      fStorage.ref('bookPics/'+book.image).getDownloadURL().then(function(url) {
        // `url` is the download URL 
        var img = document.getElementById('img-pv1');
        img.src = url;
      }).catch(function(error) {
        // Handle any errors
      })

      if (book.borrowedBy == "none"){
        lastBorrowedBy.value = "No one"
        borrowedOn.value = "Never"
        returnedOn.value = "Never"
      }else{
        refUsers.child(book.borrowedBy).on('value', snapshot=>{
        
        var user = snapshot.val()
        
        lastBorrowedBy.value = user.fullName
        
        borrowedOn.value = getDate(book.start);
        returnedOn.value = getDate(book.actualReturned);
        })
      }
      
    })
  });

}


function deleteBookShowModal(bookTitleInMS){
  var title = document.getElementById("bookTitDel");
  var removeBtn = document.getElementById("removeBtn");
  refBooks.orderByChild("image").equalTo(bookTitleInMS).once('value', snapshot =>{
    var bookKey = Object.keys(snapshot.val())[0];
    snapshot.forEach(childSnapshot=>{
      var book = childSnapshot.val();

      title.innerHTML = book.bookTitle
      removeBtn.innerHTML = '<button type="button" onclick="deleteBook(\''+bookKey+'\')" class="btn btn-danger" data-dismiss="modal"><b>Yes, remove it</b></button>';
    });

  });

}

function deleteEbookShowModal(bookTitleInMS){
  var title = document.getElementById("ebookBookTitDel");
  var removeBtn = document.getElementById("ebookRemoveBtn");
  refEbooks.orderByChild("image").equalTo(bookTitleInMS).once('value', snapshot =>{
    var bookKey = Object.keys(snapshot.val())[0];
    snapshot.forEach(childSnapshot=>{
      var book = childSnapshot.val();
      title.innerHTML = book.bookTitle
      removeBtn.innerHTML = '<button type="button" onclick="deleteEbook(\''+bookKey+'\',\''+bookTitleInMS+'\')" class="btn btn-danger" data-dismiss="modal"><b>Yes, remove it</b></button>';
    });
  });

}

function deleteEbook(bookKey,bookTitleInMS){
  var dateNow = Date.now()
  refEbooks.child(bookKey).update({
    status: "del",
    trashedTime: dateNow
  })

  refUsers.orderByChild("email").once('value',snapshot=>{
   // var userKey = Object.keys(snapshot.val())[3];
    snapshot.forEach(childSnapshot=>{
      refUsers.child(childSnapshot.key).child('savedEbooks').orderByChild("image").equalTo(parseInt(bookTitleInMS)).once('value', snapshot2=>{
        snapshot2.forEach(childSnapshot2=>{
          console.log(childSnapshot2.key)
          refUsers.child(childSnapshot.key).child('savedEbooks').child(childSnapshot2.key).update({
            status: "del"
          })
        })
      })
    })
    
  })

}


function deleteBook(bookKey){
  var dateNow = Date.now()

  refBooks.child(bookKey).update({
    status: "del",
    trashedTime: dateNow
  })
}

function putBack(bookImgTitleInMS){
  refBooks.orderByChild("image").equalTo(bookImgTitleInMS).once('value', snapshot =>{
  var bookKey = Object.keys(snapshot.val())[0];

  refBooks.child(bookKey).update({
    status: "avail"
  })
  })
  
}

function putBackEbook(bookImgTitleInMS){
  refEbooks.orderByChild("image").equalTo(bookImgTitleInMS).once('value', snapshot =>{
  var bookKey = Object.keys(snapshot.val())[0];

  refEbooks.child(bookKey).update({
    status: "avail"
  })
  })

  refUsers.orderByChild("email").once('value',snapshot=>{
    // var userKey = Object.keys(snapshot.val())[3];
     snapshot.forEach(childSnapshot=>{
       refUsers.child(childSnapshot.key).child('savedEbooks').orderByChild("image").equalTo(parseInt(bookImgTitleInMS)).once('value', snapshot2=>{
         snapshot2.forEach(childSnapshot2=>{
           console.log(childSnapshot2.key)
           refUsers.child(childSnapshot.key).child('savedEbooks').child(childSnapshot2.key).update({
             status: "avail"
           })
         })
       })
     })
     
   })
  
}

function putBackUser(uid){
  refUsers.child(uid).once('value', snapshot=>{
    var x = snapshot.val();
    refUsers.child(uid).update({
      password: x.holdPw   
    });
  });
}


function seeReports(bookTitleInMS){
  var bookTitle = document.getElementById('reportBookTit');
  var wholeTable = document.getElementById('reportsTable');
  var table = document.getElementById('reportsTableContents');
  var status = document.getElementById('statusBookReport');
  table.innerHTML = ""
  refBooks.orderByChild("image").equalTo(bookTitleInMS).once('value', snapshot=>{
    var bookKey = Object.keys(snapshot.val())[0];
    snapshot.forEach(childSnapshot=>{
      var book = childSnapshot.val();
      bookTitle.innerHTML = book.bookTitle;
    });
    refBooks.child(bookKey).child("reports").orderByChild("bookImgTitleInMS").equalTo(bookTitleInMS).on('value', snapshot=>{
      if(snapshot.exists()){
      status.style.display = "none";
      wholeTable.style.display = "block";
      table.innerHTML = ""
      var y = snapshot.numChildren()
      snapshot.forEach(childSnapshot=>{
          var report = childSnapshot.val();      
          table.innerHTML = '<td>'+y+'</td><td>'+getDate(report.reportTime)+'</td><td>'+report.fullName+'</td><td>'+report.report+'</td>' + table.innerHTML
          y -= 1;
      });
      }else{
      wholeTable.style.display = "none";
      status.style.display = "block";
      status.innerHTML = "No report is available for this book."
      }
    })
  })
}

function seeEbookReports(bookTitleInMS){
  var bookTitle = document.getElementById('reportEbookTit');
  var wholeTable = document.getElementById('ebookReportsTable');
  var table = document.getElementById('ebookReportsTableContents');
  var status = document.getElementById('statusEbookReport');
  table.innerHTML = ""

  refEbooks.orderByChild("image").equalTo(bookTitleInMS).once('value', snapshot=>{
    var bookKey = Object.keys(snapshot.val())[0];
    snapshot.forEach(childSnapshot=>{
      var book = childSnapshot.val();
      bookTitle.innerHTML = book.bookTitle;
    });
    refEbooks.child(bookKey).child("reports").orderByChild("bookImgTitleInMS").equalTo(bookTitleInMS).on('value', snapshot2=>{
      if(snapshot2.exists()){
      status.style.display = "none";
      wholeTable.style.display = "block";
      table.innerHTML = ""
      var y = snapshot2.numChildren()
      snapshot2.forEach(childSnapshot=>{
          var report = childSnapshot.val();      
          table.innerHTML = '<td>'+y+'</td><td>'+getDate(report.reportTime)+'</td><td>'+report.fullName+'</td><td>'+report.report+'</td>' + table.innerHTML
          y -= 1;
      });
      }else{
      wholeTable.style.display = "none";
      status.style.display = "block";
      status.innerHTML = "No report is available for this eBook."
      }
    })
  })
}

function seeHistory(bookTitleInMS){
  var bookTitle = document.getElementById('bookTit');
  var table = document.getElementById('historyTableContents');
  var wholeTable = document.getElementById('historyTable');
  var status = document.getElementById('statusBookHistory');
  table.innerHTML = ""

  refBooks.orderByChild("image").equalTo(bookTitleInMS).once('value', snapshot =>{
    var bookKey = Object.keys(snapshot.val())[0];
    snapshot.forEach(childSnapshot=>{
      var book = childSnapshot.val();
      bookTitle.innerHTML = book.bookTitle;
    });

    refBooks.child(bookKey).child("history").orderByChild("actualReturned").on('value', snapshot=>{
      if (snapshot.exists()){
        status.style.display = "none";
        wholeTable.style.display = "block";
      
      table.innerHTML = ""
      var y = 1

      snapshot.forEach(childSnapshot=>{
        var history = childSnapshot.val();      

          if(history.start == history.actualReturned){
            table.innerHTML = '<td>'+y+'</td><td>'+history.fullname+'</td><td><kbd class="unavail">BORROWING</td></td><td>'+getDate(history.start)+'</td><td><b>CURRENTLY BORROWING, RETURN <u>BEFORE</u> OR <u>ON</u></b> '+getDate(history.until)+'</td><td> - </td>' + table.innerHTML
          }else{
            table.innerHTML = '<td>'+y+'</td><td>'+history.fullname+'</td><td><kbd class="avail">RETURNED</td><td>'+getDate(history.start)+'</td><td>'+getDate(history.until)+'</td><td>'+getDate(history.actualReturned)+'</td>' + table.innerHTML
          }
          y += 1;

        console.log(history);
      });

    }else{
      wholeTable.style.display = "none";
      status.style.display = "block";
      status.innerHTML = "No history is available for this book."

    }
    });

  });


}
function loadTrashUserFolder(){
  var wholeTable = document.getElementById('trashTableUser')
  var trashTable = document.getElementById('trashTableUserContents');
  trashTable.innerHTML = ""

  refUsers.orderByChild("trashedTime").on("value", snapshot=>{
    refUsers.orderByChild("password").equalTo("non").on("value", snapshot2=>{
      if (snapshot2.exists()){
       wholeTable.style.display = 'block'; 
      trashTable.innerHTML = ""
      var z = snapshot2.numChildren()

      snapshot.forEach(childSnapshot=>{
        var x = childSnapshot.val()

        if(x.password == "non"){
      
          trashTable.innerHTML = '<tr><td>'+z+'</td><td><b>'+x.fullName+'</b></td><td>'+x.email+'</td><td><button type="button" class="btn btn-primary" data-toggle="modal" onclick="detailEditUser(\''+x.uid+'\')" data-target="#detailEditUser"><b>Detail / Edit</b></button></td><td><button type="button" class="btn btn-success" onclick="putBackUser(\''+x.uid+'\')"><b>Put back</b></button></td></tr>' + trashTable.innerHTML;
  
        z-= 1 
       }

      });
    }else{
      wholeTable.style.display = 'none';
    }
    });
  });

}
function loadTrashFolder(){ // this is trash folder for Books

    var trashTable = document.getElementById('trashTableContents')
    var wholeTable = document.getElementById('trashTable');
    trashTable.innerHTML = ""

    refBooks.orderByChild("trashedTime").on("value", snapshot=>{

      refBooks.orderByChild("status").equalTo("del").on('value', snapshot2=>{

        if(snapshot2.exists()){
          wholeTable.style.display = 'block';
          trashTable.innerHTML = ""
        var z = snapshot2.numChildren()
        
        snapshot.forEach(childSnapshot=>{
          var x = childSnapshot.val()

          if(x.status == "del"){
            trashTable.innerHTML = '<tr><td>'+z+'</td><td><b>'+x.bookTitle+'</b></td><td><button type="button" class="btn btn-primary" data-toggle="modal" onclick="detailEdit('+x.image+')" data-target="#detailEdit"><b>Detail / Edit</b></button></td><td><button type="button" class="btn btn-outline-primary" data-toggle="modal" onclick="seeHistory('+x.image+')" data-target="#history"><b>History</b></button></td><td><button type="button" class="btn btn-warning" data-toggle="modal" onclick="seeReports('+x.image+')" data-target="#reports"><b>See Reports</b></button></td><td><button type="button" class="btn btn-success" onclick="putBack('+x.image+')"><b>Put Back</b></button></td></tr>'  + trashTable.innerHTML

            z-= 1;
          }

        })
        }else{
          wholeTable.style.display = 'none';
        }

      
      })
      
    })


}

function editBook(bookTitleInMS){
  qtyTotal = 0
  
  var bookTitleInput = document.getElementById('bookTitle1');
  var authorName = document.getElementById('authorName1');
  var year = document.getElementById('year1');
  var genre1 = document.getElementById('genre11');
  var genre2 = document.getElementById('genre21');
  var genre3 = document.getElementById('genre31');
  var aisle = document.getElementById('aisle1');
  var max = document.getElementById('max1');
  var qty = document.getElementById('qty1');
  var setQty = 0
  var avQty = 0
  var status = ""

  var status = document.getElementById('status');
  status.innerHTML = "Editing...";

  refBooks.orderByChild("image").equalTo(bookTitleInMS).once('value', snapshot=>{
    var bookKey = Object.keys(snapshot.val())[0];
    snapshot.forEach(childSnapshot=>{
      var book = childSnapshot.val()
      setQty = parseInt(book.setQty)
      avQty = parseInt(book.qty)
      status = book.status
    })
    var borrowedQty = setQty - avQty
    if(qty.value < borrowedQty){
      status.innerHTML = "Uh-oh! Total quantity can't be less than currently borrowed books quantity."
    }else{
    var newAvQty = (parseInt(qty.value) - setQty) + avQty
    if(qty.value > borrowedQty){
      status = "avail"
    }else if(qty.value == borrowedQty){
      status = "no"
    }

    refBooks.child(bookKey).update({
      bookTitle: bookTitleInput.value,
      authorName: authorName.value,
      year: year.value,
      genre1: genre1.value,
      genre2: genre2.value,
      genre3: genre3.value,
      availAt: aisle.value,
      max: parseInt(max.value),
      setQty: parseInt(qty.value),
      qty: newAvQty,
      status: status
    }).then(()=>{
      refUsers.orderByChild("uid").once('value', snapshot=>{
        snapshot.forEach(childSnapshot=>{
          refUsers.child(childSnapshot.key).child("mybooks").orderByChild("bookImgTitleInMS").equalTo(bookTitleInMS).once('value',snapshot2=>{
            snapshot2.forEach(childSnapshot2=>{
              refUsers.child(childSnapshot.key).child("mybooks").child(childSnapshot2.key).update({
                title: bookTitleInput.value
              }).then(()=>{
                status.innerHTML  = "<b>Book has been successfully edited!</b>";
              }).catch(()=>{
                status.innerHTML  = "<b>There was an error in editing the book. Please try again2</b>";
              })
            })
          })
        });
      });
      status.innerHTML  = "<b>Book has been successfully edited!</b>";
    }).catch((error)=>{
      status.innerHTML  = "<b>There was an error in editing the book. Please try again</b>";
  
    });
    }
  
  });



/* 


*/
}
function plus(){
  qtyTotal += 1;
  var minusBtn = document.getElementById("minusqty");
  var qty = document.getElementById('qty1');
  qty.value = parseInt(qty.value) + 1;
  minusBtn.style.display = "block"
  console.log(qtyTotal)
}

function minus(){
  var minusBtn = document.getElementById("minusqty");
  var qty = document.getElementById('qty1');
  if(qty.value != 1){
    qtyTotal -= 1;
    qty.value = parseInt(qty.value) - 1;
  }else{
    minusBtn.style.display = "none"
  }
  console.log(qtyTotal)

}
function seeDetail(bookTitleInMS){
  var status = document.getElementById('status');
  var bookTitleInput = document.getElementById('bookTitle2');
  var authorName = document.getElementById('authorName2');
  var year = document.getElementById('year2');
  var genre1 = document.getElementById('genre12');
  var genre2 = document.getElementById('genre22');
  var genre3 = document.getElementById('genre32');
  var lastBorrowedBy = document.getElementById('currentlyBorrowedBy2');
  var aisle = document.getElementById('aisle2');
  var borrowedOn = document.getElementById('borrowedOn2');
  var returnedOn = document.getElementById('returnedOn2');
  var max = document.getElementById('max2');
  var img = document.getElementById('img-pv2');
  img.src = "images/loading.gif";
  status.innerHTML = "";
  var downloadBtn = document.getElementById('downloadQrBtn2');
  var canvas = document.getElementById('qr2');
  
  var qr = new QRious({
     element: document.getElementById('qr2'),
     value:bookTitleInMS.toString(),
     size: 113.3858267717
    });

    downloadBtn.href = canvas.toDataURL()


  refBooks.orderByChild("image").equalTo(bookTitleInMS).on('value', snapshot =>{
    snapshot.forEach(childSnapshot=>{
      var book = childSnapshot.val()
      bookTitleInput.value = book.bookTitle
      downloadBtn.download = "BOOK " + book.bookTitle + '.png';
      year.value = book.year
      authorName.value = book.authorName
      genre1.value = book.genre1
      genre2.value = book.genre2
      genre3.value = book.genre3
      aisle.value = book.availAt
      max.value = book.max

      fStorage.ref('bookPics/'+book.image).getDownloadURL().then(function(url) {
        // `url` is the download URL 
        var img = document.getElementById('img-pv2');
        img.src = url;
      }).catch(function(error) {
        // Handle any errors
      })

      if (book.borrowedBy == "none"){
        lastBorrowedBy.value = "No one"
        borrowedOn.value = "Never"
        returnedOn.value = "Never"
      }else{
        refUsers.child(book.borrowedBy).on('value', snapshot=>{
        
        var user = snapshot.val()
        
        lastBorrowedBy.value = user.fullName
        
        borrowedOn.value = getDate(book.start);
        returnedOn.value = getDate(book.until);
        })
      }
      
    })
  });
}

function loadUsers(){
  var tableUser = document.getElementById("tblUsers");
  tableUser.innerHTML = ""

  refUsers.orderByChild("createdAt").on('value', snapshot =>{
    refUsers.orderByChild("password").equalTo("non").on('value', snapshot2=>{
      
      tableUser.innerHTML = ""
    var z = snapshot2.numChildren()
    var y = snapshot.numChildren() - snapshot2.numChildren()
    snapshot.forEach(childSnapshot=>{
      
      var x = childSnapshot.val()

     if(x.password != "non"){
      
        tableUser.innerHTML = '<tr><td>'+y+'</td><td><b>'+x.fullName+'</b></td><td>'+x.email+'</td><td><button type="button" class="btn btn-primary" data-toggle="modal" onclick="detailEditUser(\''+x.uid+'\')" data-target="#detailEditUser"><b>Detail / Edit</b></button></td><td><button type="button" class="btn btn-danger" data-toggle="modal" onclick="deleteUserShowModal(\''+x.uid+'\')" data-target="#removeUser"><b>X</b></button></td></tr>' + tableUser.innerHTML;

      y-= 1 
     }
    
    })
    })
    
  });

}

function detailEditUser(uid){  
  var userHistoryPlcHolder = document.getElementById('userHistoryPlcHolder')
  userHistoryPlcHolder.innerHTML = '';
  var inputFname = document.getElementById("fullName1");
  var inputEmail = document.getElementById("email1");
  var inputPw = document.getElementById("password1");
  var applyBtn = document.getElementById("applyEditUserBtn");
  var status = document.getElementById("statusEditUser");
  var historyUserBtn = document.getElementById('showUserHistoryBtn');
  var downloadBtn = document.getElementById('downloadQrBtn3');
  var canvas = document.getElementById('qr3');
  status.innerHTML = "";
  var qr = new QRious({
    element: document.getElementById('qr3'),
    value:uid.toString(),
    size: 56.692913386
   });

   downloadBtn.href = canvas.toDataURL()
  
  historyUserBtn.innerHTML = '<button type="button" onclick="showUserHistory(\''+uid+'\')" class="btn btn-danger">Show user\'s borrowing history</button>';



  applyBtn.innerHTML = '<button type="button" onclick="editUser(\''+uid+'\')" class="mrgtop btn btn-primary">Apply & Save</button>';
  refUsers.child(uid).on('value', snapshot =>{
    var x = snapshot.val();

    inputFname.value = x.fullName
    inputEmail.value = x.email
    downloadBtn.download = "USER " + x.fullName + '.png';

    if(x.password == "non"){
      inputPw.readOnly = true
    }else{
      inputPw.readOnly = false
    }
    inputPw.value = x.password


  })
}

function showUserHistory(uid){
  
  var userHistoryPlcHolder = document.getElementById('userHistoryPlcHolder');
  userHistoryPlcHolder.innerHTML = '<h4>User\'s History (Activites): </h4><div class="card scroll"><table class="table table-striped table-responsive-md"><thead><tr><th>#</th><th>Title</th><th>Status</th><th>Date Borrowed</th><th>Date Should Return</th><th>Date Actual Returned</th></tr></thead><tbody id="userHistoryTableContents"><tr><td>Loading...</td><td>Loading...</td><td>Loading...</td><td>Loading...</td><td>Loading...</td><td>Loading...</td></tr></tbody></table></div>'
  var history = document.getElementById('userHistoryTableContents');
  history.innerHTML = '';
  refUsers.child(uid).child('mybooks').orderByChild('actualReturned').on('value', snapshot=>{
    var z = snapshot.numChildren()
    history.innerHTML = '';
    if(snapshot.exists()){
      snapshot.forEach(childSnapshot=>{
        var x = childSnapshot.val()
        if(x.status == "returned"){
          x.status = "<kbd class='avail'>RETURNED</kbd>"
          history.innerHTML = '<tr><td>'+z+'</td><td>'+x.title+'</td><td>'+x.status+'</td><td>'+getDate(x.start)+'</td><td>'+getDate(x.until)+'</td><td>'+getDate(x.actualReturned)+'</td></tr>' + history.innerHTML;
        }else{
          x.status = "<kbd class='borrow'>BORROWING</kbd>"
          history.innerHTML = '<tr><td>'+z+'</td><td>'+x.title+'</td><td>'+x.status+'</td><td>'+getDate(x.start)+'</td><td><b>CURRENTLY BORROWING, RETURN <u>BEFORE</u> OR <u>ON</u></b> '+getDate(x.until)+'</td><td>-</td></tr>' + history.innerHTML;
        }
        
        z-= 1
      })
      
    }else{
      userHistoryPlcHolder.innerHTML = 'This user has no history of borrowing';
    }


  })
}



function editUser(uid){

  var status = document.getElementById("statusEditUser");
  var inputFname = document.getElementById("fullName1");
  var inputEmail = document.getElementById("email1");
  var inputPw = document.getElementById("password1");
  status.innerHTML = "<p class='mrgtop2'>Loading...</p>"
  if(inputEmail.value != "" && inputFname.value != "" && inputPw.value.length >= 7 && isNaN(inputPw.value) == true){
    refUsers.child(uid).once("value", snapshot=>{
      var x = snapshot.val()
      firebase.auth().signInWithEmailAndPassword(x.email, x.password).then((userCreds)=>{
        userCreds.user.updatePassword(inputPw.value).then(() => {
          userCreds.user.updateEmail(inputEmail.value).then(()=>{
  
          refUsers.child(uid).update({
            fullName: inputFname.value,
            email: inputEmail.value,
            password: inputPw.value
          }).then(()=>{
            status.innerHTML = "<p class='mrgtop2'>User has been edited successfully</p>"
              refBooks.orderByChild('borrowedBy').once('value', snapshot=>{
                snapshot.forEach(childSnapshot=>{
                  refBooks.child(childSnapshot.key).child('history').orderByChild('borrowedBy').equalTo(uid).once('value', snapshot2=>{
                    snapshot2.forEach(childSnapshot2=>{
                      refBooks.child(childSnapshot.key).child('history').child(childSnapshot2.key).update({
                        fullname: inputFname.value
                      }).then(()=>{
                        status.innerHTML = "<p class='mrgtop2'>User has been edited successfully</p>"
                        refBooks.child(childSnapshot.key).child('reports').orderByChild('reportedBy').equalTo(uid).once('value', snapshot3=>{
                          if(snapshot3.exists()){
                            snapshot3.forEach(childSnapshot3=>{
                              refBooks.child(childSnapshot.key).child('reports').child(childSnapshot3.key).update({
                                fullName: inputFname.value
                              }).then(()=>{
                                status.innerHTML = "<p class='mrgtop2'>User has been edited successfully</p>"
                              }).catch(()=>{
                                status.innerHTML = "<p class='mrgtop2'>There was en error. Please try again.</p>"
                              })
                            })
                          }else{
                            status.innerHTML = "<p class='mrgtop2'>User has been edited successfully</p>"
                          }
                        })
                      }).catch(()=>{
                        status.innerHTML = "<p class='mrgtop2'>There was en error. Please try again.</p>"
                      })
                    })
                  })
                })
              })
  
          }).catch(()=>{
            status.innerHTML = "<p class='mrgtop2'>There was en error. Please try again.</p>"
            console.log("AAAA")
          })
            }).catch((error)=>{
              status.innerHTML = "<p class='mrgtop2'>There was en error in updating the email. Please try again.</p>"
            })
          }, (error) => {
            status.innerHTML = "<p class='mrgtop2'>There was en error in updating the password. Please try again.</p>"
         });
      
      }).catch((error)=>{
        status.innerHTML = "<p class='mrgtop2'>There was en error in user auth. Please try again.</p>"
      })
    })
  }else{
    status.innerHTML = "<p class='mrgtop2'>Input(s) must be filled correctly.</p>"
  }
  
  

}
 

function deleteUserShowModal(uid){
  var delBtn = document.getElementById("removeUserBtn");
  var userFullNameTitle = document.getElementById("userTitDel");

  refUsers.child(uid).once('value', snapshot=>{
    var x = snapshot.val();
    userFullNameTitle.innerHTML = x.fullName;
    delBtn.innerHTML = '<button type="button" onclick="deleteUser(\''+uid+'\',\''+x.password+'\')" class="btn btn-danger" data-dismiss="modal"><b>Yes, remove it</b></button>';
  })
  

  
}

function deleteUser(uid, pw){
  refUsers.child(uid).update({
    password: "non",
    holdPw: pw,
    trashedTime: Date.now()
  })
}

function getDate(dateInMS){
  var timestamp = dateInMS;
  var date = new Date(timestamp*1000);

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  
  var mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return day + " " + mo[month-1] + " " + year;

  /*var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
return day + " " + mo[month-1] + " " + year + ", " + hours + ":" + minutes;*/
}
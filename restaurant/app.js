// Signup

var auth = firebase.auth();

var resName = document.getElementById("resName")
var userName = document.getElementById("username")
var email = document.getElementById("email")
var password = document.getElementById("password")
var country = document.getElementById("country")
var city = document.getElementById("city")
var phone = document.getElementById("phone")
var resName = document.getElementById("resName")
var db = firebase.firestore()
// let storage = firebase.storage();


function cities(){
    country = document.getElementById("country")
    var pakistan = ["Karachi", "Islamabad", "Lahore", "Rawalpindi"]
    var india = ["Mombai", "Delhi", "Kolkatta" , "Chennai"]
    var bangladesh = ["Dhaka" , "Chatogram" , "Khulna", "RajShahi"]
    
    if(country.value === "Pakistan"){
        var city = document.getElementById("city")
        city.innerHTML = ""
        for(var i=0; i<pakistan.length; i++){
            var node = document.createElement("OPTION");                
            var textnode = document.createTextNode(pakistan[i]);         
            node.appendChild(textnode);                             
            document.getElementById("city").appendChild(node);
        }    
    }

    else if(country.value === "India"){
        var city = document.getElementById("city")
        city.innerHTML = ""
        for(var i=0; i<india.length; i++){
            var node = document.createElement("OPTION");                
            var textnode = document.createTextNode(india[i]);         
            node.appendChild(textnode);                             
            document.getElementById("city").appendChild(node);
        }    
    }

    else if(country.value === "Bangladesh"){
        var city = document.getElementById("city")
        city.innerHTML = ""
        for(var i=0; i<bangladesh.length; i++){
            var node = document.createElement("OPTION");                
            var textnode = document.createTextNode(bangladesh[i]);         
            node.appendChild(textnode);                             
            document.getElementById("city").appendChild(node);
        }    
    }
}


function signUp_res(){
    if(resName.value === "" || email.value === "" || password.value === "" || country.value === "Country" || city.value ==="City" ){
        alert("Please Fill all fields")
    }
    else{
        auth.createUserWithEmailAndPassword(email.value,password.value)
            .then((userCredentials) => {
                var user = userCredentials.user
                // console.log(userCredentials)
                uid = user.uid
                console.log(user.uid)
                db.collection("Restaurant").doc(user.uid).set({
                    RestaurantName : resName.value,
                    email : email.value,
                    country : country.value,
                    city : city.value,
                    userId : user.uid
                })
                .then(() => {
                    console.log("Document successfully written!");
                    window.location = "./restaurant.html"
                })
                
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage)
                });
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage)
            });
                

            
        }
    }
        

function signout(){
    window.location = "../index.html"
}

// -----------------------------------------------------------

var itemName = document.getElementById("item_Name")
var price = document.getElementById("price")
var category = document.getElementById("category")
var delivery_type = document.getElementById("delivery_type")


function addnewDish(){
    auth.onAuthStateChanged((user) => {
        db.collection("Dishes").doc(user.uid).set({
            itemName : itemName.value,
            price : price.value,
            category : category.value,
            delivery : delivery_type.value
            })
            .then(() => {
                console.log("Document successfully written!");
                alert("Dish Add Successfully")
                
                
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });

    })
}

function login(){
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        window.location = "./restaurant.html"
        // ...
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}







// ---------------------------------------------------------------------

function getOrders(){
    
    db.collection("Orders").get()
    .then((querySnapshot)=>{
        querySnapshot.forEach((doc) => { 
            console.log(doc) 
            document.getElementById('row_all').innerHTML += `
            <div class="col-sm-4">
                <div class="card mb-3" style="max-width: 540px;">
                <div class="row no-gutters">
                    <div class="col-md-4">
                    <img src="./images/foodboy.jpg" class="card-img" alt="...">
                    </div>
                    <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title"> Dish : ${doc.data().itemName}</h5>
                        <h5 class="card-title"> Category : ${doc.data().category}</h5>
                        <h5 class="card-title"> Price : ${doc.data().price}</h5>
                        <h5 class="card-title"> Delivery : ${doc.data().delivery}</h5>
                        <button class="btn btn-primary btn-lg mt-2" onclick="accept('${doc.data().itemName}','${doc.data().category}','${doc.data().price}','${doc.data().delivery}')">Accept</button>
                        <br>
                        <button class="btn btn-primary btn-lg mt-2" onclick="delete('${doc.data().itemName}','${doc.data().category}','${doc.data().price}'}, ${doc.data().userId}')">Delete</button>     
                    </div>
                    </div>
                </div>
                </div>
                </div>


            `
            
                                
            })
    })
}

getOrders()

function accept(itemName, category, price, delivery){
    console.log(itemName, category, price, delivery)
    db.collection("acceptedOrders").add({
        itemName : itemName,
        category : category,
        price : price,
        delivery : delivery
    })
    .then(() => {
        console.log("Document successfully written!");
        alert("Accepted")
        
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        
    });


}

async function acceptedOrders(){
    await db.collection("acceptedOrders").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {  
            console.log(doc.data()) 
            document.getElementById('row_accept').innerHTML += `
            <div class="col-sm-4">
                <div class="card mb-3" style="max-width: 540px;">
                <div class="row no-gutters">
                    <div class="col-md-4">
                    <img src="./images/foodboy.jpg" class="card-img" alt="...">
                    </div>
                    <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title"> Dish : ${doc.data().itemName}</h5>
                        <h5 class="card-title"> Category : ${doc.data().category}</h5>
                        <h5 class="card-title"> Price : ${doc.data().price}</h5>
                        <h5 class="card-title"> Delivery : ${doc.data().delivery}</h5>
                        <button class="btn btn-primary btn-lg mt-2" onclick="accept('${doc.data().itemName}','${doc.data().category}','${doc.data().price}','${doc.data().delivery}')">Accept</button>
                        <br>
                        <button class="btn btn-primary btn-lg mt-2" onclick="delete('${doc.data().itemName}','${doc.data().category}','${doc.data().price}'}, ${doc.data().userId}')">Delete</button>     
                    </div>
                    </div>
                </div>
                </div>
                </div>


            `
           
                                
            })
        }  
    );
}
acceptedOrders()

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
let titleresShow = document.getElementById("h1_resShow")
var db = firebase.firestore()
// let storage = firebase.storage();

// console.log(title_resShow)
// title_resShow.innerHTML = 'Ali';

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


function signUp_customer(){
    // console.log(username.value)
    if(username.value === "" || email.value === "" || phone.value === "" || country.value === "Country" || city.value ==="City" || password.value === "" ){
        alert("Please Fill all fields")
    }
    else{
        auth.createUserWithEmailAndPassword(email.value,password.value)
        .then((userCredentials) => {
            var user = userCredentials.user
            userId = user.uid
            console.log(user.uid)
            db.collection("Customer").doc(user.uid).set({
                userName : username.value,
                email : email.value,
                phone : phone.value,
                country : country.value,
                city : city.value,
                userId : user.uid
            })
            .then(() => {
                console.log("Document successfully written!");
                window.location = "./customer.html"
                
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
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
var cardContainer = document.getElementById("card")
var h3 = document.getElementById("h3")
// ---------------------------------------------------------------------


async function resShow(title, uid){
    console.log(uid)
    console.log(title);
    document.write(`<body>
                        <head>
                            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
                            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
                            
                            
                            <link rel="stylesheet" href="style.css">
                        </head>

                    <h1> ${title} </h1>
                    <h2 class='h2_heading'> Dishes <h2>
                    <div class="row"> 
                    `
                    )


    await db.collection("Dishes").get()   
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {  
            id = doc.id
            let a = id.search(title)
            if(a===0){
                console.log(doc.data())
                // h3.innerHTML += title

                document.write(`

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
                                    <button class="btn btn-primary btn-lg" onclick="orders('${doc.data().itemName}','${doc.data().category}','${doc.data().price}','${doc.data().delivery}')">Order Now</button>
                                    
                                </div>
                                </div>
                            </div>
                            </div>
                            </div>

                        `)
    
                      }
                    })
                })

                }

async function getData(){
    await db.collection("Restaurant").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {  
            var res_data = []
            var resName = doc.data().RestaurantName
            var resId = doc.data().userId
            res_data.push({[resName] : resId })
            console.log(Object.keys(res_data[0])[0])
            cardContainer.innerHTML += `<h3 class='card-body'><a onclick="resShow('${resName}', '${resId}')"> ${Object.keys(res_data[0])[0]} </a> </h3>`
                                
            })
        }  
    );
}



getData()


function orders(itemName, category, price, delivery){
     console.log(itemName, category, price, delivery)
     db.collection("Orders").add({
        itemName : itemName,
        category : category,
        price : price,
        delivery : delivery
    })
    .then(() => {
        console.log("Document successfully written!");
        alert("Thanks for Order!")
        
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        alert("Sorry for inconvenience, This item is Out of stock!")
        
    });



}




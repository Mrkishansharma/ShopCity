
let cartitems = []


const BaseUrl = `http://localhost:3000`


// take it from local storrage.

const token = localStorage.getItem("usertoken") || null;


if(!token){
    alert("Kindly Login First to Access cart section.")
    location.href = "../view/user.login.html"
}

let Cart_Amount = 0;

fetchAndRenderCart();



let MainCartSection = document.getElementById("Nitesh_Cart_items");

let Total_Amount = document.querySelector("#Nitesh_Order_Summary > div > h3 > span");

let SubTotal = document.querySelector("#Nitesh_Order_Summary > div > p:nth-child(2) > span");


let checkoutbtn = document.querySelector("#Nitesh_Order_Summary button");

checkoutbtn.addEventListener("click", function (e) {


    if (token && cartitems.length){
        window.location = "../view/checkout.html";
    }
    else{
        alert("Your Cart is Empty so Add some items into cart to proceed for checkout.")
    }
})



function fetchAndRenderCart() {

    fetch(`${BaseUrl}/cart/get`,{
        method:'GET',
        headers:{
            'content-type':'application/json',
            'authorization':`Bearer ${token}`
        }
    })
    .then((res) => {
        return res.json()
    })
    .then((data) => {

        console.log("cart response",data);

        if(data.Success){

            console.log(data.CartItem);

            cartitems = [...data.CartItem.Products];

            console.log("cart---->", cartitems)

            if(cartitems.length){

                RenderCartItem(data.CartItem.Products)
            }

            else{
                Emptycart();
            }
        }

        else{
            Emptycart();
        }
           
        
    })
    .catch((err)=>{
        console.log(err)
    })

}
    


function Emptycart() {

    let MainCartSection = document.getElementById("Nitesh_Cart_items");

    MainCartSection.innerHTML = `<p>Your Shopping Cart is Empty !</p>`
    MainCartSection.style.backgroundImage = `url('https://thumbs.gfycat.com/CompleteShallowFlyingsquirrel-size_restricted.gif')`
    MainCartSection.style.height="480px"
    MainCartSection.style.display = 'flex';
    MainCartSection.style.justifyContent='center'
    MainCartSection.style.backgroundRepeat='no-repeat'
    MainCartSection.style.backgroundPosition='center'
    MainCartSection.style.backgroundSize = 'auto';
}


function RenderCartItem(data) {

    let len = data.length;
    let totalCartCount = document.getElementById('totalCartCount')

    if(len==0){
        totalCartCount.innerText = `Empty Cart`
    }else if(len==1){
        totalCartCount.innerText = `1 Item`
    }else{
        totalCartCount.innerText = `${len} Item's`
    }

    let Cards = data.map((item) => {
        
        return getCards(item.product.Image, item.product.Title, item.product.Category, item.product.Description, item.product.Price, item.Quantity,item.product._id, item.product.Quantity
            )
    }).join("")


    MainCartSection.innerHTML = `${Cards}`;

    CalculateCartPrice();


    let Qunatity_Select = document.querySelectorAll("#Nitesh_Cart_items > div > select");


    for (let i of Qunatity_Select) {

        i.addEventListener("change", function (e) {

            e.preventDefault();

            console.log(e.target.value, e.target.id);

            const Payload = {
                Quantity:+e.target.value
            }

            const ProductID = e.target.id;

            UpdateCartStatus(ProductID,Payload);

        })
    }


    let Remove_button = document.querySelectorAll("button");

    for (let i of Remove_button) {

        i.addEventListener("click", function (e) {
            e.preventDefault();

            const ProductID = e.target.id;

            RemoveItemFromCart(ProductID);
            
        })
    }

}


function getCards(Image, Title, Category, Description, Price , Quantity, id, totalAvailbleQuantity) {


    return `<div>
            <img src="${Image}" alt="Error" onclick="goToDetailPage('${id}')">
            <h5>${Title}</h5>
            <p>${Category}</p>
            <p>${Description.substring(0, 50)} Rs</p>
            <p>Price : ${Price} Rs</p>
            ${totalAvailbleQuantity > 0 ? getQuantitySelect(totalAvailbleQuantity,Quantity,id) : "<p>Out Of Stock</p>"}
            
            <button id="${id}">Remove</button>
        </div>`

}

function goToDetailPage(id){
    console.log(id);
    localStorage.setItem('productID', id);
    location.href = '../view/details.html'
}

function getQuantitySelect(totalavailbe, selectedQuantity,id){
    let otpions = ''
    for(let i=0; i<totalavailbe && i<10; i++){
        otpions += `<option value="${i+1}" ${selectedQuantity==(i+1) ? "Selected" : ""}>Quantity :- ${i+1}</option>`
    }
    return `
        <select name="quantity" id="${id}">
            ${otpions}
        </select>
    `;

}



function CalculateCartPrice() {

    Cart_Amount = 0;

    if (cartitems.length !== 0) {

        for (let item of cartitems) {
            Cart_Amount += (item.Quantity)*(item.product.Price);
            Total_Amount.textContent = Cart_Amount + " Rs";
            SubTotal.textContent = Cart_Amount + " Rs";
        }
                  
        
    }
}



function UpdateCartStatus(ProductID,Payload){

    fetch(`${BaseUrl}/cart/update/${ProductID}`,{
        method:'PATCH',
        headers:{
            'content-type':'application/json',
            'authorization':`Bearer ${token}`
        },
        body:JSON.stringify(Payload)
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{

        console.log(data);

        if(data.Success){
            alert(data.msg);

            location.reload()
        }
        else{
            alert(data.msg)
        }

    })
    .catch((err)=>{
        // alert(data.msg)
        console.log(err)
    })
}


function  RemoveItemFromCart(ProductID){

    fetch(`${BaseUrl}/cart/delete/${ProductID}`,{
        method:'delete',
        headers:{
            'content-type':'application/json',
            'authorization':`Bearer ${token}`
        }
    })
    .then((res)=>{
        return res.json()
    })
    .then((data)=>{

        console.log(data);

        if(data.Success){
            alert(data.msg);

            location.reload()
        }
        else{
            alert(data.msg)
        }

    })
    .catch((err)=>{
        // alert(data.msg)
        console.log(err)
    })
}



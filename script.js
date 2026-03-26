let employees = JSON.parse(localStorage.getItem("employees")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];

let currentEmployee=null;

/* LOGIN NAVIGATION */

function openAdminLogin(){
homePage.classList.add("hidden");
adminLoginPage.classList.remove("hidden");
}

function openEmployeeLogin(){
homePage.classList.add("hidden");
employeeLoginPage.classList.remove("hidden");
}

function goHome(){
location.reload();
}

function logout(){
location.reload();
}

function showSection(id){
document.querySelectorAll(".card").forEach(c=>c.classList.add("hidden"));
document.getElementById(id).classList.remove("hidden");
}

/* ADMIN LOGIN */

function adminLogin(){

if(adminUser.value==="admin" && adminPass.value==="admin123"){

sidebar.classList.remove("hidden");
adminMenu.classList.remove("hidden");

adminLoginPage.classList.add("hidden");

showSection("registerSection");

}else{
alert("Invalid Admin Login");
}

}

/* EMPLOYEE LOGIN */

function employeeLogin(){

let emp=employees.find(e=>e.email===empEmail.value);

if(!emp){
alert("Employee not found");
return;
}

if(emp.locked){
alert("Account locked");
return;
}

if(emp.password!==empPassword.value){

emp.attempts++;

if(emp.attempts>=3){
emp.locked=true;
alert("Account locked");
}

localStorage.setItem("employees",JSON.stringify(employees));
return;
}

emp.attempts=0;
currentEmployee=emp;

sidebar.classList.remove("hidden");
employeeMenu.classList.remove("hidden");

employeeLoginPage.classList.add("hidden");

showProducts();

}

/* REGISTER EMPLOYEE */

function registerEmployee(){

let emp={
name:regName.value,
email:regEmail.value,
mobile:regMobile.value,
empId:regEmpId.value,
shop:regShop.value,
password:regPass.value,
attempts:0,
locked:false
};

employees.push(emp);

localStorage.setItem("employees",JSON.stringify(employees));

alert("Employee Registered");

}

/* SHOW EMPLOYEES */

function showEmployees(){

showSection("employeeSection");

employeeList.innerHTML="";

employees.forEach((e,i)=>{

employeeList.innerHTML+=`

<div class="product">
<b>${e.name}</b><br>
${e.email}<br>
Shop ${e.shop}<br>

<button onclick="removeEmployee(${i})">Remove Employee</button>

</div>

`;

});

}

/* REMOVE EMPLOYEE */

function removeEmployee(index){

if(confirm("Remove this employee?")){

employees.splice(index,1);

localStorage.setItem("employees",JSON.stringify(employees));

showEmployees();

}

}

/* ADD MEDICINE */

function addProduct(){

let product={

name:pname.value,
image:pimage.value,
qty:parseInt(pqty.value),
expiry:pexpiry.value,
shop:currentEmployee.shop

};

products.push(product);

localStorage.setItem("products",JSON.stringify(products));

showProducts();

}

/* STOCK IN */

function stockIn(i){

let qty=parseInt(document.getElementById("stockIn"+i).value);

if(!qty || qty<=0){
alert("Enter valid quantity");
return;
}

products[i].qty+=qty;

localStorage.setItem("products",JSON.stringify(products));

showProducts();

}

/* STOCK OUT */

function stockOut(i){

let qty=parseInt(document.getElementById("stockOut"+i).value);

if(!qty || qty<=0){
alert("Enter valid quantity");
return;
}

if(products[i].qty<qty){
alert("Not enough stock");
return;
}

products[i].qty-=qty;

localStorage.setItem("products",JSON.stringify(products));

showProducts();

}

/* UPDATE EXPIRY DATE */

function updateExpiry(index){

let newDate=document.getElementById("updateExpiry"+index).value;

if(!newDate){
alert("Select expiry date");
return;
}

products[index].expiry=newDate;

localStorage.setItem("products",JSON.stringify(products));

showProducts();

}

/* SHOW PRODUCTS */

function showProducts(){

showSection("productSection");

productList.innerHTML="";

products.forEach((p,i)=>{

let alert="";

let today=new Date();
let expiryDate=new Date(p.expiry);
let days=Math.floor((expiryDate-today)/(1000*60*60*24));

if(days<0){
alert+=` <span class='expired'>EXPIRED</span>`;
}
else if(days<=7){
alert+=` <span class='expiringSoon'>EXPIRING IN ${days} DAYS</span>`;
}

if(p.qty===0){
alert+=` <span class='outStock'>OUT OF STOCK</span>`;
}
else if(p.qty<=3){
alert+=` <span class='lowStock'>LOW STOCK</span>`;
}

let removeBtn="";

if(!adminMenu.classList.contains("hidden")){
removeBtn=`<button onclick="removeProduct(${i})">Remove</button>`;
}

productList.innerHTML+=`

<div class="product">

<img src="${p.image}" width="50">

<b>${p.name}</b><br>

Stock : ${p.qty}<br>

Expiry : ${p.expiry}

${alert}

<br>

<input type="date" id="updateExpiry${i}">
<button onclick="updateExpiry(${i})">Update Expiry</button>

<br>

<input type="number" id="stockIn${i}" placeholder="Stock In">
<button onclick="stockIn(${i})">Stock In</button>

<input type="number" id="stockOut${i}" placeholder="Stock Out">
<button onclick="stockOut(${i})">Stock Out</button>

${removeBtn}

</div>

`;

});

}

/* LOW STOCK FILTER */

function showLowStock(){

showSection("productSection");

productList.innerHTML="";

products.forEach((p,i)=>{

if(p.qty>0 && p.qty<=3){

productList.innerHTML+=`

<div class="product">

<img src="${p.image}" width="50">

<b>${p.name}</b><br>

Stock : ${p.qty}<br>

Expiry : ${p.expiry}

<span class="lowStock">LOW STOCK</span>

</div>

`;

}

});

}

/* OUT OF STOCK FILTER */

function showOutStock(){

showSection("productSection");

productList.innerHTML="";

products.forEach((p,i)=>{

if(p.qty===0){

productList.innerHTML+=`

<div class="product">

<img src="${p.image}" width="50">

<b>${p.name}</b><br>

Stock : 0<br>

Expiry : ${p.expiry}

<span class="outStock">OUT OF STOCK</span>

</div>

`;

}

});

}

/* REMOVE PRODUCT */

function removeProduct(index){

if(confirm("Remove this medicine?")){

products.splice(index,1);

localStorage.setItem("products",JSON.stringify(products));

showProducts();

}

}

/* SEARCH */

function searchMedicine(){

let value=searchBox.value.toLowerCase();

let filtered=products.filter(p=>p.name.toLowerCase().includes(value));

productList.innerHTML="";

filtered.forEach((p,i)=>{

productList.innerHTML+=`

<div class="product">

<img src="${p.image}" width="50">

<b>${p.name}</b><br>

Stock : ${p.qty}<br>

Expiry : ${p.expiry}

</div>

`;

});

}

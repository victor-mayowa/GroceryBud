// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// console.log(clearBtn);

// edit option
let editElement;
let editFlag = false;
let editId = "";
// ****** EVENT LISTENERS **********
//submit form
form.addEventListener("submit", addItem);
//clear items
clearBtn.addEventListener("click", clearItems);
//loads items to the dom
window.addEventListener("DOMContentLoaded", setupItems)

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    //    console.log("okay")
    //create a new element
   createListItem(id, value)
    //display alert
    displayAlert("item added to the list", "success");
    //show container
    container.classList.add("show-container");
    //add to local storage
    addToLocalStorage(id, value);
    //set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    // console.log("edit");
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    //edit local storage
    editLocalStorage(editId, value);
    setBackToDefault();
  } else {
    //    console.log("no values and no editing")
    displayAlert("please enter your value", "danger");
  }
}

//display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  ///remove alert
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//clear item
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  // list.innerHTML = ""
  // console.log(items);
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}
//delete function
function deleteItem(e) {
  // console.log("delete")
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  // console.log(id)
  list.removeChild(element);
  // console.log(element)
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault(id);
  //remove from local storage
  removeFromLocalStorage(id);
}
//edit function
function editItem(e) {
  // console.log("edit")
  const element = e.currentTarget.parentElement.parentElement;
  //set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  console.log(editElement);
  //set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editId = element.dataset.id;
  submitBtn.textContent = "edit";
}
//set bact to default
function setBackToDefault() {
  // console.log("set back to default")
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "submit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  // console.log("added to local storage");
  // const grocery = {id:id, value:value}
  //since the name and parameter are both the same, we can shorten them ES6
  const grocery = { id, value };
  let items = getLocalStorage();
  // console.log(items)
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  // console.log(id);
  let items = getLocalStorage();

  items = items.filter((item) => {
    if (item.id !== id) {
      // console.log(item)
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// ****** SETUP ITEMS **********
// localStorage.setItem("orange", JSON.stringify(["item", "item1"]));
// const oranges = JSON.parse(localStorage.getItem("orange"))
// console.log(oranges)
// localStorage.removeItem("orange")

function setupItems(){
  let items = getLocalStorage()
  if(items.length > 0){
    items.forEach((item)=>{
      createListItem(item.id, item.value)
    })
    container.classList.add("show-container")
  }
}
function createListItem(id,value){
  const element = document.createElement("article");
  //add class
  element.classList.add("grocery-item");
  //add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
 <div class="btn-container">
   <button type="button" class="edit-btn">
     <i class="fas fa-edit"></i>
   </button>
   <button type="button" class="delete-btn">   
     <i class="fas fa-trash"></i>
   </button>
 </div>`;
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");

  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  //append child
  list.appendChild(element);
}
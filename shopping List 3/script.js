// Get references to HTML elements by id's
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}
// define a function named addItem that takes an event parameter (e)
function onAddItemSubmit(e) {
  // Prevent the default form submission behavior
  e.preventDefault();

  const newItem = itemInput.value; // This retrieves the current value of the input field. In HTML, the value property of an input element represents the text entered by the user.

  // Validate Input
  if (newItem === '') {
    // If the input value is empty, show an alert and do not proceed
    alert('Please add an item');
    return;
  }
  // Create list item
  //Declares a constant variable named li to store a reference to a newly created list item element.

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExist(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = ''; //This line sets the value of the input field to an empty string. This is a common practice after adding an item to a list to clear the input field, making it ready for the user to input a new item.
}

function addItemToDOM(item) {
  const li = document.createElement('li');
  //document.createElement('li'): Creates a new HTML list item element (<li>) using the document.createElement method. This newly created element is now referenced by the li variable.
  li.appendChild(document.createTextNode(item));
  // Creates a new text node containing the text specified in the newItem variable. The text node represents the content that will be placed inside the list item.
  const button = createButton('remove-item btn-link text-red');
  //Calls the createButton function with the argument 'remove-item btn-link text-red'. This function creates a button element with the specified classes and returns the button.
  li.appendChild(button); //: This line appends the button element as a child to the list item (li). In the context of a to-do list or similar application, this might mean associating a button with a specific list item, perhaps for the purpose of removing or interacting with the list item.

  //Add li to DOM

  itemList.appendChild(li); //This line appends the created list item (li) as a child to the itemList element. This adds the new list item to the list in the HTML document. It could represent adding a new item to a to-do list or similar.
}

// Defines a function named createButton that takes a parameter classes.
function createButton(classes) {
  const button = document.createElement('button');
  //Creates a new HTML button element (<button>) using the document.createElement method and stores it in the button variable.
  button.className = classes; //Sets the className property of the button to the value of the classes parameter. This adds the specified CSS classes to the button.
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button; // Returns the created button element
}

function createIcon(classes) {
  //declares a function named createIcon.Takes one parameter 'classes'
  const icon = document.createElement('i'); //creates a new html element its stored in the variable 'i'.
  icon.className = classes; //Sets the className property of the <i> element to the value of the classes parameter.
  return icon; //Returns the created <i> element.
}

function addItemToStorage(item) {
  //function to add items to storage
  const itemsFromStorage = getItemFromStorage(); // Declaring the variable

  // Add new item to array
  itemsFromStorage.push(item); //this line adds the new items to the list of things we want to keep.

  //Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage)); //This line puts the updated list back into the 'items' section of the box, but in a special coded form.
}

function getItemFromStorage() {
  let itemsFromStorage; // Decalaring the variable

  if (localStorage.getItem('items') === null) {
    //  This code checks if there's anything already in that section. If it's empty, we start with an empty list. If there's something there, we take it out and make it readable.
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExist(item) {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    //remove item From DOM
    item.remove();

    //Remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();

  //filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //Reset to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  //This line declares a function named clearItems. This function appears to be designed to clear all child elements of the itemList
  while (itemList.firstChild) {
    //This line initiates a while loop that continues executing as long as the itemList has a first child element.
    itemList.removeChild(itemList.firstChild); // Within the while loop, this line removes the first child element of the itemList.
  }

  // Clear from localstorage
  localStorage.removeItem('items');

  checkUI();
}

function filterItems(e) {
  // // Get the entered text from the input field (filter)
  const text = e.target.value.toLowerCase(); //This represents the value of the input field that triggered the event (likely an input for filtering).//toLowerCase(): Converts the entered text to lowercase for case-insensitive comparison.
  const items = itemList.querySelectorAll('li'); // // Get all list items within itemList
  //// Iterate over each list item
  items.forEach((item) => {
    //// Get the text content of the current list item
    const itemName = item.firstChild.textContent.toLowerCase(); //This gets the text content of the current list item's first child (assuming the text is directly within the <li>).

    if (itemName.indexOf(text) != -1) {
      //This checks if the entered text is found within the item name. The indexOf method returns the position of the first occurrence of the specified value in a string, or -1 if the value is not found.
      item.style.display = 'flex'; //If there's a match, set the display style of the item to 'flex' (assuming it's a flex container)
    } else {
      item.style.display = 'none'; //If there's no match, hide the item by setting its display style to 'none'.
    }
  });
}

//In summary, the checkUI function dynamically adjusts the visibility of certain UI elements based on whether there are items in the list (itemList). If the list is empty, it hides the clear button and item filter; if the list has items, it shows them.
function checkUI() {
  itemInput.value = '';
  //// Select all list items within itemList
  const items = itemList.querySelectorAll('li');
  //// Check if there are no items
  if (items.length === 0) {
    //// If no items, hide the clear button and item filter
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    //// If there are items, show the clear button and item filter
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

//Initialize app
function init() {
  //Event Listeners
  // Attach the addItem function to the 'submit' event of the itemForm
  itemForm.addEventListener('submit', onAddItemSubmit); //When the form is submitted, the addItem function will be called
  itemList.addEventListener('click', onClickItem); //When an item within the list is clicked, the removeItem function will be called
  clearBtn.addEventListener('click', clearItems); //When the button is clicked, the clearItems function will be called. This implies that the clearItems function is designed to handle click events on a button, possibly for clearing a list or container.
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  //displayItems();

  checkUI();
}
init();

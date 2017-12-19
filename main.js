/* ITEM OBJECT */
function item (title, priority, dueDate, arrayLocation) {
  this.title = title;
  this.priority = priority;
  this.dueDate = dueDate;
  this.state = "Active";
  this.element;
  this.arrayLocation = arrayLocation;
}

/* Function for creating a new item. Not the item constructor. */
function OnNewItem () {
  // Input is put into an array here
  var input = new Array(4)                                      // Creates new input array
  var inputBar = document.getElementById("inputbar").value;
  var inputTitle = inputBar;
  var inputPriority = inputBar;
  input[0] = inputTitle.split("!").shift();
  input[1] = inputPriority.split("!").pop();

  document.getElementById("inputbar").value = null;

  // New item is created here and input is put into it
  i = items.length;                                             // Sets index to current item. Might be unnecessary code.
  items[i] = new item(input[0], input[1], input[2], i);  // Creates new item and passes input into parameters.
  var currentItem = items[i];                                   // Creates temporary variable to access current item more easily

  // Cookie for item is created here with cookieCode
  var cookieCode = currentItem.title + "_" + currentItem.priority + "_" 
    + currentItem.dueDate + "_" + currentItem.state + "_" + currentItem.arrayLocation;
  CreateCookie(`item${i}`, cookieCode);

  // Item's element is created here
  NewItemElement(currentItem, cookieCode);

  // Updates the index so the next item is in the right spot
  i++;                                                          // Increments index to prepare for next item
  CreateCookie("ItemArrayIndex", i);
}

function NewItemElement (currentItem, currentCookieCode) {
  var itemElement = document.createElement("div");              // Creates item element
  var currentCookieCode_segments = currentCookieCode.split("_");

  var backgroundColor;

  itemElement.setAttribute("class", "item");
  itemElement.setAttribute("onclick", "OnItemClick(this.id)");

  switch(currentCookieCode_segments[1]) {
    case "1":
      backgroundColor = "#f77e7e";
      break;
    case "2":
      backgroundColor = "#f7aa7d";
      break;
    case "3":
      backgroundColor = "#f7de7d";
      break;
    default:
      backgroundColor = "#ffffff";
      break;
  }

  itemElement.setAttribute("style", `background-color: ${backgroundColor}`);
  itemElement.setAttribute("id", `item ${currentItem.arrayLocation}`);  // Creates id for element
  var t = document.createTextNode(currentItem.title);           // Creates text for element
  itemElement.appendChild(t);                                   // Appends text to element
  document.getElementById("itemholder").appendChild(itemElement);   // Appends element to itemholder

  currentItem.element = itemElement;                            // Sets item's element equal to itemElement
}

/* COMPLETES ITEM */
function OnItemClick (clicked_id) {
  var itemElement = document.getElementById(clicked_id);
  itemElement.setAttribute("class", "item_completed");
  itemElement.setAttribute("onclick", "OnCompleteItemClick(this.id)");
  GetItemThroughElement(itemElement).state = "Completed";

  var currentItem = GetItemThroughElement(itemElement);
  var cookieCode = currentItem.title + "_" + currentItem.priority + "_" 
    + currentItem.dueDate + "_" + currentItem.state + "_" + currentItem.arrayLocation;
  CreateCookie(`item${currentItem.arrayLocation}`, cookieCode);
}

/* REMOVES ELEMENT */
function OnCompleteItemClick (clicked_id) {
  var itemElement = document.getElementById(clicked_id);
  GetItemThroughElement(itemElement).state = "Removed";
  GetItemThroughElement(itemElement).element = null;
  itemElement.parentNode.removeChild(itemElement);

  var currentItem = GetItemThroughElement(itemElement);
  var cookieCode = currentItem.title + "_" + currentItem.priority + "_" 
    + currentItem.dueDate + "_" + currentItem.state + "_" + currentItem.arrayLocation;
  CreateCookie(`item${currentItem.arrayLocation}`, cookieCode);
}

/* Gets item via element */
function GetItemThroughElement (itemElement) {
  var itemIndex = itemElement.id.split(" ").pop();                    // Stores itemIndex in variable. itemIndex = the element's id minus the word "item"
  var thisItem = items[itemIndex];
  return thisItem;
}

/* COOKIES */
function CreateCookie (cookieName, cookieValue) {
  document.cookie = cookieName + "=" + cookieValue + ";";
}

function ReadCookie (cookieName) {
  var cookieNameEQ = cookieName + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ')
        c = c.substring(1, c.length);
      if (c.indexOf(cookieNameEQ) == 0)
        return c.substring(cookieNameEQ.length, c.length);
  }
  return null;
}

/* Check for the various File API support */
if (window.File && window.FileReader && window.FileList) {
  // The File APIs are fully supported in this browser.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

/* INITIALIZATION CODE */
var items = new Array();
var i = 0;

AddEvent();

if(ReadCookie("ItemArrayIndex") == null) {
  CreateCookie("ItemArrayIndex", i);
}

if(ReadCookie("ItemArrayIndex") >= 0) {
  var items_cookie = ReadCookie("ItemArrayIndex");
  i = items_cookie;
  for(n = 0; n <= i; n++) {
    // Read cookies of every single item
    var item_cookie_code = ReadCookie(`item${n}`);
    var item_cookie_code_segments = item_cookie_code.split("_");
    items[n] = new item(item_cookie_code_segments[0], item_cookie_code_segments[1], item_cookie_code_segments[2], 
      item_cookie_code_segments[4]);

    NewItemElement(items[n], item_cookie_code);
  }
}

/* MANAGES EVENTLISTENERS */
function AddEvent() {
  // Press enter key to enter an item:
  document.addEventListener('keydown', function (event) {
    if (event.keyCode == 13 && document.activeElement.id == "inputbar") {
      OnNewItem();
    }
  });
}
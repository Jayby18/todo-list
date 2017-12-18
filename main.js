/* Item object */
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
  var input = new Array(4)                                      // Creates new input array
  input[0] = document.getElementById("inputbar").value;         // Sets input[0], so the title, equal to the value inside the input box
  document.getElementById("inputbar").value = null;

  i = items.length;                                             // Sets index to current item. Might be unnecessary code.
  items[i] = new item(input[0], input[1], input[2], i);  // Creates new item and passes input into parameters.
  var currentItem = items[i];                                   // Creates temporary variable to access current item more easily

  var cookieCode = currentItem.title + "_" + currentItem.priority + "_" + currentItem.dueDate + "_" + currentItem.state + "_" + currentItem.arrayLocation;
  CreateCookie(`item${i}`, cookieCode);

  NewItemElement(currentItem, cookieCode);

  i++;                                                          // Increments index to prepare for next item
  CreateCookie("ItemArrayIndex", i);
}

function NewItemElement (currentItem, currentCookieCode) {
  var itemElement = document.createElement("div");              // Creates item element
  var currentCookieCode_segments = currentCookieCode.split("_");

  switch(currentCookieCode_segments[3]) {
    case "Active":
      itemElement.setAttribute("class", "item");                    // Sets item element class to item
      itemElement.setAttribute("onclick", "OnItemClick(this.id)");  // Sets click event for element
      break;
    case "Completed":
      itemElement.setAttribute("class", "item_completed");                    // Sets item element class to item
      itemElement.setAttribute("onclick", "OnCompleteItemClick(this.id)");  // Sets click event for element
      break;
    case "Removed":
      OnCompleteItemClick(itemElement.id);
      break;
  }
  itemElement.setAttribute("id", `item ${currentItem.arrayLocation}`);  // Creates id for element
  var t = document.createTextNode(currentItem.title);           // Creates text for element
  itemElement.appendChild(t);                                   // Appends text to element
  document.getElementById("itemholder").appendChild(itemElement);   // Appends element to itemholder

  currentItem.element = itemElement;                            // Sets item's element equal to itemElement
}

/* Completes item */
function OnItemClick (clicked_id) {
  var itemElement = document.getElementById(clicked_id);
  itemElement.setAttribute("class", "item_completed");
  itemElement.setAttribute("onclick", "OnCompleteItemClick(this.id)");
  GetItemThroughElement(itemElement).state = "Completed";

  var currentItem = GetItemThroughElement(itemElement);
  var cookieCode = currentItem.title + "_" + currentItem.priority + "_" + currentItem.dueDate + "_" + currentItem.state + "_" + currentItem.arrayLocation;
  CreateCookie(`item${currentItem.arrayLocation}`, cookieCode);
}

/* Removes element */
function OnCompleteItemClick (clicked_id) {
  var itemElement = document.getElementById(clicked_id);
  GetItemThroughElement(itemElement).state = "Removed";
  GetItemThroughElement(itemElement).element = null;
  itemElement.parentNode.removeChild(itemElement);

  var currentItem = GetItemThroughElement(itemElement);
  var cookieCode = currentItem.title + "_" + currentItem.priority + "_" + currentItem.dueDate + "_" + currentItem.state + "_" + currentItem.arrayLocation;
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

// Check for the various File API support
if (window.File && window.FileReader && window.FileList) {
  // The File APIs are fully supported in this browser.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

/* INITIALIZATION CODE */
var items = new Array();
var i = 0;

if (ReadCookie("ItemArrayIndex") == null) {
  CreateCookie("ItemArrayIndex", i);
}

if(ReadCookie("ItemArrayIndex") >= 0) {
  var items_cookie = ReadCookie("ItemArrayIndex");
  i = items_cookie;
  for(n = 0; n <= i; n++) {
    // Read cookies of every single item
    var item_cookie_code = ReadCookie(`item${n}`);
    var item_cookie_code_segments = item_cookie_code.split("_");
    items[n] = new item(item_cookie_code_segments[0], item_cookie_code_segments[1], item_cookie_code_segments[2], item_cookie_code_segments[4]);

    NewItemElement(items[n], item_cookie_code);
  }
}

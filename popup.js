var search = $('#searchBar');
var div = $('#tempDiv');

var current;

function chooseNextElement(){
  var list  = div.children();
  if (current === undefined){
    current = list.first();
    current.addClass('selected');
    return;
  }
  current.removeClass('selected');

  if (current.is( list.last() ) ) {
    current = list.first();
  }else{
    current = current.next();
  }
  current.addClass('selected');
}

function choosePrevElement(){
  var list = div.children();
  if (current === undefined){
    current = list.last();
    current.addClass('selected');
    return;
  }
  current.removeClass('selected');

  if (current.is( list.first() )){
    current = list.last();
  }else{
    current = current.prev();
  }
  current.addClass('selected');
}

function chooseCurrentElement(){
  var checkbox = current.find('input');
  var text  = current.find('p');

  // TODO change ext_id once  once events is merged
  var ext_id = current.attr('ext_id');

  checkbox.prop('checked', !checkbox.prop('checked'));
  enableDisable(ext_id, checkbox.prop('checked'));
  text.toggleClass('disabled');
}

function clearDiv(){
  div.empty();
}


function reload(){
  chrome.runtime.sendMessage({type:'search', value:''}, onResponse);
}
function enableDisable (id, value) {
  console.log(id, value);
  chrome.runtime.sendMessage({type:'changeState', id:id, value:value});
}
function uninstall(id){
  chrome.runtime.sendMessage({type:'uninstall', id:id});
}

//TODO find a way to change the color when selected

// Add a new entry in the body for the extension provided
function makeNewElement (extension) {

  // Create enclosing div
  var enclosingdiv = document.createElement('div');
  $(enclosingdiv).css('padding-bottom', '10px');
  enclosingdiv.setAttribute('ext_id', extension.id);

  // Create icon image
  var icon = document.createElement('img');

  if (extension.icons)
    icon.src = extension.icons[0].url;

  icon.height = 16;
  icon.width = 16;
  $(icon).css("padding-right",5);

  // Create extension Name
  var p = document.createElement('p');
  $(p).addClass('enumerated');
  p.innerHTML = extension.name;

  // Create checkbox
  var checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');

  // Create deletebutton
  var deletebutton = document.createElement('img');
  deletebutton.src= 'delete.png';
  $(deletebutton).addClass('deleteButton');
  deletebutton.onclick = function(){
    uninstall($(this).parent().attr('ext_id'));
    reload();
  };

  // bind change to enable and disable
  $(checkbox).change(function() {
    enableDisable($(this).parent().attr('ext_id'), this.checked);
    var text = $(this).parent().find('p');
    text.toggleClass('disabled');
  });

  if (extension.enabled){
    checkbox.setAttribute('checked', true);
  }else{
    // p.setAttribute('style', 'color:#cccccc');
    $(p).addClass('disabled');
  }

  // Append all of the elements
  enclosingdiv.appendChild(icon);
  enclosingdiv.appendChild(checkbox);
  enclosingdiv.appendChild(p);
  enclosingdiv.appendChild(deletebutton);
  div.append(enclosingdiv);
}

function onResponse (response) {
  current = undefined;
  clearDiv();
  response.forEach(function(elem) {
    makeNewElement(elem);
  });
  chooseNextElement();
}

search.keyup(function(e) {
  var key = e.keyCode;
  if (key != 40 && key != 38 && key != 13){
  chrome.runtime.sendMessage({type:'search', value:search.val()}, onResponse);
}
else {
  if(key == 40)
    chooseNextElement();
  else if (key == 38)
    choosePrevElement();
  else if (key == 13)
    chooseCurrentElement();
}
});

search.focus(function() {
  reload();
});

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
  var ext_id = checkbox.attr('ext_id');

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
  var enclosingdiv = document.createElement('div');
  // $(enclosingdiv).addClass('enclosingDiv');
  $(enclosingdiv).css('padding-bottom', '10px');

  var p = document.createElement('p');
  $(p).addClass('enumerated');
  p.innerHTML = extension.name;

  var checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  // checkbox.setAttribute('style','display:inline');
  checkbox.setAttribute('ext_id', extension.id);

  var deletebutton = document.createElement('img');
  deletebutton.src= 'delete.png';
  $(deletebutton).addClass('deleteButton');
  //deletebutton.setAttribute('style','display:inline');
  deletebutton.onclick = function(){
    uninstall($(this).parent().find('input').attr('ext_id'));
    reload();
  };

  // bind change to enable and disable
  $(checkbox).change(function() {
    enableDisable($(this).attr('ext_id'), this.checked);
    var text = $(this).parent().find('p');
    text.toggleClass('disabled');
  });

  if (extension.enabled){
    checkbox.setAttribute('checked', true);
  }else{
    // p.setAttribute('style', 'color:#cccccc');
    $(p).addClass('disabled');
  }
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

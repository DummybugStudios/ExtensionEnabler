var search = $('#searchBar');
var div = $('#tempDiv');

function clearDiv(){
  div.empty();
}


function reload(){
  chrome.runtime.sendMessage({type:'search', value:''}, onResponse);
}
function enableDisable (id, value) {
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
  clearDiv();
  response.forEach(function(elem) {
    makeNewElement(elem);
  });
}

search.keyup(function() {
  chrome.runtime.sendMessage({type:'search', value:search.val()}, onResponse);
});

search.focus(reload);

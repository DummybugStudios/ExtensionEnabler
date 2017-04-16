search = $('#searchBar');
div = $('#tempDiv');

function clearDiv(){
  div.empty();
}


// Coming soon! As soon as I read futher into the API
function enableDisable (id, value) {
  chrome.runtime.sendMessage({type:'changeState', id:id, value:value});
}

//TODO find a way to change the color when selected

// Add a new entry in the body for the extension provided
function makeNewElement (extension) {
  enclosingdiv = document.createElement('div');
  p = document.createElement('p');
  p.innerHTML = extension.name;

  checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('style','float:left');
  checkbox.setAttribute('id', extension.id);

  // bind change to enable and disable
  $(checkbox).change(function(e) {
    enableDisable(this.id, this.checked);
    text = $(this).parent().find('p');
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
  div.append(enclosingdiv);
}

function onResponse (response) {
  clearDiv();
  response.forEach(function(elem) {
    makeNewElement(elem);
  });
}

search.keyup(function(e) {
  chrome.runtime.sendMessage({type:'search', value:search.val()}, onResponse);
});

search.focus(function(e){
  chrome.runtime.sendMessage({type:'search', value:''}, onResponse);
});


function matchTerm (term, all, callback){
  result = [];
  term = term.toLowerCase();
  all.forEach(function(elem) {
    name = elem.name.toLowerCase();
    description = elem.description.toLowerCase();
    if (name.indexOf(term) > -1 || description.indexOf(term) > -1)
      result.push(elem);
  });
  callback(result);
}

function enableDisable (id, value) {
  chrome.management.setEnabled(id, value);
}

function sendMessageBack (request, sender, respond) {
  switch(request.type){
    case 'search':
      term = request.value;

      //send all extensions to matchTerm
      chrome.management.getAll( function(args) {
        matchTerm(term, args, respond);
      });

      return true;

    case 'changeState':
      id = request.id;
      value = request.value;
      enableDisable(id, value);
      break;
  }
}

chrome.runtime.onMessage.addListener(sendMessageBack);

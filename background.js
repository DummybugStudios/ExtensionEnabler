
function matchTerm (term, all, callback){
  var result = [];
  term = term.toLowerCase();
  all.forEach(function(elem) {
    var name = elem.name.toLowerCase();
    var description = elem.description.toLowerCase();
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
      var term = request.value;

      //send all extensions to matchTerm
      chrome.management.getAll( function(args) {
        matchTerm(term, args, respond);
      });

      return true;

    case 'changeState':
      var id = request.id;
      var value = request.value;
      enableDisable(id, value);
      break;
  }
}

chrome.runtime.onMessage.addListener(sendMessageBack);

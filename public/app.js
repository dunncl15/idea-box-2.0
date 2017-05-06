
$(document).ready(() => {
  fetch('api/v1/folders')
  .then(response => response.json())
  .then(folders => renderFolders(folders));
});

const renderFolders = (folders) => {
  return folders.map(folder => appendFolders(folder))
}

const appendFolders = (folder) => {
  $('.idea-folders').append(`<button class="idea-folder">${folder.title}</button>`)
}

//Event Listeners

$('input[type="text"], textarea').on('keyup', function() {
  checkIdeaForm();
});


//Save Button Click Event

$('.save-btn').on('click', function(e) {
  e.preventDefault();
  getIdea();
  clearInputs();
});

//Upvote Click Event

$('.idea-section').on('click', '.upvote-btn', function() {
  var voteStatus = $(this).siblings('.quality-value').text();
  switch (voteStatus) {
    case 'swill':
      $(this).siblings('.quality-value').text('plausible');
      break;
    case 'plausible':
      $(this).siblings('.quality-value').text('genius');
      break;
  }

  var id = $(this).closest('.idea-container').attr('id');
  var storedObject = JSON.parse(localStorage.getItem(id));
  var currentQuality = $(this).siblings('.quality-value').text();
  storedObject.quality = currentQuality;
  sendToStorage(id, storedObject);
})

//Downvote Button Click Event

$('.idea-section').on('click', '.downvote-btn', function() {
  var voteStatus = $(this).siblings('.quality-value').text();
  switch (voteStatus) {
    case 'genius':
      $(this).siblings('.quality-value').text('plausible');
      break;
    case 'plausible':
      $(this).siblings('.quality-value').text('swill');
      break;
  }

  var id = $(this).closest('.idea-container').attr('id');
  var storedObject = JSON.parse(localStorage.getItem(id));
  var currentQuality = $(this).siblings('.quality-value').text();
  storedObject.quality = currentQuality;
  sendToStorage(id, storedObject);
})

//Delete Button Click Event

$('.idea-section').on('click', '.delete-btn', function() {
  $(this).parent('.idea-container').remove();
  var id = $(this).parent('.idea-container').attr('id');
  removeFromStorage(id);
})

//Blur Event

$('.idea-section').on('blur', '.idea-title, .idea-body', function() {
  var id = $(this).parent('.idea-container').attr('id');
  var storedObject = JSON.parse(localStorage.getItem(id));
  var currentTitle = $('.idea-title').val();
  var currentBody = $('.idea-body').val();
  storedObject.title = currentTitle;
  storedObject.body = currentBody;
  sendToStorage(id, storedObject);
})

//Search Field

$('.search-field').on('keyup', function() {
  var searchInput = $(this).val().toLowerCase();
  var ideaBoxes = $('.idea-container');

  ideaBoxes.each(function(i, ideaBox) {
    var ideaText = $(ideaBox).text().toLowerCase();
    var matchedIdea = ideaText.indexOf(searchInput) !== -1;
    $(ideaBox).toggle(matchedIdea);
  })
})

//Functions

function Idea(title, body) {
  this.title = title;
  this.body = body;
  this.quality = 'swill';
  this.id = Date.now();
}

function getIdea() {
  var ideaTitle = $('.user-title').val();
  var ideaBody = $('.user-body').val();
  var userIdea = new Idea(ideaTitle, ideaBody);
  addIdea(userIdea);
  sendToStorage(userIdea.id, userIdea);
}

function addIdea(idea) {
  $('.idea-section').prepend(`
  <div id="${idea.id}" class="idea-container">
   <textarea class="idea-title">${idea.title}</textarea>
   <textarea class="idea-body">${idea.body}</textarea>
   <button class="delete-btn"></button>
   <div class="vote-icon-wrap">
     <button class="upvote-btn"></button>
     <button class="downvote-btn"></button>
     <p class="quality">quality:</p>
     <p class="quality-value">${idea.quality}</p>
   </div>
  </div>`);
}

function sendToStorage(id, object) {
  localStorage.setItem(id, JSON.stringify(object));
}

function removeFromStorage(id) {
  localStorage.removeItem(id);
}

function clearInputs() {
  $('.user-title').val('');
  $('.user-body').val('');
  disableBtn();
}

function checkIdeaForm() {
  $('input[type="text"], textarea').each(function() {
    if ($(this).val() === '') {
      disableBtn();
    } else {
      enableBtn();
    }
  });
  return complete;
}

function enableBtn() {
  $('.save-btn').prop('disabled', false);
}

function disableBtn() {
  $('.save-btn').prop('disabled', true);
}

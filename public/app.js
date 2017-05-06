
$(document).ready(() => {
  getAllFolders();
  getAllIdeas();
});

$('.save-btn').on('click', function(e) {
  e.preventDefault();
  let $title = $('.user-title').val();
  let $body = $('.user-body').val();
  saveIdea($title, $body);
  clearInputs();
});

$('.idea-folder--all').on('click', () => {
  renderIdeas();
})

$('.ideas').on('click', '.delete-btn', function() {
  let id = ($(this).closest('.idea-container').attr('id'));
  deleteIdea(id)
})

const getAllFolders = () => {
  fetch('/api/v1/folders')
  .then(response => response.json())
  .then(folders => renderData(folders, append));
}

const getAllIdeas = () => {
  fetch('/api/v1/ideas')
  .then(response => response.json())
  .then(ideas => renderData(ideas, append));
}

const saveIdea = (title, body) => {
  fetch('/api/v1/ideas', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title: title, body: body, folder_id: 3 })
  })
  .then(response => renderIdeas())
  .catch(error => console.error('error: ', error))
}

const deleteIdea = (id) => {
  fetch(`/api/v1/ideas/${id}`, {
    method: 'DELETE'
  })
  .then(response => renderIdeas())
  .catch(error => console.error('error: ', error))
}

const renderData = (data, append) => {
  return data.map(data => append(data))
}

const append = (data) => {
  const { title, body, id } = data;
  if (body) {
    $('.ideas').append(`
    <div id="${id}" class="idea-container">
     <textarea class="idea-title">${title}</textarea>
     <textarea class="idea-body">${body}</textarea>
     <button class="delete-btn"></button>
     <div class="vote-icon-wrap">
       <button class="upvote-btn"></button>
       <button class="downvote-btn"></button>
       <p class="quality">quality:</p>
       <p class="quality-value">swill</p>
     </div>
    </div>`);
  } else {
    $('.idea-folders').append(`<button id="${id}" class="idea-folder">${title}</button>`)
  }
}

const renderIdeas = () => {
  $('.ideas').children().remove();
  getAllIdeas();
}

//Event Listeners

$('input[type="text"], textarea').on('keyup', function() {
  checkIdeaForm();
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
}

function enableBtn() {
  $('.save-btn').prop('disabled', false);
}

function disableBtn() {
  $('.save-btn').prop('disabled', true);
}

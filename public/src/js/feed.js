var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

const openCreatePostModal = () => {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(choiceResult.outcome);
      if(choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation.');
      } else {
        console.log('User added to home screen.');
      }
    });
    deferredPrompt = null;
  }

  // if('serviceWorker' in navigator) {
  //   console.log("In the SW unregister!");
  //   navigator.serviceWorker.getRegistrations().then((registrations) => {
  //     for(var i=0; i< registrations.length; i++) {
  //       registrations[i].unregister();
  //     }
  //   })
  // }
}

const closeCreatePostModal = () => {
  createPostArea.style.display = 'none';
}

// const onSaveButtonClicked = (event) => {
//   if('caches' in window) {
//     caches.open('user-requested').then((cache) => {
//       cache.add('https://httpbin.org/get');
//       cache.add('/src/images/sf-boat.jpg');
//     });
//   }
// } 

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

const createCard = () => {
  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  let cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  let cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = 'San Francisco Trip';
  cardTitle.appendChild(cardTitleTextElement);
  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'In San Francisco';
  cardSupportingText.style.textAlign = 'center';
  // let cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  // cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

const clearCards = () => {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}


let url = 'https://httpbin.org/get';
let networkDataReceived = false;

fetch(url).then(function(res) {
  return res.json();
}).then(function(data) {
  networkDataReceived = true;
  console.log('From web', data);
  clearCards();
  createCard();
});

if('caches' in window) {
  caches.match(url).then((response) => {
    if(response) {
      return response.json();
    }
  }).then((data) => {
    console.log('From cache', data);
    if(!networkDataReceived) {
      clearCards();
      createCard();
    }
  });
} 

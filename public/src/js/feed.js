var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

const url = 'https://pwagram-e92a4.firebaseio.com/posts.json';
let networkDataReceived = false;

const openCreatePostModal = () => {
  // createPostArea.style.display = 'block';
  // setTimeout(() => {
  createPostArea.style.transform = 'translateY(0)';
  // }, 1);
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
  createPostArea.style.transform = 'translateY(100vh)';
}

const createCard = (data) => {
  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  let cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("' + data.image + '")';
  cardTitle.style.backgroundSize = 'cover';
  cardWrapper.appendChild(cardTitle);
  let cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);
  // let cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

const clearCards = () => {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

const updateUI = (data) => {
  clearCards();
  for(var i=0; i<data.length; i++) {
    createCard(data[i]);
  }
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

fetch(url).then(function(res) {
  return res.json();
}).then(function(data) {
  networkDataReceived = true;
  console.log('From web', data);
  let dataArray = [];
  for(var key in data) {
    dataArray.push(data[key]);
  }
  updateUI(dataArray);
});

if('indexedDB' in window) {
  readAllData('posts').then((data) => {
    if(!networkDataReceived) {
      console.log('From cache', data);
      updateUI(data);
    }
  });
} 

// if('caches' in window) {
//   caches.match(url).then((response) => {
//     if(response) {
//       return response.json();
//     }
//   }).then((data) => {
//     console.log('From cache', data);
//     if(!networkDataReceived) {
//       let dataArray = [];
//       for(var key in data) {
//         dataArray.push(data[key]);
//       }
//       updateUI(dataArray);
//     }
//   });
// } 

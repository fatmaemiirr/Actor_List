const url = 'https://moviesdatabase.p.rapidapi.com/actors';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '27b69ba214msh5567206a6702962p157ac6jsnc1a2ca3732e3',
    'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com',
  },
};

let actors = [];
let currentActor = null;

// Başlangıç ekranından aktör listesi ekranına geçişi sağlar
function showActorList() {
  document.getElementById('initial-screen').classList.add('hidden');
  document.getElementById('actor-list-screen').classList.remove('hidden');
  fetchActors();
}

// Aktörleri çek ve listele
async function fetchActors() {
  const container = document.getElementById('actors-container');
  const loadingMessage = document.getElementById('loading-message');

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API Hatası: ${response.status}`);
    }

    const data = await response.json();
    actors = data.results.slice(0, 10);

    loadingMessage.style.display = 'none';

    if (actors.length > 0) {
      const keys = Object.keys(actors[0]);
      displayKeys(keys); // Anahtarları ekranda göster

      actors.forEach((actor) => {
        const actorCard = createActorCard(
          actor.primaryName || 'Bilinmeyen Aktör',
          actor.birthYear || 'Açıklama bulunamadı'
        );
        container.appendChild(actorCard);
      });
    } else {
      container.innerHTML = '<p>Hiç aktör bulunamadı.</p>';
    }
  } catch (error) {
    console.error('API hatası:', error);
    loadingMessage.textContent = 'Aktörler yüklenirken bir hata oluştu.';
  }
}

// JSON'daki anahtarları ekranda göster
function displayKeys(keys) {
  const jsonKeysDiv = document.getElementById('jsonKeys');
  jsonKeysDiv.innerHTML = `<strong>JSON Keys:</strong> ${keys.join(', ')}`;
}

// Aktör kartı oluştur
function createActorCard(name, description) {
  const actorCard = document.createElement('div');
  actorCard.className = 'actor-card';
  actorCard.innerHTML = `
    <h3>${name}</h3>
    <p>${description || 'Açıklama bulunamadı'}</p>
    <button onclick="showModal('${name}', '${description || ''}')">Düzenle</button>
    <button onclick="deleteActor(this)">Sil</button>
  `;
  return actorCard;
}

// Modal'ı aç
function showModal(name = '', description = '') {
  currentActor = name ? actors.find(actor => actor.primaryName === name) : null;
  const modal = document.getElementById('actor-modal');
  document.getElementById('actor-name').value = name;
  document.getElementById('actor-description').value = description;
  modal.classList.remove('hidden');

  // Kaydetme işlemine ekleme/düzenleme modu ekle
  const form = document.getElementById('actor-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const actorName = document.getElementById('actor-name').value.trim();
    const actorDescription = document.getElementById('actor-description').value.trim();

    if (currentActor) {
      // Düzenleme modu
      const existingCard = [...document.querySelectorAll('.actor-card')].find(
        (card) => card.querySelector('h3').textContent === currentActor.primaryName
      );
      if (existingCard) {
        existingCard.querySelector('h3').textContent = actorName;
        existingCard.querySelector('p').textContent = actorDescription || 'Açıklama bulunamadı';
        currentActor.primaryName = actorName;
        currentActor.birthYear = actorDescription;
      }
    } else {
      // Yeni aktör ekleme
      addActor(actorName, actorDescription);
    }

    closeModal();
  };
}

// Modal'ı kapat
function closeModal() {
  const modal = document.getElementById('actor-modal');
  modal.classList.add('hidden');
}

// Yeni aktör ekle
function addActor(name, description) {
  const newActor = {
    primaryName: name,
    birthYear: description,
  };
  actors.push(newActor);

  const container = document.getElementById('actors-container');
  const actorCard = createActorCard(name, description);
  container.appendChild(actorCard);
}

// Aktörü sil
function deleteActor(button) {
  const card = button.parentElement;
  const actorName = card.querySelector('h3').textContent;
  actors = actors.filter(actor => actor.primaryName !== actorName);
  card.remove();
}

// Sayfa yüklendiğinde aktörleri getir
fetchActors();

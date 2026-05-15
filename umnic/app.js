
const voiceBtn = document.getElementById('voiceCallBtn');
const voiceModal = document.getElementById('voiceModal');
const closeVoice = document.getElementById('closeVoice');
const micButton = document.getElementById('micButton');
const voiceStatus = document.getElementById('voiceStatus');
const voiceTranscript = document.getElementById('voiceTranscript');

let recognition;
let listening = false;

voiceBtn.onclick = () => {
  voiceModal.classList.remove('hidden');
};

closeVoice.onclick = () => {
  voiceModal.classList.add('hidden');
  speechSynthesis.cancel();
};

function initRecognition(){
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if(!SpeechRecognition){
    alert('Используй Chrome');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'ru-RU';

  recognition.onstart = () => {
    listening = true;
    voiceStatus.innerText = 'Слушаю...';
  };

  recognition.onend = () => {
    listening = false;
  };

  recognition.onresult = async (e) => {
    const text = e.results[0][0].transcript;

    voiceTranscript.innerText = 'Ты: ' + text;

    voiceStatus.innerText = 'Думаю...';

    const response = await fetch('/api/chat', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        message:text
      })
    });

    const data = await response.json();

    const answer = data.text || 'Ошибка ответа';

    voiceTranscript.innerText += '\n\nУмник: ' + answer;

    voiceStatus.innerText = 'Объясняю...';

    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.lang = 'ru-RU';

    utterance.onend = () => {
      voiceStatus.innerText = 'Готов помочь';
    };

    speechSynthesis.speak(utterance);
  };
}

micButton.onclick = () => {
  if(!recognition){
    initRecognition();
  }

  if(!listening){
    recognition.start();
  }
};

function paperclipIcon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.4 11.6 12 21a6 6 0 0 1-8.5-8.5l9.8-9.8a4 4 0 0 1 5.7 5.7l-9.9 9.9a2 2 0 0 1-2.8-2.8l9.2-9.2"/></svg>'}
function micIcon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/><path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>'}
function sendIcon(){return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21.7 12 3.4 3.6 5.1 10.3 13.5 12l-8.4 1.7-1.7 6.7Z"/></svg>'}
function gearIcon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 .9-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6.9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5.9Z"/></svg>'}


try{
  localStorage.removeItem('umnik_chats');
  localStorage.removeItem('umnik_active_chat');
  localStorage.removeItem('umnik_limits');
}catch(e){}




const defaultChats = ['Домашка','Таблица ×7','Русский'];
const suggestions = [
  'Что такое сказуемое?',
  'Как найти периметр?',
  'Объясни таблицу умножения',
  'Разбери фото задания',
  'Что такое дробь?',
  'Я устал, у меня не получится'
];

const state = {
  name:'',
  age:'',
  mode:'ai',
  plan:'free',
  activeChat:'Домашка',
  imageDataUrl:null,
  chats:{'Домашка':[{role:'bot', text:welcomeText('')}]},
  chatOrder:['Домашка'],
  limits:{messages:0,photos:0},
  editingTabs:false,
  isSending:false,
  tabDragMoved:false,
  sugDragMoved:false
};

const voiceState = {
  recognition:null,
  stopRecognition:null,
  listening:false,
  stopCommandListening:false,
  thinking:false,
  speaking:false,
  callOpen:false,
  autoListening:false,
  history:[],
  imageDataUrl:null,
  initialized:false
};

const PROFILE_KEY = 'umnik_student_profile_v1';
const MEMORY_KEY = 'umnik_learning_memory_v1';

const ACCOUNT_KEY = 'umnik_account_v1';
const SUBSCRIPTION_KEY = 'umnik_subscription_v1';
const VOICE_SETTINGS_KEY = 'umnik_voice_settings_v1';


function defaultProfile(){return {name:'',age:'',grade:'',hardSubject:'',hardTopics:'',explainStyle:'очень просто',goal:''}}
function defaultMemory(){return {totalQuestions:0,totalVoiceQuestions:0,totalPhotos:0,topics:{},difficult:{},recent:[],lastSummary:'',updatedAt:''}}
function defaultAccount(){return {loggedIn:false,email:'',createdAt:''}}
function defaultSubscription(){return {plan:'free',expiresAt:'',lastPaidAt:''}}
function defaultVoiceSettings(){return {rate:1.15,pitch:1.05}}
function loadJson(key,fallback){try{const raw=localStorage.getItem(key);return raw?Object.assign(fallback(),JSON.parse(raw)):fallback()}catch(e){return fallback()}}
function saveJson(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(e){}}

state.profile = loadJson(PROFILE_KEY, defaultProfile);
state.learningMemory = loadJson(MEMORY_KEY, defaultMemory);
state.account = loadJson(ACCOUNT_KEY, defaultAccount);
state.subscription = loadJson(SUBSCRIPTION_KEY, defaultSubscription);
state.voiceSettings = loadJson(VOICE_SETTINGS_KEY, defaultVoiceSettings);

if(state.subscription && state.subscription.plan === 'plus' && state.subscription.expiresAt){
  try{
    if(new Date(state.subscription.expiresAt).getTime() > Date.now()){
      state.plan = 'plus';
    }
  }catch(e){}
}

function saveProfile(){saveJson(PROFILE_KEY,state.profile)}
function saveMemory(){state.learningMemory.updatedAt=new Date().toISOString();saveJson(MEMORY_KEY,state.learningMemory)}

function saveAccount(){saveJson(ACCOUNT_KEY,state.account||defaultAccount())}
function saveSubscription(){saveJson(SUBSCRIPTION_KEY,state.subscription||defaultSubscription())}
function saveVoiceSettings(){saveJson(VOICE_SETTINGS_KEY,state.voiceSettings||defaultVoiceSettings())}

function hasActivePlus(){
  const sub = state.subscription || defaultSubscription();
  if(sub.plan !== 'plus' || !sub.expiresAt) return false;
  try{return new Date(sub.expiresAt).getTime() > Date.now()}catch(e){return false}
}

function getSubscriptionDaysLeft(){
  if(!hasActivePlus()) return 0;
  const end = new Date(state.subscription.expiresAt).getTime();
  const diff = end - Date.now();
  return Math.max(0, Math.ceil(diff / (1000*60*60*24)));
}

function syncPlanWithSubscription(){
  state.plan = hasActivePlus() ? 'plus' : 'free';
}

function extendSubscription(days=30){
  const now = Date.now();
  const currentEnd = hasActivePlus() ? new Date(state.subscription.expiresAt).getTime() : now;
  const nextEnd = new Date(Math.max(currentEnd, now) + days*24*60*60*1000);

  state.subscription = {
    plan:'plus',
    expiresAt:nextEnd.toISOString(),
    lastPaidAt:new Date().toISOString()
  };

  saveSubscription();
  state.plan = 'plus';
}

function renderAccountSubscription(){
  const accBox = document.getElementById('accountSummary');
  const subBox = document.getElementById('subscriptionSummary');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if(accBox){
    const acc = state.account || defaultAccount();
    accBox.textContent = acc.loggedIn
      ? `Вы вошли как ${acc.email || 'пользователь'}`
      : 'Вы пока не вошли. Для MVP вход сохраняется локально в браузере.';
  }

  if(loginBtn && logoutBtn){
    const logged = !!(state.account && state.account.loggedIn);
    loginBtn.style.display = logged ? 'none' : 'block';
    logoutBtn.style.display = logged ? 'block' : 'none';
  }

  if(subBox){
    const active = hasActivePlus();
    const days = getSubscriptionDaysLeft();

    subBox.innerHTML =
      `<div class="account-row"><span>Тариф</span><b>${active ? 'Умник Плюс' : 'Free'}</b></div>` +
      `<div class="account-row"><span>Статус</span><b>${active ? 'Активна' : 'Не активна'}</b></div>` +
      `<div class="account-row"><span>Осталось</span><b>${active ? `${days} дн.` : '0 дн.'}</b></div>` +
      `<div class="account-row"><span>Стоимость</span><b>349 ₽ / мес</b></div>`;
  }
}

function openProfileMenu(){
  const modal = document.getElementById('profileMenuModal');
  if(!modal) return;

  syncPlanWithSubscription();
  renderProfileSummary();
  renderMemorySummary();
  renderAccountSubscription();

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
}

function closeProfileMenu(){
  const modal = document.getElementById('profileMenuModal');
  if(modal){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
  }
}

function openProfileEditor(){
  closeProfileMenu();
  openProfileModal();
}

function loginAccount(){
  const email = prompt('Введи email для входа в MVP-аккаунт:', state.account?.email || '');
  if(email === null) return;

  const clean = email.trim() || 'demo@umnik.ai';

  state.account = {
    loggedIn:true,
    email:clean,
    createdAt:state.account?.createdAt || new Date().toISOString()
  };

  saveAccount();
  renderAccountSubscription();
}

function logoutAccount(){
  state.account = defaultAccount();
  saveAccount();
  renderAccountSubscription();
}

function paySubscription(){
  extendSubscription(30);
  normalizeChatsForPlan();
  render();
  renderAccountSubscription();
  updateVoiceButtonVisibility();
  alert('MVP: подписка Умник Плюс активирована на 30 дней.');
}

function syncProfileToWelcome(){const n=document.getElementById('nameInput');const a=document.getElementById('ageInput');if(n&&state.profile.name&&!n.value)n.value=state.profile.name;if(a&&state.profile.age&&!a.value)a.value=state.profile.age}
function updateProfileFromWelcome(name,age){state.profile.name=name||state.profile.name||'';state.profile.age=age||state.profile.age||'';saveProfile()}
function profileForApi(){return {name:state.profile.name||state.name||'',age:state.profile.age||state.age||'',grade:state.profile.grade||'',hardSubject:state.profile.hardSubject||'',hardTopics:state.profile.hardTopics||'',explainStyle:state.profile.explainStyle||'очень просто',goal:state.profile.goal||''}}
function memoryForApi(){const m=state.learningMemory||defaultMemory();return {totalQuestions:m.totalQuestions||0,totalVoiceQuestions:m.totalVoiceQuestions||0,totalPhotos:m.totalPhotos||0,topics:m.topics||{},difficult:m.difficult||{},recent:(m.recent||[]).slice(-6),lastSummary:m.lastSummary||''}}
function detectLearningTopic(text){const q=String(text||'').toLowerCase();const pairs=[['дроби',['дроб','числител','знаменател']],['таблица умножения',['умнож','таблиц','произвед']],['уравнения',['уравнен','икс',' x ','x+','x -','найти x']],['периметр',['периметр']],['площадь',['площад']],['сказуемое',['сказуем']],['подлежащее',['подлежа']],['части речи',['часть речи','существительн','прилагательн','глагол']],['орфография',['проверочное слово','безударн','буква','орфограмм']],['текстовая задача',['задача','условие','решение']]];for(const [topic,words] of pairs){if(words.some(w=>q.includes(w)))return topic}return 'общий вопрос'}
function bumpMap(map,key){if(key)map[key]=(map[key]||0)+1}
function topKeys(obj,limit=3){return Object.entries(obj||{}).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([k,v])=>`${k} (${v})`)}
function buildMemorySummary(memory){const top=topKeys(memory.topics,3);const hard=topKeys(memory.difficult,3);const parts=[`Всего вопросов: ${memory.totalQuestions||0}`];if(memory.totalVoiceQuestions)parts.push(`Голосом: ${memory.totalVoiceQuestions}`);if(memory.totalPhotos)parts.push(`Фото: ${memory.totalPhotos}`);if(top.length)parts.push(`Чаще всего: ${top.join(', ')}`);if(hard.length)parts.push(`Сложные темы: ${hard.join(', ')}`);return parts.join('\n')||'Пока памяти мало: задай несколько вопросов, и Умник начнёт подстраиваться.'}
function updateLearningMemory(userText,answerText,source='chat',hadPhoto=false){const m=state.learningMemory||defaultMemory();const topic=detectLearningTopic(userText+' '+answerText);m.totalQuestions=(m.totalQuestions||0)+1;if(source==='voice')m.totalVoiceQuestions=(m.totalVoiceQuestions||0)+1;if(hadPhoto)m.totalPhotos=(m.totalPhotos||0)+1;m.topics=m.topics||{};m.difficult=m.difficult||{};m.recent=m.recent||[];bumpMap(m.topics,topic);const hard=String(userText||'').toLowerCase();if(hard.includes('не понял')||hard.includes('не понимаю')||hard.includes('не получается')||hard.includes('устал')||hard.includes('сложно')||hard.includes('ошибка'))bumpMap(m.difficult,topic);m.recent.push({source,topic,question:String(userText||'').slice(0,180),answer:String(answerText||'').slice(0,220),at:new Date().toISOString()});if(m.recent.length>10)m.recent=m.recent.slice(-10);m.lastSummary=buildMemorySummary(m);state.learningMemory=m;saveMemory();renderSettings()}
function renderProfileSummary(){const box=document.getElementById('profileSummary');if(!box)return;const p=profileForApi();const items=[['Имя',p.name||'не указано'],['Возраст',p.age||'не указан'],['Класс',p.grade?`${p.grade} класс`:'не выбран'],['Сложнее всего',p.hardSubject||'не выбрано'],['Стиль',p.explainStyle||'очень просто'],['Темы',p.hardTopics||'пока не указаны']];box.innerHTML=items.map(([l,v])=>`<div class="profile-pill"><b>${l}</b>${v}</div>`).join('')}
function renderMemorySummary(){const box=document.getElementById('memorySummary');if(box)box.textContent=state.learningMemory.lastSummary||buildMemorySummary(state.learningMemory||defaultMemory())}
function openProfileModal(){const p=profileForApi();document.getElementById('profileName').value=p.name||'';document.getElementById('profileAge').value=p.age||'';document.getElementById('profileGrade').value=p.grade||'';document.getElementById('profileHardSubject').value=p.hardSubject||'';document.getElementById('profileHardTopics').value=p.hardTopics||'';document.getElementById('profileExplainStyle').value=p.explainStyle||'очень просто';document.getElementById('profileGoal').value=p.goal||'';const modal=document.getElementById('profileModal');modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false')}
function closeProfileModal(){const modal=document.getElementById('profileModal');modal.classList.add('hidden');modal.setAttribute('aria-hidden','true')}
function saveProfileFromModal(){state.profile={name:document.getElementById('profileName').value.trim(),age:document.getElementById('profileAge').value.trim(),grade:document.getElementById('profileGrade').value,hardSubject:document.getElementById('profileHardSubject').value,hardTopics:document.getElementById('profileHardTopics').value.trim(),explainStyle:document.getElementById('profileExplainStyle').value,goal:document.getElementById('profileGoal').value.trim()};state.name=state.profile.name||state.name;state.age=state.profile.age||state.age;saveProfile();closeProfileModal();renderSettings();addMessage('bot','Профиль сохранён. Теперь я буду учитывать класс, сложные темы и стиль объяснения.');setFox('happy');render()}
function showFullMemory(){const m=state.learningMemory||defaultMemory();const recent=(m.recent||[]).slice(-5).map((r,i)=>`${i+1}. ${r.topic}: ${r.question}`).join('\n');alert('Память Умника:\n\n'+buildMemorySummary(m)+(recent?'\n\nПоследние вопросы:\n'+recent:''))}
function clearLearningMemory(){if(!confirm('Очистить память Умника на этом устройстве?'))return;state.learningMemory=defaultMemory();saveMemory();renderSettings();addMessage('bot','Память очищена. Начнём заново 🙂');setFox('welcome');render()}


let currentEmotion = 'welcome';

function welcomeText(name){
  const cleanName = String(name || '').trim();
  const hello = cleanName ? `Привет, ${cleanName}!` : 'Привет!';
  return `${hello} Я Умник. Напиши школьный вопрос или прикрепи фото задания — разберём вместе.`;
}

function ensureChat(n){
  if(!state.chats[n]) state.chats[n] = [{role:'bot', text:welcomeText(state.name)}];
  if(!state.chatOrder.includes(n)) state.chatOrder.push(n);
}

function normalizeChatsForPlan(){
  if(state.plan === 'free'){
    ensureChat('Домашка');
    state.chats = {'Домашка': state.chats['Домашка'] || [{role:'bot', text:welcomeText(state.name)}]};
    state.chatOrder = ['Домашка'];
    state.activeChat = 'Домашка';
    state.editingTabs = false;
    return;
  }

  if(!state.chatOrder.length){
    state.chatOrder = ['Домашка'];
    ensureChat('Домашка');
  }

  if(!state.chatOrder.includes(state.activeChat)){
    state.activeChat = state.chatOrder[0] || 'Домашка';
  }
}

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  renderTop(id);
  updateVoiceButtonVisibility();
}

function renderTop(id){
  const top = document.getElementById('topBar');
  if(id === 'welcome'){
    top.className = 'top welcome-top';
    top.innerHTML = '<img class="logo" src="/assets/logo.png" alt="Умник">';
  }else{
    top.className = 'top';
    top.innerHTML =
      '<img id="headerFox" class="header-fox" src="/assets/umnik_welcome.png" alt="Умник">' +
      '<img class="logo" src="/assets/logo.png" alt="Умник">' +
      '<div class="top-actions">' +
        '<button id="voiceCallBtn" class="voice-call-btn" type="button" onclick="openVoiceCall()" aria-label="Позвонить Умнику">📞</button>' +
        '<button id="profileMenuBtn" class="profile-menu-btn" type="button" onclick="openProfileMenu()" aria-label="Профиль ученика">👤</button>' +
        '<button class="gear-btn" onclick="openSettings()" aria-label="Настройки">' + gearIcon() + '</button>' +
      '</div>';
    setFox(currentEmotion || 'welcome');
  }
}

function startApp(){
  try{
    const nameEl = document.getElementById('nameInput');
    const ageEl = document.getElementById('ageInput');
    const error = document.getElementById('welcomeError');
    const saved = loadJson(PROFILE_KEY, defaultProfile);
    const name = (nameEl && nameEl.value ? nameEl.value.trim() : '') || saved.name || 'друг';
    const age = (ageEl && ageEl.value ? ageEl.value.trim() : '') || saved.age || '8';
    if(error) error.textContent = '';
    state.name = name;
    state.age = age;
    updateProfileFromWelcome(name, age);
    state.plan = 'free';
    state.mode = 'ai';
    resetEveryOpen(false);
    show('chatScreen');
    render();
  }catch(err){
    console.error('startApp error', err);
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    const chat = document.getElementById('chatScreen');
    if(chat) chat.classList.add('active');
  }
}

function openSettings(){
  show('settings');
  renderSettings();
}

function openChat(){
  show('chatScreen');
  render();
}

function setMode(m){
  state.mode = m;
  if(m !== 'ai'){
    closeVoiceCall();
  }
  renderSettings();
  render();
  updateVoiceButtonVisibility();
}

function setPlan(p){
  const wasFree = state.plan === 'free';

  if(p === 'plus'){
    extendSubscription(30);
  }

  if(p === 'free'){
    state.subscription = defaultSubscription();
    saveSubscription();
  }

  state.plan = p;

  if(p === 'plus' && wasFree){
    defaultChats.forEach(name => {
      if(!state.chats[name]){
        state.chats[name] = [{role:'bot', text:welcomeText(state.name)}];
      }
      if(!state.chatOrder.includes(name)){
        state.chatOrder.push(name);
      }
    });
  }

  if(p === 'free'){
    closeVoiceCall();
  }

  normalizeChatsForPlan();
  renderSettings();
  render();
  updateVoiceButtonVisibility();
}

function toggleEditTabs(){
  if(state.plan === 'free') return;
  state.editingTabs = !state.editingTabs;
  renderTabs();
}

function uniqueName(base){
  let root = (base || 'Новый чат').trim() || 'Новый чат';
  let n = root;
  let i = 2;
  while(state.chats[n]){
    n = root + ' ' + i;
    i++;
  }
  return n;
}

function newChat(){
  if(state.plan === 'free'){
    addMessage('bot','В Free-версии доступен только один чат. Создание отдельных чатов относится к Умник Плюс.');
    render();
    return;
  }

  const raw = prompt('Название нового чата:','Новый чат');
  if(raw === null) return;

  const n = uniqueName(raw);
  state.activeChat = n;
  state.chats[n] = [{role:'bot', text:'Новый чат создан. Что будем разбирать?'}];
  state.chatOrder.push(n);
  state.editingTabs = false;
  openChat();
}

function deleteChat(n){
  if(state.plan === 'free') return;
  if(state.chatOrder.length <= 1) return;

  delete state.chats[n];
  state.chatOrder = state.chatOrder.filter(x => x !== n);

  if(state.activeChat === n){
    state.activeChat = state.chatOrder[0] || 'Домашка';
  }

  render();
}

function moveChat(n, dir){
  if(state.plan === 'free') return;

  const i = state.chatOrder.indexOf(n);
  const j = i + dir;

  if(i < 0 || j < 0 || j >= state.chatOrder.length) return;

  [state.chatOrder[i], state.chatOrder[j]] = [state.chatOrder[j], state.chatOrder[i]];
  renderTabs();
}

function renderSettings(){
  const ai = document.getElementById('modeAi');
  const demo = document.getElementById('modeDemo');
  const free = document.getElementById('planFree');
  const plus = document.getElementById('planPlus');

  if(!ai) return;

  ai.classList.toggle('active', state.mode === 'ai');
  demo.classList.toggle('active', state.mode === 'demo');
  free.classList.toggle('active', state.plan === 'free');
  plus.classList.toggle('active', state.plan === 'plus');
  try{renderProfileSummary()}catch(e){}
  try{renderMemorySummary()}catch(e){}
  try{renderAccountSubscription()}catch(e){}
}

function renderTabs(){
  normalizeChatsForPlan();

  const row = document.getElementById('tabsRow');
  const tabs = document.getElementById('chatTabs');
  const editBtn = document.getElementById('editTabsBtn');
  const newBtn = document.querySelector('.new-tab');

  if(!tabs || !row || !editBtn || !newBtn) return;

  const isFree = state.plan === 'free';
  row.classList.toggle('editing', state.editingTabs && !isFree);

  editBtn.textContent = state.editingTabs ? '✓' : '✎';
  editBtn.style.display = isFree ? 'none' : 'block';

  newBtn.style.display = (!isFree && state.editingTabs) ? 'block' : 'none';

  tabs.innerHTML = '';

  state.chatOrder.forEach(n => {
    ensureChat(n);

    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab ' + (n === state.activeChat ? 'active' : '');

    const label = document.createElement('span');
    label.textContent = n;
    b.appendChild(label);

    if(state.editingTabs && !isFree){
      const controls = document.createElement('span');
      controls.className = 'tab-controls';

      const left = document.createElement('button');
      left.type = 'button';
      left.className = 'tab-control';
      left.textContent = '‹';
      left.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveChat(n,-1);
      };

      const right = document.createElement('button');
      right.type = 'button';
      right.className = 'tab-control';
      right.textContent = '›';
      right.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveChat(n,1);
      };

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'tab-control';
      del.textContent = '×';
      del.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteChat(n);
      };

      controls.appendChild(left);
      controls.appendChild(right);
      controls.appendChild(del);
      b.appendChild(controls);
    }

    b.onclick = () => {
      if(isFree) return;
      if(state.editingTabs) return;
      if(state.tabDragMoved) return;
      state.activeChat = n;
      render();
    };

    tabs.appendChild(b);
  });
}

function render(){
  normalizeChatsForPlan();
  renderTabs();
  renderSettings();

  const chat = document.getElementById('chat');
  if(!chat) return;

  chat.innerHTML = '';

  state.chats[state.activeChat].forEach(m => {
    const d = document.createElement('div');
    d.className = 'bubble ' + (m.role === 'user' ? 'user' : 'bot');
    d.textContent = m.text;
    chat.appendChild(d);
  });

  if(state.isSending){
    const d = document.createElement('div');
    d.className = 'bubble bot';
    d.textContent = 'Умник думает...';
    chat.appendChild(d);
  }

  chat.scrollTop = chat.scrollHeight;

  document.getElementById('limitsText').textContent = state.plan === 'free'
    ? 'Free: 1 чат, 10 сообщений и 3 фото в день'
    : 'Умник Плюс: безлимитные сообщения, фото, голос, созвон и сохранённые чаты';

  document.getElementById('modeNote').textContent = state.mode === 'ai'
    ? 'AI-режим: запрос отправляется в модель'
    : 'Демо-режим: ответы из заготовленной базы';

  const sendBtn = document.getElementById('sendBtn');
  if(sendBtn) sendBtn.disabled = state.isSending;

  renderSuggestions();
  updateVoiceButtonVisibility();
}

function renderSuggestions(){
  const sug = document.getElementById('suggestions');
  if(!sug) return;

  sug.innerHTML = '';

  suggestions.forEach(s => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = s;
    b.disabled = state.isSending;

    b.addEventListener('click', (e) => {
      if(state.isSending) return;
      if(state.sugDragMoved){
        e.preventDefault();
        return;
      }
      document.getElementById('input').value = s;
      send();
    });

    sug.appendChild(b);
  });
}

function setFox(e){
  currentEmotion = e;

  const map = {
    thinking:'/assets/umnik_thinking.png',
    explain:'/assets/umnik_explain.png',
    happy:'/assets/umnik_happy.png',
    idea:'/assets/umnik_idea.png',
    support:'/assets/umnik_welcome.png',
    confused:'/assets/umnik_confused.png',
    safe_stop:'/assets/umnik_explain.png',
    welcome:'/assets/umnik_welcome.png'
  };

  const img = document.getElementById('headerFox');
  if(img){
    img.src = map[e] || map.welcome;
    img.className = 'header-fox ' + (e === 'thinking' ? 'thinking' : '');
  }

  const voiceImg = document.getElementById('voiceUmnik');
  if(voiceImg && map[e]){
    voiceImg.src = map[e];
  }
}

function addMessage(role,text){
  ensureChat(state.activeChat);
  state.chats[state.activeChat].push({role,text});
}

function canUse(){
  if(state.plan === 'plus') return true;

  if(state.limits.messages >= 10){
    addMessage('bot','В Free-версии закончились 10 сообщений на сегодня. В презентации это место для перехода на Умник Плюс.');
    render();
    return false;
  }

  return true;
}

function demoAnswer(message) {
  const q = String(message || '').toLowerCase();

  if(q.includes('сказуем')) return { emotion:'explain', text:'Сказуемое — это главный член предложения, который показывает, что делает предмет. Например: «Мальчик читает». Что делает? Читает — это сказуемое.' };
  if(q.includes('периметр')) return { emotion:'explain', text:'Периметр — это сумма длин всех сторон фигуры. Чтобы найти периметр, нужно сложить все стороны. У прямоугольника можно так: P = 2 × (длина + ширина).' };
  if(q.includes('дроб')) return { emotion:'happy', text:'Дробь — это часть целого. Например, если пиццу разделили на 4 равные части и взяли 1 кусок, это 1/4.' };
  if(q.includes('устал')) return { emotion:'support', text:'Понимаю. Давай сделаем один маленький шаг: напиши первое задание, и я помогу разобрать его спокойно.' };
  if(q.includes('фото')) return { emotion:'idea', text:'Фото принято. В полной версии я распознаю задание на фото и объясню решение текстом.' };

  return { emotion:'explain', text:'Я понял вопрос. Давай разберём его простыми шагами: сначала выделим главное, потом решим пример.' };
}

async function send(){
  if(state.isSending) return;

  const input = document.getElementById('input');
  const text = input.value.trim();
  const hadPhoto = !!state.imageDataUrl;

  if(!text && !state.imageDataUrl) return;
  if(!canUse()) return;

  state.isSending = true;
  state.limits.messages++;
  addMessage('user', text || 'Я прикрепил фото задания.');
  input.value = '';
  setFox('thinking');
  render();

  try{
    let data;

    if(state.mode === 'demo'){
      await new Promise(r => setTimeout(r, 700));
      data = demoAnswer(text);
    }else{
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          message:text,
          age:state.age,
          chatTitle:state.activeChat,
          imageDataUrl:state.imageDataUrl,
          profile:profileForApi(),
          memory:memoryForApi(),
          mode:state.mode
        })
      });

      data = await res.json();
      if(!res.ok) throw new Error(data?.error || 'AI error');
    }

    state.imageDataUrl = null;
    const preview = document.getElementById('photoPreview');
    if(preview) preview.style.display = 'none';

    const answerText = data.text || 'Ответ пустой. Попробуй ещё раз.';
    addMessage('bot', answerText);
    updateLearningMemory(text || 'Фото задания', answerText, 'chat', hadPhoto);
    setFox(data.emotion || 'explain');
  }catch(e){
    const fallback = demoAnswer(text);
    const fallbackText = 'AI сейчас не ответил. Показываю демо-ответ:\n\n' + fallback.text;
    addMessage('bot', fallbackText);
    updateLearningMemory(text || 'Фото задания', fallbackText, 'chat', hadPhoto);
    setFox('confused');
  }finally{
    state.isSending = false;
    render();
  }
}

function handleKey(e){
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    send();
  }
}

function pickPhoto(){
  if(state.isSending) return;

  if(state.plan === 'free' && state.limits.photos >= 3){
    addMessage('bot','В Free-версии закончились 3 фото на сегодня. В Plus фото-разбор будет расширенным.');
    render();
    return;
  }

  document.getElementById('fileInput').click();
}

function handlePhoto(e){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => compressImage(reader.result, (small) => {
    state.imageDataUrl = small;
    state.limits.photos++;
    const img = document.getElementById('photoPreview');
    img.src = small;
    img.style.display = 'block';
    render();
  });

  reader.readAsDataURL(file);
}

function compressImage(dataUrl, cb){
  const img = new Image();

  img.onload = () => {
    const c = document.createElement('canvas');
    const max = 1000;
    let w = img.width, h = img.height;

    if(w > h && w > max){
      h = Math.round(h * max / w);
      w = max;
    }else if(h > max){
      w = Math.round(w * max / h);
      h = max;
    }

    c.width = w;
    c.height = h;
    c.getContext('2d').drawImage(img,0,0,w,h);
    cb(c.toDataURL('image/jpeg',0.75));
  };

  img.src = dataUrl;
}

function voiceInput(){
  if(state.isSending) return;

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  if(!SR){
    addMessage('bot','Голосовой ввод не поддерживается в этом браузере. Попробуй Google Chrome.');
    render();
    return;
  }

  const rec = new SR();
  rec.lang = 'ru-RU';
  rec.onresult = e => {
    document.getElementById('input').value = e.results[0][0].transcript;
  };
  rec.start();
}

function enableDragScroll(el, key){
  if(!el || el.dataset.dragReady === '1') return;
  el.dataset.dragReady = '1';

  let down = false;
  let startX = 0;
  let scrollLeft = 0;
  let moved = false;
  let downTarget = null;

  el.addEventListener('pointerdown', e => {
    if(e.target.closest('.tab-control,.edit-tabs,.new-tab')) return;

    down = true;
    moved = false;
    downTarget = e.target;
    state[key] = false;
    startX = e.clientX;
    scrollLeft = el.scrollLeft;
    el.classList.add('dragging');
  });

  el.addEventListener('pointermove', e => {
    if(!down) return;

    const dx = e.clientX - startX;

    if(Math.abs(dx) > 8){
      moved = true;
      state[key] = true;
      el.scrollLeft = scrollLeft - dx;
    }
  });

  function finish(){
    if(!down) return;

    const wasMoved = moved;
    down = false;
    moved = false;
    el.classList.remove('dragging');

    if(wasMoved){
      state[key] = true;
      setTimeout(() => { state[key] = false; }, 120);
      return;
    }

    state[key] = false;

    if(key === 'sugDragMoved'){
      const button = downTarget && downTarget.closest && downTarget.closest('button');
      if(button && el.contains(button) && !button.disabled){
        const text = button.textContent.trim();
        if(text){
          document.getElementById('input').value = text;
          send();
        }
      }
    }
  }

  el.addEventListener('pointerup', finish);
  el.addEventListener('pointercancel', () => {
    down = false;
    moved = false;
    state[key] = false;
    el.classList.remove('dragging');
  });
  el.addEventListener('pointerleave', () => {
    if(down && key !== 'sugDragMoved') finish();
  });
}


/* -------------------- VOICE CALL MODE -------------------- */

function updateVoiceButtonVisibility(){
  const btn = document.getElementById('voiceCallBtn');
  if(!btn) return;

  const chatOpen = document.getElementById('chatScreen')?.classList.contains('active');
  const canVoice = chatOpen && state.plan === 'plus' && state.mode === 'ai';

  btn.classList.toggle('visible', !!canVoice);
}

function isVoiceModalOpen(){
  const modal = document.getElementById('voiceModal');
  return !!modal && !modal.classList.contains('hidden');
}

function setVoiceStatus(text){
  const status = document.getElementById('voiceStatus');
  if(status) status.textContent = text;
}

function appendVoiceLine(role, text){
  const box = document.getElementById('voiceTranscript');
  if(!box) return;

  const line = document.createElement('div');
  line.className = 'voice-line ' + (role === 'user' ? 'user' : 'bot');
  line.textContent = (role === 'user' ? 'Ты: ' : 'Умник: ') + text;

  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

function appendVoicePhoto(dataUrl){
  const box = document.getElementById('voiceTranscript');
  if(!box || !dataUrl) return;

  const card = document.createElement('div');
  card.className = 'voice-photo-card';

  const img = document.createElement('img');
  img.src = dataUrl;
  img.alt = 'Фото задания';

  const caption = document.createElement('div');
  caption.className = 'voice-photo-caption';
  caption.textContent = 'Фото задания добавлено в звонок';

  card.appendChild(img);
  card.appendChild(caption);
  box.appendChild(card);
  box.scrollTop = box.scrollHeight;
}

function clearVoiceTranscript(){
  const box = document.getElementById('voiceTranscript');
  if(box) box.innerHTML = '';
}

function openVoiceCall(){
  if(state.plan !== 'plus'){
    addMessage('bot','Созвон с Умником доступен только в Умник Плюс.');
    render();
    return;
  }

  if(state.mode !== 'ai'){
    addMessage('bot','Созвон работает только в AI-режиме. Переключи режим ответа на AI в настройках.');
    render();
    return;
  }

  const modal = document.getElementById('voiceModal');
  if(!modal) return;

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');

  voiceState.callOpen = true;
  voiceState.autoListening = true;
  voiceState.thinking = false;
  voiceState.speaking = false;

  initVoiceEvents();
  updateVoiceSpeedUI();

  if(!voiceState.history.length){
    clearVoiceTranscript();
    appendVoiceLine('bot', `Привет${state.name ? `, ${state.name}` : ''}! Я на связи. Можешь просто говорить — я буду слушать автоматически.`);
  }

  if(voiceState.imageDataUrl){
    appendVoiceLine('bot','Фото задания уже в звонке. Можешь спросить голосом, что именно непонятно.');
  }

  setVoiceStatus('Запускаю микрофон...');
  updateVoiceControlButton();
  setTimeout(startVoiceRecognition, 250);
}

function closeVoiceCall(){
  const modal = document.getElementById('voiceModal');

  voiceState.callOpen = false;
  voiceState.autoListening = false;
  voiceState.thinking = false;
  voiceState.speaking = false;

  if(modal){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
  }

  stopVoiceRecognition();
  stopVoiceStopCommandListener();
  speechSynthesis.cancel();

  const mic = document.getElementById('micButton');
  if(mic){
    mic.classList.remove('listening');
    mic.disabled = false;
  }

  const voiceImg = document.getElementById('voiceUmnik');
  if(voiceImg){
    voiceImg.classList.remove('speaking');
  }

  updateVoiceControlButton();
}

function initVoiceEvents(){
  if(voiceState.initialized) return;
  voiceState.initialized = true;

  const close = document.getElementById('closeVoice');
  const mic = document.getElementById('micButton');
  const photo = document.getElementById('voicePhotoBtn');
  const restart = document.getElementById('voiceRestartBtn');

  if(close) close.onclick = closeVoiceCall;
  if(mic) mic.onclick = handleVoiceControlButton;
  if(restart) restart.onclick = handleVoiceControlButton;
  if(photo) photo.onclick = openVoicePhotoPicker;

  updateVoiceControlButton();
}

function updateVoiceControlButton(){
  const restart = document.getElementById('voiceRestartBtn');
  const mic = document.getElementById('micButton');

  if(!restart) return;

  restart.classList.remove('stop','wait');

  if(voiceState.speaking){
    restart.textContent = '⏹ Остановить ответ';
    restart.classList.add('stop');
    if(mic) mic.textContent = '⏹';
    return;
  }

  if(voiceState.thinking){
    restart.textContent = '⏳ Умник думает';
    restart.classList.add('wait');
    if(mic) mic.textContent = '⏳';
    return;
  }

  if(voiceState.listening){
    restart.textContent = '⏹ Завершить фразу';
    restart.classList.add('stop');
    if(mic) mic.textContent = '⏹';
    return;
  }

  restart.textContent = '🎙️ Продолжить';
  if(mic) mic.textContent = '🎙️';
}

function handleVoiceControlButton(){
  if(voiceState.speaking){
    stopUmnikSpeakingAndContinue();
    return;
  }

  if(voiceState.thinking){
    setVoiceStatus('Умник уже думает. Подожди ответ или закрой звонок.');
    updateVoiceControlButton();
    return;
  }

  if(voiceState.listening){
    voiceState.autoListening = false;
    stopVoiceRecognition();
    setVoiceStatus('Диктовка остановлена. Нажми «Продолжить», чтобы говорить дальше.');
    updateVoiceControlButton();
    return;
  }

  voiceState.autoListening = true;
  setVoiceStatus('Слушаю...');
  updateVoiceControlButton();
  startVoiceRecognition();
}

function stopVoiceRecognition(){
  try{
    if(voiceState.recognition && voiceState.listening){
      voiceState.recognition.stop();
    }
  }catch(e){}

  voiceState.listening = false;

  const mic = document.getElementById('micButton');
  if(mic) mic.classList.remove('listening');

  updateVoiceControlButton();
}

function canVoiceListenNow(){
  return voiceState.callOpen &&
    voiceState.autoListening &&
    !voiceState.thinking &&
    !voiceState.speaking &&
    isVoiceModalOpen();
}

function startVoiceRecognition(){
  if(!canVoiceListenNow()) return;

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const mic = document.getElementById('micButton');

  if(!SR){
    setVoiceStatus('Голосовой режим лучше всего работает в Google Chrome.');
    alert('Используй Google Chrome и разреши доступ к микрофону.');
    return;
  }

  if(!voiceState.recognition){
    voiceState.recognition = new SR();
    voiceState.recognition.lang = 'ru-RU';
    voiceState.recognition.interimResults = false;
    voiceState.recognition.continuous = false;

    voiceState.recognition.onstart = () => {
      voiceState.listening = true;
      if(mic) mic.classList.add('listening');
      setVoiceStatus('Слушаю...');
      setFox('thinking');
      updateVoiceControlButton();
    };

    voiceState.recognition.onend = () => {
      voiceState.listening = false;
      if(mic) mic.classList.remove('listening');
      updateVoiceControlButton();

      if(canVoiceListenNow()){
        setVoiceStatus('Слушаю...');
        setTimeout(startVoiceRecognition, 520);
      }else if(voiceState.callOpen && !voiceState.thinking && !voiceState.speaking){
        setVoiceStatus('Готов помочь');
      }
    };

    voiceState.recognition.onerror = (event) => {
      voiceState.listening = false;
      if(mic) mic.classList.remove('listening');
      updateVoiceControlButton();

      const err = event && event.error ? event.error : '';

      if(err === 'not-allowed' || err === 'service-not-allowed'){
        voiceState.autoListening = false;
        setVoiceStatus('Разреши доступ к микрофону в браузере.');
        return;
      }

      if(canVoiceListenNow()){
        setVoiceStatus('Слушаю...');
        setTimeout(startVoiceRecognition, 850);
      }else{
        setVoiceStatus('Не услышал вопрос. Нажми «Продолжить».');
      }
    };

    voiceState.recognition.onresult = async (event) => {
      if(voiceState.thinking || voiceState.speaking) return;

      const text = event.results?.[0]?.[0]?.transcript || '';
      if(!text.trim()) return;

      await handleVoiceQuestion(text.trim());
    };
  }

  try{
    if(!voiceState.listening && canVoiceListenNow()){
      speechSynthesis.cancel();
      voiceState.recognition.start();
    }
  }catch(e){
    setVoiceStatus('Микрофон запускается...');
  }
}

function openVoicePhotoPicker(){
  if(!voiceState.callOpen) return;

  voiceState.autoListening = false;
  stopVoiceRecognition();

  const input = document.getElementById('voicePhotoInput');
  if(input){
    input.value = '';
    input.click();
  }

  setVoiceStatus('Добавь фото задания');
  updateVoiceControlButton();
}

function handleVoicePhoto(event){
  const file = event.target.files && event.target.files[0];

  if(!file){
    voiceState.autoListening = true;
    setTimeout(startVoiceRecognition, 400);
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    compressImage(reader.result, (small) => {
      voiceState.imageDataUrl = small;
      appendVoicePhoto(small);

      voiceState.history.push({
        role:'user',
        content:'Я добавил фото задания в звонок. Дальше мои вопросы могут быть про это фото.'
      });
      state.learningMemory.totalPhotos = (state.learningMemory.totalPhotos || 0) + 1;
      saveMemory();
      renderSettings();

      if(voiceState.history.length > 16){
        voiceState.history = voiceState.history.slice(-16);
      }

      appendVoiceLine('bot','Вижу фото. Теперь просто скажи голосом, что нужно объяснить по этому заданию.');
      setVoiceStatus('Слушаю вопрос про фото...');
      updateVoiceControlButton();

      voiceState.autoListening = true;
      setTimeout(startVoiceRecognition, 500);
    });
  };

  reader.readAsDataURL(file);
}

async function handleVoiceQuestion(text){
  const mic = document.getElementById('micButton');
  const hadPhoto = !!voiceState.imageDataUrl;

  voiceState.autoListening = false;
  voiceState.thinking = true;

  stopVoiceRecognition();

  if(mic) mic.disabled = false;
  updateVoiceControlButton();

  appendVoiceLine('user', text);
  setVoiceStatus('Думаю...');
  setFox('thinking');

  const historyForRequest = voiceState.history.slice(-10);

  try{
    const res = await fetch('/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        message:text,
        history:historyForRequest,
        age:state.age,
        chatTitle:'Созвон с Умником',
        imageDataUrl:voiceState.imageDataUrl || null,
        profile:profileForApi(),
        memory:memoryForApi(),
        mode:'ai'
      })
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data?.error || 'voice api error');

    const answer = data.text || 'Я не смог ответить. Попробуй сказать вопрос ещё раз.';

    voiceState.history.push({role:'user', content:text});
    voiceState.history.push({role:'assistant', content:answer});
    updateLearningMemory(text, answer, 'voice', hadPhoto);

    if(voiceState.history.length > 16){
      voiceState.history = voiceState.history.slice(-16);
    }

    appendVoiceLine('bot', answer);

    setVoiceStatus('Объясняю...');
    setFox(data.emotion || 'explain');

    voiceState.thinking = false;
    if(mic) mic.disabled = false;
    updateVoiceControlButton();

    speakVoiceAnswer(answer);
  }catch(e){
    const fallback = demoAnswer(text).text;

    voiceState.history.push({role:'user', content:text});
    voiceState.history.push({role:'assistant', content:fallback});
    updateLearningMemory(text, fallback, 'voice', hadPhoto);

    if(voiceState.history.length > 16){
      voiceState.history = voiceState.history.slice(-16);
    }

    appendVoiceLine('bot', fallback);

    setVoiceStatus('AI не ответил, показываю демо-ответ.');
    setFox('confused');

    voiceState.thinking = false;
    if(mic) mic.disabled = false;
    updateVoiceControlButton();

    speakVoiceAnswer(fallback);
  }
}

function getBestRussianVoice(){
  const voices = speechSynthesis.getVoices?.() || [];

  const ruVoices = voices.filter(v =>
    String(v.lang || '').toLowerCase().startsWith('ru')
  );

  if(!ruVoices.length) return null;

  const preferredNames = [
    'google русский',
    'google russian',
    'alena',
    'алена',
    'milena',
    'милена',
    'svetlana',
    'светлана',
    'irina',
    'ирина',
    'pavel',
    'павел',
    'microsoft irina',
    'microsoft pavel'
  ];

  const scored = ruVoices.map(v => {
    const name = String(v.name || '').toLowerCase();
    let score = 0;

    preferredNames.forEach((p, index) => {
      if(name.includes(p)) score += 100 - index;
    });

    if(name.includes('google')) score += 40;
    if(name.includes('microsoft')) score += 15;
    if(v.localService) score += 5;

    return { voice:v, score };
  });

  scored.sort((a,b) => b.score - a.score);

  return scored[0].voice;
}

function makeSpeechTextHuman(text){
  return String(text || '')
    .replace(/\*/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\s+/g, '$1 ')
    .trim();
}

function splitSpeechIntoChunks(text){
  const clean = makeSpeechTextHuman(text);

  if(clean.length <= 220) return [clean];

  const parts = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
  const chunks = [];
  let current = '';

  parts.forEach(part => {
    const next = (current + ' ' + part).trim();

    if(next.length > 240 && current){
      chunks.push(current.trim());
      current = part.trim();
    }else{
      current = next;
    }
  });

  if(current) chunks.push(current.trim());

  return chunks;
}


function getVoiceRate(){
  const settings = state.voiceSettings || defaultVoiceSettings();
  const rate = Number(settings.rate || 1.15);
  return Math.min(1.55, Math.max(0.75, rate));
}

function getVoicePitch(){
  const settings = state.voiceSettings || defaultVoiceSettings();
  const pitch = Number(settings.pitch || 1.05);
  return Math.min(1.08, Math.max(1.02, pitch));
}

function changeVoiceSpeed(value){
  const rate = Number(value || 1.15);
  state.voiceSettings = state.voiceSettings || defaultVoiceSettings();
  state.voiceSettings.rate = Math.min(1.55, Math.max(0.75, rate));
  state.voiceSettings.pitch = 1.05;

  saveVoiceSettings();
  updateVoiceSpeedUI();
}

function updateVoiceSpeedUI(){
  const range = document.getElementById('voiceSpeedRange');
  const value = document.getElementById('voiceSpeedValue');

  if(!range || !value) return;

  const rate = getVoiceRate();
  range.value = String(rate);
  value.textContent = rate.toFixed(2) + '×';
}

function testVoiceSpeed(){
  if(!('speechSynthesis' in window)) return;

  if(voiceState.callOpen){
    stopVoiceRecognition();
    voiceState.autoListening = false;
    updateVoiceControlButton();
  }

  speakVoiceAnswer('Привет! Я Умник. Сейчас проверяем скорость моего голоса.');
}

function speakVoiceAnswer(text){
  const voiceImg = document.getElementById('voiceUmnik');

  speechSynthesis.cancel();

  voiceState.speaking = true;
  voiceState.autoListening = false;
  updateVoiceControlButton();
  startVoiceStopCommandListener();

  const chunks = splitSpeechIntoChunks(text);
  const bestVoice = getBestRussianVoice();

  let index = 0;

  function finishSpeaking(){
    voiceState.speaking = false;
    stopVoiceStopCommandListener();

    if(voiceImg) voiceImg.classList.remove('speaking');

    updateVoiceControlButton();

    if(voiceState.callOpen && isVoiceModalOpen()){
      voiceState.autoListening = true;
      setVoiceStatus('Слушаю...');
      setTimeout(startVoiceRecognition, 520);
    }else{
      setVoiceStatus('Готов помочь');
    }
  }

  function speakNext(){
    if(index >= chunks.length){
      finishSpeaking();
      return;
    }

    const utter = new SpeechSynthesisUtterance(chunks[index]);

    utter.lang = 'ru-RU';
    utter.rate = getVoiceRate();
    utter.pitch = getVoicePitch();
    utter.volume = 1;

    if(bestVoice) utter.voice = bestVoice;

    utter.onstart = () => {
      setVoiceStatus('Объясняю...');
      if(voiceImg) voiceImg.classList.add('speaking');
    };

    utter.onend = () => {
      index += 1;
      setTimeout(speakNext, 180);
    };

    utter.onerror = () => {
      index += 1;
      setTimeout(speakNext, 120);
    };

    speechSynthesis.speak(utter);
  }

  speakNext();
}


function isStopSpeakingCommand(text){
  const t = String(text || '').toLowerCase().replace(/[.,!?]/g,' ').replace(/\s+/g,' ').trim();

  const phrases = [
    'умник перестань говорить',
    'умник остановись',
    'умник стоп',
    'перестань говорить',
    'останови ответ',
    'остановись',
    'хватит говорить',
    'хватит',
    'стоп',
    'замолчи'
  ];

  return phrases.some(p => t.includes(p));
}

function stopUmnikSpeakingAndContinue(){
  speechSynthesis.cancel();
  stopVoiceStopCommandListener();

  voiceState.speaking = false;
  voiceState.thinking = false;
  voiceState.autoListening = true;

  const voiceImg = document.getElementById('voiceUmnik');
  if(voiceImg) voiceImg.classList.remove('speaking');

  const mic = document.getElementById('micButton');
  if(mic) mic.disabled = false;

  setVoiceStatus('Остановил ответ. Слушаю новый вопрос...');
  updateVoiceControlButton();

  setTimeout(startVoiceRecognition, 450);
}

function startVoiceStopCommandListener(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  if(!SR || voiceState.stopCommandListening) return;

  try{
    voiceState.stopRecognition = new SR();
    voiceState.stopRecognition.lang = 'ru-RU';
    voiceState.stopRecognition.interimResults = false;
    voiceState.stopRecognition.continuous = true;

    voiceState.stopRecognition.onstart = () => {
      voiceState.stopCommandListening = true;
    };

    voiceState.stopRecognition.onresult = (event) => {
      let heard = '';

      for(let i = event.resultIndex; i < event.results.length; i++){
        heard += ' ' + event.results[i][0].transcript;
      }

      if(isStopSpeakingCommand(heard)){
        appendVoiceLine('user','Умник, перестань говорить');
        stopUmnikSpeakingAndContinue();
      }
    };

    voiceState.stopRecognition.onerror = () => {
      voiceState.stopCommandListening = false;
      if(voiceState.speaking && voiceState.callOpen){
        setTimeout(startVoiceStopCommandListener, 700);
      }
    };

    voiceState.stopRecognition.onend = () => {
      voiceState.stopCommandListening = false;
      if(voiceState.speaking && voiceState.callOpen){
        setTimeout(startVoiceStopCommandListener, 700);
      }
    };

    voiceState.stopRecognition.start();
  }catch(e){
    voiceState.stopCommandListening = false;
  }
}

function stopVoiceStopCommandListener(){
  try{
    if(voiceState.stopRecognition && voiceState.stopCommandListening){
      voiceState.stopRecognition.stop();
    }
  }catch(e){}

  voiceState.stopCommandListening = false;
}


if('speechSynthesis' in window){
  speechSynthesis.onvoiceschanged = () => {
    getBestRussianVoice();
  };
}



function forceStartChat(e){
  if(e){e.preventDefault(); e.stopPropagation();}
  startApp();
  return false;
}
function bindStartButton(){
  const btn=document.getElementById('startChatBtn');
  if(!btn)return;
  btn.disabled=false;
  btn.style.pointerEvents='auto';
  btn.style.opacity='1';
  btn.onclick=forceStartChat;
}
window.forceStartChat = forceStartChat;
window.startApp = startApp;
window.openSettings = openSettings;
window.openChat = openChat;
window.setMode = setMode;
window.setPlan = setPlan;
window.toggleEditTabs = toggleEditTabs;
window.newChat = newChat;
window.send = send;
window.pickPhoto = pickPhoto;
window.voiceInput = voiceInput;
window.openVoiceCall = openVoiceCall;
window.closeVoiceCall = closeVoiceCall;
window.openVoicePhotoPicker = openVoicePhotoPicker;
window.handleVoiceControlButton = handleVoiceControlButton;
window.changeVoiceSpeed = changeVoiceSpeed;
window.testVoiceSpeed = testVoiceSpeed;
window.openProfileMenu = openProfileMenu;
window.closeProfileMenu = closeProfileMenu;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.saveProfileFromModal = saveProfileFromModal;
window.showFullMemory = showFullMemory;
window.clearLearningMemory = clearLearningMemory;
document.addEventListener('click',function(e){if(e.target&&e.target.id==='startChatBtn')forceStartChat(e)},true);

window.addEventListener('DOMContentLoaded', () => {
  bindStartButton();
  resetEveryOpen(true);
  enableDragScroll(document.getElementById('chatTabs'), 'tabDragMoved');
  enableDragScroll(document.getElementById('suggestions'), 'sugDragMoved');
  syncProfileToWelcome();
  renderTop('welcome');
  render();
  renderSettings();
  initVoiceEvents();
  bindStartButton();
});

function resetEveryOpen(clearVoice = true){
  state.profile = loadJson(PROFILE_KEY, defaultProfile);
  state.learningMemory = loadJson(MEMORY_KEY, defaultMemory);
  state.account = loadJson(ACCOUNT_KEY, defaultAccount);
  state.subscription = loadJson(SUBSCRIPTION_KEY, defaultSubscription);
  state.voiceSettings = loadJson(VOICE_SETTINGS_KEY, defaultVoiceSettings);
  state.plan = hasActivePlus() ? 'plus' : 'free';
  state.mode = 'ai';
  state.activeChat = 'Домашка';
  state.imageDataUrl = null;
  state.chats = {'Домашка':[{role:'bot', text:welcomeText(state.name)}]};
  state.chatOrder = ['Домашка'];
  state.limits = {messages:0,photos:0};
  state.editingTabs = false;
  state.isSending = false;
  state.tabDragMoved = false;
  state.sugDragMoved = false;

  if(clearVoice){
    voiceState.history = [];
    voiceState.imageDataUrl = null;
    voiceState.thinking = false;
    voiceState.speaking = false;
    voiceState.stopCommandListening = false;
    voiceState.callOpen = false;
    voiceState.autoListening = false;
    voiceState.listening = false;
  }
}

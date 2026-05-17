function paperclipIcon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.4 11.6 12 21a6 6 0 0 1-8.5-8.5l9.8-9.8a4 4 0 0 1 5.7 5.7l-9.9 9.9a2 2 0 0 1-2.8-2.8l9.2-9.2"/></svg>'}
function micIcon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/><path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>'}
function sendIcon(){return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21.7 12 3.4 3.6 5.1 10.3 13.5 12l-8.4 1.7-1.7 6.7Z"/></svg>'}
function gearIcon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 .9-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6.9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5.9Z"/></svg>'}


try{
  localStorage.removeItem('umnik_chats');
  localStorage.removeItem('umnik_active_chat');
  localStorage.removeItem('umnik_limits');
}catch(e){}




const defaultChats = ['Р”РѕРјР°С€РєР°','РўР°Р±Р»РёС†Р° Г—7','Р СѓСЃСЃРєРёР№'];
const suggestions = [
  'Р§С‚Рѕ С‚Р°РєРѕРµ СЃРєР°Р·СѓРµРјРѕРµ?',
  'РљР°Рє РЅР°Р№С‚Рё РїРµСЂРёРјРµС‚СЂ?',
  'РћР±СЉСЏСЃРЅРё С‚Р°Р±Р»РёС†Сѓ СѓРјРЅРѕР¶РµРЅРёСЏ',
  'Р Р°Р·Р±РµСЂРё С„РѕС‚Рѕ Р·Р°РґР°РЅРёСЏ',
  'Р§С‚Рѕ С‚Р°РєРѕРµ РґСЂРѕР±СЊ?',
  'РЇ СѓСЃС‚Р°Р», Сѓ РјРµРЅСЏ РЅРµ РїРѕР»СѓС‡РёС‚СЃСЏ'
];

const state = {
  name:'',
  age:'',
  mode:'ai',
  plan:'free',
  activeChat:'Р”РѕРјР°С€РєР°',
  imageDataUrl:null,
  chats:{'Р”РѕРјР°С€РєР°':[{role:'bot', text:welcomeText('')}]},
  chatOrder:['Р”РѕРјР°С€РєР°'],
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


function defaultProfile(){return {name:'',age:'',grade:'',hardSubject:'',hardTopics:'',explainStyle:'РѕС‡РµРЅСЊ РїСЂРѕСЃС‚Рѕ',goal:''}}
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
      ? `Р’С‹ РІРѕС€Р»Рё РєР°Рє ${acc.email || 'РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ'}`
      : 'Р’С‹ РїРѕРєР° РЅРµ РІРѕС€Р»Рё. Р”Р»СЏ MVP РІС…РѕРґ СЃРѕС…СЂР°РЅСЏРµС‚СЃСЏ Р»РѕРєР°Р»СЊРЅРѕ РІ Р±СЂР°СѓР·РµСЂРµ.';
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
      `<div class="account-row"><span>РўР°СЂРёС„</span><b>${active ? 'РЈРјРЅРёРє РџР»СЋСЃ' : 'Free'}</b></div>` +
      `<div class="account-row"><span>РЎС‚Р°С‚СѓСЃ</span><b>${active ? 'РђРєС‚РёРІРЅР°' : 'РќРµ Р°РєС‚РёРІРЅР°'}</b></div>` +
      `<div class="account-row"><span>РћСЃС‚Р°Р»РѕСЃСЊ</span><b>${active ? `${days} РґРЅ.` : '0 РґРЅ.'}</b></div>` +
      `<div class="account-row"><span>РЎС‚РѕРёРјРѕСЃС‚СЊ</span><b>349 в‚Ѕ / РјРµСЃ</b></div>`;
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
  const email = prompt('Р’РІРµРґРё email РґР»СЏ РІС…РѕРґР° РІ MVP-Р°РєРєР°СѓРЅС‚:', state.account?.email || '');
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
  alert('MVP: РїРѕРґРїРёСЃРєР° РЈРјРЅРёРє РџР»СЋСЃ Р°РєС‚РёРІРёСЂРѕРІР°РЅР° РЅР° 30 РґРЅРµР№.');
}

function syncProfileToWelcome(){const n=document.getElementById('nameInput');const a=document.getElementById('ageInput');if(n&&state.profile.name&&!n.value)n.value=state.profile.name;if(a&&state.profile.age&&!a.value)a.value=state.profile.age}
function updateProfileFromWelcome(name,age){state.profile.name=name||state.profile.name||'';state.profile.age=age||state.profile.age||'';saveProfile()}
function profileForApi(){return {name:state.profile.name||state.name||'',age:state.profile.age||state.age||'',grade:state.profile.grade||'',hardSubject:state.profile.hardSubject||'',hardTopics:state.profile.hardTopics||'',explainStyle:state.profile.explainStyle||'РѕС‡РµРЅСЊ РїСЂРѕСЃС‚Рѕ',goal:state.profile.goal||''}}
function memoryForApi(){const m=state.learningMemory||defaultMemory();return {totalQuestions:m.totalQuestions||0,totalVoiceQuestions:m.totalVoiceQuestions||0,totalPhotos:m.totalPhotos||0,topics:m.topics||{},difficult:m.difficult||{},recent:(m.recent||[]).slice(-6),lastSummary:m.lastSummary||''}}
function detectLearningTopic(text){const q=String(text||'').toLowerCase();const pairs=[['РґСЂРѕР±Рё',['РґСЂРѕР±','С‡РёСЃР»РёС‚РµР»','Р·РЅР°РјРµРЅР°С‚РµР»']],['С‚Р°Р±Р»РёС†Р° СѓРјРЅРѕР¶РµРЅРёСЏ',['СѓРјРЅРѕР¶','С‚Р°Р±Р»РёС†','РїСЂРѕРёР·РІРµРґ']],['СѓСЂР°РІРЅРµРЅРёСЏ',['СѓСЂР°РІРЅРµРЅ','РёРєСЃ',' x ','x+','x -','РЅР°Р№С‚Рё x']],['РїРµСЂРёРјРµС‚СЂ',['РїРµСЂРёРјРµС‚СЂ']],['РїР»РѕС‰Р°РґСЊ',['РїР»РѕС‰Р°Рґ']],['СЃРєР°Р·СѓРµРјРѕРµ',['СЃРєР°Р·СѓРµРј']],['РїРѕРґР»РµР¶Р°С‰РµРµ',['РїРѕРґР»РµР¶Р°']],['С‡Р°СЃС‚Рё СЂРµС‡Рё',['С‡Р°СЃС‚СЊ СЂРµС‡Рё','СЃСѓС‰РµСЃС‚РІРёС‚РµР»СЊРЅ','РїСЂРёР»Р°РіР°С‚РµР»СЊРЅ','РіР»Р°РіРѕР»']],['РѕСЂС„РѕРіСЂР°С„РёСЏ',['РїСЂРѕРІРµСЂРѕС‡РЅРѕРµ СЃР»РѕРІРѕ','Р±РµР·СѓРґР°СЂРЅ','Р±СѓРєРІР°','РѕСЂС„РѕРіСЂР°РјРј']],['С‚РµРєСЃС‚РѕРІР°СЏ Р·Р°РґР°С‡Р°',['Р·Р°РґР°С‡Р°','СѓСЃР»РѕРІРёРµ','СЂРµС€РµРЅРёРµ']]];for(const [topic,words] of pairs){if(words.some(w=>q.includes(w)))return topic}return 'РѕР±С‰РёР№ РІРѕРїСЂРѕСЃ'}
function bumpMap(map,key){if(key)map[key]=(map[key]||0)+1}
function topKeys(obj,limit=3){return Object.entries(obj||{}).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([k,v])=>`${k} (${v})`)}
function buildMemorySummary(memory){const top=topKeys(memory.topics,3);const hard=topKeys(memory.difficult,3);const parts=[`Р’СЃРµРіРѕ РІРѕРїСЂРѕСЃРѕРІ: ${memory.totalQuestions||0}`];if(memory.totalVoiceQuestions)parts.push(`Р“РѕР»РѕСЃРѕРј: ${memory.totalVoiceQuestions}`);if(memory.totalPhotos)parts.push(`Р¤РѕС‚Рѕ: ${memory.totalPhotos}`);if(top.length)parts.push(`Р§Р°С‰Рµ РІСЃРµРіРѕ: ${top.join(', ')}`);if(hard.length)parts.push(`РЎР»РѕР¶РЅС‹Рµ С‚РµРјС‹: ${hard.join(', ')}`);return parts.join('\n')||'РџРѕРєР° РїР°РјСЏС‚Рё РјР°Р»Рѕ: Р·Р°РґР°Р№ РЅРµСЃРєРѕР»СЊРєРѕ РІРѕРїСЂРѕСЃРѕРІ, Рё РЈРјРЅРёРє РЅР°С‡РЅС‘С‚ РїРѕРґСЃС‚СЂР°РёРІР°С‚СЊСЃСЏ.'}
function updateLearningMemory(userText,answerText,source='chat',hadPhoto=false){const m=state.learningMemory||defaultMemory();const topic=detectLearningTopic(userText+' '+answerText);m.totalQuestions=(m.totalQuestions||0)+1;if(source==='voice')m.totalVoiceQuestions=(m.totalVoiceQuestions||0)+1;if(hadPhoto)m.totalPhotos=(m.totalPhotos||0)+1;m.topics=m.topics||{};m.difficult=m.difficult||{};m.recent=m.recent||[];bumpMap(m.topics,topic);const hard=String(userText||'').toLowerCase();if(hard.includes('РЅРµ РїРѕРЅСЏР»')||hard.includes('РЅРµ РїРѕРЅРёРјР°СЋ')||hard.includes('РЅРµ РїРѕР»СѓС‡Р°РµС‚СЃСЏ')||hard.includes('СѓСЃС‚Р°Р»')||hard.includes('СЃР»РѕР¶РЅРѕ')||hard.includes('РѕС€РёР±РєР°'))bumpMap(m.difficult,topic);m.recent.push({source,topic,question:String(userText||'').slice(0,180),answer:String(answerText||'').slice(0,220),at:new Date().toISOString()});if(m.recent.length>10)m.recent=m.recent.slice(-10);m.lastSummary=buildMemorySummary(m);state.learningMemory=m;saveMemory();renderSettings()}
function renderProfileSummary(){const box=document.getElementById('profileSummary');if(!box)return;const p=profileForApi();const items=[['РРјСЏ',p.name||'РЅРµ СѓРєР°Р·Р°РЅРѕ'],['Р’РѕР·СЂР°СЃС‚',p.age||'РЅРµ СѓРєР°Р·Р°РЅ'],['РљР»Р°СЃСЃ',p.grade?`${p.grade} РєР»Р°СЃСЃ`:'РЅРµ РІС‹Р±СЂР°РЅ'],['РЎР»РѕР¶РЅРµРµ РІСЃРµРіРѕ',p.hardSubject||'РЅРµ РІС‹Р±СЂР°РЅРѕ'],['РЎС‚РёР»СЊ',p.explainStyle||'РѕС‡РµРЅСЊ РїСЂРѕСЃС‚Рѕ'],['РўРµРјС‹',p.hardTopics||'РїРѕРєР° РЅРµ СѓРєР°Р·Р°РЅС‹']];box.innerHTML=items.map(([l,v])=>`<div class="profile-pill"><b>${l}</b>${v}</div>`).join('')}
function renderMemorySummary(){const box=document.getElementById('memorySummary');if(box)box.textContent=state.learningMemory.lastSummary||buildMemorySummary(state.learningMemory||defaultMemory())}
function openProfileModal(){const p=profileForApi();document.getElementById('profileName').value=p.name||'';document.getElementById('profileAge').value=p.age||'';document.getElementById('profileGrade').value=p.grade||'';document.getElementById('profileHardSubject').value=p.hardSubject||'';document.getElementById('profileHardTopics').value=p.hardTopics||'';document.getElementById('profileExplainStyle').value=p.explainStyle||'РѕС‡РµРЅСЊ РїСЂРѕСЃС‚Рѕ';document.getElementById('profileGoal').value=p.goal||'';const modal=document.getElementById('profileModal');modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false')}
function closeProfileModal(){const modal=document.getElementById('profileModal');modal.classList.add('hidden');modal.setAttribute('aria-hidden','true')}
function saveProfileFromModal(){state.profile={name:document.getElementById('profileName').value.trim(),age:document.getElementById('profileAge').value.trim(),grade:document.getElementById('profileGrade').value,hardSubject:document.getElementById('profileHardSubject').value,hardTopics:document.getElementById('profileHardTopics').value.trim(),explainStyle:document.getElementById('profileExplainStyle').value,goal:document.getElementById('profileGoal').value.trim()};state.name=state.profile.name||state.name;state.age=state.profile.age||state.age;saveProfile();closeProfileModal();renderSettings();addMessage('bot','РџСЂРѕС„РёР»СЊ СЃРѕС…СЂР°РЅС‘РЅ. РўРµРїРµСЂСЊ СЏ Р±СѓРґСѓ СѓС‡РёС‚С‹РІР°С‚СЊ РєР»Р°СЃСЃ, СЃР»РѕР¶РЅС‹Рµ С‚РµРјС‹ Рё СЃС‚РёР»СЊ РѕР±СЉСЏСЃРЅРµРЅРёСЏ.');setFox('happy');render()}
function showFullMemory(){const m=state.learningMemory||defaultMemory();const recent=(m.recent||[]).slice(-5).map((r,i)=>`${i+1}. ${r.topic}: ${r.question}`).join('\n');alert('РџР°РјСЏС‚СЊ РЈРјРЅРёРєР°:\n\n'+buildMemorySummary(m)+(recent?'\n\nРџРѕСЃР»РµРґРЅРёРµ РІРѕРїСЂРѕСЃС‹:\n'+recent:''))}
function clearLearningMemory(){if(!confirm('РћС‡РёСЃС‚РёС‚СЊ РїР°РјСЏС‚СЊ РЈРјРЅРёРєР° РЅР° СЌС‚РѕРј СѓСЃС‚СЂРѕР№СЃС‚РІРµ?'))return;state.learningMemory=defaultMemory();saveMemory();renderSettings();addMessage('bot','РџР°РјСЏС‚СЊ РѕС‡РёС‰РµРЅР°. РќР°С‡РЅС‘Рј Р·Р°РЅРѕРІРѕ рџ™‚');setFox('welcome');render()}


let currentEmotion = 'welcome';

function welcomeText(name){
  const cleanName = String(name || '').trim();
  const hello = cleanName ? `РџСЂРёРІРµС‚, ${cleanName}!` : 'РџСЂРёРІРµС‚!';
  return `${hello} РЇ РЈРјРЅРёРє. РќР°РїРёС€Рё С€РєРѕР»СЊРЅС‹Р№ РІРѕРїСЂРѕСЃ РёР»Рё РїСЂРёРєСЂРµРїРё С„РѕС‚Рѕ Р·Р°РґР°РЅРёСЏ вЂ” СЂР°Р·Р±РµСЂС‘Рј РІРјРµСЃС‚Рµ.`;
}

function ensureChat(n){
  if(!state.chats[n]) state.chats[n] = [{role:'bot', text:welcomeText(state.name)}];
  if(!state.chatOrder.includes(n)) state.chatOrder.push(n);
}

function normalizeChatsForPlan(){
  if(state.plan === 'free'){
    ensureChat('Р”РѕРјР°С€РєР°');
    state.chats = {'Р”РѕРјР°С€РєР°': state.chats['Р”РѕРјР°С€РєР°'] || [{role:'bot', text:welcomeText(state.name)}]};
    state.chatOrder = ['Р”РѕРјР°С€РєР°'];
    state.activeChat = 'Р”РѕРјР°С€РєР°';
    state.editingTabs = false;
    return;
  }

  if(!state.chatOrder.length){
    state.chatOrder = ['Р”РѕРјР°С€РєР°'];
    ensureChat('Р”РѕРјР°С€РєР°');
  }

  if(!state.chatOrder.includes(state.activeChat)){
    state.activeChat = state.chatOrder[0] || 'Р”РѕРјР°С€РєР°';
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
    top.innerHTML = '<img class="logo" src="/assets/logo.png" alt="РЈРјРЅРёРє">';
  }else{
    top.className = 'top';
    top.innerHTML =
      '<img id="headerFox" class="header-fox" src="/assets/umnik_welcome.png" alt="РЈРјРЅРёРє">' +
      '<img class="logo" src="/assets/logo.png" alt="РЈРјРЅРёРє">' +
      '<div class="top-actions">' +
        '<button id="voiceCallBtn" class="voice-call-btn" type="button" onclick="openVoiceCall()" aria-label="РџРѕР·РІРѕРЅРёС‚СЊ РЈРјРЅРёРєСѓ">рџ“ћ</button>' +
        '<button id="profileMenuBtn" class="profile-menu-btn" type="button" onclick="openProfileMenu()" aria-label="РџСЂРѕС„РёР»СЊ СѓС‡РµРЅРёРєР°">рџ‘¤</button>' +
        '<button class="gear-btn" onclick="openSettings()" aria-label="РќР°СЃС‚СЂРѕР№РєРё">' + gearIcon() + '</button>' +
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
    const name = (nameEl && nameEl.value ? nameEl.value.trim() : '') || saved.name || 'РґСЂСѓРі';
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
  let root = (base || 'РќРѕРІС‹Р№ С‡Р°С‚').trim() || 'РќРѕРІС‹Р№ С‡Р°С‚';
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
    addMessage('bot','Р’ Free-РІРµСЂСЃРёРё РґРѕСЃС‚СѓРїРµРЅ С‚РѕР»СЊРєРѕ РѕРґРёРЅ С‡Р°С‚. РЎРѕР·РґР°РЅРёРµ РѕС‚РґРµР»СЊРЅС‹С… С‡Р°С‚РѕРІ РѕС‚РЅРѕСЃРёС‚СЃСЏ Рє РЈРјРЅРёРє РџР»СЋСЃ.');
    render();
    return;
  }

  const raw = prompt('РќР°Р·РІР°РЅРёРµ РЅРѕРІРѕРіРѕ С‡Р°С‚Р°:','РќРѕРІС‹Р№ С‡Р°С‚');
  if(raw === null) return;

  const n = uniqueName(raw);
  state.activeChat = n;
  state.chats[n] = [{role:'bot', text:'РќРѕРІС‹Р№ С‡Р°С‚ СЃРѕР·РґР°РЅ. Р§С‚Рѕ Р±СѓРґРµРј СЂР°Р·Р±РёСЂР°С‚СЊ?'}];
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
    state.activeChat = state.chatOrder[0] || 'Р”РѕРјР°С€РєР°';
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

  editBtn.textContent = state.editingTabs ? 'вњ“' : 'вњЋ';
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
      left.textContent = 'вЂ№';
      left.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveChat(n,-1);
      };

      const right = document.createElement('button');
      right.type = 'button';
      right.className = 'tab-control';
      right.textContent = 'вЂє';
      right.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveChat(n,1);
      };

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'tab-control';
      del.textContent = 'Г—';
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
    d.textContent = 'РЈРјРЅРёРє РґСѓРјР°РµС‚...';
    chat.appendChild(d);
  }

  chat.scrollTop = chat.scrollHeight;

  document.getElementById('limitsText').textContent = state.plan === 'free'
    ? 'Free: 1 С‡Р°С‚, 10 СЃРѕРѕР±С‰РµРЅРёР№ Рё 3 С„РѕС‚Рѕ РІ РґРµРЅСЊ'
    : 'РЈРјРЅРёРє РџР»СЋСЃ: Р±РµР·Р»РёРјРёС‚РЅС‹Рµ СЃРѕРѕР±С‰РµРЅРёСЏ, С„РѕС‚Рѕ, РіРѕР»РѕСЃ, СЃРѕР·РІРѕРЅ Рё СЃРѕС…СЂР°РЅС‘РЅРЅС‹Рµ С‡Р°С‚С‹';

  document.getElementById('modeNote').textContent = state.mode === 'ai'
    ? 'AI-СЂРµР¶РёРј: Р·Р°РїСЂРѕСЃ РѕС‚РїСЂР°РІР»СЏРµС‚СЃСЏ РІ РјРѕРґРµР»СЊ'
    : 'Р”РµРјРѕ-СЂРµР¶РёРј: РѕС‚РІРµС‚С‹ РёР· Р·Р°РіРѕС‚РѕРІР»РµРЅРЅРѕР№ Р±Р°Р·С‹';

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
    addMessage('bot','Р’ Free-РІРµСЂСЃРёРё Р·Р°РєРѕРЅС‡РёР»РёСЃСЊ 10 СЃРѕРѕР±С‰РµРЅРёР№ РЅР° СЃРµРіРѕРґРЅСЏ. Р’ РїСЂРµР·РµРЅС‚Р°С†РёРё СЌС‚Рѕ РјРµСЃС‚Рѕ РґР»СЏ РїРµСЂРµС…РѕРґР° РЅР° РЈРјРЅРёРє РџР»СЋСЃ.');
    render();
    return false;
  }

  return true;
}

function demoAnswer(message) {
  const q = String(message || '').toLowerCase();

  if(q.includes('СЃРєР°Р·СѓРµРј')) return { emotion:'explain', text:'РЎРєР°Р·СѓРµРјРѕРµ вЂ” СЌС‚Рѕ РіР»Р°РІРЅС‹Р№ С‡Р»РµРЅ РїСЂРµРґР»РѕР¶РµРЅРёСЏ, РєРѕС‚РѕСЂС‹Р№ РїРѕРєР°Р·С‹РІР°РµС‚, С‡С‚Рѕ РґРµР»Р°РµС‚ РїСЂРµРґРјРµС‚. РќР°РїСЂРёРјРµСЂ: В«РњР°Р»СЊС‡РёРє С‡РёС‚Р°РµС‚В». Р§С‚Рѕ РґРµР»Р°РµС‚? Р§РёС‚Р°РµС‚ вЂ” СЌС‚Рѕ СЃРєР°Р·СѓРµРјРѕРµ.' };
  if(q.includes('РїРµСЂРёРјРµС‚СЂ')) return { emotion:'explain', text:'РџРµСЂРёРјРµС‚СЂ вЂ” СЌС‚Рѕ СЃСѓРјРјР° РґР»РёРЅ РІСЃРµС… СЃС‚РѕСЂРѕРЅ С„РёРіСѓСЂС‹. Р§С‚РѕР±С‹ РЅР°Р№С‚Рё РїРµСЂРёРјРµС‚СЂ, РЅСѓР¶РЅРѕ СЃР»РѕР¶РёС‚СЊ РІСЃРµ СЃС‚РѕСЂРѕРЅС‹. РЈ РїСЂСЏРјРѕСѓРіРѕР»СЊРЅРёРєР° РјРѕР¶РЅРѕ С‚Р°Рє: P = 2 Г— (РґР»РёРЅР° + С€РёСЂРёРЅР°).' };
  if(q.includes('РґСЂРѕР±')) return { emotion:'happy', text:'Р”СЂРѕР±СЊ вЂ” СЌС‚Рѕ С‡Р°СЃС‚СЊ С†РµР»РѕРіРѕ. РќР°РїСЂРёРјРµСЂ, РµСЃР»Рё РїРёС†С†Сѓ СЂР°Р·РґРµР»РёР»Рё РЅР° 4 СЂР°РІРЅС‹Рµ С‡Р°СЃС‚Рё Рё РІР·СЏР»Рё 1 РєСѓСЃРѕРє, СЌС‚Рѕ 1/4.' };
  if(q.includes('СѓСЃС‚Р°Р»')) return { emotion:'support', text:'РџРѕРЅРёРјР°СЋ. Р”Р°РІР°Р№ СЃРґРµР»Р°РµРј РѕРґРёРЅ РјР°Р»РµРЅСЊРєРёР№ С€Р°Рі: РЅР°РїРёС€Рё РїРµСЂРІРѕРµ Р·Р°РґР°РЅРёРµ, Рё СЏ РїРѕРјРѕРіСѓ СЂР°Р·РѕР±СЂР°С‚СЊ РµРіРѕ СЃРїРѕРєРѕР№РЅРѕ.' };
  if(q.includes('С„РѕС‚Рѕ')) return { emotion:'idea', text:'Р¤РѕС‚Рѕ РїСЂРёРЅСЏС‚Рѕ. Р’ РїРѕР»РЅРѕР№ РІРµСЂСЃРёРё СЏ СЂР°СЃРїРѕР·РЅР°СЋ Р·Р°РґР°РЅРёРµ РЅР° С„РѕС‚Рѕ Рё РѕР±СЉСЏСЃРЅСЋ СЂРµС€РµРЅРёРµ С‚РµРєСЃС‚РѕРј.' };

  return { emotion:'explain', text:'РЇ РїРѕРЅСЏР» РІРѕРїСЂРѕСЃ. Р”Р°РІР°Р№ СЂР°Р·Р±РµСЂС‘Рј РµРіРѕ РїСЂРѕСЃС‚С‹РјРё С€Р°РіР°РјРё: СЃРЅР°С‡Р°Р»Р° РІС‹РґРµР»РёРј РіР»Р°РІРЅРѕРµ, РїРѕС‚РѕРј СЂРµС€РёРј РїСЂРёРјРµСЂ.' };
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
  addMessage('user', text || 'РЇ РїСЂРёРєСЂРµРїРёР» С„РѕС‚Рѕ Р·Р°РґР°РЅРёСЏ.');
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

    const answerText = data.text || 'РћС‚РІРµС‚ РїСѓСЃС‚РѕР№. РџРѕРїСЂРѕР±СѓР№ РµС‰С‘ СЂР°Р·.';
    addMessage('bot', answerText);
    updateLearningMemory(text || 'Р¤РѕС‚Рѕ Р·Р°РґР°РЅРёСЏ', answerText, 'chat', hadPhoto);
    setFox(data.emotion || 'explain');
  }catch(e){
    const fallback = demoAnswer(text);
    const fallbackText = 'AI СЃРµР№С‡Р°СЃ РЅРµ РѕС‚РІРµС‚РёР». РџРѕРєР°Р·С‹РІР°СЋ РґРµРјРѕ-РѕС‚РІРµС‚:\n\n' + fallback.text;
    addMessage('bot', fallbackText);
    updateLearningMemory(text || 'Р¤РѕС‚Рѕ Р·Р°РґР°РЅРёСЏ', fallbackText, 'chat', hadPhoto);
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
    addMessage('bot','Р’ Free-РІРµСЂСЃРёРё Р·Р°РєРѕРЅС‡РёР»РёСЃСЊ 3 С„РѕС‚Рѕ РЅР° СЃРµРіРѕРґРЅСЏ. Р’ Plus С„РѕС‚Рѕ-СЂР°Р·Р±РѕСЂ Р±СѓРґРµС‚ СЂР°СЃС€РёСЂРµРЅРЅС‹Рј.');
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
    addMessage('bot','Р“РѕР»РѕСЃРѕРІРѕР№ РІРІРѕРґ РЅРµ РїРѕРґРґРµСЂР¶РёРІР°РµС‚СЃСЏ РІ СЌС‚РѕРј Р±СЂР°СѓР·РµСЂРµ. РџРѕРїСЂРѕР±СѓР№ Google Chrome.');
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
  line.textContent = (role === 'user' ? 'РўС‹: ' : 'РЈРјРЅРёРє: ') + text;

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
  img.alt = 'Р¤РѕС‚Рѕ Р·Р°РґР°РЅРёСЏ';

  const caption = document.createElement('div');
  caption.className = 'voice-photo-caption';
  caption.textContent = 'Р¤РѕС‚Рѕ Р·Р°РґР°РЅРёСЏ РґРѕР±Р°РІР»РµРЅРѕ РІ Р·РІРѕРЅРѕРє';

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
    addMessage('bot','РЎРѕР·РІРѕРЅ СЃ РЈРјРЅРёРєРѕРј РґРѕСЃС‚СѓРїРµРЅ С‚РѕР»СЊРєРѕ РІ РЈРјРЅРёРє РџР»СЋСЃ.');
    render();
    return;
  }

  if(state.mode !== 'ai'){
    addMessage('bot','РЎРѕР·РІРѕРЅ СЂР°Р±РѕС‚Р°РµС‚ С‚РѕР»СЊРєРѕ РІ AI-СЂРµР¶РёРјРµ. РџРµСЂРµРєР»СЋС‡Рё СЂРµР¶РёРј РѕС‚РІРµС‚Р° РЅР° AI РІ РЅР°СЃС‚СЂРѕР№РєР°С….');
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
    appendVoiceLine('bot', `РџСЂРёРІРµС‚${state.name ? `, ${state.name}` : ''}! РЇ РЅР° СЃРІСЏР·Рё. РњРѕР¶РµС€СЊ РїСЂРѕСЃС‚Рѕ РіРѕРІРѕСЂРёС‚СЊ вЂ” СЏ Р±СѓРґСѓ СЃР»СѓС€Р°С‚СЊ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё.`);
  }

  if(voiceState.imageDataUrl){
    appendVoiceLine('bot','Р¤РѕС‚Рѕ Р·Р°РґР°РЅРёСЏ СѓР¶Рµ РІ Р·РІРѕРЅРєРµ. РњРѕР¶РµС€СЊ СЃРїСЂРѕСЃРёС‚СЊ РіРѕР»РѕСЃРѕРј, С‡С‚Рѕ РёРјРµРЅРЅРѕ РЅРµРїРѕРЅСЏС‚РЅРѕ.');
  }

  setVoiceStatus('Р—Р°РїСѓСЃРєР°СЋ РјРёРєСЂРѕС„РѕРЅ...');
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
    restart.textContent = 'вЏ№ РћСЃС‚Р°РЅРѕРІРёС‚СЊ РѕС‚РІРµС‚';
    restart.classList.add('stop');
    if(mic) mic.textContent = 'вЏ№';
    return;
  }

  if(voiceState.thinking){
    restart.textContent = 'вЏі РЈРјРЅРёРє РґСѓРјР°РµС‚';
    restart.classList.add('wait');
    if(mic) mic.textContent = 'вЏі';
    return;
  }

  if(voiceState.listening){
    restart.textContent = 'вЏ№ Р—Р°РІРµСЂС€РёС‚СЊ С„СЂР°Р·Сѓ';
    restart.classList.add('stop');
    if(mic) mic.textContent = 'вЏ№';
    return;
  }

  restart.textContent = 'рџЋ™пёЏ РџСЂРѕРґРѕР»Р¶РёС‚СЊ';
  if(mic) mic.textContent = 'рџЋ™пёЏ';
}

function handleVoiceControlButton(){
  if(voiceState.speaking){
    stopUmnikSpeakingAndContinue();
    return;
  }

  if(voiceState.thinking){
    setVoiceStatus('РЈРјРЅРёРє СѓР¶Рµ РґСѓРјР°РµС‚. РџРѕРґРѕР¶РґРё РѕС‚РІРµС‚ РёР»Рё Р·Р°РєСЂРѕР№ Р·РІРѕРЅРѕРє.');
    updateVoiceControlButton();
    return;
  }

  if(voiceState.listening){
    voiceState.autoListening = false;
    stopVoiceRecognition();
    setVoiceStatus('Р”РёРєС‚РѕРІРєР° РѕСЃС‚Р°РЅРѕРІР»РµРЅР°. РќР°Р¶РјРё В«РџСЂРѕРґРѕР»Р¶РёС‚СЊВ», С‡С‚РѕР±С‹ РіРѕРІРѕСЂРёС‚СЊ РґР°Р»СЊС€Рµ.');
    updateVoiceControlButton();
    return;
  }

  voiceState.autoListening = true;
  setVoiceStatus('РЎР»СѓС€Р°СЋ...');
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
    setVoiceStatus('Р“РѕР»РѕСЃРѕРІРѕР№ СЂРµР¶РёРј Р»СѓС‡С€Рµ РІСЃРµРіРѕ СЂР°Р±РѕС‚Р°РµС‚ РІ Google Chrome.');
    alert('РСЃРїРѕР»СЊР·СѓР№ Google Chrome Рё СЂР°Р·СЂРµС€Рё РґРѕСЃС‚СѓРї Рє РјРёРєСЂРѕС„РѕРЅСѓ.');
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
      setVoiceStatus('РЎР»СѓС€Р°СЋ...');
      setFox('thinking');
      updateVoiceControlButton();
    };

    voiceState.recognition.onend = () => {
      voiceState.listening = false;
      if(mic) mic.classList.remove('listening');
      updateVoiceControlButton();

      if(canVoiceListenNow()){
        setVoiceStatus('РЎР»СѓС€Р°СЋ...');
        setTimeout(startVoiceRecognition, 520);
      }else if(voiceState.callOpen && !voiceState.thinking && !voiceState.speaking){
        setVoiceStatus('Р“РѕС‚РѕРІ РїРѕРјРѕС‡СЊ');
      }
    };

    voiceState.recognition.onerror = (event) => {
      voiceState.listening = false;
      if(mic) mic.classList.remove('listening');
      updateVoiceControlButton();

      const err = event && event.error ? event.error : '';

      if(err === 'not-allowed' || err === 'service-not-allowed'){
        voiceState.autoListening = false;
        setVoiceStatus('Р Р°Р·СЂРµС€Рё РґРѕСЃС‚СѓРї Рє РјРёРєСЂРѕС„РѕРЅСѓ РІ Р±СЂР°СѓР·РµСЂРµ.');
        return;
      }

      if(canVoiceListenNow()){
        setVoiceStatus('РЎР»СѓС€Р°СЋ...');
        setTimeout(startVoiceRecognition, 850);
      }else{
        setVoiceStatus('РќРµ СѓСЃР»С‹С€Р°Р» РІРѕРїСЂРѕСЃ. РќР°Р¶РјРё В«РџСЂРѕРґРѕР»Р¶РёС‚СЊВ».');
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
    setVoiceStatus('РњРёРєСЂРѕС„РѕРЅ Р·Р°РїСѓСЃРєР°РµС‚СЃСЏ...');
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

  setVoiceStatus('Р”РѕР±Р°РІСЊ С„РѕС‚Рѕ Р·Р°РґР°РЅРёСЏ');
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
        content:'РЇ РґРѕР±Р°РІРёР» С„РѕС‚Рѕ Р·Р°РґР°РЅРёСЏ РІ Р·РІРѕРЅРѕРє. Р”Р°Р»СЊС€Рµ РјРѕРё РІРѕРїСЂРѕСЃС‹ РјРѕРіСѓС‚ Р±С‹С‚СЊ РїСЂРѕ СЌС‚Рѕ С„РѕС‚Рѕ.'
      });
      state.learningMemory.totalPhotos = (state.learningMemory.totalPhotos || 0) + 1;
      saveMemory();
      renderSettings();

      if(voiceState.history.length > 16){
        voiceState.history = voiceState.history.slice(-16);
      }

      appendVoiceLine('bot','Р’РёР¶Сѓ С„РѕС‚Рѕ. РўРµРїРµСЂСЊ РїСЂРѕСЃС‚Рѕ СЃРєР°Р¶Рё РіРѕР»РѕСЃРѕРј, С‡С‚Рѕ РЅСѓР¶РЅРѕ РѕР±СЉСЏСЃРЅРёС‚СЊ РїРѕ СЌС‚РѕРјСѓ Р·Р°РґР°РЅРёСЋ.');
      setVoiceStatus('РЎР»СѓС€Р°СЋ РІРѕРїСЂРѕСЃ РїСЂРѕ С„РѕС‚Рѕ...');
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
  setVoiceStatus('Р”СѓРјР°СЋ...');
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
        chatTitle:'РЎРѕР·РІРѕРЅ СЃ РЈРјРЅРёРєРѕРј',
        imageDataUrl:voiceState.imageDataUrl || null,
        profile:profileForApi(),
        memory:memoryForApi(),
        mode:'ai'
      })
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data?.error || 'voice api error');

    const answer = data.text || 'РЇ РЅРµ СЃРјРѕРі РѕС‚РІРµС‚РёС‚СЊ. РџРѕРїСЂРѕР±СѓР№ СЃРєР°Р·Р°С‚СЊ РІРѕРїСЂРѕСЃ РµС‰С‘ СЂР°Р·.';

    voiceState.history.push({role:'user', content:text});
    voiceState.history.push({role:'assistant', content:answer});
    updateLearningMemory(text, answer, 'voice', hadPhoto);

    if(voiceState.history.length > 16){
      voiceState.history = voiceState.history.slice(-16);
    }

    appendVoiceLine('bot', answer);

    setVoiceStatus('РћР±СЉСЏСЃРЅСЏСЋ...');
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

    setVoiceStatus('AI РЅРµ РѕС‚РІРµС‚РёР», РїРѕРєР°Р·С‹РІР°СЋ РґРµРјРѕ-РѕС‚РІРµС‚.');
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
    'google СЂСѓСЃСЃРєРёР№',
    'google russian',
    'alena',
    'Р°Р»РµРЅР°',
    'milena',
    'РјРёР»РµРЅР°',
    'svetlana',
    'СЃРІРµС‚Р»Р°РЅР°',
    'irina',
    'РёСЂРёРЅР°',
    'pavel',
    'РїР°РІРµР»',
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
  value.textContent = rate.toFixed(2) + 'Г—';
}

function testVoiceSpeed(){
  if(!('speechSynthesis' in window)) return;

  if(voiceState.callOpen){
    stopVoiceRecognition();
    voiceState.autoListening = false;
    updateVoiceControlButton();
  }

  speakVoiceAnswer('РџСЂРёРІРµС‚! РЇ РЈРјРЅРёРє. РЎРµР№С‡Р°СЃ РїСЂРѕРІРµСЂСЏРµРј СЃРєРѕСЂРѕСЃС‚СЊ РјРѕРµРіРѕ РіРѕР»РѕСЃР°.');
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
      setVoiceStatus('РЎР»СѓС€Р°СЋ...');
      setTimeout(startVoiceRecognition, 520);
    }else{
      setVoiceStatus('Р“РѕС‚РѕРІ РїРѕРјРѕС‡СЊ');
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
      setVoiceStatus('РћР±СЉСЏСЃРЅСЏСЋ...');
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
    'СѓРјРЅРёРє РїРµСЂРµСЃС‚Р°РЅСЊ РіРѕРІРѕСЂРёС‚СЊ',
    'СѓРјРЅРёРє РѕСЃС‚Р°РЅРѕРІРёСЃСЊ',
    'СѓРјРЅРёРє СЃС‚РѕРї',
    'РїРµСЂРµСЃС‚Р°РЅСЊ РіРѕРІРѕСЂРёС‚СЊ',
    'РѕСЃС‚Р°РЅРѕРІРё РѕС‚РІРµС‚',
    'РѕСЃС‚Р°РЅРѕРІРёСЃСЊ',
    'С…РІР°С‚РёС‚ РіРѕРІРѕСЂРёС‚СЊ',
    'С…РІР°С‚РёС‚',
    'СЃС‚РѕРї',
    'Р·Р°РјРѕР»С‡Рё'
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

  setVoiceStatus('РћСЃС‚Р°РЅРѕРІРёР» РѕС‚РІРµС‚. РЎР»СѓС€Р°СЋ РЅРѕРІС‹Р№ РІРѕРїСЂРѕСЃ...');
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
        appendVoiceLine('user','РЈРјРЅРёРє, РїРµСЂРµСЃС‚Р°РЅСЊ РіРѕРІРѕСЂРёС‚СЊ');
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
  state.activeChat = 'Р”РѕРјР°С€РєР°';
  state.imageDataUrl = null;
  state.chats = {'Р”РѕРјР°С€РєР°':[{role:'bot', text:welcomeText(state.name)}]};
  state.chatOrder = ['Р”РѕРјР°С€РєР°'];
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

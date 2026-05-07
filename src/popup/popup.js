const i18n = {
    es: {
      title: "Configuración",
      lang: "Idioma:",
      stage1: "Nivel 1 (minutos):",
      stage2: "Nivel 2 (minutos):",
      stage3: "Nivel 3 (minutos):",
      save: "Guardar Preferencias",
      reset: "Resetear Contador",
      saved: "¡Preferencias guardadas!",
      resetDone: "¡Contador reiniciado!"
    },
    en: {
      title: "Settings",
      lang: "Language:",
      stage1: "Stage 1 (minutes):",
      stage2: "Stage 2 (minutes):",
      stage3: "Stage 3 (minutes):",
      save: "Save Preferences",
      reset: "Reset Timer",
      saved: "Preferences saved!",
      resetDone: "Timer reset!"
    }
  };
  
  const elements = {
    lang: document.getElementById('lang'),
    stage1: document.getElementById('stage1'),
    stage2: document.getElementById('stage2'),
    stage3: document.getElementById('stage3'),
    saveBtn: document.getElementById('saveBtn'),
    resetBtn: document.getElementById('resetBtn'),
    status: document.getElementById('status')
  };
  
  let currentLang = 'es';
  
  function updateUI(lang) {
    currentLang = lang;
    const t = i18n[lang];
    document.getElementById('ui-title').textContent = t.title;
    document.getElementById('ui-lang').textContent = t.lang;
    document.getElementById('ui-stage1').textContent = t.stage1;
    document.getElementById('ui-stage2').textContent = t.stage2;
    document.getElementById('ui-stage3').textContent = t.stage3;
    elements.saveBtn.textContent = t.save;
    elements.resetBtn.textContent = t.reset;
  }
  
  function showStatus(message, type = 'success') {
    elements.status.textContent = message;
    elements.status.className = type === 'success' ? 'status-success' : 'status-info';
    setTimeout(() => {
      elements.status.className = 'hidden';
    }, 2000);
  }
  
  function loadOptions() {
    chrome.storage.sync.get(
      { stage1: 5, stage2: 10, stage3: 15, lang: 'es' },
      items => {
        elements.stage1.value = items.stage1;
        elements.stage2.value = items.stage2;
        elements.stage3.value = items.stage3;
        elements.lang.value = items.lang;
        updateUI(items.lang);
      }
    );
  }
  
  function saveOptions() {
    const config = {
      stage1: parseInt(elements.stage1.value, 10),
      stage2: parseInt(elements.stage2.value, 10),
      stage3: parseInt(elements.stage3.value, 10),
      lang: currentLang
    };
  
    chrome.storage.sync.set(config, () => {
      showStatus(i18n[currentLang].saved, 'success');
    });
  }
  
  function resetTimer() {
    chrome.runtime.sendMessage({ action: 'resetTime' }, response => {
      if (response && response.success) {
        showStatus(i18n[currentLang].resetDone, 'info');
      }
    });
  }
  
  elements.lang.addEventListener('change', e => updateUI(e.target.value));
  elements.saveBtn.addEventListener('click', saveOptions);
  elements.resetBtn.addEventListener('click', resetTimer);
  document.addEventListener('DOMContentLoaded', loadOptions);
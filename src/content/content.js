let intervalId;

function checkAndApplyFriction() {
  chrome.storage.sync.get({ stage1: 5, stage2: 10, stage3: 15 }, config => {
    const FRICTION_LEVELS = [
      { time: config.stage1 * 60000, className: 'friction-stage-1' },
      { time: config.stage2 * 60000, className: 'friction-stage-2' },
      { time: config.stage3 * 60000, className: 'friction-stage-3' }
    ];

    chrome.runtime.sendMessage({ action: 'getTime' }, response => {
      if (chrome.runtime.lastError || !response || typeof response.timeSpent === 'undefined') return;

      const timeSpent = response.timeSpent;
      const rootElement = document.documentElement;

      FRICTION_LEVELS.forEach(level => {
        if (timeSpent >= level.time) {
          rootElement.classList.add(level.className);
        } else {
          rootElement.classList.remove(level.className);
        }
      });
    });
  });
}

function init() {
  if (intervalId) clearInterval(intervalId);
  checkAndApplyFriction();
  intervalId = setInterval(checkAndApplyFriction, 5000);
}

init(); 
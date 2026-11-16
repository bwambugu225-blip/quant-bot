// Shared 1-second ticker.
//
// Browsers throttle window timers in hidden tabs — down to once a minute under
// intensive throttling — which would stall the engine watchdog, the socket
// heartbeat and the reconnect watch exactly when the bot is meant to keep
// trading in the background. A dedicated Web Worker's timers are not throttled
// the same way, so the ticker runs there when Workers are available and falls
// back to a window interval otherwise. Subscribers share one timer; it stops
// when the last one unsubscribes.
const listeners = new Set();
let worker = null;
let interval = null;

function broadcast() {
  for (const fn of [...listeners]) {
    try { fn(); } catch (e) { console.error(e); }
  }
}

function ensureRunning() {
  if (worker || interval) return;
  if (typeof Worker !== 'undefined' && typeof Blob !== 'undefined'
    && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    try {
      const src = 'let h=null;onmessage=e=>{if(e.data==="start"){clearInterval(h);h=setInterval(()=>postMessage(1),1000);}else if(e.data==="stop"){clearInterval(h);h=null;}}';
      worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
      worker.onmessage = broadcast;
      worker.postMessage('start');
      return;
    } catch (e) { worker = null; }
  }
  interval = setInterval(broadcast, 1000);
  interval.unref?.();
}

function stop() {
  if (worker) { try { worker.postMessage('stop'); worker.terminate(); } catch (e) { /* ignore */ } worker = null; }
  if (interval) { clearInterval(interval); interval = null; }
}

// Subscribe to the 1s tick. Returns an unsubscribe function.
export function onTick(fn) {
  listeners.add(fn);
  ensureRunning();
  return () => {
    listeners.delete(fn);
    if (!listeners.size) stop();
  };
}

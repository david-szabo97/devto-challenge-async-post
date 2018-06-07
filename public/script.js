
/* global localStorage, fetch */

if (navigator.serviceWorker.controller) {
  console.log('SW OK')
} else {
  navigator.serviceWorker.register('sw.js', {
    scope: './'
  }).then(reg => {
    console.log('Service worker registered', reg)
  })
}

const QUEUE_KEY = 'queue'

const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || `[]`)

function addValueToQueue (value) {
  if (value < 0 || value > 9) return

  queue.push(value)
  saveQueueToStorage()
}

async function processQueue () {
  while (queue.length > 0) {
    const value = queue[0]
    await sendValueToServer(value)
    queue.shift()
    saveQueueToStorage()
  }
}

async function sendValueToServer (value) {
  return fetch('/save', { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({ value }) })
}

function saveQueueToStorage () {
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

[].forEach.call(document.querySelectorAll('input'), e => {
  e.addEventListener('keypress', e => {
    if (e.key >= 0 && e.key <= 9) {
      e.preventDefault()
      e.target.value = e.key
      addValueToQueue(e.target.value)
    }
  })
})

let check = document.querySelector('span')
function hideCheck () {
  check.style.visibility = 'hidden'
}

function showCheck () {
  check.style.visibility = 'visible'
}

let isProcessingQueue = false
setInterval(() => {
  if (!navigator.onLine) return hideCheck()
  if (isProcessingQueue || queue.length === 0) return
  hideCheck()

  isProcessingQueue = true
  processQueue().then(() => {
    isProcessingQueue = false
    showCheck()
  }).catch(err => {
    console.error(err)
    isProcessingQueue = false
  })
}, 50)

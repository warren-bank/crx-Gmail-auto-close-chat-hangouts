// ==UserScript==
// @name         Gmail - Hide Hangouts
// @description  Automatically close the chat tab after Gmail is opened.
// @version      0.1.0
// @match        *://mail.google.com/mail/u/*
// @icon         https://www.google.com/gmail/about/static/favicon.ico
// @run-at       document-idle
// @homepage     https://github.com/warren-bank/crx-Gmail-auto-close-chat-hangouts/tree/greasemonkey-userscript
// @supportURL   https://github.com/warren-bank/crx-Gmail-auto-close-chat-hangouts/issues
// @downloadURL  https://github.com/warren-bank/crx-Gmail-auto-close-chat-hangouts/raw/greasemonkey-userscript/greasemonkey-userscript/Gmail-auto-close-chat-hangouts.user.js
// @updateURL    https://github.com/warren-bank/crx-Gmail-auto-close-chat-hangouts/raw/greasemonkey-userscript/greasemonkey-userscript/Gmail-auto-close-chat-hangouts.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

var user_options = {
  "script_injection_delay_ms": 5000
}

var payload = function(){
  const triggerMouseEvent = (node, eventType) => {
    const event = document.createEvent('MouseEvents')
    event.initEvent(eventType, true, true)
    node.dispatchEvent(event)
  }

  const init = () => {
    const $chat_box = document.querySelector('div[aria-label="Hangouts"][role="complementary"]')
    const $chat_tab = $chat_box.querySelector('div[role="tab"][tabid="chat"]')
    const height    = $chat_box.clientHeight

    if (height) {
      triggerMouseEvent($chat_tab, 'mousedown')
      triggerMouseEvent($chat_tab, 'mouseup')
    }
  }

  init()
}

var get_hash_code = function(str){
  var hash, i, char
  hash = 0
  if (str.length == 0) {
    return hash
  }
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash  // Convert to 32bit integer
  }
  return Math.abs(hash)
}

var inject_function = function(_function){
  var inline, script, head

  inline = _function.toString()
  inline = '(' + inline + ')()' + '; //# sourceURL=crx_extension.' + get_hash_code(inline)
  inline = document.createTextNode(inline)

  script = document.createElement('script')
  script.appendChild(inline)

  head = document.head
  head.appendChild(script)
}

var bootstrap = function(){
  inject_function(payload)
}

setTimeout(
  bootstrap,
  user_options['script_injection_delay_ms']
)

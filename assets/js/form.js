// Progressive enhancement for the contact form: the send button is disabled until the consent
// box is ticked. Without JavaScript the button works and the server rejects a missing consent.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var box = document.getElementById('consent');
  var btn = document.getElementById('send');
  var msg = document.getElementById('consent-msg');
  function sync() {
    btn.disabled = !box.checked;
    if (box.checked) msg.hidden = true;
  }
  box.addEventListener('change', sync);
  form.addEventListener('submit', function (ev) {
    if (!box.checked) { ev.preventDefault(); msg.hidden = false; }
  });
  sync();
})();

// Ronin Props — интерактив сайта
(function () {
  // мобильное меню
  var burger = document.querySelector('.burger'), nav = document.querySelector('.top nav');
  if (burger) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  // слайдер «3D-модель → Покрас»
  document.querySelectorAll('.ba').forEach(function (ba) {
    var r = ba.querySelector('input');
    r.addEventListener('input', function () { ba.style.setProperty('--pos', r.value + '%'); });
  });

  // фильтры карточек (портфолио, доспехи)
  document.querySelectorAll('.filter').forEach(function (f) {
    var grid = f.nextElementSibling;
    f.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      f.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      grid.querySelectorAll('.card, .item').forEach(function (c) {
        c.hidden = b.dataset.f !== 'all' && (' ' + c.dataset.tags + ' ').indexOf(' ' + b.dataset.f + ' ') < 0;
      });
    });
  });

  // лайтбокс с зумом
  var lb = document.querySelector('.lightbox');
  if (lb) {
    var inner = lb.querySelector('.lb-inner');
    document.addEventListener('click', function (e) {
      var z = e.target.closest('.zoomable'); if (!z) return;
      e.preventDefault();
      var img = z.querySelector('img'); if (!img) return;
      var big = document.createElement('img'); big.src = img.dataset.full || img.currentSrc || img.src; big.alt = img.alt;
      inner.innerHTML = ''; inner.appendChild(big); inner.classList.remove('zoom'); lb.hidden = false;
    });
    inner.addEventListener('click', function (e) {
      var r = inner.getBoundingClientRect(), im = inner.querySelector('img');
      if (im) im.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
      inner.classList.toggle('zoom');
    });
    function close() { lb.hidden = true; }
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // калькулятор предзаказа
  var calc = document.querySelector('.calc');
  if (calc) {
    var base = { mask: [3900, 6], sword: [6500, 9], staff: [8500, 12], helmet: [12000, 16], armor: [25000, 26] };
    function upd() {
      var t = calc.elements['type'].value, len = +calc.elements['len'].value, b = base[t];
      calc.elements['lenv'].value = len;
      var k = t === 'sword' || t === 'staff' ? Math.max(0.7, len / 100) : 1;
      var led = calc.elements['led'].checked, fast = calc.elements['fast'].checked;
      var price = b[0] * k + (led ? 3500 : 0);
      var days = Math.round(b[1] * k) + (led ? 3 : 0);
      if (fast) { price *= 1.3; days = Math.max(3, Math.round(days * 0.6)); }
      var lo = Math.round(price / 100) * 100, hi = Math.round(price * 1.4 / 100) * 100;
      calc.querySelector('.calc-price').textContent = lo.toLocaleString('ru-RU') + ' – ' + hi.toLocaleString('ru-RU') + ' ₽';
      calc.querySelector('.calc-time').textContent = 'срок ≈ ' + days + '–' + (days + 5) + ' дней';
    }
    calc.addEventListener('input', upd); upd();
  }

  // форма заявки (демо: данные никуда не отправляются)
  var form = document.querySelector('form.order');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = form.querySelector('.form-msg');
    msg.hidden = false;
    if (!form.checkValidity()) { msg.textContent = 'Заполните имя, контакт и подтвердите согласие.'; return; }
    msg.textContent = 'Спасибо, ' + form.elements['name'].value + '! Это демо-версия сайта: заявка не отправляется на сервер.';
    form.reset();
  });
})();

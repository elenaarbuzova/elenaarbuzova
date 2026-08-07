(function () {
  var script = document.currentScript;
  if (!script) return;

  var origin = new URL(script.src).origin;
  var params = new URLSearchParams();
  var position = script.getAttribute('data-position') || 'bottom-right';

  function copy(attr, key) {
    var v = script.getAttribute(attr);
    if (v != null && v !== '') params.set(key || attr.replace(/^data-/, ''), v);
  }

  copy('data-accent', 'accent');
  copy('data-name', 'name');
  copy('data-position', 'position');
  copy('data-avatar', 'avatar');
  copy('data-size', 'size');
  copy('data-radius', 'radius');
  copy('data-icon', 'icon');
  copy('data-branding', 'branding');
  copy('data-greeting', 'greeting');
  if (script.getAttribute('data-id')) params.set('id', script.getAttribute('data-id'));

  var size = script.getAttribute('data-size') || 'medium';
  var dims =
    size === 'compact'
      ? { w: 320, h: 420 }
      : size === 'large'
        ? { w: 400, h: 560 }
        : { w: 360, h: 500 };

  var iframe = document.createElement('iframe');
  iframe.src = origin + '/embed?' + params.toString();
  iframe.title = script.getAttribute('data-name') || 'LabAgent chat';
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute(
    'style',
    [
      'position:fixed',
      position === 'bottom-left' ? 'left:12px' : 'right:12px',
      'bottom:12px',
      'width:' + dims.w + 'px',
      'height:' + dims.h + 'px',
      'max-width:calc(100vw - 24px)',
      'max-height:calc(100vh - 24px)',
      'border:0',
      'z-index:2147483646',
      'background:transparent',
      'color-scheme:normal',
      'overflow:hidden',
    ].join(';'),
  );

  function mount() {
    document.body.appendChild(iframe);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

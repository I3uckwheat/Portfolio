const centerText = document.querySelector('.center-text');
function scrollHandler(event) {
  if (window.pageYOffset > 150) centerText.classList.add('hide');
  if (window.pageYOffset < 150) document.querySelector('.center-text').classList.remove('hide');
}

window.onscroll = throttle(scrollHandler, 55);

function throttle(fn, limit = 250) {
  let wait = false;
  return () => {
    if (!wait) {
      fn.call();
      wait = true;
      setTimeout(() => {
        ait = false;
      }, limit);
    }
  };
}

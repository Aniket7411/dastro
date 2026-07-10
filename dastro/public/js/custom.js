$(document).ready(function() {
  $( window ).scroll(function() {
        var height = $(window).scrollTop();
        if(height >= 100) {
            $('header').addClass('fixed-menu');
        } else {
            $('header').removeClass('fixed-menu');
        }
    });
});



// ---- ---- Const ---- ---- //
const stars = document.querySelectorAll('.stars i');
const starsNone = document.querySelector('.rating-box');

// ---- ---- Stars ---- ---- //
stars.forEach((star, index1) => {
  star.addEventListener('click', () => {
    stars.forEach((star, index2) => {
      // ---- ---- Active Star ---- ---- //
      index1 >= index2
        ? star.classList.add('active')
        : star.classList.remove('active');
    });
  });
});


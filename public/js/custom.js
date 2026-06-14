$(function() {
  $( "#datepicker" ).datepicker();
});

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

$(document).ready(function(){
  $('.astrolger').owlCarousel({
    loop: true,
    margin:50,
    autoplay:true,
    nav:false,
    dots:true,
    responsive: {
        0: {
            items:1
        },
        600: {
            items:1
        },
        667: {
          items:1
        },
        1000: {
            items:2
        },
        1024: {
          items:4
        }
    }
 })


 $('.sucees-sty').owlCarousel({
  loop: true,
  margin:50,
  autoplay:true,
  nav:false,
  dots:true,
  responsive: {
      0: {
          items:1
      },
      600: {
          items:1
      },
      667: {
        items:1
      },
      1000: {
          items:2
      },
      1024: {
        items:3
      }
  }
})



$('.blogs-divb').owlCarousel({
  loop: true,
  margin:50,
  autoplay:true,
  nav:false,
  dots:true,
  responsive: {
      0: {
          items:1
      },
      600: {
          items:1
      },
      667: {
        items:1
      },
      1000: {
          items:2
      },
      1024: {
        items:3
      }
  }
})



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





$(function() {
  $('.flash1').on("click", function() {
    $('#flash2').css('background-color', '#72e1ff');
    $('#flash2').css('box-shadow', 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 2px 2px 32px rgba(142, 232, 255, 0.5)');
    //$('#flash2').css('transition-duration', '0.05s');
  });
});

/*
$(document).ready(function(){
  $('.cat').click(function(){
    $('.cat').removeClass('active').addClass('inactive');
     $(this).removeClass('inactive').addClass('active');
    });
})
*/

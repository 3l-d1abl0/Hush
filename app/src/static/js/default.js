
$(document).ready(function () {

  $('#search-button').on('click', function (e) {
    if ($('#search-input-container').hasClass('hdn')) {
      e.preventDefault();
      $('#search-input-container').removeClass('hdn')
      return false;
    }
  });

  $('#hide-search-input-container').on('click', function (e) {
    e.preventDefault();
    $('#search-input-container').addClass('hdn')
    return false;
  });

  $('.post-button').on('click', function (e) {
    e.preventDefault();
    const post = $('#user-post').val().trim();

    if (post == "") {
      $('.flash-message').text('Empty Post !');
      return false;
    }

    $.ajax({

      url: `/addPost`,
      type: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      data: JSON.stringify({ 'post': post }),
      success: function (result) {
        console.log(result);
      },
      error: function (error) {
        errorJson = JSON.parse(error.responseJSON);
        console.log(errorJson.error);
        $('.flash-message').text('Unable to Post ! Try Later !');

      }

    });

  });

});
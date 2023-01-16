
$(document).ready(function () {

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


      $("#follow-button").click(function(){

        let username = window.location.pathname.replace('/profile/','');

        if ($("#follow-button").text() == "+ Follow"){

          $.ajax({

            url: `/follow`,
            type: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            data: JSON.stringify({ 'username': username }),
            success: function (result) {
              console.log(result);
              $("#follow-button").text("\u2713 Following");
            },
            error: function (error) {
              errorJson = JSON.parse(error.responseJSON);
              console.log(errorJson.error);
            }
  
          });

        }else{
          
          $.ajax({

            url: `/unfollow`,
            type: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            data: JSON.stringify({ 'username': username }),
            success: function (result) {
              console.log(result);
              $("#follow-button").text("+ Follow");
            },
            error: function (error) {
              errorJson = JSON.parse(error.responseJSON);
              console.log(errorJson.error);
            }
  
          });
          
        }
      }); 
});
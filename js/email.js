function sendMail(treeID, message) {
    
    $.ajax({
      type: 'POST',
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      data: {
        'key': 'O-drKWVOtNNbL8s8TwGD8w',
        'message': {
          'from_email': 'issues@timberapp.ml',
          'to': [
              {
                'email': '35cool35@gmail.com',
                'type': 'to'
              }
            ],
          'autotext': 'true',
          'subject': 'YOUR SUBJECT HERE!',
          'html': 'A user has reported an issue at tree: #'+treeID+' ()'
        }
      }
     }).done(function(response) {
       console.log(response);
     });
}

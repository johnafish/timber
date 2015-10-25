function sendMail(treeID) {

    var flaggedTree = treeReference.child(treeID.toString());
    var flaggedGeo = fireBaseReference.child("_geofire").child(treeID.toString());
    var treeData, treeType, treeLong, treeLat;

    flaggedTree.once("value", function(snapshot) {
      treeType = snapshot.val().type;
    });

    flaggedGeo.once("value", function(snapshot) {
      treeLong = snapshot.val().l[0];
      treeLat = snapshot.val().l[1];
    });



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
          'subject': 'Maintenance issue with tree #'+treeID,
          'html': '<html><body>A user has reported the following issue:<br /><table><tr><td>Tree ID:</td><td>'+treeID+'</td></tr><tr><td>Tree Type:</td><td>'+treeType+'</td></tr><tr><td>Longitude:</td><td>'+treeLong+'</td></tr><tr><td>Latitude:</td><td>'+treeLat+'</td></tr></table></body></html>'
        }
      }
     }).done(function(response) {
       console.log(response);
     });
}

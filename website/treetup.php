<?php
$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$treeID = $_GET["tree"];
$time = $_GET["time"];
?>
<html>
<head>
    <title>Let's Treetup!</title>
    <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200,300' rel='stylesheet' type='text/css'>
    <link href="style.css" rel="stylesheet" type="text/css">
</head>
<body>
<header>
    <h1>LETS <span>TREE</span>TUP</h1>
</header>
    <h2 id="when"></h2>
<script>
var tree = "<?php echo $treeID; ?>";
var time = parseInt("<?php echo $time; ?>");
var d = new Date(0);
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
d.setUTCSeconds(time);
var hours = d.getHours();
var minutes = d.getMinutes();
var amPm;
if (hours>=12){
    amPm = "pm";
} else {
    amPm = "am";
}

if(hours>12) {
    hours = hours - 12;
}
if (hours==0){
    hours = 12
}

if (minutes<10){
    minutes = "0"+minutes;
}
var dateString = "at "+hours+":"+minutes+amPm+" on "+months[d.getMonth()]+" "+d.getDate();
document.getElementById("when").innerHTML = dateString;
</script>
</body>
</html>

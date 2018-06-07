// Initialize Firebase
var config = {
    apiKey: "AIzaSyCCH6HeJFzTlLy0-GeqgaXNR-D-mYtLHEY",
    authDomain: "train-schedule-b2f87.firebaseapp.com",
    databaseURL: "https://train-schedule-b2f87.firebaseio.com",
    projectId: "train-schedule-b2f87",
    storageBucket: "train-schedule-b2f87.appspot.com",
    messagingSenderId: "176593645106"
};
firebase.initializeApp(config);

var database = firebase.database();

// take info from form on click
$("#trainAddRouteButton").click(function (event) {
    event.preventDefault();

    // pull info from form fields
    var trainName = $("#trainName").val().trim();
    var trainDestination = $("#trainDestination").val().trim();
    var trainFirstDeparture = moment.utc($("#trainFirstDeparture").val().trim(), "HH:mm").format("HH:mm");
    var trainFrequencyOfDeparture = $("#trainFrequencyOfDeparture").val().trim();

    // new train object
    var newTrainRoute = {
        name: trainName,
        destination: trainDestination,
        serviceBegins: trainFirstDeparture,
        frequency: trainFrequencyOfDeparture
    };

    // push to database
    database.ref().push(newTrainRoute);

    // clear forms
    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#trainFirstDeparture").val("");
    $("#trainFrequencyOfDeparture").val("");

    console.log(newTrainRoute);
});

// database logic
database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstDeparture = childSnapshot.val().serviceBegins;
    var trainFrequencyOfDeparture = childSnapshot.val().frequency;

    var nextScheduledTime;
    var eta;

    $("#tableBody").append(
        "<tr><td>" + 
        trainName + 
        "</td><td>" + 
        trainDestination +
        "</td><td>" + 
        trainFrequencyOfDeparture +
        "</td><td>" + 
        nextScheduledTime + 
        "</td><td>" + 
        eta + 
        "</td></tr>"
    );
});





/*
// Assumptions
var tFrequency = 3;

// Time is 3:30 AM
var firstTime = "03:30";

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFrequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
*/
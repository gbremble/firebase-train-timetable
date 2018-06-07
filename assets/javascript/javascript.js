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

    // moment.js
    var firstDepartureConverted = moment(trainFirstDeparture, "HH:mm").subtract(1, "years");

    var timeSinceServiceStart = moment().diff(moment(firstDepartureConverted), "minutes");
    console.log("time since service start: " + timeSinceServiceStart);

    var timeSinceLastDeparture = timeSinceServiceStart % trainFrequencyOfDeparture;
    var eta = trainFrequencyOfDeparture - timeSinceLastDeparture;

    var nextScheduledArrival = moment().add(eta, "minutes").format("HH:mm");

    // add to page HTML
    $("#tableBody").append(
        "<tr><td>" +
        trainName +
        "</td><td>" +
        trainDestination +
        "</td><td>" +
        trainFrequencyOfDeparture +
        "</td><td>" +
        nextScheduledArrival +
        "</td><td>" +
        eta +
        "</td></tr>"
    );
});
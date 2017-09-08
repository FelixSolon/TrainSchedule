//Make sure that your app suits this basic spec:

/*In this assignment, you'll create a train schedule application that incorporates Firebase to host arrival
and departure data. Your app will retrieve and manipulate this information with Moment.js.
This website will provide up-to-date information about various trains,
namely their arrival times and how many minutes remain until they arrive at their station.*/

//create and track a list of trains and times

var numberOfTrains = 0
var trainIncrement = "train" + numberOfTrains
// Initialize Firebase
var config = {
    apiKey: "AIzaSyC4co2CH20NefKKd5j0-ZtY63VVkgBd0W8",
    authDomain: "train-scheduler-65918.firebaseapp.com",
    databaseURL: "https://train-scheduler-65918.firebaseio.com",
    projectId: "train-scheduler-65918",
    storageBucket: "train-scheduler-65918.appspot.com",
    messagingSenderId: "390848669383"
};
firebase.initializeApp(config);
var database = firebase.database();
$(window).on('load', function(){
    console.log("Yes this is triggering");
    database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
        console.log("So is this");
              // storing the snapshot.val() in a variable for convenience
              var currentTime = moment("HH:mm");
              var a = currentTime;
              console.log("Current Time = " + currentTime);
              var sv = snapshot.val();
              console.log(sv);  
              var actualTime = moment(sv.firstTrainTime, "HH:mm")._i;
              var b = actualTime;
              console.log("This is A: " + a);
              console.log("This is B: " + b);
              console.log("Hopefully this is rational" + a.diff(b, 'minutes'));
              console.log("This is a thing " + actualTime);
              console.log("This should be the new number" + sv.number);
              numberOfTrains = sv.number;
              // Console.loging the last user's data
              // Change the HTML to reflect
              $("#mainTable").append("<tr><td>" + sv.number + "</td><td>" + sv.name + "</td><td>" + sv.destination + "</td><td>" + sv.frequency + "</td><td>" + sv.frequency + "</td><td>Total Billed ($)</td></tr>")
              // Handle the errors
            }, function(errorObject) {
              console.log("Errors handled: " + errorObject.code);
            });
});

//stolen Firebase code
//So this broke literally everything when I tried to incorporate it. So it's commented out so I have it for reference if I need it, but things seem to be working.
/*database.ref().limitToLast(1).orderByChild("dateAdded").on("child_added", function(snapshot) {
          // storing the snapshot.val() in a variable for convenience
          var sv = snapshot.val();

          // Console.loging the last user's data

          // Change the HTML to reflect
          $("#mainTable").append("<tr><td>" + sv.number + "</td><td>" + sv.name + "</td><td>" + sv.destination + "</td><td>" + sv.frequency + "</td><td>" + sv.frequency + "</td><td>Total Billed ($)</td></tr>")

          // Handle the errors
        }, function(errorObject) {
          console.log("Errors handled: " + errorObject.code);
        });*/
//Once everything's loaded, do a thing.
$(document).ready(function(){

    //When you click the submit button...
    $(document).on("click", "#submitButton", function(){
        //...don't refresh the page...
        event.preventDefault();
        //...pull the input name, destination, first train time, and frequency from the form and trim whitespace...
        var trainName = $("#trainNameForm").val().trim();
        var destination = $("#destinationForm").val().trim();
        var firstTrainTime = $("#firstTrainTimeForm").val().trim();
        var frequency = $("#frequencyForm").val().trim();
        //abuse poor, innocent moment.js to convert input times to something rational I can do math to.
        //ToDo: Sanitize the input and pop up a modulo or alert yelling at the user
        var actualTime = moment(firstTrainTime, "HH:mm")._i;
        //...create a new object. Which should, hopefully, be in indexPosition "numberOfTrains". If not everything is going to break.
        numberOfTrains+=1;

        var postData = {name: trainName,
            number: numberOfTrains,
            destination: destination,
            frequency: frequency,
            firstTrainTime: actualTime,
            dateAdded: firebase.database.ServerValue.TIMESTAMP}

        database.ref().push(postData);
        


    //ends the submit button function
    });

//Code this app to calculate when the next train will arrive; this should be relative to the current time.



//the end of the document.ready function
});
/*When adding trains, administrators should be able to submit the following:
    Train Name
    Destination 
    First Train Time -- in military time
    Frequency -- in minutes

    Users from many different machines must be able to view same train times.
Styling and theme are completely up to you. Get Creative!*/
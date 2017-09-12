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
//When the page loads, do a thing.
$(window).on('load', function(){
    //Debug to make sure thing is actually done.
    console.log("Yes this is triggering");
    //Look at the database, sort things by when they were shoved in there, and when a thing is added, do a thing.
    //Although this *also* seems to work as a "when you load, pull all the data from the cloud" function.
    //Which it shouldn't.
    //So while I really should just keep quiet and make it look intentional, can you explain why "on('child_added')" also seems to work as a "pull everything" function?
    database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
        //Also making sure the Thing is done.
        console.log("So is this");
              
              // storing the snapshot.val() in a variable for convenience
              var currentTime = moment().format("HH:mm");
              
              //I am commenting out old lines rather than deleting them
              //Because Moment.js is semi-magical
              //And I'd rather have my old code to revert to if everything breaks.
              //var a = currentTime;

              //Debug, because I'm afraid if I don't watch it my moment.js will stop working.
              console.log("Current Time = " + currentTime);

              //This is a bit of code I saw that seemed just soooo lazy, I felt I had to include it.
              var sv = snapshot.val();

              //convert the input "First train time" data to something workable. 
              var actualTime = moment(sv.firstTrainTime, "HH:mm")._i;

              //more old code
              //var b = actualTime;
              //console.log("This is A: " + a);
              //console.log("This is B: " + b);

              //Do math to times, by means of libraries. 
              var difference = moment(actualTime, "HH:mm").diff(moment(currentTime, "HH:mm"), 'minutes');

              //Do math to times by means of math.
              var untilNext = difference % sv.frequency;

              //I think this is here to keep track of what number each new train should be even after closing and reloading the page.
              //This was an earlier bit of code, so I'm not totally sure, though.
              numberOfTrains = sv.number;

              //Initialize my variables like a good person.
              var displayDifference;

              //You probably know this already, but...
              //Debugging a system when you have to either change all your data, or wait until counters roll over is a gigantic pain.
              //Also, I badly need to refactor this as I'm repeating myself. This code is WET enough it could have been writen in Houston.
              if (untilNext < 0){
                //The console logs here are ugly, but I think I'm going to keep doing this in my if/switch statements as otherwise I'm not sure how to tell which bit actually ran.
                console.log("I ran the first if statement!");
                //Make sure things are *actually numbers* before doing math to them. Because Javascript thinks this is the web of 1995 and everything is a string otherwise.
                displayDifference = parseInt(sv.frequency) + parseInt(untilNext);
                //I somehow feel like this is cheating, but I'm just adding the above number of minutes to the current time to get the next train time.
                displayNextTime = moment().add(displayDifference, 'minutes').format('hh:mm A');
                $("#mainTable").append("<tr><td>" + sv.number + "</td><td>" + sv.name + "</td><td>" + sv.destination + "</td><td>" + sv.frequency + "</td><td>" + displayNextTime + "</td><td>" + displayDifference + "</td></tr>")  
              } else if (untilNext == 0) {
                //I'll note that I'm still very bad about accidently declaring variables rather than using comparisons in the If statements.
                //It took a bit to debug why the following Else statement suddenly had untilNext = 0 until I realized that, rather than erroring out if you screw up how many == signs you need, JS just runs with it.
                console.log("I ran the second if statement!");
                //More or less teh same thing as above, but doesn't have negative ".diff" to cause problems.
                displayNextTime = moment().add(sv.frequency, 'minutes').format('hh:mm A');
                $("#mainTable").append("<tr><td>" + sv.number + "</td><td>" + sv.name + "</td><td>" + sv.destination + "</td><td>" + sv.frequency + "</td><td>" + displayNextTime + "</td><td>" + sv.frequency + "</td></tr>")
              } else {
              console.log("I ran the Else statement!");
              //debugging why untilNext was 0 for some reason (the reason being that I was dumb)
              console.log(untilNext)
              //put stuff on the page
              displayNextTime = moment().add(untilNext, 'minutes').format('hh:mm A');
              $("#mainTable").append("<tr><td>" + sv.number + "</td><td>" + sv.name + "</td><td>" + sv.destination + "</td><td>" + sv.frequency + "</td><td>" + displayNextTime + "</td><td>" + untilNext + "</td></tr>")
              };

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
        //Although I will note "Prevent the user from entering swear words as the first train time" was *not* part of the specification.
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

//the end of the document.ready function
//because I always forget
});
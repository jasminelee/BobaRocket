function setCookie(cname,cvalue,exdays)
                {
                var d = new Date();
                d.setTime(d.getTime()+(exdays*24*60*60*1000));
                var expires = "expires="+d.toGMTString();
                document.cookie = cname+"="+cvalue+"; "+expires;
                }

                function getCookie(cname)
                {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++) 
                  {
                  var c = ca[i].trim();
                  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
                  }
                return "";
                };


// Initialize your app
var myApp = new Framework7();

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Expose Internal DOM library
var $$ = myApp.$;

// Events for specific pages when it initialized
$$(document).on('pageInit', function (e) {
    var page = e.detail.page;
    // Handle Modals Page event when it is init
        $$('.demo-alert').tap(function () {
            myApp.alert('Hello!');
        });
        $$('.demo-confirm').tap(function () {
            myApp.confirm('Are you feel good today?', function () {
                myApp.alert('Great!');
            });
        });
        $$('.login-prompt').tap(function () {
                function checkCookie()
                {
                var user=getCookie("username");
                if (user!="")
                  {
                  alert("Welcome again " + user);
                  }
                else {
                var phonenum = "";
                myApp.prompt('What is your name?', function (data) {
                user = data;
                    setCookie("username",data,30);
                    myApp.prompt('And number?', function(data) {
                        phonenum = data;
                        setCookie("phonenumber",phonenum,30);
                    });
                    });
                  }

                }
                checkCookie();

        });

    // Pull To Refresh Demo
    if (page.name === 'arrivalorders') {
        // Dummy Content

        var songs = ['Jasmine Tea', 'Green Tea', 'Soymilk', 'Mango Smoothie'];
        var authors = ['Sumukh', 'James', 'Stephanie', 'Jasmine'];
        // Pull to refresh content
        var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        // Add 'refresh' listener on it
        ptrContent.on('refresh', function (e) {
            // Emulate 2s loading
            setTimeout(function () {
                var picURL = 'http://hhhhold.com/88/d/jpg?' + Math.round(Math.random() * 100);
                var song = songs[Math.floor(Math.random() * songs.length)];
                var author = authors[Math.floor(Math.random() * authors.length)];
                var linkHTML = '<li class="item-content">' +
                                    '<div class="item-media"><img src="' + picURL + '" width="44"/></div>' +
                                    '<div class="item-inner">' +
                                        '<div class="item-title-row">' +
                                            '<div class="item-title">' + song + '</div>' +
                                        '</div>' +
                                        '<div class="item-subtitle">' + author + '</div>' +
                                    '</div>' +
                                '</li>';
                ptrContent.find('ul').prepend(linkHTML);
                // When loading done, we need to "close" it
                myApp.pullToRefreshDone();
            }, 2000);
        });
    }

    //Location Marker
        if (page.name === 'buypage') {
            var locmark = document.getElementById("LocationMarker");
            locmark.innerHTML = getCookie("loc");
        };

//Firebase
if (page.name === "leaderboard") {
  // Prompt the user for a name to use.
  var name = getCookie("username"),
      currentStatus = "going to " + getCookie("loc");

  // Get a reference to the presence data in Firebase.
  var userListRef = new Firebase("https://blinding-fire-3833.firebaseio.com/");

  // Generate a reference to a new location for my user with push.
  var myUserRef = userListRef.push();

  // Get a reference to my own presence status.
  var connectedRef = new Firebase("https://blinding-fire-3833.firebaseio.com/");
  connectedRef.on("value", function(isOnline) {
    if (isOnline.val()) {
      // If we lose our internet connection, we want ourselves removed from the list.
      myUserRef.onDisconnect().remove();

      // Set our initial online status.
      setUserStatus("going to " + getCookie("loc"));
    } else {

      // We need to catch anytime we are marked as offline and then set the correct status. We
      // could be marked as offline 1) on page load or 2) when we lose our internet connection
      // temporarily.
      setUserStatus(currentStatus);
    }
    });

  // A helper function to let us set our own state.
  function setUserStatus(status) {
    // Set our status in the list of online users.
    currentStatus = status;
    myUserRef.set({ name: name, status: status });
  }

  function getMessageId(snapshot) {
    return snapshot.name().replace(/[^a-z0-9\-\_]/gi,'');
  }

  // Update our GUI to show someone"s online status.
  userListRef.on("child_added", function(snapshot) {
    var user = snapshot.val();
    console.log(user);
    
    var theLi = $("<li/>")
      .attr("id", getMessageId(snapshot))
      .appendTo("#presenceDiv");

    var theA = $("<a/>")
        .addClass("item-link item-content")
        //.setAttribute("href", "home.html")
        .appendTo(theLi);

    var div1 = $("<div/>")
        .addClass("item-inner")
        .appendTo(theA)

    var div2 = $("<div/>")
        .addClass("item-title")
        .attr("id", getMessageId(snapshot))
        .text(user.name + " is currently " + user.status)
        .appendTo(div1)

    // theA.href = "home.html"
    // theA.setAttribute("href", "home.html")

  });

  // Update our GUI to remove the status of a user who has left.
  userListRef.on("child_removed", function(snapshot) {
    $("#presenceDiv").children("#" + getMessageId(snapshot))
      .remove();
  });

  // Update our GUI to change a user"s status.
  userListRef.on("child_changed", function(snapshot) {
    var user = snapshot.val();
    $("#presenceDiv").children("#" + getMessageId(snapshot))
      .text(user.name + " is currently " + user.status);
  });

  // Use idle/away/back events created by idle.js to update our status information.
  // document.onIdle = function () {
  //   setUserStatus("☆ idle");
  // }
  // document.onAway = function () {
  //   setUserStatus("☄ away");
  // }
  // document.onBack = function (isIdle, isAway) {
  //   setUserStatus("★ online");
  // }

  // setIdleTimeout(5000);
  // setAwayTimeout(10000);
}

if (page.name === "orderpage") {
  var LEADERBOARD_SIZE = 20;

  // Create our Firebase reference
  var scoreListRef = new Firebase('https://bobaorders.firebaseio.com///scoreList');

  // Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
  var htmlForPath = {};

  // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
  function handleScoreAdded(scoreSnapshot, prevScoreName) {
    var newScoreRow = $("<tr/>");
    newScoreRow.append($("<td/>").append($("<em/>").text(scoreSnapshot.val().name)));
    newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));

    // Store a reference to the table row so we can get it again later.
    htmlForPath[scoreSnapshot.name()] = newScoreRow;

    // Insert the new score in the appropriate place in the table.
    if (prevScoreName === null) {
      $("#leaderboardTable").append(newScoreRow);
    }
    else {
      var lowerScoreRow = htmlForPath[prevScoreName];
      lowerScoreRow.before(newScoreRow);
    }

    //var ordern = [scoreSnapshot.val().name, scoreSnapshot.val().score]
    //return ordern
  }

  // Helper function to handle a score object being removed; just removes the corresponding table row.
  function handleScoreRemoved(scoreSnapshot) {
    var removedScoreRow = htmlForPath[scoreSnapshot.name()];
    removedScoreRow.remove();
    delete htmlForPath[scoreSnapshot.name()];
  }

  // Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
  var scoreListView = scoreListRef.limit(LEADERBOARD_SIZE);

  // Add a callback to handle when a new score is added.
  scoreListView.on('child_added', function (newScoreSnapshot, prevScoreName) {
     handleScoreAdded(newScoreSnapshot, prevScoreName);
  });
  // Add a callback to handle when a score is removed
  scoreListView.on('child_removed', function (oldScoreSnapshot) {
    handleScoreRemoved(oldScoreSnapshot);
  });

  // Add a callback to handle when a score changes or moves positions.
  var changedCallback = function (scoreSnapshot, prevScoreName) {
    handleScoreRemoved(scoreSnapshot);
    handleScoreAdded(scoreSnapshot, prevScoreName);
  };
  scoreListView.on('child_moved', changedCallback);
  scoreListView.on('child_changed', changedCallback);
  // When the user presses enter on scoreInput, add the score, and update the highest score.
  $("#scoreInput").keypress(function (e) {
    if (e.keyCode == 13) {
      var newScore = String($("#scoreInput").val());
      var name = $("#nameInput").val();
      $("#scoreInput").val("");

      if (name.length === 0)
        return;



    var theOrders = $("#orders").append("<li><a class='item-link item-content'><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+ newScore +"</div><div class='item-subtitle'>"+ name + "</div></div></div></a></li>");

      var userScoreRef = scoreListRef.child(name);
      
      // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
      userScoreRef.setWithPriority({ name:name, score:newScore }, newScore);
    }
  });

}


});

// Required for demo popover
$$('.popover a').tap(function () {
    myApp.closeModal('.popover');
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage(){
	mainView.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link">Back</a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="page2" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="page2.html">Page 2</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}
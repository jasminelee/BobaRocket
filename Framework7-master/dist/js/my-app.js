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
            myApp.prompt('What is your name?', function (data) {
                // @data contains input value
                var name = data;
                var phonenum;
                myApp.prompt('And number?', function(data) {phonenum=data;});
            });
        });
    // Pull To Refresh Demo
    if (page.name === 'arrivalorders') {
        // Dummy Content
        var songs = ['Yellow Submarine', 'Don\'t Stop Me Now', 'Billie Jean', 'Californication'];
        var authors = ['Beatles', 'Queen', 'Michael Jackson', 'Red Hot Chili Peppers'];
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

    //Location Data Puller
        if (page.name === 'locations') {
        $$(".item-content").tap(function(event) { //replace item-title with whatever var location is
        //console.log(.item-title);
        var test = $$(".item-title")
        var loc = test.attr("id")
});
};

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
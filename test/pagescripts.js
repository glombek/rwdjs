//Show the small div to screens 320px or narrower.
//This should be done in CSS, but it makes for a simple example!
//We use the single-function overload here as it makes our code simpler!
rwdjs.addRule(null, 321, function (on) {
    $('.small').toggle(on);
});

//Show the large div to screens wider than 320px.
//This should be done in CSS, but it makes for a simple example!
//We use the single-function overload here as it makes our code simpler!
rwdjs.addRule(320, null, function (on) {
    $('.large').toggle(on);
});

//Change the text of the large div for screens wider than 1024px.
//I can't think of a usecase for this, but there might be one!
//We're using the two-function overload here for readability since both methods are so different.
rwdjs.addRule(1024, null,
    function () {
        $('.large').each(function () {
            //store the information we require to undo this action
            $(this).data('defaultText', $(this).text());
            $(this).text('Extra large!');
        });
    },
    function () {
        //the second method (or the first one when the parameter is false) is to undo the first method
        $('.large').each(function () {
            $(this).text($(this).data('defaultText'));
        });
    });

//Show a tabbed interface for screens wider than 40rem.
//A more realistic example this time!
//We're using the two-function overload here for readability again. The first function is clearly for creating the tabs, while the second clearly destroys it.
rwdjs.addRule(rwdjs.utils.remToPx(40), null,
    function () {
        //create the tabs
        $('.tabMeUp').tabs();
    },
    function () {
        //undo the tabs
        $('.tabMeUp').tabs('destroy');
    });
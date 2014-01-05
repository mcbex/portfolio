// functions to execute on pageload

(function(){

    function makePaper() {
        var height = $(document).height(),
            paper = Raphael($('body').get(0), 500, height);

        $(paper.canvas).css('position', 'absolute');

        return paper;
    }

    function fixFooter() {
        // setting height 100% on body and html will break the window
        // pageYOffset so lets fix the footer this way
        $('.main-container').css('min-height', $(document).height());
    }

    function setBackground() {
        $.ajax({
            url: 'http://' + document.location.host + '/services/backgrounds/squares/20/' + $(document).height(),
            type: 'GET',
            dataType: 'json',
            success: function(resp) {
                var paper = makePaper();
                paper.add(resp.background);
            },
            error: function(resp) {
                console.log(resp);
            }
        });
    }

    $(document).ready(function() {

        fixFooter();
        setBackground();

    });

})();

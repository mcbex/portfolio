(function(){

    $(document).ready(function() {

        var height = $('body').height();

        function makePaper() {
            var paper = Raphael($('body').get(0), 500, height);

            $(paper.canvas).css('position', 'absolute');

            return paper;
        }

        $.ajax({
            url: 'http://' + document.location.host + '/services/backgrounds/squares/20/' + height,
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

    });

})();

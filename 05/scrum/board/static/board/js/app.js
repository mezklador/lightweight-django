var app = (function ($) {
    var config = $('#config')
    var app = JSON.parse(config.text())

    $(document).ready(function(){
        var router = new app.router()
    })

    return app
})(jQuery);

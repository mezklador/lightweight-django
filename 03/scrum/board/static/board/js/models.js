(function ($, Backbone, _, app) {

/*
    CSRF helper functions token directly from Django docs
*/

    function csrfSafeMethod(method) {
        // HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/i.test(method));
    }

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(
                        cookie.substring(name.length + 1)
                    );
                    break;
                }
            }
        }
        return cookieValue;
    }

/*
    Setup jQuery ajax calls to handle CSRF
*/

    $.ajaxPrefilter(function (settings, originalOptions, xhr) {
        var csrfToken;
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            csrfToken = getCookie('csrfToken');
            xhr.setRequestHeader('X-CSRFToken', csrfToken);
        }
    });

    var Session = Backbone.Model.extend({
        defaults: {
            token: null
        },
        initialize: function (options) {
            this.options = options;
            $.ajaxPrefilter($.proxy(this._setupAuth, this));
            this.load();
        },
        load: function () {
            var token = localStorage.apiToken;
            if (token) {
                this.set('token', token);
            }
        },
        save: function (token) {
            this.set('token', token);
            if (token === null) {
                localStorage.removeItem('apiToken');
            } else {
                localStorage.apiToken = token;
            }
        },
        delete: function () {
            this.save(null);
        },
        authenticated: function () {
            return this.get('token') != null;
        },
        _setupAuth: function (settings, originalOptions, xhr) {
            if (this.authenticated()) {
                xhr.setRequestHeader(
                    'Authorization',
                    'Token ' + this.get('token')
                );
            }
        }
    });

    app.session = new Session();

    /*app.models.Sprint = Backbone.Model.extend({});
    app.models.Task = Backbone.Model.extend({});
    app.models.User = Backbone.Model.extend({});

    app.collections.ready = $.getJSON(app.apiRoot);
    app.collections.ready.done(function (data) {
        app.collections.Sprints = Backbone.Collection.extend({
            model: app.models.Sprint,
            url: data.sprints
        });
        app.sprints = new app.collections.Sprints();
        app.collections.Tasks = Backbone.Collection.extend({
            model: app.models.Task,
            url: data.tasks
        });
        app.tasks = new app.collections.Tasks();
        app.collections.Users = Backbone.Collection.extend({
            model: app.models.User,
            url: data.users
        });
        app.users = new app.collections.Users();
    });*/

    var BaseCollection = Backbone.Collection.extend({
        parse: function (response){
            this._next = response.next;
            this._previous = response.previous;
            this._count = response.count;
            return response.results || [];
        },
        getOrFetch: function (id) {
            var result = new $.Deffered(),
                model = this.get(id);
            if (!model) {
                model = this.push({id: id});
                model.fetch({
                    success: function (model, response, options) {
                        result.resolve(model);
                    },
                    error: function (model, response, options) {
                        result.reject(model, response);
                    }
                });
            } else {
                result.resolve(model);
            }
            return result;
        }
    });

    app.collections.ready = $.getJSON(app.apiRoot);
    app.collections.ready.done(function (data) {
        app.collections.Sprints = BaseCollection.extend({
            model: app.models.Sprint,
            url: data.sprints
        });
        app.sprints = new app.collections.Sprints();
        app.collections.Tasks = Backbone.Collection.extend({
            model: app.models.Task,
            url: data.tasks
        });
        app.tasks = new app.collections.Tasks();
        app.collections.Users = Backbone.Collection.extend({
            model: app.models.User,
            url: data.users
        });
        app.users = new app.collections.Users();
    });
    var BaseModel = Backbone.Model.extend({
        url: function () {
            var links = this.get('links'),
                url = links && links.self;
            if (url) {
                url = Backbone.Model.prototype.url.call(this);
            }
            return url;
        }
    });

    app.models.Sprint = BaseModel.extend({});
    app.models.Task = BaseModel.extend({});
    app.models.User = BaseModel.extend({
        idAttributemodel: 'username'
    });

})(jQuery, Backbone, _, app);
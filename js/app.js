"use strict";

var Photos = Backbone.Collection.extend({
    url: "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
    // parse method returns or transforms the desired portion of API data
    parse: function (data) {
        return data.items;
    }
});
var photos = new Photos();

var SearchView = Backbone.View.extend({
    collection: photos,
    el: "#search__form",
    template: _.template($("#mainTemplate").html()),
    events: {
        'click .search__form--btn': 'displayPhotos'
    },
    displayPhotos: function (evt) {
        evt.preventDefault();
        var self = this;
        // Retrieves the value the visitor typed in the input field
        var searchTag = this.$('#search__input').val();

        // Blocks input field and Enables button "Searching..."
        $('#search__input').prop('disabled', true);
        $('#submit-btn').text('Searching…');

        this.collection.fetch({
            data: {
                tags: searchTag,
                format: 'json'
            },
            success: function () {
                self.searchSuccess()
            },
            error: function () {
                alert('Not working!')
            }
        });
    },
    render: function () {
        this.$el.html(this.template());
    },

    renderPhotos: function () {
        var photosView = new PhotosView();
        photosView.render(photos);
    },

    searchSuccess: function () {
        // Reanables button "searching..."
        $('#search__input').prop('disabled', false);
        $('#submit-btn').text('Search');
        this.renderPhotos();
    }
});

var PhotosView = Backbone.View.extend({
    el: "#photos",
    template: _.template($("#photosTemplate").html()),
    render: function (collectionOfPhotos) {
        this.$el.html(this.template({photos: collectionOfPhotos.toJSON()}));
    }
});

var searchView = new SearchView();
searchView.render();
const { windows } = require('sdk/window/utils');

require("sdk/windows").browserWindows.on('open', function(w) {
  initSearchTextRemover();
});

exports.onUnload = function (reason) {
    for (let window of windows('navigator:browser', {includePrivate:true})) {
        var searchbar = window.document.getElementById('searchbar');
        if (searchbar && searchbar.doSearch.oldDoSearch) {
            searchbar.doSearch = searchbar.doSearch.oldDoSearch;
        }
    }
};

function generateNewDoSearch(oldDoSearch) {
    var newDoSearch = function() {
        oldDoSearch.apply(this, arguments);
        this.value = '';
    }
    newDoSearch.oldDoSearch = oldDoSearch;
    return newDoSearch;
}

function initSearchTextRemover() {
    for (let window of windows('navigator:browser', {includePrivate:true})) {
        var searchbar = window.document.getElementById('searchbar');
        if (searchbar && !searchbar.doSearch.oldDoSearch) {
            searchbar.doSearch = generateNewDoSearch(searchbar.doSearch);
        }
    }
}


initSearchTextRemover();

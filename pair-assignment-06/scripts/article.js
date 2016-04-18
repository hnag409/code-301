function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// Take the rawData, instantiate all the articles
Article.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  rawData.forEach(function(ele) {
    Article.all.push(new Article(ele));
  });
};

// Retrieve data from either a local or remote source,
// and process it, then hand off control to the View.
Article.fetchAll = function() {
  $.ajax({
    url: '/data/ipsumArticles.json',
    dataType: 'json',
    method: 'HEAD'
  }).done(function(data, textStatus, request) {
    var eTag = request.getResponseHeader('eTag');

    if (eTag == localStorage.eTag && localStorage.rawData) {
      Article.loadAll(JSON.parse(localStorage.rawData));

      articleView.initIndexPage();
    } else {
      $.getJSON('/data/ipsumArticles.json').done(function (data, textStatus, request) {
        Article.loadAll(data);

        localStorage.rawData = JSON.stringify(data);
        localStorage.eTag = request.getResponseHeader('eTag');

        articleView.initIndexPage();
      });
    }
  });
};

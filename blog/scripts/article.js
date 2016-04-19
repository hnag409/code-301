(function(module) {
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

  Article.loadAll = function(rawData) {
    rawData.sort(function(a,b) {
      return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
    });

    // DONE: Refactor this forEach code, by using a `.map` call instead, since what we are
    // trying to accomplish is the transformation of one colleciton into another.

    // rawData.forEach(function(ele) {
    //   Article.all.push(new Article(ele));
    // })
    Article.all = rawData.map(function(ele) {
      return new Article(ele);
    });
  };

  // This function will retrieve the data from either a local or remote source,
  // and process it, then hand off control to the View.
  Article.fetchAll = function(fetchAllCallback) {
    if (localStorage.rawData) {
      Article.loadAll(JSON.parse(localStorage.rawData));
      fetchAllCallback();
    } else {
      $.getJSON('/data/hackerIpsum.json', function(rawData) {
        Article.loadAll(rawData);
        localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
        fetchAllCallback();
      });
    }
  };

  Article.numWordsAll = function() {
    return Article.all.map(function(article) {
      var wordGrab = article.body.split(' ');
      return wordGrab.length; // Grab the words from the `article` `body`.
    })
    .reduce(function(previousVal, currentVal) {
      var sum = previousVal + currentVal;
      return sum;// Sum up all the values!
    });
  };

  // TODO: Chain together a `map` and a `reduce` call to produce an array of unique author names.
  Article.allAuthors = function() {
    return Article.all.map(function(article) {
      var authorGrab = article.author;
      return authorGrab;
    })
    .reduce(function(previousVal, currentVal) {
      if(previous.indexOf(currentVal) < 0) {
        previousVal.push(currentVal);
      }
      return previousVal;
    }, []);
  };

  Article.numWordsByAuthor = function() {
    // TODO: Transform each author string into an object with 2 properties: One for
    // the author's name, and one for the total number of words across the matching articles
    // written by the specified author.
    return Article.allAuthors().map(function(author) {
      return {
        // name:
        // numWords: someCollection.someArrayMethod().map(...).reduce(...), ...
      };
    });
  };
}) (window);

/*
 *
 * mads - version 2.00.01
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */
var mads = function (options) {
  var _this = this;

  this.render = options.render;

  /* Body Tag */
  this.bodyTag = document.getElementsByTagName('body')[0];

  /* Head Tag */
  this.headTag = document.getElementsByTagName('head')[0];

  /* json */
  if (typeof json === 'undefined' && typeof rma !== 'undefined') {
    this.json = rma.customize.json;
  } else if (typeof json !== 'undefined') {
    this.json = json;
  } else if (window.location.hostname.indexOf('localhost') > -1) {
    this.json = '/sample.json';
  } else {
    this.json = '';
  }

  /* load json for assets */
  this.loadJs(this.json, function () {
    _this.data = json_data;
    _this.render.render();
  });

  /* Get Tracker */
  if (typeof custTracker === 'undefined' && typeof rma !== 'undefined') {
    this.custTracker = rma.customize.custTracker;
  } else if (typeof custTracker !== 'undefined') {
    this.custTracker = custTracker;
  } else {
    this.custTracker = [];
  }

  /* CT */
  if (typeof ct === 'undefined' && typeof rma !== 'undefined') {
    this.ct = rma.ct;
  } else if (typeof ct !== 'undefined') {
    this.ct = ct;
  } else {
    this.ct = [];
  }

  /* CTE */
  if (typeof cte === 'undefined' && typeof rma !== 'undefined') {
    this.cte = rma.cte;
  } else if (typeof cte !== 'undefined') {
    this.cte = cte;
  } else {
    this.cte = [];
  }

  /* tags */
  if (typeof tags === 'undefined' && typeof tags !== 'undefined') {
    this.tags = this.tagsProcess(rma.tags);
  } else if (typeof tags !== 'undefined') {
    this.tags = this.tagsProcess(tags);
  } else {
    this.tags = '';
  }

  /* Unique ID on each initialise */
  this.id = this.uniqId();

  /* Tracked tracker */
  this.tracked = [];
  /* each engagement type should be track for only once and also the first tracker only */
  this.trackedEngagementType = [];
  /* trackers which should not have engagement type */
  this.engagementTypeExlude = [];
  /* first engagement */
  this.firstEngagementTracked = false;

  /* RMA Widget - Content Area */
  this.contentTag = document.getElementById('rma-widget');

  /* URL Path */
  this.path = typeof rma !== 'undefined' ? rma.customize.src : '';

  /* Solve {2} issues */
  for (var i = 0; i < this.custTracker.length; i++) {
    if (this.custTracker[i].indexOf('{2}') !== -1) {
      this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
    }
  }
};

/* Generate unique ID */
mads.prototype.uniqId = function () {
  return new Date().getTime();
}

mads.prototype.tagsProcess = function (tags) {
  var tagsStr = '';

  for (var obj in tags) {
    if (tags.hasOwnProperty(obj)) {
      tagsStr += '&' + obj + '=' + tags[obj];
    }
  }

  return tagsStr;
}

/* Link Opner */
mads.prototype.linkOpener = function (url) {
  if (typeof url !== 'undefined' && url !== '') {
    if (typeof mraid !== 'undefined') {
      mraid.open(url);
    } else {
      window.open(url);
    }
  }
}

/* tracker */
mads.prototype.tracker = function (tt, type, name, value) {
  /*
   * name is used to make sure that particular tracker is tracked for only once
   * there might have the same type in different location, so it will need the name to differentiate them
   */
  name = name || type;

  if (typeof this.custTracker !== 'undefined' && this.custTracker !== '' && this.tracked.indexOf(name) === -1) {
    for (var i = 0; i < this.custTracker.length; i++) {
      var img = document.createElement('img');

      if (typeof value === 'undefined') {
        value = '';
      }

      /* Insert Macro */
      var src = this.custTracker[i].replace('{{rmatype}}', type);
      src = src.replace('{{rmavalue}}', value);

      /* Insert TT's macro */
      if (this.trackedEngagementType.indexOf(tt) !== '-1' || this.engagementTypeExlude.indexOf(tt) !== '-1') {
        src = src.replace('tt={{rmatt}}', '');
      } else {
        src = src.replace('{{rmatt}}', tt);
        this.trackedEngagementType.push(tt);
      }

      /* Append ty for first tracker only */
      if (!this.firstEngagementTracked && tt === 'E') {
        src = src + '&ty=E';
        this.firstEngagementTracked = true;
      }

      /* */
      img.src = src + this.tags + '&' + this.id;

      img.style.display = 'none';
      this.bodyTag.appendChild(img);

      this.tracked.push(name);
    }
  }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
  var script = document.createElement('script');
  script.src = js;

  if (typeof callback !== 'undefined') {
    script.onload = callback;
  }

  this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function (href) {
  var link = document.createElement('link');
  link.href = href;
  link.setAttribute('type', 'text/css');
  link.setAttribute('rel', 'stylesheet');

  this.headTag.appendChild(link);
}

var AdUnit = function () {
  var _this = this;
  this.app = new mads({
    'render': this
  })

  this.app.loadCss(this.app.path + 'css/style.css');
}

AdUnit.prototype.render = function () {
  var _this = this;
  this.app.contentTag.innerHTML = `
    <div class="adunit-container">
      <div class="slides">
        <div class="one"></div>
        <div class="two"></div>
        <div class="three"></div>
        <div class="four"></div>
      </div>
      <input
        type="range"
        min="0"
        max="1000"               
        step="2"                
        value="1000"             
        data-orientation="vertical" />
      <div class="first-text">
        <strong>Lihat kandungan air<br/>Keran rumah anda<br/></strong>
        <span>Geser ke bawah dan<br/>bersikhan dengan Pureit</span>
      </div>
      <div class="second-text">
        <strong>Menyaring<br/>kotoran dan<br/>parasit!</strong>
      </div>
      <div class="third-text">
        <strong>Membunuh<br/>bakteri!</strong>
      </div>
      <div class="fourth-text">
        <strong>Siap minum!</strong><br/>
        <span>Ingin mencoba Pureit<br/>di rumah Anda?</span>
        <div class="button">Ya, Saya Tertarik!</div>
      </div> 
      <div class="outlay"></div>
    </div>`;

  this.app.loadJs(this.app.path + 'js/jquery-3.1.1.slim.min.js', function () {

    $('.slides div.one').css({
      backgroundImage: 'url(' + _this.app.path + 'img/slide1.png'
    });
    $('.slides div.two').css({
      backgroundImage: 'url(' + _this.app.path + 'img/slide2.png'
    });
    $('.slides div.three').css({
      backgroundImage: 'url(' + _this.app.path + 'img/slide3.png'
    });
    $('.slides div.four').css({
      backgroundImage: 'url(' + _this.app.path + 'img/slide4.png'
    });

    _this.app.loadJs(_this.app.path + 'js/rangeslider.min.js', function () {



      $slider = $('input[type="range"]').rangeslider({
        polyfill: false,
        onInit: function () {
          $(this)[0].$handle.css({
            backgroundImage: 'url(' + _this.app.path + 'img/thumb.png)'
          });
        },
        onSlide: function (position, value) {
          if ((value / 1000) > 0.6) {
            var cur = (1000 - value) / 333.333;
            var old = 1 - cur;
            $('.slides div.one, div.first-text').css({
              opacity: old
            })
            $('.slides div.two, div.second-text').css({
              opacity: cur
            })

            $('.slides div.three, .slides div.four, div.third-text, div.fourth-text').css({
              opacity: 0
            })
          }

          if ((value / 1000) > 0.3 && (value / 1000) < 0.6) {
            cur = (1000 - value) / 666.666;
            old = 1 - cur;
            $('.slides div.two, div.second-text').css({
              opacity: old
            })
            $('.slides div.three, div.third-text').css({
              opacity: cur
            })

            $('.slides div.four, .slides div.one, div.fourth-text').css({
              opacity: 0
            })
          }

          if ((value / 1000) < 0.4) {
            cur = (1000 - value) / 1000;
            old = 1 - cur;
            $('.slides div.three, div.third-text').css({
              opacity: old
            })
            $('.slides div.four').css({
              opacity: cur
            })
          }

          
        },
        onSlideEnd: function(position, value) {
          if (value === 0) {
            $slider.prop('disabled', true).data('plugin_rangeslider').update(); 
          }
        }
      });

      $slider.on('change', function(i) {
        console.log(i)
      })
    });
  });
}

var adUnit = new AdUnit();

/*
 *
 * Unit Testing for mads
 *
 */
var testunit = function () {
  /* pass in object for render callback */
  this.app = new Mads({
    'render': this
  });

  console.log(typeof this.app.bodyTag !== 'undefined');
  console.log(typeof this.app.headTag !== 'undefined');
  console.log(typeof this.app.custTracker !== 'undefined');
  console.log(typeof this.app.path !== 'undefined');
  console.log(typeof this.app.contentTag !== 'undefined');

  this.app.loadJs('https://code.jquery.com/jquery-1.11.3.min.js', function () {
    console.log(typeof window.jQuery !== 'undefined');
  });

  this.app.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');
}

/*
 * render function
 * - render has to be done in render function
 * - render will be called once json data loaded
 */
testunit.prototype.render = function () {
  console.log(this.app.data);

  this.app.contentTag.innerHTML =
    '<div class="container"><div class="jumbotron"> \
            <h1>Hello, world!</h1> \
            <p>...</p> \
            <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p> \
        </div></div>';

  this.app.custTracker = ['http://www.tracker2.com?type={{type}}&tt={{tt}}', 'http://www.tracker.com?type={{type}}'];

  this.app.tracker('CTR', 'test');
  this.app.tracker('E', 'test', 'name');
  this.app.tracker('E', 'test', 'name2');

  this.app.linkOpener('http://www.google.com');
}
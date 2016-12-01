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
  if (typeof json === 'undefined' && typeof rma !== 'undefined' && typeof rma.customize.json !== 'undefined') {
    this.json = rma.customize.json;
  } else if (typeof json !== 'undefined') {
    this.json = json;
  } else if (window.location.hostname.indexOf('localhost') > -1) {
    this.json = '/sample.json';
  } else {
    this.json = '';
  }

  /* fet */
  if (typeof fet == 'undefined' && typeof rma != 'undefined' && typeof rma.customize.fet != 'undefined') {
    this.fet = rma.customize.fet;
  } else if (typeof json != 'undefined') {
    this.fet = fet;
  } else {
    this.fet = [];
  }

  this.fetTracked = false;

  /* load json for assets */
  if (typeof this.json === 'object') {
    setTimeout(function () {
      _this.data = this.json;
      //_this.render.render();
    }, 600)
  } else if (typeof this.json != 'undefined') {
    this.loadJs(this.json, function () {
      _this.data = json_data;
      //_this.render.render();
    });
  } else {
    _this.data = {};
    //_this.render.render();
  }


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

  if (tt == 'E' && !this.fetTracked) {
    for (var i = 0; i < this.fet.length; i++) {
      var t = document.createElement('img');
      t.src = this.fet[i];

      t.style.display = 'none';
      this.bodyTag.appendChild(t);
    }
    this.fetTracked = true;
  }

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

  this.render();
}

AdUnit.prototype.render = function () {
  var _this = this;
  var urluni = this.app.path + 'img/thumb.png'
  var urlnotion = this.app.path + 'img/thumb_note.gif'
  this.app.contentTag.innerHTML = '<div class="adunit-container">' +
    '<div class="thankyou"></div>' +
    '<div class="first-part" style="display:none;">' +
    '<img src="' + urlnotion + '" alt="" class="notion" />' +
    '<div class="slides">' +
    '<div class="one"></div>' +
    '<div class="two"></div>' +
    '<div class="three"></div>' +
    '<div class="four"></div>' +
    '</div>' +
    '<input type="range" min="0" max="1000" step="2" value="1000" data-orientation="vertical" />' +
    '<div class="first-text">' +
    '<strong>Lihat kandungan air<br/>Keran rumah anda<br/></strong>' +
    '<span>Geser ke bawah dan<br/>bersikhan dengan Pureit</span>' +
    '</div>' +
    '<div class="second-text">' +
    '<strong>Menyaring<br/>kotoran dan<br/>parasit!</strong>' +
    '</div>' +
    '<div class="third-text">' +
    '<strong>Membunuh<br/>bakteri!</strong>' +
    '</div>' +
    '<div class="fourth-text">' +
    '<strong>Siap minum!</strong><br/>' +
    '<span>Ingin mencoba Pureit<br/>di rumah Anda?</span>' +
    '<div class="button"></div>' +
    '</div>' +
    '</div>' +
    '<div class="form">' +
    '<div class="main">' +
    '<img src="' + urluni + '" alt="" />' +
    '<div class="box">' +
    '<form action="#">' +
    '<h1>GRATIS DEMO<br/>DI RUMAH ANDA</h1>' +
    '<input type="text" placeholder="Nama *" class="input_name" required />' +
    '<input type="text" placeholder="Mobile *" onkeypress="return event.charCode >= 48 && event.charCode <= 57" class="input_mobile" required />' +
    '<input type="email" placeholder="Email *" class="input_email" required />' +
    '<input type="text" placeholder="Postal Code *" onkeypress="return event.charCode >= 48 && event.charCode <= 57" maxlength="8" class="input_post" required />' +
    '<button type="submit" class="submit">SUBMIT</button>' +
    '</form>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
  this.app.loadJs(this.app.path + 'js/jquery-3.1.1.min.js', function () {

    $('.slides div.one').css({
      'background-image': 'url(' + _this.app.path + 'img/slide1-c.png)'
    });
    $('.slides div.two').css({
      'background-image': 'url(' + _this.app.path + 'img/slide2-c.png)'
    });
    $('.slides div.three').css({
      'background-image': 'url(' + _this.app.path + 'img/slide3-c.png)'
    });
    $('.slides div.four').css({
      'background-image': 'url(' + _this.app.path + 'img/slide4-c.png)'
    });
    $('.thankyou').css({
      'background-image': 'url(' + _this.app.path + 'img/thankyou.png)'
    })

    _this.app.loadJs(_this.app.path + 'js/rangeslider.min.js', function () {
      $('.form').find('form').on('submit', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var nameEl = $('.form').find('.input_name');
        var mobileEl = $('.form').find('.input_mobile');
        var emailEl = $('.form').find('.input_email');
        var postEl = $('.form').find('.input_post');

        var name = nameEl.val();
        var mobile = mobileEl.val();
        var email = emailEl.val();
        var post = postEl.val();

        if (!/\S/.test(name)) {
          nameEl.css('border', '1px solid red');
          return false;
        }

        if (!/\S/.test(mobile)) {
          mobileEl.css('border', '1px solid red');
          return false;
        }

        if (!/\S/.test(email)) {
          emailEl.css('border', '1px solid red');
          return false;
        }

        if (!/\S/.test(post)) {
          postEl.css('border', '1px solid red');
          return false;
        }

        var userId = 2754;
        var campaignId = 0;
        var studioId = 278; //MA IST - 274, MA EXP - 275, MW IST - 278, MW EXP - 279
        var trackId = 2072; //MA IST - 2070, MA EXP - 2071, MW IST - 2072, MW EXP - 2073
        var targetEmail = 'dion@mobilewalla.com,adhie@mobileads.com';
        var data = '[\
        {%22fieldname%22:%22text_1%22,%22value%22:%22' + name + '%22},\
        {%22fieldname%22:%22text_2%22,%22value%22:%22' + mobile + '%22},\
        {%22fieldname%22:%22text_3%22,%22value%22:%22' + email + '%22},\
        {%22fieldname%22:%22text_4%22,%22value%22:%22' + post + '%22}\
        ]';

        var url = 'https://www.mobileads.com/api/save_lf?contactEmail=' + targetEmail + '&gotDatas=1&element=' + data + '&user-id=' + userId + '&studio-id=' + studioId + '&tab-id=1&trackid=' + trackId + '&referredURL=Sample%20Ad%20Unit&callback=leadGenCallback';
        _this.app.loadJs(url)
          /* Submit FOrm */
        _this.app.tracker('E', 'Submit')

        console.log(name + ' ' + mobile + ' ' + email + ' ' + post)

        $('.form input').prop('disabled', true);
        $('.form').find('.submit').text('Terima kasih');

        $('.thankyou').fadeIn('slow')
      })

      $('.adunit-container').on('touchstart mousedown', function () {
        $('.notion').css('display', 'none');
      })

      $('.form').css({
        'background-image': 'url(' + _this.app.path + 'img/lastbg.png)'
      });

      $('.fourth-text .button').on('click', function () {

        _this.app.tracker('E', 'Form')

        $('.first-part').fadeOut('slow', function () {
          $('.form').fadeIn('slow')
        })
      })

      var let1 = true, let2 = true, let3 = true

      $slider = $('input[type="range"]').rangeslider({
        polyfill: false,
        onInit: function () {
          var img = new Image();
          img.onload = function () {
            $('.first-part').fadeIn();
          }
          img.src = _this.app.path + 'img/slide1-c.png'


          $(this)[0].$handle.css({
            'background-image': 'url(' + _this.app.path + 'img/thumb.png)'
          });
        },
        onSlide: function (position, value) {
          if (position < 200 && let1) {
            $('.slides div.one').fadeOut('slow');
            setTimeout(function () {
              $('.slides div.two').fadeIn('slow', function () {
                let1 = false
              })
            }, 100)
          }

          if (position < 80 && let2) {
            $('.slides div.two').fadeOut('slow');
            setTimeout(function () {
              $('.slides div.three').fadeIn('slow', function () {
                let2 = false
              })
            }, 100)
          }


        },
        onSlideEnd: function (position, value) {
          if (value <= 20) {
            $slider.prop('disabled', true).data('plugin_rangeslider').update();
            $('.slides div.three').fadeOut('slow');
            setTimeout(function () {
              $('.slides div.four').fadeIn('slow', function () {
                $('div.fourth-text').css('opacity', 1).show();
              })
            }, 100)
          }
        }
      });
    });
  });
}

var leadGenCallback = function () {
  console.log('submitted')
  $('.form').find('.submit').prop('disabled', true);
  $('.form').fadeOut('slow');
  setTimeout(function() {
    $('.thankyou').fadeIn('slow');
  }, 100);
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

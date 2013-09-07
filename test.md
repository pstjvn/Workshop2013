title: JavaScript and single page applications
output: test.html
controls: false

--
# SPA in 2013
## JavaScript and single page apps
## Peter Janakiev
## [regardingscot@gmail.com](mailto:regardingscot@gmail.com)

--

### What is a "single page application"?
* An application that loads only once in the browser and from then on user interaction is conducted without ever leaving the page
* Usually involves a lot of JavaScript
* Lots of "widgets" and "custom elements"

--

### What is a large scale JavaScript program?
* More than 100,000 LOC
* More than 2 developers
* Mostly everything you see from Google as well as Facebook, NYT web view, Meebo, Imo.im, Flowdock etc.

--

### Combined?
* 'Native like' behaviour in the browser.
* Full control of user interaction.
* Off-line
* On your desktop (Chrome apps)
* Access to hardware
* and more..

--

### History

The SPA circa 1999

## ![](admin-console.jpg)

--

### History

Code looked like this:

    <html>
      <script src="..."></script>
      ...x20
    <body>
    <iframe id="..">
      ...
      <div onclick="globalFnName();" onhover="top[framename].method"></div>
      ...
    </iframe>
    <iframe id=".."></iframe>
    <iframe id=".."></iframe>
    </body>
    </html>

--

### History

Mostly a mess of tricks and quirks:

    document.write('<iframe src="script.js"></iframe>')

    document.write('<script>....</scr' + 'ipt>');

    window.onload=function() {
      top[framename].globalReference[0].method();
    };

    document.write('<object id="KJDSYWUEWDJNWKHDKW32DHWD"></object>');
    // The id is fake, but using the right ID will render
    // ActiveX text edit control in IE<8

--

### History

New bread of apps (Gmail): (circa 2005)

![](gmail.png)

--

### History

Google decides to rock the web by reinventing the JS programming

Develops Closure tools in-house and uses it to refocus Java devs to JavaScript

    /**
     * @constructor
     * @extends {goog.ui.Control}
     * @param {goog.dom.DomHelper=} opt_domHelper
     * @param {goog.ui.ControlRenderer=} opt_renderer
     */
    goog.ui.widget.Calendar = function(opt_domHelper, opt_renderer) {
      ...
    };

--

### History

During the same time in the wild:

* jQuery
* MooTools (takes on "classes")
* Prototype

--

### History

## Lets make developers life easier:

jQuery

    $('myclassname[type="password"]').on('click', function() {..});

Made it much easier to deal with browsers and allowed to start thinking more for the app logic and less for the host system.

--

### History

## Make inheritance and mixins easier:

    myClass = new Class({
      Extends: [],
      Implements: [],
      initialize: function() {}, // same as constructor function
      method1: function() {},
      method2: function() {
        this.parent(); // call parent method
      }
    });
    // Usage
    new myClass();

--

### History

2009 - 2011

ES5, Array methods, shims and polifils become the base for larger projects and frameworks

Vendors start to implements all sort of interesting features to make it easier to develop interactive experiences

--

### History

* CSS3 - transform, translate, filters, shaders, SVG filters etc.
* WebWorkers - CPU intensive tasks
* ArrayBuffers
* FileAPI
* Canvas
* Video / Audio
* WebGL
* WebSocket (tcp -> latency).

--

### History

Companies start developer outreach:

* [Patterns for large scale JS apps](http://addyosmani.com/largescalejavascript/) - Google
* [JavaScript performance best practices](http://developer.nokia.com/Community/Wiki/JavaScript_Performance_Best_Practices) - Nokia
* and mode (Adobe, Microsoft etc).

--

### Present

Data binding: Backbone, AngularJS, Ember - one problem, many solutions, mostly incompatible.

* Useful for data presentation and partially for data interaction models.
* Not very useful for other class of problems (video, audio, images, design, cad/cam etc)

--

### Present

Polymer / Brick - custom sets of polyfils and elements for the Web Components.

* Too idealistic (everything is an Element, including your ajax requests)
* Should be responsive and work on touch (but it does not).
* Still it is not clear how it will fit in what we know as best practices from the last 10 years.

--

### Present

* [fame.us] - custom rendering infrastructure (based on transforms with matrix3d)
* webGL - custom user interfaces (world of Oz)
* games - canvas with sprites and interface with game controlers + fullscreen
* [SkyDrive.com] - M$ Excel and Word for the web
* AppScript - JavaScript for Google applications
* Emscripten - C/C++ compiled to asm.js (or ArrayBuffers)
* LLJS - low level JavaScript (ArrayBuffers and manual memory management)

--

### The future

Mostly Web Components

    <pdf src="mybook.pdf"></pdf>

    // or

    <webglgame resume="true"></webglgame>

    // or

    <excel sheet="mydocument" on-change="saveToCloud"></excel>

Framework to bind them all: use what you already know - DOM, events, splinkle JS here and there.

--

### Today

Lots of tools for lots of tasks:

* requireJS - deps management
* backbone - data binding and synchronization
* jquery (or alternative) for browser compat
* polyfils for Video/Audio/sockets etc.
* less/sass
* lots of plugins and libraries for specific tasks

(more than 50 solutions for charts alone!)

--

### Today

The developer is reading most of the time and trying to make things work together. In lots of tasks there is a solution around the corner and with a little more reading / tweking it can just work...

--

### Today

What about tasks that there is not solution ready for us?

There comes the "ninja" (no, not THAT "ninja")!

--

### Today

--

### History
AJAX - Initially used for XML with XSLT in the browser (as designed by MicoSoft)

[www.backbase.com/portal-software]() - Initially developer an Ajax library trying to sell it, later reorganized into portal software and later still specialized in banking business.
--
### History

* Fetch the xml and the xsl, transform the node and insert it in the document.
* Deigned for viewing data, not interacting (innerHTML, replace/add node).
* Poor support in non-IE browsers.
--
### History

JSON - structured serilization of data that can be parsed right into live JS objects

* eval
* later - JSON.parse
--
### History
Emerging frameworks

The monoliths

* dojo
* YUI
* other..
--
### History

Data binding: one way, two way, sync

Backbone, Meteor, AngularJS, Ember etc.

--
### History
In the same time at Netflix and other content providers:

* People still prefer to consume content on the bigger screen (TV)
* STB devices are really slow and have miniscule amounts of RAM
* Smart TVs are still an idea in someone elses head
--
### History

The problem: while libraries exists and have good performance and cost effecitveness for the Desktop, on low powered device the solutions simply do not work:

* craches
* lags
* different set of user interactions
--

### Examples
## Longa.com
## ![](longa.jpg)
~ 340k LOC / 312KB
--
### Examples
## Longa.com
## ![](longa.jpg)
--
### Examples
## Longa.com
## ![](longa.jpg)
--
# Questions?
## Get in touch
## [pstj.blogspot.com]()
## [gtalk:regardingscot@gmail.com]()


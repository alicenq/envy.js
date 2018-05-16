envy.js
======
A free javascript browser environment utility library

Installation
======
There are two versions packaged. One is the development version, the other is a minified version. I believe this should be self explanatory. 

Git Clone
------
```
git clone https://github.com/alicenq/envy.js.git
cd envy.js/dist
```

NPM
------
`npm install envy-jsutil`



UNPKG
------

Development
```html
<script src='https://unpkg.com/envy-jsutil/dist/envy.js'></script>
```


Production
```html
<script src='https://unpkg.com/envy-jsutil/dist/envy.min.js'></script>
```



Window Utility
======

on
------
This is used to register window events, such as onload. Unlike the standard events however, this allows you to register multiple callbacks, which will then be called in whatever sequence they were registered. 

Usage:
 ```javascript
NV.on('load', function(){
    alert('The window has loaded!')
})
```

onload
------
This is simply shorthand for NV.on('load', ...)

Usage: 
```javascript
NV.onload(function(){
    alert('The window has loaded!')
})
```


Document Utility 
======

import
------
Used to import an external script by creating a &lt;script&gt; tag. A Promise is returned. If a reference child is specified this script will be inserted before the reference child, otherwise it'll be inserted before the envy script.

Usage: 
```javascript
// Simple script import
NV.import('my/script.js')

// Prints out a script tag 
NV.import('my/script.js', { type: 'text/javascript' }).then(console.log)
```

link
------
Used to import an external file, usually a stylesheet by creating a &lt;link&gt; tag. A Promise is returned. If a reference child is specified this script will be inserted before the reference child, otherwise it'll be inserted before the envy script.

Usage: 
```javascript
// Simple CSS import
NV.link('my/stylesheet.css')

// Prints out a link tag 
NV.link('my/stylesheet.css', { type: 'text/css', rel: 'stylesheet' }).then(console.log)
```

Object Utility
------

fetchJson
------
An extension of the fetch API which simply returns an object in its Promise instead of a Response. This can already be done quite easily using the fetch API, this just makes it faster and easier to type.

Usage: 
```javascript
// Prints decoded JSON data
NV.fetchJson('/my/path').then(console.log)
```

fetchText
------
An extension of the fetch API which simply returns a string in its Promise instead of a Response. This can already be done quite easily using the fetch API, this just makes it faster and easier to type.

Usage: 
```javascript
// Prints text data
NV.fetchData('/my/path').then(console.log)
```

merge
------
This performs a deep version of Object.assign by copying data from a source object to a target object. The last parameter is an optional merge strategy. This can be either a callback function or one of the following strings: 'theirs', 'ours', 'sum', 'error'. By default if undefined this is 'theirs'

This works recursively so when used on an object will merge all root-level parameters as well as every child object.


Usage:
```javascript
// prints { a:2, b:2, c:3 }
console.log(NV.merge(
    { a: 2 }, 
    { b: 2, c: 3 }
));	

// prints { a:100, b:2, c:3 }
console.log(NV.merge(
    { a: 100 }, 
    { a: 1, b: 2, c: 3}, 
    'ours'
));	

// prints { a:50, b:2, c:3 }
console.log(NV.merge(
    { a: 100 },
    { a: 0, b: 2, c: 3 }, 
    function(a, b){ return (a+b)/2; } 
));	

// prints { a: [0, 1, 2, 100, 200, 300], b: {c: 1, d: 1} }
console.log(NV.merge(
    { a: [0, 1, 2], b: {c: 1} },
    { a: [100, 200, 300], b: {d: 1} },
    'combine'
));	



```




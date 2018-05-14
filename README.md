envy.js
======
A free javascript browser environment utility library

Downloading
======
There are two versions packaged. One is the development version, the other is a minified version. I believe this should be self explanatory. TODO: get this published if it gets enough attention


Window Events
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

Object Utility
------

fetchJson
------
An extension of the fetch API which simply returns an object in its Promise instead of a Response. This can already be done quite easily using the fetch API, this just makes it faster and easier to type.

Usage: 
```javascript
NV.fetchJson('/my/path')
.then(function(obj){
	alert(typeof(obj))
})
.catch(console.warn)
```

fetchData
------
An extension of the fetch API which simply returns a string in its Promise instead of a Response. This can already be done quite easily using the fetch API, this just makes it faster and easier to type.

Usage: 
```javascript
NV.fetchData('/my/path')
.then(function(data){
	alert(data)
})
.catch(console.warn)
```

merge
------
This performs a deep version of Object.assign by copying data from a source object to a target object. The last parameter is an optional merge strategy. This can be either a callback function or one of the following strings: 'theirs', 'ours', 'sum', 'error'. By default if undefined this is 'theirs'

This works recursively so when used on an object will merge all root-level parameters as well as every child object.


Usage:
```javascript
// prints { a:1, b:2, c:3 }
console.log(NV.merge(
    { a: 2 }, 
    { b: 2, c: 3 }
));	

// prints { a:3, b:2, c:3 }
console.log(NV.merge(
    { a: 3 }, 
    { a: 1, b: 2, c: 3}, 
    'ours'
));	

// prints { a:4, b:2, c:3 }
console.log(NV.merge(
    { a: 7 },
    { a: 1, b: 2, c: 3 }, 
    function(a, b){ return (a+b)/2; } 
));	

// This is not a shallow merge!
// prints { a: {a1: 1, a2: 2}, b: {b1: 3, b2: 4} }
console.log(NV.merge(
    { a: { a1: 1 }, b: { } },
    { a: { a2: 2 }, b: { b1: 3, b2: 4 } }
));	


```




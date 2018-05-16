"use strict"
/* global NV:false */

function NV() { }


/**
 * Shortcut for NV.on('load', callback) (@see NV.on)
 * 
 * @param {function} callback Callback function which will receive the event as its first and only argument
 * @returns {void}
 */
NV.onload = function (callback) {
    var previous = window.onload;
    window.onload = function (ev) {
        if (previous) previous(ev)
        callback(ev)
    }.bind(window)
}

/**
 * An extension of window events that allows for multiple callbacks to be registered. Each callback is invoked in the order in which it is registered.
 * 
 * @param {string} event The name of the event. This is the same as the function to call minus the 'on' prefix.
 * @param {Function} callback Callback function which will receive the event as its first and only argument
 * @returns {void}
 */
NV.on = function (event, callback) {
    var previous = window['on' + event];
    window['on' + event] = function (ev) {
        if (previous) previous(ev)
        callback(ev)
    }.bind(window)
}

/**
 * Imports an external script by creating a <script> tag on load. 
 * 
 * @param {string} src Location of the script file
 * @param {string} [options] A dictionary of attributes to pass to the generated element.
 * @param {HTMLElement} [refChild] A reference child to insert this script before. If none is specified then document.currentscript is used.
 * @return {Promise<HTMLScriptElement>} The created tag
 */
NV.import = function (src, options, refChild) {
    if (!src) return;

    var tag = document.createElement('script')
    tag.src = src;

    if (options) {
        Object.keys(options).forEach(function (key) {
            if (options.hasOwnProperty(key)) {
                tag[key] = options[key];
            }
        })
    }

    if (!refChild) {
        refChild = document.currentScript;
    }

    return new Promise(function (resolve, reject) {
        NV.onload(function () {
            try {
                if (refChild) {
                    refChild.parentNode.insertBefore(tag, refChild);
                } else {
                    if (!document.head) {
                        document.head = document.createElement('head')
                    }
                    document.head.appendChild(tag);
                }
                resolve(tag)
            } catch (err) { reject(err) }
        })
    })
}


/**
 * Imports an external script by creating a <link> tag on load. 
 * 
 * @param {string} href Location of the external file
 * @param {string} [options] A dictionary of attributes to pass to the generated element.
 * @param {HTMLElement} [refChild] A reference child to insert this script before. If none is specified then document.currentscript is used.
 * @return {Promise<HTMLLinkElement>} The created tag
 */
NV.link = function (href, options, refChild) {
    if (!href) return;

    var tag = document.createElement('link');
    tag.href = href;

    if (options) {
        Object.keys(options).forEach(function (key) {
            if (options.hasOwnProperty(key)) {
                tag[key] = options[key];
            }
        })
    }

    if (!refChild) {
        refChild = document.currentScript;
    }

    return new Promise(function (resolve, reject) {
        NV.onload(function () {
            try {
                if (refChild) {
                    ref.parentNode.insertBefore(tag, refChild);
                } else {
                    if (!document.head) {
                        document.head = document.createElement('head')
                    }
                    document.head.appendChild(tag);
                }
                resolve(tag)
            } catch (err) { reject(err) }
        })
    })
}

/**
 * Utility version of fetch which first converts the returned data from JSON to an object
 * @param {string|Request} [input]
 * @param {RequestInit} [init]
 * @returns {Promise<any>}
 */
NV.fetchJson = function (input, init) {
    return new Promise(function (resolve, reject) {
        fetch(input, init)
            .then(function (res) {
                if (res.ok) return res.json();
                else throw res.status + ' ' + res.statusText;
            })
            .then(resolve)
            .catch(reject)
    })
}

/**
 * Utility version of fetch which first converts the returned data as text
 * @param {string|Request} [input] 
 * @param {RequestInit} [init] 
 * @returns {Promise<string>}
 */
NV.fetchText = function (input, init) {
    return new Promise(function (resolve, reject) {
        fetch(input, init)
            .then(function (res) {
                if (res.ok) return res.text();
                else throw res.status + ' ' + res.statusText;
            })
            .then(resolve)
            .catch(reject)
    })
}

/**
 * @callback mergeStrategy
 * @param {any} target Target value 
 * @param {any} source Source value
 * @param {string} [key] Name of the key being merged
 * @returns {any} The resultant value
 */

/**
 * Performs a deep version of Object.assign, using a defined merge strategy to resolve merge conflicts
 * 
 * @param {Object} target Target object
 * @param {Object} source Source object
 * @param {mergeStrategy|string} [strategy='ours'] Strategy for resolving merge conflicts. This can either be a callback function or one of the following strings: 'ours', 'theirs', 'error'
 * @return {Object} the target param
 */
NV.merge = function (target, source, strategy) {
    if (strategy == undefined) strategy = 'ours'

    if (typeof (target) != 'object') throw 'Target must be an object';
    if (typeof (source) != 'object') throw 'Source must be an object';
    if (typeof (strategy) == 'string') {
        switch (strategy.toLowerCase()) {
            case 'ours':
                strategy = function (target, source, key) {
                    return target;
                }
                break;
            case 'theirs':
                strategy = function (target, source, key) {
                    return source;
                }
                break;
            case 'combine':
                strategy = function (target, source, key) {
                    if (Array.isArray(source)) {
                        if (!Array.isArray(target)) {
                            target = [target];
                        }
                        return target.concat(source);;
                    } else {
                        try {
                            return target + source;
                        } catch (err) {
                            throw 'Unresolved merge conflict (key=' + key + ')';
                        }
                    }
                }
                break;
            case 'error':
                strategy = function (target, source, key) {
                    if (target != source) {
                        throw 'Unresolved merge conflict (key=' + key + ')';
                    }
                }
                break;
        }
    }

    var queue = [{
        target: target,
        source: source
    }];

    while (queue.length) {
        var next = queue.pop();
        var tgt = next.target;
        var src = next.source;

        Object.keys(src)
            .forEach(function (key) {
                if (!(key in src)) return

                if (typeof (src[key]) == 'object' && !Array.isArray(src[key])) {
                    if (typeof (tgt[key]) != 'object') {
                        tgt[key] = {}
                    }
                    queue.push({
                        target: tgt[key],
                        source: src[key]
                    })
                } else if (key in tgt) {
                    tgt[key] = strategy(tgt[key], src[key]);
                } else {
                    tgt[key] = src[key];
                }
            })
    }

    return target;
}
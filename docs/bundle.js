
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var chroma = createCommonjsModule(function (module, exports) {
    /**
     * chroma.js - JavaScript library for color conversions
     *
     * Copyright (c) 2011-2019, Gregor Aisch
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice, this
     * list of conditions and the following disclaimer.
     *
     * 2. Redistributions in binary form must reproduce the above copyright notice,
     * this list of conditions and the following disclaimer in the documentation
     * and/or other materials provided with the distribution.
     *
     * 3. The name Gregor Aisch may not be used to endorse or promote products
     * derived from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
     * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
     * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
     * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
     * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
     * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *
     * -------------------------------------------------------
     *
     * chroma.js includes colors from colorbrewer2.org, which are released under
     * the following license:
     *
     * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
     * and The Pennsylvania State University.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing,
     * software distributed under the License is distributed on an
     * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
     * either express or implied. See the License for the specific
     * language governing permissions and limitations under the License.
     *
     * ------------------------------------------------------
     *
     * Named colors are taken from X11 Color Names.
     * http://www.w3.org/TR/css3-color/#svg-color
     *
     * @preserve
     */

    (function (global, factory) {
         module.exports = factory() ;
    }(commonjsGlobal, (function () {
        var limit = function (x, min, max) {
            if ( min === void 0 ) min=0;
            if ( max === void 0 ) max=1;

            return x < min ? min : x > max ? max : x;
        };

        var clip_rgb = function (rgb) {
            rgb._clipped = false;
            rgb._unclipped = rgb.slice(0);
            for (var i=0; i<=3; i++) {
                if (i < 3) {
                    if (rgb[i] < 0 || rgb[i] > 255) { rgb._clipped = true; }
                    rgb[i] = limit(rgb[i], 0, 255);
                } else if (i === 3) {
                    rgb[i] = limit(rgb[i], 0, 1);
                }
            }
            return rgb;
        };

        // ported from jQuery's $.type
        var classToType = {};
        for (var i = 0, list = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null']; i < list.length; i += 1) {
            var name = list[i];

            classToType[("[object " + name + "]")] = name.toLowerCase();
        }
        var type = function(obj) {
            return classToType[Object.prototype.toString.call(obj)] || "object";
        };

        var unpack = function (args, keyOrder) {
            if ( keyOrder === void 0 ) keyOrder=null;

        	// if called with more than 3 arguments, we return the arguments
            if (args.length >= 3) { return Array.prototype.slice.call(args); }
            // with less than 3 args we check if first arg is object
            // and use the keyOrder string to extract and sort properties
        	if (type(args[0]) == 'object' && keyOrder) {
        		return keyOrder.split('')
        			.filter(function (k) { return args[0][k] !== undefined; })
        			.map(function (k) { return args[0][k]; });
        	}
        	// otherwise we just return the first argument
        	// (which we suppose is an array of args)
            return args[0];
        };

        var last = function (args) {
            if (args.length < 2) { return null; }
            var l = args.length-1;
            if (type(args[l]) == 'string') { return args[l].toLowerCase(); }
            return null;
        };

        var PI = Math.PI;

        var utils = {
        	clip_rgb: clip_rgb,
        	limit: limit,
        	type: type,
        	unpack: unpack,
        	last: last,
        	PI: PI,
        	TWOPI: PI*2,
        	PITHIRD: PI/3,
        	DEG2RAD: PI / 180,
        	RAD2DEG: 180 / PI
        };

        var input = {
        	format: {},
        	autodetect: []
        };

        var last$1 = utils.last;
        var clip_rgb$1 = utils.clip_rgb;
        var type$1 = utils.type;


        var Color = function Color() {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var me = this;
            if (type$1(args[0]) === 'object' &&
                args[0].constructor &&
                args[0].constructor === this.constructor) {
                // the argument is already a Color instance
                return args[0];
            }

            // last argument could be the mode
            var mode = last$1(args);
            var autodetect = false;

            if (!mode) {
                autodetect = true;
                if (!input.sorted) {
                    input.autodetect = input.autodetect.sort(function (a,b) { return b.p - a.p; });
                    input.sorted = true;
                }
                // auto-detect format
                for (var i = 0, list = input.autodetect; i < list.length; i += 1) {
                    var chk = list[i];

                    mode = chk.test.apply(chk, args);
                    if (mode) { break; }
                }
            }

            if (input.format[mode]) {
                var rgb = input.format[mode].apply(null, autodetect ? args : args.slice(0,-1));
                me._rgb = clip_rgb$1(rgb);
            } else {
                throw new Error('unknown format: '+args);
            }

            // add alpha channel
            if (me._rgb.length === 3) { me._rgb.push(1); }
        };

        Color.prototype.toString = function toString () {
            if (type$1(this.hex) == 'function') { return this.hex(); }
            return ("[" + (this._rgb.join(',')) + "]");
        };

        var Color_1 = Color;

        var chroma = function () {
        	var args = [], len = arguments.length;
        	while ( len-- ) args[ len ] = arguments[ len ];

        	return new (Function.prototype.bind.apply( chroma.Color, [ null ].concat( args) ));
        };

        chroma.Color = Color_1;
        chroma.version = '2.0.4';

        var chroma_1 = chroma;

        var unpack$1 = utils.unpack;
        var max = Math.max;

        var rgb2cmyk = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var ref = unpack$1(args, 'rgb');
            var r = ref[0];
            var g = ref[1];
            var b = ref[2];
            r = r / 255;
            g = g / 255;
            b = b / 255;
            var k = 1 - max(r,max(g,b));
            var f = k < 1 ? 1 / (1-k) : 0;
            var c = (1-r-k) * f;
            var m = (1-g-k) * f;
            var y = (1-b-k) * f;
            return [c,m,y,k];
        };

        var rgb2cmyk_1 = rgb2cmyk;

        var unpack$2 = utils.unpack;

        var cmyk2rgb = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$2(args, 'cmyk');
            var c = args[0];
            var m = args[1];
            var y = args[2];
            var k = args[3];
            var alpha = args.length > 4 ? args[4] : 1;
            if (k === 1) { return [0,0,0,alpha]; }
            return [
                c >= 1 ? 0 : 255 * (1-c) * (1-k), // r
                m >= 1 ? 0 : 255 * (1-m) * (1-k), // g
                y >= 1 ? 0 : 255 * (1-y) * (1-k), // b
                alpha
            ];
        };

        var cmyk2rgb_1 = cmyk2rgb;

        var unpack$3 = utils.unpack;
        var type$2 = utils.type;



        Color_1.prototype.cmyk = function() {
            return rgb2cmyk_1(this._rgb);
        };

        chroma_1.cmyk = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['cmyk']) ));
        };

        input.format.cmyk = cmyk2rgb_1;

        input.autodetect.push({
            p: 2,
            test: function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                args = unpack$3(args, 'cmyk');
                if (type$2(args) === 'array' && args.length === 4) {
                    return 'cmyk';
                }
            }
        });

        var unpack$4 = utils.unpack;
        var last$2 = utils.last;
        var rnd = function (a) { return Math.round(a*100)/100; };

        /*
         * supported arguments:
         * - hsl2css(h,s,l)
         * - hsl2css(h,s,l,a)
         * - hsl2css([h,s,l], mode)
         * - hsl2css([h,s,l,a], mode)
         * - hsl2css({h,s,l,a}, mode)
         */
        var hsl2css = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var hsla = unpack$4(args, 'hsla');
            var mode = last$2(args) || 'lsa';
            hsla[0] = rnd(hsla[0] || 0);
            hsla[1] = rnd(hsla[1]*100) + '%';
            hsla[2] = rnd(hsla[2]*100) + '%';
            if (mode === 'hsla' || (hsla.length > 3 && hsla[3]<1)) {
                hsla[3] = hsla.length > 3 ? hsla[3] : 1;
                mode = 'hsla';
            } else {
                hsla.length = 3;
            }
            return (mode + "(" + (hsla.join(',')) + ")");
        };

        var hsl2css_1 = hsl2css;

        var unpack$5 = utils.unpack;

        /*
         * supported arguments:
         * - rgb2hsl(r,g,b)
         * - rgb2hsl(r,g,b,a)
         * - rgb2hsl([r,g,b])
         * - rgb2hsl([r,g,b,a])
         * - rgb2hsl({r,g,b,a})
         */
        var rgb2hsl = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$5(args, 'rgba');
            var r = args[0];
            var g = args[1];
            var b = args[2];

            r /= 255;
            g /= 255;
            b /= 255;

            var min = Math.min(r, g, b);
            var max = Math.max(r, g, b);

            var l = (max + min) / 2;
            var s, h;

            if (max === min){
                s = 0;
                h = Number.NaN;
            } else {
                s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
            }

            if (r == max) { h = (g - b) / (max - min); }
            else if (g == max) { h = 2 + (b - r) / (max - min); }
            else if (b == max) { h = 4 + (r - g) / (max - min); }

            h *= 60;
            if (h < 0) { h += 360; }
            if (args.length>3 && args[3]!==undefined) { return [h,s,l,args[3]]; }
            return [h,s,l];
        };

        var rgb2hsl_1 = rgb2hsl;

        var unpack$6 = utils.unpack;
        var last$3 = utils.last;


        var round = Math.round;

        /*
         * supported arguments:
         * - rgb2css(r,g,b)
         * - rgb2css(r,g,b,a)
         * - rgb2css([r,g,b], mode)
         * - rgb2css([r,g,b,a], mode)
         * - rgb2css({r,g,b,a}, mode)
         */
        var rgb2css = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var rgba = unpack$6(args, 'rgba');
            var mode = last$3(args) || 'rgb';
            if (mode.substr(0,3) == 'hsl') {
                return hsl2css_1(rgb2hsl_1(rgba), mode);
            }
            rgba[0] = round(rgba[0]);
            rgba[1] = round(rgba[1]);
            rgba[2] = round(rgba[2]);
            if (mode === 'rgba' || (rgba.length > 3 && rgba[3]<1)) {
                rgba[3] = rgba.length > 3 ? rgba[3] : 1;
                mode = 'rgba';
            }
            return (mode + "(" + (rgba.slice(0,mode==='rgb'?3:4).join(',')) + ")");
        };

        var rgb2css_1 = rgb2css;

        var unpack$7 = utils.unpack;
        var round$1 = Math.round;

        var hsl2rgb = function () {
            var assign;

            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];
            args = unpack$7(args, 'hsl');
            var h = args[0];
            var s = args[1];
            var l = args[2];
            var r,g,b;
            if (s === 0) {
                r = g = b = l*255;
            } else {
                var t3 = [0,0,0];
                var c = [0,0,0];
                var t2 = l < 0.5 ? l * (1+s) : l+s-l*s;
                var t1 = 2 * l - t2;
                var h_ = h / 360;
                t3[0] = h_ + 1/3;
                t3[1] = h_;
                t3[2] = h_ - 1/3;
                for (var i=0; i<3; i++) {
                    if (t3[i] < 0) { t3[i] += 1; }
                    if (t3[i] > 1) { t3[i] -= 1; }
                    if (6 * t3[i] < 1)
                        { c[i] = t1 + (t2 - t1) * 6 * t3[i]; }
                    else if (2 * t3[i] < 1)
                        { c[i] = t2; }
                    else if (3 * t3[i] < 2)
                        { c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6; }
                    else
                        { c[i] = t1; }
                }
                (assign = [round$1(c[0]*255),round$1(c[1]*255),round$1(c[2]*255)], r = assign[0], g = assign[1], b = assign[2]);
            }
            if (args.length > 3) {
                // keep alpha channel
                return [r,g,b,args[3]];
            }
            return [r,g,b,1];
        };

        var hsl2rgb_1 = hsl2rgb;

        var RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
        var RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
        var RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
        var RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
        var RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
        var RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;

        var round$2 = Math.round;

        var css2rgb = function (css) {
            css = css.toLowerCase().trim();
            var m;

            if (input.format.named) {
                try {
                    return input.format.named(css);
                } catch (e) {
                    // eslint-disable-next-line
                }
            }

            // rgb(250,20,0)
            if ((m = css.match(RE_RGB))) {
                var rgb = m.slice(1,4);
                for (var i=0; i<3; i++) {
                    rgb[i] = +rgb[i];
                }
                rgb[3] = 1;  // default alpha
                return rgb;
            }

            // rgba(250,20,0,0.4)
            if ((m = css.match(RE_RGBA))) {
                var rgb$1 = m.slice(1,5);
                for (var i$1=0; i$1<4; i$1++) {
                    rgb$1[i$1] = +rgb$1[i$1];
                }
                return rgb$1;
            }

            // rgb(100%,0%,0%)
            if ((m = css.match(RE_RGB_PCT))) {
                var rgb$2 = m.slice(1,4);
                for (var i$2=0; i$2<3; i$2++) {
                    rgb$2[i$2] = round$2(rgb$2[i$2] * 2.55);
                }
                rgb$2[3] = 1;  // default alpha
                return rgb$2;
            }

            // rgba(100%,0%,0%,0.4)
            if ((m = css.match(RE_RGBA_PCT))) {
                var rgb$3 = m.slice(1,5);
                for (var i$3=0; i$3<3; i$3++) {
                    rgb$3[i$3] = round$2(rgb$3[i$3] * 2.55);
                }
                rgb$3[3] = +rgb$3[3];
                return rgb$3;
            }

            // hsl(0,100%,50%)
            if ((m = css.match(RE_HSL))) {
                var hsl = m.slice(1,4);
                hsl[1] *= 0.01;
                hsl[2] *= 0.01;
                var rgb$4 = hsl2rgb_1(hsl);
                rgb$4[3] = 1;
                return rgb$4;
            }

            // hsla(0,100%,50%,0.5)
            if ((m = css.match(RE_HSLA))) {
                var hsl$1 = m.slice(1,4);
                hsl$1[1] *= 0.01;
                hsl$1[2] *= 0.01;
                var rgb$5 = hsl2rgb_1(hsl$1);
                rgb$5[3] = +m[4];  // default alpha = 1
                return rgb$5;
            }
        };

        css2rgb.test = function (s) {
            return RE_RGB.test(s) ||
                RE_RGBA.test(s) ||
                RE_RGB_PCT.test(s) ||
                RE_RGBA_PCT.test(s) ||
                RE_HSL.test(s) ||
                RE_HSLA.test(s);
        };

        var css2rgb_1 = css2rgb;

        var type$3 = utils.type;




        Color_1.prototype.css = function(mode) {
            return rgb2css_1(this._rgb, mode);
        };

        chroma_1.css = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['css']) ));
        };

        input.format.css = css2rgb_1;

        input.autodetect.push({
            p: 5,
            test: function (h) {
                var rest = [], len = arguments.length - 1;
                while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

                if (!rest.length && type$3(h) === 'string' && css2rgb_1.test(h)) {
                    return 'css';
                }
            }
        });

        var unpack$8 = utils.unpack;

        input.format.gl = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var rgb = unpack$8(args, 'rgba');
            rgb[0] *= 255;
            rgb[1] *= 255;
            rgb[2] *= 255;
            return rgb;
        };

        chroma_1.gl = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['gl']) ));
        };

        Color_1.prototype.gl = function() {
            var rgb = this._rgb;
            return [rgb[0]/255, rgb[1]/255, rgb[2]/255, rgb[3]];
        };

        var unpack$9 = utils.unpack;

        var rgb2hcg = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var ref = unpack$9(args, 'rgb');
            var r = ref[0];
            var g = ref[1];
            var b = ref[2];
            var min = Math.min(r, g, b);
            var max = Math.max(r, g, b);
            var delta = max - min;
            var c = delta * 100 / 255;
            var _g = min / (255 - delta) * 100;
            var h;
            if (delta === 0) {
                h = Number.NaN;
            } else {
                if (r === max) { h = (g - b) / delta; }
                if (g === max) { h = 2+(b - r) / delta; }
                if (b === max) { h = 4+(r - g) / delta; }
                h *= 60;
                if (h < 0) { h += 360; }
            }
            return [h, c, _g];
        };

        var rgb2hcg_1 = rgb2hcg;

        var unpack$a = utils.unpack;
        var floor = Math.floor;

        /*
         * this is basically just HSV with some minor tweaks
         *
         * hue.. [0..360]
         * chroma .. [0..1]
         * grayness .. [0..1]
         */

        var hcg2rgb = function () {
            var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];
            args = unpack$a(args, 'hcg');
            var h = args[0];
            var c = args[1];
            var _g = args[2];
            var r,g,b;
            _g = _g * 255;
            var _c = c * 255;
            if (c === 0) {
                r = g = b = _g;
            } else {
                if (h === 360) { h = 0; }
                if (h > 360) { h -= 360; }
                if (h < 0) { h += 360; }
                h /= 60;
                var i = floor(h);
                var f = h - i;
                var p = _g * (1 - c);
                var q = p + _c * (1 - f);
                var t = p + _c * f;
                var v = p + _c;
                switch (i) {
                    case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
                    case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
                    case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
                    case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
                    case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
                    case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
                }
            }
            return [r, g, b, args.length > 3 ? args[3] : 1];
        };

        var hcg2rgb_1 = hcg2rgb;

        var unpack$b = utils.unpack;
        var type$4 = utils.type;






        Color_1.prototype.hcg = function() {
            return rgb2hcg_1(this._rgb);
        };

        chroma_1.hcg = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hcg']) ));
        };

        input.format.hcg = hcg2rgb_1;

        input.autodetect.push({
            p: 1,
            test: function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                args = unpack$b(args, 'hcg');
                if (type$4(args) === 'array' && args.length === 3) {
                    return 'hcg';
                }
            }
        });

        var unpack$c = utils.unpack;
        var last$4 = utils.last;
        var round$3 = Math.round;

        var rgb2hex = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var ref = unpack$c(args, 'rgba');
            var r = ref[0];
            var g = ref[1];
            var b = ref[2];
            var a = ref[3];
            var mode = last$4(args) || 'auto';
            if (a === undefined) { a = 1; }
            if (mode === 'auto') {
                mode = a < 1 ? 'rgba' : 'rgb';
            }
            r = round$3(r);
            g = round$3(g);
            b = round$3(b);
            var u = r << 16 | g << 8 | b;
            var str = "000000" + u.toString(16); //#.toUpperCase();
            str = str.substr(str.length - 6);
            var hxa = '0' + round$3(a * 255).toString(16);
            hxa = hxa.substr(hxa.length - 2);
            switch (mode.toLowerCase()) {
                case 'rgba': return ("#" + str + hxa);
                case 'argb': return ("#" + hxa + str);
                default: return ("#" + str);
            }
        };

        var rgb2hex_1 = rgb2hex;

        var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        var RE_HEXA = /^#?([A-Fa-f0-9]{8})$/;

        var hex2rgb = function (hex) {
            if (hex.match(RE_HEX)) {
                // remove optional leading #
                if (hex.length === 4 || hex.length === 7) {
                    hex = hex.substr(1);
                }
                // expand short-notation to full six-digit
                if (hex.length === 3) {
                    hex = hex.split('');
                    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
                }
                var u = parseInt(hex, 16);
                var r = u >> 16;
                var g = u >> 8 & 0xFF;
                var b = u & 0xFF;
                return [r,g,b,1];
            }

            // match rgba hex format, eg #FF000077
            if (hex.match(RE_HEXA)) {
                if (hex.length === 9) {
                    // remove optional leading #
                    hex = hex.substr(1);
                }
                var u$1 = parseInt(hex, 16);
                var r$1 = u$1 >> 24 & 0xFF;
                var g$1 = u$1 >> 16 & 0xFF;
                var b$1 = u$1 >> 8 & 0xFF;
                var a = Math.round((u$1 & 0xFF) / 0xFF * 100) / 100;
                return [r$1,g$1,b$1,a];
            }

            // we used to check for css colors here
            // if _input.css? and rgb = _input.css hex
            //     return rgb

            throw new Error(("unknown hex color: " + hex));
        };

        var hex2rgb_1 = hex2rgb;

        var type$5 = utils.type;




        Color_1.prototype.hex = function(mode) {
            return rgb2hex_1(this._rgb, mode);
        };

        chroma_1.hex = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hex']) ));
        };

        input.format.hex = hex2rgb_1;
        input.autodetect.push({
            p: 4,
            test: function (h) {
                var rest = [], len = arguments.length - 1;
                while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

                if (!rest.length && type$5(h) === 'string' && [3,4,6,7,8,9].includes(h.length)) {
                    return 'hex';
                }
            }
        });

        var unpack$d = utils.unpack;
        var TWOPI = utils.TWOPI;
        var min = Math.min;
        var sqrt = Math.sqrt;
        var acos = Math.acos;

        var rgb2hsi = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            /*
            borrowed from here:
            http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
            */
            var ref = unpack$d(args, 'rgb');
            var r = ref[0];
            var g = ref[1];
            var b = ref[2];
            r /= 255;
            g /= 255;
            b /= 255;
            var h;
            var min_ = min(r,g,b);
            var i = (r+g+b) / 3;
            var s = i > 0 ? 1 - min_/i : 0;
            if (s === 0) {
                h = NaN;
            } else {
                h = ((r-g)+(r-b)) / 2;
                h /= sqrt((r-g)*(r-g) + (r-b)*(g-b));
                h = acos(h);
                if (b > g) {
                    h = TWOPI - h;
                }
                h /= TWOPI;
            }
            return [h*360,s,i];
        };

        var rgb2hsi_1 = rgb2hsi;

        var unpack$e = utils.unpack;
        var limit$1 = utils.limit;
        var TWOPI$1 = utils.TWOPI;
        var PITHIRD = utils.PITHIRD;
        var cos = Math.cos;

        /*
         * hue [0..360]
         * saturation [0..1]
         * intensity [0..1]
         */
        var hsi2rgb = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            /*
            borrowed from here:
            http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
            */
            args = unpack$e(args, 'hsi');
            var h = args[0];
            var s = args[1];
            var i = args[2];
            var r,g,b;

            if (isNaN(h)) { h = 0; }
            if (isNaN(s)) { s = 0; }
            // normalize hue
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 360;
            if (h < 1/3) {
                b = (1-s)/3;
                r = (1+s*cos(TWOPI$1*h)/cos(PITHIRD-TWOPI$1*h))/3;
                g = 1 - (b+r);
            } else if (h < 2/3) {
                h -= 1/3;
                r = (1-s)/3;
                g = (1+s*cos(TWOPI$1*h)/cos(PITHIRD-TWOPI$1*h))/3;
                b = 1 - (r+g);
            } else {
                h -= 2/3;
                g = (1-s)/3;
                b = (1+s*cos(TWOPI$1*h)/cos(PITHIRD-TWOPI$1*h))/3;
                r = 1 - (g+b);
            }
            r = limit$1(i*r*3);
            g = limit$1(i*g*3);
            b = limit$1(i*b*3);
            return [r*255, g*255, b*255, args.length > 3 ? args[3] : 1];
        };

        var hsi2rgb_1 = hsi2rgb;

        var unpack$f = utils.unpack;
        var type$6 = utils.type;






        Color_1.prototype.hsi = function() {
            return rgb2hsi_1(this._rgb);
        };

        chroma_1.hsi = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hsi']) ));
        };

        input.format.hsi = hsi2rgb_1;

        input.autodetect.push({
            p: 2,
            test: function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                args = unpack$f(args, 'hsi');
                if (type$6(args) === 'array' && args.length === 3) {
                    return 'hsi';
                }
            }
        });

        var unpack$g = utils.unpack;
        var type$7 = utils.type;






        Color_1.prototype.hsl = function() {
            return rgb2hsl_1(this._rgb);
        };

        chroma_1.hsl = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hsl']) ));
        };

        input.format.hsl = hsl2rgb_1;

        input.autodetect.push({
            p: 2,
            test: function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                args = unpack$g(args, 'hsl');
                if (type$7(args) === 'array' && args.length === 3) {
                    return 'hsl';
                }
            }
        });

        var unpack$h = utils.unpack;
        var min$1 = Math.min;
        var max$1 = Math.max;

        /*
         * supported arguments:
         * - rgb2hsv(r,g,b)
         * - rgb2hsv([r,g,b])
         * - rgb2hsv({r,g,b})
         */
        var rgb2hsl$1 = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$h(args, 'rgb');
            var r = args[0];
            var g = args[1];
            var b = args[2];
            var min_ = min$1(r, g, b);
            var max_ = max$1(r, g, b);
            var delta = max_ - min_;
            var h,s,v;
            v = max_ / 255.0;
            if (max_ === 0) {
                h = Number.NaN;
                s = 0;
            } else {
                s = delta / max_;
                if (r === max_) { h = (g - b) / delta; }
                if (g === max_) { h = 2+(b - r) / delta; }
                if (b === max_) { h = 4+(r - g) / delta; }
                h *= 60;
                if (h < 0) { h += 360; }
            }
            return [h, s, v]
        };

        var rgb2hsv = rgb2hsl$1;

        var unpack$i = utils.unpack;
        var floor$1 = Math.floor;

        var hsv2rgb = function () {
            var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];
            args = unpack$i(args, 'hsv');
            var h = args[0];
            var s = args[1];
            var v = args[2];
            var r,g,b;
            v *= 255;
            if (s === 0) {
                r = g = b = v;
            } else {
                if (h === 360) { h = 0; }
                if (h > 360) { h -= 360; }
                if (h < 0) { h += 360; }
                h /= 60;

                var i = floor$1(h);
                var f = h - i;
                var p = v * (1 - s);
                var q = v * (1 - s * f);
                var t = v * (1 - s * (1 - f));

                switch (i) {
                    case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
                    case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
                    case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
                    case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
                    case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
                    case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
                }
            }
            return [r,g,b,args.length > 3?args[3]:1];
        };

        var hsv2rgb_1 = hsv2rgb;

        var unpack$j = utils.unpack;
        var type$8 = utils.type;






        Color_1.prototype.hsv = function() {
            return rgb2hsv(this._rgb);
        };

        chroma_1.hsv = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hsv']) ));
        };

        input.format.hsv = hsv2rgb_1;

        input.autodetect.push({
            p: 2,
            test: function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                args = unpack$j(args, 'hsv');
                if (type$8(args) === 'array' && args.length === 3) {
                    return 'hsv';
                }
            }
        });

        var labConstants = {
            // Corresponds roughly to RGB brighter/darker
            Kn: 18,

            // D65 standard referent
            Xn: 0.950470,
            Yn: 1,
            Zn: 1.088830,

            t0: 0.137931034,  // 4 / 29
            t1: 0.206896552,  // 6 / 29
            t2: 0.12841855,   // 3 * t1 * t1
            t3: 0.008856452,  // t1 * t1 * t1
        };

        var unpack$k = utils.unpack;
        var pow = Math.pow;

        var rgb2lab = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var ref = unpack$k(args, 'rgb');
            var r = ref[0];
            var g = ref[1];
            var b = ref[2];
            var ref$1 = rgb2xyz(r,g,b);
            var x = ref$1[0];
            var y = ref$1[1];
            var z = ref$1[2];
            var l = 116 * y - 16;
            return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
        };

        var rgb_xyz = function (r) {
            if ((r /= 255) <= 0.04045) { return r / 12.92; }
            return pow((r + 0.055) / 1.055, 2.4);
        };

        var xyz_lab = function (t) {
            if (t > labConstants.t3) { return pow(t, 1 / 3); }
            return t / labConstants.t2 + labConstants.t0;
        };

        var rgb2xyz = function (r,g,b) {
            r = rgb_xyz(r);
            g = rgb_xyz(g);
            b = rgb_xyz(b);
            var x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / labConstants.Xn);
            var y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / labConstants.Yn);
            var z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / labConstants.Zn);
            return [x,y,z];
        };

        var rgb2lab_1 = rgb2lab;

        var unpack$l = utils.unpack;
        var pow$1 = Math.pow;

        /*
         * L* [0..100]
         * a [-100..100]
         * b [-100..100]
         */
        var lab2rgb = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$l(args, 'lab');
            var l = args[0];
            var a = args[1];
            var b = args[2];
            var x,y,z, r,g,b_;

            y = (l + 16) / 116;
            x = isNaN(a) ? y : y + a / 500;
            z = isNaN(b) ? y : y - b / 200;

            y = labConstants.Yn * lab_xyz(y);
            x = labConstants.Xn * lab_xyz(x);
            z = labConstants.Zn * lab_xyz(z);

            r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);  // D65 -> sRGB
            g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
            b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

            return [r,g,b_,args.length > 3 ? args[3] : 1];
        };

        var xyz_rgb = function (r) {
            return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow$1(r, 1 / 2.4) - 0.055)
        };

        var lab_xyz = function (t) {
            return t > labConstants.t1 ? t * t * t : labConstants.t2 * (t - labConstants.t0)
        };

        var lab2rgb_1 = lab2rgb;

        var unpack$m = utils.unpack;
        var type$9 = utils.type;






        Color_1.prototype.lab = function() {
            return rgb2lab_1(this._rgb);
        };

        chroma_1.lab = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['lab']) ));
        };

        input.format.lab = lab2rgb_1;

        input.autodetect.push({
            p: 2,
            test: function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                args = unpack$m(args, 'lab');
                if (type$9(args) === 'array' && args.length === 3) {
                    return 'lab';
                }
            }
        });

        var unpack$n = utils.unpack;
        var RAD2DEG = utils.RAD2DEG;
        var sqrt$1 = Math.sqrt;
        var atan2 = Math.atan2;
        var round$4 = Math.round;

        var lab2lch = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var ref = unpack$n(args, 'lab');
            var l = ref[0];
            var a = ref[1];
            var b = ref[2];
            var c = sqrt$1(a * a + b * b);
            var h = (atan2(b, a) * RAD2DEG + 360) % 360;
            if (round$4(c*10000) === 0) { h = Number.NaN; }
            return [l, c, h];
        };

        var lab2lch_1 = lab2lch;

        var unpack$o = utils.unpack;



        var rgb2lch = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var ref = unpack$o(args, 'rgb');
            var r = ref[0];
            var g = ref[1];
            var b = ref[2];
            var ref$1 = rgb2lab_1(r,g,b);
            var l = ref$1[0];
            var a = ref$1[1];
            var b_ = ref$1[2];
            return lab2lch_1(l,a,b_);
        };

        var rgb2lch_1 = rgb2lch;

        var unpack$p = utils.unpack;
        var DEG2RAD = utils.DEG2RAD;
        var sin = Math.sin;
        var cos$1 = Math.cos;

        var lch2lab = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            /*
            Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
            These formulas were invented by David Dalrymple to obtain maximum contrast without going
            out of gamut if the parameters are in the range 0-1.

            A saturation multiplier was added by Gregor Aisch
            */
            var ref = unpack$p(args, 'lch');
            var l = ref[0];
            var c = ref[1];
            var h = ref[2];
            if (isNaN(h)) { h = 0; }
            h = h * DEG2RAD;
            return [l, cos$1(h) * c, sin(h) * c]
        };

        var lch2lab_1 = lch2lab;

        var unpack$q = utils.unpack;



        var lch2rgb = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$q(args, 'lch');
            var l = args[0];
            var c = args[1];
            var h = args[2];
            var ref = lch2lab_1 (l,c,h);
            var L = ref[0];
            var a = ref[1];
            var b_ = ref[2];
            var ref$1 = lab2rgb_1 (L,a,b_);
            var r = ref$1[0];
            var g = ref$1[1];
            var b = ref$1[2];
            return [r, g, b, args.length > 3 ? args[3] : 1];
        };

        var lch2rgb_1 = lch2rgb;

        var unpack$r = utils.unpack;


        var hcl2rgb = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var hcl = unpack$r(args, 'hcl').reverse();
            return lch2rgb_1.apply(void 0, hcl);
        };

        var hcl2rgb_1 = hcl2rgb;

        var unpack$s = utils.unpack;
        var type$a = utils.type;






        Color_1.prototype.lch = function() { return rgb2lch_1(this._rgb); };
        Color_1.prototype.hcl = function() { return rgb2lch_1(this._rgb).reverse(); };

        chroma_1.lch = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['lch']) ));
        };
        chroma_1.hcl = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['hcl']) ));
        };

        input.format.lch = lch2rgb_1;
        input.format.hcl = hcl2rgb_1;

        ['lch','hcl'].forEach(function (m) { return input.autodetect.push({
            p: 2,
            test: function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                args = unpack$s(args, m);
                if (type$a(args) === 'array' && args.length === 3) {
                    return m;
                }
            }
        }); });

        /**
        	X11 color names

        	http://www.w3.org/TR/css3-color/#svg-color
        */

        var w3cx11 = {
            aliceblue: '#f0f8ff',
            antiquewhite: '#faebd7',
            aqua: '#00ffff',
            aquamarine: '#7fffd4',
            azure: '#f0ffff',
            beige: '#f5f5dc',
            bisque: '#ffe4c4',
            black: '#000000',
            blanchedalmond: '#ffebcd',
            blue: '#0000ff',
            blueviolet: '#8a2be2',
            brown: '#a52a2a',
            burlywood: '#deb887',
            cadetblue: '#5f9ea0',
            chartreuse: '#7fff00',
            chocolate: '#d2691e',
            coral: '#ff7f50',
            cornflower: '#6495ed',
            cornflowerblue: '#6495ed',
            cornsilk: '#fff8dc',
            crimson: '#dc143c',
            cyan: '#00ffff',
            darkblue: '#00008b',
            darkcyan: '#008b8b',
            darkgoldenrod: '#b8860b',
            darkgray: '#a9a9a9',
            darkgreen: '#006400',
            darkgrey: '#a9a9a9',
            darkkhaki: '#bdb76b',
            darkmagenta: '#8b008b',
            darkolivegreen: '#556b2f',
            darkorange: '#ff8c00',
            darkorchid: '#9932cc',
            darkred: '#8b0000',
            darksalmon: '#e9967a',
            darkseagreen: '#8fbc8f',
            darkslateblue: '#483d8b',
            darkslategray: '#2f4f4f',
            darkslategrey: '#2f4f4f',
            darkturquoise: '#00ced1',
            darkviolet: '#9400d3',
            deeppink: '#ff1493',
            deepskyblue: '#00bfff',
            dimgray: '#696969',
            dimgrey: '#696969',
            dodgerblue: '#1e90ff',
            firebrick: '#b22222',
            floralwhite: '#fffaf0',
            forestgreen: '#228b22',
            fuchsia: '#ff00ff',
            gainsboro: '#dcdcdc',
            ghostwhite: '#f8f8ff',
            gold: '#ffd700',
            goldenrod: '#daa520',
            gray: '#808080',
            green: '#008000',
            greenyellow: '#adff2f',
            grey: '#808080',
            honeydew: '#f0fff0',
            hotpink: '#ff69b4',
            indianred: '#cd5c5c',
            indigo: '#4b0082',
            ivory: '#fffff0',
            khaki: '#f0e68c',
            laserlemon: '#ffff54',
            lavender: '#e6e6fa',
            lavenderblush: '#fff0f5',
            lawngreen: '#7cfc00',
            lemonchiffon: '#fffacd',
            lightblue: '#add8e6',
            lightcoral: '#f08080',
            lightcyan: '#e0ffff',
            lightgoldenrod: '#fafad2',
            lightgoldenrodyellow: '#fafad2',
            lightgray: '#d3d3d3',
            lightgreen: '#90ee90',
            lightgrey: '#d3d3d3',
            lightpink: '#ffb6c1',
            lightsalmon: '#ffa07a',
            lightseagreen: '#20b2aa',
            lightskyblue: '#87cefa',
            lightslategray: '#778899',
            lightslategrey: '#778899',
            lightsteelblue: '#b0c4de',
            lightyellow: '#ffffe0',
            lime: '#00ff00',
            limegreen: '#32cd32',
            linen: '#faf0e6',
            magenta: '#ff00ff',
            maroon: '#800000',
            maroon2: '#7f0000',
            maroon3: '#b03060',
            mediumaquamarine: '#66cdaa',
            mediumblue: '#0000cd',
            mediumorchid: '#ba55d3',
            mediumpurple: '#9370db',
            mediumseagreen: '#3cb371',
            mediumslateblue: '#7b68ee',
            mediumspringgreen: '#00fa9a',
            mediumturquoise: '#48d1cc',
            mediumvioletred: '#c71585',
            midnightblue: '#191970',
            mintcream: '#f5fffa',
            mistyrose: '#ffe4e1',
            moccasin: '#ffe4b5',
            navajowhite: '#ffdead',
            navy: '#000080',
            oldlace: '#fdf5e6',
            olive: '#808000',
            olivedrab: '#6b8e23',
            orange: '#ffa500',
            orangered: '#ff4500',
            orchid: '#da70d6',
            palegoldenrod: '#eee8aa',
            palegreen: '#98fb98',
            paleturquoise: '#afeeee',
            palevioletred: '#db7093',
            papayawhip: '#ffefd5',
            peachpuff: '#ffdab9',
            peru: '#cd853f',
            pink: '#ffc0cb',
            plum: '#dda0dd',
            powderblue: '#b0e0e6',
            purple: '#800080',
            purple2: '#7f007f',
            purple3: '#a020f0',
            rebeccapurple: '#663399',
            red: '#ff0000',
            rosybrown: '#bc8f8f',
            royalblue: '#4169e1',
            saddlebrown: '#8b4513',
            salmon: '#fa8072',
            sandybrown: '#f4a460',
            seagreen: '#2e8b57',
            seashell: '#fff5ee',
            sienna: '#a0522d',
            silver: '#c0c0c0',
            skyblue: '#87ceeb',
            slateblue: '#6a5acd',
            slategray: '#708090',
            slategrey: '#708090',
            snow: '#fffafa',
            springgreen: '#00ff7f',
            steelblue: '#4682b4',
            tan: '#d2b48c',
            teal: '#008080',
            thistle: '#d8bfd8',
            tomato: '#ff6347',
            turquoise: '#40e0d0',
            violet: '#ee82ee',
            wheat: '#f5deb3',
            white: '#ffffff',
            whitesmoke: '#f5f5f5',
            yellow: '#ffff00',
            yellowgreen: '#9acd32'
        };

        var w3cx11_1 = w3cx11;

        var type$b = utils.type;





        Color_1.prototype.name = function() {
            var hex = rgb2hex_1(this._rgb, 'rgb');
            for (var i = 0, list = Object.keys(w3cx11_1); i < list.length; i += 1) {
                var n = list[i];

                if (w3cx11_1[n] === hex) { return n.toLowerCase(); }
            }
            return hex;
        };

        input.format.named = function (name) {
            name = name.toLowerCase();
            if (w3cx11_1[name]) { return hex2rgb_1(w3cx11_1[name]); }
            throw new Error('unknown color name: '+name);
        };

        input.autodetect.push({
            p: 5,
            test: function (h) {
                var rest = [], len = arguments.length - 1;
                while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

                if (!rest.length && type$b(h) === 'string' && w3cx11_1[h.toLowerCase()]) {
                    return 'named';
                }
            }
        });

        var unpack$t = utils.unpack;

        var rgb2num = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var ref = unpack$t(args, 'rgb');
            var r = ref[0];
            var g = ref[1];
            var b = ref[2];
            return (r << 16) + (g << 8) + b;
        };

        var rgb2num_1 = rgb2num;

        var type$c = utils.type;

        var num2rgb = function (num) {
            if (type$c(num) == "number" && num >= 0 && num <= 0xFFFFFF) {
                var r = num >> 16;
                var g = (num >> 8) & 0xFF;
                var b = num & 0xFF;
                return [r,g,b,1];
            }
            throw new Error("unknown num color: "+num);
        };

        var num2rgb_1 = num2rgb;

        var type$d = utils.type;



        Color_1.prototype.num = function() {
            return rgb2num_1(this._rgb);
        };

        chroma_1.num = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['num']) ));
        };

        input.format.num = num2rgb_1;

        input.autodetect.push({
            p: 5,
            test: function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                if (args.length === 1 && type$d(args[0]) === 'number' && args[0] >= 0 && args[0] <= 0xFFFFFF) {
                    return 'num';
                }
            }
        });

        var unpack$u = utils.unpack;
        var type$e = utils.type;
        var round$5 = Math.round;

        Color_1.prototype.rgb = function(rnd) {
            if ( rnd === void 0 ) rnd=true;

            if (rnd === false) { return this._rgb.slice(0,3); }
            return this._rgb.slice(0,3).map(round$5);
        };

        Color_1.prototype.rgba = function(rnd) {
            if ( rnd === void 0 ) rnd=true;

            return this._rgb.slice(0,4).map(function (v,i) {
                return i<3 ? (rnd === false ? v : round$5(v)) : v;
            });
        };

        chroma_1.rgb = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['rgb']) ));
        };

        input.format.rgb = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var rgba = unpack$u(args, 'rgba');
            if (rgba[3] === undefined) { rgba[3] = 1; }
            return rgba;
        };

        input.autodetect.push({
            p: 3,
            test: function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                args = unpack$u(args, 'rgba');
                if (type$e(args) === 'array' && (args.length === 3 ||
                    args.length === 4 && type$e(args[3]) == 'number' && args[3] >= 0 && args[3] <= 1)) {
                    return 'rgb';
                }
            }
        });

        /*
         * Based on implementation by Neil Bartlett
         * https://github.com/neilbartlett/color-temperature
         */

        var log = Math.log;

        var temperature2rgb = function (kelvin) {
            var temp = kelvin / 100;
            var r,g,b;
            if (temp < 66) {
                r = 255;
                g = -155.25485562709179 - 0.44596950469579133 * (g = temp-2) + 104.49216199393888 * log(g);
                b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp-10) + 115.67994401066147 * log(b);
            } else {
                r = 351.97690566805693 + 0.114206453784165 * (r = temp-55) - 40.25366309332127 * log(r);
                g = 325.4494125711974 + 0.07943456536662342 * (g = temp-50) - 28.0852963507957 * log(g);
                b = 255;
            }
            return [r,g,b,1];
        };

        var temperature2rgb_1 = temperature2rgb;

        /*
         * Based on implementation by Neil Bartlett
         * https://github.com/neilbartlett/color-temperature
         **/


        var unpack$v = utils.unpack;
        var round$6 = Math.round;

        var rgb2temperature = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var rgb = unpack$v(args, 'rgb');
            var r = rgb[0], b = rgb[2];
            var minTemp = 1000;
            var maxTemp = 40000;
            var eps = 0.4;
            var temp;
            while (maxTemp - minTemp > eps) {
                temp = (maxTemp + minTemp) * 0.5;
                var rgb$1 = temperature2rgb_1(temp);
                if ((rgb$1[2] / rgb$1[0]) >= (b / r)) {
                    maxTemp = temp;
                } else {
                    minTemp = temp;
                }
            }
            return round$6(temp);
        };

        var rgb2temperature_1 = rgb2temperature;

        Color_1.prototype.temp =
        Color_1.prototype.kelvin =
        Color_1.prototype.temperature = function() {
            return rgb2temperature_1(this._rgb);
        };

        chroma_1.temp =
        chroma_1.kelvin =
        chroma_1.temperature = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return new (Function.prototype.bind.apply( Color_1, [ null ].concat( args, ['temp']) ));
        };

        input.format.temp =
        input.format.kelvin =
        input.format.temperature = temperature2rgb_1;

        var type$f = utils.type;

        Color_1.prototype.alpha = function(a, mutate) {
            if ( mutate === void 0 ) mutate=false;

            if (a !== undefined && type$f(a) === 'number') {
                if (mutate) {
                    this._rgb[3] = a;
                    return this;
                }
                return new Color_1([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
            }
            return this._rgb[3];
        };

        Color_1.prototype.clipped = function() {
            return this._rgb._clipped || false;
        };

        Color_1.prototype.darken = function(amount) {
        	if ( amount === void 0 ) amount=1;

        	var me = this;
        	var lab = me.lab();
        	lab[0] -= labConstants.Kn * amount;
        	return new Color_1(lab, 'lab').alpha(me.alpha(), true);
        };

        Color_1.prototype.brighten = function(amount) {
        	if ( amount === void 0 ) amount=1;

        	return this.darken(-amount);
        };

        Color_1.prototype.darker = Color_1.prototype.darken;
        Color_1.prototype.brighter = Color_1.prototype.brighten;

        Color_1.prototype.get = function(mc) {
            var ref = mc.split('.');
            var mode = ref[0];
            var channel = ref[1];
            var src = this[mode]();
            if (channel) {
                var i = mode.indexOf(channel);
                if (i > -1) { return src[i]; }
                throw new Error(("unknown channel " + channel + " in mode " + mode));
            } else {
                return src;
            }
        };

        var type$g = utils.type;
        var pow$2 = Math.pow;

        var EPS = 1e-7;
        var MAX_ITER = 20;

        Color_1.prototype.luminance = function(lum) {
            if (lum !== undefined && type$g(lum) === 'number') {
                if (lum === 0) {
                    // return pure black
                    return new Color_1([0,0,0,this._rgb[3]], 'rgb');
                }
                if (lum === 1) {
                    // return pure white
                    return new Color_1([255,255,255,this._rgb[3]], 'rgb');
                }
                // compute new color using...
                var cur_lum = this.luminance();
                var mode = 'rgb';
                var max_iter = MAX_ITER;

                var test = function (low, high) {
                    var mid = low.interpolate(high, 0.5, mode);
                    var lm = mid.luminance();
                    if (Math.abs(lum - lm) < EPS || !max_iter--) {
                        // close enough
                        return mid;
                    }
                    return lm > lum ? test(low, mid) : test(mid, high);
                };

                var rgb = (cur_lum > lum ? test(new Color_1([0,0,0]), this) : test(this, new Color_1([255,255,255]))).rgb();
                return new Color_1(rgb.concat( [this._rgb[3]]));
            }
            return rgb2luminance.apply(void 0, (this._rgb).slice(0,3));
        };


        var rgb2luminance = function (r,g,b) {
            // relative luminance
            // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
            r = luminance_x(r);
            g = luminance_x(g);
            b = luminance_x(b);
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        var luminance_x = function (x) {
            x /= 255;
            return x <= 0.03928 ? x/12.92 : pow$2((x+0.055)/1.055, 2.4);
        };

        var interpolator = {};

        var type$h = utils.type;


        var mix = function (col1, col2, f) {
            if ( f === void 0 ) f=0.5;
            var rest = [], len = arguments.length - 3;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 3 ];

            var mode = rest[0] || 'lrgb';
            if (!interpolator[mode] && !rest.length) {
                // fall back to the first supported mode
                mode = Object.keys(interpolator)[0];
            }
            if (!interpolator[mode]) {
                throw new Error(("interpolation mode " + mode + " is not defined"));
            }
            if (type$h(col1) !== 'object') { col1 = new Color_1(col1); }
            if (type$h(col2) !== 'object') { col2 = new Color_1(col2); }
            return interpolator[mode](col1, col2, f)
                .alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
        };

        Color_1.prototype.mix =
        Color_1.prototype.interpolate = function(col2, f) {
        	if ( f === void 0 ) f=0.5;
        	var rest = [], len = arguments.length - 2;
        	while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];

        	return mix.apply(void 0, [ this, col2, f ].concat( rest ));
        };

        Color_1.prototype.premultiply = function(mutate) {
        	if ( mutate === void 0 ) mutate=false;

        	var rgb = this._rgb;
        	var a = rgb[3];
        	if (mutate) {
        		this._rgb = [rgb[0]*a, rgb[1]*a, rgb[2]*a, a];
        		return this;
        	} else {
        		return new Color_1([rgb[0]*a, rgb[1]*a, rgb[2]*a, a], 'rgb');
        	}
        };

        Color_1.prototype.saturate = function(amount) {
        	if ( amount === void 0 ) amount=1;

        	var me = this;
        	var lch = me.lch();
        	lch[1] += labConstants.Kn * amount;
        	if (lch[1] < 0) { lch[1] = 0; }
        	return new Color_1(lch, 'lch').alpha(me.alpha(), true);
        };

        Color_1.prototype.desaturate = function(amount) {
        	if ( amount === void 0 ) amount=1;

        	return this.saturate(-amount);
        };

        var type$i = utils.type;

        Color_1.prototype.set = function(mc, value, mutate) {
            if ( mutate === void 0 ) mutate=false;

            var ref = mc.split('.');
            var mode = ref[0];
            var channel = ref[1];
            var src = this[mode]();
            if (channel) {
                var i = mode.indexOf(channel);
                if (i > -1) {
                    if (type$i(value) == 'string') {
                        switch(value.charAt(0)) {
                            case '+': src[i] += +value; break;
                            case '-': src[i] += +value; break;
                            case '*': src[i] *= +(value.substr(1)); break;
                            case '/': src[i] /= +(value.substr(1)); break;
                            default: src[i] = +value;
                        }
                    } else if (type$i(value) === 'number') {
                        src[i] = value;
                    } else {
                        throw new Error("unsupported value for Color.set");
                    }
                    var out = new Color_1(src, mode);
                    if (mutate) {
                        this._rgb = out._rgb;
                        return this;
                    }
                    return out;
                }
                throw new Error(("unknown channel " + channel + " in mode " + mode));
            } else {
                return src;
            }
        };

        var rgb$1 = function (col1, col2, f) {
            var xyz0 = col1._rgb;
            var xyz1 = col2._rgb;
            return new Color_1(
                xyz0[0] + f * (xyz1[0]-xyz0[0]),
                xyz0[1] + f * (xyz1[1]-xyz0[1]),
                xyz0[2] + f * (xyz1[2]-xyz0[2]),
                'rgb'
            )
        };

        // register interpolator
        interpolator.rgb = rgb$1;

        var sqrt$2 = Math.sqrt;
        var pow$3 = Math.pow;

        var lrgb = function (col1, col2, f) {
            var ref = col1._rgb;
            var x1 = ref[0];
            var y1 = ref[1];
            var z1 = ref[2];
            var ref$1 = col2._rgb;
            var x2 = ref$1[0];
            var y2 = ref$1[1];
            var z2 = ref$1[2];
            return new Color_1(
                sqrt$2(pow$3(x1,2) * (1-f) + pow$3(x2,2) * f),
                sqrt$2(pow$3(y1,2) * (1-f) + pow$3(y2,2) * f),
                sqrt$2(pow$3(z1,2) * (1-f) + pow$3(z2,2) * f),
                'rgb'
            )
        };

        // register interpolator
        interpolator.lrgb = lrgb;

        var lab$1 = function (col1, col2, f) {
            var xyz0 = col1.lab();
            var xyz1 = col2.lab();
            return new Color_1(
                xyz0[0] + f * (xyz1[0]-xyz0[0]),
                xyz0[1] + f * (xyz1[1]-xyz0[1]),
                xyz0[2] + f * (xyz1[2]-xyz0[2]),
                'lab'
            )
        };

        // register interpolator
        interpolator.lab = lab$1;

        var _hsx = function (col1, col2, f, m) {
            var assign, assign$1;

            var xyz0, xyz1;
            if (m === 'hsl') {
                xyz0 = col1.hsl();
                xyz1 = col2.hsl();
            } else if (m === 'hsv') {
                xyz0 = col1.hsv();
                xyz1 = col2.hsv();
            } else if (m === 'hcg') {
                xyz0 = col1.hcg();
                xyz1 = col2.hcg();
            } else if (m === 'hsi') {
                xyz0 = col1.hsi();
                xyz1 = col2.hsi();
            } else if (m === 'lch' || m === 'hcl') {
                m = 'hcl';
                xyz0 = col1.hcl();
                xyz1 = col2.hcl();
            }

            var hue0, hue1, sat0, sat1, lbv0, lbv1;
            if (m.substr(0, 1) === 'h') {
                (assign = xyz0, hue0 = assign[0], sat0 = assign[1], lbv0 = assign[2]);
                (assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2]);
            }

            var sat, hue, lbv, dh;

            if (!isNaN(hue0) && !isNaN(hue1)) {
                // both colors have hue
                if (hue1 > hue0 && hue1 - hue0 > 180) {
                    dh = hue1-(hue0+360);
                } else if (hue1 < hue0 && hue0 - hue1 > 180) {
                    dh = hue1+360-hue0;
                } else {
                    dh = hue1 - hue0;
                }
                hue = hue0 + f * dh;
            } else if (!isNaN(hue0)) {
                hue = hue0;
                if ((lbv1 == 1 || lbv1 == 0) && m != 'hsv') { sat = sat0; }
            } else if (!isNaN(hue1)) {
                hue = hue1;
                if ((lbv0 == 1 || lbv0 == 0) && m != 'hsv') { sat = sat1; }
            } else {
                hue = Number.NaN;
            }

            if (sat === undefined) { sat = sat0 + f * (sat1 - sat0); }
            lbv = lbv0 + f * (lbv1-lbv0);
            return new Color_1([hue, sat, lbv], m);
        };

        var lch$1 = function (col1, col2, f) {
        	return _hsx(col1, col2, f, 'lch');
        };

        // register interpolator
        interpolator.lch = lch$1;
        interpolator.hcl = lch$1;

        var num$1 = function (col1, col2, f) {
            var c1 = col1.num();
            var c2 = col2.num();
            return new Color_1(c1 + f * (c2-c1), 'num')
        };

        // register interpolator
        interpolator.num = num$1;

        var hcg$1 = function (col1, col2, f) {
        	return _hsx(col1, col2, f, 'hcg');
        };

        // register interpolator
        interpolator.hcg = hcg$1;

        var hsi$1 = function (col1, col2, f) {
        	return _hsx(col1, col2, f, 'hsi');
        };

        // register interpolator
        interpolator.hsi = hsi$1;

        var hsl$1 = function (col1, col2, f) {
        	return _hsx(col1, col2, f, 'hsl');
        };

        // register interpolator
        interpolator.hsl = hsl$1;

        var hsv$1 = function (col1, col2, f) {
        	return _hsx(col1, col2, f, 'hsv');
        };

        // register interpolator
        interpolator.hsv = hsv$1;

        var clip_rgb$2 = utils.clip_rgb;
        var pow$4 = Math.pow;
        var sqrt$3 = Math.sqrt;
        var PI$1 = Math.PI;
        var cos$2 = Math.cos;
        var sin$1 = Math.sin;
        var atan2$1 = Math.atan2;

        var average = function (colors, mode) {
            if ( mode === void 0 ) mode='lrgb';

            var l = colors.length;
            // convert colors to Color objects
            colors = colors.map(function (c) { return new Color_1(c); });
            if (mode === 'lrgb') {
                return _average_lrgb(colors)
            }
            var first = colors.shift();
            var xyz = first.get(mode);
            var cnt = [];
            var dx = 0;
            var dy = 0;
            // initial color
            for (var i=0; i<xyz.length; i++) {
                xyz[i] = xyz[i] || 0;
                cnt.push(isNaN(xyz[i]) ? 0 : 1);
                if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
                    var A = xyz[i] / 180 * PI$1;
                    dx += cos$2(A);
                    dy += sin$1(A);
                }
            }

            var alpha = first.alpha();
            colors.forEach(function (c) {
                var xyz2 = c.get(mode);
                alpha += c.alpha();
                for (var i=0; i<xyz.length; i++) {
                    if (!isNaN(xyz2[i])) {
                        cnt[i]++;
                        if (mode.charAt(i) === 'h') {
                            var A = xyz2[i] / 180 * PI$1;
                            dx += cos$2(A);
                            dy += sin$1(A);
                        } else {
                            xyz[i] += xyz2[i];
                        }
                    }
                }
            });

            for (var i$1=0; i$1<xyz.length; i$1++) {
                if (mode.charAt(i$1) === 'h') {
                    var A$1 = atan2$1(dy / cnt[i$1], dx / cnt[i$1]) / PI$1 * 180;
                    while (A$1 < 0) { A$1 += 360; }
                    while (A$1 >= 360) { A$1 -= 360; }
                    xyz[i$1] = A$1;
                } else {
                    xyz[i$1] = xyz[i$1]/cnt[i$1];
                }
            }
            alpha /= l;
            return (new Color_1(xyz, mode)).alpha(alpha > 0.99999 ? 1 : alpha, true);
        };


        var _average_lrgb = function (colors) {
            var l = colors.length;
            var f = 1/l;
            var xyz = [0,0,0,0];
            for (var i = 0, list = colors; i < list.length; i += 1) {
                var col = list[i];

                var rgb = col._rgb;
                xyz[0] += pow$4(rgb[0],2) * f;
                xyz[1] += pow$4(rgb[1],2) * f;
                xyz[2] += pow$4(rgb[2],2) * f;
                xyz[3] += rgb[3] * f;
            }
            xyz[0] = sqrt$3(xyz[0]);
            xyz[1] = sqrt$3(xyz[1]);
            xyz[2] = sqrt$3(xyz[2]);
            if (xyz[3] > 0.9999999) { xyz[3] = 1; }
            return new Color_1(clip_rgb$2(xyz));
        };

        // minimal multi-purpose interface

        // @requires utils color analyze


        var type$j = utils.type;

        var pow$5 = Math.pow;

        var scale = function(colors) {

            // constructor
            var _mode = 'rgb';
            var _nacol = chroma_1('#ccc');
            var _spread = 0;
            // const _fixed = false;
            var _domain = [0, 1];
            var _pos = [];
            var _padding = [0,0];
            var _classes = false;
            var _colors = [];
            var _out = false;
            var _min = 0;
            var _max = 1;
            var _correctLightness = false;
            var _colorCache = {};
            var _useCache = true;
            var _gamma = 1;

            // private methods

            var setColors = function(colors) {
                colors = colors || ['#fff', '#000'];
                if (colors && type$j(colors) === 'string' && chroma_1.brewer &&
                    chroma_1.brewer[colors.toLowerCase()]) {
                    colors = chroma_1.brewer[colors.toLowerCase()];
                }
                if (type$j(colors) === 'array') {
                    // handle single color
                    if (colors.length === 1) {
                        colors = [colors[0], colors[0]];
                    }
                    // make a copy of the colors
                    colors = colors.slice(0);
                    // convert to chroma classes
                    for (var c=0; c<colors.length; c++) {
                        colors[c] = chroma_1(colors[c]);
                    }
                    // auto-fill color position
                    _pos.length = 0;
                    for (var c$1=0; c$1<colors.length; c$1++) {
                        _pos.push(c$1/(colors.length-1));
                    }
                }
                resetCache();
                return _colors = colors;
            };

            var getClass = function(value) {
                if (_classes != null) {
                    var n = _classes.length-1;
                    var i = 0;
                    while (i < n && value >= _classes[i]) {
                        i++;
                    }
                    return i-1;
                }
                return 0;
            };

            var tmap = function (t) { return t; };

            // const classifyValue = function(value) {
            //     let val = value;
            //     if (_classes.length > 2) {
            //         const n = _classes.length-1;
            //         const i = getClass(value);
            //         const minc = _classes[0] + ((_classes[1]-_classes[0]) * (0 + (_spread * 0.5)));  // center of 1st class
            //         const maxc = _classes[n-1] + ((_classes[n]-_classes[n-1]) * (1 - (_spread * 0.5)));  // center of last class
            //         val = _min + ((((_classes[i] + ((_classes[i+1] - _classes[i]) * 0.5)) - minc) / (maxc-minc)) * (_max - _min));
            //     }
            //     return val;
            // };

            var getColor = function(val, bypassMap) {
                var col, t;
                if (bypassMap == null) { bypassMap = false; }
                if (isNaN(val) || (val === null)) { return _nacol; }
                if (!bypassMap) {
                    if (_classes && (_classes.length > 2)) {
                        // find the class
                        var c = getClass(val);
                        t = c / (_classes.length-2);
                    } else if (_max !== _min) {
                        // just interpolate between min/max
                        t = (val - _min) / (_max - _min);
                    } else {
                        t = 1;
                    }
                } else {
                    t = val;
                }

                if (!bypassMap) {
                    t = tmap(t);  // lightness correction
                }

                if (_gamma !== 1) { t = pow$5(t, _gamma); }

                t = _padding[0] + (t * (1 - _padding[0] - _padding[1]));

                t = Math.min(1, Math.max(0, t));

                var k = Math.floor(t * 10000);

                if (_useCache && _colorCache[k]) {
                    col = _colorCache[k];
                } else {
                    if (type$j(_colors) === 'array') {
                        //for i in [0.._pos.length-1]
                        for (var i=0; i<_pos.length; i++) {
                            var p = _pos[i];
                            if (t <= p) {
                                col = _colors[i];
                                break;
                            }
                            if ((t >= p) && (i === (_pos.length-1))) {
                                col = _colors[i];
                                break;
                            }
                            if (t > p && t < _pos[i+1]) {
                                t = (t-p)/(_pos[i+1]-p);
                                col = chroma_1.interpolate(_colors[i], _colors[i+1], t, _mode);
                                break;
                            }
                        }
                    } else if (type$j(_colors) === 'function') {
                        col = _colors(t);
                    }
                    if (_useCache) { _colorCache[k] = col; }
                }
                return col;
            };

            var resetCache = function () { return _colorCache = {}; };

            setColors(colors);

            // public interface

            var f = function(v) {
                var c = chroma_1(getColor(v));
                if (_out && c[_out]) { return c[_out](); } else { return c; }
            };

            f.classes = function(classes) {
                if (classes != null) {
                    if (type$j(classes) === 'array') {
                        _classes = classes;
                        _domain = [classes[0], classes[classes.length-1]];
                    } else {
                        var d = chroma_1.analyze(_domain);
                        if (classes === 0) {
                            _classes = [d.min, d.max];
                        } else {
                            _classes = chroma_1.limits(d, 'e', classes);
                        }
                    }
                    return f;
                }
                return _classes;
            };


            f.domain = function(domain) {
                if (!arguments.length) {
                    return _domain;
                }
                _min = domain[0];
                _max = domain[domain.length-1];
                _pos = [];
                var k = _colors.length;
                if ((domain.length === k) && (_min !== _max)) {
                    // update positions
                    for (var i = 0, list = Array.from(domain); i < list.length; i += 1) {
                        var d = list[i];

                      _pos.push((d-_min) / (_max-_min));
                    }
                } else {
                    for (var c=0; c<k; c++) {
                        _pos.push(c/(k-1));
                    }
                }
                _domain = [_min, _max];
                return f;
            };

            f.mode = function(_m) {
                if (!arguments.length) {
                    return _mode;
                }
                _mode = _m;
                resetCache();
                return f;
            };

            f.range = function(colors, _pos) {
                setColors(colors);
                return f;
            };

            f.out = function(_o) {
                _out = _o;
                return f;
            };

            f.spread = function(val) {
                if (!arguments.length) {
                    return _spread;
                }
                _spread = val;
                return f;
            };

            f.correctLightness = function(v) {
                if (v == null) { v = true; }
                _correctLightness = v;
                resetCache();
                if (_correctLightness) {
                    tmap = function(t) {
                        var L0 = getColor(0, true).lab()[0];
                        var L1 = getColor(1, true).lab()[0];
                        var pol = L0 > L1;
                        var L_actual = getColor(t, true).lab()[0];
                        var L_ideal = L0 + ((L1 - L0) * t);
                        var L_diff = L_actual - L_ideal;
                        var t0 = 0;
                        var t1 = 1;
                        var max_iter = 20;
                        while ((Math.abs(L_diff) > 1e-2) && (max_iter-- > 0)) {
                            (function() {
                                if (pol) { L_diff *= -1; }
                                if (L_diff < 0) {
                                    t0 = t;
                                    t += (t1 - t) * 0.5;
                                } else {
                                    t1 = t;
                                    t += (t0 - t) * 0.5;
                                }
                                L_actual = getColor(t, true).lab()[0];
                                return L_diff = L_actual - L_ideal;
                            })();
                        }
                        return t;
                    };
                } else {
                    tmap = function (t) { return t; };
                }
                return f;
            };

            f.padding = function(p) {
                if (p != null) {
                    if (type$j(p) === 'number') {
                        p = [p,p];
                    }
                    _padding = p;
                    return f;
                } else {
                    return _padding;
                }
            };

            f.colors = function(numColors, out) {
                // If no arguments are given, return the original colors that were provided
                if (arguments.length < 2) { out = 'hex'; }
                var result = [];

                if (arguments.length === 0) {
                    result = _colors.slice(0);

                } else if (numColors === 1) {
                    result = [f(0.5)];

                } else if (numColors > 1) {
                    var dm = _domain[0];
                    var dd = _domain[1] - dm;
                    result = __range__(0, numColors, false).map(function (i) { return f( dm + ((i/(numColors-1)) * dd) ); });

                } else { // returns all colors based on the defined classes
                    colors = [];
                    var samples = [];
                    if (_classes && (_classes.length > 2)) {
                        for (var i = 1, end = _classes.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                            samples.push((_classes[i-1]+_classes[i])*0.5);
                        }
                    } else {
                        samples = _domain;
                    }
                    result = samples.map(function (v) { return f(v); });
                }

                if (chroma_1[out]) {
                    result = result.map(function (c) { return c[out](); });
                }
                return result;
            };

            f.cache = function(c) {
                if (c != null) {
                    _useCache = c;
                    return f;
                } else {
                    return _useCache;
                }
            };

            f.gamma = function(g) {
                if (g != null) {
                    _gamma = g;
                    return f;
                } else {
                    return _gamma;
                }
            };

            f.nodata = function(d) {
                if (d != null) {
                    _nacol = chroma_1(d);
                    return f;
                } else {
                    return _nacol;
                }
            };

            return f;
        };

        function __range__(left, right, inclusive) {
          var range = [];
          var ascending = left < right;
          var end = !inclusive ? right : ascending ? right + 1 : right - 1;
          for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
            range.push(i);
          }
          return range;
        }

        //
        // interpolates between a set of colors uzing a bezier spline
        //

        // @requires utils lab




        var bezier = function(colors) {
            var assign, assign$1, assign$2;

            var I, lab0, lab1, lab2;
            colors = colors.map(function (c) { return new Color_1(c); });
            if (colors.length === 2) {
                // linear interpolation
                (assign = colors.map(function (c) { return c.lab(); }), lab0 = assign[0], lab1 = assign[1]);
                I = function(t) {
                    var lab = ([0, 1, 2].map(function (i) { return lab0[i] + (t * (lab1[i] - lab0[i])); }));
                    return new Color_1(lab, 'lab');
                };
            } else if (colors.length === 3) {
                // quadratic bezier interpolation
                (assign$1 = colors.map(function (c) { return c.lab(); }), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2]);
                I = function(t) {
                    var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t) * lab0[i]) + (2 * (1-t) * t * lab1[i]) + (t * t * lab2[i]); }));
                    return new Color_1(lab, 'lab');
                };
            } else if (colors.length === 4) {
                // cubic bezier interpolation
                var lab3;
                (assign$2 = colors.map(function (c) { return c.lab(); }), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3]);
                I = function(t) {
                    var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t)*(1-t) * lab0[i]) + (3 * (1-t) * (1-t) * t * lab1[i]) + (3 * (1-t) * t * t * lab2[i]) + (t*t*t * lab3[i]); }));
                    return new Color_1(lab, 'lab');
                };
            } else if (colors.length === 5) {
                var I0 = bezier(colors.slice(0, 3));
                var I1 = bezier(colors.slice(2, 5));
                I = function(t) {
                    if (t < 0.5) {
                        return I0(t*2);
                    } else {
                        return I1((t-0.5)*2);
                    }
                };
            }
            return I;
        };

        var bezier_1 = function (colors) {
            var f = bezier(colors);
            f.scale = function () { return scale(f); };
            return f;
        };

        /*
         * interpolates between a set of colors uzing a bezier spline
         * blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
         */




        var blend = function (bottom, top, mode) {
            if (!blend[mode]) {
                throw new Error('unknown blend mode ' + mode);
            }
            return blend[mode](bottom, top);
        };

        var blend_f = function (f) { return function (bottom,top) {
                var c0 = chroma_1(top).rgb();
                var c1 = chroma_1(bottom).rgb();
                return chroma_1.rgb(f(c0, c1));
            }; };

        var each = function (f) { return function (c0, c1) {
                var out = [];
                out[0] = f(c0[0], c1[0]);
                out[1] = f(c0[1], c1[1]);
                out[2] = f(c0[2], c1[2]);
                return out;
            }; };

        var normal = function (a) { return a; };
        var multiply = function (a,b) { return a * b / 255; };
        var darken$1 = function (a,b) { return a > b ? b : a; };
        var lighten = function (a,b) { return a > b ? a : b; };
        var screen = function (a,b) { return 255 * (1 - (1-a/255) * (1-b/255)); };
        var overlay = function (a,b) { return b < 128 ? 2 * a * b / 255 : 255 * (1 - 2 * (1 - a / 255 ) * ( 1 - b / 255 )); };
        var burn = function (a,b) { return 255 * (1 - (1 - b / 255) / (a/255)); };
        var dodge = function (a,b) {
            if (a === 255) { return 255; }
            a = 255 * (b / 255) / (1 - a / 255);
            return a > 255 ? 255 : a
        };

        // # add = (a,b) ->
        // #     if (a + b > 255) then 255 else a + b

        blend.normal = blend_f(each(normal));
        blend.multiply = blend_f(each(multiply));
        blend.screen = blend_f(each(screen));
        blend.overlay = blend_f(each(overlay));
        blend.darken = blend_f(each(darken$1));
        blend.lighten = blend_f(each(lighten));
        blend.dodge = blend_f(each(dodge));
        blend.burn = blend_f(each(burn));
        // blend.add = blend_f(each(add));

        var blend_1 = blend;

        // cubehelix interpolation
        // based on D.A. Green "A colour scheme for the display of astronomical intensity images"
        // http://astron-soc.in/bulletin/11June/289392011.pdf

        var type$k = utils.type;
        var clip_rgb$3 = utils.clip_rgb;
        var TWOPI$2 = utils.TWOPI;
        var pow$6 = Math.pow;
        var sin$2 = Math.sin;
        var cos$3 = Math.cos;


        var cubehelix = function(start, rotations, hue, gamma, lightness) {
            if ( start === void 0 ) start=300;
            if ( rotations === void 0 ) rotations=-1.5;
            if ( hue === void 0 ) hue=1;
            if ( gamma === void 0 ) gamma=1;
            if ( lightness === void 0 ) lightness=[0,1];

            var dh = 0, dl;
            if (type$k(lightness) === 'array') {
                dl = lightness[1] - lightness[0];
            } else {
                dl = 0;
                lightness = [lightness, lightness];
            }

            var f = function(fract) {
                var a = TWOPI$2 * (((start+120)/360) + (rotations * fract));
                var l = pow$6(lightness[0] + (dl * fract), gamma);
                var h = dh !== 0 ? hue[0] + (fract * dh) : hue;
                var amp = (h * l * (1-l)) / 2;
                var cos_a = cos$3(a);
                var sin_a = sin$2(a);
                var r = l + (amp * ((-0.14861 * cos_a) + (1.78277* sin_a)));
                var g = l + (amp * ((-0.29227 * cos_a) - (0.90649* sin_a)));
                var b = l + (amp * (+1.97294 * cos_a));
                return chroma_1(clip_rgb$3([r*255,g*255,b*255,1]));
            };

            f.start = function(s) {
                if ((s == null)) { return start; }
                start = s;
                return f;
            };

            f.rotations = function(r) {
                if ((r == null)) { return rotations; }
                rotations = r;
                return f;
            };

            f.gamma = function(g) {
                if ((g == null)) { return gamma; }
                gamma = g;
                return f;
            };

            f.hue = function(h) {
                if ((h == null)) { return hue; }
                hue = h;
                if (type$k(hue) === 'array') {
                    dh = hue[1] - hue[0];
                    if (dh === 0) { hue = hue[1]; }
                } else {
                    dh = 0;
                }
                return f;
            };

            f.lightness = function(h) {
                if ((h == null)) { return lightness; }
                if (type$k(h) === 'array') {
                    lightness = h;
                    dl = h[1] - h[0];
                } else {
                    lightness = [h,h];
                    dl = 0;
                }
                return f;
            };

            f.scale = function () { return chroma_1.scale(f); };

            f.hue(hue);

            return f;
        };

        var digits = '0123456789abcdef';

        var floor$2 = Math.floor;
        var random = Math.random;

        var random_1 = function () {
            var code = '#';
            for (var i=0; i<6; i++) {
                code += digits.charAt(floor$2(random() * 16));
            }
            return new Color_1(code, 'hex');
        };

        var log$1 = Math.log;
        var pow$7 = Math.pow;
        var floor$3 = Math.floor;
        var abs = Math.abs;


        var analyze = function (data, key) {
            if ( key === void 0 ) key=null;

            var r = {
                min: Number.MAX_VALUE,
                max: Number.MAX_VALUE*-1,
                sum: 0,
                values: [],
                count: 0
            };
            if (type(data) === 'object') {
                data = Object.values(data);
            }
            data.forEach(function (val) {
                if (key && type(val) === 'object') { val = val[key]; }
                if (val !== undefined && val !== null && !isNaN(val)) {
                    r.values.push(val);
                    r.sum += val;
                    if (val < r.min) { r.min = val; }
                    if (val > r.max) { r.max = val; }
                    r.count += 1;
                }
            });

            r.domain = [r.min, r.max];

            r.limits = function (mode, num) { return limits(r, mode, num); };

            return r;
        };


        var limits = function (data, mode, num) {
            if ( mode === void 0 ) mode='equal';
            if ( num === void 0 ) num=7;

            if (type(data) == 'array') {
                data = analyze(data);
            }
            var min = data.min;
            var max = data.max;
            var values = data.values.sort(function (a,b) { return a-b; });

            if (num === 1) { return [min,max]; }

            var limits = [];

            if (mode.substr(0,1) === 'c') { // continuous
                limits.push(min);
                limits.push(max);
            }

            if (mode.substr(0,1) === 'e') { // equal interval
                limits.push(min);
                for (var i=1; i<num; i++) {
                    limits.push(min+((i/num)*(max-min)));
                }
                limits.push(max);
            }

            else if (mode.substr(0,1) === 'l') { // log scale
                if (min <= 0) {
                    throw new Error('Logarithmic scales are only possible for values > 0');
                }
                var min_log = Math.LOG10E * log$1(min);
                var max_log = Math.LOG10E * log$1(max);
                limits.push(min);
                for (var i$1=1; i$1<num; i$1++) {
                    limits.push(pow$7(10, min_log + ((i$1/num) * (max_log - min_log))));
                }
                limits.push(max);
            }

            else if (mode.substr(0,1) === 'q') { // quantile scale
                limits.push(min);
                for (var i$2=1; i$2<num; i$2++) {
                    var p = ((values.length-1) * i$2)/num;
                    var pb = floor$3(p);
                    if (pb === p) {
                        limits.push(values[pb]);
                    } else { // p > pb
                        var pr = p - pb;
                        limits.push((values[pb]*(1-pr)) + (values[pb+1]*pr));
                    }
                }
                limits.push(max);

            }

            else if (mode.substr(0,1) === 'k') { // k-means clustering
                /*
                implementation based on
                http://code.google.com/p/figue/source/browse/trunk/figue.js#336
                simplified for 1-d input values
                */
                var cluster;
                var n = values.length;
                var assignments = new Array(n);
                var clusterSizes = new Array(num);
                var repeat = true;
                var nb_iters = 0;
                var centroids = null;

                // get seed values
                centroids = [];
                centroids.push(min);
                for (var i$3=1; i$3<num; i$3++) {
                    centroids.push(min + ((i$3/num) * (max-min)));
                }
                centroids.push(max);

                while (repeat) {
                    // assignment step
                    for (var j=0; j<num; j++) {
                        clusterSizes[j] = 0;
                    }
                    for (var i$4=0; i$4<n; i$4++) {
                        var value = values[i$4];
                        var mindist = Number.MAX_VALUE;
                        var best = (void 0);
                        for (var j$1=0; j$1<num; j$1++) {
                            var dist = abs(centroids[j$1]-value);
                            if (dist < mindist) {
                                mindist = dist;
                                best = j$1;
                            }
                            clusterSizes[best]++;
                            assignments[i$4] = best;
                        }
                    }

                    // update centroids step
                    var newCentroids = new Array(num);
                    for (var j$2=0; j$2<num; j$2++) {
                        newCentroids[j$2] = null;
                    }
                    for (var i$5=0; i$5<n; i$5++) {
                        cluster = assignments[i$5];
                        if (newCentroids[cluster] === null) {
                            newCentroids[cluster] = values[i$5];
                        } else {
                            newCentroids[cluster] += values[i$5];
                        }
                    }
                    for (var j$3=0; j$3<num; j$3++) {
                        newCentroids[j$3] *= 1/clusterSizes[j$3];
                    }

                    // check convergence
                    repeat = false;
                    for (var j$4=0; j$4<num; j$4++) {
                        if (newCentroids[j$4] !== centroids[j$4]) {
                            repeat = true;
                            break;
                        }
                    }

                    centroids = newCentroids;
                    nb_iters++;

                    if (nb_iters > 200) {
                        repeat = false;
                    }
                }

                // finished k-means clustering
                // the next part is borrowed from gabrielflor.it
                var kClusters = {};
                for (var j$5=0; j$5<num; j$5++) {
                    kClusters[j$5] = [];
                }
                for (var i$6=0; i$6<n; i$6++) {
                    cluster = assignments[i$6];
                    kClusters[cluster].push(values[i$6]);
                }
                var tmpKMeansBreaks = [];
                for (var j$6=0; j$6<num; j$6++) {
                    tmpKMeansBreaks.push(kClusters[j$6][0]);
                    tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length-1]);
                }
                tmpKMeansBreaks = tmpKMeansBreaks.sort(function (a,b){ return a-b; });
                limits.push(tmpKMeansBreaks[0]);
                for (var i$7=1; i$7 < tmpKMeansBreaks.length; i$7+= 2) {
                    var v = tmpKMeansBreaks[i$7];
                    if (!isNaN(v) && (limits.indexOf(v) === -1)) {
                        limits.push(v);
                    }
                }
            }
            return limits;
        };

        var analyze_1 = {analyze: analyze, limits: limits};

        var contrast = function (a, b) {
            // WCAG contrast ratio
            // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
            a = new Color_1(a);
            b = new Color_1(b);
            var l1 = a.luminance();
            var l2 = b.luminance();
            return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
        };

        var sqrt$4 = Math.sqrt;
        var atan2$2 = Math.atan2;
        var abs$1 = Math.abs;
        var cos$4 = Math.cos;
        var PI$2 = Math.PI;

        var deltaE = function(a, b, L, C) {
            if ( L === void 0 ) L=1;
            if ( C === void 0 ) C=1;

            // Delta E (CMC)
            // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html
            a = new Color_1(a);
            b = new Color_1(b);
            var ref = Array.from(a.lab());
            var L1 = ref[0];
            var a1 = ref[1];
            var b1 = ref[2];
            var ref$1 = Array.from(b.lab());
            var L2 = ref$1[0];
            var a2 = ref$1[1];
            var b2 = ref$1[2];
            var c1 = sqrt$4((a1 * a1) + (b1 * b1));
            var c2 = sqrt$4((a2 * a2) + (b2 * b2));
            var sl = L1 < 16.0 ? 0.511 : (0.040975 * L1) / (1.0 + (0.01765 * L1));
            var sc = ((0.0638 * c1) / (1.0 + (0.0131 * c1))) + 0.638;
            var h1 = c1 < 0.000001 ? 0.0 : (atan2$2(b1, a1) * 180.0) / PI$2;
            while (h1 < 0) { h1 += 360; }
            while (h1 >= 360) { h1 -= 360; }
            var t = (h1 >= 164.0) && (h1 <= 345.0) ? (0.56 + abs$1(0.2 * cos$4((PI$2 * (h1 + 168.0)) / 180.0))) : (0.36 + abs$1(0.4 * cos$4((PI$2 * (h1 + 35.0)) / 180.0)));
            var c4 = c1 * c1 * c1 * c1;
            var f = sqrt$4(c4 / (c4 + 1900.0));
            var sh = sc * (((f * t) + 1.0) - f);
            var delL = L1 - L2;
            var delC = c1 - c2;
            var delA = a1 - a2;
            var delB = b1 - b2;
            var dH2 = ((delA * delA) + (delB * delB)) - (delC * delC);
            var v1 = delL / (L * sl);
            var v2 = delC / (C * sc);
            var v3 = sh;
            return sqrt$4((v1 * v1) + (v2 * v2) + (dH2 / (v3 * v3)));
        };

        // simple Euclidean distance
        var distance = function(a, b, mode) {
            if ( mode === void 0 ) mode='lab';

            // Delta E (CIE 1976)
            // see http://www.brucelindbloom.com/index.html?Equations.html
            a = new Color_1(a);
            b = new Color_1(b);
            var l1 = a.get(mode);
            var l2 = b.get(mode);
            var sum_sq = 0;
            for (var i in l1) {
                var d = (l1[i] || 0) - (l2[i] || 0);
                sum_sq += d*d;
            }
            return Math.sqrt(sum_sq);
        };

        var valid = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            try {
                new (Function.prototype.bind.apply( Color_1, [ null ].concat( args) ));
                return true;
            } catch (e) {
                return false;
            }
        };

        // some pre-defined color scales:




        var scales = {
        	cool: function cool() { return scale([chroma_1.hsl(180,1,.9), chroma_1.hsl(250,.7,.4)]) },
        	hot: function hot() { return scale(['#000','#f00','#ff0','#fff']).mode('rgb') }
        };

        /**
            ColorBrewer colors for chroma.js

            Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
            Pennsylvania State University.

            Licensed under the Apache License, Version 2.0 (the "License");
            you may not use this file except in compliance with the License.
            You may obtain a copy of the License at
            http://www.apache.org/licenses/LICENSE-2.0

            Unless required by applicable law or agreed to in writing, software distributed
            under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
            CONDITIONS OF ANY KIND, either express or implied. See the License for the
            specific language governing permissions and limitations under the License.
        */

        var colorbrewer = {
            // sequential
            OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
            PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
            BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
            Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
            BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
            YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
            YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
            Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
            RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
            Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
            YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
            Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
            GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
            Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
            YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
            PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
            Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
            PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
            Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],

            // diverging

            Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
            RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
            RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
            PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
            PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
            RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
            BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
            RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
            PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],

            // qualitative

            Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
            Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
            Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
            Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
            Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
            Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
            Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
            Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2'],
        };

        // add lowercase aliases for case-insensitive matches
        for (var i$1 = 0, list$1 = Object.keys(colorbrewer); i$1 < list$1.length; i$1 += 1) {
            var key = list$1[i$1];

            colorbrewer[key.toLowerCase()] = colorbrewer[key];
        }

        var colorbrewer_1 = colorbrewer;

        // feel free to comment out anything to rollup
        // a smaller chroma.js built

        // io --> convert colors















        // operators --> modify existing Colors










        // interpolators










        // generators -- > create new colors
        chroma_1.average = average;
        chroma_1.bezier = bezier_1;
        chroma_1.blend = blend_1;
        chroma_1.cubehelix = cubehelix;
        chroma_1.mix = chroma_1.interpolate = mix;
        chroma_1.random = random_1;
        chroma_1.scale = scale;

        // other utility methods
        chroma_1.analyze = analyze_1.analyze;
        chroma_1.contrast = contrast;
        chroma_1.deltaE = deltaE;
        chroma_1.distance = distance;
        chroma_1.limits = analyze_1.limits;
        chroma_1.valid = valid;

        // scale
        chroma_1.scales = scales;

        // colors
        chroma_1.colors = w3cx11_1;
        chroma_1.brewer = colorbrewer_1;

        var chroma_js = chroma_1;

        return chroma_js;

    })));
    });

    /* src/Checkbox.svelte generated by Svelte v3.37.0 */

    const file = "src/Checkbox.svelte";

    function create_fragment(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label_1;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label_1 = element("label");
    			t1 = text(/*label*/ ctx[3]);
    			input.disabled = /*disabled*/ ctx[1];
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "custom-control-input");
    			attr_dev(input, "id", /*id*/ ctx[4]);
    			add_location(input, file, 9, 4, 285);
    			attr_dev(label_1, "class", "custom-control-label");
    			attr_dev(label_1, "for", /*id*/ ctx[4]);
    			add_location(label_1, file, 10, 4, 384);
    			attr_dev(div, "class", "custom-control custom-checkbox");
    			toggle_class(div, "custom-control-inline", /*inline*/ ctx[2]);
    			add_location(div, file, 8, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = /*value*/ ctx[0];
    			append_dev(div, t0);
    			append_dev(div, label_1);
    			append_dev(label_1, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*disabled*/ 2) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 1) {
    				input.checked = /*value*/ ctx[0];
    			}

    			if (dirty & /*label*/ 8) set_data_dev(t1, /*label*/ ctx[3]);

    			if (dirty & /*inline*/ 4) {
    				toggle_class(div, "custom-control-inline", /*inline*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Checkbox", slots, []);
    	let { value = false } = $$props;
    	let { disabled = false } = $$props;
    	let { inline = true } = $$props;
    	let { label = "" } = $$props;
    	const id = Math.round(Math.random() * 10000000).toString(36);
    	const writable_props = ["value", "disabled", "inline", "label"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Checkbox> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		value = this.checked;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("inline" in $$props) $$invalidate(2, inline = $$props.inline);
    		if ("label" in $$props) $$invalidate(3, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({ value, disabled, inline, label, id });

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("inline" in $$props) $$invalidate(2, inline = $$props.inline);
    		if ("label" in $$props) $$invalidate(3, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, disabled, inline, label, id, input_change_handler];
    }

    class Checkbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			value: 0,
    			disabled: 1,
    			inline: 2,
    			label: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get value() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeMax = Math.max;

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    var global$1 = (typeof global !== "undefined" ? global :
                typeof self !== "undefined" ? self :
                typeof window !== "undefined" ? window : {});

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global$1 == 'object' && global$1 && global$1.Object === Object && global$1;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Built-in value references. */
    var Symbol$1 = root.Symbol;

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Built-in value references. */
    var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$1.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString$1.call(value);
    }

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag$1 && symToStringTag$1 in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER$1 = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER$1 : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /** Used as references for various `Number` constants. */
    var NAN = 0 / 0;

    /** Used to match leading and trailing whitespace. */
    var reTrim = /^\s+|\s+$/g;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0,
        MAX_INTEGER = 1.7976931348623157e+308;

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /* src/Color.svelte generated by Svelte v3.37.0 */
    const file$1 = "src/Color.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (86:4) {#if open && !dragging}
    function create_if_block(ctx) {
    	let div6;
    	let div5;
    	let div0;
    	let t0;
    	let h3;
    	let t1;
    	let div4;
    	let div1;
    	let span0;
    	let t3;
    	let t4;
    	let div2;
    	let span1;
    	let t6;
    	let t7;
    	let div3;
    	let span2;
    	let t9;
    	let each_value_2 = /*lightness*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*saturation*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*hue*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			t0 = space();
    			h3 = element("h3");
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "L";
    			t3 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t4 = space();
    			div2 = element("div");
    			span1 = element("span");
    			span1.textContent = "S";
    			t6 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t7 = space();
    			div3 = element("div");
    			span2 = element("span");
    			span2.textContent = "H";
    			t9 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "arrow");
    			set_style(div0, "left", "121px");
    			add_location(div0, file$1, 90, 12, 2425);
    			attr_dev(h3, "class", "popover-header");
    			add_location(h3, file$1, 91, 12, 2484);
    			attr_dev(span0, "class", "lbl svelte-t530zu");
    			add_location(span0, file$1, 94, 20, 2616);
    			attr_dev(div1, "class", "color-row svelte-t530zu");
    			add_location(div1, file$1, 93, 16, 2572);
    			attr_dev(span1, "class", "lbl svelte-t530zu");
    			add_location(span1, file$1, 100, 20, 2904);
    			attr_dev(div2, "class", "color-row svelte-t530zu");
    			add_location(div2, file$1, 99, 16, 2860);
    			attr_dev(span2, "class", "lbl svelte-t530zu");
    			add_location(span2, file$1, 106, 20, 3193);
    			attr_dev(div3, "class", "color-row svelte-t530zu");
    			add_location(div3, file$1, 105, 16, 3149);
    			attr_dev(div4, "class", "popover-body");
    			add_location(div4, file$1, 92, 12, 2529);
    			attr_dev(div5, "class", "popover fade show bs-popover-bottom svelte-t530zu");
    			attr_dev(div5, "role", "tooltip");
    			attr_dev(div5, "x-placement", "bottom");
    			add_location(div5, file$1, 87, 8, 2303);
    			set_style(div6, "position", "absolute");
    			set_style(div6, "top", "0px");
    			set_style(div6, "left", "0");
    			set_style(div6, "right", "0");
    			set_style(div6, "height", "40px");
    			add_location(div6, file$1, 86, 4, 2226);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			append_dev(div5, t0);
    			append_dev(div5, h3);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t3);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div1, null);
    			}

    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div2, span1);
    			append_dev(div2, t6);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, span2);
    			append_dev(div3, t9);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*lightness, value*/ 17) {
    				each_value_2 = /*lightness*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*saturation, value*/ 33) {
    				each_value_1 = /*saturation*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*hue, value*/ 65) {
    				each_value = /*hue*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(86:4) {#if open && !dragging}",
    		ctx
    	});

    	return block;
    }

    // (96:20) {#each lightness as l}
    function create_each_block_2(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[11](/*l*/ ctx[22]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "color svelte-t530zu");
    			set_style(span, "background", /*l*/ ctx[22].hex());
    			add_location(span, file$1, 96, 20, 2706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*lightness*/ 16) {
    				set_style(span, "background", /*l*/ ctx[22].hex());
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(96:20) {#each lightness as l}",
    		ctx
    	});

    	return block;
    }

    // (102:20) {#each saturation as c}
    function create_each_block_1(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[12](/*c*/ ctx[17]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "color svelte-t530zu");
    			set_style(span, "background", /*c*/ ctx[17].hex());
    			add_location(span, file$1, 102, 20, 2995);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*saturation*/ 32) {
    				set_style(span, "background", /*c*/ ctx[17].hex());
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(102:20) {#each saturation as c}",
    		ctx
    	});

    	return block;
    }

    // (108:20) {#each hue as c}
    function create_each_block(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[13](/*c*/ ctx[17]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "color svelte-t530zu");
    			set_style(span, "background", /*c*/ ctx[17].hex());
    			add_location(span, file$1, 108, 20, 3277);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*hue*/ 64) {
    				set_style(span, "background", /*c*/ ctx[17].hex());
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(108:20) {#each hue as c}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let span1;
    	let span0;
    	let t0_value = /*value*/ ctx[0].hex().substr(1) + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;
    	let if_block = /*open*/ ctx[2] && !/*dragging*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(span0, "class", "hex svelte-t530zu");
    			add_location(span0, file$1, 84, 4, 2145);
    			attr_dev(span1, "draggable", "true");
    			attr_dev(span1, "class", "badge shadow-sm svelte-t530zu");
    			set_style(span1, "background", /*value*/ ctx[0].hex());
    			toggle_class(span1, "inverted", /*value*/ ctx[0].lab()[0] < 50);
    			add_location(span1, file$1, 73, 0, 1747);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);
    			append_dev(span0, t0);
    			append_dev(span1, t1);
    			if (if_block) if_block.m(span1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "dragstart", /*dragstart_handler*/ ctx[10], false, false, false),
    					listen_dev(span1, "dragstart", /*dragstart_handler_1*/ ctx[14], false, false, false),
    					listen_dev(
    						span1,
    						"dragend",
    						function () {
    							if (is_function((/*dragend_handler*/ ctx[15], /*open*/ ctx[2] = false))) (/*dragend_handler*/ ctx[15], /*open*/ ctx[2] = false).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(span1, "mouseenter", /*toggleEditOpen*/ ctx[7], false, false, false),
    					listen_dev(span1, "mouseleave", /*toggleEditClose*/ ctx[8], false, false, false),
    					listen_dev(span1, "click", stop_propagation(click_handler_3), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*value*/ 1 && t0_value !== (t0_value = /*value*/ ctx[0].hex().substr(1) + "")) set_data_dev(t0, t0_value);

    			if (/*open*/ ctx[2] && !/*dragging*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(span1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*value*/ 1) {
    				set_style(span1, "background", /*value*/ ctx[0].hex());
    			}

    			if (dirty & /*value*/ 1) {
    				toggle_class(span1, "inverted", /*value*/ ctx[0].lab()[0] < 50);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler_3 = () => false;

    function instance$1($$self, $$props, $$invalidate) {
    	let lch;
    	let lightness;
    	let saturation;
    	let hue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Color", slots, []);
    	let { value = chroma("red") } = $$props;
    	let { readOnly = false } = $$props;
    	let open = false;
    	let dragging = false;

    	function toggleEditOpen() {
    		$$invalidate(2, open = readOnly ? false : true);
    	}

    	function toggleEditClose() {
    		$$invalidate(2, open = false);
    	}

    	let colorName;
    	const writable_props = ["value", "readOnly"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Color> was created with unknown prop '${key}'`);
    	});

    	function dragstart_handler(event) {
    		bubble($$self, event);
    	}

    	const click_handler = l => $$invalidate(0, value = l);
    	const click_handler_1 = c => $$invalidate(0, value = c);
    	const click_handler_2 = c => $$invalidate(0, value = c);
    	const dragstart_handler_1 = event => $$invalidate(3, dragging = readOnly ? false : true);
    	const dragend_handler = event => $$invalidate(3, dragging = false);

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("readOnly" in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    	};

    	$$self.$capture_state = () => ({
    		chroma,
    		range,
    		value,
    		readOnly,
    		open,
    		dragging,
    		toggleEditOpen,
    		toggleEditClose,
    		colorName,
    		lch,
    		lightness,
    		saturation,
    		hue
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("readOnly" in $$props) $$invalidate(1, readOnly = $$props.readOnly);
    		if ("open" in $$props) $$invalidate(2, open = $$props.open);
    		if ("dragging" in $$props) $$invalidate(3, dragging = $$props.dragging);
    		if ("colorName" in $$props) colorName = $$props.colorName;
    		if ("lch" in $$props) $$invalidate(9, lch = $$props.lch);
    		if ("lightness" in $$props) $$invalidate(4, lightness = $$props.lightness);
    		if ("saturation" in $$props) $$invalidate(5, saturation = $$props.saturation);
    		if ("hue" in $$props) $$invalidate(6, hue = $$props.hue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			 $$invalidate(9, lch = value.lch());
    		}

    		if ($$self.$$.dirty & /*lch*/ 512) {
    			 $$invalidate(4, lightness = range(-5, 6).map(l => lch[0] + Math.pow(l / 8, 2) * 80 * (l < 0 ? -1 : 1)).map(l => chroma.lch(l, lch[1], lch[2])));
    		}

    		if ($$self.$$.dirty & /*lch*/ 512) {
    			 $$invalidate(5, saturation = range(-5, 6).map(s => Math.max(0, lch[1] + Math.pow(s / 5, 2) * 80 * (s < 0 ? -1 : 1))).map(s => chroma.lch(lch[0], s, lch[2])));
    		}

    		if ($$self.$$.dirty & /*lch*/ 512) {
    			 $$invalidate(6, hue = range(-5, 6).map(h => lch[2] + Math.pow(h / 5, 2) * 80 * (h < 0 ? -1 : 1)).map(h => chroma.lch(lch[0], lch[1], h < 0 ? h + 360 : h > 360 ? h - 360 : h)));
    		}
    	};

    	return [
    		value,
    		readOnly,
    		open,
    		dragging,
    		lightness,
    		saturation,
    		hue,
    		toggleEditOpen,
    		toggleEditClose,
    		lch,
    		dragstart_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		dragstart_handler_1,
    		dragend_handler
    	];
    }

    class Color extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { value: 0, readOnly: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Color",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get value() {
    		throw new Error("<Color>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Color>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readOnly() {
    		throw new Error("<Color>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readOnly(value) {
    		throw new Error("<Color>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ColorList.svelte generated by Svelte v3.37.0 */
    const file$2 = "src/ColorList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[14] = list;
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (70:0) {#if !edit}
    function create_if_block$1(ctx) {
    	let div;
    	let t;
    	let span;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*colors*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			span = element("span");
    			attr_dev(span, "class", "inv svelte-zqagyi");
    			add_location(span, file$2, 80, 4, 2000);
    			attr_dev(div, "class", "form-control svelte-zqagyi");
    			add_location(div, file$2, 70, 0, 1681);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    			append_dev(div, span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "drop", prevent_default(/*drop_handler*/ ctx[11]), false, true, false),
    					listen_dev(div, "dragover", prevent_default(/*dragover_handler*/ ctx[12]), false, true, false),
    					listen_dev(div, "click", /*enterEditMode*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*colors, dragstart*/ 1) {
    				each_value = /*colors*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(70:0) {#if !edit}",
    		ctx
    	});

    	return block;
    }

    // (76:4) {#each colors as color,i}
    function create_each_block$1(ctx) {
    	let color;
    	let updating_value;
    	let current;

    	function color_value_binding(value) {
    		/*color_value_binding*/ ctx[9](value, /*color*/ ctx[13], /*each_value*/ ctx[14], /*i*/ ctx[15]);
    	}

    	function dragstart_handler(...args) {
    		return /*dragstart_handler*/ ctx[10](/*i*/ ctx[15], ...args);
    	}

    	let color_props = {};

    	if (/*color*/ ctx[13] !== void 0) {
    		color_props.value = /*color*/ ctx[13];
    	}

    	color = new Color({ props: color_props, $$inline: true });
    	binding_callbacks.push(() => bind(color, "value", color_value_binding));
    	color.$on("dragstart", dragstart_handler);

    	const block = {
    		c: function create() {
    			create_component(color.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(color, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const color_changes = {};

    			if (!updating_value && dirty & /*colors*/ 1) {
    				updating_value = true;
    				color_changes.value = /*color*/ ctx[13];
    				add_flush_callback(() => updating_value = false);
    			}

    			color.$set(color_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(color.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(color.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(color, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(76:4) {#each colors as color,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let input_1;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = !/*edit*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			input_1 = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "class", "form-control svelte-zqagyi");
    			toggle_class(input_1, "hidden", !/*edit*/ ctx[1]);
    			add_location(input_1, file$2, 68, 0, 1541);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    			/*input_1_binding*/ ctx[7](input_1);
    			set_input_value(input_1, /*colorString*/ ctx[3]);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[8]),
    					listen_dev(input_1, "blur", /*exitEditMode*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*colorString*/ 8 && input_1.value !== /*colorString*/ ctx[3]) {
    				set_input_value(input_1, /*colorString*/ ctx[3]);
    			}

    			if (dirty & /*edit*/ 2) {
    				toggle_class(input_1, "hidden", !/*edit*/ ctx[1]);
    			}

    			if (!/*edit*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*edit*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    			/*input_1_binding*/ ctx[7](null);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function dragstart(event, index) {
    	event.dataTransfer.setData("index", index);
    }

    function dragover(event) {
    	event.dataTransfer.dropEffect = "move";
    }

    function findIndex(el) {
    	const siblings = el.parentNode.children;

    	for (let i = 0; i < siblings.length; i++) {
    		if (siblings[i] === el) return i;
    	}

    	return -1;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ColorList", slots, []);
    	let { colors } = $$props;
    	let edit = false;
    	let input;
    	let colorString = "";

    	function enterEditMode() {
    		$$invalidate(1, edit = true);
    		$$invalidate(3, colorString = colors.map(c => c.name()).join(", "));
    		input.focus();
    	}

    	function exitEditMode() {
    		$$invalidate(1, edit = false);
    		$$invalidate(0, colors = colorString.split(/\s*[,|\s]\s*/).filter(c => chroma.valid(c)).map(c => chroma(c)));
    	}

    	function drop(event) {
    		const index = event.dataTransfer.getData("index");
    		const newIndex = findIndex(event.target);
    		const col = colors.splice(index, 1, null)[0];
    		colors.splice(newIndex, 0, col);
    		$$invalidate(0, colors = colors.filter(c => c !== null));
    	}

    	const writable_props = ["colors"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColorList> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			input = $$value;
    			$$invalidate(2, input);
    		});
    	}

    	function input_1_input_handler() {
    		colorString = this.value;
    		$$invalidate(3, colorString);
    	}

    	function color_value_binding(value, color, each_value, i) {
    		each_value[i] = value;
    		$$invalidate(0, colors);
    	}

    	const dragstart_handler = (i, event) => dragstart(event, i);
    	const drop_handler = event => drop(event);
    	const dragover_handler = event => dragover(event);

    	$$self.$$set = $$props => {
    		if ("colors" in $$props) $$invalidate(0, colors = $$props.colors);
    	};

    	$$self.$capture_state = () => ({
    		chroma,
    		Color,
    		colors,
    		edit,
    		input,
    		colorString,
    		enterEditMode,
    		exitEditMode,
    		dragstart,
    		dragover,
    		drop,
    		findIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ("colors" in $$props) $$invalidate(0, colors = $$props.colors);
    		if ("edit" in $$props) $$invalidate(1, edit = $$props.edit);
    		if ("input" in $$props) $$invalidate(2, input = $$props.input);
    		if ("colorString" in $$props) $$invalidate(3, colorString = $$props.colorString);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		colors,
    		edit,
    		input,
    		colorString,
    		enterEditMode,
    		exitEditMode,
    		drop,
    		input_1_binding,
    		input_1_input_handler,
    		color_value_binding,
    		dragstart_handler,
    		drop_handler,
    		dragover_handler
    	];
    }

    class ColorList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { colors: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorList",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*colors*/ ctx[0] === undefined && !("colors" in props)) {
    			console.warn("<ColorList> was created without expected prop 'colors'");
    		}
    	}

    	get colors() {
    		throw new Error("<ColorList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<ColorList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/InputColors.svelte generated by Svelte v3.37.0 */
    const file$3 = "src/InputColors.svelte";

    // (16:4) {#if diverging}
    function create_if_block$2(ctx) {
    	let div;
    	let colorlist;
    	let updating_colors;
    	let current;

    	function colorlist_colors_binding_1(value) {
    		/*colorlist_colors_binding_1*/ ctx[4](value);
    	}

    	let colorlist_props = {};

    	if (/*colors2*/ ctx[1] !== void 0) {
    		colorlist_props.colors = /*colors2*/ ctx[1];
    	}

    	colorlist = new ColorList({ props: colorlist_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorlist, "colors", colorlist_colors_binding_1));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(colorlist.$$.fragment);
    			attr_dev(div, "class", "col-md");
    			add_location(div, file$3, 16, 4, 290);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(colorlist, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const colorlist_changes = {};

    			if (!updating_colors && dirty & /*colors2*/ 2) {
    				updating_colors = true;
    				colorlist_changes.colors = /*colors2*/ ctx[1];
    				add_flush_callback(() => updating_colors = false);
    			}

    			colorlist.$set(colorlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colorlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colorlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(colorlist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(16:4) {#if diverging}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let colorlist;
    	let updating_colors;
    	let t;
    	let current;

    	function colorlist_colors_binding(value) {
    		/*colorlist_colors_binding*/ ctx[3](value);
    	}

    	let colorlist_props = {};

    	if (/*colors*/ ctx[0] !== void 0) {
    		colorlist_props.colors = /*colors*/ ctx[0];
    	}

    	colorlist = new ColorList({ props: colorlist_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorlist, "colors", colorlist_colors_binding));
    	let if_block = /*diverging*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(colorlist.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "col-md");
    			add_location(div0, file$3, 12, 4, 200);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$3, 11, 0, 178);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(colorlist, div0, null);
    			append_dev(div1, t);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const colorlist_changes = {};

    			if (!updating_colors && dirty & /*colors*/ 1) {
    				updating_colors = true;
    				colorlist_changes.colors = /*colors*/ ctx[0];
    				add_flush_callback(() => updating_colors = false);
    			}

    			colorlist.$set(colorlist_changes);

    			if (/*diverging*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*diverging*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colorlist.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colorlist.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(colorlist);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("InputColors", slots, []);
    	let { colors = [] } = $$props;
    	let { colors2 = [] } = $$props;
    	let { diverging = false } = $$props;
    	const writable_props = ["colors", "colors2", "diverging"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InputColors> was created with unknown prop '${key}'`);
    	});

    	function colorlist_colors_binding(value) {
    		colors = value;
    		$$invalidate(0, colors);
    	}

    	function colorlist_colors_binding_1(value) {
    		colors2 = value;
    		$$invalidate(1, colors2);
    	}

    	$$self.$$set = $$props => {
    		if ("colors" in $$props) $$invalidate(0, colors = $$props.colors);
    		if ("colors2" in $$props) $$invalidate(1, colors2 = $$props.colors2);
    		if ("diverging" in $$props) $$invalidate(2, diverging = $$props.diverging);
    	};

    	$$self.$capture_state = () => ({ ColorList, colors, colors2, diverging });

    	$$self.$inject_state = $$props => {
    		if ("colors" in $$props) $$invalidate(0, colors = $$props.colors);
    		if ("colors2" in $$props) $$invalidate(1, colors2 = $$props.colors2);
    		if ("diverging" in $$props) $$invalidate(2, diverging = $$props.diverging);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		colors,
    		colors2,
    		diverging,
    		colorlist_colors_binding,
    		colorlist_colors_binding_1
    	];
    }

    class InputColors extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { colors: 0, colors2: 1, diverging: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputColors",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get colors() {
    		throw new Error("<InputColors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<InputColors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors2() {
    		throw new Error("<InputColors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors2(value) {
    		throw new Error("<InputColors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get diverging() {
    		throw new Error("<InputColors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set diverging(value) {
    		throw new Error("<InputColors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* globals blinder */

    function colorBlindCheck(colors) {
        const types = ["deuteranopia", "protanopia", "tritanopia"];
        const invalid = [];
        for (let i = 0; i < types.length; i++) {
            if (!checkType(colors, types[i])) invalid.push(types[i]);
        }
        return invalid;
    }

    function colorBlindSim(color, type) {
        return blinder[type](chroma(color).hex());
    }

    function checkType(colors, type) {
        // let ok = 0;
        let notok = 0;
        let ratioThreshold = 5;
        let smallestPerceivableDistance = 9;
        let k = colors.length;
        if (!k) {
            // console.log('no colors', type);
            return true;
        }
        // compute distances between colors
        for (let a = 0; a < k; a++) {
            for (let b = a + 1; b < k; b++) {
                let colorA = chroma(colors[a]);
                let colorB = chroma(colors[b]);
                let distanceNorm = difference(colorA, colorB);
                if (distanceNorm < smallestPerceivableDistance) continue;
                let aSim = blinder[type](colorA.hex());
                let bSim = blinder[type](colorB.hex());
                let distanceSim = difference(aSim, bSim);
                let isNotOk =
                    distanceNorm / distanceSim > ratioThreshold &&
                    distanceSim < smallestPerceivableDistance;
                // count combinations that are problematic
                if (isNotOk) notok++;
                // else ok++;
            }
        }
        // console.log(type, notok/(ok+notok));
        // compute share of problematic colorss
        return notok === 0;
    }

    function difference(colorA, colorB) {
        return (
            0.5 * (chroma.deltaE(colorA, colorB) + chroma.deltaE(colorB, colorA))
        );
    }

    /* src/PalettePreview.svelte generated by Svelte v3.37.0 */
    const file$4 = "src/PalettePreview.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (79:4) {#each steps as step}
    function create_each_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "step svelte-iwtfhk");

    			set_style(div, "background", /*simulate*/ ctx[1] === "none"
    			? /*step*/ ctx[17]
    			: colorBlindSim(/*step*/ ctx[17], /*simulate*/ ctx[1]));

    			add_location(div, file$4, 79, 4, 2614);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*simulate, steps*/ 3) {
    				set_style(div, "background", /*simulate*/ ctx[1] === "none"
    				? /*step*/ ctx[17]
    				: colorBlindSim(/*step*/ ctx[17], /*simulate*/ ctx[1]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(79:4) {#each steps as step}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let each_value = /*steps*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "palette svelte-iwtfhk");
    			add_location(div, file$4, 77, 0, 2562);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*simulate, steps, colorBlindSim*/ 3) {
    				each_value = /*steps*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let even;
    	let numColorsLeft;
    	let numColorsRight;
    	let genColors;
    	let genColors2;
    	let stepsLeft;
    	let stepsRight;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PalettePreview", slots, []);
    	let { colors = ["red"] } = $$props;
    	let { colors2 = [] } = $$props;
    	let { numColors = 7 } = $$props;
    	let { diverging = false } = $$props;
    	let { bezier } = $$props;
    	let { correctLightness } = $$props;
    	let { simulate = "none" } = $$props;
    	let { steps } = $$props;

    	function autoGradient(color, numColors) {
    		const lab = chroma(color).lab();
    		const lRange = 100 * (0.95 - 1 / numColors);
    		const lStep = lRange / (numColors - 1);
    		let lStart = (100 - lRange) * 0.5;
    		const range$1 = range(lStart, lStart + numColors * lStep, lStep);
    		let offset = 0;

    		if (!diverging) {
    			offset = 9999;

    			for (let i = 0; i < numColors; i++) {
    				let diff = lab[0] - range$1[i];

    				if (Math.abs(diff) < Math.abs(offset)) {
    					offset = diff;
    				}
    			}
    		}

    		return range$1.map(l => chroma.lab([l + offset, lab[1], lab[2]]));
    	}

    	function autoColors(color, numColors, reverse = false) {
    		if (diverging) {
    			const colors = autoGradient(color, 3).concat(chroma("#f5f5f5"));
    			if (reverse) colors.reverse();
    			return colors;
    		} else {
    			return autoGradient(color, numColors);
    		}
    	}

    	const writable_props = [
    		"colors",
    		"colors2",
    		"numColors",
    		"diverging",
    		"bezier",
    		"correctLightness",
    		"simulate",
    		"steps"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PalettePreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("colors" in $$props) $$invalidate(2, colors = $$props.colors);
    		if ("colors2" in $$props) $$invalidate(3, colors2 = $$props.colors2);
    		if ("numColors" in $$props) $$invalidate(4, numColors = $$props.numColors);
    		if ("diverging" in $$props) $$invalidate(5, diverging = $$props.diverging);
    		if ("bezier" in $$props) $$invalidate(6, bezier = $$props.bezier);
    		if ("correctLightness" in $$props) $$invalidate(7, correctLightness = $$props.correctLightness);
    		if ("simulate" in $$props) $$invalidate(1, simulate = $$props.simulate);
    		if ("steps" in $$props) $$invalidate(0, steps = $$props.steps);
    	};

    	$$self.$capture_state = () => ({
    		chroma,
    		colorBlindSim,
    		_range: range,
    		colors,
    		colors2,
    		numColors,
    		diverging,
    		bezier,
    		correctLightness,
    		simulate,
    		steps,
    		autoGradient,
    		autoColors,
    		even,
    		numColorsLeft,
    		numColorsRight,
    		genColors,
    		genColors2,
    		stepsLeft,
    		stepsRight
    	});

    	$$self.$inject_state = $$props => {
    		if ("colors" in $$props) $$invalidate(2, colors = $$props.colors);
    		if ("colors2" in $$props) $$invalidate(3, colors2 = $$props.colors2);
    		if ("numColors" in $$props) $$invalidate(4, numColors = $$props.numColors);
    		if ("diverging" in $$props) $$invalidate(5, diverging = $$props.diverging);
    		if ("bezier" in $$props) $$invalidate(6, bezier = $$props.bezier);
    		if ("correctLightness" in $$props) $$invalidate(7, correctLightness = $$props.correctLightness);
    		if ("simulate" in $$props) $$invalidate(1, simulate = $$props.simulate);
    		if ("steps" in $$props) $$invalidate(0, steps = $$props.steps);
    		if ("even" in $$props) $$invalidate(8, even = $$props.even);
    		if ("numColorsLeft" in $$props) $$invalidate(9, numColorsLeft = $$props.numColorsLeft);
    		if ("numColorsRight" in $$props) $$invalidate(10, numColorsRight = $$props.numColorsRight);
    		if ("genColors" in $$props) $$invalidate(11, genColors = $$props.genColors);
    		if ("genColors2" in $$props) $$invalidate(12, genColors2 = $$props.genColors2);
    		if ("stepsLeft" in $$props) $$invalidate(13, stepsLeft = $$props.stepsLeft);
    		if ("stepsRight" in $$props) $$invalidate(14, stepsRight = $$props.stepsRight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*numColors*/ 16) {
    			 $$invalidate(8, even = numColors % 2 === 0);
    		}

    		if ($$self.$$.dirty & /*diverging, numColors, even*/ 304) {
    			 $$invalidate(9, numColorsLeft = diverging
    			? Math.ceil(numColors / 2) + (even ? 1 : 0)
    			: numColors);
    		}

    		if ($$self.$$.dirty & /*diverging, numColors, even*/ 304) {
    			 $$invalidate(10, numColorsRight = diverging
    			? Math.ceil(numColors / 2) + (even ? 1 : 0)
    			: 0);
    		}

    		if ($$self.$$.dirty & /*colors, numColorsLeft*/ 516) {
    			 $$invalidate(11, genColors = colors.length !== 1
    			? colors
    			: autoColors(colors[0], numColorsLeft));
    		}

    		if ($$self.$$.dirty & /*colors2, numColorsRight*/ 1032) {
    			 $$invalidate(12, genColors2 = colors2.length !== 1
    			? colors2
    			: autoColors(colors2[0], numColorsRight, true));
    		}

    		if ($$self.$$.dirty & /*colors, bezier, genColors, correctLightness, numColorsLeft*/ 2756) {
    			 $$invalidate(13, stepsLeft = colors.length
    			? chroma.scale(bezier && genColors.length > 1 && genColors.length <= 5
    				? chroma.bezier(genColors)
    				: genColors).correctLightness(correctLightness).colors(numColorsLeft)
    			: []);
    		}

    		if ($$self.$$.dirty & /*diverging, colors2, bezier, genColors2, correctLightness, numColorsRight*/ 5352) {
    			 $$invalidate(14, stepsRight = diverging && colors2.length
    			? chroma.scale(bezier && genColors2.length > 1 && genColors2.length <= 5
    				? chroma.bezier(genColors2)
    				: genColors2).correctLightness(correctLightness).colors(numColorsRight)
    			: []);
    		}

    		if ($$self.$$.dirty & /*even, diverging, stepsLeft, stepsRight*/ 24864) {
    			 $$invalidate(0, steps = (even && diverging
    			? stepsLeft.slice(0, stepsLeft.length - 1)
    			: stepsLeft).concat(stepsRight.slice(1)));
    		}
    	};

    	return [
    		steps,
    		simulate,
    		colors,
    		colors2,
    		numColors,
    		diverging,
    		bezier,
    		correctLightness,
    		even,
    		numColorsLeft,
    		numColorsRight,
    		genColors,
    		genColors2,
    		stepsLeft,
    		stepsRight
    	];
    }

    class PalettePreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			colors: 2,
    			colors2: 3,
    			numColors: 4,
    			diverging: 5,
    			bezier: 6,
    			correctLightness: 7,
    			simulate: 1,
    			steps: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PalettePreview",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*bezier*/ ctx[6] === undefined && !("bezier" in props)) {
    			console.warn("<PalettePreview> was created without expected prop 'bezier'");
    		}

    		if (/*correctLightness*/ ctx[7] === undefined && !("correctLightness" in props)) {
    			console.warn("<PalettePreview> was created without expected prop 'correctLightness'");
    		}

    		if (/*steps*/ ctx[0] === undefined && !("steps" in props)) {
    			console.warn("<PalettePreview> was created without expected prop 'steps'");
    		}
    	}

    	get colors() {
    		throw new Error("<PalettePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<PalettePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors2() {
    		throw new Error("<PalettePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors2(value) {
    		throw new Error("<PalettePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numColors() {
    		throw new Error("<PalettePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numColors(value) {
    		throw new Error("<PalettePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get diverging() {
    		throw new Error("<PalettePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set diverging(value) {
    		throw new Error("<PalettePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bezier() {
    		throw new Error("<PalettePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bezier(value) {
    		throw new Error("<PalettePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get correctLightness() {
    		throw new Error("<PalettePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set correctLightness(value) {
    		throw new Error("<PalettePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get simulate() {
    		throw new Error("<PalettePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set simulate(value) {
    		throw new Error("<PalettePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get steps() {
    		throw new Error("<PalettePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set steps(value) {
    		throw new Error("<PalettePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Export.svelte generated by Svelte v3.37.0 */

    const file$5 = "src/Export.svelte";

    function create_fragment$5(ctx) {
    	let pre0;
    	let t0;
    	let t1;
    	let pre1;
    	let t2;
    	let t3_value = /*steps*/ ctx[0].join(`', '`) + "";
    	let t3;
    	let t4;
    	let t5;
    	let pre2;
    	let t6;
    	let t7_value = /*steps*/ ctx[0].join(`', '`) + "";
    	let t7;
    	let t8;
    	let t9;
    	let pre3;
    	let t10_value = /*steps*/ ctx[0].join("\n") + "";
    	let t10;
    	let t11;
    	let pre4;
    	let t12;
    	let t13_value = /*steps*/ ctx[0].map(func).join(`,`) + "";
    	let t13;
    	let t14;
    	let t15;
    	let pre5;
    	let t16;
    	let t17_value = /*steps*/ ctx[0].length + "";
    	let t17;
    	let t18;
    	let t19_value = /*steps*/ ctx[0].join(`', '`) + "";
    	let t19;
    	let t20;
    	let t21_value = /*steps*/ ctx[0].slice(1).map(func_1) + "";
    	let t21;
    	let t22;

    	const block = {
    		c: function create() {
    			pre0 = element("pre");
    			t0 = text(/*steps*/ ctx[0]);
    			t1 = space();
    			pre1 = element("pre");
    			t2 = text("'");
    			t3 = text(t3_value);
    			t4 = text("'");
    			t5 = space();
    			pre2 = element("pre");
    			t6 = text("['");
    			t7 = text(t7_value);
    			t8 = text("']");
    			t9 = space();
    			pre3 = element("pre");
    			t10 = text(t10_value);
    			t11 = space();
    			pre4 = element("pre");
    			t12 = text("[");
    			t13 = text(t13_value);
    			t14 = text("]");
    			t15 = space();
    			pre5 = element("pre");
    			t16 = text("import { scaleThreshold } from 'd3-scale';\n\nfunction palette(min, max) {\n    const d = (max-min)/");
    			t17 = text(t17_value);
    			t18 = text(";\n    return scaleThreshold()\n        .range(['");
    			t19 = text(t19_value);
    			t20 = text("'])\n        .domain([");
    			t21 = text(t21_value);
    			t22 = text("]);\n}");
    			attr_dev(pre0, "class", "svelte-1n20esm");
    			add_location(pre0, file$5, 12, 0, 160);
    			attr_dev(pre1, "class", "svelte-1n20esm");
    			add_location(pre1, file$5, 13, 0, 179);
    			attr_dev(pre2, "class", "svelte-1n20esm");
    			add_location(pre2, file$5, 14, 0, 213);
    			attr_dev(pre3, "class", "svelte-1n20esm");
    			add_location(pre3, file$5, 15, 0, 249);
    			attr_dev(pre4, "class", "svelte-1n20esm");
    			add_location(pre4, file$5, 16, 0, 279);
    			attr_dev(pre5, "class", "svelte-1n20esm");
    			add_location(pre5, file$5, 17, 0, 337);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre0, anchor);
    			append_dev(pre0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, pre1, anchor);
    			append_dev(pre1, t2);
    			append_dev(pre1, t3);
    			append_dev(pre1, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, pre2, anchor);
    			append_dev(pre2, t6);
    			append_dev(pre2, t7);
    			append_dev(pre2, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, pre3, anchor);
    			append_dev(pre3, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, pre4, anchor);
    			append_dev(pre4, t12);
    			append_dev(pre4, t13);
    			append_dev(pre4, t14);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, pre5, anchor);
    			append_dev(pre5, t16);
    			append_dev(pre5, t17);
    			append_dev(pre5, t18);
    			append_dev(pre5, t19);
    			append_dev(pre5, t20);
    			append_dev(pre5, t21);
    			append_dev(pre5, t22);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*steps*/ 1) set_data_dev(t0, /*steps*/ ctx[0]);
    			if (dirty & /*steps*/ 1 && t3_value !== (t3_value = /*steps*/ ctx[0].join(`', '`) + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*steps*/ 1 && t7_value !== (t7_value = /*steps*/ ctx[0].join(`', '`) + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*steps*/ 1 && t10_value !== (t10_value = /*steps*/ ctx[0].join("\n") + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*steps*/ 1 && t13_value !== (t13_value = /*steps*/ ctx[0].map(func).join(`,`) + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*steps*/ 1 && t17_value !== (t17_value = /*steps*/ ctx[0].length + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*steps*/ 1 && t19_value !== (t19_value = /*steps*/ ctx[0].join(`', '`) + "")) set_data_dev(t19, t19_value);
    			if (dirty & /*steps*/ 1 && t21_value !== (t21_value = /*steps*/ ctx[0].slice(1).map(func_1) + "")) set_data_dev(t21, t21_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(pre1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(pre2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(pre3);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(pre4);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(pre5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = c => "0x" + c.substr(1);
    const func_1 = (v, i) => `min + d*${i + 1}`;

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Export", slots, []);
    	let { steps = [] } = $$props;
    	const writable_props = ["steps"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Export> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("steps" in $$props) $$invalidate(0, steps = $$props.steps);
    	};

    	$$self.$capture_state = () => ({ steps });

    	$$self.$inject_state = $$props => {
    		if ("steps" in $$props) $$invalidate(0, steps = $$props.steps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [steps];
    }

    class Export extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { steps: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Export",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get steps() {
    		throw new Error("<Export>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set steps(value) {
    		throw new Error("<Export>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(compare) {
      if (compare.length === 1) compare = ascendingComparator(compare);
      return {
        left: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          }
          return lo;
        },
        right: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) > 0) hi = mid;
            else lo = mid + 1;
          }
          return lo;
        }
      };
    }

    function ascendingComparator(f) {
      return function(d, x) {
        return ascending(f(d), x);
      };
    }

    var ascendingBisect = bisector(ascending);
    var bisectRight = ascendingBisect.right;

    function extent(values, valueof) {
      let min;
      let max;
      if (valueof === undefined) {
        for (const value of values) {
          if (value != null) {
            if (min === undefined) {
              if (value >= value) min = max = value;
            } else {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
      } else {
        let index = -1;
        for (let value of values) {
          if ((value = valueof(value, ++index, values)) != null) {
            if (min === undefined) {
              if (value >= value) min = max = value;
            } else {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
      }
      return [min, max];
    }

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        start = Math.ceil(start / step);
        stop = Math.floor(stop / step);
        ticks = new Array(n = Math.ceil(stop - start + 1));
        while (++i < n) ticks[i] = (start + i) * step;
      } else {
        start = Math.floor(start * step);
        stop = Math.ceil(stop * step);
        ticks = new Array(n = Math.ceil(start - stop + 1));
        while (++i < n) ticks[i] = (start - i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color$1() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex3 = /^#([0-9a-f]{3})$/,
        reHex6 = /^#([0-9a-f]{6})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color$1, color, {
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: function() {
        return this.rgb().hex();
      },
      toString: function() {
        return this.rgb() + "";
      }
    });

    function color(format) {
      var m;
      format = (format + "").trim().toLowerCase();
      return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
          : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format])
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color$1)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb, extend(Color$1, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (0 <= this.r && this.r <= 255)
            && (0 <= this.g && this.g <= 255)
            && (0 <= this.b && this.b <= 255)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: function() {
        return "#" + hex(this.r) + hex(this.g) + hex(this.b);
      },
      toString: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "rgb(" : "rgba(")
            + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
            + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
            + Math.max(0, Math.min(255, Math.round(this.b) || 0))
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color$1)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color$1, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var deg2rad = Math.PI / 180;
    var rad2deg = 180 / Math.PI;

    // https://beta.observablehq.com/@mbostock/lab-and-rgb
    var K = 18,
        Xn = 0.96422,
        Yn = 1,
        Zn = 0.82521,
        t0 = 4 / 29,
        t1 = 6 / 29,
        t2 = 3 * t1 * t1,
        t3 = t1 * t1 * t1;

    function labConvert(o) {
      if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
      if (o instanceof Hcl) {
        if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
        var h = o.h * deg2rad;
        return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
      }
      if (!(o instanceof Rgb)) o = rgbConvert(o);
      var r = rgb2lrgb(o.r),
          g = rgb2lrgb(o.g),
          b = rgb2lrgb(o.b),
          y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
      if (r === g && g === b) x = z = y; else {
        x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
        z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
      }
      return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
    }

    function lab(l, a, b, opacity) {
      return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
    }

    function Lab(l, a, b, opacity) {
      this.l = +l;
      this.a = +a;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Lab, lab, extend(Color$1, {
      brighter: function(k) {
        return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
      },
      darker: function(k) {
        return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
      },
      rgb: function() {
        var y = (this.l + 16) / 116,
            x = isNaN(this.a) ? y : y + this.a / 500,
            z = isNaN(this.b) ? y : y - this.b / 200;
        x = Xn * lab2xyz(x);
        y = Yn * lab2xyz(y);
        z = Zn * lab2xyz(z);
        return new Rgb(
          lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
          lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
          lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
          this.opacity
        );
      }
    }));

    function xyz2lab(t) {
      return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
    }

    function lab2xyz(t) {
      return t > t1 ? t * t * t : t2 * (t - t0);
    }

    function lrgb2rgb(x) {
      return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    }

    function rgb2lrgb(x) {
      return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    function hclConvert(o) {
      if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
      if (!(o instanceof Lab)) o = labConvert(o);
      if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0, o.l, o.opacity);
      var h = Math.atan2(o.b, o.a) * rad2deg;
      return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
    }

    function hcl(h, c, l, opacity) {
      return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
    }

    function Hcl(h, c, l, opacity) {
      this.h = +h;
      this.c = +c;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hcl, hcl, extend(Color$1, {
      brighter: function(k) {
        return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
      },
      darker: function(k) {
        return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
      },
      rgb: function() {
        return labConvert(this).rgb();
      }
    }));

    var A = -0.14861,
        B = +1.78277,
        C = -0.29227,
        D = -0.90649,
        E = +1.97294,
        ED = E * D,
        EB = E * B,
        BC_DA = B * C - D * A;

    function cubehelixConvert(o) {
      if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Rgb)) o = rgbConvert(o);
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
          bl = b - l,
          k = (E * (g - l) - C * bl) / D,
          s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
          h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
      return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
    }

    function cubehelix(h, s, l, opacity) {
      return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
    }

    function Cubehelix(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Cubehelix, cubehelix, extend(Color$1, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
            l = +this.l,
            a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
            cosh = Math.cos(h),
            sinh = Math.sin(h);
        return new Rgb(
          255 * (l + a * (A * cosh + B * sinh)),
          255 * (l + a * (C * cosh + D * sinh)),
          255 * (l + a * (E * cosh)),
          this.opacity
        );
      }
    }));

    function constant(x) {
      return function() {
        return x;
      };
    }

    function linear(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear(a, d) : constant(isNaN(a) ? b : a);
    }

    var rgb$1 = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb$1(start, end) {
        var r = color((start = rgb(start)).r, (end = rgb(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb$1.gamma = rgbGamma;

      return rgb$1;
    })(1);

    function array(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b -= a, function(t) {
        return d.setTime(a + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b -= a, function(t) {
        return a + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolateValue(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolateValue(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb$1) : string)
          : b instanceof color ? rgb$1
          : b instanceof Date ? date
          : Array.isArray(b) ? array
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b -= a, function(t) {
        return Math.round(a + b * t);
      };
    }

    function constant$1(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constant$1(isNaN(b) ? NaN : 0.5);
    }

    function clamper(domain) {
      var a = domain[0], b = domain[domain.length - 1], t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisectRight(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate = interpolateValue,
          transform,
          untransform,
          unknown,
          clamp = identity,
          piecewise,
          output,
          input;

      function rescale() {
        piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), clamp === identity || (clamp = clamper(domain)), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? clamper(domain) : identity, scale) : clamp !== identity;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate = _, rescale()) : interpolate;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous(transform, untransform) {
      return transformer()(transform, untransform);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimal(1.23) returns ["123", 0].
    function formatDecimal(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      return new FormatSpecifier(specifier);
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      this.fill = match[1] || " ";
      this.align = match[2] || ">";
      this.sign = match[3] || "-";
      this.symbol = match[4] || "";
      this.zero = !!match[5];
      this.width = match[6] && +match[6];
      this.comma = !!match[7];
      this.precision = match[8] && +match[8].slice(1);
      this.trim = !!match[9];
      this.type = match[10] || "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width == null ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": function(x, p) { return (x * 100).toFixed(p); },
      "b": function(x) { return Math.round(x).toString(2); },
      "c": function(x) { return x + ""; },
      "d": function(x) { return Math.round(x).toString(10); },
      "e": function(x, p) { return x.toExponential(p); },
      "f": function(x, p) { return x.toFixed(p); },
      "g": function(x, p) { return x.toPrecision(p); },
      "o": function(x) { return Math.round(x).toString(8); },
      "p": function(x, p) { return formatRounded(x * 100, p); },
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
      "x": function(x) { return Math.round(x).toString(16); }
    };

    function identity$1(x) {
      return x;
    }

    var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$1,
          currency = locale.currency,
          decimal = locale.decimal,
          numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$1,
          percent = locale.percent || "%";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision == null && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision == null ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Perform the initial formatting.
            var valueNegative = value < 0;
            value = formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero during formatting, treat as positive.
            if (valueNegative && +value === 0) valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      decimal: ".",
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain(),
            i0 = 0,
            i1 = d.length - 1,
            start = d[i0],
            stop = d[i1],
            step;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }

        step = tickIncrement(start, stop, count);

        if (step > 0) {
          start = Math.floor(start / step) * step;
          stop = Math.ceil(stop / step) * step;
          step = tickIncrement(start, stop, count);
        } else if (step < 0) {
          start = Math.ceil(start * step) / step;
          stop = Math.floor(stop * step) / step;
          step = tickIncrement(start, stop, count);
        }

        if (step > 0) {
          d[i0] = Math.floor(start / step) * step;
          d[i1] = Math.ceil(stop / step) * step;
          domain(d);
        } else if (step < 0) {
          d[i0] = Math.ceil(start * step) / step;
          d[i1] = Math.floor(stop * step) / step;
          domain(d);
        }

        return scale;
      };

      return scale;
    }

    function linear$1() {
      var scale = continuous(identity, identity);

      scale.copy = function() {
        return copy(scale, linear$1());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    var t0$1 = new Date,
        t1$1 = new Date;

    function newInterval(floori, offseti, count, field) {

      function interval(date) {
        return floori(date = new Date(+date)), date;
      }

      interval.floor = interval;

      interval.ceil = function(date) {
        return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
      };

      interval.round = function(date) {
        var d0 = interval(date),
            d1 = interval.ceil(date);
        return date - d0 < d1 - date ? d0 : d1;
      };

      interval.offset = function(date, step) {
        return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
      };

      interval.range = function(start, stop, step) {
        var range = [], previous;
        start = interval.ceil(start);
        step = step == null ? 1 : Math.floor(step);
        if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
        do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
        while (previous < start && start < stop);
        return range;
      };

      interval.filter = function(test) {
        return newInterval(function(date) {
          if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
        }, function(date, step) {
          if (date >= date) {
            if (step < 0) while (++step <= 0) {
              while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
            } else while (--step >= 0) {
              while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
            }
          }
        });
      };

      if (count) {
        interval.count = function(start, end) {
          t0$1.setTime(+start), t1$1.setTime(+end);
          floori(t0$1), floori(t1$1);
          return Math.floor(count(t0$1, t1$1));
        };

        interval.every = function(step) {
          step = Math.floor(step);
          return !isFinite(step) || !(step > 0) ? null
              : !(step > 1) ? interval
              : interval.filter(field
                  ? function(d) { return field(d) % step === 0; }
                  : function(d) { return interval.count(0, d) % step === 0; });
        };
      }

      return interval;
    }

    var millisecond = newInterval(function() {
      // noop
    }, function(date, step) {
      date.setTime(+date + step);
    }, function(start, end) {
      return end - start;
    });

    // An optimized implementation for this simple case.
    millisecond.every = function(k) {
      k = Math.floor(k);
      if (!isFinite(k) || !(k > 0)) return null;
      if (!(k > 1)) return millisecond;
      return newInterval(function(date) {
        date.setTime(Math.floor(date / k) * k);
      }, function(date, step) {
        date.setTime(+date + step * k);
      }, function(start, end) {
        return (end - start) / k;
      });
    };

    var durationSecond = 1e3;
    var durationMinute = 6e4;
    var durationHour = 36e5;
    var durationDay = 864e5;
    var durationWeek = 6048e5;

    var second = newInterval(function(date) {
      date.setTime(date - date.getMilliseconds());
    }, function(date, step) {
      date.setTime(+date + step * durationSecond);
    }, function(start, end) {
      return (end - start) / durationSecond;
    }, function(date) {
      return date.getUTCSeconds();
    });

    var minute = newInterval(function(date) {
      date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
    }, function(date, step) {
      date.setTime(+date + step * durationMinute);
    }, function(start, end) {
      return (end - start) / durationMinute;
    }, function(date) {
      return date.getMinutes();
    });

    var hour = newInterval(function(date) {
      date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
    }, function(date, step) {
      date.setTime(+date + step * durationHour);
    }, function(start, end) {
      return (end - start) / durationHour;
    }, function(date) {
      return date.getHours();
    });

    var day = newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
    }, function(date) {
      return date.getDate() - 1;
    });

    function weekday(i) {
      return newInterval(function(date) {
        date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setDate(date.getDate() + step * 7);
      }, function(start, end) {
        return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
      });
    }

    var sunday = weekday(0);
    var monday = weekday(1);
    var tuesday = weekday(2);
    var wednesday = weekday(3);
    var thursday = weekday(4);
    var friday = weekday(5);
    var saturday = weekday(6);

    var month = newInterval(function(date) {
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setMonth(date.getMonth() + step);
    }, function(start, end) {
      return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
    }, function(date) {
      return date.getMonth();
    });

    var year = newInterval(function(date) {
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step);
    }, function(start, end) {
      return end.getFullYear() - start.getFullYear();
    }, function(date) {
      return date.getFullYear();
    });

    // An optimized implementation for this simple case.
    year.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setFullYear(Math.floor(date.getFullYear() / k) * k);
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setFullYear(date.getFullYear() + step * k);
      });
    };

    var utcMinute = newInterval(function(date) {
      date.setUTCSeconds(0, 0);
    }, function(date, step) {
      date.setTime(+date + step * durationMinute);
    }, function(start, end) {
      return (end - start) / durationMinute;
    }, function(date) {
      return date.getUTCMinutes();
    });

    var utcHour = newInterval(function(date) {
      date.setUTCMinutes(0, 0, 0);
    }, function(date, step) {
      date.setTime(+date + step * durationHour);
    }, function(start, end) {
      return (end - start) / durationHour;
    }, function(date) {
      return date.getUTCHours();
    });

    var utcDay = newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step);
    }, function(start, end) {
      return (end - start) / durationDay;
    }, function(date) {
      return date.getUTCDate() - 1;
    });

    function utcWeekday(i) {
      return newInterval(function(date) {
        date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCDate(date.getUTCDate() + step * 7);
      }, function(start, end) {
        return (end - start) / durationWeek;
      });
    }

    var utcSunday = utcWeekday(0);
    var utcMonday = utcWeekday(1);
    var utcTuesday = utcWeekday(2);
    var utcWednesday = utcWeekday(3);
    var utcThursday = utcWeekday(4);
    var utcFriday = utcWeekday(5);
    var utcSaturday = utcWeekday(6);

    var utcMonth = newInterval(function(date) {
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCMonth(date.getUTCMonth() + step);
    }, function(start, end) {
      return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
    }, function(date) {
      return date.getUTCMonth();
    });

    var utcYear = newInterval(function(date) {
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step);
    }, function(start, end) {
      return end.getUTCFullYear() - start.getUTCFullYear();
    }, function(date) {
      return date.getUTCFullYear();
    });

    // An optimized implementation for this simple case.
    utcYear.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
        date.setUTCMonth(0, 1);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCFullYear(date.getUTCFullYear() + step * k);
      });
    };

    function localDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date.setFullYear(d.y);
        return date;
      }
      return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
    }

    function utcDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date.setUTCFullYear(d.y);
        return date;
      }
      return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
    }

    function newYear(y) {
      return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
    }

    function formatLocale$1(locale) {
      var locale_dateTime = locale.dateTime,
          locale_date = locale.date,
          locale_time = locale.time,
          locale_periods = locale.periods,
          locale_weekdays = locale.days,
          locale_shortWeekdays = locale.shortDays,
          locale_months = locale.months,
          locale_shortMonths = locale.shortMonths;

      var periodRe = formatRe(locale_periods),
          periodLookup = formatLookup(locale_periods),
          weekdayRe = formatRe(locale_weekdays),
          weekdayLookup = formatLookup(locale_weekdays),
          shortWeekdayRe = formatRe(locale_shortWeekdays),
          shortWeekdayLookup = formatLookup(locale_shortWeekdays),
          monthRe = formatRe(locale_months),
          monthLookup = formatLookup(locale_months),
          shortMonthRe = formatRe(locale_shortMonths),
          shortMonthLookup = formatLookup(locale_shortMonths);

      var formats = {
        "a": formatShortWeekday,
        "A": formatWeekday,
        "b": formatShortMonth,
        "B": formatMonth,
        "c": null,
        "d": formatDayOfMonth,
        "e": formatDayOfMonth,
        "f": formatMicroseconds,
        "H": formatHour24,
        "I": formatHour12,
        "j": formatDayOfYear,
        "L": formatMilliseconds,
        "m": formatMonthNumber,
        "M": formatMinutes,
        "p": formatPeriod,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatSeconds,
        "u": formatWeekdayNumberMonday,
        "U": formatWeekNumberSunday,
        "V": formatWeekNumberISO,
        "w": formatWeekdayNumberSunday,
        "W": formatWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatYear,
        "Y": formatFullYear,
        "Z": formatZone,
        "%": formatLiteralPercent
      };

      var utcFormats = {
        "a": formatUTCShortWeekday,
        "A": formatUTCWeekday,
        "b": formatUTCShortMonth,
        "B": formatUTCMonth,
        "c": null,
        "d": formatUTCDayOfMonth,
        "e": formatUTCDayOfMonth,
        "f": formatUTCMicroseconds,
        "H": formatUTCHour24,
        "I": formatUTCHour12,
        "j": formatUTCDayOfYear,
        "L": formatUTCMilliseconds,
        "m": formatUTCMonthNumber,
        "M": formatUTCMinutes,
        "p": formatUTCPeriod,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatUTCSeconds,
        "u": formatUTCWeekdayNumberMonday,
        "U": formatUTCWeekNumberSunday,
        "V": formatUTCWeekNumberISO,
        "w": formatUTCWeekdayNumberSunday,
        "W": formatUTCWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatUTCYear,
        "Y": formatUTCFullYear,
        "Z": formatUTCZone,
        "%": formatLiteralPercent
      };

      var parses = {
        "a": parseShortWeekday,
        "A": parseWeekday,
        "b": parseShortMonth,
        "B": parseMonth,
        "c": parseLocaleDateTime,
        "d": parseDayOfMonth,
        "e": parseDayOfMonth,
        "f": parseMicroseconds,
        "H": parseHour24,
        "I": parseHour24,
        "j": parseDayOfYear,
        "L": parseMilliseconds,
        "m": parseMonthNumber,
        "M": parseMinutes,
        "p": parsePeriod,
        "Q": parseUnixTimestamp,
        "s": parseUnixTimestampSeconds,
        "S": parseSeconds,
        "u": parseWeekdayNumberMonday,
        "U": parseWeekNumberSunday,
        "V": parseWeekNumberISO,
        "w": parseWeekdayNumberSunday,
        "W": parseWeekNumberMonday,
        "x": parseLocaleDate,
        "X": parseLocaleTime,
        "y": parseYear,
        "Y": parseFullYear,
        "Z": parseZone,
        "%": parseLiteralPercent
      };

      // These recursive directive definitions must be deferred.
      formats.x = newFormat(locale_date, formats);
      formats.X = newFormat(locale_time, formats);
      formats.c = newFormat(locale_dateTime, formats);
      utcFormats.x = newFormat(locale_date, utcFormats);
      utcFormats.X = newFormat(locale_time, utcFormats);
      utcFormats.c = newFormat(locale_dateTime, utcFormats);

      function newFormat(specifier, formats) {
        return function(date) {
          var string = [],
              i = -1,
              j = 0,
              n = specifier.length,
              c,
              pad,
              format;

          if (!(date instanceof Date)) date = new Date(+date);

          while (++i < n) {
            if (specifier.charCodeAt(i) === 37) {
              string.push(specifier.slice(j, i));
              if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
              else pad = c === "e" ? " " : "0";
              if (format = formats[c]) c = format(date, pad);
              string.push(c);
              j = i + 1;
            }
          }

          string.push(specifier.slice(j, i));
          return string.join("");
        };
      }

      function newParse(specifier, newDate) {
        return function(string) {
          var d = newYear(1900),
              i = parseSpecifier(d, specifier, string += "", 0),
              week, day$1;
          if (i != string.length) return null;

          // If a UNIX timestamp is specified, return it.
          if ("Q" in d) return new Date(d.Q);

          // The am-pm flag is 0 for AM, and 1 for PM.
          if ("p" in d) d.H = d.H % 12 + d.p * 12;

          // Convert day-of-week and week-of-year to day-of-year.
          if ("V" in d) {
            if (d.V < 1 || d.V > 53) return null;
            if (!("w" in d)) d.w = 1;
            if ("Z" in d) {
              week = utcDate(newYear(d.y)), day$1 = week.getUTCDay();
              week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
              week = utcDay.offset(week, (d.V - 1) * 7);
              d.y = week.getUTCFullYear();
              d.m = week.getUTCMonth();
              d.d = week.getUTCDate() + (d.w + 6) % 7;
            } else {
              week = newDate(newYear(d.y)), day$1 = week.getDay();
              week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
              week = day.offset(week, (d.V - 1) * 7);
              d.y = week.getFullYear();
              d.m = week.getMonth();
              d.d = week.getDate() + (d.w + 6) % 7;
            }
          } else if ("W" in d || "U" in d) {
            if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
            day$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
            d.m = 0;
            d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
          }

          // If a time zone is specified, all fields are interpreted as UTC and then
          // offset according to the specified time zone.
          if ("Z" in d) {
            d.H += d.Z / 100 | 0;
            d.M += d.Z % 100;
            return utcDate(d);
          }

          // Otherwise, all fields are in local time.
          return newDate(d);
        };
      }

      function parseSpecifier(d, specifier, string, j) {
        var i = 0,
            n = specifier.length,
            m = string.length,
            c,
            parse;

        while (i < n) {
          if (j >= m) return -1;
          c = specifier.charCodeAt(i++);
          if (c === 37) {
            c = specifier.charAt(i++);
            parse = parses[c in pads ? specifier.charAt(i++) : c];
            if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
          } else if (c != string.charCodeAt(j++)) {
            return -1;
          }
        }

        return j;
      }

      function parsePeriod(d, string, i) {
        var n = periodRe.exec(string.slice(i));
        return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseShortWeekday(d, string, i) {
        var n = shortWeekdayRe.exec(string.slice(i));
        return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseWeekday(d, string, i) {
        var n = weekdayRe.exec(string.slice(i));
        return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseShortMonth(d, string, i) {
        var n = shortMonthRe.exec(string.slice(i));
        return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseMonth(d, string, i) {
        var n = monthRe.exec(string.slice(i));
        return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseLocaleDateTime(d, string, i) {
        return parseSpecifier(d, locale_dateTime, string, i);
      }

      function parseLocaleDate(d, string, i) {
        return parseSpecifier(d, locale_date, string, i);
      }

      function parseLocaleTime(d, string, i) {
        return parseSpecifier(d, locale_time, string, i);
      }

      function formatShortWeekday(d) {
        return locale_shortWeekdays[d.getDay()];
      }

      function formatWeekday(d) {
        return locale_weekdays[d.getDay()];
      }

      function formatShortMonth(d) {
        return locale_shortMonths[d.getMonth()];
      }

      function formatMonth(d) {
        return locale_months[d.getMonth()];
      }

      function formatPeriod(d) {
        return locale_periods[+(d.getHours() >= 12)];
      }

      function formatUTCShortWeekday(d) {
        return locale_shortWeekdays[d.getUTCDay()];
      }

      function formatUTCWeekday(d) {
        return locale_weekdays[d.getUTCDay()];
      }

      function formatUTCShortMonth(d) {
        return locale_shortMonths[d.getUTCMonth()];
      }

      function formatUTCMonth(d) {
        return locale_months[d.getUTCMonth()];
      }

      function formatUTCPeriod(d) {
        return locale_periods[+(d.getUTCHours() >= 12)];
      }

      return {
        format: function(specifier) {
          var f = newFormat(specifier += "", formats);
          f.toString = function() { return specifier; };
          return f;
        },
        parse: function(specifier) {
          var p = newParse(specifier += "", localDate);
          p.toString = function() { return specifier; };
          return p;
        },
        utcFormat: function(specifier) {
          var f = newFormat(specifier += "", utcFormats);
          f.toString = function() { return specifier; };
          return f;
        },
        utcParse: function(specifier) {
          var p = newParse(specifier, utcDate);
          p.toString = function() { return specifier; };
          return p;
        }
      };
    }

    var pads = {"-": "", "_": " ", "0": "0"},
        numberRe = /^\s*\d+/, // note: ignores next directive
        percentRe = /^%/,
        requoteRe = /[\\^$*+?|[\]().{}]/g;

    function pad(value, fill, width) {
      var sign = value < 0 ? "-" : "",
          string = (sign ? -value : value) + "",
          length = string.length;
      return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
    }

    function requote(s) {
      return s.replace(requoteRe, "\\$&");
    }

    function formatRe(names) {
      return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
    }

    function formatLookup(names) {
      var map = {}, i = -1, n = names.length;
      while (++i < n) map[names[i].toLowerCase()] = i;
      return map;
    }

    function parseWeekdayNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.w = +n[0], i + n[0].length) : -1;
    }

    function parseWeekdayNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.u = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.U = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberISO(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.V = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.W = +n[0], i + n[0].length) : -1;
    }

    function parseFullYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 4));
      return n ? (d.y = +n[0], i + n[0].length) : -1;
    }

    function parseYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
    }

    function parseZone(d, string, i) {
      var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
      return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
    }

    function parseMonthNumber(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
    }

    function parseDayOfMonth(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.d = +n[0], i + n[0].length) : -1;
    }

    function parseDayOfYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
    }

    function parseHour24(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.H = +n[0], i + n[0].length) : -1;
    }

    function parseMinutes(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.M = +n[0], i + n[0].length) : -1;
    }

    function parseSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.S = +n[0], i + n[0].length) : -1;
    }

    function parseMilliseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.L = +n[0], i + n[0].length) : -1;
    }

    function parseMicroseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 6));
      return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
    }

    function parseLiteralPercent(d, string, i) {
      var n = percentRe.exec(string.slice(i, i + 1));
      return n ? i + n[0].length : -1;
    }

    function parseUnixTimestamp(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = +n[0], i + n[0].length) : -1;
    }

    function parseUnixTimestampSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
    }

    function formatDayOfMonth(d, p) {
      return pad(d.getDate(), p, 2);
    }

    function formatHour24(d, p) {
      return pad(d.getHours(), p, 2);
    }

    function formatHour12(d, p) {
      return pad(d.getHours() % 12 || 12, p, 2);
    }

    function formatDayOfYear(d, p) {
      return pad(1 + day.count(year(d), d), p, 3);
    }

    function formatMilliseconds(d, p) {
      return pad(d.getMilliseconds(), p, 3);
    }

    function formatMicroseconds(d, p) {
      return formatMilliseconds(d, p) + "000";
    }

    function formatMonthNumber(d, p) {
      return pad(d.getMonth() + 1, p, 2);
    }

    function formatMinutes(d, p) {
      return pad(d.getMinutes(), p, 2);
    }

    function formatSeconds(d, p) {
      return pad(d.getSeconds(), p, 2);
    }

    function formatWeekdayNumberMonday(d) {
      var day = d.getDay();
      return day === 0 ? 7 : day;
    }

    function formatWeekNumberSunday(d, p) {
      return pad(sunday.count(year(d), d), p, 2);
    }

    function formatWeekNumberISO(d, p) {
      var day = d.getDay();
      d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
      return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
    }

    function formatWeekdayNumberSunday(d) {
      return d.getDay();
    }

    function formatWeekNumberMonday(d, p) {
      return pad(monday.count(year(d), d), p, 2);
    }

    function formatYear(d, p) {
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatFullYear(d, p) {
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatZone(d) {
      var z = d.getTimezoneOffset();
      return (z > 0 ? "-" : (z *= -1, "+"))
          + pad(z / 60 | 0, "0", 2)
          + pad(z % 60, "0", 2);
    }

    function formatUTCDayOfMonth(d, p) {
      return pad(d.getUTCDate(), p, 2);
    }

    function formatUTCHour24(d, p) {
      return pad(d.getUTCHours(), p, 2);
    }

    function formatUTCHour12(d, p) {
      return pad(d.getUTCHours() % 12 || 12, p, 2);
    }

    function formatUTCDayOfYear(d, p) {
      return pad(1 + utcDay.count(utcYear(d), d), p, 3);
    }

    function formatUTCMilliseconds(d, p) {
      return pad(d.getUTCMilliseconds(), p, 3);
    }

    function formatUTCMicroseconds(d, p) {
      return formatUTCMilliseconds(d, p) + "000";
    }

    function formatUTCMonthNumber(d, p) {
      return pad(d.getUTCMonth() + 1, p, 2);
    }

    function formatUTCMinutes(d, p) {
      return pad(d.getUTCMinutes(), p, 2);
    }

    function formatUTCSeconds(d, p) {
      return pad(d.getUTCSeconds(), p, 2);
    }

    function formatUTCWeekdayNumberMonday(d) {
      var dow = d.getUTCDay();
      return dow === 0 ? 7 : dow;
    }

    function formatUTCWeekNumberSunday(d, p) {
      return pad(utcSunday.count(utcYear(d), d), p, 2);
    }

    function formatUTCWeekNumberISO(d, p) {
      var day = d.getUTCDay();
      d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
      return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
    }

    function formatUTCWeekdayNumberSunday(d) {
      return d.getUTCDay();
    }

    function formatUTCWeekNumberMonday(d, p) {
      return pad(utcMonday.count(utcYear(d), d), p, 2);
    }

    function formatUTCYear(d, p) {
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCFullYear(d, p) {
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCZone() {
      return "+0000";
    }

    function formatLiteralPercent() {
      return "%";
    }

    function formatUnixTimestamp(d) {
      return +d;
    }

    function formatUnixTimestampSeconds(d) {
      return Math.floor(+d / 1000);
    }

    var locale$1;
    var timeFormat;
    var timeParse;
    var utcFormat;
    var utcParse;

    defaultLocale$1({
      dateTime: "%x, %X",
      date: "%-m/%-d/%Y",
      time: "%-I:%M:%S %p",
      periods: ["AM", "PM"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });

    function defaultLocale$1(definition) {
      locale$1 = formatLocale$1(definition);
      timeFormat = locale$1.format;
      timeParse = locale$1.parse;
      utcFormat = locale$1.utcFormat;
      utcParse = locale$1.utcParse;
      return locale$1;
    }

    var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

    function formatIsoNative(date) {
      return date.toISOString();
    }

    var formatIso = Date.prototype.toISOString
        ? formatIsoNative
        : utcFormat(isoSpecifier);

    function parseIsoNative(string) {
      var date = new Date(string);
      return isNaN(date) ? null : date;
    }

    var parseIso = +new Date("2000-01-01T00:00:00.000Z")
        ? parseIsoNative
        : utcParse(isoSpecifier);

    var pi = Math.PI,
        tau = 2 * pi,
        epsilon = 1e-6,
        tauEpsilon = tau - epsilon;

    function Path() {
      this._x0 = this._y0 = // start of current subpath
      this._x1 = this._y1 = null; // end of current subpath
      this._ = "";
    }

    function path() {
      return new Path;
    }

    Path.prototype = path.prototype = {
      constructor: Path,
      moveTo: function(x, y) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
      },
      closePath: function() {
        if (this._x1 !== null) {
          this._x1 = this._x0, this._y1 = this._y0;
          this._ += "Z";
        }
      },
      lineTo: function(x, y) {
        this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      quadraticCurveTo: function(x1, y1, x, y) {
        this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      bezierCurveTo: function(x1, y1, x2, y2, x, y) {
        this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      arcTo: function(x1, y1, x2, y2, r) {
        x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
        var x0 = this._x1,
            y0 = this._y1,
            x21 = x2 - x1,
            y21 = y2 - y1,
            x01 = x0 - x1,
            y01 = y0 - y1,
            l01_2 = x01 * x01 + y01 * y01;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x1,y1).
        if (this._x1 === null) {
          this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
        else if (!(l01_2 > epsilon));

        // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
        // Equivalently, is (x1,y1) coincident with (x2,y2)?
        // Or, is the radius zero? Line to (x1,y1).
        else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Otherwise, draw an arc!
        else {
          var x20 = x2 - x0,
              y20 = y2 - y0,
              l21_2 = x21 * x21 + y21 * y21,
              l20_2 = x20 * x20 + y20 * y20,
              l21 = Math.sqrt(l21_2),
              l01 = Math.sqrt(l01_2),
              l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
              t01 = l / l01,
              t21 = l / l21;

          // If the start tangent is not coincident with (x0,y0), line to.
          if (Math.abs(t01 - 1) > epsilon) {
            this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
          }

          this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
        }
      },
      arc: function(x, y, r, a0, a1, ccw) {
        x = +x, y = +y, r = +r;
        var dx = r * Math.cos(a0),
            dy = r * Math.sin(a0),
            x0 = x + dx,
            y0 = y + dy,
            cw = 1 ^ ccw,
            da = ccw ? a0 - a1 : a1 - a0;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x0,y0).
        if (this._x1 === null) {
          this._ += "M" + x0 + "," + y0;
        }

        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
          this._ += "L" + x0 + "," + y0;
        }

        // Is this arc empty? We’re done.
        if (!r) return;

        // Does the angle go the wrong way? Flip the direction.
        if (da < 0) da = da % tau + tau;

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon) {
          this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
        }

        // Is this arc non-empty? Draw an arc!
        else if (da > epsilon) {
          this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
        }
      },
      rect: function(x, y, w, h) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
      },
      toString: function() {
        return this._;
      }
    };

    function constant$2(x) {
      return function constant() {
        return x;
      };
    }

    function Linear(context) {
      this._context = context;
    }

    Linear.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; // proceed
          default: this._context.lineTo(x, y); break;
        }
      }
    };

    function curveLinear(context) {
      return new Linear(context);
    }

    function x(p) {
      return p[0];
    }

    function y(p) {
      return p[1];
    }

    function line() {
      var x$1 = x,
          y$1 = y,
          defined = constant$2(true),
          context = null,
          curve = curveLinear,
          output = null;

      function line(data) {
        var i,
            n = data.length,
            d,
            defined0 = false,
            buffer;

        if (context == null) output = curve(buffer = path());

        for (i = 0; i <= n; ++i) {
          if (!(i < n && defined(d = data[i], i, data)) === defined0) {
            if (defined0 = !defined0) output.lineStart();
            else output.lineEnd();
          }
          if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
        }

        if (buffer) return output = null, buffer + "" || null;
      }

      line.x = function(_) {
        return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant$2(+_), line) : x$1;
      };

      line.y = function(_) {
        return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant$2(+_), line) : y$1;
      };

      line.defined = function(_) {
        return arguments.length ? (defined = typeof _ === "function" ? _ : constant$2(!!_), line) : defined;
      };

      line.curve = function(_) {
        return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
      };

      line.context = function(_) {
        return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
      };

      return line;
    }

    function sign(x) {
      return x < 0 ? -1 : 1;
    }

    // Calculate the slopes of the tangents (Hermite-type interpolation) based on
    // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
    // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
    // NOV(II), P. 443, 1990.
    function slope3(that, x2, y2) {
      var h0 = that._x1 - that._x0,
          h1 = x2 - that._x1,
          s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
          s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
          p = (s0 * h1 + s1 * h0) / (h0 + h1);
      return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
    }

    // Calculate a one-sided slope.
    function slope2(that, t) {
      var h = that._x1 - that._x0;
      return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
    }

    // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
    // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
    // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
    function point(that, t0, t1) {
      var x0 = that._x0,
          y0 = that._y0,
          x1 = that._x1,
          y1 = that._y1,
          dx = (x1 - x0) / 3;
      that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
    }

    function MonotoneX(context) {
      this._context = context;
    }

    MonotoneX.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 =
        this._y0 = this._y1 =
        this._t0 = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 2: this._context.lineTo(this._x1, this._y1); break;
          case 3: point(this, this._t0, slope2(this, this._t0)); break;
        }
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        var t1 = NaN;

        x = +x, y = +y;
        if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; break;
          case 2: this._point = 3; point(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
          default: point(this, this._t0, t1 = slope3(this, x, y)); break;
        }

        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
        this._t0 = t1;
      }
    };

    function MonotoneY(context) {
      this._context = new ReflectContext(context);
    }

    (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
      MonotoneX.prototype.point.call(this, y, x);
    };

    function ReflectContext(context) {
      this._context = context;
    }

    ReflectContext.prototype = {
      moveTo: function(x, y) { this._context.moveTo(y, x); },
      closePath: function() { this._context.closePath(); },
      lineTo: function(x, y) { this._context.lineTo(y, x); },
      bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
    };

    function Step(context, t) {
      this._context = context;
      this._t = t;
    }

    Step.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x = this._y = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; // proceed
          default: {
            if (this._t <= 0) {
              this._context.lineTo(this._x, y);
              this._context.lineTo(x, y);
            } else {
              var x1 = this._x * (1 - this._t) + x * this._t;
              this._context.lineTo(x1, this._y);
              this._context.lineTo(x1, y);
            }
            break;
          }
        }
        this._x = x, this._y = y;
      }
    };

    function stepAfter(context) {
      return new Step(context, 1);
    }

    /* src/StepChart.svelte generated by Svelte v3.37.0 */
    const file$6 = "src/StepChart.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (86:8) {#if values.length}
    function create_if_block$3(ctx) {
    	let line_1;
    	let line_1_x__value;
    	let line_1_x__value_1;
    	let line_1_y__value;
    	let line_1_y__value_1;
    	let path_1;
    	let each_value = /*yScale*/ ctx[4].ticks(6);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			line_1 = svg_element("line");
    			path_1 = svg_element("path");
    			attr_dev(line_1, "class", "direct svelte-1yea8y5");
    			attr_dev(line_1, "x1", line_1_x__value = /*padding*/ ctx[6].left);
    			attr_dev(line_1, "x2", line_1_x__value_1 = /*width*/ ctx[1] - /*padding*/ ctx[6].right);
    			attr_dev(line_1, "y1", line_1_y__value = /*yScale*/ ctx[4](/*values*/ ctx[3][0]));
    			attr_dev(line_1, "y2", line_1_y__value_1 = /*yScale*/ ctx[4](/*values*/ ctx[3][/*values*/ ctx[3].length - 1]));
    			add_location(line_1, file$6, 90, 12, 2189);
    			attr_dev(path_1, "d", /*path*/ ctx[5]);
    			attr_dev(path_1, "class", "svelte-1yea8y5");
    			add_location(path_1, file$6, 96, 12, 2416);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, line_1, anchor);
    			insert_dev(target, path_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*padding, width, yScale*/ 82) {
    				each_value = /*yScale*/ ctx[4].ticks(6);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(line_1.parentNode, line_1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*width*/ 2 && line_1_x__value_1 !== (line_1_x__value_1 = /*width*/ ctx[1] - /*padding*/ ctx[6].right)) {
    				attr_dev(line_1, "x2", line_1_x__value_1);
    			}

    			if (dirty & /*yScale, values*/ 24 && line_1_y__value !== (line_1_y__value = /*yScale*/ ctx[4](/*values*/ ctx[3][0]))) {
    				attr_dev(line_1, "y1", line_1_y__value);
    			}

    			if (dirty & /*yScale, values*/ 24 && line_1_y__value_1 !== (line_1_y__value_1 = /*yScale*/ ctx[4](/*values*/ ctx[3][/*values*/ ctx[3].length - 1]))) {
    				attr_dev(line_1, "y2", line_1_y__value_1);
    			}

    			if (dirty & /*path*/ 32) {
    				attr_dev(path_1, "d", /*path*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(line_1);
    			if (detaching) detach_dev(path_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(86:8) {#if values.length}",
    		ctx
    	});

    	return block;
    }

    // (87:12) {#each yScale.ticks(6) as y}
    function create_each_block$3(ctx) {
    	let text_1;
    	let t_value = /*y*/ ctx[18] + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let line_1;
    	let line_1_x__value;
    	let line_1_x__value_1;
    	let line_1_transform_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			line_1 = svg_element("line");
    			attr_dev(text_1, "x", text_1_x_value = /*padding*/ ctx[6].left - 5);
    			attr_dev(text_1, "y", text_1_y_value = /*yScale*/ ctx[4](/*y*/ ctx[18]));
    			attr_dev(text_1, "class", "svelte-1yea8y5");
    			add_location(text_1, file$6, 87, 12, 1998);
    			attr_dev(line_1, "x1", line_1_x__value = /*padding*/ ctx[6].left);
    			attr_dev(line_1, "x2", line_1_x__value_1 = /*width*/ ctx[1] - /*padding*/ ctx[6].right);
    			attr_dev(line_1, "transform", line_1_transform_value = "translate(0," + /*yScale*/ ctx[4](/*y*/ ctx[18]) + ")");
    			attr_dev(line_1, "class", "svelte-1yea8y5");
    			add_location(line_1, file$6, 88, 12, 2064);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    			insert_dev(target, line_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yScale*/ 16 && t_value !== (t_value = /*y*/ ctx[18] + "")) set_data_dev(t, t_value);

    			if (dirty & /*yScale*/ 16 && text_1_y_value !== (text_1_y_value = /*yScale*/ ctx[4](/*y*/ ctx[18]))) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty & /*width*/ 2 && line_1_x__value_1 !== (line_1_x__value_1 = /*width*/ ctx[1] - /*padding*/ ctx[6].right)) {
    				attr_dev(line_1, "x2", line_1_x__value_1);
    			}

    			if (dirty & /*yScale*/ 16 && line_1_transform_value !== (line_1_transform_value = "translate(0," + /*yScale*/ ctx[4](/*y*/ ctx[18]) + ")")) {
    				attr_dev(line_1, "transform", line_1_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    			if (detaching) detach_dev(line_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(87:12) {#each yScale.ticks(6) as y}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div_1;
    	let h4;
    	let t0;
    	let t1;
    	let svg;
    	let svg_height_value;
    	let div_1_resize_listener;
    	let if_block = /*values*/ ctx[3].length && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div_1 = element("div");
    			h4 = element("h4");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			attr_dev(h4, "class", "svelte-1yea8y5");
    			add_location(h4, file$6, 83, 4, 1868);
    			attr_dev(svg, "height", svg_height_value = /*height*/ ctx[2] || 50);
    			attr_dev(svg, "class", "svelte-1yea8y5");
    			add_location(svg, file$6, 84, 4, 1889);
    			set_style(div_1, "margin-top", "1em");
    			add_render_callback(() => /*div_1_elementresize_handler*/ ctx[14].call(div_1));
    			add_location(div_1, file$6, 82, 0, 1809);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div_1, anchor);
    			append_dev(div_1, h4);
    			append_dev(h4, t0);
    			append_dev(div_1, t1);
    			append_dev(div_1, svg);
    			if (if_block) if_block.m(svg, null);
    			div_1_resize_listener = add_resize_listener(div_1, /*div_1_elementresize_handler*/ ctx[14].bind(div_1));
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (/*values*/ ctx[3].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(svg, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*height*/ 4 && svg_height_value !== (svg_height_value = /*height*/ ctx[2] || 50)) {
    				attr_dev(svg, "height", svg_height_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div_1);
    			if (if_block) if_block.d();
    			div_1_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let height;
    	let values;
    	let values2;
    	let xScale;
    	let minDomain;
    	let yScale;
    	let y0;
    	let y1;
    	let lineGen;
    	let path;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("StepChart", slots, []);
    	let div;
    	let width;
    	let { title = "" } = $$props;
    	const padding = { left: 30, right: 10, top: 20, bottom: 20 };
    	let { steps = [] } = $$props;
    	let { mode = 0 } = $$props;
    	let yDomain;
    	const writable_props = ["title", "steps", "mode"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<StepChart> was created with unknown prop '${key}'`);
    	});

    	function div_1_elementresize_handler() {
    		width = this.clientWidth;
    		$$invalidate(1, width);
    	}

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("steps" in $$props) $$invalidate(7, steps = $$props.steps);
    		if ("mode" in $$props) $$invalidate(8, mode = $$props.mode);
    	};

    	$$self.$capture_state = () => ({
    		scaleLinear: linear$1,
    		extent,
    		line,
    		curveStepAfter: stepAfter,
    		chroma,
    		div,
    		width,
    		title,
    		padding,
    		steps,
    		mode,
    		yDomain,
    		height,
    		values,
    		values2,
    		xScale,
    		minDomain,
    		yScale,
    		y0,
    		y1,
    		lineGen,
    		path
    	});

    	$$self.$inject_state = $$props => {
    		if ("div" in $$props) div = $$props.div;
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("steps" in $$props) $$invalidate(7, steps = $$props.steps);
    		if ("mode" in $$props) $$invalidate(8, mode = $$props.mode);
    		if ("yDomain" in $$props) $$invalidate(9, yDomain = $$props.yDomain);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("values" in $$props) $$invalidate(3, values = $$props.values);
    		if ("values2" in $$props) $$invalidate(10, values2 = $$props.values2);
    		if ("xScale" in $$props) $$invalidate(11, xScale = $$props.xScale);
    		if ("minDomain" in $$props) $$invalidate(12, minDomain = $$props.minDomain);
    		if ("yScale" in $$props) $$invalidate(4, yScale = $$props.yScale);
    		if ("y0" in $$props) y0 = $$props.y0;
    		if ("y1" in $$props) y1 = $$props.y1;
    		if ("lineGen" in $$props) $$invalidate(13, lineGen = $$props.lineGen);
    		if ("path" in $$props) $$invalidate(5, path = $$props.path);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 2) {
    			 $$invalidate(2, height = width * 0.7);
    		}

    		if ($$self.$$.dirty & /*mode, steps*/ 384) {
    			 $$invalidate(3, values = mode <= 2
    			? steps.map(c => chroma(c).lch()[mode])
    			: steps.map(c => chroma(c).hsl()[mode - 3]));
    		}

    		if ($$self.$$.dirty & /*values*/ 8) {
    			 $$invalidate(10, values2 = values.concat(values[values.length - 1]));
    		}

    		if ($$self.$$.dirty & /*steps, width*/ 130) {
    			 $$invalidate(11, xScale = linear$1().domain([0, steps.length]).range([padding.left, width - padding.right]));
    		}

    		if ($$self.$$.dirty & /*mode*/ 256) {
    			 $$invalidate(12, minDomain = mode === 1 ? 80 : 50);
    		}

    		if ($$self.$$.dirty & /*values, yDomain, minDomain*/ 4616) {
    			 {
    				$$invalidate(9, yDomain = extent(values));
    				let diff = Math.abs(yDomain[1] - yDomain[0]);

    				if (diff < minDomain) {
    					$$invalidate(9, yDomain[0] -= (minDomain - diff) * 0.5, yDomain);
    					$$invalidate(9, yDomain[1] += (minDomain - diff) * 0.5, yDomain);
    					(((($$invalidate(9, yDomain), $$invalidate(3, values)), $$invalidate(12, minDomain)), $$invalidate(8, mode)), $$invalidate(7, steps));
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*yDomain, height*/ 516) {
    			 $$invalidate(4, yScale = linear$1().domain(yDomain).nice().rangeRound([height - padding.bottom, padding.top]));
    		}

    		if ($$self.$$.dirty & /*yScale*/ 16) {
    			 y0 = yScale.domain()[0];
    		}

    		if ($$self.$$.dirty & /*yScale*/ 16) {
    			 y1 = yScale.domain()[1];
    		}

    		if ($$self.$$.dirty & /*xScale, yScale*/ 2064) {
    			 $$invalidate(13, lineGen = line().x((v, i) => xScale(i)).y(yScale).curve(stepAfter));
    		}

    		if ($$self.$$.dirty & /*lineGen, values2*/ 9216) {
    			 $$invalidate(5, path = lineGen(values2));
    		}
    	};

    	return [
    		title,
    		width,
    		height,
    		values,
    		yScale,
    		path,
    		padding,
    		steps,
    		mode,
    		yDomain,
    		values2,
    		xScale,
    		minDomain,
    		lineGen,
    		div_1_elementresize_handler
    	];
    }

    class StepChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { title: 0, steps: 7, mode: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StepChart",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get title() {
    		throw new Error("<StepChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<StepChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get steps() {
    		throw new Error("<StepChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set steps(value) {
    		throw new Error("<StepChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mode() {
    		throw new Error("<StepChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<StepChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty$1.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /** Built-in value references. */
    var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : undefined;

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }

    /* src/StepChart2.svelte generated by Svelte v3.37.0 */
    const file$7 = "src/StepChart2.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (83:8) {#if values.length}
    function create_if_block$4(ctx) {
    	let each0_anchor;
    	let each1_anchor;
    	let each_value_1 = /*yScale*/ ctx[5].ticks(6);
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*paths*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			each0_anchor = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(target, anchor);
    			}

    			insert_dev(target, each0_anchor, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*padding, yScale*/ 160) {
    				each_value_1 = /*yScale*/ ctx[5].ticks(6);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(each0_anchor.parentNode, each0_anchor);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*paths, colors*/ 66) {
    				each_value = /*paths*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each1_anchor.parentNode, each1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(each0_anchor);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(83:8) {#if values.length}",
    		ctx
    	});

    	return block;
    }

    // (84:12) {#each yScale.ticks(6) as y}
    function create_each_block_1$1(ctx) {
    	let text_1;
    	let t_value = /*y*/ ctx[19] + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "x", text_1_x_value = /*padding*/ ctx[7].left - 5);
    			attr_dev(text_1, "y", text_1_y_value = /*yScale*/ ctx[5](/*y*/ ctx[19]));
    			attr_dev(text_1, "class", "svelte-1beh7ur");
    			add_location(text_1, file$7, 84, 12, 1988);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yScale*/ 32 && t_value !== (t_value = /*y*/ ctx[19] + "")) set_data_dev(t, t_value);

    			if (dirty & /*yScale*/ 32 && text_1_y_value !== (text_1_y_value = /*yScale*/ ctx[5](/*y*/ ctx[19]))) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(84:12) {#each yScale.ticks(6) as y}",
    		ctx
    	});

    	return block;
    }

    // (87:12) {#each paths as path, i}
    function create_each_block$4(ctx) {
    	let path;
    	let path_d_value;
    	let path_key_value;
    	let path_stroke_value;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = /*path*/ ctx[16]);
    			attr_dev(path, "key", path_key_value = /*i*/ ctx[18]);
    			attr_dev(path, "stroke", path_stroke_value = /*colors*/ ctx[1][/*i*/ ctx[18]] && /*colors*/ ctx[1][/*i*/ ctx[18]].hex() || "#000");
    			attr_dev(path, "class", "svelte-1beh7ur");
    			add_location(path, file$7, 87, 12, 2111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*paths*/ 64 && path_d_value !== (path_d_value = /*path*/ ctx[16])) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty & /*colors*/ 2 && path_stroke_value !== (path_stroke_value = /*colors*/ ctx[1][/*i*/ ctx[18]] && /*colors*/ ctx[1][/*i*/ ctx[18]].hex() || "#000")) {
    				attr_dev(path, "stroke", path_stroke_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(87:12) {#each paths as path, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div_1;
    	let h4;
    	let t0;
    	let t1;
    	let svg;
    	let svg_height_value;
    	let div_1_resize_listener;
    	let if_block = /*values*/ ctx[2].length && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div_1 = element("div");
    			h4 = element("h4");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			attr_dev(h4, "class", "svelte-1beh7ur");
    			add_location(h4, file$7, 80, 4, 1858);
    			attr_dev(svg, "height", svg_height_value = /*height*/ ctx[4] || 50);
    			attr_dev(svg, "class", "svelte-1beh7ur");
    			add_location(svg, file$7, 81, 4, 1879);
    			set_style(div_1, "margin-top", "1em");
    			add_render_callback(() => /*div_1_elementresize_handler*/ ctx[13].call(div_1));
    			add_location(div_1, file$7, 79, 0, 1799);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div_1, anchor);
    			append_dev(div_1, h4);
    			append_dev(h4, t0);
    			append_dev(div_1, t1);
    			append_dev(div_1, svg);
    			if (if_block) if_block.m(svg, null);
    			div_1_resize_listener = add_resize_listener(div_1, /*div_1_elementresize_handler*/ ctx[13].bind(div_1));
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (/*values*/ ctx[2].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(svg, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*height*/ 16 && svg_height_value !== (svg_height_value = /*height*/ ctx[4] || 50)) {
    				attr_dev(svg, "height", svg_height_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div_1);
    			if (if_block) if_block.d();
    			div_1_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let height;
    	let yScale;
    	let lineGen;
    	let fieldValues;
    	let paths;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("StepChart2", slots, []);
    	let div;
    	let width;
    	let { title = "" } = $$props;
    	let { colors } = $$props;
    	let { field } = $$props;
    	let { values } = $$props;
    	const padding = { left: 30, right: 10, top: 20, bottom: 20 };
    	let xScale;
    	let yDomain;

    	let vv = v => {
    		if (isNaN(v)) return 0;
    		return v;
    	};

    	const writable_props = ["title", "colors", "field", "values"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<StepChart2> was created with unknown prop '${key}'`);
    	});

    	function div_1_elementresize_handler() {
    		width = this.clientWidth;
    		$$invalidate(3, width);
    	}

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("colors" in $$props) $$invalidate(1, colors = $$props.colors);
    		if ("field" in $$props) $$invalidate(8, field = $$props.field);
    		if ("values" in $$props) $$invalidate(2, values = $$props.values);
    	};

    	$$self.$capture_state = () => ({
    		scaleLinear: linear$1,
    		extent,
    		line,
    		curveStepAfter: stepAfter,
    		flatten,
    		div,
    		width,
    		title,
    		colors,
    		field,
    		values,
    		padding,
    		xScale,
    		yDomain,
    		vv,
    		height,
    		yScale,
    		lineGen,
    		fieldValues,
    		paths
    	});

    	$$self.$inject_state = $$props => {
    		if ("div" in $$props) div = $$props.div;
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("colors" in $$props) $$invalidate(1, colors = $$props.colors);
    		if ("field" in $$props) $$invalidate(8, field = $$props.field);
    		if ("values" in $$props) $$invalidate(2, values = $$props.values);
    		if ("xScale" in $$props) $$invalidate(9, xScale = $$props.xScale);
    		if ("yDomain" in $$props) $$invalidate(10, yDomain = $$props.yDomain);
    		if ("vv" in $$props) $$invalidate(15, vv = $$props.vv);
    		if ("height" in $$props) $$invalidate(4, height = $$props.height);
    		if ("yScale" in $$props) $$invalidate(5, yScale = $$props.yScale);
    		if ("lineGen" in $$props) $$invalidate(11, lineGen = $$props.lineGen);
    		if ("fieldValues" in $$props) $$invalidate(12, fieldValues = $$props.fieldValues);
    		if ("paths" in $$props) $$invalidate(6, paths = $$props.paths);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 8) {
    			 $$invalidate(4, height = width * 0.7);
    		}

    		if ($$self.$$.dirty & /*values, width*/ 12) {
    			 {
    				let xDomainMax = Array.isArray(values) && Array.isArray(values[0]) && values[0].length || 0;
    				let xDomain = extent([0, xDomainMax]);
    				$$invalidate(9, xScale = linear$1().domain(xDomain).range([padding.left, width - padding.right]));
    			}
    		}

    		if ($$self.$$.dirty & /*values, field*/ 260) {
    			 {
    				let min = Math.min(...flatten(values).map(v => v[field]));
    				let max = Math.max(...flatten(values).map(v => v[field]));
    				$$invalidate(10, yDomain = extent([min, max]));
    			}
    		}

    		if ($$self.$$.dirty & /*yDomain, height*/ 1040) {
    			 $$invalidate(5, yScale = linear$1().domain(yDomain).nice().rangeRound([height - padding.bottom, padding.top]));
    		}

    		if ($$self.$$.dirty & /*xScale, yScale*/ 544) {
    			 $$invalidate(11, lineGen = line().x((v, i) => vv(xScale(i))).y(yScale).curve(stepAfter));
    		}

    		if ($$self.$$.dirty & /*values, field*/ 260) {
    			 $$invalidate(12, fieldValues = values.map(c => c.map(v => v[field])));
    		}

    		if ($$self.$$.dirty & /*fieldValues, lineGen*/ 6144) {
    			 $$invalidate(6, paths = fieldValues.map(v => lineGen(v.concat(v[v.length - 1]))));
    		}
    	};

    	return [
    		title,
    		colors,
    		values,
    		width,
    		height,
    		yScale,
    		paths,
    		padding,
    		field,
    		xScale,
    		yDomain,
    		lineGen,
    		fieldValues,
    		div_1_elementresize_handler
    	];
    }

    class StepChart2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { title: 0, colors: 1, field: 8, values: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StepChart2",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*colors*/ ctx[1] === undefined && !("colors" in props)) {
    			console.warn("<StepChart2> was created without expected prop 'colors'");
    		}

    		if (/*field*/ ctx[8] === undefined && !("field" in props)) {
    			console.warn("<StepChart2> was created without expected prop 'field'");
    		}

    		if (/*values*/ ctx[2] === undefined && !("values" in props)) {
    			console.warn("<StepChart2> was created without expected prop 'values'");
    		}
    	}

    	get title() {
    		throw new Error("<StepChart2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<StepChart2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<StepChart2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<StepChart2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get field() {
    		throw new Error("<StepChart2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set field(value) {
    		throw new Error("<StepChart2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get values() {
    		throw new Error("<StepChart2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set values(value) {
    		throw new Error("<StepChart2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Card.svelte generated by Svelte v3.37.0 */

    const file$8 = "src/Card.svelte";

    // (27:25) {#if step}
    function create_if_block$5(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*step*/ ctx[1]);
    			attr_dev(span, "class", "step rounded-circle svelte-1jaw2bc");
    			add_location(span, file$8, 26, 35, 530);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*step*/ 2) set_data_dev(t, /*step*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(27:25) {#if step}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;
    	let h5;
    	let t0;
    	let t1;
    	let current;
    	let if_block = /*step*/ ctx[1] && create_if_block$5(ctx);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h5 = element("h5");
    			if (if_block) if_block.c();
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(h5, "class", "card-title");
    			add_location(h5, file$8, 26, 2, 497);
    			attr_dev(div0, "class", "card-body");
    			add_location(div0, file$8, 25, 1, 471);
    			attr_dev(div1, "class", "card shadow-sm svelte-1jaw2bc");
    			toggle_class(div1, "rounded-0", /*noBorderTop*/ ctx[2]);
    			toggle_class(div1, "border-top-0", /*noBorderTop*/ ctx[2]);
    			add_location(div1, file$8, 24, 0, 378);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h5);
    			if (if_block) if_block.m(h5, null);
    			append_dev(h5, t0);
    			append_dev(div0, t1);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*step*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(h5, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (dirty & /*noBorderTop*/ 4) {
    				toggle_class(div1, "rounded-0", /*noBorderTop*/ ctx[2]);
    			}

    			if (dirty & /*noBorderTop*/ 4) {
    				toggle_class(div1, "border-top-0", /*noBorderTop*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Card", slots, ['default']);
    	let { title = "" } = $$props;
    	let { step = "" } = $$props;
    	let { noBorderTop = false } = $$props;
    	const writable_props = ["title", "step", "noBorderTop"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("step" in $$props) $$invalidate(1, step = $$props.step);
    		if ("noBorderTop" in $$props) $$invalidate(2, noBorderTop = $$props.noBorderTop);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, step, noBorderTop });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("step" in $$props) $$invalidate(1, step = $$props.step);
    		if ("noBorderTop" in $$props) $$invalidate(2, noBorderTop = $$props.noBorderTop);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, step, noBorderTop, $$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { title: 0, step: 1, noBorderTop: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noBorderTop() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noBorderTop(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fa-svelte/src/Icon.html generated by Svelte v3.37.0 */

    const file$9 = "node_modules/fa-svelte/src/Icon.html";

    function create_fragment$9(ctx) {
    	let svg;
    	let path_1;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path_1 = svg_element("path");
    			attr_dev(path_1, "fill", "currentColor");
    			attr_dev(path_1, "d", /*path*/ ctx[0]);
    			add_location(path_1, file$9, 7, 2, 129);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", svg_class_value = "" + (null_to_empty(/*classes*/ ctx[1]) + " svelte-1d15yci"));
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[2]);
    			add_location(svg, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*path*/ 1) {
    				attr_dev(path_1, "d", /*path*/ ctx[0]);
    			}

    			if (dirty & /*classes*/ 2 && svg_class_value !== (svg_class_value = "" + (null_to_empty(/*classes*/ ctx[1]) + " svelte-1d15yci"))) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (dirty & /*viewBox*/ 4) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Icon", slots, []);
    	let { icon } = $$props;
    	let path = [];
    	let classes = "";
    	let viewBox = "";

    	$$self.$$set = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("icon" in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    	};

    	$$self.$capture_state = () => ({ icon, path, classes, viewBox });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
    		if ("icon" in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ("path" in $$props) $$invalidate(0, path = $$new_props.path);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("viewBox" in $$props) $$invalidate(2, viewBox = $$new_props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*icon*/ 8) {
    			 $$invalidate(2, viewBox = "0 0 " + icon.icon[0] + " " + icon.icon[1]);
    		}

    		 $$invalidate(1, classes = "fa-svelte " + ($$props.class ? $$props.class : ""));

    		if ($$self.$$.dirty & /*icon*/ 8) {
    			 $$invalidate(0, path = icon.icon[4]);
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [path, classes, viewBox, icon];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { icon: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[3] === undefined && !("icon" in props)) {
    			console.warn("<Icon> was created without expected prop 'icon'");
    		}
    	}

    	get icon() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var faCheck = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, '__esModule', { value: true });
    var prefix = 'fas';
    var iconName = 'check';
    var width = 512;
    var height = 512;
    var ligatures = [];
    var unicode = 'f00c';
    var svgPathData = 'M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z';

    exports.definition = {
      prefix: prefix,
      iconName: iconName,
      icon: [
        width,
        height,
        ligatures,
        unicode,
        svgPathData
      ]};

    exports.faCheck = exports.definition;
    exports.prefix = prefix;
    exports.iconName = iconName;
    exports.width = width;
    exports.height = height;
    exports.ligatures = ligatures;
    exports.unicode = unicode;
    exports.svgPathData = svgPathData;
    });

    unwrapExports(faCheck);
    var faCheck_1 = faCheck.definition;
    var faCheck_2 = faCheck.faCheck;
    var faCheck_3 = faCheck.prefix;
    var faCheck_4 = faCheck.iconName;
    var faCheck_5 = faCheck.width;
    var faCheck_6 = faCheck.height;
    var faCheck_7 = faCheck.ligatures;
    var faCheck_8 = faCheck.unicode;
    var faCheck_9 = faCheck.svgPathData;

    var faExclamationTriangle = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, '__esModule', { value: true });
    var prefix = 'fas';
    var iconName = 'exclamation-triangle';
    var width = 576;
    var height = 512;
    var ligatures = [];
    var unicode = 'f071';
    var svgPathData = 'M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z';

    exports.definition = {
      prefix: prefix,
      iconName: iconName,
      icon: [
        width,
        height,
        ligatures,
        unicode,
        svgPathData
      ]};

    exports.faExclamationTriangle = exports.definition;
    exports.prefix = prefix;
    exports.iconName = iconName;
    exports.width = width;
    exports.height = height;
    exports.ligatures = ligatures;
    exports.unicode = unicode;
    exports.svgPathData = svgPathData;
    });

    unwrapExports(faExclamationTriangle);
    var faExclamationTriangle_1 = faExclamationTriangle.definition;
    var faExclamationTriangle_2 = faExclamationTriangle.faExclamationTriangle;
    var faExclamationTriangle_3 = faExclamationTriangle.prefix;
    var faExclamationTriangle_4 = faExclamationTriangle.iconName;
    var faExclamationTriangle_5 = faExclamationTriangle.width;
    var faExclamationTriangle_6 = faExclamationTriangle.height;
    var faExclamationTriangle_7 = faExclamationTriangle.ligatures;
    var faExclamationTriangle_8 = faExclamationTriangle.unicode;
    var faExclamationTriangle_9 = faExclamationTriangle.svgPathData;

    /* src/ColorBlindCheck.svelte generated by Svelte v3.37.0 */
    const file$a = "src/ColorBlindCheck.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (46:4) {:else}
    function create_else_block(ctx) {
    	let p;
    	let icon;
    	let t;
    	let current;
    	icon = new Icon({ props: { icon: faCheck_2 }, $$inline: true });

    	const block = {
    		c: function create() {
    			p = element("p");
    			create_component(icon.$$.fragment);
    			t = text(" This palette is colorblind-safe.");
    			attr_dev(p, "class", "res text-secondary svelte-116gzwh");
    			add_location(p, file$a, 46, 4, 1026);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			mount_component(icon, p, null);
    			append_dev(p, t);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(46:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:4) {#if result.length}
    function create_if_block$6(ctx) {
    	let p;
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: { icon: faExclamationTriangle_2 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p = element("p");
    			create_component(icon.$$.fragment);
    			t = text(" This palette is not colorblind-safe.");
    			attr_dev(p, "class", "res text-danger svelte-116gzwh");
    			add_location(p, file$a, 44, 4, 904);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			mount_component(icon, p, null);
    			append_dev(p, t);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(44:4) {#if result.length}",
    		ctx
    	});

    	return block;
    }

    // (52:12) {#each types as type}
    function create_each_block$5(ctx) {
    	let label;
    	let input;
    	let input_value_value;
    	let input_checked_value;

    	let t0_value = (/*type*/ ctx[6] === "none"
    	? "normal"
    	: /*type*/ ctx[6].substr(0, 4) + ".") + "";

    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = text(t0_value);
    			t1 = space();
    			input.__value = input_value_value = /*type*/ ctx[6];
    			input.value = input.__value;
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "options");
    			attr_dev(input, "id", "option1");
    			attr_dev(input, "autocomplete", "off");
    			input.checked = input_checked_value = /*active*/ ctx[1] === /*type*/ ctx[6];
    			/*$$binding_groups*/ ctx[5][0].push(input);
    			add_location(input, file$a, 55, 16, 1494);
    			attr_dev(label, "class", "btn btn-sm btn-outline-secondary");
    			toggle_class(label, "btn-outline-danger", /*result*/ ctx[0].indexOf(/*type*/ ctx[6]) > -1);
    			toggle_class(label, "active", /*active*/ ctx[1] === /*type*/ ctx[6]);
    			add_location(label, file$a, 52, 12, 1313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*active*/ ctx[1];
    			append_dev(label, t0);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*active*/ 2 && input_checked_value !== (input_checked_value = /*active*/ ctx[1] === /*type*/ ctx[6])) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*active*/ 2) {
    				input.checked = input.__value === /*active*/ ctx[1];
    			}

    			if (dirty & /*result, types*/ 5) {
    				toggle_class(label, "btn-outline-danger", /*result*/ ctx[0].indexOf(/*type*/ ctx[6]) > -1);
    			}

    			if (dirty & /*active, types*/ 6) {
    				toggle_class(label, "active", /*active*/ ctx[1] === /*type*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[5][0].splice(/*$$binding_groups*/ ctx[5][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(52:12) {#each types as type}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div3;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let div2;
    	let div0;
    	let t2;
    	let div1;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*result*/ ctx[0].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let each_value = /*types*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			if_block.c();
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "simulate:";
    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "text-muted svelte-116gzwh");
    			add_location(div0, file$a, 49, 8, 1156);
    			attr_dev(div1, "class", "btn-group btn-group-toggle");
    			attr_dev(div1, "data-toggle", "buttons");
    			add_location(div1, file$a, 50, 8, 1204);
    			attr_dev(div2, "class", "c1 svelte-116gzwh");
    			add_location(div2, file$a, 48, 4, 1131);
    			attr_dev(div3, "class", "colorblind-sim svelte-116gzwh");
    			add_location(div3, file$a, 42, 0, 847);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			if_blocks[current_block_type_index].m(div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div3, t0);
    			}

    			if (dirty & /*result, types, active*/ 7) {
    				each_value = /*types*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ColorBlindCheck", slots, []);
    	let { colors = [] } = $$props;
    	let { result = [] } = $$props;
    	let { active = "none" } = $$props;
    	const types = ["none", "deuteranopia", "protanopia", "tritanopia"];
    	const writable_props = ["colors", "result", "active"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColorBlindCheck> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		active = this.__value;
    		$$invalidate(1, active);
    	}

    	$$self.$$set = $$props => {
    		if ("colors" in $$props) $$invalidate(3, colors = $$props.colors);
    		if ("result" in $$props) $$invalidate(0, result = $$props.result);
    		if ("active" in $$props) $$invalidate(1, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		faCheck: faCheck_2,
    		faExclamationTriangle: faExclamationTriangle_2,
    		colorBlindCheck,
    		colors,
    		result,
    		active,
    		types
    	});

    	$$self.$inject_state = $$props => {
    		if ("colors" in $$props) $$invalidate(3, colors = $$props.colors);
    		if ("result" in $$props) $$invalidate(0, result = $$props.result);
    		if ("active" in $$props) $$invalidate(1, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*colors*/ 8) {
    			 $$invalidate(0, result = colorBlindCheck(colors));
    		}
    	};

    	return [result, active, types, colors, input_change_handler, $$binding_groups];
    }

    class ColorBlindCheck extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { colors: 3, result: 0, active: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorBlindCheck",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get colors() {
    		throw new Error("<ColorBlindCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<ColorBlindCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get result() {
    		throw new Error("<ColorBlindCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set result(value) {
    		throw new Error("<ColorBlindCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<ColorBlindCheck>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<ColorBlindCheck>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ButtonGroup.svelte generated by Svelte v3.37.0 */

    const file$b = "src/ButtonGroup.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (20:4) {#each options2 as option}
    function create_each_block$6(ctx) {
    	let label_1;
    	let input;
    	let input_value_value;
    	let input_checked_value;
    	let t0_value = /*option*/ ctx[8].title + "";
    	let t0;
    	let t1;
    	let label_1_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			input = element("input");
    			t0 = text(t0_value);
    			t1 = space();
    			input.__value = input_value_value = /*option*/ ctx[8].value;
    			input.value = input.__value;
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "options");
    			attr_dev(input, "id", /*id*/ ctx[3]);
    			attr_dev(input, "autocomplete", "off");
    			input.checked = input_checked_value = /*value*/ ctx[0] === /*option*/ ctx[8].value;
    			/*$$binding_groups*/ ctx[7][0].push(input);
    			add_location(input, file$b, 22, 8, 592);
    			attr_dev(label_1, "class", label_1_class_value = "btn btn-outline-secondary " + (/*buttonSmall*/ ctx[1] ? "btn-sm" : ""));
    			toggle_class(label_1, "active", /*value*/ ctx[0] === /*option*/ ctx[8].value);
    			add_location(label_1, file$b, 20, 4, 468);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, input);
    			input.checked = input.__value === /*value*/ ctx[0];
    			append_dev(label_1, t0);
    			append_dev(label_1, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options2*/ 4 && input_value_value !== (input_value_value = /*option*/ ctx[8].value)) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty & /*value, options2*/ 5 && input_checked_value !== (input_checked_value = /*value*/ ctx[0] === /*option*/ ctx[8].value)) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*value*/ 1) {
    				input.checked = input.__value === /*value*/ ctx[0];
    			}

    			if (dirty & /*options2*/ 4 && t0_value !== (t0_value = /*option*/ ctx[8].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*buttonSmall*/ 2 && label_1_class_value !== (label_1_class_value = "btn btn-outline-secondary " + (/*buttonSmall*/ ctx[1] ? "btn-sm" : ""))) {
    				attr_dev(label_1, "class", label_1_class_value);
    			}

    			if (dirty & /*buttonSmall, value, options2*/ 7) {
    				toggle_class(label_1, "active", /*value*/ ctx[0] === /*option*/ ctx[8].value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    			/*$$binding_groups*/ ctx[7][0].splice(/*$$binding_groups*/ ctx[7][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(20:4) {#each options2 as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let each_value = /*options2*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "btn-group btn-group-toggle svelte-18fgzm7");
    			attr_dev(div, "data-toggle", "buttons");
    			add_location(div, file$b, 18, 0, 370);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*buttonSmall, value, options2, id*/ 15) {
    				each_value = /*options2*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let options2;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ButtonGroup", slots, []);
    	let { options = [] } = $$props;
    	let { value } = $$props;
    	let { label = "" } = $$props;
    	const id = Math.round(Math.random() * 10000000).toString(36);
    	let { buttonSmall = false } = $$props;
    	const writable_props = ["options", "value", "label", "buttonSmall"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ButtonGroup> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		value = this.__value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(4, options = $$props.options);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("label" in $$props) $$invalidate(5, label = $$props.label);
    		if ("buttonSmall" in $$props) $$invalidate(1, buttonSmall = $$props.buttonSmall);
    	};

    	$$self.$capture_state = () => ({
    		options,
    		value,
    		label,
    		id,
    		buttonSmall,
    		options2
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(4, options = $$props.options);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("label" in $$props) $$invalidate(5, label = $$props.label);
    		if ("buttonSmall" in $$props) $$invalidate(1, buttonSmall = $$props.buttonSmall);
    		if ("options2" in $$props) $$invalidate(2, options2 = $$props.options2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*options*/ 16) {
    			 $$invalidate(2, options2 = options.map(s => typeof s === "string" ? { value: s, title: s } : s));
    		}
    	};

    	return [
    		value,
    		buttonSmall,
    		options2,
    		id,
    		options,
    		label,
    		input_change_handler,
    		$$binding_groups
    	];
    }

    class ButtonGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			options: 4,
    			value: 0,
    			label: 5,
    			buttonSmall: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonGroup",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<ButtonGroup> was created without expected prop 'value'");
    		}
    	}

    	get options() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonSmall() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonSmall(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ColorListReadOnly.svelte generated by Svelte v3.37.0 */
    const file$c = "src/ColorListReadOnly.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[3] = list;
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (22:4) {#each colors as color,i}
    function create_each_block$7(ctx) {
    	let color;
    	let updating_value;
    	let current;

    	function color_value_binding(value) {
    		/*color_value_binding*/ ctx[1](value, /*color*/ ctx[2], /*each_value*/ ctx[3], /*i*/ ctx[4]);
    	}

    	let color_props = { readOnly: true };

    	if (/*color*/ ctx[2] !== void 0) {
    		color_props.value = /*color*/ ctx[2];
    	}

    	color = new Color({ props: color_props, $$inline: true });
    	binding_callbacks.push(() => bind(color, "value", color_value_binding));

    	const block = {
    		c: function create() {
    			create_component(color.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(color, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const color_changes = {};

    			if (!updating_value && dirty & /*colors*/ 1) {
    				updating_value = true;
    				color_changes.value = /*color*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			color.$set(color_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(color.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(color.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(color, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(22:4) {#each colors as color,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let t;
    	let span;
    	let current;
    	let each_value = /*colors*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			span = element("span");
    			attr_dev(span, "class", "inv svelte-cznnk1");
    			add_location(span, file$c, 24, 4, 465);
    			attr_dev(div, "class", "form-control svelte-cznnk1");
    			add_location(div, file$c, 20, 0, 343);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    			append_dev(div, span);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*colors*/ 1) {
    				each_value = /*colors*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ColorListReadOnly", slots, []);
    	let { colors } = $$props;
    	const writable_props = ["colors"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColorListReadOnly> was created with unknown prop '${key}'`);
    	});

    	function color_value_binding(value, color, each_value, i) {
    		each_value[i] = value;
    		$$invalidate(0, colors);
    	}

    	$$self.$$set = $$props => {
    		if ("colors" in $$props) $$invalidate(0, colors = $$props.colors);
    	};

    	$$self.$capture_state = () => ({ chroma, Color, colors });

    	$$self.$inject_state = $$props => {
    		if ("colors" in $$props) $$invalidate(0, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colors, color_value_binding];
    }

    class ColorListReadOnly extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { colors: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorListReadOnly",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*colors*/ ctx[0] === undefined && !("colors" in props)) {
    			console.warn("<ColorListReadOnly> was created without expected prop 'colors'");
    		}
    	}

    	get colors() {
    		throw new Error("<ColorListReadOnly>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<ColorListReadOnly>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /** Used for built-in method references. */
    var funcProto = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype,
        objectProto$3 = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /* Built-in method references that are verified to be native. */
    var Map$1 = getNative(root, 'Map');

    /* Built-in method references that are verified to be native. */
    var nativeCreate = getNative(Object, 'create');

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
    }

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
    }

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
      return this;
    }

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map$1 || ListCache),
        'string': new Hash
      };
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map$1 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED$2);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /**
     * A specialized version of `_.some` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function cacheHas(cache, key) {
      return cache.has(key);
    }

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG = 1,
        COMPARE_UNORDERED_FLAG = 2;

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /** Built-in value references. */
    var Uint8Array = root.Uint8Array;

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);

      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
          result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$1 = 1,
        COMPARE_UNORDERED_FLAG$1 = 2;

    /** `Object#toString` result references. */
    var boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag$1 = '[object Symbol]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]';

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG$1;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag$1:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /** Used for built-in method references. */
    var objectProto$6 = Object.prototype;

    /** Built-in value references. */
    var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable$1.call(object, symbol);
      });
    };

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /** Detect free variable `exports`. */
    var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /** `Object#toString` result references. */
    var argsTag$1 = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag$1 = '[object Boolean]',
        dateTag$1 = '[object Date]',
        errorTag$1 = '[object Error]',
        funcTag$1 = '[object Function]',
        mapTag$1 = '[object Map]',
        numberTag$1 = '[object Number]',
        objectTag = '[object Object]',
        regexpTag$1 = '[object RegExp]',
        setTag$1 = '[object Set]',
        stringTag$1 = '[object String]',
        weakMapTag = '[object WeakMap]';

    var arrayBufferTag$1 = '[object ArrayBuffer]',
        dataViewTag$1 = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
    typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
    typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
    typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
    typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
    typedArrayTags[objectTag] = typedArrayTags[regexpTag$1] =
    typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
    typedArrayTags[weakMapTag] = false;

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    /** Detect free variable `exports`. */
    var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports$1 && freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    /* Node.js helper references. */
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /** Used for built-in method references. */
    var objectProto$7 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty$5.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /** Used for built-in method references. */
    var objectProto$8 = Object.prototype;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

      return value === proto;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeKeys = overArg(Object.keys, Object);

    /** Used for built-in method references. */
    var objectProto$9 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$6 = objectProto$9.hasOwnProperty;

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty$6.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$2 = 1;

    /** Used for built-in method references. */
    var objectProto$a = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$7 = objectProto$a.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
          return false;
        }
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(root, 'DataView');

    /* Built-in method references that are verified to be native. */
    var Promise$1 = getNative(root, 'Promise');

    /* Built-in method references that are verified to be native. */
    var Set$1 = getNative(root, 'Set');

    /* Built-in method references that are verified to be native. */
    var WeakMap = getNative(root, 'WeakMap');

    /** `Object#toString` result references. */
    var mapTag$2 = '[object Map]',
        objectTag$1 = '[object Object]',
        promiseTag = '[object Promise]',
        setTag$2 = '[object Set]',
        weakMapTag$1 = '[object WeakMap]';

    var dataViewTag$2 = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map$1),
        promiseCtorString = toSource(Promise$1),
        setCtorString = toSource(Set$1),
        weakMapCtorString = toSource(WeakMap);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
        (Map$1 && getTag(new Map$1) != mapTag$2) ||
        (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
        (Set$1 && getTag(new Set$1) != setTag$2) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag$1)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag$1 ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag$2;
            case mapCtorString: return mapTag$2;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag$2;
            case weakMapCtorString: return weakMapTag$1;
          }
        }
        return result;
      };
    }

    var getTag$1 = getTag;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$3 = 1;

    /** `Object#toString` result references. */
    var argsTag$2 = '[object Arguments]',
        arrayTag$1 = '[object Array]',
        objectTag$2 = '[object Object]';

    /** Used for built-in method references. */
    var objectProto$b = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag$1 : getTag$1(object),
          othTag = othIsArr ? arrayTag$1 : getTag$1(other);

      objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
      othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

      var objIsObj = objTag == objectTag$2,
          othIsObj = othTag == objectTag$2,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
        var objIsWrapped = objIsObj && hasOwnProperty$8.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty$8.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    function generateDerivedColors(baseColor, colorRules) {
        let derivedColors = [baseColor];
        let lch = baseColor.lch();
        
        colorRules && colorRules.forEach(rule => {
            derivedColors.push(chroma(lch[0] * rule.l, lch[1] * rule.c, lch[2] * rule.h, 'lch'));
        });
        return derivedColors;
    }

    let DECIMAL_PLACES = 4;
    let NUMBER_MATCH = `[0-9]{1,3}(?:\.[0-9]{1,${DECIMAL_PLACES}})?`;
    let lchPctRegex = new RegExp(`L(${NUMBER_MATCH})%C(${NUMBER_MATCH})%H(${NUMBER_MATCH})%`);
    let lchPctCompactRegex = new RegExp(`l(${NUMBER_MATCH})c(${NUMBER_MATCH})h(${NUMBER_MATCH})`);

    let removeTrailingZeros = s => {
        return s.replace(/(\.\d*?[1-9])0+$/g, '$1').replace(/(\d+)\.0000$/, '$1')
    };

    let pctS = v => {
        let f = parseFloat(v);
        if(isNaN(f)) {
            return "0"
        }
        return removeTrailingZeros((f * 100.0).toFixed(DECIMAL_PLACES).toString())
    };
    let pctToF = v => {
        let f = parseFloat(v);
        if(isNaN(f)) {
            return "0"
        }
        return removeTrailingZeros((f / 100.0).toFixed(DECIMAL_PLACES).toString())
    };
    let colorModifierObjectToString = r => `L${pctS(r.l)}%C${pctS(r.c)}%H${pctS(r.h)}%`;
    let colorModifierObjectToStringCompact = r => `l${pctS(r.l)}c${pctS(r.c)}h${pctS(r.h)}`;

    let compactColorRulesString = colorRules => {
        if(colorRules.length) {
            let ruleSetStrings = colorRules.map(ruleSet => ruleSet.map(colorModifierObjectToStringCompact).join(','));
            let allRulesEqual = ruleSetStrings.reduce((acc, cur, idx, arr) => acc && (idx > 0 ? isEqual(cur, arr[idx-1]) : true), true);
            
            let finalRulesString = allRulesEqual ? ruleSetStrings[0] : ruleSetStrings.join(';');
            return finalRulesString;
        }
        return '';
    };

    let compactColorRulesStringToColorRules = colorRulesString => {
        let rulesSetStrings = colorRulesString.split(';');
        return rulesSetStrings.map(ruleSetString => {
            let ruleSetArr = ruleSetString.split(',');
            return ruleSetArr.map(rule => {
                let matches = rule.match(lchPctCompactRegex);
                if(matches && matches.length === 4) {
                    return { l: pctToF(matches[1]), c: pctToF(matches[2]), h: pctToF(matches[3]) };
                }
            });
        });
    };

    /* src/DerivedColorList.svelte generated by Svelte v3.37.0 */

    const file$d = "src/DerivedColorList.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[16] = list;
    	child_ctx[17] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (121:4) {#each colors as color}
    function create_each_block_1$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "step svelte-1vv4d32");
    			set_style(div, "background-color", /*color*/ ctx[15].hex());
    			add_location(div, file$d, 121, 4, 3350);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*colors*/ 8) {
    				set_style(div, "background-color", /*color*/ ctx[15].hex());
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(121:4) {#each colors as color}",
    		ctx
    	});

    	return block;
    }

    // (127:0) {#if !edit}
    function create_if_block$7(ctx) {
    	let div;
    	let t;
    	let span;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*colors*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			span = element("span");
    			attr_dev(span, "class", "inv svelte-1vv4d32");
    			add_location(span, file$d, 133, 4, 3718);
    			attr_dev(div, "class", "form-control svelte-1vv4d32");
    			add_location(div, file$d, 127, 0, 3575);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    			append_dev(div, span);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*enterEditMode*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*colors*/ 8) {
    				each_value = /*colors*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(127:0) {#if !edit}",
    		ctx
    	});

    	return block;
    }

    // (131:4) {#each colors as color,i}
    function create_each_block$8(ctx) {
    	let color;
    	let updating_value;
    	let current;

    	function color_value_binding(value) {
    		/*color_value_binding*/ ctx[12](value, /*color*/ ctx[15], /*each_value*/ ctx[16], /*i*/ ctx[17]);
    	}

    	let color_props = {};

    	if (/*color*/ ctx[15] !== void 0) {
    		color_props.value = /*color*/ ctx[15];
    	}

    	color = new Color({ props: color_props, $$inline: true });
    	binding_callbacks.push(() => bind(color, "value", color_value_binding));

    	const block = {
    		c: function create() {
    			create_component(color.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(color, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const color_changes = {};

    			if (!updating_value && dirty & /*colors*/ 8) {
    				updating_value = true;
    				color_changes.value = /*color*/ ctx[15];
    				add_flush_callback(() => updating_value = false);
    			}

    			color.$set(color_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(color.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(color.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(color, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(131:4) {#each colors as color,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let t0;
    	let input_1;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*colors*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let if_block = !/*edit*/ ctx[0] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			input_1 = element("input");
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "palette svelte-1vv4d32");
    			set_style(div, "margin-bottom", "10px");
    			add_location(div, file$d, 119, 0, 3268);
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "class", "form-control svelte-1vv4d32");
    			toggle_class(input_1, "hidden", !/*edit*/ ctx[0]);
    			add_location(input_1, file$d, 125, 0, 3435);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, input_1, anchor);
    			/*input_1_binding*/ ctx[10](input_1);
    			set_input_value(input_1, /*colorString*/ ctx[2]);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[11]),
    					listen_dev(input_1, "blur", /*exitEditMode*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*colors*/ 8) {
    				each_value_1 = /*colors*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*colorString*/ 4 && input_1.value !== /*colorString*/ ctx[2]) {
    				set_input_value(input_1, /*colorString*/ ctx[2]);
    			}

    			if (dirty & /*edit*/ 1) {
    				toggle_class(input_1, "hidden", !/*edit*/ ctx[0]);
    			}

    			if (!/*edit*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*edit*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(input_1);
    			/*input_1_binding*/ ctx[10](null);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function dragstart$1(event, index) {
    	event.dataTransfer.setData("index", index);
    }

    function dragover$1(event) {
    	event.dataTransfer.dropEffect = "move";
    }

    function findIndex$1(el) {
    	const siblings = el.parentNode.children;

    	for (let i = 0; i < siblings.length; i++) {
    		if (siblings[i] === el) return i;
    	}

    	return -1;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let colorRules;
    	let colors;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DerivedColorList", slots, []);
    	let { index } = $$props;
    	let { allColorRules } = $$props;
    	let { baseColor } = $$props;
    	let edit = false;
    	let input;
    	let colorString = "";

    	function enterEditMode() {
    		$$invalidate(0, edit = true);
    		$$invalidate(2, colorString = colorRules.map(colorModifierObjectToString).join(", "));
    		input.focus();
    	}

    	function stringToRule(s) {
    		// LCH Percentage Modifier
    		let modifiers = lchPctRegex.exec(s);

    		if (modifiers && modifiers.length === 4) {
    			let lch = {
    				l: (parseFloat(modifiers[1]) / 100).toFixed(DECIMAL_PLACES),
    				c: (parseFloat(modifiers[2]) / 100).toFixed(DECIMAL_PLACES),
    				h: (parseFloat(modifiers[3]) / 100).toFixed(DECIMAL_PLACES)
    			};

    			return lch;
    		}

    		// Valid Color Entered Directly? convert it to a LCH percentage Modifier
    		if (chroma.valid(s)) {
    			let derivedColor = chroma(s);
    			let derivedColorLCH = derivedColor.lch();
    			let baseColorLCH = baseColor.lch();

    			let lch = {
    				l: (derivedColorLCH[0] / baseColorLCH[0]).toFixed(DECIMAL_PLACES),
    				c: (derivedColorLCH[1] / baseColorLCH[1]).toFixed(DECIMAL_PLACES),
    				h: (derivedColorLCH[2] / baseColorLCH[2]).toFixed(DECIMAL_PLACES)
    			};

    			return lch;
    		}

    		return undefined;
    	}

    	function exitEditMode() {
    		$$invalidate(0, edit = false);
    		let newRules = colorString.split(/\s*[,|\s]\s*/).map(stringToRule).filter(r => r);

    		setTimeout(
    			() => {
    				$$invalidate(6, allColorRules[index] = newRules, allColorRules);
    			},
    			150
    		);
    	}

    	function drop(event) {
    		const index = event.dataTransfer.getData("index");
    		const newIndex = findIndex$1(event.target);
    		const col = colors.splice(index, 1, null)[0];
    		colors.splice(newIndex, 0, col);
    		$$invalidate(3, colors = colors.filter(c => c !== null));
    	}

    	const writable_props = ["index", "allColorRules", "baseColor"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DerivedColorList> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			input = $$value;
    			$$invalidate(1, input);
    		});
    	}

    	function input_1_input_handler() {
    		colorString = this.value;
    		$$invalidate(2, colorString);
    	}

    	function color_value_binding(value, color, each_value, i) {
    		each_value[i] = value;
    		(((($$invalidate(3, colors), $$invalidate(8, baseColor)), $$invalidate(9, colorRules)), $$invalidate(6, allColorRules)), $$invalidate(7, index));
    	}

    	$$self.$$set = $$props => {
    		if ("index" in $$props) $$invalidate(7, index = $$props.index);
    		if ("allColorRules" in $$props) $$invalidate(6, allColorRules = $$props.allColorRules);
    		if ("baseColor" in $$props) $$invalidate(8, baseColor = $$props.baseColor);
    	};

    	$$self.$capture_state = () => ({
    		chroma,
    		Color,
    		generateDerivedColors,
    		DECIMAL_PLACES,
    		lchPctRegex,
    		colorModifierObjectToString,
    		index,
    		allColorRules,
    		baseColor,
    		edit,
    		input,
    		colorString,
    		enterEditMode,
    		stringToRule,
    		exitEditMode,
    		dragstart: dragstart$1,
    		dragover: dragover$1,
    		drop,
    		findIndex: findIndex$1,
    		colorRules,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ("index" in $$props) $$invalidate(7, index = $$props.index);
    		if ("allColorRules" in $$props) $$invalidate(6, allColorRules = $$props.allColorRules);
    		if ("baseColor" in $$props) $$invalidate(8, baseColor = $$props.baseColor);
    		if ("edit" in $$props) $$invalidate(0, edit = $$props.edit);
    		if ("input" in $$props) $$invalidate(1, input = $$props.input);
    		if ("colorString" in $$props) $$invalidate(2, colorString = $$props.colorString);
    		if ("colorRules" in $$props) $$invalidate(9, colorRules = $$props.colorRules);
    		if ("colors" in $$props) $$invalidate(3, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*allColorRules, index*/ 192) {
    			 $$invalidate(9, colorRules = allColorRules[index]);
    		}

    		if ($$self.$$.dirty & /*baseColor, colorRules*/ 768) {
    			 $$invalidate(3, colors = generateDerivedColors(baseColor, colorRules));
    		}

    		if ($$self.$$.dirty & /*baseColor, colorRules*/ 768) {
    			 (generateDerivedColors(baseColor, colorRules));
    		}
    	};

    	return [
    		edit,
    		input,
    		colorString,
    		colors,
    		enterEditMode,
    		exitEditMode,
    		allColorRules,
    		index,
    		baseColor,
    		colorRules,
    		input_1_binding,
    		input_1_input_handler,
    		color_value_binding
    	];
    }

    class DerivedColorList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { index: 7, allColorRules: 6, baseColor: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DerivedColorList",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*index*/ ctx[7] === undefined && !("index" in props)) {
    			console.warn("<DerivedColorList> was created without expected prop 'index'");
    		}

    		if (/*allColorRules*/ ctx[6] === undefined && !("allColorRules" in props)) {
    			console.warn("<DerivedColorList> was created without expected prop 'allColorRules'");
    		}

    		if (/*baseColor*/ ctx[8] === undefined && !("baseColor" in props)) {
    			console.warn("<DerivedColorList> was created without expected prop 'baseColor'");
    		}
    	}

    	get index() {
    		throw new Error("<DerivedColorList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<DerivedColorList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allColorRules() {
    		throw new Error("<DerivedColorList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allColorRules(value) {
    		throw new Error("<DerivedColorList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseColor() {
    		throw new Error("<DerivedColorList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseColor(value) {
    		throw new Error("<DerivedColorList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */

    const { window: window_1 } = globals;

    const file$e = "src/App.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	child_ctx[46] = i;
    	return child_ctx;
    }

    // (259:12) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let t;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text("Number of colors: ");
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "2");
    			attr_dev(input, "class", "svelte-5kkour");
    			add_location(input, file$e, 260, 38, 9124);
    			attr_dev(div, "class", "col-md");
    			add_location(div, file$e, 259, 16, 9065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			append_dev(div, input);
    			set_input_value(input, /*numColors*/ ctx[6]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*numColors*/ 64 && to_number(input.value) !== /*numColors*/ ctx[6]) {
    				set_input_value(input, /*numColors*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(259:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (255:12) {#if generateColorsDisabled}
    function create_if_block_3(ctx) {
    	let div;
    	let t;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text("Number of colors: ");
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "2");
    			input.disabled = true;
    			attr_dev(input, "class", "svelte-5kkour");
    			add_location(input, file$e, 256, 38, 8936);
    			attr_dev(div, "class", "col-md");
    			add_location(div, file$e, 255, 16, 8877);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			append_dev(div, input);
    			set_input_value(input, /*numOutputColors*/ ctx[15]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[20]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*numOutputColors*/ 32768 && to_number(input.value) !== /*numOutputColors*/ ctx[15]) {
    				set_input_value(input, /*numOutputColors*/ ctx[15]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(255:12) {#if generateColorsDisabled}",
    		ctx
    	});

    	return block;
    }

    // (249:4) <Card step="1" title="What kind of palette do you want to create?">
    function create_default_slot_4(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let buttongroup;
    	let updating_value;
    	let t1;
    	let current;

    	function buttongroup_value_binding(value) {
    		/*buttongroup_value_binding*/ ctx[19](value);
    	}

    	let buttongroup_props = {
    		options: ["sequential", "diverging", "manual"]
    	};

    	if (/*mode*/ ctx[7] !== void 0) {
    		buttongroup_props.value = /*mode*/ ctx[7];
    	}

    	buttongroup = new ButtonGroup({ props: buttongroup_props, $$inline: true });
    	binding_callbacks.push(() => bind(buttongroup, "value", buttongroup_value_binding));

    	function select_block_type(ctx, dirty) {
    		if (/*generateColorsDisabled*/ ctx[10]) return create_if_block_3;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Palette type:\n                ");
    			create_component(buttongroup.$$.fragment);
    			t1 = space();
    			if_block.c();
    			attr_dev(div0, "class", "col-md");
    			add_location(div0, file$e, 250, 12, 8650);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$e, 249, 8, 8620);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			mount_component(buttongroup, div0, null);
    			append_dev(div1, t1);
    			if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const buttongroup_changes = {};

    			if (!updating_value && dirty[0] & /*mode*/ 128) {
    				updating_value = true;
    				buttongroup_changes.value = /*mode*/ ctx[7];
    				add_flush_callback(() => updating_value = false);
    			}

    			buttongroup.$set(buttongroup_changes);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttongroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttongroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(buttongroup);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(249:4) <Card step=\\\"1\\\" title=\\\"What kind of palette do you want to create?\\\">",
    		ctx
    	});

    	return block;
    }

    // (267:4) <Card step="2" title="Select and arrange input colors">
    function create_default_slot_3(ctx) {
    	let inputcolors;
    	let updating_colors;
    	let updating_colors2;
    	let t0;
    	let div;
    	let span;
    	let t2;
    	let buttongroup;
    	let updating_value;
    	let current;

    	function inputcolors_colors_binding(value) {
    		/*inputcolors_colors_binding*/ ctx[22](value);
    	}

    	function inputcolors_colors2_binding(value) {
    		/*inputcolors_colors2_binding*/ ctx[23](value);
    	}

    	let inputcolors_props = {
    		diverging: /*mode*/ ctx[7] === "diverging"
    	};

    	if (/*colors*/ ctx[4] !== void 0) {
    		inputcolors_props.colors = /*colors*/ ctx[4];
    	}

    	if (/*colors2*/ ctx[5] !== void 0) {
    		inputcolors_props.colors2 = /*colors2*/ ctx[5];
    	}

    	inputcolors = new InputColors({ props: inputcolors_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputcolors, "colors", inputcolors_colors_binding));
    	binding_callbacks.push(() => bind(inputcolors, "colors2", inputcolors_colors2_binding));

    	function buttongroup_value_binding_1(value) {
    		/*buttongroup_value_binding_1*/ ctx[24](value);
    	}

    	let buttongroup_props = {
    		buttonSmall: true,
    		options: ["manual", "lightness", "chroma", "hue"]
    	};

    	if (/*arrangeBy*/ ctx[8] !== void 0) {
    		buttongroup_props.value = /*arrangeBy*/ ctx[8];
    	}

    	buttongroup = new ButtonGroup({ props: buttongroup_props, $$inline: true });
    	binding_callbacks.push(() => bind(buttongroup, "value", buttongroup_value_binding_1));

    	const block = {
    		c: function create() {
    			create_component(inputcolors.$$.fragment);
    			t0 = space();
    			div = element("div");
    			span = element("span");
    			span.textContent = "Arrange by:";
    			t2 = space();
    			create_component(buttongroup.$$.fragment);
    			attr_dev(span, "class", "text-muted svelte-5kkour");
    			add_location(span, file$e, 269, 16, 9447);
    			attr_dev(div, "class", "arrange-inputs svelte-5kkour");
    			add_location(div, file$e, 268, 12, 9402);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputcolors, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t2);
    			mount_component(buttongroup, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputcolors_changes = {};
    			if (dirty[0] & /*mode*/ 128) inputcolors_changes.diverging = /*mode*/ ctx[7] === "diverging";

    			if (!updating_colors && dirty[0] & /*colors*/ 16) {
    				updating_colors = true;
    				inputcolors_changes.colors = /*colors*/ ctx[4];
    				add_flush_callback(() => updating_colors = false);
    			}

    			if (!updating_colors2 && dirty[0] & /*colors2*/ 32) {
    				updating_colors2 = true;
    				inputcolors_changes.colors2 = /*colors2*/ ctx[5];
    				add_flush_callback(() => updating_colors2 = false);
    			}

    			inputcolors.$set(inputcolors_changes);
    			const buttongroup_changes = {};

    			if (!updating_value && dirty[0] & /*arrangeBy*/ 256) {
    				updating_value = true;
    				buttongroup_changes.value = /*arrangeBy*/ ctx[8];
    				add_flush_callback(() => updating_value = false);
    			}

    			buttongroup.$set(buttongroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputcolors.$$.fragment, local);
    			transition_in(buttongroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputcolors.$$.fragment, local);
    			transition_out(buttongroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputcolors, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(buttongroup);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(267:4) <Card step=\\\"2\\\" title=\\\"Select and arrange input colors\\\">",
    		ctx
    	});

    	return block;
    }

    // (279:16) {#if bezierDisabled}
    function create_if_block_2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "* Bezier interpolation requires 2-5 input colors";
    			attr_dev(span, "class", "warning svelte-5kkour");
    			add_location(span, file$e, 279, 16, 10035);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(279:16) {#if bezierDisabled}",
    		ctx
    	});

    	return block;
    }

    // (274:4) <Card step="3" title="Check and configure the resulting palette">
    function create_default_slot_2(ctx) {
    	let div2;
    	let div0;
    	let checkbox0;
    	let updating_value;
    	let t0;
    	let checkbox1;
    	let updating_value_1;
    	let t1;
    	let t2;
    	let div1;
    	let colorblindcheck;
    	let updating_colors;
    	let updating_active;
    	let t3;
    	let palettepreview;
    	let updating_steps;
    	let updating_correctLightness;
    	let updating_bezier;
    	let updating_colors_1;
    	let updating_colors2;
    	let updating_numColors;
    	let t4;
    	let div3;
    	let colorlistreadonly;
    	let updating_colors_2;
    	let t5;
    	let div8;
    	let div4;
    	let stepchart0;
    	let t6;
    	let div5;
    	let stepchart1;
    	let t7;
    	let div6;
    	let stepchart2;
    	let t8;
    	let div7;
    	let stepchart3;
    	let current;

    	function checkbox0_value_binding(value) {
    		/*checkbox0_value_binding*/ ctx[25](value);
    	}

    	let checkbox0_props = { label: "correct lightness" };

    	if (/*correctLightness*/ ctx[2] !== void 0) {
    		checkbox0_props.value = /*correctLightness*/ ctx[2];
    	}

    	checkbox0 = new Checkbox({ props: checkbox0_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox0, "value", checkbox0_value_binding));

    	function checkbox1_value_binding(value) {
    		/*checkbox1_value_binding*/ ctx[26](value);
    	}

    	let checkbox1_props = {
    		label: "bezier interpolation",
    		disabled: /*bezierDisabled*/ ctx[14]
    	};

    	if (/*bezier*/ ctx[1] !== void 0) {
    		checkbox1_props.value = /*bezier*/ ctx[1];
    	}

    	checkbox1 = new Checkbox({ props: checkbox1_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox1, "value", checkbox1_value_binding));
    	let if_block = /*bezierDisabled*/ ctx[14] && create_if_block_2(ctx);

    	function colorblindcheck_colors_binding(value) {
    		/*colorblindcheck_colors_binding*/ ctx[27](value);
    	}

    	function colorblindcheck_active_binding(value) {
    		/*colorblindcheck_active_binding*/ ctx[28](value);
    	}

    	let colorblindcheck_props = {};

    	if (/*steps*/ ctx[0] !== void 0) {
    		colorblindcheck_props.colors = /*steps*/ ctx[0];
    	}

    	if (/*simulate*/ ctx[12] !== void 0) {
    		colorblindcheck_props.active = /*simulate*/ ctx[12];
    	}

    	colorblindcheck = new ColorBlindCheck({
    			props: colorblindcheck_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(colorblindcheck, "colors", colorblindcheck_colors_binding));
    	binding_callbacks.push(() => bind(colorblindcheck, "active", colorblindcheck_active_binding));

    	function palettepreview_steps_binding(value) {
    		/*palettepreview_steps_binding*/ ctx[29](value);
    	}

    	function palettepreview_correctLightness_binding(value) {
    		/*palettepreview_correctLightness_binding*/ ctx[30](value);
    	}

    	function palettepreview_bezier_binding(value) {
    		/*palettepreview_bezier_binding*/ ctx[31](value);
    	}

    	function palettepreview_colors_binding(value) {
    		/*palettepreview_colors_binding*/ ctx[32](value);
    	}

    	function palettepreview_colors2_binding(value) {
    		/*palettepreview_colors2_binding*/ ctx[33](value);
    	}

    	function palettepreview_numColors_binding(value) {
    		/*palettepreview_numColors_binding*/ ctx[34](value);
    	}

    	let palettepreview_props = {
    		diverging: /*mode*/ ctx[7] === "diverging",
    		simulate: /*simulate*/ ctx[12]
    	};

    	if (/*steps*/ ctx[0] !== void 0) {
    		palettepreview_props.steps = /*steps*/ ctx[0];
    	}

    	if (/*correctLightness*/ ctx[2] !== void 0) {
    		palettepreview_props.correctLightness = /*correctLightness*/ ctx[2];
    	}

    	if (/*bezier*/ ctx[1] !== void 0) {
    		palettepreview_props.bezier = /*bezier*/ ctx[1];
    	}

    	if (/*colors*/ ctx[4] !== void 0) {
    		palettepreview_props.colors = /*colors*/ ctx[4];
    	}

    	if (/*colors2*/ ctx[5] !== void 0) {
    		palettepreview_props.colors2 = /*colors2*/ ctx[5];
    	}

    	if (/*numOutputColors*/ ctx[15] !== void 0) {
    		palettepreview_props.numColors = /*numOutputColors*/ ctx[15];
    	}

    	palettepreview = new PalettePreview({
    			props: palettepreview_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(palettepreview, "steps", palettepreview_steps_binding));
    	binding_callbacks.push(() => bind(palettepreview, "correctLightness", palettepreview_correctLightness_binding));
    	binding_callbacks.push(() => bind(palettepreview, "bezier", palettepreview_bezier_binding));
    	binding_callbacks.push(() => bind(palettepreview, "colors", palettepreview_colors_binding));
    	binding_callbacks.push(() => bind(palettepreview, "colors2", palettepreview_colors2_binding));
    	binding_callbacks.push(() => bind(palettepreview, "numColors", palettepreview_numColors_binding));

    	function colorlistreadonly_colors_binding(value) {
    		/*colorlistreadonly_colors_binding*/ ctx[35](value);
    	}

    	let colorlistreadonly_props = {};

    	if (/*outputColors*/ ctx[11] !== void 0) {
    		colorlistreadonly_props.colors = /*outputColors*/ ctx[11];
    	}

    	colorlistreadonly = new ColorListReadOnly({
    			props: colorlistreadonly_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(colorlistreadonly, "colors", colorlistreadonly_colors_binding));

    	stepchart0 = new StepChart({
    			props: {
    				title: "lightness (LCH)",
    				steps: /*steps*/ ctx[0],
    				mode: 0
    			},
    			$$inline: true
    		});

    	stepchart1 = new StepChart({
    			props: {
    				title: "chroma (LCH)",
    				steps: /*steps*/ ctx[0],
    				mode: 1
    			},
    			$$inline: true
    		});

    	stepchart2 = new StepChart({
    			props: {
    				title: "hue (LCH)",
    				steps: /*steps*/ ctx[0],
    				mode: 2
    			},
    			$$inline: true
    		});

    	stepchart3 = new StepChart({
    			props: {
    				title: "saturation (HSL)",
    				steps: /*steps*/ ctx[0],
    				mode: 3
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(checkbox0.$$.fragment);
    			t0 = space();
    			create_component(checkbox1.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			div1 = element("div");
    			create_component(colorblindcheck.$$.fragment);
    			t3 = space();
    			create_component(palettepreview.$$.fragment);
    			t4 = space();
    			div3 = element("div");
    			create_component(colorlistreadonly.$$.fragment);
    			t5 = space();
    			div8 = element("div");
    			div4 = element("div");
    			create_component(stepchart0.$$.fragment);
    			t6 = space();
    			div5 = element("div");
    			create_component(stepchart1.$$.fragment);
    			t7 = space();
    			div6 = element("div");
    			create_component(stepchart2.$$.fragment);
    			t8 = space();
    			div7 = element("div");
    			create_component(stepchart3.$$.fragment);
    			attr_dev(div0, "class", "col-md");
    			add_location(div0, file$e, 275, 12, 9772);
    			attr_dev(div1, "class", "col-md");
    			add_location(div1, file$e, 282, 12, 10166);
    			attr_dev(div2, "class", "row");
    			set_style(div2, "margin-bottom", "10px");
    			add_location(div2, file$e, 274, 8, 9714);
    			attr_dev(div3, "class", "row");
    			set_style(div3, "margin", "10px 0 10px 0");
    			add_location(div3, file$e, 295, 9, 10590);
    			attr_dev(div4, "class", "col-md");
    			add_location(div4, file$e, 299, 12, 10752);
    			attr_dev(div5, "class", "col-md");
    			add_location(div5, file$e, 302, 12, 10881);
    			attr_dev(div6, "class", "col-md");
    			add_location(div6, file$e, 305, 12, 11007);
    			attr_dev(div7, "class", "col-md");
    			add_location(div7, file$e, 308, 12, 11130);
    			attr_dev(div8, "class", "row");
    			add_location(div8, file$e, 298, 8, 10722);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(checkbox0, div0, null);
    			append_dev(div0, t0);
    			mount_component(checkbox1, div0, null);
    			append_dev(div0, t1);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			mount_component(colorblindcheck, div1, null);
    			insert_dev(target, t3, anchor);
    			mount_component(palettepreview, target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div3, anchor);
    			mount_component(colorlistreadonly, div3, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div4);
    			mount_component(stepchart0, div4, null);
    			append_dev(div8, t6);
    			append_dev(div8, div5);
    			mount_component(stepchart1, div5, null);
    			append_dev(div8, t7);
    			append_dev(div8, div6);
    			mount_component(stepchart2, div6, null);
    			append_dev(div8, t8);
    			append_dev(div8, div7);
    			mount_component(stepchart3, div7, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkbox0_changes = {};

    			if (!updating_value && dirty[0] & /*correctLightness*/ 4) {
    				updating_value = true;
    				checkbox0_changes.value = /*correctLightness*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			checkbox0.$set(checkbox0_changes);
    			const checkbox1_changes = {};
    			if (dirty[0] & /*bezierDisabled*/ 16384) checkbox1_changes.disabled = /*bezierDisabled*/ ctx[14];

    			if (!updating_value_1 && dirty[0] & /*bezier*/ 2) {
    				updating_value_1 = true;
    				checkbox1_changes.value = /*bezier*/ ctx[1];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			checkbox1.$set(checkbox1_changes);

    			if (/*bezierDisabled*/ ctx[14]) {
    				if (if_block) ; else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const colorblindcheck_changes = {};

    			if (!updating_colors && dirty[0] & /*steps*/ 1) {
    				updating_colors = true;
    				colorblindcheck_changes.colors = /*steps*/ ctx[0];
    				add_flush_callback(() => updating_colors = false);
    			}

    			if (!updating_active && dirty[0] & /*simulate*/ 4096) {
    				updating_active = true;
    				colorblindcheck_changes.active = /*simulate*/ ctx[12];
    				add_flush_callback(() => updating_active = false);
    			}

    			colorblindcheck.$set(colorblindcheck_changes);
    			const palettepreview_changes = {};
    			if (dirty[0] & /*mode*/ 128) palettepreview_changes.diverging = /*mode*/ ctx[7] === "diverging";
    			if (dirty[0] & /*simulate*/ 4096) palettepreview_changes.simulate = /*simulate*/ ctx[12];

    			if (!updating_steps && dirty[0] & /*steps*/ 1) {
    				updating_steps = true;
    				palettepreview_changes.steps = /*steps*/ ctx[0];
    				add_flush_callback(() => updating_steps = false);
    			}

    			if (!updating_correctLightness && dirty[0] & /*correctLightness*/ 4) {
    				updating_correctLightness = true;
    				palettepreview_changes.correctLightness = /*correctLightness*/ ctx[2];
    				add_flush_callback(() => updating_correctLightness = false);
    			}

    			if (!updating_bezier && dirty[0] & /*bezier*/ 2) {
    				updating_bezier = true;
    				palettepreview_changes.bezier = /*bezier*/ ctx[1];
    				add_flush_callback(() => updating_bezier = false);
    			}

    			if (!updating_colors_1 && dirty[0] & /*colors*/ 16) {
    				updating_colors_1 = true;
    				palettepreview_changes.colors = /*colors*/ ctx[4];
    				add_flush_callback(() => updating_colors_1 = false);
    			}

    			if (!updating_colors2 && dirty[0] & /*colors2*/ 32) {
    				updating_colors2 = true;
    				palettepreview_changes.colors2 = /*colors2*/ ctx[5];
    				add_flush_callback(() => updating_colors2 = false);
    			}

    			if (!updating_numColors && dirty[0] & /*numOutputColors*/ 32768) {
    				updating_numColors = true;
    				palettepreview_changes.numColors = /*numOutputColors*/ ctx[15];
    				add_flush_callback(() => updating_numColors = false);
    			}

    			palettepreview.$set(palettepreview_changes);
    			const colorlistreadonly_changes = {};

    			if (!updating_colors_2 && dirty[0] & /*outputColors*/ 2048) {
    				updating_colors_2 = true;
    				colorlistreadonly_changes.colors = /*outputColors*/ ctx[11];
    				add_flush_callback(() => updating_colors_2 = false);
    			}

    			colorlistreadonly.$set(colorlistreadonly_changes);
    			const stepchart0_changes = {};
    			if (dirty[0] & /*steps*/ 1) stepchart0_changes.steps = /*steps*/ ctx[0];
    			stepchart0.$set(stepchart0_changes);
    			const stepchart1_changes = {};
    			if (dirty[0] & /*steps*/ 1) stepchart1_changes.steps = /*steps*/ ctx[0];
    			stepchart1.$set(stepchart1_changes);
    			const stepchart2_changes = {};
    			if (dirty[0] & /*steps*/ 1) stepchart2_changes.steps = /*steps*/ ctx[0];
    			stepchart2.$set(stepchart2_changes);
    			const stepchart3_changes = {};
    			if (dirty[0] & /*steps*/ 1) stepchart3_changes.steps = /*steps*/ ctx[0];
    			stepchart3.$set(stepchart3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox0.$$.fragment, local);
    			transition_in(checkbox1.$$.fragment, local);
    			transition_in(colorblindcheck.$$.fragment, local);
    			transition_in(palettepreview.$$.fragment, local);
    			transition_in(colorlistreadonly.$$.fragment, local);
    			transition_in(stepchart0.$$.fragment, local);
    			transition_in(stepchart1.$$.fragment, local);
    			transition_in(stepchart2.$$.fragment, local);
    			transition_in(stepchart3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox0.$$.fragment, local);
    			transition_out(checkbox1.$$.fragment, local);
    			transition_out(colorblindcheck.$$.fragment, local);
    			transition_out(palettepreview.$$.fragment, local);
    			transition_out(colorlistreadonly.$$.fragment, local);
    			transition_out(stepchart0.$$.fragment, local);
    			transition_out(stepchart1.$$.fragment, local);
    			transition_out(stepchart2.$$.fragment, local);
    			transition_out(stepchart3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(checkbox0);
    			destroy_component(checkbox1);
    			if (if_block) if_block.d();
    			destroy_component(colorblindcheck);
    			if (detaching) detach_dev(t3);
    			destroy_component(palettepreview, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div3);
    			destroy_component(colorlistreadonly);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div8);
    			destroy_component(stepchart0);
    			destroy_component(stepchart1);
    			destroy_component(stepchart2);
    			destroy_component(stepchart3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(274:4) <Card step=\\\"3\\\" title=\\\"Check and configure the resulting palette\\\">",
    		ctx
    	});

    	return block;
    }

    // (319:8) {#if generateSecondaryColors}
    function create_if_block$8(ctx) {
    	let t;
    	let show_if = Array.isArray(/*secondaryColorRules*/ ctx[9]);
    	let if_block_anchor;
    	let current;
    	let each_value = /*outputColors*/ ctx[11];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = show_if && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*outputColors, secondaryColorRules*/ 2560) {
    				each_value = /*outputColors*/ ctx[11];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty[0] & /*secondaryColorRules*/ 512) show_if = Array.isArray(/*secondaryColorRules*/ ctx[9]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*secondaryColorRules*/ 512) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(319:8) {#if generateSecondaryColors}",
    		ctx
    	});

    	return block;
    }

    // (320:12) {#each outputColors as baseColor, i}
    function create_each_block$9(ctx) {
    	let div;
    	let derivedcolorlist;
    	let updating_allColorRules;
    	let current;

    	function derivedcolorlist_allColorRules_binding(value) {
    		/*derivedcolorlist_allColorRules_binding*/ ctx[37](value);
    	}

    	let derivedcolorlist_props = {
    		baseColor: /*baseColor*/ ctx[44],
    		index: /*i*/ ctx[46]
    	};

    	if (/*secondaryColorRules*/ ctx[9] !== void 0) {
    		derivedcolorlist_props.allColorRules = /*secondaryColorRules*/ ctx[9];
    	}

    	derivedcolorlist = new DerivedColorList({
    			props: derivedcolorlist_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(derivedcolorlist, "allColorRules", derivedcolorlist_allColorRules_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(derivedcolorlist.$$.fragment);
    			attr_dev(div, "class", "row");
    			set_style(div, "margin", "10px 0 10px 0");
    			add_location(div, file$e, 320, 16, 11566);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(derivedcolorlist, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const derivedcolorlist_changes = {};
    			if (dirty[0] & /*outputColors*/ 2048) derivedcolorlist_changes.baseColor = /*baseColor*/ ctx[44];

    			if (!updating_allColorRules && dirty[0] & /*secondaryColorRules*/ 512) {
    				updating_allColorRules = true;
    				derivedcolorlist_changes.allColorRules = /*secondaryColorRules*/ ctx[9];
    				add_flush_callback(() => updating_allColorRules = false);
    			}

    			derivedcolorlist.$set(derivedcolorlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(derivedcolorlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(derivedcolorlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(derivedcolorlist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(320:12) {#each outputColors as baseColor, i}",
    		ctx
    	});

    	return block;
    }

    // (326:12) {#if Array.isArray(secondaryColorRules)}
    function create_if_block_1(ctx) {
    	let div3;
    	let div0;
    	let stepchart20;
    	let t0;
    	let div1;
    	let stepchart21;
    	let t1;
    	let div2;
    	let stepchart22;
    	let current;

    	stepchart20 = new StepChart2({
    			props: {
    				title: "% change lightness (LCH)",
    				values: /*secondaryColorRules*/ ctx[9],
    				field: "l",
    				colors: /*outputColors*/ ctx[11]
    			},
    			$$inline: true
    		});

    	stepchart21 = new StepChart2({
    			props: {
    				title: "% change chroma (LCH)",
    				values: /*secondaryColorRules*/ ctx[9],
    				field: "c",
    				colors: /*outputColors*/ ctx[11]
    			},
    			$$inline: true
    		});

    	stepchart22 = new StepChart2({
    			props: {
    				title: "% change hue (LCH)",
    				values: /*secondaryColorRules*/ ctx[9],
    				field: "h",
    				colors: /*outputColors*/ ctx[11]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(stepchart20.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(stepchart21.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			create_component(stepchart22.$$.fragment);
    			attr_dev(div0, "class", "col-md");
    			add_location(div0, file$e, 327, 16, 11871);
    			attr_dev(div1, "class", "col-md");
    			add_location(div1, file$e, 330, 16, 12060);
    			attr_dev(div2, "class", "col-md");
    			add_location(div2, file$e, 333, 16, 12246);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$e, 326, 12, 11837);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(stepchart20, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			mount_component(stepchart21, div1, null);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			mount_component(stepchart22, div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stepchart20_changes = {};
    			if (dirty[0] & /*secondaryColorRules*/ 512) stepchart20_changes.values = /*secondaryColorRules*/ ctx[9];
    			if (dirty[0] & /*outputColors*/ 2048) stepchart20_changes.colors = /*outputColors*/ ctx[11];
    			stepchart20.$set(stepchart20_changes);
    			const stepchart21_changes = {};
    			if (dirty[0] & /*secondaryColorRules*/ 512) stepchart21_changes.values = /*secondaryColorRules*/ ctx[9];
    			if (dirty[0] & /*outputColors*/ 2048) stepchart21_changes.colors = /*outputColors*/ ctx[11];
    			stepchart21.$set(stepchart21_changes);
    			const stepchart22_changes = {};
    			if (dirty[0] & /*secondaryColorRules*/ 512) stepchart22_changes.values = /*secondaryColorRules*/ ctx[9];
    			if (dirty[0] & /*outputColors*/ 2048) stepchart22_changes.colors = /*outputColors*/ ctx[11];
    			stepchart22.$set(stepchart22_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stepchart20.$$.fragment, local);
    			transition_in(stepchart21.$$.fragment, local);
    			transition_in(stepchart22.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stepchart20.$$.fragment, local);
    			transition_out(stepchart21.$$.fragment, local);
    			transition_out(stepchart22.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(stepchart20);
    			destroy_component(stepchart21);
    			destroy_component(stepchart22);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(326:12) {#if Array.isArray(secondaryColorRules)}",
    		ctx
    	});

    	return block;
    }

    // (315:4) <Card step="4" title="Generate Secondary Palette Colors">
    function create_default_slot_1(ctx) {
    	let div;
    	let checkbox;
    	let updating_value;
    	let t;
    	let if_block_anchor;
    	let current;

    	function checkbox_value_binding(value) {
    		/*checkbox_value_binding*/ ctx[36](value);
    	}

    	let checkbox_props = { label: "generate secondary colors" };

    	if (/*generateSecondaryColors*/ ctx[3] !== void 0) {
    		checkbox_props.value = /*generateSecondaryColors*/ ctx[3];
    	}

    	checkbox = new Checkbox({ props: checkbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox, "value", checkbox_value_binding));
    	let if_block = /*generateSecondaryColors*/ ctx[3] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(checkbox.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(div, file$e, 315, 8, 11346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(checkbox, div, null);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkbox_changes = {};

    			if (!updating_value && dirty[0] & /*generateSecondaryColors*/ 8) {
    				updating_value = true;
    				checkbox_changes.value = /*generateSecondaryColors*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			checkbox.$set(checkbox_changes);

    			if (/*generateSecondaryColors*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*generateSecondaryColors*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(checkbox);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(315:4) <Card step=\\\"4\\\" title=\\\"Generate Secondary Palette Colors\\\">",
    		ctx
    	});

    	return block;
    }

    // (342:4) <Card step="5" title="Export the color codes in various formats">
    function create_default_slot(ctx) {
    	let p;
    	let t0;
    	let a;
    	let t1;
    	let a_href_value;
    	let t2;
    	let kbd0;
    	let t4;
    	let kbd1;
    	let t6;
    	let t7;
    	let export_1;
    	let current;

    	export_1 = new Export({
    			props: { steps: /*steps*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("You can also save your palette for later by bookmarking ");
    			a = element("a");
    			t1 = text("this page");
    			t2 = text(" using ");
    			kbd0 = element("kbd");
    			kbd0.textContent = `${/*isMac*/ ctx[16] ? "cmd" : "ctrl"}`;
    			t4 = text("+");
    			kbd1 = element("kbd");
    			kbd1.textContent = "d";
    			t6 = text(".");
    			t7 = space();
    			create_component(export_1.$$.fragment);
    			attr_dev(a, "href", a_href_value = "#/" + /*hash*/ ctx[13]);
    			add_location(a, file$e, 342, 67, 12614);
    			attr_dev(kbd0, "class", "svelte-5kkour");
    			add_location(kbd0, file$e, 342, 106, 12653);
    			attr_dev(kbd1, "class", "svelte-5kkour");
    			add_location(kbd1, file$e, 342, 142, 12689);
    			add_location(p, file$e, 342, 8, 12555);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, a);
    			append_dev(a, t1);
    			append_dev(p, t2);
    			append_dev(p, kbd0);
    			append_dev(p, t4);
    			append_dev(p, kbd1);
    			append_dev(p, t6);
    			insert_dev(target, t7, anchor);
    			mount_component(export_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*hash*/ 8192 && a_href_value !== (a_href_value = "#/" + /*hash*/ ctx[13])) {
    				attr_dev(a, "href", a_href_value);
    			}

    			const export_1_changes = {};
    			if (dirty[0] & /*steps*/ 1) export_1_changes.steps = /*steps*/ ctx[0];
    			export_1.$set(export_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(export_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(export_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t7);
    			destroy_component(export_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(342:4) <Card step=\\\"5\\\" title=\\\"Export the color codes in various formats\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let p0;
    	let t2;
    	let a0;
    	let t4;
    	let t5;
    	let card0;
    	let t6;
    	let card1;
    	let t7;
    	let card2;
    	let t8;
    	let card3;
    	let t9;
    	let card4;
    	let t10;
    	let div1;
    	let hr;
    	let t11;
    	let p1;
    	let t12;
    	let a1;
    	let t14;
    	let p2;
    	let t15;
    	let a2;
    	let t17;
    	let a3;
    	let t19;
    	let a4;
    	let t21;
    	let current;
    	let mounted;
    	let dispose;

    	card0 = new Card({
    			props: {
    				step: "1",
    				title: "What kind of palette do you want to create?",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				step: "2",
    				title: "Select and arrange input colors",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				step: "3",
    				title: "Check and configure the resulting palette",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card3 = new Card({
    			props: {
    				step: "4",
    				title: "Generate Secondary Palette Colors",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card4 = new Card({
    			props: {
    				step: "5",
    				title: "Export the color codes in various formats",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Data Color Palettes";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("This tools aids in generating perceptually meaningful and vision accessible color palettes for use in data visualization. Create sequential, ");
    			a0 = element("a");
    			a0.textContent = "multi-hued & multi-stop diverging";
    			t4 = text(" and qualitative color schemes.");
    			t5 = space();
    			create_component(card0.$$.fragment);
    			t6 = space();
    			create_component(card1.$$.fragment);
    			t7 = space();
    			create_component(card2.$$.fragment);
    			t8 = space();
    			create_component(card3.$$.fragment);
    			t9 = space();
    			create_component(card4.$$.fragment);
    			t10 = space();
    			div1 = element("div");
    			hr = element("hr");
    			t11 = space();
    			p1 = element("p");
    			t12 = text("Check it out ");
    			a1 = element("a");
    			a1.textContent = "on Github";
    			t14 = space();
    			p2 = element("p");
    			t15 = text("Adpated by ");
    			a2 = element("a");
    			a2.textContent = "Andrew Ringler";
    			t17 = text(" from ");
    			a3 = element("a");
    			a3.textContent = "palettes";
    			t19 = text(", originally created by ");
    			a4 = element("a");
    			a4.textContent = "Gregor Aisch";
    			t21 = text(".");
    			attr_dev(h1, "class", "svelte-5kkour");
    			add_location(h1, file$e, 245, 8, 8187);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", "http://vis4.net/blog/posts/mastering-multi-hued-color-scales/");
    			add_location(a0, file$e, 246, 152, 8368);
    			add_location(p0, file$e, 246, 8, 8224);
    			attr_dev(div0, "class", "head svelte-5kkour");
    			add_location(div0, file$e, 244, 4, 8160);
    			add_location(hr, file$e, 347, 8, 12784);
    			attr_dev(a1, "href", "https://github.com/andrewringler/palettes");
    			add_location(a1, file$e, 348, 24, 12813);
    			add_location(p1, file$e, 348, 8, 12797);
    			attr_dev(a2, "href", "https://andrewringler.com/");
    			add_location(a2, file$e, 349, 22, 12905);
    			attr_dev(a3, "href", "https://github.com/gka/palettes");
    			add_location(a3, file$e, 349, 83, 12966);
    			attr_dev(a4, "href", "https://vis4.net/blog");
    			add_location(a4, file$e, 349, 161, 13044);
    			add_location(p2, file$e, 349, 8, 12891);
    			attr_dev(div1, "class", "foot svelte-5kkour");
    			add_location(div1, file$e, 346, 4, 12757);
    			attr_dev(div2, "class", "container");
    			add_location(div2, file$e, 243, 0, 8132);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(p0, t2);
    			append_dev(p0, a0);
    			append_dev(p0, t4);
    			append_dev(div2, t5);
    			mount_component(card0, div2, null);
    			append_dev(div2, t6);
    			mount_component(card1, div2, null);
    			append_dev(div2, t7);
    			mount_component(card2, div2, null);
    			append_dev(div2, t8);
    			mount_component(card3, div2, null);
    			append_dev(div2, t9);
    			mount_component(card4, div2, null);
    			append_dev(div2, t10);
    			append_dev(div2, div1);
    			append_dev(div1, hr);
    			append_dev(div1, t11);
    			append_dev(div1, p1);
    			append_dev(p1, t12);
    			append_dev(p1, a1);
    			append_dev(div1, t14);
    			append_dev(div1, p2);
    			append_dev(p2, t15);
    			append_dev(p2, a2);
    			append_dev(p2, t17);
    			append_dev(p2, a3);
    			append_dev(p2, t19);
    			append_dev(p2, a4);
    			append_dev(p2, t21);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "hashchange", /*hashChange*/ ctx[17], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const card0_changes = {};

    			if (dirty[0] & /*numOutputColors, generateColorsDisabled, numColors, mode*/ 33984 | dirty[1] & /*$$scope*/ 65536) {
    				card0_changes.$$scope = { dirty, ctx };
    			}

    			card0.$set(card0_changes);
    			const card1_changes = {};

    			if (dirty[0] & /*arrangeBy, mode, colors, colors2*/ 432 | dirty[1] & /*$$scope*/ 65536) {
    				card1_changes.$$scope = { dirty, ctx };
    			}

    			card1.$set(card1_changes);
    			const card2_changes = {};

    			if (dirty[0] & /*steps, outputColors, mode, simulate, correctLightness, bezier, colors, colors2, numOutputColors, bezierDisabled*/ 55479 | dirty[1] & /*$$scope*/ 65536) {
    				card2_changes.$$scope = { dirty, ctx };
    			}

    			card2.$set(card2_changes);
    			const card3_changes = {};

    			if (dirty[0] & /*secondaryColorRules, outputColors, generateSecondaryColors*/ 2568 | dirty[1] & /*$$scope*/ 65536) {
    				card3_changes.$$scope = { dirty, ctx };
    			}

    			card3.$set(card3_changes);
    			const card4_changes = {};

    			if (dirty[0] & /*steps, hash*/ 8193 | dirty[1] & /*$$scope*/ 65536) {
    				card4_changes.$$scope = { dirty, ctx };
    			}

    			card4.$set(card4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1.$$.fragment, local);
    			transition_in(card2.$$.fragment, local);
    			transition_in(card3.$$.fragment, local);
    			transition_in(card4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1.$$.fragment, local);
    			transition_out(card2.$$.fragment, local);
    			transition_out(card3.$$.fragment, local);
    			transition_out(card4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(card0);
    			destroy_component(card1);
    			destroy_component(card2);
    			destroy_component(card3);
    			destroy_component(card4);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let hash;
    	let bezierDisabled;
    	let generateColorsDisabled;
    	let numOutputColors;
    	let outputColors;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { name } = $$props;
    	let steps = [];
    	let bezier = true;
    	let correctLightness = true;
    	let generateSecondaryColors = false;
    	let colors = ("00429d,96ffea,lightyellow").split(/\s*,\s*/).map(c => chroma(c));
    	let colors2 = [];
    	let numColors = 9;
    	let mode = "sequential";
    	let arrangeBy = "manual";
    	let simulate = "none";
    	let secondaryColorRules = [];

    	if (window.location.hash) {
    		readStateFromHash();
    	}

    	const isMac = navigator.platform.toUpperCase().indexOf("MAC") > -1;
    	let _hash = "";
    	let _mounted = false;
    	let _mode = "sequential";

    	beforeUpdate(() => {
    		if (hash !== _hash) {
    			_hash = hash;
    			window.location.hash = `#/${hash}`;
    		}

    		if (mode !== _mode) {
    			if (mode === "diverging" && !colors2.length) {
    				$$invalidate(5, colors2 = colors.slice(0).reverse());
    			}

    			if (mode === "sequential" || mode === "manual") {
    				$$invalidate(5, colors2 = []);
    			}

    			_mode = mode;
    		}
    	});

    	// onMount(() => {
    	//     if (window.location.hash) {
    	//         console.log('initial hash', window.location.hash);
    	//         readStateFromHash();
    	//     }
    	//     _mounted = true;
    	// })
    	function arrangeColors() {
    		if (arrangeBy === "manual" || mode === "diverging") {
    			return;
    		}

    		setTimeout(
    			() => {
    				let colorsOld = [...colors];

    				if (arrangeBy === "lightness") {
    					$$invalidate(4, colors = colors.sort((a, b) => a.lch()[0] > b.lch()[0] ? 1 : -1));
    				}

    				if (arrangeBy === "chroma") {
    					$$invalidate(4, colors = colors.sort((a, b) => a.lch()[1] > b.lch()[1] ? 1 : -1));
    				}

    				if (arrangeBy === "hue") {
    					$$invalidate(4, colors = colors.sort((a, b) => a.lch()[2] > b.lch()[2] ? 1 : -1));
    				}

    				// sort color rules by same metric, if lengths match
    				if (colors.length === secondaryColorRules.length) {
    					let sortOrder = colorsOld.map(oldColor => {
    						return colors.indexOf(oldColor);
    					});

    					let newSecondaryColorRules = [...secondaryColorRules];

    					secondaryColorRules.forEach((rule, idx) => {
    						newSecondaryColorRules[sortOrder[idx]] = rule;
    					});

    					$$invalidate(9, secondaryColorRules = newSecondaryColorRules);
    				}
    			},
    			150
    		);
    	}

    	function updateSecondaryColorRules() {
    		if (secondaryColorRules.length === outputColors.length) {
    			return; // all set
    		}

    		// Create new arrays of correct size filled with default rules
    		let newSecondaryColorsRules = [];

    		for (var i = 0; i < outputColors.length; i++) {
    			let rules = [];
    			let numberOfColors = 3;

    			if (Array.isArray(secondaryColorRules) && secondaryColorRules.length > i) {
    				numberOfColors = secondaryColorRules[i].length;
    			}

    			for (var j = 0; j < numberOfColors; j++) {
    				let offset = (j + 1) * 1.1 / 10;

    				rules.push({
    					l: (1 + offset).toFixed(1),
    					c: (1 + offset / 2).toFixed(1),
    					h: 1
    				});
    			}

    			newSecondaryColorsRules.push(rules);
    		}

    		// Fill in any any existing old rules that have the same indices
    		if (Array.isArray(secondaryColorRules)) {
    			for (var i = 0; i < outputColors.length; i++) {
    				let rules = newSecondaryColorsRules[i];

    				for (var j = 0; j < rules.length; j++) {
    					let oldRule = secondaryColorRules.length > i && Array.isArray(secondaryColorRules[i]) && secondaryColorRules[i].length > j && secondaryColorRules[i][j];

    					if (typeof oldRules === "object") {
    						rules[j] = oldRule;
    					}
    				}
    			}
    		}

    		setTimeout(
    			() => {
    				$$invalidate(9, secondaryColorRules = newSecondaryColorsRules);
    			},
    			150
    		);
    	}

    	function readStateFromHash() {
    		const parts = window.location.hash.substr(2).split("|");

    		if (parts.length >= 6) {
    			setTimeout(
    				() => {
    					$$invalidate(6, numColors = +parts[0]);

    					$$invalidate(7, mode = parts[1] === "s"
    					? "sequential"
    					: parts[1] === "d" ? "diverging" : "manual");

    					_mode = mode;
    					$$invalidate(4, colors = parts[2].split(",").map(c => c && chroma(c)));

    					$$invalidate(5, colors2 = parts[3] !== ""
    					? parts[3].split(",").map(c => c && chroma(c))
    					: []);

    					$$invalidate(2, correctLightness = parts[4] === "1");
    					$$invalidate(1, bezier = parts[5] === "1");
    					$$invalidate(3, generateSecondaryColors = parts.length >= 7 && parts[6] === "1");

    					if (parts.length >= 8) {
    						$$invalidate(9, secondaryColorRules = compactColorRulesStringToColorRules(parts[7]));
    					}
    				},
    				150
    			);
    		} else {
    			window.location.hash = "";
    		}
    	}

    	function hashChange() {
    		if (window.location.hash !== `#/${hash}`) {
    			// deserialize hash
    			readStateFromHash();
    		}
    	}

    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function buttongroup_value_binding(value) {
    		mode = value;
    		$$invalidate(7, mode);
    	}

    	function input_input_handler() {
    		numOutputColors = to_number(this.value);
    		(((($$invalidate(15, numOutputColors), $$invalidate(10, generateColorsDisabled)), $$invalidate(4, colors)), $$invalidate(6, numColors)), $$invalidate(7, mode));
    	}

    	function input_input_handler_1() {
    		numColors = to_number(this.value);
    		$$invalidate(6, numColors);
    	}

    	function inputcolors_colors_binding(value) {
    		colors = value;
    		$$invalidate(4, colors);
    	}

    	function inputcolors_colors2_binding(value) {
    		colors2 = value;
    		$$invalidate(5, colors2);
    	}

    	function buttongroup_value_binding_1(value) {
    		arrangeBy = value;
    		$$invalidate(8, arrangeBy);
    	}

    	function checkbox0_value_binding(value) {
    		correctLightness = value;
    		$$invalidate(2, correctLightness);
    	}

    	function checkbox1_value_binding(value) {
    		bezier = value;
    		$$invalidate(1, bezier);
    	}

    	function colorblindcheck_colors_binding(value) {
    		steps = value;
    		$$invalidate(0, steps);
    	}

    	function colorblindcheck_active_binding(value) {
    		simulate = value;
    		$$invalidate(12, simulate);
    	}

    	function palettepreview_steps_binding(value) {
    		steps = value;
    		$$invalidate(0, steps);
    	}

    	function palettepreview_correctLightness_binding(value) {
    		correctLightness = value;
    		$$invalidate(2, correctLightness);
    	}

    	function palettepreview_bezier_binding(value) {
    		bezier = value;
    		$$invalidate(1, bezier);
    	}

    	function palettepreview_colors_binding(value) {
    		colors = value;
    		$$invalidate(4, colors);
    	}

    	function palettepreview_colors2_binding(value) {
    		colors2 = value;
    		$$invalidate(5, colors2);
    	}

    	function palettepreview_numColors_binding(value) {
    		numOutputColors = value;
    		(((($$invalidate(15, numOutputColors), $$invalidate(10, generateColorsDisabled)), $$invalidate(4, colors)), $$invalidate(6, numColors)), $$invalidate(7, mode));
    	}

    	function colorlistreadonly_colors_binding(value) {
    		outputColors = value;
    		($$invalidate(11, outputColors), $$invalidate(0, steps));
    	}

    	function checkbox_value_binding(value) {
    		generateSecondaryColors = value;
    		$$invalidate(3, generateSecondaryColors);
    	}

    	function derivedcolorlist_allColorRules_binding(value) {
    		secondaryColorRules = value;
    		$$invalidate(9, secondaryColorRules);
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(18, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		chroma,
    		beforeUpdate,
    		onMount,
    		Checkbox,
    		InputColors,
    		PalettePreview,
    		Export,
    		StepChart,
    		StepChart2,
    		Card,
    		ColorBlindCheck,
    		ButtonGroup,
    		ColorListReadOnly,
    		DerivedColorList,
    		compactColorRulesString,
    		compactColorRulesStringToColorRules,
    		name,
    		steps,
    		bezier,
    		correctLightness,
    		generateSecondaryColors,
    		colors,
    		colors2,
    		numColors,
    		mode,
    		arrangeBy,
    		simulate,
    		secondaryColorRules,
    		isMac,
    		_hash,
    		_mounted,
    		_mode,
    		arrangeColors,
    		updateSecondaryColorRules,
    		readStateFromHash,
    		hashChange,
    		hash,
    		bezierDisabled,
    		generateColorsDisabled,
    		numOutputColors,
    		outputColors
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(18, name = $$props.name);
    		if ("steps" in $$props) $$invalidate(0, steps = $$props.steps);
    		if ("bezier" in $$props) $$invalidate(1, bezier = $$props.bezier);
    		if ("correctLightness" in $$props) $$invalidate(2, correctLightness = $$props.correctLightness);
    		if ("generateSecondaryColors" in $$props) $$invalidate(3, generateSecondaryColors = $$props.generateSecondaryColors);
    		if ("colors" in $$props) $$invalidate(4, colors = $$props.colors);
    		if ("colors2" in $$props) $$invalidate(5, colors2 = $$props.colors2);
    		if ("numColors" in $$props) $$invalidate(6, numColors = $$props.numColors);
    		if ("mode" in $$props) $$invalidate(7, mode = $$props.mode);
    		if ("arrangeBy" in $$props) $$invalidate(8, arrangeBy = $$props.arrangeBy);
    		if ("simulate" in $$props) $$invalidate(12, simulate = $$props.simulate);
    		if ("secondaryColorRules" in $$props) $$invalidate(9, secondaryColorRules = $$props.secondaryColorRules);
    		if ("_hash" in $$props) _hash = $$props._hash;
    		if ("_mounted" in $$props) _mounted = $$props._mounted;
    		if ("_mode" in $$props) _mode = $$props._mode;
    		if ("hash" in $$props) $$invalidate(13, hash = $$props.hash);
    		if ("bezierDisabled" in $$props) $$invalidate(14, bezierDisabled = $$props.bezierDisabled);
    		if ("generateColorsDisabled" in $$props) $$invalidate(10, generateColorsDisabled = $$props.generateColorsDisabled);
    		if ("numOutputColors" in $$props) $$invalidate(15, numOutputColors = $$props.numOutputColors);
    		if ("outputColors" in $$props) $$invalidate(11, outputColors = $$props.outputColors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*numColors, mode, colors, colors2, correctLightness, bezier, generateSecondaryColors, secondaryColorRules*/ 766) {
    			 $$invalidate(13, hash = [
    				numColors,
    				mode.substr(0, 1),
    				colors.map(c => c.hex().substr(1)).join(","),
    				colors2.length
    				? colors2.map(c => c.hex().substr(1)).join(",")
    				: "",
    				correctLightness ? 1 : 0,
    				bezier ? 1 : 0,
    				generateSecondaryColors ? 1 : 0,
    				secondaryColorRules.length && generateSecondaryColors
    				? compactColorRulesString(secondaryColorRules)
    				: ""
    			].join("|"));
    		}

    		if ($$self.$$.dirty[0] & /*mode, colors, colors2*/ 176) {
    			 $$invalidate(14, bezierDisabled = mode === "sequential" || mode === "manual"
    			? !(colors.length > 1 && colors.length <= 5)
    			: !(colors2.length > 1 && colors2.length <= 5 || colors.length > 1 && colors.length <= 5));
    		}

    		if ($$self.$$.dirty[0] & /*mode*/ 128) {
    			 $$invalidate(10, generateColorsDisabled = mode === "manual");
    		}

    		if ($$self.$$.dirty[0] & /*generateColorsDisabled, colors, numColors*/ 1104) {
    			 $$invalidate(15, numOutputColors = generateColorsDisabled ? colors.length : numColors);
    		}

    		if ($$self.$$.dirty[0] & /*colors, arrangeBy*/ 272) {
    			 (arrangeColors());
    		}

    		if ($$self.$$.dirty[0] & /*steps*/ 1) {
    			 $$invalidate(11, outputColors = steps.map(step => chroma(step)));
    		}

    		if ($$self.$$.dirty[0] & /*outputColors*/ 2048) {
    			 (updateSecondaryColorRules());
    		}
    	};

    	return [
    		steps,
    		bezier,
    		correctLightness,
    		generateSecondaryColors,
    		colors,
    		colors2,
    		numColors,
    		mode,
    		arrangeBy,
    		secondaryColorRules,
    		generateColorsDisabled,
    		outputColors,
    		simulate,
    		hash,
    		bezierDisabled,
    		numOutputColors,
    		isMac,
    		hashChange,
    		name,
    		buttongroup_value_binding,
    		input_input_handler,
    		input_input_handler_1,
    		inputcolors_colors_binding,
    		inputcolors_colors2_binding,
    		buttongroup_value_binding_1,
    		checkbox0_value_binding,
    		checkbox1_value_binding,
    		colorblindcheck_colors_binding,
    		colorblindcheck_active_binding,
    		palettepreview_steps_binding,
    		palettepreview_correctLightness_binding,
    		palettepreview_bezier_binding,
    		palettepreview_colors_binding,
    		palettepreview_colors2_binding,
    		palettepreview_numColors_binding,
    		colorlistreadonly_colors_binding,
    		checkbox_value_binding,
    		derivedcolorlist_allColorRules_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { name: 18 }, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[18] === undefined && !("name" in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

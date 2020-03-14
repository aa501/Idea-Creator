# rifraf
A simple requestAnimationFrame (rAF) wrapper/polyfill with added iteratee creator.

## Polyfill notes

- The polyfill is a very naïve setTimeout wrapper. For a more robust polyfill, I recommend the [raf](https://npmjs.org/package/raf) module.
- The default "frame-rate" for the polyfill is 120Hz or an 8ms delay.

## API

All examples below assume that you've already required rifraf: `var rifraf = require('rifraf');`

### The Basics

#### request(`<Function> fn`, `<Object:optional> ctx`)

Queues a callback to run before the next frame. Returns the rAF (or timeout, if polyfilled) handle. Pre-binds optional context object, if provided.

```javascript
// rifraf.request returns the runtime-assigned handle that can be used to cancel the callback
var handle = rifraf.request(function () {
   // code to run before next frame 
});
```

#### cancel(`handle`)

Cancels a previously request using the returned handle.

```javascript
// where handle is the return value of a rifraf.request call
rifraf.cancel(handle);
```

### The Extras

#### iteratee(`<Function> fn`, `<Object:optional> ctx`)

**alias**: _deferred_

Used to defer expensive iterations or event handlers that need to wait until after all current DOM operations complete. Returns a new function that when called queues fn bound with ctx or its own this and its arguments.

```javascript
// with context object
$('a[href]').each(rifraf.iteratee(function (i, el) {
    if ($(el).data('id') === this.id) {
        // expensive DOM ops here
    }
}, {id: 1}));

// without context object
$('a[href]').each(rifraf.iteratee(function () {
    var $el = $(this);
    // expensive DOM ops here
}));
```

#### delay(`<Function> fn`, `<Object:optional> ctx`, `<Number:optional> _delay`)

When you want to defer a function call, but your desired frame rate differs from native, `delay` is for you. Pre-binds context, if provided. 

```javascript
// with context
rifraf.delay(function () {
    console.log('My name is %s', this.name);
}, {name: 'Foo'});

// the next two are equivalent and will set the delay to ~24ms
rifraf.delay(function () {}, 24);

rifraf.delay(function () {}, null, 24);
```

#### delayed(`<Function> fn`, `<Object:optional> ctx`, `<Number:optional> delay`)

Used like `iteratee`, but when you want to `delay` not simply defer to next native frame. Call signature matches `delay`.

```javascript
var delayedDefault = rifraf.delayed(function (i, el) {
    console.log('href:', this.href);
});

$('a[href]').each(delayedDefault);

var delayed24ms = rifraf.delayed(function () {}, 24);
```

#### sync120Hz()

Sets default delay time for `delay`, `delayed` (and polyfilled `request` and `iteratee`) methods to 8ms (roughly: 1000 / 120).

#### sync60Hz()

Sets default delay time for `delay`, `delayed` (and polyfilled `request` and `iteratee`) methods to 16ms (roughly: 1000 / 60).

#### sync30Hz()

Sets default delay time for `delay`, `delayed` (and polyfilled `request` and `iteratee`) methods to 33ms (roughly: 1000 / 30).

#### sync(`<Number> delay`)

Sets default delay time for `delay`, `delayed` (and polyfilled `request` and `iteratee`) methods to `{delay}`ms.


# React and Algebraic Effects

> Algebraic effects are a way of adding computational effects to a pure functional setting. In a technical sense they are subsumed by the monadic approach to computational effects, but they offer new ways of programming that are not easily achieved with monads. In particular, algebraic effects are combined seamlessly, whereas monad transformers are needed in the monadic style.

**Effects** - A computational effect, or just effect, asks the calling environment to handle a partircular task, like logging, reading froma database or mutating some global state

**Effect Handlers** - When a effect is used, the nearest effect handler is called, which allows you to run code in response to the effect and return some value

The closer to Algebraic effects we can implement in React is the error handling:

```js
const fn = (x) => {
    // throw - effect
    throw new Error(x);
}

try {
    fn('stuff');
    // catch - effect handler
} catch(e) {
    console.error(e);
}
```

Effects: **throw** doesnt dictate behaviour it just signals that a error has occured

Effect Handlers: **catch** defines the behaviour for when a error occurs, the same error can result in diferent behaviours in different try/catch blocks

# React Suspense
throw would normally clear the call stack and become problematic, but with the Fiber architecture replacing the call stack, that makes it not problematic.

TO BE CONTINUED

# Reading Material
* https://github.com/reactjs/react-basic#algebraic-effects
* http://math.andrej.com/eff/
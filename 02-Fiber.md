# Fiber
In computer science, a fiber is a particularly lightweight thread of execution.

In React, Fiber is similar to a Stack Frame (https://youtu.be/7GcrT0SBSnI?t=728 & https://youtu.be/aV1271hd9ew?t=1356)

| Stack Frame                   | Fiber             |
| ------------------------------| ----------------- |
| subroutine (function)         | component type    |
| body (nested function calls)  | children          |
| return address                | parent component  |
| arguments                     | props             |
| return value                  | DOM Element       |

Fiber is a unit of work which allows React to devide work into interruptable chunks. Only having this concept of minimum unit of work the scheduler will have the capability of prioritising.

### Some fiber props:

| Property                              | Description                                                   |
| ------------------------------------- | ------------------------------------------------------------- |
| tag                                   | Tag identifying the type of fiber.
| return                                | The Fiber to return to after finishing processing this one.  This is effectively the parent, but there can be multiple parents (two) so this is only the parent of the thing we're currently processing. It is conceptually the same as the return address of a stack frame.                                     |
| child & sibiling                      | single linked list tree                                       |
| expirationTime                        | Represents a time in the future by which this work should be completed. This is also used to quickly determine if a subtree has no pending changes. | 
| alternate                             | This is a pooled version of a Fiber. Every fiber that gets updated will eventually have a pair. There are cases when we can clean up pairs to save memory if we need to. |
| stateNode                             | Reference to the Component / DOM element |

[View in Code](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiber.js#L78)

## Fiber work tags:
| Key                       | Value | Description                   |
| ------------------------- | ----- | ----------------------------- |
| IndeterminateComponent    | 0     | Before we know whether it is functional or class
| FunctionalComponent       | 1     ||
| ClassComponent            | 2     | React.Component / React.PureComponent
| HostRoot                  | 3     | Root of a host tree. Could be nested inside another node.
| HostPortal                | 4     | A subtree. Could be an entry point to a different renderer.
| HostComponent             | 5     | DOM nodes
| HostText                  | 6     ||
| CallComponent_UNUSED      | 7     ||
| CallHandlerPhase_UNUSED   | 8     ||
| ReturnComponent_UNUSED    | 9     ||
| Fragment                  | 10    ||
| Mode                      | 11    ||
| ContextConsumer           | 12    ||
| ContextProvider           | 13    ||
| ForwardRef                | 14    ||
| Profiler                  | 15    ||
| TimeoutComponent          | 16    ||

[View In Code](https://github.com/facebook/react/blob/master/packages/shared/ReactWorkTags.js)

# Priority
**Hypothesis:**
> The priority is defined by `ReactFiberExpirationTime` which has the following enum:
> 
> * NoWork = 0;
> * Sync = 1;
> * Never = MAX_SIGNED_31_BIT_INT;
> 
> On version 16 of react, everything is still scheduled as Sync, this should change on React 17.



[View In Code](https://github.com/facebook/react/blob/46950a3dfc9e14b5b91ee5823df11883f5d2466e/packages/react-reconciler/src/ReactFiberExpirationTime.js#L14)

**Questions:**
* How are priorities assigned? Offscreen components should have low priority. Stuff waiting for HTTP requests should have lower priority. But where/how are these priorities set?
https://github.com/facebook/react/blob/0040efc8d85923d64bee1fdf7e9029d65d01b751/packages/react-reconciler/src/ReactFiberPendingPriority.js#L19


* Where/How do we re-order the nextUnitOfWork to pickup a high priority work when is still processing a low priority work?
https://github.com/facebook/react/blob/0040efc8d85923d64bee1fdf7e9029d65d01b751/packages/react-reconciler/src/ReactFiberPendingPriority.js#L245

## RequestAnimationFrame
> The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.

https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

## RequestIdleCallback
> The window.requestIdleCallback() method queues a function to be called during a browser's idle periods. This enables developers to perform background and low priority work on the main event loop, without impacting latency-critical events such as animation and input response.

https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
https://developers.google.com/web/updates/2015/08/using-requestidlecallback

# Scheduling

## Theory Gathered From Talks
* Phases:
    * Render / Reconciliation (interruptible) - compute workInProgress tree
        * uses `requestIdleCallback` to figure out how much time it has to do some work
        * workLoop does one unit of work at the time, and checks if it still has time to do more work
        * workLoop keeps track of the nextUnitOfWork and the remainingTimeIdle
        * if shouldComponentUpdate returns false it skips re-render
        * it keeps track of a effectList to list the changes that need to be updated in the renderer
        * after traversing the tree, the tree gets marked as pendingCommit
    * Commit (non-interruptible)
        * If it still has time the workLoop calls the commit
        * Iterates the effect list to update the DOM (?)
        * Switch pointers, now the currentTree points to the most up-to-date tree (which was currently workInProgress)
            * Double buffering, on the next work in progress tree it does not have to build everything from the ground up
        * Run lifecycle hooks
            * componentDidUpdate
            * componentDidCatch
* Priorities
    * Each update will need to have a priority assigned
        * Synchronous - same as stack reconcilier
        * Task - before next event loop tick
        * Animation - before next frame - uses requestAnimationFrame
        * High - pretty soon - uses requestIdleCallback
        * Low - minor delays ok - uses requestIdleCallback
        * Offscreen - uses requestIdleCallback

## How does the scheduler finds the next unit of work?
To be answered.

## How priority is tracked and propagated through the fiber tree?
To be answered.

## How the scheduler knows when to pause and resume work.
To be answered.

## How work is flushed and marked as complete?
To be answered.

## How side-effects (such as lifecycle methods) work?
To be answered.

# What is the difference between InteractiveUpdates and Async Update?
CHECK computeExpirationForFiber.
To be answered.

# What changes in the workflow if setState is called from a onClick event?
* isBatchingUpdates = true

## How does Resource Cache Suspense works?
**Hypothesis:**
> If the resource is not yet cached, the http request is made, a promise exception is thrown and the work is interrupted. when the promise resolves the work is resumed and now the resource is available synchronously.
>
> So in the end the render method gets executed twice and the code is not really as synchronous as it really seems.

Confirmation:
To be answered.

## Deep Dive into the Code

### FiberNode:
Each React Component instance has a relation of one to one with a FiberNode. The component instance has a `_reactInternalFiber` reference to the FiberNode. When beging `ReactFiberBeginWork.js` the scheduled work in the reconciler project, if the workInProgress state node is still null then in `constructClassInstance@ReactFiberClassComponent.js` the class is instanciated, the fiber is associated with the instance and the updater function gets injected to the instance (and other stuff as well).

When a setState is called, the `enqueueSetState` function is called and the fiber is obtained from the component instance.

We have two trees in Fiber, workInProgress and Current, this will keep switching between the fiber an the fiber.alternate. All updates are scheduled performed on both trees (?).

`enqueueSetState` will update each fiber's `updateQueue` and then call `scheduleWork`.

`scheduleWork` will traverse the tree from the fiber that just triggered the setState up to the root (using fiber.return reference), once it gets to the root, if its not working neither commiting, then it starts performing the work on the root.


### Notes on the workflow:
* When booting our app using ReactDOM.render on the div a method called `legacyRenderSubtreeIntoContainer` gets called
    * Why is this method prefixed with `legacy` from a first analysis the fibers created by this method all get marked as `sync`, so my hypothesis is that the async rendering is not yet enabled (?)
* This function calls `legacyCreateRootFromDOMContainer`  which hardcodes isAsync to `false` has a comment `Legacy roots are not async by default`
* The previous function ends up creating a `ReactRoot` instance, which in its constructor creates a `FiberRoot`
* `ReactRoot` is a class which hasa property _internalRoot refering the FiberRoot
* `FiberRoot` is a object that has a property `current` which is a `FiberNode` for a HostRoot (tag = 3) it also has info on the container DOM node and it seems to initiaze all the props to keep track of the scheduler work
* After `legacyRenderSubtreeIntoContainer` creates the `ReactRoot` it calls the `ReactRoot` render method
* ReactRoot's render method creates a instance of `ReactWork` and it calls a function called `updateContainer` @ `/react/packages/react-reconciler/src/ReactFiberReconciler.js`. This function gets the current fiber from the container (in this case the container is our ReactRoot._internalRoot aka FiberRoot) and calculates the expiration time for the current work. Then calling `updateContainerAtExpirationTime` which will endup calling `scheduleRootUpdate`
* `scheduleRootUpdate`:
    * `enqueueUpdate`
    * `scheduleWork`


# Other terms
* Cooperative Scheduling
* DoubleBuffer
* Algebraic Effects

## Resources
* https://github.com/acdlite/react-fiber-architecture
* https://github.com/facebook/react/issues/7942
* [Youtube: Lin Clark - A Cartoon Intro to Fiber](https://www.youtube.com/watch?v=ZCuYPiUIONs)
* [Youtube: Brandon Dail Algebraic effects, Fibers, Coroutines Oh my!](https://www.youtube.com/watch?v=7GcrT0SBSnI)
* https://www.youtube.com/watch?v=U9zFfIww3Go

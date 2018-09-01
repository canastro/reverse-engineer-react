# Fiber
## Concepts
* Unit of Work
* Priority
* Scheduling

## Scheduling
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

## Resources
* https://github.com/acdlite/react-fiber-architecture
* https://www.youtube.com/watch?time_continue=2&v=ZCuYPiUIONs
* https://www.youtube.com/watch?v=U9zFfIww3Go


# Notes
* React: createElement(type) => ReactElement.type 
    * https://reactjs.org/docs/react-api.html#createelement
    * type: 
        * 'div', 'button', etc
        * Class
        * Fragments
* ReactDOM: createElement => DOM Node
* React referes to document as ownerDocument
* ReactDOM: If I need to debug interactions with the DOM I can find most of the interactions with the DOM in the ReactDOMFiberComponent.js
    * createElement
    * createTextNode
    * setInitialProperties
    * setInitialDOMProperties
* DOM Nodes are attached to Fiber Nodes
* ReactReconciler: completeWork@ReactFiberCompleteWork.js
* React Synthetic Events: https://www.youtube.com/watch?v=dRo_egw7tBc
* Learn about Fiber: 
    * https://github.com/acdlite/react-fiber-architecture
    * https://www.youtube.com/watch?time_continue=2&v=ZCuYPiUIONs
    * https://www.youtube.com/watch?v=U9zFfIww3Go
    * Cooperative Scheduling - investigate(?)
    * 1 Fiber <=> 1 Instance
    * There is a current tree of fibers and a workInProgress tree of fibers
    * HostRoot - element where the react app is mounted

# How do DOM Nodes are created?
* React: createElement(type) // When in DEV mode it uses createElementWithValidations(? validate name)
* ReactReconciler: completeWork@ReactFiberCompleteWork.js
* ReactDOM: createElement => DOM Instance
* ReactDOM: setInitialProperties
* ReactDOM: setInitalDOMProperties /attach events (?)

# How does fiber scheduler works?

# How does fiber know the priority of a update?

# How is a Class Component created and how does the lifecycle works?

# How is state changes queued?

# How does suspense works?

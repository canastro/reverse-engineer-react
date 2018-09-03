# Reverse Engineering React
Based on https://blog.angularindepth.com/practical-application-of-reverse-engineering-guidelines-and-principles-784c004bb657

I only had a really high level idea about the React's Fiber refactor, after reading Max Wizard K's article I decided it was time to dive deeper.

Citing Max `As you go through the source code, you’ll become familiar with the new design patterns to solve common problems which you can then reuse at work.`. React codebase looked like it could be a gold mine of knowledge... I was super intrigued about react's suspense, scheduling, reconciling, etc. So, lets see what can I learn from this exploration.

# Resources
Before jumping into this, make sure to grasp some of the basic concepts, here is a reading list that helped me:

* [Article: Basic Theoretical Concepts](https://github.com/reactjs/react-basic)
* [React Docs: Components - Instances - Elements](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)
* [React Docs: Reconciliation](https://reactjs.org/docs/reconciliation.html)
* [React Docs: React Design Principles](https://reactjs.org/docs/design-principles.html)
* [Talk: Andrew Clark - What's Next for React](https://www.youtube.com/watch?v=aV1271hd9ew)
* [Talk: Keynote - Andrew Clark at @ReactEurope 2017](https://www.youtube.com/watch?v=QW5TE4vrklU)
* [Talk: Lin Clark - A Cartoon Intro to Fiber](https://www.youtube.com/watch?v=ZCuYPiUIONs)
* [Article: - Korneliusz Caputa - Look inside fiber](http://makersden.io/blog/look-inside-fiber)
* [Article:  React Fiber Architecture by acdlite](https://github.com/acdlite/react-fiber-architecture)
* [Talk: Brandon Dail - Algebraic effects, Fibers, Coroutines Oh my!](https://www.youtube.com/watch?v=7GcrT0SBSnI)
* [Blog Post: Didact Fiber - build your own react](https://engineering.hexacta.com/didact-fiber-incremental-reconciliation-b2fe028dcaec)
* TO BE WATCHED - [Talk: Building React From Scratch](https://www.youtube.com/watch?v=_MAD4Oly9yg)
* TO BE WATCHED - [Talk: Tiny React Renderer](https://www.youtube.com/watch?v=U9zFfIww3Go)
* ["Article": Fiber Principles by sebmarkbage](https://github.com/facebook/react/issues/7942)

---

* TO BE WATCHED - [Discussion: Why, What, and How of React Fiber with Dan Abramov and Andrew Clark](https://www.youtube.com/watch?v=crM1iRVGpGQ)


WIP: https://drive.draw.io/?lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1#G15oIi3Rx_0zGmgNOLkq8aqCJm7KIFq5SQ

# Other
* https://github.com/reactjs/react-future
* https://github.com/koba04/react-fiber-resources
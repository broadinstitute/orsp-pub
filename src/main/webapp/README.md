# Developing React Code in ORSP

## Philosophy

* [App Structure](https://hackernoon.com/the-100-correct-way-to-structure-a-react-app-or-why-theres-no-such-thing-3ede534ef1ed)

## Code style:

* Not in IntelliJ: use an eslint plugin.
* In IntelliJ: when you open the project, go to Settings -> Editor -> Code Style -> Javascript, 
    click the gear next to Scheme, and import [js-style.xml](js-style.xml).

## Running
Run grails normally, either via a terminal window or the IDE.

In a separate shell (or your IDE), run the gradle task that compiles
the react to javascript: `gradle webpackDev`

That will recompile `webapp` when any of the source files are changed.

## Testing

See https://medium.freecodecamp.org/the-right-way-to-test-react-components-548a4736ab22 for
the inspiration for this approach. For larger components, try to limit scope. Push as much
granular testing as possible down to the sub-components. 

* [Jest Testing](https://jestjs.io/docs/en/expect)
* [Test Philosophy](https://medium.freecodecamp.org/the-right-way-to-test-react-components-548a4736ab22)

### TODO 
* Add mocks for test framework
* Flesh out missing tests
* Add tests for each component
* Potentially add karma test running so we can have a ui-based view of the tests. 
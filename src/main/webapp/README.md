# Developing React Code in ORSP

Run grails normally, either via a terminal window or the IDE.

In a separate shell (or your IDE), run the gradle task that compiles
the react to javascript: `gradle webpackDev`

That will recompile everything when any of the source files are changed.

## After Dev ...

When you're done, run the webpackProd task that will generate a cleaned up version of
the compiled javascript files from `src/main/webapp`. That's what you need to check
into source control when completed.
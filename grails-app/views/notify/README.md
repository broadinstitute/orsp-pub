All files in this directory are intended to be 
rendered through the service class, `NotifyService`.

Due to intellij not being able to determine usages of
files rendered directly through `NotifyService`, take
care to ensure that we don't leave behind unused 
views and templates.

### TO-DO 
All of these renderings should be migrated to use Sendgrid 
templates so that we can simplify our API calls. 

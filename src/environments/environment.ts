// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  registerSubscriberEndpoint: 'http://localhost:9001/notifications/registerSubscriber',
  sendNotificationEndpoint: 'http://localhost:9001/notifications/sendNotification',
  vapidPublicKey: 'BJAPRdEWBOv4iv6W-2y3nzEOYomtj38JqEFlif7cfvKT8FxFvxl37B9CGfHZB7i677WL3v-zdCqBIUvcvJ8XOss'
};
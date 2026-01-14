// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appTitle: 'Empatif',
  links: [
    { label: 'Zoho CRM', url: 'https://crm.zoho.eu' },
    { label: 'NetSuite', url: 'https://system.netsuite.com' },
    { label: 'Respond.io', url: 'https://app.respond.io' },
    { label: 'Bizneo', url: 'https://app.bizneo.com' },
  ],
  splashDurationMs: 1200
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

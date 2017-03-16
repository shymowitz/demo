// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  applicationUrl: 'http://localhost:4200/',
   loginUrl: 'http://localhost:4200/login',
 // loginUrl: 'https://cio.egos.nih.gov/#login',

  // backendBaseUrl: 'http://localhost:8080/',
  backendBaseUrl: 'http://be-appserverelasti-1do3316ry415t-582501135.us-east-1.elb.amazonaws.com/',

  //backendBaseUrl:'be-AppServerElasti-1DO3316RY415T-582501135.us-east-1.elb.amazonaws.com',

  gssFileSystemUrl: 'http://s3.amazonaws.com/neos-xapps-dev-s3bucketforwebsitecontent-1n4lc2awh3ps4/GSS-product-images-updated'
};

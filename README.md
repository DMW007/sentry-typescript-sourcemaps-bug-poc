## Docker
1. Start all containers using `docker-compose up -d`
2. Create tables and admin accont: `docker-compose run --rm sentry sentry upgrade`
3. Go to http://localhost:9000, create a project of type Node.js

## Raven test project
### Initial steps
1. Create an auth token with `project:write` privilege
2. Set environment variables by executing `. env.sh` (note the dot, it will run the script in the current shell environment). For unknown reasons, `SENTRY_PROPERTIES` doesn't work well.
3. Verify the auth worked properly by running `npx sentry-cli info`

### Create a release
1. Build example code: `npm run build`
2. Now we've a js source file with corresponding sourcemap in the `dist` folder:
```
[daniel@antergos raven-app]$ ls -lh dist
total 8.0K
-rw-r--r-- 1 daniel users  963 May 17 17:56 main.js
-rw-r--r-- 1 daniel users 2.1K May 17 17:56 main.js.map
```
3. Create a release: `npx sentry-cli releases new 0.1`
4. Upload artifacts: 
`npx sentry-cli releases files 0.1 upload dist/main.js '~/main.js'`
`npx sentry-cli releases files 0.1 upload-sourcemaps dist`
5. Verify that we see them in http://localhost:9000/sentry/test/releases/0.1/artifacts/
6. Let the test app crash: `RELEASE=0.1 npm start`

Now we se an error-report based on the wrong files, which can be prooved by e.g. missing types: `bar(name) {` instead of `bar(name:string): boolean {` as it should be. Also the last line contains the reference to `main.js.map` which is only present in javascript. 

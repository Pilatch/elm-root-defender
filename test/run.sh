cd sample-project
yarn
yarn build
grep '.getElementById("my-app")' dist/*.js

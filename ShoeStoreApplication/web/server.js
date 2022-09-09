// Get the app server port from the environment (assuming heroku) or default to 8000 for local testing
const httpPort = process.env.PORT || 8000;

const app = require('./imperial').app;

app.listen(httpPort, () => {
  console.log(`HTTP server up on port ${httpPort}`);
});

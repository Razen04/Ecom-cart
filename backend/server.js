// Importing the app from app.js
const app = require("/app");

const PORT = process.env.PORT || 5000;

// Listening the PORT
app.listen(PORT, () => {
  console.log(`Successfully connect to the PORT: ${PORT}`);
});

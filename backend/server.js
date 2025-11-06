// Importing the app from app.js
const { app, initializeDatabase } = require("./app");

const PORT = process.env.PORT || 5000;


initializeDatabase()
  .then(() => {
    // Listening the PORT
    app.listen(PORT, () => {
      console.log(`Successfully connect to the PORT: ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to initialize database", err);
    process.exit(1); // Exiting if the Database promise fails
  })


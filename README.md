# EcomCart

This is a full-stack application as an assignment. The project features a robust, 100% test-covered backend API built with Node.js/Express and a SQLite database. The frontend is a responsive, modern single-page application (SPA) built with React (Vite), styled with Tailwind CSS, and managed with the React Context API.

## Screenshots

Here's a sneak peek of the application in action.

<table>
  <tr>
    <td align="center">
      <strong>Product Grid (Desktop)</strong>
      <br>
      <img src="screenshots/Grid Desktop.png" alt="Product Grid Desktop Screenshot" class="max-w-full rounded-lg shadow-md">
    </td>
    <td align="center">
      <strong>Cart (Desktop)</strong>
      <br>
      <img src="screenshots/Cart Desktop.png" alt="Cart Desktop Screenshot" class="max-w-full rounded-lg shadow-md">
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Product Detail Modal (Desktop)</strong>
      <br>
      <img src="screenshots/Product Modal Desktop.png" alt="Product Detail Modal Desktop Screenshot" class="max-w-full rounded-lg shadow-md">
    </td>
    <td align="center">
      <strong>Checkout Receipt (Desktop)</strong>
      <br>
      <img src="screenshots/Checkout Desktop.png" alt="Checkout Receipt Desktop Screenshot" class="max-w-full rounded-lg shadow-md">
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Product Grid (Mobile)</strong>
      <br>
      <img src="screenshots/Grid Mobile.png" alt="Product Grid Mobile Screenshot" class="max-w-full rounded-lg shadow-md">
    </td>
    <td align="center">
      <strong>Cart (Mobile)</strong>
      <br>
      <img src="screenshots/Cart Mobile.png" alt="Cart Mobile Screenshot" class="max-w-full rounded-lg shadow-md">
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Product Detail Modal (Mobile)</strong>
      <br>
      <img src="screenshots/Product Modal Mobile.png" alt="Product Detail Modal Mobile Screenshot" class="max-w-full rounded-lg shadow-md">
    </td>
    <td align="center">
      <strong>Checkout Receipt (Mobile)</strong>
      <br>
      <img src="screenshots/Checkout Mobile.png" alt="Checkout Receipt Mobile Screenshot" class="max-w-full rounded-lg shadow-md">
    </td>
  </tr>
</table>

## Core Features

Here’s a rundown of what makes EcomCart work.

### Backend & API

-   **Complete API:** All 5 required endpoints are built, functioning, and secured.
-   **Test-Driven Development:** The entire backend API is 100% covered by automated unit tests using Jest and Supertest.
-   **Smart Database Seeding:** On the first run, the database is automatically populated with 20 products from the [Fake Store API](https://fakestoreapi.com).
-   **Secure Price Calculation:** All cart totals and financial calculations are handled on the backend to prevent any client-side price manipulation.
-   **Test-Ready Architecture:** The server is intentionally structured to be fully testable, running against a separate, temporary database that cleans up after itself.

### Frontend & UI

-   **Product Catalog:** View the complete product catalog in a clean, responsive grid.
-   **Detailed Product Views:** Click any product to open a detailed modal with its full description.
-   **Full Cart Functionality:**
    -   Add items from the product grid or the detail modal.
    -   If an item is already in the cart, its quantity is updated instead of adding a duplicate.
    -   Easily remove items from the cart.
-   **Mock Checkout:**  A simple, validated form allows for a mock checkout.
-   **Global State Management:** A single, clean global state managed by the React Context API.
-   **Responsive Design:** The UI is fully responsive and looks great on mobile, tablet, and desktop devices.
-   **A Polished User Experience:** Includes loading states, empty cart messages, and smooth modal transitions.

## Technology Stack

I chose a modern and efficient stack for this project:

-   **Backend**
    -   **Node.js & Express:** For building the server and API.
    -   **SQLite:** A lightweight, file-based SQL database perfect for fast development.
    -   **Axios:** To fetch data from the Fake Store API for seeding the database.
-   **Frontend**
    -   **React (with Vite):** For building the interactive user interface.
    -   **Tailwind CSS:** A utility-first CSS framework for rapid and responsive styling.
    -   **React Context API:** For managing global state without adding external libraries.
-   **Testing**
    -   **Jest & Supertest:** To write and run the comprehensive backend test suite.

## Project Structure

I organized the project with a clear separation of concerns between the frontend and backend.

```
ecom-cart/
├── backend/
│   ├── api.test.js       # All backend Jest tests
│   ├── apiRoutes.js      # Express API routes
│   ├── app.js            # Express app setup and middleware
│   ├── db.js             # Database connection and schema logic
│   ├── server.js         # Server entry point
│   ├── ecomstore.db      # The development database (auto-created)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── context/      # CartContext for global state
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # App entry point
│   ├── tailwind.config.js
│   ├── vite.config.js    # Includes /api proxy to the backend
│   └── package.json
└── README.md
```

## Getting Started

To run this project locally, you'll need **Node.js (v18 or newer)** installed. You'll also need two separate terminal windows, as the frontend and backend run as separate processes.

> You can checkout this [Youtube Demo](https://youtu.be/Imtlp4iQd3c) and can checkout the database diagram [here](https://dbdiagram.io/d/EcomCart-690df4a36735e11170be3332)

### 1. Clone the Repository

```sh
git clone https://github.com/Razen04/Ecom-cart
cd Ecom-cart
```

### 2. Set Up the Backend

In your first terminal window, navigate to the `backend` directory and run the following commands:

```sh
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm run start
```

The backend server will now be running on `http://localhost:5000`. On its first run, it will automatically create the `ecomstore.db` file, set up the database schema, and populate it with products.

### 3. Set Up the Frontend

In a second terminal window, navigate to the `frontend` directory:

```sh
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The React application will now be available at `http://localhost:5173`. Open this URL in your browser to use the app.

### 4. Running the Tests

To run the complete backend test suite, use the following command from the `/backend` directory:

```sh
npm run test
```

This will spin up a separate test database, run all tests against it, and then automatically delete the test database file.

## Architectural Decisions

Here's a bit about the *why* behind some of the key technical choices I made.

#### Why SQLite over MongoDB?

For a 48-hour timed assignment, I find SQLite to be the best choice. I don’t need to worry about setup, cloud accounts, or environment variables. It’s a fast, file-based SQL database that’s ready to go immediately, which means I can spend all my time focusing on the application itself instead of the infrastructure.

#### Why do I store prices as integers?

I stored prices as integers because it’s a crucial best practice when dealing with money. Using floating-point numbers like REAL or FLOAT can introduce tiny rounding errors such as 0.1 + 0.2 coming out as 0.300000004. By keeping everything in the smallest unit, like paisa, I can rely on simple integer math for perfectly accurate calculations.

#### Why use React's Context API instead of Redux?

I chose React's Context API because, while Redux is powerful, it often brings in extra complexity and dependencies that aren’t always necessary. For this app, the global state like the cart and products are simple enough that Context handles it perfectly. It keeps the project lightweight.

#### Why is all API logic located in the Context provider?

I decided to put all the API calls—like `fetchProducts` and `addToCart` which are inside the `CartContext`. This keeps a clean separation of concerns: my React components only handle the UI and don’t have to worry about `axios`, endpoints, or error handling. They just call straightforward functions from the context, which makes the codebase a lot cleaner and much easier to maintain.

## API Endpoint Documentation

Here are the details for the backend API endpoints.

#### `GET /api/products`

-   **Description:** Fetches all available products.
-   **Success Response (200):**
    ```json
    [
      {
        "id": 1,
        "name": "Fjallraven - Foldsack No. 1 Backpack",
        "price": 10995,
        "description": "Your perfect pack for everyday use...",
        "image": "https://fakestoreapi.com/..."
      }
    ]
    ```

#### `GET /api/cart`

-   **Description:** Fetches all items in the cart and the calculated total.
-   **Success Response (200):**
    ```json
    {
      "items": [
        {
          "id": 1,
          "quantity": 2,
          "productId": 1,
          "name": "Fjallraven - Foldsack No. 1 Backpack",
          "price": 10995
        }
      ],
      "total": 21990
    }
    ```

#### `POST /api/cart`

-   **Description:** Adds an item to the cart. If the item already exists, its quantity is updated.
-   **Request Body:**
    ```json
    {
      "productId": 1,
      "quantity": 1
    }
    ```
-   **Success Response (200 or 201):**
    ```json
    {
      "message": "Item added to cart",
      "id": 2
    }
    ```

#### `DELETE /api/cart/:id`

-   **Description:** Removes a single item from the cart by its cart item ID.
-   **Success Response (200):**
    ```json
    {
      "message": "Item removed from cart"
    }
    ```

#### `PATCH /api/cart/update/:id`

-   **Description:** Is used to update the quantity of an item present in the cart.
-   **Success Response (200):**
    ```json
    {
      "message": "Cart item updated successfully."
    }
    ```

#### `POST /api/checkout`

-   **Description:** Processes a mock checkout. This clears the cart and returns a final receipt.
-   **Request Body (Optional):**
    ```json
    {
      "name": "Test User",
      "email": "test@example.com"
    }
    ```
-   **Success Response (200):**
    ```json
    {
      "message": "Checkout successful",
      "receipt": {
        "total": 21990,
        "timestamp": "2025-11-07T12:30:00.000Z"
      }
    }
    ```

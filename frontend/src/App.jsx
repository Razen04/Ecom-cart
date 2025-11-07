import React from "react";
import Header from "./components/Header";
import { ProductList } from "./components/ProductList";
import { useCart } from "./context/CartContext";
import { ReceiptModal } from "./components/ReceiptModal";
import Cart from "./components/Cart";
import { useState } from "react";

const App = () => {
  const { loading, error, isCartOpen, isReceiptOpen } = useCart();

  const [details, setDetails] = useState({ name: "", email: "", address: "" }); // To hold the details of the customer

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {loading && <p className="text-center py-4">Loading application...</p>}
        {error && <p className="text-center py-4 text-red-400">{error}</p>}

        {!loading && !error && <ProductList />}
      </main>

      {isReceiptOpen && <ReceiptModal details={details} />}

      {isCartOpen && <Cart details={details} setDetails={setDetails} />}
    </div>
  );
};

export default App;

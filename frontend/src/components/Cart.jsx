import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";
import { useState } from "react";

const Cart = ({ details, setDetails }) => {
  const { cartItems, cartTotal, closeCart, checkout } = useCart();

  const [showDetailsForm, setShowDetailsForm] = useState(false); // To enable the form

  // This variable stores if the form is valid or not and thus allow for the checkout button to be enabled
  const isFormValid =
    details?.name.trim() !== "" &&
    details?.email.trim() !== "" &&
    details?.address.trim() !== "";

  // This function handles the changes made in the form
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-2/3 max-w-4xl p-8 relative">
        {/* Header */}

        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl md:text-3xl font-semibold tracking-tight">
            Your Cart
          </span>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="divide-y divide-gray-200 max-h-[55vh] overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center py-20 text-lg">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {/* Total + Personal Details + Checkout */}
        {cartItems.length > 0 && (
          <div className="mt-8 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-xl font-medium mb-2">
              <span>Total</span>
              <span>₹{(cartTotal / 100).toFixed(2)}</span>
            </div>

            {/* Add Personal Details */}
            {!showDetailsForm ? (
              <button
                onClick={() => setShowDetailsForm(true)}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Add Personal Details
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-2xl space-y-3 border border-gray-200">
                <input
                  type="text"
                  name="name"
                  placeholder="Your full Name"
                  value={details.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-800"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email Address"
                  value={details.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-800"
                />
                <textarea
                  name="address"
                  placeholder="Your shipping Address"
                  value={details.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-800 resize-none"
                />
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={checkout}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-colors cursor-pointer ${
                isFormValid
                  ? "bg-cyan-600 text-white hover:bg-cyan-500"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

import React from "react";
import { useCart } from "../context/CartContext";
import formatPrice from "../helper";
import { TicketCheck } from "lucide-react";

const ReceiptModal = ({ details }) => {
  const { isReceiptOpen, receipt, closeReceipt } = useCart();

  // If the modal isn't open we will render nothing
  if (!isReceiptOpen || !receipt) {
    return null;
  }

  // Formatting the timestamp for display
  const formattedTimestamp = new Date(receipt.timestamp).toLocaleString(
    "en-IN",
    {
      dateStyle: "long",
      timeStyle: "short",
    },
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={closeReceipt}
    >
      <div
        className="relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-cyan-500 rounded-full mb-5 shadow-md">
          <TicketCheck size={28} className="text-white" />
        </div>
  
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-1">
          Checkout Successful
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Thank you for your purchase.
        </p>
  
        {/* Receipt Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 border border-gray-200">
          <div className="flex justify-between text-gray-600">
            <span>Total Paid</span>
            <span className="text-cyan-600 font-semibold">
              {formatPrice(receipt.total)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Date</span>
            <span className="text-gray-800">{formattedTimestamp}</span>
          </div>
  
          {/* Divider */}
          <div className="border-t border-gray-200 my-3" />
  
          {/* Personal Details */}
          <div className="space-y-1 text-sm">
            <p className="text-gray-400 uppercase tracking-wide text-xs font-medium">
              Customer Details
            </p>
            <div className="text-gray-700">
              <p><span className="font-medium">Name:</span> {details?.name || "—"}</p>
              <p><span className="font-medium">Email:</span> {details?.email || "—"}</p>
              <p><span className="font-medium">Address:</span> {details?.address || "—"}</p>
            </div>
          </div>
        </div>
  
        {/* Close Button */}
        <button
          onClick={closeReceipt}
          className="w-full py-2.5 bg-cyan-600 rounded-xl text-white font-medium hover:bg-cyan-500 transition-all duration-200 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ReceiptModal;
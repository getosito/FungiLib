import React from "react";
import Navbar from "../components/Navbar"; // Adjust path if needed

export default function AddSpecimen() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Keeps your top menu */}
      
      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🍄 Add New Specimen</h1>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Common Name</label>
              <input type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Fly Agaric" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Scientific Name</label>
              <input type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Amanita muscaria" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location Found</label>
              <input type="text" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Tamsui, Taiwan" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea className="w-full border border-gray-300 p-3 rounded-lg h-32 focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition">
                Save to Database
              </button>
              <button type="button" onClick={() => window.location.href='/'} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
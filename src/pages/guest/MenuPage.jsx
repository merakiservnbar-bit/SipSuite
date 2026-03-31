import { useState } from "react";

const categories = [
  {
    name: "Signature",
    items: [
      {
        name: "Espresso Martini",
        desc: "Vodka, espresso, coffee liqueur",
        tag: "Most Popular",
        image: "https://images.unsplash.com/photo-1582576163090-09d1b9c1e6f0"
      },
      {
        name: "Spicy Margarita",
        desc: "Tequila, lime, chili",
        tag: "🔥 Signature",
        image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
      }
    ]
  },
  {
    name: "Cocktails",
    items: [
      {
        name: "Old Fashioned",
        desc: "Bourbon, bitters, sugar",
        image: "https://images.unsplash.com/photo-1582576163090-09d1b9c1e6f0"
      }
    ]
  },
  {
    name: "Wine",
    items: [
      {
        name: "Chardonnay",
        desc: "White wine",
      }
    ]
  }
];

export default function MenuPage() {
  const [selectedDrink, setSelectedDrink] = useState(null);

  return (
    <div className="bg-neutral-50 min-h-screen text-gray-900">

      {/* 🔷 HERO HEADER */}
      <div className="relative h-64 flex items-center justify-center text-center">
        <img
          src="https://images.unsplash.com/photo-1514361892635-e9550a0c1c41"
          alt="header"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative text-white px-4">
          <h1 className="text-3xl font-serif">Sarah & Mike’s Wedding</h1>
          <p className="mt-2 text-sm">Scan. Sip. Enjoy 🍸</p>
        </div>
      </div>

      {/* 🔷 CATEGORY TABS */}
      <div className="sticky top-0 bg-white z-10 shadow-sm overflow-x-auto">
        <div className="flex gap-4 px-4 py-3 text-sm whitespace-nowrap">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href={`#${cat.name}`}
              className="font-medium text-gray-700 hover:text-black"
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* 🔷 MENU SECTIONS */}
      <div className="px-4 py-6 space-y-8">
        {categories.map((cat) => (
          <div key={cat.name} id={cat.name}>
            <h2 className="text-xl font-semibold mb-4">{cat.name}</h2>

            <div className="grid gap-4">
              {cat.items.map((drink, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedDrink(drink)}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
                >
                  {drink.image && (
                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="w-full h-40 object-cover"
                    />
                  )}

                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{drink.name}</h3>
                      {drink.tag && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {drink.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {drink.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🔷 MODAL */}
      {selectedDrink && (
        <div className="fixed inset-0 bg-black/50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6">
            <h2 className="text-xl font-semibold">{selectedDrink.name}</h2>
            <p className="text-gray-600 mt-2">{selectedDrink.desc}</p>

            <button
              onClick={() => setSelectedDrink(null)}
              className="mt-6 w-full bg-black text-white py-3 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import React, {useState} from 'react';
import logo from "../assets/GreenLogo.png";
import redheart from "../assets/MyClosetImages/redheart.png";
import plant from "../assets/MyClosetImages/plant.png";

//shoe is a placeholder import we will change this with the images users upload
import shoe from "../assets/MyClosetImages/airforce1.png"; 

export default function MyCloset() {

  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showCreateOutfitForm, setShowCreateOutfitForm] = useState(false);

  //fields for creating an item
  const [itemName, setItemName] = useState('');
  const [itemColor, setItemColor] = useState('');
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [itemCategory, setItemCategory] = useState('');
  const [itemSize, setItemSize] = useState('');

  const resetOutfitForm = () => {
    setOutfitName('');
    setSelectedTop(null);
    setSelectedBottom(null);
    setSelectedShoes(null);
    setShowCreateOutfitForm(false);
  };

  const resetItemForm = () => 
  {
    setItemName('');
    setItemColor('');
    setItemCategory('');
    setItemSize('');
    setItemImage(null);
  }

  type ClothingItem = {
    id: number;
    name: string;
    color: string;
    image: string;
    isFavorite: boolean;
    category: string;
    size: string;
  };

  //fields for creating an outfit
  const [selectedTop, setSelectedTop] = useState<ClothingItem | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<ClothingItem | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<ClothingItem | null>(null);
  const [outfitName, setOutfitName] = useState('');

  //grid to hold placeholder items
  const items = [
    { id: 1, name: "White Shirt", color: "White", image: shoe, isFavorite: false, category: "Tops", size: "M"},
    { id: 2, name: "Black Hoodie", color: "Black", image: shoe, isFavorite: true, category: "Tops", size: "M"},
    { id: 3, name: "Blue Jeans", color: "Blue", image: shoe, isFavorite: false, category: "Bottoms", size: "32x30"},
    { id: 4, name: "Joggers", color: "Gray", image: shoe, isFavorite: false, category: "Bottoms", size: "M"},
    { id: 5, name: "AirForce1", color: "White", image: shoe, isFavorite: false, category: "Shoes", size: "11"},
  ];

  const tops = items.filter(item => item.category === "Tops");
  const bottoms = items.filter(item => item.category === "Bottoms");
  const shoes = items.filter(item => item.category === "Shoes");
  

  return (
    //div on whole screen
    <div className="relative flex h-screen bg-themeLightBeige p-2">
      {/* Sidebar surrounding buttons on the left */}
      <div className="fixed left-0 top-0 h-full w-64 flex flex-col items-center p-4 bg-themeLightBeige">
        <img
          src={logo}
          alt="DressMeUp Logo"
          className="w-32 h-32 rounded-lg mb-4"
        />

        {/* Menu Buttons on the left side of the screen*/}
        <div className="flex flex-col w-5/6 h-auto gap-4 justify-center items-center bg-themeGray rounded-lg py-2">
          <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">
            Saved Fits
          </button>
          <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">
            Shirts
          </button>
          <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">
            Long Sleeves
          </button>
          <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">
            Pants
          </button>
          <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">
            Shorts
          </button>
          <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg">
            Shoes
          </button>
          <button className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg flex items-center justify-center gap-2">
            Favorites <img src={redheart} alt="heart" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center">

        {/* Search Bar*/}
        <div className="fixed flex flex-col w-full max-w-2xl mt-2">
          <input
            type="text"
            placeholder="Search ..."
            className="px-4 py-2 w-full bg-themeGray focus:outline-none text-black placeholder-black rounded-full"
          />
        </div>

        {/* The grid of closet items */}
        <div className="mt-20 w-full flex justify-center">
          <div className="grid grid-cols-3 gap-8">
            {items.map((item) => (
              <div className = "relative bg-themeLightBeige">

                {/* Top “plant” decoration not aligned properly will fix later*/}
                <img
                  src={plant}
                  alt="plant"
                  className="w-full h-10 object-cover rounded-t-lg"
                />
                
              <div
                key={item.id}
                className="relative w-72 h-60 bg-themeGray rounded-lg shadow-md flex flex-col items-center justify-center border border-black gap-2"
              >


                {/* Shoe image this is a placeholder*/}
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded shadow-lg"
                />

                {/* Name & color info for each item*/}
                <div className="flex flex-col rounded-lg bg-themeLightBeige py-2">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-lg">{item.name}</p>
                    <button>
                      <img
                        src={redheart}
                        alt="Favorite"
                        className="w-6 h-6"
                        style={{
                          filter: item.isFavorite ? "none" : "grayscale(100%)",
                        }}
                      />
                    </button>
                  </div>

                  <div className="flex flex-row justify-between items-center gap-20">
                    <p className="text-lg">Color: {item.color}</p>
                    <button>
                      {/* Edit (pencil) icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536M7.5 16.5l7.606-7.606a2 2 0 012.828 0l.464.464a2 2 0 010 2.828L10.5 19.5H7.5v-3z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-row justify-between items-center">
                    <p className="text-lg">Size: {item.size}</p>
              
                  </div>

                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create outfit and add item buttons */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <button className="text-black text-lg bg-themeGreen px-6 py-3 rounded-lg"
        onClick={() => setShowAddItemForm(true)}
        >
          Add Item
        </button>
        <button className="text-black text-lg bg-themeGreen px-6 py-3 rounded-lg"
        onClick={() => setShowCreateOutfitForm(true)}
        >
          Create Outfit
        </button>
      </div>
      
        {showAddItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-themeDarkBeige p-6 rounded-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => 
              {
                resetItemForm();
                setShowAddItemForm(false);
              }}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();

                  const formData = new FormData();
                  formData.append("name", itemName);
                  formData.append("color", itemColor);
                  if(itemImage)
                  {
                    formData.append("image", itemImage);
                  }

                  try {
                    const response = await fetch('/api/addClothingItem', {
                      method: 'POST',
                      body: formData,
                    });

                    if (response.ok) {
                      console.log("Item added successfully");
                      setShowAddItemForm(false);
                      setItemName('');
                      setItemColor('');
                      setItemImage(null);
                    } else {
                      console.error("Error adding item");
                    }
                  } catch (error) {
                    console.error("API call failed:", error);
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="bg-themeGray border border-black p-2 rounded text-black placeholder-black"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={itemColor}
                  onChange={(e) => setItemColor(e.target.value)}
                  className="bg-themeGray border border-black p-2 rounded text-black placeholder-black"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setItemImage(e.target.files?.[0] || null)}
                  className="file:bg-themeGreen file:text-white file:font-medium file:border-none file:px-4 file:py-2 file:rounded file:cursor-pointer bg-themeGray border border-black p-2 rounded"
                />
                <button type="submit" className="bg-themeGreen text-white p-2 rounded">
                  Save
                </button>
              </form>

          </div>
        </div>
      )}

        {showCreateOutfitForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-themeDarkBeige p-6 rounded-lg w-96 relative">
              <button
                className="absolute top-2 right-2 text-xl font-bold"
                onClick={() => 
                {
                  resetOutfitForm();
                  setShowCreateOutfitForm(false);
                }}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Create A New Outfit</h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();

                  const outfit = {
                    top: selectedTop,
                    bottom: selectedBottom,
                    shoes: selectedShoes,
                  };

                  console.log("New outfit created:", outfit);

                  // TODO: Send outfit to backend with fetch('/api/createOutfit', ...)
                  // Example: send just item IDs or full objects depending on backend
                }}
              >
                <label className="text-black font-medium">Select a Top</label>
                <select
                  onChange={(e) =>
                    setSelectedTop(tops.find(item => item.id === parseInt(e.target.value)) || null)

                  }
                  className="bg-themeGray border border-black p-2 rounded text-black"
                >
                  <option value="">-- Select Top --</option>
                  {tops.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <label className="text-black font-medium">Select a Bottom</label>
                <select
                  onChange={(e) =>
                    setSelectedBottom(bottoms.find(item => item.id === parseInt(e.target.value)) || null)
                  }
                  className="bg-themeGray border border-black p-2 rounded text-black"
                >
                  <option value="">-- Select Bottom --</option>
                  {bottoms.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <label className="text-black font-medium">Select Shoes</label>
                <select
                  onChange={(e) =>
                    setSelectedShoes(shoes.find(item => item.id === parseInt(e.target.value)) || null)
                  }
                  className="bg-themeGray border border-black p-2 rounded text-black"
                >
                  <option value="">-- Select Shoes --</option>
                  {shoes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <label className="text-black font-medium">Give Your Outfit A Name!</label>
                <input
                  type="text"
                  placeholder="Outfit Name"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  className="bg-themeGray border border-black p-2 rounded text-black placeholder-black"
                />

                <button type="submit" className="bg-themeGreen text-white p-2 rounded mt-4">
                  Save Outfit
                </button>
              </form>

            </div>
          </div>
        )}

    </div>
  );
}

/*
colors:{
        themeGreen: '#B6C7AA',
        themeGray: '#A0937D',
        themeDarkBeige: '#E7D4B5',
        themeLightBeige: '#F6E6CB'
      }
*/
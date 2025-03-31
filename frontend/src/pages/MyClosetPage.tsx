import {useState} from 'react';
import {useEffect} from 'react';
import logo from "../assets/GreenLogo.png";
import redheart from "../assets/MyClosetImages/redheart.png";
import plant from "../assets/shrub.png";
import { toast } from 'react-toastify';
import { useRef, useCallback } from "react";


//shoe is a placeholder import we will change this with the images users upload
import shoe from "../assets/MyClosetImages/airforce1.png"; 

export default function MyCloset() {

  const resetItemForm = () => 
    {
      setItemName('');
      setItemColor('');
      setItemCategory('');
      setItemSize('');
      setItemImage(null);
    }
  
  const resetOutfitForm = () => 
    {
      setOutfitName('');
      setSelectedTop(null);
      setSelectedBottom(null);
      setSelectedShoes(null);
      setShowCreateOutfitForm(false);
    };
  
  type ClothingItem = 
  {
    id: string;
    name: string;
    color: string;
    image: string;
    isFavorite: boolean;
    category: string;
    size: string;
  };

  const [loading, setLoading] = useState(true); // ✅ for loading spinner

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showCreateOutfitForm, setShowCreateOutfitForm] = useState(false);

  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [triggerReload, setTriggerReload] = useState(false);

  //fields for creating an item
  const [itemName, setItemName] = useState('');
  const [itemColor, setItemColor] = useState('');
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [itemCategory, setItemCategory] = useState('');
  const [itemSize, setItemSize] = useState('');

  //fields for creating an outfit
  const [selectedTop, setSelectedTop] = useState<ClothingItem | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<ClothingItem | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<ClothingItem | null>(null);
  const [outfitName, setOutfitName] = useState('');
  const [weatherCategory, setWeatherCategory] = useState('');

  const [showOutfits, setShowOutfits] = useState(false);
  const [outfits, setOutfits] = useState<any[]>([]);

  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

  const toggleFavorite = async (itemId: string) => {
    // Get the current item
    const original = clothingItems.find((item) => item.id === itemId);
    if (!original) return;
  
    // 1. Optimistically update the UI
    setClothingItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  
    // 2. Send request to server
    try {
      const res = await fetch("http://localhost:5001/api/toggleFavorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: itemId }),
      });
  
      if (!res.ok) {
        throw new Error("Failed server toggle");
      }
    } catch (err) {
      toast.error("Failed to update favorite on server");
  
      // 3. Rollback if it failed
      setClothingItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isFavorite: original.isFavorite } : item
        )
      );
    }
  };  

  const getImageUrlFromItem = (item: any) => {
    if (!item?.file?.data || !item?.fileType) return null;
  
    const rawData = item.file.data.data || item.file.data; // defensive for nested buffers
    const uint8Array = new Uint8Array(rawData);
    const blob = new Blob([uint8Array], { type: item.fileType });
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    let ignore = false;
  
    const fetchClothingItems = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.warn("No userId found in localStorage");
        return;
      }
  
      try {
        const favoriteParam = favoriteOnly ? `&favorite=true` : '';
        const categoryParam = activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : '';
        const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
  
        const response = await fetch(
          `http://localhost:5001/api/getClothingItems?userId=${userId}&page=${page}&limit=9${categoryParam}${searchParam}${favoriteParam}`
        );
  
        const data = await response.json();
  
        const itemsWithImages = data.results.map((item: any) => {
          const blob = new Blob([new Uint8Array(item.file.data)], {
            type: item.fileType,
          });
          const objectUrl = URL.createObjectURL(blob);
          return {
            id: item._id,
            name: item.Name,
            color: item.Color,
            size: item.Size,
            category: item.Category,
            isFavorite: item.isFavorite || false,
            image: objectUrl,
          };
        });
  
        if (!ignore) {
          if (itemsWithImages.length === 0) setHasMore(false);
          setClothingItems((prev) => [...prev, ...itemsWithImages]);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClothingItems();
  
    return () => {
      ignore = true;
    };
  }, [page, activeCategory, searchTerm, favoriteOnly]);  
  
  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
  
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
  
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  
  const tops = clothingItems.filter(
    item => item.category === 'Shirts' || item.category === 'LongSleeves'
  );
  
  const bottoms = clothingItems.filter(
    item => item.category === 'Pants' || item.category === 'Shorts'
  );

  const shoes = clothingItems.filter(item => item.category === "Shoes");

  const handleDeleteItem = async (itemId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch("http://localhost:5001/api/deleteClothingItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id: itemId }),
      });
  
      if (response.ok) {
        toast.success("Item deleted!");
        // Remove from state
        setClothingItems((prev) => prev.filter(item => item.id !== itemId));
      } else {
        toast.error("Could not delete item");
      }
    } catch (err) {
      toast.error("Error deleting item");
    }
  };

const handleDeleteOutfit = async (id: string) => {
  const confirm = window.confirm("Are you sure you want to delete this outfit?");
  if (!confirm) return;

  try {
    const res = await fetch("http://localhost:5001/api/deleteOutfit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("Outfit deleted!");
      setOutfits((prev) => prev.filter((fit) => fit._id !== id));
    } else {
      toast.error(result.error || "Delete failed!");
    }
  } catch (err) {
    toast.error("Server error deleting outfit");
    console.error(err);
  }
};
  
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
          <button
            className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg"
            onClick={async () => {
              setShowOutfits(true);
              try {
                const response = await fetch("http://localhost:5001/api/getOutfits", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                });
                if (response.ok) {
                  const data = await response.json();
                  setOutfits(data);
                } else {
                  toast.error("Failed to fetch outfits");
                }
              } catch (err) {
                console.error("Outfit fetch error:", err);
              }
            }}
          >
            Saved Fits
          </button>
          <button
            className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg"
            onClick={() => {
              setActiveCategory("Shirts");
              setClothingItems([]);
              setPage(1);
              setHasMore(true);
            }}
          >
            Shirts
          </button>
          <button
            className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg"
            onClick={() => {
              setActiveCategory("Long Sleeves");
              setClothingItems([]);
              setPage(1);
              setHasMore(true);
            }}
          >
            Long Sleeves
          </button>
          <button
            className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg"
            onClick={() => {
              setActiveCategory("Pants");
              setClothingItems([]);
              setPage(1);
              setHasMore(true);
            }}
          >
            Pants
          </button>
          <button
            className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg"
            onClick={() => {
              setActiveCategory("Shorts");
              setClothingItems([]);
              setPage(1);
              setHasMore(true);
            }}
          >
            Shorts
          </button>
          <button
            className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg"
            onClick={() => {
              setActiveCategory("Shoes");
              setClothingItems([]);
              setPage(1);
              setHasMore(true);
            }}
          >
            Shoes
          </button>
          <button
            className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg flex items-center justify-center gap-2"
            onClick={() => {
              setFavoriteOnly(true);        // 🔒 Lock to favorites
              setActiveCategory('');        // Clear category filter if needed
              setSearchTerm('');            // Optional: clear search
              setClothingItems([]);         // Reset list
              setPage(1);                   // Restart pagination
              setHasMore(true);             // Allow loading more
            }}
          >
            Favorites <img src={redheart} alt="heart" className="w-6 h-6" />
          </button>
          <button
            className="text-white text-lg bg-themeGreen w-5/6 py-2 rounded-lg"
            onClick={() => {
              setFavoriteOnly(false);      // 👈 Reset
              setActiveCategory('');
              setSearchTerm('');
              setClothingItems([]);
              setPage(1);
              setHasMore(true);
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-10 pb-32">

        {/* Search Bar*/}
        <div className="sticky top-0 z-10 bg-themeLightBeige py-4">
          <input
            type="text"
            placeholder="Search ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setClothingItems([]); // reset results
              setPage(1);            // reset pagination
              setHasMore(true);      // allow more fetches
            }}
            className="w-full max-w-xl mx-auto px-4 py-2 bg-themeGray rounded-full text-black placeholder-black"
        />
        </div>
        
        {/* The grid of closet items OR saved outfits */}
        <div className="pt-36 w-full flex justify-center">
          {loading ? (
            <p className="text-center text-lg mt-10">Loading closet...</p>
          ) : showOutfits ? (
            <div className="flex flex-col items-center w-full">
              <div className="grid grid-cols-2 gap-6">
                {outfits.map((fit) => (
                  <div key={fit._id} className="relative bg-themeGray p-4 rounded-lg border border-black w-80">
                    <h3 className="text-lg font-bold mb-2">{fit.Name}</h3>
                    <p className="text-sm mb-2">Weather: {fit.WeatherCategory}</p>

                    {/* 🏷️ Names of items under weather */}
                    <div className="text-sm mb-2">
                      {fit.Top ? <p>Top: {fit.Top.Name}</p> : <p>Top: (none)</p>}
                      {fit.Bottom ? <p>Bottom: {fit.Bottom.Name}</p> : <p>Bottom: (none)</p>}
                      {fit.Shoes ? <p>Shoes: {fit.Shoes.Name}</p> : <p>Shoes: (none)</p>}
                    </div>

                    <div className="flex gap-2 justify-center">
                      {[fit.Top, fit.Bottom, fit.Shoes].map((piece, idx) => {
                        const label = ['Top', 'Bottom', 'Shoes'][idx];

                        if (!piece) {
                          return (
                            <div key={label} className="w-20 h-20 bg-white flex flex-col items-center justify-center border border-black">
                              <p className="text-xs">Missing</p>
                              <p className="text-[10px] mt-1">{label}</p>
                            </div>
                          );
                        }

                        const imageUrl = getImageUrlFromItem(piece);

                        return (
                          <div
                            key={label}
                            className={`w-24 h-28 flex flex-col items-center justify-center overflow-hidden ${
                              imageUrl ? 'bg-transparent' : 'bg-white'
                            }`}
                          >
                            {imageUrl ? (
                              <>
                                <img src={imageUrl} alt={piece.Name} className="h-full object-contain" />
                                <p className="text-[10px] mt-1 text-center truncate max-w-[4.5rem]">
                                  {piece.Name}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-xs">Missing</p>
                                <p className="text-[10px] mt-1">{label}</p>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleDeleteOutfit(fit._id)}
                      className="absolute top-2 right-2 text-xl hover:text-red-600"
                      title="Delete Outfit"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* 👇 Move "Back to Closet" here */}
              <div className="mt-10 w-full flex justify-center">
                <button
                  onClick={() => {
                    setShowOutfits(false);
                    setClothingItems([]);
                    setPage(1);
                    setHasMore(true);
                    setTriggerReload((prev) => !prev); // ✅ force re-run useEffect
                  }}
                  className="text-red-600 text-lg font-bold underline hover:text-red-800"
                >
                  ⬅ Back to Closet
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              {clothingItems.map((item, idx) => (
                <div
                  key={item.id}
                  ref={idx === clothingItems.length - 1 ? lastItemRef : null}
                  className="relative bg-themeLightBeige"
                >
                  {/* Plant decoration */}
                  <img src={plant} alt="plant" className="absolute -top-24 w-full" />

                  <div className="relative w-72 mt-6 bg-themeGray rounded-lg flex flex-col items-center border border-black gap-2 pb-4 overflow-hidden shadow-md">
                    {/* Item image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-40 w-full object-contain p-2 rounded"
                      onError={(e) => (e.currentTarget.src = shoe)}
                    />

                    {/* Info and buttons */}
                    <div className="flex flex-col rounded-lg bg-themeLightBeige py-2 w-64 px-4">
                      <div className="flex flex-row justify-between items-center mb-1">
                        <p className="text-lg font-semibold">{item.name}</p>
                        <button onClick={() => toggleFavorite(item.id)}>
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

                      <div className="flex flex-row justify-between items-center mb-1">
                        <p className="text-sm">Color: {item.color}</p>
                        <button
                          title="Edit Item"
                          className="text-lg px-1 text-black hover:text-themeGreen transition-transform duration-200"
                          onClick={() => {
                            setItemName(item.name);
                            setItemColor(item.color);
                            setItemSize(item.size);
                            setItemCategory(item.category);
                            setItemImage(null);
                            setEditingItem(item);
                          }}
                        >
                          ✏️
                        </button>
                      </div>

                      <div className="flex flex-row justify-between items-center">
                        <p className="text-sm">Size: {item.size}</p>
                        <button onClick={() => handleDeleteItem(item.id)}>🗑️</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          )}
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
      
      {(showAddItemForm || editingItem) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-themeDarkBeige p-6 rounded-lg w-96 relative">
              <button
                className="absolute top-2 right-2 text-xl font-bold"
                onClick={() => {
                  resetItemForm();
                  setShowAddItemForm(false);
                  setEditingItem(null);
                }}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData();
                  const userId = localStorage.getItem("userId");
                  formData.append("userId", userId || "");
                  formData.append("name", itemName);
                  formData.append("color", itemColor);
                  formData.append("category", itemCategory);
                  formData.append("size", itemSize);
                  if (itemImage) formData.append("image", itemImage);

                  // if editing, include _id and hit update endpoint
                  if (editingItem) {
                    formData.append("_id", editingItem.id);
                    try {
                      const response = await fetch("http://localhost:5001/api/updateClothingItem", {
                        method: "POST",
                        body: formData,
                      });
                      if (response.ok) {
                        toast.success("Item updated!");
                        resetItemForm();
                        setEditingItem(null);
                        setClothingItems([]); // re-fetch
                        setPage(1); // reset to start
                      } else {
                        toast.error("Update failed!");
                      }
                    } catch (error) {
                      console.error("Update error:", error);
                    }
                  } else {
                    // else, normal add flow
                    try {
                      const response = await fetch("http://localhost:5001/api/addClothingItem", {
                        method: "POST",
                        body: formData,
                      });
                      if (response.ok) {
                        toast.success("Item added!");
                        resetItemForm();
                        setShowAddItemForm(false);
                        setClothingItems([]); // re-fetch
                        setPage(1); // reset
                      } else {
                        toast.error("Add failed!");
                      }
                    } catch (error) {
                      console.error("Add error:", error);
                    }
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
                  type="text"
                  placeholder="Item Size"
                  value={itemSize}
                  onChange={(e) => setItemSize(e.target.value)}
                  className="bg-themeGray border border-black p-2 rounded text-black placeholder-black"
                />
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="bg-themeGray border border-black p-2 rounded text-black"
                >
                  <option value="">-- Select Category --</option>
                  <option value="Shirts">Shirts</option>
                  <option value="LongSleeves">LongSleeves</option>
                  <option value="Pants">Pants</option>
                  <option value="Shorts">Shorts</option>
                  <option value="Shoes">Shoes</option>
                </select>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setItemImage(e.target.files?.[0] || null)}
                  className="file:bg-themeGreen file:text-white file:font-medium file:border-none file:px-4 file:py-2 file:rounded file:cursor-pointer bg-themeGray border border-black p-2 rounded"
                />
                <button type="submit" className="bg-themeGreen text-white p-2 rounded">
                  {editingItem ? "Update Item" : "Save"}
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
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (!selectedTop || !selectedBottom || !selectedShoes || !outfitName || !weatherCategory) {
                    alert("Please complete all fields including weather!");
                    return;
                  }

                  const userId = localStorage.getItem("userId");

                  const outfit = {
                    userId,
                    name: outfitName,
                    top: selectedTop?.id,
                    bottom: selectedBottom?.id,
                    shoes: selectedShoes?.id,
                    weatherCategory, // ✅ new field
                  };

                  try {
                    const response = await fetch("http://localhost:5001/api/addOutfit", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(outfit),
                    });

                    if (response.ok) {
                      toast.success("Outfit saved!");
                      resetOutfitForm();
                      setShowCreateOutfitForm(false);
                    } else {
                      toast.error("Outfit Not Saved!");
                    }
                  } catch (err) {
                    console.error("API error:", err);
                  }
                }}
              >
                <label className="text-black font-medium">Select a Top</label>
                <select
                  onChange={(e) =>
                    setSelectedTop(tops.find((item) => item.id === e.target.value) || null)
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
                    setSelectedBottom(bottoms.find((item) => item.id === e.target.value) || null)
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
                    setSelectedShoes(shoes.find((item) => item.id === e.target.value) || null)
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

                {/* ✅ NEW FIELD: Weather Category */}
                <label className="text-black font-medium">Weather Category</label>
                <select
                  value={weatherCategory}
                  onChange={(e) => setWeatherCategory(e.target.value)}
                  className="bg-themeGray border border-black p-2 rounded text-black"
                >
                  <option value="">-- Select Weather --</option>
                  <option value="Hot">Hot</option>
                  <option value="Cold">Cold</option>
                  <option value="Normal">Normal</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Sunny">Sunny</option>
                  <option value="Cloudy">Cloudy</option>
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
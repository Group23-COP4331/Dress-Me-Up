import logo from "../assets/GreenLogo.png";
import redheart from "../assets/MyClosetImages/redheart.png";
// Example placeholder imports – adjust these paths to match actual files:
import plant from "../assets/MyClosetImages/plant.png";
import shoe from "../assets/MyClosetImages/airforce1.png"; 

export default function MyCloset() {
  // Example “items” array.  Adjust to match your data.
  const items = [
    { id: 1, name: "AirForce1", color: "Red", image: shoe, isFavorite: false },
    { id: 2, name: "AirForce1", color: "Red", image: shoe, isFavorite: true },
    { id: 3, name: "AirForce1", color: "Red", image: shoe, isFavorite: false },
    { id: 4, name: "AirForce1", color: "Red", image: shoe, isFavorite: false },
    { id: 5, name: "AirForce1", color: "Red", image: shoe, isFavorite: false },
  ];

  return (
    <div className="relative flex h-screen bg-themeLightBeige p-2">
      {/* Sidebar (Left) */}
      <div className="fixed left-0 top-0 h-full w-64 flex flex-col items-center p-4 bg-themeLightBeige">
        <img
          src={logo}
          alt="DressMeUp Logo"
          className="w-32 h-32 rounded-lg mb-4"
        />

        {/* Menu Buttons */}
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

                {/* Top “plant” decoration */}
                <img
                  src={plant}
                  alt="plant"
                  className="w-full h-10 object-cover rounded-t-lg"
                />
                
              <div
                key={item.id}
                className="relative w-66 h-60 bg-themeGray rounded-lg shadow-md flex flex-col items-center justify-center border border-black gap-2"
              >


                {/* Shoe image, slightly overlapping the plant */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded shadow-lg"
                />

                {/* Name & color info */}
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
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar Buttons */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <button className="text-black text-lg bg-themeGreen px-6 py-3 rounded-lg">
          Add Item
        </button>
        <button className="text-black text-lg bg-themeGreen px-6 py-3 rounded-lg">
          Create Outfit
        </button>
      </div>
    </div>
  );
}

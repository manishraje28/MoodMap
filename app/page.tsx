/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useEffect, useState } from "react";
import PlaceCard from "./components/PlaceCard";

const Home = () => {


 const moodToTags: Record<string, string[]> = {
  work: ["cafe"],
  date: ["restaurant"],
  quick: ["fast_food"],
  budget: ["restaurant"],
};


  type Location = {
    lat: number;
    lng: number;
  };
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState<Location | null>(null);
  const [mood, setMood] = useState<string>("");
  const [sortBy, setSortBy] = useState("distance");

  const [error, setError] = useState("");
  const [places, setPlaces] = useState<any[]>([]);


  const fetchPlaces = async () => {
    console.log("Find Places clicked");
console.log("fetchPlaces called");
  console.log("Location:", location);
  console.log("Mood:", mood);
    if (!location || !mood) return;

    setLoading(true);

    const tags = moodToTags[mood];

    const query = `
[out:json][timeout:20];
(
  node["amenity"="${tags[0]}"](around:2000,${location.lat},${location.lng});
);
out tags center 20;
`;


    try {
      const res = await fetch(
        "https://overpass.kumi.systems/api/interpreter",
        {
          method: "POST",
          body: query,
        }
      );

      const text = await res.text();

      if (!res.ok) {
        console.error(text);
        return;
      }

      const data = JSON.parse(text);
console.log("Overpass raw elements:", data.elements);

      const placesWithDistance = data.elements.map((place: any) => ({
        ...place,
        distance: calculateDistance(
          location.lat,
          location.lng,
          place.lat,
          place.lon
        ),
      }));

      setPlaces(placesWithDistance);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
    
  };


  // useEffect(() => {
  //   if (mood && location) {
  //     fetchPlaces();
  //   }
  // }, [mood]);


  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setError("Location permission denied");
      }
    );
  }, []);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371; // Earth radius in KM
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in KM
  };
  // const sortedPlaces = [...places].sort((a, b) => {
  //   if (sortBy === "name") {
  //     return (a.tags?.name || "").localeCompare(b.tags?.name || "");
  //   }
  //   return a.distance - b.distance;
  // });


  return (
    <main style={{ padding: "20px" }}>
      <h1>PlaceSense</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {location ? (
        <p>
          📍 Location fetched: {location.lat}, {location.lng}
        </p>
      ) : (
        <p>Fetching your location...</p>
      )}

      <h2>Select your mood</h2>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={() => setMood("work")} disabled={!location}>
          ☕ Work
        </button>

        <button onClick={() => setMood("date")} disabled={!location}>
          💑 Date
        </button>

        <button onClick={() => setMood("quick")} disabled={!location}>
          🍔 Quick Bite
        </button>

        <button onClick={() => setMood("budget")} disabled={!location}>
          💸 Budget
        </button>
      </div>

      {mood && <p>Selected mood: {mood}</p>}

      <h2>Nearby Places</h2>

      {places.length === 0 && mood && <p>No places found</p>}

      <div style={{ marginTop: "15px" }}>
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            name={place.tags?.name || "Unnamed Place"}
            distance={place.distance}

          />
        ))}
        {/* <h3>Sort by</h3>
        <button onClick={() => setSortBy("distance")}>Nearest</button>
        <button onClick={() => setSortBy("name")}>Name</button> */}

      </div>

      <button
      
        onClick={fetchPlaces}
        
        disabled={!mood || loading}
      >
        {loading ? "Finding places..." : "Find Places"}
      </button>


    </main>
  )
}

export default Home
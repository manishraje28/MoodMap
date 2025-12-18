/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useEffect, useState } from "react";

const Home = () => {


  const moodToTags: Record<string, string[]> = {
    work: ["cafe", "library"],
    date: ["restaurant", "park"],
    quick: ["fast_food"],
    budget: ["food"],
  };

  type Location = {
    lat: number;
    lng: number;
  };

  const [location, setLocation] = useState<Location | null>(null);
  const [mood, setMood] = useState<string>("");

  const [error, setError] = useState("");
  const [places, setPlaces] = useState<any[]>([]);


  const fetchPlaces = async () => {
    if (!location || !mood) return;

    const tags = moodToTags[mood];

    const query = `
    [out:json];
    (
      ${tags
        .map(
          (tag) => `
        node["amenity"="${tag}"](around:2000,${location.lat},${location.lng});
      `
        )
        .join("")}
    );
    out;
  `;

    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await res.json();
      const placesWithDistance = data.elements.map((place: any) => ({
        ...place,
        distance: calculateDistance(
          location.lat,
          location.lng,
          place.lat,
          place.lon
        ),
      }));

      placesWithDistance.sort(
        (a: any, b: any) => a.distance - b.distance
      );

      setPlaces(placesWithDistance);

    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };
  useEffect(() => {
    if (mood && location) {
      fetchPlaces();
    }
  }, [mood]);


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

      <ul>
        {places.map((place) => (
          <li key={place.id} style={{ marginBottom: "10px" }}>
            <strong>{place.tags?.name || "Unnamed Place"}</strong>
            <br />
            📍 {place.distance.toFixed(2)} km away
          </li>
        ))}
      </ul>


    </main>
  )
}

export default Home
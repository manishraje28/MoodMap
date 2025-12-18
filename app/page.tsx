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
      console.log(data.elements);
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

    </main>
  )
}

export default Home
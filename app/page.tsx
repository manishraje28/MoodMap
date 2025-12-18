/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useEffect, useState } from "react";

const Home = () => {
  type Location = {
    lat: number;
    lng: number;
  };

  const [location, setLocation] = useState<Location | null>(null);

  const [error, setError] = useState("");

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
    </main>
  )
}

export default Home
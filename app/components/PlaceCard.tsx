type PlaceCardProps = {
  name: string;
  distance: number;
};

const PlaceCard = ({ name, distance }: PlaceCardProps) => {
  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "10px",
      }}
    >
      <h3 style={{ margin: 0 }}>{name}</h3>
      <p style={{ margin: "5px 0" }}>📍 {distance.toFixed(2)} km away</p>
    </div>
  );
};

export default PlaceCard;

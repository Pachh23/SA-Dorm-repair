import React, { useEffect, useState } from "react";
import { GetRoomsByFloorAndDorm } from "../../services/https";  // Import the function
import { RoomInterface } from "./../../interfaces/Room"; 

// Define the type for the room data
/*interface Room {
  RoomNumber: string;
  DormStatus: string;
  Available: boolean;
  Floor: number;
  Dorm: {
    dorm_name: string;
    Gender: {
      Gender: string;
    };
  };
}*/

/*const RoomDetail: React.FC<{ floorId: number; dormId: number }> = ({ floorId = 1, dormId = 1 }) => {
  const [rooms, setRooms] = useState<RoomInterface[]>([]); // Change to an array of Room
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await GetRoomsByFloorAndDorm(floorId, dormId); // Call GetRoomsByFloorAndDorm function
        if (response && !response.error) {
          const roomData = response.map((room: RoomInterface) => ({
            ...room,
            Floor: Number(room.Floor) // Ensure Floor is a number
          }));

          setRooms(roomData); // Store the room data
        } else {
          setError("Room not found");
        }
      } catch (error) {
        setError("Error fetching room data");
        console.error("Error fetching room data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [floorId, dormId]); // Add floorId and dormId as dependencies

  if (loading) {
    return <p>Loading...</p>; // Display loading message
  }

  if (error) {
    return <p>{error}</p>; // Display error message
  }

  return (
    <div>
      <h2>Room Details</h2>
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <div key={room.RoomNumber}>
            <p><strong>Room Number:</strong> {room.RoomNumber}</p>
            <p><strong>Status:</strong> {room.DormStatus}</p>
            <p><strong>Available:</strong> {room.Available ? 'Yes' : 'No'}</p>
            <p><strong>Floor:</strong> {room.Floor}</p>
            <p><strong>Dorm Name:</strong> {room.Dorm.dorm_name}</p>
            <p><strong>Gender:</strong> {room.Dorm.Gender.Gender}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>No rooms available.</p> // Message when no rooms are found
      )}
    </div>
  );
};


export default RoomDetail;*/

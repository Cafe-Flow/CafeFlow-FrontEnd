import React, { useState, useEffect } from 'react';
import './SeatView.css'; // You can define your own CSS for SeatView
import Stomp from 'stompjs';
import axios from 'axios'; // Import Axios for API calls
import SockJS from "sockjs-client";

// Import seat images for different sizes
import seatImage2 from './seat2.png';
import seatImage4 from './seat4.png';
import seatImage6 from './seat6.png';

function SeatView({ seats, cafeId }) {
    const [seatStatuses, setSeatStatuses] = useState({}); // State to manage seat statuses
    
    useEffect(() => {
        // Function to fetch initial seat statuses from API
        const fetchInitialSeatStatuses = async () => {
            try {
                const response = await axios.get(`/api/cafe/${cafeId}/seat`);
                const initialSeatStatuses = {};
                response.data.forEach(seat => {
                    initialSeatStatuses[seat.seatNumber] = seat.seatStatus;
                });
                setSeatStatuses(initialSeatStatuses);
            } catch (error) {
                console.error('Error fetching initial seat statuses:', error);
            }
        };

        fetchInitialSeatStatuses();

        // Connect to WebSocket server
        const socket = new SockJS("http://cafeflow.store:8080/ws");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            // Subscribe to the topic for seat updates
            stompClient.subscribe(`/topic/cafe/${cafeId}/seat`, (message) => {
                const seatUpdate = JSON.parse(message.body);
                // Update seatStatus in seatStatuses state
                setSeatStatuses(prevSeatStatuses => ({
                    ...prevSeatStatuses,
                    [seatUpdate.seatNumber]: seatUpdate.seatStatus
                }));
            });
        });

        return () => {
            // Disconnect WebSocket on component unmount
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [cafeId]);

    // Function to handle seat click
    const handleSeatClick = (seatNumber) => {
        // Toggle seat status between "AVAILABLE" and "OCCUPIED"
        const newStatus = seatStatuses[seatNumber] === "AVAILABLE" ? "OCCUPIED" : "AVAILABLE";

        // Send seat status update to the server
        const seatUpdate = {
            seatStatus: newStatus,
            seatNumber: seatNumber
        };

        // Create WebSocket connection
        const socket = new SockJS("http://cafeflow.store:8080/ws");
        const stompClient = Stomp.over(socket);
        
        stompClient.connect({}, () => {
            // Send the seat status update to the destination queue
            stompClient.send(`/app/cafe/${cafeId}/seat`, {}, JSON.stringify(seatUpdate));
        });
    };

    // Function to determine which image to use based on seat size
    const getSeatImage = (seatSize) => {
        switch (seatSize) {
            case 2:
                return seatImage2;
            case 4:
                return seatImage4;
            case 6:
                return seatImage6;
            default:
                return seatImage2; // Default to size 2 image if size is unknown
        }
    };

    return (
        <div id="background">
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div id="outerContainer">
                    <div id="container">
                        {seats.map(seat => (
                            <div
                                key={seat.id}
                                className="draggable"
                                style={{
                                    width: seat.seatAngle === "HORIZONTAL" ? 100 : seat.seatSize * 50,
                                    height: seat.seatAngle === "HORIZONTAL" ? seat.seatSize * 50 : 100,
                                    left: seat.seatCoordinates.x,
                                    top: seat.seatCoordinates.y,
                                    backgroundImage: `url(${getSeatImage(seat.seatSize)})`, // Set background image for seat
                                    backgroundSize: 'cover', // Adjust image size as needed
                                    backgroundColor: seatStatuses[seat.seatNumber] === "OCCUPIED" ? "#d3c2a0" : "#1abc9c" // Fallback color
                                }}
                                onClick={() => handleSeatClick(seat.seatNumber)} // Attach click event handler
                            >
                                <div>{seatStatuses[seat.seatNumber]}</div> {/* Display seat status */}
                                {seat.seatNumber}
                                <button className="plug-btn">
                                    {seat.seatHasPlug ? "🔌" : "Off"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeatView;

import fs from 'fs';

const bookings = [
  {
    "_id": "6a016d3e73b3579f30036e05",
    "userRef": {
      "_id": "6a016ca68d4c50f55ff04221",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "hotelRef": {
      "_id": "6a016ca68d4c50f55ff04224",
      "name": "Taj Lake Palace"
    },
    "roomRef": {
      "_id": "6a016ca68d4c50f55ff0423a",
      "roomNumber": "101"
    },
    "checkInDate": "2026-05-16T05:46:38.679Z",
    "checkOutDate": "2026-05-19T05:46:38.691Z",
    "totalPrice": 120000,
    "guestCount": 2,
    "guestName": "John Doe",
    "status": "Confirmed",
    "paymentStatus": "Paid",
    "__v": 0,
    "createdAt": "2026-05-11T05:46:38.700Z",
    "updatedAt": "2026-05-11T05:46:38.700Z"
  }
];

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString();
};

try {
  bookings.map((booking) => {
    const id = booking._id?.substring(0,8).toUpperCase();
    const name = booking.guestName || booking.userRef?.name || 'Guest';
    const hotel = booking.hotelRef?.name || 'Hotel';
    const date = `${formatDate(booking.checkInDate)} - ${formatDate(booking.checkOutDate)}`;
    const price = `₹${booking.totalPrice?.toLocaleString()}`;
    const status = booking.status || 'Pending';
  });
  console.log("No error during mapping");
} catch(e) {
  console.log("Error:", e);
}

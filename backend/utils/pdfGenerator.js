import PDFDocument from 'pdfkit';

/**
 * Generate a PDF invoice for a hotel booking
 * @param {Object} booking - Booking document
 * @param {Object} hotel - Hotel document
 * @param {Object} room - Room document
 * @param {Object} user - User document
 * @returns {Promise<Buffer>} - Resolved PDF buffer
 */
export const generateInvoicePDF = (booking, hotel, room, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const mm = (v) => v * 2.8346;

      const name = booking.guestName || (user && user.name) || 'Guest';
      const amount = `Rs. ${booking.totalPrice ? booking.totalPrice.toLocaleString() : 0}`;
      const date = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
      const rawId = booking._id ? String(booking._id) : 'UNKNOWN';
      const transactionId = rawId.substring(0, 8).toUpperCase();
      const status = booking.status ? booking.status.toUpperCase() : 'PENDING';
      const property = (hotel && hotel.name) || 'LuxeStays Property';

      // Header Background (Dark Blue/Slate)
      doc.rect(0, 0, mm(210), mm(45)).fill('#0f172a');

      // Header Text (White)
      doc.fillColor('#ffffff')
         .font('Helvetica-Bold')
         .fontSize(28)
         .text('LUXESTAYS', mm(14), mm(12));

      doc.fillColor('#c8c8c8')
         .font('Helvetica')
         .fontSize(10)
         .text('Premium Hotel Booking Platform', mm(14), mm(26));

      // Right Side Header (Gold / ID)
      doc.fillColor('#d4af37')
         .font('Helvetica-Bold')
         .fontSize(20)
         .text('INVOICE / RECEIPT', mm(14), mm(12), { width: mm(182), align: 'right' });

      doc.fillColor('#ffffff')
         .font('Helvetica')
         .fontSize(10)
         .text(`ID: ${transactionId}`, mm(14), mm(26), { width: mm(182), align: 'right' });

      // Guest & Property Info Block
      // Left Col
      doc.fillColor('#000000')
         .font('Helvetica-Bold')
         .fontSize(12)
         .text('Billed To:', mm(14), mm(60));
      doc.font('Helvetica')
         .text(name, mm(14), mm(68))
         .text(`Booking Date: ${date}`, mm(14), mm(76))
         .text(`Status: ${status}`, mm(14), mm(84));

      // Right Col
      doc.font('Helvetica-Bold')
         .text('Property:', mm(120), mm(60));
      doc.font('Helvetica')
         .text(property, mm(120), mm(68));
      if (booking.checkInDate) {
        doc.text(`Check-In: ${new Date(booking.checkInDate).toLocaleDateString()}`, mm(120), mm(76));
        doc.text(`Check-Out: ${new Date(booking.checkOutDate).toLocaleDateString()}`, mm(120), mm(84));
      }

      // Divider Line
      doc.strokeColor('#c8c8c8')
         .lineWidth(1)
         .moveTo(mm(14), mm(92))
         .lineTo(mm(196), mm(92))
         .stroke();

      // Table layout at Y=100
      // Table Header Row Background
      doc.rect(mm(14), mm(100), mm(182), mm(10)).fill('#d4af37');

      // Table Header Row Text (Black)
      doc.fillColor('#000000')
         .font('Helvetica-Bold')
         .fontSize(11)
         .text('Description', mm(18), mm(103.5))
         .text('Amount Billed', mm(144), mm(103.5));

      // Table Body Row 1 Background
      doc.rect(mm(14), mm(110), mm(182), mm(10)).fill('#ffffff');

      // Table Body Row 1 Text (Dark Gray)
      doc.fillColor('#1e293b')
         .font('Helvetica')
         .fontSize(11)
         .text('Room Stay Accommodation', mm(18), mm(113.5))
         .text(amount, mm(144), mm(113.5));

      // Table Body Row 2 Background
      doc.rect(mm(14), mm(120), mm(182), mm(10)).fill('#fafafa');

      // Table Body Row 2 Text
      doc.fillColor('#1e293b')
         .font('Helvetica')
         .fontSize(11)
         .text('Taxes & Processing Fees', mm(18), mm(123.5))
         .text('Included', mm(144), mm(123.5));

      // Table Grid lines
      doc.strokeColor('#c8c8c8').lineWidth(0.5);
      // Horizontal grid lines
      doc.moveTo(mm(14), mm(100)).lineTo(mm(196), mm(100)).stroke();
      doc.moveTo(mm(14), mm(110)).lineTo(mm(196), mm(110)).stroke();
      doc.moveTo(mm(14), mm(120)).lineTo(mm(196), mm(120)).stroke();
      doc.moveTo(mm(14), mm(130)).lineTo(mm(196), mm(130)).stroke();
      // Vertical grid lines
      doc.moveTo(mm(14), mm(100)).lineTo(mm(14), mm(130)).stroke();
      doc.moveTo(mm(140), mm(100)).lineTo(mm(140), mm(130)).stroke();
      doc.moveTo(mm(196), mm(100)).lineTo(mm(196), mm(130)).stroke();

      // Total Box
      const finalY = 130 + 15; // 145mm
      doc.rect(mm(130), mm(finalY), mm(66), mm(22)).fill('#f5f5f5');

      doc.fillColor('#000000')
         .font('Helvetica-Bold')
         .fontSize(14)
         .text('TOTAL PAID:', mm(134), mm(finalY + 8.5));

      doc.fillColor('#d4af37')
         .text(amount, mm(130), mm(finalY + 8.5), { width: mm(62), align: 'right' });

      // Footer
      doc.fillColor('#969696')
         .font('Helvetica-Oblique')
         .fontSize(10)
         .text('Thank you for choosing LuxeStays. Have a safe journey!', mm(14), mm(275), { width: mm(182), align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

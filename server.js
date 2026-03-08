const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// load .env variables
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

app.use(cors('http://localhost:7592/'));
app.use(express.json());

// Detect MIME type from magic bytes (first 12 bytes of a file)
function detectMimeType(buffer) {
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return 'image/jpeg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return 'image/png';
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return 'image/gif';
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return 'image/webp';
  if (buffer[0] === 0x42 && buffer[1] === 0x4D) return 'image/bmp';
  return 'application/octet-stream';
}

// Serve uploaded images — detect Content-Type for extensionless files
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(__dirname, 'uploads', req.path);
  // Only intercept files without extensions
  if (!path.extname(req.path)) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) return next(); // file not found, let express.static handle 404
      fs.open(filePath, 'r', (err, fd) => {
        if (err) return next();
        const buf = Buffer.alloc(12);
        fs.read(fd, buf, 0, 12, 0, (err) => {
          fs.close(fd, () => {});
          if (err) return next();
          res.setHeader('Content-Type', detectMimeType(buf));
          res.sendFile(filePath);
        });
      });
    });
  } else {
    next();
  }
}, express.static(path.join(__dirname, 'uploads')));

// swagger setup
const { swaggerUi, specs } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
    res.send("Event API Running");
});

// mount routers under /api
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

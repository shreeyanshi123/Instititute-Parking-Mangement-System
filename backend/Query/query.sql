-- Create the database
CREATE DATABASE IF NOT EXISTS ParkingManagementSystem;
USE ParkingManagementSystem;

-- Create the Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Locations (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    location_name VARCHAR(255) NOT NULL,
    two_wheeler_slots INT NOT NULL,
    four_wheeler_slots INT NOT NULL,
    bus_parking_slots INT NOT NULL -- Added column for bus parking slots
);

CREATE TABLE ParkingSlots (
    slot_id INT PRIMARY KEY AUTO_INCREMENT,
    location_id INT,
    vehicle_type ENUM('two-wheeler', 'four-wheeler', 'bus') NOT NULL,
    is_empty BOOLEAN NOT NULL DEFAULT TRUE,
    permanently_reserved BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id) ON DELETE CASCADE
);
ALTER TABLE Locations ADD COLUMN image_url VARCHAR(500);

-- Vehicles Table
CREATE TABLE Vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type ENUM('Car', 'Bike', 'Other') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bookings Table
CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    slot_id INT NOT NULL,
    released BOOLEAN DEFAULT FALSE,
    booking_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('Active', 'Completed', 'Expired') DEFAULT 'Active',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES ParkingSlots(slot_id) ON DELETE CASCADE
);



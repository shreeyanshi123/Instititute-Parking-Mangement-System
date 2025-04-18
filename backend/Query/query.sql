CREATE DATABASE IF NOT EXISTS ParkingManagementSystem;

USE ParkingManagementSystem;

CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    vehicle_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type ENUM('twoWheeler', 'FourWheeler', 'Other'),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE locations (
    location_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL,
    two_wheeler_slots INT NOT NULL,
    four_wheeler_slots INT NOT NULL,
    bus_parking_slots INT NOT NULL,
    image_url VARCHAR(500)
);

CREATE TABLE parkingslots (
    slot_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    location_id INT,
    vehicle_type ENUM('two-wheeler', 'four-wheeler', 'bus') NOT NULL,
    is_empty TINYINT(1) NOT NULL DEFAULT 1,
    reserved TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

CREATE TABLE bookings (
    booking_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    slot_id INT NOT NULL,
    released TINYINT(1) DEFAULT 0,
    booking_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('Active', 'Completed', 'Expired', 'Reserved', 'Cancelled') DEFAULT 'Active',
    is_confirmed TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (slot_id) REFERENCES parkingslots(slot_id)
);

CREATE TABLE permanent_reserve (
    reserve_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slot_id INT NOT NULL UNIQUE,
    user_id INT NOT NULL,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vehicle_number VARCHAR(20) NOT NULL,
    FOREIGN KEY (slot_id) REFERENCES parkingslots(slot_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);



ALTER TABLE bookings
DROP FOREIGN KEY bookings_ibfk_3;

ALTER TABLE bookings
ADD CONSTRAINT bookings_ibfk_3
FOREIGN KEY (slot_id) REFERENCES parkingslots(slot_id)
ON DELETE CASCADE;

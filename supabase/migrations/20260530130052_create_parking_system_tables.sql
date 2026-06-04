/*
  # Create Parking System Tables

  ## Summary
  Sets up the core tables for the FindMySpot parking management application.

  ## New Tables

  1. **parking_records**
     - Stores sensor data from parking lot cameras (available/occupied counts)
     - `id` - auto-increment primary key
     - `available_spaces` - number of free parking spots
     - `occupied_spaces` - number of occupied parking spots
     - `timestamp` - when the record was captured

  2. **bookings**
     - Stores user parking reservations
     - `id` - uuid primary key
     - `user_id` - references auth.users
     - `transaction_id` - unique booking reference code
     - `booking_date` - date/time of booking creation
     - `selected_slot` - parking bay identifier (e.g. "A1")
     - `lot_name` - name of the parking facility
     - `vehicle_id` - license plate
     - `payment_type` - "upi", "card", "spot", etc.
     - `status` - "Paid", "Payment Pending"
     - `start_time` - scheduled arrival time
     - `duration` - number of hours booked
     - `price` - total cost
     - `timestamp` - when booking was created

  ## Security
  - RLS enabled on both tables
  - `parking_records`: All authenticated users can read; only service role can insert
  - `bookings`: Users can only read/insert/update/delete their own bookings
*/

-- PARKING RECORDS TABLE
CREATE TABLE IF NOT EXISTS parking_records (
  id BIGSERIAL PRIMARY KEY,
  available_spaces INT NOT NULL DEFAULT 0,
  occupied_spaces INT NOT NULL DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE parking_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read parking records"
  ON parking_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert parking records"
  ON parking_records FOR INSERT
  TO service_role
  WITH CHECK (true);

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  transaction_id TEXT UNIQUE NOT NULL,
  booking_date TEXT NOT NULL DEFAULT '',
  selected_slot TEXT NOT NULL DEFAULT '',
  lot_name TEXT NOT NULL DEFAULT '',
  vehicle_id TEXT NOT NULL DEFAULT '',
  payment_type TEXT NOT NULL DEFAULT 'Online',
  status TEXT NOT NULL DEFAULT 'Paid',
  start_time TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '1H',
  price TEXT NOT NULL DEFAULT '0',
  timestamp TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admins (service_role) to read all bookings
CREATE POLICY "Service role can read all bookings"
  ON bookings FOR SELECT
  TO service_role
  USING (true);

-- INDEX for faster queries
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_transaction_id_idx ON bookings(transaction_id);
CREATE INDEX IF NOT EXISTS parking_records_timestamp_idx ON parking_records(timestamp DESC);

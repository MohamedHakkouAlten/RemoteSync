-- 1. Drop the old column no longer used
ALTER TABLE rotation
DROP COLUMN rotation_sequence;

-- 2. Add new columns to represent the rotation pattern
ALTER TABLE rotation
    ADD COLUMN cycle_length_weeks INT NULL,
ADD COLUMN remote_weeks_per_cycle INT NULL;

DROP TABLE rotation_custom_dates;

-- 3. Create the collection table for custom dates
CREATE TABLE rotation_custom_dates (
   rotation_rotation_id BINARY(16) NOT NULL,
   custom_date   DATE NOT NULL,
   rotation_status ENUM('ONSITE', 'REMOTE') NOT NULL,
   PRIMARY KEY (rotation_rotation_id, custom_date), -- Composite PK
   CONSTRAINT fk_rotation_custom_dates_rotation
       FOREIGN KEY (rotation_rotation_id)
           REFERENCES rotation(rotation_id)
           ON DELETE CASCADE
);

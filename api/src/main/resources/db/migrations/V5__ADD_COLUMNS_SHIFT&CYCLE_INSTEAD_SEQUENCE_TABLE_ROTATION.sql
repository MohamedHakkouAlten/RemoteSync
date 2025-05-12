SET @column_shift_exists = (
    SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = 'remotesync'
    AND table_name = 'rotation'
    AND column_name = 'shift'
);

SET @shift_sql = IF(@column_shift_exists = 0, 'ALTER TABLE remotesync.rotation ADD COLUMN shift INT;', 'SELECT "Column shift already exists";');
PREPARE stmt FROM @shift_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- CYCLE
SET @column_cycle_exists = (
    SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = 'remotesync'
    AND table_name = 'rotation'
    AND column_name = 'cycle'
);

SET @cycle_sql = IF(@column_cycle_exists = 0, 'ALTER TABLE remotesync.rotation ADD COLUMN cycle INT;', 'SELECT "Column cycle already exists";');
PREPARE stmt FROM @cycle_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ROTATION_SEQUENCE (to drop)
SET @column_rotation_sequence_exists = (
    SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = 'remotesync'
    AND table_name = 'rotation'
    AND column_name = 'rotation_sequence'
);

SET @rotation_sequence_sql = IF(@column_rotation_sequence_exists = 1, 'ALTER TABLE remotesync.rotation DROP COLUMN rotation_sequence;', 'SELECT "Column rotation_sequence does not exist";');
PREPARE stmt FROM @rotation_sequence_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

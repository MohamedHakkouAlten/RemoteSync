
SET @column_exists = (
    SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = 'remotesync' 
    AND table_name = 'project'
    AND column_name = 'start_date'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE project ADD COLUMN start_date DATETIME',
    'SELECT "Column already exists, no action taken"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

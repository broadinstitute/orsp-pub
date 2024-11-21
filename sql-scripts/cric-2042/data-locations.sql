CREATE TABLE data_locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- Primary key for this table
    collection_link_id BIGINT NOT NULL,   -- Foreign key column referencing consent_collection_link
    research_stage VARCHAR(100) DEFAULT NULL,
    data_stores VARCHAR(2048) DEFAULT NULL,
    location_url VARCHAR(2048) DEFAULT NULL,
    cloud_provider VARCHAR(255) DEFAULT NULL,
    terra_url VARCHAR(2048) DEFAULT NULL,
    gcsa_url VARCHAR(2048) DEFAULT NULL,
    gdrive_url VARCHAR(2048) DEFAULT NULL,
    onprem_url VARCHAR(2048) DEFAULT NULL,
    bil_cluster VARCHAR(2048) DEFAULT NULL,
    other_text VARCHAR(2048) DEFAULT NULL,
    deleted BIT(1) NOT NULL DEFAULT b'0', -- Deleted flag
    version BIGINT NOT NULL,              -- Version column

    -- Define the foreign key relationship
    CONSTRAINT fk_collection_link
    FOREIGN KEY (collection_link_id)
    REFERENCES consent_collection_link(id)
    ON DELETE CASCADE -- Cascading delete to remove data when the parent is deleted
);
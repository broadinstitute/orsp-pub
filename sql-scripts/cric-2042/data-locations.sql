CREATE TABLE data_locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- Primary key for this table
    collection_link_id BIGINT NOT NULL,   -- Foreign key column referencing consent_collection_link
    research_stage VARCHAR(100) DEFAULT NULL,
    data_stores VARCHAR(2048) DEFAULT NULL,
    terra_url TEXT DEFAULT NULL,
    gcsa_url TEXT DEFAULT NULL,
    gdrive_url TEXT DEFAULT NULL,
    onprem_url TEXT DEFAULT NULL,
    bil_cluster TEXT DEFAULT NULL,
    other_text TEXT DEFAULT NULL,
    deleted BIT(1) NOT NULL DEFAULT b'0', -- Deleted flag
    version BIGINT NOT NULL,              -- Version column

    -- Define the foreign key relationship
    CONSTRAINT fk_collection_link
    FOREIGN KEY (collection_link_id)
    REFERENCES consent_collection_link(id)
    ON DELETE CASCADE -- Cascading delete to remove data when the parent is deleted
);

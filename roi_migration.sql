-- Add consultation_fee to astrologer_clients
ALTER TABLE astrologer_clients ADD COLUMN IF NOT EXISTS consultation_fee DECIMAL(10,2) DEFAULT 0.00;

-- Comment for clarity
COMMENT ON COLUMN astrologer_clients.consultation_fee IS 'The fee charged by the astrologer to this client for consultations, used to calculate ROI.';

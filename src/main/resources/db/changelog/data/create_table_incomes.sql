CREATE TABLE incomes
(
    id     BIGSERIAL PRIMARY KEY,
    source VARCHAR(255)   NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    month  VARCHAR(7)     NOT NULL
);
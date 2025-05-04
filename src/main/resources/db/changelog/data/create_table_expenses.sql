CREATE TABLE expenses
(
    id       BIGSERIAL PRIMARY KEY,
    category VARCHAR(255)   NOT NULL,
    amount   NUMERIC(15, 2) NOT NULL,
    month    VARCHAR(7)     NOT NULL
);
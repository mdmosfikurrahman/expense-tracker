CREATE TABLE incomes
(
    id      BIGSERIAL PRIMARY KEY,
    source  VARCHAR(255)   NOT NULL,
    amount  NUMERIC(15, 2) NOT NULL,
    month   VARCHAR(100)   NOT NULL,
    user_id BIGINT         NOT NULL,
    CONSTRAINT fk_income_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

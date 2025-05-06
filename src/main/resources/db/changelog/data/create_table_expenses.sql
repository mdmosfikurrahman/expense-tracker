CREATE TABLE expenses
(
    id       BIGSERIAL PRIMARY KEY,
    category VARCHAR(255)   NOT NULL,
    amount   NUMERIC(15, 2) NOT NULL,
    month    VARCHAR(100)   NOT NULL,
    user_id  BIGINT         NOT NULL,
    CONSTRAINT fk_expense_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE DATABASE triviatdp;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
);

CREATE TABLE trivia(
    id SERIAL PRIMARY KEY,
    triviaDate DATE,
    score FLOAT,
    triviaTime INT,
    timeAvailable INT,
    correctAnswers INT,
    incorrectAnswers INT,
    amountQuestions INT,
    userID INT,
    FOREIGN KEY (userID) REFERENCES users(id)
);

CREATE TABLE source(
    id SERIAL PRIMARY KEY,
    source TEXT
);

CREATE TABLE category(
    id SERIAL PRIMARY KEY,
    category TEXT,
    idSource INT,
    FOREIGN KEY (idSource) REFERENCES source(id)
);

CREATE TABLE difficulty(
    id SERIAL PRIMARY KEY,
    difficulty TEXT,
    score INT
);

CREATE TABLE question (
    id SERIAL PRIMARY KEY,
    questionType TEXT,
    question TEXT,
    idCategory INT,
    idDifficulty INT,
    FOREIGN KEY (idCategory) REFERENCES category(id),
    FOREIGN KEY (idDifficulty) REFERENCES difficulty(id)
);

CREATE TABLE answer(
    id SERIAL PRIMARY KEY,
    answer TEXT,
    correct BOOLEAN,
    idQuestion INT,
    FOREIGN KEY (idQuestion) REFERENCES question(id)
);

CREATE TABLE questionInTrivia(
    id SERIAL PRIMARY KEY,
    idQuestion INT,
    idTrivia INT,
    FOREIGN KEY (idQuestion) REFERENCES question(id),
    FOREIGN KEY (idTrivia) REFERENCES trivia(id)
);
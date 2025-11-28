
SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS Recommendation;
DROP TABLE IF EXISTS Reaction;
DROP TABLE IF EXISTS Follow;
DROP TABLE IF EXISTS Ratings;
DROP TABLE IF EXISTS Movie;
DROP TABLE IF EXISTS User;


CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    photo_profile TEXT NOT NULL,  
    dark_mode_enabled BOOLEAN DEFAULT FALSE
);

CREATE TABLE Movie (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL, 
    duration INT NOT NULL,
    director VARCHAR(50)
);

CREATE TABLE Ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    comment VARCHAR(300),
    rating INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movie(id) ON DELETE CASCADE,
    
    UNIQUE(user_id, movie_id),
    CHECK (rating >= 1 AND rating <= 5)
);


CREATE TABLE Follow (
    id INT PRIMARY KEY AUTO_INCREMENT,
    follower_id INT NOT NULL,
    followed_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (follower_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES User(id) ON DELETE CASCADE,
    
    UNIQUE(follower_id, followed_id),
    CHECK (follower_id != followed_id)
);


CREATE TABLE Reaction (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    rating_id INT NOT NULL,
    type ENUM('like', 'dislike') NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (rating_id) REFERENCES Ratings(id) ON DELETE CASCADE,
    
    UNIQUE(user_id, rating_id)
);


CREATE TABLE Recommendation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    movie_id INT NOT NULL,
    message VARCHAR(300),
    emoji VARCHAR(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movie(id) ON DELETE CASCADE,
    
    UNIQUE(sender_id, receiver_id, movie_id),
    CHECK (sender_id != receiver_id)
);

SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO User (username, password, photo_profile) VALUES 
('Sophie', '123456', 'https://randomuser.me/api/portraits/women/44.jpg'),
('Joe', '123456', 'https://randomuser.me/api/portraits/men/32.jpg'),
('Sam', '123456', 'https://randomuser.me/api/portraits/women/68.jpg');

INSERT INTO Movie (title, duration, director) VALUES 
('Dune: Part Two', 166, 'Denis Villeneuve'),
('Oppenheimer', 180, 'Christopher Nolan'),
('Dazed and confused', 114, 'Richard Linklater'),
('The Hateful Eight', 176, 'Quentin Tarantino'),
('Interstellar', 169, 'Christopher Nolan');


INSERT INTO Ratings (user_id, movie_id, rating, comment) VALUES 
(1, 1, 5, "Un chef d'oeuvre absolu. Visuellement incroyable.");

INSERT INTO Ratings (user_id, movie_id, rating, comment) VALUES 
(2, 4, 4, "Très sombre, un peu long mais excellent.");

INSERT INTO Ratings (user_id, movie_id, rating, comment) VALUES 
(3, 3, 3, "Drôle mais sans plus.");

INSERT INTO Follow (follower_id, followed_id) VALUES (1, 2);

INSERT INTO Follow (follower_id, followed_id) VALUES (2, 1);

INSERT INTO Follow (follower_id, followed_id) VALUES (3, 1);


INSERT INTO Reaction (user_id, rating_id, type) VALUES (2, 1, 'like');


INSERT INTO Recommendation (sender_id, receiver_id, movie_id, message, emoji) VALUES 
(2, 1, 5, "Tu as aimé Dune, tu vas adorer celui-là !", "🚀");
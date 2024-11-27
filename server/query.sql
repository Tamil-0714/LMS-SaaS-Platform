create table userAuthId( 
    authId varchar(32) primary key, 
    email varchar(32) not null,
    google_name varchar(64) not null,
    pictureURL varchar(255),
    created_at TIMESTAMP DEFAULT NOW(),
    idKey int 
);
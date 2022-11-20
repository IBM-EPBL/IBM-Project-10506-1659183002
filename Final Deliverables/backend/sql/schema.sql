# USER TABLE
CREATE TABLE user (
	id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
	email VARCHAR(50) NOT NULL UNIQUE, 
	password_hash VARCHAR(64)  NOT NULL,
	verified BOOLEAN NOT NULL DEFAULT FALSE,
	next_resend bigint,
	total_amount bigint  DEFAULT 0,
	timestamp bigint DEFAULT 0,
	alert bigint default 0,
	is_send boolean default false
);

# EXPENSE TABLE
CREATE TABLE expense (
	id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
	user_id INT NOT NULL,
	amount DECIMAL NOT NULL,
	is_income BOOLEAN NOT NULL,
	label VARCHAR(50) NOT NULL DEFAULT 'OTHER',
	timestamp BIGINT NOT NULL ,
	constraint fk_user_id  
            foreign key (user_id)  
            references user(id) 
);

# SPLIT INCOME TABLE
CREATE TABLE split_income (
	id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
	user_id INT NOT NULL,
	amount DECIMAL NOT NULL,
	label VARCHAR(50) NOT NULL DEFAULT 'OTHER',
	constraint fk_user_id  
            foreign key (user_id)  
            references user(id) 
);
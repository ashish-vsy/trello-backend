-- Organization Table
CREATE TABLE organization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orgname VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orgid UUID NOT NULL REFERENCES organization (id) ON DELETE CASCADE,
    profilecolor VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    deleted_at BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orgid UUID NOT NULL REFERENCES organization (id) ON DELETE CASCADE,
    userid UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    taskname VARCHAR(255) NOT NULL,
    taskdescription TEXT,
    priority VARCHAR(50) CHECK (priority IN ('high', 'medium', 'low')),
    status VARCHAR(50) CHECK (status IN ('completed', 'pending', 'not started')),
    duedate TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- User Task Relation Table
CREATE TABLE usertaskrelation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taskid UUID NOT NULL REFERENCES tasks (id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

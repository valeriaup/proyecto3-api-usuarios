--tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--datos de ejemplo
INSERT INTO usuarios (nombre, email) VALUES
    ('Ana Gómez', 'ana.gomez@example.com'),
    ('Carlos Ruiz', 'carlos.ruiz@example.com'),
    ('Laura Méndez', 'laura.mendez@example.com');
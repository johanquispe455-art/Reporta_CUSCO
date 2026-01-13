-- =====================================================
-- BASE DE DATOS: CUSCO_REPORTA
-- SOLO ESTRUCTURA DE TABLAS
-- PostgreSQL
-- =====================================================

CREATE DATABASE cusco_reporta;
\c cusco_reporta;

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE rol_usuario AS ENUM (
  'admin',
  'ciudadano'
);

CREATE TYPE estado_incidencia AS ENUM (
  'recibido',
  'en_proceso',
  'resuelto'
);

CREATE TYPE prioridad_incidencia AS ENUM (
  'alta',
  'media',
  'baja'
);

-- =====================================================
-- TABLA USUARIOS
-- =====================================================
-- ID:
--  Admin     → A000001
--  Ciudadano → C000001
-- =====================================================

CREATE TABLE usuarios (
  id VARCHAR(20) PRIMARY KEY,
  dni VARCHAR(20) NOT NULL,
  nombre_completo VARCHAR(250) NOT NULL,
  telefono VARCHAR(50),
  direccion TEXT,                          -- NUEVO
  correo VARCHAR(250) NOT NULL UNIQUE,
  contrasena_hash TEXT NOT NULL,           -- NUEVO
  rol rol_usuario NOT NULL
);

-- =====================================================
-- TABLA TIPOS DE INCIDENTES
-- =====================================================

CREATE TABLE tipos_incidentes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  puntos INTEGER NOT NULL,
  es_predefinido BOOLEAN NOT NULL
);

-- =====================================================
-- TABLA BASE: INCIDENCIAS
-- =====================================================
-- ID:
--  Denuncia → D-AAAA-000001
--  Reporte  → R-AAAA-000001
-- =====================================================

CREATE TABLE incidencias (
  id VARCHAR(30) PRIMARY KEY,
  descripcion TEXT NOT NULL,

  fecha TIMESTAMP WITH TIME ZONE NOT NULL,  -- fecha + hora

  direccion TEXT,
  latitud NUMERIC(9,6),
  longitud NUMERIC(9,6),

  tipo_incidente_id INTEGER NOT NULL
    REFERENCES tipos_incidentes(id),

  estado estado_incidencia NOT NULL,
  prioridad prioridad_incidencia NOT NULL,

  placa_vehiculo VARCHAR(30)                -- opcional
);

-- =====================================================
-- TABLA DENUNCIAS
-- =====================================================
-- Hereda de incidencias
-- Requiere usuario registrado
-- =====================================================

CREATE TABLE denuncias (
  denunciante_id VARCHAR(20) NOT NULL
    REFERENCES usuarios(id),

  denunciado_nombre VARCHAR(250),
  denunciado_dni VARCHAR(20)
) INHERITS (incidencias);

-- =====================================================
-- TABLA REPORTES
-- =====================================================
-- Hereda de incidencias
-- Anónimo (sin usuario)
-- =====================================================

CREATE TABLE reportes (
  es_anonimo BOOLEAN NOT NULL DEFAULT TRUE
) INHERITS (incidencias);

-- =====================================================
-- TABLA EVIDENCIAS
-- =====================================================
-- Fotos / videos desde celular o PC
-- =====================================================

CREATE TABLE evidencias (
  id SERIAL PRIMARY KEY,
  incidencia_id VARCHAR(30) NOT NULL
    REFERENCES incidencias(id) ON DELETE CASCADE,

  tipo_archivo VARCHAR(20) NOT NULL,        -- imagen / video
  nombre_archivo VARCHAR(255),
  url TEXT NOT NULL
);

-- =====================================================
-- TABLA NOTIFICACIONES
-- =====================================================
-- Usada por notificaciones.html
-- =====================================================

CREATE TABLE notificaciones (
  id SERIAL PRIMARY KEY,
  usuario_id VARCHAR(20)
    REFERENCES usuarios(id) ON DELETE CASCADE,

  mensaje TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL
);

-- =====================================================
-- TABLA RECUPERACIÓN DE CONTRASEÑA
-- =====================================================
-- Usada por recuperar_contrasena.html
-- =====================================================

CREATE TABLE recuperacion_contrasena (
  id SERIAL PRIMARY KEY,
  correo VARCHAR(250) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiracion TIMESTAMP WITH TIME ZONE NOT NULL,
  usado BOOLEAN NOT NULL DEFAULT FALSE
);
--INSERT INTO usuarios (
--  id, dni, nombre_completo, telefono, direccion,
--  correo, contrasena_hash, rol
--) VALUES
--(
--  'A000001',
--  '00000000',
--  'Administrador del Sistema',
--  '999999999',
--  'Municipalidad del Cusco',
--  'admin@cuscoreporta.pe',
--  'admin123',
--  'admin'
--),
(
 -- 'C000001',
 -- '12345678',
  --'Juan Pérez Quispe',
 -- '987654321',
 -- 'Av. Cultura 123',
  --'juan.perez@gmail.com',
 -- 'ciudadano123',
 -- 'ciudadano'
);

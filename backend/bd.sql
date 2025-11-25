CREATE DATABASE IF NOT EXISTS voxnews;
USE voxnews;
CREATE TABLE voxnews.noticias (
	id_noticia INTEGER auto_increment NOT NULL,
	nombre varchar(100) NULL,
	descripcion varchar(300) NULL,
	imagen varchar(100) NULL,
	CONSTRAINT noticia_pk PRIMARY KEY (id_noticia)
)
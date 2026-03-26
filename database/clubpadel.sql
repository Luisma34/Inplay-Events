-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               12.1.2-MariaDB - MariaDB Server
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for club_padel
CREATE DATABASE IF NOT EXISTS `club_padel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `club_padel`;

-- Dumping structure for table club_padel.clase
CREATE TABLE IF NOT EXISTS `clase` (
  `id_clase` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `nivel` enum('INICIACION','INTERMEDIO','AVANZADO') NOT NULL,
  `capacidad` int(3) NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_clase`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Une usuarios con grupos e indica su rol dentro del grupo (admin o miembro).';

-- Dumping data for table club_padel.clase: ~1 rows (approximately)
DELETE FROM `clase`;
INSERT INTO `clase` (`id_clase`, `nombre`, `nivel`, `capacidad`, `activa`) VALUES
	(1, 'Principiante', 'INICIACION', 4, 1);

-- Dumping structure for table club_padel.clasificacion
CREATE TABLE IF NOT EXISTS `clasificacion` (
  `id_clasificacion` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_liga` int(10) unsigned NOT NULL,
  `equipo` varchar(100) NOT NULL,
  `puntos` int(11) DEFAULT 0,
  `partidos_jugados` int(11) DEFAULT 0,
  `partidos_ganados` int(11) DEFAULT 0,
  `partidos_perdidos` int(11) DEFAULT 0,
  `sets_favor` int(11) DEFAULT 0,
  `sets_contra` int(11) DEFAULT 0,
  PRIMARY KEY (`id_clasificacion`),
  UNIQUE KEY `id_liga` (`id_liga`,`equipo`),
  UNIQUE KEY `UK8xk2nqy2239kaio5uukqxrgyh` (`id_liga`,`equipo`),
  KEY `fk_idLiga` (`id_clasificacion`),
  CONSTRAINT `fk_clasificacion_liga` FOREIGN KEY (`id_liga`) REFERENCES `liga` (`id_liga`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table club_padel.clasificacion: ~0 rows (approximately)
DELETE FROM `clasificacion`;

-- Dumping structure for table club_padel.grupo
CREATE TABLE IF NOT EXISTS `grupo` (
  `id_grupo` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `nivel_grupo` enum('PRINCIPIANTES','INTERMEDIO','AVANZADO') NOT NULL,
  PRIMARY KEY (`id_grupo`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Define un grupo/comunidad dentro de la app (nombre y descripción).Sirve para ser utilizado por el profesor.';

-- Dumping data for table club_padel.grupo: ~0 rows (approximately)
DELETE FROM `grupo`;

-- Dumping structure for table club_padel.liga
CREATE TABLE IF NOT EXISTS `liga` (
  `id_liga` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL COMMENT 'Unificamos todo en unique para que el nombre, categoria y division sean unicos. Pero el nombre se puede repetir.',
  `descripcion` varchar(255) DEFAULT NULL,
  `categoria` varchar(50) NOT NULL,
  `division` varchar(50) NOT NULL,
  `estado` enum('ABIERTA','EN_CURSO','FINALIZADA','CANCELADA') NOT NULL DEFAULT 'ABIERTA',
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_liga`),
  UNIQUE KEY `uq_liga` (`nombre`,`categoria`,`division`),
  UNIQUE KEY `UKdk483qgvikohf1lttx7npkrq1` (`nombre`,`categoria`,`division`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table club_padel.liga: ~1 rows (approximately)
DELETE FROM `liga`;
INSERT INTO `liga` (`id_liga`, `nombre`, `descripcion`, `categoria`, `division`, `estado`, `fecha_inicio`, `fecha_fin`, `fecha_creacion`) VALUES
	(1, 'Liga InPlay Intermedio', 'Liga para jugadores con un nivel intermedio , que tengan buen manejo de la pala.', 'Intermedio', 'A', 'ABIERTA', '2026-04-01', NULL, '2026-03-11 12:54:54');

-- Dumping structure for table club_padel.liga_usuario
CREATE TABLE IF NOT EXISTS `liga_usuario` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_liga` int(10) unsigned NOT NULL,
  `id_usuario` int(10) unsigned NOT NULL,
  `rol` enum('JUGADOR','CAPITAN','ORGANIZADOR') NOT NULL DEFAULT 'JUGADOR',
  `fecha_alta` date NOT NULL DEFAULT curdate(),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id_liga/id_usuario` (`id_liga`,`id_usuario`),
  UNIQUE KEY `UK71g8iq0inj6865ajet0frwol3` (`id_usuario`,`id_liga`),
  KEY `fk_id_usuario` (`id_usuario`) USING BTREE,
  KEY `fk_id_liga` (`id_liga`),
  CONSTRAINT `fk_lu_liga` FOREIGN KEY (`id_liga`) REFERENCES `liga` (`id_liga`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_lu_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Tabla intermedia que registra qué usuarios pertenecen a cada liga.\r\nExiste porque una liga puede tener muchos usuarios y un usuario puede\r\nparticipar en varias ligas.\r\nAquí se guarda la relación entre ambos y los datos propios de esa unión\r\n(rol dentro de la liga, fecha de alta, etc.).\r\n';

-- Dumping data for table club_padel.liga_usuario: ~1 rows (approximately)
DELETE FROM `liga_usuario`;
INSERT INTO `liga_usuario` (`id`, `id_liga`, `id_usuario`, `rol`, `fecha_alta`) VALUES
	(6, 1, 3, 'JUGADOR', '2026-03-12');

-- Dumping structure for table club_padel.log_acceso
CREATE TABLE IF NOT EXISTS `log_acceso` (
  `id_log` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) unsigned DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `ip` varchar(45) DEFAULT NULL,
  `exito` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_log`),
  KEY `fk_log_usuario` (`id_usuario`),
  CONSTRAINT `fk_log_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Registra intentos de acceso';

-- Dumping data for table club_padel.log_acceso: ~0 rows (approximately)
DELETE FROM `log_acceso`;

-- Dumping structure for table club_padel.noticia
CREATE TABLE IF NOT EXISTS `noticia` (
  `id_noticia` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `contenido` text NOT NULL,
  `fecha_publicacion` datetime DEFAULT current_timestamp(),
  `id_usuario` int(10) unsigned NOT NULL,
  `visible` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_noticia`),
  KEY `fk_noticia_usuario` (`id_usuario`),
  CONSTRAINT `fk_noticia_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Guarda publicaciones tipo “post” (título, contenido, fecha y el usuario que la crea).';

-- Dumping data for table club_padel.noticia: ~0 rows (approximately)
DELETE FROM `noticia`;

-- Dumping structure for table club_padel.partido
CREATE TABLE IF NOT EXISTS `partido` (
  `id_partido` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_liga` int(10) unsigned NOT NULL,
  `jornada` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `pareja_a` varchar(100) NOT NULL,
  `pareja_b` varchar(100) NOT NULL,
  `estado` enum('PENDIENTE','JUGADO','CANCELADO') DEFAULT 'PENDIENTE',
  PRIMARY KEY (`id_partido`),
  KEY `FK_partido_liga` (`id_liga`),
  CONSTRAINT `FK_partido_liga` FOREIGN KEY (`id_liga`) REFERENCES `liga` (`id_liga`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Guarda cada enfrentamiento (quién juega contra quién, jornada, fecha y estado).';

-- Dumping data for table club_padel.partido: ~0 rows (approximately)
DELETE FROM `partido`;

-- Dumping structure for table club_padel.pista
CREATE TABLE IF NOT EXISTS `pista` (
  `id_pista` int(100) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `cubierta` tinyint(1) NOT NULL,
  `activa` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_pista`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table club_padel.pista: ~4 rows (approximately)
DELETE FROM `pista`;
INSERT INTO `pista` (`id_pista`, `nombre`, `cubierta`, `activa`) VALUES
	(1, 'Pista 1', 0, 1),
	(2, 'Pista 2', 0, 1),
	(3, 'Pista 3', 1, 1),
	(4, 'Pista 4', 1, 1);

-- Dumping structure for table club_padel.reserva
CREATE TABLE IF NOT EXISTS `reserva` (
  `id_reserva` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) unsigned NOT NULL,
  `id_pista` int(10) unsigned NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` enum('ACTIVA','CANCELADA','COMPLETADA') NOT NULL DEFAULT 'ACTIVA',
  PRIMARY KEY (`id_reserva`),
  KEY `fk_reserva_usuario` (`id_usuario`),
  KEY `id_pista` (`id_pista`),
  CONSTRAINT `fk_pista` FOREIGN KEY (`id_pista`) REFERENCES `pista` (`id_pista`),
  CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table club_padel.reserva: ~0 rows (approximately)
DELETE FROM `reserva`;

-- Dumping structure for table club_padel.resultado
CREATE TABLE IF NOT EXISTS `resultado` (
  `id_resultado` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_partido` int(10) unsigned NOT NULL,
  `sets_pareja_a` int(11) NOT NULL,
  `sets_pareja_b` int(11) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_resultado`),
  UNIQUE KEY `id_partido` (`id_partido`),
  CONSTRAINT `fk_resultado_partido` FOREIGN KEY (`id_partido`) REFERENCES `partido` (`id_partido`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Guarda el marcador final de un partido (p. ej., sets A y sets B) y lo asocia a partido.';

-- Dumping data for table club_padel.resultado: ~0 rows (approximately)
DELETE FROM `resultado`;

-- Dumping structure for table club_padel.rol
CREATE TABLE IF NOT EXISTS `rol` (
  `id_rol` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `rol` enum('ROLE_SUPERADMIN','ROLE_ADMIN','ROLE_USUARIO','ROLE_PROFESOR') NOT NULL DEFAULT 'ROLE_USUARIO',
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table club_padel.rol: ~4 rows (approximately)
DELETE FROM `rol`;
INSERT INTO `rol` (`id_rol`, `rol`) VALUES
	(1, 'ROLE_SUPERADMIN'),
	(2, 'ROLE_ADMIN'),
	(3, 'ROLE_PROFESOR'),
	(4, 'ROLE_USUARIO');

-- Dumping structure for table club_padel.sesion
CREATE TABLE IF NOT EXISTS `sesion` (
  `id_sesion` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_clase` int(10) unsigned NOT NULL,
  `id_pista` int(10) unsigned NOT NULL,
  `id_usuario` int(10) unsigned NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_sesion`),
  KEY `fk_sesion_clase` (`id_clase`),
  KEY `fk_sesion_pista` (`id_pista`),
  KEY `fk_sesion_usuario` (`id_usuario`) USING BTREE,
  CONSTRAINT `fk_sesion_clase` FOREIGN KEY (`id_clase`) REFERENCES `clase` (`id_clase`),
  CONSTRAINT `fk_sesion_pista` FOREIGN KEY (`id_pista`) REFERENCES `pista` (`id_pista`),
  CONSTRAINT `fk_sesion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table club_padel.sesion: ~1 rows (approximately)
DELETE FROM `sesion`;
INSERT INTO `sesion` (`id_sesion`, `id_clase`, `id_pista`, `id_usuario`, `fecha`, `hora_inicio`, `hora_fin`, `activa`) VALUES
	(1, 1, 2, 6, '2026-03-27', '20:00:00', '21:30:00', 1);

-- Dumping structure for table club_padel.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_rol` int(11) unsigned NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `id_grupo` int(10) unsigned DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_alta` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `idx_email` (`email`),
  KEY `fk_id_rol` (`id_rol`),
  KEY `fk_id_grupo` (`id_grupo`),
  CONSTRAINT `fk_id_grupo` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`) ON UPDATE CASCADE,
  CONSTRAINT `fk_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table club_padel.usuario: ~4 rows (approximately)
DELETE FROM `usuario`;
INSERT INTO `usuario` (`id_usuario`, `password`, `nombre`, `id_rol`, `email`, `telefono`, `id_grupo`, `activo`, `fecha_alta`) VALUES
	(2, '$2a$10$gMp1b/YWZWg7sqma7lWla.vTVWOSEgVKwAWlFAzM9eVA8UApkTFoC', 'SuperAdmin', 1, 'superadmin@inplay.com', NULL, NULL, 1, '2026-03-01 10:21:58'),
	(3, '$2a$10$Ye9/00vzMF239z35JUwTO.IdYxSqgz1rcb4c7B5gbhLrqAt8Eaoa.', 'UsuarioNormal', 4, 'user@inplay.com', NULL, NULL, 1, '2026-03-03 18:55:57'),
	(4, '$2a$10$I47iK0UMJy6mBE1VCqtoBOxKro1TW3QGCn9/cmJcOTL3IOQPEhA5y', 'UsuarioAdmin', 2, 'userAdmin@inplay.com', NULL, NULL, 1, '2026-03-03 18:56:33'),
	(6, '$2a$10$Q34kYj.PGSADNYlfTrOi7eKXZtnNHpbnI3Lqn.wushotgoFo1OiWO', 'UsuarioProfesor', 3, 'profesor@inplay.com', NULL, NULL, 1, '2026-03-25 18:40:52');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Une usuarios con grupos e indica su rol dentro del grupo (admin o miembro).';

-- Data exporting was unselected.

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
  KEY `fk_idLiga` (`id_clasificacion`),
  CONSTRAINT `fk_clasificacion_liga` FOREIGN KEY (`id_liga`) REFERENCES `liga` (`id_liga`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table club_padel.grupo
CREATE TABLE IF NOT EXISTS `grupo` (
  `id_grupo` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_grupo`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Define un grupo/comunidad dentro de la app (nombre y descripción).Sirve para ser utilizado por el profesor.';

-- Data exporting was unselected.

-- Dumping structure for table club_padel.grupo_usuario
CREATE TABLE IF NOT EXISTS `grupo_usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_grupo` int(10) unsigned NOT NULL,
  `id_usuario` int(10) unsigned NOT NULL,
  `fecha_alta` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_grupo_usuario_idusuario` (`id_usuario`,`id_grupo`) USING BTREE,
  CONSTRAINT `fk_grupo_usuario_idgrupo` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_grupo_usuario_idusuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Qué usuario pertenece a qué grupo. Esto solo va dedicado al profesor y a las clases.';

-- Data exporting was unselected.

-- Dumping structure for table club_padel.liga
CREATE TABLE IF NOT EXISTS `liga` (
  `id_liga` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL COMMENT 'Unificamos todo en unique para que el nombre, categoria y division sean unicos. Pero el nombre se puede repetir.',
  `categoria` varchar(50) NOT NULL,
  `division` varchar(50) NOT NULL,
  `estado` enum('ABIERTA','EN_CURSO','FINALIZADA','CANCELADA') NOT NULL DEFAULT 'ABIERTA',
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_liga`),
  UNIQUE KEY `uq_liga` (`nombre`,`categoria`,`division`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table club_padel.liga_usuario
CREATE TABLE IF NOT EXISTS `liga_usuario` (
  `id_liga` int(10) unsigned NOT NULL,
  `id_usuario` int(10) unsigned NOT NULL,
  `rol` enum('JUGADOR','CAPITAN','ORGANIZADOR') NOT NULL DEFAULT 'JUGADOR',
  `fecha_alta` date NOT NULL DEFAULT curdate(),
  PRIMARY KEY (`id_liga`,`id_usuario`),
  KEY `fk_lu_usuario` (`id_usuario`),
  CONSTRAINT `fk_lu_liga` FOREIGN KEY (`id_liga`) REFERENCES `liga` (`id_liga`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_lu_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Tabla intermedia que registra qué usuarios pertenecen a cada liga.\r\nExiste porque una liga puede tener muchos usuarios y un usuario puede\r\nparticipar en varias ligas.\r\nAquí se guarda la relación entre ambos y los datos propios de esa unión\r\n(rol dentro de la liga, fecha de alta, etc.).\r\n';

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Guarda publicaciones tipo “post” (título, contenido, fecha y el usuario que la crea).';

-- Data exporting was unselected.

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

-- Data exporting was unselected.

-- Dumping structure for table club_padel.pista
CREATE TABLE IF NOT EXISTS `pista` (
  `id_pista` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `cubierta` tinyint(1) NOT NULL DEFAULT 0,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_pista`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Data exporting was unselected.

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
  KEY `fk_reserva_pista` (`id_pista`),
  CONSTRAINT `fk_reserva_pista` FOREIGN KEY (`id_pista`) REFERENCES `pista` (`id_pista`),
  CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table club_padel.resultado
CREATE TABLE IF NOT EXISTS `resultado` (
  `id_resultado` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_partido` int(10) unsigned NOT NULL,
  `sets_pareja_a` tinyint(3) unsigned NOT NULL,
  `sets_pareja_b` tinyint(3) unsigned NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_resultado`),
  UNIQUE KEY `id_partido` (`id_partido`),
  CONSTRAINT `fk_resultado_partido` FOREIGN KEY (`id_partido`) REFERENCES `partido` (`id_partido`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='Guarda el marcador final de un partido (p. ej., sets A y sets B) y lo asocia a partido.';

-- Data exporting was unselected.

-- Dumping structure for table club_padel.rol
CREATE TABLE IF NOT EXISTS `rol` (
  `id_rol` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `rol` enum('ADMIN','USUARIO','INVITADO','PROFESOR') DEFAULT 'USUARIO',
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Data exporting was unselected.

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
  KEY `fk_sesion_usuario` (`id_usuario`,`id_sesion`) USING BTREE,
  CONSTRAINT `fk_sesion_clase` FOREIGN KEY (`id_clase`) REFERENCES `clase` (`id_clase`),
  CONSTRAINT `fk_sesion_pista` FOREIGN KEY (`id_pista`) REFERENCES `pista` (`id_pista`),
  CONSTRAINT `fk_sesion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table club_padel.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_rol` int(11) unsigned NOT NULL,
  `email` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_alta` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `idx_email` (`email`),
  KEY `fk_id_rol` (`id_rol`),
  CONSTRAINT `fk_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

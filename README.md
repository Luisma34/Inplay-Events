# Inplay-Events
### Plataforma web para la gestión integral de un club de pádel

**Inplay-Events** es una aplicación web diseñada para centralizar y automatizar la gestión de un club de pádel.  
El sistema permite administrar reservas de pistas, ligas, resultados, clases deportivas y comunicaciones internas, sustituyendo procesos manuales y dispersos por una plataforma única, accesible desde navegador.

El proyecto está orientado a entornos reales de clubes deportivos, ofreciendo una experiencia diferenciada según el perfil del usuario.

---

## Objetivos del proyecto

- Digitalizar la gestión diaria de un club de pádel.
- Facilitar la reserva de pistas y clases.
- Implementar un sistema de ligas con categorías y divisiones.
- Permitir a los usuarios subir resultados.
- Actualizar automáticamente las clasificaciones.
- Centralizar noticias y avisos del club.
- Ofrecer una interfaz moderna, responsive y accesible.

---

## Perfiles de usuario

- **Administrador (ADMIN)**  
  Control global del sistema: usuarios, ligas, pistas, contenidos y configuración general.

- **Profesor**  
  Gestión de clases, grupos de alumnos y horarios.

- **Usuario básico**  
  Reserva pistas, se inscribe en ligas, sube resultados, consulta clasificaciones y gestiona su actividad deportiva.

- **Usuario invitado**  
  Accede únicamente a contenido público (noticias, ligas, disponibilidad de pistas).

---

## Tecnologías empleadas

### Frontend
- HTML5  
- CSS3  
- JavaScript (ES6)  
- React  
- Bootstrap  
- Tailwind CSS  

### Backend
- Java  
- Spring Boot  
- Arquitectura MVC  

### Base de datos
- MariaDB  

### Herramientas
- Git / GitHub  
- Maven  
- IntelliJ IDEA / Visual Studio Code / Eclipse  
- Postman  

---

## Cómo ejecutar el proyecto

### Requisitos previos

- Java 17  
- Maven 3.8 o superior  
- Node.js (versión 18 o superior recomendada)  
- MariaDB o PostgreSQL  

---

### Backend

Acceder al directorio del backend y ejecutar:

```bash
cd backend
mvn clean install
java -jar target/InplayEvents-0.0.1-SNAPSHOT.jar
````

## Base de datos

Crear la base de datos:

```sql
CREATE DATABASE club_padel;
````

## Importar el script:
```bash
mysql -u root -p club_padel < database/club_padel.sql

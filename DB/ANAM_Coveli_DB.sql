USE db_coveli;

-- Tables
CREATE TABLE categories
(
	categoryId INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL
);
INSERT INTO db_coveli.categories (categoryId, category) VALUES (1, 'Incidencia');
INSERT INTO db_coveli.categories (categoryId, category) VALUES (2, 'Siniestro');

CREATE TABLE equipmentlocations
(
    equipmentLocationId INT AUTO_INCREMENT PRIMARY KEY,
    equipmentLocation   VARCHAR(250) NOT NULL
);
INSERT INTO db_coveli.equipmentlocations (equipmentLocationId, equipmentLocation) VALUES (1, 'AICM SEPOMEX (ENCOMIENDA)');
INSERT INTO db_coveli.equipmentlocations (equipmentLocationId, equipmentLocation) VALUES (2, 'AICM ADUANAS (ALMACEN 18)');
INSERT INTO db_coveli.equipmentlocations (equipmentLocationId, equipmentLocation) VALUES (3, 'AICM ADUANAS (PLATAFORMA DE EXPORTACIÓN)');
INSERT INTO db_coveli.equipmentlocations (equipmentLocationId, equipmentLocation) VALUES (4, 'AICM SEPOMEX (Concentrados)');
INSERT INTO db_coveli.equipmentlocations (equipmentLocationId, equipmentLocation) VALUES (5, 'AICM ADUANAS (Acceso Peatonal)');
INSERT INTO db_coveli.equipmentlocations (equipmentLocationId, equipmentLocation) VALUES (6, 'AIFA ADUANAS (ACCESO PEATONAL EXPORTACION)');
INSERT INTO db_coveli.equipmentlocations (equipmentLocationId, equipmentLocation) VALUES (7, 'AIFA ADUANAS (ACCESO PEATONAL IMPORTACIÓN)');
INSERT INTO db_coveli.equipmentlocations (equipmentLocationId, equipmentLocation) VALUES (8, 'AIFA ADUANAS (CENTRAL)');
INSERT INTO db_coveli.equipmentlocations (equipmentLocationId, equipmentLocation) VALUES (9, 'AIFA ADUANAS (PLATAFORMA  DE IMPORTACION)');
INSERT INTO db_coveli.equipmentlocations (equipmentLocationId, equipmentLocation) VALUES (10, 'AIFA ADUANAS (PLATAFORMA  DE EXPORTACION)');

CREATE TABLE equipmentmodels
(
    equipmentModelId INT AUTO_INCREMENT PRIMARY KEY,
    equipmentModel   VARCHAR(250) NOT NULL,
    atentionTime     INT          NOT NULL
);
INSERT INTO db_coveli.equipmentmodels (equipmentModelId, equipmentModel, atentionTime) VALUES (1, 'CX100100D', 96);
INSERT INTO db_coveli.equipmentmodels (equipmentModelId, equipmentModel, atentionTime) VALUES (2, 'CX180180D', 96);
INSERT INTO db_coveli.equipmentmodels (equipmentModelId, equipmentModel, atentionTime) VALUES (3, 'HI-PE PLUS ', 48);
INSERT INTO db_coveli.equipmentmodels (equipmentModelId, equipmentModel, atentionTime) VALUES (4, 'FS6000', 96);

CREATE TABLE equipmentserials
(
    equipmentSerialId INT AUTO_INCREMENT PRIMARY KEY,
    equipmentModelId  INT NOT NULL,
    equipmentSerial   VARCHAR(250) NOT NULL,
    CONSTRAINT FK_equipmentserials_equipmentmodels FOREIGN KEY (equipmentModelId) REFERENCES equipmentmodels (equipmentModelId)
);
INSERT INTO db_coveli.equipmentserials (equipmentSerialId, equipmentModelId, equipmentSerial) VALUES (1, 1, 'TFNAP13220086');
INSERT INTO db_coveli.equipmentserials (equipmentSerialId, equipmentModelId, equipmentSerial) VALUES (2, 1, 'TFNAP13220087');
INSERT INTO db_coveli.equipmentserials (equipmentSerialId, equipmentModelId, equipmentSerial) VALUES (3, 1, 'TFNAP13220088');
INSERT INTO db_coveli.equipmentserials (equipmentSerialId, equipmentModelId, equipmentSerial) VALUES (4, 1, 'TFNAP13220089');
INSERT INTO db_coveli.equipmentserials (equipmentSerialId, equipmentModelId, equipmentSerial) VALUES (5, 1, 'TFNAP13220090');
INSERT INTO db_coveli.equipmentserials (equipmentSerialId, equipmentModelId, equipmentSerial) VALUES (6, 1, 'TFNAP13220091');
INSERT INTO db_coveli.equipmentserials (equipmentSerialId, equipmentModelId, equipmentSerial) VALUES (7, 1, 'TFNAP13220092');
INSERT INTO db_coveli.equipmentserials (equipmentSerialId, equipmentModelId, equipmentSerial) VALUES (8, 1, 'TFNAP13220093');
INSERT INTO db_coveli.equipmentserials (equipmentSerialId, equipmentModelId, equipmentSerial) VALUES (9, 1, 'TFNAP13220094');
INSERT INTO db_coveli.equipmentserials (equipmentSerialId, equipmentModelId, equipmentSerial) VALUES (10, 1, 'TFNAP13220095');

CREATE TABLE equipmentmodelsbyequipmentlocatios
(
    equipmentModelId    INT NOT NULL,
    equipmentLocationId INT NOT NULL,
    equipmentSerialId   INT NULL,
    CONSTRAINT FK_equipmentmodelsbyequipmentlocatios_equipmentlocations FOREIGN KEY(equipmentLocationId) REFERENCES equipmentlocations (equipmentLocationId),
    CONSTRAINT FK_equipmentmodelsbyequipmentlocatios_equipmentmodels FOREIGN KEY(equipmentModelId) REFERENCES equipmentmodels (equipmentModelId),
    CONSTRAINT FK_equipmentmodelsbyequipmentlocatios_equipmentserials FOREIGN KEY (equipmentSerialId) REFERENCES equipmentserials (equipmentSerialId)
);
INSERT INTO db_coveli.equipmentmodelsbyequipmentlocatios (equipmentModelId, equipmentLocationId, equipmentSerialId) VALUES (1, 1, 1);
INSERT INTO db_coveli.equipmentmodelsbyequipmentlocatios (equipmentModelId, equipmentLocationId, equipmentSerialId) VALUES (1, 2, 2);
INSERT INTO db_coveli.equipmentmodelsbyequipmentlocatios (equipmentModelId, equipmentLocationId, equipmentSerialId) VALUES (1, 2, 3);
INSERT INTO db_coveli.equipmentmodelsbyequipmentlocatios (equipmentModelId, equipmentLocationId, equipmentSerialId) VALUES (1, 3, 4);
INSERT INTO db_coveli.equipmentmodelsbyequipmentlocatios (equipmentModelId, equipmentLocationId, equipmentSerialId) VALUES (1, 4, 5);
INSERT INTO db_coveli.equipmentmodelsbyequipmentlocatios (equipmentModelId, equipmentLocationId, equipmentSerialId) VALUES (1, 4, 6);
INSERT INTO db_coveli.equipmentmodelsbyequipmentlocatios (equipmentModelId, equipmentLocationId, equipmentSerialId) VALUES (1, 5, 7);
INSERT INTO db_coveli.equipmentmodelsbyequipmentlocatios (equipmentModelId, equipmentLocationId, equipmentSerialId) VALUES (1, 6, 8);
INSERT INTO db_coveli.equipmentmodelsbyequipmentlocatios (equipmentModelId, equipmentLocationId, equipmentSerialId) VALUES (1, 7, 9);
INSERT INTO db_coveli.equipmentmodelsbyequipmentlocatios (equipmentModelId, equipmentLocationId, equipmentSerialId) VALUES (1, 8, 10);

CREATE TABLE priorities 
(
	priorityId INT AUTO_INCREMENT PRIMARY KEY,
    priority   VARCHAR(50) NULL
);
INSERT INTO db_coveli.priorities (priorityId, priority) VALUES (1, 'Alta');
INSERT INTO db_coveli.priorities (priorityId, priority) VALUES (2, 'Media');
INSERT INTO db_coveli.priorities (priorityId, priority) VALUES (3, 'Baja');

CREATE TABLE status
(
    statusId INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(150) NOT NULL,
    typeStatus VARCHAR(100) NOT NULL
);
INSERT INTO db_coveli.status (statusId, status, typeStatus) VALUES (1, 'Activado', 'users');
INSERT INTO db_coveli.status (statusId, status, typeStatus) VALUES (2, 'Desactivado', 'users');
INSERT INTO db_coveli.status (statusId, status, typeStatus) VALUES (3, 'Eliminado', 'users');
INSERT INTO db_coveli.status (statusId, status, typeStatus) VALUES (4, 'Abierto', 'tickets');
INSERT INTO db_coveli.status (statusId, status, typeStatus) VALUES (5, 'Asignado', 'tickets');
INSERT INTO db_coveli.status (statusId, status, typeStatus) VALUES (6, 'Pausado', 'tickets');
INSERT INTO db_coveli.status (statusId, status, typeStatus) VALUES (7, 'En revisión', 'tickets');
INSERT INTO db_coveli.status (statusId, status, typeStatus) VALUES (8, 'Reicindente', 'tickets');
INSERT INTO db_coveli.status (statusId, status, typeStatus) VALUES (9, 'Cerrado', 'tickets');
INSERT INTO db_coveli.status (statusId, status, typeStatus) VALUES (10, 'Reasignado', 'tickets');

CREATE TABLE tickets
(
	ticketId            INT AUTO_INCREMENT PRIMARY KEY,
    categoryId          INT NOT NULL,
    equipmentLocationId INT NOT NULL,
    equipmentModelId    INT NOT NULL,
    equipmentSerialId   INT NOT NULL,
    modificationDate    DATETIME NOT NULL,
    onTime              TINYINT NULL,
    openDate            DATETIME NOT NULL,
    priorityId          INT NULL,
    situation           VARCHAR(250) NULL,
    statusId            INT DEFAULT 0 NOT NULL,
    CONSTRAINT FK_tickets_categories FOREIGN KEY (categoryId) REFERENCES categories (categoryId),
    CONSTRAINT FK_tickets_equipmentlocations FOREIGN KEY (equipmentLocationId) REFERENCES equipmentlocations (equipmentLocationId),
    CONSTRAINT FK_tickets_equipmentmodels FOREIGN KEY (equipmentModelId) REFERENCES equipmentmodels (equipmentModelId),
    CONSTRAINT FK_tickets_equipmentserials FOREIGN KEY (equipmentSerialId) REFERENCES equipmentserials (equipmentSerialId),
    CONSTRAINT FK_tickets_priorities FOREIGN KEY (priorityId) REFERENCES priorities (priorityId),
    CONSTRAINT FK_tickets_status FOREIGN KEY (statusId) REFERENCES status (statusId)
);

CREATE TABLE roles
(
    roleId INT AUTO_INCREMENT PRIMARY KEY,
    role   VARCHAR(50) NOT NULL
);
INSERT INTO db_coveli.roles (roleId, role) VALUES (1, 'Administrador');
INSERT INTO db_coveli.roles (roleId, role) VALUES (2, 'Cliente');
INSERT INTO db_coveli.roles (roleId, role) VALUES (3, 'Técnico');
INSERT INTO db_coveli.roles (roleId, role) VALUES (4, 'Supervisor');
INSERT INTO db_coveli.roles (roleId, role) VALUES (5, 'Monitorista');

CREATE TABLE users
(
    userId INT AUTO_INCREMENT PRIMARY KEY,
    fullName             VARCHAR(500) NOT NULL,
    email                VARCHAR(250) NOT NULL,
    password             VARCHAR(500) NOT NULL,
    statusId             INT          NOT NULL,
    roleId               INT          NOT NULL,
    resetPasswordToken   VARCHAR(128) NULL,
    resetPasswordExpires DATETIME     NULL,
    CONSTRAINT FK_users_roles FOREIGN KEY (roleId) REFERENCES roles (roleId),
    CONSTRAINT FK_users_status FOREIGN KEY (statusId) REFERENCES status (statusId)
);

CREATE TABLE ticketshistory
(
    ticketsHistoryId INT AUTO_INCREMENT PRIMARY KEY,
    ticketId         INT           NOT NULL,
    comment          VARCHAR(2000) NULL,
    currentDate      DATETIME      NOT NULL,
    elapsedTime      INT           NULL,
    technicalID      INT           NULL,
    statusId         INT           NOT NULL,
    userId           INT           NOT NULL,
    CONSTRAINT FK_ticketshistory_status FOREIGN KEY (statusId) REFERENCES status (statusId),
    CONSTRAINT FK_ticketshistory_tickets FOREIGN KEY (ticketId) REFERENCES tickets (ticketId),
    CONSTRAINT FK_ticketshistory_users FOREIGN KEY (userId) REFERENCES users (userId)
);
CREATE INDEX FK_ticketshistory_tickets_idx ON ticketshistory (ticketId);

CREATE TABLE evidences
(
    ticketHistoryId INT NOT NULL,
    evidencia       LONGTEXT NOT NULL,
    CONSTRAINT FK_evidences_ticketshistory FOREIGN KEY(ticketHistoryId) REFERENCES ticketshistory (ticketsHistoryId)
);

CREATE TABLE viewsbyrole
(
    roleId INT NOT NULL,
    path VARCHAR(128) NULL,
    CONSTRAINT viewsbyrole_ibfk_1 FOREIGN KEY(roleId) REFERENCES roles (roleId)
);
CREATE INDEX roleId ON viewsbyrole (roleId);
INSERT INTO db_coveli.viewsbyrole (roleId, path) VALUES (1, '/homeA');
INSERT INTO db_coveli.viewsbyrole (roleId, path) VALUES (2, '/homeC');
INSERT INTO db_coveli.viewsbyrole (roleId, path) VALUES (3, '/homeT');
INSERT INTO db_coveli.viewsbyrole (roleId, path) VALUES (4, '/homeS');
INSERT INTO db_coveli.viewsbyrole (roleId, path) VALUES (5, '/homeM');
INSERT INTO db_coveli.viewsbyrole (roleId, path) VALUES (1, '/users');

SELECT * FROM categories;
SELECT * FROM equipmentlocations;
SELECT * FROM equipmentmodels;
SELECT * FROM equipmentserials;
SELECT * FROM equipmentmodelsbyequipmentlocatios;
SELECT * FROM priorities;
SELECT * FROM status;
SELECT * FROM roles;
SELECT * FROM viewsbyrole;

-- Procedures

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE access_by_user(IN userId INT, IN nextPath VARCHAR(64))
BEGIN
	SELECT CASE WHEN (select v.path from viewsbyrole v where v.roleid = r.roleid and v.path = nextPath) IS NULL THEN false ELSE true END result FROM users u
    LEFT JOIN roles r ON u.roleid = r.roleid
    WHERE u.userid = userId;
END //
DELIMITER ;

DELIMITER //
CREATE
DEFINER = anam@`192.168.%` PROCEDURE add_evidences(IN p_ticketHistoryId INT, IN p_evidencia LONGTEXT)
BEGIN
INSERT INTO evidences
VALUES(p_ticketHistoryId,p_evidencia);
END //
DELIMITER ;

DELIMITER //
CREATE
    DEFINER = anam@`192.168.%` PROCEDURE add_ticket(IN p_categoryId INT, IN p_equipmentLocationId INT,
                                                    IN p_equipmentModelId INT, IN p_equipmentSerialId INT,
                                                    IN p_situation VARCHAR(250), IN p_comment VARCHAR(2000),
                                                    IN p_userid INT, OUT p_ticketHistoyID INT, OUT p_result TINYINT,
                                                    OUT p_message VARCHAR(250))
BEGIN 
    
    INSERT INTO Tickets 
    VALUES (0,p_categoryId,p_equipmentLocationId,p_equipmentModelId,p_equipmentSerialId,NOW(), NULL,NOW(),NULL,p_situation, 4);    
    SET @ticket = LAST_INSERT_ID();
	INSERT INTO TicketsHistory     
	VALUES(0, @ticket ,p_comment, NOW(),0,NULL,4,p_userid);        
    SET @tiketHistory = (SELECT ticketsHistoryId FROM ticketshistory WHERE ticketId = @ticket ORDER BY ticketsHistoryId DESC LIMIT 1);   
    
    IF(@ticket > 0 AND @tiketHistory > 0) THEN
		SET p_ticketHistoyID = @tiketHistory;
		SET p_result = 1;
        SET p_message = '¡Se ha creado un nuevo ticket!';
    ELSE
		SET p_ticketHistoyID = @tiketHistory;
		SET p_result = 0;
        SET p_message = '¡El ticket no se pudo crear!';
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE
    DEFINER = anam@`192.168.%` PROCEDURE add_user(IN p_fullname VARCHAR(500), IN p_email VARCHAR(250),
                                                  IN p_password VARCHAR(500), IN p_roleid INT, OUT p_result TINYINT,
                                                  OUT p_message VARCHAR(500))
BEGIN	
	SET p_result = 1;
    SET p_message = '';    
    SET @count = (SELECT count(*) FROM users WHERE email=p_email AND statusid = 1);    
    
    IF @count = 1 THEN      
     SET p_result = 0;
     SET p_message = CONCAT('El usuario ' , p_email , ', ya existe!');
	ELSE
		INSERT INTO USERS VALUES (0,p_fullname, p_email, p_password, 1, p_roleid, NULL, NULL);
        SET @count = (SELECT count(*) FROM users WHERE email=p_email AND statusid = 1);    
        IF @count = 0 THEN
			SET p_result = 0;
			SET p_message = CONCAT('¡No se guardó el usario!');
		ELSE
			SET p_result = 1;
			SET p_message = CONCAT('¡Usuario guardado correctamente!');
        END IF;        
	END IF;    
END //
DELIMITER ;

DELIMITER //
CREATE
    DEFINER = anam@`192.168.%` PROCEDURE create_forgot_password_token(IN userEmail VARCHAR(128), IN token VARCHAR(128))
BEGIN
	UPDATE users
    SET 
		resetPasswordToken = token,
        resetPasswordExpires = date_add(NOW(),INTERVAL 60 MINUTE)
	WHERE
		email = userEmail;
END //
DELIMITER ;

DELIMITER //
CREATE
    DEFINER = anam@`192.168.%` PROCEDURE get_accesible_views(IN p_roleId INT)
BEGIN
	SELECT path FROM viewsbyrole WHERE roleId = p_roleId;
END //
DELIMITER ;

DELIMITER //
CREATE
    DEFINER = anam@`192.168.%` PROCEDURE get_all_tickets_count()
BEGIN
	SELECT COUNT(*) AS count FROM tickets;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_all_tickets_count_by_status(IN p_statusid VARCHAR(250), IN p_userid INT)
BEGIN

	SET @roleid = (SELECT CASE WHEN count(roleid) > 0 THEN roleid ELSE 0 END as roleid FROM users WHERE userid = p_userid);

	SELECT COUNT(DISTINCT t.ticketId) as count
	FROM tickets t
	INNER JOIN categories c ON (t.categoryId = c.categoryId)
	INNER JOIN equipmentlocations eql ON (t.equipmentLocationId = eql.equipmentLocationId)
	INNER JOIN equipmentmodels eqm ON (t.equipmentModelId = eqm.equipmentModelId)
	INNER JOIN equipmentserials eqs ON (t.equipmentSerialId = eqs.equipmentSerialId)
	INNER JOIN status s ON (t.statusId = s.statusId)
	INNER JOIN priorities p ON (t.priorityId = p.priorityId OR t.priorityId IS NULL)    
    INNER JOIN ticketsHistory th ON (t.ticketId = th.ticketId)    
    WHERE ((@roleid = 3 AND th.technicalid = p_userid) OR (p_userid = 0 OR th.userid = p_userid))    
    AND FIND_IN_SET(t.statusid, p_statusid)
    ORDER BY t.priorityId ASC, t.ticketId ASC;	
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_equipments_by_Location(IN p_equipmentLocationId INT)
BEGIN
	SELECT DISTINCT p_equipmentLocationId equipmentLocationId, eqml.equipmentModelId, eqm.equipmentModel
	FROM equipmentmodelsbyequipmentlocatios eqml
	INNER JOIN equipmentmodels eqm ON (eqml.equipmentModelId = eqm.equipmentModelId)
	WHERE eqml.equipmentLocationId = p_equipmentLocationId
	ORDER BY eqm.equipmentModel;    
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_equipmentsLocations()
BEGIN
 SELECT equipmentlocationId, equipmentlocation FROM equipmentLocations;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_graph(IN searchedPeriod VARCHAR(20))
BEGIN
	SELECT period, date, priorityId, count, statusId FROM (
    SELECT 'Monthly' AS search, MONTH(openDate) AS period, DATE(openDate) AS date, t.priorityId, count(t.statusId) as count, t.statusId
        FROM tickets t
		WHERE MONTH(openDate) = MONTH(NOW())
        GROUP BY t.statusId, t.priorityId
	UNION ALL        
	SELECT 'Weekly' as search, DAYOFWEEK(openDate) AS period, DATE(openDate) AS date, t.priorityId, COUNT(t.priorityId) as count, t.statusId
        FROM tickets t
		WHERE WEEK(openDate) = WEEK(NOW())
        GROUP BY t.statusId, t.priorityId)
	AS Graph WHERE search = searchedPeriod;			
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_priorities()
BEGIN
	SELECT priorityId, priority FROM priorities;
END //
DELIMITER ;

DELIMITER //
CREATE
    DEFINER = anam@`192.168.%` PROCEDURE get_roles()
BEGIN
	SELECT * FROM roles;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_serials_by_Location(IN p_equipmentLocationId INT, IN p_equipmentModelId INT)
BEGIN
	SELECT eqs.equipmentSerialId, eqs.equipmentSerial
	FROM equipmentmodelsbyequipmentlocatios eqml		
	INNER JOIN equipmentserials eqs ON (eqml.equipmentSerialId = eqs.equipmentSerialId)
    WHERE eqml.equipmentLocationId = p_equipmentLocationId AND eqml.equipmentModelId = p_equipmentModelId
	ORDER BY eqs.equipmentSerial;    
END;
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_ticketHistory(IN p_ticketId INT)
BEGIN
SELECT th.comment,  DATE_FORMAT(th.currentDate, "%M %d, %Y %r") currentDate,
CONCAT(FLOOR(th.elapsedTime/3600), 'h ',
FLOOR(((th.elapsedTime)%3600)/60), "m ",
FLOOR((((th.elapsedTime)%3600)%60)), 's') elapsedTime,
tu.fullName technicalFullName, s.status,
u.fullName userFullName
from ticketshistory th
LEFT JOIN users tu ON (th.technicalID = tu.userId and th.statusId = 5)
INNER JOIN status s ON (th.statusid = s.statusid)
INNER JOIN users u on (th.userId = u.userId)
WHERE th.ticketId = p_ticketId;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_tickets()
BEGIN
SELECT DISTINCT t.ticketId, t.categoryId, c.category, t.equipmentLocationId, eql.equipmentLocation,  
t.equipmentModelId, eqm.equipmentModel, t.equipmentSerialId, eqs.equipmentSerial,
DATE_FORMAT(t.modificationDate, "%M %d, %Y %r") modificationDate, t.onTime, DATE_FORMAT(t.openDate, "%M %d, %Y %r") openDate,t.priorityId, p.priority, t.situation,t.statusid,s.status 
FROM tickets t
INNER JOIN categories c ON (t.categoryId = c.categoryId)
INNER JOIN equipmentlocations eql ON (t.equipmentLocationId = eql.equipmentLocationId)
INNER JOIN equipmentmodels eqm ON (t.equipmentModelId = eqm.equipmentModelId)
INNER JOIN equipmentserials eqs ON (t.equipmentSerialId = eqs.equipmentSerialId)
INNER JOIN status s ON (t.statusId = s.statusId)
INNER JOIN priorities p ON (t.priorityId = p.priorityId OR t.priorityId IS NULL)
ORDER BY t.ticketId;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_tickets_by_status(IN p_status VARCHAR(128), IN p_userid INT)
BEGIN
	SET lc_time_names = 'es_MX';
	SET @roleid = (SELECT CASE WHEN count(roleid) > 0 THEN roleid ELSE 0 END as roleid  FROM users WHERE userid = p_userid);
	
    SELECT DISTINCT t.ticketId, t.categoryId, c.category, t.equipmentLocationId, eql.equipmentLocation,  
	t.equipmentModelId, eqm.equipmentModel, t.equipmentSerialId, eqs.equipmentSerial,
	DATE_FORMAT(t.modificationDate, "%M %d, %Y %r") modificationDate, t.onTime, DATE_FORMAT(t.openDate, "%M %d, %Y %r") openDate,t.priorityId, CASE WHEN t.priorityId IS NULL THEN '' ELSE p.priority END priority, t.situation,t.statusid,s.status,
    (SELECT DISTINCT cu.userID AS client FROM ticketsHistory thh INNER JOIN users cu ON (thh.userid = cu.userid) WHERE thh.ticketid = th.ticketid AND thh.statusId =  4) AS clientId,
    (SELECT DISTINCT cu.fullName AS client FROM ticketsHistory thh INNER JOIN users cu ON (thh.userid = cu.userid) WHERE thh.ticketid = th.ticketid AND thh.statusId =  4) AS client,
    (SELECT DISTINCT thh.technicalId as technicalId FROM ticketsHistory thh INNER JOIN users tu ON (thh.technicalId = tu.userid) WHERE thh.ticketid = th.ticketid AND  thh.statusId =  5 ORDER BY thh.ticketshistoryid ASC LIMIT 1) AS technicalId,
    (SELECT DISTINCT tu.fullName AS technical FROM ticketsHistory thh INNER JOIN users tu ON (thh.technicalId = tu.userid) WHERE thh.ticketid = th.ticketid AND thh.statusId =  5 ORDER BY thh.ticketshistoryid ASC LIMIT 1) AS technical,t.situation
	FROM tickets 
	INNER JOIN categories c ON (t.categoryId = c.categoryId)
	INNER JOIN equipmentlocations eql ON (t.equipmentLocationId = eql.equipmentLocationId)
	INNER JOIN equipmentmodels eqm ON (t.equipmentModelId = eqm.equipmentModelId)
	INNER JOIN equipmentserials eqs ON (t.equipmentSerialId = eqs.equipmentSerialId)
	INNER JOIN status s ON (t.statusId = s.statusId)
	INNER JOIN priorities p ON (t.priorityId = p.priorityId OR t.priorityId IS NULL)    
    INNER JOIN ticketsHistory th ON (t.ticketId = th.ticketId)    
    WHERE ((@roleid = 3 AND th.technicalid = p_userid) OR (p_userid = 0 OR th.userid = p_userid))    
    AND FIND_IN_SET(t.statusid, p_status)
    ORDER BY t.priorityId ASC , t.ticketId ASC;	
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_tickets_by_user(IN p_userId INT)
BEGIN
	SET lc_time_names = 'es_MX';
	SET @userRole = (SELECT roleId FROM users WHERE userId = p_userId);

	IF @userRole = 3 THEN
        SELECT t.ticketId, situation, fullName, currentDate, priority, p.priorityId, s.statusId
        FROM tickets t 
        LEFT JOIN status s ON (s.statusId = t.statusId)
		LEFT JOIN ticketshistory th ON (th.ticketId = t.ticketId AND th.currentDate = t.modificationDate)
        LEFT JOIN users u ON (u.userId = th.userId)
        LEFT JOIN priorities p ON (p.priorityId = t.priorityId)
        WHERE t.ticketId 
        IN (SELECT distinct(t.ticketId)
        FROM tickets t
		LEFT JOIN ticketshistory th ON (t.ticketId = th.ticketId)
		WHERE th.statusId = t.statusId AND technicalId = p_userId)
        ORDER BY priorityId ASC;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_tickets_stats()
BEGIN
	SELECT CASE WHEN
    ( SELECT CASE WHEN MONTH(t.openDate) = MONTH(NOW()) THEN 
		CONCAT(
		FLOOR((sum(elapsedTime)/count(*))/3600),"h ",
        FLOOR(((sum(elapsedTime)/count(*))%3600)/60), "m")
        ELSE
        '0h 0m'
        END	as time
		FROM ticketsHistory th
		INNER JOIN tickets t
		ON t.ticketId = th.ticketId
		WHERE th.statusId = 9 
		AND t.priorityId = p.priorityId
		GROUP BY t.priorityId
	) 
    IS NULL THEN '0h 0m' ELSE
    ( SELECT CASE WHEN MONTH(t.openDate) = MONTH(NOW()) THEN 
		CONCAT(
		FLOOR((sum(elapsedTime)/count(*))/3600),"h ",
        FLOOR(((sum(elapsedTime)/count(*))%3600)/60), "m")
        ELSE
        '0h 0m'
        END	as time
		FROM ticketsHistory th
		INNER JOIN tickets t
		ON t.ticketId = th.ticketId
		WHERE th.statusId = 9 
		AND t.priorityId = p.priorityId
		GROUP BY t.priorityId
	) 
END AS time,
p.priorityId
from priorities p;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_user(IN p_userId INT)
BEGIN
	SELECT U.USERID, U.FULLNAME, U.EMAIL, U.STATUSID, S.STATUS, U.ROLEID, R.ROLE  FROM USERS U 
	INNER JOIN STATUS S ON (U.STATUSID = S.STATUSID)
	INNER JOIN ROLES R ON (U.ROLEID = R.ROLEID)
    WHERE U.userId = p_userId;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_user_by_email(IN p_email VARCHAR(256))
BEGIN
	SELECT * FROM Users WHERE email = p_email;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE get_users()
BEGIN
	SELECT U.USERID, U.FULLNAME, U.EMAIL, U.STATUSID, S.STATUS, U.ROLEID, R.ROLE  FROM USERS U 
	INNER JOIN STATUS S ON (U.STATUSID = S.STATUSID)
	INNER JOIN ROLES R ON (U.ROLEID = R.ROLEID);
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` procedure get_users_by_rol(IN p_roleId int)
BEGIN
	SELECT U.userId, U.fullName, U.email, U.statusId, S.status, U.roleId, R.role  FROM USERS U 
	INNER JOIN STATUS S ON (U.STATUSID = S.STATUSID)
	INNER JOIN ROLES R ON (U.ROLEID = R.ROLEID)
    WHERE U.roleId = p_roleId;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE out_of_time_tickets()
BEGIN 
	SELECT COUNT(ticketId) AS count FROM tickets
    WHERE onTime = 0;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE tickets_technical_count_by_status(IN p_userId INT, IN p_status INT)
BEGIN
	IF p_status <> 9 THEN -- Without attendance
		SELECT COUNT(DISTINCT(t.ticketId)) AS count FROM ticketshistory th
		INNER JOIN tickets t ON (t.ticketId = th.ticketId)
		WHERE th.technicalID = p_userId AND th.statusId = p_status AND t.statusId <> 9;
	ELSE IF p_status = 9 THEN -- Paused
		SELECT COUNT(DISTINCT(t.ticketId)) AS count FROM ticketshistory th
		INNER JOIN tickets t ON (t.ticketId = th.ticketId)
		WHERE th.technicalID = 1 AND th.statusId = 9 AND t.statusId = 9;
    END IF;
	END IF;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE todays_tickets()
BEGIN
	SELECT COUNT(*) AS count FROM tickets
    WHERE DATE(openDate) = CURDATE();
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE update_status_user(IN p_userid INT, IN p_statusid INT, OUT p_result TINYINT, OUT p_message VARCHAR(500))
BEGIN
	SET p_result = 1;
    SET p_message = '';    
    SET @count = (SELECT count(*) FROM users U WHERE U.userid = p_userid);
    
    IF @count = 0 THEN
		SET p_result = 0;
		SET p_message = '¡El usuario que intenta no existe!';    
	ELSE    
			UPDATE Users U
			SET U.statusid = p_statusid
			WHERE U.userid = p_userid;    
            
            SET p_result = 1;
            
            IF p_statusid = 1 THEN				
				SET p_message = '¡El usuario ha sido activado!';    
            ELSE IF p_statusid = 2 THEN
				SET p_message = '¡El usuario ha sido desactivado!'; 			
			ELSE IF p_statusid = 3 THEN
				set p_message = '¡El usuario ha sido eliminado!'; 			
			END IF;
			END IF;
            END IF;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE update_ticket(IN p_userId INT, IN p_ticketId INT, IN p_statusId INT, IN p_comment VARCHAR(2000), IN p_technicalId INT, IN p_priorityId INT, OUT p_ticketHistoyID INT, OUT p_result TINYINT, OUT p_message VARCHAR(250))
BEGIN
	SET @tiketHistory = 0;
	-- Obtener Rol del usuario
	SET @roleid = (SELECT CASE WHEN count(roleid) > 0 THEN roleid ELSE 0 END AS roleid FROM users WHERE userid = p_userId);
    SET @onTime = NULL;
    -- Obtener ElapsedTime entre el registro actual y el último insertado en TicketsHistory
    SET @elapsedTime = (
		SELECT
		CASE WHEN datediff(currentDate,now()) = 0 THEN
		TIME_TO_SEC(TIMEDIFF(NOW(),currentDate)) ELSE
		TIME_TO_SEC(TIMEDIFF(currentDate,NOW())) END segundos
		FROM TicketsHistory 
		WHERE ticketid= p_ticketId        
		ORDER BY ticketshistoryId DESC
		LIMIT 1);
	
    IF p_statusId = 9 THEN
			SET @onTime = (
            SELECT CASE WHEN sum(elapsedTime)/3600 > em.atentionTime THEN 0 ELSE 1 END OnTime FROM tickets t
			INNER JOIN equipmentModels em ON (t.equipmentModelId = em.equipmentModelId)
			INNER JOIN TicketsHistory th ON (t.ticketId = th.ticketId)
			WHERE t.ticketId = p_ticketId);
	END IF;
    
    IF @roleid = 5 THEN
		UPDATE Tickets 
		SET statusId = p_statusID, modificationDate = NOW(), onTime = @onTime, priorityId = p_priorityId
		WHERE ticketId = p_ticketId;
    ELSE
		UPDATE Tickets
		SET statusId = p_statusID, modificationDate = NOW(), onTime = @onTime
		WHERE ticketId = p_ticketId;    
    END IF;
    
	IF @roleid = 5 THEN		
		-- INSERT REGISTRO ROl MONITORISTA        
		INSERT INTO  TicketsHistory
        VALUES (0, p_ticketId, p_comment, NOW(), @elapsedTime, p_technicalId, p_statusId, p_userId);                
    ELSE IF @roleid = 3 THEN
		-- INSERT REGISTRO ROl TÉCNICO
        IF p_statusId = 6 or p_statusId = 7 THEN
			-- SE AGREGA ELAPSEDTIME SOLO CUANDO LOS PAUSA Y CUANDO LO PONE EN REVISIÓN
			INSERT INTO  TicketsHistory
			VALUES (0, p_ticketId, p_comment, NOW(), @elapsedTime, p_userId, p_statusId, p_userId);                    
		ELSE IF p_statusId = 5 THEN
			-- NO SE AGREGA ELAPSEDTIME CUANDO QUITA LA PAUSA
			INSERT INTO  TicketsHistory
			VALUES (0, p_ticketId, p_comment, NOW(), 0, p_userId, p_statusId, p_userId);                    
        END IF;
		END IF;
	ELSE IF @roleid = 4 THEN            
		INSERT INTO TicketsHistory (ticketsHistoryId, ticketId, comment, currentDate, elapsedTime, technicalID, statusId, userId)
		SELECT 0,ticketId,p_comment,NOW(),(SELECT sum(elapsedTime) FROM TicketsHistory WHERE ticketid= p_ticketId)
        ,technicalID,p_statusId,p_userId FROM TicketsHistory
		WHERE ticketid= p_ticketId
		ORDER BY ticketshistoryId DESC
		LIMIT 1;
	ELSE IF @roleid = 2 THEN
		INSERT INTO TicketsHistory (ticketsHistoryId, ticketId, comment, currentDate, elapsedTime, technicalID, statusId, userId)
		SELECT 0,ticketId,p_comment,NOW(),0,technicalID,p_statusId,p_userId FROM TicketsHistory
		WHERE ticketid= p_ticketId
		ORDER BY ticketshistoryId DESC
		LIMIT 1;          
	END IF;
    END IF;
    END IF;
    END IF;
    
    SET @tiketHistory = (SELECT ticketsHistoryId FROM ticketshistory WHERE ticketId = p_ticketId ORDER BY ticketsHistoryId DESC LIMIT 1);
    
    IF(@tiketHistory > 0) THEN
		SET p_ticketHistoyID = @tiketHistory;
		SET p_result = 1;
        
        IF @roleid = 1 THEN
			SET p_message = '¡ticketsHistoy acutalizado!';
        ELSE IF @roleid = 2  THEN
			SET p_message = '¡Ticket Rechazado!';
		ELSE IF @roleid = 3  THEN
			SET p_message = '¡ticketsHistoy acutalizado!';
		ELSE IF @roleid = 5  THEN
			SET p_message = '¡Ticket asignado correctamente!';
		ELSE IF @roleid = 5  THEN
			SET p_message = '¡ticketsHistoy acutalizado!';
        END IF;
        END IF;
        END IF;
        END IF;
        END IF;
        
    ELSE
		SET p_ticketHistoyID = @tiketHistory;
		SET p_result = 0;
        -- SET p_message = '¡No se pudo actualizar ticketsHistory!';
        SET p_message = CONCAT('p_userId: ' , p_userId, 'p_ticketId: ' , p_ticketId, 'p_statusId: ', p_statusId, 'p_comment: ' , p_comment, 'p_technicalId: ', p_technicalId, 'p_priorityId: ', p_priorityId);		
        
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE update_user_password(IN resetToken VARCHAR(250), IN newPassword VARCHAR(300))
BEGIN
	UPDATE users
    SET
		password = newPassword
	WHERE
		resetPasswordToken = resetToken;
	
	UPDATE users
        SET resetPasswordToken = NULL,
		users.resetPasswordExpires = NULL
		WHERE resetPasswordToken = token;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE validate_forgot_token(IN token VARCHAR(128))
BEGIN
	SET @expiration = 0;
    
    SELECT CASE WHEN (resetPasswordExpires - NOW()) <= 0 THEN @expiration = 1 END
    FROM users
	WHERE resetPasswordToken = token;

	SELECT @expiration;
    
	IF(@expiration) THEN
		UPDATE users
        SET resetPasswordToken = NULL,
		users.resetPasswordExpires = NULL
		WHERE resetPasswordToken = token;
        SELECT 0 AS keyExists;
    ELSE
        SELECT
		EXISTS(
		SELECT userId FROM users WHERE resetPasswordToken = token
		) AS keyExists;
	END IF;
END //
DELIMITER ;

DELIMITER //
CREATE DEFINER = anam@`192.168.%` PROCEDURE validate_user(INOUT p_email VARCHAR(150), IN p_password VARCHAR(500), OUT p_roleid INT, OUT p_fullname VARCHAR(150), OUT p_userid INT, OUT p_result TINYINT, OUT p_message VARCHAR(250))
BEGIN
	SELECT count(*) INTO @count	FROM Users U  WHERE U.email = p_email AND U.PASSWORD = p_password;
    IF @count = 0 THEN
		SET p_result=0;
        SET p_message='¡Usuario no encontrado!';
    ELSE
		SELECT count(*) INTO @count	FROM Users U  WHERE U.email = p_email AND U.PASSWORD = p_password AND U.statusid = 2;
        IF @count = 1 THEN        
			SET p_result=0;
			SET p_message='¡Usuario se encuentra desactivado!';
		ELSE 
			SELECT count(*) INTO @count	FROM Users U  WHERE U.email = p_email AND U.PASSWORD = p_password AND U.statusid = 3;
			IF @count = 1 then
				SET p_result=0;
			SET p_message='¡Usuario no encontrado!';
            ELSE
				SELECT U.userid,U.email,U.roleid, U.fullname INTO p_userid,p_email,p_roleid,p_fullname 
				FROM Users U  
				WHERE U.email = p_email 
				AND U.PASSWORD = p_password
				AND U.statusid = 1;
				
				SET p_result=1;
				SET p_message='¡Usuario encontrado!';
            END IF;
		END IF;    		
    END IF;
END //
DELIMITER ;
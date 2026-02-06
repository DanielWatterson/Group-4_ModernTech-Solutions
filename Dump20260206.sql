-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: moderntech_hr
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('Present','Absent','Late','Half-day') NOT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`attendance_id`),
  UNIQUE KEY `unique_attendance` (`employee_id`,`date`),
  KEY `idx_attendance_employee_date` (`employee_id`,`date`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `employee_summary_view`
--

DROP TABLE IF EXISTS `employee_summary_view`;
/*!50001 DROP VIEW IF EXISTS `employee_summary_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `employee_summary_view` AS SELECT 
 1 AS `employee_id`,
 1 AS `name`,
 1 AS `position`,
 1 AS `department`,
 1 AS `salary`,
 1 AS `email`,
 1 AS `performance_score`,
 1 AS `performance_status`,
 1 AS `last_net_pay`,
 1 AS `annual_leave_balance`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `email` varchar(150) NOT NULL,
  `employment_history` text DEFAULT NULL,
  `recruitment_date` date DEFAULT curdate(),
  `days_off` int(11) DEFAULT 0,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_employee_department` (`department`),
  KEY `idx_employee_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Sibongile Nkosi','Software Engineer','Development',70000.00,'sibongile.nkosi@moderntech.com','Joined in 2015, promoted to Senior in 2018','2026-02-05',0),(2,'Lungile Moyo','HR Manager','HR',80000.00,'lungile.moyo@moderntech.com','Joined in 2013, promoted to Manager in 2017','2026-02-05',0),(3,'Thabo Molefe','Quality Analyst','QA',55000.00,'thabo.molefe@moderntech.com','Joined in 2018','2026-02-05',0),(4,'Keshav Naidoo','Sales Representative','Sales',60000.00,'keshav.naidoo@moderntech.com','Joined in 2020','2026-02-05',0),(5,'Zanele Khumalo','Marketing Specialist','Marketing',58000.00,'zanele.khumalo@moderntech.com','Joined in 2019','2026-02-05',0),(6,'Sipho Zulu','UI/UX Designer','Design',65000.00,'sipho.zulu@moderntech.com','Joined in 2016','2026-02-05',0),(7,'Naledi Moeketsi','DevOps Engineer','IT',72000.00,'naledi.moeketsi@moderntech.com','Joined in 2017','2026-02-05',0),(8,'Farai Gumbo','Content Strategist','Marketing',56000.00,'farai.gumbo@moderntech.com','Joined in 2021','2026-02-05',0),(9,'Karabo Dlamini','Accountant','Finance',62000.00,'karabo.dlamini@moderntech.com','Joined in 2018','2026-02-05',0),(10,'Fatima Patel','Customer Support Lead','Support',57000.00,'fatima.patel@moderntech.com','Joined in 2016','2026-02-04',0),(11,'Jack Jackson','IT Team Leader','IT',70012.00,'j.jackson@gmail.com','Employeed in 2021','2021-02-11',21);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_balances`
--

DROP TABLE IF EXISTS `leave_balances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_balances` (
  `balance_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `annual_leave` int(11) DEFAULT 15,
  `sick_leave` int(11) DEFAULT 10,
  `family_leave` int(11) DEFAULT 5,
  `unpaid_leave` int(11) DEFAULT 0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`balance_id`),
  UNIQUE KEY `unique_employee_balance` (`employee_id`),
  CONSTRAINT `leave_balances_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_balances`
--

LOCK TABLES `leave_balances` WRITE;
/*!40000 ALTER TABLE `leave_balances` DISABLE KEYS */;
INSERT INTO `leave_balances` VALUES (1,1,15,10,5,0,'2026-02-05 11:34:59'),(2,2,15,10,5,0,'2026-02-05 11:34:59'),(3,3,15,10,5,0,'2026-02-05 11:34:59'),(4,4,15,10,5,0,'2026-02-05 11:34:59'),(5,5,15,10,5,0,'2026-02-05 11:34:59'),(6,6,15,10,5,0,'2026-02-05 11:34:59'),(7,7,15,10,5,0,'2026-02-05 11:34:59'),(8,8,15,10,5,0,'2026-02-05 11:34:59'),(9,9,15,10,5,0,'2026-02-05 11:34:59'),(10,10,15,10,5,0,'2026-02-05 11:34:59');
/*!40000 ALTER TABLE `leave_balances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_requests` (
  `leave_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `leave_type` enum('Annual','Sick','Family','Unpaid','Bereavement','Personal','Vacation','Medical Appointment','Childcare') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('Pending','Approved','Denied') DEFAULT 'Pending',
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `processed_by` int(11) DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`leave_id`),
  KEY `processed_by` (`processed_by`),
  KEY `idx_leave_employee_status` (`employee_id`,`status`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`processed_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_requests`
--

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
INSERT INTO `leave_requests` VALUES (3,7,'Annual','2026-02-06','2026-02-06','Dashboard Approval','Approved','2026-02-06 08:04:29',NULL,NULL),(4,2,'Family','2026-02-06','2026-02-06','Dashboard Denial','Denied','2026-02-06 08:04:37',NULL,NULL),(5,6,'Family','2026-02-06','2026-02-06','Dashboard Denial','Denied','2026-02-06 08:04:38',NULL,NULL),(6,1,'Family','2026-02-06','2026-02-06','Dashboard Denial','Denied','2026-02-06 08:04:38',NULL,NULL);
/*!40000 ALTER TABLE `leave_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll`
--

DROP TABLE IF EXISTS `payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll` (
  `payroll_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `payroll_date` date NOT NULL,
  `hours_worked` int(11) NOT NULL,
  `leave_deductions` int(11) DEFAULT 0,
  `base_salary` decimal(10,2) NOT NULL,
  `gross_pay` decimal(10,2) DEFAULT NULL,
  `tax_deductions` decimal(10,2) DEFAULT NULL,
  `net_pay` decimal(10,2) DEFAULT NULL,
  `is_processed` tinyint(1) DEFAULT 0,
  `processed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`payroll_id`),
  KEY `idx_payroll_employee_date` (`employee_id`,`payroll_date`),
  CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll`
--

LOCK TABLES `payroll` WRITE;
/*!40000 ALTER TABLE `payroll` DISABLE KEYS */;
INSERT INTO `payroll` VALUES (1,1,'2026-02-06',160,0,70000.00,70000.00,17500.00,52500.00,1,'2026-02-06 11:35:09'),(2,2,'2026-02-06',160,0,80000.00,80000.00,20000.00,60000.00,1,'2026-02-06 11:35:09'),(3,11,'2026-02-06',160,0,70012.00,70012.00,17503.00,52509.00,1,'2026-02-06 11:35:09'),(4,5,'2026-02-06',160,0,58000.00,58000.00,14500.00,43500.00,1,'2026-02-06 11:35:09'),(5,6,'2026-02-06',160,0,65000.00,65000.00,16250.00,48750.00,1,'2026-02-06 11:35:09'),(6,4,'2026-02-06',160,0,60000.00,60000.00,15000.00,45000.00,1,'2026-02-06 11:35:09'),(7,3,'2026-02-06',160,0,55000.00,55000.00,13750.00,41250.00,1,'2026-02-06 11:35:09'),(8,8,'2026-02-06',160,0,56000.00,56000.00,14000.00,42000.00,1,'2026-02-06 11:35:09'),(9,7,'2026-02-06',160,1,72000.00,68727.27,17181.82,51545.45,1,'2026-02-06 11:35:09'),(10,9,'2026-02-06',160,0,62000.00,62000.00,15500.00,46500.00,1,'2026-02-06 11:35:09'),(11,10,'2026-02-06',160,0,57000.00,57000.00,14250.00,42750.00,1,'2026-02-06 11:35:09');
/*!40000 ALTER TABLE `payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performance_last_update`
--

DROP TABLE IF EXISTS `performance_last_update`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performance_last_update` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `table_name` varchar(50) NOT NULL DEFAULT 'performance_reviews',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performance_last_update`
--

LOCK TABLES `performance_last_update` WRITE;
/*!40000 ALTER TABLE `performance_last_update` DISABLE KEYS */;
INSERT INTO `performance_last_update` VALUES (1,'2026-02-05 11:34:59','performance_reviews');
/*!40000 ALTER TABLE `performance_last_update` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performance_reviews`
--

DROP TABLE IF EXISTS `performance_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performance_reviews` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `review_date` date NOT NULL,
  `score` int(11) DEFAULT NULL CHECK (`score` >= 0 and `score` <= 100),
  `status` enum('Excellent','Good','Average','Poor') NOT NULL,
  `reviewed_by` int(11) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`review_id`),
  KEY `reviewed_by` (`reviewed_by`),
  KEY `idx_performance_employee_date` (`employee_id`,`review_date`),
  CONSTRAINT `performance_reviews_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  CONSTRAINT `performance_reviews_ibfk_2` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performance_reviews`
--

LOCK TABLES `performance_reviews` WRITE;
/*!40000 ALTER TABLE `performance_reviews` DISABLE KEYS */;
INSERT INTO `performance_reviews` VALUES (1,1,'2025-01-15',88,'Excellent',1,NULL,'2026-02-05 11:34:59'),(2,2,'2025-01-15',74,'Good',1,NULL,'2026-02-05 11:34:59'),(3,3,'2025-01-15',91,'Excellent',1,NULL,'2026-02-05 11:34:59'),(4,4,'2025-01-15',80,'Excellent',1,NULL,'2026-02-05 11:34:59'),(5,5,'2025-01-15',76,'Good',1,NULL,'2026-02-05 11:34:59'),(6,6,'2025-01-15',84,'Excellent',1,NULL,'2026-02-05 11:34:59'),(7,7,'2025-01-15',89,'Excellent',1,NULL,'2026-02-05 11:34:59'),(8,8,'2025-01-15',67,'Average',1,NULL,'2026-02-05 11:34:59'),(9,9,'2025-01-15',71,'Good',1,NULL,'2026-02-05 11:34:59'),(10,10,'2025-01-15',71,'Good',1,NULL,'2026-02-05 11:34:59');
/*!40000 ALTER TABLE `performance_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL,
  `department` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Serena McCoy','HR Manager','Human Resources','SerenaMC@moderntech.com','https://i.postimg.cc/DZYhx5QF/Womens_Glasses_500x580.jpg','admin123','2026-02-05 11:34:59',1),(2,'Mbenki Moyo','HR Manager','Head Administration','mbenkiMoyo02@moderntech.com','https://i.postimg.cc/KvX8FsKG/a-black-man-with-glasses-and-a-beard-photo.jpg','hollery123','2026-02-05 11:34:59',1),(3,'Matthew Anderson','HR Manager','Senior DevOps Engineer','matthew.anderson@moderntech.com','https://i.postimg.cc/5yrvN5C4/happy-middle-aged-professional-business-600nw-2454390621.webp','oldman321123','2026-02-05 11:34:59',1),(4,'Emily Ling','HR Manager','Human Resources','EmiLing@moderntech.com','https://i.postimg.cc/tJcPCdx9/istockphoto-1496615764-612x612.jpg','superkitty@02','2026-02-05 11:34:59',1),(5,'Samuel Jacobs','HR Manager','Human Resources','JacobsSam@moderntech.com','https://i.postimg.cc/L5Wf6k14/plp-mens-eyeglasses-sp-4761c649-2e90-4f54-ab41-79cdb90c3867.webp','skateStar@2524','2026-02-05 11:34:59',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'moderntech_hr'
--
/*!50003 DROP PROCEDURE IF EXISTS `ProcessMonthlyPayroll` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ProcessMonthlyPayroll`(IN payroll_month DATE)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE emp_salary DECIMAL(10,2);
    DECLARE base_rate DECIMAL(10,2);
    DECLARE tax_rate DECIMAL(4,3) DEFAULT 0.25;
    DECLARE avg_days_month INT DEFAULT 22;
    
    -- Cursor for all active employees
    DECLARE emp_cursor CURSOR FOR 
        SELECT employee_id, salary 
        FROM employees 
        WHERE employee_id IN (SELECT DISTINCT employee_id FROM payroll);
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN emp_cursor;
    
    payroll_loop: LOOP
        FETCH emp_cursor INTO emp_id, emp_salary;
        
        IF done THEN
            LEAVE payroll_loop;
        END IF;
        
        -- Calculate daily rate
        SET base_rate = emp_salary / avg_days_month;
        
        -- Insert payroll record (simplified calculation)
        INSERT INTO payroll (
            employee_id, 
            payroll_date, 
            hours_worked, 
            leave_deductions, 
            base_salary, 
            gross_pay, 
            tax_deductions, 
            net_pay,
            is_processed,
            processed_at
        )
        SELECT 
            emp_id,
            payroll_month,
            160, -- Default hours
            0,   -- Default leave deductions
            emp_salary,
            emp_salary,
            emp_salary * tax_rate,
            emp_salary - (emp_salary * tax_rate),
            TRUE,
            NOW()
        FROM DUAL;
        
    END LOOP;
    
    CLOSE emp_cursor;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `employee_summary_view`
--

/*!50001 DROP VIEW IF EXISTS `employee_summary_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `employee_summary_view` AS select `e`.`employee_id` AS `employee_id`,`e`.`name` AS `name`,`e`.`position` AS `position`,`e`.`department` AS `department`,`e`.`salary` AS `salary`,`e`.`email` AS `email`,coalesce(`pr`.`score`,0) AS `performance_score`,coalesce(`pr`.`status`,'Not Reviewed') AS `performance_status`,coalesce(`p`.`net_pay`,0) AS `last_net_pay`,coalesce(`lb`.`annual_leave`,15) AS `annual_leave_balance` from (((`employees` `e` left join `performance_reviews` `pr` on(`e`.`employee_id` = `pr`.`employee_id` and `pr`.`review_date` = (select max(`performance_reviews`.`review_date`) from `performance_reviews` where `performance_reviews`.`employee_id` = `e`.`employee_id`))) left join `payroll` `p` on(`e`.`employee_id` = `p`.`employee_id` and `p`.`payroll_date` = (select max(`payroll`.`payroll_date`) from `payroll` where `payroll`.`employee_id` = `e`.`employee_id`))) left join `leave_balances` `lb` on(`e`.`employee_id` = `lb`.`employee_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-06 13:48:56

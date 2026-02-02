DROP DATABASE IF EXISTS `moderntech_hr`;
CREATE DATABASE `moderntech_hr`;
USE `moderntech_hr`;

-- ============================================
-- 1. EMPLOYEES TABLE
-- ============================================
CREATE TABLE `employees` (
  `employee_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `position` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `salary` DECIMAL(10,2) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `employment_history` TEXT,
  `recruitment_date` DATE DEFAULT (CURDATE()),
  `days_off` INT DEFAULT 0,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 2. USERS/HR MANAGERS TABLE
-- ============================================
CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `avatar` VARCHAR(500),
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 3. PAYROLL DATA TABLE
-- ============================================
CREATE TABLE `payroll` (
  `payroll_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `payroll_date` DATE NOT NULL,
  `hours_worked` INT NOT NULL,
  `leave_deductions` INT DEFAULT 0,
  `base_salary` DECIMAL(10,2) NOT NULL,
  `gross_pay` DECIMAL(10,2),
  `tax_deductions` DECIMAL(10,2),
  `net_pay` DECIMAL(10,2),
  `is_processed` BOOLEAN DEFAULT FALSE,
  `processed_at` TIMESTAMP NULL,
  PRIMARY KEY (`payroll_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 4. PERFORMANCE REVIEWS TABLE
-- ============================================
CREATE TABLE `performance_reviews` (
  `review_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `review_date` DATE NOT NULL,
  `score` INT CHECK (score >= 0 AND score <= 100),
  `status` ENUM('Excellent', 'Good', 'Average', 'Poor') NOT NULL,
  `reviewed_by` INT, -- HR manager user_id
  `comments` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE CASCADE,
  FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 5. ATTENDANCE -- TABLE
-- ============================================
CREATE TABLE `attendance` (
  `attendance_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late', 'Half-day') NOT NULL,
  `check_in_time` TIME,
  `check_out_time` TIME,
  `notes` VARCHAR(255),
  PRIMARY KEY (`attendance_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_attendance` (`employee_id`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 6. LEAVE REQUESTS -- TABLE
-- ============================================
CREATE TABLE `leave_requests` (
  `leave_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `leave_type` ENUM('Annual', 'Sick', 'Family', 'Unpaid', 'Bereavement', 'Personal', 'Vacation', 'Medical Appointment', 'Childcare') NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `reason` TEXT,
  `status` ENUM('Pending', 'Approved', 'Denied') DEFAULT 'Pending',
  `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `processed_by` INT, -- HR manager user_id
  `processed_at` TIMESTAMP NULL,
  PRIMARY KEY (`leave_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE CASCADE,
  FOREIGN KEY (`processed_by`) REFERENCES `users`(`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 7. LEAVE BALANCES -- TABLE
-- ============================================
CREATE TABLE `leave_balances` (
  `balance_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `annual_leave` INT DEFAULT 15,
  `sick_leave` INT DEFAULT 10,
  `family_leave` INT DEFAULT 5,
  `unpaid_leave` INT DEFAULT 0,
  `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`balance_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_employee_balance` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- INSERT - EMPLOYEES DATA 
-- ============================================
INSERT INTO `employees` (`employee_id`, `name`, `position`, `department`, `salary`, `email`, `employment_history`) VALUES
(1, 'Sibongile Nkosi', 'Software Engineer', 'Development', 70000.00, 'sibongile.nkosi@moderntech.com', 'Joined in 2015, promoted to Senior in 2018'),
(2, 'Lungile Moyo', 'HR Manager', 'HR', 80000.00, 'lungile.moyo@moderntech.com', 'Joined in 2013, promoted to Manager in 2017'),
(3, 'Thabo Molefe', 'Quality Analyst', 'QA', 55000.00, 'thabo.molefe@moderntech.com', 'Joined in 2018'),
(4, 'Keshav Naidoo', 'Sales Representative', 'Sales', 60000.00, 'keshav.naidoo@moderntech.com', 'Joined in 2020'),
(5, 'Zanele Khumalo', 'Marketing Specialist', 'Marketing', 58000.00, 'zanele.khumalo@moderntech.com', 'Joined in 2019'),
(6, 'Sipho Zulu', 'UI/UX Designer', 'Design', 65000.00, 'sipho.zulu@moderntech.com', 'Joined in 2016'),
(7, 'Naledi Moeketsi', 'DevOps Engineer', 'IT', 72000.00, 'naledi.moeketsi@moderntech.com', 'Joined in 2017'),
(8, 'Farai Gumbo', 'Content Strategist', 'Marketing', 56000.00, 'farai.gumbo@moderntech.com', 'Joined in 2021'),
(9, 'Karabo Dlamini', 'Accountant', 'Finance', 62000.00, 'karabo.dlamini@moderntech.com', 'Joined in 2018'),
(10, 'Fatima Patel', 'Customer Support Lead', 'Support', 58000.00, 'fatima.patel@moderntech.com', 'Joined in 2016');

-- ============================================
-- INSERT -- HR USERS DATA 
-- ============================================
-- Note: In production, passwords should be hashed with bcrypt
INSERT INTO `users` (`name`, `role`, `department`, `email`, `avatar`, `password_hash`) VALUES
('Serena McCoy', 'HR Manager', 'Human Resources', 'SerenaMC@moderntech.com', 'https://i.postimg.cc/DZYhx5QF/Womens_Glasses_500x580.jpg', 'admin123'),
('Mbenki Moyo', 'HR Manager', 'Head Administration', 'mbenkiMoyo02@moderntech.com', 'https://i.postimg.cc/KvX8FsKG/a-black-man-with-glasses-and-a-beard-photo.jpg', 'hollery123'),
('Matthew Anderson', 'HR Manager', 'Senior DevOps Engineer', 'matthew.anderson@moderntech.com', 'https://i.postimg.cc/5yrvN5C4/happy-middle-aged-professional-business-600nw-2454390621.webp', 'oldman321123'),
('Emily Ling', 'HR Manager', 'Human Resources', 'EmiLing@moderntech.com', 'https://i.postimg.cc/tJcPCdx9/istockphoto-1496615764-612x612.jpg', 'superkitty@02'),
('Samuel Jacobs', 'HR Manager', 'Human Resources', 'JacobsSam@moderntech.com', 'https://i.postimg.cc/L5Wf6k14/plp-mens-eyeglasses-sp-4761c649-2e90-4f54-ab41-79cdb90c3867.webp', 'skateStar@2524');

-- ============================================
-- INSERT PAYROLL DATA (matching your JSON)
-- ============================================
INSERT INTO `payroll` (`employee_id`, `payroll_date`, `hours_worked`, `leave_deductions`, `base_salary`, `net_pay`, `is_processed`) VALUES
(1, '2025-01-31', 160, 8, 70000.00, 69500.00, TRUE),
(2, '2025-01-31', 150, 10, 80000.00, 79000.00, TRUE),
(3, '2025-01-31', 170, 4, 55000.00, 54800.00, TRUE),
(4, '2025-01-31', 165, 6, 60000.00, 59700.00, TRUE),
(5, '2025-01-31', 158, 5, 58000.00, 57850.00, TRUE),
(6, '2025-01-31', 168, 2, 65000.00, 64800.00, TRUE),
(7, '2025-01-31', 175, 3, 72000.00, 71800.00, TRUE),
(8, '2025-01-31', 160, 0, 56000.00, 56000.00, TRUE),
(9, '2025-01-31', 155, 5, 62000.00, 61500.00, TRUE),
(10, '2025-01-31', 162, 4, 58000.00, 57750.00, TRUE);

-- ============================================
-- INSERT -- PERFORMANCE REVIEWS 
-- ============================================
INSERT INTO `performance_reviews` (`employee_id`, `review_date`, `score`, `status`, `reviewed_by`) VALUES
(1, '2025-01-15', 88, 'Excellent', 1),
(2, '2025-01-15', 74, 'Good', 1),
(3, '2025-01-15', 91, 'Excellent', 1),
(4, '2025-01-15', 80, 'Excellent', 1),
(5, '2025-01-15', 76, 'Good', 1),
(6, '2025-01-15', 84, 'Excellent', 1),
(7, '2025-01-15', 89, 'Excellent', 1),
(8, '2025-01-15', 67, 'Average', 1),
(9, '2025-01-15', 71, 'Good', 1),
(10, '2025-01-15', 71, 'Good', 1);

-- ============================================
-- INSERT -- LEAVE BALANCES
-- ============================================
INSERT INTO `leave_balances` (`employee_id`, `annual_leave`, `sick_leave`, `family_leave`) VALUES
(1, 15, 10, 5),
(2, 15, 10, 5),
(3, 15, 10, 5),
(4, 15, 10, 5),
(5, 15, 10, 5),
(6, 15, 10, 5),
(7, 15, 10, 5),
(8, 15, 10, 5),
(9, 15, 10, 5),
(10, 15, 10, 5);

-- ============================================
-- CREATE VIEWS FOR COMMON QUERIES
-- ============================================
CREATE VIEW `employee_summary_view` AS
SELECT 
    e.employee_id,
    e.name,
    e.position,
    e.department,
    e.salary,
    e.email,
    COALESCE(pr.score, 0) as performance_score,
    COALESCE(pr.status, 'Not Reviewed') as performance_status,
    COALESCE(p.net_pay, 0) as last_net_pay,
    COALESCE(lb.annual_leave, 15) as annual_leave_balance
FROM employees e
LEFT JOIN performance_reviews pr ON e.employee_id = pr.employee_id 
    AND pr.review_date = (SELECT MAX(review_date) FROM performance_reviews WHERE employee_id = e.employee_id)
LEFT JOIN payroll p ON e.employee_id = p.employee_id 
    AND p.payroll_date = (SELECT MAX(payroll_date) FROM payroll WHERE employee_id = e.employee_id)
LEFT JOIN leave_balances lb ON e.employee_id = lb.employee_id;

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_employee_department ON employees(department);
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_payroll_employee_date ON payroll(employee_id, payroll_date);
CREATE INDEX idx_performance_employee_date ON performance_reviews(employee_id, review_date);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX idx_leave_employee_status ON leave_requests(employee_id, status);

-- ============================================
-- STORED PROCEDURE: Process Monthly Payroll
-- ============================================
DELIMITER $$
CREATE PROCEDURE `ProcessMonthlyPayroll`(IN payroll_month DATE)
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
END$$
DELIMITER ;

-- ============================================
-- TRIGGER: Update leave balance when leave is approved
-- ============================================
DELIMITER $$
CREATE TRIGGER `UpdateLeaveBalanceAfterApproval`
AFTER UPDATE ON `leave_requests`
FOR EACH ROW
BEGIN
    DECLARE days_requested INT;
    
    -- Calculate days requested
    SET days_requested = DATEDIFF(NEW.end_date, NEW.start_date) + 1;
    
    -- Only update balances if status changed to Approved
    IF NEW.status = 'Approved' AND OLD.status != 'Approved' THEN
        CASE NEW.leave_type
            WHEN 'Annual' THEN
                UPDATE leave_balances 
                SET annual_leave = annual_leave - days_requested
                WHERE employee_id = NEW.employee_id;
            WHEN 'Sick' THEN
                UPDATE leave_balances 
                SET sick_leave = sick_leave - days_requested
                WHERE employee_id = NEW.employee_id;
            WHEN 'Family' THEN
                UPDATE leave_balances 
                SET family_leave = family_leave - days_requested
                WHERE employee_id = NEW.employee_id;
            -- Unpaid leave doesn't affect balances
        END CASE;
    END IF;
END$$
DELIMITER ;

-- ============================================
-- END OF DATABASE SETUP
-- ============================================
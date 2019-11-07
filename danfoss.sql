CREATE DATABASE danfoss;
USE danfoss;
CREATE TABLE attendance(EmpCode varchar(20),Status varchar(10),InTime varchar(10),OutTime varchar(10),TotalTime varchar(10),AttendanceDate date,PRIMARY KEY (EmpCode,AttendanceDate));
CREATE TABLE employees(EmpCode varchar(20) PRIMARY KEY,EmpName varchar(60),Password varchar(100),Access enum('regular','admin') default 'regular');
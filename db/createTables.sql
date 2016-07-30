CREATE TABLE IF NOT EXISTS `tblGeneral` (
  `id` INT NOT NULL,
  `generalSiteName` VARCHAR(45) NOT NULL,
  `generalRainfall` DECIMAL(5,1),
  `generalHumidity` VARCHAR(45),
  `generalSolarRad` VARCHAR(45),
  `lat` DECIMAL(10,2) NOT NULL,
  `long` DECIMAL(11,2) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `tblAir` (
  `id` INT NOT NULL,
  `general_idtblGeneral` INT NOT NULL,
  `airTemp` VARCHAR(45) NULL,
  `airWindSpeed` VARCHAR(45) NULL,
  `airWindDirection` VARCHAR(45) NULL,
  `airQuality2.5` VARCHAR(45) NULL,
  `airGustSpeed` VARCHAR(45) NULL,
  `airQuality10` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tblAir_tblgeneral_idx` (`general_idtblGeneral` ASC),
  CONSTRAINT `fk_tblAir_tblGeneral` FOREIGN KEY (`general_idtblGeneral`) REFERENCES `tblgeneral` (`id`));

CREATE TABLE IF NOT EXISTS `tblWater` (
  `id` INT NOT NULL,
  `general_idtblgeneral` INT NOT NULL,
  `waterDepth` VARCHAR(45) NULL,
  `waterFlowrate` VARCHAR(45) NULL,
  `waterQuality` VARCHAR(45) NULL,
  `waterTemp` VARCHAR(45) NULL,
  `waterSwell` VARCHAR(45) NULL,
  `waterTide` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tblWater_tblgeneral1_idx` (`tblgeneral_idtblgeneral` ASC),
  CONSTRAINT `fk_tblWater_tblGeneral1` FOREIGN KEY (`general_idtblGeneral`) REFERENCES `tblgeneral` (`id`));

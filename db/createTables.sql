CREATE TABLE IF NOT EXISTS `canzuk`.`tblGenral` (
  `id` INT NOT NULL,
  `genralSiteName` VARCHAR(45) NOT NULL,
  `genralRainfall` DECIMAL(25) NOT NULL,
  `genralHumidity` VARCHAR(45),
  `genralSolarRad` VARCHAR(45),
  `lat` DECIMAL(10, 8) NOT NULL,
  `long` DECIMAL(11, 8) NOT NULL,
  PRIMARY KEY (`id`))

CREATE TABLE IF NOT EXISTS `canzuk`.`tblAir` (
  `id` INT NOT NULL,
  `airTemp` VARCHAR(45),
  `airWindSpeed` VARCHAR(45),
  `airWindDirection` VARCHAR(45),
  `airQuality2.5` VARCHAR(45),
  `airGustSpeed` VARCHAR(45),
  `airQuality10` VARCHAR(45),
  `frgnMainTable` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tblAir_tblGenral_idx` (`frgnMainTable` ASC),
  CONSTRAINT `fk_tblAir_tblGenral` FOREIGN KEY (`frgnMainTable`) REFERENCES `canzuk`.`tblGenral` (`idtblGenral`) ON DELETE CASCADE ON UPDATE CASCADE)

CREATE TABLE IF NOT EXISTS `canzuk`.`tblWater` (
  `id` INT NOT NULL,
  `waterDepth` VARCHAR(45),
  `waterFlowrate` VARCHAR(45),
  `waterQuality` VARCHAR(45),
  `waterTemp` VARCHAR(45),
  `frgnMainTable` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tblWater_tblGenral1_idx` (`frgnMainTable` ASC),
  CONSTRAINT `fk_tblWater_tblGenral1` FOREIGN KEY (`frgnMainTable`) REFERENCES `canzuk`.`tblGenral` (`idtblGenral`) ON DELETE CASCADE ON UPDATE CASCADE)

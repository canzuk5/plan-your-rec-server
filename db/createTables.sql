
CREATE TABLE IF NOT EXISTS `CaNzUk`.`tblGenral` (
  `idtblGenral` INT NOT NULL,
  `tblGenralSiteName` VARCHAR(45) NULL,
  `tblGenralRainfall` DECIMAL(25) NULL COMMENT '24 hour rainfall',
  `tblGenralHumidity` VARCHAR(45) NULL,
  `tblGenralSolarRad` VARCHAR(45) NULL,
  PRIMARY KEY (`idtblGenral`)
  )
  
CREATE TABLE IF NOT EXISTS `CaNzUk`.`tblAir` (
  `idtblAir` INT NOT NULL,
  `tblGenral_idtblGenral` INT NOT NULL,
  `tblAirTemp` VARCHAR(45) NULL,
  `tblAirWindSpeed` VARCHAR(45) NULL,
  `tblAirWindDirection` VARCHAR(45) NULL,
  `tblAirQuality2.5` VARCHAR(45) NULL,
  `tblAirGustSpeed` VARCHAR(45) NULL,
  `tblAirQuality10` VARCHAR(45) NULL,
  PRIMARY KEY (`idtblAir`),
  INDEX `fk_tblAir_tblGenral_idx` (`tblGenral_idtblGenral` ASC),
  CONSTRAINT `fk_tblAir_tblGenral`
    FOREIGN KEY (`tblGenral_idtblGenral`)
    REFERENCES `CaNzUk`.`tblGenral` (`idtblGenral`)
   )
   
CREATE TABLE IF NOT EXISTS `CaNzUk`.`tblWater` (
  `idtblWater` INT NOT NULL,
  `tblGenral_idtblGenral` INT NOT NULL,
  `tblWaterDepth` VARCHAR(45) NULL,
  `tblWaterFlowrate` VARCHAR(45) NULL,
  `tblWaterQuality` VARCHAR(45) NULL,
  `tblWaterTemp` VARCHAR(45) NULL,
  `tblWaterTemp` VARCHAR(45) NULL,
  `tblWaterSwell` VARCHAR(45) NULL,
  `tblWaterTide` VARCHAR(45) NULL,
  PRIMARY KEY (`idtblWater`),
  INDEX `fk_tblWater_tblGenral1_idx` (`tblGenral_idtblGenral` ASC),
  CONSTRAINT `fk_tblWater_tblGenral1`
    FOREIGN KEY (`tblGenral_idtblGenral`)
    REFERENCES `CaNzUk`.`tblGenral` (`idtblGenral`)
  )
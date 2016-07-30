CREATE TABLE IF NOT EXISTS `tblGeneral` (
  `id` INT NOT NULL,
  `generalSiteName` VARCHAR(45) NOT NULL,
  `generalRainfall` DECIMAL(5,1),
  `generalHumidity` VARCHAR(45),
  `generalSolarRad` VARCHAR(45),
  `lat` DECIMAL(10,2) NOT NULL,
  `long` DECIMAL(11,2) NOT NULL,
  `airTemp` VARCHAR(45),
  `airWindSpeed` VARCHAR(45),
  `airWindDirection` VARCHAR(45),
  `airQuality2.5` VARCHAR(45),
  `airGustSpeed` VARCHAR(45),
  `airQuality10` VARCHAR(45),
  `waterDepth` VARCHAR(45),
  `waterFlowrate` VARCHAR(45),
  `waterQuality` VARCHAR(45),
  `waterTemp` VARCHAR(45),
  `waterSwell` VARCHAR(45),
  `waterTide` VARCHAR(45),
  PRIMARY KEY (`id`));

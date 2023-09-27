CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` datetime NOT NULL,
  `tracking_id` varchar(36) NOT NULL,
  `state` varchar(20) NOT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `page` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

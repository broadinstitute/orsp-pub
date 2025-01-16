  CREATE TABLE `versioned_funding` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `versioned_issue_id` bigint NOT NULL,
  `version` bigint NOT NULL,
  `source` varchar(60) DEFAULT NULL,
  `source_key` varchar(60) DEFAULT NULL,
  `name` varchar(500) DEFAULT NULL,
  `award_number` varchar(255) DEFAULT NULL,
  `project_key` varchar(60) NOT NULL,
  `sequence_number` int NOT NULL DEFAULT '0',
  `deleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `versioned_issue_id` (`versioned_issue_id`),
  CONSTRAINT `versioned_funding_ibfk_1` FOREIGN KEY (`versioned_issue_id`) REFERENCES `versioned_issue` (`id`) ON DELETE CASCADE);

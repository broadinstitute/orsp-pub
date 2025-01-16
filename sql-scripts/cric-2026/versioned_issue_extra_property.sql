  CREATE TABLE `versioned_issue_extra_property` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `versioned_issue_id` bigint NOT NULL,
  `version` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `project_key` varchar(255) NOT NULL,
  `sequence_number` int NOT NULL DEFAULT '0',
  `deleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `versioned_issue_id` (`versioned_issue_id`),
  CONSTRAINT `versioned_issue_extra_property_ibfk_1` FOREIGN KEY (`versioned_issue_id`) REFERENCES `versioned_issue` (`id`) ON DELETE CASCADE);

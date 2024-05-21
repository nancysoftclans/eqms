-- Dumping structure for table bomra.par_issue_statuses
CREATE TABLE IF NOT EXISTS `par_issue_statuses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `is_enabled` int NOT NULL DEFAULT '1',
  `created_by` int NOT NULL DEFAULT '0',
  `altered_by` int NOT NULL DEFAULT '0',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dola` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table bomra.par_issue_statuses: ~8 rows (approximately)
INSERT INTO `par_issue_statuses` (`id`, `name`, `description`, `is_enabled`, `created_by`, `altered_by`, `created_on`, `dola`) VALUES
	(1, 'Cancelled', 'Cancelled', 1, 1, 1, '2024-05-20 13:41:53', '2024-05-20 13:41:53'),
	(2, 'In Progress', 'In Progress', 1, 1, 1, '2024-05-20 13:41:53', '2024-05-20 13:41:53'),
	(3, 'On Hold', 'Open', 1, 1, 1, '2024-05-20 13:41:53', '2024-05-20 13:41:53'),
	(4, 'Pause', 'On Hold', 1, 1, 1, '2024-05-20 13:41:53', '2024-05-20 13:41:53'),
	(5, 'Paused', 'Paused', 1, 1, 1, '2024-05-20 13:41:53', '2024-05-20 13:41:53'),
	(6, 'Rejected', 'Rejected', 1, 1, 1, '2024-05-20 13:41:53', '2024-05-20 13:41:53'),
	(7, 'Under investigation', 'Under investigation', 1, 1, 1, '2024-05-20 13:41:53', '2024-05-20 13:41:53'),
	(8, 'Withdrawn', 'Open', 1, 1, 1, '2024-05-20 13:41:53', '2024-05-20 13:41:53');

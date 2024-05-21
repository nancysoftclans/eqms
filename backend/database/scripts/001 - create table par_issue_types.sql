-- Dumping structure for table bomra.par_issue_types
CREATE TABLE IF NOT EXISTS `par_issue_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `is_enabled` int NOT NULL DEFAULT '1',
  `created_by` int NOT NULL DEFAULT '0',
  `altered_by` int NOT NULL DEFAULT '0',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dola` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table bomra.par_issue_types: ~4 rows (approximately)
INSERT INTO `par_issue_types` (`id`, `name`, `description`, `is_enabled`, `created_by`, `altered_by`, `created_on`, `dola`) VALUES
	(1, 'Customer Complaints And Appeals', 'Customer Complaints And Appeals', 1, 1, 0, '2024-05-20 12:36:55', '2024-05-20 13:36:55'),
	(2, 'Corrective Actions', '<span style="font-size:12.0pt;line-height:107%;\nfont-family:&quot;Gill Sans MT&quot;,sans-serif;mso-fareast-font-family:Calibri;\nmso-fareast-theme-font:minor-latin;mso-bidi-font-family:&quot;Times New Roman&quot;;\nmso-bidi-theme-font:minor-bidi;mso-ansi-language:EN-US;mso-fareast-language:\nEN-US;mso-bidi-language:AR-SA">Corrective Actions</span>', 1, 1, 1, '2024-05-20 12:37:33', '2024-05-20 12:43:04'),
	(3, 'Change Management', '<span style="font-size:12.0pt;line-height:107%;\nfont-family:&quot;Gill Sans MT&quot;,sans-serif;mso-fareast-font-family:Calibri;\nmso-fareast-theme-font:minor-latin;mso-bidi-font-family:&quot;Times New Roman&quot;;\nmso-bidi-theme-font:minor-bidi;mso-ansi-language:EN-US;mso-fareast-language:\nEN-US;mso-bidi-language:AR-SA">Change Management&nbsp;</span>', 1, 1, 0, '2024-05-20 12:37:59', '2024-05-20 13:37:59'),
	(4, 'Deviation', '<span style="font-size:12.0pt;line-height:107%;\nfont-family:&quot;Gill Sans MT&quot;,sans-serif;mso-fareast-font-family:Calibri;\nmso-fareast-theme-font:minor-latin;mso-bidi-font-family:&quot;Times New Roman&quot;;\nmso-bidi-theme-font:minor-bidi;mso-ansi-language:EN-US;mso-fareast-language:\nEN-US;mso-bidi-language:AR-SA">The procedure outlines the process of\nidentifying, approving and addressing deviations from approved documented\nprocesses.</span><br>', 1, 1, 1, '2024-05-20 12:38:39', '2024-05-20 12:43:57');

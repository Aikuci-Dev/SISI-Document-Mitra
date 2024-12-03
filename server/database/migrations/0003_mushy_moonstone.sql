CREATE TABLE `document_bast` (
	`id` text,
	`original` text NOT NULL,
	`value` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `document_bast_id_unique` ON `document_bast` (`id`);
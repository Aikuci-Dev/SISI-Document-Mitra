CREATE TABLE `document_bapp` (
	`id` text,
	`original` text NOT NULL,
	`value` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `document_bapp_id_unique` ON `document_bapp` (`id`);
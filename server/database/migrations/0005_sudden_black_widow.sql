CREATE TABLE `document_mitra` (
	`id` text NOT NULL,
	`type` text NOT NULL,
	`original` text NOT NULL,
	`value` text NOT NULL,
	`is_validated` integer DEFAULT false,
	`is_approved` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`validated_at` integer,
	`signed_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `type_and_id` ON `document_mitra` (`type`,`id`);--> statement-breakpoint
DROP TABLE `document_bapp`;--> statement-breakpoint
DROP TABLE `document_bast`;
CREATE TABLE `user_google` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`google_id` integer NOT NULL,
	`email` text NOT NULL,
	`google_name` text NOT NULL,
	`name` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_google_email_unique` ON `user_google` (`email`);
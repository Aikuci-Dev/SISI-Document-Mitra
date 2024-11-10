PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_google` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`google_id` integer NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_user_google`("id", "google_id", "email", "name", "created_at", "updated_at", "deleted_at") SELECT "id", "google_id", "email", "name", "created_at", "updated_at", "deleted_at" FROM `user_google`;--> statement-breakpoint
DROP TABLE `user_google`;--> statement-breakpoint
ALTER TABLE `__new_user_google` RENAME TO `user_google`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_google_email_unique` ON `user_google` (`email`);
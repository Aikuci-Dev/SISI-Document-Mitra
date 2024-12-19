DROP INDEX IF EXISTS "document_mitra_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_google_email_unique";--> statement-breakpoint
ALTER TABLE `document_mitra` ALTER COLUMN "id" TO "id" text;--> statement-breakpoint
CREATE UNIQUE INDEX `document_mitra_id_unique` ON `document_mitra` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_google_email_unique` ON `user_google` (`email`);
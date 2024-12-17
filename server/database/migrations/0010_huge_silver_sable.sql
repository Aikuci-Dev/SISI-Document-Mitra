DROP INDEX IF EXISTS `type_and_id`;--> statement-breakpoint
ALTER TABLE `document_mitra` ADD `original` text NOT NULL;--> statement-breakpoint
ALTER TABLE `document_mitra` DROP COLUMN `type`;
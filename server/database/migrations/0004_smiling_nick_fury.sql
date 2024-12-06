ALTER TABLE `document_bapp` ADD `is_validated` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `document_bapp` ADD `is_approved` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `document_bapp` ADD `validated_at` integer;--> statement-breakpoint
ALTER TABLE `document_bapp` ADD `signed_at` integer;--> statement-breakpoint
ALTER TABLE `document_bast` ADD `is_validated` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `document_bast` ADD `is_approved` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `document_bast` ADD `validated_at` integer;--> statement-breakpoint
ALTER TABLE `document_bast` ADD `signed_at` integer;
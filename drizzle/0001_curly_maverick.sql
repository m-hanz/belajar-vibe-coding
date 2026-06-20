ALTER TABLE `users` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);
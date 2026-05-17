ALTER TABLE `food_logs` ADD `meal_type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `food_logs` ADD `logged_at` integer NOT NULL;--> statement-breakpoint
CREATE INDEX `food_logs_user_id_idx` ON `food_logs` (`user_id`);--> statement-breakpoint
ALTER TABLE `food_logs` DROP COLUMN `date`;--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);
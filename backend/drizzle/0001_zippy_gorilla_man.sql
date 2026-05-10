ALTER TABLE `food_logs` ADD `user_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `food_logs` ADD `quantity` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `food_logs` ADD `protein` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `food_logs` ADD `carbs` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `food_logs` ADD `fat` integer NOT NULL;
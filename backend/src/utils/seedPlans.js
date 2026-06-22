import Subscription from "../models/Subscription.js";
import { logger } from "./logger.js";

const DEFAULT_PLANS = [
  { name: "1 Month Membership", duration_months: 1, price: 99, display_order: 1 },
  { name: "3 Months Membership", duration_months: 3, price: 249, display_order: 2 },
  { name: "6 Months Membership", duration_months: 6, price: 449, display_order: 3 },
  { name: "1 Year Membership", duration_months: 12, price: 799, display_order: 4 },
];

export const ensureDefaultPlans = async () => {
  try {
    // Delete any old invalid plans if the schema was changed (e.g., they don't have duration_months)
    await Subscription.deleteMany({ duration_months: { $exists: false } });

    for (const plan of DEFAULT_PLANS) {
      const existing = await Subscription.findOne({ duration_months: plan.duration_months });
      if (!existing) {
        await Subscription.create({
          ...plan,
          description: `Access to all comics for ${plan.duration_months} month(s).`,
          features: ["Unlimited access to ALL books", "Instant digital access", "Cancel anytime"],
          is_active: true,
          is_popular: plan.duration_months === 6,
        });
        logger.info(`Seeded default plan: ${plan.name}`);
      }
    }
  } catch (error) {
    logger.error("Failed to seed default plans", error);
  }
};

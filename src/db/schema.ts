import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Helper to default IDs to UUIDs generated in app layer
const id = () => text("id").primaryKey().notNull();

export const users = sqliteTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  name: text("name"),
  incomeType: text("income_type").notNull(), // 'regular' | 'gig' | 'irregular'
  financialGoal: text("financial_goal").notNull(), // 'emergency_fund' | 'debt_reduction' | 'investment' | 'major_purchase'
  riskTolerance: integer("risk_tolerance").notNull(), // 1..5
  cognitiveLoadScore: integer("cognitive_load_score").default(3),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const categories = sqliteTable("categories", {
  id: id(),
  name: text("name").notNull().unique(),
  parentId: text("parent_id"),
  color: text("color").notNull(), // HEX_CODE string
  iconName: text("icon_name").notNull(),
  isSystemCategory: integer("is_system_category", { mode: "boolean" }).default(true),
});

export const transactions = sqliteTable("transactions", {
  id: id(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(), // != 0
  description: text("description").notNull(),
  categoryId: text("category_id").references(() => categories.id),
  transactionDate: text("transaction_date").notNull(), // ISO date string
  type: text("type").notNull(), // 'income' | 'expense'
  paymentMethod: text("payment_method"), // 'cash' | 'card' | 'transfer' | 'digital_wallet'
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  recurrencePattern: text("recurrence_pattern"), // 'weekly' | 'monthly' | 'biweekly'
  receiptImageUrl: text("receipt_image_url"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const recommendations = sqliteTable("recommendations", {
  id: id(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'savings' | 'spending' | 'investment' | 'behavioral'
  title: text("title").notNull(),
  description: text("description").notNull(),
  rationale: text("rationale").notNull(),
  expectedSavings: real("expected_savings"),
  confidenceScore: real("confidence_score"), // 0..1
  urgencyLevel: text("urgency_level"), // 'low' | 'medium' | 'high'
  implementationDifficulty: integer("implementation_difficulty"), // 1..5
  isActionable: integer("is_actionable", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const financialMetrics = sqliteTable("financial_metrics", {
  id: id(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  metricDate: text("metric_date").notNull(), // ISO date
  emergencyFundRatio: real("emergency_fund_ratio"), // months of expenses covered
  debtToIncomeRatio: real("debt_to_income_ratio"),
  savingsRate: real("savings_rate"),
  spendingVariance: real("spending_variance"), // coefficient of variation
  incomeVolatilityIndex: real("income_volatility_index"),
  financialStressScore: integer("financial_stress_score"), // 1..10
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

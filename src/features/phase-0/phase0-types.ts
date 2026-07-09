import { z } from "zod";
import { sourceTypeSchema, verificationStatusSchema } from "../../contracts";

// Phase 0 only. This is not the formal data contract.
export type Phase0PossibleKind =
  | "report_candidate"
  | "help_request_candidate"
  | "site_status_candidate"
  | "task_candidate"
  | "assignment_candidate"
  | "announcement_candidate"
  | "unknown";

export type Phase0Confidence = "low" | "medium" | "high";

export type Phase0QualitySignal = "explicit_time" | "explicit_quantity";

export type Phase0SuggestedNextStep =
  | "keep_raw"
  | "ask_for_more_info"
  | "send_to_human_review"
  | "create_candidate_report"
  | "create_site_update_suggestion"
  | "do_not_use_yet";

export const phase0MessyRecordSchema = z.object({
  id: z.string().min(1),
  rawText: z.string().min(1),
  sourceType: sourceTypeSchema,
  verificationStatus: verificationStatusSchema,
  updatedAt: z.string().datetime({ offset: true }),
});
export const phase0MessyRecordsSchema = z.array(phase0MessyRecordSchema);
export type Phase0MessyRecord = z.infer<typeof phase0MessyRecordSchema>;

export type Phase0JudgementDraft = {
  messyRecordId: string;
  possibleKind: Phase0PossibleKind;
  confidence: Phase0Confidence;
  qualitySignals: Phase0QualitySignal[];
  evidence: string[];
  blockers: string[];
  suggestedNextStep: Phase0SuggestedNextStep;
  unsafeToActDirectly: boolean;
  humanReviewNote?: string;
};

import { describe, expect, it } from "vitest";
import messyReports from "../src/fixtures/phase-0/messy-reports.json";
import { createPhase0Judgement } from "../src/features/phase-0/phase0-heuristics";
import { phase0MessyRecordsSchema } from "../src/features/phase-0/phase0-types";

const phase0Records = phase0MessyRecordsSchema.parse(messyReports);

describe("phase 0 heuristics", () => {
  it("loads the current phase 0 messy data", () => {
    expect(phase0Records).toHaveLength(12);
    expect(phase0Records.map((record) => record.id)).toEqual(
      Array.from(
        { length: 12 },
        (_, index) => `M-${String(index + 1).padStart(3, "0")}`,
      ),
    );
  });

  it("marks reliable reports with explicit time or quantity as candidate reports without allowing direct action", () => {
    const judgements = phase0Records.map(createPhase0Judgement);

    expect(judgements).toHaveLength(phase0Records.length);
    expect(
      judgements.filter((judgement) => judgement.unsafeToActDirectly),
    ).toHaveLength(phase0Records.length);

    const candidateIds = judgements
      .filter((judgement) => judgement.possibleKind === "report_candidate")
      .map((judgement) => judgement.messyRecordId);

    expect(candidateIds).toEqual(["M-009", "M-010"]);
    expect(
      judgements.filter((judgement) => judgement.confidence === "medium"),
    ).toHaveLength(2);
  });

  it("does not mark unclear locations or unreliable sources as high quality", () => {
    const judgement = createPhase0Judgement(phase0Records[0]);

    expect(phase0Records[0].sourceType).toBe("social_post");
    expect(judgement.possibleKind).toBe("unknown");
    expect(judgement.confidence).toBe("low");
    expect(judgement.qualitySignals).toEqual([]);
    expect(judgement.suggestedNextStep).toBe("send_to_human_review");
  });

  it("does not treat review-needed records as confirmed facts", () => {
    const judgement = createPhase0Judgement(phase0Records[9]);

    expect(phase0Records[9].verificationStatus).toBe("needs_review");
    expect(judgement.unsafeToActDirectly).toBe(true);
    expect(judgement.evidence.join(" ")).not.toContain("verified");
  });

  it("does not infer candidate kind from the starter text", () => {
    const judgement = createPhase0Judgement(phase0Records[10]);

    expect(judgement.possibleKind).toBe("unknown");
    expect(judgement.suggestedNextStep).toBe("send_to_human_review");
  });

  it("keeps candidate reports as unconfirmed review items", () => {
    const judgement = createPhase0Judgement(phase0Records[9]);

    expect(judgement.possibleKind).toBe("report_candidate");
    expect(judgement.confidence).toBe("medium");
    expect(judgement.suggestedNextStep).toBe("create_candidate_report");
    expect(judgement.unsafeToActDirectly).toBe(true);
    expect(judgement.blockers.join(" ")).toContain("仍需要人工確認");
  });
});

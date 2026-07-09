import type {
  Phase0JudgementDraft,
  Phase0MessyRecord,
  Phase0QualitySignal,
} from "./phase0-types";

const explicitTimePattern = /\b\d{1,2}[:：]\d{2}\b/;
const explicitQuantityPattern =
  /(?:\d+\s*(?:人|位|雙|件|箱|包|瓶|份|台|組|公斤|公升)|[一二三四五六七八九十百]+幾?個人)/;
const unclearLocationPattern =
  /(地址只有|附近|那邊|某|不知道.*(?:位置|地點|地址)|無法確認.*(?:位置|地點|地址))/;
const unreliableSourceTypes = new Set(["social_post", "phone_call"]);

function getQualitySignals(record: Phase0MessyRecord): Phase0QualitySignal[] {
  const signals: Phase0QualitySignal[] = [];
  const hasUnclearLocation = unclearLocationPattern.test(record.rawText);
  const hasUnreliableSource = unreliableSourceTypes.has(record.sourceType);

  if (hasUnclearLocation || hasUnreliableSource) {
    return signals;
  }

  if (explicitTimePattern.test(record.rawText)) {
    signals.push("explicit_time");
  }

  if (explicitQuantityPattern.test(record.rawText)) {
    signals.push("explicit_quantity");
  }

  return signals;
}

// This is a safety-boundary scaffold, not an answer engine.
export function createPhase0Judgement(
  record: Phase0MessyRecord,
): Phase0JudgementDraft {
  const isVerified = record.verificationStatus === "verified";
  const qualitySignals = getQualitySignals(record);
  const hasCandidateSignal = qualitySignals.length > 0;

  return {
    messyRecordId: record.id,
    possibleKind: hasCandidateSignal ? "report_candidate" : "unknown",
    confidence: hasCandidateSignal ? "medium" : "low",
    qualitySignals,
    evidence: hasCandidateSignal
      ? [
          "原文有較明確的時間或數量，且沒有被來源或位置問題排除，信心程度可提高到中。",
          "尚未建立整理草稿：請由小組從原文標出判斷依據。",
        ]
      : ["尚未建立整理草稿：請由小組從原文標出判斷依據。"],
    blockers: isVerified
      ? ["仍需確認這筆資訊適合進入哪個後續流程。"]
      : [
          "目前不是已確認資訊，不能直接行動或當成事實發布。",
          hasCandidateSignal
            ? "信心程度達中只代表原文線索較清楚，仍需要人工確認來源、位置與適用情境。"
            : "若來源不可靠、位置不清楚，或原文缺少明確時間與數量，暫時只能保留安全預設。",
        ],
    suggestedNextStep: hasCandidateSignal
      ? "create_candidate_report"
      : isVerified
        ? "keep_raw"
        : "send_to_human_review",
    unsafeToActDirectly: true,
  };
}

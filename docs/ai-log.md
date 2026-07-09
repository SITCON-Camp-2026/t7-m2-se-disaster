# AI Log

這份紀錄用來留下小組如何使用 AI / Coding Agent 的操作脈絡。重點不是逐字保存所有對話，而是記錄重要協作、取捨與人類判斷。

## 什麼時候要記錄

請在以下情況更新本檔案：

- AI 協助分析原始資訊。
- AI 協助找出不能判斷處。
- AI 協助判斷哪些資訊不能直接相信。
- AI 協助判斷哪些資訊不能直接變成任務。
- AI 協助修改畫面標示或前端工作台。
- AI 可能補了原文沒有的資訊。
- AI 建議被小組拒絕，且拒絕原因和安全 / 正確性 / scope 有關
- AI 輸出可能造成誤導，例如把未確認資料寫成已確認事實

## 不需要記錄

- 不需要逐字貼完整對話
- 不需要記錄每一次小型 autocomplete
- 不需要記錄單純修 typo 或格式化

## 紀錄格式

| 時間 | 階段 | 任務 | AI / Agent 建議 | 採用 / 拒絕 | 人類判斷理由 | 相關檔案 / commit |
| ---- | ---- | ---- | --------------- | ----------- | ------------ | ----------------- |
|      |      |      |                 |             |              |                   |

## 範例

### 09:45 Phase 0：分析原始資訊

- AI / Agent 建議：把社群貼文直接轉成 verified report。
- 採用 / 拒絕：拒絕。
- 人類判斷理由：社群貼文來源未確認，應保持 `needs_review`。
- 相關檔案 / commit：`docs/phase0-observations.md`

### 2026-07-09 Phase 0：標示高品質候選回報

- AI / Agent 建議：依 rawText 中明確時間或數量標示「候選回報」，但維持不可直接行動與人工確認。
- 採用 / 拒絕：採用。
- 人類判斷理由：明確時間或數量只是較好的整理線索，不代表資料已確認，也不能直接變成志工任務。
- 相關檔案 / commit：`src/features/phase-0/phase0-heuristics.ts`, `src/features/phase-0/Phase0JudgementCard.tsx`, `tests/phase0-heuristics.test.ts`, `tests/app-smoke.test.tsx`

### 2026-07-09 Phase 0：收緊高品質候選規則

- AI / Agent 建議：排除地址不明確或來源不可靠的回報，即使 rawText 有時間或數量也不標為高品質。
- 採用 / 拒絕：採用。
- 人類判斷理由：M-001 有「十幾個人」，但來源是社群轉錄且地址只有模糊描述，不能視為高品質候選。
- 相關檔案 / commit：`src/features/phase-0/phase0-heuristics.ts`, `tests/phase0-heuristics.test.ts`

### 2026-07-09 Phase 0：以信心程度判斷品質

- AI / Agent 建議：把信心程度明確寫成品質判斷標準，信心程度達中以上才顯示為高品質候選。
- 採用 / 拒絕：採用。
- 人類判斷理由：時間、數量、來源與位置線索需要合併判斷；用信心程度呈現可以避免把單一線索誤當成高品質。
- 相關檔案 / commit：`src/features/phase-0/Phase0JudgementCard.tsx`, `src/features/phase-0/phase0-heuristics.ts`, `tests/app-smoke.test.tsx`, `tests/phase0-heuristics.test.ts`

### 2026-07-09 Phase 0：新增原始資訊行列模式

- AI / Agent 建議：在原始資訊頁加入卡片模式與行列模式切換，行列模式集中顯示編號、原文摘要、來源、狀態與更新時間。
- 採用 / 拒絕：採用。
- 人類判斷理由：同一批未整理資料需要能用不同密度檢視，但仍只顯示原始資訊與查核狀態，不新增正式整理後資料。
- 相關檔案 / commit：`src/features/phase-0/Phase0RawInfoPanel.tsx`, `src/styles/global.css`, `tests/app-smoke.test.tsx`

### 2026-07-09 Phase 0：補完整 Phase 0 型別

- AI / Agent 建議：讓 `phase0-types.ts` 沿用共用來源與查核狀態型別，並把品質線索改成穩定代碼而不是顯示文字。
- 採用 / 拒絕：採用。
- 人類判斷理由：來源、查核狀態與品質線索會影響是否能標成候選；用明確型別可以降低 UI 文案和判斷邏輯混在一起的風險。
- 相關檔案 / commit：`src/features/phase-0/phase0-types.ts`, `src/features/phase-0/phase0-heuristics.ts`, `src/features/phase-0/Phase0JudgementCard.tsx`

## 課後反思

### AI 幫助最大的地方

-

### AI 最容易誤導的地方

-

### 下次使用 AI 開發前，我們會先準備

-

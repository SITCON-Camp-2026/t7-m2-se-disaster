import { useState } from "react";
import { SourceLabel } from "../../components/SourceLabel";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDateTime } from "../../lib/date";
import type { Phase0MessyRecord } from "./phase0-types";

type ViewMode = "cards" | "rows";

export function Phase0RawInfoPanel({
  records,
  selectedRecordId,
  onSelect,
}: {
  records: Phase0MessyRecord[];
  selectedRecordId: string;
  onSelect: (recordId: string) => void;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  return (
    <div className="phase0-raw">
      <div className="panel__header">
        <div>
          <h2>原始資訊</h2>
          <p>這些還不是整理後資料，不能直接當成行動依據。</p>
        </div>
        <div className="panel__actions">
          <p>{records.length} 筆資料</p>
          <div className="view-toggle" aria-label="原始資訊顯示模式">
            <button
              className={viewMode === "cards" ? "active" : ""}
              type="button"
              onClick={() => setViewMode("cards")}
            >
              卡片模式
            </button>
            <button
              className={viewMode === "rows" ? "active" : ""}
              type="button"
              onClick={() => setViewMode("rows")}
            >
              行列模式
            </button>
          </div>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid">
          {records.map((record) => (
            <article
              className={`record-card ${record.id === selectedRecordId ? "record-card--selected" : ""}`}
              key={record.id}
            >
              <div className="record-card__header">
                <h3>{record.id}</h3>
                <StatusBadge status={record.verificationStatus} />
              </div>
              <p>{record.rawText}</p>
              <div className="record-card__meta">
                <SourceLabel sourceType={record.sourceType} />
                <span>更新：{formatDateTime(record.updatedAt)}</span>
              </div>
              <button type="button" onClick={() => onSelect(record.id)}>
                送到整理工作台
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="raw-table" role="table" aria-label="原始資訊行列列表">
          <div className="raw-table__row raw-table__header" role="row">
            <span role="columnheader">編號</span>
            <span role="columnheader">原文摘要</span>
            <span role="columnheader">來源</span>
            <span role="columnheader">狀態</span>
            <span role="columnheader">更新時間</span>
            <span role="columnheader">操作</span>
          </div>
          {records.map((record) => (
            <div
              className={`raw-table__row ${record.id === selectedRecordId ? "raw-table__row--selected" : ""}`}
              key={record.id}
              role="row"
            >
              <strong role="cell">{record.id}</strong>
              <p role="cell">{record.rawText}</p>
              <div role="cell">
                <SourceLabel sourceType={record.sourceType} />
              </div>
              <div role="cell">
                <StatusBadge status={record.verificationStatus} />
              </div>
              <span role="cell">{formatDateTime(record.updatedAt)}</span>
              <div role="cell">
                <button type="button" onClick={() => onSelect(record.id)}>
                  送到工作台
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

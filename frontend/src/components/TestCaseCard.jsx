import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function TestCaseCard({ passed, failed }) {
  const total = passed + failed;
  const passRate = total > 0 ? (passed / total) * 100 : 0;
  
  return (
    <div className="accuracy-wrap">
      <div className="accuracy-top">
        <span className="accuracy-value">{passed} / {total} Passed</span>
        {failed > 0 ? (
          <span
            className="accuracy-badge"
            style={{ color: "#f87171", background: "#f871711a" }}
          >
            {failed} Failed
          </span>
        ) : (
          <span
            className="accuracy-badge"
            style={{ color: "#34d399", background: "#34d3991a" }}
          >
            All Passed
          </span>
        )}
      </div>
      <div className="accuracy-track">
        <div
          className="accuracy-fill"
          style={{ width: `${passRate}%`, background: passRate === 100 ? "#34d399" : (passRate >= 50 ? "#fbbf24" : "#f87171") }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
         <div style={{ color: "#34d399", display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <CheckCircle2 size={16} /> {passed} test cases passed
         </div>
         <div style={{ color: "#f87171", display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <XCircle size={16} /> {failed} test cases failed
         </div>
      </div>
    </div>
  );
}

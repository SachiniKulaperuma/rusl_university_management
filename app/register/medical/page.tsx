'use client';

import { useEffect, useRef, useState } from 'react';

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

type TableKey =
  | 'athletics' | 'indoor' | 'outdoor'
  | 'art' | 'instruments' | 'singing' | 'dancing'
  | 'performing' | 'organized' | 'oratory' | 'leadership';

const NUMBERS = ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.',
  '11.', '12.', '13.', '14.', '15.', '16.', '17.', '18.', '19.', '20.'];
const ROMAN_LOWER = ['i.', 'ii.', 'iii.', 'iv.', 'v.', 'vi.', 'vii.', 'viii.', 'ix.', 'x.',
  'xi.', 'xii.', 'xiii.', 'xiv.', 'xv.'];

type RowData = { id: number;[key: string]: string | number };

function buildInitialRows(count: number): RowData[] {
  return Array.from({ length: count }, (_, i) => ({ id: i + 1 }));
}

function YearSelect({ name }: { name: string }) {
  return (
    <select className="tbl-input" name={name} defaultValue="">
      <option value="">Year</option>
      {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
    </select>
  );
}

function SportsRow({ tableKey, idx, onRemove, canRemove }: { tableKey: string; idx: number; onRemove: () => void; canRemove: boolean }) {
  return (
    <tr>
      <td className="row-num">{NUMBERS[idx - 1] || `${idx}.`}</td>
      <td><input type="text" className="tbl-input" name={`${tableKey}_event_${idx}`} placeholder="e.g. 100m Sprint" /></td>
      <td><input type="text" className="tbl-input" name={`${tableKey}_participated_${idx}`} placeholder="District / Zonal / School..." /></td>
      <td><input type="text" className="tbl-input" name={`${tableKey}_festival_${idx}`} placeholder="Name of meet" /></td>
      <td><YearSelect name={`${tableKey}_year_${idx}`} /></td>
      <td><input type="text" className="tbl-input" name={`${tableKey}_award_${idx}`} placeholder="1st Place / Gold..." /></td>
      <td style={{ textAlign: 'center' }}>
        {canRemove
          ? <button type="button" className="btn-del-row" onClick={onRemove} title="Remove"><i className="fas fa-times"></i></button>
          : <span style={{ color: '#ddd', fontSize: '.7rem' }}>—</span>}
      </td>
    </tr>
  );
}

function ArtDanceRow({ tableKey, idx, onRemove, canRemove }: { tableKey: string; idx: number; onRemove: () => void; canRemove: boolean }) {
  return (
    <tr>
      <td className="row-num">{NUMBERS[idx - 1] || `${idx}.`}</td>
      <td><input type="text" className="tbl-input" name={`${tableKey}_type_${idx}`} /></td>
      <td><input type="text" className="tbl-input" name={`${tableKey}_events_${idx}`} /></td>
      <td><YearSelect name={`${tableKey}_year_${idx}`} /></td>
      <td><input type="text" className="tbl-input" name={`${tableKey}_certs_${idx}`} /></td>
      <td style={{ textAlign: 'center' }}>
        {canRemove
          ? <button type="button" className="btn-del-row" onClick={onRemove} title="Remove"><i className="fas fa-times"></i></button>
          : <span style={{ color: '#ddd', fontSize: '.7rem' }}>—</span>}
      </td>
    </tr>
  );
}

export default function MedicalPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [segment, setSegment] = useState(1);
  const totalSegments = 4;
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false, error: false });

  const [athleticsRows, setAthleticsRows] = useState(() => buildInitialRows(4));
  const [indoorRows, setIndoorRows] = useState(() => buildInitialRows(4));
  const [outdoorRows, setOutdoorRows] = useState(() => buildInitialRows(4));
  const [artRows, setArtRows] = useState(() => buildInitialRows(4));
  const [instrumentsRows, setInstrumentsRows] = useState(() => buildInitialRows(4));
  const [singingRows, setSingingRows] = useState(() => buildInitialRows(3));
  const [dancingRows, setDancingRows] = useState(() => buildInitialRows(3));
  const [performingRows, setPerformingRows] = useState(() => buildInitialRows(3));
  const [organizedRows, setOrganizedRows] = useState(() => buildInitialRows(3));
  const [oratoryRows, setOratoryRows] = useState(() => buildInitialRows(4));
  const [leadershipRows, setLeadershipRows] = useState(() => buildInitialRows(4));

  const counters = useRef<Record<TableKey, number>>({
    athletics: 4, indoor: 4, outdoor: 4,
    art: 4, instruments: 4, singing: 3, dancing: 3,
    performing: 3, organized: 3, oratory: 4, leadership: 4,
  });

  const setterMap: Record<TableKey, React.Dispatch<React.SetStateAction<RowData[]>>> = {
    athletics: setAthleticsRows, indoor: setIndoorRows, outdoor: setOutdoorRows,
    art: setArtRows, instruments: setInstrumentsRows, singing: setSingingRows,
    dancing: setDancingRows, performing: setPerformingRows, organized: setOrganizedRows,
    oratory: setOratoryRows, leadership: setLeadershipRows,
  };

  function addRow(key: TableKey) {
    counters.current[key]++;
    setterMap[key]((prev) => [...prev, { id: counters.current[key] }]);
  }

  function removeRow(key: TableKey, id: number) {
    setterMap[key]((prev) => prev.filter((r) => r.id !== id));
  }

  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3500);
    return () => clearTimeout(t);
  }, [toast.visible]);

  function showToast(message: string, error = false) {
    setToast({ message, visible: true, error });
  }

  function resetRows() {
    counters.current = { athletics: 4, indoor: 4, outdoor: 4, art: 4, instruments: 4, singing: 3, dancing: 3, performing: 3, organized: 3, oratory: 4, leadership: 4 };
    setAthleticsRows(buildInitialRows(4)); setIndoorRows(buildInitialRows(4)); setOutdoorRows(buildInitialRows(4));
    setArtRows(buildInitialRows(4)); setInstrumentsRows(buildInitialRows(4)); setSingingRows(buildInitialRows(3));
    setDancingRows(buildInitialRows(3)); setPerformingRows(buildInitialRows(3)); setOrganizedRows(buildInitialRows(3));
    setOratoryRows(buildInitialRows(4)); setLeadershipRows(buildInitialRows(4));
  }

  function handleNext() {
    if (segment < totalSegments) {
      setSegment((s) => s + 1);
    } else {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        showToast('Medical report successfully submitted!');
        formRef.current?.reset();
        setSegment(1);
        resetRows();
      }, 1200);
    }
  }

  function handlePrev() { setSegment((s) => Math.max(1, s - 1)); }

  function handleClear() {
    if (!confirm('Clear fields across all 4 segments? This reset action is permanent.')) return;
    formRef.current?.reset();
    setSegment(1);
    resetRows();
    showToast('Form cleared across all tabs.');
  }

  function AddRowBtn({ tableKey }: { tableKey: TableKey }) {
    return (
      <button type="button" className="btn-add-row" onClick={() => addRow(tableKey)}>
        <i className="fas fa-plus"></i> Add Row
      </button>
    );
  }

  return (
    <>
      <style>{`
        .reg-page{min-height:calc(100vh - 77px);background:#f0ebe3;display:flex;justify-content:center;}
        .reg-main{flex:1;padding:28px 32px 48px;max-width:980px;}
        .form-card{background:#fff;border-radius:10px;border:1px solid #ddd;box-shadow:0 2px 12px rgba(0,0,0,.07);overflow:hidden;}
        .form-card-header{background:#7C0A02;color:#fff;padding:16px 28px;display:flex;align-items:center;gap:10px;}
        .form-card-header h2{font-size:1rem;font-weight:700;letter-spacing:.02em;margin:0;}
        .student-id-bar{background:#f9f5f0;border-bottom:1px solid #e8ddd0;padding:14px 28px;}
        .student-id-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .id-field{display:flex;flex-direction:column;gap:4px;}
        .id-label{font-size:.72rem;font-weight:700;color:#7C0A02;text-transform:uppercase;letter-spacing:.05em;}
        .id-input{padding:7px 10px;border:1px solid #ccc;border-radius:5px;font-family:'Inter',sans-serif;font-size:.83rem;color:#222;background:#fff;outline:none;transition:border-color .2s,box-shadow .2s;width:100%;box-sizing:border-box;}
        .id-input:focus{border-color:#7C0A02;box-shadow:0 0 0 3px rgba(124,10,2,.1);}
        .form-body{padding:24px 28px 12px;}
        .form-section-title{font-size:.82rem;font-weight:800;color:#7C0A02;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #7C0A02;padding-bottom:6px;margin:24px 0 14px;display:flex;align-items:center;gap:7px;}
        .form-section-title:first-child{margin-top:0;}
        .sub-section-label{display:flex;align-items:center;gap:8px;font-size:.82rem;font-weight:700;color:#333;margin:16px 0 8px;padding:7px 12px;background:#f5f0ee;border-left:3px solid #7C0A02;border-radius:0 4px 4px 0;}
        .sub-section-label i{color:#7C0A02;font-size:.8rem;}
        .field-row{display:flex;gap:20px;margin-bottom:14px;flex-wrap:wrap;}
        .field-group{display:flex;flex-direction:column;gap:5px;flex:1;min-width:200px;}
        .field-group.full{flex:100%;min-width:100%;}
        .field-label{font-size:.80rem;font-weight:600;color:#333;display:flex;gap:4px;align-items:baseline;}
        .field-num{font-weight:700;color:#7C0A02;white-space:nowrap;}
        .field-input{padding:8px 12px;border:1px solid #ccc;border-radius:5px;font-family:'Inter',sans-serif;font-size:.85rem;color:#222;background:#faf9f7;outline:none;transition:border-color .2s,box-shadow .2s;width:100%;box-sizing:border-box;}
        .field-input:focus{border-color:#7C0A02;box-shadow:0 0 0 3px rgba(124,10,2,.1);background:#fff;}
        textarea.field-input{resize:vertical;min-height:68px;}
        .data-table{width:100%;border-collapse:collapse;margin-bottom:6px;}
        .data-table thead tr{background:#f0ebe6;}
        .data-table thead th{padding:9px 10px;font-size:.76rem;font-weight:700;color:#7C0A02;text-align:left;border:1px solid #ddd2c8;white-space:nowrap;}
        .data-table tbody td{padding:5px 7px;border:1px solid #e5ddd5;vertical-align:middle;}
        .data-table tbody tr:nth-child(even){background:#faf8f6;}
        .data-table tbody tr:hover{background:#f5eeea;}
        .row-num{font-size:.76rem;font-weight:700;color:#7C0A02;text-align:center;width:30px;white-space:nowrap;}
        .tbl-input{padding:5px 8px;border:1px solid #d5cdc8;border-radius:4px;font-family:'Inter',sans-serif;font-size:.82rem;color:#222;background:#fff;outline:none;width:100%;transition:border-color .2s,box-shadow .2s;box-sizing:border-box;}
        .tbl-input:focus{border-color:#7C0A02;box-shadow:0 0 0 2px rgba(124,10,2,.1);}
        .btn-add-row{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:6px 16px;background:#fff;border:1.5px dashed #7C0A02;border-radius:6px;color:#7C0A02;font-family:'Inter',sans-serif;font-size:.81rem;font-weight:600;cursor:pointer;transition:all .2s;}
        .btn-add-row:hover{background:rgba(124,10,2,.06);border-style:solid;}
        .btn-del-row{background:none;border:none;color:#c53030;cursor:pointer;padding:3px 6px;border-radius:4px;font-size:.82rem;transition:all .2s;line-height:1;}
        .btn-del-row:hover{background:#fee2e2;}
        .sign-row{display:flex;gap:32px;margin-top:24px;margin-bottom:12px;flex-wrap:wrap;align-items:flex-end;}
        .sign-block{display:flex;flex-direction:column;gap:6px;flex:1;min-width:180px;}
        .sign-line{border-bottom:1.5px solid #444;height:36px;}
        .sign-label{font-size:.74rem;color:#555;font-weight:500;text-align:center;}
        .segment-progress{display:flex;gap:8px;padding:12px 28px;background:#faf7f4;border-bottom:1px solid #e8ddd0;}
        .seg-pill{flex:1;height:4px;border-radius:99px;background:#e0d5cc;transition:background .3s;}
        .seg-pill.done{background:#7C0A02;}
        .seg-pill.active{background:#b84040;}
        .form-actions{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:20px 28px 24px;border-top:1px solid #eee;flex-wrap:wrap;}
        .form-actions-right{display:flex;gap:14px;}
        .btn-clear{padding:10px 28px;background:#fff;border:1.5px solid #ccc;border-radius:6px;font-family:'Inter',sans-serif;font-size:.9rem;font-weight:600;color:#555;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:7px;}
        .btn-clear:hover{background:#f5f5f5;border-color:#999;color:#333;}
        .btn-next{padding:10px 32px;background:#7C0A02;border:none;border-radius:6px;font-family:'Inter',sans-serif;font-size:.9rem;font-weight:700;color:#fff;cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:7px;letter-spacing:.03em;}
        .btn-next:hover{background:#5a0602;box-shadow:0 4px 16px rgba(124,10,2,.35);transform:translateY(-1px);}
        .btn-next:disabled{opacity:.6;cursor:not-allowed;transform:none;}
        .toast{position:fixed;bottom:28px;right:28px;padding:14px 22px;border-radius:8px;font-size:.88rem;font-weight:600;display:flex;align-items:center;gap:10px;box-shadow:0 6px 24px rgba(0,0,0,.2);transform:translateY(80px);opacity:0;transition:all .35s cubic-bezier(.4,0,.2,1);z-index:1000;}
        .toast.show{transform:translateY(0);opacity:1;}
        .toast.success{background:#15803d;color:#fff;}
        .toast.error{background:#b91c1c;color:#fff;}
        @media(max-width:768px){
          .reg-main{padding:18px 14px 36px;}
          .form-body{padding:16px 14px;}
          .form-actions{padding:14px;flex-direction:column;}
          .form-actions-right{width:100%;justify-content:flex-end;}
          .student-id-grid{grid-template-columns:1fr;}
          .data-table{display:block;overflow-x:auto;}
        }
      `}</style>

      <div className="reg-page">
        <main className="reg-main">
          <div className="form-card" id="medical-form-card">

            {/* Header */}
            <div className="form-card-header">
              <i className="fas fa-stethoscope"></i>
              <h2>Medical Examination Report</h2>
            </div>

            {/* Progress pills */}
            <div className="segment-progress">
              {Array.from({ length: totalSegments }, (_, i) => (
                <div key={i} className={`seg-pill ${i + 1 < segment ? 'done' : i + 1 === segment ? 'active' : ''}`} />
              ))}
            </div>

            {/* Student ID bar */}
            <div className="student-id-bar">
              <div className="student-id-grid">
                <div className="id-field">
                  <label className="id-label" htmlFor="med-reg-no">Registration No.</label>
                  <input type="text" id="med-reg-no" name="reg_no" className="id-input" placeholder="e.g. 2026/ICT/001" />
                </div>
                <div className="id-field">
                  <label className="id-label" htmlFor="med-nic">NIC No. or Passport No.</label>
                  <input type="text" id="med-nic" name="nic_passport" className="id-input" placeholder="e.g. 200012345678 or N1234567" />
                </div>
              </div>
            </div>

            <form ref={formRef} noValidate>
              <div className="form-body">

                {/* ══ SEGMENT 1 ══ */}
                {segment === 1 && (
                  <div>
                    <div className="field-row" style={{ marginTop: '4px' }}>
                      <div className="field-group full">
                        <label className="field-label" htmlFor="med-name">
                          <span className="field-num">01.</span>&nbsp;Name of the Student (with initials)
                        </label>
                        <input type="text" id="med-name" name="student_name" className="field-input" placeholder="e.g. S. K. PERERA" required />
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field-group full">
                        <label className="field-label" htmlFor="med-hobbies">
                          <span className="field-num">02.</span>&nbsp;Hobbies
                        </label>
                        <textarea id="med-hobbies" name="hobbies" className="field-input" rows={3} placeholder="e.g. Reading, Painting, Photography, Music..." />
                      </div>
                    </div>
                    <div className="form-section-title"><i className="fas fa-running"></i> 03. Sports &amp; Games</div>

                    <div className="sub-section-label"><i className="fas fa-person-running"></i> (a) Sports / Athletics</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 30 }}>#</th><th>Athletics / Event</th><th>Events Participated (with details)</th>
                      <th>Details of the Sports Festival</th><th style={{ width: 80 }}>Year</th><th>Place / Awards</th><th style={{ width: 34 }}></th>
                    </tr></thead><tbody>
                        {athleticsRows.map((row, idx) => (
                          <SportsRow key={row.id} tableKey="athletics" idx={idx + 1} canRemove={idx > 0} onRemove={() => removeRow('athletics', row.id)} />
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="athletics" />

                    <div className="sub-section-label" style={{ marginTop: 20 }}><i className="fas fa-chess"></i> (b) Indoor Games / Sport</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 30 }}>#</th><th>Indoor Game / Sport</th><th>Events Participated (with details)</th>
                      <th>Details of the Sports Festival</th><th style={{ width: 80 }}>Year</th><th>Place / Awards</th><th style={{ width: 34 }}></th>
                    </tr></thead><tbody>
                        {indoorRows.map((row, idx) => (
                          <SportsRow key={row.id} tableKey="indoor" idx={idx + 1} canRemove={idx > 0} onRemove={() => removeRow('indoor', row.id)} />
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="indoor" />

                    <div className="sub-section-label" style={{ marginTop: 20 }}><i className="fas fa-football"></i> (c) Outdoor Games / Sports</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 30 }}>#</th><th>Outdoor Game / Sport</th><th>Events Participated (with details)</th>
                      <th>Details of the Sports Festival</th><th style={{ width: 80 }}>Year</th><th>Place / Awards</th><th style={{ width: 34 }}></th>
                    </tr></thead><tbody>
                        {outdoorRows.map((row, idx) => (
                          <SportsRow key={row.id} tableKey="outdoor" idx={idx + 1} canRemove={idx > 0} onRemove={() => removeRow('outdoor', row.id)} />
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="outdoor" />
                  </div>
                )}

                {/* ══ SEGMENT 2 ══ */}
                {segment === 2 && (
                  <div>
                    <div className="form-section-title"><i className="fas fa-palette"></i> 04. Art skills (Drawing, Sculpture)</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 30 }}>#</th><th>Art</th><th>Exhibitions held</th>
                      <th style={{ width: 100 }}>Year</th><th>Certificates received</th><th style={{ width: 34 }}></th>
                    </tr></thead><tbody>
                        {artRows.map((row, idx) => (
                          <ArtDanceRow key={row.id} tableKey="art" idx={idx + 1} canRemove={idx > 0} onRemove={() => removeRow('art', row.id)} />
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="art" />

                    <div className="form-section-title" style={{ marginTop: 28 }}><i className="fas fa-music"></i> 05. Music Skills</div>
                    <div className="sub-section-label"><i className="fas fa-guitar"></i> 1. Skills related to playing instruments</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 30 }}>#</th><th>Instrument you can play</th>
                      <th>Musical programmes / Shows participated</th><th style={{ width: 100 }}>Year</th><th style={{ width: 34 }}></th>
                    </tr></thead><tbody>
                        {instrumentsRows.map((row, idx) => (
                          <tr key={row.id}>
                            <td className="row-num">{NUMBERS[idx] || `${idx + 1}.`}</td>
                            <td><input type="text" className="tbl-input" name={`instruments_inst_${idx + 1}`} /></td>
                            <td><input type="text" className="tbl-input" name={`instruments_progs_${idx + 1}`} /></td>
                            <td><YearSelect name={`instruments_year_${idx + 1}`} /></td>
                            <td style={{ textAlign: 'center' }}>
                              {idx > 0 ? <button type="button" className="btn-del-row" onClick={() => removeRow('instruments', row.id)}><i className="fas fa-times"></i></button>
                                : <span style={{ color: '#ddd', fontSize: '.7rem' }}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="instruments" />

                    <div className="sub-section-label" style={{ marginTop: 20 }}><i className="fas fa-microphone"></i> 2. Singing Skill</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 30 }}>#</th><th>Singing details</th><th style={{ width: 100 }}>Year</th><th style={{ width: 34 }}></th>
                    </tr></thead><tbody>
                        {singingRows.map((row, idx) => (
                          <tr key={row.id}>
                            <td className="row-num">{NUMBERS[idx] || `${idx + 1}.`}</td>
                            <td><input type="text" className="tbl-input" name={`singing_details_${idx + 1}`} /></td>
                            <td><YearSelect name={`singing_year_${idx + 1}`} /></td>
                            <td style={{ textAlign: 'center' }}>
                              {idx > 0 ? <button type="button" className="btn-del-row" onClick={() => removeRow('singing', row.id)}><i className="fas fa-times"></i></button>
                                : <span style={{ color: '#ddd', fontSize: '.7rem' }}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="singing" />
                    <div className="field-row" style={{ marginTop: 10 }}>
                      <div className="field-group" style={{ flexDirection: 'row', alignItems: 'center', background: '#f5eeea', padding: '8px 14px', borderRadius: 4 }}>
                        <label className="field-label" style={{ margin: 0, marginRight: 10, whiteSpace: 'nowrap' }}>Singing medium:</label>
                        <input type="text" className="tbl-input" style={{ maxWidth: 300, background: '#fff' }} name="singing_medium" />
                      </div>
                    </div>

                    <div className="form-section-title" style={{ marginTop: 28 }}><i className="fas fa-child-reaching"></i> 06. Dancing Skills</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 30 }}>#</th><th>Dancing category</th><th>Events participated</th>
                      <th style={{ width: 100 }}>Year</th><th>Certificates / awards received</th><th style={{ width: 34 }}></th>
                    </tr></thead><tbody>
                        {dancingRows.map((row, idx) => (
                          <ArtDanceRow key={row.id} tableKey="dancing" idx={idx + 1} canRemove={idx > 0} onRemove={() => removeRow('dancing', row.id)} />
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="dancing" />
                  </div>
                )}

                {/* ══ SEGMENT 3 ══ */}
                {segment === 3 && (
                  <div>
                    <div className="form-section-title"><i className="fas fa-theater-masks"></i> 07. Performing Skills</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 40 }}>#</th><th>Drama / Films / Teledrama participated</th>
                      <th>Character performed</th><th>Direction</th><th>Year of production</th><th style={{ width: 44 }}></th>
                    </tr></thead><tbody>
                        {performingRows.map((row, idx) => (
                          <tr key={row.id}>
                            <td className="row-num">{NUMBERS[idx] || `${idx + 1}.`}</td>
                            <td><input type="text" className="tbl-input" name={`performing_drama_${idx + 1}`} /></td>
                            <td><input type="text" className="tbl-input" name={`performing_character_${idx + 1}`} /></td>
                            <td><input type="text" className="tbl-input" name={`performing_direction_${idx + 1}`} /></td>
                            <td><YearSelect name={`performing_year_${idx + 1}`} /></td>
                            <td style={{ textAlign: 'center' }}>
                              {idx > 0 ? <button type="button" className="btn-del-row" onClick={() => removeRow('performing', row.id)}><i className="fas fa-times"></i></button>
                                : <span style={{ color: '#ddd', fontSize: '.7rem' }}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="performing" />

                    <div className="form-section-title" style={{ marginTop: 28 }}><i className="fas fa-calendar-check"></i> 08. Any events, exhibitions, drama you have organized under No. 3, 4, 5, 6, 7</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 40 }}>#</th><th>Event / Exhibition</th><th>Your Role / Responsibility</th>
                      <th>Details of Organization</th><th style={{ width: 100 }}>Year</th><th style={{ width: 44 }}></th>
                    </tr></thead><tbody>
                        {organizedRows.map((row, idx) => (
                          <tr key={row.id}>
                            <td className="row-num">{ROMAN_LOWER[idx] || `${idx + 1}.`}</td>
                            <td><input type="text" className="tbl-input" name={`organized_event_${idx + 1}`} /></td>
                            <td><input type="text" className="tbl-input" name={`organized_role_${idx + 1}`} /></td>
                            <td><input type="text" className="tbl-input" name={`organized_details_${idx + 1}`} /></td>
                            <td><YearSelect name={`organized_year_${idx + 1}`} /></td>
                            <td style={{ textAlign: 'center' }}>
                              {idx > 0 ? <button type="button" className="btn-del-row" onClick={() => removeRow('organized', row.id)}><i className="fas fa-times"></i></button>
                                : <span style={{ color: '#ddd', fontSize: '.7rem' }}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="organized" />

                    <div className="form-section-title" style={{ marginTop: 28 }}><i className="fas fa-comment-dots"></i> 09. Oratory Skills</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 40 }}>#</th><th>Orations / Debates participated</th><th>Details of the events</th>
                      <th style={{ width: 100 }}>Year</th><th>Certificates / awards received</th><th style={{ width: 44 }}></th>
                    </tr></thead><tbody>
                        {oratoryRows.map((row, idx) => (
                          <tr key={row.id}>
                            <td className="row-num">{NUMBERS[idx] || `${idx + 1}.`}</td>
                            <td><input type="text" className="tbl-input" name={`oratory_debate_${idx + 1}`} /></td>
                            <td><input type="text" className="tbl-input" name={`oratory_details_${idx + 1}`} /></td>
                            <td><YearSelect name={`oratory_year_${idx + 1}`} /></td>
                            <td><input type="text" className="tbl-input" name={`oratory_award_${idx + 1}`} /></td>
                            <td style={{ textAlign: 'center' }}>
                              {idx > 0 ? <button type="button" className="btn-del-row" onClick={() => removeRow('oratory', row.id)}><i className="fas fa-times"></i></button>
                                : <span style={{ color: '#ddd', fontSize: '.7rem' }}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="oratory" />

                    <div className="form-section-title" style={{ marginTop: 28 }}><i className="fas fa-users-rectangle"></i> 10. Leadership – Positions held in committees, associations in school and village</div>
                    <table className="data-table"><thead><tr>
                      <th style={{ width: 40 }}>#</th><th>Position</th><th>Institute / Organization</th>
                      <th>Period</th><th>Service extended</th><th style={{ width: 44 }}></th>
                    </tr></thead><tbody>
                        {leadershipRows.map((row, idx) => (
                          <tr key={row.id}>
                            <td className="row-num">{NUMBERS[idx] || `${idx + 1}.`}</td>
                            <td><input type="text" className="tbl-input" name={`leadership_position_${idx + 1}`} /></td>
                            <td><input type="text" className="tbl-input" name={`leadership_org_${idx + 1}`} /></td>
                            <td><input type="text" className="tbl-input" name={`leadership_period_${idx + 1}`} placeholder="e.g. 2024–2025" /></td>
                            <td><input type="text" className="tbl-input" name={`leadership_service_${idx + 1}`} /></td>
                            <td style={{ textAlign: 'center' }}>
                              {idx > 0 ? <button type="button" className="btn-del-row" onClick={() => removeRow('leadership', row.id)}><i className="fas fa-times"></i></button>
                                : <span style={{ color: '#ddd', fontSize: '.7rem' }}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody></table>
                    <AddRowBtn tableKey="leadership" />
                  </div>
                )}

                {/* ══ SEGMENT 4 ══ */}
                {segment === 4 && (
                  <div>
                    <div className="form-section-title"><i className="fas fa-file-signature"></i> Final Declaration &amp; Submission</div>
                    <p style={{ fontSize: '0.85rem', color: '#444', lineHeight: 1.7, marginBottom: 20 }}>
                      I hereby declare that the particulars given above are true and accurate to the best of my knowledge.
                      I understand that any false declaration may result in the cancellation of my application or registration.
                    </p>
                    <div className="sign-row">
                      <div className="sign-block">
                        <div className="sign-line"></div>
                        <div className="sign-label">Date</div>
                      </div>
                      <div className="sign-block" style={{ flex: 2 }}>
                        <div className="sign-line"></div>
                        <div className="sign-label">Signature of the Applicant</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>{/* /form-body */}

              {/* Actions Footer */}
              <div className="form-actions">
                <button type="button" className="btn-clear" onClick={handleClear}>
                  <i className="fas fa-rotate-left"></i> Clear All
                </button>
                <div className="form-actions-right">
                  {segment > 1 && (
                    <button type="button" className="btn-clear" onClick={handlePrev}>
                      <i className="fas fa-arrow-left"></i> Previous
                    </button>
                  )}
                  <button type="button" className="btn-next" onClick={handleNext} disabled={submitting}>
                    {submitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</>
                      : segment === totalSegments ? <>Submit <i className="fas fa-paper-plane"></i></>
                        : <>Next <i className="fas fa-arrow-right"></i></>}
                  </button>
                </div>
              </div>
            </form>

            <p style={{ textAlign: 'center', fontSize: '.75rem', color: '#999', padding: '0 28px 14px' }}>
              Page {segment} of {totalSegments}
            </p>

          </div>
        </main>
      </div>

      {/* Toast */}
      <div className={`toast ${toast.visible ? 'show' : ''} ${toast.error ? 'error' : 'success'}`}>
        <i className={`fas ${toast.error ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
        <span>{toast.message}</span>
      </div>
    </>
  );
}
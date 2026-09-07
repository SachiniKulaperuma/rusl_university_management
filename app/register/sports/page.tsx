'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

const currentYear = new Date().getFullYear();
const yearOptions = Array.from(
  { length: currentYear - 1980 + 1 },
  (_, idx) => currentYear - idx,
);
const sportYearOptions = Array.from(
  { length: currentYear - 2000 + 1 },
  (_, idx) => currentYear - idx,
);

const facultyOptions = [
  'Faculty of Agriculture',
  'Faculty of Applied Sciences',
  'Faculty of Indigenous Medicine',
  'Faculty of Management Studies',
  'Faculty of Medicine & Allied Sciences',
  'Faculty of Social Sciences & Humanities',
  'Faculty of Technology',
];

const districtOptions = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
];

const SPORT_LEVELS = [
  'School Level',
  'Zonal Level',
  'District Level',
  'Provincial Level',
  'National Level',
  'International Level',
  'University Level',
  'Other',
];

const SPORT_LIST = [
  'Athletics',
  'Badminton',
  'Basketball',
  'Boxing',
  'Chess',
  'Cricket',
  'Cycling',
  'Football',
  'Gymnastics',
  'Hockey',
  'Judo',
  'Kabaddi',
  'Karate',
  'Netball',
  'Rugby',
  'Swimming',
  'Table Tennis',
  'Tennis',
  'Volleyball',
  'Weightlifting',
  'Wrestling',
  'Other',
];

const romanNums = [
  'I.',
  'II.',
  'III.',
  'IV.',
  'V.',
  'VI.',
  'VII.',
  'VIII.',
  'IX.',
  'X.',
  'XI.',
  'XII.',
  'XIII.',
  'XIV.',
  'XV.',
];

export default function SportsPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sportRows, setSportRows] = useState<number[]>([1, 2, 3]);
  const [nextSportId, setNextSportId] = useState(4);
  const [toast, setToast] = useState({
    message: '',
    visible: false,
    error: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('rusl_user');
    if (!stored) return;
    try {
      setLoggedInUser(JSON.parse(stored));
    } catch {
      sessionStorage.removeItem('rusl_user');
    }
  }, []);

  useEffect(() => {
    if (!toast.visible) return;
    const timer = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [toast.visible]);

  const addSportRow = () => {
    setSportRows((rows) => [...rows, nextSportId]);
    setNextSportId((id) => id + 1);
  };

  const removeSportRow = (id: number) => {
    setSportRows((rows) => rows.filter((row) => row !== id));
  };

  const showToast = (message: string, error = false) => {
    setToast({ message, visible: true, error });
  };

  const clearForm = () => {
    if (!confirm('Clear all fields? This cannot be undone.')) return;
    formRef.current?.reset();
    setSportRows([1, 2, 3]);
    setNextSportId(4);
    setSubmitting(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    if (!formRef.current.checkValidity()) {
      showToast('Please fill in all required fields.', true);
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      showToast('Physical attributes & sport achievements submitted successfully!');
    }, 1200);
  };

  const logoutUser = () => {
    sessionStorage.removeItem('rusl_user');
    window.location.href = '/signin.html';
  };

  return (
    <>
      <style>{`
        .reg-page { min-height: calc(100vh - 77px); background: #f0ebe3; display: flex; justify-content: center; }
        .reg-main { flex: 1; padding: 28px 32px 48px; max-width: 960px; }
        .form-card { background: #fff; border-radius: 10px; border: 1px solid #ddd; box-shadow: 0 2px 12px rgba(0, 0, 0, .07); overflow: hidden; }
        .form-card-header { background: #7C0A02; color: #fff; padding: 16px 28px; display: flex; align-items: center; gap: 10px; }
        .form-card-header h2 { font-size: 1rem; font-weight: 700; letter-spacing: .02em; margin: 0; }
        .form-body { padding: 26px 28px 12px; }
        .form-section-title { font-size: .82rem; font-weight: 800; color: #7C0A02; text-transform: uppercase; letter-spacing: .08em; border-bottom: 2px solid #7C0A02; padding-bottom: 6px; margin: 24px 0 16px; display: flex; align-items: center; gap: 7px; }
        .form-section-title:first-child { margin-top: 0; }
        .field-row { display: flex; gap: 20px; margin-bottom: 14px; flex-wrap: wrap; }
        .field-group { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 200px; }
        .field-group.full { flex: 100%; min-width: 100%; }
        .field-group.half { flex: 1; min-width: 180px; }
        .field-label { font-size: .80rem; font-weight: 600; color: #333; display: flex; gap: 4px; align-items: center; }
        .field-label .field-num { font-weight: 700; color: #7C0A02; white-space: nowrap; }
        .field-input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 5px; font-family: 'Inter', sans-serif; font-size: .85rem; color: #222; background: #faf9f7; outline: none; transition: border-color .2s, box-shadow .2s; width: 100%; }
        .field-input:focus { border-color: #7C0A02; box-shadow: 0 0 0 3px rgba(124, 10, 2, .1); background: #fff; }
        select.field-input { cursor: pointer; appearance: auto; }
        textarea.field-input { resize: vertical; min-height: 80px; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
        .data-table thead tr { background: #f5f0ee; }
        .data-table thead th { padding: 9px 12px; font-size: .78rem; font-weight: 700; color: #7C0A02; text-align: left; border: 1px solid #e0d8d0; white-space: nowrap; }
        .data-table tbody td { padding: 6px 8px; border: 1px solid #e8e0d8; vertical-align: middle; }
        .data-table tbody tr:nth-child(even) { background: #faf9f7; }
        .data-table tbody tr:hover { background: #f5e0ee; }
        .row-num { font-size: .78rem; font-weight: 700; color: #7C0A02; text-align: center; padding: 0 4px; min-width: 28px; }
        .tbl-input { padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: .83rem; color: #222; background: #fff; outline: none; width: 100%; transition: border-color .2s, box-shadow .2s; }
        .tbl-input:focus { border-color: #7C0A02; box-shadow: 0 0 0 2px rgba(124, 10, 2, .1); }
        select.tbl-input { cursor: pointer; appearance: auto; }
        .btn-add-row { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; padding: 7px 18px; background: #fff; border: 1.5px dashed #7C0A02; border-radius: 6px; color: #7C0A02; font-family: 'Inter', sans-serif; font-size: .82rem; font-weight: 600; cursor: pointer; transition: all .2s; }
        .btn-add-row:hover { background: rgba(124, 10, 2, .06); border-style: solid; }
        .btn-del-row { background: none; border: none; color: #c53030; cursor: pointer; padding: 4px 6px; border-radius: 4px; font-size: .85rem; transition: all .2s; line-height: 1; }
        .btn-del-row:hover { background: #fee2e2; }
        .form-actions { display: flex; justify-content: flex-end; gap: 14px; padding: 20px 28px 24px; border-top: 1px solid #eee; flex-wrap: wrap; }
        .btn-clear { padding: 10px 28px; background: #fff; border: 1.5px solid #ccc; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 600; color: #555; cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 7px; }
        .btn-clear:hover { background: #f5f5f5; border-color: #999; color: #333; }
        .btn-submit { padding: 10px 34px; background: #7C0A02; border: none; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 700; color: #fff; cursor: pointer; transition: all .25s; display: flex; align-items: center; gap: 7px; letter-spacing: .03em; }
        .btn-submit:hover { background: #5a0602; box-shadow: 0 4px 16px rgba(124, 10, 2, .35); transform: translateY(-1px); }
        .btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .toast { position: fixed; bottom: 28px; right: 28px; background: #15803d; color: #fff; padding: 14px 22px; border-radius: 8px; font-size: .88rem; font-weight: 600; display: flex; align-items: center; gap: 10px; box-shadow: 0 6px 24px rgba(0, 0, 0, .2); transform: translateY(80px); opacity: 0; transition: all .35s cubic-bezier(.4, 0, .2, 1); z-index: 1000; }
        .toast.show { transform: translateY(0); opacity: 1; }
        @media (max-width: 768px) { .reg-main { padding: 18px 14px 36px; } .form-body { padding: 16px 14px; } .form-actions { padding: 14px; } .data-table { display: block; overflow-x: auto; } }
      `}</style>

      <div className="reg-page">
        <main className="reg-main">
          <div className="form-card">
            <div className="form-card-header">
              <i className="fas fa-trophy"></i>
              <h2>Students' Physical Attributes & Sport Achievements</h2>
            </div>
            <form ref={formRef} noValidate onSubmit={handleSubmit}>
              <div className="form-body">
                <div className="form-section-title">
                  <i className="fas fa-circle-dot"></i> Personal Information
                </div>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="sp-fullname">
                      <span className="field-num">1.</span> Full Name
                    </label>
                    <input
                      type="text"
                      id="sp-fullname"
                      name="full_name"
                      className="field-input"
                      placeholder="e.g. SACHINI KULAPERUMA PERERA"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="sp-faculty">
                      <span className="field-num">2.</span> Faculty
                    </label>
                    <select id="sp-faculty" name="faculty" className="field-input" required>
                      <option value="">-- Select Faculty --</option>
                      {facultyOptions.map((faculty) => (
                        <option key={faculty} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="sp-weight">
                      <span className="field-num">3.</span> Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="sp-weight"
                      name="weight_kg"
                      className="field-input"
                      placeholder="e.g. 65"
                      min="20"
                      max="200"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="field-group half">
                    <label className="field-label" htmlFor="sp-height">
                      <span className="field-num">4.</span> Height (cm)
                    </label>
                    <input
                      type="number"
                      id="sp-height"
                      name="height_cm"
                      className="field-input"
                      placeholder="e.g. 170"
                      min="100"
                      max="250"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="sp-dob">
                      <span className="field-num">5.</span> Date of Birth
                    </label>
                    <input type="date" id="sp-dob" name="date_of_birth" className="field-input" required />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="sp-address">
                      <span className="field-num">6.</span> Permanent Address
                    </label>
                    <textarea
                      id="sp-address"
                      name="permanent_address"
                      className="field-input"
                      rows={3}
                      placeholder="House No, Street, City"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="sp-district">
                      <span className="field-num">7.</span> District
                    </label>
                    <select id="sp-district" name="district" className="field-input" required>
                      <option value="">-- Select District --</option>
                      {districtOptions.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="sp-contact">
                      <span className="field-num">8.</span> Contact No
                    </label>
                    <input
                      type="tel"
                      id="sp-contact"
                      name="contact_no"
                      className="field-input"
                      placeholder="e.g. 0712345678"
                      required
                    />
                  </div>
                </div>

                <div className="form-section-title">
                  <i className="fas fa-school"></i> Education Detail
                </div>

                <p style={{ fontSize: '.8rem', color: '#888', marginBottom: '10px' }}>
                  <i className="fas fa-circle-info" style={{ color: '#7C0A02' }}></i>
                  &nbsp;List the schools you attended (most recent first).
                </p>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '34px' }}>#</th>
                      <th>Name of the School</th>
                      <th style={{ width: '120px' }}>From</th>
                      <th style={{ width: '120px' }}>To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((row) => (
                      <tr key={row}>
                        <td className="row-num">{romanNums[row - 1]}</td>
                        <td>
                          <input type="text" className="tbl-input" name={`school_name_${row}`} placeholder="School name" />
                        </td>
                        <td>
                          <select className="tbl-input" name={`edu_from_${row}`}>
                            <option value="">Year</option>
                            {yearOptions.map((year) => (
                              <option key={`from-${row}-${year}`} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select className="tbl-input" name={`edu_to_${row}`}>
                            <option value="">Year</option>
                            {yearOptions.map((year) => (
                              <option key={`to-${row}-${year}`} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="form-section-title">
                  <i className="fas fa-medal"></i> Sports Achievement
                </div>

                <p style={{ fontSize: '.8rem', color: '#888', marginBottom: '10px' }}>
                  <i className="fas fa-circle-info" style={{ color: '#7C0A02' }}></i>
                  &nbsp;You can add more rows using the <strong style={{ color: '#7C0A02' }}>+ Add Achievement</strong> button below.
                </p>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '34px' }}>#</th>
                      <th style={{ width: '110px' }}>Year</th>
                      <th>Sport</th>
                      <th style={{ width: '150px' }}>Level</th>
                      <th>Achievement</th>
                      <th style={{ width: '36px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sportRows.map((rowId, index) => (
                      <tr key={rowId}>
                        <td className="row-num">{romanNums[index] || `${index + 1}.`}</td>
                        <td>
                          <select className="tbl-input" name={`sport_year_${rowId}`} defaultValue="">
                            <option value="">Year</option>
                            {sportYearOptions.map((year) => (
                              <option key={`sport-year-${rowId}-${year}`} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select className="tbl-input" name={`sport_name_${rowId}`} defaultValue="">
                            <option value="">-- Select Sport --</option>
                            {SPORT_LIST.map((sport) => (
                              <option key={`sport-${rowId}-${sport}`} value={sport}>
                                {sport}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select className="tbl-input" name={`sport_level_${rowId}`} defaultValue="">
                            <option value="">-- Level --</option>
                            {SPORT_LEVELS.map((level) => (
                              <option key={`sport-level-${rowId}-${level}`} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="tbl-input"
                            name={`sport_achievement_${rowId}`}
                            placeholder="e.g. Gold Medal, 1st Place"
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {index > 0 ? (
                            <button type="button" className="btn-del-row" onClick={() => removeSportRow(rowId)}>
                              <i className="fas fa-times"></i>
                            </button>
                          ) : (
                            <span style={{ fontSize: '.7rem', color: '#ccc' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button type="button" className="btn-add-row" onClick={addSportRow}>
                  <i className="fas fa-plus"></i> Add Achievement
                </button>

                <div className="form-section-title">
                  <i className="fas fa-certificate"></i> Other Qualification
                </div>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="sp-other-qual">
                      Other Qualifications / Certificates / Awards
                    </label>
                    <textarea
                      id="sp-other-qual"
                      name="other_qualification"
                      className="field-input"
                      rows={4}
                      placeholder="e.g. Swimming Certificate – Grade A (2022), Duke of Edinburgh Award..."
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-clear" onClick={clearForm}>
                  <i className="fas fa-rotate-left"></i> Clear
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  <i className={`fas ${submitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {toast.visible && (
        <div className={`toast ${toast.visible ? 'show' : ''}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}

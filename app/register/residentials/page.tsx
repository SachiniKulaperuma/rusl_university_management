'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

const districtOptions = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
  'Trincomalee', 'Vavuniya',
];

const facultyOptions = [
  'Faculty of Agriculture',
  'Faculty of Applied Sciences',
  'Faculty of Indigenous Medicine',
  'Faculty of Management Studies',
  'Faculty of Medicine & Allied Sciences',
  'Faculty of Social Sciences & Humanities',
  'Faculty of Technology',
];

const hostelOptions = ['Male Hostel', 'Female Hostel'];

const occupationOptions = [
  'Government Employee',
  'Private Sector Employee',
  'Self Employed',
  'Farmer',
  'Daily Wage Worker',
  'Retired',
  'Deceased',
  'Other',
];

export default function ResidentialsPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false, error: false });

  useEffect(() => {
    if (!toast.visible) return;
    const timer = window.setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [toast.visible]);

  const showToast = (message: string, error = false) => {
    setToast({ message, visible: true, error });
  };

  const clearForm = () => {
    if (!confirm('Clear all fields? This cannot be undone.')) return;
    formRef.current?.reset();
    setSubmitting(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    if (!formRef.current.checkValidity()) {
      showToast('Please fill in all required fields.', true);
      formRef.current.reportValidity();
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      showToast('Residential facilities application submitted successfully!');
      formRef.current?.reset();
    }, 1200);
  };

  const downloadForm = () => {
    showToast('Residential application form download started!');
    const formHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>RUSL – Application for Residential Facilities</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 30px; color: #000; }
    h1 { text-align: center; font-size: 16px; color: #7C0A02; margin-bottom: 4px; }
    h2 { text-align: center; font-size: 13px; margin-bottom: 20px; color: #333; }
    .header-block { text-align: center; border-bottom: 2px solid #7C0A02; padding-bottom: 12px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    td, th { border: 1px solid #999; padding: 6px 10px; font-size: 11px; }
    th { background: #f0e8e8; font-weight: bold; text-align: left; }
    .section-title { background: #7C0A02; color: #fff; padding: 6px 10px; font-weight: bold; font-size: 12px; margin-top: 18px; margin-bottom: 0; }
    .sign-area { display: flex; justify-content: space-between; margin-top: 40px; }
    .sign-box { text-align: center; width: 200px; }
    .sign-line { border-top: 1px solid #000; padding-top: 4px; font-size: 10px; }
    @media print { body { margin: 15mm; } }
  </style>
</head>
<body>
  <div class="header-block">
    <h1>RAJARATA UNIVERSITY OF SRI LANKA</h1>
    <h2>APPLICATION FOR RESIDENTIAL FACILITIES</h2>
    <p style="font-size:11px;">Academic Year: _____________________&nbsp;&nbsp; Faculty: _____________________</p>
  </div>

  <p class="section-title">SECTION I – STUDENT INFORMATION</p>
  <table>
    <tr><th style="width:30%">Registration No.</th><td></td><th style="width:30%">NIC No.</th><td></td></tr>
    <tr><th>Full Name</th><td colspan="3"></td></tr>
    <tr><th>Permanent Address</th><td colspan="3" style="height:50px;"></td></tr>
    <tr><th>District</th><td></td><th>Distance from University (km)</th><td></td></tr>
    <tr><th>Contact No.</th><td></td><th>E-mail</th><td></td></tr>
    <tr><th>Sex</th><td>Male &nbsp;☐ &nbsp;&nbsp; Female &nbsp;☐</td><th>Hostel Preference</th><td></td></tr>
  </table>

  <p class="section-title">SECTION II – PARENTAL / GUARDIAN DETAILS</p>
  <table>
    <tr><th colspan="4">Father / Guardian</th></tr>
    <tr><th style="width:30%">Name</th><td colspan="3"></td></tr>
    <tr><th>Occupation</th><td></td><th>Annual Income (Rs.)</th><td></td></tr>
    <tr><th colspan="4">Mother / Guardian</th></tr>
    <tr><th>Name</th><td colspan="3"></td></tr>
    <tr><th>Occupation</th><td></td><th>Annual Income (Rs.)</th><td></td></tr>
    <tr><th>Total Household Income (Rs.)</th><td colspan="3"></td></tr>
  </table>

  <p class="section-title">SECTION III – SIBLINGS AT UNIVERSITY (if any)</p>
  <table>
    <tr><th>Name</th><th>University</th><th>Residing in Hostel</th></tr>
    <tr><td style="height:26px;"></td><td></td><td>Yes &nbsp;☐ &nbsp; No &nbsp;☐</td></tr>
    <tr><td style="height:26px;"></td><td></td><td>Yes &nbsp;☐ &nbsp; No &nbsp;☐</td></tr>
  </table>

  <p class="section-title">SECTION IV – DIVISIONAL SECRETARY CERTIFICATION</p>
  <table>
    <tr><th style="width:30%">Divisional Secretariat</th><td colspan="3"></td></tr>
    <tr><th>Certified Household Income (Rs.)</th><td colspan="3"></td></tr>
  </table>

  <p class="section-title">SECTION V – DECLARATION</p>
  <p style="font-size:11px;line-height:1.7;margin:10px 0;">
    I hereby declare that the information furnished above is true and correct to the best of my knowledge and belief.
    I understand that providing false information will render me liable to cancellation of the residential facility.
  </p>

  <div class="sign-area">
    <div class="sign-box">
      <div style="height:50px;"></div>
      <div class="sign-line">Signature of Applicant</div>
      <div style="margin-top:6px;font-size:10px;">Date: ___________________</div>
    </div>
    <div class="sign-box">
      <div style="height:50px;"></div>
      <div class="sign-line">Signature &amp; Stamp of Grama Niladhari</div>
      <div style="margin-top:6px;font-size:10px;">Date: ___________________</div>
    </div>
    <div class="sign-box">
      <div style="height:50px;"></div>
      <div class="sign-line">Signature &amp; Stamp of Divisional Secretary</div>
      <div style="margin-top:6px;font-size:10px;">Date: ___________________</div>
    </div>
  </div>

  <p style="font-size:10px;color:#666;margin-top:30px;border-top:1px solid #ddd;padding-top:10px;">
    RUSL Smart University System – Residential Facilities Application | Rajarata University of Sri Lanka, Mihintale – 50300
  </p>
</body>
</html>`;
    const blob = new Blob([formHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RUSL_Residential_Application_Form.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        .reg-page { min-height: calc(100vh - 77px); background: #f0ebe3; display: flex; justify-content: center; }
        .reg-main { flex: 1; padding: 28px 32px 48px; max-width: 960px; }
        .form-card { background: #fff; border-radius: 10px; border: 1px solid #ddd; box-shadow: 0 2px 12px rgba(0,0,0,.07); overflow: hidden; }
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
        .field-label .req { color: #c53030; }
        .field-input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 5px; font-family: 'Inter', sans-serif; font-size: .85rem; color: #222; background: #faf9f7; outline: none; transition: border-color .2s, box-shadow .2s; width: 100%; box-sizing: border-box; }
        .field-input:focus { border-color: #7C0A02; box-shadow: 0 0 0 3px rgba(124,10,2,.1); background: #fff; }
        select.field-input { cursor: pointer; }
        textarea.field-input { resize: vertical; min-height: 80px; }
        .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; border-radius: 7px; padding: 12px 18px; font-size: .84rem; color: #1e3a6e; line-height: 1.65; margin-bottom: 14px; display: flex; gap: 10px; align-items: flex-start; }
        .info-box i { color: #3b82f6; margin-top: 2px; flex-shrink: 0; }
        .warning-box { background: #fff3f3; border: 1px solid #f8c4c4; border-radius: 7px; padding: 12px 18px; font-size: .84rem; color: #8b2020; line-height: 1.65; margin-bottom: 14px; display: flex; gap: 10px; align-items: flex-start; }
        .warning-box i { color: #c53030; margin-top: 2px; flex-shrink: 0; }
        .form-actions { display: flex; justify-content: space-between; align-items: center; gap: 14px; padding: 20px 28px 24px; border-top: 1px solid #eee; flex-wrap: wrap; }
        .form-actions-right { display: flex; gap: 14px; flex-wrap: wrap; }
        .btn-clear { padding: 10px 28px; background: #fff; border: 1.5px solid #ccc; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 600; color: #555; cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 7px; }
        .btn-clear:hover { background: #f5f5f5; border-color: #999; color: #333; }
        .btn-download { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: #fff; color: #7C0A02; border: 1.5px solid #7C0A02; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 600; cursor: pointer; transition: all .25s; }
        .btn-download:hover { background: rgba(124,10,2,.06); }
        .btn-submit { padding: 10px 34px; background: #7C0A02; border: none; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 700; color: #fff; cursor: pointer; transition: all .25s; display: flex; align-items: center; gap: 7px; letter-spacing: .03em; }
        .btn-submit:hover { background: #5a0602; box-shadow: 0 4px 16px rgba(124,10,2,.35); transform: translateY(-1px); }
        .btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .toast { position: fixed; bottom: 28px; right: 28px; padding: 14px 22px; border-radius: 8px; font-size: .88rem; font-weight: 600; display: flex; align-items: center; gap: 10px; box-shadow: 0 6px 24px rgba(0,0,0,.2); transform: translateY(80px); opacity: 0; transition: all .35s cubic-bezier(.4,0,.2,1); z-index: 1000; }
        .toast.show { transform: translateY(0); opacity: 1; }
        .toast.success { background: #15803d; color: #fff; }
        .toast.error { background: #c53030; color: #fff; }
        @media (max-width: 768px) {
          .reg-main { padding: 18px 14px 36px; }
          .form-body { padding: 16px 14px; }
          .form-actions { padding: 14px; }
          .form-actions { flex-direction: column; align-items: stretch; }
          .form-actions-right { justify-content: flex-end; }
        }
      `}</style>

      <div className="reg-page">
        <main className="reg-main">
          <div className="form-card">
            <div className="form-card-header">
              <i className="fas fa-building"></i>
              <h2>Application for Residential Facilities</h2>
            </div>

            <form ref={formRef} noValidate onSubmit={handleSubmit}>
              <div className="form-body">

                {/* ── SECTION I – Student Information ── */}
                <div className="form-section-title">
                  <i className="fas fa-user-graduate"></i> Student Information
                </div>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="rs-fullname">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="rs-fullname"
                      name="full_name"
                      className="field-input"
                      placeholder="e.g. SACHINI KULAPERUMA PERERA"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-regno">
                      Registration Number <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="rs-regno"
                      name="registration_number"
                      className="field-input"
                      placeholder="e.g. 2023/IS/001"
                      required
                    />
                  </div>
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-nic">
                      NIC Number <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="rs-nic"
                      name="nic_number"
                      className="field-input"
                      placeholder="e.g. 200012345678"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="rs-faculty">
                      Faculty <span className="req">*</span>
                    </label>
                    <select id="rs-faculty" name="faculty" className="field-input" required defaultValue="">
                      <option value="">-- Select Faculty --</option>
                      {facultyOptions.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="rs-address">
                      Permanent Address <span className="req">*</span>
                    </label>
                    <textarea
                      id="rs-address"
                      name="permanent_address"
                      className="field-input"
                      rows={3}
                      placeholder="House No., Street, City"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-district">
                      District <span className="req">*</span>
                    </label>
                    <select id="rs-district" name="district" className="field-input" required defaultValue="">
                      <option value="">-- Select District --</option>
                      {districtOptions.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-distance">
                      Distance from University (km) <span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      id="rs-distance"
                      name="distance_km"
                      className="field-input"
                      placeholder="e.g. 150"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-contact">
                      Contact Number <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      id="rs-contact"
                      name="contact_no"
                      className="field-input"
                      placeholder="e.g. 0712345678"
                      required
                    />
                  </div>
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="rs-email"
                      name="email"
                      className="field-input"
                      placeholder="e.g. student@rusl.ac.lk"
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-hostel">
                      Hostel Preference <span className="req">*</span>
                    </label>
                    <select id="rs-hostel" name="hostel_preference" className="field-input" required defaultValue="">
                      <option value="">-- Select Hostel --</option>
                      {hostelOptions.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ── SECTION II – Parental / Guardian Details ── */}
                <div className="form-section-title">
                  <i className="fas fa-users"></i> Parental / Guardian Details
                </div>

                <p style={{ fontSize: '.8rem', color: '#888', marginBottom: '14px' }}>
                  <i className="fas fa-circle-info" style={{ color: '#7C0A02' }}></i>
                  &nbsp;Provide details of both parents or legal guardians.
                </p>

                {/* Father */}
                <p style={{ fontSize: '.82rem', fontWeight: 700, color: '#7C0A02', marginBottom: '10px' }}>
                  Father / Guardian (1)
                </p>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="rs-father-name">
                      Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="rs-father-name"
                      name="father_name"
                      className="field-input"
                      placeholder="Full name"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-father-occ">
                      Occupation <span className="req">*</span>
                    </label>
                    <select id="rs-father-occ" name="father_occupation" className="field-input" required defaultValue="">
                      <option value="">-- Select --</option>
                      {occupationOptions.map((o) => (
                        <option key={`f-${o}`} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-father-income">
                      Annual Income (Rs.) <span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      id="rs-father-income"
                      name="father_annual_income"
                      className="field-input"
                      placeholder="e.g. 360000"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Mother */}
                <p style={{ fontSize: '.82rem', fontWeight: 700, color: '#7C0A02', margin: '16px 0 10px' }}>
                  Mother / Guardian (2)
                </p>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="rs-mother-name">
                      Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="rs-mother-name"
                      name="mother_name"
                      className="field-input"
                      placeholder="Full name"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-mother-occ">
                      Occupation <span className="req">*</span>
                    </label>
                    <select id="rs-mother-occ" name="mother_occupation" className="field-input" required defaultValue="">
                      <option value="">-- Select --</option>
                      {occupationOptions.map((o) => (
                        <option key={`m-${o}`} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-mother-income">
                      Annual Income (Rs.) <span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      id="rs-mother-income"
                      name="mother_annual_income"
                      className="field-input"
                      placeholder="e.g. 240000"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-total-income">
                      Total Household Income (Rs.) <span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      id="rs-total-income"
                      name="total_household_income"
                      className="field-input"
                      placeholder="Combined annual income"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* ── SECTION III – Siblings at University ── */}
                <div className="form-section-title">
                  <i className="fas fa-graduation-cap"></i> Siblings at University (if any)
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-sibling-name">
                      Sibling Name
                    </label>
                    <input
                      type="text"
                      id="rs-sibling-name"
                      name="sibling_name"
                      className="field-input"
                      placeholder="Full name (if applicable)"
                    />
                  </div>
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-sibling-uni">
                      University
                    </label>
                    <input
                      type="text"
                      id="rs-sibling-uni"
                      name="sibling_university"
                      className="field-input"
                      placeholder="University name"
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-sibling-hostel">
                      Sibling Residing in Hostel?
                    </label>
                    <select id="rs-sibling-hostel" name="sibling_in_hostel" className="field-input" defaultValue="">
                      <option value="">-- Select --</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A (No Sibling)</option>
                    </select>
                  </div>
                </div>

                {/* ── SECTION IV – Divisional Secretary Certification ── */}
                <div className="form-section-title">
                  <i className="fas fa-stamp"></i> Divisional Secretary Certification
                </div>

                <div className="info-box">
                  <i className="fas fa-circle-info"></i>
                  <span>
                    This section must be certified by the Divisional Secretary of your area.
                    Submit the completed form to the Grama Niladhari for forwarding through the Divisional Secretariat.
                  </span>
                </div>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="rs-div-sec">
                      Divisional Secretariat <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="rs-div-sec"
                      name="divisional_secretariat"
                      className="field-input"
                      placeholder="Name of the Divisional Secretariat"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group half">
                    <label className="field-label" htmlFor="rs-certified-income">
                      Certified Household Income (Rs.) <span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      id="rs-certified-income"
                      name="certified_income"
                      className="field-input"
                      placeholder="As certified by Divisional Secretary"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* ── SECTION V – Additional Information ── */}
                <div className="form-section-title">
                  <i className="fas fa-clipboard"></i> Additional Information
                </div>

                <div className="field-row">
                  <div className="field-group full">
                    <label className="field-label" htmlFor="rs-remarks">
                      Remarks / Special Circumstances
                    </label>
                    <textarea
                      id="rs-remarks"
                      name="remarks"
                      className="field-input"
                      rows={4}
                      placeholder="Any special circumstances or additional information relevant to your application..."
                    />
                  </div>
                </div>

                <div className="warning-box">
                  <i className="fas fa-triangle-exclamation"></i>
                  <span>
                    I hereby declare that all information provided is true and correct.
                    I understand that providing false information may result in cancellation of my residential facility and disciplinary action.
                  </span>
                </div>

              </div>

              <div className="form-actions">
                <button type="button" className="btn-download" onClick={downloadForm}>
                  <i className="fas fa-download"></i> Download Form
                </button>
                <div className="form-actions-right">
                  <button type="button" className="btn-clear" onClick={clearForm}>
                    <i className="fas fa-rotate-left"></i> Clear
                  </button>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    <i className={`fas ${submitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>

      <div className={`toast ${toast.visible ? 'show' : ''} ${toast.error ? 'error' : 'success'}`}>
        <i className={`fas ${toast.error ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
        <span>{toast.message}</span>
      </div>
    </>
  );
}

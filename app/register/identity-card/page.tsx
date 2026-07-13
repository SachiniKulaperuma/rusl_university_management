'use client';

import { useState } from 'react';

export default function IdentityCardPage() {
  const [formData, setFormData] = useState({});

  return (
    <>
      <style>{`
    /* ── Page Layout ── */
    .reg-page {
      min-height: calc(100vh - 77px);
      background: #f0ebe3;
      display: flex;
    }

    /* ── Sidebar ── */
    .reg-sidebar {
      width: 240px;
      flex-shrink: 0;
      background: #fff;
      border-right: 1px solid #ddd;
      position: sticky;
      top: 77px;
      height: calc(100vh - 77px);
      overflow-y: auto;
    }

    .reg-sidebar-header {
      background: #7C0A02;
      color: #fff;
      padding: 14px 18px;
      font-size: .88rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .reg-sidebar-nav { list-style: none; padding: 8px 0; }

    .reg-sidebar-nav li a {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 18px;
      font-size: .82rem;
      color: #444;
      font-weight: 500;
      text-decoration: none;
      border-left: 3px solid transparent;
      transition: all .2s;
      line-height: 1.4;
    }

    .reg-sidebar-nav li a i {
      margin-top: 2px;
      font-size: .75rem;
      color: #7C0A02;
      flex-shrink: 0;
    }

    .reg-sidebar-nav li a:hover,
    .reg-sidebar-nav li a.active {
      background: rgba(124,10,2,.06);
      color: #7C0A02;
      border-left-color: #7C0A02;
      font-weight: 600;
    }

    .reg-sidebar-nav li { border-bottom: 1px solid #f0f0f0; }
    .reg-sidebar-nav li:last-child { border-bottom: none; }

    /* ── Main Content ── */
    .reg-main {
      flex: 1;
      padding: 28px 32px 48px;
      max-width: 900px;
    }

    /* ── Form Card ── */
    .form-card {
      background: #fff;
      border-radius: 10px;
      border: 1px solid #ddd;
      box-shadow: 0 2px 12px rgba(0,0,0,.07);
      overflow: hidden;
    }

    .form-card-header {
      background: #7C0A02;
      color: #fff;
      padding: 16px 28px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .form-card-header h2 {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: .02em;
    }

    .form-note {
      background: #fffbf0;
      border-bottom: 1px solid #f0d89a;
      padding: 10px 28px;
      font-size: .8rem;
      color: #7a5e00;
      display: flex;
      align-items: center;
      gap: 7px;
      font-weight: 500;
    }

    .form-body { padding: 24px 28px 8px; }

    /* ── Section Headings ── */
    .form-section-title {
      font-size: .82rem;
      font-weight: 800;
      color: #7C0A02;
      text-transform: uppercase;
      letter-spacing: .08em;
      border-bottom: 2px solid #7C0A02;
      padding-bottom: 6px;
      margin: 22px 0 16px;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .form-section-title:first-child { margin-top: 0; }

    /* ── Field Rows ── */
    .field-row {
      display: flex;
      gap: 20px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
      flex: 1;
      min-width: 200px;
    }

    .field-group.full  { flex: 100%; min-width: 100%; }
    .field-group.half  { flex: 1; min-width: 180px; }
    .field-group.third { flex: 1; min-width: 140px; }
    .field-group.small { flex: none; width: 120px; }

    .field-label {
      font-size: .80rem;
      font-weight: 600;
      color: #333;
    }

    .field-label .field-num {
      font-weight: 700;
      color: #7C0A02;
      margin-right: 4px;
    }

    .field-input {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-family: 'Inter', sans-serif;
      font-size: .85rem;
      color: #222;
      background: #faf9f7;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
      width: 100%;
    }

    .field-input:focus {
      border-color: #7C0A02;
      box-shadow: 0 0 0 3px rgba(124,10,2,.1);
      background: #fff;
    }

    select.field-input { cursor: pointer; }
    textarea.field-input { resize: vertical; min-height: 70px; }

    /* ── Photo & Signature Upload Area ── */
    .upload-row {
      display: flex;
      gap: 32px;
      margin-top: 28px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .upload-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .upload-label-title {
      font-size: .82rem;
      font-weight: 700;
      color: #333;
    }

    .upload-box {
      width: 150px;
      height: 170px;
      border: 2px dashed #aaa;
      border-radius: 8px;
      background: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: border-color .2s, background .2s;
      position: relative;
      overflow: hidden;
    }

    .upload-box.sig-box {
      width: 200px;
      height: 100px;
    }

    .upload-box:hover {
      border-color: #7C0A02;
      background: rgba(124,10,2,.04);
    }

    .upload-box i {
      font-size: 1.6rem;
      color: #bbb;
      transition: color .2s;
    }

    .upload-box:hover i { color: #7C0A02; }

    .upload-box span {
      font-size: .72rem;
      color: #999;
      text-align: center;
      line-height: 1.4;
      padding: 0 10px;
    }

    .upload-box input[type="file"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }

    .upload-box .preview-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
      display: none;
    }

    .upload-num {
      font-size: .78rem;
      font-weight: 700;
      color: #7C0A02;
    }

    /* ── Upload hint ── */
    .upload-hint {
      background: #f0f7ff;
      border: 1px solid #b8d4f0;
      border-radius: 6px;
      padding: 10px 16px;
      font-size: .78rem;
      color: #1a5276;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    /* ── Form Actions ── */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 14px;
      padding: 20px 28px 24px;
      border-top: 1px solid #eee;
      flex-wrap: wrap;
    }

    .btn-clear {
      padding: 10px 28px;
      background: #fff;
      border: 1.5px solid #ccc;
      border-radius: 6px;
      font-family: 'Inter', sans-serif;
      font-size: .9rem;
      font-weight: 600;
      color: #555;
      cursor: pointer;
      transition: all .2s;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .btn-clear:hover { background: #f5f5f5; border-color: #999; color: #333; }

    .btn-submit {
      padding: 10px 32px;
      background: #7C0A02;
      border: none;
      border-radius: 6px;
      font-family: 'Inter', sans-serif;
      font-size: .9rem;
      font-weight: 700;
      color: #fff;
      cursor: pointer;
      transition: all .25s;
      display: flex;
      align-items: center;
      gap: 7px;
      letter-spacing: .03em;
    }

    .btn-submit:hover {
      background: #5a0602;
      box-shadow: 0 4px 16px rgba(124,10,2,.35);
      transform: translateY(-1px);
    }

    /* ── Toast ── */
    .toast {
      position: fixed;
      bottom: 28px; right: 28px;
      background: #15803d;
      color: #fff;
      padding: 14px 22px;
      border-radius: 8px;
      font-size: .88rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 6px 24px rgba(0,0,0,.2);
      transform: translateY(80px);
      opacity: 0;
      transition: all .35s cubic-bezier(.4,0,.2,1);
      z-index: 1000;
    }
    .toast.show { transform: translateY(0); opacity: 1; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .reg-page { flex-direction: column; }
      .reg-sidebar { width: 100%; position: static; height: auto; }
      .reg-main { padding: 18px 14px 36px; }
      .form-body { padding: 16px 14px; }
      .form-actions { padding: 14px; }
      .upload-row { justify-content: center; }
    }
`}</style>



    {/* Form Area */}
    <main className="reg-main" id="reg-main">
      <div className="form-card" id="idcard-form-card">

        <div className="form-card-header">
          <i className="fas fa-id-card"></i>
          <h2>Application for the Student Identity Card</h2>
        </div>

        <div className="form-note">
          <i className="fas fa-circle-info"></i>
          Note: Use English block capital letters to fill this application.
        </div>

        <form id="idcard-form">
        <div className="form-body">

          {/* ─── Basic Information ─── */}
          <div className="form-section-title"><i className="fas fa-circle-dot"></i> Basic Information</div>

          <div className="field-row">
            <div className="field-group half">
              <label className="field-label" htmlFor="idc-reg-no"><span className="field-num">1.</span> Registration No</label>
              <input type="text" id="idc-reg-no" name="reg_no" className="field-input" placeholder="e.g. 2026/ICT/001" required/>
            </div>
            <div className="field-group half">
              <label className="field-label" htmlFor="idc-adm-year"><span className="field-num">2.</span> Admission Year</label>
              <select id="idc-adm-year" name="admission_year" className="field-input" required>
                <option value="">-- Select Year --</option>
                <option>2026</option><option>2025</option><option>2024</option>
                <option>2023</option><option>2022</option><option>2021</option>
                <option>2020</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field-group half">
              <label className="field-label" htmlFor="idc-nic"><span className="field-num">3.</span> National Identity Card No / Passport No</label>
              <input type="text" id="idc-nic" name="nic_no" className="field-input" placeholder="e.g. 200012345678" required/>
            </div>
            <div className="field-group half">
              <label className="field-label" htmlFor="idc-course"><span className="field-num">4.</span> Selected Course of Study</label>
              <select id="idc-course" name="course" className="field-input" required>
                <option value="">-- Select Course --</option>
                <option>B.Sc. in Information &amp; Communication Technology</option>
                <option>B.Sc. in Agricultural Technology &amp; Management</option>
                <option>B.Sc. in Agriculture</option>
                <option>B.Sc. in Food Science &amp; Technology</option>
                <option>B.Sc. in Nursing</option>
                <option>B.A. in Social Sciences</option>
                <option>B.A. in Management</option>
                <option>LLB (Bachelor of Laws)</option>
                <option>MBBS</option>
                <option>B.Sc. in Engineering Technology</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field-group full">
              <label className="field-label" htmlFor="idc-fullname-en"><span className="field-num">5. I.</span> Full Name (English — as per the Identity Card)</label>
              <input type="text" id="idc-fullname-en" name="full_name_en" className="field-input" placeholder="e.g. SACHINI KULAPERUMA PERERA" required/>
            </div>
          </div>

          {/* ─── Name Details ─── */}
          <div className="form-section-title"><i className="fas fa-font"></i> Name Details</div>

          <div className="field-row">
            <div className="field-group small">
              <label className="field-label" htmlFor="idc-title"><span className="field-num">6. I.</span> Title</label>
              <select id="idc-title" name="title" className="field-input" required>
                <option value="">Select</option>
                <option>Mr.</option>
                <option>Miss.</option>
                <option>Mrs.</option>
                <option>Ms.</option>
                <option>Rev.</option>
                <option>Dr.</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="idc-fullname-sl"><span className="field-num">6. II.</span> Full Name (Sinhala or Tamil)</label>
              <input type="text" id="idc-fullname-sl" name="full_name_local" className="field-input" placeholder="සිංහල හෝ தமிழ் නාමය"/>
            </div>
          </div>

          {/* ─── Contact Details ─── */}
          <div className="form-section-title"><i className="fas fa-address-book"></i> Contact Details</div>

          <div className="field-row">
            <div className="field-group half">
              <label className="field-label" htmlFor="idc-tel"><span className="field-num">7. I.</span> Telephone No</label>
              <input type="tel" id="idc-tel" name="telephone" className="field-input" placeholder="e.g. 0712345678" required/>
            </div>
            <div className="field-group half">
              <label className="field-label" htmlFor="idc-email"><span className="field-num">7. II.</span> E-mail</label>
              <input type="email" id="idc-email" name="email" className="field-input" placeholder="e.g. student@rjt.ac.lk" required/>
            </div>
          </div>

          <div className="field-row">
            <div className="field-group full">
              <label className="field-label" htmlFor="idc-addr-en"><span className="field-num">7. III.</span> Permanent Address (English)</label>
              <textarea id="idc-addr-en" name="perm_address_en" className="field-input" rows={2} placeholder="House No, Street, City  (English)" required></textarea>
            </div>
          </div>

          <div className="field-row">
            <div className="field-group full">
              <label className="field-label" htmlFor="idc-addr-sl"><span className="field-num">7. IV.</span> Permanent Address (Sinhala or Tamil)</label>
              <textarea id="idc-addr-sl" name="perm_address_local" className="field-input" rows={2} placeholder="ස්ථිර ලිපිනය (සිංහල හෝ தமிழ்)"></textarea>
            </div>
          </div>

          {/* ─── Photo & Signature ─── */}
          <div className="form-section-title"><i className="fas fa-camera"></i> Photo &amp; Signature</div>

          <div className="upload-hint">
            <i className="fas fa-circle-info" style={{marginTop:'2px',flexShrink:0}}></i>
            <span>Photo must be a recent passport-size photograph with a <strong>white background</strong>. Signature should be on a white background. Accepted formats: JPG, PNG. Max size: 2 MB each.</span>
          </div>

          <div className="upload-row">

            {/* Photo */}
            <div className="upload-block">
              <span className="upload-num">7. Photo</span>
              <div className="upload-box" id="photo-box" title="Click to upload photo">
                <img className="preview-img" id="photo-preview" alt="Photo Preview"/>
                <i className="fas fa-user-circle" id="photo-icon"></i>
                <span id="photo-hint">Click to upload<br/>passport photo</span>
                <input type="file" id="photo-upload" name="photo" accept="image/jpeg,image/png" aria-label="Upload student photo"/>
              </div>
              <span style={{fontSize:'.72rem',color:'#999'}}>3.5 cm × 4.5 cm</span>
            </div>

            {/* Signature */}
            <div className="upload-block" style={{justifyContent:'flex-end'}}>
              <span className="upload-num">8. Signature</span>
              <div className="upload-box sig-box" id="sig-box" title="Click to upload signature">
                <img className="preview-img" id="sig-preview" alt="Signature Preview"/>
                <i className="fas fa-pen-nib" id="sig-icon"></i>
                <span id="sig-hint">Click to upload<br/>signature</span>
                <input type="file" id="sig-upload" name="signature" accept="image/jpeg,image/png" aria-label="Upload student signature"/>
              </div>
              <span style={{fontSize:'.72rem',color:'#999'}}>6 cm × 2 cm</span>
            </div>

          </div>

        </div>{/* /form-body */}

        {/* Actions */}
        <div className="form-actions">
          <button type="button" id="btn-clear" className="btn-clear">
            <i className="fas fa-rotate-left"></i> Clear
          </button>
          <button type="submit" id="btn-submit" className="btn-submit">
            <i className="fas fa-paper-plane"></i> Submit
          </button>
        </div>

        </form>
      </div>
    </main>
  {/* Toast */}
  <div className="toast" id="success-toast">
    <i className="fas fa-circle-check"></i>
    ID Card application submitted successfully!
  </div>
    </>
  );
}

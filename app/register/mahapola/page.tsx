'use client';

import { useEffect, useState } from 'react';

export default function MahapolaPage() {
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('Form download started!');

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setToastVisible(true);
        window.setTimeout(() => setToastVisible(false), 3500);
    };

    const generateMahapolaFormDataURL = () => {
        const formHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>RUSL – Mahapola Application Form</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 30px; color: #000; }
    h1 { text-align: center; font-size: 16px; color: #7C0A02; margin-bottom: 4px; }
    h2 { text-align: center; font-size: 13px; margin-bottom: 20px; color: #333; }
    .header-block { text-align: center; border-bottom: 2px solid #7C0A02; padding-bottom: 12px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    td, th { border: 1px solid #999; padding: 6px 10px; font-size: 11px; }
    th { background: #f0e8e8; font-weight: bold; text-align: left; }
    .section-title { background: #7C0A02; color: #fff; padding: 6px 10px; font-weight: bold; font-size: 12px; margin-top: 18px; margin-bottom: 0; }
    .field-row { display: flex; gap: 16px; margin-bottom: 10px; }
    .field { flex: 1; }
    label { font-size: 10px; font-weight: bold; display: block; margin-bottom: 3px; }
    .underline { border-bottom: 1px solid #000; min-height: 22px; margin-bottom: 10px; }
    .sign-area { display: flex; justify-content: space-between; margin-top: 40px; }
    .sign-box { text-align: center; width: 200px; }
    .sign-line { border-top: 1px solid #000; padding-top: 4px; font-size: 10px; }
    @media print { body { margin: 15mm; } }
  </style>
</head>
<body>
  <div class="header-block">
    <h1>RAJARATA UNIVERSITY OF SRI LANKA</h1>
    <h2>APPLICATION FOR THE Mahapola</h2>
    <p style="font-size:11px;">Academic Year: _____________________ &nbsp;&nbsp; Faculty: _____________________</p>
  </div>

  <p class="section-title">SECTION I – STUDENT INFORMATION</p>
  <table>
    <tr><th style="width:30%">Registration No.</th><td></td><th style="width:30%">NIC No.</th><td></td></tr>
    <tr><th>Name with Initials</th><td colspan="3"></td></tr>
    <tr><th>Name in Full</th><td colspan="3"></td></tr>
    <tr><th>Permanent Address</th><td colspan="3" style="height:50px;"></td></tr>
    <tr><th>Telephone (Land)</th><td></td><th>Mobile</th><td></td></tr>
    <tr><th>E-mail</th><td></td><th>Sex</th><td>Male &nbsp;☐ &nbsp;&nbsp; Female &nbsp;☐</td></tr>
    <tr><th>Civil Status</th><td>Married &nbsp;☐ &nbsp;&nbsp; Unmarried &nbsp;☐</td><th>A/L Index No.</th><td></td></tr>
  </table>

  <p class="section-title">SECTION II – PARENTAL / GUARDIAN DETAILS</p>
  <table>
    <tr><th colspan="4">Father / Guardian Details</th></tr>
    <tr><th style="width:30%">Name</th><td colspan="3"></td></tr>
    <tr><th>Occupation</th><td></td><th>Employer</th><td></td></tr>
    <tr><th>Annual Gross Income (Rs.)</th><td></td><th>Alive / Deceased</th><td>Alive &nbsp;☐ &nbsp;&nbsp; Deceased &nbsp;☐</td></tr>
    <tr><th colspan="4">Mother / Guardian Details</th></tr>
    <tr><th>Name</th><td colspan="3"></td></tr>
    <tr><th>Occupation</th><td></td><th>Employer</th><td></td></tr>
    <tr><th>Annual Gross Income (Rs.)</th><td></td><th>Alive / Deceased</th><td>Alive &nbsp;☐ &nbsp;&nbsp; Deceased &nbsp;☐</td></tr>
  </table>

  <p class="section-title">SECTION III – INCOME DETAILS</p>
  <table>
    <tr><th>Source of Income</th><th>Father / Guardian (Rs.)</th><th>Mother / Guardian (Rs.)</th></tr>
    <tr><td>Salary / Wages</td><td style="height:26px;"></td><td></td></tr>
    <tr><td>Pension</td><td></td><td></td></tr>
    <tr><td>Income from Property / Rent</td><td></td><td></td></tr>
    <tr><td>Income from Business / Trade</td><td></td><td></td></tr>
    <tr><td>Agricultural Income</td><td></td><td></td></tr>
    <tr><td>Other Income</td><td></td><td></td></tr>
    <tr><th>Total Annual Gross Income</th><td></td><td></td></tr>
  </table>

  <p class="section-title">SECTION IV – SIBLING DETAILS (School/University Going)</p>
  <table>
    <tr><th>Name</th><th>Age</th><th>School / University</th><th>Mahapola / Mahapola</th></tr>
    <tr><td style="height:26px;"></td><td></td><td></td><td>Yes &nbsp;☐ &nbsp; No &nbsp;☐</td></tr>
    <tr><td style="height:26px;"></td><td></td><td></td><td>Yes &nbsp;☐ &nbsp; No &nbsp;☐</td></tr>
    <tr><td style="height:26px;"></td><td></td><td></td><td>Yes &nbsp;☐ &nbsp; No &nbsp;☐</td></tr>
  </table>

  <p class="section-title">SECTION V – BANK ACCOUNT DETAILS</p>
  <table>
    <tr><th style="width:30%">Bank</th><td>Bank of Ceylon</td><th>Branch</th><td></td></tr>
    <tr><th>Account Number</th><td colspan="3"></td></tr>
  </table>

  <p class="section-title">SECTION VI – DECLARATION</p>
  <p style="font-size:11px;line-height:1.7;margin:10px 0;">
    I hereby declare that the information furnished above is true and correct to the best of my knowledge and belief.
    I understand that providing false information will render me liable to cancellation of my enrolment as an internal student
    and any other action deemed appropriate by the University authorities.
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
    RUSL Smart University System – Mahapola Application Form | Rajarata University of Sri Lanka, Mihintale – 50300
  </p>
</body>
</html>`;

        const blob = new Blob([formHTML], { type: 'text/html' });
        return URL.createObjectURL(blob);
    };

    const downloadForm = () => {
        showToast('Mahapola application form download started!');
        const link = document.createElement('a');
        link.href = generateMahapolaFormDataURL();
        link.download = 'RUSL_Mahapola_Application_Form.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const logoutUser = () => {
        sessionStorage.removeItem('rusl_user');
        window.location.href = 'signin.html';
    };

    useEffect(() => {
        const stored = sessionStorage.getItem('rusl_user');
        const authArea = document.getElementById('header-auth-area');
        if (!stored || !authArea) return;

        try {
            const user = JSON.parse(stored);
            authArea.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="display:flex;align-items:center;gap:8px;padding:6px 14px;border:1.5px solid rgba(255,255,255,.5);border-radius:8px;">
            <i class="fas fa-user-circle" style="color:var(--gold);font-size:1.1rem;"></i>
            <div style="line-height:1.2;">
              <div style="font-size:.75rem;color:rgba(255,255,255,.6);">${user.role}</div>
              <div style="font-size:.85rem;color:#fff;font-weight:600;">${user.name.split(' ')[0]}</div>
            </div>
          </div>
          <button onclick="(${logoutUser.toString()})();" style="display:flex;align-items:center;gap:6px;padding:7px 14px;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.4);border-radius:8px;color:#fff;font-size:.83rem;font-weight:600;cursor:pointer;font-family:var(--font);transition:all .2s;">
            <i class="fas fa-right-from-bracket"></i> Logout
          </button>
        </div>`;
        } catch {
            sessionStorage.removeItem('rusl_user');
        }
    }, []);

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

        .reg-sidebar-nav {
          list-style: none;
          padding: 8px 0;
        }

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
          background: rgba(124, 10, 2, .06);
          color: #7C0A02;
          border-left-color: #7C0A02;
          font-weight: 600;
        }

        .reg-sidebar-nav li {
          border-bottom: 1px solid #f0f0f0;
        }

        .reg-sidebar-nav li:last-child {
          border-bottom: none;
        }

        /* ── Main Content ── */
        .reg-main {
          flex: 1;
          padding: 28px 32px 48px;
          max-width: 960px;
        }

        /* ── Info Card ── */
        .info-card {
          background: #fff;
          border-radius: 10px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 12px rgba(0, 0, 0, .07);
          overflow: hidden;
        }

        .info-card-header {
          background: #7C0A02;
          color: #fff;
          padding: 16px 28px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .info-card-header h2 {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: .02em;
          margin: 0;
        }

        /* ── Content Body ── */
        .info-body {
          padding: 28px 32px 32px;
        }

        /* ── Section Heading ── */
        .section-heading {
          font-size: .88rem;
          font-weight: 800;
          color: #7C0A02;
          text-transform: uppercase;
          letter-spacing: .07em;
          border-bottom: 2px solid #7C0A02;
          padding-bottom: 7px;
          margin: 28px 0 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-heading:first-child {
          margin-top: 0;
        }

        /* ── Eligibility Box ── */
        .eligibility-box {
          background: #fff8e1;
          border: 1px solid #f0d89a;
          border-left: 4px solid #f59e0b;
          border-radius: 7px;
          padding: 16px 20px;
          margin-bottom: 12px;
        }

        .eligibility-box .elig-main {
          font-size: .88rem;
          font-weight: 600;
          color: #5a3e00;
          line-height: 1.65;
          margin-bottom: 12px;
        }

        .concession-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        .concession-list li {
          display: flex;
          gap: 10px;
          font-size: .85rem;
          color: #5a3e00;
          line-height: 1.6;
        }

        .concession-list li .concession-label {
          font-weight: 700;
          flex-shrink: 0;
          color: #7C0A02;
          min-width: 28px;
        }

        /* ── Notice Bar ── */
        .notice-bar {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 7px;
          padding: 12px 18px;
          font-size: .83rem;
          color: #78350f;
          line-height: 1.65;
          margin-bottom: 4px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-style: italic;
        }

        .notice-bar i {
          color: #d97706;
          margin-top: 2px;
          flex-shrink: 0;
        }

        /* ── Condition List ── */
        .condition-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 4px;
        }

        .condition-list > li {
          font-size: .86rem;
          color: #333;
          line-height: 1.7;
          padding-left: 4px;
        }

        .condition-list > li strong {
          color: #7C0A02;
        }

        .sub-condition-list {
          list-style: none;
          padding: 0;
          margin: 8px 0 0 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sub-condition-list li {
          display: flex;
          gap: 10px;
          font-size: .84rem;
          color: #444;
          line-height: 1.65;
        }

        .sub-condition-list li .sub-label {
          font-weight: 700;
          flex-shrink: 0;
          color: #7C0A02;
          min-width: 22px;
        }

        /* ── Instruction paragraphs ── */
        .instruction-para {
          font-size: .86rem;
          color: #333;
          line-height: 1.75;
          margin-bottom: 12px;
        }

        .instruction-para:last-of-type {
          margin-bottom: 0;
        }

        /* ── Warning box ── */
        .warning-box {
          background: #fff3f3;
          border: 1px solid #f8c4c4;
          border-radius: 7px;
          padding: 12px 18px;
          font-size: .84rem;
          color: #8b2020;
          line-height: 1.65;
          margin-bottom: 14px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .warning-box i {
          color: #c53030;
          margin-top: 2px;
          flex-shrink: 0;
        }

        /* ── Info box ── */
        .info-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-left: 4px solid #3b82f6;
          border-radius: 7px;
          padding: 12px 18px;
          font-size: .84rem;
          color: #1e3a6e;
          line-height: 1.65;
          margin-bottom: 14px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .info-box i {
          color: #3b82f6;
          margin-top: 2px;
          flex-shrink: 0;
        }

        /* ── Download Section ── */
        .download-section {
          background: #fdf8f7;
          border-top: 2px solid #e8d5d3;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .download-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .download-icon {
          width: 48px;
          height: 48px;
          background: #7C0A02;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .download-meta h4 {
          font-size: .92rem;
          font-weight: 700;
          color: #222;
          margin-bottom: 3px;
        }

        .download-meta p {
          font-size: .78rem;
          color: #777;
        }

        .btn-download {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 28px;
          background: #7C0A02;
          color: #fff;
          border-radius: 7px;
          font-family: 'Inter', sans-serif;
          font-size: .9rem;
          font-weight: 700;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all .25s;
          letter-spacing: .03em;
          white-space: nowrap;
        }

        .btn-download:hover {
          background: #5a0602;
          box-shadow: 0 4px 16px rgba(124, 10, 2, .35);
          transform: translateY(-1px);
        }

        .btn-download:active {
          transform: translateY(0);
        }

        /* ── Toast ── */
        .toast {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: #15803d;
          color: #fff;
          padding: 14px 22px;
          border-radius: 8px;
          font-size: .88rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, .2);
          transform: translateY(80px);
          opacity: 0;
          transition: all .35s cubic-bezier(.4, 0, .2, 1);
          z-index: 1000;
        }

        .toast.show {
          transform: translateY(0);
          opacity: 1;
        }

        /* ── Divider ── */
        .content-divider {
          border: none;
          border-top: 1px solid #eee;
          margin: 20px 0 0;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .reg-page {
            flex-direction: column;
          }

          .reg-sidebar {
            width: 100%;
            position: static;
            height: auto;
          }

          .reg-main {
            padding: 18px 14px 36px;
          }

          .info-body {
            padding: 18px 16px 24px;
          }

          .download-section {
            padding: 18px 16px;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

            <div style={{ display: 'flex' }}>
                <main className="reg-main" id="reg-main">
                    <div className="info-card" id="Mahapola-card">
                        <div className="info-card-header">
                            <i className="fas fa-hand-holding-dollar"></i>
                            <div>
                                <h2>Application for the Mahapola</h2>
                            </div>
                        </div>

                        <div className="info-body">
                            <div className="section-heading" id="sec-eligibility">
                                <i className="fas fa-circle-check"></i> Eligibility Criteria for Applying Mahapola Scholarships
                            </div>

                            <div className="eligibility-box">
                                <p className="elig-main">
                                    Parental annual income should be equal or less than to <strong>Rs. 500,000/=</strong>
                                </p>
                                <p style={{ fontSize: '.84rem', fontWeight: 600, color: '#5a3e00', marginBottom: '8px' }}>
                                    The following concessions to be added to the Income Ceilings specified above:
                                </p>
                                <ul className="concession-list">
                                    <li>
                                        <span className="concession-label">a)</span>
                                        <span>
                                            Rs. 24,000/= concession per annum per school going sister/brother who is <strong>19 years or under</strong>,
                                            up to a maximum of three children.
                                        </span>
                                    </li>
                                    <li>
                                        <span className="concession-label">b)</span>
                                        <span>
                                            Rs. 36,000/= per annum per school going sister/brother following a course in a University but
                                            <strong>not in receipt of a Mahapola scholarship or a Mahapola</strong>.
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="notice-bar">
                                <i className="fas fa-circle-info"></i>
                                <span>
                                    Only students who are eligible according to the above criteria for Mahapola, should proceed (apply) through
                                    the following steps. <strong>Others should not require to complete and return this form.</strong>
                                </span>
                            </div>

                            <hr className="content-divider" />

                            <div className="section-heading" id="sec-conditions">
                                <i className="fas fa-gavel"></i> Condition Governing the Payment of Mahapola Scholarships
                            </div>

                            <ul className="condition-list">
                                <li>
                                    Any student who provides false, inaccurate statement or who fails to disclose any material fact in
                                    his/her application is liable to have his/her enrolment as an internal student cancelled.
                                </li>
                                <li>
                                    The student who have applied for a Mahapola or who are in receipt of Mahapola should communicate in writing
                                    to the Registrar of the University in receipt of any changes of family income, marital status,
                                    employment income etc.
                                </li>
                                <li>
                                    The Mahapola Scholarships will be paid only during period of study in the University. The recipient of Mahapola who
                                    for any reason temporarily ceases to follow the course of study or leaves the University before
                                    completion of study, should communicate that fact in writing to the Registrar of the University as the
                                    case may be.
                                </li>
                                <li>
                                    The payment of a Mahapola to any student may be completely stopped or temporarily suspended for any one
                                    or more of the following reasons:
                                    <ul className="sub-condition-list">
                                        <li>
                                            <span className="sub-label">a)</span>
                                            <span>The Mahapola may be paid to any student who has been referred at the first year examination and
                                                who is following the course prescribed for the second year.</span>
                                        </li>
                                        <li>
                                            <span className="sub-label">b)</span>
                                            <span>If the student fails to take any examination at the first available occasion for any reason
                                                which is not acceptable by the Vice Chancellor.</span>
                                        </li>
                                        <li>
                                            <span className="sub-label">c)</span>
                                            <span>If the student conducts himself in an indiscipline manner.</span>
                                        </li>
                                        <li>
                                            <span className="sub-label">d)</span>
                                            <span>For any other valid reason, to be decided upon at the discretion of the Vice Chancellor.</span>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    University authorities have their discretion on matters relating to the restoration of Mahapola Scholarships, which
                                    have been stopped or temporarily suspended.
                                </li>
                                <li>
                                    Each eligible student will be paid maximum of <strong>10 monthly installments</strong> per academic year.
                                </li>
                                <li>
                                    Conditions applicable to Mahapola scholarships are generally applicable to Mahapola Scholarships too.
                                </li>
                            </ul>

                            <div className="warning-box">
                                <i className="fas fa-triangle-exclamation"></i>
                                <span>
                                    If you are in receipt of Mahapola scholarship, <strong>you will not be awarded the Mahapola.</strong>
                                    Under no condition duplicate Mahapola form will be issued.
                                </span>
                            </div>

                            <hr className="content-divider" />

                            <div className="section-heading" id="sec-instructions">
                                <i className="fas fa-clipboard-list"></i> Instruction to the Applicant
                            </div>

                            <p className="instruction-para">
                                All details asked for regarding all avenues of income must be mentioned. Information supplied by regarding
                                your income will be verified from relevant officials and the Department of Inland Revenue. Documents,
                                relevant to the information sought for under No. IV of the application form regarding details of salary
                                under annual gross income of parents — Pension Certificates, Death Certificates, Detail of pension,
                                Income of House, Property and Business Enterprises — must be attached to the application form.
                            </p>

                            <p className="instruction-para">
                                No cage must be left blank or closed by lines. Where there is no relevant information to be supplied,
                                that must be so mentioned. Incomplete forms, applications received later than due date and application
                                not sent through the Grama Niladhari and Divisional Secretary will be rejected.
                            </p>

                            <p className="instruction-para">
                                This application must be duly completed, and handed over to the Grama Niladhari of the area with the
                                relevant documents to enable him to be received on or before the deadline specified in the covering
                                letter of enrolment. The Grama Niladhari will (as per cage VIII) send it through the Divisional Secretary
                                in time as required. As the Mahapola form needs to be sent by registered post, an envelope (6"×9") stamped
                                to the value of <strong>Rs. 55.00</strong> (or postage according to the weight) on which the University
                                address written must be handed over to Grama Niladhari with application form. Under no circumstances
                                must the application form be returned by the applicant.
                            </p>

                            <p className="instruction-para">
                                It must be clearly understood that if the University authorities are convinced that the information
                                provided on the application form is false, legal action will be taken against you, or even your internal
                                studentship will be cancelled.
                            </p>

                            <p className="instruction-para">
                                All decisions regarding the award of the Mahapola, rejection of the Mahapola, or discontinuing are made
                                by the University. Therefore, please note that requests regarding Mahapola Scholarships must not be made by the
                                University Grants Commission, and such requests will not be responded.
                            </p>

                            <div className="info-box">
                                <i className="fas fa-piggy-bank"></i>
                                <span>
                                    All applicants shall have/open a <strong>new bank saving account at the Bank of Ceylon</strong> reserved
                                    for Mahapola transaction. The photocopy of the passbook, showing the account number, shall be attached
                                    along with the Mahapola application.
                                </span>
                            </div>
                        </div>

                        <div className="download-section" id="download-section">
                            <div className="download-info">
                                <div className="download-icon">
                                    <i className="fas fa-file-pdf"></i>
                                </div>
                                <div className="download-meta">
                                    <h4>Mahapola Application Form</h4>
                                    <p>Official form – PDF format &nbsp;|&nbsp; Fill, sign and submit via Grama Niladhari</p>
                                </div>
                            </div>
                            <button className="btn-download" id="btn-download-form" onClick={downloadForm}>
                                <i className="fas fa-download"></i> Download Form
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            <div className={`toast ${toastVisible ? 'show' : ''}`} id="toast">
                <i className="fas fa-circle-check"></i>
                <span id="toast-msg">{toastMessage}</span>
            </div>
        </>
    );
}

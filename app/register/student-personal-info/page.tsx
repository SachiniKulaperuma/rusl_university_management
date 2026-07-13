import {
	InlineField,
	RegisterActionBar,
	RegisterPageFrame,
	RegisterSectionCard,
	SelectField,
	TextAreaField,
	TextField,
} from '../components/register-form-components';

const courseOptions = [
	'B.Sc. in Information & Communication Technology',
	'B.Sc. in Agricultural Technology & Management',
	'B.Sc. in Agriculture',
	'B.Sc. in Food Science & Technology',
	'B.Sc. in Nursing',
	'B.A. in Social Sciences',
	'B.A. in Management',
	'LLB (Bachelor of Laws)',
	'MBBS',
	'B.Sc. in Engineering Technology',
];

const districtOptions = [
	'Anuradhapura',
	'Ampara',
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
	'Moneragala',
	'Mullaitivu',
	'Nuwara Eliya',
	'Polonnaruwa',
	'Puttalam',
	'Ratnapura',
	'Trincomalee',
	'Vavuniya',
];

const raceOptions = ['Sinhalese', 'Tamil', 'Muslim', 'Burgher', 'Malay', 'Other'];
const religionOptions = ['Buddhism', 'Hinduism', 'Islam', 'Christianity', 'Other'];
const genderOptions = ['Male', 'Female', 'Other'];
const civilStatusOptions = ['Single', 'Married', 'Widowed', 'Divorced'];
const citizenshipOptions = ['By Descent', 'By Registration'];
const relationshipOptions = ['Mother', 'Father', 'Guardian', 'Sibling', 'Other'];

export default function StudentPersonalInfoPage() {
	return (
		<RegisterPageFrame
			title="Student Personal Information"
			subtitle="Use English block capital letters to fill this application."
			note={
				<>
					<i className="fas fa-circle-info mr-2 text-[#7b0000]" />
					Note: Use English block capital letters to fill this application.
				</>
			}
		>
			<RegisterSectionCard icon="fas fa-circle-dot" title="Basic Information">
				<div className="grid gap-4 md:grid-cols-2">
					<TextField label="Registration No" numberLabel="1." htmlFor="reg-no" placeholder="e.g. 2026/ICT/001" />
					<TextField
						label="National Identity Card or Passport No"
						numberLabel="2."
						htmlFor="nic-no"
						placeholder="e.g. 200012345678"
						required
					/>
				</div>

				<div className="mt-4 grid gap-4 md:grid-cols-2">
					<TextField
						label="Index No of G.C.E. (A/L) Examination & Year"
						numberLabel="3."
						htmlFor="al-index"
						placeholder="e.g. 1234567 / 2024"
						required
					/>
					<SelectField
						label="Selected Course of Study"
						numberLabel="4."
						htmlFor="course"
						options={courseOptions}
						placeholder="-- Select Course --"
						required
					/>
				</div>

				<div className="mt-4 grid gap-4 md:grid-cols-2">
					<TextField
						label="I. Name with Initials"
						numberLabel="5."
						htmlFor="name-initials"
						placeholder="e.g. S. K. PERERA"
						required
					/>
					<TextField
						label="II. Full Name"
						numberLabel="5."
						htmlFor="full-name"
						placeholder="e.g. SACHINI KULAPERUMA PERERA"
						required
					/>
				</div>
			</RegisterSectionCard>

			<RegisterSectionCard icon="fas fa-address-book" title="Contact Details">
				<div className="grid gap-4 md:grid-cols-2">
					<TextField
						label="I. Telephone No"
						numberLabel="6."
						htmlFor="tel-no"
						placeholder="e.g. 0712345678"
						type="tel"
						required
					/>
					<TextField
						label="II. E-mail"
						numberLabel="6."
						htmlFor="email-addr"
						placeholder="e.g. student@rjt.ac.lk"
						type="email"
						required
					/>
				</div>

				<div className="mt-4 grid gap-4">
					<TextAreaField
						label="III. Permanent Address"
						numberLabel="6."
						htmlFor="perm-addr"
						placeholder="House No, Street, City"
						rows={2}
						required
					/>
					<TextAreaField
						label="IV. Contact Address (If different from permanent address)"
						numberLabel="6."
						htmlFor="contact-addr"
						placeholder="Leave blank if same as permanent address"
						rows={2}
					/>
				</div>
			</RegisterSectionCard>

			<RegisterSectionCard icon="fas fa-person" title="Personal Details">
				<div className="grid gap-4 md:grid-cols-2">
					<TextField label="Grama Niladhari Division" numberLabel="7." htmlFor="grama" placeholder="Division name" />
					<SelectField
						label="District"
						numberLabel="8."
						htmlFor="district"
						options={districtOptions}
						placeholder="-- Select District --"
						required
					/>
				</div>

				<div className="mt-4 grid gap-4 md:grid-cols-2">
					<SelectField label="Race" numberLabel="9." htmlFor="race" options={raceOptions} placeholder="-- Select --" />
					<SelectField label="Religion" numberLabel="10." htmlFor="religion" options={religionOptions} placeholder="-- Select --" />
				</div>

				<div className="mt-4 grid gap-4 md:grid-cols-2">
					<SelectField
						label="Gender"
						numberLabel="11."
						htmlFor="gender"
						options={genderOptions}
						placeholder="-- Select --"
						required
					/>
					<SelectField
						label="Civil Status"
						numberLabel="12."
						htmlFor="civil-status"
						options={civilStatusOptions}
						placeholder="-- Select --"
					/>
				</div>

				<div className="mt-4">
					<SelectField
						label="Citizenship (By Descent / By Registration)"
						numberLabel="13."
						htmlFor="citizenship"
						options={citizenshipOptions}
						placeholder="-- Select --"
					/>
				</div>
			</RegisterSectionCard>

			<RegisterSectionCard icon="fas fa-users" title="Guardian Details">
				<div className="grid gap-4">
					<TextField
						label="Full Name of Guardian"
						numberLabel="14."
						htmlFor="guardian-name"
						placeholder="Full name of parent/guardian"
						required
					/>
					<TextField
						label="I. Occupation"
						numberLabel="15."
						htmlFor="guardian-occ"
						placeholder="e.g. Teacher, Farmer, Government Servant"
					/>
					<TextAreaField
						label="II. Address of Place of Work"
						numberLabel="15."
						htmlFor="guardian-work"
						placeholder="Work address"
						rows={2}
					/>
					<div className="md:max-w-[320px]">
						<TextField
							label="III. Guardian Telephone Number"
							numberLabel="15."
							htmlFor="guardian-tel"
							placeholder="e.g. 0712345678"
							type="tel"
						/>
					</div>
				</div>
			</RegisterSectionCard>

			<RegisterSectionCard
				icon="fas fa-phone-volume"
				title="Emergency Contact"
				note="Name and Telephone Number of the person to be informed in case of an emergency."
			>
				<div className="grid gap-4 md:grid-cols-2">
					<TextField
						label="I. Name"
						numberLabel="16."
						htmlFor="emg-name"
						placeholder="Emergency contact name"
						required
					/>
					<TextField
						label="II. Telephone"
						numberLabel="16."
						htmlFor="emg-tel"
						placeholder="e.g. 0712345678"
						type="tel"
						required
					/>
				</div>
			</RegisterSectionCard>

			<RegisterSectionCard icon="fas fa-file-signature" title="Declaration of the Student / Applicant">
				<div className="space-y-4 text-sm leading-7 text-stone-700">
					<p>
						<strong>1.</strong> I,{' '}
						<InlineField label="(Name of Student)" htmlFor="decl-name" placeholder="Full name of student" />{' '}
						have carefully read and fully understood the law prohibiting ragging referred in the{' '}
						<strong>Prohibition of Ragging and Other Forms of Violence in Educational Institutions Act, No. 20 of 1998</strong>.
					</p>
					<p>
						<strong>2.</strong> I hereby undertake that;
					</p>
					<p className="pl-5">
						<strong>2.1</strong> I will not indulge in any behavior or act that may come under the definition of ragging.
					</p>
					<p className="pl-5">
						<strong>2.2</strong> I will not participate in or abet or propagate ragging in any form.
					</p>
					<p className="pl-5">
						<strong>2.3</strong> I will not hurt anyone physically or psychologically or cause any other harm.
					</p>
					<p>
						<strong>3.</strong> I hereby agree that if am found guilty of any form of ragging, I may be punished as per the law enforced by the university and its by-laws.
					</p>
					<p>
						<strong>4.</strong> I do hereby affirm that, during the period of my stay in the university, I will not engage in or encourage any form of anti-social behavior including ragging (torture) and that I will pay due respect to the teachers and officials and will not engage in any act that will harm the goodwill of the university.
					</p>
					<p>
						I am fully aware that I am liable for suspension from the university and for any other disciplinary action if I am unable to abide by the by-laws of this act.
					</p>

					<div className="grid gap-4 pt-2 sm:grid-cols-[120px_160px_120px] sm:items-end">
						<InlineField label="Day of Month" htmlFor="sign-day" placeholder="DD" type="number" />
						<InlineField label="Month" htmlFor="sign-month" placeholder="e.g. JULY" />
						<InlineField label="Year" htmlFor="sign-year" placeholder="2026" type="number" />
					</div>

					<div className="pt-3">
						<div className="mx-auto h-10 w-full max-w-md border-b-2 border-stone-400" />
						<p className="mt-2 text-center text-sm font-medium text-stone-700">Signature of the Student / Applicant</p>
					</div>
				</div>
			</RegisterSectionCard>

			<RegisterSectionCard icon="fas fa-handshake" title="Undertaking by the Parent / Guardian">
				<div className="space-y-4 text-sm leading-7 text-stone-700">
					<p>
						<strong>I.</strong> I,
						<InlineField
							label="(Name of Parent / Guardian)"
							htmlFor="guardian-decl-name"
							placeholder="Name of Parent / Guardian"
						/>{' '}
						have carefully read and fully understood the law prohibiting ragging in the{' '}
						<strong>Prohibition of Ragging and Other Forms of Violence in Educational Institutions Act, No. 20 of 1998</strong>.
					</p>
					<p>
						<strong>II.</strong> I assure you that my son / daughter / ward will not indulge in any form of ragging.
					</p>
					<p>
						<strong>III.</strong> I hereby agree that if he / she is found guilty of any form of ragging he / she may be punished as per the law enforced and by-laws of the University.
					</p>

					<div className="pt-4">
						<div className="mx-auto h-10 w-full max-w-md border-b-2 border-stone-400" />
						<p className="mt-2 text-center text-sm font-medium text-stone-700">Signature of Mother / Father / Guardian</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<TextField label="Name" htmlFor="guardian-sign-name" placeholder="Guardian's full name" />
						<SelectField
							label="Relationship to the student"
							htmlFor="guardian-rel"
							options={relationshipOptions}
							placeholder="-- Select --"
						/>
					</div>

					<TextAreaField
						label="Address"
						htmlFor="guardian-addr"
						placeholder="Guardian's permanent address"
						rows={2}
					/>
				</div>
			</RegisterSectionCard>

			<RegisterActionBar />
		</RegisterPageFrame>
	);
}

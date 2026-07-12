'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type FieldType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'textarea';

type FieldDefinition = {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    options?: string[];
};

type SectionDefinition = {
    id: string;
    title: string;
    description: string;
    fields: FieldDefinition[];
};

const DEFAULT_SECTION = 'student-personal-info';

const sectionDefinitions: SectionDefinition[] = [
    {
        id: 'student-personal-info',
        title: 'Student Personal Information',
        description: 'Capture the core student profile used across the registration workflow.',
        fields: [
            { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter full name' },
            { name: 'registrationNumber', label: 'Registration Number', type: 'text', placeholder: 'Enter registration number' },
            { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
            { name: 'nic', label: 'NIC / Passport', type: 'text', placeholder: 'Enter NIC or passport number' },
            { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
            { name: 'address', label: 'Permanent Address', type: 'textarea', placeholder: 'Enter permanent address' },
        ],
    },
    {
        id: 'id-card',
        title: 'Application for the Student Identity Card',
        description: 'Collect the information required to issue a student identity card.',
        fields: [
            { name: 'cardName', label: 'Name on Card', type: 'text', placeholder: 'Enter the name for the card' },
            { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Enter student ID' },
            { name: 'contactNumber', label: 'Contact Number', type: 'tel', placeholder: '+94 ...' },
            { name: 'bloodGroup', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        ],
    },
    {
        id: 'residential',
        title: 'Application for Residential Facilities',
        description: 'Record the student’s accommodation request and supporting details.',
        fields: [
            { name: 'hostelRequired', label: 'Hostel Required', type: 'select', options: ['Yes', 'No'] },
            { name: 'distanceFromHome', label: 'Distance From Home', type: 'text', placeholder: 'Approximate distance from home' },
            { name: 'facilityPreference', label: 'Facility Preference', type: 'text', placeholder: 'Preferred residence type' },
            { name: 'remarks', label: 'Additional Remarks', type: 'textarea', placeholder: 'Any special accommodation notes' },
        ],
    },
    {
        id: 'sports',
        title: 'Student Physical Attribute & Sport Achievement',
        description: 'Capture sports participation and physical achievement information.',
        fields: [
            { name: 'sportName', label: 'Sport / Event', type: 'text', placeholder: 'Enter sport or event' },
            { name: 'achievement', label: 'Achievement Level', type: 'text', placeholder: 'Example: District, National' },
            { name: 'year', label: 'Year', type: 'number', placeholder: 'Enter year' },
            { name: 'details', label: 'Details', type: 'textarea', placeholder: 'Briefly describe the achievement' },
        ],
    },
    {
        id: 'special-skills',
        title: 'Application for the Special Skills',
        description: 'Describe the student’s special skills, awards, or supporting evidence.',
        fields: [
            { name: 'skillCategory', label: 'Skill Category', type: 'text', placeholder: 'Enter skill category' },
            { name: 'skillDescription', label: 'Skill Description', type: 'textarea', placeholder: 'Describe the skill in detail' },
            { name: 'certificate', label: 'Certificate / Proof', type: 'text', placeholder: 'Reference or certificate number' },
        ],
    },
    {
        id: 'bursary',
        title: 'Application for Bursary',
        description: 'Gather the details needed to assess financial support eligibility.',
        fields: [
            { name: 'householdIncome', label: 'Household Income', type: 'text', placeholder: 'Enter household income' },
            { name: 'dependents', label: 'Number of Dependents', type: 'number', placeholder: 'Enter number of dependents' },
            { name: 'financialNeed', label: 'Financial Need Statement', type: 'textarea', placeholder: 'Explain the financial need' },
        ],
    },
    {
        id: 'mahapola',
        title: 'Application for Mahapola',
        description: 'Collect academic and family support details for Mahapola evaluation.',
        fields: [
            { name: 'academicYear', label: 'Academic Year', type: 'text', placeholder: 'Enter academic year' },
            { name: 'bankAccount', label: 'Bank Account Details', type: 'text', placeholder: 'Enter account information' },
            { name: 'supportStatement', label: 'Support Statement', type: 'textarea', placeholder: 'Describe the support request' },
        ],
    },
    {
        id: 'medical',
        title: 'Medical Examination Report',
        description: 'Record the medical examination summary and related student health notes.',
        fields: [
            { name: 'examinationDate', label: 'Examination Date', type: 'date' },
            { name: 'fitnessStatus', label: 'Fitness Status', type: 'select', options: ['Fit', 'Pending Review', 'Needs Follow-up'] },
            { name: 'allergies', label: 'Allergies', type: 'textarea', placeholder: 'List any allergies' },
            { name: 'medicalNotes', label: 'Medical Notes', type: 'textarea', placeholder: 'Add any other medical notes' },
        ],
    },
];

const sectionMap = new Map(sectionDefinitions.map((section) => [section.id, section]));

function Field({ field }: { field: FieldDefinition }) {
    const baseClass = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-red-900 focus:ring-2 focus:ring-red-900/10';

    return (
        <label className="block">
            <span className="text-sm font-medium text-slate-700">{field.label}</span>
            {field.type === 'textarea' ? (
                <textarea
                    name={field.name}
                    rows={4}
                    placeholder={field.placeholder}
                    className={baseClass}
                />
            ) : field.type === 'select' ? (
                <select name={field.name} defaultValue="" className={baseClass}>
                    <option value="" disabled>
                        Select an option
                    </option>
                    {field.options?.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={baseClass}
                />
            )}
        </label>
    );
}

function SectionForm({ section }: { section: SectionDefinition }) {
    return (
        <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-6 border-b border-slate-200 pb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-950">Registration section</p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{section.title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{section.description}</p>
            </div>

            <form className="grid gap-5">
                <div className="grid gap-4 md:grid-cols-2">
                    {section.fields.map((field) => (
                        <Field key={field.name} field={field} />
                    ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                    <button
                        type="submit"
                        className="rounded-full bg-red-950 px-6 py-3 text-sm font-semibold text-yellow-300 shadow-md transition hover:bg-red-900"
                    >
                        Save and continue
                    </button>
                    <button
                        type="button"
                        className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Save draft
                    </button>
                </div>
            </form>
        </section>
    );
}

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestedSection = searchParams.get('section');
    const activeSection = requestedSection && sectionMap.has(requestedSection)
        ? requestedSection
        : DEFAULT_SECTION;

    useEffect(() => {
        if (!requestedSection || !sectionMap.has(requestedSection)) {
            router.replace(`/register?section=${DEFAULT_SECTION}`);
        }
    }, [requestedSection, router]);

    const currentSection = sectionMap.get(activeSection) ?? sectionDefinitions[0];

    return <SectionForm section={currentSection} />;
}
import type { ReactNode } from 'react';

export function fieldClassName() {
	return 'w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#7b0000] focus:bg-white focus:ring-4 focus:ring-[#7b0000]/10';
}

type FormLabelProps = {
	label: string;
	numberLabel?: string;
	htmlFor: string;
	children: ReactNode;
	className?: string;
};

export function FormLabel({ label, numberLabel, htmlFor, children, className = '' }: FormLabelProps) {
	return (
		<div className={className}>
			<label className="block space-y-2 text-sm font-medium text-stone-700" htmlFor={htmlFor}>
				<span className="flex flex-wrap items-start gap-2 leading-6 text-stone-800">
					{numberLabel ? (
						<span className="inline-flex min-w-11 justify-center rounded-full bg-[#7b0000] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-amber-100">
							{numberLabel}
						</span>
					) : null}
					<span>{label}</span>
				</span>
				{children}
			</label>
		</div>
	);
}

type InlineFieldProps = {
	label: string;
	numberLabel?: string;
	htmlFor: string;
	placeholder?: string;
	type?: 'text' | 'number';
};

export function InlineField({
	label,
	numberLabel,
	htmlFor,
	placeholder,
	type = 'text',
}: InlineFieldProps) {
	return (
		<div className="grid gap-2 sm:max-w-[280px]">
			<label className="text-sm font-medium text-stone-800" htmlFor={htmlFor}>
				{numberLabel ? (
					<span className="mr-2 inline-flex min-w-11 justify-center rounded-full bg-[#7b0000] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-amber-100">
						{numberLabel}
					</span>
				) : null}
				{label}
			</label>
			<input id={htmlFor} name={htmlFor} type={type} placeholder={placeholder} className={fieldClassName()} />
		</div>
	);
}

type TextFieldProps = {
	label: string;
	numberLabel?: string;
	htmlFor: string;
	placeholder?: string;
	type?: 'text' | 'email' | 'tel' | 'number';
	required?: boolean;
	className?: string;
};

export function TextField({
	label,
	numberLabel,
	htmlFor,
	placeholder,
	type = 'text',
	required = false,
	className,
}: TextFieldProps) {
	return (
		<FormLabel label={label} numberLabel={numberLabel} htmlFor={htmlFor} className={className}>
			<input
				id={htmlFor}
				name={htmlFor}
				type={type}
				placeholder={placeholder}
				required={required}
				className={fieldClassName()}
			/>
		</FormLabel>
	);
}

type TextAreaFieldProps = {
	label: string;
	numberLabel?: string;
	htmlFor: string;
	placeholder?: string;
	rows?: number;
	required?: boolean;
	className?: string;
};

export function TextAreaField({
	label,
	numberLabel,
	htmlFor,
	placeholder,
	rows = 2,
	required = false,
	className,
}: TextAreaFieldProps) {
	return (
		<FormLabel label={label} numberLabel={numberLabel} htmlFor={htmlFor} className={className}>
			<textarea
				id={htmlFor}
				name={htmlFor}
				rows={rows}
				placeholder={placeholder}
				required={required}
				className={fieldClassName()}
			/>
		</FormLabel>
	);
}

type SelectFieldProps = {
	label: string;
	numberLabel?: string;
	htmlFor: string;
	options: string[];
	placeholder?: string;
	required?: boolean;
	className?: string;
};

export function SelectField({
	label,
	numberLabel,
	htmlFor,
	options,
	placeholder = '-- Select --',
	required = false,
	className,
}: SelectFieldProps) {
	return (
		<FormLabel label={label} numberLabel={numberLabel} htmlFor={htmlFor} className={className}>
			<select id={htmlFor} name={htmlFor} required={required} defaultValue="" className={fieldClassName()}>
				<option value="" disabled>
					{placeholder}
				</option>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</FormLabel>
	);
}

type RegisterSectionCardProps = {
	icon: string;
	title: string;
	children: ReactNode;
	note?: ReactNode;
};

export function RegisterSectionCard({ icon, title, children, note }: RegisterSectionCardProps) {
	return (
		<section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_16px_50px_rgba(77,46,39,0.08)] sm:p-6">
			<div className="mb-5 flex items-center gap-3 border-b border-stone-200 pb-4">
				<span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7b0000] text-lg text-amber-100 shadow-sm">
					<i className={icon} />
				</span>
				<div>
					<h2 className="text-xl font-semibold text-stone-900">{title}</h2>
					{note ? <p className="mt-1 text-sm leading-6 text-stone-600">{note}</p> : null}
				</div>
			</div>
			{children}
		</section>
	);
}

type RegisterPageFrameProps = {
	title: string;
	subtitle: string;
	note: ReactNode;
	children: ReactNode;
};

export function RegisterPageFrame({ title, subtitle, note, children }: RegisterPageFrameProps) {
	return (
		<main className="h-full bg-[radial-gradient(circle_at_top,_rgba(123,0,0,0.08),_transparent_30%),linear-gradient(180deg,_#f4efe7_0%,_#ede5dc_100%)] px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white/95 shadow-[0_30px_100px_rgba(62,37,31,0.16)] backdrop-blur">
					<div className="flex flex-col gap-4 bg-[#7b0000] px-6 py-5 text-amber-100 sm:flex-row sm:items-center sm:justify-between sm:px-8">
						<div className="flex items-center gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-200/40 bg-white/10 text-2xl font-bold text-amber-100">
								RU
							</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/90">
									Rajarata University of Sri Lanka
								</p>
								<h1 className="mt-1 text-2xl font-semibold leading-tight sm:text-3xl">
									{title}
								</h1>
							</div>
						</div>
						<div className="text-sm font-medium text-amber-100/90 sm:text-right">
							{subtitle}
						</div>
					</div>

					<form className="space-y-6 bg-[#f7f2ef] p-5 sm:p-6 lg:p-8">
						<div className="rounded-2xl border border-[#e8d9d1] bg-amber-50 px-4 py-3 text-sm font-medium text-stone-700 shadow-sm">
							{note}
						</div>
						{children}
					</form>
				</div>
			</div>
		</main>
	);
}

export function RegisterActionBar() {
	return (
		<div className="flex flex-wrap items-center justify-end gap-3 pt-2">
			<button
				type="reset"
				className="inline-flex items-center justify-center rounded-full border border-[#8d7b73] bg-white px-5 py-3 text-sm font-semibold text-[#7b0000] shadow-sm transition hover:border-[#7b0000] hover:bg-[#fff7f5]"
			>
				<i className="fas fa-rotate-left mr-2" />
				Clear
			</button>
			<button
				type="submit"
				className="inline-flex items-center justify-center rounded-full bg-[#7b0000] px-5 py-3 text-sm font-semibold text-amber-100 shadow-[0_12px_30px_rgba(123,0,0,0.28)] transition hover:bg-[#920000]"
			>
				<i className="fas fa-paper-plane mr-2" />
				Submit
			</button>
		</div>
	);
}
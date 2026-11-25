namespace $.$$ {

	const panel = {
		background: { color: $mol_theme.card },
		border: { radius: '1.5rem' },
		padding: { top: '1.5rem', bottom: '1.5rem', left: '1.25rem', right: '1.25rem' },
		gap: '.5rem',
		box: { shadow: [ { x: 0, y: '.25rem', blur: '1.5rem', spread: 0, color: '#0000000f' } ] },
	} as const

	const head = {
		font: { size: '1.125rem', weight: 600 },
		padding: { left: '.75rem', right: '.75rem' },
	} as const

	const wide = {
		justifyContent: 'center',
		padding: { top: '.75rem', bottom: '.75rem', left: '1rem', right: '1rem' },
		border: { radius: '1rem' },
	} as const

	const note = {
		color: $mol_theme.shade,
		font: { size: '.875rem' },
		padding: { left: '.75rem', right: '.75rem' },
	} as const

	const line = {
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: '.5rem',
		minWidth: 0,
		padding: { left: '.75rem' },
	} as const

	const text = {
		flex: { grow: 1, shrink: 1, basis: 0 },
		minWidth: 0,
		overflowWrap: 'anywhere',
	} as const

	const action = {
		flex: { shrink: 0 },
		whiteSpace: 'nowrap',
	} as const

	const field = {
		padding: { top: '.75rem', bottom: '.75rem', left: '1rem', right: '1rem' },
		border: { radius: '1rem' },
	} as const

	$mol_style_define( $bog_id_app, {

		background: { color: $mol_theme.back },

		Column: {
			flex: { direction: 'column', grow: 0, shrink: 0 },
			boxSizing: 'border-box',
			width: '100%',
			maxWidth: '27rem',
			margin: { top: 'auto', bottom: 'auto', left: 'auto', right: 'auto' },
			padding: $mol_gap.block,
			gap: $mol_gap.block,
		},

		Login: panel,
		Profile: panel,
		Grants_panel: panel,

		Brand: {
			justifyContent: 'center',
			alignItems: 'center',
			gap: '.5rem',
			font: { size: '1.25rem', weight: 700 },
			color: $mol_theme.control,
		},

		Head: {
			justifyContent: 'center',
			textAlign: 'center',
			font: { size: '1.25rem', weight: 600 },
			padding: { top: '.5rem', bottom: '.5rem' },
			wordBreak: 'break-word',
		},

		Profile_head: head,
		Grants_head: head,

		Name: field,
		Draft: field,

		Approve: {
			... wide,
			background: { color: $mol_theme.control },
			color: '#ffffff',
			font: { weight: 600 },
		},

		Reject: wide,
		Back: wide,

		Consent_text: note,
		Consent_self: note,
		Enter_status: note,
		Bind_status: note,

		Share: { gap: '.5rem' },
		Share_warning: note,
		Share_box: {
			alignSelf: 'center',
			background: { color: '#ffffff' },
			border: { radius: '1rem' },
			padding: '.75rem',
		},
		Share_qr: { width: '16rem', maxWidth: '100%', aspectRatio: 1 },

		Grant_head: line,
		App: line,
		Grant_title: text,
		Grant_revoke: action,
		App_revoke: action,
		App_title: { ... text, color: $mol_theme.shade, font: { size: '.8125rem' } },

	} )

}

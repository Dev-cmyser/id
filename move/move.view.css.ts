namespace $.$$ {

	const wide = {
		padding: { top: '.75rem', bottom: '.75rem', left: '1rem', right: '1rem' },
		border: { radius: '1rem' },
	} as const

	$mol_style_define( $bog_id_move, {

		gap: '.5rem',

		Input: wide,

		Apply: {
			... wide,
			justifyContent: 'center',
			background: { color: $mol_theme.control },
			color: '#ffffff',
			font: { weight: 600 },
		},

		Status: {
			color: $mol_theme.shade,
			font: { size: '.875rem' },
			padding: { left: '.75rem', right: '.75rem' },
		},

	} )

}

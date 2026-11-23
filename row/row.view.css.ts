namespace $.$$ {

	$mol_style_define( $bog_id_row, {

		alignItems: 'center',
		gap: '.75rem',
		padding: { top: '.625rem', bottom: '.625rem', left: '.75rem', right: '.75rem' },
		border: { radius: '1rem' },
		textAlign: 'left',
		cursor: 'pointer',

		Face: {
			flex: { grow: 0, shrink: 0, basis: '2.5rem' },
			height: '2.5rem',
			alignItems: 'center',
			justifyContent: 'center',
			border: { radius: '50%' },
			background: { color: $mol_theme.hover },
			color: $mol_theme.control,
		},

		Info: {
			flex: { direction: 'column', grow: 1, shrink: 1, basis: 0 },
			minWidth: 0,
		},

		Name: {
			color: $mol_theme.text,
			font: { weight: 500 },
			wordBreak: 'break-word',
		},

		Note: {
			color: $mol_theme.shade,
			font: { size: '.8125rem' },
			wordBreak: 'break-word',
		},

		'@': {
			bog_id_row_current: {
				true: {
					background: { color: $mol_theme.hover },
				},
			},
		},

	} )

}

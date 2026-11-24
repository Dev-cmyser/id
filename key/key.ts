namespace $ {

	export class $bog_id_key_store extends $giper_baza_dict.with({
		Key: $giper_baza_atom_text,
	}) {}

	/** Own key of app, the same on all devices: the first device puts it to granted Land. Empty while Land is not synced */
	export function $bog_id_key( this: $, pointer: string, own: string ) {

		const land = this.$bog_id_land( pointer )
		if( !land ) return ''

		const tines = land.Tine().items_vary()
			.map( tine => $giper_baza_link_schema.cast( tine! )?.str )
			.filter( $mol_guard_defined )

		const synced = [ pointer, land.link().str, ... tines ].map( link => this.$bog_id_land_synced( link ) )
		if( !synced.every( Boolean ) ) return ''

		const rank = land.lord_rank( land.auth().pass().lord() )
		if( rank < $giper_baza_rank_post( 'late' ) ) return ''

		const store = land.Data( $bog_id_key_store )
		const key = store.Key()?.val()
		if( key ) return key

		store.Key( 'auto' )!.val( own )
		land.units_saving()

		return own
	}

}

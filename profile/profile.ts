namespace $ {

	/** Public Giper ID profile of Lord, stored under own key in home Land */
	export function $bog_id_profile_of( this: $, lord: string, auto?: 'auto' ) {
		return this.$giper_baza_glob.Land( new $giper_baza_link( lord ) )
			.Data( $giper_baza_dict )
			.dive( 'bog_id', $bog_id_profile, auto )
	}

}

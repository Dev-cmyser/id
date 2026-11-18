namespace $.$$ {

	export class $bog_id_demo extends $.$bog_id_demo {

		auto() {
			this.pass()
			this.land()
		}

		@ $mol_mem
		provider( next?: string ) {
			return this.$.$mol_state_local.value( `${ this }.provider()`, next ) ?? super.provider()
		}

		@ $mol_mem
		grant( next?: $bog_id_login_grant | null ) {
			return this.$.$mol_state_local.value( `${ this }.grant()`, next ) ?? null
		}

		@ $mol_mem
		pass() {
			return this.$.$giper_baza_auth.current().pass()
		}

		login() {
			this.$.$bog_id_login( this.provider(), this.pass().toString(), 'notes' )
				.then( grant => this.grant( grant ) )
				.catch( $mol_fail_log )
		}

		land() {
			const pointer = this.grant()?.pointer
			return pointer ? this.$.$bog_id_land( pointer ) : null
		}

		note( next?: string ) {
			return String( this.land()?.Data( $giper_baza_atom_text ).val( next ) ?? '' )
		}

		@ $mol_mem
		tier() {
			const land = this.land()
			if( !land ) return null
			this.note()
			return $giper_baza_rank_tier_of( land.lord_rank( this.pass().lord() ) )
		}

		note_enabled() {
			return ( this.tier() ?? $giper_baza_rank_tier.deny ) >= $giper_baza_rank_tier.post
		}

		status() {
			const grant = this.grant()
			if( !grant?.pointer ) return this.status_out()
			return this.status_in()
				.replace( '{name}', grant.name || grant.lord )
				.replace( '{tier}', $giper_baza_rank_tier[ this.tier() ?? 0 ] )
		}

	}

}

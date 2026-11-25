namespace $.$$ {

	export class $bog_id_enter extends $.$bog_id_enter {

		own() {
			const auth = this.$.$giper_baza_auth.current()
			return auth.toString() + auth.toStringPrivate()
		}

		lord() {
			return this.$.$giper_baza_auth.current().pass().lord().str
		}

		grant( next?: $bog_id_login_grant & { done?: string } ) {
			return this.$.$mol_state_local.value( 'bog_id_enter', next ) ?? null
		}

		enter() {
			this.error( '' )
			const pass = this.$.$giper_baza_auth.current().pass().toString()
			this.$.$bog_id_login( this.provider(), pass, this.scope() )
				.then( grant => this.grant( grant ) )
				.catch( error => this.error( error.message ) )
		}

		joined() {
			return this.grant()?.done === this.lord()
		}

		@ $mol_mem
		key() {
			const grant = this.grant()
			if( !grant || this.joined() ) return ''
			return this.$.$bog_id_key( grant.pointer, this.own() )
		}

		key_ready() {
			try {
				return this.key()
			} catch( error ) {
				if( !$mol_promise_like( error ) ) $mol_fail_log( error )
				return ''
			}
		}

		conflicted() {
			const key = this.key_ready()
			return Boolean( key ) && key !== this.own()
		}

		@ $mol_mem
		joining() {
			const grant = this.grant()
			if( !grant || this.key_ready() !== this.own() ) return null
			return new this.$.$mol_after_tick( ()=> this.grant({ ... grant, done: this.lord() }) )
		}

		auto() {
			this.joining()
		}

		status() {
			const grant = this.grant()
			if( !grant ) return ''
			if( this.joined() ) return this.done().replace( '{name}', ()=> grant.name || grant.lord )
			return this.conflicted() ? this.conflict() : this.wait()
		}

		replace_title() {
			return this.armed() ? this.replace_sure() : super.replace_title()
		}

		auth_from( str: string ) {
			try {
				const auth = this.$.$giper_baza_auth.from( str )
				return auth.byteLength === 128 ? auth : null
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				return null
			}
		}

		keep() {
			const prev = this.$.$mol_state_local.value< readonly string[] >( 'bog_id_enter_prev' ) ?? []
			const own = this.own()
			if( !prev.includes( own ) ) this.$.$mol_state_local.value( 'bog_id_enter_prev', [ ... prev, own ] )
		}

		@ $mol_action
		replace() {

			const key = this.key_ready()
			if( !key ) return

			const auth = this.auth_from( key )
			this.error( auth ? '' : this.error_bad() )
			if( !auth ) return

			if( !this.armed() ) {
				this.armed( true )
				return
			}

			this.keep()
			this.apply( key )

		}

		@ $mol_action
		apply( next?: string ) {
			if( !next ) return ''
			this.$.$giper_baza_auth.current( this.$.$giper_baza_auth.from( next ) )
			this.$.$mol_dom_context.location.reload()
			return next
		}

		parts() {
			const grant = this.grant()
			return [
				... this.joined() ? [] : [ this.Enter() ],
				... grant ? [ this.Status() ] : [ this.Hint() ],
				... this.conflicted() ? [ this.Replace() ] : [],
				... this.error() ? [ this.Error() ] : [],
			]
		}

	}

}

namespace $.$$ {

	export class $bog_id_enter extends $.$bog_id_enter {

		key_of( auth: $giper_baza_auth ) {
			return auth.toString() + auth.toStringPrivate()
		}

		own() {
			return this.key_of( this.$.$giper_baza_auth.current() )
		}

		lord() {
			return this.$.$giper_baza_auth.current().pass().lord().str
		}

		grant( next?: $bog_id_login_grant & { done?: string } ) {
			return this.$.$mol_state_local.value( 'bog_id_enter', next ) ?? null
		}

		enter() {
			this.error( '' )
			this.armed( '' )
			const pass = this.$.$giper_baza_auth.current().pass().toString()
			this.$.$bog_id_login( this.provider(), pass, this.scope() )
				.then( grant => this.grant( grant ) )
				.catch( error => this.error( error.message ) )
		}

		joined() {
			return this.grant()?.done === this.lord()
		}

		join( lord: string ) {
			this.grant({ ... this.grant()!, done: lord })
		}

		@ $mol_mem
		key() {
			const grant = this.grant()
			if( !grant || this.joined() ) return null
			return this.$.$bog_id_key_peek( grant.pointer )
		}

		key_ready() {
			try {
				return this.key()
			} catch( error ) {
				if( !$mol_promise_like( error ) ) $mol_fail_log( error )
				return null
			}
		}

		vacant() {
			return this.key_ready() === ''
		}

		conflicted() {
			const key = this.key_ready()
			return Boolean( key ) && key !== this.own()
		}

		@ $mol_mem
		joining() {
			if( this.busy() || this.key_ready() !== this.own() ) return null
			return new this.$.$mol_after_tick( ()=> this.join( this.lord() ) )
		}

		auto() {
			this.joining()
		}

		idle() {
			return !this.busy()
		}

		status() {
			const grant = this.grant()
			if( !grant ) return ''
			if( this.busy() ) return this.sending()
			const text = this.joined() ? this.done()
				: this.vacant() ? this.vacant_text()
				: this.conflicted() ? this.conflict()
				: this.wait()
			return text.replace( '{name}', ()=> grant.name || grant.lord )
		}

		replace_title() {
			return this.armed() === 'replace' ? this.switch_sure() : super.replace_title()
		}

		fresh_title() {
			return this.armed() === 'fresh' ? this.switch_sure() : super.fresh_title()
		}

		arm( kind: string ) {
			if( this.armed() === kind ) return true
			this.armed( kind )
			return false
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

		async sent( key: string ) {

			this.error( '' )
			this.busy( true )

			try {
				const done = await this.$.$bog_id_key_put( this.grant()!.pointer, key )
				if( !done ) this.error( this.error_sent() )
				return done
			} catch( error ) {
				this.error( this.error_sent() )
				$mol_fail_log( error )
				return false
			} finally {
				this.busy( false )
			}

		}

		save() {
			this.armed( '' )
			return this.save_run()
		}

		async save_run() {
			if( this.busy() || !this.vacant() ) return
			if( await this.sent( this.own() ) ) this.join( this.lord() )
		}

		fresh() {
			if( this.arm( 'fresh' ) ) return this.fresh_run()
		}

		async fresh_run() {

			if( this.busy() || !this.vacant() ) return

			const auth = await $mol_wire_async( this.$.$giper_baza_auth ).grab() as $giper_baza_auth
			const key = this.key_of( auth )
			if( !await this.sent( key ) ) return

			this.keep()
			this.join( auth.pass().lord().str )
			this.apply_fresh( key )

		}

		@ $mol_action
		replace() {

			const key = this.key_ready()
			if( !key ) return

			const auth = this.auth_from( key )
			this.error( auth ? '' : this.error_bad() )
			if( !auth ) return

			if( !this.arm( 'replace' ) ) return

			this.keep()
			this.join( auth.pass().lord().str )
			this.apply( key )

		}

		switch( key: string ) {
			this.$.$giper_baza_auth.current( this.$.$giper_baza_auth.from( key ) )
			this.$.$mol_dom_context.location.reload()
		}

		@ $mol_action
		apply( next?: string ) {
			if( next ) this.switch( next )
			return ''
		}

		@ $mol_action
		apply_fresh( next?: string ) {
			if( next ) this.switch( next )
			return ''
		}

		parts() {
			const grant = this.grant()
			return [
				... grant ? [ this.Status() ] : [ this.Enter(), this.Hint() ],
				... this.vacant() ? [ this.Save(), this.Fresh() ] : [],
				... this.conflicted() && this.idle() ? [ this.Replace() ] : [],
				... grant && this.idle() ? [ this.Change() ] : [],
				... this.error() ? [ this.Error() ] : [],
			]
		}

	}

}

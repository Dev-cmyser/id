namespace $.$$ {

	export type $bog_id_app_request = {
		origin: string
		app: string
		pass: string
		scope: string
	}

	export type $bog_id_app_restore = {
		lord: string
		key: Uint8Array< ArrayBuffer >
	}

	export class $bog_id_app extends $.$bog_id_app {

		auto() {
			this.profile()
			this.grants()
			this.holding()
			this.listening()
			this.restoring()
		}

		@ $mol_mem
		holding() {
			return this.hold_lands().map( land => land.sync() )
		}

		hold_lands() {
			const home = this.glob().Land( new $giper_baza_link( this.lord() ) )
			const stores = this.stores().map( store => store.land() )
			const grants = this.grants().flatMap( grant => [ this.grant_pointer( grant ), ... this.grant_lands( grant ) ] )
			return [ home, ... stores, ... grants ]
		}

		glob() {
			return this.$.$giper_baza_glob
		}

		profile( auto?: 'auto' ) {
			return this.$.$bog_id_profile_of( this.lord(), auto )
		}

		@ $mol_mem
		lord() {
			return this.$.$giper_baza_auth.current().pass().lord().str
		}

		name( next?: string ) {
			if( next === undefined ) return this.profile()?.Name()?.val() ?? ''
			return this.profile( 'auto' )!.Name( 'auto' )!.val( next ) ?? ''
		}

		stores() {
			return ( this.profile()?.Stores()?.items() ?? [] )
				.map( link => this.glob().Land( new $giper_baza_link( String( link ) ) ).Data( $bog_id_store ) )
		}

		@ $mol_action
		store_ensure() {

			const [ found ] = this.stores()
			if( found ) return found

			const land = this.glob().land_grab([[ null, $giper_baza_rank_deny ]])
			this.profile( 'auto' )!.Stores( 'auto' )!.add( land.link().str )

			return land.Data( $bog_id_store )
		}

		grants() {
			return this.stores().flatMap( store => {
				const land = store.land()
				return ( store.Grants()?.items() ?? [] )
					.map( link => land.Pawn( $bog_id_grant ).Head( new $giper_baza_link( String( link ) ).head() ) )
			} )
		}

		grant( id: string ) {
			return this.grants().find( grant => grant.link().str === id )!
		}

		grant_find( app: string, scope: string ) {
			return this.grants().find( grant => grant.App()?.val() === app && grant.Scope()?.val() === scope ) ?? null
		}

		grant_pointer( grant: $bog_id_grant ) {
			return this.glob().Land( new $giper_baza_link( grant.Pointer()?.val() ?? '' ) )
		}

		grant_land( grant: $bog_id_grant ) {
			return this.glob().Land( new $giper_baza_link( grant.Land()?.val() ?? '' ) )
		}

		grant_lands( grant: $bog_id_grant ) {
			return ( grant.Lands()?.items() ?? [] )
				.map( link => this.glob().Land( new $giper_baza_link( String( link ) ) ) )
		}

		grant_apps( grant: $bog_id_grant ) {
			return ( grant.Apps()?.items() ?? [] ).map( String )
		}

		@ $mol_mem
		listening() {

			const win = this.$.$mol_dom_context
			if( !win.opener ) return null

			const listener = new this.$.$mol_dom_listener( win, 'message', ( event: MessageEvent )=> this.receive( event ) )
			win.opener.postMessage( { bog_id: 'ready' }, '*' )

			return listener
		}

		receive( event: MessageEvent ) {

			if( event.source !== this.$.$mol_dom_context.opener ) return
			if( event.data?.bog_id !== 'request' ) return

			this.request({
				origin: event.origin,
				app: this.app_of( event ),
				pass: String( event.data.pass ),
				scope: String( event.data.scope ),
			})

		}

		app_of( event: MessageEvent ) {
			try {
				const place = ( event.source as Window ).location
				return place.origin + place.pathname.replace( /[^/]*$/, '' )
			} catch {
				return event.origin
			}
		}

		@ $mol_mem
		request( next?: $bog_id_app_request | null ) {
			return next ?? null
		}

		request_pass() {

			const str = this.request()?.pass ?? ''
			if( str.length !== $giper_baza_auth_pass.size_str ) return null

			const pass = $giper_baza_auth_pass.from( str )
			return pass.uint8( 0 ) === 0xFF ? pass : null

		}

		request_self() {
			return this.request_pass()?.lord().str === this.lord()
		}

		panels() {
			if( this.request() ) return [ this.Login() ]
			return [
				this.Login(),
				... this.adding() ? [] : [ this.Profile() ],
				... this.grants().length && !this.adding() ? [ this.Grants_panel() ] : [],
			]
		}

		login_rows() {
			return [
				this.Brand(),
				this.Head(),
				... this.adding() ? this.add_rows() : this.pick_rows(),
			]
		}

		add_rows() {
			return [
				this.Enter(),
				this.Make(),
				... this.enter_status() ? [ this.Enter_status() ] : [],
				this.Back(),
			]
		}

		pick_rows() {
			return [
				this.Accounts(),
				this.Add(),
				... this.request() ? [
					... this.enter_status() ? [ this.Enter_status() ] : [],
					... this.name() ? [] : [ this.Draft() ],
					this.Consent_text(),
					... this.request_self() ? [ this.Consent_self() ] : [],
					... this.request_self() || this.synced() ? [] : [ this.Consent_wait() ],
					this.Approve(),
					this.Reject(),
				] : [],
			]
		}

		profile_rows() {
			return [
				this.Profile_head(),
				this.Name(),
				this.Bind(),
				... this.bind_status() ? [ this.Bind_status() ] : [],
				... this.vault() ? [ this.Exit() ] : [],
			]
		}

		head() {
			if( this.adding() ) return this.head_add()
			const request = this.request()
			if( !request ) return this.head_own()
			return this.head_pick().replace( '{app}', ()=> request.app.replace( /^https?:\/\//, '' ).replace( /\/$/, '' ) )
		}

		@ $mol_mem
		adding( next?: boolean ) {
			return next ?? false
		}

		add_open() {
			this.passkey_error( '' )
			this.adding( true )
		}

		add_close() {
			this.passkey_error( '' )
			this.restore( null )
			this.adding( false )
		}

		account_self( key = this.key() ): $bog_id_account_data {
			return {
				lord: this.lord(),
				name: this.name(),
				key,
				vault: this.vault(),
			}
		}

		key() {
			const auth = this.$.$giper_baza_auth.current()
			return auth.toString() + auth.toStringPrivate()
		}

		accounts() {
			return this.$.$bog_id_account.merge( this.account_self() )
		}

		account( lord: string ) {
			return this.accounts().find( data => data.lord === lord )!
		}

		account_rows() {
			return this.accounts().map( data => this.Account( data.lord ) )
		}

		account_id( lord: string ) {
			return lord
		}

		account_current( lord: string ) {
			return lord === this.lord()
		}

		account_name( lord: string ) {
			return this.account( lord ).name || this.account_noname()
		}

		account_note( lord: string ) {
			return this.account( lord ).key ? lord : this.account_locked()
		}

		account_tail( lord: string ) {
			return this.account_current( lord ) ? [ this.Account_check( lord ) ] : []
		}

		account_open( lord: string ) {
			if( this.account_current( lord ) ) return
			if( !this.account( lord ).key ) return this.passkey_enter()
			$mol_wire_async( this ).account_switch( this.account( lord ).key )
		}

		account_make() {
			$mol_wire_async( this ).account_make_run()
		}

		account_make_run() {
			this.account_switch( this.account_fresh() )
		}

		account_exit() {
			$mol_wire_async( this ).account_exit_run()
		}

		account_exit_run() {
			const next = this.accounts().find( data => data.key && data.lord !== this.lord() )
			const key = next?.key ?? this.account_fresh()
			this.account_switch( key, '' )
		}

		account_fresh() {
			const auth = this.$.$giper_baza_auth.grab()
			return auth.toString() + auth.toStringPrivate()
		}

		account_switch( key: string, keep = this.key() ) {
			const self = this.account_self( keep )
			this.home_saving()
			this.account_write( self, key )
		}

		home_saving() {
			this.glob().Land( new $giper_baza_link( this.lord() ) ).units_saving()
		}

		@ $mol_action
		account_write( self: $bog_id_account_data, key: string ) {
			this.$.$bog_id_account.put( self )
			this.$.$giper_baza_auth.current( this.$.$giper_baza_auth.from( key ) )
			this.$.$mol_dom_context.location.reload()
		}

		@ $mol_mem
		connected() {
			try {
				return Boolean( this.glob().yard().master() )
			} catch( error ) {
				if( !$mol_promise_like( error ) ) $mol_fail_log( error )
				return false
			}
		}

		consent_text() {
			return this.consent_template().replace( '{scope}', ()=> this.request()?.scope ?? '' )
		}

		approve_title() {
			const name = this.name() || this.name_draft()
			return name ? this.approve_as().replace( '{name}', ()=> name ) : this.approve_plain()
		}

		@ $mol_action
		name_apply() {
			const draft = this.name_draft().trim()
			if( draft ) this.name( draft )
		}

		@ $mol_mem
		synced() {
			try {
				return this.hold_lands()
					.map( land => this.$.$bog_id_land_synced( land.link().str ) )
					.every( Boolean )
			} catch( error ) {
				if( !$mol_promise_like( error ) ) $mol_fail_log( error )
				return false
			}
		}

		approve_enabled() {
			return Boolean( this.request_pass() ) && !this.request_self() && this.synced()
		}

		approve() {
			this.name_apply()
			$mol_wire_async( this ).grant_send()
		}

		reject() {

			const request = this.request()
			if( request ) this.$.$mol_dom_context.opener?.postMessage( { bog_id: 'deny' }, request.origin )

			this.request( null )
			this.$.$mol_dom_context.close()

		}

		grant_send() {

			const sent = this.grant_save()
			const { origin, ... data } = sent
			$mol_wire_sync( this ).grant_upload( data.pointer )

			this.$.$mol_dom_context.opener?.postMessage( { bog_id: 'grant', ... data }, origin )
			this.request( null )

		}

		async grant_upload( pointer: string ) {
			const lands = await $mol_wire_async( this ).upload_lands( pointer )
			await this.$.$bog_id_land_push( lands )
		}

		upload_lands( pointer: string ) {
			const home = this.glob().Land( new $giper_baza_link( this.lord() ) )
			const stores = this.stores().map( store => store.land() )
			const land = this.$.$bog_id_land( pointer )
			return [ home, ... stores, this.glob().Land( new $giper_baza_link( pointer ) ), ... land ? [ land ] : [] ]
		}

		grant_save() {

			const { origin, app, scope } = this.request()!
			const pass = this.request_pass()!

			const grant = this.grant_ensure( app, scope )
			this.grant_give( grant, pass )
			this.grant_saving( grant )

			return {
				origin,
				lord: this.lord(),
				name: this.name(),
				pointer: grant.Pointer()?.val() ?? '',
			}
		}

		@ $mol_action
		grant_ensure( app: string, scope: string ) {

			const found = this.grant_find( app, scope )
			if( found ) return found

			const store = this.store_ensure()
			const pointer = this.glob().land_grab([[ null, $giper_baza_rank_deny ]])
			const land = this.glob().land_grab([[ null, $giper_baza_rank_deny ]])

			pointer.Data( $giper_baza_atom_text ).val( land.link().str )

			const grant = store.Grants( 'auto' )!.make( null )
			grant.App( 'auto' )!.val( app )
			grant.Scope( 'auto' )!.val( scope )
			grant.Pointer( 'auto' )!.val( pointer.link().str )
			grant.Land( 'auto' )!.val( land.link().str )
			grant.Lands( 'auto' )!.add( land.link().str )

			return grant
		}

		@ $mol_action
		grant_state( grant: $bog_id_grant, pass: $giper_baza_auth_pass ) {
			return {
				given: this.grant_land( grant ).lord_rank( pass.lord() ) === $giper_baza_rank_post( 'just' ),
				listed: this.grant_apps( grant ).includes( pass.toString() ),
				pointer: this.grant_pointer( grant ),
				land: this.grant_land( grant ),
				lands: this.grant_lands( grant ),
			}
		}

		@ $mol_action
		grant_give( grant: $bog_id_grant, pass: $giper_baza_auth_pass ) {

			const { given, listed, pointer, land, lands } = this.grant_state( grant, pass )

			if( !given ) {
				pointer.give( pass, $giper_baza_rank_read )
				for( const old of lands ) if( old !== land ) old.give( pass, $giper_baza_rank_read )
				land.give( pass, $giper_baza_rank_post( 'just' ) )
			}

			if( !listed ) grant.Apps( 'auto' )!.add( pass.toString() )

		}

		grant_saving( grant: $bog_id_grant ) {
			this.grant_pointer( grant ).units_saving()
			for( const land of this.grant_lands( grant ) ) land.units_saving()
		}

		@ $mol_action
		rotate_state( grant: $bog_id_grant ) {
			return {
				apps: this.grant_apps( grant ),
				pointer: this.grant_pointer( grant ),
				land: this.grant_land( grant ),
				lands: this.grant_lands( grant ),
			}
		}

		@ $mol_action
		rotate_write( grant: $bog_id_grant, drop: readonly string[] | null ) {

			const { apps, pointer, land, lands } = this.rotate_state( grant )
			const out = drop ?? apps
			const keep = apps.filter( pass => !out.includes( pass ) )

			const next = land.fork([[ null, $giper_baza_rank_deny ]])

			for( const str of out ) {
				const pass = $giper_baza_auth_pass.from( str )
				pointer.give( pass, $giper_baza_rank_deny )
				for( const old of lands ) old.give( pass, $giper_baza_rank_deny )
			}

			for( const str of keep ) next.give( $giper_baza_auth_pass.from( str ), $giper_baza_rank_post( 'just' ) )

			pointer.Data( $giper_baza_atom_text ).val( next.link().str )
			grant.Land( 'auto' )!.val( next.link().str )
			grant.Lands( 'auto' )!.add( next.link().str )
			for( const str of out ) grant.Apps( 'auto' )!.cut( str )

		}

		rotate( id: string, drop: readonly string[] | null ) {
			const grant = this.grant( id )
			this.rotate_write( grant, drop )
			this.grant_saving( grant )
		}

		grant_rows() {
			return this.grants().map( grant => this.Grant( grant.link().str ) )
		}

		grant_parts( id: string ) {
			return [
				this.Grant_head( id ),
				... this.grant_apps( this.grant( id ) ).map( pass => this.App( `${ id }|${ pass }` ) ),
			]
		}

		grant_title( id: string ) {
			const grant = this.grant( id )
			return this.grant_template()
				.replace( '{app}', grant.App()?.val() ?? '' )
				.replace( '{scope}', grant.Scope()?.val() ?? '' )
		}

		grant_active( id: string ) {
			return this.grant_apps( this.grant( id ) ).length > 0
		}

		grant_revoke( id: string ) {
			$mol_wire_async( this ).rotate( id, null )
		}

		app_title( key: string ) {
			const pass = $giper_baza_auth_pass.from( key.split( '|' )[ 1 ] )
			return this.device_template().replace( '{lord}', pass.lord().str )
		}

		app_revoke( key: string ) {
			const [ id, pass ] = key.split( '|' )
			$mol_wire_async( this ).rotate( id, [ pass ] )
		}

		vault( next?: string ) {
			if( next === undefined ) return this.profile()?.Vault()?.val() ?? ''
			return this.profile( 'auto' )!.Vault( 'auto' )!.val( next ) ?? ''
		}

		vault_of( lord: string ) {
			return this.$.$bog_id_profile_of( lord )?.Vault()?.val() || this.$.$bog_id_account.find( lord )?.vault || ''
		}

		passkey_salt() {
			return new Uint8Array( $mol_charset_encode( 'bog_id' ) )
		}

		passkey_bind_title() {
			return this.vault() ? this.passkey_rebind_title() : super.passkey_bind_title()
		}

		bind_note() {
			return this.vault() ? this.passkey_done() : this.passkey_none()
		}

		@ $mol_mem
		passkey_error( next?: string ) {
			return next ?? ''
		}

		enter_status() {
			return this.passkey_error() || this.restoring()
		}

		bind_status() {
			if( this.enter_status() ) return this.enter_status()
			return this.vault() && !this.connected() ? this.passkey_unsaved() : ''
		}

		passkey_fail( error: Error ) {
			if( error.name === 'NotAllowedError' ) return this.passkey_error( this.passkey_cancel() )
			if( /PRF/.test( error.message ) ) return this.passkey_error( this.passkey_noprf() )
			this.passkey_error( error.message )
		}

		passkey_id = null as Uint8Array< ArrayBuffer > | null

		passkey_bind() {
			this.passkey_error( '' )
			this.passkey_bind_run().catch( error => this.passkey_fail( error ) )
		}

		async passkey_bind_run() {

			const auth = this.$.$giper_baza_auth.current()
			const vault = await this.$.$bog_id_vault.seal( auth, await this.passkey_key() )
			this.passkey_id = null

			await $mol_wire_async( this ).vault_add( vault )
			this.$.$bog_id_account.put( this.account_self() )

		}

		async passkey_key() {

			const Secret = this.$.$bog_passkey_secret

			if( !this.passkey_id ) {

				const lord = this.$.$giper_baza_auth.current().pass().lord()
				const { id, key } = await Secret.pair( lord.toBin(), this.name() || lord.str, this.passkey_salt() )
				if( key ) return key

				this.passkey_id = id

				try {
					return ( await Secret.get( this.passkey_salt(), id ) ).key
				} catch {
					return $mol_fail( new Error( this.passkey_again() ) )
				}

			}

			return ( await Secret.get( this.passkey_salt(), this.passkey_id ) ).key
		}

		@ $mol_action
		vault_add( vault: string ) {
			const last = this.vault().split( ' ' ).filter( Boolean ).slice( -4 )
			this.vault( [ ... last, vault ].join( ' ' ) )
		}

		passkey_enter() {
			this.passkey_error( '' )
			this.passkey_enter_run().catch( error => this.passkey_fail( error ) )
		}

		async passkey_enter_run() {

			const { user, key } = await this.$.$bog_passkey_secret.get( this.passkey_salt() )
			if( user?.byteLength !== 12 ) return this.passkey_error( this.passkey_foreign() )

			this.restore({ lord: $giper_baza_link.from_bin( user ).str, key })

		}

		@ $mol_mem
		restore( next?: $bog_id_app_restore | null ) {
			return next ?? null
		}

		@ $mol_mem
		restoring() {

			const restore = this.restore()
			if( !restore ) return ''

			const vaults = this.vault_of( restore.lord ).split( ' ' ).filter( Boolean )
			if( !vaults.length ) return this.connected() ? this.passkey_wait() : this.passkey_offline()

			const key = $mol_wire_sync( this as $bog_id_app ).vault_key( vaults.join( ' ' ), restore )
			if( !key ) return this.passkey_wrong()

			$mol_wire_async( this as $bog_id_app ).account_switch( key )

			return ''
		}

		async vault_key( vaults: string, restore: $bog_id_app_restore ) {
			for( const vault of vaults.split( ' ' ) ) {

				const str = await this.$.$bog_id_vault.open( vault, restore.key )
				if( !str.startsWith( '_' ) ) continue

				try {
					if( this.$.$giper_baza_auth.from( str ).pass().lord().str === restore.lord ) return str
				} catch( error ) {
					$mol_fail_log( error )
				}

			}
			return ''
		}

	}

}

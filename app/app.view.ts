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
			this.listening()
			this.restoring()
		}

		glob() {
			return this.$.$giper_baza_glob
		}

		profile() {
			return this.glob().home().land().Data( $bog_id_profile )
		}

		@ $mol_mem
		lord() {
			return this.$.$giper_baza_auth.current().pass().lord().str
		}

		name( next?: string ) {
			return this.profile().Name( next )?.val( next ) ?? ''
		}

		stores() {
			return ( this.profile().Stores()?.items() ?? [] )
				.map( link => this.glob().Land( new $giper_baza_link( String( link ) ) ).Data( $bog_id_store ) )
		}

		@ $mol_action
		store_ensure() {

			const [ found ] = this.stores()
			if( found ) return found

			const land = this.glob().land_grab([[ null, $giper_baza_rank_deny ]])
			this.profile().Stores( 'auto' )!.add( land.link().str )

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

		body() {
			return [
				... this.request() ? [ this.Consent() ] : [],
				this.Name_label(),
				this.Lord_label(),
				this.Passkey_label(),
				this.Grants_label(),
			]
		}

		consent_rows() {
			return [
				this.Consent_text(),
				... this.request_self() ? [ this.Consent_self() ] : [],
				this.Consent_tools(),
			]
		}

		consent_text() {
			const request = this.request()
			return this.consent_template()
				.replace( '{app}', request?.app ?? '' )
				.replace( '{scope}', request?.scope ?? '' )
		}

		approve_enabled() {
			return Boolean( this.request_pass() ) && !this.request_self()
		}

		approve() {
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

			this.$.$mol_dom_context.opener?.postMessage( { bog_id: 'grant', ... data }, origin )
			this.request( null )

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
			return this.profile().Vault( next )?.val( next ) ?? ''
		}

		vault_of( lord: string ) {
			return this.glob().Land( new $giper_baza_link( lord ) ).Data( $bog_id_profile ).Vault()?.val() ?? ''
		}

		passkey_salt() {
			return new Uint8Array( $mol_charset_encode( 'bog_id' ) )
		}

		passkey_bind_title() {
			return this.vault() ? this.passkey_rebind_title() : super.passkey_bind_title()
		}

		@ $mol_mem
		passkey_error( next?: string ) {
			return next ?? ''
		}

		passkey_status() {
			if( this.passkey_error() ) return this.passkey_error()
			if( this.restore() ) return this.restoring()
			return this.vault() ? this.passkey_done() : this.passkey_none()
		}

		passkey_bind() {
			this.passkey_error( '' )
			this.passkey_bind_run().catch( error => this.passkey_error( error.message ) )
		}

		async passkey_bind_run() {

			const auth = this.$.$giper_baza_auth.current()
			const lord = auth.pass().lord()

			const id = await this.$.$bog_passkey_secret.make( lord.toBin(), this.name() || lord.str )
			const { key } = await this.$.$bog_passkey_secret.get( this.passkey_salt(), id )
			const vault = await this.$.$bog_id_vault.seal( auth, key )

			await $mol_wire_async( this ).vault( vault )

		}

		passkey_enter() {
			this.passkey_error( '' )
			this.passkey_enter_run().catch( error => this.passkey_error( error.message ) )
		}

		async passkey_enter_run() {

			const found = await this.$.$bog_passkey_secret.get( this.passkey_salt() )
			if( !found.user ) $mol_fail( new Error( 'Passkey has no user' ) )

			const lord = $giper_baza_link.from_bin( found.user )
			this.restore({ lord: lord.str, key: found.key })

		}

		@ $mol_mem
		restore( next?: $bog_id_app_restore | null ) {
			return next ?? null
		}

		@ $mol_mem
		restoring() {

			const restore = this.restore()
			if( !restore ) return ''

			const vault = this.vault_of( restore.lord )
			if( !vault ) return this.passkey_wait()

			const str = $mol_wire_sync( this.$.$bog_id_vault ).open( vault, restore.key )
			if( !str.startsWith( '_' ) ) return this.passkey_wrong()

			const auth = this.$.$giper_baza_auth.from( str )
			if( auth.pass().lord().str !== restore.lord ) return this.passkey_wrong()

			this.$.$giper_baza_auth.current( auth )
			this.$.$mol_dom_context.location.reload()

			return ''
		}

	}

}

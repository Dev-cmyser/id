namespace $.$$ {

	export type $bog_id_app_request = {
		origin: string
		pass: string
		scope: string
	}

	export class $bog_id_app extends $.$bog_id_app {

		auto() {
			this.store()
			this.listening()
		}

		store() {
			return this.$.$giper_baza_glob.home().land().Data( $bog_id_store )
		}

		grants() {
			const land = this.store().land()
			return ( this.store().Grants()?.items() ?? [] )
				.map( link => land.Pawn( $bog_id_grant ).Head( new $giper_baza_link( String( link ) ).head() ) )
		}

		grant( id: string ) {
			return this.grants().find( grant => grant.link().str === id )!
		}

		grant_find( origin: string, scope: string ) {
			return this.grants().find( grant => grant.Origin()?.val() === origin && grant.Scope()?.val() === scope ) ?? null
		}

		@ $mol_action
		grant_ensure( origin: string, scope: string ) {

			const found = this.grant_find( origin, scope )
			if( found ) return found

			const land = this.$.$giper_baza_glob.land_grab([[ null, $giper_baza_rank_deny ]])

			const grant = this.store().Grants( 'auto' )!.make( null )
			grant.Origin( 'auto' )!.val( origin )
			grant.Scope( 'auto' )!.val( scope )
			grant.Land( 'auto' )!.val( land.link().str )

			return grant
		}

		@ $mol_action
		grant_give( grant: $bog_id_grant, pass: $giper_baza_auth_pass ) {

			const { given, listed, revoked } = this.grant_state( grant, pass )

			if( !given ) this.grant_land( grant ).give( pass, $giper_baza_rank_post( 'just' ) )
			if( !listed ) grant.Apps( 'auto' )!.add( pass.toString() )
			if( revoked ) grant.Revoked( 'auto' )!.val( false )

		}

		@ $mol_action
		grant_state( grant: $bog_id_grant, pass: $giper_baza_auth_pass ) {
			return {
				given: this.grant_land( grant ).lord_rank( pass.lord() ) === $giper_baza_rank_post( 'just' ),
				listed: ( grant.Apps()?.items() ?? [] ).includes( pass.toString() ),
				revoked: grant.Revoked()?.val() ?? false,
			}
		}

		grant_land( grant: $bog_id_grant ) {
			return this.$.$giper_baza_glob.Land( new $giper_baza_link( grant.Land()?.val() ?? '' ) )
		}

		@ $mol_mem
		lord() {
			return this.$.$giper_baza_auth.current().pass().lord().str
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
				pass: String( event.data.pass ),
				scope: String( event.data.scope ),
			})

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

		body() {
			return [
				... this.request() ? [ this.Consent() ] : [],
				this.Lord_label(),
				this.Grants_label(),
			]
		}

		consent_text() {
			const request = this.request()
			return this.consent_template()
				.replace( '{origin}', request?.origin ?? '' )
				.replace( '{scope}', request?.scope ?? '' )
		}

		approve_enabled() {
			return Boolean( this.request_pass() )
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
			this.$.$mol_dom_context.opener?.postMessage( { bog_id: 'grant', lord: sent.lord, land: sent.land }, sent.origin )

			this.request( null )

		}

		grant_save() {

			const { origin, scope } = this.request()!
			const pass = this.request_pass()!

			const grant = this.grant_ensure( origin, scope )
			this.grant_give( grant, pass )

			const land = this.grant_land( grant )
			land.units_saving()

			return { origin, lord: this.lord(), land: land.link().str }
		}

		grant_rows() {
			return this.grants().map( grant => this.Grant( grant.link().str ) )
		}

		grant_origin( id: string ) {
			return this.grant( id ).Origin()?.val() ?? ''
		}

		grant_scope( id: string ) {
			return this.grant( id ).Scope()?.val() ?? ''
		}

		grant_active( id: string ) {
			return !( this.grant( id ).Revoked()?.val() ?? false )
		}

		grant_revoke( id: string ) {
			$mol_wire_async( this ).revoke( id )
		}

		revoke( id: string ) {

			const grant = this.grant( id )
			const land = this.grant_land( grant )
			const apps = grant.Apps()?.items() ?? []

			for( const str of apps ) {
				land.give( $giper_baza_auth_pass.from( String( str ) ), $giper_baza_rank_deny )
			}

			grant.Revoked( 'auto' )!.val( true )
			land.units_saving()

		}

	}

}

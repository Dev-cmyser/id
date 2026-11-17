namespace $ {

	export type $bog_id_login_grant = {
		lord: string
		land: string
	}

	/** Opens Giper ID popup, sends app Pass and resolves with granted Land */
	export function $bog_id_login( provider: string, pass: string, scope: string ) {

		const win = $mol_dom_context
		const origin = new URL( provider, win.location.href ).origin

		return new Promise< $bog_id_login_grant >( ( done, fail )=> {

			const popup = win.open( provider, 'bog_id', 'popup,width=440,height=640' )
			if( !popup ) return fail( new Error( 'Popup blocked' ) )

			const timer = win.setInterval( ()=> {
				if( popup.closed ) finish( new Error( 'Popup closed' ) )
			}, 500 )

			const finish = ( error: Error | null, grant?: $bog_id_login_grant )=> {
				win.clearInterval( timer )
				win.removeEventListener( 'message', listen )
				if( error ) fail( error )
				else done( grant! )
			}

			const listen = ( event: MessageEvent )=> {

				if( event.origin !== origin ) return
				if( event.source !== popup ) return

				const data = event.data
				if( data?.bog_id === 'ready' ) popup.postMessage( { bog_id: 'request', pass, scope }, origin )
				if( data?.bog_id === 'deny' ) finish( new Error( 'Access denied' ) )

				if( data?.bog_id === 'grant' ) {
					popup.close()
					finish( null, { lord: String( data.lord ), land: String( data.land ) } )
				}

			}

			win.addEventListener( 'message', listen )

		} )

	}

}

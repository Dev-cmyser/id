namespace $ {

	export type $bog_id_account_data = {
		lord: string
		name: string
		key: string
		vault: string
	}

	/** Accounts known on this device */
	export class $bog_id_account extends $mol_object2 {

		static list( next?: readonly $bog_id_account_data[] ): readonly $bog_id_account_data[] {
			return this.$.$mol_state_local.value( '$bog_id_account', next ) ?? []
		}

		static find( lord: string ) {
			return this.list().find( data => data.lord === lord ) ?? null
		}

		static merge( data: $bog_id_account_data ) {
			const list = this.list()
			if( !this.find( data.lord ) ) return [ ... list, data ]
			return list.map( old => old.lord === data.lord ? data : old )
		}

		static put( data: $bog_id_account_data ) {
			this.list( this.merge( data ) )
		}

	}

}

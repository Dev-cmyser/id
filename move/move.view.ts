namespace $.$$ {
	export class $bog_id_move extends $.$bog_id_move {

		rows() {
			return [
				this.Scan(),
				this.Input(),
				this.Apply(),
				... this.status() ? [ this.Status() ] : [],
			]
		}

		found( next?: string ) {
			if( next ) this.enter( next )
			return ''
		}

		submit( next?: Event | null ) {
			if( next !== undefined ) this.enter( this.input() )
			return null
		}

		async enter( text: string ) {

			const key = await this.$.$bog_id_move_key( text )

			if( !key ) {
				this.status( text.trim() ? this.status_bad() : this.status_empty() )
				return
			}

			this.status( '' )
			this.input( '' )
			this.apply( key )

		}

	}
}

namespace $.$$ {

	export class $bog_id_row extends $.$bog_id_row {

		info() {
			return [
				this.Name(),
				... this.note() ? [ this.Note() ] : [],
			]
		}

	}

}

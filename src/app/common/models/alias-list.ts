export class AliasList {

  constructor(public groups: { group: string, members: string[] }[], artists: {
    name: string,
    albums?: number,
    icon?: string
  }) {
  }

}

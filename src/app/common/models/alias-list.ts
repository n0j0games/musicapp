import {Artist} from "./artist";

export class AliasList {

  constructor(public groups: { group: string, members: string[] }[],
              public artists: Artist[]) {
  }

}

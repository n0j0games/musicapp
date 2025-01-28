import {Artist} from "./artist";

export class Song {

  constructor(public artist : string,
              public title : string,
              public url : string,
              public imgUrl : string,
              public previewUrl : string,
              public rating : number,
              public album? : string,
              public color? : string) {
  }

}

import {concat, concatMap, delay, from, ignoreElements, interval, map, of, take} from "rxjs";
import {TypeParams} from "./type-params";

export class TypewriterHelper {

    public static getTypewriterEffect(titles: string[], speed : number, startDelay : number = 0) {
        return from(titles).pipe(
            concatMap(title => this.typeEffect(title, speed, startDelay))
        );
    }

    private static type({ word, speed, backwards = false }: TypeParams) {
        return interval(speed).pipe(
            map(x => backwards ? word.substring(0, word.length - x) : word.substring(0, x + 1)),
            take(word.length)
        );
    }

    private static typeEffect(word: string, speed : number, startDelay : number) {
        return concat(
            of('').pipe(delay(startDelay), ignoreElements()),
            this.type({ word, speed: speed }),
            of('').pipe(delay(1200), ignoreElements()),
        );
    }

}
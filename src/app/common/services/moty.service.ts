import {Injectable} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {MotyItem} from "../models/moty-item";
import {Movie} from "../models/movie";

@Injectable({
    providedIn: 'root'
})
export class MotyService {

    private motyItems : MotyItem[] = [];
    private unsortedMotyItems : MotyItem = new MotyItem([], 0);

    getAllMovies() {
        return this.motyItems;
    }

    getMoviesOfTheYear(year: number): MotyItem | null {
        for (const item of this.motyItems) {
            if (item.year == year) {
                return item;
            }
        }
        return null;
    }

    setMoviesOfTheYear(motyItems: (MotyItem|HttpErrorResponse)[]) {
        for (const motyItem of motyItems) {
            const tempItem : MotyItem = <MotyItem>motyItem;
            for (let item of tempItem.items) {
                this.addToMoviesOfTheYear(item)
            }
        }
        console.log("fetched movies", motyItems);
    }

    addToMoviesOfTheYear(movie: Movie) {
        for (const year of movie.years) {
            this.addMovieToYear(movie, year);
        }
        this.unsortedMotyItems.items.push(movie);
    }

    addMovieToYear(movie : Movie, year : number) {
        for (const item in this.motyItems) {
            if (this.motyItems[item].year === year) {
                this.motyItems[item].items.push(movie);
                return;
            }
        }
        this.motyItems.push(new MotyItem([movie], year));
    }

}
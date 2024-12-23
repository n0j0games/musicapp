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

    getAllUnsortedMovies() {
        return new MotyItem(this.unsortedMotyItems.items.slice(), 0);
    }

    getMoviesOfTheYear(year: number): MotyItem | null {
        for (const item of this.motyItems) {
            if (item.year == year) {
                console.log(item);
                return item;
            }
        }
        return null;
    }

    setMoviesOfTheYear(motyItems: (MotyItem|HttpErrorResponse)[]) {
        for (const motyItem of motyItems) {
            const tempItem : MotyItem = <MotyItem>motyItem;
            for (const item of tempItem.items) {
                this.addToMoviesOfTheYear(item)
            }
        }
    }

    addToMoviesOfTheYear(movie: Movie) {
        for (let i=0; i<movie.years.length; i++) {
            this.addMovieToYear(movie, movie.years[i], i);
        }
        this.unsortedMotyItems.items.push(movie);
    }

    addMovieToYear(movie : Movie, year : number, index : number) {
        for (const item in this.motyItems) {
            if (this.motyItems[item].year === year) {
                this.motyItems[item].items.push(this.copyMovie(movie, index));
                return;
            }
        }
        this.motyItems.push(new MotyItem([this.copyMovie(movie, index)], year));
    }

    copyMovie(movie : Movie, index : number) : Movie {
        const item = new Movie(movie.title, movie.creator, movie.years, movie.rating, movie.url, movie.imgUrl);
        if (movie.franchise) {
            item.franchise = movie.franchise;
        }
        if (movie.seasons) {
            item.seasons = movie.seasons;
        }
        item.activeSeason = index+1;
        return item;
    }

}
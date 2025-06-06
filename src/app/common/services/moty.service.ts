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

    private seriesItems : MotyItem[] = [];
    private unsortedSeriesItems : MotyItem = new MotyItem([], 0);

    getAllSeries() {
        return this.seriesItems;
    }

    getAllMovies() {
        return this.motyItems;
    }

    getAllUnsortedMovies() {
        return new MotyItem(this.unsortedMotyItems.items.slice(), 0);
    }

    getAllUnsortedSeries() {
        return new MotyItem(this.unsortedSeriesItems.items.slice(), 0);
    }

    getSeriesOfTheYear(year: number): MotyItem | null {
        for (const item of this.seriesItems) {
            if (item.year == year) {
                return item;
            }
        }
        return null;
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
            for (const item of tempItem.items) {
                this.addToMoviesOfTheYear(item)
            }
        }
    }

    setSeriesOfTheYear(motyItems: (MotyItem|HttpErrorResponse)[]) {
        for (const motyItem of motyItems) {
            const tempItem : MotyItem = <MotyItem>motyItem;
            for (const item of tempItem.items) {
                this.addToSeriesOfTheYear(item)
            }
        }
    }


    addToMoviesOfTheYear(movie: Movie) {
        this.addMovieToYear(movie, movie.year);
        this.unsortedMotyItems.items.push(movie);
    }

    addToSeriesOfTheYear(movie: Movie) {
        this.addSerieToYear(movie, movie.year);
        this.unsortedSeriesItems.items.push(movie);
    }

    addMovieToYear(movie : Movie, year : number) {
        for (const item in this.motyItems) {
            if (this.motyItems[item].year === year) {
                this.motyItems[item].items.push(this.copyMovie(movie));
                return;
            }
        }
        this.motyItems.push(new MotyItem([this.copyMovie(movie)], year));
    }

    addSerieToYear(movie : Movie, year : number) {
        for (const item in this.seriesItems) {
            if (this.seriesItems[item].year === year) {
                this.seriesItems[item].items.push(this.copyMovie(movie));
                return;
            }
        }
        this.seriesItems.push(new MotyItem([this.copyMovie(movie)], year));
    }

    copyMovie(movie : Movie) : Movie {
        const item = new Movie(movie.title, movie.year, movie.rating, movie.url, movie.imgSrc);
        if (movie.creator) {
            item.creator = movie.creator;
        }
        if (movie.subtitle) {
            item.subtitle = movie.subtitle;
        }
        return item;
    }

}
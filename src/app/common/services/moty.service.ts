import {Injectable} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {MotyItem} from "../models/moty-item";
import {Movie} from "../models/movie";

@Injectable({
    providedIn: 'root'
})
export class MotyService {

    private allMoviesAndShows : MotyItem[] = [];

    getAllMoviesAndShows() {
        return this.allMoviesAndShows;
    }

    setAllMoviesAndShows(motyItems: (MotyItem|HttpErrorResponse)[]) {
        for (const motyItem of motyItems) {
            const tempItem : MotyItem = <MotyItem>motyItem;
            for (const item of tempItem.items) {
                this.addToMoviesOfTheYear(item)
            }
        }
    }

    private addToMoviesOfTheYear(movie: Movie) {
        this.addMovieToYear(movie, movie.year);
    }


    private addMovieToYear(movie : Movie, year : number) {
        for (const item in this.allMoviesAndShows) {
            if (this.allMoviesAndShows[item].year === year) {
                this.allMoviesAndShows[item].items.push(this.copyMovie(movie));
                return;
            }
        }
        this.allMoviesAndShows.push(new MotyItem([this.copyMovie(movie)], year));
    }

    private copyMovie(movie : Movie) : Movie {
        const item = new Movie(movie.title, movie.year, movie.rating, movie.url, movie.imgSrc);
        if (movie.creator) {
            item.creator = movie.creator;
        }
        if (movie.subtitle) {
            item.subtitle = movie.subtitle;
        }
        if (movie.franchises) {
            item.franchises = movie.franchises;
        }
        if (movie.seasonHref) {
            item.seasonHref = movie.seasonHref;
        }
        return item;
    }

}
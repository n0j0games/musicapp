import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AdminService} from "../services/admin.service";
import {SpotifySearchItem} from "../models/spotify-search-item";
import {Album} from "../../albums-of-the-year/models/album";
import {SpotifyGetAlbumResponse, SpotifyGetAlbumTrack} from "../models/spotify-get-album-response";

export type AlbumType = 'LP' | 'EP' | 'Deluxe' | 'Reissue';

@Component({
  selector: 'app-add-albums',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './add-albums.component.html',
  styleUrl: './add-albums.component.scss'
})
export class AddAlbumsComponent {

  private readonly adminService = inject(AdminService);

  // Step 1: Enter search query

  searchFormGroup = new FormGroup({
    searchForm: new FormControl<string>('', [Validators.required]),
  });

  onSearchSubmit(): void {
    const queryString = this.searchFormGroup.controls.searchForm.value;
    if (queryString === null) {
      throw new Error('Query string is null');
    }
    this.adminService.searchSpotify(queryString).subscribe((r => this.options.set([...r])));
  };

  // Step 2: Select album to add

  protected options = signal<SpotifySearchItem[]>([]);

  searchFormGroup2 = new FormGroup({
    album: new FormControl<SpotifySearchItem | null>(null, [Validators.required]),
  });

  onSearch2Submit(): void {
    const selectedAlbum = this.searchFormGroup2.controls.album.value;
    if (selectedAlbum === null) {
      throw new Error('Album is null');
    }
    this.adminService.searchSpotifyGetAlbum(selectedAlbum.id).subscribe(a => {
      this.albumToModify.set(a);
      this.songsToChooseFrom.set(a.tracks);
    });
  }

  // Step 3: Modify album

  albumToModify = signal<SpotifyGetAlbumResponse | null>(null);

  songsToChooseFrom = signal<SpotifyGetAlbumTrack[]>([]);

  multiSelectOpen: boolean = false;

  modifyFormGroup = new FormGroup({
    rating: new FormControl<number>(0, Validators.required),
    genre: new FormControl<string | undefined>(undefined),
    onVinyl: new FormControl<boolean>(false),
    type: new FormControl<AlbumType>('LP'),
    color: new FormControl<string | undefined>(undefined),
    songs: new FormControl<SpotifyGetAlbumTrack[]>([]),
  });

  isSelected(song: SpotifyGetAlbumTrack) {
    return this.modifyFormGroup.controls.songs.value?.some(x => x.name === song.name) ?? false;
  }

  toggle(song: SpotifyGetAlbumTrack) {
    const cur = this.modifyFormGroup.controls.songs.value ?? [];
    const next = this.isSelected(song) ? cur.filter(x => x.name === song.name) : [...cur, song];
    this.modifyFormGroup.patchValue({ songs: next });
  }

  modifyAdd() {
    const spotifyData = this.albumToModify();
    if (!spotifyData) {
      throw new Error('Spotify data must be defined');
    }
    const hasSelectedSongs = this.modifyFormGroup.controls.songs.value ? this.modifyFormGroup.controls.songs.value.length > 0 : false;
    const artist = spotifyData.artist ?? '';
    const url = spotifyData.url;
    const imgUrl = spotifyData.imageUrl ?? '';
    const rating = Number(this.modifyFormGroup.controls.rating.value) ?? 0;
    const title = spotifyData.title;
    const year = spotifyData.year;
    const songs: { title: string, preview_url: string }[] | undefined = hasSelectedSongs ?
        this.modifyFormGroup.controls.songs.value?.filter(x => x.name && x.url).map(x => {
          return {
            title: x.name ?? '',
            preview_url: x.url ?? ''
          };
        }) ?? undefined : undefined;
    const genre = this.modifyFormGroup.controls.genre.value ?? undefined;
    const type = this.modifyFormGroup.controls.type.value ?? 'LP';
    const color = this.modifyFormGroup.controls.color.value ?? undefined;
    const albumToAdd: Album = {artist, url, imgUrl, rating, title, songs, genre, type, color, year};
    this.albumsToAdd.set([...this.albumsToAdd(), albumToAdd]);

    this.reset();
  }

  private reset() {
    this.searchFormGroup.reset();
    this.searchFormGroup2.reset();
    this.modifyFormGroup.reset();
    this.songsToChooseFrom.set([]);
    this.albumToModify.set(null);
    this.multiSelectOpen = false;
    this.options.set([]);
  }

  // Step 4: Collect albums to add

  albumsToAdd = signal<Album[]>([]);

  submit() {
    this.adminService.addAlbums(this.albumsToAdd())
    console.log(this.albumsToAdd());
  }

}

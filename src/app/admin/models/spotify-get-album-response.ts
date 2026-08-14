export interface SpotifyGetAlbumTrack {
    url?: string;
    name?: string;
}

export interface SpotifyGetAlbumResponse {
    url: string;
    imageUrl?: string;
    title: string;
    artist?: string;
    year: number;
    tracks: SpotifyGetAlbumTrack[];
}
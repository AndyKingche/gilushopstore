import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Video {
  ytId: string;
  title: string;
  influencer: string;
  product: string;
  thumbnailUrl: string;
  embedUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-influencer-videos',
  templateUrl: './influencer-videos.component.html',
  styleUrls: ['./influencer-videos.component.scss']
})
export class InfluencerVideosComponent {
  videos: Video[] = [
    { 
      ytId: 'IBnQN-hm7ug', 
      title: 'Lifter Plump Gloss', 
      influencer: 'Michela Pincay', 
      product: 'Lifter Plump',
      thumbnailUrl: '',
      embedUrl: ''
    },
    { 
      ytId: '1aoE8RVOcQ4', 
      title: 'Sunkisser Blush', 
      influencer: 'Beauty Influencer', 
      product: 'Sunkisser Blush',
      thumbnailUrl: '',
      embedUrl: ''
    },
    { 
      ytId: 'wQyvOqu6Pgs', 
      title: 'Lash Firework', 
      influencer: 'MakeUp Creator', 
      product: 'Rimel Firework',
      thumbnailUrl: '',
      embedUrl: ''
    },
    { 
      ytId: 'uvf4F7SkJ4U', 
      title: 'Superstay Lumi', 
      influencer: 'Glam Latina', 
      product: 'Base Superstay',
      thumbnailUrl: '',
      embedUrl: ''
    }
  ];

  playingVideo: number | null = null;

  constructor(private sanitizer: DomSanitizer) {
    // Initialize thumbnail and embed URLs
    this.videos = this.videos.map(video => ({
      ...video,
      thumbnailUrl: `https://i.ytimg.com/vi/${video.ytId}/mqdefault.jpg`,
      embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${video.ytId}?autoplay=1&showinfo=0&rel=0&modestbranding=1&controls=1`
      )
    }));
  }

  playVideo(index: number): void {
    this.playingVideo = index;
  }

  stopVideo(): void {
    this.playingVideo = null;
  }

  getThumbnailUrl(video: Video): string {
    return video.thumbnailUrl;
  }
}

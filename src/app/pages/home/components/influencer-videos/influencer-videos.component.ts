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
      thumbnailUrl: 'https://i.ibb.co/1hhMgp7/1.png',
      embedUrl: ''
    },
    { 
      ytId: '_91R1VSkmj0', 
      title: 'Super Stay Teddy Tint', 
      influencer: 'Kenia Os', 
      product: 'Lip Tint',
      thumbnailUrl: 'https://i.ibb.co/Y4nnHSNS/2.png',
      embedUrl: ''
    },
    { 
      ytId: 'kYu1N_aQNH4', 
      title: 'Jam Session', 
      influencer: 'Ronnie Bears', 
      product: 'Lip Gloss',
      thumbnailUrl: 'https://i.ibb.co/tMDb8yL2/3.png',
      embedUrl: ''
    },
    { 
      ytId: 'VCY7IlB7KUU', 
      title: 'Too Faced', 
      influencer: 'Fabilicious', 
      product: 'Concealer',
      thumbnailUrl: 'https://i.ibb.co/YTPqSKrB/4.png',
      embedUrl: ''
    }
  ];

  playingVideo: number | null = null;

  constructor(private sanitizer: DomSanitizer) {
    // Initialize embed URLs (thumbnailUrl already set)
    this.videos = this.videos.map(video => ({
      ...video,
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

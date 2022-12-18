import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';

declare class ImageCapture {
  constructor(...args);
  [x: string]: any;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-video-capture',
  templateUrl: './video-capture.component.html',
  styleUrls: ['./video-capture.component.css'],
})
export class VideoCaptureComponent implements OnInit, AfterViewInit {
  imageCapture!: ImageCapture;
  constructor() {}

  ngAfterViewInit(): void {
    Promise.resolve(this.getMedia());
  }

  async getMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { pan: true, tilt: true, zoom: true, video: true } as any,
      });
      const video = document.querySelector('video');
      video.srcObject = stream;

      const [track] = stream.getVideoTracks();
      this.imageCapture = new ImageCapture(track);

      const capabilities = track.getCapabilities();
      const settings = track.getSettings();

      for (const ptz of ['pan', 'tilt', 'zoom']) {
        // Check whether pan/tilt/zoom is available or not.
        if (!(ptz in settings)) continue;

        // Map it to a slider element.
        const input = document.getElementById(ptz) as HTMLInputElement;
        input.min = capabilities[ptz].min;
        input.max = capabilities[ptz].max;
        input.step = capabilities[ptz].step;
        input.value = settings[ptz];
        input.disabled = false;
        input.oninput = async (event) => {
          try {
            // Warning: Chrome requires advanced constraints.
            await track.applyConstraints({ [ptz]: input.value });
          } catch (err) {
            console.error('applyConstraints() failed: ', err);
          }
        };
      }
    } catch (err) {
      console.error(err);
    }
  }

  async takePhoto() {
    try {
      const canvas = document.querySelector('canvas');
      console.log(await this.imageCapture.getPhotoCapabilities());
      console.log(await this.imageCapture.getPhotoSettings());
      // console.log(blob1);
      // const blob = await this.imageCapture.takePhoto();
      // console.log(blob);
      // console.log('Photo taken: ' + blob.type + ', ' + blob.size + 'B');

      // const image = document.querySelector('img');
      // image.src = URL.createObjectURL(blob);
      const imgData = await this.imageCapture.grabFrame();
      canvas.width = imgData.width;
      canvas.height = imgData.height;
      canvas.getContext('2d').drawImage(imgData, 0, 0);
      const ahref = document.querySelector('a') as HTMLAnchorElement;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      ahref.href = URL.createObjectURL(blob as any);
    } catch (err) {
      console.error('takePhoto() failed: ', err);
    }
  }

  ngOnInit() {}

  takePicture() {
    Promise.resolve(this.takePhoto());
  }
}

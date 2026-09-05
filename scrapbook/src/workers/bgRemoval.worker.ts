import { pipeline, env } from '@xenova/transformers';
import * as Comlink from 'comlink';

// Configure environment for browser
env.allowLocalModels = false;
env.useBrowserCache = true;

class BackgroundRemovalPipeline {
  static instance: any = null;

  static async getInstance() {
    if (this.instance === null) {
      // briaai/RMBG-1.4 is the standard model for background removal
      this.instance = await pipeline('image-segmentation', 'briaai/RMBG-1.4');
    }
    return this.instance;
  }
}

const bgRemovalApi = {
  async removeBackground(imageUrl: string) {
    try {
      const segmenter = await BackgroundRemovalPipeline.getInstance();
      const output = await segmenter(imageUrl);
      
      // Return the segmentation mask
      // (Further compositing can be done on the main thread via canvas to avoid passing huge ImageData)
      return output;
    } catch (e) {
      console.error('WebWorker Background Removal Error:', e);
      throw e;
    }
  }
};

Comlink.expose(bgRemovalApi);

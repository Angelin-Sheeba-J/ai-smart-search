import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assetFilter'
})
export class AssetFilterPipe implements PipeTransform {
  transform(assets: any[], searchText: string): any[] {
    if (!assets || !searchText) {
      return assets; 
    }
    searchText = searchText.toLowerCase();

    return assets.filter(asset =>
      asset.name.toLowerCase().includes(searchText) ||
      asset.description.toLowerCase().includes(searchText) ||
      asset.status.toLowerCase().includes(searchText) ||
      asset.capacity.toLowerCase().includes(searchText) ||
      asset.portolio.toLowerCase().includes(searchText)
    );
  }

}

import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { Icon, Style } from 'ol/style.js'

export class IconPointer {
  iconFeature
  
  constructor(coordX: number, coordY: number) {
    this.iconFeature = new Feature({
      geometry: new Point([coordX, coordY]),
      name: 'Null Island',
      population: 4000,
      rainfall: 500
    })

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0, 0],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        width: 50,
        src: 'src/assets/icons/point.svg'
      })
    })

    this.iconFeature.setStyle(iconStyle)
  }
}

import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { Icon, Style } from 'ol/style.js'
import imgUrl from '@/assets/icons/point.svg'
import VectorSource from 'ol/source/Vector.js'
import { Vector as VectorLayer } from 'ol/layer.js'

export class IconPointer {
  iconFeature
  layer

  constructor(coordX: number, coordY: number) {
    this.iconFeature = new Feature({
      geometry: new Point([coordX, coordY]),
      name: 'Null Island',
      population: 4000,
      rainfall: 500
    })

    const iconStyle = new Style({
      image: new Icon({
        anchor: [450, 850],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        width: 50,
        src: imgUrl
      })
    })

    this.iconFeature.setStyle(iconStyle)

    this.layer = this.createNewIconLayer(this.iconFeature)
  }

  private createNewIconLayer(pointer: Feature) {
    const vectorSource = new VectorSource({
      features: [pointer]
    })
    return new VectorLayer({
      source: vectorSource
    })
  }
}

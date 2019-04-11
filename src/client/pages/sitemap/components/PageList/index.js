import React from 'react';
import Grid from '@material-ui/core/Grid';
import { getComponents } from 'boringbits/react';
import iconUrl from '../icon.png';
import iconSm from '../icon-sm.png';

const {decorators} = getComponents();
const {
  withStyles,
} = decorators;

const iconWidth = 15;
const iconHeight = 20;

@withStyles(theme => ({
  container: {
    marginLeft:  20,
    marginTop: 40,
  },
  item: {
    cursor: 'pointer',
    display: 'block',
    verticalAlign: 'middle',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  icon: {
    marginTop: 6,
    display: 'inline-block',
    width: iconWidth+ 'px',
    height: iconHeight+ 'px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${iconWidth}px ${iconHeight}px`,
    marginRight: 5,
  },
  name: {
    display: 'inline-block',
    fontSize: '20px',
  }
}))
class PageList extends React.Component {

  onDrag(page, event) {
    var img = new Image();
    img.src = iconSm;
    img.style.width = 40
    event.dataTransfer.setDragImage(img, 0, 0);
    window.pageDrag = page;
  }

  onDragEnd(event) {
    window.pageDrag = null;
  }

  render() {

    return (
      <Grid className={this.props.classes.container} >
        {
          this.props.pages.items.map(item => (
            <div key={item.sys.id} className={this.props.classes.item} draggable={true} onDragStart={this.onDrag.bind(this, item)} onDragEnd={this.onDragEnd.bind(this)}>
              <span className={this.props.classes.name}><div className={this.props.classes.icon} style={{backgroundImage: `url(${iconUrl})`}}></div> {item.fields.alias}</span>
            </div>
          ))
        }
      </Grid>
    )
  }
}

export default PageList;
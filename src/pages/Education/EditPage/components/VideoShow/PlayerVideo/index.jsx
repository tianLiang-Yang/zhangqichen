import React from 'react';
import styles from './index.less';
import {Modal} from "antd";

class PlayerVideo extends React.Component {
  // eslint-disable-next-line no-useless-constructor
 constructor(props){
   super(props);
 }

  render() {
    const { videoUrl } = this.props;
    return (
      <div className={styles.main}>
        <div >
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video width="640" height="480" controls="controls" autoPlay="autoplay">
            <source src={ videoUrl }/>
            <object data={ videoUrl }
                    width="640"
                    height="480">
              <embed width="640" height="480" src="/i/movie.swf"/>
            </object>
          </video>
        </div>
      </div>
    );
  }
}

export default  PlayerVideo;
